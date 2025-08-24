// Knowledge Heirloom API Service with Dataset and Upload features
import { API_BASE_URL } from './config';

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  keyWords: string[];
  source: string;
  priority: number;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  category?: string[];
  source?: string[];
  tags?: string[];
}

export interface SearchRequest {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  processed: boolean;
  summary?: string;
  createdAt: Date;
}

export interface DatasetStats {
  totalEntries: number;
  sources: { source: string; count: number }[];
  categories: { category: string; count: number }[];
}

class KnowledgeService {
  private baseUrl = `${API_BASE_URL}/api/demo/knowledge`; // Using demo endpoints

  // Get knowledge entries with pagination and filtering
  async getKnowledge(params: {
    search?: string;
    category?: string;
    source?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    knowledge: KnowledgeEntry[];
    totalCount: number;
    pagination: any;
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch knowledge entries');
    
    const data = await response.json();
    return {
      knowledge: data.knowledge,
      totalCount: data.totalCount,
      pagination: data.pagination
    };
  }

  // Get single knowledge entry
  async getKnowledgeEntry(id: string): Promise<KnowledgeEntry> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch knowledge entry');
    
    const data = await response.json();
    return data.knowledge;
  }

  // Advanced search with filters
  async searchKnowledge(request: SearchRequest): Promise<{
    results: KnowledgeEntry[];
    totalCount: number;
    pagination: any;
  }> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error('Search failed');
    
    return await response.json();
  }

  // Get dataset statistics
  async getDatasetStats(): Promise<DatasetStats> {
    const response = await fetch(`${this.baseUrl}/datasets/stats`);
    if (!response.ok) throw new Error('Failed to fetch dataset stats');
    
    const data = await response.json();
    return data.data;
  }

  // Initialize all datasets
  async initializeDatasets(): Promise<{
    success: boolean;
    message: string;
    totalRecords: number;
  }> {
    const response = await fetch(`${this.baseUrl}/datasets/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Dataset initialization failed');
    
    return await response.json();
  }

  // Upload document (PDF, TXT, etc.)
  async uploadDocument(file: File): Promise<{
    success: boolean;
    message: string;
    document: any;
    extractedText: string;
    summary: string;
  }> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('File upload failed');
    
    return await response.json();
  }

  // Get user's uploaded documents
  async getUserDocuments(): Promise<UploadedDocument[]> {
    const response = await fetch(`${this.baseUrl}/documents/my`);
    if (!response.ok) throw new Error('Failed to fetch user documents');
    
    const data = await response.json();
    return data.documents;
  }

  // Get document statistics
  async getDocumentStats(): Promise<{
    total: number;
    processed: number;
    totalSize: number;
    averageSize: number;
    byType: any[];
  }> {
    const response = await fetch(`${this.baseUrl}/documents/stats`);
    if (!response.ok) throw new Error('Failed to fetch document stats');
    
    const data = await response.json();
    return data.data;
  }

  // Get metadata (categories and sources)
  async getMetadata(): Promise<{
    categories: { name: string; count: number }[];
    sources: { name: string; count: number }[];
  }> {
    const response = await fetch(`${this.baseUrl}/metadata`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    
    const data = await response.json();
    return data.metadata;
  }

  // Get legacy messages
  async getLegacyMessages(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/legacy`);
    if (!response.ok) throw new Error('Failed to fetch legacy messages');
    
    const data = await response.json();
    return data.messages;
  }
}

export const knowledgeService = new KnowledgeService();
export default knowledgeService;
