const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing demo login...');
    const response = await axios.post('http://localhost:8081/api/demo/auth/login', {
      email: 'junior@knowledgeheirloom.com',
      password: 'password123'
    });
    
    console.log('✅ SUCCESS!');
    console.log('User:', response.data.user.name);
    console.log('Token received:', !!response.data.token);
    console.log('Message:', response.data.message);
  } catch (error) {
    console.log('❌ FAILED!');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', error.message);
  }
}

testLogin();
