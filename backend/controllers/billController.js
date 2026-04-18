const Bill = require('../models/Bill');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('patient', 'name email phone')
      .populate('appointment')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
exports.getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name email phone age gender address')
      .populate('appointment')
      .populate('createdBy', 'name email');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get bills by patient
// @route   GET /api/bills/patient/:patientId
// @access  Private
exports.getBillsByPatient = async (req, res) => {
  try {
    const bills = await Bill.find({ patient: req.params.patientId })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create bill
// @route   POST /api/bills
// @access  Private (Receptionist/Admin only)
exports.createBill = async (req, res) => {
  try {
    const { patient, appointment, items, tax, discount, paidAmount, paymentMethod, notes } = req.body;

    const bill = await Bill.create({
      patient,
      appointment,
      items,
      tax: tax || 0,
      discount: discount || 0,
      paidAmount: paidAmount || 0,
      paymentMethod,
      notes,
      createdBy: req.user.id
    });

    const populatedBill = await Bill.findById(bill._id)
      .populate('patient', 'name email phone')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedBill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
exports.updateBill = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('patient', 'name email phone')
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Make payment
// @route   PUT /api/bills/:id/payment
// @access  Private
exports.makePayment = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    bill.paidAmount += amount;
    bill.paymentMethod = paymentMethod;
    bill.paymentDate = Date.now();
    
    if (bill.paidAmount >= bill.totalAmount) {
      bill.paymentStatus = 'Paid';
    } else {
      bill.paymentStatus = 'Partial';
    }
    
    bill.balance = bill.totalAmount - bill.paidAmount;
    
    await bill.save();

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private (Admin only)
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    await bill.deleteOne();

    res.json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get billing statistics
// @route   GET /api/bills/stats/summary
// @access  Private
exports.getBillingStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const stats = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalPending: { $sum: '$balance' },
          paidBills: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] }
          },
          pendingBills: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const todayBills = await Bill.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    res.json({
      success: true,
      data: {
        overall: stats[0] || { totalBills: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 },
        today: {
          count: todayBills.length,
          amount: todayBills.reduce((sum, bill) => sum + bill.totalAmount, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
