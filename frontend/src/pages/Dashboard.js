import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import activityService from '../services/activityService';
import goalService from '../services/goalService';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LogActivityModal from '../components/LogActivityModal';
import SetGoalModal from '../components/SetGoalModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    if (user.role === 'trainer') {
      navigate('/trainer/plans');
    } else if (user.role === 'doctor') {
      navigate('/doctor');
    } else if (user.role === 'dietitian') {
      navigate('/dietitian');
    } else if (user.role === 'admin') {
      navigate('/admin');
    } else {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, goalsRes] = await Promise.all([
        activityService.getActivities(),
        goalService.getGoals(),
      ]);

      if (activitiesRes.success) {
        setActivities(activitiesRes.data);
        calculateStats(activitiesRes.data);
      }
      if (goalsRes.success) setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (activitiesData) => {
    const today = new Date();
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentActivities = activitiesData.filter(
      (a) => new Date(a.date) >= last7Days
    );
    const monthlyActivities = activitiesData.filter(
      (a) => new Date(a.date) >= last30Days
    );

    const totalSteps = recentActivities.reduce((sum, a) => sum + (a.steps || 0), 0);
    const totalCalories = recentActivities.reduce(
      (sum, a) => sum + (a.caloriesBurned || 0),
      0
    );
    const totalWorkouts = recentActivities.filter(
      (a) => a.activityType === 'workout'
    ).length;

    setStats({
      weeklySteps: totalSteps,
      weeklyCalories: totalCalories,
      weeklyWorkouts: totalWorkouts,
      totalActivities: activitiesData.length,
      monthlyActivities: monthlyActivities.length,
    });
  };

  // Chart data for steps over time
  const getStepsChartData = () => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const stepsData = last7Days.map((date) => {
      const activity = activities.find((a) => a.date.split('T')[0] === date);
      return activity?.steps || 0;
    });

    return {
      labels: last7Days.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      }),
      datasets: [
        {
          label: 'Steps',
          data: stepsData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  // Chart data for goal progress
  const getGoalProgressData = () => {
    const activeGoals = goals.filter((g) => g.isActive);
    if (activeGoals.length === 0) {
      return {
        labels: ['No Active Goals'],
        datasets: [
          {
            data: [100],
            backgroundColor: ['rgba(200, 200, 200, 0.5)'],
          },
        ],
      };
    }

    const labels = activeGoals.map((g) => g.goalType);
    const progress = activeGoals.map((g) => {
      const achieved = g.currentValue || 0;
      const target = g.targetValue;
      return Math.min((achieved / target) * 100, 100);
    });

    return {
      labels,
      datasets: [
        {
          data: progress,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
      ],
    };
  };

  // Chart data for activity types
  const getActivityTypesData = () => {
    const types = {};
    activities.forEach((a) => {
      types[a.activityType] = (types[a.activityType] || 0) + 1;
    });

    return {
      labels: Object.keys(types),
      datasets: [
        {
          label: 'Activities',
          data: Object.values(types),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your fitness progress overview
          </p>
          <div className="mt-4">
            <Link to="/health" className="text-primary-600 font-bold hover:underline flex items-center gap-2">
              🏥 Access your Medical & Nutrition Portal →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowActivityModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Log Activity
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
          >
            <span className="text-xl">🎯</span>
            Set Goal
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Weekly Steps</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.weeklySteps?.toLocaleString() || 0}
                </p>
                <p className="text-blue-100 text-xs mt-1">Last 7 days</p>
              </div>
              <div className="text-5xl opacity-80">🚶</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Calories Burned</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.weeklyCalories?.toLocaleString() || 0}
                </p>
                <p className="text-green-100 text-xs mt-1">Last 7 days</p>
              </div>
              <div className="text-5xl opacity-80">🔥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Workouts</p>
                <p className="text-3xl font-bold mt-2">
                  {stats?.weeklyWorkouts || 0}
                </p>
                <p className="text-purple-100 text-xs mt-1">Last 7 days</p>
              </div>
              <div className="text-5xl opacity-80">💪</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Active Goals</p>
                <p className="text-3xl font-bold mt-2">
                  {goals.filter((g) => g.isActive).length}
                </p>
                <p className="text-orange-100 text-xs mt-1">In progress</p>
              </div>
              <div className="text-5xl opacity-80">🎯</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Steps Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Steps This Week
            </h3>
            <Line
              data={getStepsChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>

          {/* Goal Progress Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Goal Progress
            </h3>
            <Doughnut
              data={getGoalProgressData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>

        {/* Activity Types Chart */}
        {activities.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Distribution
            </h3>
            <Bar
              data={getActivityTypesData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h3>
            <button
              onClick={() => setShowActivityModal(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {activity.activityType === 'steps' && '🚶'}
                      {activity.activityType === 'workout' && '💪'}
                      {activity.activityType === 'running' && '🏃'}
                      {activity.activityType === 'cycling' && '🚴'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {activity.activityType}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.steps && (
                      <p className="text-sm font-medium text-gray-900">
                        {activity.steps.toLocaleString()} steps
                      </p>
                    )}
                    {activity.caloriesBurned && (
                      <p className="text-sm text-gray-500">
                        {activity.caloriesBurned} cal
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No activities logged yet</p>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Log your first activity →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Manage Goals →
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {goals
              .filter((g) => g.isActive)
              .map((goal) => {
                const progress = Math.min(
                  ((goal.currentValue || 0) / goal.targetValue) * 100,
                  100
                );
                return (
                  <div key={goal._id} className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 capitalize">
                        {goal.goalType.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {goal.currentValue || 0} / {goal.targetValue}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                );
              })}
            {goals.filter((g) => g.isActive).length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No active goals</p>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Set your first goal →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <LogActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onActivityLogged={fetchDashboardData}
      />
      <SetGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onGoalSet={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
