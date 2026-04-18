const Enquiry = require('../models/Enquiry');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('createdBy', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Private
exports.getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('resolvedBy', 'name email');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Private
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, subject, message, priority } = req.body;

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      subject,
      message,
      priority,
      createdBy: req.user.id
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update enquiry
// @route   PUT /api/enquiries/:id
// @access  Private
exports.updateEnquiry = async (req, res) => {
  try {
    let enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // If status is being updated to Resolved, set resolvedBy and resolvedAt
    const updateData = { ...req.body };
    if (updateData.status === 'Resolved' && enquiry.status !== 'Resolved') {
      updateData.resolvedBy = req.user.id;
      updateData.resolvedAt = Date.now();
    }

    enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('createdBy', 'name email')
      .populate('resolvedBy', 'name email');

    res.json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin only)
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    await enquiry.deleteOne();

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get enquiries by status
// @route   GET /api/enquiries/status/:status
// @access  Private
exports.getEnquiriesByStatus = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ status: req.params.status })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
