const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testPDFUpload() {
  try {
    // First, login to get a token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:8081/api/auth/login', {
      email: 'senior@knowledgeheirloom.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful!');

    // Test PDF upload
    console.log('\n📄 Testing PDF upload...');
    
    const pdfPath = path.join(__dirname, '..', 'public', 'Srijan_Enterprise_Rules_and_Regulations.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.log('❌ PDF file not found at:', pdfPath);
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));

    const uploadResponse = await axios.post('http://localhost:8081/api/upload/document', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      },
      maxContentLength: 50 * 1024 * 1024, // 50MB
      maxBodyLength: 50 * 1024 * 1024
    });

    console.log('✅ PDF Upload SUCCESS!');
    console.log('📊 Response:', {
      title: uploadResponse.data.document.title,
      fileSize: uploadResponse.data.document.fileSize,
      wordCount: uploadResponse.data.document.wordCount,
      tags: uploadResponse.data.document.tags,
      keywords: uploadResponse.data.document.keywords?.slice(0, 5)
    });
    console.log('📝 Extracted preview:', uploadResponse.data.document.extractedText.substring(0, 200) + '...');

    // Test searching for the uploaded document
    console.log('\n🔍 Testing search for uploaded document...');
    const searchResponse = await axios.get('http://localhost:8081/api/knowledge?search=Srijan Enterprise', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('🎯 Search results:', searchResponse.data.totalCount, 'documents found');
    if (searchResponse.data.knowledge.length > 0) {
      console.log('📋 First result:', {
        title: searchResponse.data.knowledge[0].title,
        category: searchResponse.data.knowledge[0].category,
        source: searchResponse.data.knowledge[0].source
      });
    }

  } catch (error) {
    console.log('❌ FAILED!');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
    if (error.response?.data?.error) {
      console.log('Error details:', error.response.data.error);
    }
  }
}

testPDFUpload();
