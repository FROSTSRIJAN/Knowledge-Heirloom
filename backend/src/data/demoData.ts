// Demo data for Knowledge Heirloom - works without database
export const demoUsers = [
  {
    id: "admin-demo-1",
    name: "Admin User",
    email: "admin@knowledgeheirloom.com",
    role: "ADMIN"
  },
  {
    id: "employee-demo-2", 
    name: "John Developer",
    email: "employee@knowledgeheirloom.com",
    role: "EMPLOYEE"
  },
  {
    id: "senior-demo-3",
    name: "Sarah Senior",
    email: "senior@knowledgeheirloom.com", 
    role: "SENIOR_DEV"
  }
];

export const demoKnowledge = [
  // Synthetic Company Knowledge
  {
    id: "kb-1",
    title: "Authentication System",
    content: "Our authentication system uses JWT tokens with refresh token rotation. Competitors like Slack use OAuth 2.0 with single sign-on integration. Key differentiator: We provide biometric authentication for mobile apps.",
    summary: "JWT-based auth with biometric support for mobile, differentiating from OAuth competitors.",
    category: "authentication",
    tags: ["jwt", "oauth", "biometric", "security"],
    keyWords: ["jwt", "oauth", "biometric", "security"],
    source: "synthetic",
    priority: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: "kb-2",
    title: "Real-time Messaging",
    content: "WebSocket implementation for instant messaging. Competitors: Discord uses voice channels, Teams has threading. Our advantage: Message encryption at rest and in transit with zero-knowledge architecture.",
    summary: "WebSocket messaging with zero-knowledge encryption, competing with Discord and Teams.",
    category: "messaging",
    tags: ["websocket", "realtime", "encryption", "messaging"],
    keyWords: ["websocket", "realtime", "encryption", "messaging"],
    source: "synthetic",
    priority: 4,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: "kb-3", 
    title: "Data Analytics Dashboard",
    content: "Interactive charts using D3.js and React. Competitors: Tableau has advanced filtering, PowerBI has Excel integration. Our strength: Real-time data streaming with custom alert system.",
    summary: "D3.js/React dashboards with real-time streaming, competing with Tableau and PowerBI.",
    category: "analytics",
    tags: ["d3js", "react", "dashboard", "realtime"],
    keyWords: ["d3js", "react", "dashboard", "realtime"],
    source: "synthetic", 
    priority: 3,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: "kb-4",
    title: "API Rate Limiting",
    content: "Redis-based rate limiting with sliding window algorithm. Competitors use fixed window. Our implementation: Dynamic rate adjustment based on user tier and historical usage patterns.",
    summary: "Redis sliding window rate limiting with dynamic adjustment by user tier.",
    category: "infrastructure",
    tags: ["redis", "ratelimit", "api", "infrastructure"],
    keyWords: ["redis", "ratelimit", "api", "infrastructure"],
    source: "synthetic",
    priority: 4,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: "kb-5",
    title: "File Upload System", 
    content: "Multi-part upload with resumable functionality. S3 integration with CDN. Competitors: Dropbox uses block-level sync, Google Drive has offline sync. Our feature: AI-powered duplicate detection.",
    summary: "S3 multi-part uploads with AI duplicate detection, competing with Dropbox and Drive.",
    category: "storage",
    tags: ["upload", "s3", "cdn", "ai"],
    keyWords: ["upload", "s3", "cdn", "ai"],
    source: "synthetic",
    priority: 3,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  // Kaggle-inspired Data
  {
    id: "kb-6",
    title: "Software Development Best Practices",
    content: "Code review processes improve software quality by 60%. Pair programming reduces bugs by 15% but increases development time by 25%. Automated testing coverage above 80% correlates with 40% fewer production issues.",
    summary: "Data-driven insights on code reviews, pair programming, and testing impact.",
    category: "development", 
    tags: ["code-review", "pair-programming", "testing", "best-practices"],
    keyWords: ["code-review", "pair-programming", "testing", "best-practices"],
    source: "kaggle",
    priority: 5,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: "kb-7",
    title: "Tech Industry Salary Trends 2024",
    content: "Full-stack developers: $95k-$150k. DevOps engineers: $100k-$160k. Data scientists: $110k-$170k. Remote work increases salary negotiation power by 20%. Startup equity averages 0.1-1.0%.",
    summary: "2024 salary data for tech roles with remote work and equity insights.",
    category: "industry",
    tags: ["salary", "trends", "remote", "equity"],
    keyWords: ["salary", "trends", "remote", "equity"],
    source: "kaggle",
    priority: 2,
    createdAt: new Date('2024-01-21'), 
    updatedAt: new Date('2024-01-21')
  },
  // HuggingFace-inspired Data
  {
    id: "kb-8",
    title: "Machine Learning Model Performance",
    content: "Transformer models achieve 95% accuracy on NLP tasks. CNN models excel at image classification with 98% accuracy. BERT variants dominate text understanding. GPT models lead in text generation quality.",
    summary: "Performance benchmarks for Transformers, CNNs, BERT, and GPT models.",
    category: "ml",
    tags: ["transformers", "cnn", "bert", "gpt"],
    keyWords: ["transformers", "cnn", "bert", "gpt"],
    source: "huggingface",
    priority: 4,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: "kb-9",
    title: "AI Ethics Guidelines",
    content: "Bias detection crucial in AI systems. Data privacy regulations impact ML deployment. Explainable AI required for healthcare applications. Model fairness testing prevents discrimination.",
    summary: "Essential AI ethics guidelines covering bias, privacy, explainability, and fairness.",
    category: "ethics",
    tags: ["bias", "privacy", "explainable-ai", "fairness"],
    keyWords: ["bias", "privacy", "explainable-ai", "fairness"],
    source: "huggingface",
    priority: 5,
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23')
  },
  // Web Scraping Data
  {
    id: "kb-10",
    title: "Latest Tech Trends 2024",
    content: "Edge computing growth 35% YoY. Quantum computing breakthroughs in IBM and Google labs. 5G adoption reaches 60% in urban areas. Web3 development frameworks mature rapidly.",
    summary: "2024 tech trends: edge computing, quantum breakthroughs, 5G adoption, Web3 maturity.",
    category: "trends",
    tags: ["edge-computing", "quantum", "5g", "web3"],
    keyWords: ["edge-computing", "quantum", "5g", "web3"], 
    source: "web-scraping",
    priority: 3,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  },
  // PDF Upload Examples
  {
    id: "kb-11",
    title: "Company Architecture Guide",
    content: "Microservices architecture with Docker containers. Kubernetes orchestration for scaling. Event-driven communication via Apache Kafka. Database per service pattern with eventual consistency.",
    summary: "Microservices guide covering Docker, Kubernetes, Kafka, and database patterns.",
    category: "architecture",
    tags: ["microservices", "docker", "kubernetes", "kafka"],
    keyWords: ["microservices", "docker", "kubernetes", "kafka"],
    source: "upload",
    fileType: ".pdf",
    fileSize: 2456789,
    priority: 4,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: "kb-12",
    title: "Security Best Practices",
    content: "HTTPS everywhere with certificate pinning. Input validation and sanitization. SQL injection prevention with parameterized queries. CSRF tokens for state-changing operations. Regular security audits and penetration testing.",
    summary: "Comprehensive security practices covering HTTPS, validation, SQL injection, and CSRF.",
    category: "security",
    tags: ["https", "validation", "sql-injection", "csrf"],
    keyWords: ["https", "validation", "sql-injection", "csrf"],
    source: "upload",
    fileType: ".pdf",
    fileSize: 1234567,
    priority: 5,
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  }
];

export const demoLegacyMessages = [
  {
    id: "legacy-1",
    title: "Welcome to the Team!",
    content: "Remember: Code is written for humans to read, not just machines. Always prioritize clarity over cleverness. Document your decisions, not just your code. The future you (and your teammates) will thank you!",
    category: "wisdom",
    isPublic: true,
    isSpecial: false,
    seniorDevName: "Sarah Senior",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: "legacy-2", 
    title: "Debugging Like a Pro",
    content: "When debugging: 1) Read the error message carefully, 2) Check your assumptions, 3) Use logging strategically, 4) Take breaks when stuck, 5) Explain the problem to someone else (rubber duck debugging works!)",
    category: "technical",
    isPublic: true,
    isSpecial: false,
    seniorDevName: "Sarah Senior",
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: "legacy-3",
    title: "Final Wisdom",
    content: "As I transition out, remember that technology changes but principles endure. Focus on problem-solving skills, continuous learning, and building great relationships with your team. You've got this! 🚀",
    category: "farewell",
    isPublic: true,
    isSpecial: true,
    seniorDevName: "Sarah Senior", 
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

export const demoDocuments = [
  {
    id: "doc-1",
    filename: "architecture-guide-20240125.pdf",
    originalName: "Company Architecture Guide.pdf", 
    fileType: ".pdf",
    fileSize: 2456789,
    mimeType: "application/pdf",
    processed: true,
    summary: "Microservices guide covering Docker, Kubernetes, Kafka, and database patterns.",
    uploadedBy: "admin-demo-1",
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: "doc-2",
    filename: "security-practices-20240126.pdf", 
    originalName: "Security Best Practices.pdf",
    fileType: ".pdf",
    fileSize: 1234567,
    mimeType: "application/pdf",
    processed: true,
    summary: "Comprehensive security practices covering HTTPS, validation, SQL injection, and CSRF.",
    uploadedBy: "senior-demo-3",
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  }
];

export const demoStats = {
  totalEntries: demoKnowledge.length,
  sources: [
    { source: 'synthetic', count: 5 },
    { source: 'kaggle', count: 2 },
    { source: 'huggingface', count: 2 },
    { source: 'web-scraping', count: 1 },
    { source: 'upload', count: 2 }
  ],
  categories: [
    { category: 'authentication', count: 1 },
    { category: 'messaging', count: 1 },
    { category: 'analytics', count: 1 },
    { category: 'infrastructure', count: 1 },
    { category: 'storage', count: 1 },
    { category: 'development', count: 1 },
    { category: 'industry', count: 1 },
    { category: 'ml', count: 1 },
    { category: 'ethics', count: 1 },
    { category: 'trends', count: 1 },
    { category: 'architecture', count: 1 },
    { category: 'security', count: 1 }
  ]
};
