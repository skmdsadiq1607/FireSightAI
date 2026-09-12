const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');

router.get('/status', monitoringController.getStatus);
router.post('/trigger', monitoringController.triggerIngestion);

module.exports = router;
