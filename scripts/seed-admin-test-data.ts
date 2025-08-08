import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipos de contribuciones para testing
const CONTRIBUTION_TYPES = ['clothing', 'art', 'recycle', 'receive'] as const;
const CONTRIBUTION_STATES = ['pendiente', 'entregado', 'verificado', 'certificado_disponible'] as const;
const CLASSIFICATIONS = ['reutilizable', 'reparable', 'reciclable'] as const;
const DESTINATIONS = ['marketplace', 'donacion', 'artistas', 'reciclaje'] as const;
const DECISIONS = ['donar', 'vender'] as const;

// Datos de ejemplo para contribuciones
const SAMPLE_CONTRIBUTIONS = [
  {
    tracking: 'INF-2024-001',
    tipo: 'clothing',
    metodo: 'pickup',
    nome: 'maria.silva@email.com',
    estado: 'certificado_disponible',
    classification: 'reutilizable',
    destination: 'marketplace',
    decision: 'vender',
    totalItems: 8,
    co2Saved: 18.5,
    waterSaved: 120.0,
    naturalResources: 85,
    verified: true,
    certificateHash: 'cert_hash_001_abc123',
    certificateDate: new Date('2024-01-15'),
    detalles: 'Camisetas de algodão orgânico em excelente estado',
    pickupPoint: 'Centro de Vila Real'
  },
  {
    tracking: 'INF-2024-002',
    tipo: 'clothing',
    metodo: 'home',
    nome: 'joao.santos@email.com',
    estado: 'verificado',
    classification: 'reparable',
    destination: 'artistas',
    decision: 'donar',
    totalItems: 5,
    co2Saved: 12.3,
    waterSaved: 75.5,
    naturalResources: 72,
    verified: true,
    detalles: 'Calças jeans com pequenos defeitos, ideais para reparação',
    pickupPoint: 'Recolha domiciliar'
  },
  {
    tracking: 'INF-2024-003',
    tipo: 'clothing',
    metodo: 'pickup',
    nome: 'ana.rodrigues@email.com',
    estado: 'entregado',
    classification: 'reciclable',
    destination: 'reciclaje',
    decision: 'donar',
    totalItems: 12,
    co2Saved: 25.8,
    waterSaved: 150.2,
    naturalResources: 95,
    verified: false,
    detalles: 'Roupa muito danificada para reciclagem',
    pickupPoint: 'Biblioteca Municipal'
  },
  {
    tracking: 'INF-2024-004',
    tipo: 'art',
    metodo: 'pickup',
    nome: 'carlos.artista@email.com',
    estado: 'certificado_disponible',
    classification: 'reutilizable',
    destination: 'artistas',
    decision: 'donar',
    totalItems: 3,
    co2Saved: 8.2,
    waterSaved: 45.0,
    naturalResources: 88,
    verified: true,
    certificateHash: 'cert_hash_004_def456',
    certificateDate: new Date('2024-01-20'),
    detalles: 'Tecidos para projetos artísticos',
    pickupPoint: 'Mercado Municipal'
  },
  {
    tracking: 'INF-2024-005',
    tipo: 'clothing',
    metodo: 'home',
    nome: 'sofia.martins@email.com',
    estado: 'pendiente',
    classification: null,
    destination: null,
    decision: null,
    totalItems: 6,
    co2Saved: 0,
    waterSaved: 0,
    naturalResources: 0,
    verified: false,
    detalles: 'Aguardando processamento',
    pickupPoint: 'Recolha domiciliar'
  },
  {
    tracking: 'INF-2024-006',
    tipo: 'recycle',
    metodo: 'pickup',
    nome: 'pedro.eco@email.com',
    estado: 'verificado',
    classification: 'reciclable',
    destination: 'reciclaje',
    decision: 'donar',
    totalItems: 15,
    co2Saved: 32.1,
    waterSaved: 180.5,
    naturalResources: 98,
    verified: true,
    detalles: 'Tecidos para reciclagem industrial',
    pickupPoint: 'Centro de Vila Real'
  },
  {
    tracking: 'INF-2024-007',
    tipo: 'clothing',
    metodo: 'pickup',
    nome: 'lucia.ferreira@email.com',
    estado: 'certificado_disponible',
    classification: 'reutilizable',
    destination: 'marketplace',
    decision: 'vender',
    totalItems: 4,
    co2Saved: 9.8,
    waterSaved: 60.2,
    naturalResources: 82,
    verified: true,
    certificateHash: 'cert_hash_007_ghi789',
    certificateDate: new Date('2024-01-25'),
    detalles: 'Vestidos vintage em excelente estado',
    pickupPoint: 'Biblioteca Municipal'
  },
  {
    tracking: 'INF-2024-008',
    tipo: 'receive',
    metodo: 'pickup',
    nome: 'manuel.associacao@email.com',
    estado: 'entregado',
    classification: 'reutilizable',
    destination: 'donacion',
    decision: 'donar',
    totalItems: 20,
    co2Saved: 45.2,
    waterSaved: 250.0,
    naturalResources: 90,
    verified: false,
    detalles: 'Roupa para doação a associação local',
    pickupPoint: 'Mercado Municipal'
  }
];

