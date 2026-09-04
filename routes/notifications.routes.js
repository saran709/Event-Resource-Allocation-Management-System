const express = require('express');
const router = express.Router();
const { getNotifications, sendNotification } = require('../services/notificationService');

// GET all in-app notifications
router.get('/', (req, res) => {
  res.json(getNotifications());
});

// POST dispatch new notification & trigger email
router.post('/', (req, res) => {
  const { title, message, type, userId } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }
  const notif = sendNotification({ title, message, type, userId });
  res.status(201).json(notif);
});

module.exports = router;
