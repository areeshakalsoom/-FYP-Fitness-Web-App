import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const Support = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.role === 'admin') {
      fetchAdminFeedback();
    }
  }, [user]);

  const fetchAdminFeedback = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllFeedback();
      if (response.success) {
        setFeedback(response.data);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/feedback', formData);
      if (response.data.success) {
        setSuccess(true);
        setFormData({ subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await adminService.updateFeedbackStatus(id, status);
      if (response.success) {
        fetchAdminFeedback();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className={user.role === 'admin' ? "max-w-7xl mx-auto" : "max-w-2xl mx-auto"}>
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden mb-8">
          <div className="bg-primary-600 p-10 text-white text-center">
            <h1 className="text-4xl font-black mb-2">
              {user.role === 'admin' ? 'Support Inbox' : 'Help & Support'}
            </h1>
            <p className="text-primary-100 opacity-80">
              {user.role === 'admin' ? 'Manage and resolve user feedback and complaints' : "We're here to help you on your fitness journey"}
            </p>
          </div>

          {user.role === 'admin' ? (
             <div className="p-10">
                <div className="space-y-6">
                   {loading ? (
                      <div className="flex justify-center py-12">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                      </div>
                   ) : feedback.length > 0 ? (
                      feedback.map((item) => (
                         <div key={item._id} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start mb-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black">
                                     {item.user?.name.charAt(0)}
                                  </div>
                                  <div>
                                     <h3 className="font-black text-gray-900 leading-tight">{item.subject}</h3>
                                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        From: {item.user?.name} ({item.user?.email})
                                     </p>
                                  </div>
                               </div>
                               <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full shadow-sm ${
                                  item.status === 'pending' ? 'bg-rose-100 text-rose-600' :
                                  item.status === 'reviewed' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                               }`}>
                                  {item.status}
                               </span>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl text-gray-700 text-sm mb-8 border border-gray-100 leading-relaxed shadow-inner">
                               {item.message}
                            </div>

                            <div className="flex gap-4">
                               <button
                                 onClick={() => handleUpdateStatus(item._id, 'reviewed')}
                                 className="flex-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                               >
                                 Keep Under Review
                               </button>
                               <button
                                 onClick={() => handleUpdateStatus(item._id, 'resolved')}
                                 className="flex-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                               >
                                 Finalize & Resolve
                               </button>
                            </div>
                            <div className="mt-4 text-[9px] text-gray-300 font-bold text-center italic">
                               Received on {new Date(item.createdAt).toLocaleString()}
                            </div>
                         </div>
                      ))
                   ) : (
                      <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                         <p className="text-gray-400 font-bold">No support requests found.</p>
                      </div>
                   )}
                </div>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {success && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <p className="font-bold">Your feedback has been submitted successfully!</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 focus:outline-none transition-all text-gray-900 font-medium"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  rows="6"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 focus:outline-none transition-all text-gray-900 font-medium"
                  placeholder="Describe your issue or suggestion..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-100 transition-all disabled:opacity-50 transform hover:-translate-y-1"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          {user.role !== 'admin' && (
            <div className="p-10 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-6">
               <div className="text-center">
                  <p className="text-2xl mb-2">📧</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Platform Support</p>
                  <p className="text-sm font-bold text-gray-900">ops@fit-tracker.io</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl mb-2">🛡️</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Security Desk</p>
                  <p className="text-sm font-bold text-gray-900">Report via inbox</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