// Datos de ejemplo para productos
const SAMPLE_PRODUCTS = [
  {
    tracking: 'INF-2024-001',
    name: 'Camiseta Orgânica Azul',
    garmentType: 'camiseta',
    gender: 'Unissex',
    color: 'Azul',
    size: 'M',
    material: 'Algodão Orgânico 100%',
    country: 'Portugal',
    condition: 'Excelente',
    price: 25.0,
    originalPrice: 25.0,
    commission: 1.25,
    finalPrice: 26.25,
    sellerName: 'Maria Silva',
    sellerEmail: 'maria.silva@email.com',
    sellerPhone: '+351 912 345 678',
    estimatedWeight: 0.2,
    photo1Url: '/images/Item1.jpeg',
    photo2Url: '/images/Item2.jpeg',
    photo3Url: '/images/Item3.jpeg',
    status: 'published',
    publishedAt: new Date('2024-01-16'),
    soldAt: null,
    impactCo2: '5.2',
    impactWater: '25.1',
    impactEff: '85%',
    aiConfidence: 0.95,
    aiDetection: {
      material: 'cotton',
      condition: 'excellent',
      color: 'blue',
      size: 'M'
    }
  },
  {
    tracking: 'INF-2024-007',
    name: 'Vestido Vintage Floral',
    garmentType: 'vestido',
    gender: 'Feminino',
    color: 'Floral',
    size: 'S',
    material: 'Seda Natural',
    country: 'Portugal',
    condition: 'Excelente',
    price: 45.0,
    originalPrice: 45.0,
    commission: 2.25,
    finalPrice: 47.25,
    sellerName: 'Lúcia Ferreira',
    sellerEmail: 'lucia.ferreira@email.com',
    sellerPhone: '+351 923 456 789',
    estimatedWeight: 0.35,
    photo1Url: '/images/Item4.jpeg',
    photo2Url: '/images/Item5.jpeg',
    photo3Url: null,
    status: 'published',
    publishedAt: new Date('2024-01-26'),
    soldAt: null,
    impactCo2: '9.2',
    impactWater: '36.8',
    impactEff: '88%',
    aiConfidence: 0.92,
    aiDetection: {
      material: 'silk',
      condition: 'excellent',
      color: 'floral',
      size: 'S'
    }
  },
  {
    tracking: 'INF-2024-001',
    name: 'Calças Jeans Vintage',
    garmentType: 'calcas',
    gender: 'Masculino',
    color: 'Azul Escuro',
    size: 'L',
    material: 'Denim Orgânico',
    country: 'Portugal',
    condition: 'Bom',
    price: 35.0,
    originalPrice: 35.0,
    commission: 1.75,
    finalPrice: 36.75,
    sellerName: 'Maria Silva',
    sellerEmail: 'maria.silva@email.com',
    sellerPhone: '+351 912 345 678',
    estimatedWeight: 0.55,
    photo1Url: '/images/Item6.jpeg',
    photo2Url: '/images/Item7.jpeg',
    photo3Url: null,
    status: 'sold',
    publishedAt: new Date('2024-01-17'),
    soldAt: new Date('2024-01-20'),
    impactCo2: '14.4',
    impactWater: '57.8',
    impactEff: '82%',
    aiConfidence: 0.88,
    aiDetection: {
      material: 'denim',
      condition: 'good',
      color: 'dark_blue',
      size: 'L'
    }
  }
];

