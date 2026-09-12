const express = require('express');
const router = express.Router();
const IngestionPipeline = require('../services/IngestionPipeline');

router.post('/firms', async (req, res) => {
  try {
    const pipeline = new IngestionPipeline(process.env.DATA_MODE || 'demo');
    const result = await pipeline.runPipeline(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
