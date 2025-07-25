"use client";
import { ReactNode } from 'react';
import { ArrowLeft, Search, Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNavigationMenu from './BottomNavigationMenu';
import Image from 'next/image';

interface InfinitoLayoutProps {
	children: ReactNode;
	title?: string;
	subtitle?: string;
	showHeader?: boolean;
	showBackButton?: boolean;
	showBottomMenu?: boolean;
	showLogo?: boolean;
	showEarthAnimation?: boolean;
	headerActions?: ReactNode;
	className?: string;
	userName?: string;
}

export default function InfinitoLayout({
	children,
	title,
	subtitle,
	showHeader = true,
	showBackButton = false,
	showBottomMenu = true,
	showLogo = false,
	showEarthAnimation = false,
	headerActions,
	className = "",
	userName = "User"
}: InfinitoLayoutProps) {
	const router = useRouter();

	return (
		<>
			{/* Estilos JSX específicos INFINITO */}
			<style jsx>{`
				@keyframes gradient-flow {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}
				
				@keyframes glow {
					0%, 100% { box-shadow: 0 0 20px rgba(104,150,16,0.3); }
					50% { box-shadow: 0 0 30px rgba(104,150,16,0.6); }
				}
				
				@keyframes glow-pulse {
					0%, 100% { box-shadow: 0 0 20px rgba(129,54,132,0.3); }
					50% { box-shadow: 0 0 30px rgba(212,45,102,0.5), 0 0 40px rgba(129,54,132,0.3); }
				}
			`}</style>

			{/* Container principal con fondo INFINITO */}
			<div 
				className={`min-h-screen pb-20 relative overflow-hidden font-raleway infinito-bg-effects ${className}`}
				style={{
					backgroundColor: "#EDE4DA",
					backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
					backgroundSize: "cover, 20px 20px, 25px 25px",
					backgroundRepeat: "no-repeat, repeat, repeat"
				}}
			>
				{/* Header futurista INFINITO */}
				{showHeader && (
					<div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}>
						<div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
							{showBackButton ? (
								<button 
									onClick={() => router.back()}
									className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
									style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
								>
									<ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
								</button>
							) : <div className="w-10 md:w-12"></div>}
							<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider text-center flex-1">{title}</h1>
							<div className="w-10 md:w-12"></div>
						</div>
					</div>
				)}

				{/* Contenido principal */}
				<div className="infinito-container">
					{/* Elimina el renderizado duplicado del título y subtítulo aquí */}
					{/* {title && (
						<div className="text-center mb-8">
							<h1 className="text-2xl md:text-4xl font-light text-gray-800 tracking-infinito-wide mb-2">
								{title}
							</h1>
							{subtitle && (
								<p className="text-base md:text-lg text-gray-600 font-light">
									{subtitle}
								</p>
							)}
						</div>
					)} */}

					{/* Logo central si se requiere */}
					{showLogo && !showHeader && (
						<div className="flex justify-center mb-8">
							<Image 
								src="/LOGO1.svg" 
								alt="INFINITO" 
								width={200}
								height={80}
								className="h-16 md:h-20 w-auto"
								style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
							/>
						</div>
					)}

					{/* Animación de la Tierra si se requiere */}
					{showEarthAnimation && (
						<div className="flex justify-center mb-12">
							<div 
								className="relative animate-float"
								style={{ 
									filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))"
								}}
							>
								<Image 
									src="/earth.png" 
									alt="Earth" 
									width={200}
									height={200}
									className="w-50 h-50 md:w-64 md:h-64 mx-auto animate-spin-slow" 
									style={{animationDuration:'12s'}} 
									loading="lazy"
								/>
								<div 
									className="absolute inset-0 rounded-full animate-glow"
									style={{ 
										background: "radial-gradient(circle at 30% 30%, rgba(104,150,16,0.2) 0%, transparent 50%)"
									}}
								/>
							</div>
						</div>
					)}

					{/* Contenido principal */}
					{children}
				</div>

				{/* Efectos de fondo con colores INFINITO */}
				<div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse infinito-green" />
				<div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse infinito-blue" style={{ animationDelay: '1s' }} />
				<div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse infinito-orange" style={{ animationDelay: '0.5s' }} />
				<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse infinito-pink" style={{ animationDelay: '0.7s' }} />
				<div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse infinito-yellow" style={{ animationDelay: '0.3s' }} />
				<div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full opacity-35 animate-pulse infinito-cyan" style={{ animationDelay: '0.8s' }} />
				<div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full opacity-20 animate-pulse infinito-purple" style={{ animationDelay: '0.4s' }} />
				
				{/* Símbolo infinito sutil */}
				<div className="absolute top-1/4 left-1/3 opacity-10 rotate-12 animate-pulse" style={{ animationDelay: '2s' }}>
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

				{/* Bottom Navigation Menu */}
				{showBottomMenu && <BottomNavigationMenu />}
			</div>
		</>
	);
} 