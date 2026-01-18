import React, { useState, useRef } from 'react';
import medicalService from '../services/medicalService';

const UploadMedicalRecordModal = ({ isOpen, onClose, onRecordUploaded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recordType: 'lab_report',
    fileUrl: '', // In a real app, this would be a file object
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mocking file upload - in a real app, we'd upload to S3/Cloudinary first
      const recordData = {
        ...formData,
        fileName: selectedFile ? selectedFile.name : formData.title + '.pdf',
        fileUrl: 'https://example.com/mock-report.pdf', // Mock URL
      };

      const response = await medicalService.createMedicalRecord(recordData);
      if (response.success) {
        onRecordUploaded();
        onClose();
        setFormData({
          title: '',
          description: '',
          recordType: 'lab_report',
          fileUrl: '',
          notes: '',
        });
        setSelectedFile(null);
      }
    } catch (err) {
      setError('Failed to upload medical record');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Upload Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 text-left">Record Title</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-xl"
              placeholder="e.g. Blood Test Oct 2023"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 text-left">Type</label>
            <select
              name="recordType"
              value={formData.recordType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-xl"
            >
              <option value="lab_report">Lab Report</option>
              <option value="prescription">Prescription</option>
              <option value="referral">Referral</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 text-left">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-xl"
              rows="3"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 text-left">Upload File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div 
              onClick={handleFileClick}
              className="bg-primary-50 p-6 rounded-2xl border-2 border-dashed border-primary-200 text-center cursor-pointer hover:bg-primary-100 transition"
            >
              {selectedFile ? (
                <div>
                  <p className="text-primary-600 font-bold mb-1">📄 {selectedFile.name}</p>
                  <p className="text-xs text-primary-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-primary-600 font-bold mb-1">📎 Click to select file</p>
                  <p className="text-xs text-primary-400">PDF, JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-100"
          >
            {loading ? 'Uploading...' : 'Save Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadMedicalRecordModal;
