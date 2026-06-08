const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getLabReports,
  getLabReport
} = require('../controllers/nurseLabController');

router.use(protect);
router.use(authorize('Nurse'));

router.get('/', getLabReports);
router.get('/:id', getLabReport);

module.exports = router;
