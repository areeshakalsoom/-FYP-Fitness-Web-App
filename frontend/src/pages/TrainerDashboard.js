import React, { useState, useEffect } from 'react';
import workoutPlanService from '../services/workoutPlanService';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CreateWorkoutPlanModal from '../components/CreateWorkoutPlanModal';
import AssignPlanModal from '../components/AssignPlanModal';
import ChatWindow from '../components/ChatWindow';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activePlans: 0,
  });
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [teamActivities, setTeamActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [assigningPlan, setAssigningPlan] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const [plansRes, usersRes, activityRes] = await Promise.all([
        workoutPlanService.getWorkoutPlans(),
        adminService.getAllUsers({ role: 'user' }),
        workoutPlanService.getTeamActivities(),
      ]);

      if (plansRes.success) {
        setPlans(plansRes.data);
      }

      if (usersRes.success) {
        setClients(usersRes.data);
        setStats(prev => ({ 
          ...prev, 
          totalClients: usersRes.data.length,
          activePlans: plansRes.data.length 
        }));
      }

      if (activityRes.success) {
        setTeamActivities(activityRes.data);
      }
    } catch (error) {
      console.error('Error fetching trainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await workoutPlanService.deleteWorkoutPlan(id);
        fetchTrainerData();
      } catch (error) {
        alert('Failed to delete plan');
      }
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
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-primary-600 font-black text-xs uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-md">Performance Lab</span>
            <h1 className="text-4xl font-black text-gray-900 mt-2 tracking-tight">Trainer Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your athletes and their dynamic training programs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-primary-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <span className="text-xl">+</span> New Workout Plan
          </button>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Athletes</p>
               <div className="flex items-end gap-3">
                  <p className="text-5xl font-black text-gray-900 leading-none">{stats.totalClients}</p>
                  <span className="text-primary-500 font-bold mb-1 text-xs">Active Roster</span>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Workout Plans</p>
               <p className="text-5xl font-black text-gray-900 leading-none">{stats.activePlans}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
               <p className="text-[10px] font-black text-primary-200 uppercase tracking-[0.2em] mb-4">Average Engagement</p>
               <p className="text-5xl font-black leading-none">
                  {stats.totalClients > 0 ? Math.round((stats.activePlans / stats.totalClients) * 100) : 0}%
               </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Workouts Grid */}
           <div className="lg:col-span-2 space-y-12">
              <div className="space-y-8">
                 <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                    Current Programs
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map(plan => (
                      <div key={plan._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col">
                         <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl text-xl ${
                               plan.difficulty === 'beginner' ? 'bg-green-50' : 
                               plan.difficulty === 'intermediate' ? 'bg-blue-50' : 'bg-red-50'
                            }`}>
                               {plan.difficulty === 'beginner' ? '🌱' : plan.difficulty === 'intermediate' ? '🔥' : '⚡'}
                            </div>
                            <div className="flex gap-1">
                               <button 
                                 onClick={() => setEditingPlan(plan)}
                                 className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center text-sm"
                                 title="Edit Plan"
                               >
                                  ✎
                               </button>
                               <button 
                                 onClick={() => handleDeletePlan(plan._id)}
                                 className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center text-sm"
                                 title="Delete Plan"
                               >
                                  🗑
                               </button>
                            </div>
                         </div>
                         <h4 className="font-black text-gray-900 text-lg mb-1">{plan.title}</h4>
                         <p className="text-xs text-gray-500 mb-4">{plan.exercises?.length} exercises • {plan.difficulty}</p>
                         
                         <div className="mt-auto space-y-4">
                           <div className="flex -space-x-2 overflow-hidden mb-4">
                               {plan.assignedUsers?.slice(0, 5).map(u => (
                                   <div key={u._id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-primary-100 text-primary-600 text-[10px] flex items-center justify-center font-bold" title={u.name}>
                                       {u.name.charAt(0)}
                                   </div>
                               ))}
                               {plan.assignedUsers?.length > 5 && (
                                   <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 text-gray-500 text-[8px] flex items-center justify-center font-bold">
                                       +{plan.assignedUsers.length - 5}
                                   </div>
                               )}
                           </div>
                           <div className="flex gap-2">
                              <button 
                               onClick={() => setAssigningPlan(plan)}
                               className="flex-1 bg-gray-50 text-gray-900 font-bold text-xs py-3 rounded-2xl hover:bg-gray-100 transition"
                              >
                               Assign Users
                              </button>
                              <Link 
                               to={`/workout-plans/${plan._id}`}
                               className="flex-1 bg-primary-600 text-white font-bold text-xs py-3 rounded-2xl shadow-lg shadow-primary-100 hover:bg-primary-700 transition text-center"
                              >
                               Full View
                              </Link>
                           </div>
                         </div>
                      </div>
                    ))}
                    {plans.length === 0 && (
                      <div className="col-span-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-12 text-center">
                         <p className="text-gray-400 font-bold">Start by creating your first professional workout plan.</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Team Activity Feed */}
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                    Recent Team Activity
                </h3>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                   <div className="overflow-x-auto">
                      {teamActivities.length > 0 ? (
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              <th className="px-8 py-4">Athlete</th>
                              <th className="px-8 py-4">Activity</th>
                              <th className="px-8 py-4">Impact</th>
                              <th className="px-8 py-4">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {teamActivities.map((act, idx) => (
                              <tr key={act._id || idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
                                      {act.user?.name.charAt(0)}
                                    </div>
                                    <span className="font-black text-gray-900 text-xs">{act.user?.name}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-700 text-xs capitalize">{act.activityType}</span>
                                    <span className="text-[10px] text-gray-400">{act.duration} mins</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="text-blue-600 font-black text-xs">{act.caloriesBurned} kcal</span>
                                </td>
                                <td className="px-8 py-5 text-[10px] text-gray-400 font-bold">
                                  {new Date(act.date).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-12 text-center text-gray-400 italic">No team activity recorded yet</div>
                      )}
                   </div>
                </div>
              </div>
           </div>

           {/* Athletes Sidebar */}
           <div className="space-y-8">
              <h3 className="text-xl font-black text-gray-900">Elite Athletes</h3>
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 space-y-2">
                 {clients.map(client => (
                    <div key={client._id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border-4 border-gray-50 bg-primary-100 text-primary-700 flex items-center justify-center font-black">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-gray-900 text-sm">{client.name}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Team Member</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <Link 
                            to={`/client/${client._id}`}
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="View Progress"
                          >
                            📈
                          </Link>
                          <button 
                            onClick={() => setActiveChat({ id: client._id, name: client.name })}
                            className="w-10 h-10 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                            title="Chat"
                          >
                            💬
                          </button>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Recruitment card */}
              <div className="bg-gradient-to-tr from-gray-900 to-gray-800 p-8 rounded-[2rem] text-white overflow-hidden relative">
                  <div className="relative z-10">
                    <h4 className="font-black text-lg mb-2">Growth Center 🚀</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6">Assign your expert routines to more athletes to build a stronger community.</p>
                    <Link to="/admin/users" className="block text-center w-full bg-white text-gray-900 font-black py-3 rounded-2xl text-xs hover:bg-primary-50 transition">Review All Users</Link>
                  </div>
                  <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 pointer-events-none">🏋️</div>
              </div>
           </div>
        </div>
      </div>

      <CreateWorkoutPlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPlanCreated={fetchTrainerData}
      />

      {editingPlan && (
        <CreateWorkoutPlanModal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          onPlanCreated={fetchTrainerData}
          plan={editingPlan}
        />
      )}

      {assigningPlan && (
        <AssignPlanModal
          plan={assigningPlan}
          isOpen={!!assigningPlan}
          onClose={() => setAssigningPlan(null)}
          onAssigned={fetchTrainerData}
          clients={clients}
        />
      )}

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

export default TrainerDashboard;
