import React, { useState, useEffect } from 'react';
import medicalService from '../services/medicalService';
import api from '../utils/api';
import UploadMedicalRecordModal from '../components/UploadMedicalRecordModal';
import LogMealModal from '../components/LogMealModal';
import ChatWindow from '../components/ChatWindow';
import MedicalRecordDetailsModal from '../components/MedicalRecordDetailsModal';
import DietPlanDetailsModal from '../components/DietPlanDetailsModal';

const HealthDashboard = () => {
  const [records, setRecords] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  
  // Detail Modals
  const [showRecordDetails, setShowRecordDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const [recordsRes, plansRes, mealsRes] = await Promise.all([
        medicalService.getMedicalRecords(),
        api.get('/diet-plans'),
        api.get('/meals'),
      ]);

      if (recordsRes.success) setRecords(recordsRes.data);
      if (plansRes.data.success) setDietPlans(plansRes.data.data);
      if (mealsRes.data.success) setMeals(mealsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRecord = (record) => {
    setSelectedRecord(record);
    setShowRecordDetails(true);
  };

  const handleOpenPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanDetails(true);
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const res = await api.delete(`/medical-records/${id}`);
        if (res.data.success) {
          fetchHealthData();
        }
      } catch (err) {
        console.error('Error deleting record:', err);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical & Nutrition</h1>
            <p className="text-gray-600 mt-2">Manage your medical records and nutrition plans</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowMealModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <span>+</span> Log Meal
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
            >
              <span>+</span> Upload Medical Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medical Records & Meals */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Medical History</h2>
              {records.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {records.map((record) => (
                    <div key={record._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">{record.recordType?.replace('_', ' ')}</span>
                          <span className="text-xs text-gray-400">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{record.title}</h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{record.description}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                         <button 
                           onClick={() => handleOpenRecord(record)}
                           className="text-primary-600 text-sm font-bold hover:underline"
                         >
                           View Details
                         </button>
                         <button 
                           onClick={() => handleDeleteRecord(record._id)}
                           className="text-red-400 text-xs hover:text-red-600"
                         >
                           Delete
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                  <p className="text-gray-400">No medical records uploaded yet.</p>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Meal Intake</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Meal</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Calories</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Macros (P/C/F)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {meals.map(meal => (
                      <tr key={meal._id}>
                        <td className="px-6 py-4 font-bold text-gray-900">{meal.name}</td>
                        <td className="px-6 py-4 capitalize text-gray-500">{meal.mealType}</td>
                        <td className="px-6 py-4 font-bold text-orange-600">{meal.calories} kcal</td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                           {meal.protein}g / {meal.carbs}g / {meal.fats}g
                        </td>
                      </tr>
                    ))}
                    {meals.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">No meals logged yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Diet Plans */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Active Diet Plans</h2>
            {dietPlans.length > 0 ? (
              dietPlans.map((plan) => (
                <div key={plan._id} className="bg-white p-6 rounded-2xl shadow-lg border border-primary-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Macro Targets</p>
                    <div className="grid grid-cols-3 gap-2">
                       <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-[10px] text-gray-400">P</p>
                          <p className="text-xs font-bold">{plan.proteinTarget || 0}g</p>
                       </div>
                       <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-[10px] text-gray-400">C</p>
                          <p className="text-xs font-bold">{plan.carbsTarget || 0}g</p>
                       </div>
                       <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-[10px] text-gray-400">F</p>
                          <p className="text-xs font-bold">{plan.fatTarget || 0}g</p>
                       </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenPlan(plan)}
                    className="w-full mt-6 bg-primary-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-50 transition hover:bg-primary-700"
                  >
                    View Full Plan
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 p-8 rounded-2xl text-center">
                <p className="text-sm text-gray-500">Your expert hasn't assigned a diet plan yet.</p>
              </div>
            )}

            {/* Quick Support Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl text-white shadow-xl shadow-green-100">
                <h4 className="font-bold text-lg mb-2">Need Help? 💬</h4>
                <p className="text-green-50 text-sm mb-4">Chat directly with your assigned medical expert for personalized advice.</p>
                <button 
                  disabled={!dietPlans[0]?.doctor}
                  onClick={() => setActiveChat({ 
                    id: dietPlans[0]?.doctor?._id, 
                    name: dietPlans[0]?.doctor?.name || 'Expert Support' 
                  })}
                  className="w-full bg-white text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition disabled:opacity-50"
                >
                  {dietPlans[0]?.doctor ? 'Start Chat' : 'No Expert Assigned'}
                </button>
            </div>
          </div>
        </div>
      </div>

      <UploadMedicalRecordModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onRecordUploaded={fetchHealthData}
      />
      
      <MedicalRecordDetailsModal
        isOpen={showRecordDetails}
        onClose={() => setShowRecordDetails(false)}
        record={selectedRecord}
      />

      <DietPlanDetailsModal
        isOpen={showPlanDetails}
        onClose={() => setShowPlanDetails(false)}
        plan={selectedPlan}
      />

      <LogMealModal
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        onMealLogged={fetchHealthData}
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

export default HealthDashboard;
