# 🎁 Knowledge Heirloom - Backend

> A gift from a senior developer to the next generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (or use Supabase)
- OpenAI API key (optional for AI features)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set up database**
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Run migrations
   npm run migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3001`

## 🗄️ Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `knowledge_heirloom`
3. Update `DATABASE_URL` in `.env`

### Option 2: Supabase (Recommended)
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string to `DATABASE_URL` in `.env`
4. Run migrations: `npm run migrate`

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/knowledge_heirloom"

# JWT Authentication
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"

# OpenAI (for AI assistant features)
OPENAI_API_KEY="sk-your-openai-key"
OPENAI_MODEL="gpt-3.5-turbo"

# Server Configuration
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:8080"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Conversations (AI Chat)
- `GET /api/conversations` - Get user conversations
- `GET /api/conversations/:id` - Get specific conversation
- `POST /api/conversations/start` - Start new conversation
- `POST /api/conversations/:id/message` - Send message

### Legacy Messages (The Gift Feature 🎁)
- `GET /api/legacy` - Get legacy messages
- `GET /api/legacy/daily-wisdom` - Get daily wisdom
- `POST /api/legacy` - Create legacy message (Senior Dev only)
- `PUT /api/legacy/:id` - Update legacy message
- `DELETE /api/legacy/:id` - Delete legacy message

### Analytics
- `GET /api/analytics/dashboard` - Analytics dashboard
- `GET /api/analytics/ai-usage` - AI usage statistics
- `GET /api/analytics/conversations` - Conversation stats

### Knowledge Base
- `GET /api/knowledge` - Search knowledge base
- `POST /api/knowledge` - Create knowledge entry (Admin only)

## 🛠️ Development

### Project Structure
```
backend/
├── src/
│   ├── app.ts              # Main Express application
│   ├── routes/             # API route handlers
│   │   ├── auth.ts
│   │   ├── conversations.ts
│   │   ├── legacy.ts
│   │   ├── analytics.ts
│   │   └── knowledge.ts
│   ├── services/           # Business logic
│   │   └── aiService.ts    # OpenAI integration
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # JWT authentication
│   │   └── errorHandler.ts # Error handling
│   └── utils/              # Utility functions
│       └── logger.ts       # Winston logging
├── prisma/                 # Database schema & migrations
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

### User Roles
- **EMPLOYEE** - Regular users who can chat with AI and view legacy messages
- **SENIOR_DEV** - Can create legacy messages and access special features  
- **ADMIN** - Full system access and analytics

### Database Schema
The system uses the following main entities:
- **Users** - User accounts with roles
- **Conversations** - Chat sessions
- **Messages** - Individual chat messages
- **LegacyMessages** - Special farewell messages from senior developers
- **Analytics** - Usage tracking and statistics
- **KnowledgeBase** - Searchable knowledge entries

## 🎯 Special Features

### 1. AI Assistant
- Powered by OpenAI GPT models
- Context-aware responses based on user role
- Conversation history tracking
- Token usage monitoring

### 2. Legacy Messages System 🎁
The heart of the "gift" concept:
- Senior developers can leave farewell messages
- AI-generated legacy content
- Daily wisdom for employees
- Special occasion messages

### 3. Analytics Dashboard
- User engagement tracking
- AI usage statistics  
- Conversation analytics
- Legacy message engagement

## 🚢 Deployment

### Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Other Options
- **Render** - Similar to Railway, good PostgreSQL support
- **Vercel** - For serverless deployment (requires some modifications)
- **DigitalOcean App Platform** - Full control with managed database

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run build

# Database operations
npm run migrate      # Run migrations
npm run generate     # Generate Prisma client
npm run studio       # Open Prisma Studio
```

## 🏆 Hackathon Notes

This project is designed for easy setup and impressive demos:

1. **Fast Setup**: Uses modern tools for quick development
2. **Impressive Features**: AI integration + unique "gift" concept
3. **Scalable**: Built with production-ready practices
4. **Demo-Friendly**: Rich APIs for frontend integration

### Demo Flow Suggestions:
1. Show user registration with different roles
2. Demonstrate AI conversations with context awareness
3. Highlight the legacy messages feature (the emotional hook!)
4. Display analytics dashboard
5. Show different user experiences by role

---

**Built with ❤️ for the next generation of developers**

*"The best code is not just functional, but meaningful. This project is our gift to those who will build tomorrow's solutions."*
