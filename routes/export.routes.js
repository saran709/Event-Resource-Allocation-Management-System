const express = require('express');
const router = express.Router();
const db = require('../db');
const { getOverallFinancialAnalytics } = require('../services/budgetEngine');

// GET Export Events Manifest as CSV
router.get('/events/csv', (req, res) => {
  const events = db.read('events');
  let csv = 'ID,Title,Venue,StartDate,EndDate,Budget,Status\n';
  events.forEach(e => {
    csv += `"${e.id}","${e.title.replace(/"/g, '""')}","${e.venue}","${e.startDate}","${e.endDate}",${e.budget},"${e.status}"\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.attachment('apex-events-manifest.csv');
  res.send(csv);
});

// GET Export Staff Roster as CSV
router.get('/staff/csv', (req, res) => {
  const staff = db.read('staff');
  let csv = 'ID,Name,Role,Contact,DailyRate\n';
  staff.forEach(s => {
    csv += `"${s.id}","${s.name.replace(/"/g, '""')}","${s.role}","${s.contact}",${s.dailyRate}\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.attachment('apex-staff-roster.csv');
  res.send(csv);
});

// GET Export Equipment Inventory as CSV
router.get('/equipment/csv', (req, res) => {
  const equipment = db.read('equipment');
  let csv = 'ID,Name,Category,TotalStock,RentalRate\n';
  equipment.forEach(eq => {
    csv += `"${eq.id}","${eq.name.replace(/"/g, '""')}","${eq.category}",${eq.totalStock},${eq.rentalRate}\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.attachment('apex-equipment-inventory.csv');
  res.send(csv);
});

// GET Export Complete Financial Summary as CSV
router.get('/finance/csv', (req, res) => {
  const analytics = getOverallFinancialAnalytics();
  let csv = 'EventID,Title,DurationDays,AllocatedBudget,TotalSpent,Variance,StaffCost,EquipmentCost,VendorCost,Status\n';
  analytics.eventReports.forEach(r => {
    csv += `"${r.eventId}","${r.title.replace(/"/g, '""')}",${r.durationDays},${r.budget},${r.totalSpent},${r.variance},${r.breakdown.staff},${r.breakdown.equipment},${r.breakdown.vendor},"${r.status}"\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.attachment('apex-financial-summary.csv');
  res.send(csv);
});

// GET Export Full JSON System Backup
router.get('/backup/json', (req, res) => {
  const backup = {
    exportedAt: new Date().toISOString(),
    events: db.read('events'),
    staff: db.read('staff'),
    equipment: db.read('equipment'),
    venues: db.read('venues'),
    vendors: db.read('vendors'),
    assignments: db.read('assignments'),
    allocations: db.read('allocations'),
    coordinations: db.read('coordinations')
  };

  res.header('Content-Type', 'application/json');
  res.attachment(`apex-full-backup-${Date.now()}.json`);
  res.send(JSON.stringify(backup, null, 2));
});

module.exports = router;
