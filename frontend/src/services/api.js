import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for clear diagnostics
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Service Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  getHighRiskEvents: () => api.get('/events/high-risk'),
  getPersistentEvents: () => api.get('/events/persistent'),
  analyzeEvent: (id) => api.post(`/events/${id}/analyze`),
  getSatelliteContext: (id) => api.get(`/events/${id}/satellite`),
  getEventHistory: (id) => api.get(`/events/${id}/history`),
  getIncidentDirective: (id) => api.post(`/events/${id}/directive`)
};

export const facilityService = {
  getFacilities: (params) => api.get('/facilities', { params }),
  getFacilityById: (id) => api.get(`/facilities/${id}`)
};

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getTimeline: () => api.get('/analytics/timeline'),
  getClassifications: () => api.get('/analytics/classifications'),
  getRisk: () => api.get('/analytics/risk'),
  getFacilities: () => api.get('/analytics/facilities')
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
