const Appointment = require('../models/Appointment');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Public
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone bloodGroup age')
      .populate('doctor', 'name specialization department email phone')
      .sort({ createdAt: -1 });
    
    // Map to ensure consistent format
    const formattedAppointments = appointments.map(apt => ({
      _id: apt._id,
      patient: apt.patient || { name: 'Unknown Patient' },
      doctor: apt.doctor || { name: 'Doctor Assigned' },
      department: apt.department,
      date: apt.date,
      time: apt.time,
      type: apt.type,
      status: apt.status,
      notes: apt.notes,
      prescription: apt.prescription,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt
    }));
    
    res.json({ success: true, data: formattedAppointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup age')
      .populate('doctor', 'name specialization department email phone');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Format response
    const formattedAppointment = {
      _id: appointment._id,
      patient: appointment.patient || { name: 'Unknown Patient' },
      doctor: appointment.doctor || { name: 'Doctor Assigned' },
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      prescription: appointment.prescription,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
    
    res.json({ success: true, data: formattedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body };
    
    // If patientName is provided but no patient ID, we'll just store it as a string
    // In a real system, you'd want to create/link actual Patient records
    
    const appointment = await Appointment.create(appointmentData);
    
    // Populate and return
    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone bloodGroup age')
      .populate('doctor', 'name specialization department email phone');
    
    res.status(201).json({ 
      success: true, 
      data: {
        _id: populated._id,
        patient: populated.patient || { name: appointmentData.patientName || 'Unknown Patient' },
        doctor: populated.doctor || { name: 'Doctor Assigned' },
        department: populated.department,
        date: populated.date,
        time: populated.time,
        type: populated.type,
        status: populated.status,
        notes: populated.notes,
        createdAt: populated.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('patient', 'name email phone bloodGroup age')
     .populate('doctor', 'name specialization department email phone');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    // Format response
    const formattedAppointment = {
      _id: appointment._id,
      patient: appointment.patient || { name: 'Unknown Patient' },
      doctor: appointment.doctor || { name: 'Doctor Assigned' },
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      prescription: appointment.prescription,
      updatedAt: appointment.updatedAt
    };
    
    res.json({ success: true, data: formattedAppointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Public
const getAppointmentsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization department')
      .sort({ time: 1 });
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get appointments by status
// @route   GET /api/appointments/status/:status
// @access  Public
const getAppointmentsByStatus = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: req.params.status })
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization department')
      .sort({ date: -1, time: 1 });
    
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate,
  getAppointmentsByStatus
};
