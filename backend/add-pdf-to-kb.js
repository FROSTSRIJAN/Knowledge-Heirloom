const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function addPDFToKnowledgeBase() {
  try {
    // Read the extracted PDF content
    const contentPath = path.join(__dirname, 'extracted-pdf-content.json');
    const extractedData = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    
    console.log('📄 Adding PDF to Knowledge Base...');
    console.log('Title:', extractedData.title);
    console.log('Content Length:', extractedData.content.length);
    
    // Find a user to associate the document with (senior dev)
    const seniorUser = await prisma.user.findFirst({
      where: { email: 'senior@knowledgeheirloom.com' }
    });
    
    if (!seniorUser) {
      console.log('❌ Senior user not found');
      return;
    }

    // Add to knowledge base
    const knowledgeEntry = await prisma.knowledgeBase.create({
      data: {
        title: extractedData.title,
        content: extractedData.content,
        summary: extractedData.summary,
        category: extractedData.category,
        source: extractedData.source,
        priority: extractedData.priority,
        fileType: extractedData.fileType,
        fileSize: extractedData.fileSize,
        filePath: 'Srijan_Enterprise_Rules_and_Regulations.pdf',
        uploadedBy: seniorUser.id,
        tags: JSON.stringify(extractedData.tags),
        keyWords: JSON.stringify(extractedData.keywords)
      }
    });

    // Also create a document record
    const document = await prisma.document.create({
      data: {
        filename: 'Srijan_Enterprise_Rules_and_Regulations.pdf',
        originalName: 'Srijan Enterprise Rules and Regulations.pdf',
        filePath: '../public/Srijan_Enterprise_Rules_and_Regulations.pdf',
        fileType: '.pdf',
        fileSize: extractedData.fileSize,
        mimeType: extractedData.fileType,
        processed: true,
        extractedText: extractedData.content,
        summary: extractedData.summary,
        uploadedBy: seniorUser.id
      }
    });

    console.log('✅ Successfully added to Knowledge Base!');
    console.log('📊 Knowledge Entry ID:', knowledgeEntry.id);
    console.log('📊 Document ID:', document.id);
    console.log('📋 Category:', knowledgeEntry.category);
    console.log('🔑 Keywords:', extractedData.keywords.slice(0, 5));
    console.log('📄 Pages:', extractedData.pages);
    console.log('📝 Word Count:', extractedData.wordCount);

    // Test search functionality
    console.log('\n🔍 Testing search functionality...');
    const searchResults = await prisma.knowledgeBase.findMany({
      where: {
        OR: [
          { title: { contains: 'Srijan', mode: 'insensitive' } },
          { content: { contains: 'Enterprise', mode: 'insensitive' } },
          { category: 'company-handbook' }
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        source: true,
        createdAt: true
      }
    });

    console.log('🎯 Search Results Found:', searchResults.length);
    searchResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title} (${result.category})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addPDFToKnowledgeBase();