async function seedAdminTestData() {
  try {
    console.log('🌱 Seeding admin test data...');

    // Limpiar datos existentes (opcional - comentar si no se quiere)
    console.log('🧹 Cleaning existing test data...');
    await prisma.product.deleteMany({
      where: {
        tracking: {
          in: SAMPLE_CONTRIBUTIONS.map(c => c.tracking)
        }
      }
    });
    
    await prisma.contribution.deleteMany({
      where: {
        tracking: {
          in: SAMPLE_CONTRIBUTIONS.map(c => c.tracking)
        }
      }
    });

    // Crear contribuciones de prueba
    console.log('📦 Creating test contributions...');
    const contributions = await Promise.all(
      SAMPLE_CONTRIBUTIONS.map(contributionData =>
        prisma.contribution.create({
          data: {
            ...contributionData,
            fecha: new Date('2024-01-15'),
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
          }
        })
      )
    );

    console.log(`✅ Created ${contributions.length} test contributions`);

    // Crear productos de prueba
    console.log('🛍️ Creating test products...');
    const products = await Promise.all(
      SAMPLE_PRODUCTS.map(productData =>
        prisma.product.create({
          data: {
            ...productData,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
          }
        })
      )
    );

    console.log(`✅ Created ${products.length} test products`);

    // Crear contribuciones adicionales con diferentes estados
    console.log('🔄 Creating additional test scenarios...');
    
    // Contribuciones pendientes
    const pendingContributions = await Promise.all([
      prisma.contribution.create({
        data: {
          tracking: 'INF-2024-009',
          tipo: 'clothing',
          metodo: 'pickup',
          nome: 'test.pending@email.com',
          estado: 'pendiente',
          totalItems: 3,
          detalles: 'Aguardando entrega no ponto de recolha',
          pickupPoint: 'Centro de Vila Real',
          fecha: new Date(),
        }
      }),
      prisma.contribution.create({
        data: {
          tracking: 'INF-2024-010',
          tipo: 'clothing',
          metodo: 'home',
          nome: 'test.home@email.com',
          estado: 'pendiente',
          totalItems: 7,
          detalles: 'Recolha domiciliar agendada',
          fecha: new Date(),
        }
      })
    ]);

    // Contribuciones entregadas pero no verificadas
    const deliveredContributions = await Promise.all([
      prisma.contribution.create({
        data: {
          tracking: 'INF-2024-011',
          tipo: 'clothing',
          metodo: 'pickup',
          nome: 'test.delivered@email.com',
          estado: 'entregado',
          totalItems: 4,
          detalles: 'Entregue no ponto de recolha',
          pickupPoint: 'Biblioteca Municipal',
          fecha: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
        }
      })
    ]);

    // Contribuciones verificadas mas não certificadas
    const verifiedContributions = await Promise.all([
      prisma.contribution.create({
        data: {
          tracking: 'INF-2024-012',
          tipo: 'clothing',
          metodo: 'pickup',
          nome: 'test.verified@email.com',
          estado: 'verificado',
          classification: 'reutilizable',
          destination: 'marketplace',
          decision: 'vender',
          totalItems: 6,
          co2Saved: 15.6,
          waterSaved: 90.0,
          naturalResources: 80,
          verified: true,
          detalles: 'Verificado e pronto para venda',
          pickupPoint: 'Mercado Municipal',
          fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        }
      })
    ]);

    console.log(`✅ Created additional test scenarios:
    - ${pendingContributions.length} pending contributions
    - ${deliveredContributions.length} delivered contributions  
    - ${verifiedContributions.length} verified contributions`);

    // Resumen final
    const totalContributions = await prisma.contribution.count();
    const totalProducts = await prisma.product.count();
    
    console.log('\n📊 Final Summary:');
    console.log(`Total contributions in database: ${totalContributions}`);
    console.log(`Total products in database: ${totalProducts}`);
    
    console.log('\n🎯 Test Scenarios Available:');
    console.log('✅ Pending contributions (pendiente)');
    console.log('✅ Delivered contributions (entregado)');
    console.log('✅ Verified contributions (verificado)');
    console.log('✅ Certified contributions (certificado_disponible)');
    console.log('✅ Products for sale (published)');
    console.log('✅ Sold products (sold)');
    console.log('✅ Different contribution types (clothing, art, recycle, receive)');
    console.log('✅ Different decisions (donar, vender)');
    console.log('✅ Different classifications (reutilizable, reparable, reciclable)');

    console.log('\n🎉 Admin test data seeding completed successfully!');
    console.log('\n🔗 You can now test the admin panel with various scenarios:');
    console.log('- Visit /admin/contributions to see all test data');
    console.log('- Test filtering by different states and types');
    console.log('- Test bulk operations on multiple contributions');
    console.log('- Test product creation from verified contributions');

  } catch (error) {
    console.error('❌ Error seeding admin test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar estadísticas de la base de datos
async function showDatabaseStats() {
  try {
    console.log('\n📈 Database Statistics:');
    
    const stats = await Promise.all([
      prisma.contribution.count(),
      prisma.product.count(),
      prisma.contribution.groupBy({
        by: ['estado'],
        _count: { estado: true }
      }),
      prisma.contribution.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      }),
      prisma.product.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    console.log(`Total contributions: ${stats[0]}`);
    console.log(`Total products: ${stats[1]}`);
    
    console.log('\nContributions by state:');
    stats[2].forEach(state => {
      console.log(`  ${state.estado}: ${state._count.estado}`);
    });
    
    console.log('\nContributions by type:');
    stats[3].forEach(type => {
      console.log(`  ${type.tipo}: ${type._count.tipo}`);
    });
    
    console.log('\nProducts by status:');
    stats[4].forEach(status => {
      console.log(`  ${status.status}: ${status._count.status}`);
    });

  } catch (error) {
    console.error('Error getting database stats:', error);
  }
}

// Ejecutar el seed
if (require.main === module) {
  seedAdminTestData()
    .then(() => showDatabaseStats())
    .catch(console.error);
}

export { seedAdminTestData, showDatabaseStats }; 