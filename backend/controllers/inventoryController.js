const Medicine = require('../models/Medicine');
const Purchase = require('../models/Purchase');

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private (Admin only)
const getInventoryStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    
    // Low stock medicines
    const lowStockMedicines = await Medicine.countDocuments({
      $expr: { $lte: ['$stock', '$minStockLevel'] }
    });
    
    // Expired medicines
    const expiredMedicines = await Medicine.countDocuments({
      expiryDate: { $lt: new Date() }
    });
    
    // Expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiringSoon = await Medicine.countDocuments({
      expiryDate: { $gte: new Date(), $lte: thirtyDaysFromNow }
    });
    
    // Total inventory value
    const medicines = await Medicine.find();
    const totalValue = medicines.reduce((sum, med) => {
      return sum + (med.purchasePrice * med.stock);
    }, 0);
    
    // Categories count
    const categories = await Medicine.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        lowStockMedicines,
        expiredMedicines,
        expiringSoon,
        totalValue,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/inventory/low-stock
// @access  Private (Admin only)
const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$stock', '$minStockLevel'] }
    }).sort({ stock: 1 });
    
    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expiring medicines
// @route   GET /api/inventory/expiring
// @access  Private (Admin only)
const getExpiringMedicines = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));
    
    const medicines = await Medicine.find({
      expiryDate: { $gte: new Date(), $lte: futureDate }
    }).sort({ expiryDate: 1 });
    
    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medicine stock
// @route   PUT /api/inventory/:id/stock
// @access  Private (Admin only)
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ 
        success: false, 
        message: 'Medicine not found' 
      });
    }
    
    if (operation === 'add') {
      medicine.stock += quantity;
    } else if (operation === 'subtract') {
      if (medicine.stock < quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient stock' 
        });
      }
      medicine.stock -= quantity;
    } else {
      // Direct stock update
      medicine.stock = quantity;
    }
    
    await medicine.save();
    
    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate purchase order for low stock items
// @route   POST /api/inventory/purchase-order
// @access  Private (Admin only)
const generatePurchaseOrder = async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({
      $expr: { $lte: ['$stock', '$minStockLevel'] }
    });
    
    if (lowStockMedicines.length === 0) {
      return res.json({
        success: true,
        message: 'No low stock medicines found',
        data: null
      });
    }
    
    // Create purchase order
    const purchaseItems = lowStockMedicines.map(med => ({
      medicine: med._id,
      medicineName: med.name,
      quantity: med.minStockLevel * 2, // Order double the min level
      purchasePrice: med.purchasePrice,
      totalPrice: med.minStockLevel * 2 * med.purchasePrice,
      supplier: med.supplier
    }));
    
    const totalAmount = purchaseItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const purchase = await Purchase.create({
      items: purchaseItems,
      totalAmount,
      status: 'Pending',
      orderedBy: req.user.id
    });
    
    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInventoryStats,
  getLowStockMedicines,
  getExpiringMedicines,
  updateStock,
  generatePurchaseOrder
};
