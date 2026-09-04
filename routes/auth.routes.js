const express = require('express');
const router = express.Router();
const db = require('../db');
const { ROLES, normalizeRole } = require('../services/rbac');

const PERSONAS = [
  {
    id: 'sarah',
    userId: 'usr1',
    name: 'Sarah Miller',
    email: 'sarah.admin@apexevents.com',
    role: ROLES.SUPER_ADMIN,
    title: 'Super Administrator',
    department: 'Platform Governance & Executive',
    badgeClass: 'badge-danger',
    managedEventIds: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5'],
    permissions: ['all']
  },
  {
    id: 'marcus',
    userId: 'usr2',
    name: 'Marcus Vance',
    email: 'marcus.eventadmin@apexevents.com',
    role: ROLES.EVENT_ADMIN,
    title: 'Event Administrator',
    department: 'Event Operations Management',
    badgeClass: 'badge-primary',
    managedEventIds: ['ev1', 'ev2', 'ev5'],
    permissions: ['events', 'organizers', 'staff', 'resources', 'budgets']
  },
  {
    id: 'elena',
    userId: 'usr3',
    name: 'Elena Rostova',
    email: 'elena.organizer@apexevents.com',
    role: ROLES.ORGANIZER,
    title: 'Event Organizer',
    department: 'Event Execution & Logistics',
    badgeClass: 'badge-warning',
    eventAdminId: 'usr2',
    assignedEventId: 'ev1',
    permissions: ['assigned_event', 'tasks', 'staff_assignment', 'equipment_request']
  },
  {
    id: 'bob',
    userId: 'usr4',
    name: 'Bob Miller',
    email: 'bob.staff@apexevents.com',
    role: ROLES.STAFF,
    title: 'Operational Field Staff',
    department: 'Technical Crew & Staging',
    badgeClass: 'badge-info',
    staffId: 'st2',
    assignedEventId: 'ev1',
    permissions: ['my_tasks', 'my_schedule', 'profile']
  },
  // Compatibility aliases
  {
    id: 'james',
    userId: 'usr2',
    name: 'James Vance',
    email: 'james.coord@apexevents.com',
    role: ROLES.EVENT_ADMIN,
    title: 'Event Administrator',
    department: 'Production & Coordination',
    badgeClass: 'badge-primary',
    managedEventIds: ['ev1', 'ev2'],
    permissions: ['events', 'organizers', 'staff', 'resources']
  }
];

// List personas
router.get('/personas', (req, res) => {
  res.json(PERSONAS);
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password, personaId } = req.body;

  if (personaId) {
    const found = PERSONAS.find(p => p.id === personaId || p.userId === personaId);
    if (found) {
      // Find or update matching DB user
      const users = db.read('users');
      let dbUser = users.find(u => u.email.toLowerCase() === found.email.toLowerCase() || u.id === found.userId);
      if (!dbUser) {
        dbUser = db.insert('users', {
          id: found.userId,
          name: found.name,
          email: found.email,
          role: found.role,
          department: found.department,
          status: 'Active',
          lastLogin: new Date().toISOString(),
          managedEventIds: found.managedEventIds || [],
          assignedEventId: found.assignedEventId || null,
          staffId: found.staffId || null
        });
      }

      return res.json({
        success: true,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: normalizeRole(dbUser.role),
          title: found.title,
          department: dbUser.department,
          managedEventIds: dbUser.managedEventIds || found.managedEventIds || [],
          assignedEventId: dbUser.assignedEventId || found.assignedEventId || null,
          staffId: dbUser.staffId || found.staffId || null
        },
        token: `apex-token-${dbUser.id}-${Date.now()}`
      });
    }
  }

  if (email) {
    const users = db.read('users');
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      const normRole = normalizeRole(matched.role);
      return res.json({
        success: true,
        user: {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: normRole,
          department: matched.department,
          managedEventIds: matched.managedEventIds || ['ev1', 'ev2'],
          assignedEventId: matched.assignedEventId || 'ev1',
          staffId: matched.staffId || 'st2'
        },
        token: `apex-token-${matched.id}-${Date.now()}`
      });
    }

    // Default fallback user based on email prefix
    const isSuper = email.includes('admin') || email.includes('super');
    const isEventAdmin = email.includes('event') || email.includes('manager') || email.includes('coord');
    const isOrganizer = email.includes('organizer');

    let defaultRole = ROLES.STAFF;
    if (isSuper) defaultRole = ROLES.SUPER_ADMIN;
    else if (isEventAdmin) defaultRole = ROLES.EVENT_ADMIN;
    else if (isOrganizer) defaultRole = ROLES.ORGANIZER;

    const userObj = {
      id: `usr_${Date.now().toString(36)}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: defaultRole,
      department: 'Operations',
      status: 'Active',
      managedEventIds: ['ev1', 'ev2'],
      assignedEventId: 'ev1'
    };

    return res.json({
      success: true,
      user: userObj,
      token: `apex-token-${userObj.id}-${Date.now()}`
    });
  }

  res.status(400).json({ error: 'Invalid login credentials. Provide email or personaId.' });
});

// Update profile & credentials
router.put('/profile', (req, res) => {
  const { personaId, name, email, newPassword } = req.body;
  
  if (personaId) {
    const persona = PERSONAS.find(p => p.id === personaId || p.userId === personaId);
    if (persona) {
      if (name) persona.name = name;
      if (email) persona.email = email;
    }
  }

  res.json({
    success: true,
    message: 'Profile credentials updated successfully',
    updatedAt: new Date().toISOString()
  });
});

module.exports = router;
