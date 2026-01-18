import React, { useState } from 'react';
import api from '../utils/api';

const LogMealModal = ({ isOpen, onClose, onMealLogged }) => {
  const [formData, setFormData] = useState({
    name: '',
    mealType: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/meals', formData);
      if (response.data.success) {
        onMealLogged();
        onClose();
        setFormData({
          name: '',
          mealType: 'breakfast',
          calories: '',
          protein: '',
          carbs: '',
          fats: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      setError('Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Log Nutrition</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Meal Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200"
              placeholder="e.g. Avocado Toast"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Calories</label>
              <input
                name="calories"
                type="number"
                value={formData.calories}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                placeholder="450"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Prot (g)</label>
               <input name="protein" type="number" value={formData.protein} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carb (g)</label>
               <input name="carbs" type="number" value={formData.carbs} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fat (g)</label>
               <input name="fats" type="number" value={formData.fats} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
             </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Save Meal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogMealModal;
