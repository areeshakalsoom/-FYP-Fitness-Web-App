import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import CreateUserModal from '../components/CreateUserModal';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', isActive: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(filter);
      if (response.success) setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const response = await adminService.updateUserStatus(userId, !currentStatus);
      if (response.success) fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await adminService.deleteUser(userId);
        if (response.success) fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/admin" className="text-sm font-black text-indigo-600 uppercase tracking-widest hover:underline mb-2 block">← Back to Dashboard</Link>
            <h1 className="text-4xl font-black text-gray-900">User Management Panel</h1>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition flex items-center gap-3 shadow-xl"
          >
            <span>+</span> Create New Account
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2rem] shadow-sm p-8 mb-8 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by Role</label>
              <select
                value={filter.role}
                onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="">All Roles</option>
                <option value="user">Standard User</option>
                <option value="trainer">Fitness Trainer</option>
                <option value="doctor">Medical Doctor</option>
                <option value="dietitian">Nutrition Dietitian</option>
                <option value="admin">Administrator</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</label>
              <select
                value={filter.isActive}
                onChange={(e) => setFilter({ ...filter, isActive: e.target.value })}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="">All Accounts</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
           </div>
           <div className="flex items-end">
              <button
                onClick={() => setFilter({ role: '', isActive: '' })}
                className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition"
              >
                Reset All Filters
              </button>
           </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Guardian / Member</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Presence</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   <tr>
                      <td colSpan="4" className="px-8 py-24 text-center">
                         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                      </td>
                   </tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                             {u.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-gray-900">{u.name}</p>
                             <p className="text-xs text-gray-400 font-bold">{u.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm ${
                          u.role === 'admin' ? 'bg-black text-white' :
                          u.role === 'trainer' ? 'bg-blue-100 text-blue-700' :
                          u.role === 'doctor' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                       }`}>
                          {u.role}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                          <span className="text-sm font-bold text-gray-600">{u.isActive ? 'Active' : 'Disabled'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusToggle(u._id, u.isActive)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                            }`}
                          >
                            {u.isActive ? 'Suspend' : 'Reinstate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Purge
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && users.length === 0 && (
            <div className="px-8 py-20 text-center">
               <p className="text-gray-400 font-bold">No accounts match your criteria.</p>
            </div>
          )}
        </div>

        {/* Registration Summary */}
        <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] shadow-2xl text-white">
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="text-xl font-black">Admin Management Insight</h4>
                 <p className="text-indigo-100 text-sm font-medium mt-1">
                    Showing {users.length} active management records sourced from the primary database.
                 </p>
              </div>
              <div className="text-right">
                 <p className="text-4xl font-black">{users.length}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total Entries</p>
              </div>
           </div>
        </div>

        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUserCreated={fetchUsers}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
