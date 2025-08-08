import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProductValidation() {
  try {
    console.log('🧪 Testing Product Validation with Tracking...\n');

    // 1. Test con tracking válido
    console.log('1️⃣ Testing with valid tracking code...');
    const validTracking = 'INF_1753475802913_3ewhghxth';
    
    const contribution = await prisma.contribution.findFirst({
      where: { 
        tracking: validTracking,
        tipo: 'clothing'
      }
    });

    if (contribution) {
      console.log('✅ Valid contribution found:');
      console.log(`   - Tracking: ${contribution.tracking}`);
      console.log(`   - Type: ${contribution.tipo}`);
      console.log(`   - Status: ${contribution.estado}`);
      console.log(`   - Date: ${contribution.createdAt}`);
    } else {
      console.log('❌ No valid contribution found');
    }

    // 2. Test con tracking inválido
    console.log('\n2️⃣ Testing with invalid tracking code...');
    const invalidTracking = 'INVALID_TRACKING_123';
    
    const invalidContribution = await prisma.contribution.findFirst({
      where: { 
        tracking: invalidTracking,
        tipo: 'clothing'
      }
    });

    if (!invalidContribution) {
      console.log('✅ Correctly rejected invalid tracking code');
    } else {
      console.log('❌ Invalid tracking code was accepted');
    }

    // 3. Test productos existentes para el tracking
    console.log('\n3️⃣ Checking existing products for tracking...');
    const existingProduct = await prisma.product.findFirst({
      where: { tracking: validTracking }
    });

    if (existingProduct) {
      console.log('⚠️  Product already exists for this tracking code:');
      console.log(`   - Product ID: ${existingProduct.id}`);
      console.log(`   - Name: ${existingProduct.name}`);
      console.log(`   - Status: ${existingProduct.status}`);
    } else {
      console.log('✅ No existing product found - ready for publication');
    }

    // 4. Test validación de estado
    console.log('\n4️⃣ Testing contribution status validation...');
    if (contribution) {
      if (contribution.estado === 'pendiente') {
        console.log('⚠️  Contribution is pending - cannot publish products yet');
      } else {
        console.log('✅ Contribution status allows product publication');
      }
    }

    console.log('\n📊 Validation Summary:');
    console.log(`   - Valid tracking exists: ${contribution ? 'Yes' : 'No'}`);
    console.log(`   - Contribution type: ${contribution?.tipo || 'N/A'}`);
    console.log(`   - Contribution status: ${contribution?.estado || 'N/A'}`);
    console.log(`   - Product already exists: ${existingProduct ? 'Yes' : 'No'}`);
    console.log(`   - Ready for publication: ${contribution && contribution.tipo === 'clothing' && contribution.estado !== 'pendiente' && !existingProduct ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('❌ Error testing product validation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductValidation(); 