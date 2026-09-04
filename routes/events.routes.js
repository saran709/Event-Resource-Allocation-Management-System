const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES, normalizeRole } = require('../services/rbac');
const { getConflictsReport } = require('../services/conflictEngine');
const { calculateEventCosts } = require('../services/budgetEngine');
const { authenticate, requireRole, requireEventScope, recordAudit } = require('../middleware/auth');

// Optional authentication for GET /api/events so public landing page can also read public list
router.use((req, res, next) => {
  if (req.path === '/' && req.method === 'GET' && !req.headers['authorization'] && !req.headers['x-user-role'] && !req.headers['x-user-id']) {
    return next();
  }
  authenticate(req, res, next);
});

function computeDynamicEventStatus(ev) {
  if (ev.status === 'Cancelled' || ev.status === 'Draft') return ev.status;
  const now = new Date();
  const startDateStr = ev.startDate || new Date().toISOString().split('T')[0];
  const endDateStr = ev.endDate || startDateStr;
  const startTimeStr = ev.startTime || '00:00';
  const endTimeStr = ev.endTime || '23:59';
  
  // Format to standard ISO
  const start = new Date(`${startDateStr}T${startTimeStr.includes(':') ? (startTimeStr.length === 5 ? startTimeStr + ':00' : startTimeStr) : '00:00:00'}`);
  const end = new Date(`${endDateStr}T${endTimeStr.includes(':') ? (endTimeStr.length === 5 ? endTimeStr + ':00' : endTimeStr) : '23:59:59'}`);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    const sDate = new Date(startDateStr);
    const eDate = new Date(endDateStr);
    if (now < sDate) return 'Upcoming';
    if (now >= sDate && now <= eDate) return 'Ongoing';
    return 'Completed';
  }

  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Ongoing';
  return 'Completed';
}

