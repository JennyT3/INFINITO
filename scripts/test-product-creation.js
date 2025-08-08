const fetch = require('node-fetch');

async function testProductCreation() {
	console.log('🧪 Testing Product Creation API...\n');

	const testPayload = {
		name: "Test T-Shirt",
		garmentType: "T-Shirt",
		gender: "Unisex",
		color: "Blue",
		size: "M",
		material: "Organic Cotton",
		country: "Portugal",
		condition: "Good",
		tracking: "INF_1753727336799_bstihq2yy",
		originalPrice: 12.0,
		commission: 2.0,
		finalPrice: 14.0,
		sellerName: "Test Seller",
		sellerEmail: "test@example.com",
		sellerPhone: "+351123456789",
		estimatedWeight: 0.25,
		standardImpact: {
			co2: 6.55,
			water: 2625,
			resources: 85
		},
		aiDetection: "T-Shirt Blue",
		aiConfidence: 0.92,
		photo1Url: "https://example.com/photo1.jpg",
		photo2Url: "https://example.com/photo2.jpg",
		photo3Url: "",
		impactCo2: "6.55",
		impactWater: "2625",
		impactEff: "85%",
		status: "pending",
		publishedAt: null,
		price: 12.0 // Campo requerido
	};

	console.log('📦 Test Payload:');
	console.log(JSON.stringify(testPayload, null, 2));
	console.log('\n🚀 Sending request to /api/products...');

	try {
		const response = await fetch('http://localhost:3000/api/products', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(testPayload)
		});

		console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

		const responseText = await response.text();
		console.log('📄 Response Body:');
		console.log(responseText);

		if (response.ok) {
			console.log('\n✅ Product creation successful!');
		} else {
			console.log('\n❌ Product creation failed!');
		}

	} catch (error) {
		console.error('\n💥 Error during test:', error.message);
	}
}

// Run the test
testProductCreation(); 