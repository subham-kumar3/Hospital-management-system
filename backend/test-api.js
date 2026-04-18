const http = require('http');

// Test health endpoint
http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Health Check Response:', JSON.parse(data));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});

// Test patients endpoint
http.get('http://localhost:5000/api/patients', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nPatients Response:', JSON.parse(data));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
