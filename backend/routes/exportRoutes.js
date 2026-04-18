const express = require('express');
const router = express.Router();
const {
  exportPatients,
  exportDoctors,
  exportAppointments,
  exportLabTests,
  exportMedicines,
  exportFinancial
} = require('../controllers/exportController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.post('/patients', exportPatients);
router.post('/doctors', exportDoctors);
router.post('/appointments', exportAppointments);
router.post('/lab-tests', exportLabTests);
router.post('/medicines', exportMedicines);
router.post('/financial', exportFinancial);

module.exports = router;
