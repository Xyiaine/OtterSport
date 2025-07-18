#!/bin/bash
# OtterSport Migration Script for Generic Platform
# Generated: 2025-07-18
# Platform: generic

set -e

echo "🚀 Starting migration to Generic Platform..."

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
# Generic platform setup
print_status "Setting up generic environment..."
if [ ! -f "ecosystem.config.js" ]; then
  print_warning "No PM2 config found, creating default configuration"
  cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ottersport',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF
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

print_status "Generic deployment steps:"
print_status "1. Set up your web server (nginx, Apache, etc.)"
print_status "2. Configure environment variables"
print_status "3. Start the application with PM2: pm2 start ecosystem.config.js"
print_status "4. Set up SSL certificates"
print_status "5. Configure your domain"


# Health check
print_status "Running health check..."
node migration-toolkit.js --health-check

print_status "Migration to Generic Platform completed successfully!"
echo "🎉 Your OtterSport application is ready on Generic Platform!"
