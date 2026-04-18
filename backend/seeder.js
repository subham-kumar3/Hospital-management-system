const dotenv = require('dotenv');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const MedicalRecord = require('./models/MedicalRecord');
const User = require('./models/User');
const Department = require('./models/Department');
const Enquiry = require('./models/Enquiry');
const Notification = require('./models/Notification');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const samplePatients = [
  {
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 234-567-8901',
    email: 'john@email.com',
    address: '123 Main St, City',
    status: 'Admitted',
    ward: 'General Ward',
    roomNumber: '101',
    bedNumber: 'A1'
  },
  {
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 234-567-8902',
    email: 'sarah@email.com',
    address: '456 Oak Ave, City',
    status: 'Stable',
    ward: 'ICU',
    roomNumber: '201',
    bedNumber: 'B2'
  },
  {
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+1 234-567-8903',
    email: 'michael@email.com',
    address: '789 Pine Rd, City',
    status: 'Critical',
    ward: 'Emergency',
    roomNumber: 'E1',
    bedNumber: 'C1'
  },
  {
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+1 234-567-8904',
    email: 'emily.d@email.com',
    address: '321 Elm St, City',
    status: 'Admitted',
    ward: 'Private Room',
    roomNumber: '301',
    bedNumber: 'D1'
  },
  {
    name: 'Robert Wilson',
    age: 65,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+1 234-567-8905',
    email: 'robert@email.com',
    address: '654 Maple Ave, City',
    status: 'Stable',
    ward: 'General Ward',
    roomNumber: '102',
    bedNumber: 'A2'
  }
];

const sampleDoctors = [
  {
    name: 'Dr. Emily Brown',
    specialization: 'Cardiology',
    qualification: 'MD, DM',
    experience: 15,
    phone: '+1 234-567-8901',
    email: 'emily@hospital.com',
    department: 'Cardiology',
    status: 'Active',
    consultationFee: 500
  },
  {
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    qualification: 'MBBS, MD',
    experience: 12,
    phone: '+1 234-567-8902',
    email: 'michael@hospital.com',
    department: 'Neurology',
    status: 'Active',
    consultationFee: 450
  },
  {
    name: 'Dr. Lisa Wilson',
    specialization: 'Orthopedics',
    qualification: 'MS, MCh',
    experience: 18,
    phone: '+1 234-567-8903',
    email: 'lisa@hospital.com',
    department: 'Orthopedics',
    status: 'Active',
    consultationFee: 550
  }
];

