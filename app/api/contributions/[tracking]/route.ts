import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { tracking: string } }
) {
  const { tracking } = params;
  if (!tracking || tracking === 'null') {
    return NextResponse.json({ error: 'Código de contribución no proporcionado o inválido' }, { status: 400 });
  }
  const contribution = await prisma.contribution.findUnique({ where: { tracking } });
  if (!contribution || !contribution.tracking || contribution.tracking === 'null') {
    return NextResponse.json({ error: 'Contribución no encontrada' }, { status: 404 });
  }
  return NextResponse.json(contribution);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { tracking: string } }
) {
  try {
    const { tracking } = params;
    const data = await req.json();
    
    if (!tracking || tracking === 'null') {
      return NextResponse.json({ error: 'Código de contribución no proporcionado o inválido' }, { status: 400 });
    }
    
    const updatedContribution = await prisma.contribution.update({
      where: { tracking },
      data: {
        trackingState: data.trackingState,
        classification: data.classification,
        destination: data.destination,
        co2Saved: data.co2Saved,
        waterSaved: data.waterSaved,
        naturalResources: data.naturalResources,
        verified: data.verified,
        certificateHash: data.certificateHash,
        certificateDate: data.certificateDate,
        adminUserId: data.adminUserId,
        // Preserve existing fields
        tipo: data.tipo,
        metodo: data.metodo,
        nome: data.nome,
        estado: data.estado,
        detalles: data.detalles,
        totalItems: data.totalItems,
        recyclingPercentage: data.recyclingPercentage,
        repairPercentage: data.repairPercentage,
        cotton: data.cotton,
        polyester: data.polyester,
        wool: data.wool,
        other: data.other,
        aiConfidence: data.aiConfidence,
        methodology: data.methodology,
        uncertainty: data.uncertainty,
        region: data.region,
        imageUrls: data.imageUrls
      }
    });
    
    return NextResponse.json(updatedContribution);
  } catch (error) {
    console.error('Error updating contribution:', error);
    return NextResponse.json({ error: 'Error al actualizar contribución' }, { status: 500 });
  }
} 