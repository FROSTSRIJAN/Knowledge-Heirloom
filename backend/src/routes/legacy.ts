import express from 'express';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication to all legacy routes
router.use(authenticate);

// Get all legacy messages (public ones for employees, all for admin/senior)
router.get('/', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const whereCondition = userRole === 'EMPLOYEE' 
    ? { isPublic: true }
    : userRole === 'SENIOR_DEV'
    ? { seniorDevId: userId }
    : {}; // Admin sees all

  const legacyMessages = await prisma.legacyMessage.findMany({
    where: whereCondition,
    include: {
      seniorDev: {
        select: {
          id: true,
          name: true,
          profileImage: true
        }
      }
    },
    orderBy: [
      { isSpecial: 'desc' }, // Special messages first
      { createdAt: 'desc' }
    ]
  });

  res.json({
    success: true,
    messages: legacyMessages.map((msg: any) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      category: msg.category,
      isSpecial: msg.isSpecial,
      audioUrl: msg.audioUrl,
      createdAt: msg.createdAt,
      author: {
        name: msg.seniorDev.name,
        profileImage: msg.seniorDev.profileImage
      }
    })),
    totalCount: legacyMessages.length,
    specialCount: legacyMessages.filter((msg: any) => msg.isSpecial).length
  });
}));

// Get random daily wisdom message for employees
router.get('/daily-wisdom', asyncHandler(async (req: any, res: express.Response) => {
  const userRole = req.user?.role;

  if (userRole !== 'EMPLOYEE') {
    throw createError('This endpoint is only for employees', 403);
  }

  // Get a random motivational or wisdom message
  const randomMessage = await prisma.legacyMessage.findFirst({
    where: {
      isPublic: true,
      category: { in: ['wisdom', 'motivational', 'farewell'] }
    },
    include: {
      seniorDev: {
        select: {
          name: true,
          profileImage: true
        }
      }
    },
    // Pseudo-random selection based on date
    skip: Math.floor(Math.random() * await prisma.legacyMessage.count({
      where: {
        isPublic: true,
        category: { in: ['wisdom', 'motivational', 'farewell'] }
      }
    }))
  });

  if (!randomMessage) {
    // Return default message if no legacy messages exist yet
    res.json({
      success: true,
      message: {
        id: 'default',
        title: 'Welcome to Knowledge Heirloom! 🎁',
        content: 'This system was built with love and dedication for the next generation of developers. Every question you ask and every challenge you overcome adds to the collective wisdom of our team. Keep learning, keep growing, and remember - the best code is written with both logic and heart.',
        category: 'welcome',
        isSpecial: true,
        author: {
          name: 'Knowledge Heirloom Team',
          profileImage: null
        },
        createdAt: new Date().toISOString()
      }
    });
    return;
  }

  res.json({
    success: true,
    message: {
      id: randomMessage.id,
      title: randomMessage.title,
      content: randomMessage.content,
      category: randomMessage.category,
      isSpecial: randomMessage.isSpecial,
      audioUrl: randomMessage.audioUrl,
      createdAt: randomMessage.createdAt,
      author: {
        name: randomMessage.seniorDev.name,
        profileImage: randomMessage.seniorDev.profileImage
      }
    }
  });
}));

// Get specific legacy message
router.get('/:messageId', asyncHandler(async (req: any, res: express.Response) => {
  const { messageId } = req.params;
  const userRole = req.user?.role;
  const userId = req.user?.userId;

  const message = await prisma.legacyMessage.findUnique({
    where: { id: messageId },
    include: {
      seniorDev: {
        select: {
          id: true,
          name: true,
          profileImage: true
        }
      }
    }
  });

  if (!message) {
    throw createError('Legacy message not found', 404);
  }

  // Check access permissions
  if (userRole === 'EMPLOYEE' && !message.isPublic) {
    throw createError('Access denied to this message', 403);
  }

  if (userRole === 'SENIOR_DEV' && message.seniorDevId !== userId) {
    throw createError('Access denied to this message', 403);
  }

  res.json({
    success: true,
    message: {
      id: message.id,
      title: message.title,
      content: message.content,
      category: message.category,
      isSpecial: message.isSpecial,
      isPublic: message.isPublic,
      audioUrl: message.audioUrl,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      author: {
        name: message.seniorDev.name,
        profileImage: message.seniorDev.profileImage
      }
    }
  });
}));

