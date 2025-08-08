import { PrismaClient } from '@prisma/client';
import { calculateEnvironmentalImpact } from '../lib/utils';

const prisma = new PrismaClient();

// Configuración de datos de prueba
const CONFIG = {
  contributions: {
    total: 50, // Total de contribuciones a crear
    types: ['clothing', 'art', 'recycle', 'receive'] as const,
    states: ['pendiente', 'entregado', 'verificado', 'certificado_disponible'] as const,
    classifications: ['reutilizable', 'reparable', 'reciclable'] as const,
    destinations: ['marketplace', 'donacion', 'artistas', 'reciclaje'] as const,
    decisions: ['donar', 'vender'] as const,
    methods: ['pickup', 'home'] as const,
    pickupPoints: [
      'Centro de Vila Real',
      'Biblioteca Municipal',
      'Mercado Municipal',
      'Parque da Cidade',
      'Estação de Comboios',
      'Centro Comercial',
      'Universidade de Trás-os-Montes',
      'Hospital Regional'
    ]
  },
  products: {
    total: 30, // Total de productos a crear
    statuses: ['published', 'sold', 'draft', 'inactive'] as const,
    garmentTypes: ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'accessories'] as const,
    materials: ['cotton', 'polyester', 'denim', 'silk', 'wool', 'linen'] as const,
    colors: ['blue', 'red', 'green', 'black', 'white', 'yellow', 'purple', 'orange'] as const,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const,
    conditions: ['excellent', 'good', 'fair', 'poor'] as const,
    countries: ['Portugal', 'Spain', 'Italy', 'France', 'Germany', 'UK'] as const
  }
};

