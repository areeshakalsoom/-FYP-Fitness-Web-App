import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Debug: Log user object structure on mount
  useEffect(() => {
    console.log('ChatWindow - Full user object:', user);
    console.log('ChatWindow - user.id:', user?.id);
    console.log('ChatWindow - user._id:', user?._id);
  }, [user]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Faster polling: 2s for better real-time feel
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/${receiverId}`);
      if (response.data.success) {
        const fetchedMessages = response.data.data;
        
        // Debug: Log to see the structure
        if (fetchedMessages.length > 0) {
          console.log('Sample message:', fetchedMessages[0]);
          console.log('Current user ID:', user.id);
          console.log('Sender from message:', fetchedMessages[0].sender);
        }
        
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post('/chat', {
        receiverId,
        content: newMessage,
      });
      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[300] flex flex-col h-[550px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-2xl flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">{receiverName}</p>
          <p className="text-[10px] opacity-80 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          // Multiple ways to compare sender ID
          const senderId = msg.sender?._id || msg.sender;
          const currentUserId = user.id || user._id;
          
          const isMe = String(senderId) === String(currentUserId);
          
          // Debug log for first message
          if (idx === 0) {
            console.log('Message comparison:', {
              senderId: senderId,
              currentUserId: currentUserId,
              isMe: isMe,
              senderType: typeof senderId,
              userType: typeof currentUserId
            });
          }
          
          return (
            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Sender Label */}
                <p className={`text-[10px] font-bold mb-1 px-2 ${
                  isMe ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {isMe ? 'You' : receiverName.split('(')[0].trim()}
                </p>
                
                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl shadow-md ${
                  isMe 
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                  
                  {/* Timestamp */}
                  <div className={`flex items-center gap-1 mt-2 ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}>
                    <p className={`text-[9px] ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {isMe && (
                      <span className="text-[9px] text-primary-100">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-600 text-white px-5 py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
          >
            <span className="text-lg">✈️</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
