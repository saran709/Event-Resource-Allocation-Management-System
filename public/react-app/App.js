// APEX — Event Resource Allocation Management System
// Enterprise-Grade Pure React.js 18 Component Architecture with Complete Role Workflows

const {
  useState,
  useEffect,
  useMemo,
  useCallback
} = React;
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
  const [conflicts, setConflicts] = useState({
    staffConflicts: [],
    equipmentConflicts: [],
    venueConflicts: []
  });
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
  const [floorPlanElements, setFloorPlanElements] = useState([{
    id: 'stg1',
    name: 'Main Stage & 4K LED Screen',
    type: 'stage',
    x: 220,
    y: 25,
    w: 260,
    h: 85,
    color: '#6366f1',
    power: '24 kW',
    cap: '20 Performers'
  }, {
    id: 'av1',
    name: 'FOH Audio & Lighting Desk',
    type: 'av',
    x: 280,
    y: 340,
    w: 140,
    h: 55,
    color: '#ec4899',
    power: '8 kW',
    cap: '4 Engineers'
  }, {
    id: 'vip1',
    name: 'VIP Lounge & Executive Suite',
    type: 'vip',
    x: 35,
    y: 140,
    w: 130,
    h: 120,
    color: '#f59e0b',
    power: '5 kW',
    cap: '45 Guests'
  }, {
    id: 'gen1',
    name: 'Orchestra Seating Zone A',
    type: 'seating',
    x: 195,
    y: 135,
    w: 140,
    h: 180,
    color: '#3b82f6',
    power: '1 kW',
    cap: '250 Seats'
  }, {
    id: 'gen2',
    name: 'Orchestra Seating Zone B',
    type: 'seating',
    x: 365,
    y: 135,
    w: 140,
    h: 180,
    color: '#3b82f6',
    power: '1 kW',
    cap: '250 Seats'
  }, {
    id: 'bvr1',
    name: 'Catering Hub & Refreshments',
    type: 'catering',
    x: 535,
    y: 140,
    w: 130,
    h: 120,
    color: '#10b981',
    power: '12 kW',
    cap: '60 Patrons'
  }, {
    id: 'em1',
    name: 'Emergency Exit Route Alpha',
    type: 'exit',
    x: 35,
    y: 350,
    w: 110,
    h: 45,
    color: '#ef4444',
    power: '0 kW',
    cap: 'Egress Pass'
  }, {
    id: 'em2',
    name: 'Emergency Exit Route Beta',
    type: 'exit',
    x: 555,
    y: 350,
    w: 110,
    h: 45,
    color: '#ef4444',
    power: '0 kW',
    cap: 'Egress Pass'
  }]);

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
  const PERSONAS = useMemo(() => [{
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
  }, {
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
  }, {
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
  }, {
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
  }], []);
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
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
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
      const res = await fetch(url, {
        ...options,
        headers
      });
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
      const stPromise = role !== 'STAFF' ? apiFetch('/api/staff') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const eqPromise = role !== 'STAFF' ? apiFetch('/api/equipment') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const vnPromise = role !== 'STAFF' ? apiFetch('/api/venues') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const vdPromise = role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN' ? apiFetch('/api/vendors') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const cfPromise = role !== 'STAFF' ? apiFetch('/api/conflicts') : Promise.resolve({
        ok: true,
        json: () => ({
          staffConflicts: [],
          equipmentConflicts: [],
          venueConflicts: []
        })
      });
      const anPromise = role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN' ? apiFetch('/api/budget/analytics') : Promise.resolve({
        ok: true,
        json: () => null
      });
      const usPromise = role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN' ? apiFetch('/api/users') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const auPromise = role === 'SUPER_ADMIN' || role === 'EVENT_ADMIN' ? apiFetch('/api/audit') : Promise.resolve({
        ok: true,
        json: () => []
      });
      const [evRes, stRes, eqRes, vnRes, vdRes, cfRes, anRes, tkRes, usRes, auRes] = await Promise.all([evPromise, stPromise, eqPromise, vnPromise, vdPromise, cfPromise, anPromise, tkPromise, usPromise, auPromise]);
      const [evData, stData, eqData, vnData, vdData, cfData, anData, tkData, usData, auData] = await Promise.all([evRes.ok ? evRes.json() : [], stRes.ok ? stRes.json() : [], eqRes.ok ? eqRes.json() : [], vnRes.ok ? vnRes.json() : [], vdRes.ok ? vdRes.json() : [], cfRes.ok ? cfRes.json() : {
        staffConflicts: [],
        equipmentConflicts: [],
        venueConflicts: []
      }, anRes.ok ? anRes.json() : null, tkRes.ok ? tkRes.json() : [], usRes.ok ? usRes.json() : [], auRes.ok ? auRes.json() : []]);
      setEvents(Array.isArray(evData) ? evData : []);
      setStaff(Array.isArray(stData) ? stData : []);
      setEquipment(Array.isArray(eqData) ? eqData : []);
      setVenues(Array.isArray(vnData) ? vnData : []);
      setVendors(Array.isArray(vdData) ? vdData : []);
      setConflicts(cfData || {
        staffConflicts: [],
        equipmentConflicts: [],
        venueConflicts: []
      });
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
    const handleKeyDown = e => {
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
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setActiveTab('dashboard');
        }
        if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          setActiveTab('events');
        }
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          setActiveTab('staff');
        }
        if (e.key.toLowerCase() === 'q') {
          e.preventDefault();
          setActiveTab('equipment');
        }
        if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          setActiveTab('venues');
        }
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          setActiveTab('vendors');
        }
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setActiveTab('budget');
        }
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          setActiveTab('tasks');
        }
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          setActiveTab('reports');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Currency Converter Handler
  const handleCurrencyChange = curr => {
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
      const res = await fetch('/api/conflicts/auto-resolve', {
        method: 'POST'
      });
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
  const handleExport = type => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          completionNotes: notes || ''
        })
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
  const handleLoginPersona = personaId => {
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
    window.location.href = '/';
  };

  // Move Kanban Card Column
  const handleMoveKanban = async (eventId, direction) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;
    const statuses = ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    const currIdx = statuses.indexOf(ev.status);
    let newIdx = currIdx;
    if (direction === 'prev' && currIdx > 0) newIdx--;else if (direction === 'next' && currIdx < statuses.length - 1) newIdx++;
    if (newIdx === currIdx) return;
    const newStatus = statuses[newIdx];
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
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
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || e.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  // Selected Active Event
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Total Conflicts Count
  const totalConflictsCount = (conflicts.staffConflicts?.length || 0) + (conflicts.equipmentConflicts?.length || 0) + (conflicts.venueConflicts?.length || 0);

  // If Not Authenticated, Render Modern Enterprise Login Screen
  if (!auth) {
    return /*#__PURE__*/React.createElement("div", {
      className: "login-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "login-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "login-card-header"
    }, /*#__PURE__*/React.createElement("div", {
      className: "login-brand-icon"
    }, "▲"), /*#__PURE__*/React.createElement("h2", null, "APEX ENTERPRISE"), /*#__PURE__*/React.createElement("p", null, "Event Resource Allocation & Conflict Resolution Platform")), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        handleLoginPersona('sarah');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", null, "Corporate Work Email"), /*#__PURE__*/React.createElement("input", {
      type: "email",
      required: true,
      defaultValue: "sarah.manager@apexevents.com",
      placeholder: "name@company.com"
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", null, "Password"), /*#__PURE__*/React.createElement("input", {
      type: "password",
      required: true,
      defaultValue: "password123",
      placeholder: "••••••••"
    })), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn btn-primary btn-full-width",
      style: {
        marginTop: '0.5rem'
      }
    }, "Sign In to Workspace")), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid var(--border-light)',
        paddingTop: '1.25rem',
        marginTop: '1.5rem'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--slate-500)',
        textAlign: 'center',
        marginBottom: '0.75rem',
        fontWeight: 600
      }
    }, "Quick 1-Click Role Persona Sign-In:"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem'
      }
    }, PERSONAS.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      type: "button",
      className: "btn btn-secondary btn-small",
      onClick: () => handleLoginPersona(p.id),
      style: {
        justifyContent: 'flex-start',
        padding: '0.45rem 0.6rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: 'var(--primary-600)'
      }
    }, p.avatar), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.78rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, p.name.split(' ')[0], " (", p.userRole, ")")))))));
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
        calendarCells.push({
          dayNum,
          dateStr,
          isCurrentMonth: false
        });
      }
      // Current month days
      for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        calendarCells.push({
          dayNum,
          dateStr,
          isCurrentMonth: true
        });
      }
      // Next month leading days to complete multiple of 7
      const remainingCells = 7 - calendarCells.length % 7;
      if (remainingCells < 7) {
        for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
          const m = calendarMonth === 11 ? 1 : calendarMonth + 2;
          const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
          const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          calendarCells.push({
            dayNum,
            dateStr,
            isCurrentMonth: false
          });
        }
      }

      // Safe conflict detector
      const hasConflictOnDate = dateStr => {
        if (!conflicts) return false;
        const staffList = Array.isArray(conflicts.staffConflicts) ? conflicts.staffConflicts : [];
        const equipList = Array.isArray(conflicts.equipmentConflicts) ? conflicts.equipmentConflicts : [];
        const checkMatch = item => {
          if (!item || !item.overlapPeriod) return false;
          const parts = item.overlapPeriod.split(' to ');
          if (parts.length === 2) {
            return dateStr >= parts[0].trim() && dateStr <= parts[1].trim();
          }
          return dateStr === item.overlapPeriod.trim();
        };
        return staffList.some(checkMatch) || equipList.some(checkMatch);
      };
      return /*#__PURE__*/React.createElement("div", {
        className: "calendar-dashboard-wrapper"
      }, /*#__PURE__*/React.createElement("div", {
        className: "calendar-toolbar card-container mb-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-wrap align-items-center justify-content-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "calendar-month-display"
      }, /*#__PURE__*/React.createElement("h2", null, MONTH_NAMES[calendarMonth] || 'Calendar', " ", calendarYear), /*#__PURE__*/React.createElement("span", {
        className: "badge-status in-progress"
      }, filteredCalEvents.length, " Events Scheduled")), /*#__PURE__*/React.createElement("div", {
        className: "btn-group"
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-secondary btn-small",
        onClick: handlePrevMonth,
        title: "Previous Month"
      }, "◀ Prev"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-secondary btn-small",
        onClick: handleToday,
        title: "Current Month"
      }, "Today"), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-secondary btn-small",
        onClick: handleNextMonth,
        title: "Next Month"
      }, "Next ▶"))), /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-wrap align-items-center gap-2"
      }, /*#__PURE__*/React.createElement("div", {
        className: "btn-group"
      }, /*#__PURE__*/React.createElement("button", {
        className: `btn btn-small ${calendarViewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`,
        onClick: () => setCalendarViewMode('month')
      }, "📅 Month Grid"), /*#__PURE__*/React.createElement("button", {
        className: `btn btn-small ${calendarViewMode === 'gantt' ? 'btn-primary' : 'btn-secondary'}`,
        onClick: () => setCalendarViewMode('gantt')
      }, "📊 Gantt Timeline"), /*#__PURE__*/React.createElement("button", {
        className: `btn btn-small ${calendarViewMode === 'agenda' ? 'btn-primary' : 'btn-secondary'}`,
        onClick: () => setCalendarViewMode('agenda')
      }, "📋 Agenda Stream")), /*#__PURE__*/React.createElement("select", {
        className: "form-select form-select-sm",
        style: {
          width: 'auto'
        },
        value: calendarFilterStatus,
        onChange: e => setCalendarFilterStatus(e.target.value)
      }, /*#__PURE__*/React.createElement("option", {
        value: "all"
      }, "All Statuses"), /*#__PURE__*/React.createElement("option", {
        value: "Confirmed"
      }, "Confirmed"), /*#__PURE__*/React.createElement("option", {
        value: "Draft"
      }, "Draft"), /*#__PURE__*/React.createElement("option", {
        value: "In Progress"
      }, "In Progress"), /*#__PURE__*/React.createElement("option", {
        value: "Completed"
      }, "Completed"), /*#__PURE__*/React.createElement("option", {
        value: "Cancelled"
      }, "Cancelled")), /*#__PURE__*/React.createElement("select", {
        className: "form-select form-select-sm",
        style: {
          width: 'auto'
        },
        value: calendarFilterVenue,
        onChange: e => setCalendarFilterVenue(e.target.value)
      }, /*#__PURE__*/React.createElement("option", {
        value: "all"
      }, "All Venues"), safeVenues.map(v => /*#__PURE__*/React.createElement("option", {
        key: v.id || v.name,
        value: v.name
      }, v.name))), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary btn-small",
        onClick: () => {
          setModalData({});
          setActiveModal('event');
        }
      }, "＋ New Event")))), calendarViewMode === 'month' && /*#__PURE__*/React.createElement("div", {
        className: "card-container calendar-grid-container p-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "calendar-weekdays-header"
      }, DAYS_OF_WEEK.map((day, idx) => /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "calendar-weekday-cell"
      }, day))), /*#__PURE__*/React.createElement("div", {
        className: "calendar-days-grid"
      }, calendarCells.map((cell, idx) => {
        const dayEvents = filteredCalEvents.filter(ev => ev.startDate <= cell.dateStr && ev.endDate >= cell.dateStr);
        const hasConflict = hasConflictOnDate(cell.dateStr);
        return /*#__PURE__*/React.createElement("div", {
          key: idx,
          className: `calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${hasConflict ? 'day-has-conflict' : ''}`
        }, /*#__PURE__*/React.createElement("div", {
          className: "day-cell-top"
        }, /*#__PURE__*/React.createElement("span", {
          className: `day-number ${cell.dateStr === '2026-09-04' ? 'today-pill' : ''}`
        }, cell.dayNum), hasConflict && /*#__PURE__*/React.createElement("span", {
          className: "calendar-conflict-dot",
          title: "Resource collision detected on this date!"
        }, "⚠️")), /*#__PURE__*/React.createElement("div", {
          className: "day-events-stack"
        }, dayEvents.map(ev => /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          className: `cal-event-pill status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
          onClick: () => {
            setSelectedEventId(ev.id);
            setActiveTab('events');
          },
          title: `${ev.title}\nVenue: ${ev.venue}\nDates: ${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`
        }, /*#__PURE__*/React.createElement("span", {
          className: "cal-event-indicator"
        }), /*#__PURE__*/React.createElement("span", {
          className: "cal-event-title"
        }, ev.title)))));
      }))), calendarViewMode === 'gantt' && /*#__PURE__*/React.createElement("div", {
        className: "card-container gantt-container p-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "gantt-header-row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "gantt-event-col-header"
      }, "Event Name & Venue"), /*#__PURE__*/React.createElement("div", {
        className: "gantt-timeline-header-scroll"
      }, /*#__PURE__*/React.createElement("div", {
        className: "gantt-days-axis",
        style: {
          gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))`
        }
      }, Array.from({
        length: daysInMonth
      }, (_, i) => i + 1).map(day => /*#__PURE__*/React.createElement("div", {
        key: day,
        className: "gantt-day-tick"
      }, /*#__PURE__*/React.createElement("span", {
        className: "gantt-day-num"
      }, day), /*#__PURE__*/React.createElement("span", {
        className: "gantt-day-name"
      }, DAYS_OF_WEEK[new Date(calendarYear, calendarMonth, day).getDay()].substring(0, 1))))))), /*#__PURE__*/React.createElement("div", {
        className: "gantt-body"
      }, filteredCalEvents.length === 0 ? /*#__PURE__*/React.createElement("div", {
        className: "p-4 text-center text-muted"
      }, "No events match the selected criteria for this timeline.") : filteredCalEvents.map(ev => {
        let startDay = null;
        let endDay = null;
        if (ev.startDate && ev.endDate) {
          const evStart = new Date(ev.startDate);
          const evEnd = new Date(ev.endDate);
          if (!isNaN(evStart.getTime()) && !isNaN(evEnd.getTime())) {
            startDay = evStart.getFullYear() === calendarYear && evStart.getMonth() === calendarMonth ? evStart.getDate() : evStart < new Date(calendarYear, calendarMonth, 1) ? 1 : null;
            endDay = evEnd.getFullYear() === calendarYear && evEnd.getMonth() === calendarMonth ? evEnd.getDate() : evEnd > new Date(calendarYear, calendarMonth + 1, 0) ? daysInMonth : null;
          }
        }
        const isVisible = startDay !== null && endDay !== null && startDay <= daysInMonth && endDay >= 1;
        return /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          className: "gantt-row"
        }, /*#__PURE__*/React.createElement("div", {
          className: "gantt-event-meta-cell"
        }, /*#__PURE__*/React.createElement("div", {
          className: "gantt-event-title",
          onClick: () => {
            setSelectedEventId(ev.id);
            setActiveTab('events');
          }
        }, ev.title), /*#__PURE__*/React.createElement("div", {
          className: "gantt-event-sub"
        }, /*#__PURE__*/React.createElement("span", null, "📍 ", ev.venue), " • ", /*#__PURE__*/React.createElement("span", {
          className: `badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`
        }, ev.status))), /*#__PURE__*/React.createElement("div", {
          className: "gantt-track-cell"
        }, /*#__PURE__*/React.createElement("div", {
          className: "gantt-track-grid",
          style: {
            gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))`
          }
        }, Array.from({
          length: daysInMonth
        }, (_, i) => i + 1).map(day => /*#__PURE__*/React.createElement("div", {
          key: day,
          className: "gantt-grid-column"
        })), isVisible && /*#__PURE__*/React.createElement("div", {
          className: `gantt-bar status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
          style: {
            gridColumnStart: Math.max(1, startDay),
            gridColumnEnd: Math.min(daysInMonth, endDay) + 1
          },
          onClick: () => {
            setSelectedEventId(ev.id);
            setActiveTab('events');
          },
          title: `${ev.title}\n${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`
        }, /*#__PURE__*/React.createElement("span", {
          className: "gantt-bar-label"
        }, ev.title, " (", ev.durationDays || endDay - startDay + 1, "d)")))));
      }))), calendarViewMode === 'agenda' && /*#__PURE__*/React.createElement("div", {
        className: "agenda-stream-wrapper"
      }, filteredCalEvents.length === 0 ? /*#__PURE__*/React.createElement("div", {
        className: "card-container text-center p-5"
      }, /*#__PURE__*/React.createElement("h4", null, "No scheduled events found"), /*#__PURE__*/React.createElement("p", {
        className: "text-muted"
      }, "Create a new event or adjust the venue/status filters above."), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary mt-2",
        onClick: () => {
          setModalData({});
          setActiveModal('event');
        }
      }, "＋ Create New Event")) : /*#__PURE__*/React.createElement("div", {
        className: "row g-3"
      }, filteredCalEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(ev => {
        const evAllocations = safeEquipment.filter(eq => (ev.allocations || []).some(al => al.equipmentId === eq.id));
        const evStaff = safeStaff.filter(st => (ev.assignments || []).some(as => as.staffId === st.id));
        return /*#__PURE__*/React.createElement("div", {
          key: ev.id,
          className: "col-12 col-lg-6"
        }, /*#__PURE__*/React.createElement("div", {
          className: "card-container agenda-card h-100"
        }, /*#__PURE__*/React.createElement("div", {
          className: "d-flex justify-content-between align-items-start mb-2"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "agenda-date-badge"
        }, "📅 ", ev.startDate, " ➔ ", ev.endDate), /*#__PURE__*/React.createElement("h3", {
          style: {
            fontSize: '1.15rem',
            marginTop: '0.4rem',
            marginBottom: '0.2rem'
          }
        }, ev.title), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: '0.85rem',
            color: 'var(--slate-500)'
          }
        }, "📍 ", ev.venue)), /*#__PURE__*/React.createElement("span", {
          className: `badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`
        }, ev.status)), /*#__PURE__*/React.createElement("p", {
          style: {
            fontSize: '0.85rem',
            color: 'var(--slate-600)',
            margin: '0.6rem 0'
          }
        }, ev.description), /*#__PURE__*/React.createElement("div", {
          className: "agenda-meta-footer"
        }, /*#__PURE__*/React.createElement("div", {
          className: "d-flex align-items-center gap-3"
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: '0.82rem',
            color: 'var(--slate-600)'
          }
        }, "👥 ", /*#__PURE__*/React.createElement("strong", null, ev.assignments?.length || evStaff.length || 0), " Staff"), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: '0.82rem',
            color: 'var(--slate-600)'
          }
        }, "📦 ", /*#__PURE__*/React.createElement("strong", null, ev.allocations?.length || evAllocations.length || 0), " Gear"), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: '0.82rem',
            color: 'var(--slate-600)'
          }
        }, "💰 ", /*#__PURE__*/React.createElement("strong", null, typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget))), /*#__PURE__*/React.createElement("div", {
          className: "d-flex gap-2"
        }, /*#__PURE__*/React.createElement("button", {
          className: "btn btn-secondary btn-small",
          onClick: () => {
            setSelectedEventId(ev.id);
            setActiveTab('events');
          }
        }, "Inspect Workspace ➔")))));
      }))));
    } catch (err) {
      console.error('Calendar Render Error:', err);
      return /*#__PURE__*/React.createElement("div", {
        className: "card-container p-4 text-center"
      }, /*#__PURE__*/React.createElement("h3", {
        style: {
          color: 'var(--danger-600)'
        }
      }, "⚠️ Calendar Display Error"), /*#__PURE__*/React.createElement("p", null, err?.message || 'An error occurred while rendering the calendar.'), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary mt-2",
        onClick: () => setActiveTab('dashboard')
      }, "Back to Dashboard"));
    }
  };

  // =========================================================================
  // 12. INTERACTIVE EVENT COST FORECASTER & ROI SCENARIO SIMULATOR
  // =========================================================================
  const renderSimulatorTab = () => {
    const gearCosts = {
      standard: {
        label: 'Standard AV & PA (1080p, 2x PA)',
        cost: 3800
      },
      premium: {
        label: 'Premium Arena Production (4K LED Wall, Line Arrays, Trussing)',
        cost: 9500
      },
      ultra: {
        label: 'Ultra Immersive Broadcast (Multi-cam, Pyrotechnics, Spatial Audio)',
        cost: 19500
      }
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
    const marginPct = grossRevenue > 0 ? (netProfit / grossRevenue * 100).toFixed(1) : 0;
    const breakevenTickets = simTicketPrice > 0 ? Math.ceil((totalSimCost - simSponsorship) / simTicketPrice) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-pane-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "content-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "🧮 Event Cost Forecaster & ROI Scenario Simulator"), /*#__PURE__*/React.createElement("p", null, "Perform live \"what-if\" financial modeling, crew-to-attendee scaling, and breakeven sensitivity analysis.")), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: () => {
        setSimAttendees(650);
        setSimTicketPrice(85);
        setSimSponsorship(18000);
        setSimCrewCount(10);
        setSimGearTier('premium');
        setSimCateringPerHead(40);
        setSimVenueRate(9500);
        showToast('Simulator parameters reset to baseline', 'info');
      }
    }, "🔄 Reset Baseline"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => {
        showToast(`Exported simulation model: Net ROI $${netProfit.toLocaleString()} (${marginPct}%)`, 'success');
        logAudit('ROI Scenario Exported', `Generated financial forecast with ${simAttendees} attendees and $${grossRevenue.toLocaleString()} gross projection.`, 'Budget', 'Success');
      }
    }, "📊 Export Financial Model"))), /*#__PURE__*/React.createElement("div", {
      className: "stats-grid mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-label"
    }, "Projected Gross Revenue"), /*#__PURE__*/React.createElement("div", {
      className: "stat-value",
      style: {
        color: 'var(--primary-600)'
      }
    }, "$", grossRevenue.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "stat-subtext"
    }, "Tickets ($", grossTickets.toLocaleString(), ") + Sponsor ($", Number(simSponsorship).toLocaleString(), ")")), /*#__PURE__*/React.createElement("div", {
      className: "stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-label"
    }, "Total Estimated Cost"), /*#__PURE__*/React.createElement("div", {
      className: "stat-value",
      style: {
        color: 'var(--slate-800)'
      }
    }, "$", Math.round(totalSimCost).toLocaleString()), /*#__PURE__*/React.createElement("div", {
      className: "stat-subtext"
    }, "Includes 10% Contingency Buffer ($", Math.round(contingency).toLocaleString(), ")")), /*#__PURE__*/React.createElement("div", {
      className: "stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-label"
    }, "Net Forecast Margin"), /*#__PURE__*/React.createElement("div", {
      className: "stat-value",
      style: {
        color: netProfit >= 0 ? 'var(--success-600)' : 'var(--danger-600)'
      }
    }, netProfit >= 0 ? '+' : '', "$", Math.round(netProfit).toLocaleString(), " (", marginPct, "%)"), /*#__PURE__*/React.createElement("div", {
      className: "stat-subtext"
    }, netProfit >= 0 ? '✓ Profitable Production Run' : '⚠️ Deficit Alert — Adjust Inputs')), /*#__PURE__*/React.createElement("div", {
      className: "stat-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "stat-label"
    }, "Breakeven Attendance"), /*#__PURE__*/React.createElement("div", {
      className: "stat-value",
      style: {
        color: breakevenTickets <= simAttendees ? 'var(--primary-700)' : 'var(--warning-600)'
      }
    }, Math.max(0, breakevenTickets), " / ", simAttendees), /*#__PURE__*/React.createElement("div", {
      className: "stat-subtext"
    }, "Required Ticket Sales (", simTicketPrice > 0 ? `$${simTicketPrice}/head` : '$0', ")"))), /*#__PURE__*/React.createElement("div", {
      className: "row g-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-7"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-title-row mb-3"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.05rem',
        margin: 0
      }
    }, "🎛️ Real-Time Production & Scale Sliders"), /*#__PURE__*/React.createElement("span", {
      className: "card-badge-pill",
      style: {
        color: 'var(--primary-700)',
        backgroundColor: 'var(--primary-50)'
      }
    }, "Live Reactive")), /*#__PURE__*/React.createElement("div", {
      className: "sim-control-group mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center mb-1"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem'
      }
    }, "👥 Expected Attendance Scale:"), /*#__PURE__*/React.createElement("span", {
      className: "badge-status available",
      style: {
        fontSize: '0.85rem'
      }
    }, simAttendees.toLocaleString(), " Attendees")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "50",
      max: "3500",
      step: "25",
      value: simAttendees,
      onChange: e => setSimAttendees(Number(e.target.value)),
      style: {
        width: '100%',
        accentColor: 'var(--primary-600)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between text-muted",
      style: {
        fontSize: '0.72rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "50 (Intimate)"), /*#__PURE__*/React.createElement("span", null, "1,500 (Mid-Size Arena)"), /*#__PURE__*/React.createElement("span", null, "3,500+ (Festival/Convention)"))), /*#__PURE__*/React.createElement("div", {
      className: "row g-3 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "🎟️ Ticket Price ($/head):"), /*#__PURE__*/React.createElement("div", {
      className: "input-group"
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      max: "1000",
      value: simTicketPrice,
      onChange: e => setSimTicketPrice(Math.max(0, Number(e.target.value))),
      className: "form-control"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "🤝 Corporate Sponsorship ($):"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      step: "500",
      value: simSponsorship,
      onChange: e => setSimSponsorship(Math.max(0, Number(e.target.value))),
      className: "form-control"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row g-3 mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center mb-1"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem'
      }
    }, "👷 Crew Allocation:"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700,
        color: 'var(--primary-600)'
      }
    }, simCrewCount, " Crew")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "2",
      max: "40",
      value: simCrewCount,
      onChange: e => setSimCrewCount(Number(e.target.value)),
      style: {
        width: '100%',
        accentColor: 'var(--primary-600)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.74rem',
        color: 'var(--slate-500)'
      }
    }, "$", (simCrewCount * crewDailyAvg * 2).toLocaleString(), " est. labor payroll")), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "📦 Hardware & AV Tier:"), /*#__PURE__*/React.createElement("select", {
      value: simGearTier,
      onChange: e => setSimGearTier(e.target.value),
      className: "form-control"
    }, /*#__PURE__*/React.createElement("option", {
      value: "standard"
    }, "Standard AV & PA ($3,800)"), /*#__PURE__*/React.createElement("option", {
      value: "premium"
    }, "Premium Arena Production ($9,500)"), /*#__PURE__*/React.createElement("option", {
      value: "ultra"
    }, "Ultra Immersive Broadcast ($19,500)")))), /*#__PURE__*/React.createElement("div", {
      className: "row g-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "🍽️ Hospitality / Attendee ($):"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      max: "200",
      value: simCateringPerHead,
      onChange: e => setSimCateringPerHead(Math.max(0, Number(e.target.value))),
      className: "form-control"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.74rem',
        color: 'var(--slate-500)'
      }
    }, "$", (simAttendees * simCateringPerHead).toLocaleString(), " total food/beverage")), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.88rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "🏛️ Venue Base Rental Rate ($):"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "500",
      step: "500",
      value: simVenueRate,
      onChange: e => setSimVenueRate(Math.max(0, Number(e.target.value))),
      className: "form-control"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container h-100 d-flex flex-column justify-content-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "card-title-row mb-3"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.05rem',
        margin: 0
      }
    }, "📊 Cost Allocation Breakdown"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.8rem',
        color: 'var(--slate-500)'
      }
    }, "100% Pro-Rata")), /*#__PURE__*/React.createElement("div", {
      className: "cost-breakdown-list",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-1",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "🏛️ Venue Rental"), /*#__PURE__*/React.createElement("strong", null, "$", venueExpense.toLocaleString(), " (", (venueExpense / totalSimCost * 100).toFixed(1), "%)")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.min(100, venueExpense / totalSimCost * 100)}%`,
        height: '100%',
        backgroundColor: '#6366f1'
      }
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-1",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "📦 Equipment & Production Gear"), /*#__PURE__*/React.createElement("strong", null, "$", gearExpense.toLocaleString(), " (", (gearExpense / totalSimCost * 100).toFixed(1), "%)")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.min(100, gearExpense / totalSimCost * 100)}%`,
        height: '100%',
        backgroundColor: '#ec4899'
      }
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-1",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "👷 Production Staff & Labor"), /*#__PURE__*/React.createElement("strong", null, "$", crewExpense.toLocaleString(), " (", (crewExpense / totalSimCost * 100).toFixed(1), "%)")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.min(100, crewExpense / totalSimCost * 100)}%`,
        height: '100%',
        backgroundColor: '#3b82f6'
      }
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-1",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "🍽️ Catering & Hospitality"), /*#__PURE__*/React.createElement("strong", null, "$", cateringExpense.toLocaleString(), " (", (cateringExpense / totalSimCost * 100).toFixed(1), "%)")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${Math.min(100, cateringExpense / totalSimCost * 100)}%`,
        height: '100%',
        backgroundColor: '#10b981'
      }
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between mb-1",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "🛡️ Contingency Reserve (10%)"), /*#__PURE__*/React.createElement("strong", null, "$", Math.round(contingency).toLocaleString(), " (10.0%)")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '4px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '10%',
        height: '100%',
        backgroundColor: '#f59e0b'
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "card-container mt-4",
      style: {
        backgroundColor: 'var(--slate-50)',
        borderColor: 'var(--border-light)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: '0.88rem',
        marginBottom: '0.4rem'
      }
    }, "💡 Financial Architect Recommendation"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.8rem',
        color: 'var(--slate-600)',
        margin: 0,
        lineHeight: 1.45
      }
    }, netProfit > 15000 ? /*#__PURE__*/React.createElement("span", null, "🚀 ", /*#__PURE__*/React.createElement("strong", null, "Excellent Margin Profile:"), " Projected profit of $", Math.round(netProfit).toLocaleString(), " gives strong resilience against attendance dips. Breakeven occurs at only ", breakevenTickets, " tickets (", (breakevenTickets / simAttendees * 100).toFixed(0), "% capacity).") : netProfit >= 0 ? /*#__PURE__*/React.createElement("span", null, "⚖️ ", /*#__PURE__*/React.createElement("strong", null, "Moderate Margin:"), " Operating at $", Math.round(netProfit).toLocaleString(), " surplus. Consider securing $5k+ additional corporate sponsorship or bumping ticket tier by $10 to buffer unforeseen technical overages.") : /*#__PURE__*/React.createElement("span", null, "⚠️ ", /*#__PURE__*/React.createElement("strong", null, "Deficit Warning:"), " Projected model incurs a -$", Math.round(Math.abs(netProfit)).toLocaleString(), " loss. To achieve breakeven, either increase ticket price to $", (totalSimCost / simAttendees).toFixed(0), "/head or scale venue/gear tier downward.")))))));
  };

  // =========================================================================
  // 13. 2D INTERACTIVE VENUE FLOOR PLAN & SPATIAL STUDIO
  // =========================================================================
  const renderFloorplanTab = () => {
    const activeVenueObj = venues.find(v => v.name === selectedFloorVenue) || venues[0] || {
      name: 'Innovation Arena',
      capacity: 1500,
      city: 'San Francisco, CA'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-pane-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "content-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "📐 2D Venue Floor Plan & Spatial Layout Studio"), /*#__PURE__*/React.createElement("p", null, "Design stages, FOH mix stations, VIP hospitality lounges, and fire egress clearance pathways.")), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: () => {
        setFloorPlanElements([{
          id: 'stg1',
          name: 'Main Stage & 4K LED Screen',
          type: 'stage',
          x: 220,
          y: 25,
          w: 260,
          h: 85,
          color: '#6366f1',
          power: '24 kW',
          cap: '20 Performers'
        }, {
          id: 'av1',
          name: 'FOH Audio & Lighting Desk',
          type: 'av',
          x: 280,
          y: 340,
          w: 140,
          h: 55,
          color: '#ec4899',
          power: '8 kW',
          cap: '4 Engineers'
        }, {
          id: 'vip1',
          name: 'VIP Lounge & Executive Suite',
          type: 'vip',
          x: 35,
          y: 140,
          w: 130,
          h: 120,
          color: '#f59e0b',
          power: '5 kW',
          cap: '45 Guests'
        }, {
          id: 'gen1',
          name: 'Orchestra Seating Zone A',
          type: 'seating',
          x: 195,
          y: 135,
          w: 140,
          h: 180,
          color: '#3b82f6',
          power: '1 kW',
          cap: '250 Seats'
        }, {
          id: 'gen2',
          name: 'Orchestra Seating Zone B',
          type: 'seating',
          x: 365,
          y: 135,
          w: 140,
          h: 180,
          color: '#3b82f6',
          power: '1 kW',
          cap: '250 Seats'
        }, {
          id: 'bvr1',
          name: 'Catering Hub & Refreshments',
          type: 'catering',
          x: 535,
          y: 140,
          w: 130,
          h: 120,
          color: '#10b981',
          power: '12 kW',
          cap: '60 Patrons'
        }, {
          id: 'em1',
          name: 'Emergency Exit Route Alpha',
          type: 'exit',
          x: 35,
          y: 350,
          w: 110,
          h: 45,
          color: '#ef4444',
          power: '0 kW',
          cap: 'Egress Pass'
        }, {
          id: 'em2',
          name: 'Emergency Exit Route Beta',
          type: 'exit',
          x: 555,
          y: 350,
          w: 110,
          h: 45,
          color: '#ef4444',
          power: '0 kW',
          cap: 'Egress Pass'
        }]);
        setSelectedFloorItem(null);
        showToast('Floor plan layout reset to default blueprint', 'info');
      }
    }, "🔄 Reset Layout"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => {
        showToast('Venue CAD Blueprint exported as Vector SVG schematic', 'success');
        logAudit('Floor Plan Exported', `Exported 2D spatial layout blueprint for ${activeVenueObj.name}.`, 'Resource', 'Success');
      }
    }, "📐 Export Vector Blueprint"))), /*#__PURE__*/React.createElement("div", {
      className: "card-container mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3 align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-4"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.85rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "Select Target Venue Grid:"), /*#__PURE__*/React.createElement("select", {
      value: selectedFloorVenue,
      onChange: e => {
        setSelectedFloorVenue(e.target.value);
        setSelectedFloorItem(null);
      },
      className: "form-control"
    }, venues.map(v => /*#__PURE__*/React.createElement("option", {
      key: v.id,
      value: v.name
    }, v.name, " (Max Cap: ", v.capacity, ")")))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-8"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontWeight: 600,
        fontSize: '0.85rem',
        display: 'block',
        marginBottom: '0.3rem'
      }
    }, "Add Stage & Zone Modules:"), /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-wrap gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-small",
      onClick: () => {
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
      }
    }, "＋ Sound Tower"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-small",
      onClick: () => {
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
      }
    }, "＋ VIP Pod"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-small",
      onClick: () => {
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
      }
    }, "＋ Seating Block"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-small",
      onClick: () => {
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
      }
    }, "＋ Sponsor Booth"))))), /*#__PURE__*/React.createElement("div", {
      className: "row g-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container",
      style: {
        padding: '1rem',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center mb-2",
      style: {
        color: '#94a3b8',
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("span", null, "📍 ", /*#__PURE__*/React.createElement("strong", null, activeVenueObj.name), " • Spatial Grid (700px × 430px Scale)"), /*#__PURE__*/React.createElement("span", null, "🟢 Fire Marshal Code: Approved Clearance")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        overflowX: 'auto'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 700 430",
      style: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#090d16',
        borderRadius: '6px',
        border: '1px solid #1e293b'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
      id: "grid",
      width: "20",
      height: "20",
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 20 0 L 0 0 0 20",
      fill: "none",
      stroke: "#1e293b",
      strokeWidth: "0.8"
    }))), /*#__PURE__*/React.createElement("rect", {
      width: "700",
      height: "430",
      fill: "url(#grid)"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "15",
      y: "15",
      width: "670",
      height: "400",
      fill: "none",
      stroke: "#475569",
      strokeWidth: "2",
      strokeDasharray: "4 4",
      rx: "8"
    }), /*#__PURE__*/React.createElement("text", {
      x: "350",
      y: "20",
      fill: "#64748b",
      fontSize: "10",
      textAnchor: "middle",
      fontWeight: "bold"
    }, "▲ NORTH STAGE PROSCENIUM WALL ▲"), floorPlanElements.map(el => {
      const isSelected = selectedFloorItem?.id === el.id;
      return /*#__PURE__*/React.createElement("g", {
        key: el.id,
        style: {
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        },
        onClick: () => setSelectedFloorItem(el)
      }, /*#__PURE__*/React.createElement("rect", {
        x: el.x,
        y: el.y,
        width: el.w,
        height: el.h,
        fill: el.color,
        fillOpacity: isSelected ? 0.85 : 0.45,
        stroke: isSelected ? '#ffffff' : el.color,
        strokeWidth: isSelected ? 2.5 : 1.2,
        rx: "4"
      }), /*#__PURE__*/React.createElement("text", {
        x: el.x + el.w / 2,
        y: el.y + el.h / 2 - 4,
        fill: "#ffffff",
        fontSize: el.w < 100 ? '9' : '11',
        fontWeight: "bold",
        textAnchor: "middle",
        dominantBaseline: "middle"
      }, el.name), /*#__PURE__*/React.createElement("text", {
        x: el.x + el.w / 2,
        y: el.y + el.h / 2 + 10,
        fill: "#cbd5e1",
        fontSize: "8.5",
        textAnchor: "middle",
        dominantBaseline: "middle"
      }, el.cap));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center mt-2",
      style: {
        fontSize: '0.75rem',
        color: '#94a3b8'
      }
    }, /*#__PURE__*/React.createElement("span", null, "💡 Click any zone block to view engineering specs, wattage load, and capacity limits."), /*#__PURE__*/React.createElement("span", null, "Perimeter: ", activeVenueObj.city || 'Urban Met')))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container h-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-title-row mb-3"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.05rem',
        margin: 0
      }
    }, "🔍 Spatial Inspector"), selectedFloorItem && /*#__PURE__*/React.createElement("span", {
      className: "badge-status available",
      style: {
        fontSize: '0.75rem'
      }
    }, "Active Selection")), selectedFloorItem ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0.75rem',
        backgroundColor: 'var(--slate-50)',
        borderRadius: '6px',
        borderLeft: `4px solid ${selectedFloorItem.color}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: '0.95rem',
        color: 'var(--slate-900)'
      }
    }, selectedFloorItem.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--slate-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }
    }, "Zone Module #", selectedFloorItem.id)), /*#__PURE__*/React.createElement("div", {
      className: "row g-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container p-2 text-center",
      style: {
        backgroundColor: '#ffffff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, "Power Draw"), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: '0.95rem',
        color: 'var(--primary-700)'
      }
    }, "⚡ ", selectedFloorItem.power))), /*#__PURE__*/React.createElement("div", {
      className: "col-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container p-2 text-center",
      style: {
        backgroundColor: '#ffffff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, "Capacity Spec"), /*#__PURE__*/React.createElement("strong", {
      style: {
        fontSize: '0.95rem',
        color: 'var(--success-700)'
      }
    }, "👥 ", selectedFloorItem.cap)))), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 600
      }
    }, "Spatial X Position (px):"), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "20",
      max: "550",
      value: selectedFloorItem.x,
      onChange: e => {
        const newX = Number(e.target.value);
        setFloorPlanElements(prev => prev.map(item => item.id === selectedFloorItem.id ? {
          ...item,
          x: newX
        } : item));
        setSelectedFloorItem(prev => ({
          ...prev,
          x: newX
        }));
      },
      style: {
        width: '100%',
        accentColor: selectedFloorItem.color
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: '0.82rem',
        fontWeight: 600
      }
    }, "Spatial Y Position (px):"), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "20",
      max: "350",
      value: selectedFloorItem.y,
      onChange: e => {
        const newY = Number(e.target.value);
        setFloorPlanElements(prev => prev.map(item => item.id === selectedFloorItem.id ? {
          ...item,
          y: newY
        } : item));
        setSelectedFloorItem(prev => ({
          ...prev,
          y: newY
        }));
      },
      style: {
        width: '100%',
        accentColor: selectedFloorItem.color
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 mt-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary btn-small w-100 text-danger",
      onClick: () => {
        setFloorPlanElements(prev => prev.filter(item => item.id !== selectedFloorItem.id));
        setSelectedFloorItem(null);
        showToast('Removed module from layout', 'info');
      }
    }, "🗑️ Delete Element"))) : /*#__PURE__*/React.createElement("div", {
      className: "text-center py-5 text-muted"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
      }
    }, "👆"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.85rem'
      }
    }, "Click on any stage, audio booth, or seating block on the blueprint canvas to inspect and calibrate positioning."))))));
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
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-pane-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "content-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "🌦️ Real-Time Environmental Safety & Weather Radar"), /*#__PURE__*/React.createElement("p", null, "Live staging conditions, line-array wind shear safety thresholds, and heat hydration advisories.")), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: () => showToast('Weather telemetry synced with NOAA & OpenMeteo APIs', 'info')
    }, "🔄 Refresh Sensor Feed"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => {
        showToast(`Safety advisory broadcast dispatched to on-site stage managers for ${selectedWeatherVenue}`, 'success');
        logAudit('Weather Safety Advisory', `Dispatched environmental safety memo for ${selectedWeatherVenue} (${curWeather.condition}, Wind: ${curWeather.windSpeed}).`, 'System', 'Info');
      }
    }, "📢 Broadcast Safety Memo"))), /*#__PURE__*/React.createElement("div", {
      className: "card-container mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-wrap align-items-center justify-content-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--slate-600)',
        marginRight: '0.75rem'
      }
    }, "Monitored Venue Site:"), /*#__PURE__*/React.createElement("div", {
      className: "btn-group",
      style: {
        display: 'inline-flex',
        gap: '0.4rem'
      }
    }, Object.keys(WEATHER_DATA).map(vName => /*#__PURE__*/React.createElement("button", {
      key: vName,
      className: `btn btn-small ${selectedWeatherVenue === vName ? 'btn-primary' : 'btn-secondary'}`,
      onClick: () => setSelectedWeatherVenue(vName)
    }, vName)))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.8rem',
        color: 'var(--slate-500)'
      }
    }, "🛰️ Station: ", curWeather.city, " • Lat 37.77 / Long -122.41"))), /*#__PURE__*/React.createElement("div", {
      className: "row g-4 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container h-100",
      style: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderColor: '#334155'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-start mb-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.85rem',
        color: '#94a3b8'
      }
    }, "Live Ambient Climate"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.25rem',
        color: '#ffffff',
        margin: '0.2rem 0'
      }
    }, selectedWeatherVenue), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.8rem',
        color: '#cbd5e1'
      }
    }, curWeather.city)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '3rem'
      }
    }, curWeather.icon)), /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-baseline gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '2.75rem',
        fontWeight: 800,
        color: '#38bdf8'
      }
    }, curWeather.temp), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.1rem',
        color: '#94a3b8'
      }
    }, curWeather.condition)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0.65rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        fontSize: '0.8rem',
        color: '#cbd5e1'
      }
    }, curWeather.soundAdvisory))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-lg-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-6 col-md-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container text-center p-3"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--slate-500)'
      }
    }, "💨 Wind Velocity"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--slate-900)',
        margin: '0.25rem 0'
      }
    }, curWeather.windSpeed), /*#__PURE__*/React.createElement("span", {
      className: `badge-status ${curWeather.windSafe ? 'available' : 'collision'}`,
      style: {
        fontSize: '0.72rem'
      }
    }, curWeather.windSafe ? 'Safe for Rigging' : '⚠️ Gusts > 25mph'))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 col-md-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container text-center p-3"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--slate-500)'
      }
    }, "🌧️ Rain Probability"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--slate-900)',
        margin: '0.25rem 0'
      }
    }, curWeather.rainProb), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, "Humidity: ", curWeather.humidity))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 col-md-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container text-center p-3"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--slate-500)'
      }
    }, "🍃 Air Quality Index"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--success-600)',
        margin: '0.25rem 0'
      }
    }, curWeather.aqi), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, "Optimal Breathability"))), /*#__PURE__*/React.createElement("div", {
      className: "col-6 col-md-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container text-center p-3"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--slate-500)'
      }
    }, "☀️ UV Radiation"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--warning-600)',
        margin: '0.25rem 0'
      }
    }, curWeather.uvIndex), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, "Shade Tents Active"))), /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-title-row mb-2"
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        fontSize: '0.95rem',
        margin: 0
      }
    }, "🛡️ On-Site Production Environmental Protocols"), /*#__PURE__*/React.createElement("span", {
      className: "badge-status available",
      style: {
        fontSize: '0.75rem'
      }
    }, "All Systems Nominal")), /*#__PURE__*/React.createElement("div", {
      className: "row g-2",
      style: {
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 p-2",
      style: {
        backgroundColor: 'var(--slate-50)',
        borderRadius: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", null, "✅"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Truss & Lighting Rig:"), " Base weight ballasts rated for 35 mph wind shear."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 p-2",
      style: {
        backgroundColor: 'var(--slate-50)',
        borderRadius: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", null, "✅"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Outdoor Audio Arrays:"), " Decibel monitoring sensors calibrated at FOH perimeter."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 p-2",
      style: {
        backgroundColor: 'var(--slate-50)',
        borderRadius: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", null, "✅"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Power Distribution & GenSets:"), " IP65 waterproof enclosures active."))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 p-2",
      style: {
        backgroundColor: 'var(--slate-50)',
        borderRadius: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", null, "✅"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Attendee Hydration:"), " 4x Water stations deployed across venue concourse."))))))))));
  };

  // =========================================================================
  // 15. LIVE SYSTEM AUDIT LOG & SECURITY STREAM
  // =========================================================================
  const renderAuditTab = () => {
    const filteredLogs = auditLogs.filter(log => {
      const matchCat = auditFilterCategory === 'ALL' || log.category === auditFilterCategory;
      const matchSearch = !auditSearch || log.actor?.toLowerCase().includes(auditSearch.toLowerCase()) || log.action?.toLowerCase().includes(auditSearch.toLowerCase()) || log.details?.toLowerCase().includes(auditSearch.toLowerCase());
      return matchCat && matchSearch;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "tab-pane-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "content-page-header"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "📜 Live System Audit Log & Security Stream"), /*#__PURE__*/React.createElement("p", null, "Real-time forensic telemetry tracking user credential changes, 1-click collision resolutions, and financial approvals.")), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-secondary",
      onClick: async () => {
        try {
          const res = await fetch('/api/audit');
          if (res.ok) {
            const data = await res.json();
            setAuditLogs(data);
            showToast('Audit stream refreshed with latest telemetry', 'info');
          }
        } catch (e) {
          showToast('Failed to refresh audit stream', 'error');
        }
      }
    }, "🔄 Refresh Stream"), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary",
      onClick: () => {
        const headers = 'ID,Timestamp,Actor,Role,Category,Action,Details,Severity\n';
        const rows = filteredLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.category}","${l.action}","${(l.details || '').replace(/"/g, '""')}","${l.severity}"`).join('\n');
        const blob = new Blob([headers + rows], {
          type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `APEX_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Audit trail exported as CSV', 'success');
      }
    }, "📥 Export Audit CSV"))), /*#__PURE__*/React.createElement("div", {
      className: "card-container mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row g-3 align-items-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-5"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "🔍 Search audit logs by actor, action, or keyword...",
      value: auditSearch,
      onChange: e => setAuditSearch(e.target.value),
      className: "form-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end"
    }, ['ALL', 'Security', 'Conflict', 'Budget', 'Resource', 'System'].map(cat => /*#__PURE__*/React.createElement("button", {
      key: cat,
      className: `btn btn-small ${auditFilterCategory === cat ? 'btn-primary' : 'btn-secondary'}`,
      onClick: () => setAuditFilterCategory(cat)
    }, cat === 'ALL' ? 'All Activities' : cat))))), /*#__PURE__*/React.createElement("div", {
      className: "table-card-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-toolbar"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: '0.95rem'
      }
    }, "Activity Stream (", filteredLogs.length, " Entries)")), /*#__PURE__*/React.createElement("div", {
      className: "table-responsive"
    }, /*#__PURE__*/React.createElement("table", {
      className: "enterprise-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "Actor / Role"), /*#__PURE__*/React.createElement("th", null, "Category"), /*#__PURE__*/React.createElement("th", null, "Action"), /*#__PURE__*/React.createElement("th", null, "Details & Context"), /*#__PURE__*/React.createElement("th", null, "Severity"))), /*#__PURE__*/React.createElement("tbody", null, filteredLogs.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      colSpan: "6",
      className: "text-center py-4 text-muted"
    }, "No activity logs match the selected filter criteria.")) : filteredLogs.map(log => /*#__PURE__*/React.createElement("tr", {
      key: log.id
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        whiteSpace: 'nowrap',
        fontSize: '0.8rem',
        color: 'var(--slate-600)'
      }
    }, new Date(log.timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, log.actor), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontSize: '0.72rem',
        color: 'var(--slate-500)'
      }
    }, log.role)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "card-badge-pill",
      style: {
        fontWeight: 600,
        backgroundColor: log.category === 'Security' ? 'rgba(239, 68, 68, 0.1)' : log.category === 'Conflict' ? 'rgba(245, 158, 11, 0.1)' : log.category === 'Budget' ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-50)',
        color: log.category === 'Security' ? '#dc2626' : log.category === 'Conflict' ? '#d97706' : log.category === 'Budget' ? '#059669' : 'var(--primary-700)'
      }
    }, log.category)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, log.action)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--slate-700)',
        maxWidth: '350px'
      }
    }, log.details), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: `badge-status ${log.severity === 'Success' ? 'available' : log.severity === 'Warning' ? 'collision' : 'pending'}`,
      style: {
        fontSize: '0.75rem'
      }
    }, log.severity)))))))));
  };
  return /*#__PURE__*/React.createElement("div", {
    id: "app-workspace"
  }, mobileSidebarOpen && /*#__PURE__*/React.createElement("div", {
    className: "mobile-sidebar-backdrop",
    onClick: () => setMobileSidebarOpen(false)
  }), /*#__PURE__*/React.createElement("aside", {
    className: `app-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-logo-icon"
  }, "▲"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-brand-text"
  }, /*#__PURE__*/React.createElement("h1", null, "APEX"), /*#__PURE__*/React.createElement("p", null, "RESOURCE MATRIX"))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-container"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('dashboard');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📊"), /*#__PURE__*/React.createElement("span", null, "Dashboard")), /*#__PURE__*/React.createElement("a", {
    href: "/",
    className: "nav-item",
    style: {
      textDecoration: 'none'
    },
    title: "Open Public Landing Page"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🌐"), /*#__PURE__*/React.createElement("span", null, "Public Landing Page"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: '0.75rem',
      color: 'var(--primary-600)'
    }
  }, "→")))), (allowedTabs.includes('events') || allowedTabs.includes('tasks') || allowedTabs.includes('calendar')) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "Events & Schedule"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, allowedTabs.includes('events') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'events' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('events');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📅"), /*#__PURE__*/React.createElement("span", null, currentPersona.roleCode === 'STAFF' ? 'My Events' : currentPersona.roleCode === 'ORGANIZER' ? 'My Assigned Event' : 'Events Workspace')), allowedTabs.includes('calendar') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'calendar' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('calendar');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🗓️"), /*#__PURE__*/React.createElement("span", null, currentPersona.roleCode === 'STAFF' ? 'My Schedule' : 'Calendar & Gantt')), allowedTabs.includes('tasks') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'tasks' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('tasks');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "✅"), /*#__PURE__*/React.createElement("span", null, currentPersona.roleCode === 'STAFF' ? 'My Tasks' : 'Task Tracker')))), (allowedTabs.includes('staff') || allowedTabs.includes('equipment') || allowedTabs.includes('venues') || allowedTabs.includes('vendors')) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "Resources"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, allowedTabs.includes('staff') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'staff' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('staff');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "👥"), /*#__PURE__*/React.createElement("span", null, currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Staff' : 'Staff & Crew')), allowedTabs.includes('equipment') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'equipment' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('equipment');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📦"), /*#__PURE__*/React.createElement("span", null, "Equipment Stock")), allowedTabs.includes('venues') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'venues' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('venues');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🏛️"), /*#__PURE__*/React.createElement("span", null, "Venues Registry")), allowedTabs.includes('vendors') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'vendors' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('vendors');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🤝"), /*#__PURE__*/React.createElement("span", null, "Vendor Matrix")))), (allowedTabs.includes('budget') || allowedTabs.includes('reports')) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "Finance & Reports"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, allowedTabs.includes('budget') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'budget' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('budget');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "💰"), /*#__PURE__*/React.createElement("span", null, "Budgets & POs")), allowedTabs.includes('reports') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'reports' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('reports');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📈"), /*#__PURE__*/React.createElement("span", null, "Executive Reports")))), (allowedTabs.includes('simulator') || allowedTabs.includes('floorplan') || allowedTabs.includes('weather') || allowedTabs.includes('audit')) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "Smart Tools & Audit"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, allowedTabs.includes('simulator') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'simulator' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('simulator');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🧮"), /*#__PURE__*/React.createElement("span", null, "ROI Simulator")), allowedTabs.includes('floorplan') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'floorplan' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('floorplan');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📐"), /*#__PURE__*/React.createElement("span", null, "Venue Studio 2D")), allowedTabs.includes('weather') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'weather' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('weather');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🌦️"), /*#__PURE__*/React.createElement("span", null, "Weather Radar")), allowedTabs.includes('audit') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'audit' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('audit');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "📜"), /*#__PURE__*/React.createElement("span", null, "Audit Stream")))), (allowedTabs.includes('aws') || allowedTabs.includes('admin')) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nav-section-label"
  }, "System & Security"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-nav-group"
  }, allowedTabs.includes('aws') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'aws' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('aws');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "☁️"), /*#__PURE__*/React.createElement("span", null, "AWS Cloud Center")), allowedTabs.includes('admin') && /*#__PURE__*/React.createElement("button", {
    className: `nav-item ${activeTab === 'admin' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('admin');
      setMobileSidebarOpen(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-icon"
  }, "🛡️"), /*#__PURE__*/React.createElement("span", null, "Users & RBAC Roles"))))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-user-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "persona-profile-pill",
    style: {
      cursor: 'pointer',
      transition: 'background-color var(--transition-fast)',
      padding: '0.25rem 0.4rem',
      borderRadius: 'var(--radius-sm)'
    },
    onClick: () => {
      setModalData(currentPersona);
      setActiveModal('my-credentials');
    },
    title: "Click to Edit Your Corporate Mail ID & Password"
  }, /*#__PURE__*/React.createElement("div", {
    className: "persona-avatar"
  }, currentPersona.avatar), /*#__PURE__*/React.createElement("div", {
    className: "persona-details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "persona-name"
  }, currentPersona.name), /*#__PURE__*/React.createElement("div", {
    className: "persona-role"
  }, currentPersona.userRole)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--slate-400)',
      marginLeft: 'auto'
    },
    title: "Edit Profile & Password"
  }, "⚙️")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-small w-100 mt-2 d-flex align-items-center justify-content-center gap-1",
    style: {
      fontSize: '0.78rem',
      color: 'var(--slate-600)'
    },
    onClick: handleLogout,
    title: "Logout and return to Public Landing Page"
  }, /*#__PURE__*/React.createElement("span", null, "🚪 Sign Out to Landing Page")))), /*#__PURE__*/React.createElement("div", {
    className: "app-main-layout"
  }, /*#__PURE__*/React.createElement("header", {
    className: "app-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topbar-left"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small d-lg-none",
    onClick: () => setMobileSidebarOpen(prev => !prev)
  }, /*#__PURE__*/React.createElement("span", null, "☰")), /*#__PURE__*/React.createElement("div", {
    className: "breadcrumb-area"
  }, /*#__PURE__*/React.createElement("span", {
    className: "breadcrumb-root"
  }, "APEX"), /*#__PURE__*/React.createElement("span", {
    className: "breadcrumb-separator"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "breadcrumb-active",
    style: {
      textTransform: 'capitalize'
    }
  }, activeTab === 'aws' ? 'AWS Cloud' : activeTab === 'simulator' ? 'ROI Simulator' : activeTab === 'floorplan' ? 'Venue Studio 2D' : activeTab === 'weather' ? 'Weather Radar' : activeTab === 'audit' ? 'Live Audit Stream' : activeTab))), /*#__PURE__*/React.createElement("div", {
    className: "topbar-right"
  }, /*#__PURE__*/React.createElement("a", {
    href: "/",
    className: "btn btn-secondary btn-small d-none d-lg-inline-flex align-items-center gap-1",
    title: "Open Public Client Event Portal",
    style: {
      textDecoration: 'none',
      color: 'var(--primary-700)',
      borderColor: 'var(--primary-200)',
      backgroundColor: 'var(--primary-50)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "🌐 Portal")), /*#__PURE__*/React.createElement("button", {
    className: "search-trigger-btn",
    onClick: () => setCommandPaletteOpen(true),
    title: "Quick Command Palette (Ctrl+K)"
  }, /*#__PURE__*/React.createElement("span", null, "🔍"), /*#__PURE__*/React.createElement("span", {
    className: "d-none d-md-inline"
  }, "Search"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill d-none d-md-inline"
  }, "Ctrl+K")), totalConflictsCount > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "status-chip collision d-none d-sm-inline-flex",
    onClick: () => setActiveTab('dashboard'),
    title: "Active Resource Collision Warnings"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse-dot anim"
  }), /*#__PURE__*/React.createElement("span", null, totalConflictsCount, " Clash", totalConflictsCount > 1 ? 'es' : '')) : /*#__PURE__*/React.createElement("div", {
    className: "status-chip clean d-none d-sm-inline-flex",
    title: "All Resources & Schedules Synced"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse-dot"
  }), /*#__PURE__*/React.createElement("span", null, "All Clear")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-warning btn-small d-none d-lg-inline-flex",
    onClick: handleAutoResolve,
    title: "Smart Auto-Resolve Collisions"
  }, /*#__PURE__*/React.createElement("span", null, "⚡ Auto-Resolve")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small d-none d-md-inline-flex",
    onClick: () => setActiveModal('export'),
    title: "Export Reports & Manifests"
  }, /*#__PURE__*/React.createElement("span", null, "📥 Export")), /*#__PURE__*/React.createElement("select", {
    className: "d-none d-lg-inline-block",
    value: currency,
    onChange: e => handleCurrencyChange(e.target.value),
    style: {
      width: 'auto',
      padding: '0.35rem 1.8rem 0.35rem 0.65rem',
      fontSize: '0.8rem',
      height: '32px'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "USD"
  }, "USD ($)"), /*#__PURE__*/React.createElement("option", {
    value: "EUR"
  }, "EUR (€)"), /*#__PURE__*/React.createElement("option", {
    value: "GBP"
  }, "GBP (£)"), /*#__PURE__*/React.createElement("option", {
    value: "CAD"
  }, "CAD (CA$)"), /*#__PURE__*/React.createElement("option", {
    value: "JPY"
  }, "JPY (¥)"), /*#__PURE__*/React.createElement("option", {
    value: "INR"
  }, "INR (₹)")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small d-none d-xl-inline-flex",
    onClick: () => setShortcutsOpen(true),
    title: "Keyboard Shortcuts Sheet"
  }, /*#__PURE__*/React.createElement("span", null, "⌨️")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small d-inline-flex align-items-center gap-1",
    onClick: () => {
      setModalData(currentPersona);
      setActiveModal('my-credentials');
    },
    title: "Edit User Profile & Credentials"
  }, /*#__PURE__*/React.createElement("span", null, "👤 ", currentPersona.name.split(' ')[0])), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-small",
    onClick: handleLogout,
    title: "Sign Out"
  }, /*#__PURE__*/React.createElement("span", null, "Logout")))), /*#__PURE__*/React.createElement("main", {
    className: "app-content-viewport"
  }, !allowedTabs.includes(activeTab) && /*#__PURE__*/React.createElement("div", {
    className: "card-container text-center",
    style: {
      maxWidth: '640px',
      margin: '4rem auto',
      padding: '3.5rem 2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '3.8rem',
      marginBottom: '1rem'
    }
  }, "⛔"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.6rem',
      color: 'var(--danger-700)',
      marginBottom: '0.75rem',
      fontWeight: 800
    }
  }, "403 — Access Restricted"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '1rem',
      color: 'var(--slate-700)',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    }
  }, "You don't have permission to access the ", /*#__PURE__*/React.createElement("strong", null, activeTab.toUpperCase()), " module."), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: 'var(--slate-50)',
      padding: '1.25rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)',
      marginBottom: '2rem',
      textAlign: 'left',
      fontSize: '0.86rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Current Persona:"), " ", currentPersona.name, " (", currentPersona.email, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Assigned Role:"), " ", /*#__PURE__*/React.createElement("span", {
    className: "badge-status in-progress",
    style: {
      fontWeight: 700
    }
  }, currentPersona.userRole)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Operational Scope:"), " ", currentPersona.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.6rem',
      color: 'var(--slate-500)',
      borderTop: '1px dashed var(--border-light)',
      paddingTop: '0.5rem'
    }
  }, "🔒 All mutations and data access are verified server-side. Lower-level operational roles cannot access administrative configuration or unrelated event domains.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setActiveTab('dashboard'),
    style: {
      padding: '0.75rem 2rem',
      fontSize: '0.95rem',
      fontWeight: 700
    }
  }, "↩ Return to Authorized Dashboard")), activeTab === 'dashboard' && allowedTabs.includes('dashboard') && /*#__PURE__*/React.createElement("div", null, currentPersona.roleCode === 'SUPER_ADMIN' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "👑 Super Admin Platform Command Center"), /*#__PURE__*/React.createElement("p", null, "Full platform governance: System-wide event oversight, Event Admin management, resource conflict resolution, and cloud infra.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setActiveTab('admin')
  }, "🛡️ Manage Roles & Users"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('event');
    }
  }, "＋ Create Event"))), totalConflictsCount > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "alert-banner warning"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.5rem'
    }
  }, "⚠️"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '0.95rem'
    }
  }, "System-Wide Resource Collisions Detected"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.82rem',
      color: 'var(--warning-700)'
    }
  }, conflicts.staffConflicts?.length || 0, " staff collision(s), ", conflicts.equipmentConflicts?.length || 0, " gear deficit(s), and ", conflicts.venueConflicts?.length || 0, " venue collision(s)."))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-warning btn-small",
    onClick: handleAutoResolve,
    style: {
      fontWeight: 700
    }
  }, "⚡ 1-Click Auto-Resolve All")) : /*#__PURE__*/React.createElement("div", {
    className: "alert-banner success",
    style: {
      marginBottom: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.25rem'
    }
  }, "✓"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '0.92rem'
    }
  }, "All System Resources & Timelines Synced"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.8rem',
      color: 'var(--success-700)'
    }
  }, "Platform-wide zero collision state across all active events, crew schedules, and gear inventory.")))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box blue"
  }, "📅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total Platform Events"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, events.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, events.filter(e => e.status === 'Confirmed').length, " Confirmed • ", events.filter(e => e.status === 'Draft').length, " Draft"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box purple"
  }, "👔"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Event Admins & Organizers"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length + users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length, " Admins • ", users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length, " Organizers"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box green"
  }, "👥"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total Staff Pool"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, staff.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, staff.filter(s => !s.isDoubleBooked).length, " Available • ", staff.filter(s => s.isDoubleBooked).length, " Collisions"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box amber"
  }, "💰"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total Platform Spend"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, analytics?.overallBurnPercent || 0, "% of ", currencySymbol, ((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  }), " Cap"))))), currentPersona.roleCode === 'EVENT_ADMIN' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "👔 Event Admin Operations Dashboard"), /*#__PURE__*/React.createElement("p", null, "Managing assigned event scopes, delegating organizers, scheduling staff crew, and tracking event expenditure.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('event');
    }
  }, "＋ Create Event"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box blue"
  }, "📅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Managed Events"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, events.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Assigned to your management scope"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box purple"
  }, "📋"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Assigned Organizers"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Direct event coordinators"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box green"
  }, "👥"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Staff Crew"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, staff.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Available for event deployment"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box amber"
  }, "💰"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Scope Spend"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Managed event expenditure"))))), currentPersona.roleCode === 'ORGANIZER' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "📋 Event Organizer Operational Workspace"), /*#__PURE__*/React.createElement("p", null, "Operational execution for assigned event: task tracking, crew coordination, and hardware logistics.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('task');
    }
  }, "＋ Create Task"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box blue"
  }, "📅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Assigned Event"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      fontSize: '1.2rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, events[0]?.title || 'Tech Summit 2026'), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "📍 ", events[0]?.venue || 'Innovation Arena'))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box green"
  }, "👥"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Assigned Staff"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, staff.filter(s => s.assignedEventId === (events[0]?.id || 'ev1')).length || 2), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Staff crew deployed to this event"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box purple"
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Active Tasks"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, tasks.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, tasks.filter(t => t.status === 'Completed').length, " Done • ", tasks.filter(t => t.status !== 'Completed').length, " Pending"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box amber"
  }, "📦"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Allocated Equipment"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, equipment.length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Gear assigned to venue"))))), currentPersona.roleCode === 'STAFF' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "👷 Staff Operations & Task Checklist"), /*#__PURE__*/React.createElement("p", null, "View your assigned shifts, run-of-show details, and update execution status on assigned tasks."))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box blue"
  }, "📅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "My Assigned Event"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      fontSize: '1.2rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, events[0]?.title || 'Tech Summit 2026'), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "📍 ", events[0]?.venue || 'Innovation Arena'))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box amber"
  }, "⏳"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "My Pending Tasks"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, tasks.filter(t => t.status !== 'Completed').length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Tasks awaiting completion"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box green"
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "My Completed Tasks"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, tasks.filter(t => t.status === 'Completed').length), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Submitted & validated"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box purple"
  }, "👤"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "My Shift Profile"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      fontSize: '1.1rem'
    }
  }, "Active"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, currentPersona.email)))), /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, "📝 My Assigned Operational Tasks")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Task Description"), /*#__PURE__*/React.createElement("th", null, "Event"), /*#__PURE__*/React.createElement("th", null, "Priority"), /*#__PURE__*/React.createElement("th", null, "Deadline"), /*#__PURE__*/React.createElement("th", null, "Current Status"), /*#__PURE__*/React.createElement("th", null, "Action"))), /*#__PURE__*/React.createElement("tbody", null, tasks.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "6",
    style: {
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--slate-400)'
    }
  }, "No tasks currently assigned to your roster.")) : tasks.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--slate-500)'
    }
  }, t.description)), /*#__PURE__*/React.createElement("td", null, events.find(e => e.id === t.eventId)?.title || t.eventId), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${t.priority === 'High' ? 'collision' : 'draft'}`
  }, t.priority)), /*#__PURE__*/React.createElement("td", null, t.deadline || 'Today'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${t.status === 'Completed' ? 'available' : t.status === 'In Progress' ? 'in-progress' : 'pending'}`
  }, t.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.35rem'
    }
  }, t.status !== 'In Progress' && t.status !== 'Completed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => handleUpdateTaskStatus(t.id, 'In Progress', 'Started work on task')
  }, "▶ Start"), t.status !== 'Completed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-small",
    onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Task finished on schedule')
  }, "✓ Complete"), t.status === 'Completed' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--success-700)',
      fontWeight: 600
    }
  }, "✓ Done")))))))))), currentPersona.roleCode !== 'STAFF' && /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Event Run-of-Show' : 'Active Event Schedules & Financial Rollup'), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => setActiveTab('events')
  }, "View All in Events Workspace →")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Event Title"), /*#__PURE__*/React.createElement("th", null, "Venue Location"), /*#__PURE__*/React.createElement("th", null, "Date Window"), /*#__PURE__*/React.createElement("th", null, "Duration"), /*#__PURE__*/React.createElement("th", null, "Budget Cap"), /*#__PURE__*/React.createElement("th", null, "Actual Spend"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, events.map(ev => /*#__PURE__*/React.createElement("tr", {
    key: ev.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, ev.title), ev.hasConflict && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--danger-500)',
      marginLeft: '0.4rem'
    }
  }, "⚠️")), /*#__PURE__*/React.createElement("td", null, "📍 ", ev.venue), /*#__PURE__*/React.createElement("td", null, ev.startDate, " to ", ev.endDate), /*#__PURE__*/React.createElement("td", null, ev.durationDays, " days"), /*#__PURE__*/React.createElement("td", null, currencySymbol, (ev.budget * currencyRate).toLocaleString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, currencySymbol, ((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  }))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${ev.status.toLowerCase().replace(' ', '-')}`
  }, ev.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setSelectedEventId(ev.id);
      setActiveTab('events');
    }
  }, "Inspect Details")))))))), /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '1rem'
    }
  }, "🗓️ Run-of-Show Scheduling Timeline (September 2026)"), /*#__PURE__*/React.createElement("div", {
    className: "timeline-visual-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-days-ruler"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left',
      paddingLeft: '0.5rem'
    }
  }, "Event Title"), Array.from({
    length: 30
  }, (_, d) => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: "ruler-day"
  }, d + 1))), /*#__PURE__*/React.createElement("div", {
    className: "timeline-rows"
  }, events.map(ev => {
    const startDay = parseInt(ev.startDate.split('-')[2] || '1', 10);
    const endDay = parseInt(ev.endDate.split('-')[2] || '3', 10);
    const leftPercent = (startDay - 1) / 30 * 100;
    const widthPercent = Math.max(4, (endDay - startDay + 1) / 30 * 100);
    return /*#__PURE__*/React.createElement("div", {
      key: ev.id,
      className: "timeline-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "timeline-event-name",
      onClick: () => {
        setSelectedEventId(ev.id);
        setActiveTab('events');
      }
    }, ev.title), /*#__PURE__*/React.createElement("div", {
      className: "timeline-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: `timeline-bar ${ev.hasConflict ? 'conflict' : ev.status === 'Draft' ? 'draft' : ''}`,
      style: {
        left: `${leftPercent}%`,
        width: `${widthPercent}%`
      },
      onClick: () => {
        setSelectedEventId(ev.id);
        setActiveTab('events');
      }
    }, ev.title)));
  }))))), activeTab === 'events' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Events & Scheduling Workspace"), /*#__PURE__*/React.createElement("p", null, "Organize, schedule, and allocate staff, equipment, and vendors to events.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "btn-group",
    style: {
      display: 'inline-flex',
      background: 'var(--slate-100)',
      padding: '2px',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventViewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventViewMode('list')
  }, "🗂️ Split Inspector"), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventViewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventViewMode('kanban')
  }, "📋 Kanban Board")), (currentPersona.roleCode === 'SUPER_ADMIN' || currentPersona.roleCode === 'EVENT_ADMIN') && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('event');
    }
  }, "＋ Add Event"))), /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar mb-3",
    style: {
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-search-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "table-search-icon"
  }, "🔍"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search events by title or venue...",
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem',
      flexWrap: 'wrap'
    }
  }, ['ALL', 'CONFIRMED', 'DRAFT', 'IN PROGRESS', 'COMPLETED'].map(st => /*#__PURE__*/React.createElement("button", {
    key: st,
    className: `btn btn-small ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setStatusFilter(st)
  }, st)))), eventViewMode === 'list' ? /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-5",
    style: {
      maxHeight: '72vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }
  }, filteredEvents.map(ev => /*#__PURE__*/React.createElement("div", {
    key: ev.id,
    className: "card-container",
    style: {
      cursor: 'pointer',
      borderColor: selectedEventId === ev.id ? 'var(--primary-500)' : 'var(--border-light)',
      backgroundColor: selectedEventId === ev.id ? 'var(--primary-50)' : '#ffffff'
    },
    onClick: () => setSelectedEventId(ev.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.35rem'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.95rem',
      margin: 0,
      color: 'var(--slate-900)'
    }
  }, ev.title, " ", ev.hasConflict && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--danger-500)'
    }
  }, "⚠️")), /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${ev.status.toLowerCase().replace(' ', '-')}`
  }, ev.status)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.82rem',
      margin: '0 0 0.4rem 0',
      color: 'var(--slate-600)'
    }
  }, "📍 ", ev.venue), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.78rem',
      color: 'var(--slate-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "📅 ", ev.startDate, " to ", ev.endDate), /*#__PURE__*/React.createElement("span", null, "Spent: ", /*#__PURE__*/React.createElement("strong", null, currencySymbol, ((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-7"
  }, activeEvent ? /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
      borderBottom: '1px solid var(--border-light)',
      paddingBottom: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.2rem',
      marginBottom: '0.25rem'
    }
  }, activeEvent.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--slate-600)',
      display: 'flex',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, "📍 Venue: ", /*#__PURE__*/React.createElement("strong", null, activeEvent.venue)), /*#__PURE__*/React.createElement("span", null, "📅 Window: ", /*#__PURE__*/React.createElement("strong", null, activeEvent.startDate, " to ", activeEvent.endDate), " (", activeEvent.durationDays, " days)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(activeEvent);
      setActiveModal('event');
    }
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-small",
    onClick: async () => {
      if (confirm('Delete this event?')) {
        await fetch(`/api/events/${activeEvent.id}`, {
          method: 'DELETE'
        });
        showToast('Event deleted', 'success');
        fetchAllData();
      }
    }
  }, "Delete"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.25rem',
      borderBottom: '1px solid var(--border-light)',
      paddingBottom: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventSubTab('overview')
  }, "ℹ️ Overview & Milestones"), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventSubTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventSubTab('resources')
  }, "👥 Resources"), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventSubTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventSubTab('tasks')
  }, "✅ Tasks (", tasks.filter(t => t.eventId === activeEvent.id).length, ")"), /*#__PURE__*/React.createElement("button", {
    className: `btn btn-small ${eventSubTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`,
    onClick: () => setEventSubTab('budget')
  }, "💰 Budget Variance")), eventSubTab === 'overview' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--slate-600)',
      fontSize: '0.85rem',
      marginBottom: '1.25rem'
    }
  }, activeEvent.description || 'No descriptive overview provided for this event.'), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.92rem',
      marginBottom: '0.75rem'
    }
  }, "Hourly Run-of-Show Milestones"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, (activeEvent.milestones || []).map((m, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.65rem 0.85rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--primary-600)',
      fontWeight: 700,
      fontSize: '0.82rem'
    }
  }, m.time), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: '0.85rem'
    }
  }, m.title), /*#__PURE__*/React.createElement("span", {
    className: "badge-status confirmed"
  }, m.status))))), eventSubTab === 'resources' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-small",
    onClick: () => {
      setModalData({
        eventId: activeEvent.id
      });
      setActiveModal('assign');
    }
  }, "＋ Assign Staff"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-small",
    onClick: () => {
      setModalData({
        eventId: activeEvent.id
      });
      setActiveModal('allocate');
    }
  }, "＋ Allocate Hardware"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-small",
    onClick: () => {
      setModalData({
        eventId: activeEvent.id
      });
      setActiveModal('coord');
    }
  }, "＋ Add Vendor")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--slate-500)',
      fontSize: '0.82rem'
    }
  }, "Use the action buttons above to assign crew, book warehouse equipment quotas, and engage vendors for this event.")), eventSubTab === 'tasks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: '0.95rem'
    }
  }, "Assigned Operational Tasks"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-small",
    onClick: () => {
      setModalData({
        eventId: activeEvent.id
      });
      setActiveModal('task');
    }
  }, "＋ Add Task")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }
  }, tasks.filter(t => t.eventId === activeEvent.id).length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--slate-400)',
      fontSize: '0.82rem'
    }
  }, "No tasks created for this event yet.") : tasks.filter(t => t.eventId === activeEvent.id).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.65rem 0.85rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: '0.88rem'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--slate-500)'
    }
  }, "👤 ", t.staff?.name || 'Unassigned', " • ⏰ Due ", t.deadline, " • Priority: ", /*#__PURE__*/React.createElement("strong", null, t.priority))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`
  }, t.status), t.status !== 'Completed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success btn-small",
    onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Marked done by coordinator')
  }, "✓ Done")))))), eventSubTab === 'budget' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '0.92rem',
      marginBottom: '0.5rem'
    }
  }, "Budget Cap & Spend Telemetry"), /*#__PURE__*/React.createElement("div", {
    className: "progress-track",
    style: {
      height: '10px',
      marginBottom: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `progress-fill ${(activeEvent.costs?.total || 0) > activeEvent.budget ? 'danger' : ''}`,
    style: {
      width: `${Math.min(100, Math.round((activeEvent.costs?.total || 0) / (activeEvent.budget || 1) * 100))}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Spent: ", /*#__PURE__*/React.createElement("strong", null, currencySymbol, ((activeEvent.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  }))), /*#__PURE__*/React.createElement("span", null, "Allocated Cap: ", /*#__PURE__*/React.createElement("strong", null, currencySymbol, (activeEvent.budget * currencyRate).toLocaleString()))))) : /*#__PURE__*/React.createElement("div", {
    className: "card-container text-center py-5"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '2.5rem'
    }
  }, "📅"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.5rem'
    }
  }, "Select an event from the left list to inspect details.")))) :
  /*#__PURE__*/
  /* KANBAN BOARD VIEW */
  React.createElement("div", {
    className: "kanban-view-grid"
  }, ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(colStatus => /*#__PURE__*/React.createElement("div", {
    key: colStatus,
    className: "kanban-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kanban-col-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kanban-col-title"
  }, colStatus), /*#__PURE__*/React.createElement("span", {
    className: "kanban-col-count"
  }, events.filter(e => e.status === colStatus).length)), /*#__PURE__*/React.createElement("div", {
    className: "kanban-cards-stack"
  }, events.filter(e => e.status === colStatus).map(ev => /*#__PURE__*/React.createElement("div", {
    key: ev.id,
    className: "kanban-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kanban-card-title"
  }, ev.title), /*#__PURE__*/React.createElement("div", {
    className: "kanban-card-meta"
  }, "📍 ", ev.venue), /*#__PURE__*/React.createElement("div", {
    className: "kanban-card-meta"
  }, "📅 ", ev.startDate, " to ", ev.endDate), /*#__PURE__*/React.createElement("div", {
    className: "kanban-card-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => handleMoveKanban(ev.id, 'prev'),
    disabled: colStatus === 'Draft'
  }, "◀"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => handleMoveKanban(ev.id, 'next'),
    disabled: colStatus === 'Cancelled'
  }, "▶"))))))))), activeTab === 'calendar' && renderCalendarTab(), activeTab === 'tasks' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Operational Task Tracker & Shift Assignments"), /*#__PURE__*/React.createElement("p", null, "Assign deliverables to staff members, monitor deadlines, and track real-time completion.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('task');
    }
  }, "＋ Create New Task")), /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, "Active Tasks Matrix")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Task Title"), /*#__PURE__*/React.createElement("th", null, "Associated Event"), /*#__PURE__*/React.createElement("th", null, "Assigned Staff"), /*#__PURE__*/React.createElement("th", null, "Deadline"), /*#__PURE__*/React.createElement("th", null, "Priority"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, tasks.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--slate-500)'
    }
  }, t.description)), /*#__PURE__*/React.createElement("td", null, "📅 ", t.event?.title || 'General'), /*#__PURE__*/React.createElement("td", null, "👤 ", t.staff?.name || 'Unassigned', " (", t.staff?.role || 'Staff', ")"), /*#__PURE__*/React.createElement("td", null, "⏰ ", t.deadline), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${t.priority === 'Urgent' ? 'collision' : t.priority === 'High' ? 'draft' : 'available'}`
  }, t.priority)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`
  }, t.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.3rem'
    }
  }, t.status !== 'Completed' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-success btn-small",
    onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Done by user')
  }, "✓ Complete"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-small",
    onClick: async () => {
      await fetch(`/api/tasks/${t.id}`, {
        method: 'DELETE'
      });
      showToast('Task deleted', 'success');
      fetchAllData();
    }
  }, "✕")))))))))), activeTab === 'staff' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Staff & Crew Directory"), /*#__PURE__*/React.createElement("p", null, "Manage personnel profiles, daily billing rates, and track shift allocations.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('staff');
    }
  }, "＋ Register Staff Member")), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, staff.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      margin: 0
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--slate-500)'
    }
  }, s.role)), /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${s.isDoubleBooked ? 'collision' : 'available'}`
  }, s.isDoubleBooked ? '⚠️ Collision' : 'Available')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--slate-600)',
      margin: '0.6rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, "📞 ", s.contact || 'No contact specified'), /*#__PURE__*/React.createElement("div", null, "💵 Daily Rate: ", /*#__PURE__*/React.createElement("strong", null, "$", s.dailyRate, "/day")), /*#__PURE__*/React.createElement("div", null, "📅 Active Assignments: ", /*#__PURE__*/React.createElement("strong", null, s.assignedEventsCount || 0)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.35rem',
      color: 'var(--primary-600)'
    }
  }, "✅ Assigned Tasks: ", /*#__PURE__*/React.createElement("strong", null, tasks.filter(t => t.staffId === s.id).length)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData({
        type: 'staff',
        item: s
      });
      setActiveModal('badge');
    }
  }, "🪪 Print Pass"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(s);
      setActiveModal('staff');
    }
  }, "Edit Profile"))))))), activeTab === 'equipment' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Equipment & Warehouse Inventory"), /*#__PURE__*/React.createElement("p", null, "Track hardware stock, rental rates, and peak allocation across events.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('equipment');
    }
  }, "＋ Add Equipment Item")), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, equipment.map(eq => /*#__PURE__*/React.createElement("div", {
    key: eq.id,
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      margin: 0
    }
  }, eq.name), /*#__PURE__*/React.createElement("span", {
    className: "card-badge-pill"
  }, eq.category)), /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${eq.isOverAllocated ? 'deficit' : 'in-stock'}`
  }, eq.isOverAllocated ? 'Deficit' : 'In Stock')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--slate-600)',
      margin: '0.6rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Warehouse Stock: ", /*#__PURE__*/React.createElement("strong", null, eq.totalStock, " units")), /*#__PURE__*/React.createElement("div", null, "Rental Rate: ", /*#__PURE__*/React.createElement("strong", null, "$", eq.rentalRate, "/day")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Peak Utilization:"), /*#__PURE__*/React.createElement("strong", null, eq.utilizationPercent || 0, "% (", eq.peakAllocated || 0, " reserved)")), /*#__PURE__*/React.createElement("div", {
    className: "progress-track",
    style: {
      marginTop: '0.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `progress-fill ${eq.utilizationPercent > 100 ? 'danger' : eq.utilizationPercent > 80 ? 'warning' : 'success'}`,
    style: {
      width: `${Math.min(100, eq.utilizationPercent || 0)}%`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData({
        type: 'equipment',
        item: eq
      });
      setActiveModal('badge');
    }
  }, "🏷️ Print QR Tag"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(eq);
      setActiveModal('equipment');
    }
  }, "Edit Item"))))))), activeTab === 'venues' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Venues & Facility Registry"), /*#__PURE__*/React.createElement("p", null, "Manage event venue locations, seating capacities, and amenities.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('venue');
    }
  }, "＋ Add Venue Location")), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, venues.map(vn => /*#__PURE__*/React.createElement("div", {
    key: vn.id,
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      margin: 0
    }
  }, vn.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--slate-500)'
    }
  }, "Capacity: ", /*#__PURE__*/React.createElement("strong", null, vn.capacity, " guests"))), /*#__PURE__*/React.createElement("span", {
    className: "card-badge-pill"
  }, "$", vn.pricing, "/day")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--slate-600)',
      margin: '0.6rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, "✨ Amenities: ", vn.amenities), /*#__PURE__*/React.createElement("div", null, "📅 Current Bookings: ", /*#__PURE__*/React.createElement("strong", null, vn.totalBookings || 0, " event(s)")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(vn);
      setActiveModal('venue');
    }
  }, "Edit Venue"))))))), activeTab === 'vendors' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Vendor Coordination & Contracts"), /*#__PURE__*/React.createElement("p", null, "Track third-party catering, security, audio-visual, and decor suppliers.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('vendor');
    }
  }, "＋ Register Vendor")), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, vendors.map(vd => /*#__PURE__*/React.createElement("div", {
    key: vd.id,
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100 d-flex flex-column justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      margin: 0
    }
  }, vd.name), /*#__PURE__*/React.createElement("span", {
    className: "card-badge-pill"
  }, vd.category)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--warning-600)',
      fontWeight: 700
    }
  }, "★ ", vd.rating || 4.8)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--slate-600)',
      margin: '0.6rem 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, "📧 ", vd.email), /*#__PURE__*/React.createElement("div", null, "📞 ", vd.contact || 'No phone'), /*#__PURE__*/React.createElement("div", null, "💼 Total Contracts: ", /*#__PURE__*/React.createElement("strong", null, vd.contractCount || 0), " ($", (vd.totalContractValue || 0).toLocaleString(), ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem',
      borderTop: '1px solid var(--border-light)',
      paddingTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(vd);
      setActiveModal('vendor');
    }
  }, "Edit Profile"))))))), activeTab === 'budget' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Financial Budgeting & Purchase Orders"), /*#__PURE__*/React.createElement("p", null, "Real-time expenditure tracking, currency conversion, and purchase order approvals."))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box blue"
  }, "💵"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total Allocated Cap"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, currencySymbol, ((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Aggregated budget limits"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box amber"
  }, "💳"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total Actual Spend"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, "Staff, Equipment & Vendor costs"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-icon-box green"
  }, "📊"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Net Variance"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      color: (analytics?.totalVariance || 0) >= 0 ? 'var(--success-600)' : 'var(--danger-600)'
    }
  }, currencySymbol, ((analytics?.totalVariance || 0) * currencyRate).toLocaleString(undefined, {
    maximumFractionDigits: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-sub"
  }, (analytics?.totalVariance || 0) >= 0 ? 'Under Budget' : 'Over Budget')))), /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, "Event-by-Event Financial Variance Matrix")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Event Title"), /*#__PURE__*/React.createElement("th", null, "Duration"), /*#__PURE__*/React.createElement("th", null, "Allocated Budget"), /*#__PURE__*/React.createElement("th", null, "Staff Cost"), /*#__PURE__*/React.createElement("th", null, "Gear Cost"), /*#__PURE__*/React.createElement("th", null, "Vendor Cost"), /*#__PURE__*/React.createElement("th", null, "Total Spend"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, (analytics?.eventReports || []).map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.eventId
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, r.title)), /*#__PURE__*/React.createElement("td", null, r.durationDays, " days"), /*#__PURE__*/React.createElement("td", null, currencySymbol, (r.budget * currencyRate).toLocaleString()), /*#__PURE__*/React.createElement("td", null, currencySymbol, (r.breakdown.staff * currencyRate).toLocaleString()), /*#__PURE__*/React.createElement("td", null, currencySymbol, (r.breakdown.equipment * currencyRate).toLocaleString()), /*#__PURE__*/React.createElement("td", null, currencySymbol, (r.breakdown.vendor * currencyRate).toLocaleString()), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, currencySymbol, (r.totalSpent * currencyRate).toLocaleString())), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${r.variance >= 0 ? 'confirmed' : 'cancelled'}`
  }, r.variance >= 0 ? 'Under Budget' : 'Over Budget'))))))))), activeTab === 'reports' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Executive Analytics & Reports"), /*#__PURE__*/React.createElement("p", null, "Download executive summaries, staff workload telemetry, and hardware inventory manifests.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setActiveModal('export')
  }, "📥 Export All Reports")), /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '0.5rem'
    }
  }, "📄 Executive Summary Overview"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--slate-500)',
      marginBottom: '1rem'
    }
  }, "Generated by APEX Analytics Engine with real-time collision and financial metrics."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.65rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total Registered Events"), /*#__PURE__*/React.createElement("strong", null, events.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.65rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total Staff Personnel"), /*#__PURE__*/React.createElement("strong", null, staff.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.65rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Hardware Catalog Size"), /*#__PURE__*/React.createElement("strong", null, equipment.length, " items")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.65rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Overall Financial Status"), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--success-600)'
    }
  }, "Healthy (Under Budget)"))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '0.5rem'
    }
  }, "📥 Instant Data Export Options"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--slate-500)',
      marginBottom: '1rem'
    }
  }, "Export production spreadsheets or complete JSON snapshots."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => handleExport('events')
  }, "📄 Events CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => handleExport('staff')
  }, "👥 Staff CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => handleExport('equipment')
  }, "📦 Equipment CSV"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => handleExport('finance')
  }, "💰 Financial CSV")))))), activeTab === 'aws' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "AWS Cloud Infrastructure Center"), /*#__PURE__*/React.createElement("p", null, "Generate Infrastructure-as-Code (CloudFormation YAML) and compute monthly cloud estimates."))), /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '1rem'
    }
  }, "⚙️ Deployment Parameters"), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Target Environment"), /*#__PURE__*/React.createElement("select", {
    name: "env",
    defaultValue: "production"
  }, /*#__PURE__*/React.createElement("option", {
    value: "production"
  }, "Production (Multi-AZ)"), /*#__PURE__*/React.createElement("option", {
    value: "staging"
  }, "Staging (Single-AZ)"), /*#__PURE__*/React.createElement("option", {
    value: "dev"
  }, "Development (Sandbox)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "AWS Region"), /*#__PURE__*/React.createElement("select", {
    name: "region",
    defaultValue: "us-east-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: "us-east-1"
  }, "us-east-1 (N. Virginia)"), /*#__PURE__*/React.createElement("option", {
    value: "us-west-2"
  }, "us-west-2 (Oregon)"), /*#__PURE__*/React.createElement("option", {
    value: "eu-west-1"
  }, "eu-west-1 (Ireland)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "RDS Database Instance Class"), /*#__PURE__*/React.createElement("select", {
    name: "dbType",
    defaultValue: "db.t4g.medium"
  }, /*#__PURE__*/React.createElement("option", {
    value: "db.t4g.micro"
  }, "db.t4g.micro ($15/mo)"), /*#__PURE__*/React.createElement("option", {
    value: "db.t4g.medium"
  }, "db.t4g.medium ($60/mo)"), /*#__PURE__*/React.createElement("option", {
    value: "db.m6g.large"
  }, "db.m6g.large ($140/mo)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "ECS Fargate Container Tasks"), /*#__PURE__*/React.createElement("input", {
    name: "appCount",
    type: "number",
    min: "1",
    max: "10",
    defaultValue: "2"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary btn-full-width"
  }, "Generate CloudFormation YAML")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.25rem',
      padding: '1rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: 'var(--slate-500)'
    }
  }, "ESTIMATED MONTHLY AWS COST"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 800,
      color: 'var(--slate-900)'
    }
  }, "$144.50 / mo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--slate-400)'
    }
  }, "Includes 2x Fargate tasks, ALB, RDS Multi-AZ, S3, & CloudFront")))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-7"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container h-100"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '1rem'
    }
  }, "☁️ AWS Multi-Tier Deployment Topology"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--slate-900)',
      borderRadius: 'var(--radius-md)',
      padding: '1.5rem',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "280",
    viewBox: "0 0 600 280",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "600",
    height: "280",
    rx: "8",
    fill: "#0f172a"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "20",
    y: "20",
    width: "560",
    height: "240",
    rx: "8",
    stroke: "rgba(56, 189, 248, 0.3)",
    strokeDasharray: "4 4"
  }), /*#__PURE__*/React.createElement("text", {
    x: "35",
    y: "45",
    fill: "#38bdf8",
    fontFamily: "Outfit",
    fontSize: "12",
    fontWeight: "bold"
  }, "AWS SECURE VPC (Multi-AZ)"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(40, 110)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "80",
    height: "50",
    rx: "6",
    fill: "#1e293b",
    stroke: "#334155"
  }), /*#__PURE__*/React.createElement("text", {
    x: "40",
    y: "26",
    fill: "#ffffff",
    fontSize: "11",
    textAnchor: "middle",
    fontWeight: "bold"
  }, "Client SPA"), /*#__PURE__*/React.createElement("text", {
    x: "40",
    y: "40",
    fill: "#94a3b8",
    fontSize: "9",
    textAnchor: "middle"
  }, "React 18")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(180, 110)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "90",
    height: "50",
    rx: "6",
    fill: "#1e1b4b",
    stroke: "#6366f1"
  }), /*#__PURE__*/React.createElement("text", {
    x: "45",
    y: "26",
    fill: "#a5b4fc",
    fontSize: "11",
    textAnchor: "middle",
    fontWeight: "bold"
  }, "CloudFront"), /*#__PURE__*/React.createElement("text", {
    x: "45",
    y: "40",
    fill: "#94a3b8",
    fontSize: "9",
    textAnchor: "middle"
  }, "Global CDN")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(330, 110)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "100",
    height: "50",
    rx: "6",
    fill: "#042f2e",
    stroke: "#10b981"
  }), /*#__PURE__*/React.createElement("text", {
    x: "50",
    y: "26",
    fill: "#6ee7b7",
    fontSize: "11",
    textAnchor: "middle",
    fontWeight: "bold"
  }, "ECS Fargate"), /*#__PURE__*/React.createElement("text", {
    x: "50",
    y: "40",
    fill: "#94a3b8",
    fontSize: "9",
    textAnchor: "middle"
  }, "Node Backend")), /*#__PURE__*/React.createElement("g", {
    transform: "translate(490, 110)"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "90",
    height: "50",
    rx: "6",
    fill: "#451a03",
    stroke: "#f59e0b"
  }), /*#__PURE__*/React.createElement("text", {
    x: "45",
    y: "26",
    fill: "#fde68a",
    fontSize: "11",
    textAnchor: "middle",
    fontWeight: "bold"
  }, "RDS Postgre"), /*#__PURE__*/React.createElement("text", {
    x: "45",
    y: "40",
    fill: "#94a3b8",
    fontSize: "9",
    textAnchor: "middle"
  }, "Database")), /*#__PURE__*/React.createElement("path", {
    d: "M 120 135 L 180 135",
    stroke: "#475569",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 270 135 L 330 135",
    stroke: "#475569",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 430 135 L 490 135",
    stroke: "#475569",
    strokeWidth: "2"
  }))))))), activeTab === 'admin' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "content-page-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Admin Console & User Identity Matrix"), /*#__PURE__*/React.createElement("p", null, "Manage system users, grant security permissions, and switch active role personas.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setModalData({});
      setActiveModal('user');
    }
  }, "＋ Register System User")), /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, "Active System Users & Permissions")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "User Name"), /*#__PURE__*/React.createElement("th", null, "Corporate Email (Mail ID)"), /*#__PURE__*/React.createElement("th", null, "Assigned Role"), /*#__PURE__*/React.createElement("th", null, "Department"), /*#__PURE__*/React.createElement("th", null, "Password / Access"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, users.map(u => /*#__PURE__*/React.createElement("tr", {
    key: u.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, u.name)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--primary-700)',
      backgroundColor: 'var(--primary-50)',
      padding: '0.15rem 0.4rem',
      borderRadius: '4px'
    }
  }, u.email)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "card-badge-pill",
    style: {
      fontWeight: 700,
      color: 'var(--primary-700)'
    }
  }, u.role)), /*#__PURE__*/React.createElement("td", null, u.department), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--slate-500)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  }, "🔒 Protected")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: `badge-status ${u.status === 'Active' ? 'available' : 'collision'}`
  }, u.status)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: () => {
      setModalData(u);
      setActiveModal('user');
    },
    title: "Edit Email ID, Password, Role, or Department"
  }, "✏️ Edit Credentials"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small",
    onClick: async () => {
      const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
      await fetch(`/api/users/${u.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      showToast(`User status set to ${newStatus}`, 'info');
      fetchAllData();
    }
  }, u.status === 'Active' ? 'Suspend' : 'Activate'), currentPersona.roleCode === 'SUPER_ADMIN' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-small text-danger",
    onClick: async () => {
      if (confirm(`Are you sure you want to delete user "${u.name}" (${u.email})?`)) {
        const res = await apiFetch(`/api/users/${u.id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          showToast('User deleted', 'info');
          fetchAllData();
        }
      }
    },
    title: "Delete User (Super Admin only)"
  }, "🗑️"))))))))), /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '1rem'
    }
  }, "👤 Switch Active Operational Persona"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }
  }, PERSONAS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "card-container",
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      padding: '0.85rem',
      borderColor: activePersona === p.id || activePersona === p.slug ? 'var(--primary-500)' : 'var(--border-light)',
      backgroundColor: activePersona === p.id || activePersona === p.slug ? 'var(--primary-50)' : '#ffffff'
    },
    onClick: () => {
      setActivePersona(p.id);
      sessionStorage.setItem('erams_persona', p.id);
      showToast(`Active persona switched to ${p.name} (${p.userRole})`, 'info');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "persona-avatar"
  }, p.avatar), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: '0.9rem',
      color: 'var(--slate-900)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--slate-500)'
    }
  }, p.role), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--primary-600)',
      fontWeight: 600
    }
  }, p.tag))))))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-lg-7"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-card-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  }, "🛡️ Strict RBAC Role Hierarchy Matrix")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "enterprise-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Hierarchical Tier"), /*#__PURE__*/React.createElement("th", null, "Permitted Scope"), /*#__PURE__*/React.createElement("th", null, "Operational Authority"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-700)'
    }
  }, "👑 SUPER ADMIN (L4)")), /*#__PURE__*/React.createElement("td", null, "Platform-Wide / Global"), /*#__PURE__*/React.createElement("td", null, "Full platform governance, create/manage Event Admins, system-wide events CRUD, override resource conflicts, AWS cloud IaC, view all audit logs.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#0369a1'
    }
  }, "👔 EVENT ADMIN (L3)")), /*#__PURE__*/React.createElement("td", null, "Managed Events Scope"), /*#__PURE__*/React.createElement("td", null, "Create/edit events within scope, assign Organizers, allocate staff & equipment, view scoped financial reports & audit logs.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#d97706'
    }
  }, "📋 ORGANIZER (L2)")), /*#__PURE__*/React.createElement("td", null, "Assigned Event Scope"), /*#__PURE__*/React.createElement("td", null, "Coordinate assigned event, request & assign staff crew, create & manage operational tasks, allocate permitted hardware.")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#059669'
    }
  }, "👷 STAFF (L1)")), /*#__PURE__*/React.createElement("td", null, "Assigned Shifts & Tasks"), /*#__PURE__*/React.createElement("td", null, "View assigned event run-of-show & venue, update own task status/notes/files, edit profile & availability. No resource allocation rights."))))))))), activeTab === 'simulator' && renderSimulatorTab(), activeTab === 'floorplan' && renderFloorplanTab(), activeTab === 'weather' && renderWeatherTab(), activeTab === 'audit' && renderAuditTab())), commandPaletteOpen && /*#__PURE__*/React.createElement("div", {
    className: "command-palette-overlay",
    onClick: () => setCommandPaletteOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-palette-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-palette-header"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.1rem',
      color: 'var(--primary-600)'
    }
  }, "🔍"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "command-palette-input",
    placeholder: "Type a command, event, staff, or tool (e.g. 'Tech Summit', 'Simulator', 'Weather')...",
    value: commandQuery,
    onChange: e => setCommandQuery(e.target.value),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--slate-400)'
    }
  }, "ESC to close")), /*#__PURE__*/React.createElement("div", {
    className: "command-palette-results"
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      handleAutoResolve();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "⚡ 1-Click Auto-Resolve All Conflicts")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Action")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('simulator');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "🧮 Open ROI Scenario & Cost Forecaster")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Tool")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('floorplan');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "📐 Open 2D Venue & Stage Layout Studio")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Studio")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('weather');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "🌦️ Check Environmental Safety & Weather Radar")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Safety")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('audit');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "📜 Inspect Live System Audit Log & Security Stream")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Security")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('dashboard');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "📊 Go to Overview Dashboard")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('events');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "📅 Go to Events Workspace")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('tasks');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "✅ Go to Task Tracker")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('staff');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "👥 Go to Staff Portal")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('equipment');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "📦 Go to Equipment Inventory")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), /*#__PURE__*/React.createElement("div", {
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('budget');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "💰 Go to Budget & Finance")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Navigation")), events.map(e => /*#__PURE__*/React.createElement("div", {
    key: e.id,
    className: "command-item",
    onClick: () => {
      setCommandPaletteOpen(false);
      setActiveTab('events');
      setSelectedEventId(e.id);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "command-item-left"
  }, /*#__PURE__*/React.createElement("span", null, "Event: ", e.title, " (", e.venue, ")")), /*#__PURE__*/React.createElement("span", {
    className: "command-item-badge"
  }, "Event")))))), shortcutsOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setShortcutsOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: '440px'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "⌨️ Keyboard Shortcuts Guide"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setShortcutsOpen(false)
  }, "×")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Open Command Palette:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Ctrl + K / Cmd + K")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Overview Dashboard:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + D")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Events Workspace:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + E")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Task Tracker:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + T")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Staff Portal:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + S")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Equipment Catalog:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + Q")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Budget & Finance:"), /*#__PURE__*/React.createElement("span", {
    className: "search-kbd-pill"
  }, "Alt + B")))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setShortcutsOpen(false)
  }, "Got It")))), activeModal === 'export' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: '720px'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "📥 Export System Manifests & Reports"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.82rem',
      color: 'var(--slate-500)'
    }
  }, "Download production spreadsheets (CSV) or generate a complete JSON system backup.")), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-title"
  }, /*#__PURE__*/React.createElement("span", null, "📄"), /*#__PURE__*/React.createElement("span", null, "Events Manifest")), /*#__PURE__*/React.createElement("span", {
    className: "export-format-badge"
  }, "CSV")), /*#__PURE__*/React.createElement("p", null, "Schedules, venues, budget allocations, dates, and operational status.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary export-download-btn",
    onClick: () => {
      handleExport('events');
      setActiveModal(null);
    }
  }, "⬇️ Download Events CSV")), /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-title"
  }, /*#__PURE__*/React.createElement("span", null, "👥"), /*#__PURE__*/React.createElement("span", null, "Staff Roster")), /*#__PURE__*/React.createElement("span", {
    className: "export-format-badge"
  }, "CSV")), /*#__PURE__*/React.createElement("p", null, "Personnel directory, certified roles, daily billing rates, and contacts.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary export-download-btn",
    onClick: () => {
      handleExport('staff');
      setActiveModal(null);
    }
  }, "⬇️ Download Staff CSV")), /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-title"
  }, /*#__PURE__*/React.createElement("span", null, "📦"), /*#__PURE__*/React.createElement("span", null, "Equipment Inventory")), /*#__PURE__*/React.createElement("span", {
    className: "export-format-badge"
  }, "CSV")), /*#__PURE__*/React.createElement("p", null, "Hardware catalog, categories, warehouse stock levels, and rental rates.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary export-download-btn",
    onClick: () => {
      handleExport('equipment');
      setActiveModal(null);
    }
  }, "⬇️ Download Equipment CSV")), /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-title"
  }, /*#__PURE__*/React.createElement("span", null, "💰"), /*#__PURE__*/React.createElement("span", null, "Financial Summary")), /*#__PURE__*/React.createElement("span", {
    className: "export-format-badge"
  }, "CSV")), /*#__PURE__*/React.createElement("p", null, "Aggregated expenditures, category rollups (staff/gear/vendors), and variance.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary export-download-btn",
    onClick: () => {
      handleExport('finance');
      setActiveModal(null);
    }
  }, "⬇️ Download Finance CSV")), /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card",
    style: {
      gridColumn: '1 / -1',
      backgroundColor: 'var(--primary-50)',
      borderColor: 'var(--primary-200)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-card-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "export-modal-title"
  }, /*#__PURE__*/React.createElement("span", null, "💾"), /*#__PURE__*/React.createElement("span", null, "Complete Database Snapshot")), /*#__PURE__*/React.createElement("span", {
    className: "export-format-badge json-badge"
  }, "JSON")), /*#__PURE__*/React.createElement("p", null, "Full relational snapshot containing all collections (events, staff, gear, venues, vendors, tasks, assignments).")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary export-download-btn",
    onClick: () => {
      handleExport('backup');
      setActiveModal(null);
    }
  }, "💾 Download Full Backup (JSON)")))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Close")))), activeModal === 'badge' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    style: {
      maxWidth: '380px'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "🏷️ Official Pass & Tag Preview"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("div", {
    className: "modal-body-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-header"
  }, modalData.type === 'staff' ? 'APEX CREW IDENTIFICATION PASS' : 'APEX ASSET TRACKING TAG'), /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-title"
  }, modalData.item?.name), /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-sub"
  }, modalData.type === 'staff' ? modalData.item?.role : `Category: ${modalData.item?.category} | Stock: ${modalData.item?.totalStock}`), /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-qr"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.8rem',
      marginBottom: '0.2rem'
    }
  }, "⬛⬜⬛"), /*#__PURE__*/React.createElement("div", null, modalData.type === 'staff' ? `APEX-STAFF-${modalData.item?.id}` : `APEX-EQ-${modalData.item?.id}`)), /*#__PURE__*/React.createElement("div", {
    className: "asset-badge-footer"
  }, "AUTHORIZED APEX EVENT SYSTEMS"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Close"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => window.print()
  }, "🖨️ Print Pass")))), activeModal === 'event' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, modalData.id ? 'Edit Event Details' : 'Create New Event'), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Event ${modalData.id ? 'updated' : 'created'} successfully`, 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Event Name / Title"), /*#__PURE__*/React.createElement("input", {
    name: "title",
    defaultValue: modalData.title || '',
    required: true,
    placeholder: "e.g. Annual Tech Summit"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Description & Scope"), /*#__PURE__*/React.createElement("textarea", {
    name: "description",
    rows: "2",
    defaultValue: modalData.description || '',
    placeholder: "Key objectives, audience scale..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Primary Venue Location"), /*#__PURE__*/React.createElement("select", {
    name: "venue",
    defaultValue: modalData.venue || venues[0]?.name || 'Innovation Arena'
  }, venues.map(v => /*#__PURE__*/React.createElement("option", {
    key: v.id,
    value: v.name
  }, v.name, " (Cap: ", v.capacity, ")")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Budget Allocation Cap ($)"), /*#__PURE__*/React.createElement("input", {
    name: "budget",
    type: "number",
    defaultValue: modalData.budget || 20000,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Start Date"), /*#__PURE__*/React.createElement("input", {
    name: "startDate",
    type: "date",
    defaultValue: modalData.startDate || '2026-09-10',
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "End Date"), /*#__PURE__*/React.createElement("input", {
    name: "endDate",
    type: "date",
    defaultValue: modalData.endDate || '2026-09-12',
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Initial Status"), /*#__PURE__*/React.createElement("select", {
    name: "status",
    defaultValue: modalData.status || 'Confirmed'
  }, /*#__PURE__*/React.createElement("option", {
    value: "Draft"
  }, "Draft"), /*#__PURE__*/React.createElement("option", {
    value: "Confirmed"
  }, "Confirmed"), /*#__PURE__*/React.createElement("option", {
    value: "In Progress"
  }, "In Progress"), /*#__PURE__*/React.createElement("option", {
    value: "Completed"
  }, "Completed"), /*#__PURE__*/React.createElement("option", {
    value: "Cancelled"
  }, "Cancelled"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, modalData.id ? 'Save Changes' : 'Create Event'))))), activeModal === 'task' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "Create Operational Task"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Task created and assigned', 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Task Title"), /*#__PURE__*/React.createElement("input", {
    name: "title",
    required: true,
    placeholder: "e.g. Verify Audio Patch & Mixer Lines"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Description & Instructions"), /*#__PURE__*/React.createElement("textarea", {
    name: "description",
    rows: "2",
    placeholder: "Specific steps, safety notes, or checklists..."
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Linked Event"), /*#__PURE__*/React.createElement("select", {
    name: "eventId",
    defaultValue: modalData.eventId || events[0]?.id || ''
  }, events.map(ev => /*#__PURE__*/React.createElement("option", {
    key: ev.id,
    value: ev.id
  }, ev.title)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Assigned Staff Member"), /*#__PURE__*/React.createElement("select", {
    name: "staffId"
  }, staff.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id
  }, s.name, " (", s.role, ")"))))), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Deadline Date"), /*#__PURE__*/React.createElement("input", {
    name: "deadline",
    type: "date",
    defaultValue: "2026-09-10",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Priority Level"), /*#__PURE__*/React.createElement("select", {
    name: "priority",
    defaultValue: "High"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Low"
  }, "Low"), /*#__PURE__*/React.createElement("option", {
    value: "Medium"
  }, "Medium"), /*#__PURE__*/React.createElement("option", {
    value: "High"
  }, "High"), /*#__PURE__*/React.createElement("option", {
    value: "Urgent"
  }, "Urgent")))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Create Task"))))), activeModal === 'user' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, modalData.id ? '✏️ Edit User Credentials & Access' : '＋ Register System User'), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
          headers: {
            'Content-Type': 'application/json'
          },
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Full User Name *"), /*#__PURE__*/React.createElement("input", {
    name: "name",
    required: true,
    defaultValue: modalData.name || '',
    placeholder: "e.g. Robert Clark"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Corporate Email (Mail ID) *"), /*#__PURE__*/React.createElement("input", {
    name: "email",
    type: "email",
    required: true,
    defaultValue: modalData.email || '',
    placeholder: "robert.clark@apexevents.com"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, modalData.id ? 'Change / Reset Password (Optional)' : 'User Password *'), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    name: "password",
    type: showUserPassword ? 'text' : 'password',
    placeholder: modalData.id ? 'Leave blank to keep existing password' : 'Enter login password',
    required: !modalData.id,
    style: {
      paddingRight: '45px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowUserPassword(prev => !prev),
    style: {
      position: 'absolute',
      right: '10px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: 'var(--slate-500)'
    },
    title: showUserPassword ? 'Hide Password' : 'Show Password'
  }, showUserPassword ? '👁️' : '🔒')), modalData.id && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--slate-500)',
      marginTop: '0.2rem',
      display: 'block'
    }
  }, "Type a new password to reset this user's credentials, or leave blank to keep unchanged.")), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Assigned System Role"), /*#__PURE__*/React.createElement("select", {
    name: "role",
    defaultValue: modalData.role || 'Event Manager'
  }, /*#__PURE__*/React.createElement("option", {
    value: "Admin"
  }, "Admin (Full Control)"), /*#__PURE__*/React.createElement("option", {
    value: "Event Manager"
  }, "Event Manager (Production)"), /*#__PURE__*/React.createElement("option", {
    value: "Staff"
  }, "Staff (Shift Execution)"), /*#__PURE__*/React.createElement("option", {
    value: "Vendor"
  }, "Vendor (External Supplier)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Department"), /*#__PURE__*/React.createElement("input", {
    name: "department",
    defaultValue: modalData.department || 'Production & Staging'
  }))), modalData.id && /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Account Status"), /*#__PURE__*/React.createElement("select", {
    name: "status",
    defaultValue: modalData.status || 'Active'
  }, /*#__PURE__*/React.createElement("option", {
    value: "Active"
  }, "Active (Permitted)"), /*#__PURE__*/React.createElement("option", {
    value: "Suspended"
  }, "Suspended (Access Revoked)"))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, modalData.id ? 'Save Changes' : 'Register User'))))), activeModal === 'my-credentials' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "🔒 My Security Credentials & Email Profile"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
          headers: {
            'Content-Type': 'application/json'
          },
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      padding: '0.75rem',
      backgroundColor: 'var(--slate-50)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '1.25rem',
      border: '1px solid var(--border-light)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "persona-avatar",
    style: {
      width: '42px',
      height: '42px',
      fontSize: '1rem'
    }
  }, currentPersona.avatar), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: 'var(--slate-900)'
    }
  }, currentPersona.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--slate-500)'
    }
  }, currentPersona.userRole, " • ", currentPersona.role))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Display Name *"), /*#__PURE__*/React.createElement("input", {
    name: "name",
    required: true,
    defaultValue: currentPersona.name,
    placeholder: "Your Full Name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Corporate Mail ID (Email Address) *"), /*#__PURE__*/React.createElement("input", {
    name: "email",
    type: "email",
    required: true,
    defaultValue: currentPersona.email,
    placeholder: "name@apexevents.com"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--slate-500)',
      marginTop: '0.2rem',
      display: 'block'
    }
  }, "This email is used as your system login ID.")), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Current Password (Optional)"), /*#__PURE__*/React.createElement("input", {
    name: "currentPassword",
    type: "password",
    placeholder: "Enter current password if set"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "New Password (Optional)"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    name: "newPassword",
    type: showPassword ? 'text' : 'password',
    placeholder: "Enter new password (min 6 chars)",
    style: {
      paddingRight: '45px'
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(prev => !prev),
    style: {
      position: 'absolute',
      right: '10px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: 'var(--slate-500)'
    },
    title: showPassword ? 'Hide Password' : 'Show Password'
  }, showPassword ? '👁️' : '🔒'))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Confirm New Password"), /*#__PURE__*/React.createElement("input", {
    name: "confirmPassword",
    type: showPassword ? 'text' : 'password',
    placeholder: "Re-type new password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Update Credentials"))))), activeModal === 'staff' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, modalData.id ? 'Edit Staff Profile' : 'Register Staff Member'), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Staff ${modalData.id ? 'updated' : 'registered'} successfully`, 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Full Name"), /*#__PURE__*/React.createElement("input", {
    name: "name",
    defaultValue: modalData.name || '',
    required: true,
    placeholder: "e.g. Alex Henderson"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Operational Role"), /*#__PURE__*/React.createElement("select", {
    name: "role",
    defaultValue: modalData.role || 'Event Coordinator'
  }, /*#__PURE__*/React.createElement("option", {
    value: "Event Coordinator"
  }, "Event Coordinator"), /*#__PURE__*/React.createElement("option", {
    value: "A/V Technician"
  }, "A/V Technician"), /*#__PURE__*/React.createElement("option", {
    value: "Stage Manager"
  }, "Stage Manager"), /*#__PURE__*/React.createElement("option", {
    value: "Security Lead"
  }, "Security Lead"), /*#__PURE__*/React.createElement("option", {
    value: "Logistics Manager"
  }, "Logistics Manager"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Daily Billing Rate ($)"), /*#__PURE__*/React.createElement("input", {
    name: "dailyRate",
    type: "number",
    defaultValue: modalData.dailyRate || 300,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Contact Phone / Email"), /*#__PURE__*/React.createElement("input", {
    name: "contact",
    defaultValue: modalData.contact || '',
    placeholder: "+1-555-0199"
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, modalData.id ? 'Update Staff' : 'Register Crew'))))), activeModal === 'equipment' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, modalData.id ? 'Edit Equipment Stock' : 'Add Equipment Item'), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(`Equipment ${modalData.id ? 'updated' : 'catalogued'} successfully`, 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Hardware Item Name"), /*#__PURE__*/React.createElement("input", {
    name: "name",
    defaultValue: modalData.name || '',
    required: true,
    placeholder: "e.g. Line Array Speakers"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Hardware Category"), /*#__PURE__*/React.createElement("select", {
    name: "category",
    defaultValue: modalData.category || 'Audio'
  }, /*#__PURE__*/React.createElement("option", {
    value: "Audio"
  }, "Audio"), /*#__PURE__*/React.createElement("option", {
    value: "Lighting"
  }, "Lighting"), /*#__PURE__*/React.createElement("option", {
    value: "Video"
  }, "Video"), /*#__PURE__*/React.createElement("option", {
    value: "Staging"
  }, "Staging"), /*#__PURE__*/React.createElement("option", {
    value: "Furniture"
  }, "Furniture"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Warehouse Stock Units"), /*#__PURE__*/React.createElement("input", {
    name: "totalStock",
    type: "number",
    defaultValue: modalData.totalStock || 10,
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Daily Rental Rate ($)"), /*#__PURE__*/React.createElement("input", {
    name: "rentalRate",
    type: "number",
    defaultValue: modalData.rentalRate || 100,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, modalData.id ? 'Save Item' : 'Add Item'))))), activeModal === 'assign' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "Assign Staff Member to Event"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      const form = e.target;
      const payload = {
        eventId: modalData.eventId,
        staffId: form.staffId.value,
        notes: form.notes.value
      };
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Staff assigned to event', 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Select Staff Member"), /*#__PURE__*/React.createElement("select", {
    name: "staffId"
  }, staff.map(s => /*#__PURE__*/React.createElement("option", {
    key: s.id,
    value: s.id
  }, s.name, " (", s.role, ") — $", s.dailyRate, "/day")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Assignment Notes"), /*#__PURE__*/React.createElement("input", {
    name: "notes",
    placeholder: "Special role or instructions"
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Assign Crew"))))), activeModal === 'allocate' && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay open",
    onClick: () => setActiveModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-card",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h3", null, "Allocate Hardware Quota to Event"), /*#__PURE__*/React.createElement("button", {
    className: "close-btn",
    onClick: () => setActiveModal(null)
  }, "×")), /*#__PURE__*/React.createElement("form", {
    onSubmit: async e => {
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Equipment allocated to event', 'success');
        setActiveModal(null);
        fetchAllData();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Select Hardware Item"), /*#__PURE__*/React.createElement("select", {
    name: "equipmentId"
  }, equipment.map(eq => /*#__PURE__*/React.createElement("option", {
    key: eq.id,
    value: eq.id
  }, eq.name, " (", eq.category, ") — Warehouse Stock: ", eq.totalStock)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Quantity to Reserve"), /*#__PURE__*/React.createElement("input", {
    name: "quantity",
    type: "number",
    min: "1",
    defaultValue: "2",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", null, "Allocation Notes"), /*#__PURE__*/React.createElement("input", {
    name: "notes",
    placeholder: "e.g. Main stage PA system"
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setActiveModal(null)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Reserve Hardware"))))), /*#__PURE__*/React.createElement("div", {
    className: "toast-container"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `toast-msg ${t.type}`
  }, /*#__PURE__*/React.createElement("span", null, t.type === 'success' ? '✓' : t.type === 'error' ? '❌' : 'ℹ️'), /*#__PURE__*/React.createElement("span", null, t.message)))));
}

// Mount React Root Application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(/*#__PURE__*/React.createElement(App, null));
}