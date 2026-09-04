const express = require('express');
const router = express.Router();
const db = require('../db');
const { getConflictsReport } = require('../services/conflictEngine');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole, recordAudit } = require('../middleware/auth');

router.use(authenticate);

// GET all equipment with peak utilization calculation
router.get('/', (req, res) => {
  const equipment = db.read('equipment');
  const allocations = db.read('allocations');
  const events = db.read('events').filter(e => e.status !== 'Cancelled');
  const conflicts = getConflictsReport();

  const enriched = equipment.map(eq => {
    const eqAllocations = allocations.filter(al => al.equipmentId === eq.id);
    if (eqAllocations.length === 0) {
      return {
        ...eq,
        peakAllocated: 0,
        utilizationPercent: 0,
        isOverAllocated: false,
        qrAssetTag: `APEX-EQ-${eq.id}-${eq.category.toUpperCase()}`
      };
    }

    let minDate = null;
    let maxDate = null;
    const items = eqAllocations.map(al => {
      const ev = events.find(e => e.id === al.eventId);
      if (!ev) return null;
      const start = new Date(ev.startDate);
      const end = new Date(ev.endDate);
      if (!minDate || start < minDate) minDate = start;
      if (!maxDate || end > maxDate) maxDate = end;
      return { al, start, end };
    }).filter(Boolean);

    let peak = 0;
    if (items.length > 0 && minDate && maxDate) {
      let curr = new Date(minDate);
      const scanEnd = new Date(maxDate);

      while (curr <= scanEnd) {
        let qty = 0;
        items.forEach(item => {
          if (curr >= item.start && curr <= item.end) qty += item.al.quantity;
        });
        if (qty > peak) peak = qty;
        curr.setDate(curr.getDate() + 1);
      }
    }

    const isOverAllocated = conflicts.equipmentConflicts.some(ec => ec.equipmentId === eq.id);

    return {
      ...eq,
      peakAllocated: peak,
      utilizationPercent: Math.min(100, Math.round((peak / eq.totalStock) * 100)),
      isOverAllocated,
      qrAssetTag: `APEX-EQ-${eq.id}-${eq.category.toUpperCase()}`
    };
  });

  res.json(enriched);
});

// POST new equipment item (Super Admin, Event Admin)
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const { name, category, totalStock, rentalRate } = req.body;
  if (!name || !category || totalStock === undefined || rentalRate === undefined) {
    return res.status(400).json({ error: 'Missing required equipment fields' });
  }

  const created = db.insert('equipment', {
    name,
    category,
    totalStock: Number(totalStock),
    rentalRate: Number(rentalRate)
  });

  recordAudit(req, {
    action: 'Equipment Created',
    entity: 'Equipment',
    entityId: created.id,
    details: `Added hardware unit ${created.name} (${created.totalStock} units).`,
    severity: 'Info'
  });

  res.status(201).json(created);
});

// PUT update equipment item (Super Admin, Event Admin)
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const updated = db.update('equipment', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Equipment not found' });
  res.json(updated);
});

// DELETE equipment item (Super Admin, Event Admin)
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const deleted = db.delete('equipment', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Equipment not found' });

  db.write('allocations', db.read('allocations').filter(al => al.equipmentId !== req.params.id));
  res.json({ message: 'Equipment deleted', id: req.params.id });
});

// --- ALLOCATIONS SUB-ROUTES ---
router.get('/allocations/all', (req, res) => {
  const allocations = db.read('allocations');
  const equipment = db.read('equipment');
  const events = db.read('events');

  res.json(allocations.map(al => ({
    ...al,
    equipment: equipment.find(eq => eq.id === al.equipmentId),
    event: events.find(ev => ev.id === al.eventId)
  })));
});

// POST allocate equipment (Super Admin, Event Admin, Organizer) - Staff CANNOT allocate
router.post('/allocations', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN, ROLES.ORGANIZER), (req, res) => {
  const { eventId, equipmentId, quantity, notes } = req.body;
  if (!eventId || !equipmentId || !quantity) {
    return res.status(400).json({ error: 'Missing allocation parameters' });
  }

  const ev = db.getById('events', eventId);
  const eq = db.getById('equipment', equipmentId);
  if (!ev || !eq) return res.status(404).json({ error: 'Event or Equipment item not found' });

  const numQty = Number(quantity);

  // Check capacity conflict
  const allocations = db.read('allocations');
  const events = db.read('events');
  const existingEqAllocs = allocations.filter(a => a.equipmentId === equipmentId);

  let currentOverlapSum = 0;
  existingEqAllocs.forEach(a => {
    const otherEv = events.find(e => e.id === a.eventId);
    if (!otherEv || otherEv.id === eventId) return;
    const isOverlap = !(new Date(ev.endDate) < new Date(otherEv.startDate) || new Date(ev.startDate) > new Date(otherEv.endDate));
    if (isOverlap) {
      currentOverlapSum += Number(a.quantity);
    }
  });

  if (currentOverlapSum + numQty > eq.totalStock && req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(409).json({
      error: 'Resource Conflict Detected',
      message: `Allocating ${numQty} units of '${eq.name}' exceeds warehouse inventory (${eq.totalStock} available, ${currentOverlapSum} currently reserved).`,
      equipmentId
    });
  }

  const created = db.insert('allocations', {
    eventId,
    equipmentId,
    quantity: numQty,
    notes: notes || ''
  });

  recordAudit(req, {
    action: 'Equipment Allocated',
    entity: 'Allocation',
    entityId: created.id,
    details: `Allocated ${numQty}x ${eq.name} to event ${ev.title}.`,
    severity: 'Info'
  });

  res.status(201).json(created);
});

router.delete('/allocations/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN, ROLES.ORGANIZER), (req, res) => {
  if (db.delete('allocations', req.params.id)) {
    res.json({ message: 'Allocation removed' });
  } else {
    res.status(404).json({ error: 'Allocation not found' });
  }
});

module.exports = router;
