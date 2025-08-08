import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Escenarios específicos para testing
const SPECIFIC_SCENARIOS = {
  // Escenario 1: Contribuciones masivas para testing de bulk operations
  bulkOperations: [
    {
      tracking: 'BULK-001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'bulk.test@email.com',
      estado: 'pendiente',
      totalItems: 10,
      detalles: 'Bulk test 1 - pendiente',
      pickupPoint: 'Centro de Vila Real'
    },
    {
      tracking: 'BULK-002',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'bulk.test@email.com',
      estado: 'pendiente',
      totalItems: 15,
      detalles: 'Bulk test 2 - pendiente',
      pickupPoint: 'Biblioteca Municipal'
    },
    {
      tracking: 'BULK-003',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'bulk.test@email.com',
      estado: 'pendiente',
      totalItems: 8,
      detalles: 'Bulk test 3 - pendiente',
      pickupPoint: 'Mercado Municipal'
    }
  ],

  // Escenario 2: Contribuciones con diferentes clasificaciones
  classifications: [
    {
      tracking: 'CLASS-001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'class.test@email.com',
      estado: 'verificado',
      classification: 'reutilizable',
      destination: 'marketplace',
      decision: 'vender',
      totalItems: 5,
      co2Saved: 12.5,
      waterSaved: 75.0,
      naturalResources: 85,
      verified: true,
      detalles: 'Roupa em excelente estado para marketplace',
      pickupPoint: 'Centro de Vila Real'
    },
    {
      tracking: 'CLASS-002',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'class.test@email.com',
      estado: 'verificado',
      classification: 'reparable',
      destination: 'artistas',
      decision: 'donar',
      totalItems: 3,
      co2Saved: 7.8,
      waterSaved: 45.0,
      naturalResources: 70,
      verified: true,
      detalles: 'Roupa com pequenos defeitos para artistas',
      pickupPoint: 'Biblioteca Municipal'
    },
    {
      tracking: 'CLASS-003',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'class.test@email.com',
      estado: 'verificado',
      classification: 'reciclable',
      destination: 'reciclaje',
      decision: 'donar',
      totalItems: 12,
      co2Saved: 30.0,
      waterSaved: 180.0,
      naturalResources: 95,
      verified: true,
      detalles: 'Roupa muito danificada para reciclagem',
      pickupPoint: 'Mercado Municipal'
    }
  ],

  // Escenario 3: Contribuciones con diferentes tipos
  types: [
    {
      tracking: 'TYPE-ART-001',
      tipo: 'art',
      metodo: 'pickup',
      nome: 'art.test@email.com',
      estado: 'certificado_disponible',
      classification: 'reutilizable',
      destination: 'artistas',
      decision: 'donar',
      totalItems: 2,
      co2Saved: 5.2,
      waterSaved: 30.0,
      naturalResources: 90,
      verified: true,
      certificateHash: 'cert_art_001',
      certificateDate: new Date(),
      detalles: 'Tecidos para projetos artísticos',
      pickupPoint: 'Centro de Vila Real'
    },
    {
      tracking: 'TYPE-RECYCLE-001',
      tipo: 'recycle',
      metodo: 'pickup',
      nome: 'recycle.test@email.com',
      estado: 'verificado',
      classification: 'reciclable',
      destination: 'reciclaje',
      decision: 'donar',
      totalItems: 20,
      co2Saved: 50.0,
      waterSaved: 300.0,
      naturalResources: 98,
      verified: true,
      detalles: 'Material para reciclagem industrial',
      pickupPoint: 'Biblioteca Municipal'
    },
    {
      tracking: 'TYPE-RECEIVE-001',
      tipo: 'receive',
      metodo: 'pickup',
      nome: 'receive.test@email.com',
      estado: 'entregado',
      classification: 'reutilizable',
      destination: 'donacion',
      decision: 'donar',
      totalItems: 25,
      co2Saved: 60.0,
      waterSaved: 350.0,
      naturalResources: 85,
      verified: false,
      detalles: 'Roupa para doação a instituições',
      pickupPoint: 'Mercado Municipal'
    }
  ],

  // Escenario 4: Contribuciones con diferentes decisiones
  decisions: [
    {
      tracking: 'DECISION-SELL-001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'sell.test@email.com',
      estado: 'certificado_disponible',
      classification: 'reutilizable',
      destination: 'marketplace',
      decision: 'vender',
      totalItems: 6,
      co2Saved: 15.0,
      waterSaved: 90.0,
      naturalResources: 88,
      verified: true,
      certificateHash: 'cert_sell_001',
      certificateDate: new Date(),
      detalles: 'Roupa de qualidade para venda',
      pickupPoint: 'Centro de Vila Real'
    },
    {
      tracking: 'DECISION-DONATE-001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'donate.test@email.com',
      estado: 'certificado_disponible',
      classification: 'reutilizable',
      destination: 'donacion',
      decision: 'donar',
      totalItems: 8,
      co2Saved: 20.0,
      waterSaved: 120.0,
      naturalResources: 85,
      verified: true,
      certificateHash: 'cert_donate_001',
      certificateDate: new Date(),
      detalles: 'Roupa para doação a quem precisa',
      pickupPoint: 'Biblioteca Municipal'
    }
  ],

  // Escenario 5: Contribuciones con errores o casos edge
  edgeCases: [
    {
      tracking: 'EDGE-001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'edge.test@email.com',
      estado: 'pendiente',
      totalItems: 0, // Caso edge: 0 items
      detalles: 'Contribuição sem items',
      pickupPoint: 'Centro de Vila Real'
    },
    {
      tracking: 'EDGE-002',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'edge.test@email.com',
      estado: 'entregado',
      totalItems: 100, // Caso edge: muitos items
      co2Saved: 250.0,
      waterSaved: 1500.0,
      naturalResources: 95,
      verified: false,
      detalles: 'Contribuição com muitos items',
      pickupPoint: 'Biblioteca Municipal'
    },
    {
      tracking: 'EDGE-003',
      tipo: 'clothing',
      metodo: 'home',
      nome: 'edge.test@email.com',
      estado: 'pendiente',
      totalItems: 5,
      detalles: 'Recolha domiciliar com dados incompletos',
      // Sin pickupPoint para testar casos incompletos
    }
  ]
};

