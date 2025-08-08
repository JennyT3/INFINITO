#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { seedAdminComplete } from './seed-admin-complete';

const prisma = new PrismaClient();

// Configuraciones predefinidas
const PRESETS = {
  minimal: {
    contributions: 10,
    products: 5,
    description: 'Minimal dataset for basic testing'
  },
  standard: {
    contributions: 25,
    products: 15,
    description: 'Standard dataset for regular testing'
  },
  comprehensive: {
    contributions: 50,
    products: 30,
    description: 'Comprehensive dataset for full testing'
  },
  stress: {
    contributions: 100,
    products: 60,
    description: 'Stress test dataset for performance testing'
  }
};

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🌱 INFINITO Admin Seed Script

Usage: npm run seed:admin [preset] [options]

Presets:
  minimal        - ${PRESETS.minimal.description} (${PRESETS.minimal.contributions} contributions, ${PRESETS.minimal.products} products)
  standard       - ${PRESETS.standard.description} (${PRESETS.standard.contributions} contributions, ${PRESETS.standard.products} products)
  comprehensive  - ${PRESETS.comprehensive.description} (${PRESETS.comprehensive.contributions} contributions, ${PRESETS.comprehensive.products} products)
  stress         - ${PRESETS.stress.description} (${PRESETS.stress.contributions} contributions, ${PRESETS.stress.products} products)

Options:
  --clean        - Clean existing data before seeding
  --help         - Show this help message
  --stats        - Show database statistics only
  --verify       - Verify data integrity after seeding

Examples:
  npm run seed:admin minimal
  npm run seed:admin standard --clean
  npm run seed:admin comprehensive --clean --verify
  npm run seed:admin --stats

Quick Commands:
  npm run seed:admin:minimal     - Quick minimal seed
  npm run seed:admin:standard    - Quick standard seed
  npm run seed:admin:full        - Quick comprehensive seed
  npm run seed:admin:clean       - Clean all test data
  npm run seed:admin:stats       - Show statistics only
`);
}

// Función para limpiar datos
async function cleanData() {
  console.log('🧹 Cleaning all test data...');
  
  try {
    const [deletedProducts, deletedContributions] = await Promise.all([
      prisma.product.deleteMany(),
      prisma.contribution.deleteMany()
    ]);
    
    console.log(`✅ Cleaned ${deletedProducts.count} products and ${deletedContributions.count} contributions`);
  } catch (error) {
    console.error('❌ Error cleaning data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar estadísticas
async function showStats() {
  console.log('📊 Database Statistics:');
  
  try {
    const [contributions, products] = await Promise.all([
      prisma.contribution.count(),
      prisma.product.count()
    ]);
    
    console.log(`\n📈 Total Records:`);
    console.log(`  - Contributions: ${contributions}`);
    console.log(`  - Products: ${products}`);
    
    if (contributions > 0) {
      // Estadísticas por estado
      const stateStats = await prisma.contribution.groupBy({
        by: ['estado'],
        _count: { estado: true }
      });
      
      console.log(`\n🏷️ Contributions by State:`);
      stateStats.forEach(stat => {
        console.log(`  - ${stat.estado}: ${stat._count.estado}`);
      });
      
      // Estadísticas por tipo
      const typeStats = await prisma.contribution.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      });
      
      console.log(`\n🎨 Contributions by Type:`);
      typeStats.forEach(stat => {
        console.log(`  - ${stat.tipo}: ${stat._count.tipo}`);
      });
      
      // Estadísticas por clasificación
      const classificationStats = await prisma.contribution.groupBy({
        by: ['classification'],
        _count: { classification: true }
      });
      
      console.log(`\n🏷️ Contributions by Classification:`);
      classificationStats.forEach(stat => {
        console.log(`  - ${stat.classification || 'Not classified'}: ${stat._count.classification}`);
      });
    }
    
    if (products > 0) {
      // Estadísticas de productos
      const productStatusStats = await prisma.product.groupBy({
        by: ['status'],
        _count: { status: true }
      });
      
      console.log(`\n🛍️ Products by Status:`);
      productStatusStats.forEach(stat => {
        console.log(`  - ${stat.status}: ${stat._count.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error getting statistics:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para verificar integridad de datos
async function verifyData() {
  console.log('🔍 Verifying data integrity...');
  
  try {
    const [contributions, products] = await Promise.all([
      prisma.contribution.findMany(),
      prisma.product.findMany()
    ]);
    
    let issues = 0;
    
    // Verificar contribuciones
    contributions.forEach((contrib, index) => {
      if (!contrib.tracking) {
        console.log(`⚠️  Contribution ${index + 1}: Missing tracking`);
        issues++;
      }
      
      if (contrib.estado === 'certificado_disponible' && !contrib.certificateHash) {
        console.log(`⚠️  Contribution ${contrib.tracking}: Certified but no certificate hash`);
        issues++;
      }
      
      if (contrib.estado !== 'pendiente' && !contrib.classification) {
        console.log(`⚠️  Contribution ${contrib.tracking}: Processed but no classification`);
        issues++;
      }
    });
    
    // Verificar productos
    products.forEach((product, index) => {
      if (!product.tracking) {
        console.log(`⚠️  Product ${index + 1}: Missing tracking`);
        issues++;
      }
      
      if (!product.photo1Url || !product.photo2Url) {
        console.log(`⚠️  Product ${product.name}: Missing required photos`);
        issues++;
      }
    });
    
    if (issues === 0) {
      console.log('✅ Data integrity verification passed!');
    } else {
      console.log(`⚠️  Found ${issues} data integrity issues`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  // Mostrar ayuda
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // Solo mostrar estadísticas
  if (args.includes('--stats')) {
    await showStats();
    return;
  }
  
  // Solo limpiar datos
  if (args.includes('--clean') && args.length === 1) {
    await cleanData();
    return;
  }
  
  // Obtener preset
  const preset = args[0] || 'standard';
  
  if (!PRESETS[preset as keyof typeof PRESETS]) {
    console.error(`❌ Unknown preset: ${preset}`);
    showHelp();
    process.exit(1);
  }
  
  const config = PRESETS[preset as keyof typeof PRESETS];
  const shouldClean = args.includes('--clean');
  const shouldVerify = args.includes('--verify');
  
  console.log(`🚀 Starting ${preset} seed...`);
  console.log(`📋 Configuration: ${config.description}`);
  console.log(`   - Contributions: ${config.contributions}`);
  console.log(`   - Products: ${config.products}`);
  console.log(`   - Clean existing: ${shouldClean ? 'Yes' : 'No'}`);
  console.log(`   - Verify data: ${shouldVerify ? 'Yes' : 'No'}`);
  
  try {
    // Modificar configuración global
    const { CONFIG } = await import('./seed-admin-complete');
    CONFIG.contributions.total = config.contributions;
    CONFIG.products.total = config.products;
    
    // Ejecutar seed
    await seedAdminComplete();
    
    // Verificar datos si se solicita
    if (shouldVerify) {
      await verifyData();
    }
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit /admin/contributions to see the contributions');
    console.log('2. Visit /admin/products to see the products');
    console.log('3. Test different filters and search functionality');
    console.log('4. Test bulk actions and individual operations');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
} 