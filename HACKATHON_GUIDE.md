# 🎁 Knowledge Heirloom - AI Agent Project

> **A gift from a senior developer to the next generation**

This is your complete AI Agent system built for the hackathon! It features a React frontend with an intelligent Node.js backend that includes AI assistance and a unique "legacy messages" feature.

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+
- PostgreSQL (or Supabase account - recommended)
- OpenAI API key (optional, has fallbacks)

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and OpenAI key

# For quick setup with Supabase:
# 1. Go to https://supabase.com and create a free project
# 2. Copy the DATABASE_URL to your .env file
# 3. The format is: postgresql://postgres.xxx:password@xxx.supabase.co:5432/postgres

# Generate Prisma client and run migrations
npm run generate
npm run migrate

# Seed the database with demo data
npm run seed

# Start backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# In the root directory (where you already ran the frontend)
npm run dev
```

The frontend will run on `http://localhost:8080`

## 🎯 Demo Accounts (Ready to Use!)

After running the seed script, you'll have these demo accounts:

| Role | Email | Password | Description |
|------|--------|----------|-------------|
| 👩‍💻 Senior Developer | `senior@knowledgeheirloom.com` | `password123` | Can create legacy messages |
| 👨‍💼 Admin | `admin@knowledgeheirloom.com` | `password123` | Full system access |
| 🧑‍💻 Employee | `junior@knowledgeheirloom.com` | `password123` | Regular user experience |
| 👩‍🔬 Employee | `dev@knowledgeheirloom.com` | `password123` | Another regular user |

## 🎭 Hackathon Demo Flow

### 1. The "Gift" Story
- Explain that a senior developer is retiring and wants to leave knowledge for the team
- The AI assistant contains their wisdom and experience
- Legacy messages are like personalized farewell notes

### 2. Show Different User Experiences

**As an Employee** (`junior@knowledgeheirloom.com`):
- Chat with the AI assistant
- Get personalized responses based on role
- Access daily wisdom messages
- See legacy messages from senior developer

**As Senior Developer** (`senior@knowledgeheirloom.com`):
- Create new legacy messages
- Use AI to generate farewell content
- View analytics of system usage

**As Admin** (`admin@knowledgeheirloom.com`):
- Access system-wide analytics
- Manage users and content
- View engagement statistics

### 3. Key Features to Highlight

✨ **AI-Powered Assistance**
- Context-aware responses
- Role-based personalization
- Conversation history

🎁 **Legacy Messages System**
- Emotional hook for the judges
- Daily wisdom feature
- AI-generated content option

📊 **Analytics Dashboard**
- User engagement tracking
- AI usage statistics
- Knowledge sharing metrics

## 🛠️ Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React
- **UI**: Tailwind CSS + ShadCN UI
- **State**: React Query for API calls
- **Styling**: Modern glassmorphism theme

### Backend (Node.js + Express)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-3.5-turbo integration
- **Auth**: JWT-based authentication
- **Logging**: Winston for structured logging

### Database Schema
- **Users** with role-based access
- **Conversations** and **Messages** for AI chat
- **LegacyMessages** for the gift feature
- **Analytics** for usage tracking
- **KnowledgeBase** for searchable content

## 🌟 What Makes This Special

### 1. Emotional Hook
The "legacy messages" concept creates an emotional connection with judges. It's not just a technical demo - it's about human connection and knowledge transfer.

### 2. Role-Based AI
The AI assistant adapts its responses based on user roles:
- Different personalities for employees vs admins
- Contextual legacy wisdom for junior developers
- Administrative insights for system managers

### 3. Real-World Applicability
This isn't just a demo - it's a genuine solution for:
- Knowledge management in organizations
- Onboarding new team members
- Preserving institutional knowledge
- Mentorship at scale

### 4. Technical Excellence
- Production-ready code structure
- Comprehensive error handling
- Security best practices
- Scalable architecture

## 🚀 Deployment Options

### Quick Deploy (Recommended for Hackathon)

**Frontend**: Vercel
```bash
# Push to GitHub, then connect to Vercel
npx vercel --prod
```

**Backend**: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

**Database**: Supabase (free tier includes PostgreSQL)

### Alternative Options
- **Backend**: Render, Heroku, or DigitalOcean
- **Database**: Railway Postgres, Neon, or local PostgreSQL
- **Frontend**: Netlify, Surge, or GitHub Pages

## 📝 API Documentation

### Authentication Endpoints
```
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login user
GET  /api/auth/me        # Get current user
```

### AI Conversation Endpoints
```
GET  /api/conversations           # Get user conversations
POST /api/conversations/start     # Start new conversation
POST /api/conversations/:id/message  # Send message to AI
```

### Legacy Messages (The Gift Feature)
```
GET  /api/legacy                  # Get legacy messages
GET  /api/legacy/daily-wisdom     # Get daily wisdom
POST /api/legacy                  # Create legacy message (Senior Dev)
```

### Analytics & Admin
```
GET /api/analytics/dashboard      # Analytics dashboard
GET /api/analytics/ai-usage       # AI usage statistics
GET /api/knowledge               # Search knowledge base
```

## 🏆 Hackathon Tips

### For the Pitch (5 minutes)
1. **Hook** (30 seconds): "What if retiring developers could leave their wisdom for the next generation?"
2. **Problem** (60 seconds): Knowledge loss when senior people leave
3. **Solution** (90 seconds): AI assistant + legacy message system
4. **Demo** (120 seconds): Show different user experiences
5. **Impact** (30 seconds): Real-world applications and scalability

### For the Demo
- Start with the emotional story (senior developer retiring)
- Show the AI assistant responding differently to different roles
- Highlight the legacy messages as the unique differentiator
- End with the analytics showing real engagement

### Technical Talking Points
- Modern, production-ready architecture
- AI integration with context awareness
- Role-based access control
- Real-time conversation handling
- Comprehensive analytics

## 🎯 Winning Strategy

1. **Emotional Connection**: The "gift" concept resonates with judges
2. **Technical Merit**: Solid architecture and AI integration
3. **Real-World Value**: Solves actual organizational problems
4. **Unique Differentiator**: Legacy messages system is memorable
5. **Complete Solution**: Full-stack implementation with deployment ready

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**:
- Check your DATABASE_URL in .env
- Make sure PostgreSQL is running
- Try using Supabase for cloud database

**OpenAI API Issues**:
- The system works without OpenAI (has fallbacks)
- Check your OPENAI_API_KEY in backend/.env
- Make sure you have credits in your OpenAI account

**CORS Issues**:
- Check FRONTEND_URL in backend/.env matches your frontend URL
- Default should be http://localhost:8080

### Need Help?
- Check the backend README.md for detailed setup
- Review the API responses in browser dev tools
- Check backend logs for error details

---

## 💝 The Gift Philosophy

*"The best code isn't just functional—it's meaningful. This project represents more than just technology; it's about preserving wisdom, fostering growth, and ensuring that the knowledge gained through years of experience doesn't retire with the people who gained it."*

**Good luck with your hackathon! You've got this! 🚀**
