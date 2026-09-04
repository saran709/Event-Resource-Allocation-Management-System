// APEX Modular API Integration & Productivity Feature Test Suite
process.env.PORT = 3001;
process.env.NODE_ENV = 'test';
const serverInstance = require('./server');

const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('🚀 STARTING APEX MODULAR SUITE INTEGRATION TESTS');
  console.log('----------------------------------------------------');

  let passedTestsCount = 0;
  let failedTestsCount = 0;

  function assert(condition, message) {
    if (condition) {
      passedTestsCount++;
      console.log(`✅ PASS: ${message}`);
    } else {
      failedTestsCount++;
      console.error(`❌ FAIL: ${message}`);
    }
  }

  try {
    // Wait for server initialization
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 1: Events Modular Endpoint
    console.log('\n[1] Testing GET /api/events ...');
    const resEvents = await fetch(`${BASE_URL}/api/events`);
    assert(resEvents.status === 200, 'Events endpoint returned 200');
    const eventsList = await resEvents.json();
    assert(Array.isArray(eventsList) && eventsList.length >= 3, 'Events loaded with calculated costs and durations');

    // Test 2: Conflicts & Auto-Resolver
    console.log('\n[2] Testing Conflicts Engine & 1-Click Auto-Resolver ...');
    const resConflicts = await fetch(`${BASE_URL}/api/conflicts`);
    assert(resConflicts.status === 200, 'GET /api/conflicts returned 200');
    
    const resAutoResolve = await fetch(`${BASE_URL}/api/conflicts/auto-resolve`, { method: 'POST' });
    assert(resAutoResolve.status === 200, 'POST /api/conflicts/auto-resolve returned 200');
    const autoResolveData = await resAutoResolve.json();
    assert(autoResolveData.success === true, 'Auto-resolver executed cleanly with report');

    // Test 3: Budget & Financial Analytics Engine
    console.log('\n[3] Testing GET /api/budget/analytics ...');
    const resBudget = await fetch(`${BASE_URL}/api/budget/analytics`);
    assert(resBudget.status === 200, 'GET /api/budget/analytics returned 200');
    const budgetData = await resBudget.json();
    assert(budgetData.totalAllocatedBudget > 0, 'Analytics computes total allocated budget');
    assert(budgetData.categoryTotals.staff >= 0, 'Computes staffing category rollup');

    // Test 4: Auth Personas Endpoint
    console.log('\n[4] Testing GET /api/auth/personas ...');
    const resPersonas = await fetch(`${BASE_URL}/api/auth/personas`);
    assert(resPersonas.status === 200, 'GET /api/auth/personas returned 200');
    const personas = await resPersonas.json();
    assert(personas.length === 5, '5 Default personas registered');

    // Test 5: Venues CRUD
    console.log('\n[5] Testing Venues API ...');
    const resVenues = await fetch(`${BASE_URL}/api/venues`);
    assert(resVenues.status === 200, 'GET /api/venues returned 200');
    const createdVenueRes = await fetch(`${BASE_URL}/api/venues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Innovation Arena', capacity: 1000, pricing: 4500 })
    });
    assert(createdVenueRes.status === 201, 'POST /api/venues created venue');
    const venueData = await createdVenueRes.json();
    await fetch(`${BASE_URL}/api/venues/${venueData.id}`, { method: 'DELETE' });

    // Test 6: AWS Cloud Template & Pricing Estimator
    console.log('\n[6] Testing AWS Cloud Center Engine ...');
    const resAwsTemplate = await fetch(`${BASE_URL}/api/aws/template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environment: 'production', dbInstanceType: 'db.t4g.medium', appInstanceCount: 3 })
    });
    assert(resAwsTemplate.status === 200, 'AWS CloudFormation template generated');

    const resAwsCost = await fetch(`${BASE_URL}/api/aws/estimate-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ environment: 'production', dbInstanceType: 'db.t4g.medium', appInstanceCount: 3 })
    });
    assert(resAwsCost.status === 200, 'AWS Cost estimator returned 200');
    const costData = await resAwsCost.json();
    assert(costData.estimatedMonthlyTotal > 0, `Computed AWS monthly estimate: $${costData.estimatedMonthlyTotal}/mo`);

    // Test 7: Data Exports (CSV & JSON)
    console.log('\n[7] Testing CSV & JSON Data Export Engine ...');
    const resCsv = await fetch(`${BASE_URL}/api/export/events/csv`);
    assert(resCsv.status === 200, 'GET /api/export/events/csv returned 200');
    const csvContent = await resCsv.text();
    assert(csvContent.startsWith('ID,Title'), 'Valid CSV header generated');

    const resBackup = await fetch(`${BASE_URL}/api/export/backup/json`);
    assert(resBackup.status === 200, 'GET /api/export/backup/json returned 200');
    const backupJson = await resBackup.json();
    assert(backupJson.events && backupJson.staff && backupJson.equipment, 'Full backup JSON created');

    // Test 8: Notifications Engine
    console.log('\n[8] Testing Notifications API ...');
    const resNotifs = await fetch(`${BASE_URL}/api/notifications`);
    assert(resNotifs.status === 200, 'GET /api/notifications returned 200');
    const notifsList = await resNotifs.json();
    assert(Array.isArray(notifsList), 'Notifications returned as array');

    const resPostNotif = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Schedule Update', message: 'Stage lighting rehearsal scheduled', type: 'info' })
    });
    assert(resPostNotif.status === 201, 'POST /api/notifications created notification');

    // Test 9: Reports Engine
    console.log('\n[9] Testing Executive & Analytical Reports API ...');
    const resRepSummary = await fetch(`${BASE_URL}/api/reports/summary`);
    assert(resRepSummary.status === 200, 'GET /api/reports/summary returned 200');
    const repSummaryData = await resRepSummary.json();
    assert(repSummaryData.success === true && repSummaryData.report.organization, 'Executive summary generated');

    const resRepStaff = await fetch(`${BASE_URL}/api/reports/staff`);
    assert(resRepStaff.status === 200, 'GET /api/reports/staff returned 200');
    const repStaffData = await resRepStaff.json();
    assert(repStaffData.success === true && repStaffData.data.length > 0, 'Staff utilization report generated');

    const resRepEquip = await fetch(`${BASE_URL}/api/reports/equipment`);
    assert(resRepEquip.status === 200, 'GET /api/reports/equipment returned 200');
    const repEquipData = await resRepEquip.json();
    assert(repEquipData.success === true && repEquipData.data.length > 0, 'Equipment report generated');

    const resRepBudget = await fetch(`${BASE_URL}/api/reports/budget`);
    assert(resRepBudget.status === 200, 'GET /api/reports/budget returned 200');
    const repBudgetData = await resRepBudget.json();
    assert(repBudgetData.success === true && repBudgetData.data.totalAllocatedBudget > 0, 'Budget report generated');

    // Test 10: Tasks Lifecycle & Assignment API
    console.log('\n[10] Testing Tasks Lifecycle API ...');
    const resTasks = await fetch(`${BASE_URL}/api/tasks`);
    assert(resTasks.status === 200, 'GET /api/tasks returned 200');
    const tasksList = await resTasks.json();
    assert(Array.isArray(tasksList) && tasksList.length > 0, 'Tasks list loaded with staff & event links');

    const resPostTask = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'ev1',
        staffId: 'st1',
        title: 'Perform Audio Calibration',
        description: 'Sweep 20Hz-20kHz acoustic spectrum',
        priority: 'High',
        status: 'Pending'
      })
    });
    assert(resPostTask.status === 201, 'POST /api/tasks created task');
    const createdTask = await resPostTask.json();

    const resPutTask = await fetch(`${BASE_URL}/api/tasks/${createdTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed', completionNotes: 'Calibration verified at 94dB SPL.' })
    });
    assert(resPutTask.status === 200, 'PUT /api/tasks/:id updated task status');
    await fetch(`${BASE_URL}/api/tasks/${createdTask.id}`, { method: 'DELETE' });

    // Test 11: Users & Role Management API
    console.log('\n[11] Testing Users Management API & Credential Editing ...');
    const resUsers = await fetch(`${BASE_URL}/api/users`);
    assert(resUsers.status === 200, 'GET /api/users returned 200');
    const usersList = await resUsers.json();
    assert(Array.isArray(usersList) && usersList.length >= 5, '5 Default user roles loaded');

    // Test editing user credentials (Mail ID & Password)
    const testUser = usersList[0];
    const resUpdateCreds = await fetch(`${BASE_URL}/api/users/${testUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'sarah.updated@apexevents.com',
        password: 'newsecurepassword123'
      })
    });
    assert(resUpdateCreds.status === 200, 'PUT /api/users/:id updated user credentials (email & pwd)');

    // Test profile credential update
    const resProfileUpdate = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personaId: 'sarah',
        name: 'Sarah Miller',
        email: 'sarah.manager@apexevents.com',
        newPassword: 'freshpassword2026'
      })
    });
    assert(resProfileUpdate.status === 200, 'PUT /api/auth/profile updated session credentials');

    // Test 12: Audit Log & Security Stream API
    console.log('\n[12] Testing Activity Audit Stream API ...');
    const resAuditGet = await fetch(`${BASE_URL}/api/audit`);
    assert(resAuditGet.status === 200, 'GET /api/audit returned 200');
    const auditLogs = await resAuditGet.json();
    assert(Array.isArray(auditLogs) && auditLogs.length > 0, 'Audit stream loaded entries');

    const resAuditPost = await fetch(`${BASE_URL}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: 'Test Runner',
        role: 'Admin',
        category: 'Security',
        action: 'Automated Test Assertion',
        details: 'Verified real-time audit event ingestion.',
        severity: 'Success'
      })
    });
    assert(resAuditPost.status === 201, 'POST /api/audit created new log event');

    // Test 13: Client Landing Page Portal
    console.log('\n[13] Testing Client Landing Page & Portal Routes ...');
    const resClient = await fetch(`${BASE_URL}/client`);
    assert(resClient.status === 200, 'GET /client returned 200 (HTML landing portal)');
    const clientHtml = await resClient.text();
    assert(clientHtml.includes('APEX') && clientHtml.includes('CLIENT EVENTS PORTAL'), 'Client portal HTML rendered properly');

    console.log('\n----------------------------------------------------');
    console.log('📊 MODULAR TEST RESULTS');
    console.log(`Passed: ${passedTestsCount} tests`);
    console.log(`Failed: ${failedTestsCount} tests`);
    console.log('----------------------------------------------------');

    serverInstance.close();
    process.exit(failedTestsCount === 0 ? 0 : 1);

  } catch (err) {
    console.error('🔥 CRITICAL TEST ERROR:', err);
    try { serverInstance.close(); } catch(e) {}
    process.exit(1);
  }
}

runTests();
