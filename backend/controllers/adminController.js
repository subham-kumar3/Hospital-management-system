const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const { generateTempPassword, validateEmail, validatePhone, validatePassword, sanitizeInput } = require('../utils/passwordUtils');
const { emitActivityLog, emitNotification, emitDashboardUpdate } = require('../services/socketService');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const appointmentsToday = await Appointment.countDocuments({
      date: { $gte: today }
    });

    const pendingAppointments = await Appointment.countDocuments({
      status: 'Pending'
    });

    const pendingBills = await Bill.countDocuments({
      paymentStatus: 'Pending'
    });

    // Recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients,
          totalDoctors,
          totalUsers,
          appointmentsToday,
          pendingAppointments,
          pendingBills
        },
        recentAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, search, status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role && role !== 'All') {
      query.role = role;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({ 
      success: true, 
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'User role updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log the action
    await AdminLog.create({
      admin: req.user._id,
      action: 'DELETE_USER',
      targetType: user.role,
      targetId: user._id,
      targetName: user.name,
      details: { email: user.email, role: user.role },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;

    // Validate email
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate phone if provided
    if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone format' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Generate temporary password or use provided one
    let tempPassword = password;
    let autoGenerated = false;
    
    if (!tempPassword) {
      tempPassword = generateTempPassword();
      autoGenerated = true;
    } else {
      // Validate password strength
      const validation = validatePassword(tempPassword);
      if (!validation.isValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Weak password',
          errors: validation.errors
        });
      }
    }

    // Create user
    const userData = {
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      role,
      password: tempPassword,
      isFirstLogin: true,
      status: 'Active',
      createdBy: req.user._id
    };

    const user = await User.create(userData);

    // Log the action
    const log = await AdminLog.create({
      admin: req.user._id,
      action: 'CREATE_USER',
      targetType: role,
      targetId: user._id,
      targetName: user.name,
      details: { 
        email: user.email, 
        role: user.role,
        userId: user.userId,
        autoGeneratedPassword: autoGenerated
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Emit real-time events
    emitActivityLog(log);
    emitNotification({
      title: 'New User Created',
      message: `${user.name} (${user.role}) has been added to the system`,
      type: 'Info',
      recipient: 'all'
    }, { broadcast: true });
    emitDashboardUpdate({ type: 'user_created', role });

    // Return user with temporary password (only in response, not stored)
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      data: {
        user: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          isFirstLogin: user.isFirstLogin
        },
        temporaryPassword: tempPassword,
        autoGenerated,
        note: autoGenerated ? 'Please share this password with the user securely' : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user information
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Sanitize inputs
    const updates = {};
    if (name) updates.name = sanitizeInput(name);
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      // Check if email is already used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      updates.email = email.toLowerCase();
    }
    if (phone) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone format' });
      }
      updates.phone = sanitizeInput(phone);
    }
    if (role) updates.role = role;
    if (status) updates.status = status;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    // Log the action
    await AdminLog.create({
      admin: req.user._id,
      action: 'UPDATE_USER',
      targetType: user.role,
      targetId: user._id,
      targetName: user.name,
      details: { updates, previousData: { name: user.name, email: user.email, role: user.role, status: user.status } },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset user password
// @route   POST /api/admin/users/:id/reset-password
// @access  Private (Admin only)
const resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate new temporary password
    const newPassword = generateTempPassword();

    // Update user password
    user.password = newPassword;
    user.isFirstLogin = true;
    await user.save();

    // Log the action
    await AdminLog.create({
      admin: req.user._id,
      action: 'RESET_PASSWORD',
      targetType: user.role,
      targetId: user._id,
      targetName: user.name,
      details: { email: user.email },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ 
      success: true, 
      message: 'Password reset successfully',
      data: {
        userId: user.userId,
        email: user.email,
        newPassword,
        note: 'User must change password on first login'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk import users from CSV/Excel
// @route   POST /api/admin/users/bulk-import
// @access  Private (Admin only)
const bulkImportUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ success: false, message: 'No users data provided' });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [],
      createdUsers: []
    };

    for (const userData of users) {
      try {
        const { name, email, phone, role } = userData;

        // Validate required fields
        if (!name || !email || !role) {
          results.failed++;
          results.errors.push({
            data: userData,
            error: 'Missing required fields: name, email, role'
          });
          continue;
        }

        // Validate email
        if (!validateEmail(email)) {
          results.failed++;
          results.errors.push({ data: userData, error: 'Invalid email format' });
          continue;
        }

        // Check if email exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          results.failed++;
          results.errors.push({ data: userData, error: 'Email already exists' });
          continue;
        }

        // Generate temporary password
        const tempPassword = generateTempPassword();

        // Create user
        const newUser = await User.create({
          name: sanitizeInput(name),
          email: email.toLowerCase(),
          phone: phone ? sanitizeInput(phone) : null,
          role,
          password: tempPassword,
          isFirstLogin: true,
          status: 'Active',
          createdBy: req.user._id
        });

        results.success++;
        results.createdUsers.push({
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          temporaryPassword: tempPassword
        });

      } catch (error) {
        results.failed++;
        results.errors.push({
          data: userData,
          error: error.message
        });
      }
    }

    // Log the action
    await AdminLog.create({
      admin: req.user._id,
      action: 'BULK_IMPORT',
      targetType: 'User',
      targetId: req.user._id,
      targetName: req.user.name,
      details: { 
        total: users.length,
        success: results.success,
        failed: results.failed
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: `Bulk import completed: ${results.success} success, ${results.failed} failed`,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate or deactivate user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Inactive', 'Locked'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log the action
    await AdminLog.create({
      admin: req.user._id,
      action: status === 'Active' ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      targetType: user.role,
      targetId: user._id,
      targetName: user.name,
      details: { status },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, message: `User ${status.toLowerCase()} successfully`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin logs
// @route   GET /api/admin/logs
// @access  Private (Admin only)
const getAdminLogs = async (req, res) => {
  try {
    const { action, page = 1, limit = 50 } = req.query;

    let query = {};
    if (action) {
      query.action = action;
    }

    const skip = (page - 1) * limit;

    const logs = await AdminLog.find(query)
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AdminLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private (Admin only)
const getAllPatients = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/admin/patients/:id
// @access  Private (Admin only)
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Patient updated', data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/admin/patients/:id
// @access  Private (Admin only)
const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
const getAllAppointments = async (req, res) => {
  try {
    const { date, status, doctor } = req.query;
    
    let query = {};
    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (status) {
      query.status = status;
    }
    if (doctor) {
      query.doctor = doctor;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization department')
      .sort({ date: -1, time: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/admin/appointments/:id
// @access  Private (Admin only)
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'name')
      .populate('doctor', 'name specialization');

    res.json({ success: true, message: 'Appointment updated', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
// @access  Private (Admin only)
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get financial overview
// @route   GET /api/admin/financial
// @access  Private (Admin only)
const getFinancialOverview = async (req, res) => {
  try {
    const bills = await Bill.find();
    
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const totalPending = totalRevenue - totalPaid;

    const paidBills = bills.filter(b => b.paymentStatus === 'Paid').length;
    const pendingBills = bills.filter(b => b.paymentStatus === 'Pending').length;
    const partialBills = bills.filter(b => b.paymentStatus === 'Partial').length;

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalPaid,
          totalPending,
          paidBills,
          pendingBills,
          partialBills,
          totalBills: bills.length
        },
        bills
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reports data
// @route   GET /api/admin/reports
// @access  Private (Admin only)
const getReports = async (req, res) => {
  try {
    const { type } = req.query;

    let reportData = {};

    if (type === 'patients') {
      const totalPatients = await Patient.countDocuments();
      const patientsByGender = await Patient.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]);
      reportData = { totalPatients, patientsByGender };
    } else if (type === 'appointments') {
      const totalAppointments = await Appointment.countDocuments();
      const appointmentsByStatus = await Appointment.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      reportData = { totalAppointments, appointmentsByStatus };
    } else if (type === 'doctors') {
      const totalDoctors = await Doctor.countDocuments();
      const doctorsByDepartment = await Doctor.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ]);
      reportData = { totalDoctors, doctorsByDepartment };
    }

    res.json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/admin/notifications
// @access  Private (Admin only)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create notification
// @route   POST /api/admin/notifications
// @access  Private (Admin only)
const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  resetPassword,
  bulkImportUsers,
  getAdminLogs,
  getAllPatients,
  updatePatient,
  deletePatient,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getFinancialOverview,
  getReports,
  getNotifications,
  createNotification
};
