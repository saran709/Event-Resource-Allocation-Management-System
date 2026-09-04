const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole, recordAudit } = require('../middleware/auth');

router.use(authenticate);

// GET all tasks (Scoped by role)
router.get('/', (req, res) => {
  try {
    const tasks = db.read('tasks');
    const staff = db.read('staff');
    const events = db.read('events');
    const role = req.user.role;

    let filteredTasks = tasks;

    if (role === ROLES.EVENT_ADMIN) {
      const managedEventIds = req.user.managedEventIds || [];
      filteredTasks = tasks.filter(t => managedEventIds.includes(t.eventId));
    } else if (role === ROLES.ORGANIZER) {
      const assignedEventId = req.user.assignedEventId;
      filteredTasks = tasks.filter(t => t.eventId === assignedEventId || t.organizerId === req.user.id);
    } else if (role === ROLES.STAFF) {
      const staffId = req.user.staffId;
      filteredTasks = tasks.filter(t => t.staffId === staffId || t.assignedStaffId === staffId || t.assignedUserId === req.user.id);
    }

    const populated = filteredTasks.map(t => ({
      ...t,
      staff: staff.find(s => s.id === t.staffId || s.id === t.assignedStaffId),
      event: events.find(e => e.id === t.eventId)
    }));

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tasks', message: err.message });
  }
});

// GET single task
router.get('/:id', (req, res) => {
  const task = db.getById('tasks', req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const role = req.user.role;
  if (role === ROLES.STAFF) {
    if (task.staffId !== req.user.staffId && task.assignedStaffId !== req.user.staffId && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ error: '403 Forbidden: Cannot view tasks assigned to other staff members.' });
    }
  }

  res.json(task);
});

// POST create task (Super Admin, Event Admin, Organizer)
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN, ROLES.ORGANIZER), (req, res) => {
  const { eventId, staffId, title, description, deadline, priority, status } = req.body;

  if (!eventId || !title) {
    return res.status(400).json({ error: 'Missing eventId or title' });
  }

  const event = db.getById('events', eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Scope check for Organizer
  if (req.user.role === ROLES.ORGANIZER) {
    if (event.organizerId !== req.user.id && req.user.assignedEventId !== eventId) {
      return res.status(403).json({ error: '403 Forbidden: Cannot create tasks for unassigned events.' });
    }
  }

  const newTask = db.insert('tasks', {
    eventId,
    staffId: staffId || 'st1',
    assignedStaffId: staffId || 'st1',
    organizerId: req.user.id,
    title,
    description: description || '',
    deadline: deadline || new Date().toISOString().split('T')[0],
    priority: priority || 'Medium',
    status: status || 'Pending',
    completionNotes: '',
    comments: [],
    attachments: [],
    createdAt: new Date().toISOString()
  });

  recordAudit(req, {
    action: 'Task Created',
    entity: 'Task',
    entityId: newTask.id,
    details: `Task '${newTask.title}' assigned to staff for event ${eventId}.`,
    severity: 'Info'
  });

  res.status(201).json(newTask);
});

// PUT update task (Role-aware update logic)
router.put('/:id', (req, res) => {
  const task = db.getById('tasks', req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const role = req.user.role;

  // Staff can ONLY update their own task's status, completion notes, comments, and attachments
  if (role === ROLES.STAFF) {
    const isOwner = task.staffId === req.user.staffId || task.assignedStaffId === req.user.staffId || task.assignedUserId === req.user.id;
    if (!isOwner) {
      return res.status(403).json({ error: '403 Forbidden: Staff can only update their own assigned tasks.' });
    }

    const allowedUpdates = {};
    if (req.body.status) allowedUpdates.status = req.body.status;
    if (req.body.completionNotes !== undefined) allowedUpdates.completionNotes = req.body.completionNotes;
    if (req.body.comments) allowedUpdates.comments = req.body.comments;
    if (req.body.attachments) allowedUpdates.attachments = req.body.attachments;

    const updated = db.update('tasks', req.params.id, allowedUpdates);
    return res.json(updated);
  }

  // Super Admin, Event Admin, Organizer can update all task parameters
  const updated = db.update('tasks', req.params.id, req.body);

  recordAudit(req, {
    action: 'Task Updated',
    entity: 'Task',
    entityId: req.params.id,
    details: `Task '${updated.title}' updated with status ${updated.status}.`,
    severity: 'Info'
  });

  res.json(updated);
});

// DELETE task (Super Admin, Event Admin, Organizer)
router.delete('/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN, ROLES.ORGANIZER), (req, res) => {
  if (db.delete('tasks', req.params.id)) {
    recordAudit(req, {
      action: 'Task Deleted',
      entity: 'Task',
      entityId: req.params.id,
      details: 'Task removed.',
      severity: 'Warning'
    });
    res.json({ message: 'Task deleted' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

module.exports = router;
