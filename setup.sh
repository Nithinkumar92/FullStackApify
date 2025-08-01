#!/bin/bash

# Apify Integration Web App Setup Script
# This script will set up both the backend and frontend for the application

set -e

echo "🚀 Setting up Apify Integration Web App..."

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
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm version $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install
    
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Apify API Configuration
APIFY_TOKEN=your_apify_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
        print_success "Created backend/.env file"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Apify Integration Web App
EOF
        print_success "Created frontend/.env file"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Display setup instructions
show_instructions() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo ""
    echo "1. Configure your Apify API key:"
    echo "   - Get your API key from: https://console.apify.com/account/integrations"
    echo "   - Edit backend/.env and replace 'your_apify_api_key_here' with your actual API key"
    echo ""
    echo "2. Start the development servers:"
    echo "   - Run: npm run dev"
    echo "   - This will start both backend (port 5000) and frontend (port 3000)"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:5000"
    echo "   - Health check: http://localhost:5000/health"
    echo ""
    echo "📚 Available scripts:"
    echo "   - npm run dev          - Start both servers in development mode"
    echo "   - npm run dev:backend  - Start only backend server"
    echo "   - npm run dev:frontend - Start only frontend server"
    echo "   - npm run build        - Build frontend for production"
    echo "   - npm test             - Run tests for both frontend and backend"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   - If you encounter issues, try: npm run clean && npm run install:all"
    echo "   - Check the logs in the terminal for any error messages"
    echo "   - Ensure your Apify API key is valid and has the necessary permissions"
    echo ""
}

# Main setup function
main() {
    print_status "Starting setup process..."
    
    check_node
    check_npm
    install_dependencies
    setup_environment
    show_instructions
}

# Run main function
main "$@" 