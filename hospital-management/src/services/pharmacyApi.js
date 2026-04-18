import api from './api';

// Medicine APIs
export const medicineAPI = {
  getAll: (params) => api.get('/pharmacy/medicines', { params }),
  getById: (id) => api.get(`/pharmacy/medicines/${id}`),
  create: (data) => api.post('/pharmacy/medicines', data),
  update: (id, data) => api.put(`/pharmacy/medicines/${id}`, data),
  updateStock: (id, data) => api.patch(`/pharmacy/medicines/${id}/stock`, data),
  delete: (id) => api.delete(`/pharmacy/medicines/${id}`),
  getLowStockAlerts: () => api.get('/pharmacy/medicines/alerts/low-stock'),
  getExpired: () => api.get('/pharmacy/medicines/alerts/expired'),
  getStats: () => api.get('/pharmacy/medicines/stats')
};

// Prescription APIs
export const prescriptionAPI = {
  getAll: (params) => api.get('/pharmacy/prescriptions', { params }),
  getById: (id) => api.get(`/pharmacy/prescriptions/${id}`),
  dispense: (id, data) => api.put(`/pharmacy/prescriptions/${id}/dispense`, data),
  getToday: () => api.get('/pharmacy/prescriptions/today'),
  getPending: () => api.get('/pharmacy/prescriptions/pending'),
  getStats: () => api.get('/pharmacy/prescriptions/stats')
};

// Bill APIs
export const billAPI = {
  getAll: (params) => api.get('/pharmacy/bills', { params }),
  getById: (id) => api.get(`/pharmacy/bills/${id}`),
  create: (data) => api.post('/pharmacy/bills', data),
  updatePayment: (id, data) => api.put(`/pharmacy/bills/${id}/payment`, data),
  createFromPrescription: (data) => api.post('/pharmacy/bills/from-prescription', data),
  getStats: () => api.get('/pharmacy/bills/stats')
};

// Purchase APIs
export const purchaseAPI = {
  getAll: (params) => api.get('/pharmacy/purchases', { params }),
  getById: (id) => api.get(`/pharmacy/purchases/${id}`),
  create: (data) => api.post('/pharmacy/purchases', data),
  updateDelivery: (id, data) => api.put(`/pharmacy/purchases/${id}/delivery`, data),
  updatePayment: (id, data) => api.put(`/pharmacy/purchases/${id}/payment`, data),
  delete: (id) => api.delete(`/pharmacy/purchases/${id}`),
  getStats: () => api.get('/pharmacy/purchases/stats')
};
