// APEX — Event Resource Allocation Management System
// Enterprise-Grade Pure React.js 18 Component Architecture with Complete Role Workflows

const { useState, useEffect, useMemo, useCallback } = React;

function App() {
  // Global Authentication & Persona State
  const [auth, setAuth] = useState(() => {
    return localStorage.getItem('erams_auth') === 'true' || sessionStorage.getItem('erams_auth') === 'true';
  });
  const [activePersona, setActivePersona] = useState(() => {
    return localStorage.getItem('erams_persona') || sessionStorage.getItem('erams_persona') || 'sarah';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Mobile Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data Collections
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [venues, setVenues] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [conflicts, setConflicts] = useState({ staffConflicts: [], equipmentConflicts: [], venueConflicts: [] });
  const [analytics, setAnalytics] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Entities
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  // View Layout Modes
  const [eventViewMode, setEventViewMode] = useState('list'); // 'list' or 'kanban'
  const [eventSubTab, setEventSubTab] = useState('overview'); // 'overview', 'resources', 'tasks', 'budget'
  const [currency, setCurrency] = useState('USD');
  const [currencyRate, setCurrencyRate] = useState(1);
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Calendar & Gantt Timeline State
  const [calendarViewMode, setCalendarViewMode] = useState('month'); // 'month', 'gantt', 'agenda'
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(8); // 8 is September (0-indexed)
  const [calendarFilterStatus, setCalendarFilterStatus] = useState('all');
  const [calendarFilterVenue, setCalendarFilterVenue] = useState('all');

  // Smart Tools & Studio States
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilterCategory, setAuditFilterCategory] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  // Simulator State
  const [simAttendees, setSimAttendees] = useState(650);
  const [simTicketPrice, setSimTicketPrice] = useState(85);
  const [simSponsorship, setSimSponsorship] = useState(18000);
  const [simCrewCount, setSimCrewCount] = useState(10);
  const [simGearTier, setSimGearTier] = useState('premium');
  const [simCateringPerHead, setSimCateringPerHead] = useState(40);
  const [simVenueRate, setSimVenueRate] = useState(9500);

  // Floor Plan Studio State
  const [selectedFloorVenue, setSelectedFloorVenue] = useState('Innovation Arena');
  const [selectedFloorItem, setSelectedFloorItem] = useState(null);
  const [floorPlanElements, setFloorPlanElements] = useState([
    { id: 'stg1', name: 'Main Stage & 4K LED Screen', type: 'stage', x: 220, y: 25, w: 260, h: 85, color: '#6366f1', power: '24 kW', cap: '20 Performers' },
    { id: 'av1', name: 'FOH Audio & Lighting Desk', type: 'av', x: 280, y: 340, w: 140, h: 55, color: '#ec4899', power: '8 kW', cap: '4 Engineers' },
    { id: 'vip1', name: 'VIP Lounge & Executive Suite', type: 'vip', x: 35, y: 140, w: 130, h: 120, color: '#f59e0b', power: '5 kW', cap: '45 Guests' },
    { id: 'gen1', name: 'Orchestra Seating Zone A', type: 'seating', x: 195, y: 135, w: 140, h: 180, color: '#3b82f6', power: '1 kW', cap: '250 Seats' },
    { id: 'gen2', name: 'Orchestra Seating Zone B', type: 'seating', x: 365, y: 135, w: 140, h: 180, color: '#3b82f6', power: '1 kW', cap: '250 Seats' },
    { id: 'bvr1', name: 'Catering Hub & Refreshments', type: 'catering', x: 535, y: 140, w: 130, h: 120, color: '#10b981', power: '12 kW', cap: '60 Patrons' },
    { id: 'em1', name: 'Emergency Exit Route Alpha', type: 'exit', x: 35, y: 350, w: 110, h: 45, color: '#ef4444', power: '0 kW', cap: 'Egress Pass' },
    { id: 'em2', name: 'Emergency Exit Route Beta', type: 'exit', x: 555, y: 350, w: 110, h: 45, color: '#ef4444', power: '0 kW', cap: 'Egress Pass' }
  ]);

  // Weather Radar State
  const [selectedWeatherVenue, setSelectedWeatherVenue] = useState('Innovation Arena');

  // Modals & Popups
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'event', 'staff', 'equipment', 'venue', 'vendor', 'assign', 'allocate', 'coord', 'task', 'user', 'badge', 'export', 'my-credentials'
  const [modalData, setModalData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Persona Profiles Mapping (4 Primary Hierarchical Roles)
  const PERSONAS = useMemo(() => [
    { 
      id: 'usr1', 
      slug: 'sarah', 
      name: 'Sarah Miller', 
      role: 'Global Operations Director', 
      userRole: 'SUPER ADMIN', 
      roleCode: 'SUPER_ADMIN', 
      email: 'sarah.manager@apexevents.com', 
      avatar: '👑', 
      tag: 'SUPER ADMIN (Level 4)',
      level: 4
    },
    { 
      id: 'usr2', 
      slug: 'marcus', 
      name: 'Marcus Vance', 
      role: 'Executive Event Administrator', 
      userRole: 'EVENT ADMIN', 
      roleCode: 'EVENT_ADMIN', 
      email: 'marcus.coord@apexevents.com', 
      avatar: '👔', 
      tag: 'EVENT ADMIN (Level 3)',
      level: 3
    },
    { 
      id: 'usr3', 
      slug: 'elena', 
      name: 'Elena Rostova', 
      role: 'Lead Event Organizer', 
      userRole: 'ORGANIZER', 
      roleCode: 'ORGANIZER', 
      email: 'elena.tech@apexevents.com', 
      avatar: '📋', 
      tag: 'ORGANIZER (Level 2: ev1)',
      level: 2
    },
    { 
      id: 'usr4', 
      slug: 'bob', 
      name: 'Bob Miller', 
      role: 'AV & Logistics Specialist', 
      userRole: 'STAFF', 
      roleCode: 'STAFF', 
      email: 'bob.logistics@apexevents.com', 
      avatar: '👷', 
      tag: 'STAFF (Level 1: Tasks)',
      level: 1
    }
  ], []);

  const currentPersona = useMemo(() => {
    return PERSONAS.find(p => p.id === activePersona || p.slug === activePersona) || PERSONAS[0];
  }, [PERSONAS, activePersona]);

  // Permitted Tabs per Role Hierarchy
  const allowedTabs = useMemo(() => {
    const role = currentPersona.roleCode;
    if (role === 'SUPER_ADMIN') {
      return ['dashboard', 'events', 'calendar', 'tasks', 'staff', 'equipment', 'venues', 'vendors', 'budget', 'reports', 'simulator', 'floorplan', 'weather', 'audit', 'aws', 'admin'];
    }
    if (role === 'EVENT_ADMIN') {
      return ['dashboard', 'events', 'calendar', 'tasks', 'staff', 'equipment', 'venues', 'vendors', 'budget', 'reports', 'audit'];
    }
    if (role === 'ORGANIZER') {
      return ['dashboard', 'events', 'calendar', 'tasks', 'staff', 'equipment'];
    }
    if (role === 'STAFF') {
      return ['dashboard', 'events', 'tasks', 'calendar'];
    }
    return ['dashboard'];
  }, [currentPersona]);

  // Toast Notification Helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Authenticated API Fetch Helper
  const apiFetch = useCallback(async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentPersona.id}`,
      'x-user-id': currentPersona.id,
      'x-role': currentPersona.roleCode,
      ...(options.headers || {})
    };
    try {
      const res = await fetch(url, { ...options, headers });
      return res;
    } catch (err) {
      console.error('API request error:', err);
      throw err;
    }
  }, [currentPersona]);

  // Automatically reset activeTab to dashboard if switching to a role that does not have access to current tab
  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [allowedTabs, activeTab]);

  // System Audit Logger Helper
  const logAudit = useCallback(async (action, details, category = 'General', severity = 'Info') => {
    try {
      const res = await apiFetch('/api/audit', {
        method: 'POST',
        body: JSON.stringify({
          actor: currentPersona.name,
          role: currentPersona.roleCode,
          category,
          action,
          details,
          severity
        })
      });
      if (res.ok) {
        const newEntry = await res.json();
        setAuditLogs(prev => [newEntry, ...prev]);
      }
    } catch (err) {
      console.error('Audit log error:', err);
    }
  }, [apiFetch, currentPersona]);

  // Fetch All Core Data from Backend APIs with Scoped Authorization matching the user's role
  const fetchAllData = useCallback(async () => {
    try {
      const role = currentPersona.roleCode;

      // Only query endpoints relevant to the active role
      const evPromise = apiFetch('/api/events');
      const tkPromise = apiFetch('/api/tasks');
      const stPromise = (role !== 'STAFF') ? apiFetch('/api/staff') : Promise.resolve({ ok: true, json: () => [] });
      const eqPromise = (role !== 'STAFF') ? apiFetch('/api/equipment') : Promise.resolve({ ok: true, json: () => [] });
      const vnPromise = (role !== 'STAFF') ? apiFetch('/api/venues') : Promise.resolve({ ok: true, json: () => [] });
      const vdPromise = (role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN') ? apiFetch('/api/vendors') : Promise.resolve({ ok: true, json: () => [] });
      const cfPromise = (role !== 'STAFF') ? apiFetch('/api/conflicts') : Promise.resolve({ ok: true, json: () => ({ staffConflicts: [], equipmentConflicts: [], venueConflicts: [] }) });
      const anPromise = (role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN') ? apiFetch('/api/budget/analytics') : Promise.resolve({ ok: true, json: () => null });
      const usPromise = (role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN') ? apiFetch('/api/users') : Promise.resolve({ ok: true, json: () => [] });
      const auPromise = (role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN') ? apiFetch('/api/audit') : Promise.resolve({ ok: true, json: () => [] });

      const [evRes, stRes, eqRes, vnRes, vdRes, cfRes, anRes, tkRes, usRes, auRes] = await Promise.all([
        evPromise, stPromise, eqPromise, vnPromise, vdPromise, cfPromise, anPromise, tkPromise, usPromise, auPromise
      ]);

      const [evData, stData, eqData, vnData, vdData, cfData, anData, tkData, usData, auData] = await Promise.all([
        evRes.ok ? evRes.json() : [],
        stRes.ok ? stRes.json() : [],
        eqRes.ok ? eqRes.json() : [],
        vnRes.ok ? vnRes.json() : [],
        vdRes.ok ? vdRes.json() : [],
        cfRes.ok ? cfRes.json() : { staffConflicts: [], equipmentConflicts: [], venueConflicts: [] },
        anRes.ok ? anRes.json() : null,
        tkRes.ok ? tkRes.json() : [],
        usRes.ok ? usRes.json() : [],
        auRes.ok ? auRes.json() : []
      ]);

      setEvents(Array.isArray(evData) ? evData : []);
      setStaff(Array.isArray(stData) ? stData : []);
      setEquipment(Array.isArray(eqData) ? eqData : []);
      setVenues(Array.isArray(vnData) ? vnData : []);
      setVendors(Array.isArray(vdData) ? vdData : []);
      setConflicts(cfData || { staffConflicts: [], equipmentConflicts: [], venueConflicts: [] });
      setAnalytics(anData);
      setTasks(Array.isArray(tkData) ? tkData : []);
      setUsers(Array.isArray(usData) ? usData : []);
      if (Array.isArray(auData)) setAuditLogs(auData);

      if (Array.isArray(evData) && evData.length > 0 && !selectedEventId) setSelectedEventId(evData[0].id);
      if (Array.isArray(stData) && stData.length > 0 && !selectedStaffId) setSelectedStaffId(stData[0].id);
      if (Array.isArray(eqData) && eqData.length > 0 && !selectedEquipmentId) setSelectedEquipmentId(eqData[0].id);
      if (Array.isArray(vnData) && vnData.length > 0 && !selectedVenueId) setSelectedVenueId(vnData[0].id);
      if (Array.isArray(vdData) && vdData.length > 0 && !selectedVendorId) setSelectedVendorId(vdData[0].id);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data in React:', err);
      setLoading(false);
    }
  }, [apiFetch, currentPersona, selectedEventId, selectedStaffId, selectedEquipmentId, selectedVenueId, selectedVendorId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Global Keyboard Shortcuts (Ctrl+K, Alt+Key, Escape, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setActiveModal(null);
        setShortcutsOpen(false);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      } else if (e.altKey) {
        if (e.key.toLowerCase() === 'd') { e.preventDefault(); setActiveTab('dashboard'); }
        if (e.key.toLowerCase() === 'e') { e.preventDefault(); setActiveTab('events'); }
        if (e.key.toLowerCase() === 's') { e.preventDefault(); setActiveTab('staff'); }
        if (e.key.toLowerCase() === 'q') { e.preventDefault(); setActiveTab('equipment'); }
        if (e.key.toLowerCase() === 'v') { e.preventDefault(); setActiveTab('venues'); }
        if (e.key.toLowerCase() === 'm') { e.preventDefault(); setActiveTab('vendors'); }
        if (e.key.toLowerCase() === 'b') { e.preventDefault(); setActiveTab('budget'); }
        if (e.key.toLowerCase() === 't') { e.preventDefault(); setActiveTab('tasks'); }
        if (e.key.toLowerCase() === 'r') { e.preventDefault(); setActiveTab('reports'); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Currency Converter Handler
  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    if (curr === 'EUR') {
      setCurrencyRate(0.92);
      setCurrencySymbol('€');
    } else if (curr === 'GBP') {
      setCurrencyRate(0.77);
      setCurrencySymbol('£');
    } else if (curr === 'JPY') {
      setCurrencyRate(148.5);
      setCurrencySymbol('¥');
    } else if (curr === 'INR') {
      setCurrencyRate(83.9);
      setCurrencySymbol('₹');
    } else if (curr === 'CAD') {
      setCurrencyRate(1.36);
      setCurrencySymbol('CA$');
    } else {
      setCurrencyRate(1);
      setCurrencySymbol('$');
    }
    showToast(`Currency format updated to ${curr}`, 'info');
  };

  // 1-Click Smart Conflict Auto-Resolver
  const handleAutoResolve = async () => {
    try {
      const res = await fetch('/api/conflicts/auto-resolve', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAllData();
        if (data.resolutions && data.resolutions.length > 0) {
          showToast(`⚡ Auto-Resolved ${data.resolvedCount} conflict(s): ${data.resolutions[0]}`, 'success');
        } else {
          showToast('✓ All schedules & gear are collision-free.', 'info');
        }
      }
    } catch (err) {
      showToast('Auto-resolve execution failed', 'error');
    }
  };

  // Export Data Handler
  const handleExport = (type) => {
    let url = `/api/export/${type}/csv`;
    let filename = `apex-${type}-export.csv`;
    if (type === 'backup') {
      url = '/api/export/backup/json';
      filename = `apex-system-backup-${Date.now()}.json`;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Exported ${type.toUpperCase()} file successfully`, 'success');
  };

  // Task Status Transition Handler
  const handleUpdateTaskStatus = async (taskId, newStatus, notes) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, completionNotes: notes || '' })
      });
      if (res.ok) {
        showToast(`Task marked as ${newStatus}`, 'success');
        fetchAllData();
      }
    } catch (e) {
      showToast('Failed to update task status', 'error');
    }
  };

  // Login Persona Handler
  const handleLoginPersona = (personaId) => {
    localStorage.setItem('erams_auth', 'true');
    localStorage.setItem('erams_persona', personaId);
    sessionStorage.setItem('erams_auth', 'true');
    sessionStorage.setItem('erams_persona', personaId);
    setAuth(true);
    setActivePersona(personaId);
    showToast(`Signed in as ${personaId.toUpperCase()}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('erams_auth');
    localStorage.removeItem('erams_persona');
    sessionStorage.removeItem('erams_auth');
    sessionStorage.removeItem('erams_persona');
    setAuth(false);
    showToast('Signed out of session', 'info');
  };

  // Move Kanban Card Column
  const handleMoveKanban = async (eventId, direction) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    const statuses = ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    const currIdx = statuses.indexOf(ev.status);
    let newIdx = currIdx;
    if (direction === 'prev' && currIdx > 0) newIdx--;
    else if (direction === 'next' && currIdx < statuses.length - 1) newIdx++;
    if (newIdx === currIdx) return;
    const newStatus = statuses[newIdx];

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Moved "${ev.title}" to ${newStatus}`, 'success');
        fetchAllData();
      }
    } catch (e) {
      showToast('Failed to update event status', 'error');
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || e.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  // Selected Active Event
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Total Conflicts Count
  const totalConflictsCount = (conflicts.staffConflicts?.length || 0) + 
                              (conflicts.equipmentConflicts?.length || 0) + 
                              (conflicts.venueConflicts?.length || 0);

  // If Not Authenticated, Render Modern Enterprise Login Screen
  if (!auth) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-brand-icon">▲</div>
            <h2>APEX ENTERPRISE</h2>
            <p>Event Resource Allocation & Conflict Resolution Platform</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLoginPersona('sarah'); }}>
            <div className="form-group">
              <label>Corporate Work Email</label>
              <input type="email" required defaultValue="sarah.manager@apexevents.com" placeholder="name@company.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required defaultValue="password123" placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-full-width" style={{ marginTop: '0.5rem' }}>
              Sign In to Workspace
            </button>
          </form>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600 }}>
              Quick 1-Click Role Persona Sign-In:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {PERSONAS.map(p => (
                <button 
                  key={p.id} 
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => handleLoginPersona(p.id)}
                  style={{ justifyContent: 'flex-start', padding: '0.45rem 0.6rem' }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{p.avatar}</span>
                  <span style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name.split(' ')[0]} ({p.userRole})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CALENDAR & GANTT TIMELINE RENDER HELPER
  // =========================================================================
  const renderCalendarTab = () => {
    try {
      const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const handlePrevMonth = () => {
        if (calendarMonth === 0) {
          setCalendarMonth(11);
          setCalendarYear(prev => prev - 1);
        } else {
          setCalendarMonth(prev => prev - 1);
        }
      };

      const handleNextMonth = () => {
        if (calendarMonth === 11) {
          setCalendarMonth(0);
          setCalendarYear(prev => prev + 1);
        } else {
          setCalendarMonth(prev => prev + 1);
        }
      };

      const handleToday = () => {
        setCalendarYear(2026);
        setCalendarMonth(8); // Sep 2026
      };

      const safeEvents = Array.isArray(events) ? events : [];
      const safeVenues = Array.isArray(venues) ? venues : [];
      const safeStaff = Array.isArray(staff) ? staff : [];
      const safeEquipment = Array.isArray(equipment) ? equipment : [];

      // Filter events
      const filteredCalEvents = safeEvents.filter(ev => {
        if (!ev) return false;
        if (calendarFilterStatus !== 'all' && ev.status !== calendarFilterStatus) return false;
        if (calendarFilterVenue !== 'all' && ev.venue !== calendarFilterVenue) return false;
        return true;
      });

      // Month Grid Calculations
      const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
      const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

      // Build calendar cells array
      const calendarCells = [];
      // Prev month trailing days
      for (let i = firstDayIndex - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const m = calendarMonth === 0 ? 12 : calendarMonth;
        const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        calendarCells.push({ dayNum, dateStr, isCurrentMonth: false });
      }
      // Current month days
      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        calendarCells.push({ dayNum, dateStr, isCurrentMonth: true });
      }
      // Next month leading days to complete multiple of 7
      const remainingCells = 7 - (calendarCells.length % 7);
      if (remainingCells < 7) {
        for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
          const m = calendarMonth === 11 ? 1 : calendarMonth + 2;
          const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
          const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          calendarCells.push({ dayNum, dateStr, isCurrentMonth: false });
        }
      }

      // Safe conflict detector
      const hasConflictOnDate = (dateStr) => {
        if (!conflicts) return false;
        const staffList = Array.isArray(conflicts.staffConflicts) ? conflicts.staffConflicts : [];
        const equipList = Array.isArray(conflicts.equipmentConflicts) ? conflicts.equipmentConflicts : [];

        const checkMatch = (item) => {
          if (!item || !item.overlapPeriod) return false;
          const parts = item.overlapPeriod.split(' to ');
          if (parts.length === 2) {
            return dateStr >= parts[0].trim() && dateStr <= parts[1].trim();
          }
          return dateStr === item.overlapPeriod.trim();
        };

        return staffList.some(checkMatch) || equipList.some(checkMatch);
      };

      return (
        <div className="calendar-dashboard-wrapper">
          {/* CALENDAR HEADER & CONTROLS */}
          <div className="calendar-toolbar card-container mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="calendar-month-display">
                  <h2>{MONTH_NAMES[calendarMonth] || 'Calendar'} {calendarYear}</h2>
                  <span className="badge-status in-progress">{filteredCalEvents.length} Events Scheduled</span>
                </div>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-small" onClick={handlePrevMonth} title="Previous Month">◀ Prev</button>
                  <button className="btn btn-secondary btn-small" onClick={handleToday} title="Current Month">Today</button>
                  <button className="btn btn-secondary btn-small" onClick={handleNextMonth} title="Next Month">Next ▶</button>
                </div>
              </div>

              {/* View Switcher & Filters */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="btn-group">
                  <button 
                    className={`btn btn-small ${calendarViewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCalendarViewMode('month')}
                  >
                    📅 Month Grid
                  </button>
                  <button 
                    className={`btn btn-small ${calendarViewMode === 'gantt' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCalendarViewMode('gantt')}
                  >
                    📊 Gantt Timeline
                  </button>
                  <button 
                    className={`btn btn-small ${calendarViewMode === 'agenda' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCalendarViewMode('agenda')}
                  >
                    📋 Agenda Stream
                  </button>
                </div>

                {/* Status Filter */}
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto' }}
                  value={calendarFilterStatus}
                  onChange={(e) => setCalendarFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Venue Filter */}
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto' }}
                  value={calendarFilterVenue}
                  onChange={(e) => setCalendarFilterVenue(e.target.value)}
                >
                  <option value="all">All Venues</option>
                  {safeVenues.map(v => (
                    <option key={v.id || v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>

                <button 
                  className="btn btn-primary btn-small" 
                  onClick={() => { setModalData({}); setActiveModal('event'); }}
                >
                  ＋ New Event
                </button>
              </div>
            </div>
          </div>

          {/* VIEW 1: MONTH GRID VIEW */}
          {calendarViewMode === 'month' && (
            <div className="card-container calendar-grid-container p-0">
              {/* Weekday Headers */}
              <div className="calendar-weekdays-header">
                {DAYS_OF_WEEK.map((day, idx) => (
                  <div key={idx} className="calendar-weekday-cell">{day}</div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="calendar-days-grid">
                {calendarCells.map((cell, idx) => {
                  const dayEvents = filteredCalEvents.filter(ev => ev.startDate <= cell.dateStr && ev.endDate >= cell.dateStr);
                  const hasConflict = hasConflictOnDate(cell.dateStr);

                  return (
                    <div 
                      key={idx} 
                      className={`calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${hasConflict ? 'day-has-conflict' : ''}`}
                    >
                      <div className="day-cell-top">
                        <span className={`day-number ${cell.dateStr === '2026-09-04' ? 'today-pill' : ''}`}>
                          {cell.dayNum}
                        </span>
                        {hasConflict && (
                          <span className="calendar-conflict-dot" title="Resource collision detected on this date!">⚠️</span>
                        )}
                      </div>

                      <div className="day-events-stack">
                        {dayEvents.map(ev => (
                          <div
                            key={ev.id}
                            className={`cal-event-pill status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => {
                              setSelectedEventId(ev.id);
                              setActiveTab('events');
                            }}
                            title={`${ev.title}\nVenue: ${ev.venue}\nDates: ${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`}
                          >
                            <span className="cal-event-indicator"></span>
                            <span className="cal-event-title">{ev.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: GANTT TIMELINE VIEW */}
          {calendarViewMode === 'gantt' && (
            <div className="card-container gantt-container p-0">
              <div className="gantt-header-row">
                <div className="gantt-event-col-header">Event Name & Venue</div>
                <div className="gantt-timeline-header-scroll">
                  <div className="gantt-days-axis" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))` }}>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <div key={day} className="gantt-day-tick">
                        <span className="gantt-day-num">{day}</span>
                        <span className="gantt-day-name">{DAYS_OF_WEEK[new Date(calendarYear, calendarMonth, day).getDay()].substring(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="gantt-body">
                {filteredCalEvents.length === 0 ? (
                  <div className="p-4 text-center text-muted">No events match the selected criteria for this timeline.</div>
                ) : (
                  filteredCalEvents.map(ev => {
                    let startDay = null;
                    let endDay = null;
                    if (ev.startDate && ev.endDate) {
                      const evStart = new Date(ev.startDate);
                      const evEnd = new Date(ev.endDate);
                      if (!isNaN(evStart.getTime()) && !isNaN(evEnd.getTime())) {
                        startDay = (evStart.getFullYear() === calendarYear && evStart.getMonth() === calendarMonth)
                          ? evStart.getDate()
                          : (evStart < new Date(calendarYear, calendarMonth, 1) ? 1 : null);
                        endDay = (evEnd.getFullYear() === calendarYear && evEnd.getMonth() === calendarMonth)
                          ? evEnd.getDate()
                          : (evEnd > new Date(calendarYear, calendarMonth + 1, 0) ? daysInMonth : null);
                      }
                    }

                    const isVisible = startDay !== null && endDay !== null && startDay <= daysInMonth && endDay >= 1;

                    return (
                      <div key={ev.id} className="gantt-row">
                        <div className="gantt-event-meta-cell">
                          <div className="gantt-event-title" onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}>
                            {ev.title}
                          </div>
                          <div className="gantt-event-sub">
                            <span>📍 {ev.venue}</span> • <span className={`badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`}>{ev.status}</span>
                          </div>
                        </div>

                        <div className="gantt-track-cell">
                          <div className="gantt-track-grid" style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))` }}>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                              <div key={day} className="gantt-grid-column"></div>
                            ))}
                            
                            {isVisible && (
                              <div 
                                className={`gantt-bar status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`}
                                style={{
                                  gridColumnStart: Math.max(1, startDay),
                                  gridColumnEnd: Math.min(daysInMonth, endDay) + 1
                                }}
                                onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}
                                title={`${ev.title}\n${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`}
                              >
                                <span className="gantt-bar-label">{ev.title} ({ev.durationDays || (endDay - startDay + 1)}d)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: AGENDA STREAM VIEW */}
          {calendarViewMode === 'agenda' && (
            <div className="agenda-stream-wrapper">
              {filteredCalEvents.length === 0 ? (
                <div className="card-container text-center p-5">
                  <h4>No scheduled events found</h4>
                  <p className="text-muted">Create a new event or adjust the venue/status filters above.</p>
                  <button className="btn btn-primary mt-2" onClick={() => { setModalData({}); setActiveModal('event'); }}>
                    ＋ Create New Event
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredCalEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(ev => {
                    const evAllocations = safeEquipment.filter(eq => (ev.allocations || []).some(al => al.equipmentId === eq.id));
                    const evStaff = safeStaff.filter(st => (ev.assignments || []).some(as => as.staffId === st.id));

                    return (
                      <div key={ev.id} className="col-12 col-lg-6">
                        <div className="card-container agenda-card h-100">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <span className="agenda-date-badge">📅 {ev.startDate} ➔ {ev.endDate}</span>
                              <h3 style={{ fontSize: '1.15rem', marginTop: '0.4rem', marginBottom: '0.2rem' }}>{ev.title}</h3>
                              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>📍 {ev.venue}</div>
                            </div>
                            <span className={`badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`}>{ev.status}</span>
                          </div>

                          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0.6rem 0' }}>{ev.description}</p>

                          <div className="agenda-meta-footer">
                            <div className="d-flex align-items-center gap-3">
                              <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                                👥 <strong>{ev.assignments?.length || evStaff.length || 0}</strong> Staff
                              </span>
                              <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                                📦 <strong>{ev.allocations?.length || evAllocations.length || 0}</strong> Gear
                              </span>
                              <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                                💰 <strong>{typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}</strong>
                              </span>
                            </div>

                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-secondary btn-small"
                                onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}
                              >
                                Inspect Workspace ➔
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error('Calendar Render Error:', err);
      return (
        <div className="card-container p-4 text-center">
          <h3 style={{ color: 'var(--danger-600)' }}>⚠️ Calendar Display Error</h3>
          <p>{err?.message || 'An error occurred while rendering the calendar.'}</p>
          <button className="btn btn-primary mt-2" onClick={() => setActiveTab('dashboard')}>
            Back to Dashboard
          </button>
        </div>
      );
    }
  };

  // =========================================================================
  // 12. INTERACTIVE EVENT COST FORECASTER & ROI SCENARIO SIMULATOR
  // =========================================================================
  const renderSimulatorTab = () => {
    const gearCosts = {
      standard: { label: 'Standard AV & PA (1080p, 2x PA)', cost: 3800 },
      premium: { label: 'Premium Arena Production (4K LED Wall, Line Arrays, Trussing)', cost: 9500 },
      ultra: { label: 'Ultra Immersive Broadcast (Multi-cam, Pyrotechnics, Spatial Audio)', cost: 19500 }
    };

    const crewDailyAvg = 450;
    const grossTickets = simAttendees * simTicketPrice;
    const grossRevenue = grossTickets + Number(simSponsorship);
    
    const crewExpense = simCrewCount * crewDailyAvg * 2;
    const gearExpense = gearCosts[simGearTier]?.cost || 9500;
    const venueExpense = Number(simVenueRate);
    const cateringExpense = simAttendees * simCateringPerHead;
    const directProductionCost = crewExpense + gearExpense + venueExpense + cateringExpense;
    const contingency = directProductionCost * 0.10;
    const totalSimCost = directProductionCost + contingency;
    const netProfit = grossRevenue - totalSimCost;
    const marginPct = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0;
    const breakevenTickets = simTicketPrice > 0 ? Math.ceil((totalSimCost - simSponsorship) / simTicketPrice) : 0;

    return (
      <div className="tab-pane-content">
        <div className="content-page-header">
          <div>
            <h2>🧮 Event Cost Forecaster & ROI Scenario Simulator</h2>
            <p>Perform live "what-if" financial modeling, crew-to-attendee scaling, and breakeven sensitivity analysis.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={() => {
              setSimAttendees(650);
              setSimTicketPrice(85);
              setSimSponsorship(18000);
              setSimCrewCount(10);
              setSimGearTier('premium');
              setSimCateringPerHead(40);
              setSimVenueRate(9500);
              showToast('Simulator parameters reset to baseline', 'info');
            }}>
              🔄 Reset Baseline
            </button>
            <button className="btn btn-primary" onClick={() => {
              showToast(`Exported simulation model: Net ROI $${netProfit.toLocaleString()} (${marginPct}%)`, 'success');
              logAudit('ROI Scenario Exported', `Generated financial forecast with ${simAttendees} attendees and $${grossRevenue.toLocaleString()} gross projection.`, 'Budget', 'Success');
            }}>
              📊 Export Financial Model
            </button>
          </div>
        </div>

        {/* Live Summary Metrics Bar */}
        <div className="stats-grid mb-4">
          <div className="stat-card">
            <div className="stat-label">Projected Gross Revenue</div>
            <div className="stat-value" style={{ color: 'var(--primary-600)' }}>${grossRevenue.toLocaleString()}</div>
            <div className="stat-subtext">Tickets (${grossTickets.toLocaleString()}) + Sponsor (${Number(simSponsorship).toLocaleString()})</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Estimated Cost</div>
            <div className="stat-value" style={{ color: 'var(--slate-800)' }}>${Math.round(totalSimCost).toLocaleString()}</div>
            <div className="stat-subtext">Includes 10% Contingency Buffer (${Math.round(contingency).toLocaleString()})</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Net Forecast Margin</div>
            <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--success-600)' : 'var(--danger-600)' }}>
              {netProfit >= 0 ? '+' : ''}${Math.round(netProfit).toLocaleString()} ({marginPct}%)
            </div>
            <div className="stat-subtext">{netProfit >= 0 ? '✓ Profitable Production Run' : '⚠️ Deficit Alert — Adjust Inputs'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Breakeven Attendance</div>
            <div className="stat-value" style={{ color: breakevenTickets <= simAttendees ? 'var(--primary-700)' : 'var(--warning-600)' }}>
              {Math.max(0, breakevenTickets)} / {simAttendees}
            </div>
            <div className="stat-subtext">Required Ticket Sales ({simTicketPrice > 0 ? `$${simTicketPrice}/head` : '$0'})</div>
          </div>
        </div>

        {/* Interactive Controls & Visual Breakdown */}
        <div className="row g-4">
          {/* Sliders Form Card */}
          <div className="col-12 col-lg-7">
            <div className="card-container">
              <div className="card-title-row mb-3">
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>🎛️ Real-Time Production & Scale Sliders</h3>
                <span className="card-badge-pill" style={{ color: 'var(--primary-700)', backgroundColor: 'var(--primary-50)' }}>Live Reactive</span>
              </div>

              <div className="sim-control-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>👥 Expected Attendance Scale:</label>
                  <span className="badge-status available" style={{ fontSize: '0.85rem' }}>{simAttendees.toLocaleString()} Attendees</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="3500" 
                  step="25" 
                  value={simAttendees} 
                  onChange={(e) => setSimAttendees(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.72rem' }}>
                  <span>50 (Intimate)</span>
                  <span>1,500 (Mid-Size Arena)</span>
                  <span>3,500+ (Festival/Convention)</span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>
                    🎟️ Ticket Price ($/head):
                  </label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      min="0" 
                      max="1000" 
                      value={simTicketPrice} 
                      onChange={(e) => setSimTicketPrice(Math.max(0, Number(e.target.value)))}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>
                    🤝 Corporate Sponsorship ($):
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    step="500" 
                    value={simSponsorship} 
                    onChange={(e) => setSimSponsorship(Math.max(0, Number(e.target.value)))}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label style={{ fontWeight: 600, fontSize: '0.88rem' }}>👷 Crew Allocation:</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{simCrewCount} Crew</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="40" 
                    value={simCrewCount} 
                    onChange={(e) => setSimCrewCount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary-600)' }}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>${(simCrewCount * crewDailyAvg * 2).toLocaleString()} est. labor payroll</span>
                </div>
                <div className="col-12 col-md-6">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>
                    📦 Hardware & AV Tier:
                  </label>
                  <select 
                    value={simGearTier} 
                    onChange={(e) => setSimGearTier(e.target.value)}
                    className="form-control"
                  >
                    <option value="standard">Standard AV & PA ($3,800)</option>
                    <option value="premium">Premium Arena Production ($9,500)</option>
                    <option value="ultra">Ultra Immersive Broadcast ($19,500)</option>
                  </select>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>
                    🍽️ Hospitality / Attendee ($):
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="200" 
                    value={simCateringPerHead} 
                    onChange={(e) => setSimCateringPerHead(Math.max(0, Number(e.target.value)))}
                    className="form-control"
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>${(simAttendees * simCateringPerHead).toLocaleString()} total food/beverage</span>
                </div>
                <div className="col-12 col-md-6">
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.3rem' }}>
                    🏛️ Venue Base Rental Rate ($):
                  </label>
                  <input 
                    type="number" 
                    min="500" 
                    step="500" 
                    value={simVenueRate} 
                    onChange={(e) => setSimVenueRate(Math.max(0, Number(e.target.value)))}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Composition & Sensitivity Analysis */}
          <div className="col-12 col-lg-5">
            <div className="card-container h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="card-title-row mb-3">
                  <h3 style={{ fontSize: '1.05rem', margin: 0 }}>📊 Cost Allocation Breakdown</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>100% Pro-Rata</span>
                </div>

                <div className="cost-breakdown-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                      <span>🏛️ Venue Rental</span>
                      <strong>${venueExpense.toLocaleString()} ({((venueExpense / totalSimCost) * 100).toFixed(1)}%)</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (venueExpense / totalSimCost) * 100)}%`, height: '100%', backgroundColor: '#6366f1' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                      <span>📦 Equipment & Production Gear</span>
                      <strong>${gearExpense.toLocaleString()} ({((gearExpense / totalSimCost) * 100).toFixed(1)}%)</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (gearExpense / totalSimCost) * 100)}%`, height: '100%', backgroundColor: '#ec4899' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                      <span>👷 Production Staff & Labor</span>
                      <strong>${crewExpense.toLocaleString()} ({((crewExpense / totalSimCost) * 100).toFixed(1)}%)</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (crewExpense / totalSimCost) * 100)}%`, height: '100%', backgroundColor: '#3b82f6' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                      <span>🍽️ Catering & Hospitality</span>
                      <strong>${cateringExpense.toLocaleString()} ({((cateringExpense / totalSimCost) * 100).toFixed(1)}%)</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (cateringExpense / totalSimCost) * 100)}%`, height: '100%', backgroundColor: '#10b981' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                      <span>🛡️ Contingency Reserve (10%)</span>
                      <strong>${Math.round(contingency).toLocaleString()} (10.0%)</strong>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '10%', height: '100%', backgroundColor: '#f59e0b' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-container mt-4" style={{ backgroundColor: 'var(--slate-50)', borderColor: 'var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.4rem' }}>💡 Financial Architect Recommendation</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', margin: 0, lineHeight: 1.45 }}>
                  {netProfit > 15000 ? (
                    <span>🚀 <strong>Excellent Margin Profile:</strong> Projected profit of ${Math.round(netProfit).toLocaleString()} gives strong resilience against attendance dips. Breakeven occurs at only {breakevenTickets} tickets ({((breakevenTickets/simAttendees)*100).toFixed(0)}% capacity).</span>
                  ) : netProfit >= 0 ? (
                    <span>⚖️ <strong>Moderate Margin:</strong> Operating at ${Math.round(netProfit).toLocaleString()} surplus. Consider securing $5k+ additional corporate sponsorship or bumping ticket tier by $10 to buffer unforeseen technical overages.</span>
                  ) : (
                    <span>⚠️ <strong>Deficit Warning:</strong> Projected model incurs a -${Math.round(Math.abs(netProfit)).toLocaleString()} loss. To achieve breakeven, either increase ticket price to ${(totalSimCost / simAttendees).toFixed(0)}/head or scale venue/gear tier downward.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 13. 2D INTERACTIVE VENUE FLOOR PLAN & SPATIAL STUDIO
  // =========================================================================
  const renderFloorplanTab = () => {
    const activeVenueObj = venues.find(v => v.name === selectedFloorVenue) || venues[0] || { name: 'Innovation Arena', capacity: 1500, city: 'San Francisco, CA' };

    return (
      <div className="tab-pane-content">
        <div className="content-page-header">
          <div>
            <h2>📐 2D Venue Floor Plan & Spatial Layout Studio</h2>
            <p>Design stages, FOH mix stations, VIP hospitality lounges, and fire egress clearance pathways.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={() => {
              setFloorPlanElements([
                { id: 'stg1', name: 'Main Stage & 4K LED Screen', type: 'stage', x: 220, y: 25, w: 260, h: 85, color: '#6366f1', power: '24 kW', cap: '20 Performers' },
                { id: 'av1', name: 'FOH Audio & Lighting Desk', type: 'av', x: 280, y: 340, w: 140, h: 55, color: '#ec4899', power: '8 kW', cap: '4 Engineers' },
                { id: 'vip1', name: 'VIP Lounge & Executive Suite', type: 'vip', x: 35, y: 140, w: 130, h: 120, color: '#f59e0b', power: '5 kW', cap: '45 Guests' },
                { id: 'gen1', name: 'Orchestra Seating Zone A', type: 'seating', x: 195, y: 135, w: 140, h: 180, color: '#3b82f6', power: '1 kW', cap: '250 Seats' },
                { id: 'gen2', name: 'Orchestra Seating Zone B', type: 'seating', x: 365, y: 135, w: 140, h: 180, color: '#3b82f6', power: '1 kW', cap: '250 Seats' },
                { id: 'bvr1', name: 'Catering Hub & Refreshments', type: 'catering', x: 535, y: 140, w: 130, h: 120, color: '#10b981', power: '12 kW', cap: '60 Patrons' },
                { id: 'em1', name: 'Emergency Exit Route Alpha', type: 'exit', x: 35, y: 350, w: 110, h: 45, color: '#ef4444', power: '0 kW', cap: 'Egress Pass' },
                { id: 'em2', name: 'Emergency Exit Route Beta', type: 'exit', x: 555, y: 350, w: 110, h: 45, color: '#ef4444', power: '0 kW', cap: 'Egress Pass' }
              ]);
              setSelectedFloorItem(null);
              showToast('Floor plan layout reset to default blueprint', 'info');
            }}>
              🔄 Reset Layout
            </button>
            <button className="btn btn-primary" onClick={() => {
              showToast('Venue CAD Blueprint exported as Vector SVG schematic', 'success');
              logAudit('Floor Plan Exported', `Exported 2D spatial layout blueprint for ${activeVenueObj.name}.`, 'Resource', 'Success');
            }}>
              📐 Export Vector Blueprint
            </button>
          </div>
        </div>

        {/* Venue Selector and Quick Placement Tools */}
        <div className="card-container mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Select Target Venue Grid:</label>
              <select 
                value={selectedFloorVenue} 
                onChange={(e) => {
                  setSelectedFloorVenue(e.target.value);
                  setSelectedFloorItem(null);
                }}
                className="form-control"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.name}>{v.name} (Max Cap: {v.capacity})</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-8">
              <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.3rem' }}>Add Stage & Zone Modules:</label>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    const newItem = {
                      id: 'mod_' + Date.now().toString(36),
                      name: 'Acoustic Sound Tower',
                      type: 'av',
                      x: 180 + Math.floor(Math.random() * 300),
                      y: 80 + Math.floor(Math.random() * 150),
                      w: 80,
                      h: 50,
                      color: '#ec4899',
                      power: '6 kW',
                      cap: 'Line Array Rig'
                    };
                    setFloorPlanElements(prev => [...prev, newItem]);
                    setSelectedFloorItem(newItem);
                    showToast('Added Acoustic Sound Tower module', 'info');
                  }}
                >
                  ＋ Sound Tower
                </button>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    const newItem = {
                      id: 'mod_' + Date.now().toString(36),
                      name: 'VIP Hospitality Pod',
                      type: 'vip',
                      x: 80 + Math.floor(Math.random() * 400),
                      y: 120 + Math.floor(Math.random() * 100),
                      w: 110,
                      h: 80,
                      color: '#f59e0b',
                      power: '3 kW',
                      cap: '25 Guests'
                    };
                    setFloorPlanElements(prev => [...prev, newItem]);
                    setSelectedFloorItem(newItem);
                    showToast('Added VIP Hospitality Pod module', 'info');
                  }}
                >
                  ＋ VIP Pod
                </button>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    const newItem = {
                      id: 'mod_' + Date.now().toString(36),
                      name: 'Bleacher Seating Block',
                      type: 'seating',
                      x: 200 + Math.floor(Math.random() * 200),
                      y: 150 + Math.floor(Math.random() * 100),
                      w: 120,
                      h: 100,
                      color: '#3b82f6',
                      power: '0 kW',
                      cap: '100 Seats'
                    };
                    setFloorPlanElements(prev => [...prev, newItem]);
                    setSelectedFloorItem(newItem);
                    showToast('Added Bleacher Seating Block', 'info');
                  }}
                >
                  ＋ Seating Block
                </button>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    const newItem = {
                      id: 'mod_' + Date.now().toString(36),
                      name: 'Merchandise & Sponsor Booth',
                      type: 'vendor',
                      x: 480,
                      y: 280,
                      w: 120,
                      h: 60,
                      color: '#8b5cf6',
                      power: '2 kW',
                      cap: '3 Staff'
                    };
                    setFloorPlanElements(prev => [...prev, newItem]);
                    setSelectedFloorItem(newItem);
                    showToast('Added Merchandise & Sponsor Booth', 'info');
                  }}
                >
                  ＋ Sponsor Booth
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2D Canvas & Inspector Grid */}
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="card-container" style={{ padding: '1rem', backgroundColor: '#0f172a', borderColor: '#334155', position: 'relative' }}>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                <span>📍 <strong>{activeVenueObj.name}</strong> • Spatial Grid (700px × 430px Scale)</span>
                <span>🟢 Fire Marshal Code: Approved Clearance</span>
              </div>

              {/* SVG 2D Interactive Blueprint */}
              <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
                <svg 
                  viewBox="0 0 700 430" 
                  style={{ width: '100%', height: 'auto', backgroundColor: '#090d16', borderRadius: '6px', border: '1px solid #1e293b' }}
                >
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="700" height="430" fill="url(#grid)" />

                  {/* Venue Outer Perimeter */}
                  <rect x="15" y="15" width="670" height="400" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" rx="8" />

                  {/* Stage Direction Label */}
                  <text x="350" y="20" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">▲ NORTH STAGE PROSCENIUM WALL ▲</text>

                  {/* Interactive Floor Plan Elements */}
                  {floorPlanElements.map(el => {
                    const isSelected = selectedFloorItem?.id === el.id;
                    return (
                      <g 
                        key={el.id} 
                        style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                        onClick={() => setSelectedFloorItem(el)}
                      >
                        <rect 
                          x={el.x} 
                          y={el.y} 
                          width={el.w} 
                          height={el.h} 
                          fill={el.color} 
                          fillOpacity={isSelected ? 0.85 : 0.45}
                          stroke={isSelected ? '#ffffff' : el.color} 
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          rx="4"
                        />
                        <text 
                          x={el.x + el.w / 2} 
                          y={el.y + el.h / 2 - 4} 
                          fill="#ffffff" 
                          fontSize={el.w < 100 ? '9' : '11'} 
                          fontWeight="bold" 
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {el.name}
                        </text>
                        <text 
                          x={el.x + el.w / 2} 
                          y={el.y + el.h / 2 + 10} 
                          fill="#cbd5e1" 
                          fontSize="8.5" 
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {el.cap}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>💡 Click any zone block to view engineering specs, wattage load, and capacity limits.</span>
                <span>Perimeter: {activeVenueObj.city || 'Urban Met'}</span>
              </div>
            </div>
          </div>

          {/* Element Inspector Card */}
          <div className="col-12 col-lg-4">
            <div className="card-container h-100">
              <div className="card-title-row mb-3">
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>🔍 Spatial Inspector</h3>
                {selectedFloorItem && (
                  <span className="badge-status available" style={{ fontSize: '0.75rem' }}>Active Selection</span>
                )}
              </div>

              {selectedFloorItem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: '6px', borderLeft: `4px solid ${selectedFloorItem.color}` }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-900)' }}>{selectedFloorItem.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Zone Module #{selectedFloorItem.id}
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="card-container p-2 text-center" style={{ backgroundColor: '#ffffff' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Power Draw</div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--primary-700)' }}>⚡ {selectedFloorItem.power}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="card-container p-2 text-center" style={{ backgroundColor: '#ffffff' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Capacity Spec</div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--success-700)' }}>👥 {selectedFloorItem.cap}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Spatial X Position (px):</label>
                    <input 
                      type="range" 
                      min="20" 
                      max="550" 
                      value={selectedFloorItem.x} 
                      onChange={(e) => {
                        const newX = Number(e.target.value);
                        setFloorPlanElements(prev => prev.map(item => item.id === selectedFloorItem.id ? { ...item, x: newX } : item));
                        setSelectedFloorItem(prev => ({ ...prev, x: newX }));
                      }}
                      style={{ width: '100%', accentColor: selectedFloorItem.color }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Spatial Y Position (px):</label>
                    <input 
                      type="range" 
                      min="20" 
                      max="350" 
                      value={selectedFloorItem.y} 
                      onChange={(e) => {
                        const newY = Number(e.target.value);
                        setFloorPlanElements(prev => prev.map(item => item.id === selectedFloorItem.id ? { ...item, y: newY } : item));
                        setSelectedFloorItem(prev => ({ ...prev, y: newY }));
                      }}
                      style={{ width: '100%', accentColor: selectedFloorItem.color }}
                    />
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    <button 
                      className="btn btn-secondary btn-small w-100 text-danger"
                      onClick={() => {
                        setFloorPlanElements(prev => prev.filter(item => item.id !== selectedFloorItem.id));
                        setSelectedFloorItem(null);
                        showToast('Removed module from layout', 'info');
                      }}
                    >
                      🗑️ Delete Element
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👆</div>
                  <p style={{ fontSize: '0.85rem' }}>Click on any stage, audio booth, or seating block on the blueprint canvas to inspect and calibrate positioning.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 14. REAL-TIME ENVIRONMENTAL SAFETY & WEATHER RADAR
  // =========================================================================
  const renderWeatherTab = () => {
    const WEATHER_DATA = {
      'Innovation Arena': {
        city: 'San Francisco, CA',
        temp: '68°F',
        condition: 'Partly Cloudy',
        icon: '⛅',
        windSpeed: '12 mph',
        windGust: '16 mph',
        windSafe: true,
        rainProb: '10%',
        humidity: '58%',
        aqi: '34 (Good)',
        uvIndex: '5 (Moderate)',
        soundAdvisory: 'Decibel limit 95 dBA curfew at 22:00 PST'
      },
      'Grand Exhibition Hall': {
        city: 'Chicago, IL',
        temp: '74°F',
        condition: 'Sunny & Clear',
        icon: '☀️',
        windSpeed: '9 mph',
        windGust: '14 mph',
        windSafe: true,
        rainProb: '5%',
        humidity: '45%',
        aqi: '42 (Good)',
        uvIndex: '7 (High)',
        soundAdvisory: 'Indoor acoustically sealed venue — zero outdoor bleed'
      },
      'Skyview Pavilion': {
        city: 'Austin, TX',
        temp: '88°F',
        condition: 'Hot & Breezy',
        icon: '🌤️',
        windSpeed: '18 mph',
        windGust: '26 mph',
        windSafe: false,
        rainProb: '25%',
        humidity: '62%',
        aqi: '48 (Moderate)',
        uvIndex: '9 (Very High)',
        soundAdvisory: 'Outdoor canopy: Wind gust warning active (>25mph). Deploy extra stage ballast.'
      },
      'Metropolitan Center': {
        city: 'New York, NY',
        temp: '71°F',
        condition: 'Scattered Showers',
        icon: '🌧️',
        windSpeed: '11 mph',
        windGust: '15 mph',
        windSafe: true,
        rainProb: '65%',
        humidity: '78%',
        aqi: '38 (Good)',
        uvIndex: '4 (Moderate)',
        soundAdvisory: 'Rain covers required on FOH cabling and secondary power distribution transformers.'
      }
    };

    const curWeather = WEATHER_DATA[selectedWeatherVenue] || WEATHER_DATA['Innovation Arena'];

    return (
      <div className="tab-pane-content">
        <div className="content-page-header">
          <div>
            <h2>🌦️ Real-Time Environmental Safety & Weather Radar</h2>
            <p>Live staging conditions, line-array wind shear safety thresholds, and heat hydration advisories.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={() => showToast('Weather telemetry synced with NOAA & OpenMeteo APIs', 'info')}>
              🔄 Refresh Sensor Feed
            </button>
            <button className="btn btn-primary" onClick={() => {
              showToast(`Safety advisory broadcast dispatched to on-site stage managers for ${selectedWeatherVenue}`, 'success');
              logAudit('Weather Safety Advisory', `Dispatched environmental safety memo for ${selectedWeatherVenue} (${curWeather.condition}, Wind: ${curWeather.windSpeed}).`, 'System', 'Info');
            }}>
              📢 Broadcast Safety Memo
            </button>
          </div>
        </div>

        {/* Venue Location Switcher Bar */}
        <div className="card-container mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)', marginRight: '0.75rem' }}>
                Monitored Venue Site:
              </span>
              <div className="btn-group" style={{ display: 'inline-flex', gap: '0.4rem' }}>
                {Object.keys(WEATHER_DATA).map(vName => (
                  <button 
                    key={vName}
                    className={`btn btn-small ${selectedWeatherVenue === vName ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedWeatherVenue(vName)}
                  >
                    {vName}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              🛰️ Station: {curWeather.city} • Lat 37.77 / Long -122.41
            </div>
          </div>
        </div>

        {/* Main Weather Telemetry Grid */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-4">
            <div className="card-container h-100" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderColor: '#334155' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Live Ambient Climate</div>
                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0.2rem 0' }}>{selectedWeatherVenue}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{curWeather.city}</div>
                </div>
                <div style={{ fontSize: '3rem' }}>{curWeather.icon}</div>
              </div>

              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#38bdf8' }}>{curWeather.temp}</span>
                <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>{curWeather.condition}</span>
              </div>

              <div style={{ padding: '0.65rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                {curWeather.soundAdvisory}
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="card-container text-center p-3">
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>💨 Wind Velocity</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0.25rem 0' }}>{curWeather.windSpeed}</div>
                  <span className={`badge-status ${curWeather.windSafe ? 'available' : 'collision'}`} style={{ fontSize: '0.72rem' }}>
                    {curWeather.windSafe ? 'Safe for Rigging' : '⚠️ Gusts > 25mph'}
                  </span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card-container text-center p-3">
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>🌧️ Rain Probability</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0.25rem 0' }}>{curWeather.rainProb}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Humidity: {curWeather.humidity}</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card-container text-center p-3">
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>🍃 Air Quality Index</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)', margin: '0.25rem 0' }}>{curWeather.aqi}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Optimal Breathability</span>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card-container text-center p-3">
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>☀️ UV Radiation</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning-600)', margin: '0.25rem 0' }}>{curWeather.uvIndex}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Shade Tents Active</span>
                </div>
              </div>

              {/* Safety Compliance Checklist */}
              <div className="col-12">
                <div className="card-container">
                  <div className="card-title-row mb-2">
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>🛡️ On-Site Production Environmental Protocols</h4>
                    <span className="badge-status available" style={{ fontSize: '0.75rem' }}>All Systems Nominal</span>
                  </div>
                  <div className="row g-2" style={{ fontSize: '0.82rem' }}>
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-2 p-2" style={{ backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
                        <span>✅</span>
                        <span><strong>Truss & Lighting Rig:</strong> Base weight ballasts rated for 35 mph wind shear.</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-2 p-2" style={{ backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
                        <span>✅</span>
                        <span><strong>Outdoor Audio Arrays:</strong> Decibel monitoring sensors calibrated at FOH perimeter.</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-2 p-2" style={{ backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
                        <span>✅</span>
                        <span><strong>Power Distribution & GenSets:</strong> IP65 waterproof enclosures active.</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-2 p-2" style={{ backgroundColor: 'var(--slate-50)', borderRadius: '4px' }}>
                        <span>✅</span>
                        <span><strong>Attendee Hydration:</strong> 4x Water stations deployed across venue concourse.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 15. LIVE SYSTEM AUDIT LOG & SECURITY STREAM
  // =========================================================================
  const renderAuditTab = () => {
    const filteredLogs = auditLogs.filter(log => {
      const matchCat = auditFilterCategory === 'ALL' || log.category === auditFilterCategory;
      const matchSearch = !auditSearch || 
        log.actor?.toLowerCase().includes(auditSearch.toLowerCase()) || 
        log.action?.toLowerCase().includes(auditSearch.toLowerCase()) || 
        log.details?.toLowerCase().includes(auditSearch.toLowerCase());
      return matchCat && matchSearch;
    });

    return (
      <div className="tab-pane-content">
        <div className="content-page-header">
          <div>
            <h2>📜 Live System Audit Log & Security Stream</h2>
            <p>Real-time forensic telemetry tracking user credential changes, 1-click collision resolutions, and financial approvals.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary" onClick={async () => {
              try {
                const res = await fetch('/api/audit');
                if (res.ok) {
                  const data = await res.json();
                  setAuditLogs(data);
                  showToast('Audit stream refreshed with latest telemetry', 'info');
                }
              } catch(e) {
                showToast('Failed to refresh audit stream', 'error');
              }
            }}>
              🔄 Refresh Stream
            </button>
            <button className="btn btn-primary" onClick={() => {
              const headers = 'ID,Timestamp,Actor,Role,Category,Action,Details,Severity\n';
              const rows = filteredLogs.map(l => 
                `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.category}","${l.action}","${(l.details || '').replace(/"/g, '""')}","${l.severity}"`
              ).join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `APEX_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showToast('Audit trail exported as CSV', 'success');
            }}>
              📥 Export Audit CSV
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card-container mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <input 
                type="text" 
                placeholder="🔍 Search audit logs by actor, action, or keyword..." 
                value={auditSearch} 
                onChange={(e) => setAuditSearch(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
              {['ALL', 'Security', 'Conflict', 'Budget', 'Resource', 'System'].map(cat => (
                <button 
                  key={cat}
                  className={`btn btn-small ${auditFilterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAuditFilterCategory(cat)}
                >
                  {cat === 'ALL' ? 'All Activities' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="table-card-wrapper">
          <div className="table-toolbar">
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Activity Stream ({filteredLogs.length} Entries)
            </div>
          </div>
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor / Role</th>
                  <th>Category</th>
                  <th>Action</th>
                  <th>Details & Context</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No activity logs match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                        {new Date(log.timestamp).toLocaleString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' 
                        })}
                      </td>
                      <td>
                        <strong>{log.actor}</strong>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--slate-500)' }}>{log.role}</span>
                      </td>
                      <td>
                        <span className="card-badge-pill" style={{ 
                          fontWeight: 600,
                          backgroundColor: log.category === 'Security' ? 'rgba(239, 68, 68, 0.1)' :
                                           log.category === 'Conflict' ? 'rgba(245, 158, 11, 0.1)' :
                                           log.category === 'Budget' ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-50)',
                          color: log.category === 'Security' ? '#dc2626' :
                                 log.category === 'Conflict' ? '#d97706' :
                                 log.category === 'Budget' ? '#059669' : 'var(--primary-700)'
                        }}>
                          {log.category}
                        </span>
                      </td>
                      <td><strong>{log.action}</strong></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--slate-700)', maxWidth: '350px' }}>
                        {log.details}
                      </td>
                      <td>
                        <span className={`badge-status ${log.severity === 'Success' ? 'available' : log.severity === 'Warning' ? 'collision' : 'pending'}`} style={{ fontSize: '0.75rem' }}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="app-workspace">
      
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)}></div>
      )}

      {/* =========================================================================
          ENTERPRISE NAVIGATION SIDEBAR
          ========================================================================= */}
      <aside className={`app-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="sidebar-logo-icon">▲</div>
          <div className="sidebar-brand-text">
            <h1>APEX</h1>
            <p>RESOURCE MATRIX</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="sidebar-nav-container">
          {/* OVERVIEW & CLIENT PORTAL */}
          <div>
            <div className="nav-section-label">Overview</div>
            <div className="sidebar-nav-group">
              <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}>
                <span className="nav-icon">📊</span>
                <span>Dashboard</span>
              </button>
              <a href="/" className="nav-item" style={{ textDecoration: 'none' }} title="Open Public Landing Page">
                <span className="nav-icon">🌐</span>
                <span>Public Landing Page</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--primary-600)' }}>→</span>
              </a>
            </div>
          </div>

          {/* EVENT MANAGEMENT */}
          {(allowedTabs.includes('events') || allowedTabs.includes('tasks') || allowedTabs.includes('calendar')) && (
            <div>
              <div className="nav-section-label">Events & Schedule</div>
              <div className="sidebar-nav-group">
                {allowedTabs.includes('events') && (
                  <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => { setActiveTab('events'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">📅</span>
                    <span>{currentPersona.roleCode === 'STAFF' ? 'My Events' : currentPersona.roleCode === 'ORGANIZER' ? 'My Assigned Event' : 'Events Workspace'}</span>
                  </button>
                )}
                {allowedTabs.includes('calendar') && (
                  <button className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => { setActiveTab('calendar'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🗓️</span>
                    <span>{currentPersona.roleCode === 'STAFF' ? 'My Schedule' : 'Calendar & Gantt'}</span>
                  </button>
                )}
                {allowedTabs.includes('tasks') && (
                  <button className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">✅</span>
                    <span>{currentPersona.roleCode === 'STAFF' ? 'My Tasks' : 'Task Tracker'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESOURCES */}
          {(allowedTabs.includes('staff') || allowedTabs.includes('equipment') || allowedTabs.includes('venues') || allowedTabs.includes('vendors')) && (
            <div>
              <div className="nav-section-label">Resources</div>
              <div className="sidebar-nav-group">
                {allowedTabs.includes('staff') && (
                  <button className={`nav-item ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => { setActiveTab('staff'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">👥</span>
                    <span>{currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Staff' : 'Staff & Crew'}</span>
                  </button>
                )}
                {allowedTabs.includes('equipment') && (
                  <button className={`nav-item ${activeTab === 'equipment' ? 'active' : ''}`} onClick={() => { setActiveTab('equipment'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">📦</span>
                    <span>Equipment Stock</span>
                  </button>
                )}
                {allowedTabs.includes('venues') && (
                  <button className={`nav-item ${activeTab === 'venues' ? 'active' : ''}`} onClick={() => { setActiveTab('venues'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🏛️</span>
                    <span>Venues Registry</span>
                  </button>
                )}
                {allowedTabs.includes('vendors') && (
                  <button className={`nav-item ${activeTab === 'vendors' ? 'active' : ''}`} onClick={() => { setActiveTab('vendors'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🤝</span>
                    <span>Vendor Matrix</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* FINANCE & ANALYTICS */}
          {(allowedTabs.includes('budget') || allowedTabs.includes('reports')) && (
            <div>
              <div className="nav-section-label">Finance & Reports</div>
              <div className="sidebar-nav-group">
                {allowedTabs.includes('budget') && (
                  <button className={`nav-item ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => { setActiveTab('budget'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">💰</span>
                    <span>Budgets & POs</span>
                  </button>
                )}
                {allowedTabs.includes('reports') && (
                  <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">📈</span>
                    <span>Executive Reports</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SMART TOOLS & STUDIO */}
          {(allowedTabs.includes('simulator') || allowedTabs.includes('floorplan') || allowedTabs.includes('weather') || allowedTabs.includes('audit')) && (
            <div>
              <div className="nav-section-label">Smart Tools & Audit</div>
              <div className="sidebar-nav-group">
                {allowedTabs.includes('simulator') && (
                  <button className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`} onClick={() => { setActiveTab('simulator'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🧮</span>
                    <span>ROI Simulator</span>
                  </button>
                )}
                {allowedTabs.includes('floorplan') && (
                  <button className={`nav-item ${activeTab === 'floorplan' ? 'active' : ''}`} onClick={() => { setActiveTab('floorplan'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">📐</span>
                    <span>Venue Studio 2D</span>
                  </button>
                )}
                {allowedTabs.includes('weather') && (
                  <button className={`nav-item ${activeTab === 'weather' ? 'active' : ''}`} onClick={() => { setActiveTab('weather'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🌦️</span>
                    <span>Weather Radar</span>
                  </button>
                )}
                {allowedTabs.includes('audit') && (
                  <button className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => { setActiveTab('audit'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">📜</span>
                    <span>Audit Stream</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SYSTEM & CLOUD */}
          {(allowedTabs.includes('aws') || allowedTabs.includes('admin')) && (
            <div>
              <div className="nav-section-label">System & Security</div>
              <div className="sidebar-nav-group">
                {allowedTabs.includes('aws') && (
                  <button className={`nav-item ${activeTab === 'aws' ? 'active' : ''}`} onClick={() => { setActiveTab('aws'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">☁️</span>
                    <span>AWS Cloud Center</span>
                  </button>
                )}
                {allowedTabs.includes('admin') && (
                  <button className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => { setActiveTab('admin'); setMobileSidebarOpen(false); }}>
                    <span className="nav-icon">🛡️</span>
                    <span>Users & RBAC Roles</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Identity Footer */}
        <div className="sidebar-user-footer">
          <div 
            className="persona-profile-pill" 
            style={{ cursor: 'pointer', transition: 'background-color var(--transition-fast)', padding: '0.25rem 0.4rem', borderRadius: 'var(--radius-sm)' }}
            onClick={() => { setModalData(currentPersona); setActiveModal('my-credentials'); }}
            title="Click to Edit Your Corporate Mail ID & Password"
          >
            <div className="persona-avatar">{currentPersona.avatar}</div>
            <div className="persona-details">
              <div className="persona-name">{currentPersona.name}</div>
              <div className="persona-role">{currentPersona.userRole}</div>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-400)', marginLeft: 'auto' }} title="Edit Profile & Password">⚙️</span>
          </div>

          <button 
            type="button"
            className="btn btn-secondary btn-small w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
            style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}
            onClick={() => {
              localStorage.removeItem('erams_auth');
              localStorage.removeItem('erams_persona');
              sessionStorage.removeItem('erams_auth');
              sessionStorage.removeItem('erams_persona');
              window.location.href = '/';
            }}
            title="Logout and return to Public Landing Page"
          >
            <span>🚪 Sign Out to Landing Page</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN APPLICATION LAYOUT AREA
          ========================================================================= */}
      <div className="app-main-layout">
        
        {/* TOP NAVIGATION BAR */}
        <header className="app-topbar">
          <div className="topbar-left">
            {/* Mobile Hamburger Button */}
            <button className="btn btn-secondary btn-small d-lg-none" onClick={() => setMobileSidebarOpen(prev => !prev)}>
              <span>☰</span>
            </button>

            {/* Breadcrumb Navigation */}
            <div className="breadcrumb-area">
              <span className="breadcrumb-root">APEX</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-active" style={{ textTransform: 'capitalize' }}>
                {activeTab === 'aws' ? 'AWS Cloud' : 
                 activeTab === 'simulator' ? 'ROI Simulator' : 
                 activeTab === 'floorplan' ? 'Venue Studio 2D' : 
                 activeTab === 'weather' ? 'Weather Radar' : 
                 activeTab === 'audit' ? 'Live Audit Stream' : activeTab}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Direct Link to Client Portal */}
            <a 
              href="/" 
              className="btn btn-secondary btn-small d-none d-lg-inline-flex align-items-center gap-1"
              title="Open Public Client Event Portal"
              style={{ textDecoration: 'none', color: 'var(--primary-700)', borderColor: 'var(--primary-200)', backgroundColor: 'var(--primary-50)' }}
            >
              <span>🌐 Portal</span>
            </a>

            {/* Command Palette Trigger */}
            <button className="search-trigger-btn" onClick={() => setCommandPaletteOpen(true)} title="Quick Command Palette (Ctrl+K)">
              <span>🔍</span>
              <span className="d-none d-md-inline">Search</span>
              <span className="search-kbd-pill d-none d-md-inline">Ctrl+K</span>
            </button>

            {/* Real-Time Conflict Status Chip */}
            {totalConflictsCount > 0 ? (
              <div className="status-chip collision d-none d-sm-inline-flex" onClick={() => setActiveTab('dashboard')} title="Active Resource Collision Warnings">
                <span className="pulse-dot anim"></span>
                <span>{totalConflictsCount} Clash{totalConflictsCount > 1 ? 'es' : ''}</span>
              </div>
            ) : (
              <div className="status-chip clean d-none d-sm-inline-flex" title="All Resources & Schedules Synced">
                <span className="pulse-dot"></span>
                <span>All Clear</span>
              </div>
            )}

            {/* 1-Click Conflict Auto-Resolver (Desktop) */}
            <button className="btn btn-warning btn-small d-none d-lg-inline-flex" onClick={handleAutoResolve} title="Smart Auto-Resolve Collisions">
              <span>⚡ Auto-Resolve</span>
            </button>

            {/* Export Data Modal Trigger (Desktop) */}
            <button className="btn btn-secondary btn-small d-none d-md-inline-flex" onClick={() => setActiveModal('export')} title="Export Reports & Manifests">
              <span>📥 Export</span>
            </button>

            {/* Currency Selector (Desktop) */}
            <select 
              className="d-none d-lg-inline-block"
              value={currency} 
              onChange={(e) => handleCurrencyChange(e.target.value)} 
              style={{ width: 'auto', padding: '0.35rem 1.8rem 0.35rem 0.65rem', fontSize: '0.8rem', height: '32px' }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>

            {/* Shortcuts Sheet Button (Desktop) */}
            <button className="btn btn-secondary btn-small d-none d-xl-inline-flex" onClick={() => setShortcutsOpen(true)} title="Keyboard Shortcuts Sheet">
              <span>⌨️</span>
            </button>

            {/* User Credentials & Profile Settings Trigger */}
            <button 
              className="btn btn-secondary btn-small d-inline-flex align-items-center gap-1" 
              onClick={() => { setModalData(currentPersona); setActiveModal('my-credentials'); }}
              title="Edit User Profile & Credentials"
            >
              <span>👤 {currentPersona.name.split(' ')[0]}</span>
            </button>

            {/* Sign Out Button */}
            <button className="btn btn-danger btn-small" onClick={handleLogout} title="Sign Out">
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE VIEWPORT */}
        <main className="app-content-viewport">

          {/* 403 ACCESS RESTRICTED GUARD */}
          {!allowedTabs.includes(activeTab) && (
            <div className="card-container text-center" style={{ maxWidth: '640px', margin: '4rem auto', padding: '3.5rem 2rem' }}>
              <div style={{ fontSize: '3.8rem', marginBottom: '1rem' }}>⛔</div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--danger-700)', marginBottom: '0.75rem', fontWeight: 800 }}>
                403 — Access Restricted
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-700)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                You don't have permission to access the <strong>{activeTab.toUpperCase()}</strong> module.
              </p>
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.86rem' }}>
                <div><strong>Current Persona:</strong> {currentPersona.name} ({currentPersona.email})</div>
                <div style={{ marginTop: '0.4rem' }}><strong>Assigned Role:</strong> <span className="badge-status in-progress" style={{ fontWeight: 700 }}>{currentPersona.userRole}</span></div>
                <div style={{ marginTop: '0.4rem' }}><strong>Operational Scope:</strong> {currentPersona.tag}</div>
                <div style={{ marginTop: '0.6rem', color: 'var(--slate-500)', borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem' }}>
                  🔒 All mutations and data access are verified server-side. Lower-level operational roles cannot access administrative configuration or unrelated event domains.
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveTab('dashboard')} 
                style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 700 }}
              >
                ↩ Return to Authorized Dashboard
              </button>
            </div>
          )}

          {/* =========================================================================
              1. ROLE-SPECIFIC DASHBOARD VIEWS
              ========================================================================= */}
          {activeTab === 'dashboard' && allowedTabs.includes('dashboard') && (
            <div>
              {/* SUPER ADMIN DASHBOARD */}
              {currentPersona.roleCode === 'SUPER_ADMIN' && (
                <div>
                  <div className="content-page-header">
                    <div>
                      <h2>👑 Super Admin Platform Command Center</h2>
                      <p>Full platform governance: System-wide event oversight, Event Admin management, resource conflict resolution, and cloud infra.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => setActiveTab('admin')}>
                        🛡️ Manage Roles & Users
                      </button>
                      <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('event'); }}>
                        ＋ Create Event
                      </button>
                    </div>
                  </div>

                  {/* Critical Alert Banner */}
                  {totalConflictsCount > 0 ? (
                    <div className="alert-banner warning">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>System-Wide Resource Collisions Detected</h4>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--warning-700)' }}>
                            {conflicts.staffConflicts?.length || 0} staff collision(s), {conflicts.equipmentConflicts?.length || 0} gear deficit(s), and {conflicts.venueConflicts?.length || 0} venue collision(s).
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-warning btn-small" onClick={handleAutoResolve} style={{ fontWeight: 700 }}>
                        ⚡ 1-Click Auto-Resolve All
                      </button>
                    </div>
                  ) : (
                    <div className="alert-banner success" style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>✓</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.92rem' }}>All System Resources & Timelines Synced</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success-700)' }}>
                            Platform-wide zero collision state across all active events, crew schedules, and gear inventory.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Metric Cards */}
                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-box blue">📅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Total Platform Events</div>
                        <div className="kpi-val">{events.length}</div>
                        <div className="kpi-sub">{events.filter(e => e.status === 'Confirmed').length} Confirmed • {events.filter(e => e.status === 'Draft').length} Draft</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box purple">👔</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Event Admins & Organizers</div>
                        <div className="kpi-val">
                          {users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length + users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length}
                        </div>
                        <div className="kpi-sub">{users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length} Admins • {users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length} Organizers</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box green">👥</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Total Staff Pool</div>
                        <div className="kpi-val">{staff.length}</div>
                        <div className="kpi-sub">{staff.filter(s => !s.isDoubleBooked).length} Available • {staff.filter(s => s.isDoubleBooked).length} Collisions</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box amber">💰</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Total Platform Spend</div>
                        <div className="kpi-val">
                          {currencySymbol}{((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="kpi-sub">
                          {analytics?.overallBurnPercent || 0}% of {currencySymbol}{((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} Cap
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EVENT ADMIN DASHBOARD */}
              {currentPersona.roleCode === 'EVENT_ADMIN' && (
                <div>
                  <div className="content-page-header">
                    <div>
                      <h2>👔 Event Admin Operations Dashboard</h2>
                      <p>Managing assigned event scopes, delegating organizers, scheduling staff crew, and tracking event expenditure.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('event'); }}>
                        ＋ Create Event
                      </button>
                    </div>
                  </div>

                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-box blue">📅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Managed Events</div>
                        <div className="kpi-val">{events.length}</div>
                        <div className="kpi-sub">Assigned to your management scope</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box purple">📋</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Assigned Organizers</div>
                        <div className="kpi-val">{users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length}</div>
                        <div className="kpi-sub">Direct event coordinators</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box green">👥</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Staff Crew</div>
                        <div className="kpi-val">{staff.length}</div>
                        <div className="kpi-sub">Available for event deployment</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box amber">💰</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Scope Spend</div>
                        <div className="kpi-val">
                          {currencySymbol}{((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="kpi-sub">Managed event expenditure</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ORGANIZER DASHBOARD */}
              {currentPersona.roleCode === 'ORGANIZER' && (
                <div>
                  <div className="content-page-header">
                    <div>
                      <h2>📋 Event Organizer Operational Workspace</h2>
                      <p>Operational execution for assigned event: task tracking, crew coordination, and hardware logistics.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('task'); }}>
                        ＋ Create Task
                      </button>
                    </div>
                  </div>

                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-box blue">📅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Assigned Event</div>
                        <div className="kpi-val" style={{ fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {events[0]?.title || 'Tech Summit 2026'}
                        </div>
                        <div className="kpi-sub">📍 {events[0]?.venue || 'Innovation Arena'}</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box green">👥</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Assigned Staff</div>
                        <div className="kpi-val">{staff.filter(s => s.assignedEventId === (events[0]?.id || 'ev1')).length || 2}</div>
                        <div className="kpi-sub">Staff crew deployed to this event</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box purple">✅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Active Tasks</div>
                        <div className="kpi-val">{tasks.length}</div>
                        <div className="kpi-sub">{tasks.filter(t => t.status === 'Completed').length} Done • {tasks.filter(t => t.status !== 'Completed').length} Pending</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box amber">📦</div>
                      <div className="kpi-body">
                        <div className="kpi-label">Allocated Equipment</div>
                        <div className="kpi-val">{equipment.length}</div>
                        <div className="kpi-sub">Gear assigned to venue</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAFF DASHBOARD */}
              {currentPersona.roleCode === 'STAFF' && (
                <div>
                  <div className="content-page-header">
                    <div>
                      <h2>👷 Staff Operations & Task Checklist</h2>
                      <p>View your assigned shifts, run-of-show details, and update execution status on assigned tasks.</p>
                    </div>
                  </div>

                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-icon-box blue">📅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">My Assigned Event</div>
                        <div className="kpi-val" style={{ fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {events[0]?.title || 'Tech Summit 2026'}
                        </div>
                        <div className="kpi-sub">📍 {events[0]?.venue || 'Innovation Arena'}</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box amber">⏳</div>
                      <div className="kpi-body">
                        <div className="kpi-label">My Pending Tasks</div>
                        <div className="kpi-val">{tasks.filter(t => t.status !== 'Completed').length}</div>
                        <div className="kpi-sub">Tasks awaiting completion</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box green">✅</div>
                      <div className="kpi-body">
                        <div className="kpi-label">My Completed Tasks</div>
                        <div className="kpi-val">{tasks.filter(t => t.status === 'Completed').length}</div>
                        <div className="kpi-sub">Submitted & validated</div>
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-icon-box purple">👤</div>
                      <div className="kpi-body">
                        <div className="kpi-label">My Shift Profile</div>
                        <div className="kpi-val" style={{ fontSize: '1.1rem' }}>Active</div>
                        <div className="kpi-sub">{currentPersona.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Staff Interactive Task Board */}
                  <div className="table-card-wrapper mb-4">
                    <div className="table-toolbar">
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>📝 My Assigned Operational Tasks</div>
                    </div>
                    <div className="table-responsive">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>Task Description</th>
                            <th>Event</th>
                            <th>Priority</th>
                            <th>Deadline</th>
                            <th>Current Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-400)' }}>No tasks currently assigned to your roster.</td></tr>
                          ) : (
                            tasks.map(t => (
                              <tr key={t.id}>
                                <td><strong>{t.title}</strong><div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{t.description}</div></td>
                                <td>{events.find(e => e.id === t.eventId)?.title || t.eventId}</td>
                                <td>
                                  <span className={`badge-status ${t.priority === 'High' ? 'collision' : 'draft'}`}>{t.priority}</span>
                                </td>
                                <td>{t.deadline || 'Today'}</td>
                                <td>
                                  <span className={`badge-status ${t.status === 'Completed' ? 'available' : t.status === 'In Progress' ? 'in-progress' : 'pending'}`}>
                                    {t.status}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                                    {t.status !== 'In Progress' && t.status !== 'Completed' && (
                                      <button 
                                        className="btn btn-secondary btn-small"
                                        onClick={() => handleUpdateTaskStatus(t.id, 'In Progress', 'Started work on task')}
                                      >
                                        ▶ Start
                                      </button>
                                    )}
                                    {t.status !== 'Completed' && (
                                      <button 
                                        className="btn btn-primary btn-small"
                                        onClick={() => handleUpdateTaskStatus(t.id, 'Completed', 'Task finished on schedule')}
                                      >
                                        ✓ Complete
                                      </button>
                                    )}
                                    {t.status === 'Completed' && (
                                      <span style={{ fontSize: '0.8rem', color: 'var(--success-700)', fontWeight: 600 }}>✓ Done</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* UPCOMING EVENTS & SCHEDULES TABLE (For Admins and Organizers) */}
              {currentPersona.roleCode !== 'STAFF' && (
                <div className="table-card-wrapper mb-4">
                  <div className="table-toolbar">
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Event Run-of-Show' : 'Active Event Schedules & Financial Rollup'}
                    </div>
                    <button className="btn btn-secondary btn-small" onClick={() => setActiveTab('events')}>
                      View All in Events Workspace →
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="enterprise-table">
                      <thead>
                        <tr>
                          <th>Event Title</th>
                          <th>Venue Location</th>
                          <th>Date Window</th>
                          <th>Duration</th>
                          <th>Budget Cap</th>
                          <th>Actual Spend</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(ev => (
                          <tr key={ev.id}>
                            <td>
                              <strong>{ev.title}</strong>
                              {ev.hasConflict && <span style={{ color: 'var(--danger-500)', marginLeft: '0.4rem' }}>⚠️</span>}
                            </td>
                            <td>📍 {ev.venue}</td>
                            <td>{ev.startDate} to {ev.endDate}</td>
                            <td>{ev.durationDays} days</td>
                            <td>{currencySymbol}{(ev.budget * currencyRate).toLocaleString()}</td>
                            <td>
                              <strong>{currencySymbol}{((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
                            </td>
                            <td>
                              <span className={`badge-status ${ev.status.toLowerCase().replace(' ', '-')}`}>
                                {ev.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-secondary btn-small" 
                                onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}
                              >
                                Inspect Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 30-DAY VISUAL GANTT TIMELINE */}
              <div className="card-container">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>🗓️ Run-of-Show Scheduling Timeline (September 2026)</h3>
                <div className="timeline-visual-container">
                  <div className="timeline-days-ruler">
                    <div style={{ textAlign: 'left', paddingLeft: '0.5rem' }}>Event Title</div>
                    {Array.from({ length: 30 }, (_, d) => (
                      <div key={d} className="ruler-day">{d + 1}</div>
                    ))}
                  </div>
                  <div className="timeline-rows">
                    {events.map(ev => {
                      const startDay = parseInt(ev.startDate.split('-')[2] || '1', 10);
                      const endDay = parseInt(ev.endDate.split('-')[2] || '3', 10);
                      const leftPercent = ((startDay - 1) / 30) * 100;
                      const widthPercent = Math.max(4, ((endDay - startDay + 1) / 30) * 100);

                      return (
                        <div key={ev.id} className="timeline-row">
                          <div className="timeline-event-name" onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}>
                            {ev.title}
                          </div>
                          <div className="timeline-track">
                            <div 
                              className={`timeline-bar ${ev.hasConflict ? 'conflict' : ev.status === 'Draft' ? 'draft' : ''}`}
                              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                              onClick={() => { setSelectedEventId(ev.id); setActiveTab('events'); }}
                            >
                              {ev.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. EVENTS WORKSPACE (LIST & KANBAN VIEWS)
              ========================================================================= */}
          {activeTab === 'events' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Events & Scheduling Workspace</h2>
                  <p>Organize, schedule, and allocate staff, equipment, and vendors to events.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="btn-group" style={{ display: 'inline-flex', background: 'var(--slate-100)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                    <button 
                      className={`btn btn-small ${eventViewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`} 
                      onClick={() => setEventViewMode('list')}
                    >
                      🗂️ Split Inspector
                    </button>
                    <button 
                      className={`btn btn-small ${eventViewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`} 
                      onClick={() => setEventViewMode('kanban')}
                    >
                      📋 Kanban Board
                    </button>
                  </div>
                  {(currentPersona.roleCode === 'SUPER_ADMIN' || currentPersona.roleCode === 'EVENT_ADMIN') && (
                    <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('event'); }}>
                      ＋ Add Event
                    </button>
                  )}
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="table-toolbar mb-3" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div className="table-search-box">
                  <span className="table-search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search events by title or venue..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {['ALL', 'CONFIRMED', 'DRAFT', 'IN PROGRESS', 'COMPLETED'].map(st => (
                    <button 
                      key={st}
                      className={`btn btn-small ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setStatusFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {eventViewMode === 'list' ? (
                <div className="row g-4">
                  {/* Left Column: Events Cards List */}
                  <div className="col-12 col-lg-5" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {filteredEvents.map(ev => (
                        <div 
                          key={ev.id} 
                          className="card-container"
                          style={{ 
                            cursor: 'pointer',
                            borderColor: selectedEventId === ev.id ? 'var(--primary-500)' : 'var(--border-light)',
                            backgroundColor: selectedEventId === ev.id ? 'var(--primary-50)' : '#ffffff'
                          }}
                          onClick={() => setSelectedEventId(ev.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--slate-900)' }}>
                              {ev.title} {ev.hasConflict && <span style={{ color: 'var(--danger-500)' }}>⚠️</span>}
                            </h4>
                            <span className={`badge-status ${ev.status.toLowerCase().replace(' ', '-')}`}>{ev.status}</span>
                          </div>
                          <p style={{ fontSize: '0.82rem', margin: '0 0 0.4rem 0', color: 'var(--slate-600)' }}>📍 {ev.venue}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                            <span>📅 {ev.startDate} to {ev.endDate}</span>
                            <span>Spent: <strong>{currencySymbol}{((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, {maximumFractionDigits:0})}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Selected Event Inspector */}
                  <div className="col-12 col-lg-7">
                    {activeEvent ? (
                      <div className="card-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{activeEvent.title}</h3>
                            <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', display: 'flex', gap: '1rem' }}>
                              <span>📍 Venue: <strong>{activeEvent.venue}</strong></span>
                              <span>📅 Window: <strong>{activeEvent.startDate} to {activeEvent.endDate}</strong> ({activeEvent.durationDays} days)</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-secondary btn-small" onClick={() => { setModalData(activeEvent); setActiveModal('event'); }}>Edit</button>
                            <button className="btn btn-danger btn-small" onClick={async () => {
                              if (confirm('Delete this event?')) {
                                await fetch(`/api/events/${activeEvent.id}`, { method: 'DELETE' });
                                showToast('Event deleted', 'success');
                                fetchAllData();
                              }
                            }}>Delete</button>
                          </div>
                        </div>

                        {/* Inspector Sub-Tabs */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                          <button 
                            className={`btn btn-small ${eventSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setEventSubTab('overview')}
                          >
                            ℹ️ Overview & Milestones
                          </button>
                          <button 
                            className={`btn btn-small ${eventSubTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setEventSubTab('resources')}
                          >
                            👥 Resources
                          </button>
                          <button 
                            className={`btn btn-small ${eventSubTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setEventSubTab('tasks')}
                          >
                            ✅ Tasks ({tasks.filter(t => t.eventId === activeEvent.id).length})
                          </button>
                          <button 
                            className={`btn btn-small ${eventSubTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setEventSubTab('budget')}
                          >
                            💰 Budget Variance
                          </button>
                        </div>

                        {eventSubTab === 'overview' && (
                          <div>
                            <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                              {activeEvent.description || 'No descriptive overview provided for this event.'}
                            </p>
                            <h4 style={{ fontSize: '0.92rem', marginBottom: '0.75rem' }}>Hourly Run-of-Show Milestones</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {(activeEvent.milestones || []).map((m, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.82rem' }}>{m.time}</span>
                                  <span style={{ flex: 1, fontSize: '0.85rem' }}>{m.title}</span>
                                  <span className="badge-status confirmed">{m.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {eventSubTab === 'resources' && (
                          <div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                              <button className="btn btn-primary btn-small" onClick={() => { setModalData({ eventId: activeEvent.id }); setActiveModal('assign'); }}>＋ Assign Staff</button>
                              <button className="btn btn-primary btn-small" onClick={() => { setModalData({ eventId: activeEvent.id }); setActiveModal('allocate'); }}>＋ Allocate Hardware</button>
                              <button className="btn btn-primary btn-small" onClick={() => { setModalData({ eventId: activeEvent.id }); setActiveModal('coord'); }}>＋ Add Vendor</button>
                            </div>
                            <p style={{ color: 'var(--slate-500)', fontSize: '0.82rem' }}>
                              Use the action buttons above to assign crew, book warehouse equipment quotas, and engage vendors for this event.
                            </p>
                          </div>
                        )}

                        {eventSubTab === 'tasks' && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Assigned Operational Tasks</h4>
                              <button className="btn btn-primary btn-small" onClick={() => { setModalData({ eventId: activeEvent.id }); setActiveModal('task'); }}>
                                ＋ Add Task
                              </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {tasks.filter(t => t.eventId === activeEvent.id).length === 0 ? (
                                <p style={{ color: 'var(--slate-400)', fontSize: '0.82rem' }}>No tasks created for this event yet.</p>
                              ) : (
                                tasks.filter(t => t.eventId === activeEvent.id).map(t => (
                                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.title}</div>
                                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                                        👤 {t.staff?.name || 'Unassigned'} • ⏰ Due {t.deadline} • Priority: <strong>{t.priority}</strong>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <span className={`badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`}>
                                        {t.status}
                                      </span>
                                      {t.status !== 'Completed' && (
                                        <button className="btn btn-success btn-small" onClick={() => handleUpdateTaskStatus(t.id, 'Completed', 'Marked done by coordinator')}>
                                          ✓ Done
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {eventSubTab === 'budget' && (
                          <div>
                            <h4 style={{ fontSize: '0.92rem', marginBottom: '0.5rem' }}>Budget Cap & Spend Telemetry</h4>
                            <div className="progress-track" style={{ height: '10px', marginBottom: '0.75rem' }}>
                              <div 
                                className={`progress-fill ${(activeEvent.costs?.total || 0) > activeEvent.budget ? 'danger' : ''}`}
                                style={{ width: `${Math.min(100, Math.round(((activeEvent.costs?.total || 0) / (activeEvent.budget || 1)) * 100))}%` }}
                              ></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span>Spent: <strong>{currencySymbol}{((activeEvent.costs?.total || 0) * currencyRate).toLocaleString(undefined, {maximumFractionDigits:0})}</strong></span>
                              <span>Allocated Cap: <strong>{currencySymbol}{(activeEvent.budget * currencyRate).toLocaleString()}</strong></span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="card-container text-center py-5">
                        <span style={{ fontSize: '2.5rem' }}>📅</span>
                        <p style={{ marginTop: '0.5rem' }}>Select an event from the left list to inspect details.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* KANBAN BOARD VIEW */
                <div className="kanban-view-grid">
                  {['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(colStatus => (
                    <div key={colStatus} className="kanban-column">
                      <div className="kanban-col-header">
                        <span className="kanban-col-title">{colStatus}</span>
                        <span className="kanban-col-count">
                          {events.filter(e => e.status === colStatus).length}
                        </span>
                      </div>
                      <div className="kanban-cards-stack">
                        {events.filter(e => e.status === colStatus).map(ev => (
                          <div key={ev.id} className="kanban-card">
                            <div className="kanban-card-title">{ev.title}</div>
                            <div className="kanban-card-meta">📍 {ev.venue}</div>
                            <div className="kanban-card-meta">📅 {ev.startDate} to {ev.endDate}</div>
                            <div className="kanban-card-actions">
                              <button className="btn btn-secondary btn-small" onClick={() => handleMoveKanban(ev.id, 'prev')} disabled={colStatus === 'Draft'}>◀</button>
                              <button className="btn btn-secondary btn-small" onClick={() => handleMoveKanban(ev.id, 'next')} disabled={colStatus === 'Cancelled'}>▶</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              2B. CALENDAR & GANTT TIMELINE DASHBOARD
              ========================================================================= */}
          {activeTab === 'calendar' && renderCalendarTab()}

          {/* =========================================================================
              3. TASK TRACKER (FULL LIFECYCLE MANAGEMENT)
              ========================================================================= */}
          {activeTab === 'tasks' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Operational Task Tracker & Shift Assignments</h2>
                  <p>Assign deliverables to staff members, monitor deadlines, and track real-time completion.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('task'); }}>
                  ＋ Create New Task
                </button>
              </div>

              <div className="table-card-wrapper">
                <div className="table-toolbar">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active Tasks Matrix</div>
                </div>
                <div className="table-responsive">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>Task Title</th>
                        <th>Associated Event</th>
                        <th>Assigned Staff</th>
                        <th>Deadline</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(t => (
                        <tr key={t.id}>
                          <td>
                            <strong>{t.title}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{t.description}</div>
                          </td>
                          <td>📅 {t.event?.title || 'General'}</td>
                          <td>👤 {t.staff?.name || 'Unassigned'} ({t.staff?.role || 'Staff'})</td>
                          <td>⏰ {t.deadline}</td>
                          <td>
                            <span className={`badge-status ${t.priority === 'Urgent' ? 'collision' : t.priority === 'High' ? 'draft' : 'available'}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              {t.status !== 'Completed' && (
                                <button className="btn btn-success btn-small" onClick={() => handleUpdateTaskStatus(t.id, 'Completed', 'Done by user')}>
                                  ✓ Complete
                                </button>
                              )}
                              <button className="btn btn-danger btn-small" onClick={async () => {
                                await fetch(`/api/tasks/${t.id}`, { method: 'DELETE' });
                                showToast('Task deleted', 'success');
                                fetchAllData();
                              }}>
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. STAFF & CREW DIRECTORY
              ========================================================================= */}
          {activeTab === 'staff' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Staff & Crew Directory</h2>
                  <p>Manage personnel profiles, daily billing rates, and track shift allocations.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('staff'); }}>
                  ＋ Register Staff Member
                </button>
              </div>

              <div className="row g-3">
                {staff.map(s => (
                  <div key={s.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card-container h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{s.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{s.role}</span>
                          </div>
                          <span className={`badge-status ${s.isDoubleBooked ? 'collision' : 'available'}`}>
                            {s.isDoubleBooked ? '⚠️ Collision' : 'Available'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '0.6rem 0' }}>
                          <div>📞 {s.contact || 'No contact specified'}</div>
                          <div>💵 Daily Rate: <strong>${s.dailyRate}/day</strong></div>
                          <div>📅 Active Assignments: <strong>{s.assignedEventsCount || 0}</strong></div>
                          <div style={{ marginTop: '0.35rem', color: 'var(--primary-600)' }}>
                            ✅ Assigned Tasks: <strong>{tasks.filter(t => t.staffId === s.id).length}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData({ type: 'staff', item: s }); setActiveModal('badge'); }}>
                          🪪 Print Pass
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData(s); setActiveModal('staff'); }}>
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              5. EQUIPMENT STOCK & WAREHOUSE INVENTORY
              ========================================================================= */}
          {activeTab === 'equipment' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Equipment & Warehouse Inventory</h2>
                  <p>Track hardware stock, rental rates, and peak allocation across events.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('equipment'); }}>
                  ＋ Add Equipment Item
                </button>
              </div>

              <div className="row g-3">
                {equipment.map(eq => (
                  <div key={eq.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card-container h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{eq.name}</h3>
                            <span className="card-badge-pill">{eq.category}</span>
                          </div>
                          <span className={`badge-status ${eq.isOverAllocated ? 'deficit' : 'in-stock'}`}>
                            {eq.isOverAllocated ? 'Deficit' : 'In Stock'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '0.6rem 0' }}>
                          <div>Warehouse Stock: <strong>{eq.totalStock} units</strong></div>
                          <div>Rental Rate: <strong>${eq.rentalRate}/day</strong></div>
                          <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span>Peak Utilization:</span>
                              <strong>{eq.utilizationPercent || 0}% ({eq.peakAllocated || 0} reserved)</strong>
                            </div>
                            <div className="progress-track" style={{ marginTop: '0.25rem' }}>
                              <div 
                                className={`progress-fill ${eq.utilizationPercent > 100 ? 'danger' : eq.utilizationPercent > 80 ? 'warning' : 'success'}`} 
                                style={{ width: `${Math.min(100, eq.utilizationPercent || 0)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData({ type: 'equipment', item: eq }); setActiveModal('badge'); }}>
                          🏷️ Print QR Tag
                        </button>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData(eq); setActiveModal('equipment'); }}>
                          Edit Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              6. VENUES REGISTRY
              ========================================================================= */}
          {activeTab === 'venues' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Venues & Facility Registry</h2>
                  <p>Manage event venue locations, seating capacities, and amenities.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('venue'); }}>
                  ＋ Add Venue Location
                </button>
              </div>

              <div className="row g-3">
                {venues.map(vn => (
                  <div key={vn.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card-container h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{vn.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Capacity: <strong>{vn.capacity} guests</strong></span>
                          </div>
                          <span className="card-badge-pill">${vn.pricing}/day</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '0.6rem 0' }}>
                          <div>✨ Amenities: {vn.amenities}</div>
                          <div>📅 Current Bookings: <strong>{vn.totalBookings || 0} event(s)</strong></div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData(vn); setActiveModal('venue'); }}>
                          Edit Venue
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              7. VENDORS MATRIX
              ========================================================================= */}
          {activeTab === 'vendors' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Vendor Coordination & Contracts</h2>
                  <p>Track third-party catering, security, audio-visual, and decor suppliers.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('vendor'); }}>
                  ＋ Register Vendor
                </button>
              </div>

              <div className="row g-3">
                {vendors.map(vd => (
                  <div key={vd.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card-container h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{vd.name}</h3>
                            <span className="card-badge-pill">{vd.category}</span>
                          </div>
                          <span style={{ color: 'var(--warning-600)', fontWeight: 700 }}>★ {vd.rating || 4.8}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '0.6rem 0' }}>
                          <div>📧 {vd.email}</div>
                          <div>📞 {vd.contact || 'No phone'}</div>
                          <div>💼 Total Contracts: <strong>{vd.contractCount || 0}</strong> (${(vd.totalContractValue || 0).toLocaleString()})</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                        <button className="btn btn-secondary btn-small" onClick={() => { setModalData(vd); setActiveModal('vendor'); }}>
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              8. BUDGET & FINANCIALS
              ========================================================================= */}
          {activeTab === 'budget' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Financial Budgeting & Purchase Orders</h2>
                  <p>Real-time expenditure tracking, currency conversion, and purchase order approvals.</p>
                </div>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-icon-box blue">💵</div>
                  <div className="kpi-body">
                    <div className="kpi-label">Total Allocated Cap</div>
                    <div className="kpi-val">{currencySymbol}{((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                    <div className="kpi-sub">Aggregated budget limits</div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-box amber">💳</div>
                  <div className="kpi-body">
                    <div className="kpi-label">Total Actual Spend</div>
                    <div className="kpi-val">{currencySymbol}{((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                    <div className="kpi-sub">Staff, Equipment & Vendor costs</div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-box green">📊</div>
                  <div className="kpi-body">
                    <div className="kpi-label">Net Variance</div>
                    <div className="kpi-val" style={{ color: (analytics?.totalVariance || 0) >= 0 ? 'var(--success-600)' : 'var(--danger-600)' }}>
                      {currencySymbol}{((analytics?.totalVariance || 0) * currencyRate).toLocaleString(undefined, {maximumFractionDigits:0})}
                    </div>
                    <div className="kpi-sub">{(analytics?.totalVariance || 0) >= 0 ? 'Under Budget' : 'Over Budget'}</div>
                  </div>
                </div>
              </div>

              {/* Event-by-Event Financial Variance Matrix */}
              <div className="table-card-wrapper">
                <div className="table-toolbar">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Event-by-Event Financial Variance Matrix</div>
                </div>
                <div className="table-responsive">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>Event Title</th>
                        <th>Duration</th>
                        <th>Allocated Budget</th>
                        <th>Staff Cost</th>
                        <th>Gear Cost</th>
                        <th>Vendor Cost</th>
                        <th>Total Spend</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(analytics?.eventReports || []).map(r => (
                        <tr key={r.eventId}>
                          <td><strong>{r.title}</strong></td>
                          <td>{r.durationDays} days</td>
                          <td>{currencySymbol}{(r.budget * currencyRate).toLocaleString()}</td>
                          <td>{currencySymbol}{(r.breakdown.staff * currencyRate).toLocaleString()}</td>
                          <td>{currencySymbol}{(r.breakdown.equipment * currencyRate).toLocaleString()}</td>
                          <td>{currencySymbol}{(r.breakdown.vendor * currencyRate).toLocaleString()}</td>
                          <td><strong>{currencySymbol}{(r.totalSpent * currencyRate).toLocaleString()}</strong></td>
                          <td>
                            <span className={`badge-status ${r.variance >= 0 ? 'confirmed' : 'cancelled'}`}>
                              {r.variance >= 0 ? 'Under Budget' : 'Over Budget'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              9. EXECUTIVE REPORTS & ANALYTICS
              ========================================================================= */}
          {activeTab === 'reports' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Executive Analytics & Reports</h2>
                  <p>Download executive summaries, staff workload telemetry, and hardware inventory manifests.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setActiveModal('export')}>
                  📥 Export All Reports
                </button>
              </div>

              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="card-container h-100">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>📄 Executive Summary Overview</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Generated by APEX Analytics Engine with real-time collision and financial metrics.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                        <span>Total Registered Events</span>
                        <strong>{events.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                        <span>Total Staff Personnel</span>
                        <strong>{staff.length}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                        <span>Hardware Catalog Size</span>
                        <strong>{equipment.length} items</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)' }}>
                        <span>Overall Financial Status</span>
                        <strong style={{ color: 'var(--success-600)' }}>Healthy (Under Budget)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="card-container h-100">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>📥 Instant Data Export Options</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
                      Export production spreadsheets or complete JSON snapshots.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => handleExport('events')}>
                        📄 Events CSV
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleExport('staff')}>
                        👥 Staff CSV
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleExport('equipment')}>
                        📦 Equipment CSV
                      </button>
                      <button className="btn btn-secondary" onClick={() => handleExport('finance')}>
                        💰 Financial CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              10. AWS CLOUD INFRASTRUCTURE CENTER
              ========================================================================= */}
          {activeTab === 'aws' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>AWS Cloud Infrastructure Center</h2>
                  <p>Generate Infrastructure-as-Code (CloudFormation YAML) and compute monthly cloud estimates.</p>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12 col-lg-5">
                  <div className="card-container">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>⚙️ Deployment Parameters</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const payload = {
                        environment: form.env.value,
                        region: form.region.value,
                        dbInstanceType: form.dbType.value,
                        appInstanceCount: Number(form.appCount.value)
                      };
                      const res = await fetch('/api/aws/template', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `aws-infrastructure-${payload.environment}.yaml`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      showToast('CloudFormation YAML generated & downloaded', 'success');
                    }}>
                      <div className="form-group">
                        <label>Target Environment</label>
                        <select name="env" defaultValue="production">
                          <option value="production">Production (Multi-AZ)</option>
                          <option value="staging">Staging (Single-AZ)</option>
                          <option value="dev">Development (Sandbox)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>AWS Region</label>
                        <select name="region" defaultValue="us-east-1">
                          <option value="us-east-1">us-east-1 (N. Virginia)</option>
                          <option value="us-west-2">us-west-2 (Oregon)</option>
                          <option value="eu-west-1">eu-west-1 (Ireland)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>RDS Database Instance Class</label>
                        <select name="dbType" defaultValue="db.t4g.medium">
                          <option value="db.t4g.micro">db.t4g.micro ($15/mo)</option>
                          <option value="db.t4g.medium">db.t4g.medium ($60/mo)</option>
                          <option value="db.m6g.large">db.m6g.large ($140/mo)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>ECS Fargate Container Tasks</label>
                        <input name="appCount" type="number" min="1" max="10" defaultValue="2" />
                      </div>
                      <button type="submit" className="btn btn-primary btn-full-width">Generate CloudFormation YAML</button>
                    </form>

                    <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)' }}>ESTIMATED MONTHLY AWS COST</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>$144.50 / mo</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Includes 2x Fargate tasks, ALB, RDS Multi-AZ, S3, & CloudFront</div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-7">
                  <div className="card-container h-100">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>☁️ AWS Multi-Tier Deployment Topology</h3>
                    <div style={{ background: 'var(--slate-900)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
                      <svg width="100%" height="280" viewBox="0 0 600 280" fill="none">
                        <rect width="600" height="280" rx="8" fill="#0f172a" />
                        <rect x="20" y="20" width="560" height="240" rx="8" stroke="rgba(56, 189, 248, 0.3)" strokeDasharray="4 4" />
                        <text x="35" y="45" fill="#38bdf8" fontFamily="Outfit" fontSize="12" fontWeight="bold">AWS SECURE VPC (Multi-AZ)</text>

                        <g transform="translate(40, 110)">
                          <rect width="80" height="50" rx="6" fill="#1e293b" stroke="#334155" />
                          <text x="40" y="26" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Client SPA</text>
                          <text x="40" y="40" fill="#94a3b8" fontSize="9" textAnchor="middle">React 18</text>
                        </g>

                        <g transform="translate(180, 110)">
                          <rect width="90" height="50" rx="6" fill="#1e1b4b" stroke="#6366f1" />
                          <text x="45" y="26" fill="#a5b4fc" fontSize="11" textAnchor="middle" fontWeight="bold">CloudFront</text>
                          <text x="45" y="40" fill="#94a3b8" fontSize="9" textAnchor="middle">Global CDN</text>
                        </g>

                        <g transform="translate(330, 110)">
                          <rect width="100" height="50" rx="6" fill="#042f2e" stroke="#10b981" />
                          <text x="50" y="26" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontWeight="bold">ECS Fargate</text>
                          <text x="50" y="40" fill="#94a3b8" fontSize="9" textAnchor="middle">Node Backend</text>
                        </g>

                        <g transform="translate(490, 110)">
                          <rect width="90" height="50" rx="6" fill="#451a03" stroke="#f59e0b" />
                          <text x="45" y="26" fill="#fde68a" fontSize="11" textAnchor="middle" fontWeight="bold">RDS Postgre</text>
                          <text x="45" y="40" fill="#94a3b8" fontSize="9" textAnchor="middle">Database</text>
                        </g>

                        <path d="M 120 135 L 180 135" stroke="#475569" strokeWidth="2" />
                        <path d="M 270 135 L 330 135" stroke="#475569" strokeWidth="2" />
                        <path d="M 430 135 L 490 135" stroke="#475569" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              11. ADMIN CONSOLE & USER ROLES DIRECTORY
              ========================================================================= */}
          {activeTab === 'admin' && (
            <div>
              <div className="content-page-header">
                <div>
                  <h2>Admin Console & User Identity Matrix</h2>
                  <p>Manage system users, grant security permissions, and switch active role personas.</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setModalData({}); setActiveModal('user'); }}>
                  ＋ Register System User
                </button>
              </div>

              {/* User Directory Table */}
              <div className="table-card-wrapper mb-4">
                <div className="table-toolbar">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Active System Users & Permissions</div>
                </div>
                <div className="table-responsive">
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Corporate Email (Mail ID)</th>
                        <th>Assigned Role</th>
                        <th>Department</th>
                        <th>Password / Access</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td><strong>{u.name}</strong></td>
                          <td>
                            <code style={{ fontSize: '0.8rem', color: 'var(--primary-700)', backgroundColor: 'var(--primary-50)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {u.email}
                            </code>
                          </td>
                          <td>
                            <span className="card-badge-pill" style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.department}</td>
                          <td>
                            <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              🔒 Protected
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${u.status === 'Active' ? 'available' : 'collision'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button 
                                className="btn btn-secondary btn-small"
                                onClick={() => { setModalData(u); setActiveModal('user'); }}
                                title="Edit Email ID, Password, Role, or Department"
                              >
                                ✏️ Edit Credentials
                              </button>
                              <button 
                                className="btn btn-secondary btn-small"
                                onClick={async () => {
                                  const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
                                  await fetch(`/api/users/${u.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: newStatus })
                                  });
                                  showToast(`User status set to ${newStatus}`, 'info');
                                  fetchAllData();
                                }}
                              >
                                {u.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                              {currentPersona.roleCode === 'SUPER_ADMIN' && (
                                <button 
                                  className="btn btn-secondary btn-small text-danger"
                                  onClick={async () => {
                                    if (confirm(`Are you sure you want to delete user "${u.name}" (${u.email})?`)) {
                                      const res = await apiFetch(`/api/users/${u.id}`, { method: 'DELETE' });
                                      if (res.ok) {
                                        showToast('User deleted', 'info');
                                        fetchAllData();
                                      }
                                    }
                                  }}
                                  title="Delete User (Super Admin only)"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Role Persona Switcher */}
              <div className="row g-4">
                <div className="col-12 col-lg-5">
                  <div className="card-container">
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>👤 Switch Active Operational Persona</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {PERSONAS.map(p => (
                        <div 
                          key={p.id}
                          className="card-container"
                          style={{ 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.85rem',
                            borderColor: activePersona === p.id || activePersona === p.slug ? 'var(--primary-500)' : 'var(--border-light)',
                            backgroundColor: activePersona === p.id || activePersona === p.slug ? 'var(--primary-50)' : '#ffffff'
                          }}
                          onClick={() => {
                            setActivePersona(p.id);
                            sessionStorage.setItem('erams_persona', p.id);
                            showToast(`Active persona switched to ${p.name} (${p.userRole})`, 'info');
                          }}
                        >
                          <div className="persona-avatar">{p.avatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-900)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{p.role}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--primary-600)', fontWeight: 600 }}>{p.tag}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-7">
                  <div className="table-card-wrapper">
                    <div className="table-toolbar">
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🛡️ Strict RBAC Role Hierarchy Matrix</div>
                    </div>
                    <div className="table-responsive">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>Hierarchical Tier</th>
                            <th>Permitted Scope</th>
                            <th>Operational Authority</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong style={{ color: 'var(--primary-700)' }}>👑 SUPER ADMIN (L4)</strong></td>
                            <td>Platform-Wide / Global</td>
                            <td>Full platform governance, create/manage Event Admins, system-wide events CRUD, override resource conflicts, AWS cloud IaC, view all audit logs.</td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: '#0369a1' }}>👔 EVENT ADMIN (L3)</strong></td>
                            <td>Managed Events Scope</td>
                            <td>Create/edit events within scope, assign Organizers, allocate staff & equipment, view scoped financial reports & audit logs.</td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: '#d97706' }}>📋 ORGANIZER (L2)</strong></td>
                            <td>Assigned Event Scope</td>
                            <td>Coordinate assigned event, request & assign staff crew, create & manage operational tasks, allocate permitted hardware.</td>
                          </tr>
                          <tr>
                            <td><strong style={{ color: '#059669' }}>👷 STAFF (L1)</strong></td>
                            <td>Assigned Shifts & Tasks</td>
                            <td>View assigned event run-of-show & venue, update own task status/notes/files, edit profile & availability. No resource allocation rights.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. EVENT COST FORECASTER & ROI SCENARIO SIMULATOR */}
          {activeTab === 'simulator' && renderSimulatorTab()}

          {/* 13. 2D INTERACTIVE VENUE FLOOR PLAN & STAGE STUDIO */}
          {activeTab === 'floorplan' && renderFloorplanTab()}

          {/* 14. REAL-TIME ENVIRONMENTAL SAFETY & WEATHER RADAR */}
          {activeTab === 'weather' && renderWeatherTab()}

          {/* 15. LIVE SYSTEM AUDIT LOG & SECURITY STREAM */}
          {activeTab === 'audit' && renderAuditTab()}

        </main>
      </div>

      {/* =========================================================================
          UNIVERSAL COMMAND PALETTE (Ctrl+K)
          ========================================================================= */}
      {commandPaletteOpen && (
        <div className="command-palette-overlay" onClick={() => setCommandPaletteOpen(false)}>
          <div className="command-palette-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="command-palette-header">
              <span style={{ fontSize: '1.1rem', color: 'var(--primary-600)' }}>🔍</span>
              <input 
                type="text" 
                className="command-palette-input"
                placeholder="Type a command, event, staff, or tool (e.g. 'Tech Summit', 'Simulator', 'Weather')..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                autoFocus
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>ESC to close</span>
            </div>
            <div className="command-palette-results">
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); handleAutoResolve(); }}>
                <div className="command-item-left"><span>⚡ 1-Click Auto-Resolve All Conflicts</span></div>
                <span className="command-item-badge">Action</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('simulator'); }}>
                <div className="command-item-left"><span>🧮 Open ROI Scenario & Cost Forecaster</span></div>
                <span className="command-item-badge">Tool</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('floorplan'); }}>
                <div className="command-item-left"><span>📐 Open 2D Venue & Stage Layout Studio</span></div>
                <span className="command-item-badge">Studio</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('weather'); }}>
                <div className="command-item-left"><span>🌦️ Check Environmental Safety & Weather Radar</span></div>
                <span className="command-item-badge">Safety</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('audit'); }}>
                <div className="command-item-left"><span>📜 Inspect Live System Audit Log & Security Stream</span></div>
                <span className="command-item-badge">Security</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('dashboard'); }}>
                <div className="command-item-left"><span>📊 Go to Overview Dashboard</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('events'); }}>
                <div className="command-item-left"><span>📅 Go to Events Workspace</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('tasks'); }}>
                <div className="command-item-left"><span>✅ Go to Task Tracker</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('staff'); }}>
                <div className="command-item-left"><span>👥 Go to Staff Portal</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('equipment'); }}>
                <div className="command-item-left"><span>📦 Go to Equipment Inventory</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              <div className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('budget'); }}>
                <div className="command-item-left"><span>💰 Go to Budget & Finance</span></div>
                <span className="command-item-badge">Navigation</span>
              </div>
              {events.map(e => (
                <div key={e.id} className="command-item" onClick={() => { setCommandPaletteOpen(false); setActiveTab('events'); setSelectedEventId(e.id); }}>
                  <div className="command-item-left"><span>Event: {e.title} ({e.venue})</span></div>
                  <span className="command-item-badge">Event</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          KEYBOARD SHORTCUTS GUIDE MODAL
          ========================================================================= */}
      {shortcutsOpen && (
        <div className="modal-overlay open" onClick={() => setShortcutsOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⌨️ Keyboard Shortcuts Guide</h3>
              <button className="close-btn" onClick={() => setShortcutsOpen(false)}>&times;</button>
            </div>
            <div className="modal-body-scroll">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Open Command Palette:</span>
                  <span className="search-kbd-pill">Ctrl + K / Cmd + K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Overview Dashboard:</span>
                  <span className="search-kbd-pill">Alt + D</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Events Workspace:</span>
                  <span className="search-kbd-pill">Alt + E</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Task Tracker:</span>
                  <span className="search-kbd-pill">Alt + T</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Staff Portal:</span>
                  <span className="search-kbd-pill">Alt + S</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Equipment Catalog:</span>
                  <span className="search-kbd-pill">Alt + Q</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Budget & Finance:</span>
                  <span className="search-kbd-pill">Alt + B</span>
                </div>
              </div>
            </div>
            <div className="modal-footer-actions">
              <button className="btn btn-primary" onClick={() => setShortcutsOpen(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXPORT DATA MODAL POPUP
          ========================================================================= */}
      {activeModal === 'export' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>📥 Export System Manifests & Reports</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                  Download production spreadsheets (CSV) or generate a complete JSON system backup.
                </p>
              </div>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="modal-body-scroll">
              <div className="export-modal-grid">
                <div className="export-modal-card">
                  <div>
                    <div className="export-modal-card-header">
                      <div className="export-modal-title">
                        <span>📄</span>
                        <span>Events Manifest</span>
                      </div>
                      <span className="export-format-badge">CSV</span>
                    </div>
                    <p>Schedules, venues, budget allocations, dates, and operational status.</p>
                  </div>
                  <button className="btn btn-secondary export-download-btn" onClick={() => { handleExport('events'); setActiveModal(null); }}>
                    ⬇️ Download Events CSV
                  </button>
                </div>

                <div className="export-modal-card">
                  <div>
                    <div className="export-modal-card-header">
                      <div className="export-modal-title">
                        <span>👥</span>
                        <span>Staff Roster</span>
                      </div>
                      <span className="export-format-badge">CSV</span>
                    </div>
                    <p>Personnel directory, certified roles, daily billing rates, and contacts.</p>
                  </div>
                  <button className="btn btn-secondary export-download-btn" onClick={() => { handleExport('staff'); setActiveModal(null); }}>
                    ⬇️ Download Staff CSV
                  </button>
                </div>

                <div className="export-modal-card">
                  <div>
                    <div className="export-modal-card-header">
                      <div className="export-modal-title">
                        <span>📦</span>
                        <span>Equipment Inventory</span>
                      </div>
                      <span className="export-format-badge">CSV</span>
                    </div>
                    <p>Hardware catalog, categories, warehouse stock levels, and rental rates.</p>
                  </div>
                  <button className="btn btn-secondary export-download-btn" onClick={() => { handleExport('equipment'); setActiveModal(null); }}>
                    ⬇️ Download Equipment CSV
                  </button>
                </div>

                <div className="export-modal-card">
                  <div>
                    <div className="export-modal-card-header">
                      <div className="export-modal-title">
                        <span>💰</span>
                        <span>Financial Summary</span>
                      </div>
                      <span className="export-format-badge">CSV</span>
                    </div>
                    <p>Aggregated expenditures, category rollups (staff/gear/vendors), and variance.</p>
                  </div>
                  <button className="btn btn-secondary export-download-btn" onClick={() => { handleExport('finance'); setActiveModal(null); }}>
                    ⬇️ Download Finance CSV
                  </button>
                </div>

                <div className="export-modal-card" style={{ gridColumn: '1 / -1', backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200)' }}>
                  <div>
                    <div className="export-modal-card-header">
                      <div className="export-modal-title">
                        <span>💾</span>
                        <span>Complete Database Snapshot</span>
                      </div>
                      <span className="export-format-badge json-badge">JSON</span>
                    </div>
                    <p>Full relational snapshot containing all collections (events, staff, gear, venues, vendors, tasks, assignments).</p>
                  </div>
                  <button className="btn btn-primary export-download-btn" onClick={() => { handleExport('backup'); setActiveModal(null); }}>
                    💾 Download Full Backup (JSON)
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE ASSET / ID PASS MODAL
          ========================================================================= */}
      {activeModal === 'badge' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏷️ Official Pass & Tag Preview</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body-scroll">
              <div className="asset-badge-card">
                <div className="asset-badge-header">
                  {modalData.type === 'staff' ? 'APEX CREW IDENTIFICATION PASS' : 'APEX ASSET TRACKING TAG'}
                </div>
                <div className="asset-badge-title">{modalData.item?.name}</div>
                <div className="asset-badge-sub">
                  {modalData.type === 'staff' ? modalData.item?.role : `Category: ${modalData.item?.category} | Stock: ${modalData.item?.totalStock}`}
                </div>
                <div className="asset-badge-qr">
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>⬛⬜⬛</div>
                  <div>{modalData.type === 'staff' ? `APEX-STAFF-${modalData.item?.id}` : `APEX-EQ-${modalData.item?.id}`}</div>
                </div>
                <div className="asset-badge-footer">AUTHORIZED APEX EVENT SYSTEMS</div>
              </div>
            </div>
            <div className="modal-footer-actions">
              <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Pass</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DYNAMIC CRUD MODALS (EVENT, STAFF, EQUIP, VENUE, VENDOR, TASK, USER, ASSIGN, ALLOCATE, COORD)
          ========================================================================= */}
      {/* Event Add/Edit Modal */}
      {activeModal === 'event' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalData.id ? 'Edit Event Details' : 'Create New Event'}</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                title: form.title.value,
                description: form.description.value,
                venue: form.venue.value,
                startDate: form.startDate.value,
                endDate: form.endDate.value,
                budget: Number(form.budget.value),
                status: form.status.value
              };
              const url = modalData.id ? `/api/events/${modalData.id}` : '/api/events';
              const method = modalData.id ? 'PUT' : 'POST';
              const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast(`Event ${modalData.id ? 'updated' : 'created'} successfully`, 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Event Name / Title</label>
                <input name="title" defaultValue={modalData.title || ''} required placeholder="e.g. Annual Tech Summit" />
              </div>
              <div className="form-group">
                <label>Description & Scope</label>
                <textarea name="description" rows="2" defaultValue={modalData.description || ''} placeholder="Key objectives, audience scale..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Venue Location</label>
                  <select name="venue" defaultValue={modalData.venue || (venues[0]?.name || 'Innovation Arena')}>
                    {venues.map(v => (
                      <option key={v.id} value={v.name}>{v.name} (Cap: {v.capacity})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget Allocation Cap ($)</label>
                  <input name="budget" type="number" defaultValue={modalData.budget || 20000} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input name="startDate" type="date" defaultValue={modalData.startDate || '2026-09-10'} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input name="endDate" type="date" defaultValue={modalData.endDate || '2026-09-12'} required />
                </div>
              </div>
              <div className="form-group">
                <label>Initial Status</label>
                <select name="status" defaultValue={modalData.status || 'Confirmed'}>
                  <option value="Draft">Draft</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modalData.id ? 'Save Changes' : 'Create Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Create Modal */}
      {activeModal === 'task' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Operational Task</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                eventId: form.eventId.value,
                staffId: form.staffId.value,
                title: form.title.value,
                description: form.description.value,
                deadline: form.deadline.value,
                priority: form.priority.value,
                status: 'Pending'
              };
              const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast('Task created and assigned', 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Task Title</label>
                <input name="title" required placeholder="e.g. Verify Audio Patch & Mixer Lines" />
              </div>
              <div className="form-group">
                <label>Description & Instructions</label>
                <textarea name="description" rows="2" placeholder="Specific steps, safety notes, or checklists..."></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Linked Event</label>
                  <select name="eventId" defaultValue={modalData.eventId || (events[0]?.id || '')}>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Staff Member</label>
                  <select name="staffId">
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Deadline Date</label>
                  <input name="deadline" type="date" defaultValue="2026-09-10" required />
                </div>
                <div className="form-group">
                  <label>Priority Level</label>
                  <select name="priority" defaultValue="High">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Create & Edit Credentials Modal */}
      {activeModal === 'user' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalData.id ? '✏️ Edit User Credentials & Access' : '＋ Register System User'}</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                name: form.name.value,
                email: form.email.value.trim(),
                role: form.role.value,
                department: form.department.value,
                status: form.status ? form.status.value : 'Active'
              };

              if (form.password.value && form.password.value.trim().length > 0) {
                payload.password = form.password.value.trim();
              }

              const url = modalData.id ? `/api/users/${modalData.id}` : '/api/users';
              const method = modalData.id ? 'PUT' : 'POST';

              try {
                const res = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (res.ok) {
                  showToast(modalData.id ? 'User credentials and profile updated!' : 'System user registered successfully!', 'success');
                  setActiveModal(null);
                  fetchAllData();
                } else {
                  showToast(data.error || 'Failed to save user credentials', 'danger');
                }
              } catch (err) {
                showToast('Network error updating user credentials', 'danger');
              }
            }}>
              <div className="form-group">
                <label>Full User Name *</label>
                <input name="name" required defaultValue={modalData.name || ''} placeholder="e.g. Robert Clark" />
              </div>
              
              <div className="form-group">
                <label>Corporate Email (Mail ID) *</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  defaultValue={modalData.email || ''} 
                  placeholder="robert.clark@apexevents.com" 
                />
              </div>

              <div className="form-group">
                <label>
                  {modalData.id ? 'Change / Reset Password (Optional)' : 'User Password *'}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    name="password" 
                    type={showUserPassword ? 'text' : 'password'} 
                    placeholder={modalData.id ? 'Leave blank to keep existing password' : 'Enter login password'}
                    required={!modalData.id}
                    style={{ paddingRight: '45px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowUserPassword(prev => !prev)}
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: 'var(--slate-500)'
                    }}
                    title={showUserPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showUserPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                {modalData.id && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem', display: 'block' }}>
                    Type a new password to reset this user's credentials, or leave blank to keep unchanged.
                  </span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assigned System Role</label>
                  <select name="role" defaultValue={modalData.role || 'Event Manager'}>
                    <option value="Admin">Admin (Full Control)</option>
                    <option value="Event Manager">Event Manager (Production)</option>
                    <option value="Staff">Staff (Shift Execution)</option>
                    <option value="Vendor">Vendor (External Supplier)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" defaultValue={modalData.department || 'Production & Staging'} />
                </div>
              </div>

              {modalData.id && (
                <div className="form-group">
                  <label>Account Status</label>
                  <select name="status" defaultValue={modalData.status || 'Active'}>
                    <option value="Active">Active (Permitted)</option>
                    <option value="Suspended">Suspended (Access Revoked)</option>
                  </select>
                </div>
              )}

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modalData.id ? 'Save Changes' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Account & Security Credentials Modal */}
      {activeModal === 'my-credentials' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔒 My Security Credentials & Email Profile</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const name = form.name.value.trim();
              const email = form.email.value.trim();
              const currentPassword = form.currentPassword.value;
              const newPassword = form.newPassword.value;
              const confirmPassword = form.confirmPassword.value;

              if (newPassword && newPassword !== confirmPassword) {
                showToast('New passwords do not match!', 'danger');
                return;
              }

              try {
                const res = await fetch('/api/auth/profile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    personaId: currentPersona.id,
                    name,
                    email,
                    currentPassword,
                    newPassword: newPassword || undefined
                  })
                });

                const data = await res.json();
                if (res.ok && data.success) {
                  // Update persona in state
                  currentPersona.name = name;
                  currentPersona.email = email;
                  sessionStorage.setItem('apex_user_email', email);
                  sessionStorage.setItem('apex_user_name', name);
                  
                  showToast('✅ Profile Mail ID and Password updated successfully!', 'success');
                  setActiveModal(null);
                  fetchAllData();
                } else {
                  showToast(data.error || 'Failed to update credentials', 'danger');
                }
              } catch (err) {
                showToast('Network error updating security credentials', 'danger');
              }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', backgroundColor: 'var(--slate-50)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-light)' }}>
                <div className="persona-avatar" style={{ width: '42px', height: '42px', fontSize: '1rem' }}>
                  {currentPersona.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{currentPersona.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{currentPersona.userRole} • {currentPersona.role}</div>
                </div>
              </div>

              <div className="form-group">
                <label>Display Name *</label>
                <input name="name" required defaultValue={currentPersona.name} placeholder="Your Full Name" />
              </div>

              <div className="form-group">
                <label>Corporate Mail ID (Email Address) *</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  defaultValue={currentPersona.email} 
                  placeholder="name@apexevents.com" 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.2rem', display: 'block' }}>
                  This email is used as your system login ID.
                </span>
              </div>

              <div className="form-group">
                <label>Current Password (Optional)</label>
                <input 
                  name="currentPassword" 
                  type="password" 
                  placeholder="Enter current password if set" 
                />
              </div>

              <div className="form-group">
                <label>New Password (Optional)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    name="newPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter new password (min 6 chars)"
                    style={{ paddingRight: '45px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{ 
                      position: 'absolute', 
                      right: '10px', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: 'var(--slate-500)'
                    }}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  name="confirmPassword" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Re-type new password" 
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Add/Edit Modal */}
      {activeModal === 'staff' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalData.id ? 'Edit Staff Profile' : 'Register Staff Member'}</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                name: form.name.value,
                role: form.role.value,
                contact: form.contact.value,
                dailyRate: Number(form.dailyRate.value)
              };
              const url = modalData.id ? `/api/staff/${modalData.id}` : '/api/staff';
              const method = modalData.id ? 'PUT' : 'POST';
              const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast(`Staff ${modalData.id ? 'updated' : 'registered'} successfully`, 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" defaultValue={modalData.name || ''} required placeholder="e.g. Alex Henderson" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Operational Role</label>
                  <select name="role" defaultValue={modalData.role || 'Event Coordinator'}>
                    <option value="Event Coordinator">Event Coordinator</option>
                    <option value="A/V Technician">A/V Technician</option>
                    <option value="Stage Manager">Stage Manager</option>
                    <option value="Security Lead">Security Lead</option>
                    <option value="Logistics Manager">Logistics Manager</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Daily Billing Rate ($)</label>
                  <input name="dailyRate" type="number" defaultValue={modalData.dailyRate || 300} required />
                </div>
              </div>
              <div className="form-group">
                <label>Contact Phone / Email</label>
                <input name="contact" defaultValue={modalData.contact || ''} placeholder="+1-555-0199" />
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modalData.id ? 'Update Staff' : 'Register Crew'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Add/Edit Modal */}
      {activeModal === 'equipment' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalData.id ? 'Edit Equipment Stock' : 'Add Equipment Item'}</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                name: form.name.value,
                category: form.category.value,
                totalStock: Number(form.totalStock.value),
                rentalRate: Number(form.rentalRate.value)
              };
              const url = modalData.id ? `/api/equipment/${modalData.id}` : '/api/equipment';
              const method = modalData.id ? 'PUT' : 'POST';
              const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast(`Equipment ${modalData.id ? 'updated' : 'catalogued'} successfully`, 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Hardware Item Name</label>
                <input name="name" defaultValue={modalData.name || ''} required placeholder="e.g. Line Array Speakers" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hardware Category</label>
                  <select name="category" defaultValue={modalData.category || 'Audio'}>
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Video">Video</option>
                    <option value="Staging">Staging</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Warehouse Stock Units</label>
                  <input name="totalStock" type="number" defaultValue={modalData.totalStock || 10} required />
                </div>
              </div>
              <div className="form-group">
                <label>Daily Rental Rate ($)</label>
                <input name="rentalRate" type="number" defaultValue={modalData.rentalRate || 100} required />
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{modalData.id ? 'Save Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {activeModal === 'assign' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Staff Member to Event</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                eventId: modalData.eventId,
                staffId: form.staffId.value,
                notes: form.notes.value
              };
              const res = await fetch('/api/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast('Staff assigned to event', 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Select Staff Member</label>
                <select name="staffId">
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role}) — ${s.dailyRate}/day</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assignment Notes</label>
                <input name="notes" placeholder="Special role or instructions" />
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Crew</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Equipment Modal */}
      {activeModal === 'allocate' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Allocate Hardware Quota to Event</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const payload = {
                eventId: modalData.eventId,
                equipmentId: form.equipmentId.value,
                quantity: Number(form.quantity.value),
                notes: form.notes.value
              };
              const res = await fetch('/api/allocations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                showToast('Equipment allocated to event', 'success');
                setActiveModal(null);
                fetchAllData();
              }
            }}>
              <div className="form-group">
                <label>Select Hardware Item</label>
                <select name="equipmentId">
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name} ({eq.category}) — Warehouse Stock: {eq.totalStock}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity to Reserve</label>
                <input name="quantity" type="number" min="1" defaultValue="2" required />
              </div>
              <div className="form-group">
                <label>Allocation Notes</label>
                <input name="notes" placeholder="e.g. Main stage PA system" />
              </div>
              <div className="modal-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Reserve Hardware</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Floater */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-msg ${t.type}`}>
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

// Mount React Root Application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
