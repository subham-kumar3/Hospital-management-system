const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const Doctor = require('../models/Doctor');

// Helper function to get patient record from user
const getPatientByUserId = async (userId) => {
  return await Patient.findOne({ user: userId });
};

// @desc    Get patient dashboard data
// @route   GET /api/patient/dashboard
// @access  Private (Patient only)
const getPatientDashboard = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patient: patient._id,
      date: { $gte: new Date() },
      status: { $in: ['Confirmed', 'Pending'] }
    })
      .populate('doctor', 'name specialization department')
      .sort({ date: 1, time: 1 })
      .limit(5);

    // Get recent prescriptions
    const recentPrescriptions = await Prescription.find({
      patient: patient._id
    })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(3);

    // Get pending bills
    const pendingBills = await Bill.find({
      patient: patient._id,
      paymentStatus: { $in: ['Pending', 'Partial'] }
    });

    // Get total visits
    const totalVisits = await Appointment.countDocuments({
      patient: patient._id,
      status: 'Completed'
    });

    res.json({
      success: true,
      data: {
        patient,
        upcomingAppointments,
        recentPrescriptions,
        pendingBills: pendingBills.length,
        totalVisits,
        stats: {
          upcomingAppointments: upcomingAppointments.length,
          activePrescriptions: recentPrescriptions.filter(p => p.status === 'Active').length,
          pendingBills: pendingBills.length,
          totalVisits
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient only)
const getPatientAppointments = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({
      patient: patient._id
    })
      .populate('doctor', 'name specialization department')
      .sort({ date: -1, time: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book new appointment
// @route   POST /api/patient/appointments
// @access  Private (Patient only)
const bookAppointment = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const { doctor, department, date, time, type, notes } = req.body;

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot book appointment for a past date' 
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor,
      department,
      date: appointmentDate,
      time,
      type: type || 'Consultation',
      notes,
      status: 'Pending'
    });

    // Create notification
    await Notification.create({
      patient: patient._id,
      title: 'Appointment Booked',
      message: `Your appointment has been booked for ${new Date(date).toLocaleDateString()} at ${time}`,
      type: 'General',
      relatedTo: appointment._id,
      relatedModel: 'Appointment'
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization department');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private (Patient only)
const cancelAppointment = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: patient._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/patient/appointments/:id/reschedule
// @access  Private (Patient only)
const rescheduleAppointment = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: patient._id
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const { date, time } = req.body;
    const newDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot reschedule to a past date' 
      });
    }

    appointment.date = newDate;
    appointment.time = time;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('doctor', 'name specialization department');

    res.json({ success: true, message: 'Appointment rescheduled successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private (Patient only)
const getPatientPrescriptions = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const prescriptions = await Prescription.find({
      patient: patient._id
    })
      .populate('doctor', 'name specialization department')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient medical records
// @route   GET /api/patient/medical-records
// @access  Private (Patient only)
const getPatientMedicalRecords = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const records = await MedicalRecord.find({
      patient: patient._id
    })
      .populate('doctor', 'name specialization department')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient bills
// @route   GET /api/patient/bills
// @access  Private (Patient only)
const getPatientBills = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const bills = await Bill.find({
      patient: patient._id
    })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private (Patient only)
const getPatientProfile = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const user = await User.findById(req.user.id).select('-password');

    res.json({ 
      success: true, 
      data: {
        user,
        patient
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patient/profile
// @access  Private (Patient only)
const updatePatientProfile = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    // Update user fields
    const userUpdateFields = ['name', 'email'];
    const userUpdates = {};
    userUpdateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        userUpdates[field] = req.body[field];
      }
    });

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdates);
    }

    // Update patient fields
    const patientUpdateFields = ['name', 'age', 'gender', 'bloodGroup', 'phone', 'address'];
    const patientUpdates = {};
    patientUpdateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        patientUpdates[field] = req.body[field];
      }
    });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patient._id,
      patientUpdates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated successfully', data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/patient/change-password
// @access  Private (Patient only)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide current and new password' 
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient notifications
// @route   GET /api/patient/notifications
// @access  Private (Patient only)
const getNotifications = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const notifications = await Notification.find({
      patient: patient._id
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ 
      success: true, 
      data: notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/patient/notifications/:id/read
// @access  Private (Patient only)
const markNotificationRead = async (req, res) => {
  try {
    const patient = await getPatientByUserId(req.user.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      patient: patient._id
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPatientDashboard,
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getPatientPrescriptions,
  getPatientMedicalRecords,
  getPatientBills,
  getPatientProfile,
  updatePatientProfile,
  changePassword,
  getNotifications,
  markNotificationRead
};
