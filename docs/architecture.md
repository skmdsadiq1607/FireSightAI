# FireSight AI — System Architecture Specification
**SIH 2026 Problem Statement ID: SIH26162**
*“See the Heat. Understand the Risk.”*

## 1. Executive Summary & Core Paradigm
Traditional fire monitoring platforms treat every thermal hotspot as a potential wildfire or generic blaze. In reality:
$$\text{Thermal Anomaly} \neq \text{Confirmed Fire}$$

A high-temperature observation in an industrial district could be a routine petroleum flare, a steel manufacturing blast furnace, agricultural residue burning, or a catastrophic industrial fire. **FireSight AI** ingests NASA FIRMS thermal anomaly feeds, correlates them against OpenStreetMap industrial infrastructure geometries, evaluates temporal persistence across multi-day satellite passes, gathers Copernicus Sentinel-2 SWIR band context, and executes explainable AI classification and 0–100 risk prioritization.

---

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph Data Feeds
        F1[NASA FIRMS VIIRS/MODIS] --> DP[Data Provider Abstraction]
        OSM[OpenStreetMap Overpass API] --> DP
        S2[Copernicus Sentinel-2 L2A] --> DP
        DEMO[Seeded Scenario Database] --> DP
    end

    subgraph Backend Core (Node.js / Express :5000)
        DP --> Ingest[Ingestion & Deduplication Engine]
        Ingest --> Mongo[(MongoDB 2dsphere)]
        Ingest --> Persist[Persistence & Cluster Tracker]
        Persist --> Mongo
        NodeAPI[REST API Gateway] <--> Mongo
        Cron[Ingestion Scheduler] --> Ingest
    end

    subgraph Scientific & ML Service (Python / FastAPI :8000)
        NodeAPI <-->|HTTP REST /api/ml| Fast[FastAPI ML Intelligence Service]
        Fast --> Feat[Feature Extractor]
        Feat --> Hybrid[Hybrid AI Classifier: Rules + Random Forest]
        Hybrid --> Anomaly[Facility Baseline & Anomaly Scorer]
        Anomaly --> XAI[Explainable AI Reasoner]
    end

    subgraph Risk Engine (Configurable 0-100)
        Fast --> Risk[Risk Engine]
        Risk -->|Risk Score + Evidence| NodeAPI
    end

    subgraph Frontend Intelligence Center (React + Vite :5173)
        NodeAPI <--> UI[React SPA Command Center]
        UI --> MapView[Leaflet Satellite GIS Engine]
        UI --> EventIntel[Event Investigation & XAI Drawer]
        UI --> FacIntel[Facility Asset Monitoring]
        UI --> Analytics[Geo-Analytics & FRP Distribution]
        UI --> MissionCtrl[System Health & Telemetry]
    end
```

---

## 3. Data Flow & Provenance

1. **Detection (FIRMS VIIRS/MODIS)**: Ingests Latitude, Longitude, FRP (MW), Brightness Temp ($K$), Acquisition Timestamp, Satellite, Scan, Track, Day/Night flag.
2. **Spatial Enrichment (OSM)**: 2dsphere spatial lookup evaluates whether coordinates are inside an industrial polygon or within critical proximity (0–5000m) to designated factories, chemical plants, refineries, or power stations.
3. **Temporal Persistence Engine**: Spatio-temporal clustering groups recurrent heat signatures at the same coordinates over 1–7+ days, calculating persistence score, detection count, and active window.
4. **Satellite Verification (Sentinel-2 L2A)**: Evaluates Short-Wave Infrared (SWIR Band 11/12) anomalies and cloud masks to corroborate combustion signatures without treating Sentinel-2 as the primary detector.
5. **Explainable AI Classification**: Categorizes events into:
   - `INDUSTRIAL FIRE`
   - `PERSISTENT THERMAL SOURCE`
   - `NATURAL / WILDFIRE`
   - `AGRICULTURAL BURNING`
   - `ROUTINE INDUSTRIAL HEAT`
   - `UNCERTAIN ANOMALY`
6. **Risk Scoring (0–100)**:
   $$\text{Risk} = w_{\text{thermal}} S_{\text{thermal}} + w_{\text{persist}} S_{\text{persist}} + w_{\text{ind}} S_{\text{ind}} + w_{\text{rec}} S_{\text{rec}} + w_{\text{pop}} S_{\text{pop}}$$
   Configurable default weights: Thermal (30%), Persistence (25%), Industrial Proximity (20%), Historical Recurrence (15%), Population/Context (10%).
