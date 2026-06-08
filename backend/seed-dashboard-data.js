const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Bill = require('./models/Bill');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const seedDashboardData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get existing patients
    const patients = await Patient.find();
    const doctors = await Doctor.find();

    if (patients.length === 0) {
      console.log('❌ No patients found. Please run the seeder first.');
      process.exit(1);
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    console.log('\n📅 Creating appointments for today:', todayStr);

    // Check if appointments already exist for today
    const existingAppointments = await Appointment.find({ date: today });
    if (existingAppointments.length > 0) {
      console.log(`⚠️  Found ${existingAppointments.length} existing appointments for today. Skipping...`);
      console.log('💡 To add more appointments, use the appointment booking form in the UI.');
    } else {

    // Create today's appointments
    const appointmentTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology'];
    const statuses = ['Confirmed', 'Pending', 'Confirmed', 'Completed', 'Pending', 'Confirmed'];
    const types = ['Check-up', 'Follow-up', 'Consultation', 'Check-up', 'Consultation', 'Follow-up'];

    const appointments = [];
    for (let i = 0; i < 6; i++) {
      const patient = patients[i % patients.length];
      const doctor = doctors[i % doctors.length];
      
      appointments.push({
        patient: patient._id,
        doctor: doctor ? doctor._id : null,
        date: today,
        time: appointmentTimes[i],
        department: departments[i],
        type: types[i],
        status: statuses[i],
        notes: `Appointment for ${patient.name}`
      });
    }

    await Appointment.insertMany(appointments);
    console.log(`✅ Created ${appointments.length} appointments for today`);
    }

    // Create some bills
    console.log('\n💰 Creating bills...');
    
    const billData = [
      {
        patient: patients[0]?._id,
        billNumber: 'BILL-001',
        items: [
          { description: 'Consultation Fee', quantity: 1, unitPrice: 500, total: 500 },
          { description: 'Blood Test', quantity: 1, unitPrice: 800, total: 800 }
        ],
        subtotal: 1300,
        tax: 0,
        discount: 0,
        totalAmount: 1300,
        paidAmount: 500,
        balance: 800,
        paymentStatus: 'Partial',
        paymentMethod: 'Cash',
        status: 'Active'
      },
      {
        patient: patients[1]?._id,
        billNumber: 'BILL-002',
        items: [
          { description: 'X-Ray', quantity: 1, unitPrice: 1200, total: 1200 },
          { description: 'Medicine', quantity: 1, unitPrice: 600, total: 600 }
        ],
        subtotal: 1800,
        tax: 0,
        discount: 0,
        totalAmount: 1800,
        paidAmount: 0,
        balance: 1800,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        status: 'Active'
      },
      {
        patient: patients[2]?._id,
        billNumber: 'BILL-003',
        items: [
          { description: 'Surgery', quantity: 1, unitPrice: 15000, total: 15000 },
          { description: 'Room Charge', quantity: 1, unitPrice: 3000, total: 3000 }
        ],
        subtotal: 18000,
        tax: 0,
        discount: 0,
        totalAmount: 18000,
        paidAmount: 18000,
        balance: 0,
        paymentStatus: 'Paid',
        paymentMethod: 'Card',
        status: 'Active'
      },
      {
        patient: patients[3]?._id,
        billNumber: 'BILL-004',
        items: [
          { description: 'MRI Scan', quantity: 1, unitPrice: 5000, total: 5000 },
          { description: 'Consultation', quantity: 1, unitPrice: 1000, total: 1000 }
        ],
        subtotal: 6000,
        tax: 0,
        discount: 0,
        totalAmount: 6000,
        paidAmount: 2000,
        balance: 4000,
        paymentStatus: 'Partial',
        paymentMethod: 'UPI',
        status: 'Active'
      },
      {
        patient: patients[4]?._id,
        billNumber: 'BILL-005',
        items: [
          { description: 'Emergency Consultation', quantity: 1, unitPrice: 2000, total: 2000 },
          { description: 'Medicine', quantity: 1, unitPrice: 1500, total: 1500 }
        ],
        subtotal: 3500,
        tax: 0,
        discount: 0,
        totalAmount: 3500,
        paidAmount: 0,
        balance: 3500,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        status: 'Active'
      }
    ];

    await Bill.insertMany(billData);
    console.log(`✅ Created ${billData.length} bills`);

    // Summary
    console.log('\n📊 Dashboard Data Summary:');
    console.log('═══════════════════════════════════════');
    
    const totalPatients = await Patient.countDocuments();
    const todayAppointments = await Appointment.countDocuments({ date: today });
    const totalBills = await Bill.countDocuments();
    const pendingBills = await Bill.countDocuments({ paymentStatus: { $in: ['Pending', 'Partial'] } });
    const totalEnquiries = await (require('./models/Enquiry')).countDocuments();

    console.log(`👥 Total Patients: ${totalPatients}`);
    console.log(`📅 Today's Appointments: ${todayAppointments}`);
    console.log(`💰 Total Bills: ${totalBills}`);
    console.log(`⏳ Pending Bills: ${pendingBills}`);
    console.log(`📝 Total Enquiries: ${totalEnquiries}`);
    console.log('═══════════════════════════════════════');

    console.log('\n✅ Dashboard data seeded successfully!');
    console.log('🔄 Refresh your dashboard to see the data.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDashboardData();
