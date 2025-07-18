#!/bin/bash
# OtterSport Migration Script for Vercel
# Generated: 2025-07-18
# Platform: vercel

set -e

echo "🚀 Starting migration to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null || echo "not installed")
if [[ "$NODE_VERSION" == "not installed" ]]; then
  print_error "Node.js is not installed"
  exit 1
fi

print_status "Node.js version: $NODE_VERSION"

# Check npm
NPM_VERSION=$(npm --version 2>/dev/null || echo "not installed")
if [[ "$NPM_VERSION" == "not installed" ]]; then
  print_error "npm is not installed"
  exit 1
fi

print_status "npm version: $NPM_VERSION"

# Install dependencies
print_status "Installing dependencies..."
npm install

# 
# Vercel-specific setup
print_status "Setting up Vercel environment..."
if [ ! -f "vercel.json" ]; then
  print_warning "No vercel.json found, creating default configuration"
  cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ]
}
EOF
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
  print_status "Installing Vercel CLI..."
  npm install -g vercel
fi


# Database migration
print_status "Running database migrations..."
if [ -f "drizzle.config.ts" ]; then
  npm run db:push
else
  print_warning "No drizzle.config.ts found, skipping database migration"
fi

# Build application
print_status "Building application..."
npm run build

# Platform-specific deployment steps

print_status "Deploying to Vercel..."
vercel --prod


# Health check
print_status "Running health check..."
node migration-toolkit.js --health-check

print_status "Migration to Vercel completed successfully!"
echo "🎉 Your OtterSport application is ready on Vercel!"
