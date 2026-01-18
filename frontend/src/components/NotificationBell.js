import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDrawer(!showDrawer)}
        className="p-2 text-gray-400 hover:text-primary-600 transition relative"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showDrawer && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h4 className="font-bold text-gray-900">Notifications</h4>
            <button onClick={() => setShowDrawer(false)} className="text-gray-400 text-sm">Close</button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div 
                  key={n._id} 
                  onClick={() => markAsRead(n._id)}
                  className={`p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <span className="text-xl">
                      {n.type === 'reminder' ? '⏰' : n.type === 'motivational' ? '✨' : 'ℹ️'}
                    </span>
                    <div>
                      <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
