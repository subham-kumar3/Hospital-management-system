const express = require('express');
const router = express.Router();
const {
  getLabStats,
  getAllLabTests,
  assignTechnician,
  getTechnicianWorkload,
  generateLabReport
} = require('../controllers/labAdminController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getLabStats);
router.get('/tests', getAllLabTests);
router.put('/tests/:id/assign', assignTechnician);
router.get('/technicians/workload', getTechnicianWorkload);
router.get('/reports', generateLabReport);

module.exports = router;
