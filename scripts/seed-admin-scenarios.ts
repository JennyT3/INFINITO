#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { calculateEnvironmentalImpact } from '../lib/utils';

const prisma = new PrismaClient();

// Escenarios específicos para testing del flujo admin
const ADMIN_SCENARIOS = {
  // Escenario 1: Contribuciones pendientes (sin procesar)
  pending_contributions: {
    name: 'Pending Contributions',
    description: 'Contribuciones en estado pendiente para testing de procesamiento',
    count: 20,
    config: {
      estado: 'pendiente',
      classification: null,
      destination: null,
      decision: null,
      verified: false,
      certificateHash: null
    }
  },
  
  // Escenario 2: Contribuciones entregadas (listas para verificación)
  delivered_contributions: {
    name: 'Delivered Contributions',
    description: 'Contribuciones entregadas listas para verificación',
    count: 15,
    config: {
      estado: 'entregado',
      verified: false,
      certificateHash: null
    }
  },
  
  // Escenario 3: Contribuciones verificadas (listas para clasificación)
  verified_contributions: {
    name: 'Verified Contributions',
    description: 'Contribuciones verificadas listas para clasificación',
    count: 25,
    config: {
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 4: Contribuciones certificadas (con blockchain)
  certified_contributions: {
    name: 'Certified Contributions',
    description: 'Contribuciones con certificados blockchain',
    count: 10,
    config: {
      estado: 'certificado_disponible',
      verified: true,
      certificateHash: true
    }
  },
  
  // Escenario 5: Contribuciones para marketplace (con productos)
  marketplace_contributions: {
    name: 'Marketplace Contributions',
    description: 'Contribuciones destinadas al marketplace con productos',
    count: 18,
    config: {
      destination: 'marketplace',
      decision: 'vender',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 6: Contribuciones para donación
  donation_contributions: {
    name: 'Donation Contributions',
    description: 'Contribuciones destinadas a donación',
    count: 12,
    config: {
      destination: 'donacion',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 7: Contribuciones para artistas
  artist_contributions: {
    name: 'Artist Contributions',
    description: 'Contribuciones para proyectos artísticos',
    count: 8,
    config: {
      destination: 'artistas',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 8: Contribuciones para reciclaje
  recycling_contributions: {
    name: 'Recycling Contributions',
    description: 'Contribuciones para reciclaje',
    count: 10,
    config: {
      destination: 'reciclaje',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 9: Mix de estados y tipos
  mixed_scenarios: {
    name: 'Mixed States and Types',
    description: 'Mezcla de diferentes estados, tipos y clasificaciones',
    count: 30,
    config: {
      mixed: true
    }
  },
  
  // Escenario 10: Contribuciones con diferentes métodos
  method_variations: {
    name: 'Method Variations',
    description: 'Contribuciones con diferentes métodos de entrega',
    count: 15,
    config: {
      method_mix: true
    }
  }
};

// Configuración de productos por escenario
const PRODUCT_SCENARIOS = {
  // Productos publicados en marketplace
  published_products: {
    name: 'Published Products',
    description: 'Productos publicados en el marketplace',
    count: 25,
    config: {
      status: 'published',
      hasTracking: true
    }
  },
  
  // Productos vendidos
  sold_products: {
    name: 'Sold Products',
    description: 'Productos que han sido vendidos',
    count: 12,
    config: {
      status: 'sold',
      hasTracking: true
    }
  },
  
  // Productos en borrador
  draft_products: {
    name: 'Draft Products',
    description: 'Productos en estado borrador',
    count: 8,
    config: {
      status: 'draft',
      hasTracking: true
    }
  },
  
  // Productos inactivos
  inactive_products: {
    name: 'Inactive Products',
    description: 'Productos inactivos',
    count: 5,
    config: {
      status: 'inactive',
      hasTracking: true
    }
  },
  
  // Productos sin contribución asociada
  standalone_products: {
    name: 'Standalone Products',
    description: 'Productos sin contribución asociada',
    count: 10,
    config: {
      status: 'published',
      hasTracking: false
    }
  }
};

// Generadores de datos realistas
const generators = {
  // Generar tracking único por escenario
  tracking: (scenario: string, index: number) => {
    const scenarioPrefix = scenario.toUpperCase().replace(/_/g, '').substring(0, 3);
    return `${scenarioPrefix}-${String(index + 1).padStart(3, '0')}`;
  },
  
  // Generar email realista
  email: (index: number) => {
    const names = ['maria', 'joao', 'ana', 'carlos', 'sofia', 'pedro', 'lucia', 'miguel', 'beatriz', 'tiago'];
    const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const name = names[index % names.length];
    const domain = domains[index % domains.length];
    return `${name}.${index}@${domain}`;
  },
  
  // Generar detalles realistas por tipo y clasificación
  details: (type: string, classification: string) => {
    const details = {
      clothing: {
        reutilizable: [
          'Roupa em excelente estado para reutilização',
          'Camisetas de algodão orgânico em perfeitas condições',
          'Calças jeans de marca pouco usadas',
          'Vestidos elegantes para ocasiões especiais',
          'Casacos de inverno bem conservados'
        ],
        reparable: [
          'Roupa com pequenos defeitos que podem ser reparados',
          'Camisetas com pequenos rasgos facilmente reparáveis',
          'Calças com botões soltos que precisam de costura',
          'Vestidos com zíper quebrado mas tecido em bom estado',
          'Casacos com forro solto mas exterior perfeito'
        ],
        reciclable: [
          'Roupa danificada adequada para reciclagem',
          'Tecidos mistos para reciclagem industrial',
          'Roupa com manchas permanentes mas material aproveitável',
          'Tecidos sintéticos para reciclagem',
          'Materiais têxteis para reciclagem'
        ]
      },
      art: {
        reutilizable: [
          'Tecidos para projetos artísticos',
          'Retalhos coloridos para colagens',
          'Materiais têxteis para instalações',
          'Tecidos com texturas interessantes',
          'Materiais para workshops de arte'
        ],
        reparable: [
          'Materiais que precisam de limpeza para arte',
          'Tecidos com pequenos defeitos para projetos artísticos',
          'Retalhos que podem ser aproveitados',
          'Materiais para técnicas de upcycling',
          'Tecidos para arte sustentável'
        ],
        reciclable: [
          'Tecidos para reciclagem artística',
          'Materiais para projetos sustentáveis',
          'Retalhos para reciclagem criativa',
          'Tecidos para instalações sobre sustentabilidade',
          'Materiais para workshops de reciclagem'
        ]
      },
      recycle: {
        reutilizable: [
          'Materiais têxteis para reutilização',
          'Tecidos em bom estado para reuso',
          'Materiais para projetos de upcycling',
          'Tecidos para reutilização industrial',
          'Materiais para artesanato'
        ],
        reparable: [
          'Materiais que pueden ser reparados',
          'Tecidos com pequenos defeitos reparáveis',
          'Materiais para técnicas de reparação',
          'Tecidos para projetos de restauração',
          'Materiais para workshops de reparação'
        ],
        reciclable: [
          'Materiais para reciclagem industrial',
          'Tecidos para reciclagem',
          'Materiais para reciclagem artística',
          'Tecidos para projetos sustentáveis',
          'Materiais para workshops de reciclagem'
        ]
      },
      receive: {
        reutilizable: [
          'Roupa doada em bom estado',
          'Tecidos doados em excelente condição',
          'Materiais doados para reutilização',
          'Roupa doada para reuso',
          'Tecidos doados para projetos'
        ],
        reparable: [
          'Roupa doada que precisa de reparos',
          'Tecidos doados com pequenos defeitos',
          'Materiais doados para reparação',
          'Roupa doada para restauração',
          'Tecidos doados para workshops'
        ],
        reciclable: [
          'Materiais doados para reciclagem',
          'Tecidos doados para reciclagem',
          'Roupa doada para reciclagem',
          'Materiais doados para projetos sustentáveis',
          'Tecidos doados para workshops de reciclagem'
        ]
      }
    };
    
    const typeDetails = details[type as keyof typeof details];
    if (!typeDetails) return 'Detalhes da contribuição';
    
    const classificationDetails = typeDetails[classification as keyof typeof typeDetails];
    if (!classificationDetails) return 'Detalhes da contribuição';
    
    return classificationDetails[Math.floor(Math.random() * classificationDetails.length)];
  },
  
  // Generar impacto ambiental
  environmentalImpact: (totalItems: number) => {
    const baseWeight = totalItems * 0.3;
    return calculateEnvironmentalImpact(baseWeight);
  },
  
  // Generar datos de producto
  productData: (tracking: string, index: number, scenario: string) => {
    const garmentTypes = ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'accessories'];
    const materials = ['cotton', 'polyester', 'denim', 'silk', 'wool', 'linen'];
    const colors = ['blue', 'red', 'green', 'black', 'white', 'yellow', 'purple', 'orange'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = ['excellent', 'good', 'fair', 'poor'];
    const countries = ['Portugal', 'Spain', 'Italy', 'France', 'Germany', 'UK'];
    
    const garmentType = garmentTypes[Math.floor(Math.random() * garmentTypes.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    
    const names = [
      `${garmentType.charAt(0).toUpperCase() + garmentType.slice(1)} ${material}`,
      `${color.charAt(0).toUpperCase() + color.slice(1)} ${garmentType}`,
      `${material.charAt(0).toUpperCase() + material.slice(1)} ${garmentType}`,
      `${condition.charAt(0).toUpperCase() + condition.slice(1)} ${garmentType}`,
      `${country} ${garmentType}`,
      `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} ${garmentType}`
    ];
    
    const originalPrice = Math.floor(Math.random() * 50) + 10; // 10-60 euros
    const commission = parseFloat((originalPrice * 0.05).toFixed(2)); // 5% commission
    const finalPrice = parseFloat((originalPrice + commission).toFixed(2));
    
    return {
      name: names[Math.floor(Math.random() * names.length)],
      garmentType,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      color,
      size,
      material,
      country,
      condition,
      price: finalPrice,
      originalPrice,
      commission,
      finalPrice,
      tracking,
      sellerName: generators.email(index),
      sellerEmail: generators.email(index),
      sellerPhone: `+351 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      estimatedWeight: Math.random() * 2 + 0.1,
      standardImpact: JSON.stringify({
        co2: Math.random() * 10 + 2,
        water: Math.random() * 100 + 20,
        resources: Math.floor(Math.random() * 50) + 10
      }),
      aiDetection: JSON.stringify({
        material: material,
        condition: condition,
        confidence: parseFloat((Math.random() * 0.2 + 0.7).toFixed(2))
      }),
      aiConfidence: parseFloat((Math.random() * 0.2 + 0.7).toFixed(2)),
      photo1Url: `https://picsum.photos/seed/${tracking}-1/600/800`,
      photo2Url: `https://picsum.photos/seed/${tracking}-2/600/800`,
      photo3Url: Math.random() > 0.7 ? `https://picsum.photos/seed/${tracking}-3/600/800` : null,
      impactCo2: `${(Math.random() * 10 + 2).toFixed(1)} kg CO2`,
      impactWater: `${(Math.random() * 100 + 20).toFixed(0)} L`,
      impactEff: `${(Math.floor(Math.random() * 50) + 10).toFixed(0)}%`
    };
  }
};

// Función para crear contribuciones de un escenario
async function createScenarioContributions(scenarioKey: string, scenario: any) {
  console.log(`\n🌱 Creating ${scenario.name}...`);
  console.log(`📋 ${scenario.description}`);
  
  const contributions = [];
  const types = ['clothing', 'art', 'recycle', 'receive'];
  const classifications = ['reutilizable', 'reparable', 'reciclable'];
  const destinations = ['marketplace', 'donacion', 'artistas', 'reciclaje'];
  const decisions = ['donar', 'vender'];
  const methods = ['pickup', 'home'];
  const pickupPoints = [
    'Centro de Vila Real',
    'Biblioteca Municipal',
    'Mercado Municipal',
    'Parque da Cidade',
    'Estação de Comboios',
    'Centro Comercial',
    'Universidade de Trás-os-Montes',
    'Hospital Regional'
  ];
  
  for (let i = 0; i < scenario.count; i++) {
    const type = types[i % types.length];
    const classification = scenario.config.mixed ? classifications[i % classifications.length] : 
                          scenario.config.classification || classifications[i % classifications.length];
    const destination = scenario.config.mixed ? destinations[i % destinations.length] :
                       scenario.config.destination || null;
    const decision = scenario.config.mixed ? decisions[i % decisions.length] :
                    scenario.config.decision || null;
    const method = scenario.config.method_mix ? methods[i % methods.length] : 'pickup';
    
    const totalItems = Math.floor(Math.random() * 15) + 1;
    const impact = generators.environmentalImpact(totalItems);
    
    const contribution = {
      tracking: generators.tracking(scenarioKey, i),
      tipo: type,
      metodo: method,
      nome: generators.email(i),
      estado: scenario.config.estado || (scenario.config.mixed ? ['pendiente', 'entregado', 'verificado', 'certificado_disponible'][i % 4] : 'verificado'),
      classification: scenario.config.classification === null ? null : classification,
      destination: scenario.config.destination === null ? null : destination,
      decision: scenario.config.decision === null ? null : decision,
      totalItems,
      co2Saved: scenario.config.estado === 'pendiente' ? 0 : impact.co2,
      waterSaved: scenario.config.estado === 'pendiente' ? 0 : impact.water,
      naturalResources: scenario.config.estado === 'pendiente' ? 0 : impact.resources,
      verified: scenario.config.verified ?? true,
      certificateHash: scenario.config.certificateHash ? `cert_${scenarioKey}_${i + 1}_${Math.random().toString(36).substr(2, 9)}` : null,
      certificateDate: scenario.config.certificateHash ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      detalles: generators.details(type, classification),
      pickupPoint: method === 'pickup' ? pickupPoints[i % pickupPoints.length] : null
    };
    
    contributions.push(contribution);
  }
  
  const createdContributions = await Promise.all(
    contributions.map(contrib => prisma.contribution.create({ data: contrib }))
  );
  
  console.log(`✅ Created ${createdContributions.length} contributions for ${scenario.name}`);
  return createdContributions;
}

// Función para crear productos de un escenario
async function createScenarioProducts(scenarioKey: string, scenario: any, contributions: any[] = []) {
  console.log(`\n🛍️ Creating ${scenario.name}...`);
  console.log(`📋 ${scenario.description}`);
  
  const products = [];
  
  for (let i = 0; i < scenario.count; i++) {
    const tracking = scenario.config.hasTracking && contributions.length > 0 
      ? contributions[i % contributions.length].tracking 
      : `PROD-${scenarioKey.toUpperCase()}-${String(i + 1).padStart(3, '0')}`;
    
    const productData = generators.productData(tracking, i, scenarioKey);
    
    const product = {
      ...productData,
      status: scenario.config.status,
      publishedAt: scenario.config.status === 'published' || scenario.config.status === 'sold' 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
        : null,
      soldAt: scenario.config.status === 'sold' 
        ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) 
        : null
    };
    
    products.push(product);
  }
  
  const createdProducts = await Promise.all(
    products.map(product => prisma.product.create({ data: product }))
  );
  
  console.log(`✅ Created ${createdProducts.length} products for ${scenario.name}`);
  return createdProducts;
}

// Función para mostrar estadísticas
async function showStats() {
  console.log('\n📊 Database Statistics:');
  
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
      
      // Estadísticas por destino
      const destinationStats = await prisma.contribution.groupBy({
        by: ['destination'],
        _count: { destination: true }
      });
      
      console.log(`\n🎯 Contributions by Destination:`);
      destinationStats.forEach(stat => {
        console.log(`  - ${stat.destination || 'Not assigned'}: ${stat._count.destination}`);
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
      
      // Estadísticas por tipo de prenda
      const garmentTypeStats = await prisma.product.groupBy({
        by: ['garmentType'],
        _count: { garmentType: true }
      });
      
      console.log(`\n👕 Products by Garment Type:`);
      garmentTypeStats.forEach(stat => {
        console.log(`  - ${stat.garmentType}: ${stat._count.garmentType}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error getting statistics:', error);
  }
}

// Función principal
async function seedAdminScenarios() {
  console.log('🚀 Starting Admin Scenarios Seed...');
  console.log('📋 This will create comprehensive test data for admin flow testing\n');
  
  try {
    // Crear contribuciones por escenario
    const allContributions = [];
    
    for (const [scenarioKey, scenario] of Object.entries(ADMIN_SCENARIOS)) {
      const contributions = await createScenarioContributions(scenarioKey, scenario);
      allContributions.push(...contributions);
    }
    
    // Crear productos por escenario
    const allProducts = [];
    
    for (const [scenarioKey, scenario] of Object.entries(PRODUCT_SCENARIOS)) {
      // Para productos con tracking, usar contribuciones del marketplace
      const marketplaceContributions = allContributions.filter(c => 
        c.destination === 'marketplace' && c.decision === 'vender'
      );
      
      const products = await createScenarioProducts(
        scenarioKey, 
        scenario, 
        scenario.config.hasTracking ? marketplaceContributions : []
      );
      allProducts.push(...products);
    }
    
    console.log('\n🎉 Admin Scenarios Seed completed successfully!');
    console.log(`📊 Total created:`);
    console.log(`  - Contributions: ${allContributions.length}`);
    console.log(`  - Products: ${allProducts.length}`);
    
    // Mostrar estadísticas
    await showStats();
    
    console.log('\n📋 Next steps:');
    console.log('1. Visit /admin/contributions to see all contribution scenarios');
    console.log('2. Visit /admin/products to see all product scenarios');
    console.log('3. Test different filters and search functionality');
    console.log('4. Test bulk actions and individual operations');
    console.log('5. Test notification system with real data');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
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

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🌱 INFINITO Admin Scenarios Seed Script

Usage: npm run seed:admin:scenarios [options]

Options:
  --clean        - Clean existing data before seeding
  --help         - Show this help message
  --stats        - Show database statistics only

Scenarios Created:

Contributions:
  - Pending Contributions (20)
  - Delivered Contributions (15)
  - Verified Contributions (25)
  - Certified Contributions (10)
  - Marketplace Contributions (18)
  - Donation Contributions (12)
  - Artist Contributions (8)
  - Recycling Contributions (10)
  - Mixed States and Types (30)
  - Method Variations (15)

Products:
  - Published Products (25)
  - Sold Products (12)
  - Draft Products (8)
  - Inactive Products (5)
  - Standalone Products (10)

Examples:
  npm run seed:admin:scenarios
  npm run seed:admin:scenarios --clean
  npm run seed:admin:scenarios --stats
  `);
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
  
  const shouldClean = args.includes('--clean');
  
  if (shouldClean) {
    await cleanData();
  }
  
  await seedAdminScenarios();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { seedAdminScenarios, cleanData, showStats }; 