const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const checkUsers = async () => {
  try {
    console.log('\n🔍 Checking users in database...\n');
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ NO USERS FOUND IN DATABASE!');
      console.log('\n📋 You need to run the seeder:');
      console.log('   node seeder.js\n');
    } else {
      console.log(`✅ Found ${users.length} users:\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('');
      });
      
      // Check for specific users
      console.log('\n🔐 Checking specific login credentials:\n');
      
      const testEmails = [
        'nurse.sarah@hospital.com',
        'receptionist@hospital.com',
        'patient.john@email.com'
      ];
      
      for (const email of testEmails) {
        const user = await User.findOne({ email });
        if (user) {
          console.log(`✅ ${email} - EXISTS (Role: ${user.role})`);
        } else {
          console.log(`❌ ${email} - NOT FOUND`);
        }
      }
    }
    
    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
