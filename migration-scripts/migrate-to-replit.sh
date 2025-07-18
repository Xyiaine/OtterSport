#!/bin/bash
# OtterSport Migration Script for Replit
# Generated: 2025-07-18
# Platform: replit

set -e

echo "🚀 Starting migration to Replit..."

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
# Replit-specific setup
print_status "Setting up Replit environment..."
if [ ! -f ".replit" ]; then
  print_warning "No .replit file found, creating default configuration"
  cat > .replit << 'EOF'
language = "nodejs"
run = "npm run dev"
modules = ["nodejs-20"]

[nix]
channel = "stable-24_05"

[deployment]
run = ["sh", "-c", "npm run dev"]
EOF
fi

# Check for secrets
if [ -z "$DATABASE_URL" ]; then
  print_warning "DATABASE_URL not set. Configure in Replit Secrets."
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

print_status "Replit deployment steps:"
print_status "1. Push your code to the Replit project"
print_status "2. Configure environment variables in Secrets tab"
print_status "3. Run the application with 'npm run dev'"
print_status "4. Your app will be available at https://your-repl-name.your-username.repl.co"


# Health check
print_status "Running health check..."
node migration-toolkit.js --health-check

print_status "Migration to Replit completed successfully!"
echo "🎉 Your OtterSport application is ready on Replit!"
