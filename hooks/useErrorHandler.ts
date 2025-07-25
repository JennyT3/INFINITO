"use client";
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logger from '../lib/logger';

// Tipos de erro
export interface ErrorInfo {
	code?: string;
	message: string;
	details?: string;
	field?: string;
	timestamp?: string;
	context?: string;
	recoverable?: boolean;
	statusCode?: number;
}

export interface APIErrorResponse {
	error: {
		code: string;
		message: string;
		details?: string;
		field?: string;
		timestamp: string;
		requestId: string;
		stack?: string;
	};
}

// Hook principal para manejo de errores
export function useErrorHandler() {
	const [error, setError] = useState<ErrorInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const router = useRouter();

	// Limpar erro após um tempo
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => {
				setError(null);
			}, 30000); // 30 segundos

			return () => clearTimeout(timer);
		}
	}, [error]);

	// Limpar toast após um tempo
	useEffect(() => {
		if (toastMessage) {
			const timer = setTimeout(() => {
				setToastMessage(null);
			}, 5000); // 5 segundos

			return () => clearTimeout(timer);
		}
	}, [toastMessage]);

	// Função para lidar com erros de API
	const handleAPIError = useCallback((error: any, context?: string) => {
		console.error('API Error:', error);
		
		let errorInfo: ErrorInfo;

		if (error.response) {
			// Error de resposta HTTP
			const status = error.response.status;
			const data = error.response.data;

			if (data && data.error) {
				// Erro estruturado da API
				errorInfo = {
					code: data.error.code,
					message: data.error.message,
					details: data.error.details,
					field: data.error.field,
					timestamp: data.error.timestamp,
					context: context || 'API',
					recoverable: status < 500,
					statusCode: status
				};
			} else {
				// Erro genérico HTTP
				errorInfo = {
					code: `HTTP_${status}`,
					message: getHTTPErrorMessage(status),
					context: context || 'API',
					recoverable: status < 500,
					statusCode: status
				};
			}
		} else if (error.request) {
			// Erro de rede
			errorInfo = {
				code: 'NETWORK_ERROR',
				message: 'Erro de conexão. Verifique sua internet.',
				context: context || 'NETWORK',
				recoverable: true
			};
		} else {
			// Erro genérico
			errorInfo = {
				code: 'UNKNOWN_ERROR',
				message: error.message || 'Erro desconhecido',
				context: context || 'UNKNOWN',
				recoverable: true
			};
		}

		// Log do erro
		logger.error('API Error handled', context || 'API', error, errorInfo);

		// Definir erro no estado
		setError(errorInfo);

		// Redirecionar para login se não autorizado
		if (errorInfo.statusCode === 401) {
			router.push('/splash');
		}

		return errorInfo;
	}, [router]);

	// Função para lidar com erros de validação
	const handleValidationError = useCallback((errors: Record<string, string>) => {
		const firstError = Object.values(errors)[0];
		const firstField = Object.keys(errors)[0];
		
		const errorInfo: ErrorInfo = {
			code: 'VALIDATION_ERROR',
			message: firstError,
			field: firstField,
			context: 'VALIDATION',
			recoverable: true,
			timestamp: new Date().toISOString()
		};

		logger.validationError(firstField, firstError, errors);
		setError(errorInfo);
		
		return errorInfo;
	}, []);

	// Função para lidar com erros de React
	const handleReactError = useCallback((error: Error, errorInfo?: any) => {
		const errorData: ErrorInfo = {
			code: 'REACT_ERROR',
			message: error.message,
			details: error.stack,
			context: 'REACT',
			recoverable: true,
			timestamp: new Date().toISOString()
		};

		logger.error('React Error handled', 'REACT', error, errorInfo);
		setError(errorData);
		
		return errorData;
	}, []);

	// Função para mostrar toast de erro
	const showErrorToast = useCallback((message: string) => {
		setToastMessage(message);
		logger.warn('Error toast shown', 'TOAST', { message });
	}, []);

	// Função para mostrar toast de sucesso
	const showSuccessToast = useCallback((message: string) => {
		setToastMessage(message);
		logger.info('Success toast shown', 'TOAST', { message });
	}, []);

	// Função para limpar erro
	const clearError = useCallback(() => {
		setError(null);
		logger.info('Error cleared', 'ERROR_HANDLER');
	}, []);

	// Função para limpar toast
	const clearToast = useCallback(() => {
		setToastMessage(null);
	}, []);

	// Função para retry com loading
	const retryWithLoading = useCallback(async (fn: () => Promise<any>, context?: string) => {
		setIsLoading(true);
		setError(null);
		
		try {
			logger.info('Retrying operation', context || 'RETRY');
			const result = await fn();
			logger.info('Retry successful', context || 'RETRY');
			return result;
		} catch (error) {
			logger.error('Retry failed', context || 'RETRY', error as Error);
			handleAPIError(error, context);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [handleAPIError]);

	return {
		error,
		isLoading,
		toastMessage,
		handleAPIError,
		handleValidationError,
		handleReactError,
		showErrorToast,
		showSuccessToast,
		clearError,
		clearToast,
		retryWithLoading,
		setIsLoading
	};
}

// Hook para requisições HTTP com manejo de erro
export function useAPIRequest() {
	const { handleAPIError, setIsLoading, isLoading } = useErrorHandler();

	const makeRequest = useCallback(async <T>(
		request: () => Promise<T>,
		context?: string
	): Promise<T | null> => {
		setIsLoading(true);
		
		try {
			const result = await request();
			logger.info('API request successful', context || 'API');
			return result;
		} catch (error) {
			handleAPIError(error, context);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [handleAPIError, setIsLoading]);

	return {
		makeRequest,
		isLoading
	};
}

// Hook para formulários com validação
export function useFormValidation() {
	const { handleValidationError } = useErrorHandler();
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validate = useCallback((data: Record<string, any>, rules: Record<string, any>) => {
		const newErrors: Record<string, string> = {};

		Object.keys(rules).forEach(field => {
			const value = data[field];
			const rule = rules[field];

			if (rule.required && (!value || value.toString().trim() === '')) {
				newErrors[field] = rule.message || `${field} é obrigatório`;
			} else if (rule.minLength && value && value.toString().length < rule.minLength) {
				newErrors[field] = rule.message || `${field} deve ter pelo menos ${rule.minLength} caracteres`;
			} else if (rule.maxLength && value && value.toString().length > rule.maxLength) {
				newErrors[field] = rule.message || `${field} deve ter no máximo ${rule.maxLength} caracteres`;
			} else if (rule.pattern && value && !rule.pattern.test(value)) {
				newErrors[field] = rule.message || `${field} tem formato inválido`;
			} else if (rule.validate && value && !rule.validate(value)) {
				newErrors[field] = rule.message || `${field} é inválido`;
			}
		});

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			handleValidationError(newErrors);
			return false;
		}

		return true;
	}, [handleValidationError]);

	const clearErrors = useCallback(() => {
		setErrors({});
	}, []);

	return {
		errors,
		validate,
		clearErrors,
		hasErrors: Object.keys(errors).length > 0
	};
}

// Função auxiliar para mensagens de erro HTTP
function getHTTPErrorMessage(status: number): string {
	switch (status) {
		case 400:
			return 'Solicitação inválida';
		case 401:
			return 'Não autorizado. Faça login novamente.';
		case 403:
			return 'Acesso negado';
		case 404:
			return 'Recurso não encontrado';
		case 405:
			return 'Método não permitido';
		case 408:
			return 'Timeout da solicitação';
		case 409:
			return 'Conflito de dados';
		case 422:
			return 'Dados inválidos';
		case 429:
			return 'Muitas solicitações. Tente novamente mais tarde.';
		case 500:
			return 'Erro interno do servidor';
		case 502:
			return 'Serviço indisponível';
		case 503:
			return 'Serviço temporariamente indisponível';
		case 504:
			return 'Timeout do servidor';
		default:
			return `Erro HTTP ${status}`;
	}
} 