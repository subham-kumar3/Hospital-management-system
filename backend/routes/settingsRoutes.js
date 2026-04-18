const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateHospitalInfo,
  backupDatabase,
  getActivityLogs
} = require('../controllers/settingsController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getSettings);
router.put('/', updateSettings);
router.put('/hospital-info', updateHospitalInfo);
router.post('/backup', backupDatabase);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
