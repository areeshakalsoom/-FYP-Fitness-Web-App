import React from 'react';

const DietPlanDetailsModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">{plan.title}</h3>
            <p className="text-orange-100 text-sm mt-1">Nutrition Guidelines</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Plan Overview</h4>
            <p className="text-gray-700 leading-relaxed">{plan.description}</p>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Calories</p>
              <p className="text-xl font-black text-orange-600">{plan.calorieTarget || 'N/A'}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Protein</p>
              <p className="text-lg font-black text-blue-600">{plan.proteinTarget || 0}g</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Carbs</p>
              <p className="text-lg font-black text-green-600">{plan.carbsTarget || 0}g</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Fats</p>
              <p className="text-lg font-black text-rose-600">{plan.fatTarget || 0}g</p>
            </div>
          </div>

          {/* Meals Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Daily Meal Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
                <div key={meal} className="bg-gray-50 p-4 rounded-2xl">
                  <h5 className="font-bold text-gray-900 capitalize mb-3 flex items-center gap-2">
                    {meal === 'breakfast' && '🍳'}
                    {meal === 'lunch' && '🍲'}
                    {meal === 'dinner' && '🥗'}
                    {meal === 'snacks' && '🍎'}
                    {meal}
                  </h5>
                  <div className="space-y-3">
                    {plan.meals?.[meal]?.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.portion || '1 serving'}</p>
                        </div>
                        <span className="bg-gray-50 px-2 py-1 rounded-md font-bold text-gray-500">
                          {item.calories} cal
                        </span>
                      </div>
                    ))}
                    {(!plan.meals?.[meal] || plan.meals[meal].length === 0) && (
                      <p className="text-xs text-gray-400 italic">No specific items listed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations & Restrictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50/50 p-5 rounded-3xl">
              <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {plan.recommendations?.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-green-500 font-bold">✓</span> {rec}
                  </li>
                ))}
                {(!plan.recommendations || plan.recommendations.length === 0) && <li className="text-xs text-gray-400 italic">None</li>}
              </ul>
            </div>
            <div className="bg-rose-50/50 p-5 rounded-3xl">
              <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">Restrictions</h4>
              <ul className="space-y-2">
                {plan.restrictions?.map((res, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-rose-500 font-bold text-lg leading-none">×</span> {res}
                  </li>
                ))}
                {(!plan.restrictions || plan.restrictions.length === 0) && <li className="text-xs text-gray-400 italic">None</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-100 transition"
          >
            Close Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietPlanDetailsModal;
