import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users to their dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Track Your Fitness Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor your health activities, set goals, and achieve your fitness dreams
            with our comprehensive tracking platform.
          </p>
          <div className="flex justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Track Activities
            </h3>
            <p className="text-gray-600">
              Log your daily steps, workouts, and monitor your progress with
              beautiful charts and statistics.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Set Goals
            </h3>
            <p className="text-gray-600">
              Define your fitness goals and track your progress towards achieving
              them with our goal management system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
            <div className="text-5xl mb-4">💪</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Workout Plans
            </h3>
            <p className="text-gray-600">
              Get personalized workout plans from professional trainers and stay
              motivated on your fitness journey.
            </p>
          </div>
        </div>

        {/* Roles Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Everyone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <h4 className="text-lg font-bold text-blue-900 mb-2">👤 Users</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Track daily activities</li>
                <li>✓ Set fitness goals</li>
                <li>✓ View progress dashboard</li>
                <li>✓ Follow workout plans</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-2">🏋️ Trainers</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Create workout plans</li>
                <li>✓ Assign plans to users</li>
                <li>✓ Monitor user progress</li>
                <li>✓ View activity summaries</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="text-lg font-bold text-purple-900 mb-2">⚙️ Admins</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>✓ Manage users & trainers</li>
                <li>✓ Activate/deactivate accounts</li>
                <li>✓ View system statistics</li>
                <li>✓ Monitor platform health</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
