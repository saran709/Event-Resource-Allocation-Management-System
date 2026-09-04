const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES, normalizeRole } = require('../services/rbac');
const { authenticate, requireRole, recordAudit } = require('../middleware/auth');

// All user management routes require authentication
router.use(authenticate);

// GET all users (Scoped by role)
router.get('/', (req, res) => {
  try {
    const userRole = req.user.role;

    // Staff and Organizer cannot access user directory management
    if (userRole === ROLES.STAFF || userRole === ROLES.ORGANIZER) {
      return res.status(403).json({
        error: '403 Forbidden',
        message: 'Organizers and Staff are not permitted to access user management.'
      });
    }

    const allUsers = db.read('users');

    let visibleUsers = allUsers;
    if (userRole === ROLES.EVENT_ADMIN) {
      // Event Admin can ONLY see Organizers and Staff under their scope
      visibleUsers = allUsers.filter(u => {
        const uRole = normalizeRole(u.role);
        return uRole === ROLES.ORGANIZER || uRole === ROLES.STAFF || u.id === req.user.id;
      });
    }

    const safeUsers = visibleUsers.map(u => {
      const { password, ...safe } = u;
      return { ...safe, role: normalizeRole(u.role), hasPassword: !!password };
    });

    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
  }
});

// GET single user
router.get('/:id', (req, res) => {
  const user = db.getById('users', req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const targetRole = normalizeRole(user.role);
  const callerRole = req.user.role;

  if (callerRole === ROLES.STAFF && req.user.id !== user.id) {
    return res.status(403).json({ error: '403 Forbidden: Staff cannot view other user profiles.' });
  }

  if (callerRole === ROLES.ORGANIZER && req.user.id !== user.id) {
    return res.status(403).json({ error: '403 Forbidden: Organizers cannot view other user profiles.' });
  }

  if (callerRole === ROLES.EVENT_ADMIN) {
    if (targetRole === ROLES.SUPER_ADMIN || (targetRole === ROLES.EVENT_ADMIN && user.id !== req.user.id)) {
      return res.status(403).json({ error: '403 Forbidden: Event Admins cannot view Super Admin or other Event Admin data.' });
    }
  }

  const { password, ...safe } = user;
  res.json({ ...safe, role: targetRole, hasPassword: !!password });
});

// POST create new user (Hierarchy enforced)
router.post('/', requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN), (req, res) => {
  const { name, email, role, department, status, password, eventAdminId, assignedEventId } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }

  const targetRole = normalizeRole(role);
  const callerRole = req.user.role;

  // Hierarchical creation checks
  if (callerRole === ROLES.EVENT_ADMIN) {
    if (targetRole === ROLES.SUPER_ADMIN || targetRole === ROLES.EVENT_ADMIN) {
      return res.status(403).json({
        error: '403 Forbidden: Event Admins cannot create Super Admins or other Event Admins.',
        allowedRoles: [ROLES.ORGANIZER, ROLES.STAFF]
      });
    }
  }

  const existing = db.read('users').find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = db.insert('users', {
    name,
    email: email.trim().toLowerCase(),
    password: password || 'password123',
    role: targetRole,
    department: department || 'Operations',
    status: status || 'Active',
    eventAdminId: callerRole === ROLES.EVENT_ADMIN ? req.user.id : (eventAdminId || null),
    assignedEventId: assignedEventId || null,
    lastLogin: new Date().toISOString()
  });

  recordAudit(req, {
    action: 'User Created',
    entity: 'User',
    entityId: newUser.id,
    details: `Created user ${newUser.name} with role ${targetRole}.`,
    severity: 'Info'
  });

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

// PUT update user
router.put('/:id', (req, res) => {
  const existing = db.getById('users', req.params.id);
  if (!existing) return res.status(404).json({ error: 'User not found' });

  const targetRole = normalizeRole(existing.role);
  const callerRole = req.user.role;

  // Hierarchical update restrictions
  if (callerRole === ROLES.STAFF || callerRole === ROLES.ORGANIZER) {
    if (req.user.id !== existing.id) {
      return res.status(403).json({ error: '403 Forbidden: You can only update your own credentials.' });
    }
  }

  if (callerRole === ROLES.EVENT_ADMIN) {
    if (targetRole === ROLES.SUPER_ADMIN || (targetRole === ROLES.EVENT_ADMIN && existing.id !== req.user.id)) {
      return res.status(403).json({ error: '403 Forbidden: Event Admins cannot modify Super Admins or other Event Admins.' });
    }
    // Prevent Event Admin from promoting someone to Super Admin or Event Admin
    if (req.body.role) {
      const newRole = normalizeRole(req.body.role);
      if (newRole === ROLES.SUPER_ADMIN || newRole === ROLES.EVENT_ADMIN) {
        return res.status(403).json({ error: '403 Forbidden: Cannot assign higher-level roles.' });
      }
    }
  }

  // Check email uniqueness if modified
  if (req.body.email && req.body.email.toLowerCase() !== existing.email.toLowerCase()) {
    const duplicate = db.read('users').find(
      u => u.email.toLowerCase() === req.body.email.toLowerCase() && u.id !== req.params.id
    );
    if (duplicate) {
      return res.status(409).json({ error: 'Email is already in use by another user' });
    }
  }

  const updates = { ...req.body };
  if (updates.role) updates.role = normalizeRole(updates.role);

  const updated = db.update('users', req.params.id, updates);

  recordAudit(req, {
    action: 'User Updated',
    entity: 'User',
    entityId: updated.id,
    details: `Updated user record for ${updated.name}.`,
    severity: 'Info'
  });

  const { password: _, ...safeUser } = updated;
  res.json(safeUser);
});

// DELETE / Disable user (Super Admin or Event Admin for scoped organizers/staff)
router.delete('/:id', (req, res) => {
  const target = db.getById('users', req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  const targetRole = normalizeRole(target.role);
  const callerRole = req.user.role;

  if (callerRole === ROLES.STAFF || callerRole === ROLES.ORGANIZER) {
    return res.status(403).json({ error: '403 Forbidden: Insufficient permissions to delete users.' });
  }

  if (callerRole === ROLES.EVENT_ADMIN) {
    if (targetRole === ROLES.SUPER_ADMIN || targetRole === ROLES.EVENT_ADMIN) {
      return res.status(403).json({ error: '403 Forbidden: Event Admins cannot delete Super Admins or other Event Admins.' });
    }
  }

  if (targetRole === ROLES.SUPER_ADMIN && callerRole !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({ error: '403 Forbidden: Super Admin accounts cannot be deleted by non-super users.' });
  }

  db.delete('users', req.params.id);

  recordAudit(req, {
    action: 'User Deleted',
    entity: 'User',
    entityId: req.params.id,
    details: `Deleted user ${target.name} (${targetRole}).`,
    severity: 'Warning'
  });

  res.json({ message: 'User deleted successfully', userId: req.params.id });
});

module.exports = router;
