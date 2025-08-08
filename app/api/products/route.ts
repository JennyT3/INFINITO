import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/products - lista todos o uno por id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const tracking = searchParams.get('tracking');
  
  try {
    if (id) {
      const product = await prisma.product.findUnique({ where: { id: Number(id) } });
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json(product);
    }
    
    const where: any = { status: 'published' };
    if (tracking) where.tracking = tracking;
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });
    
    return NextResponse.json(products);
  } catch (e) {
    console.error('Error fetching products:', e);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/products - crear producto
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log('📦 Received product data:', data);
    
    // Validación básica
    if (!data.tracking || data.tracking.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Tracking code is required' 
      }, { status: 400 });
    }

    if (!data.price || data.price <= 0) {
      return NextResponse.json({ 
        error: 'Valid price is required' 
      }, { status: 400 });
    }

    // Verificar que la contribución existe
    const contribution = await prisma.contribution.findFirst({
      where: { 
        tracking: data.tracking.trim(),
        tipo: 'clothing'
      }
    });

    if (!contribution) {
      return NextResponse.json({ 
        error: 'Invalid tracking code. No clothing contribution found.' 
      }, { status: 400 });
    }

    if (contribution.estado === 'pendiente') {
      return NextResponse.json({ 
        error: 'Cannot publish products for pending contributions.' 
      }, { status: 400 });
    }

    // Verificar que no existe ya un producto
    const existingProduct = await prisma.product.findFirst({
      where: { tracking: data.tracking.trim() }
    });

    if (existingProduct) {
      return NextResponse.json({ 
        error: 'A product has already been published for this contribution.' 
      }, { status: 400 });
    }
    
    // Preparar datos para creación
    const productData = {
      name: data.name || 'Product',
      garmentType: data.garmentType || 'Unknown',
      gender: data.gender || 'Unisex',
      color: data.color || 'Unknown',
      size: data.size || 'M',
      material: data.material || 'Unknown',
      country: data.country || 'Unknown',
      condition: data.condition || 'Good',
      price: data.price,
      tracking: data.tracking.trim(),
      originalPrice: data.originalPrice || data.price,
      commission: data.commission || 0,
      finalPrice: data.finalPrice || data.price,
      sellerName: data.sellerName || 'Anonymous',
      sellerEmail: data.sellerEmail || '',
      sellerPhone: data.sellerPhone || '',
      estimatedWeight: data.estimatedWeight || 0.25,
      standardImpact: data.standardImpact || { co2: 0, water: 0, resources: 0 },
      aiDetection: data.aiDetection || data.name,
      aiConfidence: data.aiConfidence || 0.9,
      photo1Url: data.photo1Url || '',
      photo2Url: data.photo2Url || '',
      photo3Url: data.photo3Url || '',
      impactCo2: data.impactCo2 || '0',
      impactWater: data.impactWater || '0',
      impactEff: data.impactEff || '0%',
      status: 'pending',
      publishedAt: null,
    };
    
    console.log('📦 Creating product with data:', productData);
    
    const product = await prisma.product.create({
      data: productData
    });
    
    console.log('✅ Product created successfully:', product);
    
    return NextResponse.json({ 
      success: true,
      product
    }, { status: 201 });
    
  } catch (e) {
    console.error('❌ Error creating product:', e);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
} 