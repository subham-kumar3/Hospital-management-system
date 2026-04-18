const LabTest = require('../models/LabTest');
const User = require('../models/User');

// @desc    Get lab statistics
// @route   GET /api/lab-admin/stats
// @access  Private (Admin only)
const getLabStats = async (req, res) => {
  try {
    const totalTests = await LabTest.countDocuments();
    const pendingTests = await LabTest.countDocuments({ status: 'Pending' });
    const inProgressTests = await LabTest.countDocuments({ status: 'In Progress' });
    const completedTests = await LabTest.countDocuments({ status: 'Completed' });
    const urgentTests = await LabTest.countDocuments({ priority: 'Urgent' });
    const emergencyTests = await LabTest.countDocuments({ priority: 'Emergency' });
    
    // Average turnaround time (completed tests)
    const completedTestsData = await LabTest.find({ 
      status: 'Completed',
      completedAt: { $exists: true },
      createdAt: { $exists: true }
    });
    
    let avgTurnaroundTime = 0;
    if (completedTestsData.length > 0) {
      const totalTurnaround = completedTestsData.reduce((sum, test) => {
        const turnaround = new Date(test.completedAt) - new Date(test.createdAt);
        return sum + turnaround;
      }, 0);
      avgTurnaroundTime = totalTurnaround / completedTestsData.length / (1000 * 60 * 60); // in hours
    }
    
    res.json({
      success: true,
      data: {
        totalTests,
        pendingTests,
        inProgressTests,
        completedTests,
        urgentTests,
        emergencyTests,
        avgTurnaroundTime: avgTurnaroundTime.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all lab tests with filters
// @route   GET /api/lab-admin/tests
// @access  Private (Admin only)
const getAllLabTests = async (req, res) => {
  try {
    const { status, priority, patient, doctor, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (patient) {
      query.patient = patient;
    }
    if (doctor) {
      query.doctor = doctor;
    }
    
    const skip = (page - 1) * limit;
    
    const tests = await LabTest.find(query)
      .populate('patient', 'name age gender phone')
      .populate('doctor', 'name specialization')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await LabTest.countDocuments(query);
    
    res.json({
      success: true,
      count: tests.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: tests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign technician to lab test
// @route   PUT /api/lab-admin/tests/:id/assign
// @access  Private (Admin only)
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;
    
    const technician = await User.findOne({ 
      _id: technicianId, 
      role: 'Lab Technician' 
    });
    
    if (!technician) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lab technician not found' 
      });
    }
    
    const test = await LabTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lab test not found' 
      });
    }
    
    test.assignedTo = technicianId;
    if (test.status === 'Pending') {
      test.status = 'In Progress';
    }
    
    await test.save();
    
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get technician workload
// @route   GET /api/lab-admin/technicians/workload
// @access  Private (Admin only)
const getTechnicianWorkload = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'Lab Technician' });
    
    const workload = await Promise.all(
      technicians.map(async (tech) => {
        const pendingCount = await LabTest.countDocuments({
          assignedTo: tech._id,
          status: { $in: ['Pending', 'In Progress'] }
        });
        
        const completedCount = await LabTest.countDocuments({
          assignedTo: tech._id,
          status: 'Completed'
        });
        
        return {
          technicianId: tech._id,
          name: tech.name,
          email: tech.email,
          pendingTests: pendingCount,
          completedTests: completedCount,
          totalTests: pendingCount + completedCount
        };
      })
    );
    
    res.json({
      success: true,
      data: workload
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate lab report (aggregate statistics)
// @route   GET /api/lab-admin/reports
// @access  Private (Admin only)
const generateLabReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    // Tests by status
    const testsByStatus = await LabTest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Tests by priority
    const testsByPriority = await LabTest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Tests by type
    const testsByType = await LabTest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$testType', count: { $sum: 1 } } }
    ]);
    
    // Tests by technician
    const testsByTechnician = await LabTest.aggregate([
      { $match: { ...dateFilter, assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'technician'
        }
      },
      { $unwind: '$technician' },
      { $project: {
          technicianId: '$_id',
          name: '$technician.name',
          count: 1
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        testsByStatus,
        testsByPriority,
        testsByType,
        testsByTechnician,
        period: startDate && endDate ? { startDate, endDate } : 'All time'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLabStats,
  getAllLabTests,
  assignTechnician,
  getTechnicianWorkload,
  generateLabReport
};
