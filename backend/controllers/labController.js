const LabTest = require('../models/LabTest');
const LabSample = require('../models/LabSample');
const LabReport = require('../models/LabReport');
const LabNotification = require('../models/LabNotification');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all lab tests
// @route   GET /api/lab/tests
// @access  Private/Lab Technician
exports.getLabTests = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      const patients = await Patient.find({
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      }).select('_id');

      const patientIds = patients.map(p => p._id);

      query.$or = [
        { testName: new RegExp(search, 'i') },
        { testType: new RegExp(search, 'i') },
        { patient: { $in: patientIds } }
      ];
    }

    const tests = await LabTest.find(query)
      .populate('patient', 'name age gender phone email')
      .populate('doctor', 'name specialization')
      .populate('assignedTechnician', 'name email')
      .sort({ priority: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await LabTest.countDocuments(query);

    res.json({
      success: true,
      count: tests.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: tests
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single lab test
// @route   GET /api/lab/tests/:id
// @access  Private/Lab Technician
exports.getLabTest = async (req, res) => {
  try {
    const test = await LabTest.findById(req.params.id)
      .populate('patient', 'name age gender phone email address')
      .populate('doctor', 'name specialization phone email')
      .populate('requestedBy', 'name email')
      .populate('assignedTechnician', 'name email');

    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }

    res.json({ success: true, data: test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update lab test status
// @route   PUT /api/lab/tests/:id/status
// @access  Private/Lab Technician
exports.updateTestStatus = async (req, res) => {
  try {
    const { status, assignedEquipment, notes } = req.body;

    const test = await LabTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }

    if (status) {
      test.status = status;
    }

    if (assignedEquipment) {
      test.assignedEquipment = assignedEquipment;
    }

    if (notes) {
      test.notes = notes;
    }

    if (status === 'In Progress' && !test.assignedTechnician) {
      test.assignedTechnician = req.user.id;
    }

    if (status === 'Completed') {
      test.completedAt = Date.now();
    }

    await test.save();

    const updatedTest = await LabTest.findById(test._id)
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization');

    res.json({ success: true, data: updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add test results
// @route   PUT /api/lab/tests/:id/results
// @access  Private/Lab Technician
exports.addTestResults = async (req, res) => {
  try {
    const { result, values, notes, reportFile } = req.body;

    const test = await LabTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test not found' });
    }

    test.testResults = {
      result,
      values,
      notes,
      interpretedBy: req.user.id,
      interpretedAt: Date.now()
    };

    if (reportFile) {
      test.reportFile = reportFile;
    }

    test.status = 'Completed';
    test.completedAt = Date.now();

    await test.save();

    // Create lab report
    const report = await LabReport.create({
      labTest: test._id,
      patient: test.patient,
      doctor: test.doctor,
      testType: test.testType,
      testName: test.testName,
      testResults: {
        result,
        values,
        notes
      },
      reportFile,
      interpretedBy: req.user.id,
      interpretedAt: Date.now()
    });

    const updatedTest = await LabTest.findById(test._id)
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization');

    res.json({ success: true, data: updatedTest, report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/lab/dashboard
// @access  Private/Lab Technician
exports.getDashboard = async (req, res) => {
  try {
    const pendingTests = await LabTest.countDocuments({ status: 'Pending' });
    const inProgressTests = await LabTest.countDocuments({ status: 'In Progress' });
    const completedTests = await LabTest.countDocuments({ status: 'Completed' });
    const urgentTests = await LabTest.countDocuments({ 
      status: { $in: ['Pending', 'In Progress'] },
      priority: { $in: ['Urgent', 'Critical'] }
    });

    const pendingSamples = await LabSample.countDocuments({ collectionStatus: 'Pending' });
    const collectedSamples = await LabSample.countDocuments({ collectionStatus: 'Collected' });

    const urgentTestsList = await LabTest.find({
      status: { $in: ['Pending', 'In Progress'] },
      priority: { $in: ['Urgent', 'Critical'] }
    })
    .populate('patient', 'name age gender')
    .populate('doctor', 'name specialization')
    .limit(10)
    .sort({ priority: 1, createdAt: -1 });

    const recentTests = await LabTest.find()
      .populate('patient', 'name age gender')
      .populate('doctor', 'name specialization')
      .limit(5)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        statistics: {
          pendingTests,
          inProgressTests,
          completedTests,
          urgentTests,
          pendingSamples,
          collectedSamples
        },
        urgentTests: urgentTestsList,
        recentTests
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
