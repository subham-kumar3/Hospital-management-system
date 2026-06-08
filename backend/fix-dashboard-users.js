const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');

dotenv.config();

const connectDB = require('./config/db');

const fixDashboardUsers = async () => {
  try {
    await connectDB();

    // Create pharmacist if missing
    let pharmacist = await User.findOne({ email: 'pharmacist@hospital.com' });
    if (!pharmacist) {
      pharmacist = await User.create({
        name: 'Pharmacist Alex',
        email: 'pharmacist@hospital.com',
        password: 'pharmacy123',
        role: 'Pharmacist',
        isActive: true
      });
      console.log('✅ Pharmacist created: pharmacist@hospital.com / pharmacy123');
    } else {
      console.log('✅ Pharmacist already exists');
    }

    // Create lab technician if missing
    let labTech = await User.findOne({ email: 'lab@hospital.com' });
    if (!labTech) {
      labTech = await User.create({
        name: 'John Lab',
        email: 'lab@hospital.com',
        password: 'lab123',
        role: 'Lab Technician',
        isActive: true
      });
      console.log('✅ Lab Technician created: lab@hospital.com / lab123');
    } else {
      console.log('✅ Lab Technician already exists');
    }

    // Link patient users to patient records by email
    const patientUsers = await User.find({ role: 'Patient' });
    for (const user of patientUsers) {
      const altEmail = user.email.replace(/^patient\./, '');
      const patient = await Patient.findOne({
        $or: [{ email: user.email }, { email: altEmail }]
      });

      if (patient && !patient.user) {
        patient.user = user._id;
        await patient.save();
        console.log(`✅ Linked patient record for ${user.email} -> ${patient.email}`);
      } else if (!patient) {
        console.log(`⚠️  No patient record found for ${user.email}`);
      } else {
        console.log(`✅ Patient ${user.email} already linked`);
      }
    }

    console.log('\n🎉 Dashboard users fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixDashboardUsers();
