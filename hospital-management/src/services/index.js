import api from './api';

export const patientService = {
  // Get all patients
  getAllPatients: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  // Get single patient
  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Search patients
  searchPatients: async (keyword) => {
    const response = await api.get(`/patients/search/${keyword}`);
    return response.data;
  }
};

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  // Get single doctor
  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Create new doctor
  createDoctor: async (doctorData) => {
    const response = await api.post('/doctors', doctorData);
    return response.data;
  },

  // Update doctor
  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },

  // Delete doctor
  deleteDoctor: async (id) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  },

  // Search doctors
  searchDoctors: async (keyword) => {
    const response = await api.get(`/doctors/search/${keyword}`);
    return response.data;
  },

  // Get doctors by department
  getDoctorsByDepartment: async (department) => {
    const response = await api.get(`/doctors/department/${department}`);
    return response.data;
  }
};

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  // Get single appointment
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Get appointments by date
  getAppointmentsByDate: async (date) => {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  },

  // Get appointments by status
  getAppointmentsByStatus: async (status) => {
    const response = await api.get(`/appointments/status/${status}`);
    return response.data;
  }
};

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const prescriptionService = {
  // Get all prescriptions
  getAllPrescriptions: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  // Get single prescription
  getPrescription: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  // Create prescription
  createPrescription: async (prescriptionData) => {
    const response = await api.post('/prescriptions', prescriptionData);
    return response.data;
  },

  // Update prescription
  updatePrescription: async (id, prescriptionData) => {
    const response = await api.put(`/prescriptions/${id}`, prescriptionData);
    return response.data;
  },

  // Delete prescription
  deletePrescription: async (id) => {
    const response = await api.delete(`/prescriptions/${id}`);
    return response.data;
  },

  // Get prescriptions by patient
  getPrescriptionsByPatient: async (patientId) => {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  },

  // Get prescriptions by doctor
  getPrescriptionsByDoctor: async (doctorId) => {
    const response = await api.get(`/prescriptions/doctor/${doctorId}`);
    return response.data;
  }
};

export const billService = {
  // Get all bills
  getAllBills: async () => {
    const response = await api.get('/bills');
    return response.data;
  },

  // Get single bill
  getBill: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Create bill
  createBill: async (billData) => {
    const response = await api.post('/bills', billData);
    return response.data;
  },

  // Update bill
  updateBill: async (id, billData) => {
    const response = await api.put(`/bills/${id}`, billData);
    return response.data;
  },

  // Make payment
  makePayment: async (id, paymentData) => {
    const response = await api.put(`/bills/${id}/payment`, paymentData);
    return response.data;
  },

  // Delete bill
  deleteBill: async (id) => {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  },

  // Get bills by patient
  getBillsByPatient: async (patientId) => {
    const response = await api.get(`/bills/patient/${patientId}`);
    return response.data;
  },

  // Get billing stats
  getBillingStats: async () => {
    const response = await api.get('/bills/stats/summary');
    return response.data;
  }
};

export const enquiryService = {
  // Get all enquiries
  getAllEnquiries: async () => {
    const response = await api.get('/enquiries');
    return response.data;
  },

  // Get single enquiry
  getEnquiry: async (id) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  },

  // Create enquiry
  createEnquiry: async (enquiryData) => {
    const response = await api.post('/enquiries', enquiryData);
    return response.data;
  },

  // Update enquiry
  updateEnquiry: async (id, enquiryData) => {
    const response = await api.put(`/enquiries/${id}`, enquiryData);
    return response.data;
  },

  // Delete enquiry
  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  },

  // Get enquiries by status
  getEnquiriesByStatus: async (status) => {
    const response = await api.get(`/enquiries/status/${status}`);
    return response.data;
  }
};

export const notificationService = {
  // Get user notifications
  getUserNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  }
};

export const authProfileService = {
  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Users
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  resetPassword: async (id) => {
    const response = await api.post(`/admin/users/${id}/reset-password`);
    return response.data;
  },

  updateUserStatus: async (id, status) => {
    const response = await api.put(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  bulkImportUsers: async (formData) => {
    const response = await api.post('/admin/users/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Patients
  getAllPatients: async (params = {}) => {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },

  updatePatient: async (id, data) => {
    const response = await api.put(`/admin/patients/${id}`, data);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  },

  // Appointments
  getAllAppointments: async (params = {}) => {
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  },

  updateAppointment: async (id, data) => {
    const response = await api.put(`/admin/appointments/${id}`, data);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  // Financial
  getFinancialOverview: async () => {
    const response = await api.get('/admin/financial');
    return response.data;
  },

  // Reports
  getReports: async (params = {}) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get('/admin/notifications');
    return response.data;
  },

  createNotification: async (data) => {
    const response = await api.post('/admin/notifications', data);
    return response.data;
  }
};

export const inventoryService = {
  getInventoryStats: async () => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },

  getLowStockMedicines: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },

  getExpiringMedicines: async (days = 90) => {
    const response = await api.get('/inventory/expiring', { params: { days } });
    return response.data;
  },

  updateStock: async (id, stockData) => {
    const response = await api.put(`/inventory/${id}/stock`, stockData);
    return response.data;
  },

  generatePurchaseOrder: async () => {
    const response = await api.post('/inventory/purchase-order');
    return response.data;
  }
};

export const labAdminService = {
  getLabStats: async () => {
    const response = await api.get('/lab-admin/stats');
    return response.data;
  },

  getAllLabTests: async (params = {}) => {
    const response = await api.get('/lab-admin/tests', { params });
    return response.data;
  },

  assignTechnician: async (testId, technicianId) => {
    const response = await api.put(`/lab-admin/tests/${testId}/assign`, { technicianId });
    return response.data;
  },

  getTechnicianWorkload: async () => {
    const response = await api.get('/lab-admin/technicians/workload');
    return response.data;
  },

  generateLabReport: async (params = {}) => {
    const response = await api.get('/lab-admin/reports', { params });
    return response.data;
  }
};

export const exportService = {
  exportPatients: async (format = 'excel') => {
    const response = await api.post('/export/patients', { format }, { responseType: 'blob' });
    return response;
  },

  exportDoctors: async (format = 'excel') => {
    const response = await api.post('/export/doctors', { format }, { responseType: 'blob' });
    return response;
  },

  exportAppointments: async (format = 'excel') => {
    const response = await api.post('/export/appointments', { format }, { responseType: 'blob' });
    return response;
  },

  exportLabTests: async (format = 'excel') => {
    const response = await api.post('/export/lab-tests', { format }, { responseType: 'blob' });
    return response;
  },

  exportMedicines: async (format = 'excel') => {
    const response = await api.post('/export/medicines', { format }, { responseType: 'blob' });
    return response;
  },

  exportFinancial: async (format = 'excel') => {
    const response = await api.post('/export/financial', { format }, { responseType: 'blob' });
    return response;
  }
};

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },

  updateHospitalInfo: async (data) => {
    const response = await api.put('/settings/hospital-info', data);
    return response.data;
  },

  backupDatabase: async () => {
    const response = await api.post('/settings/backup');
    return response.data;
  },

  getActivityLogs: async (params = {}) => {
    const response = await api.get('/settings/activity-logs', { params });
    return response.data;
  }
};
