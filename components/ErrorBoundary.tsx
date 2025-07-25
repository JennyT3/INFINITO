"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { InfinitoError } from './ErrorComponents';
import logger from '../lib/logger';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
	errorId: string | null;
}

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	resetOnPropsChange?: boolean;
	resetKeys?: Array<string | number>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	private resetTimeoutId: number | null = null;

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: null
		};
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		// Update state so the next render will show the fallback UI
		return {
			hasError: true,
			error,
			errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log the error
		logger.error(
			'React Error Boundary caught an error',
			'ERROR_BOUNDARY',
			error,
			{
				componentStack: errorInfo.componentStack,
				errorId: this.state.errorId,
				props: this.props,
				url: typeof window !== 'undefined' ? window.location.href : undefined
			}
		);

		// Call custom error handler if provided
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}

		// Update state with error info
		this.setState({
			errorInfo
		});

		// Send to external error tracking service
		if (process.env.NODE_ENV === 'production') {
			this.sendToErrorTracking(error, errorInfo);
		}
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		const { resetOnPropsChange, resetKeys } = this.props;
		const { hasError } = this.state;

		// Reset error state when props change (if enabled)
		if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
			this.resetErrorBoundary();
		}

		// Reset error state when reset keys change
		if (hasError && resetKeys && resetKeys.length > 0) {
			const prevResetKeys = prevProps.resetKeys || [];
			const hasResetKeyChanged = resetKeys.some((key, index) => key !== prevResetKeys[index]);
			
			if (hasResetKeyChanged) {
				this.resetErrorBoundary();
			}
		}
	}

	componentWillUnmount() {
		if (this.resetTimeoutId) {
			clearTimeout(this.resetTimeoutId);
		}
	}

	private async sendToErrorTracking(error: Error, errorInfo: ErrorInfo) {
		try {
			// Send to external service (e.g., Sentry, Bugsnag)
			await fetch('/api/error-tracking', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					error: {
						message: error.message,
						stack: error.stack,
						name: error.name
					},
					errorInfo: {
						componentStack: errorInfo.componentStack
					},
					errorId: this.state.errorId,
					timestamp: new Date().toISOString(),
					userAgent: navigator.userAgent,
					url: window.location.href
				})
			});
		} catch (err) {
			// Silently fail if error tracking fails
			logger.warn('Failed to send error to tracking service', 'ERROR_BOUNDARY', err);
		}
	}

	private resetErrorBoundary = () => {
		logger.info('Error boundary reset', 'ERROR_BOUNDARY', { errorId: this.state.errorId });
		
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			errorId: null
		});
	};

	private handleRetry = () => {
		logger.userAction('Error boundary retry', { errorId: this.state.errorId });
		this.resetErrorBoundary();
	};

	private handleReportError = () => {
		logger.userAction('Error boundary report', { errorId: this.state.errorId });
		
		// Create detailed error report
		const errorReport = {
			errorId: this.state.errorId,
			error: this.state.error?.message,
			stack: this.state.error?.stack,
			componentStack: this.state.errorInfo?.componentStack,
			timestamp: new Date().toISOString(),
			userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
			url: typeof window !== 'undefined' ? window.location.href : undefined
		};

		// Copy to clipboard for easy reporting
		if (typeof window !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
			alert('Detalhes do erro copiados para a área de transferência!');
		}
	};

	render() {
		if (this.state.hasError) {
			// Custom fallback UI
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI with INFINITO design
			return (
				<div className="min-h-screen flex items-center justify-center p-4">
					<InfinitoError
						title="Erro Inesperado"
						message="Algo deu errado na aplicação. Nossa equipe foi notificada automaticamente."
						iconColor="#EF4444"
						showDetails={process.env.NODE_ENV === 'development'}
						errorInfo={{
							code: this.state.errorId || 'UNKNOWN',
							message: this.state.error?.message || 'Erro desconhecido',
							details: this.state.error?.stack,
							timestamp: new Date().toISOString(),
							context: 'React Error Boundary',
							recoverable: true
						}}
						actions={[
							{
								label: "Tentar Novamente",
								onClick: this.handleRetry,
								variant: 'primary',
								icon: <span>🔄</span>
							},
							{
								label: "Reportar Erro",
								onClick: this.handleReportError,
								variant: 'secondary',
								icon: <span>📧</span>
							},
							{
								label: "Voltar ao Início",
								onClick: () => window.location.href = '/dashboard',
								variant: 'secondary',
								icon: <span>🏠</span>
							}
						]}
					/>
				</div>
			);
		}

		return this.props.children;
	}
}

// HOC para wrap automaticamente com Error Boundary
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary {...errorBoundaryProps}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
	return WrappedComponent;
}

// Error Boundary específico para páginas
export function PageErrorBoundary({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary
			resetOnPropsChange={true}
			onError={(error, errorInfo) => {
				// Log page-specific errors
				logger.error('Page error', 'PAGE_ERROR_BOUNDARY', error, { errorInfo });
			}}
		>
			{children}
		</ErrorBoundary>
	);
}

// Error Boundary específico para componentes
export function ComponentErrorBoundary({ 
	children, 
	componentName 
}: { 
	children: ReactNode;
	componentName: string;
}) {
	return (
		<ErrorBoundary
			onError={(error, errorInfo) => {
				logger.error(`Component error in ${componentName}`, 'COMPONENT_ERROR_BOUNDARY', error, { errorInfo });
			}}
			fallback={
				<div className="infinito-glass rounded-xl p-4 m-4 text-center">
					<p className="text-gray-600 mb-2">Erro no componente {componentName}</p>
					<button 
						onClick={() => window.location.reload()}
						className="text-sm infinito-button infinito-blue px-4 py-2"
					>
						Recarregar
					</button>
				</div>
			}
		>
			{children}
		</ErrorBoundary>
	);
}

// Error Boundary para APIs
export function APIErrorBoundary({ children }: { children: ReactNode }) {
	return (
		<ErrorBoundary
			onError={(error, errorInfo) => {
				logger.error('API-related error', 'API_ERROR_BOUNDARY', error, { errorInfo });
			}}
		>
			{children}
		</ErrorBoundary>
	);
}

export default ErrorBoundary; 