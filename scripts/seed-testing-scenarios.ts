#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { calculateEnvironmentalImpact } from '../lib/utils';

const prisma = new PrismaClient();

// Escenarios específicos para testing del flujo admin
const TESTING_SCENARIOS = {
  // Escenario 1: Contribuciones con todos los estados posibles
  all_states: {
    name: 'All States Testing',
    description: 'Contribuciones con todos los estados posibles para testing completo',
    count: 12,
    states: ['pendiente', 'entregado', 'verificado', 'certificado_disponible']
  },
  
  // Escenario 2: Contribuciones con todas las clasificaciones
  all_classifications: {
    name: 'All Classifications Testing',
    description: 'Contribuciones con todas las clasificaciones posibles',
    count: 9,
    classifications: ['reutilizable', 'reparable', 'reciclable']
  },
  
  // Escenario 3: Contribuciones con todos los destinos
  all_destinations: {
    name: 'All Destinations Testing',
    description: 'Contribuciones con todos los destinos posibles',
    count: 8,
    destinations: ['marketplace', 'donacion', 'artistas', 'reciclaje']
  },
  
  // Escenario 4: Contribuciones con diferentes métodos
  all_methods: {
    name: 'All Methods Testing',
    description: 'Contribuciones con todos los métodos de entrega',
    count: 6,
    methods: ['pickup', 'home']
  },
  
  // Escenario 5: Contribuciones con diferentes tipos
  all_types: {
    name: 'All Types Testing',
    description: 'Contribuciones con todos los tipos posibles',
    count: 8,
    types: ['clothing', 'art', 'recycle', 'receive']
  },
  
  // Escenario 6: Contribuciones con diferentes decisiones
  all_decisions: {
    name: 'All Decisions Testing',
    description: 'Contribuciones con todas las decisiones posibles',
    count: 4,
    decisions: ['donar', 'vender']
  },
  
  // Escenario 7: Contribuciones con certificados blockchain
  blockchain_certificates: {
    name: 'Blockchain Certificates Testing',
    description: 'Contribuciones con certificados blockchain para testing',
    count: 5,
    withCertificates: true
  },
  
  // Escenario 8: Contribuciones con impacto ambiental alto
  high_impact: {
    name: 'High Environmental Impact Testing',
    description: 'Contribuciones con alto impacto ambiental',
    count: 3,
    highImpact: true
  },
  
  // Escenario 9: Contribuciones con muchos items
  many_items: {
    name: 'Many Items Testing',
    description: 'Contribuciones con muchos items para testing de performance',
    count: 2,
    manyItems: true
  },
  
  // Escenario 10: Contribuciones con datos especiales
  special_data: {
    name: 'Special Data Testing',
    description: 'Contribuciones con datos especiales para testing de edge cases',
    count: 4,
    specialData: true
  }
};

// Productos de testing específicos
const TESTING_PRODUCTS = {
  // Productos con todos los estados
  all_product_states: {
    name: 'All Product States Testing',
    description: 'Productos con todos los estados posibles',
    count: 8,
    states: ['published', 'sold', 'draft', 'inactive']
  },
  
  // Productos con diferentes tipos de prenda
  all_garment_types: {
    name: 'All Garment Types Testing',
    description: 'Productos con todos los tipos de prenda',
    count: 12,
    garmentTypes: ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'accessories']
  },
  
  // Productos con diferentes materiales
  all_materials: {
    name: 'All Materials Testing',
    description: 'Productos con todos los materiales',
    count: 12,
    materials: ['cotton', 'polyester', 'denim', 'silk', 'wool', 'linen']
  },
  
  // Productos con diferentes colores
  all_colors: {
    name: 'All Colors Testing',
    description: 'Productos con todos los colores',
    count: 16,
    colors: ['blue', 'red', 'green', 'black', 'white', 'yellow', 'purple', 'orange']
  },
  
  // Productos con diferentes tamaños
  all_sizes: {
    name: 'All Sizes Testing',
    description: 'Productos con todos los tamaños',
    count: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  
  // Productos con diferentes condiciones
  all_conditions: {
    name: 'All Conditions Testing',
    description: 'Productos con todas las condiciones',
    count: 8,
    conditions: ['excellent', 'good', 'fair', 'poor']
  },
  
  // Productos con diferentes países
  all_countries: {
    name: 'All Countries Testing',
    description: 'Productos con todos los países',
    count: 12,
    countries: ['Portugal', 'Spain', 'Italy', 'France', 'Germany', 'UK']
  },
  
  // Productos con precios extremos
  extreme_prices: {
    name: 'Extreme Prices Testing',
    description: 'Productos con precios extremos para testing',
    count: 4,
    extremePrices: true
  },
  
  // Productos con fotos múltiples
  multiple_photos: {
    name: 'Multiple Photos Testing',
    description: 'Productos con múltiples fotos',
    count: 3,
    multiplePhotos: true
  },
  
  // Productos con datos de IA
  ai_data: {
    name: 'AI Data Testing',
    description: 'Productos con datos de detección de IA',
    count: 5,
    aiData: true
  }
};

