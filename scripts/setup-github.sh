#!/bin/bash

# GitHub Repository Setup Script for INFINITO Project
# This script helps create and configure a GitHub repository

set -e

echo "🐙 Setting up GitHub repository for INFINITO project..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "next.config.mjs" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git is not initialized. Please run 'git init' first."
    exit 1
fi

# Get repository name from user
echo ""
echo "📝 Please provide the following information:"
echo ""

read -p "GitHub username: " GITHUB_USERNAME
read -p "Repository name (e.g., infinito-app): " REPO_NAME
read -p "Repository description (optional): " REPO_DESCRIPTION

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    print_error "Username and repository name are required"
    exit 1
fi

# Set default description if empty
if [ -z "$REPO_DESCRIPTION" ]; then
    REPO_DESCRIPTION="INFINITO - Sustainable Fashion & Recycling Platform"
fi

print_status "Creating GitHub repository: $GITHUB_USERNAME/$REPO_NAME"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    print_status "Using GitHub CLI to create repository..."
    
    # Create repository using GitHub CLI
    gh repo create "$REPO_NAME" \
        --description "$REPO_DESCRIPTION" \
        --public \
        --source=. \
        --remote=origin \
        --push
    
    if [ $? -eq 0 ]; then
        print_success "Repository created and code pushed successfully!"
    else
        print_error "Failed to create repository with GitHub CLI"
        print_status "Please create the repository manually on GitHub.com"
        exit 1
    fi
else
    print_warning "GitHub CLI not found. Please create the repository manually:"
    echo ""
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: $REPO_DESCRIPTION"
    echo "4. Make it public"
    echo "5. Don't initialize with README (we already have one)"
    echo ""
    
    read -p "Press Enter after creating the repository..."
    
    # Add remote origin
    print_status "Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    # Push to GitHub
    print_status "Pushing code to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        print_success "Code pushed to GitHub successfully!"
    else
        print_error "Failed to push to GitHub"
        exit 1
    fi
fi

print_success "GitHub repository setup completed! 🎉"
print_status "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"

echo ""
echo "📋 Next steps:"
echo "1. Verify the repository on GitHub"
echo "2. Set up branch protection rules if needed"
echo "3. Configure GitHub Actions for CI/CD (optional)"
echo "4. Add collaborators if needed"
echo "5. Run the Vercel deployment script: ./scripts/deploy-vercel.sh"
