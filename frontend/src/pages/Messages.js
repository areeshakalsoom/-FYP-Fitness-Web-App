import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import api from '../utils/api';

const Messages = () => {
  const { user } = useAuth();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch experts using the new public endpoint
      const response = await api.get('/admin/experts');
      
      if (response.data.success) {
        // Map to add expertType with proper capitalization
        const mappedExperts = response.data.data.map(expert => ({
          ...expert,
          expertType: expert.role.charAt(0).toUpperCase() + expert.role.slice(1)
        }));
        
        setExperts(mappedExperts);
      } else {
        setError('Failed to load experts');
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
      setError('Unable to load experts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getExpertIcon = (type) => {
    switch (type) {
      case 'Trainer': return '🏋️';
      case 'Doctor': return '⚕️';
      case 'Dietitian': return '🥗';
      default: return '👤';
    }
  };

  const getExpertColor = (type) => {
    switch (type) {
      case 'Trainer': return 'from-blue-500 to-blue-600';
      case 'Doctor': return 'from-red-500 to-red-600';
      case 'Dietitian': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Chat with your fitness experts</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">💬 How to Use Messages</h3>
          <p className="text-blue-700 text-sm">
            Click on any expert below to start a conversation. You can ask questions about your workout plans, 
            diet recommendations, or health concerns. Messages are saved and you can continue conversations anytime.
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <div 
              key={expert._id} 
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
            >
              <div className={`bg-gradient-to-r ${getExpertColor(expert.expertType)} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getExpertIcon(expert.expertType)}</span>
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{expert.expertType}</p>
                    <h3 className="text-xl font-bold">{expert.name}</h3>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Email:</span> {expert.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Role:</span> {expert.expertType}
                  </p>
                </div>

                <button
                  onClick={() => setActiveChat({ id: expert._id, name: expert.name, type: expert.expertType })}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  💬 Start Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {experts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Experts Available</h2>
            <p className="text-gray-600">
              There are currently no trainers, doctors, or dietitians available to chat with.
            </p>
          </div>
        )}
      </div>

      {activeChat && (
        <ChatWindow
          receiverId={activeChat.id}
          receiverName={`${activeChat.name} (${activeChat.type})`}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Messages;
