import api from '../utils/api';

const medicalService = {
  // Get all medical records for the user
  getMedicalRecords: async (userId) => {
    const response = await api.get('/medical-records', {
      params: { userId },
    });
    return response.data;
  },

  // Create a new medical record (upload)
  createMedicalRecord: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  // Delete a medical record
  deleteMedicalRecord: async (id) => {
    const response = await api.delete(`/medical-records/${id}`);
    return response.data;
  },
};

export default medicalService;
