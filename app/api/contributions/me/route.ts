import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createUnauthorizedError, createSuccessResponse, handleAPIError } from '@/lib/api-error-handler';
import logger from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	try {
		// Obtener sesión del usuario
		const session = await getServerSession(authOptions);
		
		// Log de depuración
		logger.debug('API /me - Session check', 'API', {
			hasSession: !!session,
			userEmail: session?.user?.email,
			method: 'GET'
		});
		
		// Verificar autenticación
		if (!session?.user?.email) {
			logger.warn('API /me - Unauthorized access attempt', 'API');
			// Return empty array instead of throwing error for better UX
			return createSuccessResponse([], 'No authenticated user found');
		}
		
		const userEmail = session.user.email;
		
		// Buscar contribuciones del usuario
		const contributions = await prisma.contribution.findMany({
			where: {
				OR: [
					{ nome: { contains: userEmail } },
					{ nome: { contains: userEmail.split('@')[0] } },
				],
			},
			orderBy: { fecha: 'desc' },
		});
		
		logger.info('API /me - Contributions retrieved', 'API', {
			userEmail,
			count: contributions.length,
			method: 'GET'
		});
		
		return createSuccessResponse(contributions, `${contributions.length} contribuições encontradas`);
		
	} catch (error) {
		logger.error('API /me - Error retrieving contributions', 'API', error as Error);
		return handleAPIError(error as Error, req);
	} finally {
		await prisma.$disconnect();
	}
} 