// Generadores de datos específicos para testing
const testingGenerators = {
  // Generar tracking específico para testing
  tracking: (scenario: string, index: number) => {
    const scenarioPrefix = scenario.toUpperCase().replace(/_/g, '').substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4);
    return `TEST-${scenarioPrefix}-${String(index + 1).padStart(3, '0')}-${timestamp}-${random}`;
  },
  
  // Generar email específico para testing
  email: (index: number) => {
    const names = ['test', 'admin', 'user', 'demo', 'qa', 'dev'];
    return `test.${index}@infinito.test`;
  },
  
  // Generar detalles específicos para testing
  details: (type: string, classification: string, specialData: boolean = false) => {
    if (specialData) {
      return `TESTING DATA - ${type.toUpperCase()} ${classification.toUpperCase()} - Special testing scenario with special characters: áéíóú ñ ç ã õ`;
    }
    
    const baseDetails = {
      clothing: {
        reutilizable: 'TESTING: Roupa em excelente estado para reutilização',
        reparable: 'TESTING: Roupa com pequenos defeitos reparáveis',
        reciclable: 'TESTING: Roupa danificada para reciclagem'
      },
      art: {
        reutilizable: 'TESTING: Tecidos para projetos artísticos',
        reparable: 'TESTING: Materiais para arte com reparação',
        reciclable: 'TESTING: Materiais para reciclagem artística'
      },
      recycle: {
        reutilizable: 'TESTING: Materiais têxteis para reutilização',
        reparable: 'TESTING: Materiais para reparação',
        reciclable: 'TESTING: Materiais para reciclagem industrial'
      },
      receive: {
        reutilizable: 'TESTING: Roupa doada em bom estado',
        reparable: 'TESTING: Roupa doada para reparação',
        reciclable: 'TESTING: Materiais doados para reciclagem'
      }
    };
    
    return baseDetails[type as keyof typeof baseDetails]?.[classification as keyof typeof baseDetails.clothing] || 'TESTING: Detalhes da contribuição';
  },
  
  // Generar impacto ambiental específico
  environmentalImpact: (totalItems: number, highImpact: boolean = false) => {
    const baseWeight = totalItems * (highImpact ? 2.0 : 0.3);
    return calculateEnvironmentalImpact(baseWeight);
  },
  
  // Generar datos de producto específicos para testing
  productData: (tracking: string, index: number, scenario: string, options: any = {}) => {
    const garmentTypes = options.garmentTypes || ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'accessories'];
    const materials = options.materials || ['cotton', 'polyester', 'denim', 'silk', 'wool', 'linen'];
    const colors = options.colors || ['blue', 'red', 'green', 'black', 'white', 'yellow', 'purple', 'orange'];
    const sizes = options.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const conditions = options.conditions || ['excellent', 'good', 'fair', 'poor'];
    const countries = options.countries || ['Portugal', 'Spain', 'Italy', 'France', 'Germany', 'UK'];
    
    const garmentType = garmentTypes[index % garmentTypes.length];
    const material = materials[index % materials.length];
    const color = colors[index % colors.length];
    const size = sizes[index % sizes.length];
    const condition = conditions[index % conditions.length];
    const country = countries[index % countries.length];
    
    // Generar precios específicos para testing
    let originalPrice: number;
    if (options.extremePrices) {
      const extremePrices = [1, 5, 100, 500];
      originalPrice = extremePrices[index % extremePrices.length];
    } else {
      originalPrice = Math.floor(Math.random() * 50) + 10;
    }
    
    const commission = parseFloat((originalPrice * 0.05).toFixed(2));
    const finalPrice = parseFloat((originalPrice + commission).toFixed(2));
    
    // Generar fotos específicas para testing
    let photo3Url = null;
    if (options.multiplePhotos) {
      photo3Url = `https://picsum.photos/seed/${tracking}-3/600/800`;
    } else if (Math.random() > 0.7) {
      photo3Url = `https://picsum.photos/seed/${tracking}-3/600/800`;
    }
    
    // Generar datos de IA específicos para testing
    let aiConfidence = 0.85;
    if (options.aiData) {
      aiConfidence = parseFloat((0.6 + Math.random() * 0.4).toFixed(2)); // 0.6 to 1.0
    }
    
    return {
      name: `TESTING ${garmentType.toUpperCase()} ${material.toUpperCase()}`,
      garmentType,
      gender: index % 2 === 0 ? 'male' : 'female',
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
      sellerName: testingGenerators.email(index),
      sellerEmail: testingGenerators.email(index),
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
        confidence: aiConfidence
      }),
      aiConfidence,
      photo1Url: `https://picsum.photos/seed/${tracking}-1/600/800`,
      photo2Url: `https://picsum.photos/seed/${tracking}-2/600/800`,
      photo3Url,
      impactCo2: `${(Math.random() * 10 + 2).toFixed(1)} kg CO2`,
      impactWater: `${(Math.random() * 100 + 20).toFixed(0)} L`,
      impactEff: `${(Math.floor(Math.random() * 50) + 10).toFixed(0)}%`
    };
  }
};

