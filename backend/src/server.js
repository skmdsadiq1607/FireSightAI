const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const eventRoutes = require('./routes/events');
const facilityRoutes = require('./routes/facilities');
const analyticsRoutes = require('./routes/analytics');
const monitoringRoutes = require('./routes/monitoring');
const configRoutes = require('./routes/config');
const ingestionRoutes = require('./routes/ingestion');
const IngestionPipeline = require('./services/IngestionPipeline');
const Facility = require('./models/Facility');
const ThermalEvent = require('./models/ThermalEvent');
const { DemoOSMProvider } = require('./services/dataProviders/OSMProvider');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting (Protects APIs during evaluation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'FireSight AI Core Gateway',
    version: '1.0.0',
    dataMode: process.env.DATA_MODE || 'demo',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mount
app.use('/api/events', eventRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/config', configRoutes);
app.use('/api/ingestion', ingestionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start Server and Schedule Background Ingestion
const startServer = async () => {
  await connectDB();

  // Auto-seed initial facilities and events if database is fresh
  try {
    const facilityCount = await Facility.countDocuments();
    if (facilityCount === 0) {
      console.log('[Bootstrap] Initializing industrial facilities register...');
      const demoOsm = new DemoOSMProvider();
      const demoFacilities = await demoOsm.fetchIndustrialFeatures();
      await Facility.insertMany(demoFacilities);
      console.log(`[Bootstrap] Registered ${demoFacilities.length} strategic industrial facilities.`);
    }

    const eventCount = await ThermalEvent.countDocuments();
    if (eventCount === 0) {
      console.log('[Bootstrap] Ingesting initial thermal events and calculating intelligence...');
      const pipeline = new IngestionPipeline(process.env.DATA_MODE || 'demo');
      await pipeline.runPipeline();
      console.log('[Bootstrap] Initial thermal events successfully ingested and analyzed.');
    }
  } catch (seedErr) {
    console.warn('[Bootstrap Warning]', seedErr.message);
  }

  // Periodic Ingestion Cron (Runs every 15 minutes by default)
  const pollInterval = process.env.FIRMS_POLL_INTERVAL_MINUTES || 15;
  cron.schedule(`*/${pollInterval} * * * *`, async () => {
    console.log(`[Cron Scheduler] Running scheduled thermal anomaly ingestion (${process.env.DATA_MODE || 'demo'} mode)...`);
    const pipeline = new IngestionPipeline(process.env.DATA_MODE || 'demo');
    await pipeline.runPipeline();
  });

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 FireSight AI Backend running on port ${PORT}`);
    console.log(`📡 Data Mode: ${(process.env.DATA_MODE || 'demo').toUpperCase()}`);
    console.log(`🧠 AI Intelligence URL: ${process.env.PYTHON_AI_URL || 'http://localhost:8000'}`);
    console.log(`=======================================================`);
  });

  return server;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
