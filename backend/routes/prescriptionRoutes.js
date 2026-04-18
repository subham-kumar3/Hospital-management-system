const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getPrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  createPrescription,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllPrescriptions)
  .post(protect, authorize('Doctor'), createPrescription);

router.route('/:id')
  .get(protect, getPrescription)
  .put(protect, authorize('Doctor'), updatePrescription)
  .delete(protect, authorize('Doctor', 'Admin'), deletePrescription);

router.get('/patient/:patientId', protect, getPrescriptionsByPatient);
router.get('/doctor/:doctorId', protect, getPrescriptionsByDoctor);

module.exports = router;
