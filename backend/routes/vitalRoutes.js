const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  addVitals,
  getPatientVitals,
  updateVitals,
  getTodayVitals
} = require('../controllers/vitalController');

router.use(protect);
router.use(authorize('Nurse'));

router.post('/', addVitals);
router.get('/patient/:patientId', getPatientVitals);
router.get('/today', getTodayVitals);
router.put('/:id', updateVitals);

module.exports = router;
