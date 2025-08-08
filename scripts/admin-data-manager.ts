#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para limpiar todos los datos de prueba
async function cleanAllTestData() {
  console.log('🧹 Cleaning all test data...');
  
  try {
    const [deletedProducts, deletedContributions] = await Promise.all([
      prisma.product.deleteMany({
        where: {
          OR: [
            { tracking: { startsWith: 'TEST-' } },
            { tracking: { startsWith: 'INF-' } },
            { tracking: { startsWith: 'PROD-' } }
          ]
        }
      }),
      prisma.contribution.deleteMany({
        where: {
          OR: [
            { tracking: { startsWith: 'TEST-' } },
            { tracking: { startsWith: 'INF-' } },
            { tracking: { startsWith: 'PEN-' } },
            { tracking: { startsWith: 'DEL-' } },
            { tracking: { startsWith: 'VER-' } },
            { tracking: { startsWith: 'CER-' } },
            { tracking: { startsWith: 'MAR-' } },
            { tracking: { startsWith: 'DON-' } },
            { tracking: { startsWith: 'ART-' } },
            { tracking: { startsWith: 'REC-' } },
            { tracking: { startsWith: 'MIX-' } },
            { tracking: { startsWith: 'MET-' } }
          ]
        }
      })
    ]);
    
    console.log(`✅ Cleaned ${deletedProducts.count} test products and ${deletedContributions.count} test contributions`);
    return { products: deletedProducts.count, contributions: deletedContributions.count };
  } catch (error) {
    console.error('❌ Error cleaning test data:', error);
    throw error;
  }
}

// Función para limpiar solo datos de testing
async function cleanTestingData() {
  console.log('🧹 Cleaning testing data only...');
  
  try {
    const [deletedProducts, deletedContributions] = await Promise.all([
      prisma.product.deleteMany({
        where: { tracking: { startsWith: 'TEST-' } }
      }),
      prisma.contribution.deleteMany({
        where: { tracking: { startsWith: 'TEST-' } }
      })
    ]);
    
    console.log(`✅ Cleaned ${deletedProducts.count} testing products and ${deletedContributions.count} testing contributions`);
    return { products: deletedProducts.count, contributions: deletedContributions.count };
  } catch (error) {
    console.error('❌ Error cleaning testing data:', error);
    throw error;
  }
}

// Función para verificar integridad de datos
async function verifyDataIntegrity() {
  console.log('🔍 Verifying data integrity...');
  
  try {
    // Verificar contribuciones sin productos asociados
    const contributionsWithoutProducts = await prisma.contribution.findMany({
      where: {
        AND: [
          { destination: 'marketplace' },
          { decision: 'vender' },
          {
            NOT: {
              tracking: {
                in: await prisma.product.findMany({
                  select: { tracking: true }
                }).then(products => products.map(p => p.tracking))
              }
            }
          }
        ]
      }
    });
    
    // Verificar productos sin contribuciones asociadas
    const productsWithoutContributions = await prisma.product.findMany({
      where: {
        NOT: {
          tracking: {
            in: await prisma.contribution.findMany({
              where: { destination: 'marketplace' },
              select: { tracking: true }
            }).then(contribs => contribs.map(c => c.tracking))
          }
        }
      }
    });
    
    // Verificar certificados sin contribuciones
    const certificatesWithoutContributions = await prisma.contribution.findMany({
      where: {
        AND: [
          { certificateHash: { not: null } },
          { estado: { not: 'certificado_disponible' } }
        ]
      }
    });
    
    console.log('\n📊 Data Integrity Report:');
    console.log(`  - Contributions without products: ${contributionsWithoutProducts.length}`);
    console.log(`  - Products without contributions: ${productsWithoutContributions.length}`);
    console.log(`  - Certificates with wrong status: ${certificatesWithoutContributions.length}`);
    
    if (contributionsWithoutProducts.length > 0) {
      console.log('\n⚠️  Contributions without products:');
      contributionsWithoutProducts.slice(0, 5).forEach(c => {
        console.log(`    - ${c.tracking} (${c.tipo})`);
      });
    }
    
    if (productsWithoutContributions.length > 0) {
      console.log('\n⚠️  Products without contributions:');
      productsWithoutContributions.slice(0, 5).forEach(p => {
        console.log(`    - ${p.tracking} (${p.name})`);
      });
    }
    
    return {
      contributionsWithoutProducts: contributionsWithoutProducts.length,
      productsWithoutContributions: productsWithoutContributions.length,
      certificatesWithoutContributions: certificatesWithoutContributions.length
    };
  } catch (error) {
    console.error('❌ Error verifying data integrity:', error);
    throw error;
  }
}