// Generadores de datos realistas
const generators = {
  // Generar tracking único
  tracking: (index: number) => `INF-2024-${String(index + 1).padStart(3, '0')}`,
  
  // Generar email realista
  email: (index: number) => {
    const names = ['maria', 'joao', 'ana', 'carlos', 'sofia', 'pedro', 'lucia', 'miguel', 'beatriz', 'tiago'];
    const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const name = names[index % names.length];
    const domain = domains[index % domains.length];
    return `${name}.${index}@${domain}`;
  },
  
  // Generar detalles realistas
  details: (type: string, classification: string) => {
    const clothingDetails = {
      reutilizable: [
        'Camisetas de algodão orgânico em excelente estado',
        'Calças jeans de marca em perfeitas condições',
        'Vestidos elegantes para ocasiões especiais',
        'Casacos de inverno bem conservados',
        'Sapatos de couro genuíno pouco usados'
      ],
      reparable: [
        'Camisetas com pequenos rasgos facilmente reparáveis',
        'Calças com botões soltos que precisam de costura',
        'Vestidos com zíper quebrado mas tecido em bom estado',
        'Casacos com forro solto mas exterior perfeito',
        'Sapatos com sola desgastada mas cabedal em bom estado'
      ],
      reciclable: [
        'Roupa muito danificada mas com tecido reciclável',
        'Tecidos mistos adequados para reciclagem',
        'Roupa com manchas permanentes mas material aproveitável',
        'Acessórios danificados com componentes recicláveis',
        'Tecidos sintéticos para reciclagem industrial'
      ]
    };
    
    const artDetails = {
      reutilizable: [
        'Tecidos coloridos para projetos artísticos',
        'Retalhos de tecidos diversos para colagens',
        'Materiais têxteis para instalações artísticas',
        'Tecidos com texturas interessantes para arte',
        'Materiais para workshops de arte têxtil'
      ],
      reparable: [
        'Tecidos com pequenos defeitos para arte',
        'Materiais que precisam de limpeza para uso artístico',
        'Retalhos que podem ser aproveitados em projetos',
        'Tecidos com manchas que podem ser incorporadas na arte',
        'Materiais para técnicas de upcycling artístico'
      ],
      reciclable: [
        'Tecidos para reciclagem artística',
        'Materiais para projetos de arte sustentável',
        'Retalhos para técnicas de reciclagem criativa',
        'Tecidos para instalações sobre sustentabilidade',
        'Materiais para workshops de reciclagem artística'
      ]
    };
    
    const recycleDetails = {
      reutilizable: [
        'Materiais têxteis em bom estado para reutilização',
        'Tecidos industriais que podem ser reutilizados',
        'Materiais para projetos de upcycling',
        'Tecidos adequados para reutilização criativa',
        'Materiais para workshops de sustentabilidade'
      ],
      reparable: [
        'Materiais que precisam de pequenos reparos',
        'Tecidos com defeitos menores que podem ser corrigidos',
        'Materiais para projetos de reparação',
        'Tecidos adequados para técnicas de restauração',
        'Materiais para workshops de reparação têxtil'
      ],
      reciclable: [
        'Materiais adequados para reciclagem industrial',
        'Tecidos para processos de reciclagem',
        'Materiais para compostagem têxtil',
        'Tecidos para reciclagem química',
        'Materiais para projetos de economia circular'
      ]
    };
    
    const receiveDetails = {
      reutilizable: [
        'Roupa doada em excelente estado',
        'Tecidos adequados para reutilização',
        'Materiais para projetos sociais',
        'Roupa adequada para doação',
        'Tecidos para workshops comunitários'
      ],
      reparable: [
        'Roupa que precisa de pequenos reparos',
        'Tecidos adequados para projetos de reparação',
        'Materiais para workshops de costura',
        'Roupa que pode ser restaurada',
        'Tecidos para projetos sociais de reparação'
      ],
      reciclable: [
        'Materiais adequados para reciclagem',
        'Tecidos para projetos de sustentabilidade',
        'Materiais para workshops de reciclagem',
        'Roupa adequada para processos de reciclagem',
        'Tecidos para projetos de economia circular'
      ]
    };
    
    const detailsMap = {
      clothing: clothingDetails,
      art: artDetails,
      recycle: recycleDetails,
      receive: receiveDetails
    };
    
    const typeDetails = detailsMap[type as keyof typeof detailsMap];
    const classificationDetails = typeDetails[classification as keyof typeof typeDetails];
    return classificationDetails[Math.floor(Math.random() * classificationDetails.length)];
  },
  
  // Generar datos de impacto ambiental
  environmentalImpact: (totalItems: number) => {
    const baseWeight = totalItems * 0.3; // kg por item
    const impact = calculateEnvironmentalImpact(baseWeight);
    return {
      co2Saved: impact.co2,
      waterSaved: impact.water,
      naturalResources: impact.resources
    };
  },
  
  // Generar datos de producto
  productData: (tracking: string, index: number) => {
    const garmentType = CONFIG.products.garmentTypes[Math.floor(Math.random() * CONFIG.products.garmentTypes.length)];
    const material = CONFIG.products.materials[Math.floor(Math.random() * CONFIG.products.materials.length)];
    const color = CONFIG.products.colors[Math.floor(Math.random() * CONFIG.products.colors.length)];
    const size = CONFIG.products.sizes[Math.floor(Math.random() * CONFIG.products.sizes.length)];
    const condition = CONFIG.products.conditions[Math.floor(Math.random() * CONFIG.products.conditions.length)];
    const country = CONFIG.products.countries[Math.floor(Math.random() * CONFIG.products.countries.length)];
    const status = CONFIG.products.statuses[Math.floor(Math.random() * CONFIG.products.statuses.length)];
    
    const names = [
      `${garmentType.charAt(0).toUpperCase() + garmentType.slice(1)} ${material}`,
      `${color.charAt(0).toUpperCase() + color.slice(1)} ${garmentType}`,
      `${material.charAt(0).toUpperCase() + material.slice(1)} ${garmentType}`,
      `${condition.charAt(0).toUpperCase() + condition.slice(1)} ${garmentType}`,
      `${country} ${garmentType}`
    ];
    
    const originalPrice = Math.floor(Math.random() * 50) + 10; // 10-60 euros
    const commission = Math.min(Math.max(originalPrice * 0.05, 1), 10); // 5% commission, min €1, max €10
    const finalPrice = originalPrice + commission;
    
    return {
      tracking,
      name: names[Math.floor(Math.random() * names.length)],
      garmentType,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      color,
      size,
      material,
      country,
      condition,
      price: originalPrice,
      originalPrice,
      commission,
      finalPrice,
      sellerName: generators.email(index),
      sellerEmail: generators.email(index),
      sellerPhone: `+351 ${Math.floor(Math.random() * 900000000) + 100000000}`,
      estimatedWeight: Math.random() * 2 + 0.1, // 0.1-2.1 kg
      standardImpact: JSON.stringify({
        co2: Math.random() * 10 + 2,
        water: Math.random() * 100 + 20,
        resources: Math.floor(Math.random() * 50) + 10
      }),
      aiDetection: JSON.stringify({
        material: material,
        condition: condition,
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      }),
      aiConfidence: Math.random() * 0.3 + 0.7,
      photo1Url: `https://example.com/photos/product_${index + 1}_1.jpg`,
      photo2Url: `https://example.com/photos/product_${index + 1}_2.jpg`,
      photo3Url: Math.random() > 0.5 ? `https://example.com/photos/product_${index + 1}_3.jpg` : null,
      status,
      publishedAt: (status as any) !== 'pending' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
      soldAt: status === 'sold' ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null,
      impactCo2: `${(Math.random() * 10 + 2).toFixed(1)} kg CO2`,
      impactWater: `${(Math.random() * 100 + 20).toFixed(0)} L`,
      impactEff: `${(Math.floor(Math.random() * 50) + 10).toFixed(0)}%`
    };
  }
};

