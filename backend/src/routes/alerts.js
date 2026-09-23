const express = require('express');
const router = express.Router();
const AlertService = require('../services/AlertService');

// POST /api/alerts/sms - Dispatches SMS alert to disaster authorities
router.post('/sms', async (req, res) => {
  try {
    const payload = req.body;
    const result = await AlertService.sendEmergencyAlert(payload);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('[Alerts Route Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to dispatch alert'
    });
  }
});

module.exports = router;
