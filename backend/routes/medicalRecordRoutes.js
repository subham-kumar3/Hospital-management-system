const express = require('express');
const router = express.Router();
const {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  addSymptoms,
  addNotes
} = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and Doctor role
router.use(protect);
router.use(authorize('Doctor'));

router.route('/')
  .post(createMedicalRecord);

router.route('/patient/:patientId')
  .get(getMedicalRecordsByPatient);

router.route('/doctor/:doctorId')
  .get(getMedicalRecordsByDoctor);

router.route('/:id')
  .get(getMedicalRecord)
  .put(updateMedicalRecord)
  .delete(deleteMedicalRecord);

router.route('/:id/symptoms')
  .post(addSymptoms);

router.route('/:id/notes')
  .post(addNotes);

module.exports = router;