// Función principal para crear contribuciones
async function createContributions() {
  console.log('🌱 Creating contributions...');
  
  const contributions = [];
  
  for (let i = 0; i < CONFIG.contributions.total; i++) {
    const type = CONFIG.contributions.types[Math.floor(Math.random() * CONFIG.contributions.types.length)];
    const state = CONFIG.contributions.states[Math.floor(Math.random() * CONFIG.contributions.states.length)];
    const classification = CONFIG.contributions.classifications[Math.floor(Math.random() * CONFIG.contributions.classifications.length)];
    const destination = CONFIG.contributions.destinations[Math.floor(Math.random() * CONFIG.contributions.destinations.length)];
    const decision = CONFIG.contributions.decisions[Math.floor(Math.random() * CONFIG.contributions.decisions.length)];
    const method = CONFIG.contributions.methods[Math.floor(Math.random() * CONFIG.contributions.methods.length)];
    
    const totalItems = Math.floor(Math.random() * 15) + 1; // 1-15 items
    const impact = generators.environmentalImpact(totalItems);
    
    const contribution = {
      tracking: generators.tracking(i),
      tipo: type,
      metodo: method,
      nome: generators.email(i),
      estado: state,
      classification: state === 'pendiente' ? null : classification,
      destination: state === 'pendiente' ? null : destination,
      decision: state === 'pendiente' ? null : decision,
      totalItems,
      co2Saved: state === 'pendiente' ? 0 : impact.co2Saved,
      waterSaved: state === 'pendiente' ? 0 : impact.waterSaved,
      naturalResources: state === 'pendiente' ? 0 : impact.naturalResources,
      verified: state !== 'pendiente',
      certificateHash: state === 'certificado_disponible' ? `cert_hash_${i + 1}_${Math.random().toString(36).substr(2, 9)}` : null,
      certificateDate: state === 'certificado_disponible' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      detalles: generators.details(type, classification),
      pickupPoint: method === 'pickup' ? CONFIG.contributions.pickupPoints[Math.floor(Math.random() * CONFIG.contributions.pickupPoints.length)] : null
    };
    
    contributions.push(contribution);
  }
  
  // Crear contribuciones en la base de datos
  const createdContributions = await Promise.all(
    contributions.map(contrib => 
      prisma.contribution.create({ data: contrib })
    )
  );
  
  console.log(`✅ Created ${createdContributions.length} contributions`);
  return createdContributions;
}

// Función para crear productos
async function createProducts(contributions: any[]) {
  console.log('🛍️ Creating products...');
  
  const products = [];
  const marketplaceContributions = contributions.filter(c => c.destination === 'marketplace' && c.decision === 'vender');
  
  // Crear productos solo para contribuciones destinadas al marketplace
  for (let i = 0; i < Math.min(CONFIG.products.total, marketplaceContributions.length); i++) {
    const contribution = marketplaceContributions[i];
    const productData = generators.productData(contribution.tracking, i);
    
    products.push(productData);
  }
  
  // Crear productos en la base de datos
  const createdProducts = await Promise.all(
    products.map(product => 
      prisma.product.create({ data: product })
    )
  );
  
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
}

// Función para mostrar estadísticas
async function showStats() {
  console.log('\n📊 Database Statistics:');
  
  const [contributions, products] = await Promise.all([
    prisma.contribution.count(),
    prisma.product.count()
  ]);
  
  console.log(`- Total Contributions: ${contributions}`);
  console.log(`- Total Products: ${products}`);
  
  // Estadísticas por estado
  const stateStats = await prisma.contribution.groupBy({
    by: ['estado'],
    _count: { estado: true }
  });
  
  console.log('\n📈 Contributions by State:');
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
  
  // Estadísticas de productos
  const productStatusStats = await prisma.product.groupBy({
    by: ['status'],
    _count: { status: true }
  });
  
  console.log('\n🛍️ Products by Status:');
  productStatusStats.forEach(stat => {
    console.log(`  - ${stat.status}: ${stat._count.status}`);
  });
}

// Función principal
async function seedAdminComplete() {
  try {
    console.log('🚀 Starting comprehensive admin seed...');
    
    // Limpiar datos existentes (opcional)
    const shouldClean = process.argv.includes('--clean');
    if (shouldClean) {
      console.log('🧹 Cleaning existing data...');
      await prisma.product.deleteMany();
      await prisma.contribution.deleteMany();
      console.log('✅ Data cleaned');
    }
    
    // Crear contribuciones
    const contributions = await createContributions();
    
    // Crear productos
    const products = await createProducts(contributions);
    
    // Mostrar estadísticas
    await showStats();
    
    console.log('\n🎉 Admin seed completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit /admin/contributions to see the contributions');
    console.log('2. Visit /admin/products to see the products');
    console.log('3. Test different filters and search functionality');
    console.log('4. Test bulk actions and individual operations');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  seedAdminComplete();
}

export { seedAdminComplete, CONFIG, generators }; 