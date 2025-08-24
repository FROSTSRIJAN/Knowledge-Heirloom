const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });
    
    const knowledgeCount = await prisma.knowledgeBase.count();
    console.log(`\nKnowledge base entries: ${knowledgeCount}`);
    
    const datasetCount = await prisma.dataset.count();
    console.log(`Datasets: ${datasetCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
