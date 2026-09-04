const express = require('express');
const router = express.Router();
const { getConflictsReport, autoResolveConflicts } = require('../services/conflictEngine');

// GET full conflicts report
router.get('/', (req, res) => {
  res.json(getConflictsReport());
});

// POST 1-click smart conflict auto-resolution
router.post('/auto-resolve', (req, res) => {
  const result = autoResolveConflicts();
  res.json(result);
});

module.exports = router;
