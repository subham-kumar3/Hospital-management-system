const Patient = require('../models/Patient');
const Vital = require('../models/Vital');
const MedicationLog = require('../models/MedicationLog');
const Notification = require('../models/Notification');

// @desc    Get nurse dashboard statistics
// @route   GET /api/nurse/dashboard
// @access  Private/Nurse
const getNurseDashboard = async (req, res) => {
  try {
    const nurseId = req.user.id;
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get assigned patients count
    const assignedPatients = await Patient.find({ 
      assignedNurse: nurseId,
      status: { $ne: 'Discharged' }
    }).populate('assignedDoctor', 'name specialization');

    // Get vitals recorded today
    const vitalsToday = await Vital.countDocuments({
      nurse: nurseId,
      recordedAt: { $gte: today, $lt: tomorrow }
    });

    // Get pending medications
    const pendingMedications = await MedicationLog.countDocuments({
      status: 'Pending'
    });

    // Get unread notifications
    const unreadNotifications = await Notification.countDocuments({
      recipient: nurseId,
      isRead: false
    });

    // Get emergency notifications
    const emergencyNotifications = await Notification.countDocuments({
      recipient: nurseId,
      type: 'Emergency',
      isRead: false
    });

    res.json({
      success: true,
      data: {
        totalPatients: assignedPatients.length,
        patients: assignedPatients,
        vitalsRecordedToday: vitalsToday,
        pendingMedications,
        unreadNotifications,
        emergencyNotifications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assigned patients
// @route   GET /api/nurse/patients
// @access  Private/Nurse
const getAssignedPatients = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const { search, ward, status } = req.query;

    // Build query
    let query = { 
      assignedNurse: nurseId,
      status: { $ne: 'Discharged' }
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (ward) {
      query.ward = ward;
    }

    if (status) {
      query.status = status;
    }

    const patients = await Patient.find(query)
      .populate('assignedDoctor', 'name specialization')
      .sort({ admittedDate: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient details
// @route   GET /api/nurse/patients/:id
// @access  Private/Nurse
const getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name specialization phone')
      .populate('assignedNurse', 'name email phone');

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if nurse is assigned to this patient or is admin
    if (patient.assignedNurse && patient.assignedNurse._id.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this patient' 
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNurseDashboard,
  getAssignedPatients,
  getPatientDetails
};
