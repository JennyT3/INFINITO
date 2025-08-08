#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { 
  notifyProductPublished, 
  notifyProductSold, 
  notifyContributionProcessed, 
  notifyContributionVerified, 
  notifyContributionCertified, 
  notifyBulkActionCompleted, 
  notifyExportCompleted, 
  notifyError,
  notifyEnvironmentalImpact,
  notifyMarketplaceUpdate,
  notifyBlockchainCertificate
} from '../lib/notifications';

const prisma = new PrismaClient();

// Función para simular notificaciones
async function testNotifications() {
  console.log('🔔 Testing Notification System...\n');

  try {
    // Obtener algunos datos de prueba
    const contributions = await prisma.contribution.findMany({ take: 3 });
    const products = await prisma.product.findMany({ take: 3 });

    console.log('📋 Test Scenarios:');

    // 1. Notificación de producto publicado
    if (products.length > 0) {
      const product = products[0];
      console.log('1. Product Published Notification');
      notifyProductPublished(
        product.name,
        product.price,
        product.tracking
      );
    }

    // 2. Notificación de producto vendido
    if (products.length > 1) {
      const product = products[1];
      console.log('2. Product Sold Notification');
      notifyProductSold(
        product.name,
        product.price,
        product.tracking
      );
    }

    // 3. Notificación de contribución procesada
    if (contributions.length > 0) {
      const contrib = contributions[0];
      console.log('3. Contribution Processed Notification');
      notifyContributionProcessed(
        contrib.tracking,
        contrib.classification || 'reutilizable',
        contrib.destination || 'marketplace',
        contrib.totalItems || 5
      );
    }

    // 4. Notificación de contribución verificada
    if (contributions.length > 1) {
      const contrib = contributions[1];
      console.log('4. Contribution Verified Notification');
      notifyContributionVerified(
        contrib.tracking,
        {
          co2: contrib.co2Saved || 2.5,
          water: contrib.waterSaved || 50,
          resources: contrib.naturalResources || 15
        }
      );
    }

    // 5. Notificación de certificado generado
    if (contributions.length > 2) {
      const contrib = contributions[2];
      console.log('5. Certificate Generated Notification');
      notifyContributionCertified(
        contrib.tracking,
        contrib.certificateHash || 'CERT_TEST_123',
        {
          co2: contrib.co2Saved || 3.0,
          water: contrib.waterSaved || 75,
          resources: contrib.naturalResources || 20
        }
      );
    }

    // 6. Notificación de acción masiva
    console.log('6. Bulk Action Notification');
    notifyBulkActionCompleted(
      'approve',
      15,
      'contributions'
    );

    // 7. Notificación de exportación
    console.log('7. Export Completed Notification');
    notifyExportCompleted(
      'products',
      25,
      'products_2024-01-15.csv'
    );

    // 8. Notificación de impacto ambiental
    console.log('8. Environmental Impact Notification');
    notifyEnvironmentalImpact(
      'INF_TEST_001',
      {
        co2: 4.2,
        water: 120,
        resources: 30
      },
      8
    );

    // 9. Notificación de actualización del marketplace
    console.log('9. Marketplace Update Notification');
    notifyMarketplaceUpdate(
      'product_added',
      'Vintage Denim Jacket',
      'INF_TEST_002',
      45.00
    );

    // 10. Notificación de certificado blockchain
    console.log('10. Blockchain Certificate Notification');
    notifyBlockchainCertificate(
      'INF_TEST_003',
      '0x1234567890abcdef1234567890abcdef12345678',
      new Date()
    );

    // 11. Notificación de error
    console.log('11. Error Notification');
    notifyError(
      'process contribution',
      'Database connection timeout',
      'INF_TEST_004'
    );

    console.log('\n✅ All notification tests completed!');
    console.log('\n📝 Note: These are toast notifications that will appear in the UI.');
    console.log('   Check the browser console for notification logs.');

  } catch (error) {
    console.error('❌ Error testing notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🔔 INFINITO Notification System Test

Usage: npm run test:notifications

This script demonstrates all notification types:
- Product published/sold notifications
- Contribution processing notifications
- Certificate generation notifications
- Bulk action notifications
- Export completion notifications
- Environmental impact notifications
- Marketplace update notifications
- Blockchain certificate notifications
- Error notifications

The notifications will appear as toast messages in the UI.
  `);
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  await testNotifications();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
} 