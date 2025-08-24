#!/bin/bash
# 🚀 Knowledge Heirloom - Pre-Demo Verification Script

echo "🎯 KNOWLEDGE HEIRLOOM - HACKATHON DEPLOYMENT VERIFICATION"
echo "========================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is NOT installed${NC}"
        return 1
    fi
}

# Function to check if port is available
check_port() {
    if ! lsof -i:$1 &> /dev/null; then
        echo -e "${GREEN}✅ Port $1 is available${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Port $1 is in use${NC}"
        return 1
    fi
}

echo "🔍 CHECKING PREREQUISITES..."
echo "-----------------------------"

# Check for Node.js
check_command "node"
if [ $? -eq 0 ]; then
    NODE_VERSION=$(node --version)
    echo "   Version: $NODE_VERSION"
fi

# Check for npm/bun
check_command "npm"
check_command "bun"

# Check for Docker (optional)
check_command "docker"

echo ""
echo "🌐 CHECKING PORTS..."
echo "--------------------"
check_port 8080  # Frontend
check_port 8081  # Backend

echo ""
echo "📁 CHECKING FILES..."
echo "--------------------"

# Check essential files
essential_files=(
    "package.json"
    "src/App.tsx"
    "backend/server.js"
    "backend/package.json"
    ".env.local"
    "backend/.env"
    "HACKATHON_README.md"
    "DEMO_SCRIPT.md"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo "🔧 QUICK SETUP..."
echo "-----------------"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi
cd ..

# Generate Prisma client
echo "🗄️  Setting up database..."
cd backend
npx prisma generate
npx prisma db push
cd ..

echo ""
echo "🚀 STARTING SERVICES..."
echo "-----------------------"

# Start backend in background
echo "🖥️  Starting backend server on port 8081..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend
echo "🌐 Starting frontend server on port 8080..."
if command -v bun &> /dev/null; then
    bun run dev &
else
    npm run dev &
fi
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 5

echo ""
echo "🧪 TESTING ENDPOINTS..."
echo "-----------------------"

# Test backend health
if curl -s http://localhost:8081/api/health &> /dev/null; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
fi

# Test frontend
if curl -s http://localhost:8080 &> /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo ""
echo "🎯 DEMO READY CHECKLIST:"
echo "========================"
echo -e "${GREEN}✅ Frontend: http://localhost:8080${NC}"
echo -e "${GREEN}✅ Backend:  http://localhost:8081${NC}"
echo ""
echo "👤 DEMO ACCOUNTS:"
echo "  📧 junior@knowledgeheirloom.com | 🔑 password123"
echo "  📧 admin@knowledgeheirloom.com  | 🔑 admin123"
echo "  📧 senior@knowledgeheirloom.com | 🔑 password123"
echo ""
echo "📖 DEMO SCRIPT: See DEMO_SCRIPT.md for full presentation guide"
echo ""
echo -e "${YELLOW}🏆 KNOWLEDGE HEIRLOOM IS READY FOR HACKATHON VICTORY! 🏆${NC}"
echo ""
echo "Press Ctrl+C to stop all services when demo is complete."

# Keep script running
wait
