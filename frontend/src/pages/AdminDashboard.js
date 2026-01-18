import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStats(true);
    
    // Live ticking clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Real-time System health polling (DB status, Registry)
    const healthCheck = setInterval(() => {
      fetchStats();
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(healthCheck);
    };
  }, []);

  const fetchStats = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const response = await adminService.getSystemStats();
      if (response.success) setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // In case of error (server down/db down), we keep the stale state 
      // but the UI will show the red indicator because stats.system.dbAlive will be false or undefined
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Admin Overview</h1>
            <p className="text-gray-500 mt-2 text-lg">System-wide performance and engagement metrics</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/admin/users"
              className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              Manage Users 👤
            </Link>
            <Link
              to="/support"
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 font-black rounded-2xl hover:bg-gray-50 transition-all"
            >
              Support Inbox 📥
            </Link>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Members', value: stats?.users?.total, sub: `${stats?.users?.active} active`, color: 'blue', icon: '👥' },
            { label: 'Expert Trainers', value: stats?.trainers, sub: 'Verified Staff', color: 'emerald', icon: '🏋️' },
            { label: 'Activity Logs', value: stats?.activities?.total, sub: `${stats?.activities?.last7Days} this week`, color: 'purple', icon: '📊' },
            { label: 'Elite Programs', value: stats?.workoutPlans, sub: 'Active Plans', color: 'orange', icon: '🔥' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all group">
              <div className={`w-16 h-16 rounded-3xl bg-${item.color}-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{item.value || 0}</h3>
              <p className={`text-xs font-bold text-${item.color}-600 mt-2`}>{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Detailed Role Breakdown */}
           <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Departmental Breakdown</h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Medical Staff</p>
                        <p className="text-2xl font-black text-gray-900">{stats?.doctors || 0}</p>
                    </div>
                    <span className="text-2xl">👨‍⚕️</span>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Nutritionists</p>
                        <p className="text-2xl font-black text-gray-900">{stats?.dietitians || 0}</p>
                    </div>
                    <span className="text-2xl">🥗</span>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">System Admins</p>
                        <p className="text-2xl font-black text-gray-900">{stats?.admins || 0}</p>
                    </div>
                    <span className="text-2xl">🛡️</span>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">New Growth</p>
                        <p className="text-2xl font-black text-green-600">+{stats?.recentRegistrations || 0}</p>
                    </div>
                    <span className="text-2xl">📈</span>
                 </div>
              </div>
           </div>

           {/* Quick Actions / System Health */}
           <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] shadow-2xl text-white">
              <h3 className="text-2xl font-black mb-8">System Status</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Database Connection</span>
                    <span className={`w-3 h-3 rounded-full ${stats?.system?.dbAlive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Server Local Time</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold">
                       {currentTime.toLocaleTimeString()}
                    </span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Data Registry</span>
                    <span className="text-xs font-mono text-purple-400 font-bold">{stats?.system?.totalRecords?.toLocaleString()} Entries</span>
                 </div>
                 <div className="pt-8 mt-8 border-t border-white/10">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Core Engine</p>
                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black">{stats?.system?.apiVersion || 'v1.0.5'}</span>
                       <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-black text-indigo-300">SECURE</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
