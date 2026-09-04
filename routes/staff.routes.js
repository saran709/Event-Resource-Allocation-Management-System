const express = require('express');
const router = express.Router();
const db = require('../db');
const { getConflictsReport } = require('../services/conflictEngine');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole, recordAudit } = require('../middleware/auth');

router.use(authenticate);

// GET all staff
router.get('/', (req, res) => {
  const staff = db.read('staff');
  const assignments = db.read('assignments');
  const events = db.read('events').filter(e => e.status !== 'Cancelled');
  const conflicts = getConflictsReport();

  const enriched = staff.map(s => {
    const sAssignments = assignments.filter(a => a.staffId === s.id);
    const assignedEvents = sAssignments.map(as => {
      const ev = events.find(e => e.id === as.eventId);
      return ev ? { id: ev.id, title: ev.title, dates: `${ev.startDate} to ${ev.endDate}` } : null;
    }).filter(Boolean);

    const isDoubleBooked = conflicts.staffConflicts.some(sc => sc.staffId === s.id);

    return {
      ...s,
      assignedEventsCount: assignedEvents.length,
      assignedEvents,
      isDoubleBooked,
      qrBadgeData: `APEX-STAFF-${s.id}-${s.name.replace(/\s+/g, '')}`
    };
  });

  res.json(enriched);
});

// POST staff member (Super Admin, Event Admin)
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const { name, role, contact, dailyRate } = req.body;
  if (!name || !role || !dailyRate) {
    return res.status(400).json({ error: 'Missing required staff fields' });
  }
  const created = db.insert('staff', {
    name,
    role,
    contact: contact || '',
    dailyRate: Number(dailyRate)
  });

  recordAudit(req, {
    action: 'Staff Member Created',
    entity: 'Staff',
    entityId: created.id,
    details: `Added crew member ${created.name} (${created.role}).`,
    severity: 'Info'
  });

  res.status(201).json(created);
});

// PUT staff member (Super Admin, Event Admin)
router.put('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const updated = db.update('staff', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Staff member not found' });
  res.json(updated);
});

// DELETE staff member (Super Admin, Event Admin)
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const deleted = db.delete('staff', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Staff member not found' });

  // Clean up assignments
  const assignments = db.read('assignments');
  const remaining = assignments.filter(a => a.staffId !== req.params.id);
  db.write('assignments', remaining);

  recordAudit(req, {
    action: 'Staff Member Deleted',
    entity: 'Staff',
    entityId: req.params.id,
    details: 'Staff member removed from system.',
    severity: 'Warning'
  });

  res.json({ message: 'Staff member deleted' });
});

// POST staff assignment (Super Admin, Event Admin, Organizer) - Staff CANNOT assign themselves or others
router.post('/assign', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN, ROLES.ORGANIZER), (req, res) => {
  const { eventId, staffId, role, notes } = req.body;
  if (!eventId || !staffId) {
    return res.status(400).json({ error: 'eventId and staffId are required' });
  }

  const ev = db.getById('events', eventId);
  const st = db.getById('staff', staffId);
  if (!ev || !st) {
    return res.status(404).json({ error: 'Event or Staff member not found' });
  }

  // Check schedule conflict
  const assignments = db.read('assignments');
  const events = db.read('events');
  const existingAssignments = assignments.filter(a => a.staffId === staffId);
  
  const hasConflict = existingAssignments.some(a => {
    const assignedEv = events.find(e => e.id === a.eventId);
    if (!assignedEv || assignedEv.id === eventId) return false;
    // Check overlap
    return !(new Date(ev.endDate) < new Date(assignedEv.startDate) || new Date(ev.startDate) > new Date(assignedEv.endDate));
  });

  // If conflict exists and user is not Super Admin overriding, block
  if (hasConflict && req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(409).json({
      error: 'Resource Conflict Detected',
      message: `Staff member ${st.name} is already assigned to a conflicting event during this timeframe.`,
      staffId,
      conflictingStaff: st.name
    });
  }

  const assignment = db.insert('assignments', {
    eventId,
    staffId,
    role: role || st.role || 'Event Crew',
    notes: notes || ''
  });

  // Update event's assignedStaffIds array
  const currentStaffIds = ev.assignedStaffIds || [];
  if (!currentStaffIds.includes(staffId)) {
    db.update('events', eventId, { assignedStaffIds: [...currentStaffIds, staffId] });
  }

  recordAudit(req, {
    action: 'Staff Assigned',
    entity: 'StaffAssignment',
    entityId: assignment.id,
    details: `Assigned ${st.name} to event ${ev.title} (${eventId}).`,
    severity: hasConflict ? 'Warning' : 'Info'
  });

  res.status(201).json(assignment);
});

module.exports = router;
