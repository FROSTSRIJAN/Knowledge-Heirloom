#!/bin/bash

echo "🚀 Knowledge Heirloom - Production Deployment Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Starting deployment process..."

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
if [ $? -eq 0 ]; then
    print_success "Prisma client generated"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Build backend
print_status "Building backend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Backend built successfully"
else
    print_error "Failed to build backend"
    exit 1
fi

# Setup database
print_status "Setting up database..."
npm run setup
if [ $? -eq 0 ]; then
    print_success "Database setup completed"
else
    print_warning "Database setup had some issues, but continuing..."
fi

# Go back to root directory
cd ..

# Build frontend
print_status "Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

print_success "🎉 Deployment build completed successfully!"
print_status "Next steps:"
echo "1. Configure your production environment variables"
echo "2. Deploy the backend (./backend) to your server"
echo "3. Deploy the frontend (./dist) to your static hosting"
echo "4. Update CORS and API URLs in production environment"

print_success "Your Knowledge Heirloom app is ready for production! 🚀"
