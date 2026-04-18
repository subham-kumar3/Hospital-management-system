const express = require('express');
const router = express.Router();
const {
  getAllEnquiries,
  getEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiriesByStatus
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllEnquiries)
  .post(protect, createEnquiry);

router.route('/:id')
  .get(protect, getEnquiry)
  .put(protect, updateEnquiry)
  .delete(protect, authorize('Admin'), deleteEnquiry);

router.route('/status/:status')
  .get(protect, getEnquiriesByStatus);

module.exports = router;
