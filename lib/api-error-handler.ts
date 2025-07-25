/**
 * INFINITO API Error Handler
 * Standardized error handling for all API routes
 * Following INFINITO rules for comprehensive error management
 */

import { NextResponse } from 'next/server';
import logger from './logger';

// Error codes estandarizados
export enum ErrorCode {
	// Client errors (4xx)
	BAD_REQUEST = 'BAD_REQUEST',
	UNAUTHORIZED = 'UNAUTHORIZED',
	FORBIDDEN = 'FORBIDDEN',
	NOT_FOUND = 'NOT_FOUND',
	METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
	VALIDATION_ERROR = 'VALIDATION_ERROR',
	RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
	
	// Server errors (5xx)
	INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
	DATABASE_ERROR = 'DATABASE_ERROR',
	EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
	CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
	
	// Business logic errors
	INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
	RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
	BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
	
	// Authentication errors
	INVALID_TOKEN = 'INVALID_TOKEN',
	TOKEN_EXPIRED = 'TOKEN_EXPIRED',
	LOGIN_REQUIRED = 'LOGIN_REQUIRED',
	
	// Validation errors
	REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
	INVALID_FORMAT = 'INVALID_FORMAT',
	VALUE_OUT_OF_RANGE = 'VALUE_OUT_OF_RANGE',
	
	// External service errors
	PAYMENT_FAILED = 'PAYMENT_FAILED',
	EMAIL_DELIVERY_FAILED = 'EMAIL_DELIVERY_FAILED',
	FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED'
}

