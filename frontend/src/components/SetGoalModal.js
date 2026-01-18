import React, { useState } from 'react';
import goalService from '../services/goalService';

const SetGoalModal = ({ isOpen, onClose, onGoalSet }) => {
  const [formData, setFormData] = useState({
    goalType: 'daily_steps',
    targetValue: '',
    currentValue: '0',
    deadline: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goalTypes = [
    { value: 'daily_steps', label: 'Daily Steps', placeholder: '10000', unit: 'steps' },
    { value: 'weekly_workouts', label: 'Weekly Workouts', placeholder: '5', unit: 'workouts' },
    { value: 'weight_loss', label: 'Weight Loss', placeholder: '5', unit: 'kg' },
    { value: 'weight_gain', label: 'Weight Gain', placeholder: '3', unit: 'kg' },
    { value: 'distance', label: 'Distance', placeholder: '50', unit: 'km' },
    { value: 'calories', label: 'Calories Burned', placeholder: '2000', unit: 'cal' },
    { value: 'custom', label: 'Custom Goal', placeholder: '100', unit: '' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.targetValue || parseInt(formData.targetValue) <= 0) {
      setError('Please enter a valid target value');
      return;
    }

    setLoading(true);

    try {
      const goalData = {
        goalType: formData.goalType,
        targetValue: parseInt(formData.targetValue),
        currentValue: parseInt(formData.currentValue) || 0,
      };

      if (formData.deadline) goalData.deadline = formData.deadline;
      if (formData.description) goalData.description = formData.description;

      const response = await goalService.createGoal(goalData);

      if (response.success) {
        onGoalSet();
        onClose();
        setFormData({
          goalType: 'daily_steps',
          targetValue: '',
          currentValue: '0',
          deadline: '',
          description: '',
        });
      } else {
        setError(response.message || 'Failed to create goal');
      }
    } catch (err) {
      setError('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const selectedGoalType = goalTypes.find((g) => g.value === formData.goalType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Set New Goal</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Type *
            </label>
            <select
              name="goalType"
              value={formData.goalType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {goalTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Value *
            </label>
            <div className="relative">
              <input
                type="number"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                placeholder={selectedGoalType?.placeholder}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              {selectedGoalType?.unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {selectedGoalType.unit}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Value
            </label>
            <div className="relative">
              <input
                type="number"
                name="currentValue"
                value={formData.currentValue}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {selectedGoalType?.unit && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {selectedGoalType.unit}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your starting point (default: 0)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline (Optional)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes about this goal..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          {/* Goal Preview */}
          {formData.targetValue && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-sm font-medium text-primary-900 mb-2">
                Goal Preview:
              </p>
              <p className="text-sm text-primary-800">
                Achieve <span className="font-bold">{formData.targetValue} {selectedGoalType?.unit}</span> for {selectedGoalType?.label}
                {formData.deadline && (
                  <span> by {new Date(formData.deadline).toLocaleDateString()}</span>
                )}
              </p>
            </div>
          )}

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
              {loading ? 'Creating...' : 'Set Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetGoalModal;
