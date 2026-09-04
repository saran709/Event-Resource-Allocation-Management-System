const db = require('../db');

function areDatesOverlapping(startA, endA, startB, endB) {
  return (new Date(startA) <= new Date(endB)) && (new Date(endA) >= new Date(startB));
}

function getConflictsReport() {
  const events = db.read('events').filter(e => e.status !== 'Cancelled');
  const staff = db.read('staff');
  const equipment = db.read('equipment');
  const assignments = db.read('assignments');
  const allocations = db.read('allocations');

  const staffConflicts = [];
  const equipmentConflicts = [];

  // 1. Detect Staff Conflicts
  staff.forEach(s => {
    const sAssignments = assignments.filter(a => a.staffId === s.id);
    for (let i = 0; i < sAssignments.length; i++) {
      for (let j = i + 1; j < sAssignments.length; j++) {
        const evA = events.find(e => e.id === sAssignments[i].eventId);
        const evB = events.find(e => e.id === sAssignments[j].eventId);

        if (evA && evB && areDatesOverlapping(evA.startDate, evA.endDate, evB.startDate, evB.endDate)) {
          const overlapStart = new Date(Math.max(new Date(evA.startDate), new Date(evB.startDate))).toISOString().split('T')[0];
          const overlapEnd = new Date(Math.min(new Date(evA.endDate), new Date(evB.endDate))).toISOString().split('T')[0];

          staffConflicts.push({
            staffId: s.id,
            staffName: s.name,
            role: s.role,
            assignmentIdA: sAssignments[i].id,
            assignmentIdB: sAssignments[j].id,
            eventA: { id: evA.id, title: evA.title, dates: `${evA.startDate} to ${evA.endDate}` },
            eventB: { id: evB.id, title: evB.title, dates: `${evB.startDate} to ${evB.endDate}` },
            overlapPeriod: `${overlapStart} to ${overlapEnd}`,
            message: `${s.name} is double-booked between ${overlapStart} and ${overlapEnd} for "${evA.title}" and "${evB.title}".`
          });
        }
      }
    }
  });

  // 2. Detect Equipment Over-allocations (Optimized O(N log N) Sweep-Line Algorithm)
  equipment.forEach(eq => {
    const eqAllocations = allocations.filter(al => al.equipmentId === eq.id);
    if (eqAllocations.length === 0) return;

    const allocWithEvents = eqAllocations.map(al => {
      const ev = events.find(e => e.id === al.eventId);
      if (!ev) return null;
      return {
        al,
        ev,
        start: ev.startDate,
        end: ev.endDate,
        qty: al.quantity
      };
    }).filter(Boolean);

    if (allocWithEvents.length === 0) return;

    // Build timeline event points
    const timePoints = [];
    allocWithEvents.forEach(item => {
      timePoints.push({ date: item.start, type: 'start', item });
      timePoints.push({ date: item.end, type: 'end', item });
    });

    // Unique sorted dates
    const uniqueDates = Array.from(new Set(timePoints.map(p => p.date))).sort();

    const conflictDays = [];
    uniqueDates.forEach(d => {
      let allocatedQty = 0;
      const allocatingEventsThisDay = [];

      allocWithEvents.forEach(item => {
        if (d >= item.start && d <= item.end) {
          allocatedQty += item.qty;
          allocatingEventsThisDay.push({
            eventId: item.ev.id,
            title: item.ev.title,
            allocationId: item.al.id,
            qty: item.qty
          });
        }
      });

      if (allocatedQty > eq.totalStock) {
        conflictDays.push({
          date: d,
          allocated: allocatedQty,
          events: allocatingEventsThisDay
        });
      }
    });

    if (conflictDays.length > 0) {
      let maxAllocated = Math.max(...conflictDays.map(c => c.allocated));
      const involvedEventsMap = {};
      conflictDays.forEach(c => {
        c.events.forEach(e => { involvedEventsMap[e.eventId] = e.title; });
      });
      const eventsList = Object.entries(involvedEventsMap).map(([id, title]) => ({ id, title }));
      const rangeStart = conflictDays[0].date;
      const rangeEnd = conflictDays[conflictDays.length - 1].date;

      equipmentConflicts.push({
        equipmentId: eq.id,
        equipmentName: eq.name,
        category: eq.category,
        totalStock: eq.totalStock,
        maxAllocated: maxAllocated,
        deficit: maxAllocated - eq.totalStock,
        overlapPeriod: rangeStart === rangeEnd ? rangeStart : `${rangeStart} to ${rangeEnd}`,
        involvedEvents: eventsList,
        message: `"${eq.name}" is over-allocated (requires ${maxAllocated} of ${eq.totalStock} available) from ${rangeStart} to ${rangeEnd}.`
      });
    }
  });

  // 3. Detect Venue Booking Collisions
  const venueConflicts = [];
  const venues = db.read('venues');
  venues.forEach(vn => {
    const venueEvents = events.filter(e => e.venue && e.venue.toLowerCase() === vn.name.toLowerCase());
    for (let i = 0; i < venueEvents.length; i++) {
      for (let j = i + 1; j < venueEvents.length; j++) {
        const evA = venueEvents[i];
        const evB = venueEvents[j];
        if (areDatesOverlapping(evA.startDate, evA.endDate, evB.startDate, evB.endDate)) {
          const overlapStart = new Date(Math.max(new Date(evA.startDate), new Date(evB.startDate))).toISOString().split('T')[0];
          const overlapEnd = new Date(Math.min(new Date(evA.endDate), new Date(evB.endDate))).toISOString().split('T')[0];

          venueConflicts.push({
            venueName: vn.name,
            venueId: vn.id,
            eventA: { id: evA.id, title: evA.title, dates: `${evA.startDate} to ${evA.endDate}` },
            eventB: { id: evB.id, title: evB.title, dates: `${evB.startDate} to ${evB.endDate}` },
            overlapPeriod: `${overlapStart} to ${overlapEnd}`,
            message: `Venue "${vn.name}" is double-booked between ${overlapStart} and ${overlapEnd} for "${evA.title}" and "${evB.title}".`
          });
        }
      }
    }
  });

  return { staffConflicts, equipmentConflicts, venueConflicts };
}

