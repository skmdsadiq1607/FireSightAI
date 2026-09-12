# FireSight AI — Geospatial Intelligence & Industrial Thermal Surveillance

> **Smart India Hackathon 2026 Prototype**  
> **Problem Statement ID**: SIH26162  
> **Theme**: Disaster Management  
> **Category**: Software  
> **Tagline**: *“See the Heat. Understand the Risk.”*

---

## 1. The Core Scientific Premise

Traditional satellite fire monitoring platforms treat every thermal hotspot as a potential wildfire or generic blaze. In real-world disaster management:

$$\mathbf{Thermal\ Anomaly \neq Confirmed\ Fire}$$

A thermal detection in an industrial district could be a routine petroleum flare, a blast furnace operating normally, an agricultural stubble burn, or a catastrophic industrial chemical fire. 

**FireSight AI** solves this by correlating satellite thermal observations (**NASA FIRMS VIIRS & MODIS**), industrial infrastructure boundaries (**OpenStreetMap Overpass**), temporal multi-pass persistence (**7-Day Spatio-Temporal Clustering**), optical/SWIR context (**Copernicus Sentinel-2 L2A**), and an explainable **Hybrid Machine Learning Classifier** with transparent **0–100 Risk Prioritization**.

---

## 2. System Architecture

```mermaid
graph TD
    subgraph Multi-Source Ingestion Feeds
        F1[NASA FIRMS VIIRS NOAA-20/21 & MODIS] --> IngestEngine[Ingestion & Deduplication Engine]
        OSM[OpenStreetMap Overpass API - Industrial Geometries] --> IngestEngine
        S2[Copernicus Data Space Sentinel-2 L2A SWIR B11/B12] --> IngestEngine
        DEMO[Calibrated High-Fidelity Indian Scenarios] --> IngestEngine
    end

    subgraph Backend Core (Node.js / Express :5000)
        IngestEngine --> GeoService[Geospatial Service: Point-in-Polygon & Proximity]
        GeoService --> PersistEngine[Persistence Engine: Spatio-Temporal Clustering]
        PersistEngine --> Mongo[(MongoDB 2dsphere Store)]
        NodeAPI[REST API Gateway] <--> Mongo
        CronScheduler[15-min Background Scheduler] --> IngestEngine
    end

    subgraph Scientific & ML Microservice (Python / FastAPI :8000)
        NodeAPI <-->|REST POST /api/classify| FastAPI[FastAPI ML Service]
        FastAPI --> FeatureExt[Feature Engineering Layer]
        FeatureExt --> RFModel[Random Forest Classifier + Domain Rules]
        RFModel --> BaselineEngine[Facility Historical Baseline & Anomaly Scorer]
        BaselineEngine --> XAI[Explainable AI Reasoner]
    end

    subgraph Risk Prioritization (0-100 Index)
        FastAPI --> RiskEngine[Configurable Risk Engine]
        RiskEngine -->|Weighted Score + Checkable Evidence| NodeAPI
    end

    subgraph Analyst Command Center (React + Vite :5173)
        NodeAPI <--> ReactUI[Dark Command Center SPA]
        ReactUI --> GISMap[Leaflet Dark CartoDB GIS Map]
        ReactUI --> EventIntel[Event Dossier & XAI Drawer]
        ReactUI --> Analytics[Geo-Analytics & FRP Distribution]
        ReactUI --> MissionControl[Mission Control Telemetry]
    end
```

---

## 3. Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, React Router v6, Leaflet & React-Leaflet, Recharts, Lucide React, Axios.
- **Backend**: Node.js v25, Express.js, MongoDB (with `2dsphere` geospatial indexing and GeoJSON), Mongoose, Helmet, CORS, Rate Limiting, Node-Cron.
- **AI & Scientific Service**: Python 3.14, FastAPI, Uvicorn, Scikit-Learn (Random Forest), NumPy, Pandas, Pydantic.
- **External Feeds**: NASA FIRMS (VIIRS 375m & MODIS), OpenStreetMap (Overpass API for industrial landuse/works), Copernicus Data Space Ecosystem (Sentinel-2 L2A optical and SWIR B11/B12 bands).

---

## 4. Quick Start Guide

### Prerequisites
- Node.js (v18+) and npm
- Python (3.10+)
- MongoDB running locally on `mongodb://localhost:27017`

### 1-Click Setup & Seed
```bash
# 1. Install all dependencies (Root, Backend, Frontend)
npm run install:all

# 2. Seed the database with high-accuracy Indian industrial assets & thermal scenarios
npm run seed
```

### Running the Complete Stack
You can start all three services concurrently:
```bash
npm run dev:all
```
Or start each service independently in separate terminals:
```bash
# Terminal 1: Python AI Intelligence Service (Port 8000)
cd ai-service
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Node.js Backend Gateway (Port 5000)
cd backend
npm run dev

# Terminal 3: Frontend Command Center (Port 5173)
cd frontend
npm run dev
```

