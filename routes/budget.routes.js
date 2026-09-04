const express = require('express');
const router = express.Router();
const db = require('../db');
const { calculateEventCosts, getOverallFinancialAnalytics } = require('../services/budgetEngine');

// GET overall analytics overview
router.get('/analytics', (req, res) => {
  const analytics = getOverallFinancialAnalytics();
  res.json(analytics);
});

// GET cost details for a specific event
router.get('/events/:id', (req, res) => {
  const ev = db.getById('events', req.params.id);
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const costs = calculateEventCosts(ev);
  res.json(costs);
});

module.exports = router;
