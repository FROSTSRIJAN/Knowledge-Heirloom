import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const juniorUser = await prisma.user.upsert({
    where: { email: 'junior@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Junior Developer',
      email: 'junior@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });

  const seniorUser = await prisma.user.upsert({
    where: { email: 'senior@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Senior Developer',
      email: 'senior@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'SENIOR_DEV',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('👥 Created users:', { juniorUser, seniorUser, adminUser });

  // Create sample knowledge base entries
  const knowledgeEntries = [
    {
      title: 'Authentication System',
      content: 'Our authentication system uses JWT tokens for secure user sessions. The login process validates credentials against the database and returns a signed token that expires in 7 days. Always verify tokens on protected routes.',
      category: 'Security',
      tags: '["authentication", "JWT", "security", "backend"]',
      priority: 5,
      source: 'manual',
      keyWords: '["JWT", "authentication", "login", "security", "tokens"]',
      uploadedBy: seniorUser.id,
    },
    {
      title: 'React Best Practices',
      content: 'When building React components, follow these guidelines: Use functional components with hooks, implement proper error boundaries, optimize re-renders with useMemo and useCallback, and always clean up side effects in useEffect.',
      category: 'Frontend Development',
      tags: '["react", "javascript", "frontend", "best-practices"]',
      priority: 4,
      source: 'manual',
      keyWords: '["React", "hooks", "components", "performance", "frontend"]',
      uploadedBy: seniorUser.id,
    },
    {
      title: 'Database Migration Guide',
      content: 'Database migrations should be handled carefully. Always backup before migrating, test migrations in staging first, and use transactions for complex changes. Prisma migrate provides excellent tools for this workflow.',
      category: 'Database',
      tags: '["database", "prisma", "migration", "backend"]',
      priority: 3,
      source: 'manual',
      keyWords: '["database", "migration", "Prisma", "backup", "staging"]',
      uploadedBy: adminUser.id,
    },
    {
      title: 'API Design Principles',
      content: 'RESTful APIs should follow consistent naming conventions, use appropriate HTTP methods, implement proper error handling, and provide clear documentation. Consider versioning for breaking changes.',
      category: 'Backend Development',
      tags: '["API", "REST", "backend", "design"]',
      priority: 4,
      source: 'manual',
      keyWords: '["API", "REST", "HTTP", "design", "documentation"]',
      uploadedBy: seniorUser.id,
    },
    {
      title: 'Code Review Checklist',
      content: 'Before submitting code for review: Ensure all tests pass, follow coding standards, add proper documentation, check for security issues, and verify performance impact. Reviewers should be constructive and thorough.',
      category: 'Development Process',
      tags: '["code-review", "quality", "process", "team"]',
      priority: 3,
      source: 'manual',
      keyWords: '["code review", "testing", "standards", "documentation", "security"]',
      uploadedBy: seniorUser.id,
    }
  ];

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeBase.create({
      data: {
        title: entry.title,
        content: entry.content,
        category: entry.category,
        tags: JSON.stringify(Array.isArray(entry.tags) ? entry.tags : [entry.tags]),
        priority: entry.priority,
        source: entry.source,
        keyWords: JSON.stringify(Array.isArray(entry.keyWords) ? entry.keyWords : [entry.keyWords]),
        uploadedBy: entry.uploadedBy,
      },
    });
  }

  console.log('📚 Created knowledge base entries');

  // Create some legacy messages
  const legacyMessages = [
    {
      title: 'Welcome to the Team',
      content: 'Welcome to our development team! Remember that every expert was once a beginner. Don\'t be afraid to ask questions, experiment with code, and learn from mistakes. The journey of a thousand deployments begins with a single commit. 🚀',
      category: 'motivational',
      isPublic: true,
      isSpecial: true,
      seniorDevId: seniorUser.id,
    },
    {
      title: 'The Art of Debugging',
      content: 'Debugging is like being a detective in a crime movie where you are also the murderer. The key is to approach problems systematically: reproduce the issue, isolate variables, and never assume. Console.log is your friend, but debugger is your best friend.',
      category: 'technical',
      isPublic: true,
      seniorDevId: seniorUser.id,
    },
    {
      title: 'On Technical Debt',
      content: 'Technical debt is like financial debt - a little bit can help you move faster, but too much will slow you down significantly. Pay it off regularly, document your shortcuts, and always leave the codebase cleaner than you found it.',
      category: 'wisdom',
      isPublic: true,
      seniorDevId: seniorUser.id,
    }
  ];

  for (const message of legacyMessages) {
    await prisma.legacyMessage.create({
      data: message,
    });
  }

  console.log('💬 Created legacy messages');

  // Create initial analytics entries
  await prisma.analytics.create({
    data: {
      userId: juniorUser.id,
      queryCount: 25,
      totalTokens: 1500,
      avgResponseTime: 850,
      dailyQueries: 5,
    },
  });

  await prisma.analytics.create({
    data: {
      userId: seniorUser.id,
      queryCount: 10,
      totalTokens: 800,
      avgResponseTime: 750,
      dailyQueries: 2,
    },
  });

  console.log('📊 Created analytics entries');

  console.log('✅ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
