const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const fixAppointmentDates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('📅 Today:', today.toISOString().split('T')[0]);

    // Get all April 30 appointments
    const april30 = new Date('2026-04-30');
    april30.setHours(0, 0, 0, 0);
    
    const oldAppointments = await Appointment.find({ date: april30 });
    console.log(`📊 Found ${oldAppointments.length} appointments for April 30`);

    // Update them to today
    if (oldAppointments.length > 0) {
      const result = await Appointment.updateMany(
        { date: april30 },
        { $set: { date: today } }
      );
      console.log(`✅ Updated ${result.modifiedCount} appointments to today (${today.toISOString().split('T')[0]})`);
    }

    // Verify
    const todayCount = await Appointment.countDocuments({ date: today });
    const totalCount = await Appointment.countDocuments();
    
    console.log('\n📈 Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`Total appointments: ${totalCount}`);
    console.log(`Today's appointments (April 29): ${todayCount}`);
    console.log('═══════════════════════════════════════');

    // Show all appointments
    const allAppointments = await Appointment.find().sort({ date: 1, time: 1 });
    console.log('\n📋 All appointments:');
    allAppointments.forEach((apt, i) => {
      const dateStr = new Date(apt.date).toLocaleDateString();
      console.log(`${i + 1}. ${dateStr} - ${apt.time} - ${apt.status}`);
    });

    console.log('\n✅ Dashboard will now show correct count!');
    console.log('🔄 Refresh your dashboard to see the updated count.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

fixAppointmentDates();
