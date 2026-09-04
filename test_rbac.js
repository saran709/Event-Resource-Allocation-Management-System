// =========================================================================
// APEX RBAC & USER LIMITATIONS TEST SUITE
// Automated verification of hierarchical RBAC, data isolation, and API security
// =========================================================================

const http = require('http');

function makeRequest(method, path, headers = {}, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runRbacTests() {
  console.log('\n===============================================================');
  console.log('🛡️ APEX RBAC & AUTHORIZATION VERIFICATION SUITE');
  console.log('===============================================================\n');

  // Define User Credentials
  const superAdminAuth = { 'Authorization': 'Bearer usr1', 'x-user-id': 'usr1', 'x-role': 'SUPER_ADMIN' };
  const eventAdminAuth = { 'Authorization': 'Bearer usr2', 'x-user-id': 'usr2', 'x-role': 'EVENT_ADMIN' };
  const organizerAuth  = { 'Authorization': 'Bearer usr3', 'x-user-id': 'usr3', 'x-role': 'ORGANIZER' };
  const staffAuth      = { 'Authorization': 'Bearer usr4', 'x-user-id': 'usr4', 'x-role': 'STAFF' };

  // -------------------------------------------------------------------------
  // 1. SUPER ADMIN (LEVEL 4) PRIVILEGES
  // -------------------------------------------------------------------------
  console.log('▶ [1] Testing SUPER ADMIN (Sarah Miller - usr1) Capabilities:');
  
  // 1.1 Super Admin can see all events
  const saEvents = await makeRequest('GET', '/api/events', superAdminAuth);
  assert(saEvents.status === 200 && Array.isArray(saEvents.data) && saEvents.data.length === 5, 
    `Super Admin sees all events across system (count: ${saEvents.data?.length})`);

  // 1.2 Super Admin can view all users
  const saUsers = await makeRequest('GET', '/api/users', superAdminAuth);
  assert(saUsers.status === 200 && Array.isArray(saUsers.data) && saUsers.data.length >= 5,
    `Super Admin can retrieve all system users (count: ${saUsers.data?.length})`);

  // 1.3 Super Admin can create an Event Admin
  const newEventAdmin = {
    name: 'Rachel Zane',
    email: `rachel.admin.${Date.now()}@apexevents.com`,
    password: 'password123',
    role: 'EVENT_ADMIN',
    department: 'Regional Operations'
  };
  const createEaRes = await makeRequest('POST', '/api/users', superAdminAuth, newEventAdmin);
  assert(createEaRes.status === 201 && createEaRes.data?.role === 'EVENT_ADMIN',
    `Super Admin successfully created Event Admin: "${newEventAdmin.name}"`);

  // 1.4 Super Admin can view Audit Logs
  const saAudit = await makeRequest('GET', '/api/audit', superAdminAuth);
  assert(saAudit.status === 200 && Array.isArray(saAudit.data),
    `Super Admin can view system-wide audit stream (count: ${saAudit.data?.length})`);

  // 1.5 Super Admin can access AWS Cloud management
  const saAws = await makeRequest('GET', '/api/aws/status', superAdminAuth);
  assert(saAws.status === 200 && saAws.data?.status === 'HEALTHY', `Super Admin can access AWS Cloud Center`);

  // -------------------------------------------------------------------------
  // 2. EVENT ADMIN (LEVEL 3) PERMISSIONS & LIMITATIONS
  // -------------------------------------------------------------------------
  console.log('\n▶ [2] Testing EVENT ADMIN (Marcus Vance - usr2) Scope & Guardrails:');

  // 2.1 Event Admin sees ONLY managed events
  const eaEvents = await makeRequest('GET', '/api/events', eventAdminAuth);
  assert(eaEvents.status === 200 && Array.isArray(eaEvents.data) && eaEvents.data.length === 3,
    `Event Admin sees strictly their 3 managed events [ev1, ev2, ev5] (count: ${eaEvents.data?.length})`);

  // 2.2 Event Admin CANNOT access an event outside their scope
  const forbiddenEvent = await makeRequest('GET', '/api/events/ev3', eventAdminAuth);
  assert(forbiddenEvent.status === 403, 
    `Event Admin blocked with 403 when requesting outside event ev3 (status: ${forbiddenEvent.status})`);

  // 2.3 Event Admin CAN create an Organizer
  const newOrganizer = {
    name: 'Harvey Specter',
    email: `harvey.org.${Date.now()}@apexevents.com`,
    password: 'password123',
    role: 'ORGANIZER',
    department: 'VIP Coordination'
  };
  const createOrgRes = await makeRequest('POST', '/api/users', eventAdminAuth, newOrganizer);
  assert(createOrgRes.status === 201 && createOrgRes.data?.role === 'ORGANIZER',
    `Event Admin can create Organizer within scope ("${newOrganizer.name}")`);

  // 2.4 Event Admin CANNOT create a Super Admin (Level Escalation Blocked)
  const illegalSa = {
    name: 'Rogue Super Admin',
    email: `rogue.${Date.now()}@apexevents.com`,
    password: 'password123',
    role: 'SUPER_ADMIN'
  };
  const illegalSaRes = await makeRequest('POST', '/api/users', eventAdminAuth, illegalSa);
  assert(illegalSaRes.status === 403,
    `Event Admin blocked with 403 when attempting to create SUPER_ADMIN (status: ${illegalSaRes.status})`);

  // 2.5 Event Admin CANNOT access AWS Cloud infrastructure
  const eaAws = await makeRequest('GET', '/api/aws/status', eventAdminAuth);
  assert(eaAws.status === 403, `Event Admin blocked with 403 from AWS Cloud Center (status: ${eaAws.status})`);

  // -------------------------------------------------------------------------
  // 3. ORGANIZER (LEVEL 2) PERMISSIONS & LIMITATIONS
  // -------------------------------------------------------------------------
  console.log('\n▶ [3] Testing ORGANIZER (Elena Rostova - usr3) Scope & Guardrails:');

  // 3.1 Organizer sees ONLY their assigned event (ev1)
  const orgEvents = await makeRequest('GET', '/api/events', organizerAuth);
  assert(orgEvents.status === 200 && Array.isArray(orgEvents.data) && orgEvents.data.length === 1 && orgEvents.data[0].id === 'ev1',
    `Organizer sees strictly their single assigned event ev1 (count: ${orgEvents.data?.length})`);

  // 3.2 Organizer CANNOT access another event (ev2)
  const orgEventForbidden = await makeRequest('GET', '/api/events/ev2', organizerAuth);
  assert(orgEventForbidden.status === 403,
    `Organizer blocked with 403 when accessing unassigned event ev2 (status: ${orgEventForbidden.status})`);

  // 3.3 Organizer CANNOT create a new Event
  const illegalEvent = {
    title: 'Unauthorized Festival',
    venue: 'Innovation Arena',
    startDate: '2026-10-01',
    endDate: '2026-10-03',
    budget: 5000
  };
  const illegalEvRes = await makeRequest('POST', '/api/events', organizerAuth, illegalEvent);
  assert(illegalEvRes.status === 403,
    `Organizer blocked with 403 when attempting to create an event (status: ${illegalEvRes.status})`);

  // 3.4 Organizer CANNOT create Event Admins or Super Admins
  const illegalUser = {
    name: 'Hacked User',
    email: `hacked.${Date.now()}@apexevents.com`,
    password: 'password123',
    role: 'EVENT_ADMIN'
  };
  const illegalUserRes = await makeRequest('POST', '/api/users', organizerAuth, illegalUser);
  assert(illegalUserRes.status === 403,
    `Organizer blocked with 403 from User Management API (status: ${illegalUserRes.status})`);

  // 3.5 Organizer CAN create a task for their assigned event
  const newTask = {
    eventId: 'ev1',
    title: 'Inspect VIP Audio Monitor',
    description: 'Check wireless frequency bands',
    priority: 'High',
    deadline: '2026-09-15',
    staffId: 'st2'
  };
  const taskRes = await makeRequest('POST', '/api/tasks', organizerAuth, newTask);
  assert(taskRes.status === 201 && taskRes.data?.title === newTask.title,
    `Organizer can create task in their assigned event ev1 (task ID: ${taskRes.data?.id})`);

  // -------------------------------------------------------------------------
  // 4. STAFF (LEVEL 1) PERMISSIONS & LIMITATIONS
  // -------------------------------------------------------------------------
  console.log('\n▶ [4] Testing STAFF (Bob Miller - usr4) Scope & Guardrails:');

  // 4.1 Staff sees ONLY their assigned event
  const staffEvents = await makeRequest('GET', '/api/events', staffAuth);
  assert(staffEvents.status === 200 && Array.isArray(staffEvents.data) && staffEvents.data.length === 1 && staffEvents.data[0].id === 'ev1',
    `Staff sees strictly their assigned event ev1 (count: ${staffEvents.data?.length})`);

  // 4.2 Staff CANNOT edit event details or budget
  const editEventRes = await makeRequest('PUT', '/api/events/ev1', staffAuth, { budget: 999999 });
  assert(editEventRes.status === 403,
    `Staff blocked with 403 from modifying event details or budget (status: ${editEventRes.status})`);

  // 4.3 Staff CANNOT delete an event
  const deleteEvRes = await makeRequest('DELETE', '/api/events/ev1', staffAuth);
  assert(deleteEvRes.status === 403,
    `Staff blocked with 403 from deleting events (status: ${deleteEvRes.status})`);

  // 4.4 Staff CANNOT assign other staff or themselves
  const staffAssignRes = await makeRequest('POST', '/api/staff/assign', staffAuth, {
    staffId: 'st2',
    eventId: 'ev2',
    role: 'Lead Sound Engineer'
  });
  assert(staffAssignRes.status === 403,
    `Staff blocked with 403 from assigning staff members (status: ${staffAssignRes.status})`);

  // 4.5 Staff CAN update their own task status
  const updateTaskRes = await makeRequest('PUT', '/api/tasks/tk2', staffAuth, {
    status: 'In Progress',
    completionNotes: 'Checked cables and verified audio signal'
  });
  assert(updateTaskRes.status === 200 && updateTaskRes.data?.status === 'In Progress',
    `Staff can successfully update their own assigned task (tk2) status to "In Progress"`);

  // 4.6 Staff CANNOT update other staff members' tasks
  const illegalTaskUpdate = await makeRequest('PUT', '/api/tasks/tk1', staffAuth, {
    status: 'Completed'
  });
  assert(illegalTaskUpdate.status === 403,
    `Staff blocked with 403 from modifying other staff tasks (status: ${illegalTaskUpdate.status})`);

  // 4.7 Staff CANNOT access Audit Logs
  const staffAuditRes = await makeRequest('GET', '/api/audit', staffAuth);
  assert(staffAuditRes.status === 403,
    `Staff blocked with 403 from Audit Logs (status: ${staffAuditRes.status})`);

  // -------------------------------------------------------------------------
  // 5. SENSITIVE AUDIT LOGGING VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n▶ [5] Verifying Audit Trail Generation:');
  const auditVerification = await makeRequest('GET', '/api/audit', superAdminAuth);
  const auditActions = auditVerification.data.map(a => a.action);
  assert(auditActions.includes('User Created'), `Audit log recorded "User Created" action`);
  assert(auditActions.includes('Task Created'), `Audit log recorded "Task Created" action`);

  console.log('\n===============================================================');
  console.log(`📊 TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('===============================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL RBAC AUTHORIZATION & SECURITY TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME RBAC TESTS FAILED!\n');
    process.exit(1);
  }
}

runRbacTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