const sampleDepartments = [
  {
    name: 'Cardiology',
    description: 'Heart and cardiovascular system treatment',
    floor: '3rd Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8001',
    email: 'cardiology@hospital.com',
    status: 'Active'
  },
  {
    name: 'Neurology',
    description: 'Brain and nervous system disorders',
    floor: '4th Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8002',
    email: 'neurology@hospital.com',
    status: 'Active'
  },
  {
    name: 'Orthopedics',
    description: 'Bones, joints, and muscle treatment',
    floor: '2nd Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8003',
    email: 'orthopedics@hospital.com',
    status: 'Active'
  },
  {
    name: 'Pediatrics',
    description: 'Child healthcare and treatment',
    floor: '1st Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8004',
    email: 'pediatrics@hospital.com',
    status: 'Active'
  },
  {
    name: 'Dermatology',
    description: 'Skin, hair, and nail treatment',
    floor: '2nd Floor',
    equipment: 'Modern',
    phone: '+1 234-567-8005',
    email: 'dermatology@hospital.com',
    status: 'Active'
  },
  {
    name: 'General Surgery',
    description: 'Surgical procedures and operations',
    floor: '5th Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8006',
    email: 'surgery@hospital.com',
    status: 'Active'
  },
  {
    name: 'Emergency',
    description: '24/7 emergency medical services',
    floor: 'Ground Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8007',
    email: 'emergency@hospital.com',
    status: 'Active'
  },
  {
    name: 'Radiology',
    description: 'Medical imaging and diagnostics',
    floor: '1st Floor',
    equipment: 'Advanced',
    phone: '+1 234-567-8008',
    email: 'radiology@hospital.com',
    status: 'Active'
  }
];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data safely
    console.log('Clearing existing data...');
    try {
      await Patient.deleteMany({});
      await Doctor.deleteMany({});
      await Appointment.deleteMany({});
      await MedicalRecord.deleteMany({});
      await User.deleteMany({});
      await Department.deleteMany({});
      await Enquiry.deleteMany({});
      await Notification.deleteMany({});
      console.log('✅ Cleared existing data');
    } catch (error) {
      console.log('⚠️  Collections may not exist yet, continuing...');
    }

    // Insert patients
    const patients = [];
    for (const patientData of samplePatients) {
      const patient = await Patient.create(patientData);
      patients.push(patient);
    }
    console.log('✅ Patients added:', patients.length);

    // Insert doctors
    const doctors = [];
    for (const doctorData of sampleDoctors) {
      const doctor = await Doctor.create(doctorData);
      doctors.push(doctor);
    }
    console.log('✅ Doctors added:', doctors.length);

    // Insert departments
    const departments = [];
    for (const deptData of sampleDepartments) {
      const department = await Department.create(deptData);
      departments.push(department);
    }
    console.log('✅ Departments added:', departments.length);

    // Create admin user with hashed password
    const users = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'admin123',  // Mongoose pre-save hook will hash this automatically
      role: 'Admin'
    });
    
    // Create doctor users - use create() to trigger password hashing
    const doctorUserData = [
      {
        name: 'Dr. Emily Brown',
        email: 'dr.emily@hospital.com',
        password: 'doctor123',
        role: 'Doctor',
        doctorProfile: doctors[0]._id,
        isActive: true
      },
      {
        name: 'Dr. Michael Chen',
        email: 'dr.michael@hospital.com',
        password: 'doctor123',
        role: 'Doctor',
        doctorProfile: doctors[1]._id,
        isActive: true
      },
      {
        name: 'Dr. Lisa Wilson',
        email: 'dr.lisa@hospital.com',
        password: 'doctor123',
        role: 'Doctor',
        doctorProfile: doctors[2]._id,
        isActive: true
      }
    ];
    
    const doctorUsers = [];
    for (const docData of doctorUserData) {
      const doctorUser = await User.create(docData);
      doctorUsers.push(doctorUser);
    }
    
    console.log('✅ Doctor users created:', doctorUsers.length);

    // Create Nurse users
    const nurseUsers = await User.create([
      {
        name: 'Nurse Sarah',
        email: 'nurse.sarah@hospital.com',
        password: 'nurse123',
        role: 'Nurse',
        isActive: true
      },
      {
        name: 'Nurse James',
        email: 'nurse.james@hospital.com',
        password: 'nurse123',
        role: 'Nurse',
        isActive: true
      }
    ]);
    console.log('✅ Nurse users created:', nurseUsers.length);

    // Assign patients to nurses
    console.log('Assigning patients to nurses...');
    for (let i = 0; i < patients.length; i++) {
      const nurseIndex = i % nurseUsers.length; // Distribute patients evenly
      await Patient.findByIdAndUpdate(patients[i]._id, {
        assignedNurse: nurseUsers[nurseIndex]._id,
        assignedDoctor: doctors[i % doctors.length]._id
      });
    }
    console.log('✅ Patients assigned to nurses and doctors');

    // Create Receptionist users
    const receptionistUsers = await User.create([
      {
        name: 'Receptionist Mary',
        email: 'receptionist@hospital.com',
        password: 'receptionist123',
        role: 'Receptionist',
        isActive: true
      }
    ]);
    console.log('✅ Receptionist users created:', receptionistUsers.length);

    // Create Patient users
    const patientUsers = await User.create([
      {
        name: 'John Smith',
        email: 'patient.john@email.com',
        password: 'patient123',
        role: 'Patient',
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        email: 'patient.sarah@email.com',
        password: 'patient123',
        role: 'Patient',
        isActive: true
      }
    ]);
    console.log('✅ Patient users created:', patientUsers.length);

    // Create sample appointments
    const appointments = [];
    // Get today's date at midnight for consistent date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentData = [
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        department: 'Cardiology',
        date: today, // TODAY at midnight
        time: '09:00 AM',
        type: 'Check-up',
        status: 'Confirmed'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        department: 'Neurology',
        date: today, // TODAY at midnight
        time: '10:30 AM',
        type: 'Consultation',
        status: 'Pending'
      }
    ];
    
    for (const aptData of appointmentData) {
      const appointment = await Appointment.create(aptData);
      appointments.push(appointment);
    }
    console.log('✅ Appointments added:', appointments.length);

    // Create sample medical records
    const records = [];
    const recordData = [
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        diagnosis: 'Hypertension',
        treatment: 'Medication prescribed',
        type: 'Outpatient'
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        diagnosis: 'Migraine',
        treatment: 'Therapy recommended',
        type: 'Outpatient'
      }
    ];
    
    for (const recData of recordData) {
      const record = await MedicalRecord.create(recData);
      records.push(record);
    }
    console.log('✅ Medical records added:', records.length);

    // Create sample enquiries
    const enquiries = await Enquiry.create([
      {
        name: 'Rajesh Kumar',
        phone: '+91 9876543210',
        email: 'rajesh@email.com',
        subject: 'Appointment Booking Inquiry',
        message: 'How can I book an appointment with Dr. Emily Brown?',
        priority: 'Medium',
        status: 'New',
        createdBy: receptionistUsers[0]._id
      },
      {
        name: 'Priya Sharma',
        phone: '+91 9876543211',
        email: 'priya@email.com',
        subject: 'Insurance Coverage',
        message: 'Does the hospital accept Max Bupa health insurance?',
        priority: 'High',
        status: 'In Progress',
        createdBy: receptionistUsers[0]._id
      },
      {
        name: 'Amit Patel',
        phone: '+91 9876543212',
        subject: 'Visiting Hours',
        message: 'What are the visiting hours for ICU patients?',
        priority: 'Low',
        status: 'Resolved',
        createdBy: receptionistUsers[0]._id,
        resolvedBy: receptionistUsers[0]._id,
        resolvedAt: new Date()
      }
    ]);
    console.log('✅ Enquiries added:', enquiries.length);

    // Create sample notifications
    const notifications = await Notification.create([
      {
        title: 'System Maintenance',
        message: 'The system will be under maintenance tonight from 11 PM to 2 AM.',
        type: 'warning',
        targetRole: ['Receptionist', 'Admin', 'Doctor', 'Nurse'],
        createdBy: users._id
      },
      {
        title: 'New Doctor Joined',
        message: 'Dr. Sarah Anderson has joined the Pediatrics department.',
        type: 'info',
        targetRole: ['Receptionist', 'Admin'],
        createdBy: users._id
      },
      {
        title: 'Emergency Protocol Update',
        message: 'Please review the updated emergency handling protocol in the staff room.',
        type: 'alert',
        targetRole: ['Receptionist', 'Nurse', 'Doctor'],
        createdBy: users._id
      }
    ]);
    console.log('✅ Notifications added:', notifications.length);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Patients: ${patients.length}`);
    console.log(`   - Doctors: ${doctors.length}`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log(`   - Medical Records: ${records.length}`);
    console.log(`   - Enquiries: ${enquiries.length}`);
    console.log(`   - Notifications: ${notifications.length}`);
    
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('\n👨‍💼 ADMIN:');
    console.log('   Email: admin@hospital.com');
    console.log('   Password: admin123');
    
    console.log('\n👨‍⚕️ DOCTORS:');
    console.log('   Email: dr.emily@hospital.com | Password: doctor123 (Cardiology)');
    console.log('   Email: dr.michael@hospital.com | Password: doctor123 (Neurology)');
    console.log('   Email: dr.lisa@hospital.com | Password: doctor123 (Orthopedics)');
    
    console.log('\n👩‍⚕️ NURSES:');
    console.log('   Email: nurse.sarah@hospital.com | Password: nurse123');
    console.log('   Email: nurse.james@hospital.com | Password: nurse123');
    
    console.log('\n👨‍💼 RECEPTIONIST:');
    console.log('   Email: receptionist@hospital.com | Password: receptionist123');
    
    console.log('\n🧑 PATIENTS:');
    console.log('   Email: patient.john@email.com | Password: patient123');
    console.log('   Email: patient.sarah@email.com | Password: patient123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

seedDatabase();
