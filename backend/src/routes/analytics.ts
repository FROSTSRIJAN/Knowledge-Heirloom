import express from 'express';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all analytics routes
router.use(authenticate);

// Get user analytics dashboard
router.get('/dashboard', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  // Different analytics based on role
  if (userRole === 'ADMIN') {
    // Admin sees system-wide analytics
    const totalUsers = await prisma.user.count();
    const totalConversations = await prisma.conversation.count();
    const totalMessages = await prisma.message.count();
    const totalLegacyMessages = await prisma.legacyMessage.count();

    const recentActivity = await prisma.analytics.groupBy({
      by: ['date'],
      _sum: {
        dailyQueries: true,
        totalTokens: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 30
    });

    const topUsers = await prisma.analytics.groupBy({
      by: ['userId'],
      _sum: {
        queryCount: true,
        totalTokens: true
      },
      orderBy: {
        _sum: {
          queryCount: 'desc'
        }
      },
      take: 10
    });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalConversations,
          totalMessages,
          totalLegacyMessages
        },
        recentActivity: recentActivity.map((day: any) => ({
          date: day.date,
          queries: day._sum.dailyQueries || 0,
          tokens: day._sum.totalTokens || 0
        })),
        topUsers: topUsers.map((user: any) => ({
          userId: user.userId,
          totalQueries: user._sum.queryCount || 0,
          totalTokens: user._sum.totalTokens || 0
        }))
      }
    });

  } else {
    // Regular users see their personal analytics
    const userAnalytics = await prisma.analytics.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    const totalStats = await prisma.analytics.aggregate({
      where: { userId },
      _sum: {
        queryCount: true,
        totalTokens: true
      },
      _avg: {
        avgResponseTime: true
      }
    });

    const conversationCount = await prisma.conversation.count({
      where: { userId, isActive: true }
    });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalQueries: totalStats._sum.queryCount || 0,
          totalTokens: totalStats._sum.totalTokens || 0,
          averageResponseTime: Math.round(totalStats._avg.avgResponseTime || 0),
          totalConversations: conversationCount
        },
        dailyActivity: userAnalytics.map((day: any) => ({
          date: day.date,
          queries: day.dailyQueries,
          tokens: day.totalTokens,
          responseTime: day.avgResponseTime
        }))
      }
    });
  }
}));

// Get conversation statistics
router.get('/conversations', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const whereCondition = userRole === 'ADMIN' ? {} : { userId };

  const conversationStats = await prisma.conversation.groupBy({
    by: ['userId'],
    where: {
      ...whereCondition,
      isActive: true
    },
    _count: {
      id: true
    },
    _max: {
      updatedAt: true
    }
  });

  const messageStats = await prisma.message.groupBy({
    by: ['type'],
    where: {
      conversation: whereCondition
    },
    _count: {
      id: true
    }
  });

  res.json({
    success: true,
    stats: {
      conversations: conversationStats,
      messages: messageStats.map((stat: any) => ({
        type: stat.type.toLowerCase(),
        count: stat._count.id
      }))
    }
  });
}));

// Get AI usage statistics
router.get('/ai-usage', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const whereCondition = userRole === 'ADMIN' ? {} : { userId };

  const aiStats = await prisma.analytics.aggregate({
    where: whereCondition,
    _sum: {
      queryCount: true,
      totalTokens: true
    },
    _avg: {
      avgResponseTime: true
    }
  });

  const monthlyUsage = await prisma.analytics.groupBy({
    by: ['date'],
    where: {
      ...whereCondition,
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    },
    _sum: {
      dailyQueries: true,
      totalTokens: true
    },
    orderBy: {
      date: 'asc'
    }
  });

  res.json({
    success: true,
    aiUsage: {
      totalQueries: aiStats._sum.queryCount || 0,
      totalTokens: aiStats._sum.totalTokens || 0,
      averageResponseTime: Math.round(aiStats._avg.avgResponseTime || 0),
      monthlyTrend: monthlyUsage.map((day: any) => ({
        date: day.date,
        queries: day._sum.dailyQueries || 0,
        tokens: day._sum.totalTokens || 0
      }))
    }
  });
}));

// Get legacy message engagement
router.get('/legacy-engagement', asyncHandler(async (req: any, res: express.Response) => {
  const userRole = req.user?.role;

  if (userRole !== 'ADMIN' && userRole !== 'SENIOR_DEV') {
    throw createError('Access denied', 403);
  }

  const legacyStats = await prisma.legacyMessage.groupBy({
    by: ['category'],
    _count: {
      id: true
    },
    where: {
      isPublic: true
    }
  });

  const specialMessages = await prisma.legacyMessage.count({
    where: {
      isSpecial: true,
      isPublic: true
    }
  });

  const recentMessages = await prisma.legacyMessage.findMany({
    where: {
      isPublic: true,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      }
    },
    select: {
      id: true,
      title: true,
      category: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    legacyEngagement: {
      byCategory: legacyStats.map((stat: any) => ({
        category: stat.category,
        count: stat._count.id
      })),
      specialMessagesCount: specialMessages,
      recentMessages
    }
  });
}));

export default router;
