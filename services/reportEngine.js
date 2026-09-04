// Advanced Analytics & Executive Reporting Engine
const db = require('../db');
const { getConflictsReport } = require('./conflictEngine');
const { getOverallFinancialAnalytics } = require('./budgetEngine');

function generateExecutiveSummaryReport() {
  const events = db.read('events');
  const staff = db.read('staff');
  const equipment = db.read('equipment');
  const venues = db.read('venues');
  const vendors = db.read('vendors');
  const conflicts = getConflictsReport();
  const financials = getOverallFinancialAnalytics();

  return {
    generatedAt: new Date().toISOString(),
    organization: 'APEX Event Resource Systems',
    overview: {
      totalEvents: events.length,
      confirmedEvents: events.filter(e => e.status === 'Confirmed').length,
      draftEvents: events.filter(e => e.status === 'Draft').length,
      totalStaffPool: staff.length,
      totalHardwarePool: equipment.reduce((sum, eq) => sum + eq.totalStock, 0),
      totalVenues: venues.length,
      totalVendors: vendors.length
    },
    financialHealth: {
      totalBudget: financials.totalAllocatedBudget,
      totalActualSpend: financials.totalActualSpend,
      netVariance: financials.totalVariance,
      burnRatePercent: financials.overallBurnPercent,
      status: financials.totalVariance >= 0 ? 'Healthy (Under Budget)' : 'Alert (Over Budget)'
    },
    conflictRiskIndex: {
      activeStaffConflicts: conflicts.staffConflicts.length,
      activeEquipmentShortages: conflicts.equipmentConflicts.length,
      riskLevel: (conflicts.staffConflicts.length + conflicts.equipmentConflicts.length) === 0 ? 'Low (Clean)' : 'Elevated (Action Required)'
    },
    eventBreakdowns: financials.eventReports
  };
}

module.exports = {
  generateExecutiveSummaryReport
};
