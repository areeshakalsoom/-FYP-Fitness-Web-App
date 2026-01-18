import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ChatWindow from '../components/ChatWindow';
import CreateMedicalRecordModal from '../components/CreateMedicalRecordModal';
import MedicalRecordDetailsModal from '../components/MedicalRecordDetailsModal';
import CreateDietPlanModal from '../components/CreateDietPlanModal';
import EditDietPlanModal from '../components/EditDietPlanModal';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);
  const [showEditDietModal, setShowEditDietModal] = useState(false);
  const [selectedDietPlan, setSelectedDietPlan] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const [patientsRes, recordsRes, plansRes, mealsRes] = await Promise.all([
        api.get('/admin/users?role=user'),
        api.get('/medical-records'),
        api.get('/diet-plans'),
        api.get('/meals')
      ]);

      if (patientsRes.data.success) setPatients(patientsRes.data.data);
      if (recordsRes.data.success) setMedicalRecords(recordsRes.data.data);
      if (plansRes.data.success) setDietPlans(plansRes.data.data);
      if (mealsRes.data.success) setMeals(mealsRes.data.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Medical & Nutrition Portal
            </h1>
            <p className="text-gray-500 mt-2">Comprehensive patient care and dietary management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRecordModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
            >
              + Medical Record
            </button>
            <button
              onClick={() => setShowDietPlanModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-orange-100 transition-all transform hover:-translate-y-1"
            >
              + Diet Plan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Patients</p>
              <p className="text-4xl font-black text-indigo-600 mt-1">{patients.length}</p>
            </div>
            <div className="text-5xl opacity-20">🏥</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Medical Records</p>
              <p className="text-4xl font-black text-rose-500 mt-1">{medicalRecords.length}</p>
            </div>
            <div className="text-5xl opacity-20">📋</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Diet Plans</p>
              <p className="text-4xl font-black text-orange-500 mt-1">{dietPlans.length}</p>
            </div>
            <div className="text-5xl opacity-20">🥗</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === 'patients' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            👥 Patient Directory
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === 'records' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            🏥 Medical Records
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === 'diet' ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            🥗 Diet Plans
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === 'meals' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            🍎 Meal History
          </button>
        </div>

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Name</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                           {patient.name.charAt(0)}
                         </div>
                         <span className="font-bold text-gray-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-500">{patient.email}</td>
                    <td className="px-8 py-5 flex gap-4">
                      <Link 
                        to={`/client/${patient._id}`}
                        className="text-indigo-600 font-bold text-sm hover:underline"
                      >
                        View Profile
                      </Link>
                      <button 
                        onClick={() => setActiveChat({ id: patient._id, name: patient.name })}
                        className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100 transition"
                      >
                        💬 Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'records' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalRecords.map((record) => (
              <div key={record._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-indigo-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-tighter">
                    {record.recordType?.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-gray-400 font-bold">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate">{record.title}</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Patient: {record.user?.name}</p>
                <button 
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowDetailsModal(true);
                  }}
                  className="w-full bg-gray-50 text-gray-900 font-bold text-sm py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
                >
                  Open Document
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Diet Plans Tab */}
        {activeTab === 'diet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((plan) => (
              <div key={plan._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase px-2 py-1 rounded">Active</span>
                    <span className="text-[10px] text-gray-400 uppercase font-black">{new Date(plan.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-lg mb-1">{plan.title}</h4>
                  <p className="text-xs text-gray-500 mb-4 font-medium">For: {plan.user?.name}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-orange-50 rounded-lg">
                      <p className="text-[9px] text-gray-500">Calories</p>
                      <p className="font-bold text-orange-600 text-sm">{plan.calorieTarget || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-[9px] text-gray-500">Protein</p>
                      <p className="font-bold text-blue-600 text-sm">{plan.proteinTarget || 0}g</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <p className="text-[9px] text-gray-500">Carbs</p>
                      <p className="font-bold text-green-600 text-sm">{plan.carbsTarget || 0}g</p>
                    </div>
                    <div className="text-center p-2 bg-rose-50 rounded-lg">
                      <p className="text-[9px] text-gray-500">Fats</p>
                      <p className="font-bold text-rose-600 text-sm">{plan.fatTarget || 0}g</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedDietPlan(plan);
                    setShowEditDietModal(true);
                  }}
                  className="w-full bg-white text-orange-500 font-bold py-3 rounded-2xl border border-orange-100 hover:bg-orange-500 hover:text-white transition-all"
                >
                  Edit Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Meal History Tab */}
        {activeTab === 'meals' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Meal</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Calories</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Macros (P/C/F)</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {meals.map((meal) => (
                  <tr key={meal._id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{meal.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-900">{meal.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{meal.mealType}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-emerald-600">{meal.calories} kcal</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {meal.protein}g / {meal.carbs}g / {meal.fats}g
                    </td>
                    <td className="px-8 py-5 text-gray-400 text-xs">
                      {new Date(meal.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {meals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-400">No meal logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateMedicalRecordModal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        onRecordCreated={fetchDoctorData}
      />

      <MedicalRecordDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
      />

      <CreateDietPlanModal
        isOpen={showDietPlanModal}
        onClose={() => setShowDietPlanModal(false)}
        onPlanCreated={fetchDoctorData}
      />

      <EditDietPlanModal
        isOpen={showEditDietModal}
        onClose={() => {
          setShowEditDietModal(false);
          setSelectedDietPlan(null);
        }}
        onPlanUpdated={fetchDoctorData}
        plan={selectedDietPlan}
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

export default DoctorDashboard;
