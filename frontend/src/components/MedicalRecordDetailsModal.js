import React from 'react';

const MedicalRecordDetailsModal = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">{record.title}</h3>
            <p className="text-indigo-100 text-sm mt-1">
              {new Date(record.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Record Type Badge */}
          <div className="flex items-center gap-3">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              {record.recordType?.replace('_', ' ')}
            </span>
            <span className="text-gray-400 text-sm">
              Record ID: {record._id?.slice(-8)}
            </span>
          </div>

          {/* Patient Info */}
          {record.user && (
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Information</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                  {record.user.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{record.user.name || 'Patient'}</p>
                  <p className="text-sm text-gray-500">{record.user.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {record.description && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">{record.description}</p>
            </div>
          )}

          {/* Diagnosis */}
          {record.diagnosis && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                <p className="text-gray-900 font-medium">{record.diagnosis}</p>
              </div>
            </div>
          )}

          {/* Treatment */}
          {record.treatment && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Treatment Plan</h4>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <p className="text-gray-900">{record.treatment}</p>
              </div>
            </div>
          )}

          {/* Prescription */}
          {record.prescription && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Prescription</h4>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <p className="text-gray-900 whitespace-pre-line">{record.prescription}</p>
              </div>
            </div>
          )}

          {/* Vital Signs */}
          {record.vitals && Object.values(record.vitals).some(v => v) && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Vital Signs</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {record.vitals.bloodPressureSystolic && record.vitals.bloodPressureDiastolic && (
                  <div className="bg-red-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                    <p className="text-2xl font-bold text-red-600">
                      {record.vitals.bloodPressureSystolic}/{record.vitals.bloodPressureDiastolic}
                    </p>
                    <p className="text-xs text-gray-400">mmHg</p>
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div className="bg-pink-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                    <p className="text-2xl font-bold text-pink-600">{record.vitals.heartRate}</p>
                    <p className="text-xs text-gray-400">bpm</p>
                  </div>
                )}
                {record.vitals.temperature && (
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Temperature</p>
                    <p className="text-2xl font-bold text-orange-600">{record.vitals.temperature}</p>
                    <p className="text-xs text-gray-400">°C</p>
                  </div>
                )}
                {record.vitals.weight && (
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                    <p className="text-2xl font-bold text-purple-600">{record.vitals.weight}</p>
                    <p className="text-xs text-gray-400">kg</p>
                  </div>
                )}
                {record.vitals.oxygenSaturation && (
                  <div className="bg-cyan-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 mb-1">SpO2</p>
                    <p className="text-2xl font-bold text-cyan-600">{record.vitals.oxygenSaturation}</p>
                    <p className="text-xs text-gray-400">%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Additional Notes</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-700 text-sm whitespace-pre-line">{record.notes}</p>
              </div>
            </div>
          )}

          {/* File Attachment */}
          {record.fileUrl && (
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Attached Document</h4>
              <div className="bg-indigo-50 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{record.fileName || 'Medical Document'}</p>
                    <p className="text-xs text-gray-500">Click to view or download</p>
                  </div>
                </div>
                <a
                  href={record.fileUrl.startsWith('http') ? record.fileUrl : `http://localhost:5002/${record.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition"
                >
                  Open File
                </a>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 font-bold mb-1">Created By</p>
                <p className="text-gray-900">{record.doctor?.name || 'Dr. ' + (record.createdBy?.name || 'Unknown')}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold mb-1">Created On</p>
                <p className="text-gray-900">{new Date(record.createdAt || record.date).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-3xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Close
          </button>
          {record.fileUrl && (
            <a
              href={record.fileUrl.startsWith('http') ? record.fileUrl : `http://localhost:5002/${record.fileUrl}`}
              download
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-center"
            >
              Download Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailsModal;
