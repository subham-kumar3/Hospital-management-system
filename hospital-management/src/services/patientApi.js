import api from './api';

export const patientApi = {
  // Dashboard
  getDashboard: () => api.get('/patient/dashboard'),
  
  // Appointments
  getAppointments: () => api.get('/patient/appointments'),
  bookAppointment: (data) => api.post('/patient/appointments', data),
  cancelAppointment: (id) => api.put(`/patient/appointments/${id}/cancel`),
  rescheduleAppointment: (id, data) => api.put(`/patient/appointments/${id}/reschedule`, data),
  
  // Prescriptions
  getPrescriptions: () => api.get('/patient/prescriptions'),
  
  // Medical Records
  getMedicalRecords: () => api.get('/patient/medical-records'),
  
  // Bills
  getBills: () => api.get('/patient/bills'),
  
  // Profile
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  changePassword: (data) => api.put('/patient/change-password', data),
  
  // Notifications
  getNotifications: () => api.get('/patient/notifications'),
  markNotificationRead: (id) => api.put(`/patient/notifications/${id}/read`),
};

export default patientApi;