// Función para mostrar estadísticas detalladas
async function showDetailedStats() {
  console.log('📊 Generating detailed statistics...');
  
  try {
    // Estadísticas generales
    const [totalContributions, totalProducts] = await Promise.all([
      prisma.contribution.count(),
      prisma.product.count()
    ]);
    
    console.log('\n📈 General Statistics:');
    console.log(`  - Total Contributions: ${totalContributions}`);
    console.log(`  - Total Products: ${totalProducts}`);
    
    if (totalContributions > 0) {
      // Estadísticas por estado
      const stateStats = await prisma.contribution.groupBy({
        by: ['estado'],
        _count: { estado: true }
      });
      
      console.log('\n🏷️ Contributions by State:');
      stateStats.forEach(stat => {
        console.log(`  - ${stat.estado}: ${stat._count.estado}`);
      });
      
      // Estadísticas por tipo
      const typeStats = await prisma.contribution.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      });
      
      console.log('\n🎨 Contributions by Type:');
      typeStats.forEach(stat => {
        console.log(`  - ${stat.tipo}: ${stat._count.tipo}`);
      });
      
      // Estadísticas por clasificación
      const classificationStats = await prisma.contribution.groupBy({
        by: ['classification'],
        _count: { classification: true }
      });
      
      console.log('\n🏷️ Contributions by Classification:');
      classificationStats.forEach(stat => {
        console.log(`  - ${stat.classification || 'Not classified'}: ${stat._count.classification}`);
      });
      
      // Estadísticas por destino
      const destinationStats = await prisma.contribution.groupBy({
        by: ['destination'],
        _count: { destination: true }
      });
      
      console.log('\n🎯 Contributions by Destination:');
      destinationStats.forEach(stat => {
        console.log(`  - ${stat.destination || 'Not assigned'}: ${stat._count.destination}`);
      });
      
      // Estadísticas por método
      const methodStats = await prisma.contribution.groupBy({
        by: ['metodo'],
        _count: { metodo: true }
      });
      
      console.log('\n🚚 Contributions by Method:');
      methodStats.forEach(stat => {
        console.log(`  - ${stat.metodo}: ${stat._count.metodo}`);
      });
      
      // Estadísticas de certificados
      const certificateStats = await prisma.contribution.groupBy({
        by: ['certificateHash'],
        _count: { certificateHash: true }
      });
      
      console.log('\n🏆 Certificate Statistics:');
      const withCertificates = certificateStats.find(s => s.certificateHash !== null)?._count.certificateHash || 0;
      const withoutCertificates = certificateStats.find(s => s.certificateHash === null)?._count.certificateHash || 0;
      console.log(`  - With certificates: ${withCertificates}`);
      console.log(`  - Without certificates: ${withoutCertificates}`);
      
      // Estadísticas de verificación
      const verifiedStats = await prisma.contribution.groupBy({
        by: ['verified'],
        _count: { verified: true }
      });
      
      console.log('\n✅ Verification Statistics:');
      verifiedStats.forEach(stat => {
        console.log(`  - ${stat.verified ? 'Verified' : 'Not verified'}: ${stat._count.verified}`);
      });
    }
    
    if (totalProducts > 0) {
      // Estadísticas de productos
      const productStatusStats = await prisma.product.groupBy({
        by: ['status'],
        _count: { status: true }
      });
      
      console.log('\n🛍️ Products by Status:');
      productStatusStats.forEach(stat => {
        console.log(`  - ${stat.status}: ${stat._count.status}`);
      });
      
      // Estadísticas por tipo de prenda
      const garmentTypeStats = await prisma.product.groupBy({
        by: ['garmentType'],
        _count: { garmentType: true }
      });
      
      console.log('\n👕 Products by Garment Type:');
      garmentTypeStats.forEach(stat => {
        console.log(`  - ${stat.garmentType}: ${stat._count.garmentType}`);
      });
      
      // Estadísticas por material
      const materialStats = await prisma.product.groupBy({
        by: ['material'],
        _count: { material: true }
      });
      
      console.log('\n🧵 Products by Material:');
      materialStats.forEach(stat => {
        console.log(`  - ${stat.material}: ${stat._count.material}`);
      });
      
      // Estadísticas por color
      const colorStats = await prisma.product.groupBy({
        by: ['color'],
        _count: { color: true }
      });
      
      console.log('\n🎨 Products by Color:');
      colorStats.forEach(stat => {
        console.log(`  - ${stat.color}: ${stat._count.color}`);
      });
      
      // Estadísticas por país
      const countryStats = await prisma.product.groupBy({
        by: ['country'],
        _count: { country: true }
      });
      
      console.log('\n🌍 Products by Country:');
      countryStats.forEach(stat => {
        console.log(`  - ${stat.country}: ${stat._count.country}`);
      });
      
      // Estadísticas de precios
      const priceStats = await prisma.product.aggregate({
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
        _count: { price: true }
      });
      
      console.log('\n💰 Price Statistics:');
      console.log(`  - Average price: €${priceStats._avg.price?.toFixed(2) || 'N/A'}`);
      console.log(`  - Minimum price: €${priceStats._min.price || 'N/A'}`);
      console.log(`  - Maximum price: €${priceStats._max.price || 'N/A'}`);
      console.log(`  - Total products with prices: ${priceStats._count.price}`);
    }
    
  } catch (error) {
    console.error('❌ Error generating statistics:', error);
    throw error;
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🔧 INFINITO Admin Data Manager

Usage: npm run admin:data [command] [options]

Commands:
  clean:all        - Clean all test data (TEST-, INF-, PROD- prefixes)
  clean:test       - Clean only testing data (TEST- prefix)
  verify           - Verify data integrity
  stats            - Show detailed statistics
  help             - Show this help message

Options:
  --help, -h       - Show help for specific command

Examples:
  npm run admin:data clean:all
  npm run admin:data clean:test
  npm run admin:data verify
  npm run admin:data stats
  npm run admin:data help

Data Management Features:
  - Clean test data with different scopes
  - Verify data integrity and relationships
  - Generate comprehensive statistics
  - Identify orphaned records
  - Validate certificate consistency
  `);
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'help' || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  try {
    switch (command) {
      case 'clean:all':
        await cleanAllTestData();
        break;
        
      case 'clean:test':
        await cleanTestingData();
        break;
        
      case 'verify':
        await verifyDataIntegrity();
        break;
        
      case 'stats':
        await showDetailedStats();
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.log('Use "npm run admin:data help" for available commands');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error executing command:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { cleanAllTestData, cleanTestingData, verifyDataIntegrity, showDetailedStats }; 