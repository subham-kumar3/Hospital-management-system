const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  resetPassword,
  bulkImportUsers,
  getAdminLogs,
  getAllPatients,
  updatePatient,
  deletePatient,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getFinancialOverview,
  getReports,
  getNotifications,
  createNotification
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Admin Logs
router.get('/logs', getAdminLogs);

// User Management
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.post('/users/bulk-import', bulkImportUsers);

router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', updateUserStatus);
router.post('/users/:id/reset-password', resetPassword);
router.delete('/users/:id', deleteUser);

// Patients Management
router.route('/patients')
  .get(getAllPatients);

router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

// Appointments Management
router.route('/appointments')
  .get(getAllAppointments);

router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

// Financial
router.get('/financial', getFinancialOverview);

// Reports
router.get('/reports', getReports);

// Notifications
router.route('/notifications')
  .get(getNotifications)
  .post(createNotification);

module.exports = router;
