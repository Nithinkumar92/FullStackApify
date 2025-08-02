const axios = require('axios');

// Test API key validation
async function testApiKey(apiKey) {
  console.log('Testing API key validation...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5002/health');
    console.log('✅ Backend is running:', healthResponse.data);
    
    // Test 2: API key validation
    console.log('\n2. Testing API key...');
    const actorsResponse = await axios.get('http://localhost:5002/api/actors', {
      headers: {
        'X-API-Key': apiKey
      }
    });
    console.log('✅ API key is valid!');
    console.log('Actors found:', actorsResponse.data.count);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running. Please start the backend server first.');
      console.log('Run: cd backend && npm start');
      console.log('Note: Backend should run on port 5002');
    } else if (error.response) {
      console.log('❌ API key validation failed:');
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data.error);
      
      if (error.response.status === 401) {
        console.log('\n💡 The API key appears to be invalid. Please check:');
        console.log('1. The API key format (should be a long string)');
        console.log('2. The API key is from Apify Console');
        console.log('3. The API key has the necessary permissions');
      }
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
}

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.log('Usage: node test-api-key.js <your-api-key>');
  console.log('Example: node test-api-key.js apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  process.exit(1);
}

testApiKey(apiKey); 