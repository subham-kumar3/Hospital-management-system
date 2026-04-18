import api from './api';

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Patients
  getPatients: (params) => api.get('/admin/patients', { params }),
  updatePatient: (id, data) => api.put(`/admin/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
  
  // Appointments
  getAppointments: (params) => api.get('/admin/appointments', { params }),
  updateAppointment: (id, data) => api.put(`/admin/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/admin/appointments/${id}`),
  
  // Financial
  getFinancial: () => api.get('/admin/financial'),
  
  // Reports
  getReports: (type) => api.get('/admin/reports', { params: { type } }),
  
  // Notifications
  getNotifications: () => api.get('/admin/notifications'),
  createNotification: (data) => api.post('/admin/notifications', data),
};

export default adminApi;
