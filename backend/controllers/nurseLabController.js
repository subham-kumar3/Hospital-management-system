const LabReport = require('../models/LabReport');
const Patient = require('../models/Patient');

// @desc    Get lab reports for assigned patients
// @route   GET /api/nurse/lab-reports
// @access  Private/Nurse
const getLabReports = async (req, res) => {
  try {
    const nurseId = req.user.id;
    const { patientId, status, page = 1, limit = 20 } = req.query;

    // Get all patients assigned to this nurse
    const assignedPatients = await Patient.find({
      assignedNurse: nurseId,
      status: { $ne: 'Discharged' }
    }).select('_id');

    const patientIds = assignedPatients.map(p => p._id);

    // Build query
    let query = { patient: { $in: patientIds } };

    if (patientId) {
      query.patient = patientId;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const reports = await LabReport.find(query)
      .populate('patient', 'name age roomNumber bedNumber')
      .populate('test', 'testName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LabReport.countDocuments(query);

    res.json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: reports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lab report
// @route   GET /api/nurse/lab-reports/:id
// @access  Private/Nurse
const getLabReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id)
      .populate('patient', 'name age gender roomNumber bedNumber')
      .populate('test', 'testName description normalRange')
      .populate('createdBy', 'name');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Lab report not found' });
    }

    // Verify patient is assigned to this nurse
    const patient = await Patient.findById(report.patient._id);
    if (patient.assignedNurse && patient.assignedNurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this report' 
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLabReports,
  getLabReport
};
