"use client";
import React from 'react';
import { AlertCircle, Wifi, RefreshCw, Home, ArrowLeft, Bug, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import logger from '../lib/logger';

// Types para diferentes tipos de errores
export interface ErrorInfo {
	code?: string;
	message: string;
	details?: string;
	timestamp?: string;
	context?: string;
	recoverable?: boolean;
	actions?: ErrorAction[];
}

export interface ErrorAction {
	label: string;
	onClick: () => void;
	variant?: 'primary' | 'secondary' | 'danger';
	icon?: React.ReactNode;
}

// Error genérico con diseño INFINITO
export function InfinitoError({
	title = "Algo deu errado",
	message,
	icon: Icon = AlertCircle,
	iconColor = "#D42D66",
	actions = [],
	showDetails = false,
	errorInfo,
	className = "",
	children
}: {
	title?: string;
	message: string;
	icon?: React.ComponentType<{ className?: string }>;
	iconColor?: string;
	actions?: ErrorAction[];
	showDetails?: boolean;
	errorInfo?: ErrorInfo;
	className?: string;
	children?: React.ReactNode;
}) {
	const router = useRouter();

	const defaultActions: ErrorAction[] = [
		{
			label: "Tentar Novamente",
			onClick: () => window.location.reload(),
			variant: 'primary',
			icon: <RefreshCw className="w-4 h-4" />
		},
		{
			label: "Voltar ao Início",
			onClick: () => router.push('/dashboard'),
			variant: 'secondary',
			icon: <Home className="w-4 h-4" />
		}
	];

	const finalActions = actions.length > 0 ? actions : defaultActions;

	// Log the error
	React.useEffect(() => {
		logger.error(
			`Error displayed: ${title}`,
			'ERROR_COMPONENT',
			errorInfo ? new Error(errorInfo.message) : undefined,
			{ title, message, errorInfo }
		);
	}, [title, message, errorInfo]);

	return (
		<div className={`infinito-card max-w-md mx-auto text-center ${className}`}>
			{/* Ícone do erro */}
			<div 
				className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse"
				style={{ backgroundColor: `${iconColor}20` }}
			>
				<Icon className="w-10 h-10" />
			</div>

			{/* Título */}
			<h3 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">
				{title}
			</h3>

			{/* Mensagem */}
			<p className="text-gray-600 mb-6 leading-relaxed">
				{message}
			</p>

			{/* Detalhes técnicos (se solicitado) */}
			{showDetails && errorInfo && (
				<div className="infinito-glass rounded-xl p-4 mb-6 text-left">
					<div className="text-sm text-gray-700 space-y-2">
						{errorInfo.code && (
							<div>
								<span className="font-medium">Código:</span> {errorInfo.code}
							</div>
						)}
						{errorInfo.timestamp && (
							<div>
								<span className="font-medium">Timestamp:</span> {new Date(errorInfo.timestamp).toLocaleString()}
							</div>
						)}
						{errorInfo.context && (
							<div>
								<span className="font-medium">Contexto:</span> {errorInfo.context}
							</div>
						)}
						{errorInfo.details && (
							<div>
								<span className="font-medium">Detalhes:</span> {errorInfo.details}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Children adicional */}
			{children}

			{/* Ações */}
			<div className="space-y-3">
				{finalActions.map((action, index) => (
					<button
						key={index}
						onClick={action.onClick}
						className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
							action.variant === 'primary' 
								? 'infinito-button infinito-green text-white'
								: action.variant === 'danger'
								? 'infinito-button bg-red-500 text-white'
								: 'infinito-glass text-gray-700 hover:bg-white/30'
						}`}
					>
						{action.icon}
						{action.label}
					</button>
				))}
			</div>

			{/* Footer com logo */}
			<div className="mt-6 pt-4 border-t border-gray-200">
				<p className="text-xs text-gray-500">
					Sistema INFINITO • Economia Circular
				</p>
			</div>
		</div>
	);
}

// Error de conexão/rede
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
	return (
		<InfinitoError
			title="Erro de Conexão"
			message="Verifique sua conexão com a internet e tente novamente."
			icon={Wifi}
			iconColor="#3E88FF"
			actions={[
				{
					label: "Tentar Novamente",
					onClick: onRetry || (() => window.location.reload()),
					variant: 'primary',
					icon: <RefreshCw className="w-4 h-4" />
				}
			]}
		/>
	);
}

// Error de autenticação
export function AuthError({ onLogin }: { onLogin?: () => void }) {
	const router = useRouter();

	return (
		<InfinitoError
			title="Erro de Autenticação"
			message="Sua sessão expirou ou você não tem permissão para acessar este recurso."
			icon={Shield}
			iconColor="#813684"
			actions={[
				{
					label: "Fazer Login",
					onClick: onLogin || (() => router.push('/splash')),
					variant: 'primary',
					icon: <Shield className="w-4 h-4" />
				}
			]}
		/>
	);
}

// Error de validação
export function ValidationError({ 
	errors, 
	onBack 
}: { 
	errors: string[];
	onBack?: () => void;
}) {
	const router = useRouter();

	return (
		<InfinitoError
			title="Erro de Validação"
			message="Por favor, corrija os seguintes problemas:"
			icon={AlertCircle}
			iconColor="#F59E0B"
			actions={[
				{
					label: "Voltar",
					onClick: onBack || (() => router.back()),
					variant: 'primary',
					icon: <ArrowLeft className="w-4 h-4" />
				}
			]}
			className="max-w-lg"
		>
			<div className="infinito-glass rounded-xl p-4 mb-6">
				<ul className="text-left text-sm text-gray-700 space-y-2">
					{errors.map((error, index) => (
						<li key={index} className="flex items-start gap-2">
							<span className="text-yellow-500 mt-0.5">•</span>
							{error}
						</li>
					))}
				</ul>
			</div>
		</InfinitoError>
	);
}

// Error 404
export function NotFoundError() {
	const router = useRouter();

	return (
		<InfinitoError
			title="Página Não Encontrada"
			message="A página que você está procurando não existe ou foi movida."
			icon={Bug}
			iconColor="#6B7280"
			actions={[
				{
					label: "Voltar ao Início",
					onClick: () => router.push('/dashboard'),
					variant: 'primary',
					icon: <Home className="w-4 h-4" />
				},
				{
					label: "Voltar",
					onClick: () => router.back(),
					variant: 'secondary',
					icon: <ArrowLeft className="w-4 h-4" />
				}
			]}
		/>
	);
}

// Error 500
export function ServerError({ onRetry }: { onRetry?: () => void }) {
	return (
		<InfinitoError
			title="Erro do Servidor"
			message="Ocorreu um erro interno no servidor. Nossa equipe foi notificada e está trabalhando para resolver."
			icon={Zap}
			iconColor="#EF4444"
			actions={[
				{
					label: "Tentar Novamente",
					onClick: onRetry || (() => window.location.reload()),
					variant: 'primary',
					icon: <RefreshCw className="w-4 h-4" />
				}
			]}
		/>
	);
}

// Loading Error (quando algo demora muito)
export function LoadingError({ 
	resource = "dados",
	onRetry 
}: { 
	resource?: string;
	onRetry?: () => void;
}) {
	return (
		<InfinitoError
			title="Erro ao Carregar"
			message={`Não foi possível carregar ${resource}. Verifique sua conexão e tente novamente.`}
			icon={RefreshCw}
			iconColor="#F97316"
			actions={[
				{
					label: "Tentar Novamente",
					onClick: onRetry || (() => window.location.reload()),
					variant: 'primary',
					icon: <RefreshCw className="w-4 h-4" />
				}
			]}
		/>
	);
}

// Error com ação customizada
export function CustomError({
	title,
	message,
	icon,
	iconColor,
	actions,
	showReportButton = true
}: {
	title: string;
	message: string;
	icon?: React.ComponentType<{ className?: string }>;
	iconColor?: string;
	actions?: ErrorAction[];
	showReportButton?: boolean;
}) {
	const handleReport = () => {
		logger.userAction('Error reported by user', { title, message });
		// TODO: Implementar sistema de reporte de bugs
		alert('Erro reportado! Obrigado pelo feedback.');
	};

	const finalActions = showReportButton ? [
		...(actions || []),
		{
			label: "Reportar Erro",
			onClick: handleReport,
			variant: 'secondary' as const,
			icon: <Bug className="w-4 h-4" />
		}
	] : actions;

	return (
		<InfinitoError
			title={title}
			message={message}
			icon={icon}
			iconColor={iconColor}
			actions={finalActions}
		/>
	);
}

// Toast de erro rápido
export function ErrorToast({
	message,
	onClose,
	duration = 5000
}: {
	message: string;
	onClose: () => void;
	duration?: number;
}) {
	React.useEffect(() => {
		const timer = setTimeout(onClose, duration);
		return () => clearTimeout(timer);
	}, [onClose, duration]);

	return (
		<div className="fixed top-4 right-4 z-50 animate-slide-in">
			<div className="infinito-glass rounded-xl p-4 max-w-sm shadow-lg border border-red-200">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
						<AlertCircle className="w-4 h-4 text-red-600" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-800 mb-1">Erro</p>
						<p className="text-sm text-gray-600">{message}</p>
					</div>
					<button
						onClick={onClose}
						className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
					>
						<span className="text-gray-400">×</span>
					</button>
				</div>
			</div>
		</div>
	);
}

// Hook para gerenciar erros
export function useErrorHandler() {
	const [error, setError] = React.useState<ErrorInfo | null>(null);
	const [showToast, setShowToast] = React.useState(false);
	const [toastMessage, setToastMessage] = React.useState('');

	const handleError = React.useCallback((error: Error, context?: string) => {
		logger.error('Error handled by useErrorHandler', context, error);
		
		setError({
			message: error.message,
			details: error.stack,
			timestamp: new Date().toISOString(),
			context,
			recoverable: true
		});
	}, []);

	const handleApiError = React.useCallback((status: number, message: string, url?: string) => {
		logger.apiError('Unknown', url || 'Unknown URL', status, new Error(message));
		
		setError({
			code: status.toString(),
			message,
			timestamp: new Date().toISOString(),
			context: 'API',
			recoverable: status !== 500
		});
	}, []);

	const showErrorToast = React.useCallback((message: string) => {
		setToastMessage(message);
		setShowToast(true);
		logger.warn('Error toast shown', 'TOAST', { message });
	}, []);

	const clearError = React.useCallback(() => {
		setError(null);
	}, []);

	const clearToast = React.useCallback(() => {
		setShowToast(false);
		setToastMessage('');
	}, []);

	return {
		error,
		showToast,
		toastMessage,
		handleError,
		handleApiError,
		showErrorToast,
		clearError,
		clearToast
	};
} 