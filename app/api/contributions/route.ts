import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import logger from '../../../lib/logger';
import { 
	handleAPIError, 
	createSuccessResponse, 
	InfinitoAPIError, 
	ErrorCode,
	createNotFoundError,
	createUnauthorizedError,
	createValidationFieldError,
	createDatabaseError,
	withErrorHandler
} from '../../../lib/api-error-handler';

// Validação de dados de contribuição
interface ContributionData {
	tipo: string;
	nome: string;
	totalItems: number;
	detalles?: string;
	imageUrls?: string[];
	estimatedValue?: number;
	estado?: string;
	classification?: string;
	tags?: string[];
	location?: {
		address?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		latitude?: number;
		longitude?: number;
	};
}

function validateContributionData(data: any): ContributionData {
	const errors: Array<{ field: string; message: string }> = [];

	// Validações obrigatórias
	if (!data.tipo || typeof data.tipo !== 'string') {
		errors.push({ field: 'tipo', message: 'Tipo de item é obrigatório' });
	}

	if (!data.nome || typeof data.nome !== 'string') {
		errors.push({ field: 'nome', message: 'Nome do item é obrigatório' });
	}

	if (!data.totalItems || typeof data.totalItems !== 'number' || data.totalItems <= 0) {
		errors.push({ field: 'totalItems', message: 'Quantidade deve ser maior que zero' });
	}

	// Validações opcionais
	if (data.estimatedValue && (typeof data.estimatedValue !== 'number' || data.estimatedValue < 0)) {
		errors.push({ field: 'estimatedValue', message: 'Valor estimado deve ser um número positivo' });
	}

	if (data.imageUrls && !Array.isArray(data.imageUrls)) {
		errors.push({ field: 'imageUrls', message: 'Imagens devem ser um array' });
	}

	if (data.tags && !Array.isArray(data.tags)) {
		errors.push({ field: 'tags', message: 'Tags devem ser um array' });
	}

	if (errors.length > 0) {
		throw new InfinitoAPIError(
			ErrorCode.VALIDATION_ERROR,
			'Dados de contribuição inválidos',
			errors.map(e => `${e.field}: ${e.message}`).join(', '),
			undefined,
			{ validationErrors: errors }
		);
	}

	return data as ContributionData;
}

// GET - Listar contribuições
export const GET = withErrorHandler(async (request: NextRequest) => {
	logger.info('GET /api/contributions', 'API');

	// Permitir acceso libre para desarrollo
	// const session = await getServerSession(authOptions);
	// if (!session?.user?.email) {
	// 	throw createUnauthorizedError();
	// }

	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get('page') || '1');
	const limit = parseInt(searchParams.get('limit') || '10');
	const type = searchParams.get('type');
	const category = searchParams.get('category');
	const userId = searchParams.get('userId');
	const tracking = searchParams.get('tracking');
	const date = searchParams.get('date');

	// Validar parâmetros
	if (page < 1 || limit < 1 || limit > 100) {
		throw createValidationFieldError('pagination', 'Parâmetros de paginação inválidos');
	}

	try {
		// Construir filtros
		const where: any = {};
		
		if (type) {
			where.tipo = type;
		}
		
		if (category) {
			where.classification = category;
		}
		
		if (tracking) {
			where.tracking = tracking;
		}
		
		if (date) {
			// Filtrar por fecha específica
			const startDate = new Date(date);
			const endDate = new Date(date);
			endDate.setDate(endDate.getDate() + 1);
			
			where.createdAt = {
				gte: startDate,
				lt: endDate
			};
		}
		
		// Buscar contribuições
		const [contributions, total] = await Promise.all([
			prisma.contribution.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * limit,
				take: limit
			}),
			prisma.contribution.count({ where })
		]);

		logger.info('Contributions retrieved', 'API', { 
			count: contributions.length, 
			total, 
			page, 
			limit,
			userEmail: 'development',
			filters: { type, category, tracking, date }
		});

		// Si se busca por tracking específico, devolver solo el array
		if (tracking) {
			return createSuccessResponse(contributions);
		}

		return createSuccessResponse({
			contributions,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
				hasNext: page * limit < total,
				hasPrev: page > 1
			}
		});

	} catch (error) {
		logger.error('Database error in GET /api/contributions', 'API', error as Error);
		throw createDatabaseError((error as Error).message);
	}
});

