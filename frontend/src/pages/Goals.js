import React, { useState, useEffect } from 'react';
import goalService from '../services/goalService';
import SetGoalModal from '../components/SetGoalModal';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [updateValue, setUpdateValue] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalService.getGoals();
      if (response.success) {
        setGoals(response.data);
      } else {
        setError(response.message || 'Failed to fetch goals');
      }
    } catch (err) {
      setError('An error occurred while fetching goals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (goalId) => {
    if (!updateValue || isNaN(updateValue)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      const response = await goalService.updateGoal(goalId, {
        currentValue: parseFloat(updateValue)
      });
      
      if (response.success) {
        setUpdatingGoal(null);
        setUpdateValue('');
        fetchGoals();
      } else {
        alert(response.message || 'Failed to update goal');
      }
    } catch (err) {
      alert('An error occurred while updating goal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const response = await goalService.deleteGoal(id);
      if (response.success) {
        fetchGoals();
      } else {
        alert(response.message || 'Failed to delete goal');
      }
    } catch (err) {
      alert('An error occurred while deleting goal');
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Goals</h1>
            <p className="text-gray-600 mt-2">Set and monitor your fitness targets</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Set New Goal
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min(((goal.currentValue || 0) / goal.targetValue) * 100, 100);
            const isUpdating = updatingGoal === goal._id;
            
            return (
              <div key={goal._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 capitalize">
                      {goal.goalType.replace('_', ' ')}
                    </h3>
                    <p className="text-sm text-gray-500">{goal.period} target</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    goal.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {goal.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{goal.currentValue || 0} achieved</span>
                    <span>Target: {goal.targetValue}</span>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm text-gray-600 mb-4 italic">"{goal.description}"</p>
                )}

                {/* Update Progress Section */}
                {isUpdating ? (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Update Current Value
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={updateValue}
                        onChange={(e) => setUpdateValue(e.target.value)}
                        placeholder={`Current: ${goal.currentValue || 0}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleUpdateProgress(goal._id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setUpdatingGoal(null);
                          setUpdateValue('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setUpdatingGoal(goal._id);
                      setUpdateValue(goal.currentValue?.toString() || '0');
                    }}
                    className="w-full mb-3 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                  >
                    📝 Update Progress
                  </button>
                )}

                <div className="flex justify-end gap-2 border-t pt-4">
                  <button
                    onClick={() => handleDelete(goal._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No goals set yet</h2>
            <p className="text-gray-600 mb-8">Setting goals helps you stay motivated and track your progress.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      <SetGoalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGoalSet={fetchGoals}
      />
    </div>
  );
};

export default Goals;
