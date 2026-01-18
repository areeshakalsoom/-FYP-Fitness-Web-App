import api from '../utils/api';

const goalService = {
  // Get all goals
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  // Create goal
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  // Delete goal
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};

export default goalService;
