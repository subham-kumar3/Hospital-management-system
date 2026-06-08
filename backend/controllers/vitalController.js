const Vital = require('../models/Vital');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');

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

    // Check for critical values and create alerts
    const criticalAlerts = [];
    
    // Check temperature (normal: 97-99 F)
    if (temperature > 103 || temperature < 95) {
      criticalAlerts.push(`Critical Temperature: ${temperature}°F`);
    }
    
    // Check blood pressure (normal: 90-120 / 60-80)
    if (bloodPressure.systolic > 180 || bloodPressure.systolic < 80 || 
        bloodPressure.diastolic > 120 || bloodPressure.diastolic < 50) {
      criticalAlerts.push(`Critical BP: ${bloodPressure.systolic}/${bloodPressure.diastolic}`);
    }
    
    // Check pulse (normal: 60-100 bpm)
    if (pulse > 120 || pulse < 50) {
      criticalAlerts.push(`Critical Pulse: ${pulse} bpm`);
    }
    
    // Check oxygen level (normal: 95-100%)
    if (oxygenLevel < 90) {
      criticalAlerts.push(`Critical O2 Level: ${oxygenLevel}%`);
    }

    // Create notifications for critical values
    if (criticalAlerts.length > 0) {
      await Notification.create({
        recipient: req.user.id,
        type: 'Emergency',
        title: 'Critical Vitals Alert',
        message: `Patient ${patient.name}: ${criticalAlerts.join(', ')}`,
        patient: patientId
      });

      // Update patient status to Critical if not already
      if (patient.status !== 'Critical') {
        await Patient.findByIdAndUpdate(patientId, { status: 'Critical' });
      }
    }

    res.status(201).json({
      success: true,
      data: vital,
      criticalAlerts: criticalAlerts
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