// Función para crear contribuciones de testing
async function createTestingContributions(scenarioKey: string, scenario: any) {
  console.log(`\n🧪 Creating ${scenario.name}...`);
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
    const type = scenario.types ? scenario.types[i % scenario.types.length] : types[i % types.length];
    const classification = scenario.classifications ? scenario.classifications[i % scenario.classifications.length] : classifications[i % classifications.length];
    const destination = scenario.destinations ? scenario.destinations[i % scenario.destinations.length] : destinations[i % destinations.length];
    const decision = scenario.decisions ? scenario.decisions[i % scenario.decisions.length] : decisions[i % decisions.length];
    const method = scenario.methods ? scenario.methods[i % scenario.methods.length] : methods[i % methods.length];
    const estado = scenario.states ? scenario.states[i % scenario.states.length] : 'verificado';
    
    // Generar número de items específico para testing
    let totalItems: number;
    if (scenario.manyItems) {
      totalItems = Math.floor(Math.random() * 50) + 20; // 20-70 items
    } else {
      totalItems = Math.floor(Math.random() * 15) + 1;
    }
    
    const impact = testingGenerators.environmentalImpact(totalItems, scenario.highImpact);
    
    const contribution = {
      tracking: testingGenerators.tracking(scenarioKey, i),
      tipo: type,
      metodo: method,
      nome: testingGenerators.email(i),
      estado,
      classification: estado === 'pendiente' ? null : classification,
      destination: estado === 'pendiente' ? null : destination,
      decision: estado === 'pendiente' ? null : decision,
      totalItems,
      co2Saved: estado === 'pendiente' ? 0 : impact.co2,
      waterSaved: estado === 'pendiente' ? 0 : impact.water,
      naturalResources: estado === 'pendiente' ? 0 : impact.resources,
      verified: estado !== 'pendiente',
      certificateHash: scenario.withCertificates ? `cert_test_${scenarioKey}_${i + 1}_${Math.random().toString(36).substr(2, 9)}` : null,
      certificateDate: scenario.withCertificates ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      detalles: testingGenerators.details(type, classification, scenario.specialData),
      pickupPoint: method === 'pickup' ? pickupPoints[i % pickupPoints.length] : null
    };
    
    contributions.push(contribution);
  }
  
  const createdContributions = await Promise.all(
    contributions.map(contrib => prisma.contribution.create({ data: contrib }))
  );
  
  console.log(`✅ Created ${createdContributions.length} testing contributions for ${scenario.name}`);
  return createdContributions;
}