// Create new legacy message (Senior Dev only)
router.post('/', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole !== 'SENIOR_DEV' && userRole !== 'ADMIN') {
    throw createError('Only senior developers can create legacy messages', 403);
  }

  const { 
    title, 
    content, 
    category = 'wisdom', 
    isPublic = true, 
    isSpecial = false,
    generateWithAI = false,
    aiPrompt
  } = req.body;

  if (!title || (!content && !generateWithAI)) {
    throw createError('Title and content (or AI generation prompt) are required', 400);
  }

  let finalContent = content;

  // Generate content with AI if requested
  if (generateWithAI && aiPrompt) {
    try {
      finalContent = await aiService.generateLegacyMessage(aiPrompt, category);
      logger.info(`AI-generated legacy message created for category: ${category}`);
    } catch (error) {
      logger.error('Failed to generate AI content, using provided content or default');
      finalContent = content || 'A message of wisdom and encouragement for the next generation.';
    }
  }

  const legacyMessage = await prisma.legacyMessage.create({
    data: {
      title,
      content: finalContent,
      category,
      isPublic,
      isSpecial,
      seniorDevId: userId
    },
    include: {
      seniorDev: {
        select: {
          name: true,
          profileImage: true
        }
      }
    }
  });

  logger.info(`New legacy message created: ${legacyMessage.id} by ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Legacy message created successfully! 🎁',
    legacyMessage: {
      id: legacyMessage.id,
      title: legacyMessage.title,
      content: legacyMessage.content,
      category: legacyMessage.category,
      isSpecial: legacyMessage.isSpecial,
      isPublic: legacyMessage.isPublic,
      createdAt: legacyMessage.createdAt,
      author: {
        name: legacyMessage.seniorDev.name,
        profileImage: legacyMessage.seniorDev.profileImage
      }
    }
  });
}));

// Update legacy message (Senior Dev only)
router.put('/:messageId', asyncHandler(async (req: any, res: express.Response) => {
  const { messageId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole !== 'SENIOR_DEV' && userRole !== 'ADMIN') {
    throw createError('Only senior developers can update legacy messages', 403);
  }

  const existingMessage = await prisma.legacyMessage.findUnique({
    where: { id: messageId }
  });

  if (!existingMessage) {
    throw createError('Legacy message not found', 404);
  }

  if (userRole === 'SENIOR_DEV' && existingMessage.seniorDevId !== userId) {
    throw createError('You can only update your own legacy messages', 403);
  }

  const { title, content, category, isPublic, isSpecial } = req.body;

  const updatedMessage = await prisma.legacyMessage.update({
    where: { id: messageId },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(category && { category }),
      ...(typeof isPublic === 'boolean' && { isPublic }),
      ...(typeof isSpecial === 'boolean' && { isSpecial }),
      updatedAt: new Date()
    },
    include: {
      seniorDev: {
        select: {
          name: true,
          profileImage: true
        }
      }
    }
  });

  logger.info(`Legacy message updated: ${messageId} by ${userId}`);

  res.json({
    success: true,
    message: 'Legacy message updated successfully! ✨',
    legacyMessage: {
      id: updatedMessage.id,
      title: updatedMessage.title,
      content: updatedMessage.content,
      category: updatedMessage.category,
      isSpecial: updatedMessage.isSpecial,
      isPublic: updatedMessage.isPublic,
      createdAt: updatedMessage.createdAt,
      updatedAt: updatedMessage.updatedAt,
      author: {
        name: updatedMessage.seniorDev.name,
        profileImage: updatedMessage.seniorDev.profileImage
      }
    }
  });
}));

// Delete legacy message (Senior Dev only)
router.delete('/:messageId', asyncHandler(async (req: any, res: express.Response) => {
  const { messageId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole !== 'SENIOR_DEV' && userRole !== 'ADMIN') {
    throw createError('Only senior developers can delete legacy messages', 403);
  }

  const existingMessage = await prisma.legacyMessage.findUnique({
    where: { id: messageId }
  });

  if (!existingMessage) {
    throw createError('Legacy message not found', 404);
  }

  if (userRole === 'SENIOR_DEV' && existingMessage.seniorDevId !== userId) {
    throw createError('You can only delete your own legacy messages', 403);
  }

  await prisma.legacyMessage.delete({
    where: { id: messageId }
  });

  logger.info(`Legacy message deleted: ${messageId} by ${userId}`);

  res.json({
    success: true,
    message: 'Legacy message deleted successfully'
  });
}));

export default router;
