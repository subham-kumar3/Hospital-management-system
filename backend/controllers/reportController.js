const LabReport = require('../models/LabReport');
const LabTest = require('../models/LabTest');

// @desc    Get all lab reports
// @route   GET /api/lab/reports
// @access  Private/Lab Technician
exports.getReports = async (req, res) => {
  try {
    const { search, patient, page = 1, limit = 10 } = req.query;

    let query = {};

    if (patient) {
      query.patient = patient;
    }

    if (search) {
      query.$or = [
        { reportId: new RegExp(search, 'i') },
        { testName: new RegExp(search, 'i') },
        { testType: new RegExp(search, 'i') }
      ];
    }

    const reports = await LabReport.find(query)
      .populate('patient', 'name age gender phone email')
      .populate('doctor', 'name specialization')
      .populate('interpretedBy', 'name email')
      .sort({ interpretedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await LabReport.countDocuments(query);

    res.json({
      success: true,
      count: reports.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single lab report
// @route   GET /api/lab/reports/:id
// @access  Private/Lab Technician
exports.getReport = async (req, res) => {
  try {
    const report = await LabReport.findById(req.params.id)
      .populate('patient', 'name age gender phone email address')
      .populate('doctor', 'name specialization phone email')
      .populate('labTest', 'testType testName priority status')
      .populate('interpretedBy', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get patient test history
// @route   GET /api/lab/reports/patient/:patientId
// @access  Private/Lab Technician
exports.getPatientTestHistory = async (req, res) => {
  try {
    const reports = await LabReport.find({ patient: req.params.patientId })
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization')
      .populate('interpretedBy', 'name')
      .sort({ interpretedAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate report for completed test
// @route   POST /api/lab/reports/generate/:testId
// @access  Private/Lab Technician
exports.generateReport = async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.testId);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }

    if (test.status !== 'Completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Test must be completed before generating report' 
      });
    }

    // Check if report already exists
    const existingReport = await LabReport.findOne({ labTest: test._id });

    if (existingReport) {
      return res.json({ success: true, data: existingReport, message: 'Report already exists' });
    }

    const report = await LabReport.create({
      labTest: test._id,
      patient: test.patient,
      doctor: test.doctor,
      testType: test.testType,
      testName: test.testName,
      testResults: test.testResults,
      reportFile: test.reportFile,
      interpretedBy: test.testResults.interpretedBy,
      interpretedAt: test.testResults.interpretedAt
    });

    const populatedReport = await LabReport.findById(report._id)
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization');

    res.status(201).json({ success: true, data: populatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
