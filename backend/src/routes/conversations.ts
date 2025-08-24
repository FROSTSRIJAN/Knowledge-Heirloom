import express from 'express';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication to all conversation routes
router.use(authenticate);

// Get all conversations for a user
router.get('/', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;

  const conversations = await prisma.conversation.findMany({
    where: { 
      userId,
      isActive: true 
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1 // Get last message for preview
      },
      _count: {
        select: { messages: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  res.json({
    success: true,
    conversations: conversations.map((conv: any) => ({
      id: conv.id,
      title: conv.title || 'New Conversation',
      lastMessage: conv.messages[0]?.content?.substring(0, 100) + '...' || 'No messages yet',
      messageCount: conv._count.messages,
      updatedAt: conv.updatedAt,
      createdAt: conv.createdAt
    }))
  });
}));

// Get specific conversation with all messages
router.get('/:conversationId', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
      isActive: true
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      user: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    }
  });

  if (!conversation) {
    throw createError('Conversation not found', 404);
  }

  res.json({
    success: true,
    conversation: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      messages: conversation.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
        tokensUsed: msg.tokensUsed,
        responseTime: msg.responseTime
      }))
    }
  });
}));

// Start new conversation
router.post('/start', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const { title, initialMessage } = req.body;

  // Create conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: title || 'New Conversation',
      userId
    }
  });

  // If there's an initial message, process it
  let response = null;
  if (initialMessage) {
    response = await processAIMessage(conversation.id, userId, initialMessage, req.user.role);
  }

  logger.info(`New conversation started: ${conversation.id} by user ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Conversation started! 💬',
    conversation: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt
    },
    ...(response && { aiResponse: response })
  });
}));

// Send message to conversation
router.post('/:conversationId/message', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const { conversationId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw createError('Message content is required', 400);
  }

  // Verify conversation ownership
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
      isActive: true
    }
  });

  if (!conversation) {
    throw createError('Conversation not found', 404);
  }

  // Process the message and get AI response
  const aiResponse = await processAIMessage(conversationId, userId, content, userRole);

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { 
      updatedAt: new Date(),
      // Auto-generate title from first message if not set
      ...((!conversation.title || conversation.title === 'New Conversation') && {
        title: generateConversationTitle(content)
      })
    }
  });

  res.json({
    success: true,
    message: 'Message sent! 🚀',
    userMessage: {
      id: aiResponse.userMessage.id,
      content: aiResponse.userMessage.content,
      type: 'user',
      createdAt: aiResponse.userMessage.createdAt
    },
    aiResponse: {
      id: aiResponse.aiMessage.id,
      content: aiResponse.aiMessage.content,
      type: 'bot',
      createdAt: aiResponse.aiMessage.createdAt,
      tokensUsed: aiResponse.aiMessage.tokensUsed,
      responseTime: aiResponse.aiMessage.responseTime
    }
  });
}));

// Delete conversation
router.delete('/:conversationId', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId
    }
  });

  if (!conversation) {
    throw createError('Conversation not found', 404);
  }

  // Soft delete
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { isActive: false }
  });

  logger.info(`Conversation deleted: ${conversationId} by user ${userId}`);

  res.json({
    success: true,
    message: 'Conversation deleted successfully'
  });
}));

// Helper function to process AI messages
async function processAIMessage(conversationId: string, userId: string, userContent: string, userRole: string) {
  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      content: userContent,
      type: 'USER',
      conversationId
    }
  });

  // Get conversation history
  const recentMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: 10 // Last 10 messages for context
  });

  // Convert to OpenAI format
  const conversationHistory = recentMessages
    .reverse() // Oldest first
    .filter((msg: any) => msg.id !== userMessage.id) // Exclude current message
    .map((msg: any) => ({
      role: msg.type === 'USER' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

  // Get relevant legacy context if user is employee
  let legacyContext = '';
  if (userRole === 'EMPLOYEE') {
    const legacyMessages = await prisma.legacyMessage.findMany({
      where: { isPublic: true },
      take: 2,
      orderBy: { createdAt: 'desc' }
    });
    
    if (legacyMessages.length > 0) {
  legacyContext = legacyMessages.map((msg: any) => `"${msg.title}": ${msg.content}`).join('\n\n');
    }
  }

  // Generate AI response
  const aiResponse = await aiService.generateResponse(
    userContent,
    conversationHistory,
    userRole,
    legacyContext
  );

  // Save AI message
  const aiMessage = await prisma.message.create({
    data: {
      content: aiResponse.content,
      type: 'BOT',
      conversationId,
      aiModel: 'gpt-3.5-turbo',
      tokensUsed: aiResponse.tokensUsed,
      responseTime: aiResponse.responseTime
    }
  });

  // Update user analytics
  await updateUserAnalytics(userId, aiResponse.tokensUsed, aiResponse.responseTime);

  return {
    userMessage,
    aiMessage
  };
}

// Helper function to update user analytics
async function updateUserAnalytics(userId: string, tokens: number, responseTime: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const analytics = await prisma.analytics.upsert({
    where: {
      userId_date: {
        userId,
        date: today
      }
    },
    update: {
      queryCount: { increment: 1 },
      totalTokens: { increment: tokens },
      dailyQueries: { increment: 1 },
      avgResponseTime: { increment: responseTime },
      lastActivity: new Date()
    },
    create: {
      userId,
      date: today,
      queryCount: 1,
      totalTokens: tokens,
      dailyQueries: 1,
      avgResponseTime: responseTime,
      lastActivity: new Date()
    }
  });

  return analytics;
}

// Helper function to generate conversation title
function generateConversationTitle(content: string): string {
  const words = content.split(' ').slice(0, 5).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}

export default router;
