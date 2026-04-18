const Purchase = require('../models/Purchase');
const Medicine = require('../models/Medicine');

// @desc    Get all purchases
// @route   GET /api/pharmacy/purchases
// @access  Private/Pharmacist
const getPurchases = async (req, res) => {
  try {
    const { status, deliveryStatus, date } = req.query;
    
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (deliveryStatus && deliveryStatus !== 'All') {
      query.deliveryStatus = deliveryStatus;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const purchases = await Purchase.find(query)
      .populate('items.medicine', 'name category')
      .populate('orderedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: purchases.length,
      data: purchases
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single purchase
// @route   GET /api/pharmacy/purchases/:id
// @access  Private/Pharmacist
const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('items.medicine', 'name category batchNumber')
      .populate('orderedBy', 'name email');
    
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    
    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create purchase order
// @route   POST /api/pharmacy/purchases
// @access  Private/Pharmacist
const createPurchase = async (req, res) => {
  try {
    req.body.orderedBy = req.user.id;
    
    const purchase = await Purchase.create(req.body);
    
    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('items.medicine', 'name category')
      .populate('orderedBy', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedPurchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update purchase delivery status
// @route   PUT /api/pharmacy/purchases/:id/delivery
// @access  Private/Pharmacist
const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus, deliveryDate } = req.body;
    
    let purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    
    purchase.deliveryStatus = deliveryStatus;
    
    if (deliveryStatus === 'Delivered') {
      purchase.deliveryDate = deliveryDate || new Date();
      
      // Update medicine stock for each item
      for (const item of purchase.items) {
        const medicine = await Medicine.findById(item.medicine);
        if (medicine) {
          medicine.stockQuantity += item.quantity;
          medicine.batchNumber = item.batchNumber;
          medicine.expiryDate = item.expiryDate;
          if (medicine.status === 'Out of Stock') {
            medicine.status = 'Active';
          }
          await medicine.save();
        }
      }
    }
    
    await purchase.save();
    
    purchase = await Purchase.findById(purchase._id)
      .populate('items.medicine', 'name category')
      .populate('orderedBy', 'name');
    
    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update purchase payment
// @route   PUT /api/pharmacy/purchases/:id/payment
// @access  Private/Pharmacist
const updatePayment = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    let purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    
    purchase.paymentStatus = paymentStatus;
    purchase.paymentMethod = paymentMethod;
    
    await purchase.save();
    
    purchase = await Purchase.findById(purchase._id)
      .populate('items.medicine', 'name category')
      .populate('orderedBy', 'name');
    
    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete purchase
// @route   DELETE /api/pharmacy/purchases/:id
// @access  Private/Pharmacist
const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }
    
    if (purchase.deliveryStatus === 'Delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete delivered purchase' 
      });
    }
    
    await purchase.deleteOne();
    
    res.json({
      success: true,
      message: 'Purchase removed'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get purchase statistics
// @route   GET /api/pharmacy/purchases/stats
// @access  Private/Pharmacist
const getPurchaseStats = async (req, res) => {
  try {
    const totalPurchases = await Purchase.countDocuments();
    const pendingDeliveries = await Purchase.countDocuments({ 
      deliveryStatus: { $in: ['Pending', 'Ordered', 'Shipped'] } 
    });
    const pendingPayments = await Purchase.countDocuments({ 
      paymentStatus: { $in: ['Pending', 'Partial'] } 
    });
    
    const totalSpent = await Purchase.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalPurchases,
        pendingDeliveries,
        pendingPayments,
        totalSpent: totalSpent[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPurchases,
  getPurchase,
  createPurchase,
  updateDeliveryStatus,
  updatePayment,
  deletePurchase,
  getPurchaseStats
};
