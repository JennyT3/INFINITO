#!/bin/bash

echo "🧪 Testing APIs..."

# Wait for server to start
sleep 3

# Test GET /api/contributions
echo "📊 Testing GET /api/contributions..."
CONTRIB_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/contributions)
CONTRIB_STATUS="${CONTRIB_RESPONSE: -3}"
CONTRIB_BODY="${CONTRIB_RESPONSE%???}"

if [ "$CONTRIB_STATUS" -eq 200 ]; then
    echo "✅ GET /api/contributions - SUCCESS"
    echo "📄 Response length: ${#CONTRIB_BODY} characters"
else
    echo "❌ GET /api/contributions - FAILED (Status: $CONTRIB_STATUS)"
    echo "📄 Response: $CONTRIB_BODY"
fi

echo ""

# Test GET /api/products
echo "📦 Testing GET /api/products..."
PRODUCTS_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/products)
PRODUCTS_STATUS="${PRODUCTS_RESPONSE: -3}"
PRODUCTS_BODY="${PRODUCTS_RESPONSE%???}"

if [ "$PRODUCTS_STATUS" -eq 200 ]; then
    echo "✅ GET /api/products - SUCCESS"
    echo "📄 Response length: ${#PRODUCTS_BODY} characters"
else
    echo "❌ GET /api/products - FAILED (Status: $PRODUCTS_STATUS)"
    echo "📄 Response: $PRODUCTS_BODY"
fi

echo ""

# Test POST /api/products with valid data
echo "📦 Testing POST /api/products..."
TIMESTAMP=$(date +%s)
TRACKING="TEST_${TIMESTAMP}_$(openssl rand -hex 4)"

POST_PAYLOAD='{
  "name": "Test Product",
  "garmentType": "T-Shirt",
  "gender": "Unisex",
  "color": "Blue",
  "size": "M",
  "material": "Cotton",
  "country": "Portugal",
  "condition": "Good",
  "tracking": "'$TRACKING'",
  "price": 15.0,
  "sellerName": "Test Seller",
  "sellerEmail": "test@example.com",
  "sellerPhone": "+351123456789"
}'

POST_RESPONSE=$(curl -s -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$POST_PAYLOAD" \
  http://localhost:3000/api/products)

POST_STATUS="${POST_RESPONSE: -3}"
POST_BODY="${POST_RESPONSE%???}"

echo ""
if [ "$POST_STATUS" -eq 201 ]; then
    echo "✅ POST /api/products - SUCCESS"
    echo "📄 Response: $POST_BODY"
elif [ "$POST_STATUS" -eq 400 ]; then
    echo "⚠️  POST /api/products - VALIDATION ERROR (Expected for test tracking)"
    echo "📄 Response: $POST_BODY"
else
    echo "❌ POST /api/products - FAILED (Status: $POST_STATUS)"
    echo "📄 Response: $POST_BODY"
fi

echo ""
echo "🎉 API Test Complete!" 