// POST - Criar nova contribuição
export const POST = withErrorHandler(async (request: NextRequest) => {
	logger.info('POST /api/contributions', 'API');

	// Permitir acceso libre para desarrollo
	// const session = await getServerSession(authOptions);
	// if (!session?.user?.email) {
	// 	throw createUnauthorizedError();
	// }

	let data;
	try {
		data = await request.json();
	} catch (error) {
		throw new InfinitoAPIError(
			ErrorCode.BAD_REQUEST,
			'Formato JSON inválido',
			(error as Error).message
		);
	}

	// Validar dados
	const validatedData = validateContributionData(data);

	try {
		// Calcular métricas ambientais
		const environmentalMetrics = calculateEnvironmentalMetrics(validatedData);

		// Gerar tracking único
		const tracking = `INF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// Criar contribuição
		const contribution = await prisma.contribution.create({
			data: {
				tracking,
				tipo: validatedData.tipo,
				nome: validatedData.nome,
				totalItems: validatedData.totalItems,
				detalles: validatedData.detalles,
				imageUrls: validatedData.imageUrls ? JSON.stringify(validatedData.imageUrls) : null,
				estado: validatedData.estado || 'pending',
				classification: validatedData.classification,
				metodo: 'app',
				co2Saved: parseFloat(environmentalMetrics.carbonReduced),
				waterSaved: parseFloat(environmentalMetrics.waterSaved),
				naturalResources: parseInt(environmentalMetrics.wasteReduced),
				verified: false
			}
		});

		logger.userAction('Contribution created', {
			contributionId: contribution.id,
			userEmail: 'development',
			tipo: contribution.tipo,
			totalItems: contribution.totalItems,
			environmentalMetrics
		});

		return createSuccessResponse(contribution, 'Contribuição criada com sucesso', 201);

	} catch (error) {
		logger.error('Database error in POST /api/contributions', 'API', error as Error);
		throw createDatabaseError((error as Error).message);
	}
});

// PUT - Atualizar contribuição
export const PUT = withErrorHandler(async (request: NextRequest) => {
	logger.info('PUT /api/contributions', 'API');

	// const session = await getServerSession(authOptions);
	// if (!session?.user?.email) {
	// 	throw createUnauthorizedError();
	// }

	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		throw createValidationFieldError('id', 'ID da contribuição é obrigatório');
	}

	let data;
	try {
		data = await request.json();
	} catch (error) {
		throw new InfinitoAPIError(
			ErrorCode.BAD_REQUEST,
			'Formato JSON inválido',
			(error as Error).message
		);
	}

	try {
		// Verificar se a contribuição existe
		const existingContribution = await prisma.contribution.findUnique({
			where: { id: parseInt(id) }
		});

		if (!existingContribution) {
			throw createNotFoundError('Contribuição');
		}

		// Validar dados
		const validatedData = validateContributionData(data);

		// Recalcular métricas ambientais
		const environmentalMetrics = calculateEnvironmentalMetrics(validatedData);

		// Atualizar contribuição
		const updatedContribution = await prisma.contribution.update({
			where: { id: parseInt(id) },
			data: {
				tipo: validatedData.tipo,
				nome: validatedData.nome,
				totalItems: validatedData.totalItems,
				detalles: validatedData.detalles,
				imageUrls: validatedData.imageUrls ? JSON.stringify(validatedData.imageUrls) : null,
				estado: validatedData.estado || 'pending',
				classification: validatedData.classification,
				co2Saved: parseFloat(environmentalMetrics.carbonReduced),
				waterSaved: parseFloat(environmentalMetrics.waterSaved),
				naturalResources: parseInt(environmentalMetrics.wasteReduced),
				updatedAt: new Date()
			}
		});

		logger.userAction('Contribution updated', {
			contributionId: updatedContribution.id,
			userEmail: 'development', // session.user.email,
			changes: Object.keys(data),
			environmentalMetrics
		});

		return createSuccessResponse(updatedContribution, 'Contribuição atualizada com sucesso');

	} catch (error) {
		if (error instanceof InfinitoAPIError) {
			throw error;
		}
		logger.error('Database error in PUT /api/contributions', 'API', error as Error);
		throw createDatabaseError((error as Error).message);
	}
});

// DELETE - Deletar contribuição
export const DELETE = withErrorHandler(async (request: NextRequest) => {
	logger.info('DELETE /api/contributions', 'API');

	// const session = await getServerSession(authOptions);
	// if (!session?.user?.email) {
	// 	throw createUnauthorizedError();
	// }

	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		throw createValidationFieldError('id', 'ID da contribuição é obrigatório');
	}

	try {
		// Verificar se a contribuição existe
		const existingContribution = await prisma.contribution.findUnique({
			where: { id: parseInt(id) }
		});

		if (!existingContribution) {
			throw createNotFoundError('Contribuição');
		}

		// Deletar contribuição
		await prisma.contribution.delete({
			where: { id: parseInt(id) }
		});

		logger.userAction('Contribution deleted', {
			contributionId: parseInt(id),
			userEmail: 'development', // session.user.email,
			tipo: existingContribution.tipo
		});

		return createSuccessResponse(null, 'Contribuição deletada com sucesso');

	} catch (error) {
		if (error instanceof InfinitoAPIError) {
			throw error;
		}
		logger.error('Database error in DELETE /api/contributions', 'API', error as Error);
		throw createDatabaseError((error as Error).message);
	}
});

// Função auxiliar para calcular métricas ambientais
function calculateEnvironmentalMetrics(data: ContributionData) {
	// Fatores de conversão baseados no tipo de item
	const conversionFactors: Record<string, any> = {
		'clothing': {
			carbonReduced: 3.2, // kg CO2 per item
			waterSaved: 2700, // liters per item
			energySaved: 5.5, // kWh per item
			wasteReduced: 0.5 // kg per item
		},
		'electronics': {
			carbonReduced: 85, // kg CO2 per kg
			waterSaved: 1400, // liters per kg
			energySaved: 45, // kWh per kg
			wasteReduced: 1.2 // kg per kg
		},
		'books': {
			carbonReduced: 2.5, // kg CO2 per item
			waterSaved: 35, // liters per item
			energySaved: 3.2, // kWh per item
			wasteReduced: 0.8 // kg per item
		},
		'furniture': {
			carbonReduced: 15, // kg CO2 per item
			waterSaved: 150, // liters per item
			energySaved: 25, // kWh per item
			wasteReduced: 5 // kg per item
		},
		'default': {
			carbonReduced: 2, // kg CO2 per item
			waterSaved: 100, // liters per item
			energySaved: 5, // kWh per item
			wasteReduced: 1 // kg per item
		}
	};

	const factors = conversionFactors[data.tipo] || conversionFactors['default'];
	
	return {
		carbonReduced: (factors.carbonReduced * data.totalItems).toFixed(2),
		waterSaved: (factors.waterSaved * data.totalItems).toFixed(2),
		energySaved: (factors.energySaved * data.totalItems).toFixed(2),
		wasteReduced: (factors.wasteReduced * data.totalItems).toFixed(2)
	};
} 