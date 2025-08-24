import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Senior Developer (retiring)
  const seniorDev = await prisma.user.upsert({
    where: { email: 'senior@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'senior@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'SENIOR_DEV',
      profileImage: '👩‍💻'
    }
  });

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Alex Rodriguez',
      email: 'admin@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'ADMIN',
      profileImage: '👨‍💼'
    }
  });

  // Regular employees
  const employee1 = await prisma.user.upsert({
    where: { email: 'junior@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Taylor Kim',
      email: 'junior@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      profileImage: '🧑‍💻'
    }
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'dev@knowledgeheirloom.com' },
    update: {},
    create: {
      name: 'Jordan Smith',
      email: 'dev@knowledgeheirloom.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
      profileImage: '👩‍🔬'
    }
  });

  console.log('✅ Users created');

  // Create legacy messages from the senior developer
  const legacyMessages = [
    {
      title: 'Welcome to Your Journey 🚀',
      content: `Dear next generation,

After 15 wonderful years in this industry, I'm passing the torch to you. This AI assistant contains not just technical knowledge, but the wisdom I've gathered through countless late nights, breakthrough moments, and lessons learned the hard way.

Remember: the best code isn't just functional—it's readable, maintainable, and written with the next developer in mind. That next developer might be you, six months from now, wondering "what was I thinking?"

Keep learning, stay curious, and never be afraid to ask questions.

With warm regards and high hopes,
Sarah 💙`,
      category: 'farewell',
      isPublic: true,
      isSpecial: true,
      seniorDevId: seniorDev.id
    },
    {
      title: 'Code Review Wisdom 📝',
      content: `The most valuable skill I've developed isn't writing code—it's reading it. Every code review is an opportunity to learn and teach. Be kind in your reviews, specific in your feedback, and always remember that behind every pull request is a human being trying to solve a problem.

Pro tip: If you find yourself writing "fix this" in a review, take a moment to explain the "why" behind your suggestion. Future you (and your teammates) will thank you.`,
      category: 'technical',
      isPublic: true,
      isSpecial: false,
      seniorDevId: seniorDev.id
    },
    {
      title: 'When Things Break (And They Will) 🔧',
      content: `Production outages happen to everyone. I've learned more from failures than successes. When things go wrong:

1. Stay calm and methodical
2. Gather data before jumping to conclusions  
3. Communicate clearly with your team
4. Document the incident and the fix
5. Share the knowledge so others can learn

Remember: every bug is a feature we didn't know we were building! 😄

The best engineers aren't those who never make mistakes—they're the ones who learn from them and help others do the same.`,
      category: 'wisdom',
      isPublic: true,
      isSpecial: false,
      seniorDevId: seniorDev.id
    },
    {
      title: 'Career Growth Insights 📈',
      content: `Your career isn't a ladder—it's a lattice. Don't just focus on climbing up; sometimes the most growth comes from moving sideways, learning new domains, or even stepping back to mentor others.

Technical skills will get you in the door, but communication skills will carry you through your career. Learn to translate technical concepts for non-technical stakeholders. Practice writing clear documentation. Master the art of the 5-minute explanation.

And remember: imposter syndrome never fully goes away, even after 15 years. The difference is learning that everyone else feels it too.`,
      category: 'motivational',
      isPublic: true,
      isSpecial: false,
      seniorDevId: seniorDev.id
    },
    {
      title: 'The Art of Problem Solving 🧩',
      content: `Before you start coding, spend time understanding the problem. The best solution to the wrong problem is still wrong.

My approach:
1. Define the problem clearly (rubber duck debugging works!)
2. Break it down into smaller pieces
3. Look for existing solutions or patterns
4. Start simple, then iterate
5. Test early and often

Some of my best solutions came not from clever algorithms, but from stepping back and asking "what are we actually trying to achieve here?"`,
      category: 'technical',
      isPublic: true,
      isSpecial: false,
      seniorDevId: seniorDev.id
    },
    {
      title: 'Building Great Teams 🤝',
      content: `Code is a team sport. The most successful projects I've worked on had teams that:

- Shared knowledge freely (no knowledge hoarding!)
- Celebrated small wins together
- Learned from failures without blame
- Mentored each other regardless of seniority
- Made time for both deep work and collaboration

Your legacy isn't just the code you write—it's the people you help grow along the way.`,
      category: 'wisdom',
      isPublic: true,
      isSpecial: false,
      seniorDevId: seniorDev.id
    }
  ];

  for (const message of legacyMessages) {
    await prisma.legacyMessage.upsert({
      where: { id: `seed-${message.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
      update: {},
      create: {
        id: `seed-${message.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        ...message
      }
    });
  }

  console.log('✅ Legacy messages created');

  // Create sample knowledge base entries
  const knowledgeEntries = [
    {
      title: 'Setting up Development Environment',
      content: `Complete guide to setting up your local development environment:

1. Install Node.js LTS version
2. Set up your code editor (VS Code recommended)
3. Configure Git with your credentials
4. Install essential extensions
5. Set up project-specific configurations

Remember to document your setup process for future team members!`,
      category: 'setup',
      tags: ['development', 'setup', 'nodejs', 'git'],
      priority: 10
    },
    {
      title: 'Code Review Checklist',
      content: `Before submitting a PR, review:

✅ Code follows team conventions
✅ Tests are included and passing
✅ Documentation is updated
✅ No sensitive data is exposed
✅ Performance impact is considered
✅ Error handling is adequate
✅ Code is readable and well-commented

Take your time with reviews - they're investments in code quality!`,
      category: 'process',
      tags: ['code-review', 'quality', 'process'],
      priority: 8
    },
    {
      title: 'Debugging Production Issues',
      content: `When production is down:

1. Check monitoring dashboards first
2. Review recent deployments
3. Check logs for error patterns
4. Validate database connections
5. Test external service dependencies
6. Implement temporary fixes if needed
7. Document the incident thoroughly

Stay calm, communicate clearly, and remember: we're all learning!`,
      category: 'troubleshooting',
      tags: ['debugging', 'production', 'incident-response'],
      priority: 9
    }
  ];

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeBase.upsert({
      where: { id: `seed-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
      update: {},
      create: {
        id: `seed-${entry.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        ...entry
      }
    });
  }

  console.log('✅ Knowledge base entries created');

  // Create a sample conversation to demonstrate the AI assistant
  const sampleConversation = await prisma.conversation.create({
    data: {
      title: 'Welcome Chat',
      userId: employee1.id,
      messages: {
        create: [
          {
            content: 'Hi! I\'m new to the team and wondering how to get started with our codebase.',
            type: 'USER'
          },
          {
            content: `Welcome to the team! 🎉 I'm excited to help you get started. Here's what I'd recommend for diving into our codebase:

1. **Start with the README** - It should give you a high-level overview of the project structure and setup instructions.

2. **Look for architecture documentation** - Understanding the overall system design will help you navigate more effectively.

3. **Find a "good first issue"** - These are usually tagged in our issue tracker and perfect for getting familiar with the development workflow.

4. **Set up your development environment** - I can help you with this if you run into any issues!

5. **Don't hesitate to ask questions** - The team is here to help, and asking questions is how we all learn and improve.

Remember, every senior developer was once where you are now. Take your time, be patient with yourself, and enjoy the learning process! 

Is there a specific area of the codebase you'd like to explore first?`,
            type: 'BOT',
            aiModel: 'gpt-3.5-turbo',
            tokensUsed: 245,
            responseTime: 1500
          }
        ]
      }
    }
  });

  console.log('✅ Sample conversation created');

  console.log('🎉 Database seed completed!');
  console.log('\n📧 Demo Accounts Created:');
  console.log('👩‍💻 Senior Developer: senior@knowledgeheirloom.com / password123');
  console.log('👨‍💼 Admin: admin@knowledgeheirloom.com / password123');  
  console.log('🧑‍💻 Employee 1: junior@knowledgeheirloom.com / password123');
  console.log('👩‍🔬 Employee 2: dev@knowledgeheirloom.com / password123');
  console.log('\n🎁 Legacy messages and knowledge base populated!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
