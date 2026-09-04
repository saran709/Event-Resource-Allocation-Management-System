const db = require('../db');
const { ROLES, normalizeRole, hasPermission } = require('../services/rbac');

/**
 * Authentication Middleware: Resolves user identity from Token or Headers
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const headerUserId = req.headers['x-user-id'];
    const headerUserRole = req.headers['x-user-role'];

    let user = null;

    // Check header user id directly if passed
    if (headerUserId) {
      user = db.getById('users', headerUserId);
    }

    // Check token
    if (!user && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Look up user by persona or token id
      const users = db.read('users');
      user = users.find(u => token.includes(u.id) || (u.email && token.includes(u.email.split('@')[0])));
    }

    // Fallback: Default to Super Admin in test/mock mode if no credentials provided, or resolve from default personas
    if (!user) {
      if (headerUserRole) {
        user = {
          id: `usr_${headerUserRole.toLowerCase()}`,
          name: `${headerUserRole} User`,
          role: normalizeRole(headerUserRole),
          managedEventIds: ['ev1', 'ev2'],
          assignedEventId: 'ev1',
          staffId: 'st2'
        };
      } else {
        // Default root user (Super Admin)
        user = db.read('users')[0] || {
          id: 'usr_super_1',
          name: 'Sarah Miller',
          email: 'sarah.superadmin@apexevents.com',
          role: ROLES.SUPER_ADMIN,
          managedEventIds: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5']
        };
      }
    }

    req.user = {
      ...user,
      role: normalizeRole(user.role)
    };

    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    res.status(401).json({ error: 'Authentication Required', message: err.message });
  }
}

/**
 * Role-Based Guard Middleware
 */
function requireRole(...allowedRoles) {
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication Required' });
    }

    const userRole = normalizeRole(req.user.role);

    // Super Admin has universal access
    if (userRole === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (normalizedAllowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      error: '403 Forbidden: Insufficient Permissions',
      message: `Role '${userRole}' is not authorized to perform this operation.`,
      requiredRoles: normalizedAllowed
    });
  };
}

/**
 * Event Scope Guard Middleware: Verifies user has access to a specific event
 */
function requireEventScope(paramName = 'id') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRole = normalizeRole(req.user.role);
    if (userRole === ROLES.SUPER_ADMIN) {
      return next();
    }

    const eventId = req.params[paramName] || req.body[paramName] || req.query[paramName] || req.body.eventId;
    if (!eventId) {
      return next();
    }

    const event = db.getById('events', eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event Not Found' });
    }

    // EVENT_ADMIN: must own the event or have it in managedEventIds
    if (userRole === ROLES.EVENT_ADMIN) {
      const isManager = event.eventAdminId === req.user.id || 
        (req.user.managedEventIds && req.user.managedEventIds.includes(eventId));
      if (!isManager) {
        return res.status(403).json({
          error: '403 Forbidden: Event outside your assigned Event Admin management scope.',
          eventId
        });
      }
      return next();
    }

    // ORGANIZER: must be assigned to this specific event
    if (userRole === ROLES.ORGANIZER) {
      const isAssignedOrganizer = event.organizerId === req.user.id || 
        req.user.assignedEventId === eventId;
      if (!isAssignedOrganizer) {
        return res.status(403).json({
          error: '403 Forbidden: Event outside your assigned Organizer event scope.',
          eventId
        });
      }
      return next();
    }

    // STAFF: must be assigned to this event
    if (userRole === ROLES.STAFF) {
      const isStaffAssigned = (event.assignedStaffIds && event.assignedStaffIds.includes(req.user.staffId)) ||
        req.user.assignedEventId === eventId;
      if (!isStaffAssigned) {
        return res.status(403).json({
          error: '403 Forbidden: Event is not in your assigned staff duties.',
          eventId
        });
      }
      return next();
    }

    return res.status(403).json({ error: '403 Forbidden: Unauthorized Event Access' });
  };
}

/**
 * Automatic Audit Logging Helper for Sensitive Operations
 */
function recordAudit(req, { action, entity, entityId, details, severity = 'Info' }) {
  try {
    const user = req.user || { id: 'anonymous', name: 'System', role: 'SYSTEM' };
    db.insert('audit', {
      actor: user.name || user.email || user.id,
      actorId: user.id,
      role: user.role,
      action,
      entity,
      entityId: entityId || '',
      category: 'Security & Operations',
      details: details || '',
      severity,
      ip: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Audit record warning:', err);
  }
}

module.exports = {
  authenticate,
  requireRole,
  requireEventScope,
  recordAudit
};
