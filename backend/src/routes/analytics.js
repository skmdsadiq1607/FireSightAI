const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverviewStats);
router.get('/timeline', analyticsController.getTimeline);
router.get('/classifications', analyticsController.getClassificationBreakdown);
router.get('/risk', analyticsController.getRiskDistribution);
router.get('/facilities', analyticsController.getTopFacilities);

module.exports = router;
