const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Create medical record
// @route   POST /api/medical-records
// @access  Private/Doctor
const createMedicalRecord = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user._id;

    const medicalRecord = await MedicalRecord.create({
      ...req.body,
      doctor: doctorId
    });

    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate('patient', 'name age gender phone')
      .populate('doctor', 'name specialization');

    res.status(201).json({
      success: true,
      data: populatedRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get medical records by patient
// @route   GET /api/medical-records/patient/:patientId
// @access  Private/Doctor
const getMedicalRecordsByPatient = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get medical records by doctor
// @route   GET /api/medical-records/doctor/:doctorId
// @access  Private/Doctor
const getMedicalRecordsByDoctor = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ doctor: req.params.doctorId })
      .populate('patient', 'name age gender phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private/Doctor
const getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name age gender phone email address')
      .populate('doctor', 'name specialization qualification');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private/Doctor
const updateMedicalRecord = async (req, res) => {
  try {
    let record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('patient', 'name age gender phone')
      .populate('doctor', 'name specialization');

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private/Doctor
const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    await record.deleteOne();

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add symptoms to medical record
// @route   POST /api/medical-records/:id/symptoms
// @access  Private/Doctor
const addSymptoms = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    const { symptoms } = req.body;
    
    if (symptoms && Array.isArray(symptoms)) {
      record.symptoms = [...(record.symptoms || []), ...symptoms];
      await record.save();
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add notes to medical record
// @route   POST /api/medical-records/:id/notes
// @access  Private/Doctor
const addNotes = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    const { notes } = req.body;
    
    if (notes) {
      record.notes = record.notes ? `${record.notes}\n${notes}` : notes;
      await record.save();
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordsByDoctor,
  getMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  addSymptoms,
  addNotes
};
