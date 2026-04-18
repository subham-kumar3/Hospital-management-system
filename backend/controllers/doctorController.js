const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Public
const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Public
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Public
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search doctors
// @route   GET /api/doctors/search/:keyword
// @access  Public
const searchDoctors = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const doctors = await Doctor.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { specialization: { $regex: keyword, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctors by department
// @route   GET /api/doctors/department/:department
// @access  Public
const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({ department: req.params.department });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current doctor profile
// @route   GET /api/doctors/profile
// @access  Private (requires authentication)
const getDoctorProfile = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user._id;
    
    // Find doctor profile associated with this user
    const doctor = await Doctor.findOne({ userId: userId })
      .populate('department', 'name description')
      .sort({ createdAt: -1 });
    
    if (!doctor) {
      // If no doctor profile found, return basic info from user
      return res.json({ 
        success: true, 
        data: {
          name: req.user.name,
          email: req.user.email,
          specialization: 'General Medicine',
          qualification: 'MBBS',
          experience: 0,
          phone: '',
          department: 'General Medicine',
          consultationFee: 500
        }
      });
    }
    
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorsByDepartment,
  getDoctorProfile
};
