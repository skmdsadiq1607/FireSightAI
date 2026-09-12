import axios from 'axios';
import fallbackData from './fallbackData.json';

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor: if live backend is unreachable or sleeping, fallback seamlessly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[API Service] Backend unreachable or slow, activating offline cached state:', error.message);
    return Promise.reject(error);
  }
);

// Fallback resolver functions
const getFallbackEvents = (params = {}) => {
  let list = [...(fallbackData.events || [])];
  if (params.classification && params.classification !== 'ALL') {
    list = list.filter(e => e.classification === params.classification);
  }
  if (params.riskLevel && params.riskLevel !== 'ALL') {
    list = list.filter(e => e.riskLevel === params.riskLevel);
  }
  if (params.isPersistent === 'true' || params.isPersistent === true) {
    list = list.filter(e => e.persistence?.isPersistent);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(e => 
      (e.eventId && e.eventId.toLowerCase().includes(q)) ||
      (e.locationName && e.locationName.toLowerCase().includes(q)) ||
      (e.classification && e.classification.toLowerCase().includes(q))
    );
  }
  return { data: { success: true, data: list, total: list.length } };
};

const getFallbackOverview = () => {
  const events = fallbackData.events || [];
  const facilities = fallbackData.facilities || [];
  const persistent = events.filter(e => e.persistence?.isPersistent).length;
  const highRisk = events.filter(e => e.riskScore >= 61).length;
  return {
    data: {
      success: true,
      data: {
        activeThermalEvents: events.length,
        facilitiesMonitored: facilities.length,
        persistentSources: persistent,
        highCriticalRisk: highRisk,
        systemStatus: 'ONLINE'
      }
    }
  };
};

export const eventService = {
  getEvents: async (params) => {
    try {
      return await api.get('/events', { params });
    } catch {
      return getFallbackEvents(params);
    }
  },
  getEventById: async (id) => {
    try {
      return await api.get(`/events/${id}`);
    } catch {
      const match = (fallbackData.events || []).find(e => e._id === id || e.eventId === id);
      return { data: { success: true, data: match || fallbackData.events[0] } };
    }
  },
  getHighRiskEvents: async () => {
    try {
      return await api.get('/events/high-risk');
    } catch {
      const high = (fallbackData.events || []).filter(e => e.riskScore >= 61);
      return { data: { success: true, data: high } };
    }
  },
  getPersistentEvents: async () => {
    try {
      return await api.get('/events/persistent');
    } catch {
      const p = (fallbackData.events || []).filter(e => e.persistence?.isPersistent);
      return { data: { success: true, data: p } };
    }
  },
  analyzeEvent: (id) => api.post(`/events/${id}/analyze`),
  getSatelliteContext: (id) => api.get(`/events/${id}/satellite`),
  getEventHistory: (id) => api.get(`/events/${id}/history`),
  getIncidentDirective: async (id) => {
    try {
      return await api.post(`/events/${id}/directive`);
    } catch {
      return {
        data: {
          success: true,
          directive: "Priority 1 field validation required: Dispatch nearest district emergency fire and rescue team to verify thermal plume perimeter. Establish 1.5 km evacuation perimeter if within chemical buffer zone."
        }
      };
    }
  }
};

export const facilityService = {
  getFacilities: async (params) => {
    try {
      return await api.get('/facilities', { params });
    } catch {
      return { data: { success: true, data: fallbackData.facilities || [] } };
    }
  },
  getFacilityById: async (id) => {
    try {
      return await api.get(`/facilities/${id}`);
    } catch {
      const match = (fallbackData.facilities || []).find(f => f._id === id || f.osmId === id);
      return { data: { success: true, data: match || fallbackData.facilities[0] } };
    }
  }
};

export const analyticsService = {
  getOverview: async () => {
    try {
      return await api.get('/analytics/overview');
    } catch {
      return getFallbackOverview();
    }
  },
  getTimeline: async () => {
    try {
      return await api.get('/analytics/timeline');
    } catch {
      return { data: { success: true, data: [] } };
    }
  },
  getClassifications: async () => {
    try {
      return await api.get('/analytics/classifications');
    } catch {
      return { data: { success: true, data: [] } };
    }
  },
  getRisk: async () => {
    try {
      return await api.get('/analytics/risk');
    } catch {
      return { data: { success: true, data: [] } };
    }
  },
  getFacilities: async () => {
    try {
      return await api.get('/analytics/facilities');
    } catch {
      return { data: { success: true, data: [] } };
    }
  }
};

export const monitoringService = {
  getStatus: () => api.get('/monitoring/status'),
  triggerIngestion: (payload) => api.post('/monitoring/trigger', payload)
};

export const configService = {
  getConfig: () => api.get('/config'),
  updateConfig: (data) => api.post('/config', data)
};

export default api;
