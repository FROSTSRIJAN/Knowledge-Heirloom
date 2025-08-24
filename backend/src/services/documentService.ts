import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentService {
  private readonly uploadDir = path.join(__dirname, '../../uploads');
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  constructor() {
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Configure multer for file uploads
  getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      }
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, TXT, MD, and DOCX files are allowed.'));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: this.maxFileSize
      }
    });
  }

  // Process uploaded document
  async processDocument(file: Express.Multer.File, userId: string) {
    try {
      console.log(`📄 Processing document: ${file.originalname}`);
      
      // Save document record
      const document = await prisma.document.create({
        data: {
          filename: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          fileType: path.extname(file.originalname).toLowerCase(),
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: userId
        }
      });

      // Extract text based on file type
      let extractedText = '';
      let summary = '';

      switch (file.mimetype) {
        case 'application/pdf':
          extractedText = await this.extractPDFText(file.path);
          break;
        case 'text/plain':
        case 'text/markdown':
          extractedText = fs.readFileSync(file.path, 'utf-8');
          break;
        default:
          extractedText = 'Content extraction not supported for this file type';
      }

      // Generate summary and keywords
      if (extractedText) {
        summary = this.generateSummary(extractedText);
        const keywords = this.extractKeywords(extractedText);

        // Update document with extracted content
        await prisma.document.update({
          where: { id: document.id },
          data: {
            extractedText,
            summary,
            processed: true
          }
        });

        // Create knowledge base entry
        await this.createKnowledgeEntry(document, extractedText, summary, keywords);
      }

      console.log(`✅ Document processed successfully: ${document.id}`);
      return {
        success: true,
        document,
        extractedText: extractedText.substring(0, 500) + '...',
        summary
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error('Failed to process document');
    }
  }

  // Extract text from PDF
  private async extractPDFText(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF text extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  // Create knowledge base entry from document
  private async createKnowledgeEntry(
    document: any,
    extractedText: string,
    summary: string,
    keywords: string[]
  ) {
    const category = this.determineCategory(extractedText, document.originalName);
    
    await prisma.knowledgeBase.create({
      data: {
        title: document.originalName.replace(/\.[^/.]+$/, ''), // Remove extension
        content: extractedText,
        category,
        tags: JSON.stringify(Array.isArray(keywords) ? keywords : [keywords || 'upload']),
        source: 'upload',
        fileType: document.fileType,
        filePath: document.filePath,
        fileSize: document.fileSize,
        summary,
        keyWords: JSON.stringify(Array.isArray(keywords) ? keywords : [keywords || 'upload']),
        uploadedBy: document.uploadedBy
      }
    });
  }

  // Generate summary from text
  private generateSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const topSentences = sentences.slice(0, 3);
    return topSentences.join('. ') + (topSentences.length > 0 ? '.' : '');
  }

  // Extract keywords from text
  private extractKeywords(text: string): string[] {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'should', 'could', 'can', 'may', 'might', 'this', 'that', 'these', 'those'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Return top 10 most frequent words
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Determine category based on content
  private determineCategory(text: string, filename: string): string {
    const techKeywords = {
      'development': ['code', 'programming', 'software', 'api', 'framework'],
      'infrastructure': ['server', 'database', 'cloud', 'deployment', 'docker'],
      'security': ['authentication', 'authorization', 'encryption', 'security', 'vulnerability'],
      'analytics': ['data', 'metrics', 'dashboard', 'analytics', 'visualization'],
      'mobile': ['mobile', 'android', 'ios', 'react native', 'flutter'],
      'documentation': ['guide', 'manual', 'documentation', 'tutorial', 'how-to'],
      'business': ['strategy', 'roadmap', 'requirements', 'planning', 'meeting'],
      'research': ['research', 'analysis', 'study', 'report', 'findings']
    };

    const lowerText = text.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    for (const [category, keywords] of Object.entries(techKeywords)) {
      const matches = keywords.filter(keyword => 
        lowerText.includes(keyword) || lowerFilename.includes(keyword)
      );
      if (matches.length > 0) {
        return category;
      }
    }

    return 'general';
  }

  // Get user's uploaded documents
  async getUserDocuments(userId: string) {
    return await prisma.document.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        filename: true,
        originalName: true,
        fileType: true,
        fileSize: true,
        processed: true,
        summary: true,
        createdAt: true
      }
    });
  }

  // Delete document and associated knowledge
  async deleteDocument(documentId: string, userId: string) {
    try {
      const document = await prisma.document.findFirst({
        where: { id: documentId, uploadedBy: userId }
      });

      if (!document) {
        throw new Error('Document not found or access denied');
      }

      // Delete file from disk
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      // Delete from knowledge base
      await prisma.knowledgeBase.deleteMany({
        where: { filePath: document.filePath }
      });

      // Delete document record
      await prisma.document.delete({
        where: { id: documentId }
      });

      return { success: true };
    } catch (error) {
      console.error('Document deletion error:', error);
      throw error;
    }
  }

  // Get document statistics
  async getDocumentStats() {
    const totalDocs = await prisma.document.count();
    const processedDocs = await prisma.document.count({
      where: { processed: true }
    });

    const sizeStats = await prisma.document.aggregate({
      _sum: { fileSize: true },
      _avg: { fileSize: true }
    });

    const typeStats = await prisma.document.groupBy({
      by: ['fileType'],
      _count: { id: true }
    });

    return {
      total: totalDocs,
      processed: processedDocs,
      totalSize: sizeStats._sum.fileSize || 0,
      averageSize: sizeStats._avg.fileSize || 0,
      byType: typeStats
    };
  }
}

export default new DocumentService();
