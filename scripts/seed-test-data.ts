import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...');

    // Create test contributions
    const contributions = await Promise.all([
      prisma.contribution.create({
        data: {
          tracking: 'TEST-001',
          tipo: 'clothing',
          metodo: 'pickup',
          nome: 'test@example.com',
          estado: 'verificado',
          classification: 'reutilizable',
          destination: 'marketplace',
          totalItems: 5,
          co2Saved: 12.5,
          waterSaved: 75.0,
          naturalResources: 85,
          verified: true,
        }
      }),
      prisma.contribution.create({
        data: {
          tracking: 'TEST-002',
          tipo: 'clothing',
          metodo: 'home',
          nome: 'test@example.com',
          estado: 'certificado_disponible',
          classification: 'reparable',
          destination: 'artistas',
          totalItems: 3,
          co2Saved: 8.2,
          waterSaved: 45.0,
          naturalResources: 72,
          verified: true,
        }
      })
    ]);

    console.log(`✅ Created ${contributions.length} test contributions`);

    // Create test products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          tracking: 'TEST-001',
          name: 'Test T-Shirt',
          garmentType: 'camiseta',
          gender: 'Unissex',
          color: 'Blue',
          size: 'M',
          material: 'Cotton',
          country: 'Portugal',
          condition: 'Excellent',
          price: 15.0,
          originalPrice: 15.0,
          commission: 1.0,
          finalPrice: 16.0,
          sellerName: 'Test Seller',
          sellerEmail: 'seller@test.com',
          estimatedWeight: 0.2,
          photo1Url: '/images/Item1.jpeg',
          photo2Url: '/images/Item2.jpeg',
          status: 'published',
          publishedAt: new Date(),
          impactCo2: '5.2',
          impactWater: '25.1',
          impactEff: '85%',
        }
      })
    ]);

    console.log(`✅ Created ${products.length} test products`);

    console.log('🎉 Test data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData(); 