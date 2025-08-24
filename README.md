# 🎁 Knowledge Heirloom

> *"A gift from a senior developer to the next generation"*

Knowledge Heirloom is an AI-powered internal documentation and competitor feature tracking bot designed for hackathons and startup teams. Built with modern technologies, it serves as a comprehensive knowledge management system that helps teams preserve institutional knowledge, track competitor features, and provide intelligent assistance to employees.

## 🚀 Features

### Core Features
- **🤖 Intelligent AI Chat**: Powered by OpenAI GPT models with context-aware responses
- **📚 Knowledge Base Management**: Comprehensive system for storing and retrieving company knowledge
- **🔍 Advanced Search**: Multi-faceted search with filters for categories, sources, and tags
- **👥 Role-Based Access**: Admin, Senior Developer, and Employee roles with appropriate permissions
- **💬 Legacy Messages**: Special "gifts" from departing senior developers to preserve wisdom

### Dataset Integration & Processing
- **📊 Multi-Source Data Ingestion**:
  - **Synthetic Dataset**: AI-generated company knowledge and competitor analysis
  - **Kaggle Integration**: Tech industry insights and best practices
  - **HuggingFace Integration**: AI/ML knowledge and model information
  - **Web Scraping**: Latest tech trends and industry news
  
- **📁 Document Upload & Processing**:
  - **PDF Text Extraction**: Automatic content extraction from uploaded PDFs
  - **Multi-Format Support**: PDF, TXT, MD, DOCX file processing
  - **AI Summarization**: Automatic summary generation for uploaded documents
  - **Keyword Extraction**: Intelligent tag and keyword identification
  - **Category Classification**: Automatic document categorization

- **🎯 Smart Knowledge Management**:
  - **Vector Embeddings**: Semantic search capabilities (ready for implementation)
  - **Priority Ranking**: Smart content prioritization system
  - **Source Tracking**: Complete lineage tracking for all knowledge entries
  - **Processing Pipeline**: Automated workflow for document ingestion and processing

### Analytics & Insights
- **📈 Usage Analytics**: Track queries, response times, and user engagement
- **📊 Dataset Statistics**: Comprehensive statistics on knowledge sources and categories
- **👤 User Analytics**: Individual and team-level usage insights
- **🎨 Interactive Dashboards**: Visual representation of data distribution and usage patterns

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Query** for state management
- **Lucide React** icons

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT Authentication** with role-based access
- **Multer** for file uploads
- **PDF-Parse** for document processing
- **Winston** logging

### AI & Data Processing
- **OpenAI API** integration
- **Custom Dataset Services** for multi-source data ingestion
- **Document Processing Pipeline** for file analysis
- **Smart Categorization** and keyword extraction

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (optional - demo mode available)

### 1. Clone and Setup
```bash
git clone https://github.com/your-username/knowledge-heirloom.git
cd knowledge-heirloom

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Configuration
```bash
# Backend configuration
cd backend
cp .env.example .env

# Update .env with your settings:
# - DATABASE_URL (optional for demo)
# - OPENAI_API_KEY (for AI features)
# - JWT_SECRET (for authentication)
```

### 3. Run the Application
```bash
# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd ..
npm run dev
```

Visit:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8081
- **Knowledge Base Demo**: http://localhost:8081/api/demo/knowledge

## 🎯 Demo Features

Experience all features instantly with our demo mode:

1. **Browse Knowledge Base**: Explore pre-loaded datasets from multiple sources
2. **Upload Documents**: Try PDF processing and text extraction (simulated)
3. **View Analytics**: See dataset distribution and usage statistics
4. **Initialize Datasets**: Watch real-time dataset loading simulation
5. **Advanced Search**: Use filters and categories to find specific knowledge

## 📊 Dataset Sources

### 1. Synthetic Data
- Company feature comparisons
- Technical architecture insights
- Development best practices
- Competitive analysis

### 2. Kaggle Integration (Demo)
- Industry salary trends
- Software development metrics
- Technology adoption rates

### 3. HuggingFace Integration (Demo)
- AI/ML model performance data
- Ethics guidelines
- Open source tool insights

### 4. Web Scraping (Demo)
- Latest tech trends
- Funding landscape news
- Industry developments

### 5. Document Upload
- PDF text extraction
- Multi-format support
- Automatic summarization
- Smart categorization

## 📚 API Endpoints

### Demo Knowledge Base (Working without DB)
- `GET /api/demo/knowledge` - Browse knowledge entries
- `POST /api/demo/knowledge/search` - Advanced search
- `POST /api/demo/knowledge/datasets/initialize` - Initialize datasets
- `POST /api/demo/knowledge/upload` - Upload documents (simulated)
- `GET /api/demo/knowledge/metadata` - Get categories and sources
- `GET /api/demo/knowledge/datasets/stats` - Dataset statistics

### Full API (Requires Database)
- `GET /api/knowledge` - Full knowledge management
- `POST /api/auth/login` - Authentication
- `GET /api/legacy` - Legacy messages
- `GET /api/analytics` - Usage analytics

## 🏆 Perfect for Hackathons

- **5-Minute Setup**: Get running quickly with demo data
- **Impressive Demo**: Full-featured knowledge management system
- **No Database Required**: Demo mode works out of the box
- **Modern UI**: Professional interface that impresses judges
- **Real-World Problem**: Solves actual business needs

## 🔒 Security Features

- JWT Authentication with role-based access
- File upload validation and restrictions  
- Input sanitization and validation
- Rate limiting and CORS protection
- Secure headers and environment protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - Built for the developer community

---

**Made with ❤️ for hackathons and startups**

Simply visit the [Lovable Project](https://lovable.dev/projects/ef273fab-8a0e-42e0-9642-8b1dec3e5d9f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ef273fab-8a0e-42e0-9642-8b1dec3e5d9f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
