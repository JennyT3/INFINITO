import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAdminData() {
  try {
    console.log('🔍 Verifying admin test data...\n');

    // Verificar contribuciones por estado
    console.log('📊 Contributions by State:');
    const states = await prisma.contribution.groupBy({
      by: ['estado'],
      _count: { estado: true }
    });
    
    states.forEach(state => {
      console.log(`  ${state.estado}: ${state._count.estado} contributions`);
    });

    // Verificar contribuciones por tipo
    console.log('\n🎨 Contributions by Type:');
    const types = await prisma.contribution.groupBy({
      by: ['tipo'],
      _count: { tipo: true }
    });
    
    types.forEach(type => {
      console.log(`  ${type.tipo}: ${type._count.tipo} contributions`);
    });

    // Verificar contribuciones por clasificación
    console.log('\n🏷️ Contributions by Classification:');
    const classifications = await prisma.contribution.groupBy({
      by: ['classification'],
      _count: { classification: true }
    });
    
    classifications.forEach(classification => {
      const label = classification.classification || 'No classification';
      console.log(`  ${label}: ${classification._count.classification} contributions`);
    });

    // Verificar contribuciones por decisión
    console.log('\n💭 Contributions by Decision:');
    const decisions = await prisma.contribution.groupBy({
      by: ['decision'],
      _count: { decision: true }
    });
    
    decisions.forEach(decision => {
      const label = decision.decision || 'No decision';
      console.log(`  ${label}: ${decision._count.decision} contributions`);
    });

    // Verificar productos por estado
    console.log('\n🛍️ Products by Status:');
    const productStatuses = await prisma.product.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    productStatuses.forEach(status => {
      console.log(`  ${status.status}: ${status._count.status} products`);
    });

    // Verificar contribuciones certificadas
    console.log('\n✅ Certified Contributions:');
    const certifiedContributionsList = await prisma.contribution.findMany({
      where: {
        estado: 'certificado_disponible'
      },
      select: {
        tracking: true,
        nome: true,
        classification: true,
        destination: true,
        decision: true,
        certificateHash: true
      }
    });

    certifiedContributionsList.forEach(contrib => {
      console.log(`  ${contrib.tracking}: ${contrib.classification} → ${contrib.destination} (${contrib.decision})`);
    });

    // Verificar contribuciones pendientes
    console.log('\n⏳ Pending Contributions:');
    const pendingContributions = await prisma.contribution.findMany({
      where: {
        estado: 'pendiente'
      },
      select: {
        tracking: true,
        nome: true,
        tipo: true,
        metodo: true
      },
      take: 5
    });

    pendingContributions.forEach(contrib => {
      console.log(`  ${contrib.tracking}: ${contrib.tipo} (${contrib.metodo})`);
    });

    // Verificar productos asociados
    console.log('\n🔗 Products with Associated Contributions:');
    const productsWithContributions = await prisma.product.findMany({
      select: {
        tracking: true,
        name: true,
        status: true,
        price: true,
        sellerName: true
      },
      take: 5
    });

    productsWithContributions.forEach(product => {
      console.log(`  ${product.tracking}: ${product.name} - €${product.price} (${product.status})`);
    });

    // Verificar escenarios específicos
    console.log('\n🎯 Specific Test Scenarios:');
    
    const scenarios = [
      { prefix: 'BULK', description: 'Bulk Operations' },
      { prefix: 'CLASS', description: 'Classifications' },
      { prefix: 'TYPE', description: 'Types' },
      { prefix: 'DECISION', description: 'Decisions' },
      { prefix: 'EDGE', description: 'Edge Cases' }
    ];

    for (const scenario of scenarios) {
      const count = await prisma.contribution.count({
        where: {
          tracking: {
            startsWith: scenario.prefix
          }
        }
      });
      console.log(`  ${scenario.description}: ${count} contributions`);
    }

    // Estadísticas generales
    const totalContributions = await prisma.contribution.count();
    const totalProducts = await prisma.product.count();
    const verifiedContributions = await prisma.contribution.count({
      where: { verified: true }
    });
    const certifiedContributions = await prisma.contribution.count({
      where: { estado: 'certificado_disponible' }
    });

    console.log('\n📈 General Statistics:');
    console.log(`  Total Contributions: ${totalContributions}`);
    console.log(`  Total Products: ${totalProducts}`);
    console.log(`  Verified Contributions: ${verifiedContributions}`);
    console.log(`  Certified Contributions: ${certifiedContributions}`);

    // Verificar integridad de datos
    console.log('\n🔍 Data Integrity Check:');
    
    // Verificar que las contribuciones certificadas tienen hash
    const certifiedWithoutHash = await prisma.contribution.count({
      where: {
        estado: 'certificado_disponible',
        certificateHash: null
      }
    });
    
    if (certifiedWithoutHash === 0) {
      console.log('  ✅ All certified contributions have certificate hashes');
    } else {
      console.log(`  ⚠️ ${certifiedWithoutHash} certified contributions without hash`);
    }

    // Verificar que los productos tienen contribuciones asociadas
    const productsWithoutContributions = await prisma.product.count({
      where: {
        tracking: {
          notIn: (await prisma.contribution.findMany({ select: { tracking: true } })).map(c => c.tracking)
        }
      }
    });

    if (productsWithoutContributions === 0) {
      console.log('  ✅ All products have associated contributions');
    } else {
      console.log(`  ⚠️ ${productsWithoutContributions} products without associated contributions`);
    }

    console.log('\n🎉 Admin data verification completed successfully!');
    console.log('\n🚀 Ready for admin panel testing:');
    console.log('  - Visit /admin/contributions');
    console.log('  - Test all filtering options');
    console.log('  - Test bulk operations');
    console.log('  - Test product creation workflows');
    console.log('  - Test certification processes');

  } catch (error) {
    console.error('❌ Error verifying admin data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar contribuciones específicas
async function showSpecificContributions() {
  try {
    console.log('\n🔍 Specific Contributions Details:');
    
    const specificContributions = await prisma.contribution.findMany({
      where: {
        tracking: {
          in: [
            'BULK-001', 'BULK-002', 'BULK-003',
            'CLASS-001', 'CLASS-002', 'CLASS-003',
            'TYPE-ART-001', 'TYPE-RECYCLE-001', 'TYPE-RECEIVE-001',
            'DECISION-SELL-001', 'DECISION-DONATE-001',
            'EDGE-001', 'EDGE-002', 'EDGE-003'
          ]
        }
      },
      select: {
        tracking: true,
        tipo: true,
        estado: true,
        classification: true,
        destination: true,
        decision: true,
        totalItems: true,
        verified: true
      },
      orderBy: { tracking: 'asc' }
    });

    specificContributions.forEach(contrib => {
      console.log(`  ${contrib.tracking}: ${contrib.tipo} | ${contrib.estado} | ${contrib.classification || 'N/A'} | ${contrib.decision || 'N/A'} | ${contrib.totalItems} items | ${contrib.verified ? '✓' : '✗'}`);
    });

  } catch (error) {
    console.error('Error showing specific contributions:', error);
  }
}

// Ejecutar la verificación
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--details')) {
    verifyAdminData()
      .then(() => showSpecificContributions())
      .catch(console.error);
  } else {
    verifyAdminData()
      .catch(console.error);
  }
}

export { verifyAdminData, showSpecificContributions }; 