import api from './api';

// Nurse Dashboard APIs
export const getNurseDashboard = async () => {
  const response = await api.get('/nurse/dashboard');
  return response.data;
};

export const getAssignedPatients = async (params = {}) => {
  const response = await api.get('/nurse/patients', { params });
  return response.data;
};

export const getPatientDetails = async (patientId) => {
  const response = await api.get(`/nurse/patients/${patientId}`);
  return response.data;
};

// Vitals APIs
export const addVitals = async (data) => {
  const response = await api.post('/vitals', data);
  return response.data;
};

export const getPatientVitals = async (patientId) => {
  const response = await api.get(`/vitals/patient/${patientId}`);
  return response.data;
};

export const getTodayVitals = async () => {
  const response = await api.get('/vitals/today');
  return response.data;
};

export const updateVitals = async (vitalId, data) => {
  const response = await api.put(`/vitals/${vitalId}`, data);
  return response.data;
};

// Medication APIs
export const getPatientMedications = async (patientId, params = {}) => {
  const response = await api.get(`/medications/patient/${patientId}`, { params });
  return response.data;
};

export const markMedicationGiven = async (medicationId, data = {}) => {
  const response = await api.post(`/medications/${medicationId}/administer`, data);
  return response.data;
};

export const getTodayMedications = async () => {
  const response = await api.get('/medications/today');
  return response.data;
};

// Nurse Notes APIs
export const addNurseNote = async (data) => {
  const response = await api.post('/nurse-notes', data);
  return response.data;
};

export const getPatientNotes = async (patientId) => {
  const response = await api.get(`/nurse-notes/patient/${patientId}`);
  return response.data;
};

export const updateNurseNote = async (noteId, data) => {
  const response = await api.put(`/nurse-notes/${noteId}`, data);
  return response.data;
};

export const deleteNurseNote = async (noteId) => {
  const response = await api.delete(`/nurse-notes/${noteId}`);
  return response.data;
};

// Notifications APIs
export const getNotifications = async (params = {}) => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

// Profile APIs
export const getNurseProfile = async () => {
  const response = await api.get('/nurse/profile');
  return response.data;
};

export const updateNurseProfile = async (data) => {
  const response = await api.put('/nurse/profile', data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put('/nurse/change-password', data);
  return response.data;
};
