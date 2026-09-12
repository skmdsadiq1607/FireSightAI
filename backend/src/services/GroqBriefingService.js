const axios = require('axios');

class GroqBriefingService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'openai/gpt-oss-20b';
  }

  async generateIncidentDirective(event) {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    const startTime = Date.now();

    const prompt = `You are the FireSight AI Automated Incident Commander for industrial disaster management in India (SIH Problem Statement SIH26162).
Analyze this satellite thermal anomaly observation and output a concise, highly professional Tactical Incident Action Directive.

OBSERVATION DOSSIER:
- Event ID: ${event.eventId}
- Acquisition: ${event.acquisitionDate} ${event.acquisitionTime} UTC by ${event.satellite} (${event.instrument})
- Coordinates: ${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}
- Classification: ${event.classification} (AI Confidence: ${event.classificationConfidence}%)
- Risk Prioritization: ${event.riskScore}/100 (${event.riskLevel})
- Radiative Thermal Flux: ${event.frp.toFixed(1)} MW FRP | Brightness Temp: ${event.brightnessTemperature.toFixed(1)} K
- Monitored Industrial Asset: ${event.facilityName || 'None (Remote Terrain)'} (${event.facilityType || 'N/A'})
- Perimeter Status: ${event.insideIndustrialBoundary ? 'DIRECT HIT INSIDE INDUSTRIAL PERIMETER' : `${event.facilityDistance || 'N/A'}m proximity to facility`}
- Temporal Persistence: ${event.persistenceDays || 1} distinct days (${event.persistenceCount || 1} satellite passes)
- Copernicus Sentinel-2 SWIR Anomaly: ${event.satelliteVerification?.swirAnomalyDetected ? 'CONFIRMED SATURATION (B12 2.2µm)' : 'No SWIR anomaly detected'}

INSTRUCTIONS:
Provide a crisp, actionable directive using the following format:

### 1. Threat Assessment & Hazard Radius
Explain the primary danger, potential domino explosion/toxic plume risks, and specify a safe cordon radius in meters.

### 2. Specialized Suppression & Containment Protocol
Specify exact firefighting agent (e.g. Alcohol-Resistant AFFF foam, dry chemical ABC powder, water deluge curtain) based on whether it is petrochemical, electrical, blast furnace, or biomass.

### 3. Emergency Dispatch & Inter-Agency Directive
List immediate notifications to District Disaster Management Authority (DDMA), State Pollution Control Board (SPCB), National Disaster Response Force (NDRF), and local Emergency Operation Centers (Dial 112).

### 4. Public Advisory
Evacuation guidance and windward shelter-in-place instructions.`;

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an elite geospatial disaster response commander specializing in industrial hazards, chemical safety, and NASA satellite thermal anomalies in India.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 650,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const duration = Date.now() - startTime;
      let text = response.data.choices[0]?.message?.content || 'No directive generated.';
      // Clean up think tags if present
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      return {
        success: true,
        eventId: event.eventId,
        directive: text,
        model: this.model,
        latencyMs: duration,
        provider: 'Groq Cloud LPU Accelerated'
      };
    } catch (err) {
      console.error('[GroqBriefingService Error]', err.response?.data || err.message);
      throw new Error(err.response?.data?.error?.message || err.message);
    }
  }
}

module.exports = new GroqBriefingService();
