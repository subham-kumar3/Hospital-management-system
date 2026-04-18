const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('headOfDepartment', 'name specialization');
    
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('headOfDepartment', 'name specialization email phone')
      .populate({
        path: 'headOfDepartment',
        populate: {
          path: '_id',
          model: 'Doctor'
        }
      });
    
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    // Get doctors in this department
    const doctors = await Doctor.find({ department: department.name });
    department.totalDoctors = doctors.length;
    
    // Get patients count for this department (approximate based on appointments)
    const patientCount = await Doctor.aggregate([
      { $match: { department: department.name } },
      { $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'doctor',
          as: 'appointments'
        }
      },
      { $unwind: '$appointments' },
      { $group: { _id: '$appointments.patient', count: { $sum: 1 } } }
    ]);
    
    department.totalPatients = patientCount.length;
    
    await department.save();
    
    res.json({ 
      success: true, 
      data: department,
      doctors: doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Public
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Public
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Public
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get department statistics
// @route   GET /api/departments/stats/overview
// @access  Public
const getDepartmentStats = async (req, res) => {
  try {
    const stats = await Department.aggregate([
      {
        $group: {
          _id: null,
          totalDepartments: { $sum: 1 },
          activeDepartments: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({ success: true, data: stats[0] || { totalDepartments: 0, activeDepartments: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
};
