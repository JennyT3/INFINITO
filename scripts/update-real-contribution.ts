import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRealContribution() {
  try {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-PT'); // 25/7/2025 format
    
    // Actualizar la contribución real
    const updatedContribution = await prisma.contribution.update({
      where: {
        tracking: 'INF_1753475802913_3ewhghxth'
      },
      data: {
        tipo: 'clothing',
        nome: 'Contribuição de Roupa',
        totalItems: 5,
        estado: 'pendiente',
        fecha: formattedDate,
        detalles: 'Pickup point: Municipal Market (41.3006, -7.7441)',
        trackingState: 'registered', // Solo registrado por ahora
        createdAt: today, // Fecha de hoy
        updatedAt: today,
        // Datos de impacto (se calcularán cuando se reciba)
        co2Saved: 0,
        waterSaved: 0,
        naturalResources: 0,
        // Información del punto de recogida
        pickupPoint: 'Municipal Market (41.3006, -7.7441)',
        // Estado inicial
        decision: null,
        classification: null,
        destination: null,
        certificateHash: null,
        certificateDate: null
      }
    });

    console.log('✅ Contribuição atualizada com sucesso:');
    console.log('📋 Tracking:', updatedContribution.tracking);
    console.log('👕 Tipo:', updatedContribution.tipo);
    console.log('📦 Items:', updatedContribution.totalItems);
    console.log('📊 Status:', updatedContribution.estado);
    console.log('📅 Data:', updatedContribution.fecha);
    console.log('📍 Detalhes:', updatedContribution.detalles);
    console.log('🔄 Estado Tracking:', updatedContribution.trackingState);
    console.log('⏰ Criado em:', updatedContribution.createdAt);

    // Verificar que existe en el admin
    const adminCheck = await prisma.contribution.findUnique({
      where: {
        tracking: 'INF_1753475802913_3ewhghxth'
      }
    });

    if (adminCheck) {
      console.log('\n✅ Contribuição disponível no painel de administrador');
      console.log('🔍 Pode ser visualizada em: http://localhost:3000/admin/contributions');
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar contribuição:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRealContribution(); 