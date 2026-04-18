const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const LabTest = require('../models/LabTest');
const DoctorNote = require('../models/DoctorNote');
const Vital = require('../models/Vital');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get doctor dashboard data
// @route   GET /api/doctor-portal/dashboard
// @access  Private/Doctor
const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's appointments
    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('patient', 'name age gender phone');

    // Get total patients
    const totalPatients = await Appointment.distinct('patient', { doctor: doctorId });

    // Get pending lab tests
    const pendingLabTests = await LabTest.countDocuments({
      doctor: doctorId,
      status: 'Pending'
    });

    // Get unread notifications
    const unreadNotifications = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        todayAppointments: todayAppointments.length,
        appointments: todayAppointments,
        totalPatients: totalPatients.length,
        pendingLabTests,
        unreadNotifications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/doctor-portal/appointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;
    const { status, date } = req.query;

    let query = { doctor: doctorId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: selectedDate, $lt: nextDay };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name age gender phone')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/doctor-portal/appointments/:id
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = req.body.status || appointment.status;
    
    if (req.body.newDate) {
      appointment.date = req.body.newDate;
    }
    if (req.body.newTime) {
      appointment.time = req.body.newTime;
    }

    await appointment.save();

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor's patients
// @route   GET /api/doctor-portal/patients
// @access  Private/Doctor
const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;
    const { search } = req.query;

    // Get all patients who had appointments with this doctor
    const appointments = await Appointment.find({ doctor: doctorId }).distinct('patient');

    let query = { _id: { $in: appointments } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient complete details
// @route   GET /api/doctor-portal/patients/:id
// @access  Private/Doctor
const getPatientCompleteDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Get patient vitals
    const vitals = await Vital.find({ patient: req.params.id })
      .populate('nurse', 'name')
      .sort({ recordedAt: -1 })
      .limit(20);

    // Get patient prescriptions
    const prescriptions = await Prescription.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    // Get patient lab tests
    const labTests = await LabTest.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    // Get doctor notes
    const doctorNotes = await DoctorNote.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ visitDate: -1 });

    // Get appointment history
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        patient,
        vitals,
        prescriptions,
        labTests,
        doctorNotes,
        appointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create prescription
// @route   POST /api/doctor-portal/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;

    const prescription = await Prescription.create({
      ...req.body,
      doctor: doctorId
    });

    res.status(201).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update prescription
// @route   PUT /api/doctor-portal/prescriptions/:id
// @access  Private/Doctor
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Order lab test
// @route   POST /api/doctor-portal/lab-tests
// @access  Private/Doctor
const orderLabTest = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;

    const labTest = await LabTest.create({
      ...req.body,
      doctor: doctorId,
      requestedBy: req.user.id
    });

    // Create notification for lab
    const labUsers = await User.find({ role: 'Lab Technician' });
    if (labUsers.length > 0) {
      await Notification.create({
        recipient: labUsers[0]._id,
        sender: req.user.id,
        title: 'New Lab Test Request',
        message: `Dr. ${req.user.name} ordered a ${req.body.testType} for patient`,
        type: 'Alert'
      });
    }

    res.status(201).json({
      success: true,
      data: labTest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor's lab test orders
// @route   GET /api/doctor-portal/lab-tests
// @access  Private/Doctor
const getDoctorLabTests = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;
    const { status } = req.query;

    let query = { doctor: doctorId };

    if (status) {
      query.status = status;
    }

    const labTests = await LabTest.find(query)
      .populate('patient', 'name age gender')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: labTests.length,
      data: labTests
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add doctor note
// @route   POST /api/doctor-portal/notes
// @access  Private/Doctor
const addDoctorNote = async (req, res) => {
  try {
    const doctorId = req.user.doctorProfile || req.user.id;

    const note = await DoctorNote.create({
      ...req.body,
      doctor: doctorId
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor notes for a patient
// @route   GET /api/doctor-portal/notes/patient/:patientId
// @access  Private/Doctor
const getDoctorNotes = async (req, res) => {
  try {
    const notes = await DoctorNote.find({ patient: req.params.patientId })
      .populate('doctor', 'name specialization')
      .sort({ visitDate: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor note
// @route   PUT /api/doctor-portal/notes/:id
// @access  Private/Doctor
const updateDoctorNote = async (req, res) => {
  try {
    const note = await DoctorNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const updated = await DoctorNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor notifications
// @route   GET /api/doctor-portal/notifications
// @access  Private/Doctor
const getDoctorNotifications = async (req, res) => {
  try {
    const { type, isRead } = req.query;

    let query = { recipient: req.user.id };

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/doctor-portal/notifications/:id/read
// @access  Private/Doctor
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDoctorDashboard,
  getDoctorAppointments,
  updateAppointmentStatus,
  getDoctorPatients,
  getPatientCompleteDetails,
  createPrescription,
  updatePrescription,
  orderLabTest,
  getDoctorLabTests,
  addDoctorNote,
  getDoctorNotes,
  updateDoctorNote,
  getDoctorNotifications,
  markNotificationRead
};
