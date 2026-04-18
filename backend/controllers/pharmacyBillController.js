const Bill = require('../models/Bill');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

// @desc    Get all pharmacy bills
// @route   GET /api/pharmacy/bills
// @access  Private/Pharmacist
const getBills = async (req, res) => {
  try {
    const { search, status, date } = req.query;
    
    let query = {};
    
    if (status && status !== 'All') {
      query.paymentStatus = status;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const bills = await Bill.find(query)
      .populate('patient', 'name age gender contact')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    // Filter by search if provided
    let filtered = bills;
    if (search) {
      filtered = bills.filter(b => 
        b.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        b.billNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single bill
// @route   GET /api/pharmacy/bills/:id
// @access  Private/Pharmacist
const getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name age gender contact email address')
      .populate('createdBy', 'name email')
      .populate('appointment', 'date time');
    
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    
    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create pharmacy bill
// @route   POST /api/pharmacy/bills
// @access  Private/Pharmacist
const createBill = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    const bill = await Bill.create(req.body);
    
    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name age gender contact')
      .populate('createdBy', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedBill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update bill payment
// @route   PUT /api/pharmacy/bills/:id/payment
// @access  Private/Pharmacist
const updatePayment = async (req, res) => {
  try {
    const { paidAmount, paymentMethod } = req.body;
    
    let bill = await Bill.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    
    bill.paidAmount = (bill.paidAmount || 0) + paidAmount;
    bill.paymentMethod = paymentMethod;
    bill.paymentDate = new Date();
    bill.balance = bill.totalAmount - bill.paidAmount;
    
    // Update payment status
    if (bill.paidAmount >= bill.totalAmount) {
      bill.paymentStatus = 'Paid';
    } else if (bill.paidAmount > 0) {
      bill.paymentStatus = 'Partial';
    }
    
    await bill.save();
    
    bill = await Bill.findById(bill._id)
      .populate('patient', 'name contact')
      .populate('createdBy', 'name');
    
    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate bill from prescription
// @route   POST /api/pharmacy/bills/from-prescription
// @access  Private/Pharmacist
const createBillFromPrescription = async (req, res) => {
  try {
    const { prescriptionId, items } = req.body;
    
    const prescription = await Prescription.findById(prescriptionId)
      .populate('patient');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    const billData = {
      patient: prescription.patient._id,
      prescription: prescriptionId,
      items: items,
      subtotal: items.reduce((sum, item) => sum + item.total, 0),
      createdBy: req.user.id
    };
    
    const bill = await Bill.create(billData);
    
    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name age gender contact')
      .populate('createdBy', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedBill
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bill statistics
// @route   GET /api/pharmacy/bills/stats
// @access  Private/Pharmacist
const getBillStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const totalBills = await Bill.countDocuments();
    const todayBills = await Bill.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const totalRevenue = await Bill.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const todayRevenue = await Bill.aggregate([
      { 
        $match: { 
          paymentStatus: 'Paid',
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const pendingPayments = await Bill.aggregate([
      { $match: { paymentStatus: { $in: ['Pending', 'Partial'] } } },
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalBills,
        todayBills,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        pendingPayments: pendingPayments[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBills,
  getBill,
  createBill,
  updatePayment,
  createBillFromPrescription,
  getBillStats
};
