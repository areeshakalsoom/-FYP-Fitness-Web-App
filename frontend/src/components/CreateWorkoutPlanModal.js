import React, { useState, useEffect } from 'react';
import workoutPlanService from '../services/workoutPlanService';
import adminService from '../services/adminService';

const CreateWorkoutPlanModal = ({ isOpen, onClose, onPlanCreated, plan }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: '',
    exercises: [{ name: '', sets: '', reps: '', duration: '', notes: '' }],
    assignedUsers: [],
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (plan) {
        setFormData({
            title: plan.title || '',
            description: plan.description || '',
            difficulty: plan.difficulty || 'beginner',
            duration: plan.duration || '',
            exercises: plan.exercises && plan.exercises.length > 0 
                ? plan.exercises.map(ex => ({ ...ex })) 
                : [{ name: '', sets: '', reps: '', duration: '', notes: '' }],
            assignedUsers: plan.assignedUsers ? plan.assignedUsers.map(u => u._id || u) : [],
        });
      }
    }
  }, [isOpen, plan]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers({ role: 'user' });
      if (response.success) {
        setAvailableUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExerciseChange = (index, e) => {
    const newExercises = [...formData.exercises];
    newExercises[index][e.target.name] = e.target.value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', duration: '', notes: '' }],
    });
  };

  const removeExercise = (index) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises.length > 0 ? newExercises : [{ name: '', sets: '', reps: '', duration: '', notes: '' }] });
  };

  const toggleUserAssignment = (userId) => {
    const updated = formData.assignedUsers.includes(userId)
      ? formData.assignedUsers.filter(id => id !== userId)
      : [...formData.assignedUsers, userId];
    setFormData({ ...formData, assignedUsers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (plan) {
        response = await workoutPlanService.updateWorkoutPlan(plan._id, formData);
        // Also update assignments if they changed
        await workoutPlanService.assignWorkoutPlan(plan._id, formData.assignedUsers);
      } else {
        response = await workoutPlanService.createWorkoutPlan(formData);
        if (response.success && formData.assignedUsers.length > 0) {
          await workoutPlanService.assignWorkoutPlan(response.data._id, formData.assignedUsers);
        }
      }

      if (response.success) {
        onPlanCreated();
        onClose();
        if (!plan) {
            setFormData({
                title: '',
                description: '',
                difficulty: 'beginner',
                duration: '',
                exercises: [{ name: '', sets: '', reps: '', duration: '', notes: '' }],
                assignedUsers: [],
            });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-primary-600">Workout Plan Studio</h3>
            <p className="text-sm text-gray-500">Design a personalized routine for your clients</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Plan Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                placeholder="e.g. Advanced Hypertrophy Lower Body"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Estimated Duration (mins) *</label>
              <input
                type="number"
                name="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                placeholder="60"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                placeholder="Describe the goals and instructions for this plan..."
              />
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Exercises List
              </h4>
              <button
                type="button"
                onClick={addExercise}
                className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1"
              >
                + Add Exercise
              </button>
            </div>
            <div className="space-y-4">
              {formData.exercises.map((ex, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl space-y-4 border border-gray-100 relative">
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-sm font-bold"
                  >
                    Remove
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(index, e)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        placeholder="Bench Press"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Sets</label>
                      <input
                        type="number"
                        name="sets"
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(index, e)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        placeholder="4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Reps / Duration</label>
                      <input
                        type="text"
                        name="reps"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(index, e)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200"
                        placeholder="12 or 30s"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Assignment */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Assign to Clients
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableUsers.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => toggleUserAssignment(user._id)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border text-center ${
                    formData.assignedUsers.includes(user._id)
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-100'
                      : 'bg-white text-gray-600 border-gray-100 hover:border-primary-200'
                  }`}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Launch Workout Plan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkoutPlanModal;
