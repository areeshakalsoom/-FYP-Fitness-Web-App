import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import CreateDietPlanModal from '../components/CreateDietPlanModal';
import EditDietPlanModal from '../components/EditDietPlanModal';
import ChatWindow from '../components/ChatWindow';

const DietitianDashboard = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clients');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchDietitianData();
  }, []);

  const fetchDietitianData = async () => {
    try {
      setLoading(true);
      const [clientsRes, plansRes] = await Promise.all([
        api.get('/admin/users?role=user'),
        api.get('/diet-plans'),
      ]);

      if (clientsRes.data.success) setClients(clientsRes.data.data);
      if (plansRes.data.success) setDietPlans(plansRes.data.data);
    } catch (error) {
      console.error('Error fetching dietitian data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Nutrition Studio</h1>
            <p className="text-gray-500 mt-2">Design and manage diet plans for your clients</p>
          </div>
          <button
            onClick={() => setShowPlanModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-orange-100 transition-all flex items-center gap-2 transform hover:-translate-y-1"
          >
            <span>+</span> Create Diet Plan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Clients</p>
                  <p className="text-4xl font-black text-gray-900">{clients.length}</p>
                </div>
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl">🥗</div>
             </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Published Plans</p>
                  <p className="text-4xl font-black text-gray-900">{dietPlans.length}</p>
                </div>
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl">📊</div>
             </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-8 py-5 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'clients' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Client Roster
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-8 py-5 font-bold text-sm transition-all border-b-2 ${
                activeTab === 'plans' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Active Diet Plans
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'clients' && (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="text-gray-400">
                       <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Identification</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Email</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {clients.map(client => (
                         <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                                    {client.name.charAt(0)}
                                  </div>
                                  <span className="font-bold text-gray-900">{client.name}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5 text-gray-500 text-sm">{client.email}</td>
                            <td className="px-6 py-5 text-right flex justify-end gap-3">
                               <Link 
                                 to={`/client/${client._id}`}
                                 className="text-blue-500 font-bold hover:underline"
                               >
                                 Analytics
                               </Link>
                               <button 
                                 onClick={() => setActiveChat({ id: client._id, name: client.name })}
                                 className="text-orange-500 font-bold hover:underline"
                               >
                                 Message
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            )}

            {activeTab === 'plans' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {dietPlans.map(plan => (
                    <div key={plan._id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between mb-4">
                             <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase px-2 py-1 rounded">Active</span>
                             <span className="text-[10px] text-gray-400 uppercase font-black">{new Date(plan.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-black text-gray-900 text-lg mb-1">{plan.title}</h4>
                          <p className="text-xs text-gray-500 mb-6 font-medium">For: {plan.user?.name}</p>
                       </div>
                       <button 
                         onClick={() => {
                           setSelectedPlan(plan);
                           setShowEditModal(true);
                         }}
                         className="w-full bg-white text-orange-500 font-bold py-3 rounded-2xl border border-orange-100 hover:bg-orange-500 hover:text-white transition-all"
                       >
                          Modify Guidelines
                       </button>
                    </div>
                  ))}
               </div>
            )}
          </div>
        </div>
      </div>

      <CreateDietPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanCreated={fetchDietitianData}
      />

      <EditDietPlanModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlan(null);
        }}
        onPlanUpdated={fetchDietitianData}
        plan={selectedPlan}
      />

      {activeChat && (
        <ChatWindow
          receiverId={activeChat.id}
          receiverName={activeChat.name}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default DietitianDashboard;
