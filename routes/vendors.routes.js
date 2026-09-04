const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all vendors
router.get('/', (req, res) => {
  const vendors = db.read('vendors');
  const coordinations = db.read('coordinations');
  const events = db.read('events').filter(e => e.status !== 'Cancelled');

  const enriched = vendors.map(v => {
    const vCoords = coordinations.filter(c => c.vendorId === v.id);
    const totalContractValue = vCoords.reduce((sum, c) => sum + c.cost, 0);

    const contractedEvents = vCoords.map(c => {
      const ev = events.find(e => e.id === c.eventId);
      return ev ? {
        id: ev.id,
        title: ev.title,
        dates: `${ev.startDate} to ${ev.endDate}`,
        cost: c.cost,
        service: c.details,
        paymentStatus: c.paymentStatus
      } : null;
    }).filter(Boolean);

    return {
      ...v,
      contractCount: contractedEvents.length,
      totalContractValue,
      rating: v.rating || 4.8,
      contractedEvents
    };
  });

  res.json(enriched);
});

// POST new vendor
router.post('/', (req, res) => {
  const { name, category, contact, email, rating } = req.body;
  if (!name || !category || !email) {
    return res.status(400).json({ error: 'Missing required vendor fields' });
  }

  const created = db.insert('vendors', {
    name,
    category,
    contact: contact || '',
    email,
    rating: Number(rating) || 4.8
  });

  res.status(201).json(created);
});

// PUT update vendor
router.put('/:id', (req, res) => {
  const updated = db.update('vendors', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Vendor not found' });
  res.json(updated);
});

// DELETE vendor
router.delete('/:id', (req, res) => {
  const deleted = db.delete('vendors', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Vendor not found' });

  db.write('coordinations', db.read('coordinations').filter(c => c.vendorId !== req.params.id));
  res.json({ message: 'Vendor removed', id: req.params.id });
});

// --- COORDINATIONS SUB-ROUTES ---
router.get('/coordinations/all', (req, res) => {
  const coordinations = db.read('coordinations');
  const vendors = db.read('vendors');
  const events = db.read('events');

  res.json(coordinations.map(c => ({
    ...c,
    vendor: vendors.find(v => v.id === c.vendorId),
    event: events.find(ev => ev.id === c.eventId)
  })));
});

router.post('/coordinations', (req, res) => {
  const { eventId, vendorId, cost, details, paymentStatus } = req.body;
  if (!eventId || !vendorId || !cost) {
    return res.status(400).json({ error: 'Missing coordination parameters' });
  }

  const ev = db.getById('events', eventId);
  const ve = db.getById('vendors', vendorId);
  if (!ev || !ve) return res.status(404).json({ error: 'Event or Vendor not found' });

  const created = db.insert('coordinations', {
    eventId,
    vendorId,
    cost: Number(cost),
    details: details || 'General Services',
    paymentStatus: paymentStatus || 'Unpaid'
  });

  res.status(201).json(created);
});

router.delete('/coordinations/:id', (req, res) => {
  if (db.delete('coordinations', req.params.id)) {
    res.json({ message: 'Vendor coordination removed' });
  } else {
    res.status(404).json({ error: 'Coordination not found' });
  }
});

module.exports = router;
