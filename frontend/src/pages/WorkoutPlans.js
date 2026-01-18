import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workoutPlanService from '../services/workoutPlanService';

const WorkoutPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await workoutPlanService.getWorkoutPlans();
      if (response.success) {
        setPlans(response.data);
      } else {
        setError(response.message || 'Failed to fetch workout plans');
      }
    } catch (err) {
      setError('An error occurred while fetching workout plans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Workout Plans</h1>
          <p className="text-gray-600 mt-2">Personalized routines for your fitness journey</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all group">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    plan.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    plan.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {plan.difficulty}
                  </span>
                  <div className="text-gray-400 text-sm font-bold flex items-center gap-1">
                    ⏱️ {plan.duration}m
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {plan.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {plan.description || 'No description provided for this specific routine.'}
                </p>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Exercises</p>
                  <ul className="space-y-2">
                    {plan.exercises?.slice(0, 3).map((ex, i) => (
                      <li key={i} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
                        {ex.name}
                      </li>
                    ))}
                    {(plan.exercises?.length > 3) && (
                      <li className="text-xs text-primary-500 font-bold mt-2">
                        + {plan.exercises.length - 3} more exercises
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  onClick={() => navigate(`/workout-plans/${plan._id}`)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-100 transition-all flex items-center justify-center gap-2"
                >
                  View Exercises 📋
                </button>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-dashed border-gray-200">
            <div className="text-6xl mb-6">🏋️‍♂️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No plans assigned yet</h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Your personal trainer hasn't assigned any workout routines to your profile yet. 
              Once assigned, they will appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;
