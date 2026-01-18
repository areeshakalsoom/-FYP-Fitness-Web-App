import api from '../utils/api';

const activityService = {
  // Get all activities
  getActivities: async (params) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  // Create activity
  createActivity: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Log activity (alias for createActivity)
  logActivity: async (activityData) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  // Get activity stats
  getActivityStats: async (period = 'week') => {
    const response = await api.get('/activities/stats', {
      params: { period },
    });
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },
};

export default activityService;
