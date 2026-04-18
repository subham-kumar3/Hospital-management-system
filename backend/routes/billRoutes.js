const express = require('express');
const router = express.Router();
const {
  getAllBills,
  getBill,
  getBillsByPatient,
  createBill,
  updateBill,
  makePayment,
  deleteBill,
  getBillingStats
} = require('../controllers/billController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getAllBills)
  .post(protect, authorize('Receptionist', 'Admin'), createBill);

router.get('/stats/summary', protect, getBillingStats);

router.route('/:id')
  .get(protect, getBill)
  .put(protect, updateBill)
  .delete(protect, authorize('Admin'), deleteBill);

router.put('/:id/payment', protect, makePayment);
router.get('/patient/:patientId', protect, getBillsByPatient);

module.exports = router;
