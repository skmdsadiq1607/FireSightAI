import numpy as np

def extract_features(data: dict) -> dict:
    """
    Extracts and normalizes scientific features for thermal anomaly classification.
    """
    frp = float(data.get("frp", 0.0))
    brightness = float(data.get("brightnessTemperature", 300.0))
    inside_boundary = 1.0 if data.get("insideIndustrialBoundary", False) else 0.0
    
    facility_dist = data.get("facilityDistance")
    if facility_dist is None:
        facility_dist_m = 25000.0
    else:
        facility_dist_m = float(facility_dist)
        
    persistence_days = float(data.get("persistenceDays", 1))
    persistence_count = float(data.get("persistenceCount", 1))
    
    # Calculate log-transformed FRP to handle extreme skewness
    log_frp = float(np.log1p(max(0.0, frp)))
    
    # Normalized temperature excess above ambient (approx 300K)
    temp_excess = max(0.0, brightness - 300.0)
    
    # Proximity decay: 1.0 if inside boundary, approaches 0 as distance reaches 10km
    proximity_decay = np.exp(-facility_dist_m / 2500.0)
    
    # Industrial persistence interaction term
    latitude = float(data.get("latitude", 0.0))
    longitude = float(data.get("longitude", 0.0))
    event_id = str(data.get("eventId", ""))

    return {
        "event_id": event_id,
        "latitude": latitude,
        "longitude": longitude,
        "raw_frp": frp,
        "log_frp": log_frp,
        "brightness": brightness,
        "temp_excess": temp_excess,
        "inside_boundary": inside_boundary,
        "facility_dist_m": facility_dist_m,
        "proximity_decay": float(proximity_decay),
        "persistence_days": persistence_days,
        "persistence_count": persistence_count,
        "ind_persistence": float(ind_persistence)
    }
