import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Patrones de tracking codes para identificar datos de prueba
const TEST_PATTERNS = {
  // Datos del script principal
  main: ['INF-2024-', 'TEST-'],
  
  // Datos de escenarios específicos
  scenarios: ['BULK-', 'CLASS-', 'TYPE-', 'DECISION-', 'EDGE-'],
  
  // Datos originales (mantener)
  original: ['INF_1001', 'INF_1002', 'INF_1003', 'INF_1004']
};

async function cleanupTestData(options: {
  scenarios?: boolean;
  main?: boolean;
  all?: boolean;
  dryRun?: boolean;
}) {
  try {
    console.log('🧹 Starting test data cleanup...\n');

    let trackingCodesToDelete: string[] = [];

    // Determinar qué patrones limpiar
    if (options.all) {
      console.log('🗑️ Cleaning ALL test data...');
      trackingCodesToDelete = [
        ...TEST_PATTERNS.main.map(prefix => prefix),
        ...TEST_PATTERNS.scenarios.map(prefix => prefix)
      ];
    } else if (options.scenarios) {
      console.log('🎯 Cleaning specific scenarios only...');
      trackingCodesToDelete = TEST_PATTERNS.scenarios.map(prefix => prefix);
    } else if (options.main) {
      console.log('📦 Cleaning main test data only...');
      trackingCodesToDelete = TEST_PATTERNS.main.map(prefix => prefix);
    } else {
      console.log('❓ No cleanup option specified. Use --all, --scenarios, or --main');
      return;
    }

    // Encontrar contribuciones que coincidan con los patrones
    const allContributions = await prisma.contribution.findMany({
      select: { tracking: true }
    });

    const contributionsToDelete = allContributions.filter(contrib => 
      trackingCodesToDelete.some(pattern => contrib.tracking.startsWith(pattern))
    );

    // Encontrar productos asociados
    const productsToDelete = await prisma.product.findMany({
      where: {
        tracking: {
          in: contributionsToDelete.map(c => c.tracking)
        }
      },
      select: { tracking: true, name: true }
    });

    // Mostrar resumen de lo que se va a eliminar
    console.log('\n📊 Cleanup Summary:');
    console.log(`  Contributions to delete: ${contributionsToDelete.length}`);
    console.log(`  Products to delete: ${productsToDelete.length}`);

    if (contributionsToDelete.length > 0) {
      console.log('\n🗑️ Contributions to be deleted:');
      contributionsToDelete.forEach(contrib => {
        console.log(`  - ${contrib.tracking}`);
      });
    }

    if (productsToDelete.length > 0) {
      console.log('\n🛍️ Products to be deleted:');
      productsToDelete.forEach(product => {
        console.log(`  - ${product.tracking}: ${product.name}`);
      });
    }

    // Si es dry run, no hacer nada más
    if (options.dryRun) {
      console.log('\n🔍 DRY RUN - No data was actually deleted');
      return;
    }

    // Confirmar antes de eliminar (solo si no es dry run)
    console.log('\n⚠️ This will permanently delete the data above.');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    // Esperar 5 segundos para dar tiempo a cancelar
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Eliminar productos primero (por las foreign keys)
    if (productsToDelete.length > 0) {
      console.log('\n🗑️ Deleting products...');
      await prisma.product.deleteMany({
        where: {
          tracking: {
            in: contributionsToDelete.map(c => c.tracking)
          }
        }
      });
      console.log(`✅ Deleted ${productsToDelete.length} products`);
    }

    // Eliminar contribuciones
    if (contributionsToDelete.length > 0) {
      console.log('\n🗑️ Deleting contributions...');
      await prisma.contribution.deleteMany({
        where: {
          tracking: {
            in: contributionsToDelete.map(c => c.tracking)
          }
        }
      });
      console.log(`✅ Deleted ${contributionsToDelete.length} contributions`);
    }

    // Mostrar estadísticas finales
    const finalContributions = await prisma.contribution.count();
    const finalProducts = await prisma.product.count();

    console.log('\n📈 Final Statistics:');
    console.log(`  Remaining contributions: ${finalContributions}`);
    console.log(`  Remaining products: ${finalProducts}`);

    console.log('\n🎉 Test data cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar qué datos de prueba existen
async function showTestData() {
  try {
    console.log('🔍 Showing existing test data...\n');

    const allContributions = await prisma.contribution.findMany({
      select: { tracking: true, tipo: true, estado: true }
    });

    const allProducts = await prisma.product.findMany({
      select: { tracking: true, name: true, status: true }
    });

    // Agrupar por patrones
    const groupedContributions: Record<string, any[]> = {
      'Main Test Data': [],
      'Scenario Test Data': [],
      'Original Data': [],
      'Other': []
    };

    allContributions.forEach(contrib => {
      if (TEST_PATTERNS.main.some(pattern => contrib.tracking.startsWith(pattern))) {
        groupedContributions['Main Test Data'].push(contrib);
      } else if (TEST_PATTERNS.scenarios.some(pattern => contrib.tracking.startsWith(pattern))) {
        groupedContributions['Scenario Test Data'].push(contrib);
      } else if (TEST_PATTERNS.original.some(pattern => contrib.tracking.startsWith(pattern))) {
        groupedContributions['Original Data'].push(contrib);
      } else {
        groupedContributions['Other'].push(contrib);
      }
    });

    // Mostrar contribuciones agrupadas
    Object.entries(groupedContributions).forEach(([group, contributions]) => {
      if (contributions.length > 0) {
        console.log(`\n📦 ${group} (${contributions.length}):`);
        contributions.forEach(contrib => {
          console.log(`  - ${contrib.tracking}: ${contrib.tipo} (${contrib.estado})`);
        });
      }
    });

    // Mostrar productos
    if (allProducts.length > 0) {
      console.log('\n🛍️ Products:');
      allProducts.forEach(product => {
        console.log(`  - ${product.tracking}: ${product.name} (${product.status})`);
      });
    }

    console.log('\n💡 Use --dry-run to see what would be deleted without actually deleting');

  } catch (error) {
    console.error('Error showing test data:', error);
  }
}

// Ejecutar el script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    scenarios: args.includes('--scenarios'),
    main: args.includes('--main'),
    all: args.includes('--all'),
    dryRun: args.includes('--dry-run')
  };

  if (args.includes('--show')) {
    showTestData()
      .then(() => process.exit(0))
      .catch(console.error);
  } else if (options.scenarios || options.main || options.all) {
    cleanupTestData(options)
      .then(() => process.exit(0))
      .catch(console.error);
  } else {
    console.log('🧹 Test Data Cleanup Script');
    console.log('\nUsage:');
    console.log('  --show                    Show existing test data');
    console.log('  --scenarios               Clean scenario test data only');
    console.log('  --main                    Clean main test data only');
    console.log('  --all                     Clean all test data');
    console.log('  --dry-run                 Show what would be deleted without deleting');
    console.log('\nExamples:');
    console.log('  npx tsx scripts/cleanup-test-data.ts --show');
    console.log('  npx tsx scripts/cleanup-test-data.ts --scenarios --dry-run');
    console.log('  npx tsx scripts/cleanup-test-data.ts --all');
  }
}

export { cleanupTestData, showTestData }; 