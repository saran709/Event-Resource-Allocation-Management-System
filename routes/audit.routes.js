const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

// GET audit logs (Super Admin and Event Admin only)
router.get('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  try {
    const logs = db.read('audit');
    const role = req.user.role;

    if (role === ROLES.EVENT_ADMIN) {
      // Event Admin only sees audit entries related to their managed events or actions
      const managedIds = req.user.managedEventIds || [];
      const scoped = logs.filter(l => 
        l.actorId === req.user.id || 
        managedIds.includes(l.entityId) ||
        (l.details && managedIds.some(id => l.details.includes(id)))
      );
      return res.json(scoped.reverse());
    }

    // Super Admin gets complete forensic audit stream
    res.json(logs.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit log', message: err.message });
  }
});

// POST new audit event
router.post('/', (req, res) => {
  const { actor, role, category, action, details, severity, entity, entityId } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action field is required' });
  }

  const newLog = db.insert('audit', {
    actor: actor || req.user?.name || 'System User',
    actorId: req.user?.id || 'sys',
    role: role || req.user?.role || 'STAFF',
    category: category || 'Operations',
    action,
    entity: entity || 'General',
    entityId: entityId || '',
    details: details || '',
    severity: severity || 'Info',
    ip: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newLog);
});

module.exports = router;
