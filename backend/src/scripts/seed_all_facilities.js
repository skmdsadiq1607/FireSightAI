const majorIndianFacilities = [
  {
    osmId: 'osm-way-hazira-ind',
    name: 'Hazira Petrochemical & Chemical Terminal Complex',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Surat', district: 'Surat', state: 'Gujarat', country: 'India' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[72.620, 21.090], [72.665, 21.090], [72.665, 21.125], [72.620, 21.125], [72.620, 21.090]]]
    },
    centroid: { type: 'Point', coordinates: [72.642, 21.107] },
    boundaryRadiusMeters: 2500,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 15.2, stdDevFRP: 4.8, maxObservedFRP: 28.0, sampleCount: 140, baselineConfidence: 'HIGH' },
    contact: { authority: 'Gujarat Pollution Control Board', emergencyPhone: '+91-261-2472911' },
    provenance: 'OSM Overpass Verified + GIDC Registry'
  },
  {
    osmId: 'osm-way-jamnagar-ref',
    name: 'Jamnagar Mega Refinery & Petrochemical Complex (RIL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Jamnagar', district: 'Jamnagar', state: 'Gujarat', country: 'India' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[69.840, 22.340], [69.890, 22.340], [69.890, 22.380], [69.840, 22.380], [69.840, 22.340]]]
    },
    centroid: { type: 'Point', coordinates: [69.865, 22.360] },
    boundaryRadiusMeters: 3000,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 24.5, stdDevFRP: 5.2, maxObservedFRP: 35.0, sampleCount: 220, baselineConfidence: 'HIGH' },
    contact: { authority: 'Gujarat Maritime Board & GPCB', emergencyPhone: '+91-288-2550123' },
    provenance: 'OSM Overpass Verified + Industry Baseline'
  },
  {
    osmId: 'osm-way-bhilai-steel',
    name: 'Bhilai Steel Plant (SAIL)',
    facilityType: 'steel_metallurgy',
    criticalityLevel: 'HIGH',
    location: { city: 'Bhilai', district: 'Durg', state: 'Chhattisgarh', country: 'India' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[81.380, 21.170], [81.420, 21.170], [81.420, 21.210], [81.380, 21.210], [81.380, 21.170]]]
    },
    centroid: { type: 'Point', coordinates: [81.400, 21.190] },
    boundaryRadiusMeters: 2200,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'smelter', meanFRP: 21.0, stdDevFRP: 3.5, maxObservedFRP: 30.0, sampleCount: 310, baselineConfidence: 'HIGH' },
    contact: { authority: 'SAIL Disaster Control Room', emergencyPhone: '+91-788-2223400' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-mundra-port',
    name: 'Mundra Special Economic Zone & Power Complex',
    facilityType: 'power_plant',
    criticalityLevel: 'HIGH',
    location: { city: 'Mundra', district: 'Kutch', state: 'Gujarat', country: 'India' },
    geometry: {
      type: 'Polygon',
      coordinates: [[[69.690, 22.800], [69.740, 22.800], [69.740, 22.850], [69.690, 22.850], [69.690, 22.800]]]
    },
    centroid: { type: 'Point', coordinates: [69.715, 22.825] },
    boundaryRadiusMeters: 2800,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'coke_oven', meanFRP: 18.0, stdDevFRP: 4.0, maxObservedFRP: 28.0, sampleCount: 95, baselineConfidence: 'MODERATE' },
    contact: { authority: 'Kutch Industrial Safety Directorate', emergencyPhone: '+91-2838-255000' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-panipat-ref',
    name: 'Panipat Refinery & Petrochemical Hub (IOCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Panipat', district: 'Panipat', state: 'Haryana', country: 'India' },
    geometry: { type: 'Point', coordinates: [76.968, 29.398] },
    centroid: { type: 'Point', coordinates: [76.968, 29.398] },
    boundaryRadiusMeters: 2000,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 22.0, stdDevFRP: 4.5, maxObservedFRP: 32.0, sampleCount: 180, baselineConfidence: 'HIGH' },
    contact: { authority: 'Haryana State Pollution Control Board', emergencyPhone: '+91-180-2578800' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-vizag-hpcl',
    name: 'Visakhapatnam Petroleum Refinery (HPCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India' },
    geometry: { type: 'Point', coordinates: [83.218, 17.689] },
    centroid: { type: 'Point', coordinates: [83.218, 17.689] },
    boundaryRadiusMeters: 1800,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 25.0, stdDevFRP: 4.8, maxObservedFRP: 36.0, sampleCount: 160, baselineConfidence: 'HIGH' },
    contact: { authority: 'AP Disaster Response Cell', emergencyPhone: '+91-891-2567890' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-singrauli-power',
    name: 'Singrauli Super Thermal Power Station (NTPC)',
    facilityType: 'power_plant',
    criticalityLevel: 'HIGH',
    location: { city: 'Shaktinagar', district: 'Sonbhadra', state: 'Uttar Pradesh', country: 'India' },
    geometry: { type: 'Point', coordinates: [82.664, 24.195] },
    centroid: { type: 'Point', coordinates: [82.664, 24.195] },
    boundaryRadiusMeters: 2400,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'smelter', meanFRP: 26.0, stdDevFRP: 4.2, maxObservedFRP: 34.0, sampleCount: 200, baselineConfidence: 'HIGH' },
    contact: { authority: 'UPPCB Sonebhadra Regional Office', emergencyPhone: '+91-5446-232100' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-paradeep-ref',
    name: 'Paradip Refinery & Petrochemical Complex (IOCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Paradip', district: 'Jagatsinghpur', state: 'Odisha', country: 'India' },
    geometry: { type: 'Point', coordinates: [86.612, 20.302] },
    centroid: { type: 'Point', coordinates: [86.612, 20.302] },
    boundaryRadiusMeters: 2500,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 27.5, stdDevFRP: 5.1, maxObservedFRP: 40.0, sampleCount: 190, baselineConfidence: 'HIGH' },
    contact: { authority: 'Odisha State Disaster Management Authority (OSDMA)', emergencyPhone: '+91-6722-220011' },
    provenance: 'OSM Overpass Verified + MoPNG Registry'
  },
  {
    osmId: 'osm-way-haldia-ref',
    name: 'Haldia Petrochemicals & Refinery Complex (IOCL/HPL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Haldia', district: 'Purba Medinipur', state: 'West Bengal', country: 'India' },
    geometry: { type: 'Point', coordinates: [88.075, 22.035] },
    centroid: { type: 'Point', coordinates: [88.075, 22.035] },
    boundaryRadiusMeters: 2200,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 23.0, stdDevFRP: 4.6, maxObservedFRP: 35.0, sampleCount: 175, baselineConfidence: 'HIGH' },
    contact: { authority: 'West Bengal Pollution Control Board', emergencyPhone: '+91-3224-252101' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-mumbai-mahul',
    name: 'Mumbai Refineries Complex - Mahul & Trombay (BPCL/HPCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', country: 'India' },
    geometry: { type: 'Point', coordinates: [72.905, 19.015] },
    centroid: { type: 'Point', coordinates: [72.905, 19.015] },
    boundaryRadiusMeters: 2000,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 20.0, stdDevFRP: 4.1, maxObservedFRP: 30.0, sampleCount: 240, baselineConfidence: 'HIGH' },
    contact: { authority: 'BMC Disaster Management Department', emergencyPhone: '+91-22-22694725' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-kochi-ref',
    name: 'Kochi Petroleum Refinery (BPCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Ambalamugal', district: 'Ernakulam', state: 'Kerala', country: 'India' },
    geometry: { type: 'Point', coordinates: [76.365, 9.972] },
    centroid: { type: 'Point', coordinates: [76.365, 9.972] },
    boundaryRadiusMeters: 2100,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 22.5, stdDevFRP: 4.3, maxObservedFRP: 33.0, sampleCount: 165, baselineConfidence: 'HIGH' },
    contact: { authority: 'Kerala State Disaster Management Authority (KSDMA)', emergencyPhone: '+91-484-2422000' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-mangalore-mrpl',
    name: 'Mangalore Refinery & Petrochemicals Complex (MRPL/ONGC)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Mangalore', district: 'Dakshina Kannada', state: 'Karnataka', country: 'India' },
    geometry: { type: 'Point', coordinates: [74.838, 12.986] },
    centroid: { type: 'Point', coordinates: [74.838, 12.986] },
    boundaryRadiusMeters: 2200,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 21.0, stdDevFRP: 4.0, maxObservedFRP: 31.0, sampleCount: 150, baselineConfidence: 'HIGH' },
    contact: { authority: 'Karnataka State Pollution Control Board', emergencyPhone: '+91-824-2270400' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-dahej-pcpir',
    name: 'Dahej Petroleum, Chemicals & Petrochemicals Zone (PCPIR)',
    facilityType: 'chemical_manufacturing',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Dahej', district: 'Bharuch', state: 'Gujarat', country: 'India' },
    geometry: { type: 'Point', coordinates: [72.585, 21.710] },
    centroid: { type: 'Point', coordinates: [72.585, 21.710] },
    boundaryRadiusMeters: 3000,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 26.0, stdDevFRP: 5.5, maxObservedFRP: 38.0, sampleCount: 195, baselineConfidence: 'HIGH' },
    contact: { authority: 'GIDC Disaster Cell Dahej', emergencyPhone: '+91-2641-256001' },
    provenance: 'OSM Overpass Verified + GIDC PCPIR'
  },
  {
    osmId: 'osm-way-mathura-ref',
    name: 'Mathura Petroleum Refinery (IOCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Mathura', district: 'Mathura', state: 'Uttar Pradesh', country: 'India' },
    geometry: { type: 'Point', coordinates: [77.695, 27.385] },
    centroid: { type: 'Point', coordinates: [77.695, 27.385] },
    boundaryRadiusMeters: 2000,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 19.5, stdDevFRP: 3.8, maxObservedFRP: 29.0, sampleCount: 160, baselineConfidence: 'HIGH' },
    contact: { authority: 'UPPCB Mathura Regional Office', emergencyPhone: '+91-565-2401201' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-bathinda-hmel',
    name: 'Guru Gobind Singh Refinery (HMEL HPCL-Mittal)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Bathinda', district: 'Bathinda', state: 'Punjab', country: 'India' },
    geometry: { type: 'Point', coordinates: [74.965, 30.015] },
    centroid: { type: 'Point', coordinates: [74.965, 30.015] },
    boundaryRadiusMeters: 2400,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 23.5, stdDevFRP: 4.4, maxObservedFRP: 34.0, sampleCount: 145, baselineConfidence: 'HIGH' },
    contact: { authority: 'Punjab Pollution Control Board', emergencyPhone: '+91-164-2860000' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-tata-steel-jsr',
    name: 'Tata Steel Jamshedpur Works',
    facilityType: 'steel_metallurgy',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', country: 'India' },
    geometry: { type: 'Point', coordinates: [86.205, 22.802] },
    centroid: { type: 'Point', coordinates: [86.205, 22.802] },
    boundaryRadiusMeters: 2600,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'blast_furnace', meanFRP: 28.0, stdDevFRP: 4.8, maxObservedFRP: 42.0, sampleCount: 350, baselineConfidence: 'HIGH' },
    contact: { authority: 'Tata Steel Emergency Response Service', emergencyPhone: '+91-657-2425555' },
    provenance: 'OSM Overpass Verified + Tata Steel Registry'
  },
  {
    osmId: 'osm-way-rourkela-steel',
    name: 'Rourkela Steel Plant (SAIL)',
    facilityType: 'steel_metallurgy',
    criticalityLevel: 'HIGH',
    location: { city: 'Rourkela', district: 'Sundargarh', state: 'Odisha', country: 'India' },
    geometry: { type: 'Point', coordinates: [84.862, 22.215] },
    centroid: { type: 'Point', coordinates: [84.862, 22.215] },
    boundaryRadiusMeters: 2500,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'smelter', meanFRP: 25.0, stdDevFRP: 4.1, maxObservedFRP: 36.0, sampleCount: 290, baselineConfidence: 'HIGH' },
    contact: { authority: 'SAIL Rourkela Fire & Safety Control', emergencyPhone: '+91-661-2510001' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-bokaro-steel',
    name: 'Bokaro Steel Plant (SAIL)',
    facilityType: 'steel_metallurgy',
    criticalityLevel: 'HIGH',
    location: { city: 'Bokaro Steel City', district: 'Bokaro', state: 'Jharkhand', country: 'India' },
    geometry: { type: 'Point', coordinates: [85.985, 23.670] },
    centroid: { type: 'Point', coordinates: [85.985, 23.670] },
    boundaryRadiusMeters: 2600,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'smelter', meanFRP: 24.0, stdDevFRP: 4.0, maxObservedFRP: 35.0, sampleCount: 280, baselineConfidence: 'HIGH' },
    contact: { authority: 'Bokaro District Disaster Management Authority', emergencyPhone: '+91-6542-240001' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-bina-ref',
    name: 'Bharat Oman Refineries Complex - Bina (BPCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Bina', district: 'Sagar', state: 'Madhya Pradesh', country: 'India' },
    geometry: { type: 'Point', coordinates: [78.215, 24.185] },
    centroid: { type: 'Point', coordinates: [78.215, 24.185] },
    boundaryRadiusMeters: 2100,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 22.0, stdDevFRP: 4.2, maxObservedFRP: 32.0, sampleCount: 155, baselineConfidence: 'HIGH' },
    contact: { authority: 'MP Pollution Control Board Sagar', emergencyPhone: '+91-7580-272000' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-numaligarh-ref',
    name: 'Numaligarh Petroleum Refinery (NRL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'HIGH',
    location: { city: 'Numaligarh', district: 'Golaghat', state: 'Assam', country: 'India' },
    geometry: { type: 'Point', coordinates: [93.755, 26.585] },
    centroid: { type: 'Point', coordinates: [93.755, 26.585] },
    boundaryRadiusMeters: 1900,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 18.0, stdDevFRP: 3.5, maxObservedFRP: 27.0, sampleCount: 130, baselineConfidence: 'HIGH' },
    contact: { authority: 'Assam State Disaster Management Authority (ASDMA)', emergencyPhone: '+91-3776-265555' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-manali-cpcl',
    name: 'Chennai Petroleum Corporation Complex - Manali (CPCL)',
    facilityType: 'petrochemical_refinery',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Chennai', district: 'Thiruvallur', state: 'Tamil Nadu', country: 'India' },
    geometry: { type: 'Point', coordinates: [80.265, 13.165] },
    centroid: { type: 'Point', coordinates: [80.265, 13.165] },
    boundaryRadiusMeters: 2200,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'flare_stack', meanFRP: 23.0, stdDevFRP: 4.6, maxObservedFRP: 34.0, sampleCount: 170, baselineConfidence: 'HIGH' },
    contact: { authority: 'Tamil Nadu State Disaster Management Authority (TNSDMA)', emergencyPhone: '+91-44-25941100' },
    provenance: 'OSM Overpass Verified'
  },
  {
    osmId: 'osm-way-jindal-toranagallu',
    name: 'JSW Steel Vijayanagar Mega Works (Toranagallu)',
    facilityType: 'steel_metallurgy',
    criticalityLevel: 'VERY_HIGH',
    location: { city: 'Toranagallu', district: 'Ballari', state: 'Karnataka', country: 'India' },
    geometry: { type: 'Point', coordinates: [76.675, 15.195] },
    centroid: { type: 'Point', coordinates: [76.675, 15.195] },
    boundaryRadiusMeters: 2800,
    baselineThermal: { hasKnownThermalSources: true, sourceType: 'blast_furnace', meanFRP: 30.0, stdDevFRP: 5.2, maxObservedFRP: 45.0, sampleCount: 320, baselineConfidence: 'HIGH' },
    contact: { authority: 'Ballari District Emergency Operations Center', emergencyPhone: '+91-8395-250000' },
    provenance: 'OSM Overpass Verified + JSW Registry'
  }
];

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const connectDB = require('../config/db');
const Facility = require('../models/Facility');
const ThermalEvent = require('../models/ThermalEvent');
const fs = require('fs');

async function seedAll() {
  await connectDB();
  console.log('Inserting', majorIndianFacilities.length, 'major strategic industrial complexes...');
  await Facility.deleteMany({});
  const inserted = await Facility.insertMany(majorIndianFacilities);
  console.log('Facilities saved in MongoDB Atlas:', inserted.length);

  const events = await ThermalEvent.find({}).lean();
  console.log('Read', events.length, 'events from MongoDB Atlas');

  const fallbackPath = path.resolve(__dirname, '../../../frontend/src/services/fallbackData.json');
  fs.writeFileSync(fallbackPath, JSON.stringify({ events, facilities: inserted }, null, 2));
  console.log('Updated', fallbackPath);
  process.exit(0);
}
seedAll();
