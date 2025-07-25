"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Shield, Wifi, Lock } from 'lucide-react';
import Image from 'next/image';

interface ErrorDetails {
	title: string;
	message: string;
	icon: React.ReactNode;
	color: string;
	actions: Array<{
		label: string;
		action: () => void;
		variant: 'primary' | 'secondary';
	}>;
}

export default function AuthErrorPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) {
			const error = searchParams.get('error');
			const errorType = searchParams.get('error_type') || error || 'default';
			setErrorDetails(getErrorDetails(errorType));
		}
	}, [hydrated, searchParams]);

	const getErrorDetails = (errorType: string): ErrorDetails => {
		switch (errorType) {
			case 'Configuration':
				return {
					title: 'Erro de Configuração',
					message: 'Há um problema com a configuração do sistema de autenticação. Por favor, tente novamente mais tarde.',
					icon: <AlertTriangle className="w-10 h-10 text-yellow-600" />,
					color: '#D97706',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Contactar Suporte',
							action: () => window.open('mailto:support@infinito.me', '_blank'),
							variant: 'secondary'
						}
					]
				};

			case 'AccessDenied':
				return {
					title: 'Acesso Negado',
					message: 'Você não tem permissão para acessar esta aplicação ou cancelou o processo de autenticação.',
					icon: <Lock className="w-10 h-10 text-red-600" />,
					color: '#DC2626',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Voltar ao Início',
							action: () => router.push('/'),
							variant: 'secondary'
						}
					]
				};

			case 'Verification':
				return {
					title: 'Erro de Verificação',
					message: 'Não foi possível verificar sua identidade. O link pode ter expirado ou ser inválido.',
					icon: <Shield className="w-10 h-10 text-blue-600" />,
					color: '#2563EB',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Solicitar Novo Link',
							action: () => router.push('/auth/resend'),
							variant: 'secondary'
						}
					]
				};

			case 'Signin':
				return {
					title: 'Erro de Login',
					message: 'Ocorreu um erro durante o processo de login. Por favor, tente novamente.',
					icon: <RefreshCw className="w-10 h-10 text-purple-600" />,
					color: '#7C3AED',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Usar Outro Método',
							action: () => router.push('/splash?method=email'),
							variant: 'secondary'
						}
					]
				};

			case 'OAuthSignin':
			case 'OAuthCallback':
				return {
					title: 'Erro de Autenticação Google',
					message: 'Ocorreu um erro ao autenticar com o Google. Verifique suas configurações de conta.',
					icon: <Wifi className="w-10 h-10 text-green-600" />,
					color: '#16A34A',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Verificar Conta Google',
							action: () => window.open('https://accounts.google.com', '_blank'),
							variant: 'secondary'
						}
					]
				};

			case 'SessionRequired':
				return {
					title: 'Sessão Obrigatória',
					message: 'Você precisa estar autenticado para acessar esta página.',
					icon: <Lock className="w-10 h-10 text-indigo-600" />,
					color: '#4F46E5',
					actions: [
						{
							label: 'Fazer Login',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Voltar',
							action: () => router.back(),
							variant: 'secondary'
						}
					]
				};

			default:
				return {
					title: 'Erro de Autenticação',
					message: 'Ocorreu um erro inesperado durante a autenticação. Por favor, tente novamente.',
					icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
					color: '#DC2626',
					actions: [
						{
							label: 'Tentar Novamente',
							action: () => router.push('/splash'),
							variant: 'primary'
						},
						{
							label: 'Voltar ao Início',
							action: () => router.push('/'),
							variant: 'secondary'
						}
					]
				};
		}
	};

	if (!hydrated || !errorDetails) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div 
			className="min-h-screen font-raleway flex items-center justify-center p-4 relative overflow-hidden"
			style={{
				backgroundColor: "#EDE4DA",
				backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
				backgroundSize: "cover, 20px 20px, 25px 25px",
				backgroundRepeat: "no-repeat, repeat, repeat"
			}}
		>
			{/* Header com logo */}
			<div className="absolute top-8 left-1/2 transform -translate-x-1/2">
				<Image 
					src="/LOGO1.svg" 
					alt="INFINITO" 
					width={120}
					height={40}
					className="h-8 w-auto opacity-80"
					style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
				/>
			</div>

			{/* Error Card */}
			<div className="w-full max-w-md">
				<div 
					className="bg-white/25 backdrop-blur-md rounded-3xl p-8 border border-white/30 text-center relative overflow-hidden"
					style={{ 
						filter: `drop-shadow(0 8px 20px ${errorDetails.color}20)` 
					}}
				>
					{/* Background gradient */}
					<div 
						className="absolute inset-0 opacity-5"
						style={{
							background: `linear-gradient(135deg, ${errorDetails.color} 0%, transparent 70%)`
						}}
					/>

					{/* Error Icon */}
					<div 
						className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse relative z-10"
						style={{ backgroundColor: `${errorDetails.color}15` }}
					>
						{errorDetails.icon}
					</div>

					{/* Error Title */}
					<h1 className="text-2xl font-bold text-gray-800 mb-4 tracking-wider relative z-10">
						{errorDetails.title}
					</h1>

					{/* Error Message */}
					<p className="text-gray-600 mb-8 leading-relaxed relative z-10">
						{errorDetails.message}
					</p>

					{/* Actions */}
					<div className="space-y-3 relative z-10">
						{errorDetails.actions.map((action, index) => (
							<button
								key={index}
								onClick={action.action}
								className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
									action.variant === 'primary'
										? 'text-white font-bold shadow-lg'
										: 'bg-white/20 backdrop-blur-sm text-gray-700 hover:bg-white/30 border border-white/40'
								}`}
								style={
									action.variant === 'primary' 
										? { 
											backgroundColor: errorDetails.color,
											filter: `drop-shadow(0 4px 8px ${errorDetails.color}30)`
										}
										: {}
								}
							>
								{action.variant === 'primary' ? (
									<RefreshCw className="w-4 h-4" />
								) : (
									<ArrowLeft className="w-4 h-4" />
								)}
								{action.label}
							</button>
						))}
					</div>

					{/* Footer */}
					<div className="mt-8 pt-6 border-t border-white/20 relative z-10">
						<p className="text-xs text-gray-500">
							Sistema INFINITO • Economia Circular
						</p>
					</div>
				</div>

				{/* Help Link */}
				<div className="text-center mt-6">
					<button
						onClick={() => window.open('mailto:support@infinito.me?subject=Erro de Autenticação', '_blank')}
						className="text-sm text-gray-600 hover:text-gray-800 transition-colors underline"
					>
						Precisa de ajuda? Contacte o suporte
					</button>
				</div>
			</div>

			{/* Animated Background Elements */}
			<div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: errorDetails.color }}></div>
			<div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: errorDetails.color }}></div>
			<div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: errorDetails.color }}></div>
		</div>
	);
} 