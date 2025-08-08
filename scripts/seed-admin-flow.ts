import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear contribuciones de ejemplo
  const contribuciones = [
    {
      tracking: 'INF_1001',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'Ana Silva',
      estado: 'pendiente',
      fecha: new Date(),
      decision: 'donate',
      classification: 'reutilizable',
      destination: 'donacion',
      trackingState: 'pendiente',
    },
    {
      tracking: 'INF_1002',
      tipo: 'clothing',
      metodo: 'pickup',
      nome: 'João Costa',
      estado: 'pendiente',
      fecha: new Date(),
      decision: 'sell',
      classification: 'reutilizable',
      destination: 'marketplace',
      trackingState: 'verificado',
    },
    {
      tracking: 'INF_1003',
      tipo: 'art',
      metodo: 'receive',
      nome: 'Maria Artista',
      estado: 'pendiente',
      fecha: new Date(),
      decision: 'donate',
      classification: 'reparable',
      destination: 'artistas',
      trackingState: 'certificado_disponible',
    },
    {
      tracking: 'INF_1004',
      tipo: 'recycle',
      metodo: 'dropoff',
      nome: 'Empresa Recicla',
      estado: 'pendiente',
      fecha: new Date(),
      decision: 'donate',
      classification: 'reciclable',
      destination: 'reciclaje',
      trackingState: 'pendiente',
    },
  ];

  for (const c of contribuciones) {
    await prisma.contribution.upsert({
      where: { tracking: c.tracking },
      update: c,
      create: c,
    });
  }

  // Crear productos asociados a la contribución de venta
  await prisma.product.createMany({
    data: [
      {
        tracking: 'INF_1002',
        name: 'T-Shirt Blue',
        garmentType: 'T-Shirt',
        gender: 'Unisex',
        color: 'Blue',
        size: 'M',
        material: 'Organic Cotton',
        country: 'Portugal',
        condition: 'Good',
        price: 12,
        originalPrice: 12,
        commission: 2,
        finalPrice: 14,
        sellerName: 'João Costa',
        sellerEmail: 'joao@infinito.com',
        sellerPhone: '+351912345678',
        estimatedWeight: 0.3,
        standardImpact: { co2: 2, water: 500, resources: 80 },
        aiDetection: undefined,
        aiConfidence: 0.92,
        photo1Url: '/images/Item1.jpeg',
        photo2Url: '/images/Item2.jpeg',
        photo3Url: undefined,
        status: 'published',
        publishedAt: new Date(),
        soldAt: null,
        impactCo2: '2',
        impactWater: '500',
        impactEff: '80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tracking: 'INF_1002',
        name: 'Jeans Eco',
        garmentType: 'Jeans',
        gender: 'Unisex',
        color: 'Black',
        size: 'L',
        material: 'Recycled Cotton',
        country: 'Portugal',
        condition: 'Used',
        price: 15,
        originalPrice: 15,
        commission: 2,
        finalPrice: 17,
        sellerName: 'João Costa',
        sellerEmail: 'joao@infinito.com',
        sellerPhone: '+351912345678',
        estimatedWeight: 0.5,
        standardImpact: { co2: 3, water: 700, resources: 85 },
        aiDetection: undefined,
        aiConfidence: 0.88,
        photo1Url: '/images/Item3.jpeg',
        photo2Url: '/images/Item4.jpeg',
        photo3Url: undefined,
        status: 'published',
        publishedAt: new Date(),
        soldAt: null,
        impactCo2: '3',
        impactWater: '700',
        impactEff: '85',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  });

  console.log('Contribuciones y productos de ejemplo insertados.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 