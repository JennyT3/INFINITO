import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateStandardWeight, calculateEnvironmentalImpact, calculateRevenue } from '@/lib/utils';

const prisma = new PrismaClient();

// GET /api/products - lista todos o uno por id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  let products;
  try {
    if (id) {
      const product = await prisma.product.findUnique({ where: { id: Number(id) } });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json(product);
    }
    const products = await prisma.product.findMany({
      where: {
        status: 'published'
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });
    return NextResponse.json(products);
  } catch (e) {
    console.error('Error fetching products:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/products - crear producto
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Calcular peso estándar baseado no tipo de prenda
    const estimatedWeight = calculateStandardWeight(data.garmentType);
    
    // Calcular impacto ambiental baseado no peso
    const environmentalImpact = calculateEnvironmentalImpact(estimatedWeight);
    
    // Calcular modelo de revenue (5% comisión, mín €1, máx €10)
    const revenueModel = calculateRevenue(data.price);
    
    // Preparar dados para criação
    const productData = {
      name: data.name,
      garmentType: data.garmentType,
      gender: data.gender,
      color: data.color,
      size: data.size,
      material: data.material,
      country: data.country,
      condition: data.condition,
      price: data.price,
      
      // Revenue model
      originalPrice: data.price,
      commission: revenueModel.commission,
      finalPrice: revenueModel.finalPrice,
      
      // Seller information
      sellerName: data.sellerName,
      sellerEmail: data.sellerEmail,
      sellerPhone: data.sellerPhone,
      
      // Automated calculations
      estimatedWeight,
      standardImpact: environmentalImpact,
      
      // AI Detection results
      aiDetection: data.aiDetection,
      aiConfidence: data.aiConfidence,
      
      // Photos (mínimo 2: prenda + etiqueta)
      photo1Url: data.photo1Url, // Foto da prenda
      photo2Url: data.photo2Url, // Foto da etiqueta
      photo3Url: data.photo3Url, // Foto adicional opcional
      
      // Environmental impact (formatted strings)
      impactCo2: `${environmentalImpact.co2}`,
      impactWater: `${environmentalImpact.water}`,
      impactEff: `${environmentalImpact.resources}%`,
      
      // Auto-publish if data is complete
      status: (data.photo1Url && data.photo2Url) ? 'published' : 'pending',
      publishedAt: (data.photo1Url && data.photo2Url) ? new Date() : null,
    };
    
    const product = await prisma.product.create({
      data: productData
    });
    
    return NextResponse.json({ 
      product,
      calculatedData: {
        estimatedWeight,
        environmentalImpact,
        revenueModel
      }
    }, { status: 201 });
  } catch (e) {
    console.error('Error creating product:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 