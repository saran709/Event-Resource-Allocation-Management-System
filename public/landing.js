/**
 * Event Resource Allocation Management System
 * Clean, Event-Focused Public Portal JavaScript Engine
 */

// Helper to convert time strings (e.g., "09:00 AM", "18:00", "06:30 PM") to "HH:mm"
function convertTo24h(timeStr) {
  if (!timeStr) return '00:00';
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numeric = clean.replace(/[APM\s]/g, '');
  const parts = numeric.split(':');
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parts[1] ? parts[1].padStart(2, '0') : '00';

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

// Parse start and end timestamps reliably
function parseEventTimestamps(event) {
  const startDateStr = event.startDate || new Date().toISOString().split('T')[0];
  const endDateStr = event.endDate || startDateStr;
  const startTimeStr = event.startTime || '00:00';
  const endTimeStr = event.endTime || '23:59';

  const startIso = `${startDateStr}T${convertTo24h(startTimeStr)}:00`;
  const endIso = `${endDateStr}T${convertTo24h(endTimeStr)}:00`;

  const start = new Date(startIso);
  const end = new Date(endIso);

  return {
    start: isNaN(start.getTime()) ? new Date(startDateStr) : start,
    end: isNaN(end.getTime()) ? new Date(endDateStr) : end
  };
}

// Format Date string for display
function formatDateRange(startDateStr, endDateStr) {
  if (!startDateStr) return 'Date TBD';
  const s = new Date(startDateStr);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  const sFormatted = s.toLocaleDateString('en-US', options);

  if (!endDateStr || endDateStr === startDateStr) {
    return sFormatted;
  }

  const e = new Date(endDateStr);
  const eFormatted = e.toLocaleDateString('en-US', options);
  return `${sFormatted} – ${eFormatted}`;
}

// Render a single event card
function createEventCardHtml(event, computedStatus) {
  const title = event.title || 'Untitled Event';
  const description = event.description || 'No detailed description provided.';
  const venue = event.venue || 'Venue TBD';
  const location = event.location || 'Location Not Specified';
  const organizer = event.organizer || 'Internal Committee';
  const category = event.category || 'General Event';
  const expectedAttendees = event.expectedAttendees ? `${Number(event.expectedAttendees).toLocaleString()} attendees` : 'Open Attendance';
  const dateDisplay = formatDateRange(event.startDate, event.endDate);
  const timeDisplay = (event.startTime && event.endTime) ? `${event.startTime} – ${event.endTime}` : (event.startTime || 'Full Day');

  let tagClass = 'tag-upcoming';
  let tagLabel = 'UPCOMING';

  if (computedStatus === 'ONGOING') {
    tagClass = 'tag-ongoing';
    tagLabel = 'ONGOING';
  } else if (computedStatus === 'COMPLETED') {
    tagClass = 'tag-completed';
    tagLabel = 'COMPLETED';
  }

  return `
    <article class="event-card" aria-label="${title}">
      <div class="event-card-head">
        <h3 class="event-title">${title}</h3>
        <span class="status-tag ${tagClass}">${tagLabel}</span>
      </div>
      <p class="event-description">${description}</p>
      <ul class="event-details-list">
        <li class="event-detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-val">${dateDisplay}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-val">${timeDisplay}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Venue</span>
          <span class="detail-val">${venue}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Location</span>
          <span class="detail-val">${location}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-val">${category}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Organizer</span>
          <span class="detail-val">${organizer}</span>
        </li>
        <li class="event-detail-row">
          <span class="detail-label">Expected</span>
          <span class="detail-val">${expectedAttendees}</span>
        </li>
      </ul>
    </article>
  `;
}

// Fetch events from real backend API and populate categories
async function fetchAndDisplayEvents() {
  const loadingEl = document.getElementById('events-loading');
  const errorEl = document.getElementById('events-error');
  const contentEl = document.getElementById('events-content');

  const upcomingGrid = document.getElementById('upcoming-events-grid');
  const ongoingGrid = document.getElementById('ongoing-events-grid');
  const completedGrid = document.getElementById('completed-events-grid');

  const upcomingCountEl = document.getElementById('upcoming-count');
  const ongoingCountEl = document.getElementById('ongoing-count');
  const completedCountEl = document.getElementById('completed-count');

  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'none';

  try {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const events = await response.json();
    const now = new Date();

    const upcomingEvents = [];
    const ongoingEvents = [];
    const completedEvents = [];

    events.forEach(event => {
      const { start, end } = parseEventTimestamps(event);

      if (now < start) {
        upcomingEvents.push({ ...event, _start: start, _end: end });
      } else if (now >= start && now <= end) {
        ongoingEvents.push({ ...event, _start: start, _end: end });
      } else {
        completedEvents.push({ ...event, _start: start, _end: end });
      }
    });

    // 1. Upcoming Events: sort by nearest upcoming first (ascending start)
    upcomingEvents.sort((a, b) => a._start.getTime() - b._start.getTime());

    // 2. Ongoing Events: sort by start time ascending
    ongoingEvents.sort((a, b) => a._start.getTime() - b._start.getTime());

    // 3. Completed Events: sort newest completed first (descending end)
    completedEvents.sort((a, b) => b._end.getTime() - a._end.getTime());

    // Render Upcoming Section
    if (upcomingGrid) {
      if (upcomingEvents.length > 0) {
        upcomingGrid.innerHTML = upcomingEvents.map(e => createEventCardHtml(e, 'UPCOMING')).join('');
      } else {
        upcomingGrid.innerHTML = `
          <div class="empty-category-state">
            No upcoming events at the moment.
          </div>
        `;
      }
    }
    if (upcomingCountEl) {
      upcomingCountEl.textContent = `${upcomingEvents.length} Event${upcomingEvents.length === 1 ? '' : 's'}`;
    }

    // Render Ongoing Section
    if (ongoingGrid) {
      if (ongoingEvents.length > 0) {
        ongoingGrid.innerHTML = ongoingEvents.map(e => createEventCardHtml(e, 'ONGOING')).join('');
      } else {
        ongoingGrid.innerHTML = `
          <div class="empty-category-state">
            No events are currently ongoing.
          </div>
        `;
      }
    }
    if (ongoingCountEl) {
      ongoingCountEl.textContent = `${ongoingEvents.length} Event${ongoingEvents.length === 1 ? '' : 's'}`;
    }

    // Render Completed Section
    if (completedGrid) {
      if (completedEvents.length > 0) {
        completedGrid.innerHTML = completedEvents.map(e => createEventCardHtml(e, 'COMPLETED')).join('');
      } else {
        completedGrid.innerHTML = `
          <div class="empty-category-state">
            No completed events available.
          </div>
        `;
      }
    }
    if (completedCountEl) {
      completedCountEl.textContent = `${completedEvents.length} Event${completedEvents.length === 1 ? '' : 's'}`;
    }

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

  } catch (err) {
    console.error('Error fetching event data:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Dynamic Login vs Dashboard Button state
  const isAuth = localStorage.getItem('erams_auth') === 'true' || sessionStorage.getItem('erams_auth') === 'true';
  const navBtn = document.getElementById('nav-login-btn');
  if (navBtn) {
    if (isAuth) {
      navBtn.textContent = 'Dashboard';
      navBtn.setAttribute('aria-label', 'Go to Dashboard');
    } else {
      navBtn.textContent = 'Login';
      navBtn.setAttribute('aria-label', 'Login to system');
    }
  }

  // 3. Fetch and render events
  fetchAndDisplayEvents();
});
