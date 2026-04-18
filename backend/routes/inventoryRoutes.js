const express = require('express');
const router = express.Router();
const {
  getInventoryStats,
  getLowStockMedicines,
  getExpiringMedicines,
  updateStock,
  generatePurchaseOrder
} = require('../controllers/inventoryController');

const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getInventoryStats);
router.get('/low-stock', getLowStockMedicines);
router.get('/expiring', getExpiringMedicines);
router.put('/:id/stock', updateStock);
router.post('/purchase-order', generatePurchaseOrder);

module.exports = router;
