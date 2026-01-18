import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                💪 FitTracker
              </span>
            </Link>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                {user.role === 'user' && (
                  <>
                    <Link
                      to="/activities"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Activities
                    </Link>
                    <Link
                      to="/goals"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Goals
                    </Link>
                    <Link
                      to="/workout-plans"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Workout Plans
                    </Link>
                    <Link
                      to="/health"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Health
                    </Link>
                    <Link
                      to="/progress"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Progress
                    </Link>
                  </>
                )}
                {user && (
                   <Link
                      to="/support"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Support
                    </Link>
                )}
                {user.role === 'trainer' && (
                  <>
                    <Link
                      to="/trainer/plans"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      My Plans
                    </Link>
                    <Link
                      to="/trainer/users"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Users
                    </Link>
                  </>
                )}
                {user.role === 'doctor' && (
                  <Link
                    to="/doctor"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Doctor Panel
                  </Link>
                )}
                {user.role === 'dietitian' && (
                  <Link
                    to="/dietitian"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Dietitian Panel
                  </Link>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Admin Panel
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-700">
                  {user.name}{' '}
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
