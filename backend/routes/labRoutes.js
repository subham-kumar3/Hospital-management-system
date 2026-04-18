const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getLabTests,
  getLabTest,
  updateTestStatus,
  addTestResults,
  getDashboard
} = require('../controllers/labController');
const {
  getSamples,
  getSample,
  createSample,
  updateCollectionStatus,
  updateSample,
  getExpiringSamples
} = require('../controllers/sampleController');
const {
  getReports,
  getReport,
  getPatientTestHistory,
  generateReport
} = require('../controllers/reportController');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// All routes require authentication and Lab Technician role
router.use(protect);
router.use(authorize('Lab Technician'));

// Dashboard
router.get('/dashboard', getDashboard);

// Lab Tests Routes
router.get('/tests', getLabTests);
router.get('/tests/:id', getLabTest);
router.put('/tests/:id/status', updateTestStatus);
router.put('/tests/:id/results', addTestResults);

// Sample Management Routes
router.get('/samples', getSamples);
router.get('/samples/expiring', getExpiringSamples);
router.get('/samples/:id', getSample);
router.post('/samples', createSample);
router.put('/samples/:id/collection', updateCollectionStatus);
router.put('/samples/:id', updateSample);

// Reports Routes
router.get('/reports', getReports);
router.get('/reports/patient/:patientId', getPatientTestHistory);
router.get('/reports/:id', getReport);
router.post('/reports/generate/:testId', generateReport);

// Notifications Routes
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markAsRead);
router.put('/notifications/read-all', markAllAsRead);
router.delete('/notifications/:id', deleteNotification);

module.exports = router;
