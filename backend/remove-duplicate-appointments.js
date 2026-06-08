const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const removeDuplicateAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all appointments
    const allAppointments = await Appointment.find();
    console.log(`📊 Total appointments before cleanup: ${allAppointments.length}`);

    // Group appointments by date and time
    const appointmentMap = new Map();
    const duplicatesToDelete = [];

    allAppointments.forEach(apt => {
      const key = `${apt.date.toISOString()}-${apt.time}`;
      
      if (appointmentMap.has(key)) {
        // This is a duplicate, mark for deletion
        duplicatesToDelete.push(apt._id);
      } else {
        // First occurrence, keep it
        appointmentMap.set(key, apt._id);
      }
    });

    console.log(`🗑️  Found ${duplicatesToDelete.length} duplicate appointments`);

    // Delete duplicates
    if (duplicatesToDelete.length > 0) {
      const result = await Appointment.deleteMany({ _id: { $in: duplicatesToDelete } });
      console.log(`✅ Deleted ${result.deletedCount} duplicate appointments`);
    }

    // Show remaining appointments
    const remainingAppointments = await Appointment.find().sort({ date: 1, time: 1 });
    console.log(`\n📋 Remaining appointments: ${remainingAppointments.length}`);
    
    // Group by date
    const groupedByDate = {};
    remainingAppointments.forEach(apt => {
      const dateStr = new Date(apt.date).toLocaleDateString();
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = [];
      }
      groupedByDate[dateStr].push(apt.time);
    });

    console.log('\n📅 Appointments by date:');
    Object.entries(groupedByDate).forEach(([date, times]) => {
      console.log(`  ${date}: ${times.length} appointments`);
      times.forEach(time => console.log(`    - ${time}`));
    });

    console.log('\n✅ Cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

removeDuplicateAppointments();
