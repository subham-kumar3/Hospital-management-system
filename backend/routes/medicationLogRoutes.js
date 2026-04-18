const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getPatientMedications,
  markMedicationGiven,
  getTodayMedications,
  createMedicationFromPrescription
} = require('../controllers/medicationLogController');

router.use(protect);
router.use(authorize('Nurse'));

router.get('/patient/:patientId', getPatientMedications);
router.get('/today', getTodayMedications);
router.post('/:id/administer', markMedicationGiven);
router.post('/from-prescription', createMedicationFromPrescription);

module.exports = router;
