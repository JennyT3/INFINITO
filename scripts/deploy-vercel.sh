#!/bin/bash

# Vercel Deployment Script for INFINITO Project
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting Vercel deployment for INFINITO project..."

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

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.mjs" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install

# Step 2: Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Step 3: Build the project
print_status "Building the project..."
npm run build

# Step 4: Check if build was successful
if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

# Step 5: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_success "Deployment completed! 🎉"
print_status "Your application should now be live on Vercel."
print_status "Don't forget to configure your environment variables in the Vercel dashboard."

echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Configure the following environment variables:"
echo "   - DATABASE_URL (PostgreSQL connection string)"
echo "   - SHADOW_DATABASE_URL (PostgreSQL shadow database)"
echo "   - NEXTAUTH_URL (Your Vercel deployment URL)"
echo "   - NEXTAUTH_SECRET (Random secret for NextAuth)"
echo "   - GOOGLE_CLIENT_ID (Google OAuth client ID)"
echo "   - GOOGLE_CLIENT_SECRET (Google OAuth client secret)"
echo "   - ANTHROPIC_API_KEY (Anthropic API key)"
echo "3. Run database migrations: npx prisma db push"
echo "4. Seed initial data if needed"
