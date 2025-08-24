import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatasetService {
  private readonly baseDir = path.join(__dirname, '../../datasets');

  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.baseDir,
      path.join(this.baseDir, 'kaggle'),
      path.join(this.baseDir, 'huggingface'),
      path.join(this.baseDir, 'synthetic'),
      path.join(this.baseDir, 'processed')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Synthetic Dataset Generation
  async generateSyntheticDataset() {
    const syntheticData = [
      // Company Features & Competitor Analysis
      {
        title: "Authentication System",
        content: "Our authentication system uses JWT tokens with refresh token rotation. Competitors like Slack use OAuth 2.0 with single sign-on integration. Key differentiator: We provide biometric authentication for mobile apps.",
        category: "authentication",
        tags: ["jwt", "oauth", "biometric", "security"],
        source: "synthetic"
      },
      {
        title: "Real-time Messaging",
        content: "WebSocket implementation for instant messaging. Competitors: Discord uses voice channels, Teams has threading. Our advantage: Message encryption at rest and in transit with zero-knowledge architecture.",
        category: "messaging",
        tags: ["websocket", "realtime", "encryption", "messaging"],
        source: "synthetic"
      },
      {
        title: "Data Analytics Dashboard",
        content: "Interactive charts using D3.js and React. Competitors: Tableau has advanced filtering, PowerBI has Excel integration. Our strength: Real-time data streaming with custom alert system.",
        category: "analytics",
        tags: ["d3js", "react", "dashboard", "realtime"],
        source: "synthetic"
      },
      {
        title: "API Rate Limiting",
        content: "Redis-based rate limiting with sliding window algorithm. Competitors use fixed window. Our implementation: Dynamic rate adjustment based on user tier and historical usage patterns.",
        category: "infrastructure",
        tags: ["redis", "ratelimit", "api", "infrastructure"],
        source: "synthetic"
      },
      {
        title: "File Upload System",
        content: "Multi-part upload with resumable functionality. S3 integration with CDN. Competitors: Dropbox uses block-level sync, Google Drive has offline sync. Our feature: AI-powered duplicate detection.",
        category: "storage",
        tags: ["upload", "s3", "cdn", "ai"],
        source: "synthetic"
      },
      {
        title: "Search Functionality",
        content: "Elasticsearch with custom scoring. Full-text search with faceted filtering. Competitors: Algolia has typo tolerance, Solr has complex queries. Our advantage: ML-powered result ranking.",
        category: "search",
        tags: ["elasticsearch", "fulltext", "ml", "ranking"],
        source: "synthetic"
      },
      {
        title: "Payment Processing",
        content: "Stripe integration with subscription management. Competitors: PayPal has buyer protection, Square has in-person payments. Our differentiator: Cryptocurrency payment support.",
        category: "payments",
        tags: ["stripe", "subscription", "crypto", "payments"],
        source: "synthetic"
      },
      {
        title: "Mobile App Architecture",
        content: "React Native with CodePush for OTA updates. Competitors: Flutter has single codebase, native apps have platform optimization. Our strength: Hybrid approach with native modules.",
        category: "mobile",
        tags: ["react-native", "codepush", "hybrid", "mobile"],
        source: "synthetic"
      },
      {
        title: "Database Optimization",
        content: "PostgreSQL with read replicas and connection pooling. Competitors: MySQL has widespread support, MongoDB has flexible schema. Our approach: Time-series data partitioning.",
        category: "database",
        tags: ["postgresql", "optimization", "replica", "partitioning"],
        source: "synthetic"
      },
      {
        title: "CI/CD Pipeline",
        content: "GitHub Actions with Docker containerization. Automated testing and deployment. Competitors: Jenkins has plugins, GitLab has integrated DevOps. Our feature: Progressive deployment with automatic rollback.",
        category: "devops",
        tags: ["github-actions", "docker", "cicd", "automation"],
        source: "synthetic"
      }
    ];

    // Save synthetic data to database
    for (const item of syntheticData) {
      await prisma.knowledgeBase.create({
        data: {
          title: item.title,
          content: item.content,
          category: item.category,
          tags: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
          source: item.source,
          keyWords: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
          summary: this.generateSummary(item.content)
        }
      });
    }

    // Create dataset record
    const dataset = await prisma.dataset.create({
      data: {
        name: "Synthetic Company Knowledge",
        description: "AI-generated competitor analysis and feature documentation",
        source: "synthetic",
        dataType: "json",
        recordCount: syntheticData.length,
        processed: true,
        processedAt: new Date()
      }
    });

    return { success: true, recordsCreated: syntheticData.length, datasetId: dataset.id };
  }

  // Kaggle Dataset Integration
  async fetchKaggleDataset(datasetName: string, apiKey?: string) {
    try {
      // For demo purposes, we'll simulate Kaggle API
      // In production, use actual Kaggle API with authentication
      
      const mockKaggleData = [
        {
          title: "Software Development Best Practices",
          content: "Code review processes improve software quality by 60%. Pair programming reduces bugs by 15% but increases development time by 25%. Automated testing coverage above 80% correlates with 40% fewer production issues.",
          category: "development",
          tags: ["code-review", "pair-programming", "testing", "best-practices"],
          source: "kaggle"
        },
        {
          title: "Tech Industry Salary Trends 2024",
          content: "Full-stack developers: $95k-$150k. DevOps engineers: $100k-$160k. Data scientists: $110k-$170k. Remote work increases salary negotiation power by 20%. Startup equity averages 0.1-1.0%.",
          category: "industry",
          tags: ["salary", "trends", "remote", "equity"],
          source: "kaggle"
        },
        {
          title: "API Design Patterns",
          content: "REST APIs dominate 70% of web services. GraphQL growing 25% yearly. gRPC preferred for microservices. Rate limiting essential for 99.9% uptime. Versioning strategies: URL path vs header-based.",
          category: "api",
          tags: ["rest", "graphql", "grpc", "versioning"],
          source: "kaggle"
        }
      ];

      // Save to database
      for (const item of mockKaggleData) {
        await prisma.knowledgeBase.create({
          data: {
            title: item.title,
            content: item.content,
            category: item.category,
            tags: JSON.stringify(["kaggle", "dataset"]),
            source: item.source,
            keyWords: JSON.stringify(["kaggle", "dataset", "analysis"]),
            summary: this.generateSummary(item.content)
          }
        });
      }

      const dataset = await prisma.dataset.create({
        data: {
          name: `Kaggle Dataset: ${datasetName}`,
          description: "Tech industry insights from Kaggle datasets",
          source: "kaggle",
          dataType: "csv",
          recordCount: mockKaggleData.length,
          processed: true,
          processedAt: new Date()
        }
      });

      return { success: true, recordsCreated: mockKaggleData.length, datasetId: dataset.id };
    } catch (error) {
      console.error('Kaggle dataset fetch error:', error);
      throw new Error('Failed to fetch Kaggle dataset');
    }
  }

  // HuggingFace Dataset Integration
  async fetchHuggingFaceDataset(datasetName: string) {
    try {
      // Mock HuggingFace data - in production, use @huggingface/hub
      const mockHFData = [
        {
          title: "Machine Learning Model Performance",
          content: "Transformer models achieve 95% accuracy on NLP tasks. CNN models excel at image classification with 98% accuracy. BERT variants dominate text understanding. GPT models lead in text generation quality.",
          category: "ml",
          tags: ["transformers", "cnn", "bert", "gpt"],
          source: "huggingface"
        },
        {
          title: "AI Ethics Guidelines",
          content: "Bias detection crucial in AI systems. Data privacy regulations impact ML deployment. Explainable AI required for healthcare applications. Model fairness testing prevents discrimination.",
          category: "ethics",
          tags: ["bias", "privacy", "explainable-ai", "fairness"],
          source: "huggingface"
        },
        {
          title: "Open Source AI Tools",
          content: "TensorFlow dominates production ML. PyTorch preferred for research. Hugging Face transformers library has 100k+ stars. MLflow for experiment tracking. Weights & Biases for visualization.",
          category: "tools",
          tags: ["tensorflow", "pytorch", "mlflow", "wandb"],
          source: "huggingface"
        }
      ];

      for (const item of mockHFData) {
        await prisma.knowledgeBase.create({
          data: {
            title: item.title,
            content: item.content,
            category: item.category,
            tags: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
            source: item.source,
            keyWords: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
            summary: this.generateSummary(item.content)
          }
        });
      }

      const dataset = await prisma.dataset.create({
        data: {
          name: `HuggingFace Dataset: ${datasetName}`,
          description: "AI and ML insights from HuggingFace community",
          source: "huggingface",
          dataType: "json",
          recordCount: mockHFData.length,
          processed: true,
          processedAt: new Date()
        }
      });

      return { success: true, recordsCreated: mockHFData.length, datasetId: dataset.id };
    } catch (error) {
      console.error('HuggingFace dataset fetch error:', error);
      throw new Error('Failed to fetch HuggingFace dataset');
    }
  }

  // Web Scraping for Tech News/Articles
  async scrapeWebData(urls: string[]) {
    try {
      const scrapedData = [];
      
      // Mock scraping data (in production, use cheerio with actual URLs)
      const mockScrapedData = [
        {
          title: "Latest Tech Trends 2024",
          content: "Edge computing growth 35% YoY. Quantum computing breakthroughs in IBM and Google labs. 5G adoption reaches 60% in urban areas. Web3 development frameworks mature rapidly.",
          category: "trends",
          tags: ["edge-computing", "quantum", "5g", "web3"],
          source: "web-scraping",
          url: "https://example.com/tech-trends"
        },
        {
          title: "Startup Funding Landscape",
          content: "AI startups raise $15B in Q1 2024. SaaS valuations stabilize at 8x revenue. Deep tech funding increases 40%. Corporate VCs more active in Series A rounds.",
          category: "funding",
          tags: ["ai-startups", "saas", "deep-tech", "corporate-vc"],
          source: "web-scraping",
          url: "https://example.com/funding-news"
        }
      ];

      for (const item of mockScrapedData) {
        await prisma.knowledgeBase.create({
          data: {
            title: item.title,
            content: item.content,
            category: item.category,
            tags: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
            source: item.source,
            keyWords: JSON.stringify(Array.isArray(item.tags) ? item.tags : [item.tags || 'general']),
            summary: this.generateSummary(item.content)
          }
        });
        scrapedData.push(item);
      }

      return { success: true, recordsCreated: scrapedData.length, data: scrapedData };
    } catch (error) {
      console.error('Web scraping error:', error);
      throw new Error('Failed to scrape web data');
    }
  }

  // Initialize all datasets
  async initializeAllDatasets() {
    try {
      console.log('🚀 Initializing all datasets...');
      
      const results = await Promise.all([
        this.generateSyntheticDataset(),
        this.fetchKaggleDataset('tech-industry-insights'),
        this.fetchHuggingFaceDataset('ai-ml-knowledge'),
        this.scrapeWebData(['https://example.com/tech-news'])
      ]);

      const totalRecords = results.reduce((sum, result) => sum + result.recordsCreated, 0);
      
      console.log(`✅ Successfully initialized ${totalRecords} knowledge base entries`);
      return {
        success: true,
        totalRecords,
        datasets: results
      };
    } catch (error) {
      console.error('Dataset initialization error:', error);
      throw error;
    }
  }

  private generateSummary(content: string): string {
    // Simple extractive summarization
    const sentences = content.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');
  }

  // Get dataset statistics
  async getDatasetStats() {
    const stats = await prisma.dataset.groupBy({
      by: ['source'],
      _count: { id: true },
      _sum: { recordCount: true }
    });

    const knowledgeStats = await prisma.knowledgeBase.groupBy({
      by: ['source', 'category'],
      _count: { id: true }
    });

    return {
      datasets: stats,
      knowledgeBase: knowledgeStats,
      totalEntries: await prisma.knowledgeBase.count()
    };
  }
}

export default new DatasetService();
