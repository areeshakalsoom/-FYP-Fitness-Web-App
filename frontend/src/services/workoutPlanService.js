import api from '../utils/api';

const workoutPlanService = {
  // Get all workout plans
  getWorkoutPlans: async () => {
    const response = await api.get('/workout-plans');
    return response.data;
  },

  // Get single workout plan
  getWorkoutPlan: async (id) => {
    const response = await api.get(`/workout-plans/${id}`);
    return response.data;
  },

  // Create workout plan (trainer only)
  createWorkoutPlan: async (planData) => {
    const response = await api.post('/workout-plans', planData);
    return response.data;
  },

  // Update workout plan (trainer only)
  updateWorkoutPlan: async (id, planData) => {
    const response = await api.put(`/workout-plans/${id}`, planData);
    return response.data;
  },

  // Assign workout plan to users (trainer only)
  assignWorkoutPlan: async (id, userIds) => {
    const response = await api.post(`/workout-plans/${id}/assign`, { userIds });
    return response.data;
  },

  // Get user activity summary (trainer only)
  getUserActivitySummary: async (userId) => {
    const response = await api.get(`/workout-plans/users/${userId}/activity`);
    return response.data;
  },

  // Get activities for all users assigned to trainer
  getTeamActivities: async () => {
    const response = await api.get('/workout-plans/team-activities');
    return response.data;
  },

  // Delete workout plan (trainer only)
  deleteWorkoutPlan: async (id) => {
    const response = await api.delete(`/workout-plans/${id}`);
    return response.data;
  },
};

export default workoutPlanService;
