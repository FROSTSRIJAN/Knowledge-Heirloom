import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { demoKnowledge, demoStats, demoDocuments, demoLegacyMessages } from '../data/demoData';

const router = express.Router();

// Demo routes that work without database connection

// Get demo knowledge base entries
router.get('/', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { search, category, source, page = 1, limit = 20 } = req.query;
  
  let filteredKnowledge = [...demoKnowledge];

  // Apply search filter
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredKnowledge = filteredKnowledge.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.summary.toLowerCase().includes(searchTerm) ||
      entry.keyWords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  // Apply category filter
  if (category) {
    filteredKnowledge = filteredKnowledge.filter(entry => entry.category === category);
  }

  // Apply source filter  
  if (source) {
    filteredKnowledge = filteredKnowledge.filter(entry => entry.source === source);
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedEntries = filteredKnowledge.slice(startIndex, endIndex);

  res.json({
    success: true,
    knowledge: paginatedEntries,
    totalCount: filteredKnowledge.length,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(filteredKnowledge.length / Number(limit))
    }
  });
}));

// Get knowledge entry by ID
router.get('/:id', asyncHandler(async (req: express.Request, res: express.Response) => {
  const entry = demoKnowledge.find(kb => kb.id === req.params.id);
  
  if (!entry) {
    return res.status(404).json({ success: false, error: 'Knowledge entry not found' });
  }

  res.json({
    success: true,
    knowledge: entry
  });
}));

// Get dataset statistics  
router.get('/datasets/stats', asyncHandler(async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    data: demoStats
  });
}));

// Initialize datasets (demo response)
router.post('/datasets/initialize', asyncHandler(async (req: express.Request, res: express.Response) => {
  // Simulate dataset initialization
  setTimeout(() => {
    res.json({
      success: true,
      message: `🚀 Successfully initialized ${demoKnowledge.length} knowledge entries from multiple sources!`,
      data: {
        totalRecords: demoKnowledge.length,
        datasets: [
          { source: 'synthetic', recordsCreated: 5 },
          { source: 'kaggle', recordsCreated: 2 },
          { source: 'huggingface', recordsCreated: 2 },
          { source: 'web-scraping', recordsCreated: 1 },
          { source: 'upload', recordsCreated: 2 }
        ]
      }
    });
  }, 1000);
}));

// Demo file upload (simulates PDF processing)
router.post('/upload', asyncHandler(async (req: express.Request, res: express.Response) => {
  // Simulate file upload processing
  const mockFile = {
    originalname: 'demo-document.pdf',
    filename: 'demo-document-' + Date.now() + '.pdf',
    size: 1234567,
    mimetype: 'application/pdf'
  };

  res.json({
    success: true,
    message: `📄 Document "${mockFile.originalname}" processed successfully!`,
    data: {
      document: {
        id: 'demo-doc-' + Date.now(),
        filename: mockFile.filename,
        originalName: mockFile.originalname,
        fileSize: mockFile.size,
        processed: true
      },
      extractedText: "This is demo extracted text from the PDF document. In a real implementation, this would contain the actual text extracted from the uploaded PDF file...",
      summary: "Demo document summary showing PDF text extraction and processing capabilities."
    }
  });
}));

// Get user documents (demo)
router.get('/documents/my', asyncHandler(async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    documents: demoDocuments
  });
}));

// Get document statistics (demo)
router.get('/documents/stats', asyncHandler(async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    data: {
      total: demoDocuments.length,
      processed: demoDocuments.filter(doc => doc.processed).length,
      totalSize: demoDocuments.reduce((sum, doc) => sum + doc.fileSize, 0),
      averageSize: demoDocuments.reduce((sum, doc) => sum + doc.fileSize, 0) / demoDocuments.length,
      byType: [
        { fileType: '.pdf', _count: { id: 2 } }
      ]
    }
  });
}));

// Get metadata (categories, sources) 
router.get('/metadata', asyncHandler(async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    metadata: {
      categories: demoStats.categories,
      sources: demoStats.sources
    }
  });
}));

// Advanced search
router.post('/search', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { query, filters = {}, page = 1, limit = 10 } = req.body;
  
  let results = [...demoKnowledge];

  // Apply text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.summary.toLowerCase().includes(searchTerm) ||
      entry.keyWords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    results = results.filter(entry => filters.category.includes(entry.category));
  }

  if (filters.source && filters.source.length > 0) {
    results = results.filter(entry => filters.source.includes(entry.source));
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(entry => 
      filters.tags.some((tag: string) => entry.keyWords.includes(tag))
    );
  }

  // Pagination
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    success: true,
    results: paginatedResults,
    totalCount: results.length,
    pagination: {
      page: Number(page),
      limit: Number(limit), 
      totalPages: Math.ceil(results.length / Number(limit))
    }
  });
}));

// Get legacy messages (demo)
router.get('/legacy', asyncHandler(async (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    messages: demoLegacyMessages
  });
}));

export default router;
