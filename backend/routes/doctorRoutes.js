const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorsByDepartment,
  getDoctorProfile
} = require('../controllers/doctorController');

router.route('/')
  .get(getDoctors)
  .post(createDoctor);

router.route('/profile')
  .get(getDoctorProfile);

router.route('/:id')
  .get(getDoctor)
  .put(updateDoctor)
  .delete(deleteDoctor);

router.route('/search/:keyword')
  .get(searchDoctors);

router.route('/department/:department')
  .get(getDoctorsByDepartment);

module.exports = router;
