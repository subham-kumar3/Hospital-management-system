// Test script for Departments API
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

async function testDepartmentsAPI() {
  console.log('🧪 Testing Departments API...\n');

  try {
    // Test 1: Get all departments
    console.log('📋 Test 1: Fetching all departments...');
    const response = await axios.get(`${API_URL}/departments`);
    
    if (response.data.success) {
      console.log('✅ Success! Departments fetched:\n');
      
      response.data.data.forEach((dept, index) => {
        console.log(`   ${index + 1}. ${dept.name}`);
        console.log(`      📍 Floor: ${dept.floor}`);
        console.log(`      🏥 Equipment: ${dept.equipment}`);
        console.log(`      📞 Phone: ${dept.phone}`);
        console.log(`      📧 Email: ${dept.email}`);
        console.log(`      📝 Description: ${dept.description}`);
        console.log('');
      });
      
      console.log(`📊 Total Departments: ${response.data.data.length}\n`);
    } else {
      console.log('❌ API returned unsuccessful response');
    }

    // Test 2: Get department statistics
    console.log('📊 Test 2: Fetching department statistics...');
    const statsResponse = await axios.get(`${API_URL}/departments/stats/overview`);
    
    if (statsResponse.data.success) {
      console.log('✅ Statistics:', statsResponse.data.data);
    }

    console.log('\n🎉 All tests completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.log('\n💡 Make sure the backend server is running on port 5001');
    console.log('💡 Run: npm run seed (to populate departments data)\n');
  }
}

testDepartmentsAPI();