// Función para crear productos de testing
async function createTestingProducts(scenarioKey: string, scenario: any) {
  console.log(`\n🧪 Creating ${scenario.name}...`);
  console.log(`📋 ${scenario.description}`);
  
  const products = [];
  
  for (let i = 0; i < scenario.count; i++) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4);
    const tracking = `TEST-PROD-${scenarioKey.toUpperCase()}-${String(i + 1).padStart(3, '0')}-${timestamp}-${random}`;
    
    const options = {
      garmentTypes: scenario.garmentTypes,
      materials: scenario.materials,
      colors: scenario.colors,
      sizes: scenario.sizes,
      conditions: scenario.conditions,
      countries: scenario.countries,
      extremePrices: scenario.extremePrices,
      multiplePhotos: scenario.multiplePhotos,
      aiData: scenario.aiData
    };
    
    const productData = testingGenerators.productData(tracking, i, scenarioKey, options);
    
    const product = {
      ...productData,
      status: scenario.states ? scenario.states[i % scenario.states.length] : 'published',
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      soldAt: null
    };
    
    products.push(product);
  }
  
  const createdProducts = await Promise.all(
    products.map(product => prisma.product.create({ data: product }))
  );
  
  console.log(`✅ Created ${createdProducts.length} testing products for ${scenario.name}`);
  return createdProducts;
}

// Función principal
async function seedTestingScenarios() {
  console.log('🧪 Starting Testing Scenarios Seed...');
  console.log('📋 This will create specific test data for admin flow testing\n');
  
  try {
    // Crear contribuciones de testing
    const allContributions = [];
    
    for (const [scenarioKey, scenario] of Object.entries(TESTING_SCENARIOS)) {
      const contributions = await createTestingContributions(scenarioKey, scenario);
      allContributions.push(...contributions);
    }
    
    // Crear productos de testing
    const allProducts = [];
    
    for (const [scenarioKey, scenario] of Object.entries(TESTING_PRODUCTS)) {
      const products = await createTestingProducts(scenarioKey, scenario);
      allProducts.push(...products);
    }
    
    console.log('\n🎉 Testing Scenarios Seed completed successfully!');
    console.log(`📊 Total created:`);
    console.log(`  - Testing Contributions: ${allContributions.length}`);
    console.log(`  - Testing Products: ${allProducts.length}`);
    
    console.log('\n🧪 Testing scenarios created:');
    console.log('  - All states testing');
    console.log('  - All classifications testing');
    console.log('  - All destinations testing');
    console.log('  - All methods testing');
    console.log('  - All types testing');
    console.log('  - All decisions testing');
    console.log('  - Blockchain certificates testing');
    console.log('  - High environmental impact testing');
    console.log('  - Many items testing');
    console.log('  - Special data testing');
    
    console.log('\n📋 Next steps:');
    console.log('1. Test all filter combinations in admin panels');
    console.log('2. Test search functionality with special characters');
    console.log('3. Test bulk actions with different data types');
    console.log('4. Test notification system with test data');
    console.log('5. Test edge cases and error handling');
    
  } catch (error) {
    console.error('❌ Error during testing scenarios seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🧪 INFINITO Testing Scenarios Seed Script

Usage: npm run seed:testing:scenarios [options]

Options:
  --clean        - Clean existing test data before seeding
  --help         - Show this help message

Testing Scenarios Created:

Contributions:
  - All States Testing (12)
  - All Classifications Testing (9)
  - All Destinations Testing (8)
  - All Methods Testing (6)
  - All Types Testing (8)
  - All Decisions Testing (4)
  - Blockchain Certificates Testing (5)
  - High Environmental Impact Testing (3)
  - Many Items Testing (2)
  - Special Data Testing (4)

Products:
  - All Product States Testing (8)
  - All Garment Types Testing (12)
  - All Materials Testing (12)
  - All Colors Testing (16)
  - All Sizes Testing (12)
  - All Conditions Testing (8)
  - All Countries Testing (12)
  - Extreme Prices Testing (4)
  - Multiple Photos Testing (3)
  - AI Data Testing (5)

Examples:
  npm run seed:testing:scenarios
  npm run seed:testing:scenarios --clean
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
  
  const shouldClean = args.includes('--clean');
  
  if (shouldClean) {
    console.log('🧹 Cleaning existing test data...');
    await prisma.contribution.deleteMany({ where: { tracking: { startsWith: 'TEST-' } } });
    await prisma.product.deleteMany({ where: { tracking: { startsWith: 'TEST-' } } });
    console.log('✅ Test data cleaned');
  }
  
  await seedTestingScenarios();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

export { seedTestingScenarios }; 