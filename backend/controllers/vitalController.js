const Vital = require('../models/Vital');
const Patient = require('../models/Patient');

// @desc    Add new vitals
// @route   POST /api/vitals
// @access  Private/Nurse
const addVitals = async (req, res) => {
  try {
    const { patientId, temperature, bloodPressure, pulse, oxygenLevel, respiratoryRate, notes } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const vital = await Vital.create({
      patient: patientId,
      nurse: req.user.id,
      temperature,
      bloodPressure: {
        systolic: bloodPressure.systolic,
        diastolic: bloodPressure.diastolic
      },
      pulse,
      oxygenLevel,
      respiratoryRate,
      notes
    });

    res.status(201).json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient vitals history
// @route   GET /api/vitals/patient/:patientId
// @access  Private/Nurse
const getPatientVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ patient: req.params.patientId })
      .populate('nurse', 'name')
      .sort({ recordedAt: -1 });

    res.json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vitals
// @route   PUT /api/vitals/:id
// @access  Private/Nurse
const updateVitals = async (req, res) => {
  try {
    let vital = await Vital.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({ success: false, message: 'Vital record not found' });
    }

    // Check if nurse owns this record
    if (vital.nurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this record' 
      });
    }

    vital = await Vital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's vitals
// @route   GET /api/vitals/today
// @access  Private/Nurse
const getTodayVitals = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vitals = await Vital.find({
      nurse: req.user.id,
      recordedAt: { $gte: today, $lt: tomorrow }
    })
      .populate('patient', 'name age roomNumber bedNumber')
      .sort({ recordedAt: -1 });

    res.json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addVitals,
  getPatientVitals,
  updateVitals,
  getTodayVitals
};
