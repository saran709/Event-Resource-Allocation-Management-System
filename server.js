const express = require('express');
const path = require('path');
const db = require('./db');

const authRouter = require('./routes/auth.routes');
const eventsRouter = require('./routes/events.routes');
const staffRouter = require('./routes/staff.routes');
const equipmentRouter = require('./routes/equipment.routes');
const venuesRouter = require('./routes/venues.routes');
const vendorsRouter = require('./routes/vendors.routes');
const budgetRouter = require('./routes/budget.routes');
const conflictsRouter = require('./routes/conflicts.routes');
const awsRouter = require('./routes/aws.routes');
const exportRouter = require('./routes/export.routes');
const notificationsRouter = require('./routes/notifications.routes');
const reportsRouter = require('./routes/reports.routes');
const tasksRouter = require('./routes/tasks.routes');
const usersRouter = require('./routes/users.routes');
const auditRouter = require('./routes/audit.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route opens the Client Landing Page first
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Operations Dashboard & Workspace routes
app.get(['/app', '/admin', '/dashboard', '/workspace', '/console'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Client landing portal aliases
app.get(['/client', '/landing', '/portal'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Static assets (CSS, JS, JSX) with index disabled so '/' explicitly serves landing.html
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/staff', staffRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/conflicts', conflictsRouter);
app.use('/api/aws', awsRouter);
app.use('/api/export', exportRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
app.use('/api/audit', auditRouter);

app.get('/api/assignments', (req, res) => {
  const assignments = db.read('assignments');
  const staff = db.read('staff');
  const events = db.read('events');
  res.json(assignments.map(a => ({
    ...a,
    staff: staff.find(s => s.id === a.staffId),
    event: events.find(e => e.id === a.eventId)
  })));
});

app.post('/api/assignments', (req, res) => {
  const { eventId, staffId, role, notes } = req.body;
  if (!eventId || !staffId) return res.status(400).json({ error: 'Missing parameters' });
  const ev = db.getById('events', eventId);
  const st = db.getById('staff', staffId);
  if (!ev || !st) return res.status(404).json({ error: 'Event or Staff not found' });
  res.status(201).json(db.insert('assignments', { eventId, staffId, role: role || st.role, notes: notes || '' }));
});

app.delete('/api/assignments/:id', (req, res) => {
  if (db.delete('assignments', req.params.id)) res.json({ message: 'Assignment removed' });
  else res.status(404).json({ error: 'Assignment not found' });
});

app.get('/api/allocations', (req, res) => {
  const allocations = db.read('allocations');
  const equipment = db.read('equipment');
  const events = db.read('events');
  res.json(allocations.map(al => ({
    ...al,
    equipment: equipment.find(eq => eq.id === al.equipmentId),
    event: events.find(ev => ev.id === al.eventId)
  })));
});

app.post('/api/allocations', (req, res) => {
  const { eventId, equipmentId, quantity, notes } = req.body;
  if (!eventId || !equipmentId || !quantity) return res.status(400).json({ error: 'Missing parameters' });
  const ev = db.getById('events', eventId);
  const eq = db.getById('equipment', equipmentId);
  if (!ev || !eq) return res.status(404).json({ error: 'Event or Equipment not found' });
  res.status(201).json(db.insert('allocations', { eventId, equipmentId, quantity: Number(quantity), notes: notes || '' }));
});

app.delete('/api/allocations/:id', (req, res) => {
  if (db.delete('allocations', req.params.id)) res.json({ message: 'Allocation removed' });
  else res.status(404).json({ error: 'Allocation not found' });
});

app.get('/api/coordinations', (req, res) => {
  const coordinations = db.read('coordinations');
  const vendors = db.read('vendors');
  const events = db.read('events');
  res.json(coordinations.map(c => ({
    ...c,
    vendor: vendors.find(v => v.id === c.vendorId),
    event: events.find(ev => ev.id === c.eventId)
  })));
});

app.post('/api/coordinations', (req, res) => {
  const { eventId, vendorId, cost, details, paymentStatus } = req.body;
  if (!eventId || !vendorId || !cost) return res.status(400).json({ error: 'Missing parameters' });
  const ev = db.getById('events', eventId);
  const ve = db.getById('vendors', vendorId);
  if (!ev || !ve) return res.status(404).json({ error: 'Event or Vendor not found' });
  res.status(201).json(db.insert('coordinations', { eventId, vendorId, cost: Number(cost), details: details || '', paymentStatus: paymentStatus || 'Unpaid' }));
});

app.delete('/api/coordinations/:id', (req, res) => {
  if (db.delete('coordinations', req.params.id)) res.json({ message: 'Vendor coordination removed' });
  else res.status(404).json({ error: 'Coordination not found' });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint Not Found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error('Unhandled API Exception:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

let serverInstance = null;
if (!process.env.VERCEL) {
  serverInstance = app.listen(PORT, () => {
    console.log(`🚀 APEX Modular Server running on port ${PORT}`);
  });
}

module.exports = app;
if (serverInstance) {
  module.exports.server = serverInstance;
  module.exports.close = (cb) => serverInstance.close(cb);
}
