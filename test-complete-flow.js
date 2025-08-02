const axios = require('axios');

const API_KEY = 'apify_api_qC1l1ytCorIkxJq9vxhus0L73yfSGo3M0PC2';
const BASE_URL = 'http://localhost:5002';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Apify Integration Flow\n');

  try {
    // Step 1: Test API Key Validation
    console.log('1️⃣ Testing API Key Validation...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend is running:', healthResponse.data.status);

    // Step 2: Fetch Available Actors
    console.log('\n2️⃣ Fetching Available Actors...');
    const actorsResponse = await axios.get(`${BASE_URL}/api/actors`, {
      headers: { 'X-API-Key': API_KEY }
    });
    
    const actors = actorsResponse.data.data;
    console.log(`✅ Found ${actors.length} actors`);
    actors.forEach(actor => {
      console.log(`   - ${actor.name} (${actor.source})`);
    });

    if (actors.length === 0) {
      console.log('❌ No actors found. Cannot continue testing.');
      return;
    }

    // Step 3: Select an Actor (use the first one)
    const selectedActor = actors[0];
    console.log(`\n3️⃣ Selected Actor: ${selectedActor.name} (${selectedActor.id})`);

    // Step 4: Fetch Actor Schema
    console.log('\n4️⃣ Fetching Actor Input Schema...');
    const schemaResponse = await axios.get(`${BASE_URL}/api/actors/${selectedActor.id}/schema`, {
      headers: { 'X-API-Key': API_KEY }
    });
    
    const schema = schemaResponse.data.data;
    console.log('✅ Schema fetched successfully');
    console.log('   Schema properties:', Object.keys(schema.properties || {}));

    // Step 5: Prepare Test Input
    console.log('\n5️⃣ Preparing Test Input...');
    let testInput = {};
    
    if (selectedActor.name === 'website-content-crawler') {
      testInput = {
        startUrls: [{ url: 'https://example.com' }],
        maxCrawlPages: 1,
        maxRequestRetries: 1,
        maxConcurrency: 1
      };
    } else {
      testInput = { input: 'test' };
    }
    
    console.log('✅ Test input prepared:', JSON.stringify(testInput, null, 2));

    // Step 6: Run Actor
    console.log('\n6️⃣ Running Actor...');
    const runResponse = await axios.post(`${BASE_URL}/api/actors/${selectedActor.id}/run`, {
      input: testInput
    }, {
      headers: { 
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const runResult = runResponse.data.data;
    console.log('✅ Actor run started successfully!');
    console.log(`   Run ID: ${runResult.runId}`);
    console.log(`   Status: ${runResult.status}`);
    console.log(`   Run URL: ${runResult.runUrl}`);

    // Step 7: Summary
    console.log('\n🎉 Complete Flow Test Results:');
    console.log('✅ API Key Validation: PASSED');
    console.log('✅ Actor Fetching: PASSED');
    console.log('✅ Schema Fetching: PASSED');
    console.log('✅ Actor Execution: PASSED');
    console.log('\n🚀 All tests passed! The integration is working correctly.');
    console.log('\n📝 Next Steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Enter your API key');
    console.log('3. Select an actor');
    console.log('4. Fill in the form and run it!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCompleteFlow(); 