Visit the application at: **`http://localhost:5173`**

---

## 5. Official SIH Judge Demonstration Flow (2–3 Minutes)

The prototype includes a **"JUDGE DEMO FLOW"** quick-selection toolbar on the top of the main dashboard:

1. **Case A: High-Confidence Industrial Fire (`FSA-2026-IND-001`)**
   - **Location**: Hazira Petrochemical & Chemical Terminal Complex, Surat, Gujarat.
   - **Characteristics**: Extreme thermal flux ($84.6\text{ MW}$ FRP, $374.8\text{ K}$), direct hit inside the petrochemical storage boundary, SWIR Band 12 saturation confirmed by Sentinel-2.
   - **Result**: Classified as **INDUSTRIAL FIRE**, **Confidence: 91%**, **Risk Score: 79 (HIGH/CRITICAL)**.
   - **Explainability**: Visible checklist showing why: Extreme FRP + Inside industrial perimeter + Severe anomaly above baseline.

2. **Case B: Persistent Thermal Source (`FSA-2026-IND-002`)**
   - **Location**: Jamnagar Mega Refinery & Petrochemical Complex, Gujarat.
   - **Characteristics**: Flare stack operating consistently across 6 unique satellite pass days (11 passes), $28.4\text{ MW}$ FRP.
   - **Result**: Classified as **PERSISTENT THERMAL SOURCE**, **Confidence: 88%**, **Risk Score: 83 (CRITICAL PERSISTENCE)**.
   - **Explainability**: High multi-day recurrence at known point source.

3. **Case C: Natural Wildfire (`FSA-2026-NAT-003`)**
   - **Location**: Jim Corbett National Park Forest Canopy, Uttarakhand.
   - **Characteristics**: $18.2\text{ MW}$ FRP, $25\text{km}+$ away from any industrial installation.
   - **Result**: Classified as **NATURAL / WILDFIRE**, **Confidence: 82%**, **Risk Score: 35 (MEDIUM)**.
   - **Contrast**: The system does not falsely panic or flag remote wildfires as industrial disasters.

4. **Case D: Agricultural Residue Stubble Burning (`FSA-2026-AGR-004`)**
   - **Location**: Sangrur District, Punjab.
   - **Characteristics**: Low-intensity open biomass combustion ($12.8\text{ MW}$ FRP), single-pass transient observation.
   - **Result**: Classified as **AGRICULTURAL BURNING**, **Confidence: 86%**, **Risk Score: 16 (LOW)**.

5. **Case E: Routine Industrial Heat (`FSA-2026-IND-005`)**
   - **Location**: Bhilai Steel Plant (SAIL), Chhattisgarh.
   - **Characteristics**: Blast furnace thermal reading ($22.1\text{ MW}$ FRP), matches historical operating baseline ($21.0 \pm 3.5\text{ MW}$).
   - **Result**: Classified as **ROUTINE INDUSTRIAL HEAT**, **Confidence: 84%**, **Risk Score: 24 (LOW)**.

6. **Case F: Uncertain Anomaly (`FSA-2026-UNC-006`)**
   - **Location**: Thar Desert Salt Flats, Rajasthan.
   - **Characteristics**: Low thermal reading ($3.2\text{ MW}$ FRP), potential ground reflectance.
   - **Result**: Classified as **UNCERTAIN ANOMALY**, **Confidence: 60%**, **Risk Score: 16 (LOW)**.

---

## 6. Live vs Demonstration Data Providers

FireSight AI features a clean provider architecture:
- **`DATA_MODE=demo`**: Calibrated high-fidelity scenarios ready for zero-credential demonstration.
- **`DATA_MODE=live`**: Connects directly to external APIs when credentials are provided in `.env`:
  - `FIRMS_MAP_KEY`: Get a free key from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/map_key).
  - `COPERNICUS_CLIENT_ID` & `COPERNICUS_CLIENT_SECRET`: Free registration at [Copernicus Data Space](https://dataspace.copernicus.eu/).

You can toggle between Demo and Live feeds at any time from the TopBar switcher or the `/settings` page. If any external API encounters network timeouts or rate limits, the system automatically degrades gracefully to cached/demo providers without ever showing a blank screen.

---

## 7. Verification & Automated Tests

Run the automated backend test suite covering the 0–100 Risk Engine and Geospatial calculations:
```bash
npm test
```
Result:
```
PASS src/tests/riskEngine.test.js
PASS src/tests/geospatial.test.js
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
```

---

## 8. License

Developed for **Smart India Hackathon 2026 (Problem SIH26162)** under the MIT License.
