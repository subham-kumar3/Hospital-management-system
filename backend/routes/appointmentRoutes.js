const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  getAppointmentsByStatus
} = require('../controllers/appointmentController');

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.route('/date/:date')
  .get(getAppointmentsByDate);

router.route('/status/:status')
  .get(getAppointmentsByStatus);

module.exports = router;
