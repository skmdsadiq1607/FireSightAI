const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.get('/high-risk', eventController.getHighRiskEvents);
router.get('/persistent', eventController.getPersistentEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/analyze', eventController.analyzeEvent);
router.get('/:id/satellite', eventController.getSatelliteContext);
router.get('/:id/history', eventController.getEventHistory);
router.post('/:id/directive', eventController.getGroqDirective);

module.exports = router;
