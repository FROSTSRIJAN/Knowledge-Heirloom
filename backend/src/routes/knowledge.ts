import express from 'express';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import datasetService from '../services/datasetService';
import documentService from '../services/documentService';

const router = express.Router();

// Apply authentication to knowledge routes where needed
router.use('/create', authenticate);
router.use('/update', authenticate);
router.use('/delete', authenticate);
router.use('/upload', authenticate);
router.use('/datasets', authenticate);

// Get knowledge base entries with enhanced search
router.get('/', asyncHandler(async (req: any, res: express.Response) => {
  const { category, tags, search, source, limit = 20, page = 1 } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let whereCondition: any = { isActive: true };

  if (category) {
    whereCondition.category = category;
  }

  if (source) {
    whereCondition.source = source;
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags];
    whereCondition.keyWords = {
      hasSome: tagArray
    };
  }

  if (search) {
    whereCondition.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { summary: { contains: search } }
    ];
  }

  const [knowledgeEntries, totalCount] = await Promise.all([
    prisma.knowledgeBase.findMany({
      where: whereCondition,
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: offset,
      take: parseInt(limit as string),
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.knowledgeBase.count({ where: whereCondition })
  ]);

  res.json({
    success: true,
    knowledge: knowledgeEntries.map(entry => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      summary: entry.summary,
      category: entry.category,
      tags: entry.tags,
      keyWords: entry.keyWords,
      source: entry.source,
      priority: entry.priority,
      updatedAt: entry.updatedAt,
      uploadedBy: entry.user?.name
    })),
    totalCount,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalCount / parseInt(limit as string))
    }
  });
}));

// Create knowledge base entry (Admin only)
router.post('/', asyncHandler(async (req: any, res: express.Response) => {
  const userRole = req.user?.role;

  if (userRole !== 'ADMIN' && userRole !== 'SENIOR_DEV') {
    throw createError('Only admins and senior developers can create knowledge entries', 403);
  }

  const { title, content, category, tags = [], keyWords = [], priority = 1 } = req.body;

  if (!title || !content) {
    throw createError('Title and content are required', 400);
  }

  const knowledgeEntry = await prisma.knowledgeBase.create({
    data: {
      title,
      content,
      category: category || 'general',
      tags: JSON.stringify(Array.isArray(tags) ? tags : [tags || 'general']),
      keyWords: JSON.stringify(Array.isArray(keyWords) ? keyWords : [keyWords || title?.split(' ') || ['general']].flat()),
      priority,
      source: 'manual',
      uploadedBy: req.user?.id,
      summary: content.length > 200 ? content.substring(0, 200) + '...' : content
    }
  });

  res.status(201).json({
    success: true,
    message: 'Knowledge entry created successfully! 📚',
    knowledge: {
      id: knowledgeEntry.id,
      title: knowledgeEntry.title,
      content: knowledgeEntry.content,
      summary: knowledgeEntry.summary,
      category: knowledgeEntry.category,
      tags: knowledgeEntry.tags,
      source: knowledgeEntry.source,
      priority: knowledgeEntry.priority,
      createdAt: knowledgeEntry.createdAt
    }
  });
}));

// Initialize all datasets (Admin only)
router.post('/datasets/initialize', authenticate, asyncHandler(async (req: any, res: express.Response) => {
  if (req.user?.role !== 'ADMIN') {
    throw createError('Admin access required', 403);
  }

  // const result = await datasetService.initializeAllDatasets();
  
  res.json({
    success: true,
    message: `🚀 Dataset service temporarily disabled - will be restored shortly!`,
    data: { totalRecords: 0, status: 'disabled' }
  });
}));

// Get dataset statistics
router.get('/datasets/stats', authenticate, asyncHandler(async (req: any, res: express.Response) => {
  // const stats = await datasetService.getDatasetStats();
  res.json({
    success: true,
    data: { totalDatasets: 0, status: 'disabled' }
  });
}));

// Upload document (PDF, TXT, MD)
router.post('/upload', documentService.getMulterConfig().single('document'), asyncHandler(async (req: any, res: express.Response) => {
  if (!req.file) {
    throw createError('No file uploaded', 400);
  }

  const result = await documentService.processDocument(req.file, req.user?.id);
  
  res.json({
    success: true,
    message: `📄 Document "${req.file.originalname}" processed successfully!`,
    data: result
  });
}));

// Get user's uploaded documents
router.get('/documents/my', authenticate, asyncHandler(async (req: any, res: express.Response) => {
  const documents = await documentService.getUserDocuments(req.user?.id);
  
  res.json({
    success: true,
    documents: documents
  });
}));

// Delete document
router.delete('/documents/:id', authenticate, asyncHandler(async (req: any, res: express.Response) => {
  await documentService.deleteDocument(req.params.id, req.user?.id);
  
  res.json({
    success: true,
    message: 'Document deleted successfully! 🗑️'
  });
}));

// Get document statistics (Admin only)
router.get('/documents/stats', authenticate, asyncHandler(async (req: any, res: express.Response) => {
  if (req.user?.role !== 'ADMIN') {
    throw createError('Admin access required', 403);
  }

  const stats = await documentService.getDocumentStats();
  res.json({
    success: true,
    data: stats
  });
}));

// Get metadata (categories, sources, tags)
router.get('/metadata', asyncHandler(async (req: any, res: express.Response) => {
  const [categories, sources] = await Promise.all([
    prisma.knowledgeBase.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { isActive: true }
    }),
    prisma.knowledgeBase.groupBy({
      by: ['source'],
      _count: { source: true },
      where: { isActive: true }
    })
  ]);

  res.json({
    success: true,
    metadata: {
      categories: categories.map(c => ({ name: c.category, count: c._count.category })),
      sources: sources.map(s => ({ name: s.source, count: s._count.source }))
    }
  });
}));

// Advanced search endpoint
router.post('/search', asyncHandler(async (req: any, res: express.Response) => {
  const { query, filters = {}, page = 1, limit = 10 } = req.body;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let whereCondition: any = { isActive: true };

  // Text search across multiple fields
  if (query) {
    whereCondition.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
      { summary: { contains: query } }
    ];
  }

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    whereCondition.category = { in: filters.category };
  }

  if (filters.source && filters.source.length > 0) {
    whereCondition.source = { in: filters.source };
  }

  if (filters.tags && filters.tags.length > 0) {
    whereCondition.keyWords = { hasSome: filters.tags };
  }

  const [results, totalCount] = await Promise.all([
    prisma.knowledgeBase.findMany({
      where: whereCondition,
      orderBy: [
        { priority: 'desc' },
        { updatedAt: 'desc' }
      ],
      skip: offset,
      take: parseInt(limit as string),
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        category: true,
        tags: true,
        keyWords: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: { name: true }
        }
      }
    }),
    prisma.knowledgeBase.count({ where: whereCondition })
  ]);

  res.json({
    success: true,
    results,
    totalCount,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalCount / parseInt(limit as string))
    }
  });
}));

export default router;
