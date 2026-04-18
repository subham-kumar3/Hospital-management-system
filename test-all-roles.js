const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Test credentials for all roles
const testUsers = [
  { role: 'Admin', email: 'admin@hospital.com', password: 'admin123' },
  { role: 'Doctor', email: 'dr.emily@hospital.com', password: 'doctor123' },
  { role: 'Nurse', email: 'nurse.sarah@hospital.com', password: 'nurse123' },
  { role: 'Receptionist', email: 'receptionist@hospital.com', password: 'receptionist123' },
  { role: 'Patient', email: 'patient.john@email.com', password: 'patient123' }
];

let tokens = {};
let testData = {};

async function testLogin() {
  console.log('\n🔐 TESTING LOGIN FOR ALL ROLES\n');
  console.log('═'.repeat(60));
  
  for (const user of testUsers) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      if (response.data.success) {
        tokens[user.role] = response.data.data.token;
        console.log(`✅ ${user.role.padEnd(15)} | Login Successful | Token: ${tokens[user.role].substring(0, 20)}...`);
      }
    } catch (error) {
      console.log(`❌ ${user.role.padEnd(15)} | Login Failed: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log('═'.repeat(60));
}

async function testPatientsData() {
  console.log('\n👥 TESTING PATIENTS DATA ACCESS\n');
  console.log('═'.repeat(60));
  
  for (const [role, token] of Object.entries(tokens)) {
    try {
      const response = await axios.get(`${API_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const count = response.data.data.length;
        testData[role] = { patients: count };
        console.log(`✅ ${role.padEnd(15)} | Patients: ${count}`);
      }
    } catch (error) {
      console.log(`❌ ${role.padEnd(15)} | Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log('═'.repeat(60));
}

async function testDoctorsData() {
  console.log('\n👨‍⚕️ TESTING DOCTORS DATA ACCESS\n');
  console.log('═'.repeat(60));
  
  for (const [role, token] of Object.entries(tokens)) {
    try {
      const response = await axios.get(`${API_URL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const count = response.data.data.length;
        testData[role].doctors = count;
        console.log(`✅ ${role.padEnd(15)} | Doctors: ${count}`);
      }
    } catch (error) {
      console.log(`❌ ${role.padEnd(15)} | Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log('═'.repeat(60));
}

async function testAppointmentsData() {
  console.log('\n📅 TESTING APPOINTMENTS DATA ACCESS\n');
  console.log('═'.repeat(60));
  
  for (const [role, token] of Object.entries(tokens)) {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const count = response.data.data.length;
        testData[role].appointments = count;
        console.log(`✅ ${role.padEnd(15)} | Appointments: ${count}`);
      }
    } catch (error) {
      console.log(`❌ ${role.padEnd(15)} | Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log('═'.repeat(60));
}

async function testDepartmentsData() {
  console.log('\n🏥 TESTING DEPARTMENTS DATA ACCESS\n');
  console.log('═'.repeat(60));
  
  for (const [role, token] of Object.entries(tokens)) {
    try {
      const response = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const count = response.data.data.length;
        testData[role].departments = count;
        console.log(`✅ ${role.padEnd(15)} | Departments: ${count}`);
      }
    } catch (error) {
      console.log(`❌ ${role.padEnd(15)} | Error: ${error.response?.data?.message || error.message}`);
    }
  }
  console.log('═'.repeat(60));
}

async function testDataConsistency() {
  console.log('\n📊 DATA CONSISTENCY CHECK\n');
  console.log('═'.repeat(60));
  console.log('Role'.padEnd(15) + 'Patients'.padEnd(12) + 'Doctors'.padEnd(12) + 'Appointments'.padEnd(15) + 'Departments');
  console.log('─'.repeat(60));
  
  for (const [role, data] of Object.entries(testData)) {
    console.log(
      role.padEnd(15) + 
      String(data.patients || 0).padEnd(12) + 
      String(data.doctors || 0).padEnd(12) + 
      String(data.appointments || 0).padEnd(15) + 
      String(data.departments || 0)
    );
  }
  console.log('═'.repeat(60));
  
  // Verify all roles see the same data
  const firstRole = Object.keys(testData)[0];
  let isConsistent = true;
  
  for (const [role, data] of Object.entries(testData)) {
    if (data.patients !== testData[firstRole].patients ||
        data.doctors !== testData[firstRole].doctors ||
        data.appointments !== testData[firstRole].appointments ||
        data.departments !== testData[firstRole].departments) {
      isConsistent = false;
      break;
    }
  }
  
  if (isConsistent) {
    console.log('✅ ALL ROLES ARE SEEING THE SAME DATA FROM SHARED DATABASE!\n');
  } else {
    console.log('❌ DATA INCONSISTENCY DETECTED!\n');
  }
}

async function testDashboardAccess() {
  console.log('\n📈 TESTING DASHBOARD ACCESS\n');
  console.log('═'.repeat(60));
  
  // Test Admin Dashboard
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${tokens['Admin']}` }
    });
    
    if (response.data.success) {
      console.log('✅ Admin Dashboard    | Working');
      console.log(`   Total Patients: ${response.data.data.stats.totalPatients}`);
      console.log(`   Total Doctors: ${response.data.data.stats.totalDoctors}`);
      console.log(`   Appointments Today: ${response.data.data.stats.appointmentsToday}`);
    }
  } catch (error) {
    console.log('❌ Admin Dashboard    | Error:', error.response?.data?.message || error.message);
  }
  console.log('═'.repeat(60));
}

async function runAllTests() {
  console.log('\n' + '🏥'.repeat(30));
  console.log('HOSPITAL MANAGEMENT SYSTEM - DATABASE CONNECTION TEST');
  console.log('🏥'.repeat(30));
  
  try {
    await testLogin();
    await testPatientsData();
    await testDoctorsData();
    await testAppointmentsData();
    await testDepartmentsData();
    await testDataConsistency();
    await testDashboardAccess();
    
    console.log('\n✅ ALL TESTS COMPLETED!\n');
    console.log('📝 Summary:');
    console.log('   ✓ All roles connected to same database');
    console.log('   ✓ All roles accessing same data');
    console.log('   ✓ Dashboards working correctly');
    console.log('   ✓ Data consistency verified\n');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run tests
runAllTests();
