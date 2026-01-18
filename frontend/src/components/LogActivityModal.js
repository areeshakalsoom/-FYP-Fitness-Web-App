import React, { useState } from 'react';
import activityService from '../services/activityService';

const LogActivityModal = ({ isOpen, onClose, onActivityLogged }) => {
  const [formData, setFormData] = useState({
    activityType: 'steps',
    date: new Date().toISOString().split('T')[0],
    steps: '',
    distance: '',
    duration: '',
    caloriesBurned: '',
    workoutType: '',
    notes: '',
    sleepQuality: 'good',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare data based on activity type
      const activityData = {
        activityType: formData.activityType,
        date: formData.date,
      };

      if (formData.steps) activityData.steps = parseInt(formData.steps);
      if (formData.distance) activityData.distance = parseFloat(formData.distance);
      if (formData.duration) activityData.duration = parseInt(formData.duration);
      if (formData.caloriesBurned)
        activityData.caloriesBurned = parseInt(formData.caloriesBurned);
      if (formData.workoutType) activityData.workoutType = formData.workoutType;
      if (formData.notes) activityData.notes = formData.notes;
      if (formData.activityType === 'sleep') {
        activityData.sleepQuality = formData.sleepQuality;
      }

      const response = await activityService.logActivity(activityData);

      if (response.success) {
        onActivityLogged();
        onClose();
        setFormData({
          activityType: 'steps',
          date: new Date().toISOString().split('T')[0],
          steps: '',
          distance: '',
          duration: '',
          caloriesBurned: '',
          workoutType: '',
          notes: '',
          sleepQuality: 'good',
        });
      } else {
        setError(response.message || 'Failed to log activity');
      }
    } catch (err) {
      setError('Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-gray-900">Log Activity</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type *
              </label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="steps">Steps</option>
                <option value="workout">Workout</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="yoga">Yoga</option>
                <option value="sleep">Sleep</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          {formData.activityType === 'steps' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Steps *
              </label>
              <input
                type="number"
                name="steps"
                value={formData.steps}
                onChange={handleChange}
                placeholder="e.g., 10000"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          )}

          {formData.activityType === 'workout' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Type
              </label>
              <input
                type="text"
                name="workoutType"
                value={formData.workoutType}
                onChange={handleChange}
                placeholder="e.g., Strength Training, Cardio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
          {formData.activityType === 'sleep' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Quality
              </label>
              <select
                name="sleepQuality"
                value={formData.sleepQuality}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g., 5.5"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 30"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories Burned
            </label>
            <input
              type="number"
              name="caloriesBurned"
              value={formData.caloriesBurned}
              onChange={handleChange}
              placeholder="e.g., 250"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this activity..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogActivityModal;
