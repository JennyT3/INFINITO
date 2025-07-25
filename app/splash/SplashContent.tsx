'use client';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUser, useLanguage } from '../../components/theme-provider';
import { useEffect, useState } from 'react';
import GoogleSignIn from '../../components/GoogleSignIn';
import { Globe, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function SplashContent() {
	const { data: session } = useSession();
	const { setEmail, setUserName, email } = useUser();
	const router = useRouter();
	const { language, setLanguage } = useLanguage();
	const [inputEmail, setInputEmail] = useState('');
	const [currentFeature, setCurrentFeature] = useState(0);

	useEffect(() => {
		if (session?.user?.email) {
			setEmail(session.user.email);
			if (session.user.name) {
				setUserName(session.user.name);
				localStorage.setItem('userName', session.user.name);
			}
		}
	}, [session, setEmail, setUserName]);

	// Rotar características destacadas
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentFeature((prev) => (prev + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputEmail) {
			setEmail(inputEmail);
			router.replace('/dashboard');
		}
	};

	const handleGoogleSignIn = () => {
		signIn('google', { callbackUrl: '/dashboard' });
	};

	const handleContinue = () => {
		console.log('Botón Comenzar Jornada clicado');
		try {
			router.replace('/dashboard');
			setTimeout(() => {
				if (window.location.pathname !== '/dashboard') {
					window.location.href = '/dashboard';
				}
			}, 500);
		} catch (e) {
			window.location.href = '/dashboard';
		}
	};

	const translations = {
		pt: {
			welcome: "Bem-vindo ao",
			subtitle: "Economia circular têxtil",
			description: "Transformamos resíduos têxteis em valor económico e ambiental",
			startJourney: "Começar Jornada",
			continueAsGuest: "Continuar como Convidado",
			features: {
				ai: "Inteligência Artificial",
				blockchain: "Tecnologia Blockchain",
				impact: "Impacto Mensurável"
			},
			featureDescriptions: {
				ai: "Análise automática de materiais e cálculo de impacto ambiental",
				blockchain: "Certificação digital imutável e rastreabilidade completa",
				impact: "Métricas transparentes de CO₂, água e recursos poupados"
			},
			emailPlaceholder: "Digite seu email para começar",
			or: "ou"
		},
		en: {
			welcome: "Welcome to",
			subtitle: "Circular textile economy",
			description: "We transform textile waste into economic and environmental value through",
			startJourney: "Start Journey",
			continueAsGuest: "Continue as Guest",
			features: {
				ai: "Artificial Intelligence",
				blockchain: "Blockchain Technology",
				impact: "Measurable Impact"
			},
			featureDescriptions: {
				ai: "Automatic material analysis and environmental impact calculation",
				blockchain: "Immutable digital certification and complete traceability",
				impact: "Transparent metrics of CO₂, water and resources saved"
			},
			emailPlaceholder: "Enter your email to get started",
			or: "or"
		},
		es: {
			welcome: "Bienvenido a",
			subtitle: "Economía circular textil",
			description: "Transformamos residuos textiles en valor económico y ambiental",
			startJourney: "Comenzar Jornada",
			continueAsGuest: "Continuar como Invitado",
			features: {
				ai: "Inteligencia Artificial",
				blockchain: "Tecnología Blockchain",
				impact: "Impacto Medible"
			},
			featureDescriptions: {
				ai: "Análisis automático de materiales y cálculo de impacto ambiental",
				blockchain: "Certificación digital inmutable y trazabilidad completa",
				impact: "Métricas transparentes de CO₂, agua y recursos ahorrados"
			},
			emailPlaceholder: "Ingresa tu email para comenzar",
			or: "o"
		}
	};

	const t = translations[language];

	const features = [
		{
			icon: <Sparkles className="w-5 h-5 text-white" />,
			title: t.features.ai,
			description: t.featureDescriptions.ai,
			color: '#689610'
		},
		{
			icon: <Shield className="w-5 h-5 text-white" />,
			title: t.features.blockchain,
			description: t.featureDescriptions.blockchain,
			color: '#3E88FF'
		},
		{
			icon: <Zap className="w-5 h-5 text-white" />,
			title: t.features.impact,
			description: t.featureDescriptions.impact,
			color: '#D42D66'
		}
	];

	return (
		<>
			<style jsx>{`
				@keyframes gradient-shift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				
				@keyframes glow-pulse {
					0%, 100% { box-shadow: 0 0 20px rgba(129,54,132,0.3); }
					50% { box-shadow: 0 0 30px rgba(212,45,102,0.5), 0 0 40px rgba(129,54,132,0.3); }
				}
				
				@keyframes float-gentle {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-5px); }
				}
				
				.feature-carousel {
					animation: float-gentle 4s ease-in-out infinite;
				}
				
				.futuristic-btn {
					background: rgba(212,45,102,0.92);
					color: #fff;
					border: 1.5px solid #D42D66;
					box-shadow: 0 2px 12px 0 rgba(212,45,102,0.10);
					backdrop-filter: blur(8px);
					font-weight: 600;
					letter-spacing: 0.04em;
					text-shadow: none;
					transition: box-shadow 0.3s, transform 0.2s;
				}
				.futuristic-btn:hover, .futuristic-btn:focus {
					box-shadow: 0 4px 24px 0 #D42D6633;
					transform: scale(1.03);
					outline: none;
				}
			`}</style>
			
			<div 
				className="min-h-screen flex flex-col relative overflow-y-auto font-raleway"
				style={{
					backgroundColor: "#EDE4DA",
					backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
					backgroundSize: "cover, 20px 20px, 25px 25px",
					backgroundRepeat: "no-repeat, repeat, repeat"
				}}
			>
				{/* Seletor de idioma */}
				<div className="absolute top-6 right-6 z-10">
					<div className="infinito-glass rounded-full p-2">
						<div className="flex items-center gap-1">
							<Globe className="w-4 h-4 text-gray-600 ml-2" />
							{['pt', 'en', 'es'].map((lang) => (
								<button
									key={lang}
									onClick={() => setLanguage(lang as 'pt' | 'en' | 'es')}
									className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
										language === lang
											? 'infinito-green text-white shadow-sm'
											: 'text-gray-600 hover:bg-white/20'
									}`}
								>
									{lang.toUpperCase()}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Conteúdo principal */}
				<div className="flex-1 flex flex-col items-center justify-start p-8">
					<div className="max-w-md w-full mx-auto text-center space-y-8">
						{/* Título de boas-vindas */}
						<h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-4 tracking-infinito-wide">
							{t.welcome}
						</h1>

						{/* Logo oficial */}
						<div 
							className="flex justify-center mb-8"
							style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
						>
							<Image 
								src="/LOGO1.svg" 
								alt="INFINITO Logo" 
								width={280}
								height={110}
								className="w-64 md:w-72 h-auto mx-auto animate-float" 
								loading="lazy"
							/>
						</div>

						{/* Descrição com glassmorphism */}
						<div className="infinito-glass-strong rounded-2xl p-6 space-y-4">
							<p className="text-xl font-bold text-gray-900">
								{t.subtitle}
							</p>
							<p className="text-base font-light text-gray-800 leading-relaxed">
								{t.description}
							</p>
						</div>

						{/* Botón futurista arriba de las características */}
						<div className="space-y-4">
							<button
								onClick={handleContinue}
								className="w-full futuristic-btn rounded-2xl flex items-center justify-center gap-2 text-lg py-4 shadow-xl"
							>
								{t.startJourney}
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>

						{/* Características em rotação */}
						<div className="infinito-glass rounded-2xl p-6 feature-carousel mt-4">
							<div className="flex items-center gap-4 mb-3">
								<div 
									className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
									style={{ backgroundColor: features[currentFeature].color }}
								>
									{features[currentFeature].icon}
								</div>
								<div className="flex-1 text-left">
									<h3 className="font-bold text-gray-800 mb-1">
										{features[currentFeature].title}
									</h3>
									<p className="text-sm text-gray-600 leading-relaxed">
										{features[currentFeature].description}
									</p>
								</div>
							</div>
							{/* Indicadores */}
							<div className="flex justify-center gap-2">
								{features.map((_, index) => (
									<div
										key={index}
										className={`w-2 h-2 rounded-full transition-all duration-300 ${
											index === currentFeature ? 'w-8 opacity-100' : 'opacity-40'
										}`}
									style={{ backgroundColor: features[index].color }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Símbolo infinito sutil */}
			<div className="absolute top-1/4 right-1/4 opacity-10 rotate-12 animate-pulse" style={{ animationDelay: '2s' }}>
				<svg width="40" height="20" viewBox="0 0 40 20" fill="none">
					<path d="M10 10C10 4.48 14.48 0 20 0C25.52 0 30 4.48 30 10C30 15.52 25.52 20 20 20C14.48 20 10 15.52 10 10ZM10 10C10 15.52 5.52 20 0 20C-5.52 20 -10 15.52 -10 10C-10 4.48 -5.52 0 0 0C5.52 0 10 4.48 10 10Z" fill="url(#infinito-gradient)"/>
					<defs>
						<linearGradient id="infinito-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#689610"/>
							<stop offset="16.66%" stopColor="#3E88FF"/>
							<stop offset="33.33%" stopColor="#D42D66"/>
							<stop offset="50%" stopColor="#EAB308"/>
							<stop offset="66.66%" stopColor="#F47802"/>
							<stop offset="83.33%" stopColor="#43B2D2"/>
							<stop offset="100%" stopColor="#813684"/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</>
	);
} 