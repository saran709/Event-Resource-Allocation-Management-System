const express = require('express');
const router = express.Router();
const db = require('../db');
const { getConflictsReport } = require('../services/conflictEngine');
const { getGlobalBudgetRollup, getOverallFinancialAnalytics } = require('../services/budgetEngine');
const { generateExecutiveSummaryReport } = require('../services/reportEngine');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);
// System reports restricted to Super Admin and Event Admin
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.EVENT_ADMIN));

router.get('/summary', (req, res) => {
  const summaryReport = generateExecutiveSummaryReport();
  res.json({
    success: true,
    report: summaryReport,
    generatedAt: summaryReport.generatedAt
  });
});

router.get('/staff', (req, res) => {
  const staff = db.read('staff');
  const assignments = db.read('assignments');
  const tasks = db.read('tasks');

  const report = staff.map(s => {
    const sAssignments = assignments.filter(a => a.staffId === s.id);
    const sTasks = tasks.filter(t => t.staffId === s.id);
    return {
      id: s.id,
      name: s.name,
      role: s.role,
      dailyRate: s.dailyRate,
      activeEventsCount: sAssignments.length,
      assignedTasksCount: sTasks.length,
      completedTasksCount: sTasks.filter(t => t.status === 'Completed').length,
      utilizationStatus: sAssignments.length > 0 ? 'Assigned' : 'Available'
    };
  });

  res.json({
    success: true,
    data: report
  });
});

router.get('/equipment', (req, res) => {
  const equipment = db.read('equipment');
  const allocations = db.read('allocations');

  const report = equipment.map(eq => {
    const eqAllocations = allocations.filter(a => a.equipmentId === eq.id);
    const allocatedQty = eqAllocations.reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);
    return {
      id: eq.id,
      name: eq.name,
      category: eq.category,
      totalStock: eq.totalStock,
      allocatedQuantity: allocatedQty,
      availableQuantity: Math.max(0, eq.totalStock - allocatedQty),
      utilizationPercent: eq.totalStock > 0 ? Math.round((allocatedQty / eq.totalStock) * 100) : 0
    };
  });

  res.json({
    success: true,
    data: report
  });
});

router.get('/budget', (req, res) => {
  const budgetAnalytics = getOverallFinancialAnalytics();
  res.json({
    success: true,
    data: budgetAnalytics
  });
});

module.exports = router;
