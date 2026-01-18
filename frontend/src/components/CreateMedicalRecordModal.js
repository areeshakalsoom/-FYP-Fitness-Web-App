import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const CreateMedicalRecordModal = ({ isOpen, onClose, onRecordCreated }) => {
  const [formData, setFormData] = useState({
    user: '',
    title: '',
    recordType: 'checkup',
    date: new Date().toISOString().split('T')[0],
    description: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    vitals: {
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      weight: '',
      oxygenSaturation: '',
    },
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVitals, setShowVitals] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/admin/users?role=user');
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleVitalChange = (field, value) => {
    setFormData({
      ...formData,
      vitals: {
        ...formData.vitals,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/medical-records', formData);
      if (response.data.success) {
        onRecordCreated();
        onClose();
        setFormData({
          user: '',
          title: '',
          recordType: 'checkup',
          date: new Date().toISOString().split('T')[0],
          description: '',
          diagnosis: '',
          treatment: '',
          prescription: '',
          vitals: {
            bloodPressureSystolic: '',
            bloodPressureDiastolic: '',
            heartRate: '',
            temperature: '',
            weight: '',
            oxygenSaturation: '',
          },
        });
        setShowVitals(false);
      }
    } catch (err) {
      console.error('Error creating medical record:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-600 text-white">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">New Lab Report</h2>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-transform">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Assign Patient</label>
            <select
              required
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
            >
              <option value="">Select a patient</option>
              {patients.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Report Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
              placeholder="e.g. Annual Blood Panel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Category</label>
               <select
                 value={formData.recordType}
                 onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                 className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
               >
                 <option value="checkup">General Checkup</option>
                 <option value="lab_result">Lab Results</option>
                 <option value="vaccination">Vaccination</option>
                 <option value="prescription">Prescription</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date</label>
               <input
                 type="date"
                 required
                 value={formData.date}
                 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                 className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Clinical Observations</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
              placeholder="Enter detailed report summaries here..."
            ></textarea>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Diagnosis</label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
              placeholder="Primary diagnosis..."
            />
          </div>

          {/* Treatment */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Treatment Plan</label>
            <textarea
              rows="2"
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
              placeholder="Recommended treatment..."
            ></textarea>
          </div>

          {/* Prescription */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Prescription</label>
            <textarea
              rows="2"
              value={formData.prescription}
              onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none font-bold text-gray-900"
              placeholder="Medications and dosage..."
            ></textarea>
          </div>

          {/* Vitals Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowVitals(!showVitals)}
              className="w-full bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition flex items-center justify-between px-5"
            >
              <span>📊 Record Vital Signs</span>
              <span>{showVitals ? '▼' : '▶'}</span>
            </button>
          </div>

          {/* Vitals Section */}
          {showVitals && (
            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border-2 border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase">Patient Vitals</p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Blood Pressure */}
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Blood Pressure (mmHg)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={formData.vitals.bloodPressureSystolic}
                      onChange={(e) => handleVitalChange('bloodPressureSystolic', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="120"
                    />
                    <span className="font-bold text-gray-400">/</span>
                    <input
                      type="number"
                      value={formData.vitals.bloodPressureDiastolic}
                      onChange={(e) => handleVitalChange('bloodPressureDiastolic', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="80"
                    />
                  </div>
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={formData.vitals.heartRate}
                    onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="72"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vitals.temperature}
                    onChange={(e) => handleVitalChange('temperature', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="36.6"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vitals.weight}
                    onChange={(e) => handleVitalChange('weight', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="70"
                  />
                </div>

                {/* Oxygen Saturation */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={formData.vitals.oxygenSaturation}
                    onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="98"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
          >
            {loading ? 'Submitting...' : 'Finalize & Publish Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMedicalRecordModal;
