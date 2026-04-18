const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const LabTest = require('./models/LabTest');
const LabSample = require('./models/LabSample');
const LabNotification = require('./models/LabNotification');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital-management')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('Clearing existing lab data...');
    await LabTest.deleteMany();
    await LabSample.deleteMany();
    await LabNotification.deleteMany();

    // Get or create lab technician user
    let labTech = await User.findOne({ email: 'lab@hospital.com' });
    
    if (!labTech) {
      labTech = await User.create({
        name: 'John Lab',
        email: 'lab@hospital.com',
        password: 'lab123',
        role: 'Lab Technician'
      });
      console.log('✓ Lab Technician created: lab@hospital.com / lab123');
    }

    // Get existing patients and doctors
    const patients = await Patient.find().limit(5);
    const doctors = await Doctor.find().limit(3);

    if (patients.length === 0 || doctors.length === 0) {
      console.log('⚠ Please run the main seeder first to create patients and doctors');
      process.exit(1);
    }

    console.log('Creating lab test requests...');

    // Create sample lab tests
    const labTests = await LabTest.create([
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        requestedBy: labTech._id,
        testType: 'Blood Test',
        testName: 'Complete Blood Count (CBC)',
        priority: 'Urgent',
        status: 'Pending',
        sampleCollected: false,
        notes: 'Patient needs urgent blood work'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[0]._id,
        requestedBy: labTech._id,
        testType: 'Blood Sugar Test',
        testName: 'Fasting Blood Sugar',
        priority: 'Normal',
        status: 'In Progress',
        sampleCollected: true,
        sampleCollectionDate: new Date(),
        assignedEquipment: 'Auto Analyzer 1',
        assignedTechnician: labTech._id
      },
      {
        patient: patients[2]._id,
        doctor: doctors[1]._id,
        requestedBy: labTech._id,
        testType: 'Urine Test',
        testName: 'Urinalysis',
        priority: 'Normal',
        status: 'Pending',
        sampleCollected: false
      },
      {
        patient: patients[3]._id,
        doctor: doctors[2]._id,
        requestedBy: labTech._id,
        testType: 'Liver Function Test',
        testName: 'Liver Function Panel',
        priority: 'Critical',
        status: 'In Progress',
        sampleCollected: true,
        sampleCollectionDate: new Date(),
        assignedEquipment: 'Chemistry Analyzer',
        assignedTechnician: labTech._id
      },
      {
        patient: patients[4]._id,
        doctor: doctors[0]._id,
        requestedBy: labTech._id,
        testType: 'Thyroid Test',
        testName: 'Thyroid Profile (T3, T4, TSH)',
        priority: 'Normal',
        status: 'Pending',
        sampleCollected: false
      }
    ]);

    console.log(`✓ Created ${labTests.length} lab tests`);

    // Create samples for tests that have samples collected
    const samplesToCreate = labTests
      .filter(test => test.sampleCollected)
      .map(test => ({
        labTest: test._id,
        patient: test.patient,
        sampleType: test.testType === 'Blood Test' || test.testType === 'Blood Sugar Test' ? 'Blood' : 'Urine',
        collectionDate: new Date(),
        collectionStatus: 'Collected',
        collectedBy: labTech._id,
        collectionTime: new Date(),
        storageConditions: 'Refrigerated',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        storageLocation: 'Refrigerator A - Shelf 2'
      }));

    if (samplesToCreate.length > 0) {
      const samples = await LabSample.create(samplesToCreate);
      console.log(`✓ Created ${samples.length} samples`);
    }

    // Create notifications
    const notifications = await LabNotification.create([
      {
        technician: labTech._id,
        type: 'Urgent Test',
        title: 'Urgent Blood Test Required',
        message: `Patient ${patients[0].name} requires urgent Complete Blood Count test`,
        relatedTest: labTests[0]._id,
        priority: 'High'
      },
      {
        technician: labTech._id,
        type: 'Sample Collection',
        title: 'Sample Collection Pending',
        message: `Urine sample collection pending for patient ${patients[2].name}`,
        relatedTest: labTests[2]._id,
        priority: 'Medium'
      },
      {
        technician: labTech._id,
        type: 'Critical Test',
        title: 'Critical Liver Function Test',
        message: `Critical priority Liver Function Test in progress for patient ${patients[3].name}`,
        relatedTest: labTests[3]._id,
        priority: 'Critical'
      }
    ]);

    console.log(`✓ Created ${notifications.length} notifications`);

    console.log('\n✅ Lab Module Seeding Complete!');
    console.log('\nLab Technician Login Credentials:');
    console.log('Email: lab@hospital.com');
    console.log('Password: lab123');
    console.log('\nAccess the lab portal at: http://localhost:5173/lab-dashboard');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