// Mapeamento de códigos para status HTTP
const ERROR_STATUS_MAP: Record<ErrorCode, number> = {
	[ErrorCode.BAD_REQUEST]: 400,
	[ErrorCode.UNAUTHORIZED]: 401,
	[ErrorCode.FORBIDDEN]: 403,
	[ErrorCode.NOT_FOUND]: 404,
	[ErrorCode.METHOD_NOT_ALLOWED]: 405,
	[ErrorCode.VALIDATION_ERROR]: 422,
	[ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
	[ErrorCode.INTERNAL_SERVER_ERROR]: 500,
	[ErrorCode.DATABASE_ERROR]: 500,
	[ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
	[ErrorCode.CONFIGURATION_ERROR]: 500,
	[ErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
	[ErrorCode.RESOURCE_CONFLICT]: 409,
	[ErrorCode.BUSINESS_RULE_VIOLATION]: 422,
	[ErrorCode.INVALID_TOKEN]: 401,
	[ErrorCode.TOKEN_EXPIRED]: 401,
	[ErrorCode.LOGIN_REQUIRED]: 401,
	[ErrorCode.REQUIRED_FIELD_MISSING]: 400,
	[ErrorCode.INVALID_FORMAT]: 400,
	[ErrorCode.VALUE_OUT_OF_RANGE]: 400,
	[ErrorCode.PAYMENT_FAILED]: 402,
	[ErrorCode.EMAIL_DELIVERY_FAILED]: 502,
	[ErrorCode.FILE_UPLOAD_FAILED]: 500
};

// Mensagens de erro amigáveis
const ERROR_MESSAGES: Record<ErrorCode, string> = {
	[ErrorCode.BAD_REQUEST]: 'Solicitação inválida. Verifique os dados enviados.',
	[ErrorCode.UNAUTHORIZED]: 'Acesso não autorizado. Faça login novamente.',
	[ErrorCode.FORBIDDEN]: 'Você não tem permissão para acessar este recurso.',
	[ErrorCode.NOT_FOUND]: 'Recurso não encontrado.',
	[ErrorCode.METHOD_NOT_ALLOWED]: 'Método não permitido para esta rota.',
	[ErrorCode.VALIDATION_ERROR]: 'Dados inválidos. Corrija os erros e tente novamente.',
	[ErrorCode.RATE_LIMIT_EXCEEDED]: 'Muitas solicitações. Tente novamente em alguns minutos.',
	[ErrorCode.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor. Tente novamente mais tarde.',
	[ErrorCode.DATABASE_ERROR]: 'Erro na base de dados. Tente novamente mais tarde.',
	[ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Erro no serviço externo. Tente novamente mais tarde.',
	[ErrorCode.CONFIGURATION_ERROR]: 'Erro de configuração do servidor.',
	[ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissões insuficientes para esta operação.',
	[ErrorCode.RESOURCE_CONFLICT]: 'Conflito de recursos. O recurso já existe ou está em uso.',
	[ErrorCode.BUSINESS_RULE_VIOLATION]: 'Violação de regra de negócio.',
	[ErrorCode.INVALID_TOKEN]: 'Token inválido. Faça login novamente.',
	[ErrorCode.TOKEN_EXPIRED]: 'Token expirado. Faça login novamente.',
	[ErrorCode.LOGIN_REQUIRED]: 'Login obrigatório para acessar este recurso.',
	[ErrorCode.REQUIRED_FIELD_MISSING]: 'Campo obrigatório em falta.',
	[ErrorCode.INVALID_FORMAT]: 'Formato inválido.',
	[ErrorCode.VALUE_OUT_OF_RANGE]: 'Valor fora do intervalo permitido.',
	[ErrorCode.PAYMENT_FAILED]: 'Falha no pagamento. Verifique os dados e tente novamente.',
	[ErrorCode.EMAIL_DELIVERY_FAILED]: 'Falha no envio do email. Tente novamente mais tarde.',
	[ErrorCode.FILE_UPLOAD_FAILED]: 'Falha no upload do arquivo. Tente novamente.'
};

// Interface para erros da API
export interface APIError {
	code: ErrorCode;
	message: string;
	details?: string;
	field?: string;
	timestamp: string;
	requestId: string;
	path?: string;
	method?: string;
	statusCode: number;
	stack?: string;
	context?: Record<string, any>;
}

// Interface para validação de erros
export interface ValidationError {
	field: string;
	message: string;
	code: ErrorCode;
	value?: any;
}

// Classe para erros personalizados
export class InfinitoAPIError extends Error {
	public readonly code: ErrorCode;
	public readonly statusCode: number;
	public readonly details?: string;
	public readonly field?: string;
	public readonly context?: Record<string, any>;

	constructor(
		code: ErrorCode,
		message?: string,
		details?: string,
		field?: string,
		context?: Record<string, any>
	) {
		super(message || ERROR_MESSAGES[code]);
		this.name = 'InfinitoAPIError';
		this.code = code;
		this.statusCode = ERROR_STATUS_MAP[code];
		this.details = details;
		this.field = field;
		this.context = context;
	}
}

// Gerador de ID de requisição
function generateRequestId(): string {
	return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Função principal de tratamento de erros
export function handleAPIError(
	error: Error | InfinitoAPIError,
	request?: Request,
	context?: Record<string, any>
): NextResponse {
	const requestId = generateRequestId();
	const timestamp = new Date().toISOString();
	
	// Extrair informações da requisição
	const method = request?.method || 'UNKNOWN';
	const path = request ? new URL(request.url).pathname : 'UNKNOWN';
	
	let apiError: APIError;
	
	if (error instanceof InfinitoAPIError) {
		// Erro personalizado da aplicação
		apiError = {
			code: error.code,
			message: error.message,
			details: error.details,
			field: error.field,
			timestamp,
			requestId,
			path,
			method,
			statusCode: error.statusCode,
			context: error.context
		};
	} else {
		// Erro genérico/inesperado
		apiError = {
			code: ErrorCode.INTERNAL_SERVER_ERROR,
			message: ERROR_MESSAGES[ErrorCode.INTERNAL_SERVER_ERROR],
			details: process.env.NODE_ENV === 'development' ? error.message : undefined,
			timestamp,
			requestId,
			path,
			method,
			statusCode: 500,
			stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
			context
		};
	}

	// Log do erro
	logger.apiError(method, path, apiError.statusCode, error, {
		requestId,
		code: apiError.code,
		context: apiError.context
	});

	// Resposta HTTP padronizada
	return NextResponse.json(
		{
			error: {
				code: apiError.code,
				message: apiError.message,
				details: apiError.details,
				field: apiError.field,
				timestamp: apiError.timestamp,
				requestId: apiError.requestId,
				...(process.env.NODE_ENV === 'development' && { stack: apiError.stack })
			}
		},
		{ status: apiError.statusCode }
	);
}

// Função para validação de erros
export function createValidationError(errors: ValidationError[]): InfinitoAPIError {
	const message = `Validation failed: ${errors.map(e => e.message).join(', ')}`;
	return new InfinitoAPIError(
		ErrorCode.VALIDATION_ERROR,
		message,
		undefined,
		undefined,
		{ validationErrors: errors }
	);
}

// Wrapper para rotas da API
export function withErrorHandler(handler: Function) {
	return async (request: Request, context?: any) => {
		try {
			return await handler(request, context);
		} catch (error) {
			return handleAPIError(error as Error, request, context);
		}
	};
}

// Middleware para tratamento de erros
export function errorMiddleware(handler: Function) {
	return async (request: Request, response: Response, next: Function) => {
		try {
			await handler(request, response, next);
		} catch (error) {
			return handleAPIError(error as Error, request);
		}
	};
}

// Validador de esquemas
export function validateSchema<T>(data: any, schema: any): T {
	// Implementar validação usando Zod, Joi, ou similar
	// Por agora, retorna os dados como estão
	return data;
}

// Função para criar resposta de sucesso padronizada
export function createSuccessResponse<T>(
	data: T,
	message?: string,
	statusCode: number = 200
): NextResponse {
	return NextResponse.json(
		{
			success: true,
			data,
			message: message || 'Operação realizada com sucesso',
			timestamp: new Date().toISOString()
		},
		{ status: statusCode }
	);
}

// Funcões auxiliares para erros específicos
export const createNotFoundError = (resource: string) => 
	new InfinitoAPIError(ErrorCode.NOT_FOUND, `${resource} não encontrado`);

export const createUnauthorizedError = () => 
	new InfinitoAPIError(ErrorCode.UNAUTHORIZED);

export const createForbiddenError = () => 
	new InfinitoAPIError(ErrorCode.FORBIDDEN);

export const createValidationFieldError = (field: string, message: string) => 
	new InfinitoAPIError(ErrorCode.VALIDATION_ERROR, message, undefined, field);

export const createDatabaseError = (details?: string) => 
	new InfinitoAPIError(ErrorCode.DATABASE_ERROR, undefined, details);

export const createExternalServiceError = (service: string, details?: string) => 
	new InfinitoAPIError(
		ErrorCode.EXTERNAL_SERVICE_ERROR, 
		`Erro no serviço ${service}`, 
		details
	);

// Rate limiting error
export const createRateLimitError = (retryAfter?: number) => 
	new InfinitoAPIError(
		ErrorCode.RATE_LIMIT_EXCEEDED, 
		undefined, 
		retryAfter ? `Tente novamente em ${retryAfter} segundos` : undefined
	);

// Export default para uso fácil
export default {
	handleAPIError,
	createValidationError,
	withErrorHandler,
	errorMiddleware,
	validateSchema,
	createSuccessResponse,
	InfinitoAPIError,
	ErrorCode,
	createNotFoundError,
	createUnauthorizedError,
	createForbiddenError,
	createValidationFieldError,
	createDatabaseError,
	createExternalServiceError,
	createRateLimitError
}; 