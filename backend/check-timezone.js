const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const checkTimezone = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const now = new Date();
    console.log('Current time:', now.toString());
    console.log('ISO:', now.toISOString());
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('\nToday (local):', today.toLocaleDateString());
    console.log('Today (ISO):', today.toISOString());
    
    // Get all appointments
    const allAppointments = await Appointment.find();
    console.log('\n📊 All appointments in database:');
    
    allAppointments.forEach((apt, i) => {
      const aptDate = new Date(apt.date);
      console.log(`${i + 1}. DB: ${aptDate.toISOString()} | Local: ${aptDate.toLocaleDateString()} ${apt.time}`);
    });
    
    // Count with date range
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const count = await Appointment.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    console.log('\n📈 Count:');
    console.log(`Appointments between ${today.toISOString()} and ${tomorrow.toISOString()}: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkTimezone();
