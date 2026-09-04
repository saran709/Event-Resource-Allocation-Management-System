const db = require('../db');

function calculateEventCosts(event) {
  const assignments = db.read('assignments');
  const allocations = db.read('allocations');
  const coordinations = db.read('coordinations');
  const staff = db.read('staff');
  const equipment = db.read('equipment');

  const days = Math.max(1, Math.round((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) + 1);

  // Staffing Costs
  const evAssignments = assignments.filter(a => a.eventId === event.id);
  let staffCost = 0;
  const staffBreakdown = [];
  evAssignments.forEach(as => {
    const s = staff.find(st => st.id === as.staffId);
    if (s) {
      const itemCost = s.dailyRate * days;
      staffCost += itemCost;
      staffBreakdown.push({ staffName: s.name, role: s.role, dailyRate: s.dailyRate, days, total: itemCost });
    }
  });

  // Equipment Rental Costs
  const evAllocations = allocations.filter(a => a.eventId === event.id);
  let equipmentCost = 0;
  const equipBreakdown = [];
  evAllocations.forEach(al => {
    const eq = equipment.find(e => e.id === al.equipmentId);
    if (eq) {
      const itemCost = eq.rentalRate * al.quantity * days;
      equipmentCost += itemCost;
      equipBreakdown.push({ equipmentName: eq.name, quantity: al.quantity, dailyRate: eq.rentalRate, days, total: itemCost });
    }
  });

  // Vendor Service Fees
  const evCoordinations = coordinations.filter(c => c.eventId === event.id);
  const vendors = db.read('vendors');
  let vendorCost = 0;
  const vendorBreakdown = [];
  evCoordinations.forEach(c => {
    const v = vendors.find(ve => ve.id === c.vendorId);
    vendorCost += c.cost;
    vendorBreakdown.push({ vendorName: v ? v.name : 'Unknown Vendor', service: c.details, cost: c.cost, paymentStatus: c.paymentStatus });
  });

  const totalSpent = staffCost + equipmentCost + vendorCost;
  const budget = Number(event.budget) || 0;
  const variance = budget - totalSpent;
  const burnRatePercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  return {
    eventId: event.id,
    title: event.title,
    durationDays: days,
    budget,
    totalSpent,
    variance,
    burnRatePercent,
    status: variance >= 0 ? 'Under Budget' : 'Over Budget',
    breakdown: {
      staff: staffCost,
      equipment: equipmentCost,
      vendor: vendorCost,
      staffDetails: staffBreakdown,
      equipDetails: equipBreakdown,
      vendorDetails: vendorBreakdown
    }
  };
}

function getOverallFinancialAnalytics() {
  const events = db.read('events').filter(e => e.status !== 'Cancelled');
  let totalAllocatedBudget = 0;
  let totalActualSpend = 0;
  let totalStaffSpend = 0;
  let totalEquipSpend = 0;
  let totalVendorSpend = 0;

  const eventReports = events.map(ev => {
    const report = calculateEventCosts(ev);
    totalAllocatedBudget += report.budget;
    totalActualSpend += report.totalSpent;
    totalStaffSpend += report.breakdown.staff;
    totalEquipSpend += report.breakdown.equipment;
    totalVendorSpend += report.breakdown.vendor;
    return report;
  });

  return {
    totalAllocatedBudget,
    totalActualSpend,
    totalVariance: totalAllocatedBudget - totalActualSpend,
    overallBurnPercent: totalAllocatedBudget > 0 ? Math.round((totalActualSpend / totalAllocatedBudget) * 100) : 0,
    categoryTotals: {
      staff: totalStaffSpend,
      equipment: totalEquipSpend,
      vendor: totalVendorSpend
    },
    eventReports
  };
}

function getGlobalBudgetRollup() {
  const analytics = getOverallFinancialAnalytics();
  return {
    ...analytics,
    totalSpent: analytics.totalActualSpend,
    totalAllocated: analytics.totalAllocatedBudget,
    totalBudget: analytics.totalAllocatedBudget,
    totalActualSpend: analytics.totalActualSpend
  };
}

module.exports = {
  calculateEventCosts,
  getOverallFinancialAnalytics,
  getGlobalBudgetRollup
};
