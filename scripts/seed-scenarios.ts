import { PrismaClient } from '@prisma/client';
import { calculateEnvironmentalImpact } from '../lib/utils';

const prisma = new PrismaClient();

// Escenarios específicos para testing
const SCENARIOS = {
  // Escenario 1: Contribuciones pendientes (sin procesar)
  pending: {
    name: 'Pending Contributions',
    description: 'Contribuciones en estado pendiente para testing de procesamiento',
    count: 15,
    config: {
      estado: 'pendiente',
      classification: null,
      destination: null,
      decision: null,
      verified: false
    }
  },
  
  // Escenario 2: Contribuciones verificadas (listas para clasificar)
  verified: {
    name: 'Verified Contributions',
    description: 'Contribuciones verificadas listas para clasificación',
    count: 20,
    config: {
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 3: Contribuciones certificadas (con blockchain)
  certified: {
    name: 'Certified Contributions',
    description: 'Contribuciones con certificados blockchain',
    count: 10,
    config: {
      estado: 'certificado_disponible',
      verified: true,
      certificateHash: true
    }
  },
  
  // Escenario 4: Contribuciones para marketplace (con productos)
  marketplace: {
    name: 'Marketplace Contributions',
    description: 'Contribuciones destinadas al marketplace con productos',
    count: 12,
    config: {
      destination: 'marketplace',
      decision: 'vender',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 5: Contribuciones para donación
  donation: {
    name: 'Donation Contributions',
    description: 'Contribuciones destinadas a donación',
    count: 8,
    config: {
      destination: 'donacion',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 6: Contribuciones para artistas
  artists: {
    name: 'Artist Contributions',
    description: 'Contribuciones para proyectos artísticos',
    count: 6,
    config: {
      destination: 'artistas',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 7: Contribuciones para reciclaje
  recycling: {
    name: 'Recycling Contributions',
    description: 'Contribuciones para reciclaje',
    count: 8,
    config: {
      destination: 'reciclaje',
      decision: 'donar',
      estado: 'verificado',
      verified: true
    }
  },
  
  // Escenario 8: Mix de estados y tipos
  mixed: {
    name: 'Mixed States and Types',
    description: 'Mezcla de diferentes estados, tipos y clasificaciones',
    count: 25,
    config: {
      mixed: true
    }
  }
};

// Generadores de datos
const generators = {
  tracking: (scenario: string, index: number) => `${scenario.toUpperCase()}-${String(index + 1).padStart(3, '0')}`,
  
  email: (index: number) => {
    const names = ['admin', 'test', 'user', 'demo', 'sample'];
    return `${names[index % names.length]}.${index}@infinito.test`;
  },
  
  details: (type: string, classification: string) => {
    const details = {
      clothing: {
        reutilizable: 'Roupa em excelente estado para reutilização',
        reparable: 'Roupa com pequenos defeitos que podem ser reparados',
        reciclable: 'Roupa danificada adequada para reciclagem'
      },
      art: {
        reutilizable: 'Tecidos para projetos artísticos',
        reparable: 'Materiais que precisam de limpeza para arte',
        reciclable: 'Tecidos para reciclagem artística'
      },
      recycle: {
        reutilizable: 'Materiais têxteis para reutilização',
        reparable: 'Materiais que podem ser reparados',
        reciclable: 'Materiais para reciclagem industrial'
      },
      receive: {
        reutilizable: 'Roupa doada em bom estado',
        reparable: 'Roupa que precisa de reparos',
        reciclable: 'Materiais para reciclagem'
      }
    };
    
    return details[type as keyof typeof details]?.[classification as keyof typeof details.clothing] || 'Detalhes da contribuição';
  },
  
  environmentalImpact: (totalItems: number) => {
    const baseWeight = totalItems * 0.3;
    return calculateEnvironmentalImpact(baseWeight);
  },
  
  productData: (tracking: string, index: number) => ({
    tracking,
    name: `Product ${index + 1}`,
    garmentType: ['shirt', 'pants', 'dress', 'jacket'][index % 4],
    gender: index % 2 === 0 ? 'male' : 'female',
    color: ['blue', 'red', 'green', 'black'][index % 4],
    size: ['S', 'M', 'L', 'XL'][index % 4],
    material: ['cotton', 'polyester', 'denim', 'silk'][index % 4],
    country: 'Portugal',
    condition: ['excellent', 'good', 'fair'][index % 3],
    price: Math.floor(Math.random() * 50) + 10,
    originalPrice: Math.floor(Math.random() * 50) + 10,
    commission: 2.5,
    finalPrice: Math.floor(Math.random() * 50) + 12.5,
    sellerName: `seller.${index}@infinito.test`,
    sellerEmail: `seller.${index}@infinito.test`,
    sellerPhone: `+351 ${Math.floor(Math.random() * 900000000) + 100000000}`,
    estimatedWeight: Math.random() * 2 + 0.1,
    standardImpact: JSON.stringify({
      co2: Math.random() * 10 + 2,
      water: Math.random() * 100 + 20,
      resources: Math.floor(Math.random() * 50) + 10
    }),
    aiDetection: JSON.stringify({
      material: 'cotton',
      condition: 'good',
      confidence: 0.85
    }),
    aiConfidence: 0.85,
    photo1Url: `https://example.com/photos/scenario_${index + 1}_1.jpg`,
    photo2Url: `https://example.com/photos/scenario_${index + 1}_2.jpg`,
    photo3Url: null,
    status: ['published', 'sold', 'draft'][index % 3],
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    soldAt: null,
    impactCo2: `${(Math.random() * 10 + 2).toFixed(1)} kg CO2`,
    impactWater: `${(Math.random() * 100 + 20).toFixed(0)} L`,
    impactEff: `${(Math.floor(Math.random() * 50) + 10).toFixed(0)}%`
  })
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
  
  for (let i = 0; i < scenario.count; i++) {
    const type = types[i % types.length];
    const classification = scenario.config.mixed ? classifications[i % classifications.length] : 
                          scenario.config.classification || classifications[i % classifications.length];
    const destination = scenario.config.mixed ? destinations[i % destinations.length] :
                       scenario.config.destination || destinations[i % destinations.length];
    const decision = scenario.config.mixed ? decisions[i % decisions.length] :
                    scenario.config.decision || decisions[i % decisions.length];
    
    const totalItems = Math.floor(Math.random() * 15) + 1;
    const impact = generators.environmentalImpact(totalItems);
    
    const contribution = {
      tracking: generators.tracking(scenarioKey, i),
      tipo: type,
      metodo: i % 2 === 0 ? 'pickup' : 'home',
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
      pickupPoint: i % 2 === 0 ? 'Centro de Vila Real' : null
    };
    
    contributions.push(contribution);
  }
  
  const createdContributions = await Promise.all(
    contributions.map(contrib => prisma.contribution.create({ data: contrib }))
  );
  
  console.log(`✅ Created ${createdContributions.length} contributions for ${scenario.name}`);
  return createdContributions;
}

// Función para crear productos para contribuciones del marketplace
async function createScenarioProducts(contributions: any[]) {
  console.log('\n🛍️ Creating products for marketplace contributions...');
  
  const marketplaceContributions = contributions.filter(c => c.destination === 'marketplace');
  const products = [];
  
  for (let i = 0; i < marketplaceContributions.length; i++) {
    const contribution = marketplaceContributions[i];
    const productData = generators.productData(contribution.tracking, i);
    products.push(productData);
  }
  
  const createdProducts = await Promise.all(
    products.map(product => prisma.product.create({ data: product }))
  );
  
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
}

// Función principal
async function seedScenarios() {
  const args = process.argv.slice(2);
  const scenarioKey = args[0];
  
  if (!scenarioKey) {
    console.log('🌱 INFINITO Scenario Seed Script');
    console.log('\nAvailable scenarios:');
    Object.entries(SCENARIOS).forEach(([key, scenario]) => {
      console.log(`  ${key} - ${scenario.name} (${scenario.count} items)`);
    });
    console.log('\nUsage: npm run seed:scenario <scenario-name>');
    console.log('Example: npm run seed:scenario pending');
    return;
  }
  
  if (!SCENARIOS[scenarioKey as keyof typeof SCENARIOS]) {
    console.error(`❌ Unknown scenario: ${scenarioKey}`);
    return;
  }
  
  const scenario = SCENARIOS[scenarioKey as keyof typeof SCENARIOS];
  
  try {
    console.log(`🚀 Starting ${scenario.name} scenario...`);
    
    // Limpiar datos existentes si se especifica
    if (args.includes('--clean')) {
      console.log('🧹 Cleaning existing data...');
      await prisma.product.deleteMany();
      await prisma.contribution.deleteMany();
      console.log('✅ Data cleaned');
    }
    
    // Crear contribuciones del escenario
    const contributions = await createScenarioContributions(scenarioKey, scenario);
    
    // Crear productos si hay contribuciones del marketplace
    const products = await createScenarioProducts(contributions);
    
    console.log('\n📊 Scenario Summary:');
    console.log(`- Scenario: ${scenario.name}`);
    console.log(`- Contributions created: ${contributions.length}`);
    console.log(`- Products created: ${products.length}`);
    
    console.log('\n🎉 Scenario seed completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit /admin/contributions to see the contributions');
    console.log('2. Visit /admin/products to see the products');
    console.log('3. Test the specific scenario functionality');
    
  } catch (error) {
    console.error('❌ Error during scenario seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  seedScenarios();
}

export { seedScenarios, SCENARIOS }; 