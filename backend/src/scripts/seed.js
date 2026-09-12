const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Facility = require('../models/Facility');
const ThermalEvent = require('../models/ThermalEvent');
const PersistenceCluster = require('../models/PersistenceCluster');
const MonitoringLog = require('../models/MonitoringLog');
const { DemoOSMProvider } = require('../services/dataProviders/OSMProvider');
const IngestionPipeline = require('../services/IngestionPipeline');

const seedDatabase = async () => {
  console.log('====================================================');
  console.log('🌱 FireSight AI — Database Seeding Protocol (SIH 2026)');
  console.log('====================================================');

  await connectDB();

  try {
    console.log('[Seed] Purging existing demonstration datasets...');
    await Facility.deleteMany({});
    await ThermalEvent.deleteMany({});
    await PersistenceCluster.deleteMany({});
    await MonitoringLog.deleteMany({});

    console.log('[Seed] Ingesting strategic Indian industrial facilities (OSM / GIDC / Registry)...');
    const osmProvider = new DemoOSMProvider();
    const facilities = await osmProvider.fetchIndustrialFeatures();
    const insertedFacilities = await Facility.insertMany(facilities);
    console.log(`[Seed] Successfully seeded ${insertedFacilities.length} critical industrial facilities.`);

    console.log('[Seed] Running multi-source thermal anomaly ingestion & ML pipeline...');
    const pipeline = new IngestionPipeline('demo');
    const result = await pipeline.runPipeline();

    console.log(`[Seed] Ingestion Pipeline Finished:`);
    console.log(`       Processed: ${result.processedCount} events`);
    console.log(`       New: ${result.newEventsCount} events`);

    const eventCount = await ThermalEvent.countDocuments();
    const clusterCount = await PersistenceCluster.countDocuments();
    const highRiskCount = await ThermalEvent.countDocuments({ riskScore: { $gte: 61 } });

    console.log('----------------------------------------------------');
    console.log(`📊 Summary of Seeded Data:`);
    console.log(`   - Facilities: ${insertedFacilities.length}`);
    console.log(`   - Thermal Events: ${eventCount}`);
    console.log(`   - Spatio-temporal Persistence Clusters: ${clusterCount}`);
    console.log(`   - High/Critical Risk Events: ${highRiskCount}`);
    console.log('====================================================');
    console.log('✅ Seeding Complete! System ready for hackathon demonstration.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
