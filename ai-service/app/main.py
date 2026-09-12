from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import time

from app.features.extractor import extract_features
from app.models.classifier import classifier_instance

app = FastAPI(
    title="FireSight AI — Geospatial & Scientific Intelligence Service",
    description="Microservice for thermal anomaly feature extraction, Random Forest classification, and industrial baseline analytics (SIH 2026)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ThermalEventFeaturesInput(BaseModel):
    eventId: Optional[str] = "TEST-EVENT"
    latitude: float
    longitude: float
    frp: float = Field(ge=0, description="Fire Radiative Power in MW")
    brightnessTemperature: float = Field(ge=200, le=500, description="Brightness temp in Kelvin")
    insideIndustrialBoundary: bool = False
    facilityDistance: Optional[float] = None
    facilityType: Optional[str] = None
    criticalityLevel: Optional[str] = "MEDIUM"
    persistenceDays: Optional[int] = 1
    persistenceCount: Optional[int] = 1
    baselineThermal: Optional[Dict[str, Any]] = None

class ClassificationResponse(BaseModel):
    classification: str
    classificationConfidence: int
    probabilities: Dict[str, float]
    evidence: List[str]
    modelEngine: str
    featuresEvaluated: Dict[str, Any]

@app.get("/")
def root():
    return {
        "service": "FireSight AI Intelligence Service",
        "status": "ONLINE",
        "problemStatement": "SIH26162",
        "theme": "Disaster Management",
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {
        "status": "HEALTHY",
        "timestamp": time.time(),
        "service": "python-fastapi-ai",
        "version": "1.0.0",
        "modelLoaded": True,
        "classes": classifier_instance.classes
    }

@app.post("/api/classify", response_model=ClassificationResponse)
def classify_event(payload: ThermalEventFeaturesInput):
    try:
        # Extract features
        features = extract_features(payload.model_dump())
        # Run ML model
        result = classifier_instance.classify(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/features")
def inspect_features(payload: ThermalEventFeaturesInput):
    return extract_features(payload.model_dump())

@app.post("/api/anomaly")
def calculate_anomaly(payload: ThermalEventFeaturesInput):
    frp = payload.frp
    baseline = payload.baselineThermal or {}
    mean_frp = float(baseline.get("meanFRP", 0.0))
    std_frp = float(baseline.get("stdDevFRP", mean_frp * 0.25 if mean_frp > 0 else 5.0))

    if mean_frp <= 0:
        return {
            "status": "NO_BASELINE",
            "zScore": 0.0,
            "deltaPercent": 0.0,
            "interpretation": "Insufficient historical observations for this facility location."
        }

    z_score = (frp - mean_frp) / max(std_frp, 1.0)
    delta_pct = round(((frp - mean_frp) / mean_frp) * 100.0, 1)

    if z_score > 3.0:
        status = "SEVERE_ANOMALY"
        interp = f"Severe surge: +{delta_pct}% above baseline. Strong indicator of uncontrolled combustion."
    elif z_score > 1.5:
        status = "ANOMALOUS"
        interp = f"Elevated thermal output: +{delta_pct}% above expected operational range."
    elif z_score > 0.5:
        status = "ELEVATED"
        interp = f"Marginally elevated thermal reading (+{delta_pct}%)."
    else:
        status = "NORMAL"
        interp = "Thermal signature complies with normal operational baseline."

    return {
        "status": status,
        "zScore": round(float(z_score), 2),
        "deltaPercent": delta_pct,
        "meanFRP": mean_frp,
        "observedFRP": frp,
        "interpretation": interp
    }
