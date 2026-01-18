import React, { useState } from 'react';
import workoutPlanService from '../services/workoutPlanService';

const AssignPlanModal = ({ isOpen, onClose, onAssigned, plan, clients }) => {
  const [selectedUsers, setSelectedUsers] = useState(plan?.assignedUsers?.map(u => u._id || u) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await workoutPlanService.assignWorkoutPlan(plan._id, selectedUsers);
      if (response.success) {
        onAssigned();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign plan');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Manage Athletes</h3>
            <p className="text-gray-500 text-sm">Assign "{plan.title}" to your team</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl">×</button>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm mb-6">{error}</div>}

        <div className="max-h-[40vh] overflow-y-auto mb-8 space-y-2 pr-2">
          {clients.map(client => (
            <button
              key={client._id}
              onClick={() => toggleUser(client._id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                selectedUsers.includes(client._id)
                  ? 'bg-primary-50 border-primary-200 ring-2 ring-primary-100'
                  : 'bg-white border-gray-100 hover:border-primary-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                  selectedUsers.includes(client._id) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {client.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{client.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black">{client.email}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedUsers.includes(client._id) ? 'bg-primary-600 border-primary-600' : 'border-gray-200'
              }`}>
                {selectedUsers.includes(client._id) && <span className="text-white text-xs">✓</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-100 hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sync Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPlanModal;
