import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CreateDietPlanModal = ({ isOpen, onClose, onPlanCreated }) => {
  const [formData, setFormData] = useState({
    user: '',
    title: '',
    description: '',
    calorieTarget: '',
    proteinTarget: '',
    carbsTarget: '',
    fatTarget: '',
    meals: {
      breakfast: [{ name: '', calories: '', portion: '' }],
      lunch: [{ name: '', calories: '', portion: '' }],
      dinner: [{ name: '', calories: '', portion: '' }],
      snacks: [{ name: '', calories: '', portion: '' }],
    },
    recommendations: '',
    restrictions: '',
    endDate: '',
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?role=user');
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMealChange = (category, index, e) => {
    const newMeals = { ...formData.meals };
    newMeals[category][index][e.target.name] = e.target.value;
    setFormData({ ...formData, meals: newMeals });
  };

  const addMealItem = (category) => {
    const newMeals = { ...formData.meals };
    newMeals[category].push({ name: '', calories: '', portion: '' });
    setFormData({ ...formData, meals: newMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out meal items with no name to avoid validation errors
      const sanitizedMeals = {};
      Object.keys(formData.meals).forEach(category => {
        sanitizedMeals[category] = formData.meals[category].filter(item => item.name.trim() !== '');
      });

      const payload = {
        ...formData,
        meals: sanitizedMeals,
        recommendations: typeof formData.recommendations === 'string' 
          ? formData.recommendations.split('\n').filter(r => r.trim())
          : [],
        restrictions: typeof formData.restrictions === 'string'
          ? formData.restrictions.split('\n').filter(r => r.trim())
          : [],
      };

      const response = await api.post('/diet-plans', payload);
      if (response.data.success) {
        onPlanCreated();
        onClose();
        setFormData({
          user: '',
          title: '',
          description: '',
          calorieTarget: '',
          proteinTarget: '',
          carbsTarget: '',
          fatTarget: '',
          meals: {
            breakfast: [{ name: '', calories: '', portion: '' }],
            lunch: [{ name: '', calories: '', portion: '' }],
            dinner: [{ name: '', calories: '', portion: '' }],
            snacks: [{ name: '', calories: '', portion: '' }],
          },
          recommendations: '',
          restrictions: '',
          endDate: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create diet plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-2xl font-bold text-primary-600">Diet Plan Studio</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Patient *</label>
              <select
                name="user"
                required
                value={formData.user}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a patient</option>
                {availableUsers.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Plan Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Low Carb Ketogenic Diet"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
              placeholder="Brief overview of the diet plan..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Calorie Target</label>
              <input
                type="number"
                name="calorieTarget"
                value={formData.calorieTarget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500"
                placeholder="2000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Protein (g)</label>
              <input
                type="number"
                name="proteinTarget"
                value={formData.proteinTarget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500"
                placeholder="150"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Carbs (g)</label>
              <input
                type="number"
                name="carbsTarget"
                value={formData.carbsTarget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500"
                placeholder="200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Fat (g)</label>
              <input
                type="number"
                name="fatTarget"
                value={formData.fatTarget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500"
                placeholder="65"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Recommendations (one per line)</label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                placeholder="Drink 8 glasses of water daily&#10;Eat protein with every meal"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Restrictions (one per line)</label>
              <textarea
                name="restrictions"
                value={formData.restrictions}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                placeholder="No dairy&#10;Gluten-free"
              ></textarea>
            </div>
          </div>

          {['breakfast', 'lunch', 'dinner', 'snacks'].map(category => (
            <div key={category} className="space-y-4 bg-gray-50 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-gray-900 capitalize">{category}</h4>
                <button
                  type="button"
                  onClick={() => addMealItem(category)}
                  className="text-primary-600 font-bold text-sm"
                >
                  + Add Item
                </button>
              </div>
              {formData.meals[category].map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Meal Name</label>
                    <input
                      name="name"
                      value={item.name}
                      placeholder="e.g. Scrambled Eggs"
                      onChange={(e) => handleMealChange(category, index, e)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Portion</label>
                    <input
                      name="portion"
                      value={item.portion}
                      placeholder="e.g. 2 pieces"
                      onChange={(e) => handleMealChange(category, index, e)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Calories</label>
                    <input
                      name="calories"
                      type="number"
                      value={item.calories}
                      placeholder="e.g. 150"
                      onChange={(e) => handleMealChange(category, index, e)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all border-none"
          >
            {loading ? 'Generating Plan...' : 'Finalize & Publish Diet Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDietPlanModal;
