const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('🌱 Starting pharmacy seeder...\n');

    // Clear existing data
    await User.deleteMany({ role: 'Pharmacist' });
    await Medicine.deleteMany({});
    console.log('🗑️  Cleared existing pharmacist and medicine data\n');

    // Create pharmacist users
    const pharmacists = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'pharmacist@hospital.com',
        password: 'pharmacist123',
        role: 'Pharmacist',
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.pharmacy@hospital.com',
        password: 'pharmacy123',
        role: 'Pharmacist',
        isActive: true
      }
    ];

    const createdUsers = await User.create(pharmacists);
    console.log(`✅ Created ${createdUsers.length} pharmacist users:`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    console.log('');

    // Create sample medicines
    const medicines = [
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Tablet',
        manufacturer: 'PharmaCorp Ltd.',
        batchNumber: 'PCM2024001',
        price: 2.50,
        stockQuantity: 500,
        lowStockThreshold: 50,
        expiryDate: new Date('2026-12-31'),
        description: 'Pain reliever and fever reducer',
        requiresPrescription: false
      },
      {
        name: 'Amoxicillin 250mg',
        genericName: 'Amoxicillin',
        category: 'Capsule',
        manufacturer: 'MediPharma Inc.',
        batchNumber: 'AMX2024002',
        price: 8.00,
        stockQuantity: 200,
        lowStockThreshold: 30,
        expiryDate: new Date('2025-09-30'),
        description: 'Antibiotic for bacterial infections',
        requiresPrescription: true
      },
      {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine Hydrochloride',
        category: 'Tablet',
        manufacturer: 'AllergyMed Ltd.',
        batchNumber: 'CTZ2024003',
        price: 3.00,
        stockQuantity: 8,
        lowStockThreshold: 20,
        expiryDate: new Date('2026-06-30'),
        description: 'Antihistamine for allergies',
        requiresPrescription: false
      },
      {
        name: 'Omeprazole 20mg',
        genericName: 'Omeprazole',
        category: 'Capsule',
        manufacturer: 'GastroPharma',
        batchNumber: 'OMP2024004',
        price: 6.50,
        stockQuantity: 150,
        lowStockThreshold: 25,
        expiryDate: new Date('2025-11-30'),
        description: 'Proton pump inhibitor for acid reflux',
        requiresPrescription: true
      },
      {
        name: 'Cough Syrup',
        genericName: 'Dextromethorphan',
        category: 'Syrup',
        manufacturer: 'CureCough Pharmaceuticals',
        batchNumber: 'CS2024005',
        price: 12.00,
        stockQuantity: 75,
        lowStockThreshold: 15,
        expiryDate: new Date('2026-03-31'),
        description: 'Cough suppressant syrup',
        requiresPrescription: false
      },
      {
        name: 'Insulin Injection',
        genericName: 'Insulin Human',
        category: 'Injection',
        manufacturer: 'BioMed Solutions',
        batchNumber: 'INS2024006',
        price: 45.00,
        stockQuantity: 5,
        lowStockThreshold: 10,
        expiryDate: new Date('2025-08-31'),
        description: 'Insulin for diabetes management',
        requiresPrescription: true
      },
      {
        name: 'Betadine Ointment',
        genericName: 'Povidone-Iodine',
        category: 'Ointment',
        manufacturer: 'HealthCare Products',
        batchNumber: 'BET2024007',
        price: 8.50,
        stockQuantity: 60,
        lowStockThreshold: 10,
        expiryDate: new Date('2027-01-31'),
        description: 'Antiseptic ointment for wounds',
        requiresPrescription: false
      },
      {
        name: 'Vitamin D Drops',
        genericName: 'Cholecalciferol',
        category: 'Drops',
        manufacturer: 'VitaHealth Ltd.',
        batchNumber: 'VTD2024008',
        price: 15.00,
        stockQuantity: 40,
        lowStockThreshold: 10,
        expiryDate: new Date('2026-12-31'),
        description: 'Vitamin D supplement drops',
        requiresPrescription: false
      }
    ];

    const createdMedicines = await Medicine.create(medicines);
    console.log(`✅ Created ${createdMedicines.length} medicines:`);
    createdMedicines.forEach(med => {
      const stockStatus = med.stockQuantity <= med.lowStockThreshold ? '⚠️ LOW STOCK' : '✅';
      console.log(`   ${stockStatus} ${med.name} - Stock: ${med.stockQuantity}, Price: ₹${med.price}`);
    });
    console.log('');

    // Summary
    const lowStockCount = createdMedicines.filter(m => m.stockQuantity <= m.lowStockThreshold).length;
    
    console.log('📊 Seeder Summary:');
    console.log(`   - Pharmacists created: ${createdUsers.length}`);
    console.log(`   - Medicines created: ${createdMedicines.length}`);
    console.log(`   - Low stock alerts: ${lowStockCount}`);
    console.log('\n✨ Pharmacy seeder completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: pharmacist@hospital.com');
    console.log('   Password: pharmacist123');
    console.log('\n   OR');
    console.log('   Email: priya.pharmacy@hospital.com');
    console.log('   Password: pharmacy123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
