const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const addTodayAppointments = async () => {
  try {
    console.log('📅 Adding appointments for TODAY...');
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('Today\'s date:', today.toISOString().split('T')[0]);
    
    // Check existing appointments
    const existingAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name');
    
    console.log(`\n📊 Total appointments in database: ${existingAppointments.length}`);
    
    existingAppointments.forEach((apt, index) => {
      const aptDate = new Date(apt.date);
      console.log(`${index + 1}. Patient: ${apt.patient?.name || 'Unknown'} | Doctor: ${apt.doctor?.name || 'Unknown'} | Date: ${aptDate.toISOString().split('T')[0]} ${apt.time} | Status: ${apt.status}`);
    });
    
    // Get first patient and doctor
    const patients = await Patient.find();
    const doctors = await Doctor.find();
    
    if (patients.length === 0 || doctors.length === 0) {
      console.log('❌ No patients or doctors found. Run seeder first!');
      process.exit(1);
    }
    
    // Create 3 NEW appointments for TODAY
    const newAppointments = [
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        department: 'Cardiology',
        date: today, // Today at midnight
        time: '11:00 AM',
        type: 'Check-up',
        status: 'Confirmed'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        department: 'Neurology',
        date: today, // Today at midnight
        time: '02:00 PM',
        type: 'Consultation',
        status: 'Pending'
      },
      {
        patient: patients[2]._id,
        doctor: doctors[2]._id,
        department: 'Orthopedics',
        date: today, // Today at midnight
        time: '04:00 PM',
        type: 'Follow-up',
        status: 'Confirmed'
      }
    ];
    
    // Check if these appointments already exist
    const existingTodayAppointments = await Appointment.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Tomorrow
      }
    });
    
    if (existingTodayAppointments.length >= 3) {
      console.log(`✅ Already have ${existingTodayAppointments.length} appointments for today!`);
    } else {
      // Add new appointments
      for (const aptData of newAppointments) {
        const appointment = await Appointment.create(aptData);
        console.log(`✅ Created appointment: ${aptData.patientName || 'Patient'} with ${aptData.doctorName || 'Doctor'} at ${aptData.time}`);
      }
      console.log(`\n🎉 Added ${newAppointments.length} appointments for TODAY!`);
    }
    
    // Final count
    const finalCount = await Appointment.countDocuments();
    console.log(`\n📊 Final appointment count: ${finalCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

addTodayAppointments();
