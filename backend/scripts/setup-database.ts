#!/usr/bin/env node

// Database setup and seed script for Knowledge Heirloom
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import datasetService from '../src/services/datasetService';

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🗄️ Setting up Knowledge Heirloom database...\n');

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@knowledgeheirloom.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@knowledgeheirloom.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // Create sample employee
    console.log('👥 Creating sample employee...');
    const employeePassword = await bcrypt.hash('employee123', 10);
    
    const employee = await prisma.user.upsert({
      where: { email: 'employee@knowledgeheirloom.com' },
      update: {},
      create: {
        name: 'John Developer',
        email: 'employee@knowledgeheirloom.com',
        password: employeePassword,
        role: 'EMPLOYEE'
      }
    });
    console.log(`✅ Employee user created: ${employee.email}`);

    // Create senior dev user
    console.log('🚀 Creating senior developer...');
    const seniorPassword = await bcrypt.hash('senior123', 10);
    
    const seniorDev = await prisma.user.upsert({
      where: { email: 'senior@knowledgeheirloom.com' },
      update: {},
      create: {
        name: 'Sarah Senior',
        email: 'senior@knowledgeheirloom.com',
        password: seniorPassword,
        role: 'SENIOR_DEV'
      }
    });
    console.log(`✅ Senior dev user created: ${seniorDev.email}`);

    // Initialize datasets
    console.log('\n📊 Initializing datasets...');
    await datasetService.initializeAllDatasets();

    // Create legacy messages
    console.log('💬 Creating sample legacy messages...');
    const legacyMessages = [
      {
        title: "Welcome to the Team!",
        content: "Remember: Code is written for humans to read, not just machines. Always prioritize clarity over cleverness. Document your decisions, not just your code. The future you (and your teammates) will thank you!",
        category: "wisdom",
        seniorDevId: seniorDev.id
      },
      {
        title: "Debugging Like a Pro",
        content: "When debugging: 1) Read the error message carefully, 2) Check your assumptions, 3) Use logging strategically, 4) Take breaks when stuck, 5) Explain the problem to someone else (rubber duck debugging works!)",
        category: "technical",
        seniorDevId: seniorDev.id
      },
      {
        title: "Final Wisdom",
        content: "As I transition out, remember that technology changes but principles endure. Focus on problem-solving skills, continuous learning, and building great relationships with your team. You've got this! 🚀",
        category: "farewell",
        isSpecial: true,
        seniorDevId: seniorDev.id
      }
    ];

    for (const message of legacyMessages) {
      await prisma.legacyMessage.create({
        data: message
      });
    }
    console.log(`✅ Created ${legacyMessages.length} legacy messages`);

    // Create sample analytics
    console.log('📈 Creating sample analytics...');
    await prisma.analytics.create({
      data: {
        userId: employee.id,
        queryCount: 25,
        totalTokens: 5000,
        avgResponseTime: 1250,
        dailyQueries: 5
      }
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin: admin@knowledgeheirloom.com / admin123');
    console.log('Employee: employee@knowledgeheirloom.com / employee123');
    console.log('Senior Dev: senior@knowledgeheirloom.com / senior123');

    const stats = await datasetService.getDatasetStats();
    console.log('\n📊 Knowledge Base Stats:');
    console.log(`Total entries: ${stats.totalEntries}`);
    console.log('Sources:', stats.datasets.map(d => `${d.source}: ${d._sum.recordCount} entries`).join(', '));

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default setupDatabase;
