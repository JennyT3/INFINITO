#!/bin/bash

echo "🧪 Testing Product Creation API..."
echo ""

# Generate unique tracking code
timestamp=$(date +%s)
unique_tracking="INF_TEST_${timestamp}_$(openssl rand -hex 4)"

echo "🔑 Using unique tracking code: $unique_tracking"
echo ""

# Test payload with all required fields
cat > /tmp/test-product.json << EOF
{
  "name": "Test T-Shirt",
  "garmentType": "T-Shirt",
  "gender": "Unisex",
  "color": "Blue",
  "size": "M",
  "material": "Organic Cotton",
  "country": "Portugal",
  "condition": "Good",
  "tracking": "$unique_tracking",
  "originalPrice": 12.0,
  "commission": 2.0,
  "finalPrice": 14.0,
  "sellerName": "Test Seller",
  "sellerEmail": "test@example.com",
  "sellerPhone": "+351123456789",
  "estimatedWeight": 0.25,
  "standardImpact": {
    "co2": 6.55,
    "water": 2625,
    "resources": 85
  },
  "aiDetection": "T-Shirt Blue",
  "aiConfidence": 0.92,
  "photo1Url": "https://example.com/photo1.jpg",
  "photo2Url": "https://example.com/photo2.jpg",
  "photo3Url": "",
  "impactCo2": "6.55",
  "impactWater": "2625",
  "impactEff": "85%",
  "status": "pending",
  "publishedAt": null,
  "price": 12.0
}
EOF

echo "📦 Test Payload:"
cat /tmp/test-product.json
echo ""
echo "🚀 Sending request to /api/products..."

# Send the request and capture both status and body
response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d @/tmp/test-product.json \
  http://localhost:3000/api/products)

# Extract status code and body
http_code=$(echo "$response" | grep "HTTPSTATUS:" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTPSTATUS:/d')

echo "📊 Response Status: $http_code"
echo "📄 Response Body:"
echo "$response_body"

if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo ""
    echo "✅ Product creation successful!"
    echo "📝 Created product with tracking: $unique_tracking"
else
    echo ""
    echo "❌ Product creation failed!"
    echo "🔍 Error details: $response_body"
fi

# Clean up
rm -f /tmp/test-product.json 