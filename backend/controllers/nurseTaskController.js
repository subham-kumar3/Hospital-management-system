const NurseTask = require('../models/NurseTask');
const Patient = require('../models/Patient');

// @desc    Create a new task
// @route   POST /api/nurse/tasks
// @access  Private/Nurse
const createTask = async (req, res) => {
  try {
    const { patientId, taskName, taskType, description, priority, scheduledTime, notes } = req.body;

    // Verify patient exists and is assigned to this nurse
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Check if patient is assigned to this nurse
    if (patient.assignedNurse && patient.assignedNurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to create tasks for this patient' 
      });
    }

    const task = await NurseTask.create({
      nurse: req.user.id,
      patient: patientId,
      taskName,
      taskType,
      description,
      priority,
      scheduledTime,
      notes,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks for the logged-in nurse
// @route   GET /api/nurse/tasks
// @access  Private/Nurse
const getTasks = async (req, res) => {
  try {
    const { status, priority, patientId, search, page = 1, limit = 20 } = req.query;

    // Build query
    let query = { nurse: req.user.id };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (patientId) {
      query.patient = patientId;
    }

    if (search) {
      query.$or = [
        { taskName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const tasks = await NurseTask.find(query)
      .populate('patient', 'name age roomNumber bedNumber')
      .populate('createdBy', 'name')
      .sort({ scheduledTime: 1, priority: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await NurseTask.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/nurse/tasks/stats
// @access  Private/Nurse
const getTaskStats = async (req, res) => {
  try {
    const nurseId = req.user.id;

    const [pending, inProgress, completed, urgent] = await Promise.all([
      NurseTask.countDocuments({ nurse: nurseId, status: 'Pending' }),
      NurseTask.countDocuments({ nurse: nurseId, status: 'In Progress' }),
      NurseTask.countDocuments({ nurse: nurseId, status: 'Completed' }),
      NurseTask.countDocuments({ nurse: nurseId, status: { $in: ['Pending', 'In Progress'] }, priority: 'Urgent' })
    ]);

    res.json({
      success: true,
      data: {
        pending,
        inProgress,
        completed,
        urgent
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/nurse/tasks/:id
// @access  Private/Nurse
const updateTask = async (req, res) => {
  try {
    let task = await NurseTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if nurse owns this task
    if (task.nurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this task' 
      });
    }

    // If marking as completed, set completedAt
    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedAt = new Date();
    }

    task = await NurseTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('patient', 'name age roomNumber');

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/nurse/tasks/:id
// @access  Private/Nurse
const deleteTask = async (req, res) => {
  try {
    const task = await NurseTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if nurse owns this task
    if (task.nurse.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this task' 
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask
};
