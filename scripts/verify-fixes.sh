#!/bin/bash

echo "🔍 Verifying TypeScript Error Fixes..."
echo ""

# Check if server is running
echo "📊 Checking server status..."
if curl -s http://localhost:3000/api/contributions > /dev/null 2>&1; then
    echo "✅ Server is running and responding"
else
    echo "❌ Server is not responding"
    exit 1
fi

echo ""

# Check for TypeScript compilation errors
echo "🔧 Checking TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck 2>&1 | grep -q "error"; then
    echo "❌ TypeScript compilation errors found:"
    npx tsc --noEmit --skipLibCheck 2>&1 | grep "error" | head -10
else
    echo "✅ No TypeScript compilation errors found"
fi

echo ""

# Check for Next.js build errors
echo "🏗️  Checking Next.js build..."
if npm run build 2>&1 | grep -q "error"; then
    echo "❌ Next.js build errors found:"
    npm run build 2>&1 | grep "error" | head -10
else
    echo "✅ No Next.js build errors found"
fi

echo ""

# Test API endpoints
echo "🌐 Testing API endpoints..."

# Test contributions endpoint
if curl -s http://localhost:3000/api/contributions | grep -q "success"; then
    echo "✅ /api/contributions endpoint working"
else
    echo "❌ /api/contributions endpoint not working"
fi

# Test products endpoint
if curl -s http://localhost:3000/api/products | grep -q "\[\]"; then
    echo "✅ /api/products endpoint working"
else
    echo "❌ /api/products endpoint not working"
fi

echo ""
echo "🎉 Verification complete!" 