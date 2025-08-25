const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extractPDFContent() {
  try {
    const pdfPath = path.join(__dirname, '..', 'public', 'Srijan_Enterprise_Rules_and_Regulations.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.log('❌ PDF file not found at:', pdfPath);
      return;
    }

    console.log('📄 Processing PDF:', pdfPath);
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('✅ PDF Processed Successfully!');
    console.log('📊 Stats:');
    console.log('- Pages:', data.numpages);
    console.log('- Text Length:', data.text.length);
    console.log('- Word Count:', data.text.split(' ').length);
    
    console.log('\n📝 Content Preview:');
    console.log(data.text.substring(0, 500) + '...\n');
    
    // Extract title from content or filename
    const firstLine = data.text.split('\n')[0]?.trim();
    const title = (firstLine && firstLine.length < 100 && firstLine.length > 5) 
      ? firstLine 
      : 'Srijan Enterprise Rules and Regulations';
    
    console.log('📋 Extracted Title:', title);
    
    // Generate keywords
    const keywords = data.text.split(' ')
      .filter(word => word.length > 3)
      .map(word => word.toLowerCase().replace(/[^a-z]/g, ''))
      .filter(word => word.length > 0)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    
    const topKeywords = Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
    
    console.log('🔑 Top Keywords:', topKeywords.slice(0, 10));
    
    // Save extracted content to a JSON file for database insertion
    const extractedData = {
      title: title,
      content: data.text,
      summary: data.text.substring(0, 300).trim() + '...',
      category: 'company-handbook',
      source: 'upload',
      priority: 10,
      fileType: 'application/pdf',
      fileSize: dataBuffer.length,
      tags: ['company-handbook', 'rules', 'regulations', 'enterprise', 'policy'],
      keywords: topKeywords,
      pages: data.numpages,
      wordCount: data.text.split(' ').length
    };
    
    // Save to file for database insertion
    const outputPath = path.join(__dirname, 'extracted-pdf-content.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    
    console.log('💾 Extracted data saved to:', outputPath);
    
  } catch (error) {
    console.error('❌ Error processing PDF:', error.message);
  }
}

extractPDFContent();
