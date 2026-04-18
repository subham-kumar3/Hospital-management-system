const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getNurseDashboard,
  getAssignedPatients,
  getPatientDetails
} = require('../controllers/nurseController');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/nurseProfileController');

router.use(protect);
router.use(authorize('Nurse'));

// Dashboard and Patients
router.get('/dashboard', getNurseDashboard);
router.get('/patients', getAssignedPatients);
router.get('/patients/:id', getPatientDetails);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
