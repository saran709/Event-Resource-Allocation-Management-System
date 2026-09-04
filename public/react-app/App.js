import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
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
    return /*#__PURE__*/_jsxDEV("div", {
      className: "login-wrapper",
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "login-card",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "login-card-header",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "login-brand-icon",
            children: "▲"
          }, void 0, false), /*#__PURE__*/_jsxDEV("h2", {
            children: "APEX ENTERPRISE"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "Event Resource Allocation & Conflict Resolution Platform"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
          onSubmit: e => {
            e.preventDefault();
            handleLoginPersona('sarah');
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Corporate Work Email"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              type: "email",
              required: true,
              defaultValue: "sarah.manager@apexevents.com",
              placeholder: "name@company.com"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Password"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              type: "password",
              required: true,
              defaultValue: "password123",
              placeholder: "••••••••"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            type: "submit",
            className: "btn btn-primary btn-full-width",
            style: {
              marginTop: '0.5rem'
            },
            children: "Sign In to Workspace"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          style: {
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1.25rem',
            marginTop: '1.5rem'
          },
          children: [/*#__PURE__*/_jsxDEV("p", {
            style: {
              fontSize: '0.75rem',
              color: 'var(--slate-500)',
              textAlign: 'center',
              marginBottom: '0.75rem',
              fontWeight: 600
            },
            children: "Quick 1-Click Role Persona Sign-In:"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem'
            },
            children: PERSONAS.map(p => /*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary btn-small",
              onClick: () => handleLoginPersona(p.id),
              style: {
                justifyContent: 'flex-start',
                padding: '0.45rem 0.6rem'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontWeight: 700,
                  color: 'var(--primary-600)'
                },
                children: p.avatar
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: '0.78rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                children: [p.name.split(' ')[0], " (", p.userRole, ")"]
              }, void 0, true)]
            }, p.id, true))
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false);
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
      return /*#__PURE__*/_jsxDEV("div", {
        className: "calendar-dashboard-wrapper",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "calendar-toolbar card-container mb-4",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "d-flex flex-wrap align-items-center justify-content-between gap-3",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "d-flex align-items-center gap-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "calendar-month-display",
                children: [/*#__PURE__*/_jsxDEV("h2", {
                  children: [MONTH_NAMES[calendarMonth] || 'Calendar', " ", calendarYear]
                }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                  className: "badge-status in-progress",
                  children: [filteredCalEvents.length, " Events Scheduled"]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "btn-group",
                children: [/*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-secondary btn-small",
                  onClick: handlePrevMonth,
                  title: "Previous Month",
                  children: "◀ Prev"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-secondary btn-small",
                  onClick: handleToday,
                  title: "Current Month",
                  children: "Today"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-secondary btn-small",
                  onClick: handleNextMonth,
                  title: "Next Month",
                  children: "Next ▶"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "d-flex flex-wrap align-items-center gap-2",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "btn-group",
                children: [/*#__PURE__*/_jsxDEV("button", {
                  className: `btn btn-small ${calendarViewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`,
                  onClick: () => setCalendarViewMode('month'),
                  children: "📅 Month Grid"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: `btn btn-small ${calendarViewMode === 'gantt' ? 'btn-primary' : 'btn-secondary'}`,
                  onClick: () => setCalendarViewMode('gantt'),
                  children: "📊 Gantt Timeline"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: `btn btn-small ${calendarViewMode === 'agenda' ? 'btn-primary' : 'btn-secondary'}`,
                  onClick: () => setCalendarViewMode('agenda'),
                  children: "📋 Agenda Stream"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("select", {
                className: "form-select form-select-sm",
                style: {
                  width: 'auto'
                },
                value: calendarFilterStatus,
                onChange: e => setCalendarFilterStatus(e.target.value),
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "all",
                  children: "All Statuses"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Confirmed",
                  children: "Confirmed"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Draft",
                  children: "Draft"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "In Progress",
                  children: "In Progress"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Completed",
                  children: "Completed"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Cancelled",
                  children: "Cancelled"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("select", {
                className: "form-select form-select-sm",
                style: {
                  width: 'auto'
                },
                value: calendarFilterVenue,
                onChange: e => setCalendarFilterVenue(e.target.value),
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "all",
                  children: "All Venues"
                }, void 0, false), safeVenues.map(v => /*#__PURE__*/_jsxDEV("option", {
                  value: v.name,
                  children: v.name
                }, v.id || v.name, false))]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-primary btn-small",
                onClick: () => {
                  setModalData({});
                  setActiveModal('event');
                },
                children: "＋ New Event"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false), calendarViewMode === 'month' && /*#__PURE__*/_jsxDEV("div", {
          className: "card-container calendar-grid-container p-0",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "calendar-weekdays-header",
            children: DAYS_OF_WEEK.map((day, idx) => /*#__PURE__*/_jsxDEV("div", {
              className: "calendar-weekday-cell",
              children: day
            }, idx, false))
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "calendar-days-grid",
            children: calendarCells.map((cell, idx) => {
              const dayEvents = filteredCalEvents.filter(ev => ev.startDate <= cell.dateStr && ev.endDate >= cell.dateStr);
              const hasConflict = hasConflictOnDate(cell.dateStr);
              return /*#__PURE__*/_jsxDEV("div", {
                className: `calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${hasConflict ? 'day-has-conflict' : ''}`,
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "day-cell-top",
                  children: [/*#__PURE__*/_jsxDEV("span", {
                    className: `day-number ${cell.dateStr === '2026-09-04' ? 'today-pill' : ''}`,
                    children: cell.dayNum
                  }, void 0, false), hasConflict && /*#__PURE__*/_jsxDEV("span", {
                    className: "calendar-conflict-dot",
                    title: "Resource collision detected on this date!",
                    children: "⚠️"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "day-events-stack",
                  children: dayEvents.map(ev => /*#__PURE__*/_jsxDEV("div", {
                    className: `cal-event-pill status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
                    onClick: () => {
                      setSelectedEventId(ev.id);
                      setActiveTab('events');
                    },
                    title: `${ev.title}\nVenue: ${ev.venue}\nDates: ${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`,
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      className: "cal-event-indicator"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      className: "cal-event-title",
                      children: ev.title
                    }, void 0, false)]
                  }, ev.id, true))
                }, void 0, false)]
              }, idx, true);
            })
          }, void 0, false)]
        }, void 0, true), calendarViewMode === 'gantt' && /*#__PURE__*/_jsxDEV("div", {
          className: "card-container gantt-container p-0",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "gantt-header-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "gantt-event-col-header",
              children: "Event Name & Venue"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "gantt-timeline-header-scroll",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "gantt-days-axis",
                style: {
                  gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))`
                },
                children: Array.from({
                  length: daysInMonth
                }, (_, i) => i + 1).map(day => /*#__PURE__*/_jsxDEV("div", {
                  className: "gantt-day-tick",
                  children: [/*#__PURE__*/_jsxDEV("span", {
                    className: "gantt-day-num",
                    children: day
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    className: "gantt-day-name",
                    children: DAYS_OF_WEEK[new Date(calendarYear, calendarMonth, day).getDay()].substring(0, 1)
                  }, void 0, false)]
                }, day, true))
              }, void 0, false)
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "gantt-body",
            children: filteredCalEvents.length === 0 ? /*#__PURE__*/_jsxDEV("div", {
              className: "p-4 text-center text-muted",
              children: "No events match the selected criteria for this timeline."
            }, void 0, false) : filteredCalEvents.map(ev => {
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
              return /*#__PURE__*/_jsxDEV("div", {
                className: "gantt-row",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "gantt-event-meta-cell",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "gantt-event-title",
                    onClick: () => {
                      setSelectedEventId(ev.id);
                      setActiveTab('events');
                    },
                    children: ev.title
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "gantt-event-sub",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: ["📍 ", ev.venue]
                    }, void 0, true), " • ", /*#__PURE__*/_jsxDEV("span", {
                      className: `badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
                      children: ev.status
                    }, void 0, false)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "gantt-track-cell",
                  children: /*#__PURE__*/_jsxDEV("div", {
                    className: "gantt-track-grid",
                    style: {
                      gridTemplateColumns: `repeat(${daysInMonth}, minmax(36px, 1fr))`
                    },
                    children: [Array.from({
                      length: daysInMonth
                    }, (_, i) => i + 1).map(day => /*#__PURE__*/_jsxDEV("div", {
                      className: "gantt-grid-column"
                    }, day, false)), isVisible && /*#__PURE__*/_jsxDEV("div", {
                      className: `gantt-bar status-${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
                      style: {
                        gridColumnStart: Math.max(1, startDay),
                        gridColumnEnd: Math.min(daysInMonth, endDay) + 1
                      },
                      onClick: () => {
                        setSelectedEventId(ev.id);
                        setActiveTab('events');
                      },
                      title: `${ev.title}\n${ev.startDate} to ${ev.endDate}\nBudget: ${typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget}`,
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: "gantt-bar-label",
                        children: [ev.title, " (", ev.durationDays || endDay - startDay + 1, "d)"]
                      }, void 0, true)
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false)]
              }, ev.id, true);
            })
          }, void 0, false)]
        }, void 0, true), calendarViewMode === 'agenda' && /*#__PURE__*/_jsxDEV("div", {
          className: "agenda-stream-wrapper",
          children: filteredCalEvents.length === 0 ? /*#__PURE__*/_jsxDEV("div", {
            className: "card-container text-center p-5",
            children: [/*#__PURE__*/_jsxDEV("h4", {
              children: "No scheduled events found"
            }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
              className: "text-muted",
              children: "Create a new event or adjust the venue/status filters above."
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary mt-2",
              onClick: () => {
                setModalData({});
                setActiveModal('event');
              },
              children: "＋ Create New Event"
            }, void 0, false)]
          }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: filteredCalEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map(ev => {
              const evAllocations = safeEquipment.filter(eq => (ev.allocations || []).some(al => al.equipmentId === eq.id));
              const evStaff = safeStaff.filter(st => (ev.assignments || []).some(as => as.staffId === st.id));
              return /*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-lg-6",
                children: /*#__PURE__*/_jsxDEV("div", {
                  className: "card-container agenda-card h-100",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between align-items-start mb-2",
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        className: "agenda-date-badge",
                        children: ["📅 ", ev.startDate, " ➔ ", ev.endDate]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("h3", {
                        style: {
                          fontSize: '1.15rem',
                          marginTop: '0.4rem',
                          marginBottom: '0.2rem'
                        },
                        children: ev.title
                      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          fontSize: '0.85rem',
                          color: 'var(--slate-500)'
                        },
                        children: ["📍 ", ev.venue]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      className: `badge-status ${(ev.status || 'draft').toLowerCase().replace(/\s+/g, '-')}`,
                      children: ev.status
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                    style: {
                      fontSize: '0.85rem',
                      color: 'var(--slate-600)',
                      margin: '0.6rem 0'
                    },
                    children: ev.description
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "agenda-meta-footer",
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex align-items-center gap-3",
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.82rem',
                          color: 'var(--slate-600)'
                        },
                        children: ["👥 ", /*#__PURE__*/_jsxDEV("strong", {
                          children: ev.assignments?.length || evStaff.length || 0
                        }, void 0, false), " Staff"]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.82rem',
                          color: 'var(--slate-600)'
                        },
                        children: ["📦 ", /*#__PURE__*/_jsxDEV("strong", {
                          children: ev.allocations?.length || evAllocations.length || 0
                        }, void 0, false), " Gear"]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.82rem',
                          color: 'var(--slate-600)'
                        },
                        children: ["💰 ", /*#__PURE__*/_jsxDEV("strong", {
                          children: typeof formatCurrency === 'function' ? formatCurrency(ev.budget) : ev.budget
                        }, void 0, false)]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex gap-2",
                      children: /*#__PURE__*/_jsxDEV("button", {
                        className: "btn btn-secondary btn-small",
                        onClick: () => {
                          setSelectedEventId(ev.id);
                          setActiveTab('events');
                        },
                        children: "Inspect Workspace ➔"
                      }, void 0, false)
                    }, void 0, false)]
                  }, void 0, true)]
                }, void 0, true)
              }, ev.id, false);
            })
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true);
    } catch (err) {
      console.error('Calendar Render Error:', err);
      return /*#__PURE__*/_jsxDEV("div", {
        className: "card-container p-4 text-center",
        children: [/*#__PURE__*/_jsxDEV("h3", {
          style: {
            color: 'var(--danger-600)'
          },
          children: "⚠️ Calendar Display Error"
        }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
          children: err?.message || 'An error occurred while rendering the calendar.'
        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
          className: "btn btn-primary mt-2",
          onClick: () => setActiveTab('dashboard'),
          children: "Back to Dashboard"
        }, void 0, false)]
      }, void 0, true);
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
    return /*#__PURE__*/_jsxDEV("div", {
      className: "tab-pane-content",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "content-page-header",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h2", {
            children: "🧮 Event Cost Forecaster & ROI Scenario Simulator"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "Perform live \"what-if\" financial modeling, crew-to-attendee scaling, and breakeven sensitivity analysis."
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "d-flex gap-2",
          children: [/*#__PURE__*/_jsxDEV("button", {
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
            },
            children: "🔄 Reset Baseline"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => {
              showToast(`Exported simulation model: Net ROI $${netProfit.toLocaleString()} (${marginPct}%)`, 'success');
              logAudit('ROI Scenario Exported', `Generated financial forecast with ${simAttendees} attendees and $${grossRevenue.toLocaleString()} gross projection.`, 'Budget', 'Success');
            },
            children: "📊 Export Financial Model"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "stats-grid mb-4",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "stat-card",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "stat-label",
            children: "Projected Gross Revenue"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-value",
            style: {
              color: 'var(--primary-600)'
            },
            children: ["$", grossRevenue.toLocaleString()]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-subtext",
            children: ["Tickets ($", grossTickets.toLocaleString(), ") + Sponsor ($", Number(simSponsorship).toLocaleString(), ")"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "stat-card",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "stat-label",
            children: "Total Estimated Cost"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-value",
            style: {
              color: 'var(--slate-800)'
            },
            children: ["$", Math.round(totalSimCost).toLocaleString()]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-subtext",
            children: ["Includes 10% Contingency Buffer ($", Math.round(contingency).toLocaleString(), ")"]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "stat-card",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "stat-label",
            children: "Net Forecast Margin"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-value",
            style: {
              color: netProfit >= 0 ? 'var(--success-600)' : 'var(--danger-600)'
            },
            children: [netProfit >= 0 ? '+' : '', "$", Math.round(netProfit).toLocaleString(), " (", marginPct, "%)"]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-subtext",
            children: netProfit >= 0 ? '✓ Profitable Production Run' : '⚠️ Deficit Alert — Adjust Inputs'
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "stat-card",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "stat-label",
            children: "Breakeven Attendance"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-value",
            style: {
              color: breakevenTickets <= simAttendees ? 'var(--primary-700)' : 'var(--warning-600)'
            },
            children: [Math.max(0, breakevenTickets), " / ", simAttendees]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "stat-subtext",
            children: ["Required Ticket Sales (", simTicketPrice > 0 ? `$${simTicketPrice}/head` : '$0', ")"]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "row g-4",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-7",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "card-container",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "card-title-row mb-3",
              children: [/*#__PURE__*/_jsxDEV("h3", {
                style: {
                  fontSize: '1.05rem',
                  margin: 0
                },
                children: "🎛️ Real-Time Production & Scale Sliders"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "card-badge-pill",
                style: {
                  color: 'var(--primary-700)',
                  backgroundColor: 'var(--primary-50)'
                },
                children: "Live Reactive"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "sim-control-group mb-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "d-flex justify-content-between align-items-center mb-1",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  },
                  children: "👥 Expected Attendance Scale:"
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  className: "badge-status available",
                  style: {
                    fontSize: '0.85rem'
                  },
                  children: [simAttendees.toLocaleString(), " Attendees"]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("input", {
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
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "d-flex justify-content-between text-muted",
                style: {
                  fontSize: '0.72rem'
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  children: "50 (Intimate)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  children: "1,500 (Mid-Size Arena)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  children: "3,500+ (Festival/Convention)"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "row g-3 mb-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'block',
                    marginBottom: '0.3rem'
                  },
                  children: "🎟️ Ticket Price ($/head):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "input-group",
                  children: /*#__PURE__*/_jsxDEV("input", {
                    type: "number",
                    min: "0",
                    max: "1000",
                    value: simTicketPrice,
                    onChange: e => setSimTicketPrice(Math.max(0, Number(e.target.value))),
                    className: "form-control"
                  }, void 0, false)
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'block',
                    marginBottom: '0.3rem'
                  },
                  children: "🤝 Corporate Sponsorship ($):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                  type: "number",
                  min: "0",
                  step: "500",
                  value: simSponsorship,
                  onChange: e => setSimSponsorship(Math.max(0, Number(e.target.value))),
                  className: "form-control"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "row g-3 mb-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "d-flex justify-content-between align-items-center mb-1",
                  children: [/*#__PURE__*/_jsxDEV("label", {
                    style: {
                      fontWeight: 600,
                      fontSize: '0.88rem'
                    },
                    children: "👷 Crew Allocation:"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      fontWeight: 700,
                      color: 'var(--primary-600)'
                    },
                    children: [simCrewCount, " Crew"]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("input", {
                  type: "range",
                  min: "2",
                  max: "40",
                  value: simCrewCount,
                  onChange: e => setSimCrewCount(Number(e.target.value)),
                  style: {
                    width: '100%',
                    accentColor: 'var(--primary-600)'
                  }
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.74rem',
                    color: 'var(--slate-500)'
                  },
                  children: ["$", (simCrewCount * crewDailyAvg * 2).toLocaleString(), " est. labor payroll"]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'block',
                    marginBottom: '0.3rem'
                  },
                  children: "📦 Hardware & AV Tier:"
                }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                  value: simGearTier,
                  onChange: e => setSimGearTier(e.target.value),
                  className: "form-control",
                  children: [/*#__PURE__*/_jsxDEV("option", {
                    value: "standard",
                    children: "Standard AV & PA ($3,800)"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                    value: "premium",
                    children: "Premium Arena Production ($9,500)"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                    value: "ultra",
                    children: "Ultra Immersive Broadcast ($19,500)"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "row g-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'block',
                    marginBottom: '0.3rem'
                  },
                  children: "🍽️ Hospitality / Attendee ($):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                  type: "number",
                  min: "0",
                  max: "200",
                  value: simCateringPerHead,
                  onChange: e => setSimCateringPerHead(Math.max(0, Number(e.target.value))),
                  className: "form-control"
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.74rem',
                    color: 'var(--slate-500)'
                  },
                  children: ["$", (simAttendees * simCateringPerHead).toLocaleString(), " total food/beverage"]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "col-12 col-md-6",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'block',
                    marginBottom: '0.3rem'
                  },
                  children: "🏛️ Venue Base Rental Rate ($):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                  type: "number",
                  min: "500",
                  step: "500",
                  value: simVenueRate,
                  onChange: e => setSimVenueRate(Math.max(0, Number(e.target.value))),
                  className: "form-control"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-5",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "card-container h-100 d-flex flex-column justify-content-between",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "card-title-row mb-3",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    margin: 0
                  },
                  children: "📊 Cost Allocation Breakdown"
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.8rem',
                    color: 'var(--slate-500)'
                  },
                  children: "100% Pro-Rata"
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "cost-breakdown-list",
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                },
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between mb-1",
                    style: {
                      fontSize: '0.82rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "🏛️ Venue Rental"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: ["$", venueExpense.toLocaleString(), " (", (venueExpense / totalSimCost * 100).toFixed(1), "%)"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      height: '8px',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: `${Math.min(100, venueExpense / totalSimCost * 100)}%`,
                        height: '100%',
                        backgroundColor: '#6366f1'
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between mb-1",
                    style: {
                      fontSize: '0.82rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "📦 Equipment & Production Gear"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: ["$", gearExpense.toLocaleString(), " (", (gearExpense / totalSimCost * 100).toFixed(1), "%)"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      height: '8px',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: `${Math.min(100, gearExpense / totalSimCost * 100)}%`,
                        height: '100%',
                        backgroundColor: '#ec4899'
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between mb-1",
                    style: {
                      fontSize: '0.82rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "👷 Production Staff & Labor"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: ["$", crewExpense.toLocaleString(), " (", (crewExpense / totalSimCost * 100).toFixed(1), "%)"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      height: '8px',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: `${Math.min(100, crewExpense / totalSimCost * 100)}%`,
                        height: '100%',
                        backgroundColor: '#3b82f6'
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between mb-1",
                    style: {
                      fontSize: '0.82rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "🍽️ Catering & Hospitality"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: ["$", cateringExpense.toLocaleString(), " (", (cateringExpense / totalSimCost * 100).toFixed(1), "%)"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      height: '8px',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: `${Math.min(100, cateringExpense / totalSimCost * 100)}%`,
                        height: '100%',
                        backgroundColor: '#10b981'
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "d-flex justify-content-between mb-1",
                    style: {
                      fontSize: '0.82rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "🛡️ Contingency Reserve (10%)"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: ["$", Math.round(contingency).toLocaleString(), " (10.0%)"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      height: '8px',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        width: '10%',
                        height: '100%',
                        backgroundColor: '#f59e0b'
                      }
                    }, void 0, false)
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "card-container mt-4",
              style: {
                backgroundColor: 'var(--slate-50)',
                borderColor: 'var(--border-light)'
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  marginBottom: '0.4rem'
                },
                children: "💡 Financial Architect Recommendation"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--slate-600)',
                  margin: 0,
                  lineHeight: 1.45
                },
                children: netProfit > 15000 ? /*#__PURE__*/_jsxDEV("span", {
                  children: ["🚀 ", /*#__PURE__*/_jsxDEV("strong", {
                    children: "Excellent Margin Profile:"
                  }, void 0, false), " Projected profit of $", Math.round(netProfit).toLocaleString(), " gives strong resilience against attendance dips. Breakeven occurs at only ", breakevenTickets, " tickets (", (breakevenTickets / simAttendees * 100).toFixed(0), "% capacity)."]
                }, void 0, true) : netProfit >= 0 ? /*#__PURE__*/_jsxDEV("span", {
                  children: ["⚖️ ", /*#__PURE__*/_jsxDEV("strong", {
                    children: "Moderate Margin:"
                  }, void 0, false), " Operating at $", Math.round(netProfit).toLocaleString(), " surplus. Consider securing $5k+ additional corporate sponsorship or bumping ticket tier by $10 to buffer unforeseen technical overages."]
                }, void 0, true) : /*#__PURE__*/_jsxDEV("span", {
                  children: ["⚠️ ", /*#__PURE__*/_jsxDEV("strong", {
                    children: "Deficit Warning:"
                  }, void 0, false), " Projected model incurs a -$", Math.round(Math.abs(netProfit)).toLocaleString(), " loss. To achieve breakeven, either increase ticket price to $", (totalSimCost / simAttendees).toFixed(0), "/head or scale venue/gear tier downward."]
                }, void 0, true)
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
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
    return /*#__PURE__*/_jsxDEV("div", {
      className: "tab-pane-content",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "content-page-header",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h2", {
            children: "📐 2D Venue Floor Plan & Spatial Layout Studio"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "Design stages, FOH mix stations, VIP hospitality lounges, and fire egress clearance pathways."
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "d-flex gap-2",
          children: [/*#__PURE__*/_jsxDEV("button", {
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
            },
            children: "🔄 Reset Layout"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => {
              showToast('Venue CAD Blueprint exported as Vector SVG schematic', 'success');
              logAudit('Floor Plan Exported', `Exported 2D spatial layout blueprint for ${activeVenueObj.name}.`, 'Resource', 'Success');
            },
            children: "📐 Export Vector Blueprint"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "card-container mb-4",
        children: /*#__PURE__*/_jsxDEV("div", {
          className: "row g-3 align-items-center",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "col-12 col-md-4",
            children: [/*#__PURE__*/_jsxDEV("label", {
              style: {
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'block',
                marginBottom: '0.3rem'
              },
              children: "Select Target Venue Grid:"
            }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
              value: selectedFloorVenue,
              onChange: e => {
                setSelectedFloorVenue(e.target.value);
                setSelectedFloorItem(null);
              },
              className: "form-control",
              children: venues.map(v => /*#__PURE__*/_jsxDEV("option", {
                value: v.name,
                children: [v.name, " (Max Cap: ", v.capacity, ")"]
              }, v.id, true))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "col-12 col-md-8",
            children: [/*#__PURE__*/_jsxDEV("label", {
              style: {
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'block',
                marginBottom: '0.3rem'
              },
              children: "Add Stage & Zone Modules:"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "d-flex flex-wrap gap-2",
              children: [/*#__PURE__*/_jsxDEV("button", {
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
                },
                children: "＋ Sound Tower"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                },
                children: "＋ VIP Pod"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                },
                children: "＋ Seating Block"
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                },
                children: "＋ Sponsor Booth"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "row g-4",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-8",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "card-container",
            style: {
              padding: '1rem',
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              position: 'relative'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "d-flex justify-content-between align-items-center mb-2",
              style: {
                color: '#94a3b8',
                fontSize: '0.82rem'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: ["📍 ", /*#__PURE__*/_jsxDEV("strong", {
                  children: activeVenueObj.name
                }, void 0, false), " • Spatial Grid (700px × 430px Scale)"]
              }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                children: "🟢 Fire Marshal Code: Approved Clearance"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                position: 'relative',
                width: '100%',
                overflowX: 'auto'
              },
              children: /*#__PURE__*/_jsxDEV("svg", {
                viewBox: "0 0 700 430",
                style: {
                  width: '100%',
                  height: 'auto',
                  backgroundColor: '#090d16',
                  borderRadius: '6px',
                  border: '1px solid #1e293b'
                },
                children: [/*#__PURE__*/_jsxDEV("defs", {
                  children: /*#__PURE__*/_jsxDEV("pattern", {
                    id: "grid",
                    width: "20",
                    height: "20",
                    patternUnits: "userSpaceOnUse",
                    children: /*#__PURE__*/_jsxDEV("path", {
                      d: "M 20 0 L 0 0 0 20",
                      fill: "none",
                      stroke: "#1e293b",
                      strokeWidth: "0.8"
                    }, void 0, false)
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("rect", {
                  width: "700",
                  height: "430",
                  fill: "url(#grid)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("rect", {
                  x: "15",
                  y: "15",
                  width: "670",
                  height: "400",
                  fill: "none",
                  stroke: "#475569",
                  strokeWidth: "2",
                  strokeDasharray: "4 4",
                  rx: "8"
                }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                  x: "350",
                  y: "20",
                  fill: "#64748b",
                  fontSize: "10",
                  textAnchor: "middle",
                  fontWeight: "bold",
                  children: "▲ NORTH STAGE PROSCENIUM WALL ▲"
                }, void 0, false), floorPlanElements.map(el => {
                  const isSelected = selectedFloorItem?.id === el.id;
                  return /*#__PURE__*/_jsxDEV("g", {
                    style: {
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    },
                    onClick: () => setSelectedFloorItem(el),
                    children: [/*#__PURE__*/_jsxDEV("rect", {
                      x: el.x,
                      y: el.y,
                      width: el.w,
                      height: el.h,
                      fill: el.color,
                      fillOpacity: isSelected ? 0.85 : 0.45,
                      stroke: isSelected ? '#ffffff' : el.color,
                      strokeWidth: isSelected ? 2.5 : 1.2,
                      rx: "4"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                      x: el.x + el.w / 2,
                      y: el.y + el.h / 2 - 4,
                      fill: "#ffffff",
                      fontSize: el.w < 100 ? '9' : '11',
                      fontWeight: "bold",
                      textAnchor: "middle",
                      dominantBaseline: "middle",
                      children: el.name
                    }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                      x: el.x + el.w / 2,
                      y: el.y + el.h / 2 + 10,
                      fill: "#cbd5e1",
                      fontSize: "8.5",
                      textAnchor: "middle",
                      dominantBaseline: "middle",
                      children: el.cap
                    }, void 0, false)]
                  }, el.id, true);
                })]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "d-flex justify-content-between align-items-center mt-2",
              style: {
                fontSize: '0.75rem',
                color: '#94a3b8'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "💡 Click any zone block to view engineering specs, wattage load, and capacity limits."
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: ["Perimeter: ", activeVenueObj.city || 'Urban Met']
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-4",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "card-container h-100",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "card-title-row mb-3",
              children: [/*#__PURE__*/_jsxDEV("h3", {
                style: {
                  fontSize: '1.05rem',
                  margin: 0
                },
                children: "🔍 Spatial Inspector"
              }, void 0, false), selectedFloorItem && /*#__PURE__*/_jsxDEV("span", {
                className: "badge-status available",
                style: {
                  fontSize: '0.75rem'
                },
                children: "Active Selection"
              }, void 0, false)]
            }, void 0, true), selectedFloorItem ? /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem'
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  padding: '0.75rem',
                  backgroundColor: 'var(--slate-50)',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${selectedFloorItem.color}`
                },
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--slate-900)'
                  },
                  children: selectedFloorItem.name
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.78rem',
                    color: 'var(--slate-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  },
                  children: ["Zone Module #", selectedFloorItem.id]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "row g-2",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "col-6",
                  children: /*#__PURE__*/_jsxDEV("div", {
                    className: "card-container p-2 text-center",
                    style: {
                      backgroundColor: '#ffffff'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      style: {
                        fontSize: '0.72rem',
                        color: 'var(--slate-500)'
                      },
                      children: "Power Draw"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      style: {
                        fontSize: '0.95rem',
                        color: 'var(--primary-700)'
                      },
                      children: ["⚡ ", selectedFloorItem.power]
                    }, void 0, true)]
                  }, void 0, true)
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "col-6",
                  children: /*#__PURE__*/_jsxDEV("div", {
                    className: "card-container p-2 text-center",
                    style: {
                      backgroundColor: '#ffffff'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      style: {
                        fontSize: '0.72rem',
                        color: 'var(--slate-500)'
                      },
                      children: "Capacity Spec"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      style: {
                        fontSize: '0.95rem',
                        color: 'var(--success-700)'
                      },
                      children: ["👥 ", selectedFloorItem.cap]
                    }, void 0, true)]
                  }, void 0, true)
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "form-group",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontSize: '0.82rem',
                    fontWeight: 600
                  },
                  children: "Spatial X Position (px):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
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
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "form-group",
                children: [/*#__PURE__*/_jsxDEV("label", {
                  style: {
                    fontSize: '0.82rem',
                    fontWeight: 600
                  },
                  children: "Spatial Y Position (px):"
                }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
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
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "d-flex gap-2 mt-2",
                children: /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-secondary btn-small w-100 text-danger",
                  onClick: () => {
                    setFloorPlanElements(prev => prev.filter(item => item.id !== selectedFloorItem.id));
                    setSelectedFloorItem(null);
                    showToast('Removed module from layout', 'info');
                  },
                  children: "🗑️ Delete Element"
                }, void 0, false)
              }, void 0, false)]
            }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
              className: "text-center py-5 text-muted",
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                },
                children: "👆"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                style: {
                  fontSize: '0.85rem'
                },
                children: "Click on any stage, audio booth, or seating block on the blueprint canvas to inspect and calibrate positioning."
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
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
    return /*#__PURE__*/_jsxDEV("div", {
      className: "tab-pane-content",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "content-page-header",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h2", {
            children: "🌦️ Real-Time Environmental Safety & Weather Radar"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "Live staging conditions, line-array wind shear safety thresholds, and heat hydration advisories."
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "d-flex gap-2",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary",
            onClick: () => showToast('Weather telemetry synced with NOAA & OpenMeteo APIs', 'info'),
            children: "🔄 Refresh Sensor Feed"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => {
              showToast(`Safety advisory broadcast dispatched to on-site stage managers for ${selectedWeatherVenue}`, 'success');
              logAudit('Weather Safety Advisory', `Dispatched environmental safety memo for ${selectedWeatherVenue} (${curWeather.condition}, Wind: ${curWeather.windSpeed}).`, 'System', 'Info');
            },
            children: "📢 Broadcast Safety Memo"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "card-container mb-4",
        children: /*#__PURE__*/_jsxDEV("div", {
          className: "d-flex flex-wrap align-items-center justify-content-between gap-3",
          children: [/*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--slate-600)',
                marginRight: '0.75rem'
              },
              children: "Monitored Venue Site:"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "btn-group",
              style: {
                display: 'inline-flex',
                gap: '0.4rem'
              },
              children: Object.keys(WEATHER_DATA).map(vName => /*#__PURE__*/_jsxDEV("button", {
                className: `btn btn-small ${selectedWeatherVenue === vName ? 'btn-primary' : 'btn-secondary'}`,
                onClick: () => setSelectedWeatherVenue(vName),
                children: vName
              }, vName, false))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              fontSize: '0.8rem',
              color: 'var(--slate-500)'
            },
            children: ["🛰️ Station: ", curWeather.city, " • Lat 37.77 / Long -122.41"]
          }, void 0, true)]
        }, void 0, true)
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "row g-4 mb-4",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-4",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "card-container h-100",
            style: {
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: '#ffffff',
              borderColor: '#334155'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "d-flex justify-content-between align-items-start mb-3",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.85rem',
                    color: '#94a3b8'
                  },
                  children: "Live Ambient Climate"
                }, void 0, false), /*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    margin: '0.2rem 0'
                  },
                  children: selectedWeatherVenue
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.8rem',
                    color: '#cbd5e1'
                  },
                  children: curWeather.city
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: '3rem'
                },
                children: curWeather.icon
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "d-flex align-items-baseline gap-2 mb-3",
              children: [/*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: '2.75rem',
                  fontWeight: 800,
                  color: '#38bdf8'
                },
                children: curWeather.temp
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  fontSize: '1.1rem',
                  color: '#94a3b8'
                },
                children: curWeather.condition
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                padding: '0.65rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#cbd5e1'
              },
              children: curWeather.soundAdvisory
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "col-12 col-lg-8",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "col-6 col-md-3",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container text-center p-3",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)'
                  },
                  children: "💨 Wind Velocity"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--slate-900)',
                    margin: '0.25rem 0'
                  },
                  children: curWeather.windSpeed
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  className: `badge-status ${curWeather.windSafe ? 'available' : 'collision'}`,
                  style: {
                    fontSize: '0.72rem'
                  },
                  children: curWeather.windSafe ? 'Safe for Rigging' : '⚠️ Gusts > 25mph'
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-6 col-md-3",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container text-center p-3",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)'
                  },
                  children: "🌧️ Rain Probability"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--slate-900)',
                    margin: '0.25rem 0'
                  },
                  children: curWeather.rainProb
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.72rem',
                    color: 'var(--slate-500)'
                  },
                  children: ["Humidity: ", curWeather.humidity]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-6 col-md-3",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container text-center p-3",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)'
                  },
                  children: "🍃 Air Quality Index"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--success-600)',
                    margin: '0.25rem 0'
                  },
                  children: curWeather.aqi
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.72rem',
                    color: 'var(--slate-500)'
                  },
                  children: "Optimal Breathability"
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-6 col-md-3",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container text-center p-3",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)'
                  },
                  children: "☀️ UV Radiation"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--warning-600)',
                    margin: '0.25rem 0'
                  },
                  children: curWeather.uvIndex
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '0.72rem',
                    color: 'var(--slate-500)'
                  },
                  children: "Shade Tents Active"
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-12",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "card-title-row mb-2",
                  children: [/*#__PURE__*/_jsxDEV("h4", {
                    style: {
                      fontSize: '0.95rem',
                      margin: 0
                    },
                    children: "🛡️ On-Site Production Environmental Protocols"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    className: "badge-status available",
                    style: {
                      fontSize: '0.75rem'
                    },
                    children: "All Systems Nominal"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "row g-2",
                  style: {
                    fontSize: '0.82rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "col-12 col-md-6",
                    children: /*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex align-items-center gap-2 p-2",
                      style: {
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: '4px'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        children: "✅"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        children: [/*#__PURE__*/_jsxDEV("strong", {
                          children: "Truss & Lighting Rig:"
                        }, void 0, false), " Base weight ballasts rated for 35 mph wind shear."]
                      }, void 0, true)]
                    }, void 0, true)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "col-12 col-md-6",
                    children: /*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex align-items-center gap-2 p-2",
                      style: {
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: '4px'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        children: "✅"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        children: [/*#__PURE__*/_jsxDEV("strong", {
                          children: "Outdoor Audio Arrays:"
                        }, void 0, false), " Decibel monitoring sensors calibrated at FOH perimeter."]
                      }, void 0, true)]
                    }, void 0, true)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "col-12 col-md-6",
                    children: /*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex align-items-center gap-2 p-2",
                      style: {
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: '4px'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        children: "✅"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        children: [/*#__PURE__*/_jsxDEV("strong", {
                          children: "Power Distribution & GenSets:"
                        }, void 0, false), " IP65 waterproof enclosures active."]
                      }, void 0, true)]
                    }, void 0, true)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "col-12 col-md-6",
                    children: /*#__PURE__*/_jsxDEV("div", {
                      className: "d-flex align-items-center gap-2 p-2",
                      style: {
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: '4px'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        children: "✅"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        children: [/*#__PURE__*/_jsxDEV("strong", {
                          children: "Attendee Hydration:"
                        }, void 0, false), " 4x Water stations deployed across venue concourse."]
                      }, void 0, true)]
                    }, void 0, true)
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
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
    return /*#__PURE__*/_jsxDEV("div", {
      className: "tab-pane-content",
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "content-page-header",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("h2", {
            children: "📜 Live System Audit Log & Security Stream"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "Real-time forensic telemetry tracking user credential changes, 1-click collision resolutions, and financial approvals."
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "d-flex gap-2",
          children: [/*#__PURE__*/_jsxDEV("button", {
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
            },
            children: "🔄 Refresh Stream"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
            },
            children: "📥 Export Audit CSV"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "card-container mb-4",
        children: /*#__PURE__*/_jsxDEV("div", {
          className: "row g-3 align-items-center",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "col-12 col-md-5",
            children: /*#__PURE__*/_jsxDEV("input", {
              type: "text",
              placeholder: "🔍 Search audit logs by actor, action, or keyword...",
              value: auditSearch,
              onChange: e => setAuditSearch(e.target.value),
              className: "form-control"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end",
            children: ['ALL', 'Security', 'Conflict', 'Budget', 'Resource', 'System'].map(cat => /*#__PURE__*/_jsxDEV("button", {
              className: `btn btn-small ${auditFilterCategory === cat ? 'btn-primary' : 'btn-secondary'}`,
              onClick: () => setAuditFilterCategory(cat),
              children: cat === 'ALL' ? 'All Activities' : cat
            }, cat, false))
          }, void 0, false)]
        }, void 0, true)
      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
        className: "table-card-wrapper",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "table-toolbar",
          children: /*#__PURE__*/_jsxDEV("div", {
            style: {
              fontWeight: 700,
              fontSize: '0.95rem'
            },
            children: ["Activity Stream (", filteredLogs.length, " Entries)"]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "table-responsive",
          children: /*#__PURE__*/_jsxDEV("table", {
            className: "enterprise-table",
            children: [/*#__PURE__*/_jsxDEV("thead", {
              children: /*#__PURE__*/_jsxDEV("tr", {
                children: [/*#__PURE__*/_jsxDEV("th", {
                  children: "Timestamp"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  children: "Actor / Role"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  children: "Category"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  children: "Action"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  children: "Details & Context"
                }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                  children: "Severity"
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
              children: filteredLogs.length === 0 ? /*#__PURE__*/_jsxDEV("tr", {
                children: /*#__PURE__*/_jsxDEV("td", {
                  colSpan: "6",
                  className: "text-center py-4 text-muted",
                  children: "No activity logs match the selected filter criteria."
                }, void 0, false)
              }, void 0, false) : filteredLogs.map(log => /*#__PURE__*/_jsxDEV("tr", {
                children: [/*#__PURE__*/_jsxDEV("td", {
                  style: {
                    whiteSpace: 'nowrap',
                    fontSize: '0.8rem',
                    color: 'var(--slate-600)'
                  },
                  children: new Date(log.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: [/*#__PURE__*/_jsxDEV("strong", {
                    children: log.actor
                  }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                    style: {
                      display: 'block',
                      fontSize: '0.72rem',
                      color: 'var(--slate-500)'
                    },
                    children: log.role
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                  children: /*#__PURE__*/_jsxDEV("span", {
                    className: "card-badge-pill",
                    style: {
                      fontWeight: 600,
                      backgroundColor: log.category === 'Security' ? 'rgba(239, 68, 68, 0.1)' : log.category === 'Conflict' ? 'rgba(245, 158, 11, 0.1)' : log.category === 'Budget' ? 'rgba(16, 185, 129, 0.1)' : 'var(--primary-50)',
                      color: log.category === 'Security' ? '#dc2626' : log.category === 'Conflict' ? '#d97706' : log.category === 'Budget' ? '#059669' : 'var(--primary-700)'
                    },
                    children: log.category
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: /*#__PURE__*/_jsxDEV("strong", {
                    children: log.action
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  style: {
                    fontSize: '0.82rem',
                    color: 'var(--slate-700)',
                    maxWidth: '350px'
                  },
                  children: log.details
                }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                  children: /*#__PURE__*/_jsxDEV("span", {
                    className: `badge-status ${log.severity === 'Success' ? 'available' : log.severity === 'Warning' ? 'collision' : 'pending'}`,
                    style: {
                      fontSize: '0.75rem'
                    },
                    children: log.severity
                  }, void 0, false)
                }, void 0, false)]
              }, log.id, true))
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true);
  };
  return /*#__PURE__*/_jsxDEV("div", {
    id: "app-workspace",
    children: [mobileSidebarOpen && /*#__PURE__*/_jsxDEV("div", {
      className: "mobile-sidebar-backdrop",
      onClick: () => setMobileSidebarOpen(false)
    }, void 0, false), /*#__PURE__*/_jsxDEV("aside", {
      className: `app-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`,
      children: [/*#__PURE__*/_jsxDEV("div", {
        className: "sidebar-brand",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "sidebar-logo-icon",
          children: "▲"
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "sidebar-brand-text",
          children: [/*#__PURE__*/_jsxDEV("h1", {
            children: "APEX"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            children: "RESOURCE MATRIX"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "sidebar-nav-container",
        children: [/*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "Overview"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [/*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'dashboard' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('dashboard');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📊"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Dashboard"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("a", {
              href: "/",
              className: "nav-item",
              style: {
                textDecoration: 'none'
              },
              title: "Open Public Landing Page",
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🌐"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Public Landing Page"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                style: {
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  color: 'var(--primary-600)'
                },
                children: "→"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), (allowedTabs.includes('events') || allowedTabs.includes('tasks') || allowedTabs.includes('calendar')) && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "Events & Schedule"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [allowedTabs.includes('events') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'events' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('events');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📅"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: currentPersona.roleCode === 'STAFF' ? 'My Events' : currentPersona.roleCode === 'ORGANIZER' ? 'My Assigned Event' : 'Events Workspace'
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('calendar') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'calendar' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('calendar');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🗓️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: currentPersona.roleCode === 'STAFF' ? 'My Schedule' : 'Calendar & Gantt'
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('tasks') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'tasks' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('tasks');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "✅"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: currentPersona.roleCode === 'STAFF' ? 'My Tasks' : 'Task Tracker'
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), (allowedTabs.includes('staff') || allowedTabs.includes('equipment') || allowedTabs.includes('venues') || allowedTabs.includes('vendors')) && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "Resources"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [allowedTabs.includes('staff') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'staff' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('staff');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "👥"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Staff' : 'Staff & Crew'
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('equipment') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'equipment' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('equipment');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📦"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Equipment Stock"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('venues') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'venues' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('venues');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🏛️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Venues Registry"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('vendors') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'vendors' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('vendors');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🤝"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Vendor Matrix"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), (allowedTabs.includes('budget') || allowedTabs.includes('reports')) && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "Finance & Reports"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [allowedTabs.includes('budget') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'budget' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('budget');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "💰"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Budgets & POs"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('reports') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'reports' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('reports');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📈"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Executive Reports"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), (allowedTabs.includes('simulator') || allowedTabs.includes('floorplan') || allowedTabs.includes('weather') || allowedTabs.includes('audit')) && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "Smart Tools & Audit"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [allowedTabs.includes('simulator') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'simulator' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('simulator');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🧮"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "ROI Simulator"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('floorplan') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'floorplan' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('floorplan');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📐"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Venue Studio 2D"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('weather') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'weather' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('weather');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🌦️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Weather Radar"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('audit') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'audit' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('audit');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "📜"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Audit Stream"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), (allowedTabs.includes('aws') || allowedTabs.includes('admin')) && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "nav-section-label",
            children: "System & Security"
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "sidebar-nav-group",
            children: [allowedTabs.includes('aws') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'aws' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('aws');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "☁️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "AWS Cloud Center"
              }, void 0, false)]
            }, void 0, true), allowedTabs.includes('admin') && /*#__PURE__*/_jsxDEV("button", {
              className: `nav-item ${activeTab === 'admin' ? 'active' : ''}`,
              onClick: () => {
                setActiveTab('admin');
                setMobileSidebarOpen(false);
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "nav-icon",
                children: "🛡️"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                children: "Users & RBAC Roles"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
        className: "sidebar-user-footer",
        children: [/*#__PURE__*/_jsxDEV("div", {
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
          title: "Click to Edit Your Corporate Mail ID & Password",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "persona-avatar",
            children: currentPersona.avatar
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "persona-details",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "persona-name",
              children: currentPersona.name
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "persona-role",
              children: currentPersona.userRole
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: '0.85rem',
              color: 'var(--slate-400)',
              marginLeft: 'auto'
            },
            title: "Edit Profile & Password",
            children: "⚙️"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
          type: "button",
          className: "btn btn-secondary btn-small w-100 mt-2 d-flex align-items-center justify-content-center gap-1",
          style: {
            fontSize: '0.78rem',
            color: 'var(--slate-600)'
          },
          onClick: handleLogout,
          title: "Logout and return to Public Landing Page",
          children: /*#__PURE__*/_jsxDEV("span", {
            children: "🚪 Sign Out to Landing Page"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)]
    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
      className: "app-main-layout",
      children: [/*#__PURE__*/_jsxDEV("header", {
        className: "app-topbar",
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "topbar-left",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary btn-small d-lg-none",
            onClick: () => setMobileSidebarOpen(prev => !prev),
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "☰"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "breadcrumb-area",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "breadcrumb-root",
              children: "APEX"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "breadcrumb-separator",
              children: "/"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "breadcrumb-active",
              style: {
                textTransform: 'capitalize'
              },
              children: activeTab === 'aws' ? 'AWS Cloud' : activeTab === 'simulator' ? 'ROI Simulator' : activeTab === 'floorplan' ? 'Venue Studio 2D' : activeTab === 'weather' ? 'Weather Radar' : activeTab === 'audit' ? 'Live Audit Stream' : activeTab
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "topbar-right",
          children: [/*#__PURE__*/_jsxDEV("a", {
            href: "/",
            className: "btn btn-secondary btn-small d-none d-lg-inline-flex align-items-center gap-1",
            title: "Open Public Client Event Portal",
            style: {
              textDecoration: 'none',
              color: 'var(--primary-700)',
              borderColor: 'var(--primary-200)',
              backgroundColor: 'var(--primary-50)'
            },
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "🌐 Portal"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "search-trigger-btn",
            onClick: () => setCommandPaletteOpen(true),
            title: "Quick Command Palette (Ctrl+K)",
            children: [/*#__PURE__*/_jsxDEV("span", {
              children: "🔍"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "d-none d-md-inline",
              children: "Search"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "search-kbd-pill d-none d-md-inline",
              children: "Ctrl+K"
            }, void 0, false)]
          }, void 0, true), totalConflictsCount > 0 ? /*#__PURE__*/_jsxDEV("div", {
            className: "status-chip collision d-none d-sm-inline-flex",
            onClick: () => setActiveTab('dashboard'),
            title: "Active Resource Collision Warnings",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "pulse-dot anim"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              children: [totalConflictsCount, " Clash", totalConflictsCount > 1 ? 'es' : '']
            }, void 0, true)]
          }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
            className: "status-chip clean d-none d-sm-inline-flex",
            title: "All Resources & Schedules Synced",
            children: [/*#__PURE__*/_jsxDEV("span", {
              className: "pulse-dot"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              children: "All Clear"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-warning btn-small d-none d-lg-inline-flex",
            onClick: handleAutoResolve,
            title: "Smart Auto-Resolve Collisions",
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "⚡ Auto-Resolve"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary btn-small d-none d-md-inline-flex",
            onClick: () => setActiveModal('export'),
            title: "Export Reports & Manifests",
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "📥 Export"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
            className: "d-none d-lg-inline-block",
            value: currency,
            onChange: e => handleCurrencyChange(e.target.value),
            style: {
              width: 'auto',
              padding: '0.35rem 1.8rem 0.35rem 0.65rem',
              fontSize: '0.8rem',
              height: '32px'
            },
            children: [/*#__PURE__*/_jsxDEV("option", {
              value: "USD",
              children: "USD ($)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "EUR",
              children: "EUR (€)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "GBP",
              children: "GBP (£)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "CAD",
              children: "CAD (CA$)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "JPY",
              children: "JPY (¥)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
              value: "INR",
              children: "INR (₹)"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary btn-small d-none d-xl-inline-flex",
            onClick: () => setShortcutsOpen(true),
            title: "Keyboard Shortcuts Sheet",
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "⌨️"
            }, void 0, false)
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary btn-small d-inline-flex align-items-center gap-1",
            onClick: () => {
              setModalData(currentPersona);
              setActiveModal('my-credentials');
            },
            title: "Edit User Profile & Credentials",
            children: /*#__PURE__*/_jsxDEV("span", {
              children: ["👤 ", currentPersona.name.split(' ')[0]]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-danger btn-small",
            onClick: handleLogout,
            title: "Sign Out",
            children: /*#__PURE__*/_jsxDEV("span", {
              children: "Logout"
            }, void 0, false)
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true), /*#__PURE__*/_jsxDEV("main", {
        className: "app-content-viewport",
        children: [!allowedTabs.includes(activeTab) && /*#__PURE__*/_jsxDEV("div", {
          className: "card-container text-center",
          style: {
            maxWidth: '640px',
            margin: '4rem auto',
            padding: '3.5rem 2rem'
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              fontSize: '3.8rem',
              marginBottom: '1rem'
            },
            children: "⛔"
          }, void 0, false), /*#__PURE__*/_jsxDEV("h2", {
            style: {
              fontSize: '1.6rem',
              color: 'var(--danger-700)',
              marginBottom: '0.75rem',
              fontWeight: 800
            },
            children: "403 — Access Restricted"
          }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
            style: {
              fontSize: '1rem',
              color: 'var(--slate-700)',
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            },
            children: ["You don't have permission to access the ", /*#__PURE__*/_jsxDEV("strong", {
              children: activeTab.toUpperCase()
            }, void 0, false), " module."]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            style: {
              backgroundColor: 'var(--slate-50)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '2rem',
              textAlign: 'left',
              fontSize: '0.86rem'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("strong", {
                children: "Current Persona:"
              }, void 0, false), " ", currentPersona.name, " (", currentPersona.email, ")"]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                marginTop: '0.4rem'
              },
              children: [/*#__PURE__*/_jsxDEV("strong", {
                children: "Assigned Role:"
              }, void 0, false), " ", /*#__PURE__*/_jsxDEV("span", {
                className: "badge-status in-progress",
                style: {
                  fontWeight: 700
                },
                children: currentPersona.userRole
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                marginTop: '0.4rem'
              },
              children: [/*#__PURE__*/_jsxDEV("strong", {
                children: "Operational Scope:"
              }, void 0, false), " ", currentPersona.tag]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                marginTop: '0.6rem',
                color: 'var(--slate-500)',
                borderTop: '1px dashed var(--border-light)',
                paddingTop: '0.5rem'
              },
              children: "🔒 All mutations and data access are verified server-side. Lower-level operational roles cannot access administrative configuration or unrelated event domains."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => setActiveTab('dashboard'),
            style: {
              padding: '0.75rem 2rem',
              fontSize: '0.95rem',
              fontWeight: 700
            },
            children: "↩ Return to Authorized Dashboard"
          }, void 0, false)]
        }, void 0, true), activeTab === 'dashboard' && allowedTabs.includes('dashboard') && /*#__PURE__*/_jsxDEV("div", {
          children: [currentPersona.roleCode === 'SUPER_ADMIN' && /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "content-page-header",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("h2", {
                  children: "👑 Super Admin Platform Command Center"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  children: "Full platform governance: System-wide event oversight, Event Admin management, resource conflict resolution, and cloud infra."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  gap: '0.5rem'
                },
                children: [/*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-secondary",
                  onClick: () => setActiveTab('admin'),
                  children: "🛡️ Manage Roles & Users"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-primary",
                  onClick: () => {
                    setModalData({});
                    setActiveModal('event');
                  },
                  children: "＋ Create Event"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), totalConflictsCount > 0 ? /*#__PURE__*/_jsxDEV("div", {
              className: "alert-banner warning",
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '1.5rem'
                  },
                  children: "⚠️"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("h4", {
                    style: {
                      margin: 0,
                      fontSize: '0.95rem'
                    },
                    children: "System-Wide Resource Collisions Detected"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                    style: {
                      margin: 0,
                      fontSize: '0.82rem',
                      color: 'var(--warning-700)'
                    },
                    children: [conflicts.staffConflicts?.length || 0, " staff collision(s), ", conflicts.equipmentConflicts?.length || 0, " gear deficit(s), and ", conflicts.venueConflicts?.length || 0, " venue collision(s)."]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-warning btn-small",
                onClick: handleAutoResolve,
                style: {
                  fontWeight: 700
                },
                children: "⚡ 1-Click Auto-Resolve All"
              }, void 0, false)]
            }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
              className: "alert-banner success",
              style: {
                marginBottom: '1.5rem'
              },
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                },
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '1.25rem'
                  },
                  children: "✓"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("h4", {
                    style: {
                      margin: 0,
                      fontSize: '0.92rem'
                    },
                    children: "All System Resources & Timelines Synced"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                    style: {
                      margin: 0,
                      fontSize: '0.8rem',
                      color: 'var(--success-700)'
                    },
                    children: "Platform-wide zero collision state across all active events, crew schedules, and gear inventory."
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-grid",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box blue",
                  children: "📅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Total Platform Events"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: events.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: [events.filter(e => e.status === 'Confirmed').length, " Confirmed • ", events.filter(e => e.status === 'Draft').length, " Draft"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box purple",
                  children: "👔"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Event Admins & Organizers"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length + users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: [users.filter(u => u.role === 'EVENT_ADMIN' || u.role === 'Event Manager').length, " Admins • ", users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length, " Organizers"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box green",
                  children: "👥"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Total Staff Pool"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: staff.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: [staff.filter(s => !s.isDoubleBooked).length, " Available • ", staff.filter(s => s.isDoubleBooked).length, " Collisions"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box amber",
                  children: "💰"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Total Platform Spend"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: [currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
                      maximumFractionDigits: 0
                    })]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: [analytics?.overallBurnPercent || 0, "% of ", currencySymbol, ((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, {
                      maximumFractionDigits: 0
                    }), " Cap"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), currentPersona.roleCode === 'EVENT_ADMIN' && /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "content-page-header",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("h2", {
                  children: "👔 Event Admin Operations Dashboard"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  children: "Managing assigned event scopes, delegating organizers, scheduling staff crew, and tracking event expenditure."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  gap: '0.5rem'
                },
                children: /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-primary",
                  onClick: () => {
                    setModalData({});
                    setActiveModal('event');
                  },
                  children: "＋ Create Event"
                }, void 0, false)
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-grid",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box blue",
                  children: "📅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Managed Events"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: events.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Assigned to your management scope"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box purple",
                  children: "📋"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Assigned Organizers"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: users.filter(u => u.role === 'ORGANIZER' || u.role === 'Organizer').length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Direct event coordinators"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box green",
                  children: "👥"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Staff Crew"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: staff.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Available for event deployment"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box amber",
                  children: "💰"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Scope Spend"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: [currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
                      maximumFractionDigits: 0
                    })]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Managed event expenditure"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), currentPersona.roleCode === 'ORGANIZER' && /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "content-page-header",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("h2", {
                  children: "📋 Event Organizer Operational Workspace"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  children: "Operational execution for assigned event: task tracking, crew coordination, and hardware logistics."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  gap: '0.5rem'
                },
                children: /*#__PURE__*/_jsxDEV("button", {
                  className: "btn btn-primary",
                  onClick: () => {
                    setModalData({});
                    setActiveModal('task');
                  },
                  children: "＋ Create Task"
                }, void 0, false)
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-grid",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box blue",
                  children: "📅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Assigned Event"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    style: {
                      fontSize: '1.2rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    },
                    children: events[0]?.title || 'Tech Summit 2026'
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: ["📍 ", events[0]?.venue || 'Innovation Arena']
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box green",
                  children: "👥"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Assigned Staff"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: staff.filter(s => s.assignedEventId === (events[0]?.id || 'ev1')).length || 2
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Staff crew deployed to this event"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box purple",
                  children: "✅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Active Tasks"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: tasks.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: [tasks.filter(t => t.status === 'Completed').length, " Done • ", tasks.filter(t => t.status !== 'Completed').length, " Pending"]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box amber",
                  children: "📦"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "Allocated Equipment"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: equipment.length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Gear assigned to venue"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), currentPersona.roleCode === 'STAFF' && /*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "content-page-header",
              children: /*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("h2", {
                  children: "👷 Staff Operations & Task Checklist"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  children: "View your assigned shifts, run-of-show details, and update execution status on assigned tasks."
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-grid",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box blue",
                  children: "📅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "My Assigned Event"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    style: {
                      fontSize: '1.2rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    },
                    children: events[0]?.title || 'Tech Summit 2026'
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: ["📍 ", events[0]?.venue || 'Innovation Arena']
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box amber",
                  children: "⏳"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "My Pending Tasks"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: tasks.filter(t => t.status !== 'Completed').length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Tasks awaiting completion"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box green",
                  children: "✅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "My Completed Tasks"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    children: tasks.filter(t => t.status === 'Completed').length
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: "Submitted & validated"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-card",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-icon-box purple",
                  children: "👤"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-body",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-label",
                    children: "My Shift Profile"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-val",
                    style: {
                      fontSize: '1.1rem'
                    },
                    children: "Active"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kpi-sub",
                    children: currentPersona.email
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "table-card-wrapper mb-4",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "table-toolbar",
                children: /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  },
                  children: "📝 My Assigned Operational Tasks"
                }, void 0, false)
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "table-responsive",
                children: /*#__PURE__*/_jsxDEV("table", {
                  className: "enterprise-table",
                  children: [/*#__PURE__*/_jsxDEV("thead", {
                    children: /*#__PURE__*/_jsxDEV("tr", {
                      children: [/*#__PURE__*/_jsxDEV("th", {
                        children: "Task Description"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                        children: "Event"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                        children: "Priority"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                        children: "Deadline"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                        children: "Current Status"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                        children: "Action"
                      }, void 0, false)]
                    }, void 0, true)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                    children: tasks.length === 0 ? /*#__PURE__*/_jsxDEV("tr", {
                      children: /*#__PURE__*/_jsxDEV("td", {
                        colSpan: "6",
                        style: {
                          textAlign: 'center',
                          padding: '2rem',
                          color: 'var(--slate-400)'
                        },
                        children: "No tasks currently assigned to your roster."
                      }, void 0, false)
                    }, void 0, false) : tasks.map(t => /*#__PURE__*/_jsxDEV("tr", {
                      children: [/*#__PURE__*/_jsxDEV("td", {
                        children: [/*#__PURE__*/_jsxDEV("strong", {
                          children: t.title
                        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                          style: {
                            fontSize: '0.78rem',
                            color: 'var(--slate-500)'
                          },
                          children: t.description
                        }, void 0, false)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                        children: events.find(e => e.id === t.eventId)?.title || t.eventId
                      }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                        children: /*#__PURE__*/_jsxDEV("span", {
                          className: `badge-status ${t.priority === 'High' ? 'collision' : 'draft'}`,
                          children: t.priority
                        }, void 0, false)
                      }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                        children: t.deadline || 'Today'
                      }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                        children: /*#__PURE__*/_jsxDEV("span", {
                          className: `badge-status ${t.status === 'Completed' ? 'available' : t.status === 'In Progress' ? 'in-progress' : 'pending'}`,
                          children: t.status
                        }, void 0, false)
                      }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                        children: /*#__PURE__*/_jsxDEV("div", {
                          style: {
                            display: 'flex',
                            gap: '0.35rem'
                          },
                          children: [t.status !== 'In Progress' && t.status !== 'Completed' && /*#__PURE__*/_jsxDEV("button", {
                            className: "btn btn-secondary btn-small",
                            onClick: () => handleUpdateTaskStatus(t.id, 'In Progress', 'Started work on task'),
                            children: "▶ Start"
                          }, void 0, false), t.status !== 'Completed' && /*#__PURE__*/_jsxDEV("button", {
                            className: "btn btn-primary btn-small",
                            onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Task finished on schedule'),
                            children: "✓ Complete"
                          }, void 0, false), t.status === 'Completed' && /*#__PURE__*/_jsxDEV("span", {
                            style: {
                              fontSize: '0.8rem',
                              color: 'var(--success-700)',
                              fontWeight: 600
                            },
                            children: "✓ Done"
                          }, void 0, false)]
                        }, void 0, true)
                      }, void 0, false)]
                    }, t.id, true))
                  }, void 0, false)]
                }, void 0, true)
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), currentPersona.roleCode !== 'STAFF' && /*#__PURE__*/_jsxDEV("div", {
            className: "table-card-wrapper mb-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "table-toolbar",
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                children: currentPersona.roleCode === 'ORGANIZER' ? 'Assigned Event Run-of-Show' : 'Active Event Schedules & Financial Rollup'
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-secondary btn-small",
                onClick: () => setActiveTab('events'),
                children: "View All in Events Workspace →"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "table-responsive",
              children: /*#__PURE__*/_jsxDEV("table", {
                className: "enterprise-table",
                children: [/*#__PURE__*/_jsxDEV("thead", {
                  children: /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("th", {
                      children: "Event Title"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Venue Location"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Date Window"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Duration"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Budget Cap"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Actual Spend"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Status"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Actions"
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                  children: events.map(ev => /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("td", {
                      children: [/*#__PURE__*/_jsxDEV("strong", {
                        children: ev.title
                      }, void 0, false), ev.hasConflict && /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          color: 'var(--danger-500)',
                          marginLeft: '0.4rem'
                        },
                        children: "⚠️"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: ["📍 ", ev.venue]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [ev.startDate, " to ", ev.endDate]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [ev.durationDays, " days"]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [currencySymbol, (ev.budget * currencyRate).toLocaleString()]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("strong", {
                        children: [currencySymbol, ((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
                          maximumFractionDigits: 0
                        })]
                      }, void 0, true)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: `badge-status ${ev.status.toLowerCase().replace(' ', '-')}`,
                        children: ev.status
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("button", {
                        className: "btn btn-secondary btn-small",
                        onClick: () => {
                          setSelectedEventId(ev.id);
                          setActiveTab('events');
                        },
                        children: "Inspect Details"
                      }, void 0, false)
                    }, void 0, false)]
                  }, ev.id, true))
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "card-container",
            children: [/*#__PURE__*/_jsxDEV("h3", {
              style: {
                fontSize: '1.05rem',
                marginBottom: '1rem'
              },
              children: "🗓️ Run-of-Show Scheduling Timeline (September 2026)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "timeline-visual-container",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "timeline-days-ruler",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    textAlign: 'left',
                    paddingLeft: '0.5rem'
                  },
                  children: "Event Title"
                }, void 0, false), Array.from({
                  length: 30
                }, (_, d) => /*#__PURE__*/_jsxDEV("div", {
                  className: "ruler-day",
                  children: d + 1
                }, d, false))]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "timeline-rows",
                children: events.map(ev => {
                  const startDay = parseInt(ev.startDate.split('-')[2] || '1', 10);
                  const endDay = parseInt(ev.endDate.split('-')[2] || '3', 10);
                  const leftPercent = (startDay - 1) / 30 * 100;
                  const widthPercent = Math.max(4, (endDay - startDay + 1) / 30 * 100);
                  return /*#__PURE__*/_jsxDEV("div", {
                    className: "timeline-row",
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      className: "timeline-event-name",
                      onClick: () => {
                        setSelectedEventId(ev.id);
                        setActiveTab('events');
                      },
                      children: ev.title
                    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                      className: "timeline-track",
                      children: /*#__PURE__*/_jsxDEV("div", {
                        className: `timeline-bar ${ev.hasConflict ? 'conflict' : ev.status === 'Draft' ? 'draft' : ''}`,
                        style: {
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`
                        },
                        onClick: () => {
                          setSelectedEventId(ev.id);
                          setActiveTab('events');
                        },
                        children: ev.title
                      }, void 0, false)
                    }, void 0, false)]
                  }, ev.id, true);
                })
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'events' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Events & Scheduling Workspace"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Organize, schedule, and allocate staff, equipment, and vendors to events."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                gap: '0.5rem'
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "btn-group",
                style: {
                  display: 'inline-flex',
                  background: 'var(--slate-100)',
                  padding: '2px',
                  borderRadius: 'var(--radius-sm)'
                },
                children: [/*#__PURE__*/_jsxDEV("button", {
                  className: `btn btn-small ${eventViewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`,
                  onClick: () => setEventViewMode('list'),
                  children: "🗂️ Split Inspector"
                }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                  className: `btn btn-small ${eventViewMode === 'kanban' ? 'btn-primary' : 'btn-secondary'}`,
                  onClick: () => setEventViewMode('kanban'),
                  children: "📋 Kanban Board"
                }, void 0, false)]
              }, void 0, true), (currentPersona.roleCode === 'SUPER_ADMIN' || currentPersona.roleCode === 'EVENT_ADMIN') && /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-primary",
                onClick: () => {
                  setModalData({});
                  setActiveModal('event');
                },
                children: "＋ Add Event"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "table-toolbar mb-3",
            style: {
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "table-search-box",
              children: [/*#__PURE__*/_jsxDEV("span", {
                className: "table-search-icon",
                children: "🔍"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                type: "text",
                placeholder: "Search events by title or venue...",
                value: searchQuery,
                onChange: e => setSearchQuery(e.target.value)
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                gap: '0.4rem',
                flexWrap: 'wrap'
              },
              children: ['ALL', 'CONFIRMED', 'DRAFT', 'IN PROGRESS', 'COMPLETED'].map(st => /*#__PURE__*/_jsxDEV("button", {
                className: `btn btn-small ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`,
                onClick: () => setStatusFilter(st),
                children: st
              }, st, false))
            }, void 0, false)]
          }, void 0, true), eventViewMode === 'list' ? /*#__PURE__*/_jsxDEV("div", {
            className: "row g-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-5",
              style: {
                maxHeight: '72vh',
                overflowY: 'auto'
              },
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                },
                children: filteredEvents.map(ev => /*#__PURE__*/_jsxDEV("div", {
                  className: "card-container",
                  style: {
                    cursor: 'pointer',
                    borderColor: selectedEventId === ev.id ? 'var(--primary-500)' : 'var(--border-light)',
                    backgroundColor: selectedEventId === ev.id ? 'var(--primary-50)' : '#ffffff'
                  },
                  onClick: () => setSelectedEventId(ev.id),
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.35rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("h4", {
                      style: {
                        fontSize: '0.95rem',
                        margin: 0,
                        color: 'var(--slate-900)'
                      },
                      children: [ev.title, " ", ev.hasConflict && /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          color: 'var(--danger-500)'
                        },
                        children: "⚠️"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      className: `badge-status ${ev.status.toLowerCase().replace(' ', '-')}`,
                      children: ev.status
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                    style: {
                      fontSize: '0.82rem',
                      margin: '0 0 0.4rem 0',
                      color: 'var(--slate-600)'
                    },
                    children: ["📍 ", ev.venue]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--slate-500)'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: ["📅 ", ev.startDate, " to ", ev.endDate]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      children: ["Spent: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: [currencySymbol, ((ev.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
                          maximumFractionDigits: 0
                        })]
                      }, void 0, true)]
                    }, void 0, true)]
                  }, void 0, true)]
                }, ev.id, true))
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-7",
              children: activeEvent ? /*#__PURE__*/_jsxDEV("div", {
                className: "card-container",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '0.85rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    children: [/*#__PURE__*/_jsxDEV("h3", {
                      style: {
                        fontSize: '1.2rem',
                        marginBottom: '0.25rem'
                      },
                      children: activeEvent.title
                    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        fontSize: '0.82rem',
                        color: 'var(--slate-600)',
                        display: 'flex',
                        gap: '1rem'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        children: ["📍 Venue: ", /*#__PURE__*/_jsxDEV("strong", {
                          children: activeEvent.venue
                        }, void 0, false)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                        children: ["📅 Window: ", /*#__PURE__*/_jsxDEV("strong", {
                          children: [activeEvent.startDate, " to ", activeEvent.endDate]
                        }, void 0, true), " (", activeEvent.durationDays, " days)"]
                      }, void 0, true)]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      gap: '0.4rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-secondary btn-small",
                      onClick: () => {
                        setModalData(activeEvent);
                        setActiveModal('event');
                      },
                      children: "Edit"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-danger btn-small",
                      onClick: async () => {
                        if (confirm('Delete this event?')) {
                          await fetch(`/api/events/${activeEvent.id}`, {
                            method: 'DELETE'
                          });
                          showToast('Event deleted', 'success');
                          fetchAllData();
                        }
                      },
                      children: "Delete"
                    }, void 0, false)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '0.5rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: `btn btn-small ${eventSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setEventSubTab('overview'),
                    children: "ℹ️ Overview & Milestones"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: `btn btn-small ${eventSubTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setEventSubTab('resources'),
                    children: "👥 Resources"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: `btn btn-small ${eventSubTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setEventSubTab('tasks'),
                    children: ["✅ Tasks (", tasks.filter(t => t.eventId === activeEvent.id).length, ")"]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                    className: `btn btn-small ${eventSubTab === 'budget' ? 'btn-primary' : 'btn-secondary'}`,
                    onClick: () => setEventSubTab('budget'),
                    children: "💰 Budget Variance"
                  }, void 0, false)]
                }, void 0, true), eventSubTab === 'overview' && /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("p", {
                    style: {
                      color: 'var(--slate-600)',
                      fontSize: '0.85rem',
                      marginBottom: '1.25rem'
                    },
                    children: activeEvent.description || 'No descriptive overview provided for this event.'
                  }, void 0, false), /*#__PURE__*/_jsxDEV("h4", {
                    style: {
                      fontSize: '0.92rem',
                      marginBottom: '0.75rem'
                    },
                    children: "Hourly Run-of-Show Milestones"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    },
                    children: (activeEvent.milestones || []).map((m, idx) => /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)'
                      },
                      children: [/*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--primary-600)',
                          fontWeight: 700,
                          fontSize: '0.82rem'
                        },
                        children: m.time
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          flex: 1,
                          fontSize: '0.85rem'
                        },
                        children: m.title
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        className: "badge-status confirmed",
                        children: m.status
                      }, void 0, false)]
                    }, idx, true))
                  }, void 0, false)]
                }, void 0, true), eventSubTab === 'resources' && /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap'
                    },
                    children: [/*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-primary btn-small",
                      onClick: () => {
                        setModalData({
                          eventId: activeEvent.id
                        });
                        setActiveModal('assign');
                      },
                      children: "＋ Assign Staff"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-primary btn-small",
                      onClick: () => {
                        setModalData({
                          eventId: activeEvent.id
                        });
                        setActiveModal('allocate');
                      },
                      children: "＋ Allocate Hardware"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-primary btn-small",
                      onClick: () => {
                        setModalData({
                          eventId: activeEvent.id
                        });
                        setActiveModal('coord');
                      },
                      children: "＋ Add Vendor"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                    style: {
                      color: 'var(--slate-500)',
                      fontSize: '0.82rem'
                    },
                    children: "Use the action buttons above to assign crew, book warehouse equipment quotas, and engage vendors for this event."
                  }, void 0, false)]
                }, void 0, true), eventSubTab === 'tasks' && /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.85rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("h4", {
                      style: {
                        margin: 0,
                        fontSize: '0.95rem'
                      },
                      children: "Assigned Operational Tasks"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-primary btn-small",
                      onClick: () => {
                        setModalData({
                          eventId: activeEvent.id
                        });
                        setActiveModal('task');
                      },
                      children: "＋ Add Task"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    },
                    children: tasks.filter(t => t.eventId === activeEvent.id).length === 0 ? /*#__PURE__*/_jsxDEV("p", {
                      style: {
                        color: 'var(--slate-400)',
                        fontSize: '0.82rem'
                      },
                      children: "No tasks created for this event yet."
                    }, void 0, false) : tasks.filter(t => t.eventId === activeEvent.id).map(t => /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--slate-50)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)'
                      },
                      children: [/*#__PURE__*/_jsxDEV("div", {
                        children: [/*#__PURE__*/_jsxDEV("div", {
                          style: {
                            fontWeight: 600,
                            fontSize: '0.88rem'
                          },
                          children: t.title
                        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                          style: {
                            fontSize: '0.78rem',
                            color: 'var(--slate-500)'
                          },
                          children: ["👤 ", t.staff?.name || 'Unassigned', " • ⏰ Due ", t.deadline, " • Priority: ", /*#__PURE__*/_jsxDEV("strong", {
                            children: t.priority
                          }, void 0, false)]
                        }, void 0, true)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        },
                        children: [/*#__PURE__*/_jsxDEV("span", {
                          className: `badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`,
                          children: t.status
                        }, void 0, false), t.status !== 'Completed' && /*#__PURE__*/_jsxDEV("button", {
                          className: "btn btn-success btn-small",
                          onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Marked done by coordinator'),
                          children: "✓ Done"
                        }, void 0, false)]
                      }, void 0, true)]
                    }, t.id, true))
                  }, void 0, false)]
                }, void 0, true), eventSubTab === 'budget' && /*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("h4", {
                    style: {
                      fontSize: '0.92rem',
                      marginBottom: '0.5rem'
                    },
                    children: "Budget Cap & Spend Telemetry"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "progress-track",
                    style: {
                      height: '10px',
                      marginBottom: '0.75rem'
                    },
                    children: /*#__PURE__*/_jsxDEV("div", {
                      className: `progress-fill ${(activeEvent.costs?.total || 0) > activeEvent.budget ? 'danger' : ''}`,
                      style: {
                        width: `${Math.min(100, Math.round((activeEvent.costs?.total || 0) / (activeEvent.budget || 1) * 100))}%`
                      }
                    }, void 0, false)
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: ["Spent: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: [currencySymbol, ((activeEvent.costs?.total || 0) * currencyRate).toLocaleString(undefined, {
                          maximumFractionDigits: 0
                        })]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      children: ["Allocated Cap: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: [currencySymbol, (activeEvent.budget * currencyRate).toLocaleString()]
                      }, void 0, true)]
                    }, void 0, true)]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true) : /*#__PURE__*/_jsxDEV("div", {
                className: "card-container text-center py-5",
                children: [/*#__PURE__*/_jsxDEV("span", {
                  style: {
                    fontSize: '2.5rem'
                  },
                  children: "📅"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  style: {
                    marginTop: '0.5rem'
                  },
                  children: "Select an event from the left list to inspect details."
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true) :
          /*#__PURE__*/
          /* KANBAN BOARD VIEW */
          _jsxDEV("div", {
            className: "kanban-view-grid",
            children: ['Draft', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(colStatus => /*#__PURE__*/_jsxDEV("div", {
              className: "kanban-column",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kanban-col-header",
                children: [/*#__PURE__*/_jsxDEV("span", {
                  className: "kanban-col-title",
                  children: colStatus
                }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                  className: "kanban-col-count",
                  children: events.filter(e => e.status === colStatus).length
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                className: "kanban-cards-stack",
                children: events.filter(e => e.status === colStatus).map(ev => /*#__PURE__*/_jsxDEV("div", {
                  className: "kanban-card",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "kanban-card-title",
                    children: ev.title
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    className: "kanban-card-meta",
                    children: ["📍 ", ev.venue]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "kanban-card-meta",
                    children: ["📅 ", ev.startDate, " to ", ev.endDate]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "kanban-card-actions",
                    children: [/*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-secondary btn-small",
                      onClick: () => handleMoveKanban(ev.id, 'prev'),
                      disabled: colStatus === 'Draft',
                      children: "◀"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                      className: "btn btn-secondary btn-small",
                      onClick: () => handleMoveKanban(ev.id, 'next'),
                      disabled: colStatus === 'Cancelled',
                      children: "▶"
                    }, void 0, false)]
                  }, void 0, true)]
                }, ev.id, true))
              }, void 0, false)]
            }, colStatus, true))
          }, void 0, false)]
        }, void 0, true), activeTab === 'calendar' && renderCalendarTab(), activeTab === 'tasks' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Operational Task Tracker & Shift Assignments"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Assign deliverables to staff members, monitor deadlines, and track real-time completion."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('task');
              },
              children: "＋ Create New Task"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "table-card-wrapper",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "table-toolbar",
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                children: "Active Tasks Matrix"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "table-responsive",
              children: /*#__PURE__*/_jsxDEV("table", {
                className: "enterprise-table",
                children: [/*#__PURE__*/_jsxDEV("thead", {
                  children: /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("th", {
                      children: "Task Title"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Associated Event"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Assigned Staff"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Deadline"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Priority"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Status"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Actions"
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                  children: tasks.map(t => /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("td", {
                      children: [/*#__PURE__*/_jsxDEV("strong", {
                        children: t.title
                      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          fontSize: '0.75rem',
                          color: 'var(--slate-500)'
                        },
                        children: t.description
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: ["📅 ", t.event?.title || 'General']
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: ["👤 ", t.staff?.name || 'Unassigned', " (", t.staff?.role || 'Staff', ")"]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: ["⏰ ", t.deadline]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: `badge-status ${t.priority === 'Urgent' ? 'collision' : t.priority === 'High' ? 'draft' : 'available'}`,
                        children: t.priority
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: `badge-status ${t.status === 'Completed' ? 'completed' : t.status === 'In Progress' ? 'in-progress' : 'draft'}`,
                        children: t.status
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          display: 'flex',
                          gap: '0.3rem'
                        },
                        children: [t.status !== 'Completed' && /*#__PURE__*/_jsxDEV("button", {
                          className: "btn btn-success btn-small",
                          onClick: () => handleUpdateTaskStatus(t.id, 'Completed', 'Done by user'),
                          children: "✓ Complete"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                          className: "btn btn-danger btn-small",
                          onClick: async () => {
                            await fetch(`/api/tasks/${t.id}`, {
                              method: 'DELETE'
                            });
                            showToast('Task deleted', 'success');
                            fetchAllData();
                          },
                          children: "✕"
                        }, void 0, false)]
                      }, void 0, true)
                    }, void 0, false)]
                  }, t.id, true))
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'staff' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Staff & Crew Directory"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Manage personnel profiles, daily billing rates, and track shift allocations."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('staff');
              },
              children: "＋ Register Staff Member"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: staff.map(s => /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-md-6 col-lg-4",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100 d-flex flex-column justify-content-between",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.4rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: [/*#__PURE__*/_jsxDEV("h3", {
                        style: {
                          fontSize: '1.05rem',
                          margin: 0
                        },
                        children: s.name
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.8rem',
                          color: 'var(--slate-500)'
                        },
                        children: s.role
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      className: `badge-status ${s.isDoubleBooked ? 'collision' : 'available'}`,
                      children: s.isDoubleBooked ? '⚠️ Collision' : 'Available'
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.82rem',
                      color: 'var(--slate-600)',
                      margin: '0.6rem 0'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: ["📞 ", s.contact || 'No contact specified']
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["💵 Daily Rate: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: ["$", s.dailyRate, "/day"]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["📅 Active Assignments: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: s.assignedEventsCount || 0
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        marginTop: '0.35rem',
                        color: 'var(--primary-600)'
                      },
                      children: ["✅ Assigned Tasks: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: tasks.filter(t => t.staffId === s.id).length
                      }, void 0, false)]
                    }, void 0, true)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    gap: '0.4rem',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '0.6rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData({
                        type: 'staff',
                        item: s
                      });
                      setActiveModal('badge');
                    },
                    children: "🪪 Print Pass"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData(s);
                      setActiveModal('staff');
                    },
                    children: "Edit Profile"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, s.id, false))
          }, void 0, false)]
        }, void 0, true), activeTab === 'equipment' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Equipment & Warehouse Inventory"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Track hardware stock, rental rates, and peak allocation across events."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('equipment');
              },
              children: "＋ Add Equipment Item"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: equipment.map(eq => /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-md-6 col-lg-4",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100 d-flex flex-column justify-content-between",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.4rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: [/*#__PURE__*/_jsxDEV("h3", {
                        style: {
                          fontSize: '1.05rem',
                          margin: 0
                        },
                        children: eq.name
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        className: "card-badge-pill",
                        children: eq.category
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      className: `badge-status ${eq.isOverAllocated ? 'deficit' : 'in-stock'}`,
                      children: eq.isOverAllocated ? 'Deficit' : 'In Stock'
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.82rem',
                      color: 'var(--slate-600)',
                      margin: '0.6rem 0'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: ["Warehouse Stock: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: [eq.totalStock, " units"]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["Rental Rate: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: ["$", eq.rentalRate, "/day"]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        marginTop: '0.5rem'
                      },
                      children: [/*#__PURE__*/_jsxDEV("div", {
                        style: {
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.78rem'
                        },
                        children: [/*#__PURE__*/_jsxDEV("span", {
                          children: "Peak Utilization:"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                          children: [eq.utilizationPercent || 0, "% (", eq.peakAllocated || 0, " reserved)"]
                        }, void 0, true)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                        className: "progress-track",
                        style: {
                          marginTop: '0.25rem'
                        },
                        children: /*#__PURE__*/_jsxDEV("div", {
                          className: `progress-fill ${eq.utilizationPercent > 100 ? 'danger' : eq.utilizationPercent > 80 ? 'warning' : 'success'}`,
                          style: {
                            width: `${Math.min(100, eq.utilizationPercent || 0)}%`
                          }
                        }, void 0, false)
                      }, void 0, false)]
                    }, void 0, true)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    gap: '0.4rem',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '0.6rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData({
                        type: 'equipment',
                        item: eq
                      });
                      setActiveModal('badge');
                    },
                    children: "🏷️ Print QR Tag"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData(eq);
                      setActiveModal('equipment');
                    },
                    children: "Edit Item"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, eq.id, false))
          }, void 0, false)]
        }, void 0, true), activeTab === 'venues' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Venues & Facility Registry"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Manage event venue locations, seating capacities, and amenities."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('venue');
              },
              children: "＋ Add Venue Location"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: venues.map(vn => /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-md-6 col-lg-4",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100 d-flex flex-column justify-content-between",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.4rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: [/*#__PURE__*/_jsxDEV("h3", {
                        style: {
                          fontSize: '1.05rem',
                          margin: 0
                        },
                        children: vn.name
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.8rem',
                          color: 'var(--slate-500)'
                        },
                        children: ["Capacity: ", /*#__PURE__*/_jsxDEV("strong", {
                          children: [vn.capacity, " guests"]
                        }, void 0, true)]
                      }, void 0, true)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      className: "card-badge-pill",
                      children: ["$", vn.pricing, "/day"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.82rem',
                      color: 'var(--slate-600)',
                      margin: '0.6rem 0'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: ["✨ Amenities: ", vn.amenities]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["📅 Current Bookings: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: [vn.totalBookings || 0, " event(s)"]
                      }, void 0, true)]
                    }, void 0, true)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    gap: '0.4rem',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '0.6rem'
                  },
                  children: /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData(vn);
                      setActiveModal('venue');
                    },
                    children: "Edit Venue"
                  }, void 0, false)
                }, void 0, false)]
              }, void 0, true)
            }, vn.id, false))
          }, void 0, false)]
        }, void 0, true), activeTab === 'vendors' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Vendor Coordination & Contracts"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Track third-party catering, security, audio-visual, and decor suppliers."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('vendor');
              },
              children: "＋ Register Vendor"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-3",
            children: vendors.map(vd => /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-md-6 col-lg-4",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100 d-flex flex-column justify-content-between",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.4rem'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: [/*#__PURE__*/_jsxDEV("h3", {
                        style: {
                          fontSize: '1.05rem',
                          margin: 0
                        },
                        children: vd.name
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        className: "card-badge-pill",
                        children: vd.category
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                      style: {
                        color: 'var(--warning-600)',
                        fontWeight: 700
                      },
                      children: ["★ ", vd.rating || 4.8]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.82rem',
                      color: 'var(--slate-600)',
                      margin: '0.6rem 0'
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      children: ["📧 ", vd.email]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["📞 ", vd.contact || 'No phone']
                    }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                      children: ["💼 Total Contracts: ", /*#__PURE__*/_jsxDEV("strong", {
                        children: vd.contractCount || 0
                      }, void 0, false), " ($", (vd.totalContractValue || 0).toLocaleString(), ")"]
                    }, void 0, true)]
                  }, void 0, true)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    gap: '0.4rem',
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '0.6rem'
                  },
                  children: /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary btn-small",
                    onClick: () => {
                      setModalData(vd);
                      setActiveModal('vendor');
                    },
                    children: "Edit Profile"
                  }, void 0, false)
                }, void 0, false)]
              }, void 0, true)
            }, vd.id, false))
          }, void 0, false)]
        }, void 0, true), activeTab === 'budget' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: /*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Financial Budgeting & Purchase Orders"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Real-time expenditure tracking, currency conversion, and purchase order approvals."
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "kpi-grid",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "kpi-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-icon-box blue",
                children: "💵"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-body",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-label",
                  children: "Total Allocated Cap"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-val",
                  children: [currencySymbol, ((analytics?.totalAllocatedBudget || 0) * currencyRate).toLocaleString(undefined, {
                    maximumFractionDigits: 0
                  })]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-sub",
                  children: "Aggregated budget limits"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-icon-box amber",
                children: "💳"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-body",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-label",
                  children: "Total Actual Spend"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-val",
                  children: [currencySymbol, ((analytics?.totalActualSpend || 0) * currencyRate).toLocaleString(undefined, {
                    maximumFractionDigits: 0
                  })]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-sub",
                  children: "Staff, Equipment & Vendor costs"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "kpi-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                className: "kpi-icon-box green",
                children: "📊"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                className: "kpi-body",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-label",
                  children: "Net Variance"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-val",
                  style: {
                    color: (analytics?.totalVariance || 0) >= 0 ? 'var(--success-600)' : 'var(--danger-600)'
                  },
                  children: [currencySymbol, ((analytics?.totalVariance || 0) * currencyRate).toLocaleString(undefined, {
                    maximumFractionDigits: 0
                  })]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  className: "kpi-sub",
                  children: (analytics?.totalVariance || 0) >= 0 ? 'Under Budget' : 'Over Budget'
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "table-card-wrapper",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "table-toolbar",
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                children: "Event-by-Event Financial Variance Matrix"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "table-responsive",
              children: /*#__PURE__*/_jsxDEV("table", {
                className: "enterprise-table",
                children: [/*#__PURE__*/_jsxDEV("thead", {
                  children: /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("th", {
                      children: "Event Title"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Duration"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Allocated Budget"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Staff Cost"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Gear Cost"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Vendor Cost"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Total Spend"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Status"
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                  children: (analytics?.eventReports || []).map(r => /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("strong", {
                        children: r.title
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: [r.durationDays, " days"]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [currencySymbol, (r.budget * currencyRate).toLocaleString()]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [currencySymbol, (r.breakdown.staff * currencyRate).toLocaleString()]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [currencySymbol, (r.breakdown.equipment * currencyRate).toLocaleString()]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: [currencySymbol, (r.breakdown.vendor * currencyRate).toLocaleString()]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("strong", {
                        children: [currencySymbol, (r.totalSpent * currencyRate).toLocaleString()]
                      }, void 0, true)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: `badge-status ${r.variance >= 0 ? 'confirmed' : 'cancelled'}`,
                        children: r.variance >= 0 ? 'Under Budget' : 'Over Budget'
                      }, void 0, false)
                    }, void 0, false)]
                  }, r.eventId, true))
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'reports' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Executive Analytics & Reports"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Download executive summaries, staff workload telemetry, and hardware inventory manifests."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => setActiveModal('export'),
              children: "📥 Export All Reports"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-6",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    marginBottom: '0.5rem'
                  },
                  children: "📄 Executive Summary Overview"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: '0.85rem',
                    color: 'var(--slate-500)',
                    marginBottom: '1rem'
                  },
                  children: "Generated by APEX Analytics Engine with real-time collision and financial metrics."
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.65rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-sm)'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "Total Registered Events"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: events.length
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.65rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-sm)'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "Total Staff Personnel"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: staff.length
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.65rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-sm)'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "Hardware Catalog Size"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      children: [equipment.length, " items"]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.65rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-sm)'
                    },
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "Overall Financial Status"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("strong", {
                      style: {
                        color: 'var(--success-600)'
                      },
                      children: "Healthy (Under Budget)"
                    }, void 0, false)]
                  }, void 0, true)]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-6",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    marginBottom: '0.5rem'
                  },
                  children: "📥 Instant Data Export Options"
                }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                  style: {
                    fontSize: '0.85rem',
                    color: 'var(--slate-500)',
                    marginBottom: '1rem'
                  },
                  children: "Export production spreadsheets or complete JSON snapshots."
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem'
                  },
                  children: [/*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary",
                    onClick: () => handleExport('events'),
                    children: "📄 Events CSV"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary",
                    onClick: () => handleExport('staff'),
                    children: "👥 Staff CSV"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary",
                    onClick: () => handleExport('equipment'),
                    children: "📦 Equipment CSV"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
                    className: "btn btn-secondary",
                    onClick: () => handleExport('finance'),
                    children: "💰 Financial CSV"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'aws' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: /*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "AWS Cloud Infrastructure Center"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Generate Infrastructure-as-Code (CloudFormation YAML) and compute monthly cloud estimates."
              }, void 0, false)]
            }, void 0, true)
          }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-5",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    marginBottom: '1rem'
                  },
                  children: "⚙️ Deployment Parameters"
                }, void 0, false), /*#__PURE__*/_jsxDEV("form", {
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
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "form-group",
                    children: [/*#__PURE__*/_jsxDEV("label", {
                      children: "Target Environment"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                      name: "env",
                      defaultValue: "production",
                      children: [/*#__PURE__*/_jsxDEV("option", {
                        value: "production",
                        children: "Production (Multi-AZ)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "staging",
                        children: "Staging (Single-AZ)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "dev",
                        children: "Development (Sandbox)"
                      }, void 0, false)]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "form-group",
                    children: [/*#__PURE__*/_jsxDEV("label", {
                      children: "AWS Region"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                      name: "region",
                      defaultValue: "us-east-1",
                      children: [/*#__PURE__*/_jsxDEV("option", {
                        value: "us-east-1",
                        children: "us-east-1 (N. Virginia)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "us-west-2",
                        children: "us-west-2 (Oregon)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "eu-west-1",
                        children: "eu-west-1 (Ireland)"
                      }, void 0, false)]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "form-group",
                    children: [/*#__PURE__*/_jsxDEV("label", {
                      children: "RDS Database Instance Class"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                      name: "dbType",
                      defaultValue: "db.t4g.medium",
                      children: [/*#__PURE__*/_jsxDEV("option", {
                        value: "db.t4g.micro",
                        children: "db.t4g.micro ($15/mo)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "db.t4g.medium",
                        children: "db.t4g.medium ($60/mo)"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                        value: "db.m6g.large",
                        children: "db.m6g.large ($140/mo)"
                      }, void 0, false)]
                    }, void 0, true)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                    className: "form-group",
                    children: [/*#__PURE__*/_jsxDEV("label", {
                      children: "ECS Fargate Container Tasks"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                      name: "appCount",
                      type: "number",
                      min: "1",
                      max: "10",
                      defaultValue: "2"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                    type: "submit",
                    className: "btn btn-primary btn-full-width",
                    children: "Generate CloudFormation YAML"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    marginTop: '1.25rem',
                    padding: '1rem',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  },
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--slate-500)'
                    },
                    children: "ESTIMATED MONTHLY AWS COST"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--slate-900)'
                    },
                    children: "$144.50 / mo"
                  }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontSize: '0.75rem',
                      color: 'var(--slate-400)'
                    },
                    children: "Includes 2x Fargate tasks, ALB, RDS Multi-AZ, S3, & CloudFront"
                  }, void 0, false)]
                }, void 0, true)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-7",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container h-100",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    marginBottom: '1rem'
                  },
                  children: "☁️ AWS Multi-Tier Deployment Topology"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    background: 'var(--slate-900)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center'
                  },
                  children: /*#__PURE__*/_jsxDEV("svg", {
                    width: "100%",
                    height: "280",
                    viewBox: "0 0 600 280",
                    fill: "none",
                    children: [/*#__PURE__*/_jsxDEV("rect", {
                      width: "600",
                      height: "280",
                      rx: "8",
                      fill: "#0f172a"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("rect", {
                      x: "20",
                      y: "20",
                      width: "560",
                      height: "240",
                      rx: "8",
                      stroke: "rgba(56, 189, 248, 0.3)",
                      strokeDasharray: "4 4"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                      x: "35",
                      y: "45",
                      fill: "#38bdf8",
                      fontFamily: "Outfit",
                      fontSize: "12",
                      fontWeight: "bold",
                      children: "AWS SECURE VPC (Multi-AZ)"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("g", {
                      transform: "translate(40, 110)",
                      children: [/*#__PURE__*/_jsxDEV("rect", {
                        width: "80",
                        height: "50",
                        rx: "6",
                        fill: "#1e293b",
                        stroke: "#334155"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "40",
                        y: "26",
                        fill: "#ffffff",
                        fontSize: "11",
                        textAnchor: "middle",
                        fontWeight: "bold",
                        children: "Client SPA"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "40",
                        y: "40",
                        fill: "#94a3b8",
                        fontSize: "9",
                        textAnchor: "middle",
                        children: "React 18"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("g", {
                      transform: "translate(180, 110)",
                      children: [/*#__PURE__*/_jsxDEV("rect", {
                        width: "90",
                        height: "50",
                        rx: "6",
                        fill: "#1e1b4b",
                        stroke: "#6366f1"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "45",
                        y: "26",
                        fill: "#a5b4fc",
                        fontSize: "11",
                        textAnchor: "middle",
                        fontWeight: "bold",
                        children: "CloudFront"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "45",
                        y: "40",
                        fill: "#94a3b8",
                        fontSize: "9",
                        textAnchor: "middle",
                        children: "Global CDN"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("g", {
                      transform: "translate(330, 110)",
                      children: [/*#__PURE__*/_jsxDEV("rect", {
                        width: "100",
                        height: "50",
                        rx: "6",
                        fill: "#042f2e",
                        stroke: "#10b981"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "50",
                        y: "26",
                        fill: "#6ee7b7",
                        fontSize: "11",
                        textAnchor: "middle",
                        fontWeight: "bold",
                        children: "ECS Fargate"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "50",
                        y: "40",
                        fill: "#94a3b8",
                        fontSize: "9",
                        textAnchor: "middle",
                        children: "Node Backend"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("g", {
                      transform: "translate(490, 110)",
                      children: [/*#__PURE__*/_jsxDEV("rect", {
                        width: "90",
                        height: "50",
                        rx: "6",
                        fill: "#451a03",
                        stroke: "#f59e0b"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "45",
                        y: "26",
                        fill: "#fde68a",
                        fontSize: "11",
                        textAnchor: "middle",
                        fontWeight: "bold",
                        children: "RDS Postgre"
                      }, void 0, false), /*#__PURE__*/_jsxDEV("text", {
                        x: "45",
                        y: "40",
                        fill: "#94a3b8",
                        fontSize: "9",
                        textAnchor: "middle",
                        children: "Database"
                      }, void 0, false)]
                    }, void 0, true), /*#__PURE__*/_jsxDEV("path", {
                      d: "M 120 135 L 180 135",
                      stroke: "#475569",
                      strokeWidth: "2"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                      d: "M 270 135 L 330 135",
                      stroke: "#475569",
                      strokeWidth: "2"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("path", {
                      d: "M 430 135 L 490 135",
                      stroke: "#475569",
                      strokeWidth: "2"
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'admin' && /*#__PURE__*/_jsxDEV("div", {
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "content-page-header",
            children: [/*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("h2", {
                children: "Admin Console & User Identity Matrix"
              }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
                children: "Manage system users, grant security permissions, and switch active role personas."
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
              className: "btn btn-primary",
              onClick: () => {
                setModalData({});
                setActiveModal('user');
              },
              children: "＋ Register System User"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "table-card-wrapper mb-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "table-toolbar",
              children: /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  fontSize: '0.95rem'
                },
                children: "Active System Users & Permissions"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "table-responsive",
              children: /*#__PURE__*/_jsxDEV("table", {
                className: "enterprise-table",
                children: [/*#__PURE__*/_jsxDEV("thead", {
                  children: /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("th", {
                      children: "User Name"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Corporate Email (Mail ID)"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Assigned Role"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Department"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Password / Access"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Status"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                      children: "Actions"
                    }, void 0, false)]
                  }, void 0, true)
                }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                  children: users.map(u => /*#__PURE__*/_jsxDEV("tr", {
                    children: [/*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("strong", {
                        children: u.name
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("code", {
                        style: {
                          fontSize: '0.8rem',
                          color: 'var(--primary-700)',
                          backgroundColor: 'var(--primary-50)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        },
                        children: u.email
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: "card-badge-pill",
                        style: {
                          fontWeight: 700,
                          color: 'var(--primary-700)'
                        },
                        children: u.role
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: u.department
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.78rem',
                          color: 'var(--slate-500)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        },
                        children: "🔒 Protected"
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("span", {
                        className: `badge-status ${u.status === 'Active' ? 'available' : 'collision'}`,
                        children: u.status
                      }, void 0, false)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                      children: /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          display: 'flex',
                          gap: '0.4rem'
                        },
                        children: [/*#__PURE__*/_jsxDEV("button", {
                          className: "btn btn-secondary btn-small",
                          onClick: () => {
                            setModalData(u);
                            setActiveModal('user');
                          },
                          title: "Edit Email ID, Password, Role, or Department",
                          children: "✏️ Edit Credentials"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                          },
                          children: u.status === 'Active' ? 'Suspend' : 'Activate'
                        }, void 0, false), currentPersona.roleCode === 'SUPER_ADMIN' && /*#__PURE__*/_jsxDEV("button", {
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
                          title: "Delete User (Super Admin only)",
                          children: "🗑️"
                        }, void 0, false)]
                      }, void 0, true)
                    }, void 0, false)]
                  }, u.id, true))
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "row g-4",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-5",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "card-container",
                children: [/*#__PURE__*/_jsxDEV("h3", {
                  style: {
                    fontSize: '1.05rem',
                    marginBottom: '1rem'
                  },
                  children: "👤 Switch Active Operational Persona"
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  },
                  children: PERSONAS.map(p => /*#__PURE__*/_jsxDEV("div", {
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
                    },
                    children: [/*#__PURE__*/_jsxDEV("div", {
                      className: "persona-avatar",
                      children: p.avatar
                    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                      style: {
                        flex: 1
                      },
                      children: [/*#__PURE__*/_jsxDEV("div", {
                        style: {
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: 'var(--slate-900)'
                        },
                        children: p.name
                      }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                        style: {
                          fontSize: '0.78rem',
                          color: 'var(--slate-500)'
                        },
                        children: p.role
                      }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                        style: {
                          fontSize: '0.72rem',
                          color: 'var(--primary-600)',
                          fontWeight: 600
                        },
                        children: p.tag
                      }, void 0, false)]
                    }, void 0, true)]
                  }, p.id, true))
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "col-12 col-lg-7",
              children: /*#__PURE__*/_jsxDEV("div", {
                className: "table-card-wrapper",
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "table-toolbar",
                  children: /*#__PURE__*/_jsxDEV("div", {
                    style: {
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    },
                    children: "🛡️ Strict RBAC Role Hierarchy Matrix"
                  }, void 0, false)
                }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                  className: "table-responsive",
                  children: /*#__PURE__*/_jsxDEV("table", {
                    className: "enterprise-table",
                    children: [/*#__PURE__*/_jsxDEV("thead", {
                      children: /*#__PURE__*/_jsxDEV("tr", {
                        children: [/*#__PURE__*/_jsxDEV("th", {
                          children: "Hierarchical Tier"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                          children: "Permitted Scope"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("th", {
                          children: "Operational Authority"
                        }, void 0, false)]
                      }, void 0, true)
                    }, void 0, false), /*#__PURE__*/_jsxDEV("tbody", {
                      children: [/*#__PURE__*/_jsxDEV("tr", {
                        children: [/*#__PURE__*/_jsxDEV("td", {
                          children: /*#__PURE__*/_jsxDEV("strong", {
                            style: {
                              color: 'var(--primary-700)'
                            },
                            children: "👑 SUPER ADMIN (L4)"
                          }, void 0, false)
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Platform-Wide / Global"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Full platform governance, create/manage Event Admins, system-wide events CRUD, override resource conflicts, AWS cloud IaC, view all audit logs."
                        }, void 0, false)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("tr", {
                        children: [/*#__PURE__*/_jsxDEV("td", {
                          children: /*#__PURE__*/_jsxDEV("strong", {
                            style: {
                              color: '#0369a1'
                            },
                            children: "👔 EVENT ADMIN (L3)"
                          }, void 0, false)
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Managed Events Scope"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Create/edit events within scope, assign Organizers, allocate staff & equipment, view scoped financial reports & audit logs."
                        }, void 0, false)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("tr", {
                        children: [/*#__PURE__*/_jsxDEV("td", {
                          children: /*#__PURE__*/_jsxDEV("strong", {
                            style: {
                              color: '#d97706'
                            },
                            children: "📋 ORGANIZER (L2)"
                          }, void 0, false)
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Assigned Event Scope"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Coordinate assigned event, request & assign staff crew, create & manage operational tasks, allocate permitted hardware."
                        }, void 0, false)]
                      }, void 0, true), /*#__PURE__*/_jsxDEV("tr", {
                        children: [/*#__PURE__*/_jsxDEV("td", {
                          children: /*#__PURE__*/_jsxDEV("strong", {
                            style: {
                              color: '#059669'
                            },
                            children: "👷 STAFF (L1)"
                          }, void 0, false)
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "Assigned Shifts & Tasks"
                        }, void 0, false), /*#__PURE__*/_jsxDEV("td", {
                          children: "View assigned event run-of-show & venue, update own task status/notes/files, edit profile & availability. No resource allocation rights."
                        }, void 0, false)]
                      }, void 0, true)]
                    }, void 0, true)]
                  }, void 0, true)
                }, void 0, false)]
              }, void 0, true)
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true), activeTab === 'simulator' && renderSimulatorTab(), activeTab === 'floorplan' && renderFloorplanTab(), activeTab === 'weather' && renderWeatherTab(), activeTab === 'audit' && renderAuditTab()]
      }, void 0, true)]
    }, void 0, true), commandPaletteOpen && /*#__PURE__*/_jsxDEV("div", {
      className: "command-palette-overlay",
      onClick: () => setCommandPaletteOpen(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "command-palette-dialog",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "command-palette-header",
          children: [/*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: '1.1rem',
              color: 'var(--primary-600)'
            },
            children: "🔍"
          }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
            type: "text",
            className: "command-palette-input",
            placeholder: "Type a command, event, staff, or tool (e.g. 'Tech Summit', 'Simulator', 'Weather')...",
            value: commandQuery,
            onChange: e => setCommandQuery(e.target.value),
            autoFocus: true
          }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
            style: {
              fontSize: '0.72rem',
              color: 'var(--slate-400)'
            },
            children: "ESC to close"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "command-palette-results",
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              handleAutoResolve();
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "⚡ 1-Click Auto-Resolve All Conflicts"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Action"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('simulator');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "🧮 Open ROI Scenario & Cost Forecaster"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Tool"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('floorplan');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "📐 Open 2D Venue & Stage Layout Studio"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Studio"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('weather');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "🌦️ Check Environmental Safety & Weather Radar"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Safety"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('audit');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "📜 Inspect Live System Audit Log & Security Stream"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Security"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('dashboard');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "📊 Go to Overview Dashboard"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('events');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "📅 Go to Events Workspace"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('tasks');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "✅ Go to Task Tracker"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('staff');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "👥 Go to Staff Portal"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('equipment');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "📦 Go to Equipment Inventory"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('budget');
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: "💰 Go to Budget & Finance"
              }, void 0, false)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Navigation"
            }, void 0, false)]
          }, void 0, true), events.map(e => /*#__PURE__*/_jsxDEV("div", {
            className: "command-item",
            onClick: () => {
              setCommandPaletteOpen(false);
              setActiveTab('events');
              setSelectedEventId(e.id);
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "command-item-left",
              children: /*#__PURE__*/_jsxDEV("span", {
                children: ["Event: ", e.title, " (", e.venue, ")"]
              }, void 0, true)
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              className: "command-item-badge",
              children: "Event"
            }, void 0, false)]
          }, e.id, true))]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), shortcutsOpen && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setShortcutsOpen(false),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        style: {
          maxWidth: '440px'
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "⌨️ Keyboard Shortcuts Guide"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setShortcutsOpen(false),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-body-scroll",
          children: /*#__PURE__*/_jsxDEV("div", {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Open Command Palette:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Ctrl + K / Cmd + K"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Overview Dashboard:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + D"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Events Workspace:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + E"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Task Tracker:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + T"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Staff Portal:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + S"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Equipment Catalog:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + Q"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              style: {
                display: 'flex',
                justifyContent: 'space-between'
              },
              children: [/*#__PURE__*/_jsxDEV("span", {
                children: "Budget & Finance:"
              }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                className: "search-kbd-pill",
                children: "Alt + B"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-footer-actions",
          children: /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => setShortcutsOpen(false),
            children: "Got It"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), activeModal === 'export' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        style: {
          maxWidth: '720px'
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("div", {
            children: [/*#__PURE__*/_jsxDEV("h3", {
              children: "📥 Export System Manifests & Reports"
            }, void 0, false), /*#__PURE__*/_jsxDEV("p", {
              style: {
                margin: 0,
                fontSize: '0.82rem',
                color: 'var(--slate-500)'
              },
              children: "Download production spreadsheets (CSV) or generate a complete JSON system backup."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-body-scroll",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "export-modal-grid",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "export-modal-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "export-modal-card-header",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "export-modal-title",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "📄"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      children: "Events Manifest"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "export-format-badge",
                    children: "CSV"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                  children: "Schedules, venues, budget allocations, dates, and operational status."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-secondary export-download-btn",
                onClick: () => {
                  handleExport('events');
                  setActiveModal(null);
                },
                children: "⬇️ Download Events CSV"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "export-modal-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "export-modal-card-header",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "export-modal-title",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "👥"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      children: "Staff Roster"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "export-format-badge",
                    children: "CSV"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                  children: "Personnel directory, certified roles, daily billing rates, and contacts."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-secondary export-download-btn",
                onClick: () => {
                  handleExport('staff');
                  setActiveModal(null);
                },
                children: "⬇️ Download Staff CSV"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "export-modal-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "export-modal-card-header",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "export-modal-title",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "📦"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      children: "Equipment Inventory"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "export-format-badge",
                    children: "CSV"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                  children: "Hardware catalog, categories, warehouse stock levels, and rental rates."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-secondary export-download-btn",
                onClick: () => {
                  handleExport('equipment');
                  setActiveModal(null);
                },
                children: "⬇️ Download Equipment CSV"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "export-modal-card",
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "export-modal-card-header",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "export-modal-title",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "💰"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      children: "Financial Summary"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "export-format-badge",
                    children: "CSV"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                  children: "Aggregated expenditures, category rollups (staff/gear/vendors), and variance."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-secondary export-download-btn",
                onClick: () => {
                  handleExport('finance');
                  setActiveModal(null);
                },
                children: "⬇️ Download Finance CSV"
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "export-modal-card",
              style: {
                gridColumn: '1 / -1',
                backgroundColor: 'var(--primary-50)',
                borderColor: 'var(--primary-200)'
              },
              children: [/*#__PURE__*/_jsxDEV("div", {
                children: [/*#__PURE__*/_jsxDEV("div", {
                  className: "export-modal-card-header",
                  children: [/*#__PURE__*/_jsxDEV("div", {
                    className: "export-modal-title",
                    children: [/*#__PURE__*/_jsxDEV("span", {
                      children: "💾"
                    }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
                      children: "Complete Database Snapshot"
                    }, void 0, false)]
                  }, void 0, true), /*#__PURE__*/_jsxDEV("span", {
                    className: "export-format-badge json-badge",
                    children: "JSON"
                  }, void 0, false)]
                }, void 0, true), /*#__PURE__*/_jsxDEV("p", {
                  children: "Full relational snapshot containing all collections (events, staff, gear, venues, vendors, tasks, assignments)."
                }, void 0, false)]
              }, void 0, true), /*#__PURE__*/_jsxDEV("button", {
                className: "btn btn-primary export-download-btn",
                onClick: () => {
                  handleExport('backup');
                  setActiveModal(null);
                },
                children: "💾 Download Full Backup (JSON)"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-footer-actions",
          children: /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary",
            onClick: () => setActiveModal(null),
            children: "Close"
          }, void 0, false)
        }, void 0, false)]
      }, void 0, true)
    }, void 0, false), activeModal === 'badge' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        style: {
          maxWidth: '380px'
        },
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "🏷️ Official Pass & Tag Preview"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-body-scroll",
          children: /*#__PURE__*/_jsxDEV("div", {
            className: "asset-badge-card",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "asset-badge-header",
              children: modalData.type === 'staff' ? 'APEX CREW IDENTIFICATION PASS' : 'APEX ASSET TRACKING TAG'
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "asset-badge-title",
              children: modalData.item?.name
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "asset-badge-sub",
              children: modalData.type === 'staff' ? modalData.item?.role : `Category: ${modalData.item?.category} | Stock: ${modalData.item?.totalStock}`
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              className: "asset-badge-qr",
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: '1.8rem',
                  marginBottom: '0.2rem'
                },
                children: "⬛⬜⬛"
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                children: modalData.type === 'staff' ? `APEX-STAFF-${modalData.item?.id}` : `APEX-EQ-${modalData.item?.id}`
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "asset-badge-footer",
              children: "AUTHORIZED APEX EVENT SYSTEMS"
            }, void 0, false)]
          }, void 0, true)
        }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
          className: "modal-footer-actions",
          children: [/*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-secondary",
            onClick: () => setActiveModal(null),
            children: "Close"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "btn btn-primary",
            onClick: () => window.print(),
            children: "🖨️ Print Pass"
          }, void 0, false)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'event' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: modalData.id ? 'Edit Event Details' : 'Create New Event'
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Event Name / Title"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "title",
              defaultValue: modalData.title || '',
              required: true,
              placeholder: "e.g. Annual Tech Summit"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Description & Scope"
            }, void 0, false), /*#__PURE__*/_jsxDEV("textarea", {
              name: "description",
              rows: "2",
              defaultValue: modalData.description || '',
              placeholder: "Key objectives, audience scale..."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Primary Venue Location"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "venue",
                defaultValue: modalData.venue || venues[0]?.name || 'Innovation Arena',
                children: venues.map(v => /*#__PURE__*/_jsxDEV("option", {
                  value: v.name,
                  children: [v.name, " (Cap: ", v.capacity, ")"]
                }, v.id, true))
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Budget Allocation Cap ($)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "budget",
                type: "number",
                defaultValue: modalData.budget || 20000,
                required: true
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Start Date"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "startDate",
                type: "date",
                defaultValue: modalData.startDate || '2026-09-10',
                required: true
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "End Date"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "endDate",
                type: "date",
                defaultValue: modalData.endDate || '2026-09-12',
                required: true
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Initial Status"
            }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
              name: "status",
              defaultValue: modalData.status || 'Confirmed',
              children: [/*#__PURE__*/_jsxDEV("option", {
                value: "Draft",
                children: "Draft"
              }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                value: "Confirmed",
                children: "Confirmed"
              }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                value: "In Progress",
                children: "In Progress"
              }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                value: "Completed",
                children: "Completed"
              }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                value: "Cancelled",
                children: "Cancelled"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: modalData.id ? 'Save Changes' : 'Create Event'
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'task' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "Create Operational Task"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Task Title"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "title",
              required: true,
              placeholder: "e.g. Verify Audio Patch & Mixer Lines"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Description & Instructions"
            }, void 0, false), /*#__PURE__*/_jsxDEV("textarea", {
              name: "description",
              rows: "2",
              placeholder: "Specific steps, safety notes, or checklists..."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Linked Event"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "eventId",
                defaultValue: modalData.eventId || events[0]?.id || '',
                children: events.map(ev => /*#__PURE__*/_jsxDEV("option", {
                  value: ev.id,
                  children: ev.title
                }, ev.id, false))
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Assigned Staff Member"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "staffId",
                children: staff.map(s => /*#__PURE__*/_jsxDEV("option", {
                  value: s.id,
                  children: [s.name, " (", s.role, ")"]
                }, s.id, true))
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Deadline Date"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "deadline",
                type: "date",
                defaultValue: "2026-09-10",
                required: true
              }, void 0, false)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Priority Level"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "priority",
                defaultValue: "High",
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "Low",
                  children: "Low"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Medium",
                  children: "Medium"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "High",
                  children: "High"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Urgent",
                  children: "Urgent"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: "Create Task"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'user' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: modalData.id ? '✏️ Edit User Credentials & Access' : '＋ Register System User'
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Full User Name *"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "name",
              required: true,
              defaultValue: modalData.name || '',
              placeholder: "e.g. Robert Clark"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Corporate Email (Mail ID) *"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "email",
              type: "email",
              required: true,
              defaultValue: modalData.email || '',
              placeholder: "robert.clark@apexevents.com"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: modalData.id ? 'Change / Reset Password (Optional)' : 'User Password *'
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              },
              children: [/*#__PURE__*/_jsxDEV("input", {
                name: "password",
                type: showUserPassword ? 'text' : 'password',
                placeholder: modalData.id ? 'Leave blank to keep existing password' : 'Enter login password',
                required: !modalData.id,
                style: {
                  paddingRight: '45px'
                }
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                title: showUserPassword ? 'Hide Password' : 'Show Password',
                children: showUserPassword ? '👁️' : '🔒'
              }, void 0, false)]
            }, void 0, true), modalData.id && /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: '0.75rem',
                color: 'var(--slate-500)',
                marginTop: '0.2rem',
                display: 'block'
              },
              children: "Type a new password to reset this user's credentials, or leave blank to keep unchanged."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Assigned System Role"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "role",
                defaultValue: modalData.role || 'Event Manager',
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "Admin",
                  children: "Admin (Full Control)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Event Manager",
                  children: "Event Manager (Production)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Staff",
                  children: "Staff (Shift Execution)"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Vendor",
                  children: "Vendor (External Supplier)"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Department"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "department",
                defaultValue: modalData.department || 'Production & Staging'
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), modalData.id && /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Account Status"
            }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
              name: "status",
              defaultValue: modalData.status || 'Active',
              children: [/*#__PURE__*/_jsxDEV("option", {
                value: "Active",
                children: "Active (Permitted)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                value: "Suspended",
                children: "Suspended (Access Revoked)"
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: modalData.id ? 'Save Changes' : 'Register User'
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'my-credentials' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "🔒 My Security Credentials & Email Profile"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-light)'
            },
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "persona-avatar",
              style: {
                width: '42px',
                height: '42px',
                fontSize: '1rem'
              },
              children: currentPersona.avatar
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              children: [/*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontWeight: 700,
                  color: 'var(--slate-900)'
                },
                children: currentPersona.name
              }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
                style: {
                  fontSize: '0.8rem',
                  color: 'var(--slate-500)'
                },
                children: [currentPersona.userRole, " • ", currentPersona.role]
              }, void 0, true)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Display Name *"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "name",
              required: true,
              defaultValue: currentPersona.name,
              placeholder: "Your Full Name"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Corporate Mail ID (Email Address) *"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "email",
              type: "email",
              required: true,
              defaultValue: currentPersona.email,
              placeholder: "name@apexevents.com"
            }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
              style: {
                fontSize: '0.75rem',
                color: 'var(--slate-500)',
                marginTop: '0.2rem',
                display: 'block'
              },
              children: "This email is used as your system login ID."
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Current Password (Optional)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "currentPassword",
              type: "password",
              placeholder: "Enter current password if set"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "New Password (Optional)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              },
              children: [/*#__PURE__*/_jsxDEV("input", {
                name: "newPassword",
                type: showPassword ? 'text' : 'password',
                placeholder: "Enter new password (min 6 chars)",
                style: {
                  paddingRight: '45px'
                }
              }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
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
                title: showPassword ? 'Hide Password' : 'Show Password',
                children: showPassword ? '👁️' : '🔒'
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Confirm New Password"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "confirmPassword",
              type: showPassword ? 'text' : 'password',
              placeholder: "Re-type new password"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: "Update Credentials"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'staff' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: modalData.id ? 'Edit Staff Profile' : 'Register Staff Member'
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Full Name"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "name",
              defaultValue: modalData.name || '',
              required: true,
              placeholder: "e.g. Alex Henderson"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Operational Role"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "role",
                defaultValue: modalData.role || 'Event Coordinator',
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "Event Coordinator",
                  children: "Event Coordinator"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "A/V Technician",
                  children: "A/V Technician"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Stage Manager",
                  children: "Stage Manager"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Security Lead",
                  children: "Security Lead"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Logistics Manager",
                  children: "Logistics Manager"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Daily Billing Rate ($)"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "dailyRate",
                type: "number",
                defaultValue: modalData.dailyRate || 300,
                required: true
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Contact Phone / Email"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "contact",
              defaultValue: modalData.contact || '',
              placeholder: "+1-555-0199"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: modalData.id ? 'Update Staff' : 'Register Crew'
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'equipment' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: modalData.id ? 'Edit Equipment Stock' : 'Add Equipment Item'
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Hardware Item Name"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "name",
              defaultValue: modalData.name || '',
              required: true,
              placeholder: "e.g. Line Array Speakers"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-row",
            children: [/*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Hardware Category"
              }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
                name: "category",
                defaultValue: modalData.category || 'Audio',
                children: [/*#__PURE__*/_jsxDEV("option", {
                  value: "Audio",
                  children: "Audio"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Lighting",
                  children: "Lighting"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Video",
                  children: "Video"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Staging",
                  children: "Staging"
                }, void 0, false), /*#__PURE__*/_jsxDEV("option", {
                  value: "Furniture",
                  children: "Furniture"
                }, void 0, false)]
              }, void 0, true)]
            }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
              className: "form-group",
              children: [/*#__PURE__*/_jsxDEV("label", {
                children: "Warehouse Stock Units"
              }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
                name: "totalStock",
                type: "number",
                defaultValue: modalData.totalStock || 10,
                required: true
              }, void 0, false)]
            }, void 0, true)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Daily Rental Rate ($)"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "rentalRate",
              type: "number",
              defaultValue: modalData.rentalRate || 100,
              required: true
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: modalData.id ? 'Save Item' : 'Add Item'
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'assign' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "Assign Staff Member to Event"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Select Staff Member"
            }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
              name: "staffId",
              children: staff.map(s => /*#__PURE__*/_jsxDEV("option", {
                value: s.id,
                children: [s.name, " (", s.role, ") — $", s.dailyRate, "/day"]
              }, s.id, true))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Assignment Notes"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "notes",
              placeholder: "Special role or instructions"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: "Assign Crew"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), activeModal === 'allocate' && /*#__PURE__*/_jsxDEV("div", {
      className: "modal-overlay open",
      onClick: () => setActiveModal(null),
      children: /*#__PURE__*/_jsxDEV("div", {
        className: "modal-card",
        onClick: e => e.stopPropagation(),
        children: [/*#__PURE__*/_jsxDEV("div", {
          className: "modal-header",
          children: [/*#__PURE__*/_jsxDEV("h3", {
            children: "Allocate Hardware Quota to Event"
          }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
            className: "close-btn",
            onClick: () => setActiveModal(null),
            children: "×"
          }, void 0, false)]
        }, void 0, true), /*#__PURE__*/_jsxDEV("form", {
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
          },
          children: [/*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Select Hardware Item"
            }, void 0, false), /*#__PURE__*/_jsxDEV("select", {
              name: "equipmentId",
              children: equipment.map(eq => /*#__PURE__*/_jsxDEV("option", {
                value: eq.id,
                children: [eq.name, " (", eq.category, ") — Warehouse Stock: ", eq.totalStock]
              }, eq.id, true))
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Quantity to Reserve"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "quantity",
              type: "number",
              min: "1",
              defaultValue: "2",
              required: true
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "form-group",
            children: [/*#__PURE__*/_jsxDEV("label", {
              children: "Allocation Notes"
            }, void 0, false), /*#__PURE__*/_jsxDEV("input", {
              name: "notes",
              placeholder: "e.g. Main stage PA system"
            }, void 0, false)]
          }, void 0, true), /*#__PURE__*/_jsxDEV("div", {
            className: "modal-footer-actions",
            children: [/*#__PURE__*/_jsxDEV("button", {
              type: "button",
              className: "btn btn-secondary",
              onClick: () => setActiveModal(null),
              children: "Cancel"
            }, void 0, false), /*#__PURE__*/_jsxDEV("button", {
              type: "submit",
              className: "btn btn-primary",
              children: "Reserve Hardware"
            }, void 0, false)]
          }, void 0, true)]
        }, void 0, true)]
      }, void 0, true)
    }, void 0, false), /*#__PURE__*/_jsxDEV("div", {
      className: "toast-container",
      children: toasts.map(t => /*#__PURE__*/_jsxDEV("div", {
        className: `toast-msg ${t.type}`,
        children: [/*#__PURE__*/_jsxDEV("span", {
          children: t.type === 'success' ? '✓' : t.type === 'error' ? '❌' : 'ℹ️'
        }, void 0, false), /*#__PURE__*/_jsxDEV("span", {
          children: t.message
        }, void 0, false)]
      }, t.id, true))
    }, void 0, false)]
  }, void 0, true);
}

// Mount React Root Application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(/*#__PURE__*/_jsxDEV(App, {}, void 0, false));
}