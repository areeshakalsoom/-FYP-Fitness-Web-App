import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Hide sidebar on public pages
  const publicPaths = ['/', '/login', '/register'];
  if (!user || publicPaths.includes(location.pathname)) return null;

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { path: '/profile', icon: '👤', label: 'Profile' },
      { path: '/support', icon: '💬', label: 'Support' },
    ];

    const roleBasedItems = {
      user: [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/activities', icon: '🏃', label: 'Activities' },
        { path: '/goals', icon: '🎯', label: 'Goals' },
        { path: '/workout-plans', icon: '💪', label: 'Workouts' },
        { path: '/health', icon: '🏥', label: 'Health' },
        { path: '/progress', icon: '📈', label: 'Progress' },
        { path: '/messages', icon: '💬', label: 'Messages' },
      ],
      trainer: [
        { path: '/trainer/plans', icon: '🏋️', label: 'My Plans' },
        { path: '/trainer/users', icon: '👥', label: 'Athletes' },
      ],
      doctor: [
        { path: '/doctor', icon: '⚕️', label: 'Medical & Nutrition' },
      ],
      admin: [
        { path: '/admin', icon: '📊', label: 'Overview' },
        { path: '/admin/users', icon: '👥', label: 'User Management' },
      ],
    };

    return [...(roleBasedItems[user?.role] || []), ...commonItems];
  };

  if (!user) return null;

  const navItems = getNavigationItems();

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-black text-white transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-3">
            <span className="text-3xl">💪</span>
            <span className="text-xl font-black tracking-tight">FitTracker</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center">
            <span className="text-3xl">💪</span>
          </Link>
        )}
      </div>

      {/* User Info */}
      <div className={`p-6 border-b border-white/10 ${collapsed ? 'text-center' : ''}`}>
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center gap-4'}`}>
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-black text-white truncate">{user.name}</p>
              <p className="text-xs text-white/60 uppercase tracking-widest font-bold">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
              isActive(item.path)
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {!collapsed && (
              <span className="font-bold text-sm">{item.label}</span>
            )}
            {!collapsed && isActive(item.path) && (
              <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <span className="text-xl">🚪</span>
          {!collapsed && <span className="font-bold text-sm">Logout</span>}
        </button>
        
        {/* Simple Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="text-xs font-bold">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
