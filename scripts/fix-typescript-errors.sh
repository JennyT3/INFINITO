#!/bin/bash

echo "🔧 Fixing TypeScript Errors..."
echo ""

# Stop all development processes
echo "🛑 Stopping development processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Clean all caches
echo "🗑️  Cleaning all caches..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .turbo 2>/dev/null || true

# Clean TypeScript cache
echo "🗑️  Cleaning TypeScript cache..."
rm -rf node_modules/.cache/typescript 2>/dev/null || true
rm -rf .tsbuildinfo 2>/dev/null || true

# Clean webpack cache
echo "🗑️  Cleaning webpack cache..."
rm -rf node_modules/.cache/webpack 2>/dev/null || true

# Regenerate Prisma client
echo "🔄 Regenerating Prisma client..."
npx prisma generate

# Install dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Start development server
echo "🚀 Starting development server..."
npm run dev 