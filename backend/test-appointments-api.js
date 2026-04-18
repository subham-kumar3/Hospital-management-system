// Test script to verify appointments API is working
// No external dependencies needed - uses native fetch

const API_URL = 'http://localhost:5001/api';

const testAPI = async () => {
  try {
    console.log('🧪 Testing Appointments API...\n');
    
    // Test 1: Health check
    console.log('1️⃣ Health Check:');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('   ✅', healthData.message);
    console.log();
    
    // Test 2: Get all appointments
    console.log('2️⃣ Fetching All Appointments:');
    const aptRes = await fetch(`${API_URL}/appointments`);
    const aptData = await aptRes.json();
    console.log('   Response:', aptData.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   Total Appointments:', aptData.data.length);
    console.log();
    
    if (aptData.data.length > 0) {
      console.log('📋 Appointment Details:');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      aptData.data.forEach((apt, index) => {
        const date = new Date(apt.date);
        
        const isToday = date >= today && date < tomorrow;
        
        console.log(`\n   ${index + 1}. ${apt.patient?.name || 'Unknown Patient'}`);
        console.log(`      Doctor: ${apt.doctor?.name || 'Unknown'}`);
        console.log(`      Date: ${date.toISOString().split('T')[0]} ${apt.time}`);
        console.log(`      Status: ${apt.status}`);
        console.log(`      Is Today: ${isToday ? '✅ YES' : '❌ NO'}`);
      });
      
      // Count today's appointments
      const todayCount = aptData.data.filter(apt => {
        const date = new Date(apt.date);
        return date >= today && date < tomorrow;
      }).length;
      
      console.log(`\n📊 SUMMARY:`);
      console.log(`   Total Appointments: ${aptData.data.length}`);
      console.log(`   Today's Appointments: ${todayCount}`);
      console.log(`   Dashboard should show: ${todayCount} for "Appointments Today"`);
    } else {
      console.log('⚠️  No appointments found in database!');
      console.log('💡 Run: npm run seed');
    }
    
    console.log('\n✅ API Test Complete!\n');
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.error('💡 Make sure backend server is running on port 5001');
  }
};

testAPI();
