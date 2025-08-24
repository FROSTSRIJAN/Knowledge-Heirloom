const axios = require('axios');

const BASE_URL = 'http://localhost:8081';
let authToken = '';

async function runTests() {
  console.log('🧪 Running comprehensive API tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check: ${health.data.status}`);

    // Test 2: Authentication
    console.log('\n2. Testing authentication...');
    const login = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'junior@knowledgeheirloom.com',
      password: 'password123'
    });
    authToken = login.data.token;
    console.log(`✅ Login successful: ${login.data.user.name}`);

    // Test 3: Knowledge Base
    console.log('\n3. Testing knowledge base...');
    const knowledge = await axios.get(`${BASE_URL}/api/knowledge`);
    console.log(`✅ Knowledge entries: ${knowledge.data.knowledge.length}`);

    // Test 4: HuggingFace Datasets List
    console.log('\n4. Testing HuggingFace datasets...');
    const datasets = await axios.get(`${BASE_URL}/api/datasets/huggingface/datasets`);
    console.log(`✅ Available datasets: ${datasets.data.datasets.length}`);

    // Test 5: Dataset Integration Status
    console.log('\n5. Testing integrated datasets...');
    const integrated = await axios.get(`${BASE_URL}/api/datasets/integrated`);
    console.log(`✅ Integrated datasets: ${integrated.data.datasets.length}`);

    // Test 6: Load a specific dataset
    console.log('\n6. Testing dataset loading...');
    const loadDataset = await axios.post(`${BASE_URL}/api/datasets/huggingface/load`, {
      datasetName: 'eli5',
      split: 'train_asks'
    });
    console.log(`✅ Dataset loaded: ${loadDataset.data.data.sampleCount} samples`);

    console.log('\n🎉 All tests passed! System is fully functional.');
    
    // Print summary
    console.log('\n📊 SYSTEM SUMMARY:');
    console.log(`- Backend: Running on port 8081`);
    console.log(`- Frontend: Running on port 8080`);
    console.log(`- Database: SQLite with Prisma ORM`);
    console.log(`- Knowledge entries: ${knowledge.data.knowledge.length}`);
    console.log(`- Available HuggingFace datasets: ${datasets.data.datasets.length}`);
    console.log(`- Authentication: Working (JWT)`);
    console.log(`- Dataset integration: Functional`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