// GET all enriched events (Filtered by user scope)
router.get('/', (req, res) => {
  try {
    const allEvents = db.read('events');
    const conflicts = getConflictsReport();

    // Determine visibility based on caller role
    let visibleEvents = allEvents;
    if (req.user) {
      const role = req.user.role;
      if (role === ROLES.EVENT_ADMIN) {
        visibleEvents = allEvents.filter(ev => 
          ev.eventAdminId === req.user.id || 
          (req.user.managedEventIds && req.user.managedEventIds.includes(ev.id))
        );
      } else if (role === ROLES.ORGANIZER) {
        visibleEvents = allEvents.filter(ev => 
          ev.organizerId === req.user.id || 
          req.user.assignedEventId === ev.id
        );
      } else if (role === ROLES.STAFF) {
        visibleEvents = allEvents.filter(ev => 
          (ev.assignedStaffIds && ev.assignedStaffIds.includes(req.user.staffId)) ||
          req.user.assignedEventId === ev.id
        );
      }
    }

    const enriched = visibleEvents.map(ev => {
      const costData = calculateEventCosts(ev);
      const computedStatus = computeDynamicEventStatus(ev);
      const hasStaffConflict = conflicts.staffConflicts.some(sc => sc.eventA.id === ev.id || sc.eventB.id === ev.id);
      const hasEquipConflict = conflicts.equipmentConflicts.some(ec => ec.involvedEvents.some(ie => ie.id === ev.id));

      return {
        ...ev,
        status: computedStatus,
        durationDays: costData.durationDays,
        costs: {
          staff: costData.breakdown.staff,
          equipment: costData.breakdown.equipment,
          vendor: costData.breakdown.vendor,
          total: costData.totalSpent
        },
        hasConflict: hasStaffConflict || hasEquipConflict,
        conflictsList: [
          ...conflicts.staffConflicts.filter(sc => sc.eventA.id === ev.id || sc.eventB.id === ev.id).map(c => c.message),
          ...conflicts.equipmentConflicts.filter(ec => ec.involvedEvents.some(ie => ie.id === ev.id)).map(c => c.message)
        ],
        milestones: ev.milestones || [
          { time: "08:00", title: "Setup & Equipment Check", status: "Done" },
          { time: "10:00", title: "Registration & Keynote", status: "In Progress" },
          { time: "18:00", title: "Breakdown & Logoff", status: "Pending" }
        ]
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve events', message: err.message });
  }
});

// GET single event by id (Scoped)
router.get('/:id', requireEventScope('id'), (req, res) => {
  const ev = db.getById('events', req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  res.json(ev);
});

// POST new event (Only Super Admin and Event Admin)
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const { title, description, venue, location, category, expectedAttendees, startDate, endDate, startTime, endTime, budget, status, milestones, organizerId } = req.body;
  
  if (!title || !startDate || !endDate || !budget) {
    return res.status(400).json({ error: 'Missing required event fields (title, startDate, endDate, budget)' });
  }

  const newEvent = db.insert('events', {
    title,
    description: description || '',
    venue: venue || 'TBD',
    location: location || 'TBD',
    category: category || 'Conference',
    expectedAttendees: Number(expectedAttendees) || 500,
    startDate,
    endDate,
    startTime: startTime || '09:00 AM',
    endTime: endTime || '06:00 PM',
    budget: Number(budget),
    status: status || 'Confirmed',
    eventAdminId: req.user.role === ROLES.EVENT_ADMIN ? req.user.id : (req.body.eventAdminId || req.user.id),
    organizerId: organizerId || null,
    assignedStaffIds: req.body.assignedStaffIds || [],
    milestones: milestones || [
      { time: "08:00", title: "Setup & Staging", status: "Pending" },
      { time: "10:00", title: "General Session", status: "Pending" },
      { time: "17:00", title: "Teardown", status: "Pending" }
    ]
  });

  recordAudit(req, {
    action: 'Event Created',
    entity: 'Event',
    entityId: newEvent.id,
    details: `Event '${newEvent.title}' created by ${req.user.name} (${req.user.role}).`,
    severity: 'Info'
  });

  res.status(201).json(newEvent);
});

// PUT update event (Role & Scope checks)
router.put('/:id', requireEventScope('id'), (req, res) => {
  const existing = db.getById('events', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  const role = req.user.role;

  // Staff cannot edit events
  if (role === ROLES.STAFF) {
    return res.status(403).json({ error: '403 Forbidden: Staff members cannot edit event records.' });
  }

  // Organizer can only update operational notes / description / milestones
  if (role === ROLES.ORGANIZER) {
    const allowedFields = ['description', 'milestones', 'notes', 'startTime', 'endTime'];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const updated = db.update('events', req.params.id, updates);
    return res.json(updated);
  }

  // Super Admin & Event Admin have full update for their events
  const updated = db.update('events', req.params.id, req.body);

  recordAudit(req, {
    action: 'Event Updated',
    entity: 'Event',
    entityId: req.params.id,
    details: `Event '${updated.title}' updated.`,
    severity: 'Info'
  });

  res.json(updated);
});

// POST assign Organizer to event (Super Admin or Event Admin)
router.post('/:id/assign-organizer', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), requireEventScope('id'), (req, res) => {
  const { organizerId } = req.body;
  if (!organizerId) {
    return res.status(400).json({ error: 'Organizer ID is required' });
  }

  const organizer = db.getById('users', organizerId);
  if (!organizer) {
    return res.status(404).json({ error: 'Organizer user not found' });
  }

  const updatedEvent = db.update('events', req.params.id, {
    organizerId,
    organizer: organizer.name
  });

  // Link event in organizer user record
  db.update('users', organizerId, { assignedEventId: req.params.id });

  recordAudit(req, {
    action: 'Organizer Assigned',
    entity: 'Event',
    entityId: req.params.id,
    details: `Organizer '${organizer.name}' assigned to event '${updatedEvent.title}'.`,
    severity: 'Info'
  });

  res.json({
    success: true,
    message: `Organizer ${organizer.name} assigned to event ${updatedEvent.title}`,
    event: updatedEvent
  });
});

// DELETE event (Super Admin only)
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN), (req, res) => {
  const existing = db.getById('events', req.params.id);
  if (!existing) return res.status(404).json({ error: 'Event not found' });

  db.delete('events', req.params.id);

  recordAudit(req, {
    action: 'Event Deleted',
    entity: 'Event',
    entityId: req.params.id,
    details: `Deleted event '${existing.title}'.`,
    severity: 'Warning'
  });

  res.json({ message: 'Event deleted successfully', id: req.params.id });
});

module.exports = router;