async function seedSpecificScenarios() {
  try {
    console.log('🎯 Seeding specific test scenarios...');

    let totalCreated = 0;

    // Crear escenario de bulk operations
    console.log('\n📦 Creating bulk operations scenario...');
    const bulkContributions = await Promise.all(
      SPECIFIC_SCENARIOS.bulkOperations.map(data =>
        prisma.contribution.create({
          data: {
            ...data,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${bulkContributions.length} bulk operation contributions`);
    totalCreated += bulkContributions.length;

    // Crear escenario de clasificaciones
    console.log('\n🏷️ Creating classification scenarios...');
    const classificationContributions = await Promise.all(
      SPECIFIC_SCENARIOS.classifications.map(data =>
        prisma.contribution.create({
          data: {
            ...data,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${classificationContributions.length} classification contributions`);
    totalCreated += classificationContributions.length;

    // Crear escenario de tipos
    console.log('\n🎨 Creating type scenarios...');
    const typeContributions = await Promise.all(
      SPECIFIC_SCENARIOS.types.map(data =>
        prisma.contribution.create({
          data: {
            ...data,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${typeContributions.length} type contributions`);
    totalCreated += typeContributions.length;

    // Crear escenario de decisiones
    console.log('\n💭 Creating decision scenarios...');
    const decisionContributions = await Promise.all(
      SPECIFIC_SCENARIOS.decisions.map(data =>
        prisma.contribution.create({
          data: {
            ...data,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${decisionContributions.length} decision contributions`);
    totalCreated += decisionContributions.length;

    // Crear escenario de casos edge
    console.log('\n⚠️ Creating edge case scenarios...');
    const edgeContributions = await Promise.all(
      SPECIFIC_SCENARIOS.edgeCases.map(data =>
        prisma.contribution.create({
          data: {
            ...data,
            fecha: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${edgeContributions.length} edge case contributions`);
    totalCreated += edgeContributions.length;

    // Crear productos asociados para contribuciones certificadas
    console.log('\n🛍️ Creating associated products...');
    const productsToCreate = [
      {
        tracking: 'DECISION-SELL-001',
        name: 'Camiseta Premium para Venda',
        garmentType: 'camiseta',
        gender: 'Unissex',
        color: 'Branco',
        size: 'L',
        material: 'Algodão Premium',
        country: 'Portugal',
        condition: 'Excelente',
        price: 30.0,
        originalPrice: 30.0,
        commission: 1.5,
        finalPrice: 31.5,
        sellerName: 'Vendedor Teste',
        sellerEmail: 'sell.test@email.com',
        sellerPhone: '+351 900 000 001',
        estimatedWeight: 0.2,
        photo1Url: '/images/Item1.jpeg',
        photo2Url: '/images/Item2.jpeg',
        status: 'published',
        publishedAt: new Date(),
        impactCo2: '5.2',
        impactWater: '25.1',
        impactEff: '88%',
        aiConfidence: 0.95
      },
      {
        tracking: 'TYPE-ART-001',
        name: 'Tecidos Artísticos',
        garmentType: 'acessorios',
        gender: 'Unissex',
        color: 'Variado',
        size: 'Único',
        material: 'Tecidos Mistos',
        country: 'Portugal',
        condition: 'Bom',
        price: 15.0,
        originalPrice: 15.0,
        commission: 1.0,
        finalPrice: 16.0,
        sellerName: 'Artista Teste',
        sellerEmail: 'art.test@email.com',
        sellerPhone: '+351 900 000 002',
        estimatedWeight: 0.5,
        photo1Url: '/images/Item3.jpeg',
        photo2Url: '/images/Item4.jpeg',
        status: 'published',
        publishedAt: new Date(),
        impactCo2: '13.1',
        impactWater: '52.5',
        impactEff: '90%',
        aiConfidence: 0.88
      }
    ];

    const products = await Promise.all(
      productsToCreate.map(data =>
        prisma.product.create({
          data: {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        })
      )
    );
    console.log(`✅ Created ${products.length} associated products`);

    // Resumen final
    const totalContributions = await prisma.contribution.count();
    const totalProducts = await prisma.product.count();
    
    console.log('\n📊 Final Summary:');
    console.log(`Total contributions created in this run: ${totalCreated}`);
    console.log(`Total contributions in database: ${totalContributions}`);
    console.log(`Total products in database: ${totalProducts}`);
    
    console.log('\n🎯 Specific Test Scenarios Available:');
    console.log('✅ Bulk operations testing (BULK-001, BULK-002, BULK-003)');
    console.log('✅ Classification testing (CLASS-001, CLASS-002, CLASS-003)');
    console.log('✅ Type testing (TYPE-ART-001, TYPE-RECYCLE-001, TYPE-RECEIVE-001)');
    console.log('✅ Decision testing (DECISION-SELL-001, DECISION-DONATE-001)');
    console.log('✅ Edge cases testing (EDGE-001, EDGE-002, EDGE-003)');
    console.log('✅ Associated products for certified contributions');

    console.log('\n🔧 Admin Testing Workflows:');
    console.log('1. Bulk Operations: Select BULK-* contributions for mass processing');
    console.log('2. Classification: Process CLASS-* contributions with different classifications');
    console.log('3. Type Filtering: Filter by art, recycle, receive types');
    console.log('4. Decision Testing: Test donar vs vender workflows');
    console.log('5. Edge Cases: Handle unusual data scenarios');
    console.log('6. Product Creation: Create products from certified contributions');

    console.log('\n🎉 Specific scenarios seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding specific scenarios:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para limpiar solo los datos específicos
async function cleanSpecificScenarios() {
  try {
    console.log('🧹 Cleaning specific test scenarios...');
    
    const trackingCodes = [
      ...SPECIFIC_SCENARIOS.bulkOperations.map(c => c.tracking),
      ...SPECIFIC_SCENARIOS.classifications.map(c => c.tracking),
      ...SPECIFIC_SCENARIOS.types.map(c => c.tracking),
      ...SPECIFIC_SCENARIOS.decisions.map(c => c.tracking),
      ...SPECIFIC_SCENARIOS.edgeCases.map(c => c.tracking)
    ];

    await prisma.product.deleteMany({
      where: {
        tracking: {
          in: trackingCodes
        }
      }
    });

    await prisma.contribution.deleteMany({
      where: {
        tracking: {
          in: trackingCodes
        }
      }
    });

    console.log('✅ Specific scenarios cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning specific scenarios:', error);
  }
}

// Ejecutar el seed
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--clean')) {
    cleanSpecificScenarios()
      .then(() => console.log('Cleaning completed'))
      .catch(console.error);
  } else {
    seedSpecificScenarios()
      .catch(console.error);
  }
}

export { seedSpecificScenarios, cleanSpecificScenarios }; 