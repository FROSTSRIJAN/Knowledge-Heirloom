import express from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.txt', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, TXT, DOC, and DOCX files are allowed'));
    }
  }
});

// Apply authentication to all upload routes
router.use(authenticate);

// Upload and process PDF/document files
router.post('/document', upload.single('file'), asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;
  const userName = req.user?.name || 'Unknown User';

  if (!req.file) {
    throw createError('No file uploaded', 400);
  }

  try {
    let extractedText = '';
    let title = path.parse(req.file.originalname).name;

    // Process PDF files
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdf(dataBuffer);
      extractedText = data.text;
      
      // Extract potential title from first line or filename
      const firstLine = data.text.split('\n')[0]?.trim();
      if (firstLine && firstLine.length < 100 && firstLine.length > 5) {
        title = firstLine;
      }
    }
    // Process text files
    else if (req.file.mimetype === 'text/plain') {
      extractedText = fs.readFileSync(req.file.path, 'utf-8');
    }
    else {
      // For other document types, just use filename as content for now
      extractedText = `Document: ${req.file.originalname}\nFile uploaded and stored. Content extraction for this file type is not yet implemented.`;
    }

    // Generate summary using AI (first 200 words)
    const summary = extractedText.substring(0, 200).trim() + (extractedText.length > 200 ? '...' : '');

    // Extract keywords and tags
    const keywords = extractedText.split(' ')
      .filter(word => word.length > 3)
      .slice(0, 20)
      .map(word => word.toLowerCase().replace(/[^a-z]/g, ''))
      .filter(word => word.length > 0);

    const tags = ['uploaded', 'document', path.extname(req.file.originalname).substring(1)];

    // Save to knowledge base
    const knowledgeEntry = await prisma.knowledgeBase.create({
      data: {
        title: title,
        content: extractedText,
        summary: summary,
        category: 'document',
        source: 'upload',
        priority: 5,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.filename,
        uploadedBy: userId,
        tags: JSON.stringify(tags),
        keyWords: JSON.stringify(keywords)
      }
    });

    // Also create a document record
    const document = await prisma.document.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileType: path.extname(req.file.originalname),
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        processed: true,
        extractedText: extractedText,
        summary: summary,
        uploadedBy: userId
      }
    });

    logger.info(`Document processed and saved: ${req.file.originalname} by user ${userId}`, {
      knowledgeId: knowledgeEntry.id,
      documentId: document.id,
      fileSize: req.file.size,
      extractedLength: extractedText.length
    });

    // Clean up uploaded file (keep it if you want to access later)
    // fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: '📄 Document uploaded and processed successfully!',
      document: {
        id: document.id,
        knowledgeId: knowledgeEntry.id,
        title: knowledgeEntry.title,
        summary: knowledgeEntry.summary,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        wordCount: extractedText.split(' ').length,
        extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
        tags: tags,
        keywords: keywords.slice(0, 10)
      }
    });

  } catch (error) {
    // Clean up file if processing failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    logger.error('Document processing failed:', error);
    throw createError('Failed to process document', 500);
  }
}));

// Get upload history
router.get('/history', asyncHandler(async (req: any, res: express.Response) => {
  const userId = req.user?.userId;

  // This would query your documents table when implemented
  const mockHistory = [
    {
      id: '1',
      filename: 'company-handbook.pdf',
      uploadDate: new Date(),
      status: 'processed',
      fileSize: 2048576,
      extractedWords: 15420
    }
  ];

  res.json({
    success: true,
    uploads: mockHistory
  });
}));

export default router;
