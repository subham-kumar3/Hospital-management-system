const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/pharmacy/medicines
// @access  Private/Pharmacist
const getMedicines = async (req, res) => {
  try {
    const { search, category, status, lowStock } = req.query;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (lowStock === 'true') {
      query.stockQuantity = { $lte: mongoose.Types.Decimal128.fromString('10') };
    }
    
    const medicines = await Medicine.find(query)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/pharmacy/medicines/:id
// @access  Private/Pharmacist
const getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('addedBy', 'name email');
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    
    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new medicine
// @route   POST /api/pharmacy/medicines
// @access  Private/Pharmacist
const addMedicine = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    
    const medicine = await Medicine.create(req.body);
    
    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/pharmacy/medicines/:id
// @access  Private/Pharmacist
const updateMedicine = async (req, res) => {
  try {
    let medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    
    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stock quantity
// @route   PATCH /api/pharmacy/medicines/:id/stock
// @access  Private/Pharmacist
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    
    let medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    
    if (operation === 'add') {
      medicine.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (medicine.stockQuantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      medicine.stockQuantity -= quantity;
    } else {
      // Set absolute quantity
      medicine.stockQuantity = quantity;
    }
    
    // Update status based on stock
    if (medicine.stockQuantity === 0) {
      medicine.status = 'Out of Stock';
    } else if (medicine.status === 'Out of Stock') {
      medicine.status = 'Active';
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

// @desc    Delete medicine
// @route   DELETE /api/pharmacy/medicines/:id
// @access  Private/Pharmacist
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    
    await medicine.deleteOne();
    
    res.json({
      success: true,
      message: 'Medicine removed'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/pharmacy/medicines/alerts/low-stock
// @access  Private/Pharmacist
const getLowStockAlerts = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] },
      status: 'Active'
    }).sort({ stockQuantity: 1 });
    
    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expired medicines
// @route   GET /api/pharmacy/medicines/alerts/expired
// @access  Private/Pharmacist
const getExpiredMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      expiryDate: { $lt: new Date() },
      status: 'Active'
    });
    
    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get medicine statistics
// @route   GET /api/pharmacy/medicines/stats
// @access  Private/Pharmacist
const getMedicineStats = async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const activeMedicines = await Medicine.countDocuments({ status: 'Active' });
    const outOfStock = await Medicine.countDocuments({ status: 'Out of Stock' });
    const lowStock = await Medicine.countDocuments({
      $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] }
    });
    const expired = await Medicine.countDocuments({
      expiryDate: { $lt: new Date() }
    });
    
    const totalValue = await Medicine.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stockQuantity'] } } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        activeMedicines,
        outOfStock,
        lowStock,
        expired,
        totalInventoryValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMedicines,
  getMedicine,
  addMedicine,
  updateMedicine,
  updateStock,
  deleteMedicine,
  getLowStockAlerts,
  getExpiredMedicines,
  getMedicineStats
};
