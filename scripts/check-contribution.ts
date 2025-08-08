import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkContribution() {
  try {
    const contribution = await prisma.contribution.findUnique({
      where: {
        tracking: 'INF_1753475802913_3ewhghxth'
      }
    });

    if (contribution) {
      console.log('✅ Contribuição encontrada:');
      console.log('📋 Tracking:', contribution.tracking);
      console.log('👕 Tipo:', contribution.tipo);
      console.log('📦 Items:', contribution.totalItems);
      console.log('📊 Status:', contribution.estado);
      console.log('📅 Data:', contribution.fecha);
      console.log('📍 Detalhes:', contribution.detalhes);
      console.log('🔄 Estado Tracking:', contribution.trackingState);
      console.log('⏰ Criado em:', contribution.createdAt);
      console.log('📍 Ponto de Recogida:', contribution.pickupPoint);
      
      console.log('\n📊 Dados de Impacto:');
      console.log('🌱 CO₂ Saved:', contribution.co2Saved, 'kg');
      console.log('💧 Water Saved:', contribution.waterSaved, 'L');
      console.log('🌿 Natural Resources:', contribution.naturalResources, '%');
      
      console.log('\n🔧 Dados Administrativos:');
      console.log('📝 Decision:', contribution.decision);
      console.log('🏷️ Classification:', contribution.classification);
      console.log('🎯 Destination:', contribution.destination);
      console.log('🔐 Certificate Hash:', contribution.certificateHash);
      console.log('📅 Certificate Date:', contribution.certificateDate);
      
      console.log('\n✅ Disponível no painel de administrador em:');
      console.log('🔍 http://localhost:3000/admin/contributions');
      
    } else {
      console.log('❌ Contribuição não encontrada');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContribution(); 