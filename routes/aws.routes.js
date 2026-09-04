const express = require('express');
const router = express.Router();
const { generateCloudFormationTemplate, calculateEstimatedMonthlyCost } = require('../services/awsEngine');
const { ROLES } = require('../services/rbac');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);
// Restrict Cloud & System Configuration to Super Admin only
router.use(requireRole(ROLES.SUPER_ADMIN));

router.get('/status', (req, res) => {
  res.json({
    status: 'HEALTHY',
    region: 'us-east-1',
    services: {
      ecs: 'RUNNING (2 Tasks)',
      rds: 'AVAILABLE (PostgreSQL)',
      alb: 'ACTIVE',
      s3: 'SYNCED',
      cloudwatch: 'STREAMING'
    }
  });
});

router.all(['/template', '/cloudformation'], (req, res) => {
  const params = { ...(req.query || {}), ...(req.body || {}) };
  const template = generateCloudFormationTemplate(params);
  res.json({ template, status: 'Generated' });
});

router.all(['/estimate-cost', '/cost-estimate'], (req, res) => {
  const params = { ...(req.query || {}), ...(req.body || {}) };
  const estimate = calculateEstimatedMonthlyCost(params);
  res.json(estimate);
});

module.exports = router;
