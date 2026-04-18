const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDoctorDashboard,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPatients,
  getPatientCompleteDetails,
  createPrescription,
  updatePrescription,
  orderLabTest,
  getDoctorLabTests,
  addDoctorNote,
  getDoctorNotes,
  updateDoctorNote,
  getDoctorNotifications,
  markNotificationRead
} = require('../controllers/doctorPortalController');

// All routes require authentication and Doctor role
router.use(protect);
router.use(authorize('Doctor'));

// Dashboard
router.get('/dashboard', getDoctorDashboard);

// Appointments
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

// Patients
router.get('/patients', getDoctorPatients);
router.get('/patients/:id', getPatientCompleteDetails);

// Prescriptions
router.post('/prescriptions', createPrescription);
router.put('/prescriptions/:id', updatePrescription);

// Lab Tests
router.post('/lab-tests', orderLabTest);
router.get('/lab-tests', getDoctorLabTests);

// Medical Notes
router.post('/notes', addDoctorNote);
router.get('/notes/patient/:patientId', getDoctorNotes);
router.put('/notes/:id', updateDoctorNote);

// Notifications
router.get('/notifications', getDoctorNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