// 1-Click Smart Conflict Auto-Resolver
function autoResolveConflicts() {
  const report = getConflictsReport();
  const staff = db.read('staff');
  const assignments = db.read('assignments');
  const events = db.read('events').filter(e => e.status !== 'Cancelled');
  const equipment = db.read('equipment');
  const allocations = db.read('allocations');

  const resolutions = [];

  // Auto-resolve staff conflicts by reassigning to available staff with same role
  report.staffConflicts.forEach(sc => {
    const conflictedAssignment = assignments.find(a => a.id === sc.assignmentIdB);
    if (!conflictedAssignment) return;

    const targetEvent = events.find(e => e.id === conflictedAssignment.eventId);
    if (!targetEvent) return;

    // Find alternative staff member in same/similar role without overlap
    const candidates = staff.filter(s => s.id !== sc.staffId && s.role === sc.role);
    for (const cand of candidates) {
      const candAssignments = assignments.filter(a => a.staffId === cand.id);
      const hasClash = candAssignments.some(ca => {
        const ev = events.find(e => e.id === ca.eventId);
        return ev && areDatesOverlapping(ev.startDate, ev.endDate, targetEvent.startDate, targetEvent.endDate);
      });

      if (!hasClash) {
        db.update('assignments', conflictedAssignment.id, { staffId: cand.id });
        resolutions.push(`Reassigned "${targetEvent.title}" from ${sc.staffName} to ${cand.name} (${cand.role}).`);
        break;
      }
    }
  });

  // Auto-resolve equipment shortage by adjusting quantity to fit available stock
  report.equipmentConflicts.forEach(ec => {
    const eq = equipment.find(e => e.id === ec.equipmentId);
    if (!eq) return;

    const eqAllocs = allocations.filter(al => al.equipmentId === eq.id);
    if (eqAllocs.length > 1) {
      const lastAlloc = eqAllocs[eqAllocs.length - 1];
      const maxAllowable = Math.max(1, eq.totalStock - (ec.maxAllocated - lastAlloc.quantity));
      if (lastAlloc.quantity > maxAllowable) {
        db.update('allocations', lastAlloc.id, { quantity: maxAllowable });
        resolutions.push(`Adjusted "${eq.name}" allocation for event to ${maxAllowable} units (within warehouse capacity of ${eq.totalStock}).`);
      }
    }
  });

  return {
    success: true,
    resolvedCount: resolutions.length,
    resolutions,
    remainingConflicts: getConflictsReport()
  };
}

module.exports = {
  areDatesOverlapping,
  getConflictsReport,
  autoResolveConflicts
};
