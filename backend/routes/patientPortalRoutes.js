const express = require('express');
const router = express.Router();
const {
  getPatientDashboard,
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getPatientPrescriptions,
  getPatientMedicalRecords,
  getPatientBills,
  getPatientProfile,
  updatePatientProfile,
  changePassword,
  getNotifications,
  markNotificationRead
} = require('../controllers/patientPortalController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Patient role
router.use(protect);
router.use(authorize('Patient'));

// Dashboard
router.get('/dashboard', getPatientDashboard);

// Appointments
router.route('/appointments')
  .get(getPatientAppointments)
  .post(bookAppointment);

router.put('/appointments/:id/cancel', cancelAppointment);
router.put('/appointments/:id/reschedule', rescheduleAppointment);

// Prescriptions
router.get('/prescriptions', getPatientPrescriptions);

// Medical Records
router.get('/medical-records', getPatientMedicalRecords);

// Bills
router.get('/bills', getPatientBills);

// Profile
router.route('/profile')
  .get(getPatientProfile)
  .put(updatePatientProfile);

// Change Password
router.put('/change-password', changePassword);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
