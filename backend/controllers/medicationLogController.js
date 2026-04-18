const MedicationLog = require('../models/MedicationLog');
const Prescription = require('../models/Prescription');

// @desc    Get patient medications
// @route   GET /api/medications/patient/:patientId
// @access  Private/Nurse
const getPatientMedications = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { patient: req.params.patientId };
    
    if (status) {
      query.status = status;
    }

    const medications = await MedicationLog.find(query)
      .populate('nurse', 'name')
      .populate('prescription', 'diagnosis')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark medication as administered
// @route   POST /api/medications/:id/administer
// @access  Private/Nurse
const markMedicationGiven = async (req, res) => {
  try {
    let medication = await MedicationLog.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication log not found' });
    }

    medication.status = 'Given';
    medication.nurse = req.user.id;
    medication.administeredAt = new Date();
    
    if (req.body.notes) {
      medication.notes = req.body.notes;
    }

    await medication.save();

    res.json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's medications
// @route   GET /api/medications/today
// @access  Private/Nurse
const getTodayMedications = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const medications = await MedicationLog.find({
      createdAt: { $gte: today, $lt: tomorrow }
    })
      .populate('patient', 'name age roomNumber bedNumber')
      .populate('nurse', 'name')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create medication logs from prescription
// @route   POST /api/medications/from-prescription
// @access  Private/Nurse
const createMedicationFromPrescription = async (req, res) => {
  try {
    const { prescriptionId, scheduledTime } = req.body;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('patient');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Create medication log for each medicine
    const medicationLogs = [];
    for (const medicine of prescription.medicines) {
      const log = await MedicationLog.create({
        patient: prescription.patient._id,
        prescription: prescriptionId,
        medicine: {
          name: medicine.name,
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          instructions: medicine.instructions
        },
        scheduledTime: scheduledTime || new Date()
      });
      medicationLogs.push(log);
    }

    res.status(201).json({
      success: true,
      count: medicationLogs.length,
      data: medicationLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPatientMedications,
  markMedicationGiven,
  getTodayMedications,
  createMedicationFromPrescription
};
