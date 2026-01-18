import api from '../utils/api';

const adminService = {
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getAllUsers: async (filters) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  getAllFeedback: async () => {
    const response = await api.get('/admin/feedback');
    return response.data;
  },
  updateFeedbackStatus: async (feedbackId, status) => {
    const response = await api.put(`/admin/feedback/${feedbackId}`, { status });
    return response.data;
  }
};

export default adminService;
