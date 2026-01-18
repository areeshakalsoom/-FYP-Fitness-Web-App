import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const EditDietPlanModal = ({ isOpen, onClose, onPlanUpdated, plan }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calorieTarget: '',
    proteinTarget: '',
    carbsTarget: '',
    fatTarget: '',
    recommendations: '',
    restrictions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && plan) {
      // Pre-fill form with existing plan data
      setFormData({
        title: plan.title || '',
        description: plan.description || '',
        calorieTarget: plan.calorieTarget || '',
        proteinTarget: plan.proteinTarget || '',
        carbsTarget: plan.carbsTarget || '',
        fatTarget: plan.fatTarget || '',
        recommendations: Array.isArray(plan.recommendations) ? plan.recommendations.join('\n') : (plan.recommendations || ''),
        restrictions: Array.isArray(plan.restrictions) ? plan.restrictions.join('\n') : (plan.restrictions || ''),
      });
    }
  }, [isOpen, plan]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        recommendations: formData.recommendations.split('\n').filter(r => r.trim()),
        restrictions: formData.restrictions.split('\n').filter(r => r.trim()),
      };

      const response = await api.put(`/diet-plans/${plan._id}`, updateData);
      if (response.data.success) {
        onPlanUpdated();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update diet plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Edit Diet Plan</h3>
            <p className="text-orange-100 text-sm mt-1">Update nutritional guidelines</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Plan Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Plan Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="e.g., High Protein Weight Loss Plan"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Brief overview of the diet plan..."
            />
          </div>

          {/* Macros Grid */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Daily Macro Targets</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Calories</label>
                <input
                  type="number"
                  name="calorieTarget"
                  value={formData.calorieTarget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Protein (g)</label>
                <input
                  type="number"
                  name="proteinTarget"
                  value={formData.proteinTarget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  name="carbsTarget"
                  value={formData.carbsTarget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Fat (g)</label>
                <input
                  type="number"
                  name="fatTarget"
                  value={formData.fatTarget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="65"
                />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Recommendations
              <span className="text-xs text-gray-500 font-normal ml-2">(one per line)</span>
            </label>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Drink 8 glasses of water daily&#10;Eat protein with every meal&#10;Avoid processed foods"
            />
          </div>

          {/* Restrictions */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Dietary Restrictions
              <span className="text-xs text-gray-500 font-normal ml-2">(one per line)</span>
            </label>
            <textarea
              name="restrictions"
              value={formData.restrictions}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="No dairy&#10;Gluten-free&#10;Low sodium"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDietPlanModal;
