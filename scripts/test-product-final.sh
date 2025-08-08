#!/bin/bash

echo "🧪 Final Product Creation Test..."
echo ""

# Use an existing verified clothing contribution
tracking_code="TEST-MAN-001-258644-tzgv"

echo "🔑 Using existing verified clothing contribution: $tracking_code"
echo ""

# Test product creation
echo "📦 Creating product linked to existing contribution..."

product_payload=$(cat << EOF
{
  "name": "Test T-Shirt",
  "garmentType": "T-Shirt",
  "gender": "Unisex",
  "color": "Blue",
  "size": "M",
  "material": "Organic Cotton",
  "country": "Portugal",
  "condition": "Good",
  "tracking": "$tracking_code",
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
EOF)

echo "📦 Product Payload:"
echo "$product_payload"
echo ""

# Create product
product_response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$product_payload" \
  http://localhost:3000/api/products)

product_http_code=$(echo "$product_response" | grep "HTTPSTATUS:" | cut -d: -f2)
product_body=$(echo "$product_response" | sed '/HTTPSTATUS:/d')

echo "📊 Product Response Status: $product_http_code"
echo "📄 Product Response Body:"
echo "$product_body"

if [ "$product_http_code" -eq 200 ] || [ "$product_http_code" -eq 201 ]; then
    echo ""
    echo "✅ Product creation successful!"
    echo "📝 Created product with tracking: $tracking_code"
    echo ""
    echo "🎉 Test successful! The API endpoint is working correctly."
    echo ""
    echo "🔍 This confirms that the issue in SellSectionWithAI.tsx is with the payload format, not the API."
else
    echo ""
    echo "❌ Product creation failed!"
    echo "🔍 Error details: $product_body"
    echo ""
    echo "💡 This suggests there might be an issue with the API endpoint itself."
fi 