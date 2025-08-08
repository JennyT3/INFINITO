import { PrismaClient } from '@prisma/client';
import { 
  exportContributionsToCSV, 
  exportContributionsToPDF, 
  exportProductsToCSV, 
  exportProductsToPDF,
  exportExecutiveSummaryToPDF 
} from '../lib/export-utils';

const prisma = new PrismaClient();

async function testExports() {
  try {
    console.log('🚀 Testing export functionality...\n');

    // Cargar datos de prueba
    console.log('📊 Loading test data...');
    const contributions = await prisma.contribution.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    const products = await prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Loaded ${contributions.length} contributions and ${products.length} products\n`);

    // Test 1: Exportar contribuciones a CSV
    console.log('📄 Test 1: Exporting contributions to CSV...');
    const csvResult = exportContributionsToCSV(contributions, {
      fileName: 'test_contributions.csv'
    });
    console.log(`✅ CSV Export completed: ${csvResult.fileName} (${csvResult.recordCount} records, ${csvResult.fileSize} bytes)\n`);

    // Test 2: Exportar contribuciones a PDF
    console.log('📄 Test 2: Exporting contributions to PDF...');
    const pdfResult = exportContributionsToPDF(contributions, {
      fileName: 'test_contributions.pdf'
    });
    console.log(`✅ PDF Export completed: ${pdfResult.fileName} (${pdfResult.recordCount} records)\n`);

    // Test 3: Exportar productos a CSV
    console.log('📄 Test 3: Exporting products to CSV...');
    const productsCsvResult = exportProductsToCSV(products, {
      fileName: 'test_products.csv'
    });
    console.log(`✅ CSV Export completed: ${productsCsvResult.fileName} (${productsCsvResult.recordCount} records, ${productsCsvResult.fileSize} bytes)\n`);

    // Test 4: Exportar productos a PDF
    console.log('📄 Test 4: Exporting products to PDF...');
    const productsPdfResult = exportProductsToPDF(products, {
      fileName: 'test_products.pdf'
    });
    console.log(`✅ PDF Export completed: ${productsPdfResult.fileName} (${productsPdfResult.recordCount} records)\n`);

    // Test 5: Exportar resumen ejecutivo
    console.log('📄 Test 5: Exporting executive summary...');
    const summaryResult = exportExecutiveSummaryToPDF(contributions, products, {
      fileName: 'test_executive_summary.pdf'
    });
    console.log(`✅ Executive Summary Export completed: ${summaryResult.fileName}\n`);

    // Estadísticas finales
    console.log('📈 Export Statistics:');
    console.log(`   • Contributions: ${contributions.length}`);
    console.log(`   • Products: ${products.length}`);
    console.log(`   • Total CO2 Saved: ${contributions.reduce((sum, c) => sum + (c.co2Saved || 0), 0).toFixed(2)} kg`);
    console.log(`   • Total Water Saved: ${contributions.reduce((sum, c) => sum + (c.waterSaved || 0), 0).toFixed(0)} L`);
    console.log(`   • Total Market Value: €${products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}`);

    console.log('\n🎉 All export tests completed successfully!');
    console.log('📁 Check your downloads folder for the exported files.');

  } catch (error) {
    console.error('❌ Error during export testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el test
testExports(); 