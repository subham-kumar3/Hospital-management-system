const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  updateStock,
  deleteMedicine,
  getLowStockAlerts,
  getExpiredMedicines,
  getMedicineStats
} = require('../controllers/medicineController');
const {
  getPrescriptions,
  getPrescription,
  dispensePrescription,
  getTodayPrescriptions,
  getPendingPrescriptions,
  getPrescriptionStats
} = require('../controllers/pharmacyPrescriptionController');
const {
  getBills,
  getBill,
  createBill,
  updatePayment,
  createBillFromPrescription,
  getBillStats
} = require('../controllers/pharmacyBillController');
const {
  getPurchases,
  getPurchase,
  createPurchase,
  updateDeliveryStatus,
  updatePayment: updatePurchasePayment,
  deletePurchase,
  getPurchaseStats
} = require('../controllers/purchaseController');

// Apply authentication and authorization to all routes
router.use(protect);
router.use(authorize('Pharmacist'));

// Medicine routes - specific paths before :id
router.get('/medicines/stats', getMedicineStats);
router.get('/medicines/alerts/low-stock', getLowStockAlerts);
router.get('/medicines/alerts/expired', getExpiredMedicines);

router.route('/medicines')
  .get(getMedicines)
  .post(addMedicine);

router.route('/medicines/:id')
  .get(getMedicine)
  .put(updateMedicine)
  .delete(deleteMedicine);

router.patch('/medicines/:id/stock', updateStock);

// Prescription routes
router.get('/prescriptions/today', getTodayPrescriptions);
router.get('/prescriptions/pending', getPendingPrescriptions);
router.get('/prescriptions/stats', getPrescriptionStats);

router.route('/prescriptions')
  .get(getPrescriptions);

router.route('/prescriptions/:id')
  .get(getPrescription);

router.put('/prescriptions/:id/dispense', dispensePrescription);

// Bill routes
router.get('/bills/stats', getBillStats);
router.post('/bills/from-prescription', createBillFromPrescription);

router.route('/bills')
  .get(getBills)
  .post(createBill);

router.route('/bills/:id')
  .get(getBill);

router.put('/bills/:id/payment', updatePayment);

// Purchase routes
router.get('/purchases/stats', getPurchaseStats);

router.route('/purchases')
  .get(getPurchases)
  .post(createPurchase);

router.route('/purchases/:id')
  .get(getPurchase)
  .delete(deletePurchase);

router.put('/purchases/:id/delivery', updateDeliveryStatus);
router.put('/purchases/:id/payment', updatePurchasePayment);

module.exports = router;
