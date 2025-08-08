#!/bin/bash

echo "🧪 Testing Product Creation with Contribution..."
echo ""

# Generate unique tracking code
timestamp=$(date +%s)
unique_tracking="INF_TEST_${timestamp}_$(openssl rand -hex 4)"

echo "🔑 Using unique tracking code: $unique_tracking"
echo ""

# Step 1: Create a test contribution
echo "📝 Step 1: Creating test contribution..."

contribution_payload=$(cat << EOF
{
  "tracking": "$unique_tracking",
  "tipo": "clothing",
  "metodo": "dropoff",
  "nome": "Test User",
  "estado": "recibido",
  "fecha": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "detalles": "Test clothing contribution for product creation",
  "decision": "donar",
  "pickupPoint": "Test Location",
  "trackingState": "completed",
  "classification": "textile",
  "destination": "reuse",
  "totalItems": 1,
  "recyclingPercentage": 80,
  "repairPercentage": 20,
  "cotton": 100,
  "polyester": 0,
  "wool": 0,
  "other": 0,
  "co2Saved": 6.55,
  "waterSaved": 2625,
  "naturalResources": 85,
  "aiConfidence": 0.92,
  "methodology": "standard",
  "uncertainty": "±15%",
  "region": "Portugal",
  "verified": true,
  "imageUrls": []
}
EOF)

echo "📦 Contribution Payload:"
echo "$contribution_payload"
echo ""

# Create contribution
contribution_response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$contribution_payload" \
  http://localhost:3000/api/contributions)

contribution_http_code=$(echo "$contribution_response" | grep "HTTPSTATUS:" | cut -d: -f2)
contribution_body=$(echo "$contribution_response" | sed '/HTTPSTATUS:/d')

echo "📊 Contribution Response Status: $contribution_http_code"
echo "📄 Contribution Response Body:"
echo "$contribution_body"

if [ "$contribution_http_code" -eq 200 ] || [ "$contribution_http_code" -eq 201 ]; then
    echo "✅ Contribution created successfully!"
else
    echo "❌ Contribution creation failed!"
    echo "🔍 Error details: $contribution_body"
    exit 1
fi

echo ""
echo "⏳ Waiting 2 seconds for database sync..."
sleep 2

# Step 2: Create a product linked to the contribution
echo ""
echo "📦 Step 2: Creating product linked to contribution..."

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
    echo "📝 Created product with tracking: $unique_tracking"
    echo ""
    echo "🎉 Complete test successful!"
else
    echo ""
    echo "❌ Product creation failed!"
    echo "🔍 Error details: $product_body"
fi 