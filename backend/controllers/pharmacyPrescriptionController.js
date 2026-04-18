const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all prescriptions for pharmacy
// @route   GET /api/pharmacy/prescriptions
// @access  Private/Pharmacist
const getPrescriptions = async (req, res) => {
  try {
    const { search, status, date } = req.query;
    
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name age gender contact')
      .populate('doctor', 'name specialization')
      .populate('dispensedBy', 'name')
      .sort({ createdAt: -1 });
    
    // Filter by search if provided
    let filtered = prescriptions;
    if (search) {
      filtered = prescriptions.filter(p => 
        p.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        p.patient.contact?.includes(search)
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

// @desc    Get single prescription
// @route   GET /api/pharmacy/prescriptions/:id
// @access  Private/Pharmacist
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name age gender contact email address')
      .populate('doctor', 'name specialization contact')
      .populate('dispensedBy', 'name')
      .populate('appointment', 'date time');
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark prescription as dispensed
// @route   PUT /api/pharmacy/prescriptions/:id/dispense
// @access  Private/Pharmacist
const dispensePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    
    if (prescription.status === 'Dispensed') {
      return res.status(400).json({ success: false, message: 'Prescription already dispensed' });
    }
    
    prescription.status = 'Dispensed';
    prescription.dispensedAt = new Date();
    prescription.dispensedBy = req.user.id;
    prescription.pharmacyNotes = req.body.pharmacyNotes || prescription.pharmacyNotes;
    
    await prescription.save();
    
    const updatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient', 'name age gender contact')
      .populate('doctor', 'name specialization')
      .populate('dispensedBy', 'name');
    
    res.json({
      success: true,
      data: updatedPrescription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's prescriptions
// @route   GET /api/pharmacy/prescriptions/today
// @access  Private/Pharmacist
const getTodayPrescriptions = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const prescriptions = await Prescription.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('patient', 'name contact')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending prescriptions
// @route   GET /api/pharmacy/prescriptions/pending
// @access  Private/Pharmacist
const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ status: 'Active' })
      .populate('patient', 'name contact')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get prescription statistics
// @route   GET /api/pharmacy/prescriptions/stats
// @access  Private/Pharmacist
const getPrescriptionStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const totalPrescriptions = await Prescription.countDocuments();
    const todayPrescriptions = await Prescription.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const pendingPrescriptions = await Prescription.countDocuments({ status: 'Active' });
    const dispensedToday = await Prescription.countDocuments({
      status: 'Dispensed',
      dispensedAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    res.json({
      success: true,
      data: {
        totalPrescriptions,
        todayPrescriptions,
        pendingPrescriptions,
        dispensedToday
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPrescriptions,
  getPrescription,
  dispensePrescription,
  getTodayPrescriptions,
  getPendingPrescriptions,
  getPrescriptionStats
};
