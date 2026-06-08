const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createReceptionistUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if receptionist already exists
    const existingReceptionist = await User.findOne({ email: 'receptionist@hospital.com' });
    
    if (existingReceptionist) {
      console.log('⚠️  Updating existing receptionist user...');
      
      // Update the user
      existingReceptionist.name = 'James';
      existingReceptionist.password = 'receptionist123'; // This will be hashed by the pre-save hook
      existingReceptionist.isActive = true;
      existingReceptionist.status = 'Active';
      existingReceptionist.loginAttempts = 0;
      
      await existingReceptionist.save();
      
      console.log('✅ Receptionist user updated successfully!');
      console.log('Login credentials:');
      console.log('  Email: receptionist@hospital.com');
      console.log('  Password: receptionist123');
      console.log('  Name: James');
    } else {
      // Create receptionist user
      const receptionist = new User({
        name: 'James',
        email: 'receptionist@hospital.com',
        password: 'receptionist123',
        role: 'Receptionist',
        isActive: true
      });

      await receptionist.save();
      console.log('✅ Receptionist user created successfully!');
      console.log('Login credentials:');
      console.log('  Email: receptionist@hospital.com');
      console.log('  Password: receptionist123');
    }

    // List all users
    const allUsers = await User.find({}, 'name email role isActive status');
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createReceptionistUser();
