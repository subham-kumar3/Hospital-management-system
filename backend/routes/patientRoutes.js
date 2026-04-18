const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients
} = require('../controllers/patientController');

router.route('/')
  .get(getPatients)
  .post(createPatient);

router.route('/:id')
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

router.route('/search/:keyword')
  .get(searchPatients);

module.exports = router;
