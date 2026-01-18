import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workoutPlanService from '../services/workoutPlanService';

const WorkoutPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await workoutPlanService.getWorkoutPlan(id);
      if (response.success) {
        setPlan(response.data);
      } else {
        setError(response.message || 'Failed to fetch plan details');
      }
    } catch (err) {
      setError('An error occurred while fetching plan details');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseId) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error || 'Workout plan not found'}</p>
          <button 
            onClick={() => navigate('/workout-plans')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Workout Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/workout-plans')}
          className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition mb-6"
        >
          <span>←</span> Back to Plans
        </button>

        {/* Plan Header */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-10 text-white">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {plan.difficulty}
                  </span>
                  <span className="text-primary-100 text-sm font-medium">
                    ⏱️ {plan.duration} mins
                  </span>
                </div>
                <h1 className="text-4xl font-extrabold">{plan.title}</h1>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm">Assigned by</p>
                <p className="font-bold text-lg">{plan.trainer?.name || 'Trainer'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">About this Plan</h3>
            <p className="text-gray-600 leading-relaxed">
              {plan.description || 'No description provided for this workout routine.'}
            </p>
          </div>
        </div>

        {/* Exercises Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Use This Workout</h2>
            <p className="text-gray-700 mb-3">
              ✓ Click on each exercise to mark it as complete<br/>
              ✓ Track your progress as you go<br/>
              ✓ Click "Finish & Save Workout" when done
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold text-gray-700">Progress:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${(completedExercises.length / (plan.exercises?.length || 1)) * 100}%` }}
                ></div>
              </div>
              <span className="font-bold text-primary-600">
                {completedExercises.length} / {plan.exercises?.length || 0}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {plan.exercises?.map((exercise, index) => {
              const isActive = completedExercises.includes(exercise._id);
              return (
                <div 
                  key={exercise._id || index}
                  className={`bg-white rounded-2xl shadow-sm border p-6 transition-all cursor-pointer hover:shadow-md ${
                    isActive ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100'
                  }`}
                  onClick={() => toggleExercise(exercise._id)}
                >
                  <div className="flex items-start gap-6">
                    {/* Checkmark Circle */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      isActive ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'
                    }`}>
                      {isActive ? '✓' : ''}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                        <h4 className={`text-xl font-bold transition-all ${
                          isActive ? 'text-primary-900 line-through opacity-60' : 'text-gray-900'
                        }`}>
                          {exercise.name}
                        </h4>
                        <div className="flex gap-4">
                          {exercise.sets && (
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold uppercase">Sets</p>
                              <p className="font-bold text-gray-900">{exercise.sets}</p>
                            </div>
                          )}
                          {exercise.reps && (
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold uppercase">Reps</p>
                              <p className="font-bold text-gray-900">{exercise.reps}</p>
                            </div>
                          )}
                          {exercise.duration && (
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold uppercase">Mins</p>
                              <p className="font-bold text-gray-900">{exercise.duration}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {exercise.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-sm text-gray-500 italic">
                            <span className="font-bold text-gray-400 not-italic mr-2">Note:</span>
                            {exercise.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complete Workout Button */}
        <div className="mt-12 text-center pb-12">
          {completedExercises.length === plan.exercises?.length ? (
            <div className="animate-bounce mb-4">
              <span className="text-4xl">🎉</span>
            </div>
          ) : null}
          <button 
            disabled={completedExercises.length === 0}
            className={`px-12 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              completedExercises.length === plan.exercises?.length
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-200 disabled:opacity-50'
            }`}
            onClick={() => {
              alert('Congratulations! Your workout has been saved to your activity log.');
              navigate('/dashboard');
            }}
          >
            {completedExercises.length === plan.exercises?.length 
              ? 'Finish & Save Workout' 
              : 'End Workout Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetails;
