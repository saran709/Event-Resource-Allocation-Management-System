const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const _cache = {};

function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const collections = {
    events: [
      {
        id: "ev1",
        title: "Tech Summit 2026",
        description: "Annual technology exhibition and speaker series covering AI and Cloud trends.",
        venue: "Grand Exhibition Hall",
        startDate: "2026-09-10",
        endDate: "2026-09-12",
        budget: 25000,
        status: "Confirmed"
      },
      {
        id: "ev2",
        title: "Annual Charity Gala",
        description: "Elegant dinner, charity auction, and networking fundraiser.",
        venue: "Plaza Ballroom",
        startDate: "2026-09-15",
        endDate: "2026-09-16",
        budget: 15000,
        status: "Confirmed"
      },
      {
        id: "ev3",
        title: "Summer Music Festival",
        description: "Two days of live music, outdoor food trucks, and art exhibits.",
        venue: "Outdoor Arena",
        startDate: "2026-09-10",
        endDate: "2026-09-11",
        budget: 40000,
        status: "Draft"
      }
    ],
    staff: [
      { id: "st1", name: "Alice Vance", role: "Event Coordinator", contact: "+1-555-0199", dailyRate: 300 },
      { id: "st2", name: "Bob Miller", role: "A/V Technician", contact: "+1-555-0142", dailyRate: 250 },
      { id: "st3", name: "Charlie Green", role: "Stage Manager", contact: "+1-555-0187", dailyRate: 280 },
      { id: "st4", name: "Diana Prince", role: "Security Lead", contact: "+1-555-0111", dailyRate: 220 },
      { id: "st5", name: "Ethan Hunt", role: "Operations Specialist", contact: "+1-555-0107", dailyRate: 350 }
    ],
    equipment: [
      { id: "eq1", name: "Sound System Array", category: "Audio", totalStock: 5, rentalRate: 150 },
      { id: "eq2", name: "Stage Lighting Kit", category: "Lighting", totalStock: 8, rentalRate: 100 },
      { id: "eq3", name: "UHD Projector 10K", category: "Video", totalStock: 4, rentalRate: 200 },
      { id: "eq4", name: "Wireless Microphone Set", category: "Audio", totalStock: 15, rentalRate: 30 },
      { id: "eq5", name: "Foldable Event Chairs", category: "Furniture", totalStock: 200, rentalRate: 2 },
      { id: "eq6", name: "Stage Platforms", category: "Infrastructure", totalStock: 10, rentalRate: 50 }
    ],
    vendors: [
      { id: "ve1", name: "Premier Catering Services", category: "Catering", contact: "John Chef", email: "john@premiercatering.com" },
      { id: "ve2", name: "Sound & Light Masters", category: "AV & Production", contact: "Sarah Spark", email: "contact@slmasters.com" },
      { id: "ve3", name: "Elite Decor & Florals", category: "Decor & Design", contact: "Marcus Bloom", email: "info@elitedecor.com" },
      { id: "ve4", name: "SafeGuard Security", category: "Security", contact: "Frank Guard", email: "frank@safeguard.com" }
    ],
    assignments: [
      { id: "as1", eventId: "ev1", staffId: "st1", role: "Lead Event Coordinator", notes: "Handling main track scheduling" },
      { id: "as2", eventId: "ev1", staffId: "st2", role: "A/V Assistant", notes: "Assigned to Stage A" },
      { id: "as3", eventId: "ev2", staffId: "st1", role: "Guest Relations Coordinator", notes: "Gala welcoming desk" },
      { id: "as4", eventId: "ev2", staffId: "st3", role: "Stage Manager", notes: "Overseeing auctions timeline" }
    ],
    allocations: [
      { id: "al1", eventId: "ev1", equipmentId: "eq1", quantity: 3, notes: "Stages A and B" },
      { id: "al2", eventId: "ev1", equipmentId: "eq2", quantity: 4, notes: "Ambient stage lighting" },
      { id: "al3", eventId: "ev1", equipmentId: "eq6", quantity: 4, notes: "Main presentation platform" },
      { id: "al4", eventId: "ev2", equipmentId: "eq2", quantity: 2, notes: "Spotlighting auction table" },
      { id: "al5", eventId: "ev2", equipmentId: "eq5", quantity: 150, notes: "Ballroom round tables" }
    ],
    coordinations: [
      { id: "co1", eventId: "ev1", vendorId: "ve1", cost: 6500, details: "Buffet lunch for 3 days, coffee breaks", paymentStatus: "Partially Paid" },
      { id: "co2", eventId: "ev1", vendorId: "ve2", cost: 4500, details: "A/V technician standby and backup mixers", paymentStatus: "Unpaid" },
      { id: "co3", eventId: "ev2", vendorId: "ve1", cost: 8000, details: "Premium 3-course plated dinner, open bar", paymentStatus: "Paid" },
      { id: "co4", eventId: "ev2", vendorId: "ve3", cost: 3500, details: "Floral table arrangements and red carpet styling", paymentStatus: "Paid" }
    ],
    venues: [
      { id: "vn1", name: "Grand Ballroom", capacity: 500, amenities: "A/V Stage, Catering Prep, High-speed Wifi", pricing: 2500 },
      { id: "vn2", name: "Meeting Room A", capacity: 40, amenities: "UHD Screen, Whiteboard, Video Conference System", pricing: 400 },
      { id: "vn3", name: "Outdoor Plaza Arena", capacity: 1000, amenities: "Tent Hookups, High-power Outlets, Security Fence", pricing: 3500 }
    ],
    tasks: [
      {
        id: "tk1",
        eventId: "ev1",
        staffId: "st1",
        title: "Coordinate Keynote Speakers",
        description: "Verify presentation decks and wireless lapel mics before 09:00 AM.",
        deadline: "2026-09-10",
        priority: "High",
        status: "In-Progress",
        completionNotes: ""
      },
      {
        id: "tk2",
        eventId: "ev1",
        staffId: "st2",
        title: "Main Stage A/V Soundcheck",
        description: "Run frequency calibration on sound system array and stage lighting.",
        deadline: "2026-09-09",
        priority: "High",
        status: "Pending",
        completionNotes: ""
      },
      {
        id: "tk3",
        eventId: "ev2",
        staffId: "st3",
        title: "Auction Stage Setup",
        description: "Position podium spotlighting and auction catalog displays.",
        deadline: "2026-09-14",
        priority: "Medium",
        status: "Pending",
        completionNotes: ""
      }
    ],
    users: [
      {
        id: "usr1",
        name: "Sarah Miller",
        email: "sarah.manager@apexevents.com",
        password: "password123",
        role: "Admin",
        department: "Executive Operations",
        status: "Active",
        lastLogin: "2026-09-04T08:30:00Z"
      },
      {
        id: "usr2",
        name: "James Vance",
        email: "james.coord@apexevents.com",
        password: "password123",
        role: "Event Manager",
        department: "Production & Staging",
        status: "Active",
        lastLogin: "2026-09-04T07:45:00Z"
      },
      {
        id: "usr3",
        name: "Maria Garcia",
        email: "maria.tech@apexevents.com",
        password: "password123",
        role: "Staff",
        department: "Logistics & Hardware",
        status: "Active",
        lastLogin: "2026-09-03T16:20:00Z"
      },
      {
        id: "usr4",
        name: "David Kim",
        email: "david.finance@apexevents.com",
        password: "password123",
        role: "Admin",
        department: "Finance & Audit",
        status: "Active",
        lastLogin: "2026-09-04T09:10:00Z"
      },
      {
        id: "usr5",
        name: "Lisa Patel",
        email: "lisa.vendor@apexevents.com",
        password: "password123",
        role: "Vendor",
        department: "Supplier Partnerships",
        status: "Active",
        lastLogin: "2026-09-02T14:15:00Z"
      }
    ]
  };

  for (const [key, val] of Object.entries(collections)) {
    const filePath = path.join(DATA_DIR, `${key}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(val, null, 2), 'utf-8');
    }
  }

  const deprecated = ['documents.json', 'logs.json', 'integrations.json'];
  deprecated.forEach(file => {
    const depPath = path.join(DATA_DIR, file);
    if (fs.existsSync(depPath)) fs.unlinkSync(depPath);
  });
}

function warmCache() {
  if (fs.existsSync(DATA_DIR)) {
    const files = fs.readdirSync(DATA_DIR);
    files.forEach(f => {
      if (f.endsWith('.json')) {
        const name = f.replace('.json', '');
        try {
          const raw = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
          _cache[name] = JSON.parse(raw);
        } catch (e) {
          _cache[name] = [];
        }
      }
    });
  }
}

initializeDatabase();
warmCache();

const db = {
  read(collection) {
    if (_cache[collection]) {
      return _cache[collection];
    }
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      _cache[collection] = JSON.parse(data);
      return _cache[collection];
    } catch (e) {
      _cache[collection] = [];
      return _cache[collection];
    }
  },

  write(collection, data) {
    _cache[collection] = data;
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    const tempPath = `${filePath}.tmp`;
    try {
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, filePath);
      return true;
    } catch (e) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`Error writing database collection ${collection}:`, e);
      return false;
    }
  },

  getById(collection, id) {
    const items = this.read(collection);
    return items.find(item => item.id === id);
  },

  insert(collection, item) {
    const items = this.read(collection);
    if (!item.id) {
      item.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    }
    items.push(item);
    this.write(collection, items);
    return item;
  },

  update(collection, id, updatedData) {
    const items = this.read(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updatedData, id };
    this.write(collection, items);
    return items[index];
  },

  delete(collection, id) {
    const items = this.read(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    this.write(collection, items);
    return true;
  }
};

module.exports = db;
