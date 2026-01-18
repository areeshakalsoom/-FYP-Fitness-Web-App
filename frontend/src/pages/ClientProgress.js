import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ClientProgress = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activities, setActivities] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchClientData();
  }, [userId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const requests = [
        api.get(`/admin/users/${userId}`),
        api.get(`/activities?user=${userId}`),
        api.get(`/weight?user=${userId}`),
      ];

      // Add role-specific requests
      if (user.role === 'doctor') {
        requests.push(api.get(`/medical-records?userId=${userId}`));
        requests.push(api.get(`/diet-plans?user=${userId}`));
        requests.push(api.get(`/meals?user=${userId}`));
      }
      if (user.role === 'trainer') {
        requests.push(api.get(`/workout-plans?user=${userId}`));
      }

      const responses = await Promise.all(requests);
      
      if (responses[0].data.success) setClient(responses[0].data.data);
      if (responses[1].data.success) setActivities(responses[1].data.data);
      if (responses[2].data.success) setWeightLogs(responses[2].data.data.reverse());

      // Handle role-specific data
      let responseIndex = 3;
      if (user.role === 'doctor') {
        // Medical records
        if (responses[responseIndex] && responses[responseIndex].data.success) {
          setMedicalRecords(responses[responseIndex].data.data);
        }
        responseIndex++;
        
        // Diet plans
        if (responses[responseIndex] && responses[responseIndex].data.success) {
          setDietPlans(responses[responseIndex].data.data);
        }
        responseIndex++;
        
        // Meals
        if (responses[responseIndex] && responses[responseIndex].data.success) {
          setMeals(responses[responseIndex].data.data);
        }
        responseIndex++;
      }
      if (user.role === 'trainer' && responses[responseIndex]) {
        if (responses[responseIndex].data.success) {
          setWorkoutPlans(responses[responseIndex].data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;

  const activityData = {
    labels: activities.slice(0, 7).map(a => new Date(a.date).toLocaleDateString()),
    datasets: [{
      label: 'Calories Burned',
      data: activities.slice(0, 7).map(a => a.caloriesBurned),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderRadius: 8,
    }]
  };

  const getBackLink = () => {
    if (user.role === 'doctor') return '/doctor';
    if (user.role === 'trainer') return '/trainer/plans';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-black">
                 {client?.name?.charAt(0)}
              </div>
              <div>
                 <h1 className="text-3xl font-black text-gray-900">{client?.name}</h1>
                 <p className="text-gray-500 font-medium">{client?.email}</p>
              </div>
           </div>
           <button 
             onClick={() => navigate(getBackLink())}
             className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition"
           >
              ← Back to Dashboard
           </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Overview
          </button>
          {user.role === 'doctor' && (
            <>
              <button
                onClick={() => setActiveTab('medical')}
                className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${
                  activeTab === 'medical' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                🏥 Medical Records ({medicalRecords.length})
              </button>
              <button
                onClick={() => setActiveTab('diet')}
                className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${
                  activeTab === 'diet' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                🥗 Diet Plans ({dietPlans.length})
              </button>
              <button
                onClick={() => setActiveTab('meals')}
                className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${
                  activeTab === 'meals' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                🍽️ Meal Logs ({meals.length})
              </button>
            </>
          )}
          {user.role === 'trainer' && (
            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${
                activeTab === 'workouts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              💪 Workout Plans ({workoutPlans.length})
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Activity Chart */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Recent Activity Output</h3>
                  <div className="h-64">
                     {activities.length > 0 ? (
                       <Bar data={activityData} options={{ responsive: true, maintainAspectRatio: false }} />
                     ) : (
                       <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
                         No activity data
                       </div>
                     )}
                  </div>
               </div>

               {/* Weight Progress */}
               <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Weight Transformation</h3>
                  {weightLogs.length > 0 ? (
                     <div className="h-64">
                        <Line 
                          data={{
                            labels: weightLogs.map(l => new Date(l.date).toLocaleDateString()),
                            datasets: [{ label: 'Weight (kg)', data: weightLogs.map(l => l.weight), borderColor: '#f43f5e', tension: 0.4 }]
                          }} 
                          options={{ responsive: true, maintainAspectRatio: false }} 
                        />
                     </div>
                  ) : (
                     <div className="h-64 flex items-center justify-center text-gray-400 font-bold bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        No weight tracking data available
                     </div>
                  )}
               </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-50">
                  <h3 className="text-xl font-black text-gray-900">Training History</h3>
               </div>
               <div className="p-4 overflow-x-auto">
                  {activities.length > 0 ? (
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                             <th className="px-6 py-4">Exercise</th>
                             <th className="px-6 py-4">Duration</th>
                             <th className="px-6 py-4">Output</th>
                             <th className="px-6 py-4">Date</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {activities.map(act => (
                             <tr key={act._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-5 font-black text-gray-900">{act.activityType}</td>
                                <td className="px-6 py-5 text-gray-500 font-bold">{act.duration} min</td>
                                <td className="px-6 py-5 text-primary-600 font-black">{act.caloriesBurned} kcal</td>
                                <td className="px-6 py-5 text-gray-400 text-xs font-bold">{new Date(act.date).toLocaleDateString()}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12 text-gray-400">No activity history</div>
                  )}
               </div>
            </div>
          </>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'medical' && user.role === 'doctor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalRecords.length > 0 ? medicalRecords.map(record => (
              <div key={record._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded">
                    {record.recordType?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{record.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{record.description}</p>
                {record.diagnosis && <p className="text-xs text-gray-500"><strong>Diagnosis:</strong> {record.diagnosis}</p>}
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-400">No medical records found</div>
            )}
          </div>
        )}

        {/* Diet Plans Tab */}
        {activeTab === 'diet' && user.role === 'doctor' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dietPlans.length > 0 ? dietPlans.map(plan => (
              <div key={plan._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{plan.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-bold text-orange-600">{plan.calorieTarget || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-500">Protein</p>
                    <p className="font-bold text-blue-600">{plan.proteinTarget || 0}g</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-xs text-gray-500">Carbs</p>
                    <p className="font-bold text-green-600">{plan.carbsTarget || 0}g</p>
                  </div>
                  <div className="text-center p-3 bg-rose-50 rounded-xl">
                    <p className="text-xs text-gray-500">Fats</p>
                    <p className="font-bold text-rose-600">{plan.fatTarget || 0}g</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-400">No diet plans assigned</div>
            )}
          </div>
        )}

        {/* Meal Logs Tab */}
        {activeTab === 'meals' && user.role === 'doctor' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-bold text-gray-900">Meal History</h3>
            </div>
            <div className="overflow-x-auto">
              {meals.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Meal Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Food</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Calories</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Protein</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {meals.map(meal => (
                      <tr key={meal._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{new Date(meal.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">{meal.mealType}</td>
                        <td className="px-6 py-4 text-sm">{meal.name}</td>
                        <td className="px-6 py-4 text-sm">{meal.calories}</td>
                        <td className="px-6 py-4 text-sm">{meal.protein}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-400">No meal logs found</div>
              )}
            </div>
          </div>
        )}

        {/* Workout Plans Tab */}
        {activeTab === 'workouts' && user.role === 'trainer' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutPlans.length > 0 ? workoutPlans.map(plan => (
              <div key={plan._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    plan.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                    plan.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {plan.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{plan.duration}m</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">{plan.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <p className="text-xs text-gray-500">{plan.exercises?.length || 0} exercises</p>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 text-gray-400">No workout plans assigned</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProgress;
