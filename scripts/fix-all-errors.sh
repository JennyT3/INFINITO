#!/bin/bash

echo "🔧 Fixing All TypeScript and JSX Errors..."

# Stop all development processes
echo "🛑 Stopping all development processes..."
pkill -f "next dev" || true
pkill -f "npm run dev" || true

# Clean all caches
echo "🗑️  Cleaning all caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf dist
rm -rf build

# Clean TypeScript cache
echo "🗑️  Cleaning TypeScript cache..."
rm -rf tsconfig.tsbuildinfo
rm -rf .tsbuildinfo

# Clean npm cache
echo "🗑️  Cleaning npm cache..."
npm cache clean --force

# Regenerate Prisma client
echo "🔄 Regenerating Prisma client..."
npx prisma generate

# Check dependencies
echo "📦 Checking dependencies..."
npm install

# Verify TypeScript compilation
echo "🔍 Verifying TypeScript compilation..."
npx tsc --noEmit --skipLibCheck

# Start development server
echo "🚀 Starting development server..."
npm run dev 