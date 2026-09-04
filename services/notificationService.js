// Notification Service (In-App Notifications & AWS SES Email Dispatcher)
const db = require('../db');
const awsConfig = require('../config/aws.config');

function getNotifications(userId = null) {
  const notifications = db.read('notifications') || [
    { id: 'n1', title: 'Schedule Alert', message: 'Alice Vance has an overlapping assignment on Sep 10.', type: 'Warning', isRead: false, createdAt: new Date().toISOString() },
    { id: 'n2', title: 'Stock Alert', message: 'Sound System Array exceeds warehouse stock by 2 units.', type: 'Danger', isRead: false, createdAt: new Date().toISOString() },
    { id: 'n3', title: 'PO Approved', message: 'PO-2026-081 approved for Tech Summit 2026.', type: 'Success', isRead: true, createdAt: new Date().toISOString() }
  ];
  return notifications;
}

function sendNotification({ userId, title, message, type = 'Info' }) {
  const notifications = db.read('notifications') || [];
  const newNotif = {
    id: `notif-${Date.now()}`,
    userId: userId || 'all',
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(newNotif);
  db.write('notifications', notifications);

  // AWS SES Email Simulation Log
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[AWS SES] Dispatched email from ${awsConfig.ses.senderEmail} -> "${title}": ${message}`);
  }

  return newNotif;
}

module.exports = {
  getNotifications,
  sendNotification
};
