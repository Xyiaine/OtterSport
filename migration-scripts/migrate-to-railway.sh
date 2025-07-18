#!/bin/bash
# OtterSport Migration Script for Railway
# Generated: 2025-07-18
# Platform: railway

set -e

echo "🚀 Starting migration to Railway..."

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
# Railway-specific setup
print_status "Setting up Railway environment..."
if [ ! -f "railway.json" ]; then
  print_warning "No railway.json found, creating default configuration"
  cat > railway.json << 'EOF'
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run dev"
  }
}
EOF
fi

# Install Railway CLI if not present
if ! command -v railway &> /dev/null; then
  print_status "Installing Railway CLI..."
  npm install -g @railway/cli
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

print_status "Deploying to Railway..."
railway up


# Health check
print_status "Running health check..."
node migration-toolkit.js --health-check

print_status "Migration to Railway completed successfully!"
echo "🎉 Your OtterSport application is ready on Railway!"
