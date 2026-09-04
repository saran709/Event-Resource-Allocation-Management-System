const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole, recordAudit } = require('../middleware/auth');

// GET all venues (Public / Authenticated)
router.get('/', (req, res) => {
  const venues = db.read('venues');
  const events = db.read('events').filter(e => e.status !== 'Cancelled');

  const enriched = venues.map(v => {
    const bookedEvents = events.filter(e => e.venue && e.venue.toLowerCase() === v.name.toLowerCase());
    return {
      ...v,
      totalBookings: bookedEvents.length,
      bookedEvents: bookedEvents.map(e => ({ id: e.id, title: e.title, dates: `${e.startDate} to ${e.endDate}` }))
    };
  });

  res.json(enriched);
});

// POST new venue (Super Admin, Event Admin)
router.post('/', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const { name, capacity, amenities, pricing } = req.body;
  if (!name || !capacity || !pricing) {
    return res.status(400).json({ error: 'Missing required venue fields' });
  }

  const created = db.insert('venues', {
    name,
    capacity: Number(capacity),
    amenities: amenities || 'Standard AV, Tables, Chairs',
    pricing: Number(pricing)
  });

  recordAudit(req, {
    action: 'Venue Created',
    entity: 'Venue',
    entityId: created.id,
    details: `Added venue '${created.name}' with capacity ${created.capacity}.`,
    severity: 'Info'
  });

  res.status(201).json(created);
});

// PUT update venue (Super Admin, Event Admin)
router.put('/:id', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const updated = db.update('venues', req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Venue not found' });
  res.json(updated);
});

// DELETE venue (Super Admin only)
router.delete('/:id', authenticate, requireRole(ROLES.SUPER_ADMIN), (req, res) => {
  const deleted = db.delete('venues', req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Venue not found' });
  res.json({ message: 'Venue deleted', id: req.params.id });
});

module.exports = router;
