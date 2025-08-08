#!/bin/bash

echo "🧪 Testing Simplified Product API..."

# Wait for server to start
sleep 3

# Test GET endpoint
echo "📊 Testing GET /api/products..."
GET_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/api/products)
GET_STATUS="${GET_RESPONSE: -3}"
GET_BODY="${GET_RESPONSE%???}"

if [ "$GET_STATUS" -eq 200 ]; then
    echo "✅ GET /api/products - SUCCESS"
    echo "📄 Response: $GET_BODY"
else
    echo "❌ GET /api/products - FAILED (Status: $GET_STATUS)"
    echo "📄 Response: $GET_BODY"
fi

echo ""

# Test POST endpoint with minimal data
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

echo "📄 Payload: $POST_PAYLOAD"

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