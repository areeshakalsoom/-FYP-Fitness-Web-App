import React, { useState, useEffect } from 'react';
import activityService from '../services/activityService';
import LogActivityModal from '../components/LogActivityModal';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getActivities();
      if (response.success) {
        setActivities(response.data);
      } else {
        setError(response.message || 'Failed to fetch activities');
      }
    } catch (err) {
      setError('An error occurred while fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const response = await activityService.deleteActivity(id);
      if (response.success) {
        fetchActivities();
      } else {
        alert(response.message || 'Failed to delete activity');
      }
    } catch (err) {
      alert('An error occurred while deleting activity');
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
            <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
            <p className="text-gray-600 mt-2">Track and manage your fitness activities</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Log Activity
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Details</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Calories</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize font-medium text-primary-600">
                      {activity.activityType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activity.activityType === 'steps' && `${activity.steps?.toLocaleString()} steps`}
                      {activity.activityType === 'workout' && activity.workoutType}
                      {activity.duration && ` • ${activity.duration} min`}
                      {activity.distance && ` • ${activity.distance} km`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {activity.caloriesBurned} kcal
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No activities found. start by logging one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LogActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onActivityLogged={fetchActivities}
      />
    </div>
  );
};

export default Activities;
