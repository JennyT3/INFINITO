"use client";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Share2, Heart, ShoppingBag, User, Calculator, Tag, Home, Fingerprint } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '../hooks/useTranslation';

export default function BottomNavigationMenu() {
	const router = useRouter();
	const pathname = usePathname();
	const { t } = useTranslation();

	const handleClick = (path: string) => {
		router.push(path);
	};

	// Navegação principal com cores INFINITO
	const navItems = [
		{
			id: 'share',
			icon: <Share2 className="w-7 h-7" />,
			label: 'Share',
			path: '/share',
			color: '#43B2D2'
		},
		{
			id: 'sell',
			icon: <Tag className="w-7 h-7" />,
			label: 'Sell',
			path: '/profile/sell-products',
			color: '#F47802'
		},
		{
			id: 'home',
			icon: null, // Logo será usado
			label: 'Home',
			path: '/dashboard',
			color: '#689610',
			isLogo: true
		},
		{
			id: 'marketplace',
			icon: <ShoppingBag className="w-7 h-7" />,
			label: 'Marketplace',
			path: '/marketplace',
			color: '#813684'
		},
		{
			id: 'profile',
			icon: <User className="w-7 h-7" />,
			label: 'Profile',
			path: '/profile',
			color: '#D42D66'
		}
	];

	// Verificar se a rota atual está ativa
	const isActiveRoute = (path: string) => {
		if (path === '/dashboard') {
			return pathname === '/' || pathname === '/dashboard';
		}
		return pathname.startsWith(path);
	};

	return (
		<>
			<style jsx>{`
				@keyframes nav-glow {
					0%, 100% { box-shadow: 0 0 20px rgba(104,150,16,0.3); }
					50% { box-shadow: 0 0 30px rgba(104,150,16,0.5); }
				}
				
				@keyframes nav-pulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.05); }
				}
				
				.nav-item {
					transition: all 0.3s ease;
				}
				
				.nav-item:hover {
					transform: translateY(-2px);
				}
				
				.nav-item.active {
					animation: nav-pulse 2s ease-in-out infinite;
				}
			`}</style>

			<div className="fixed bottom-0 left-0 right-0 z-50">
				{/* Fundo com glassmorphism */}
				<div 
					className="infinito-glass-strong border-t border-white/30 px-6 py-4 shadow-2xl"
					style={{
						backdropFilter: 'blur(20px)',
						WebkitBackdropFilter: 'blur(20px)',
						background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
					}}
				>
					<div className="max-w-sm mx-auto flex justify-around items-center">
						{navItems.map((item) => {
							const isActive = isActiveRoute(item.path);
							
							return (
								<button 
									key={item.id}
									onClick={() => handleClick(item.path)}
									className={`nav-item flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 ${
										isActive ? 'active' : ''
									}`}
									style={{
										filter: isActive 
											? `drop-shadow(0 4px 12px ${item.color}40)`
											: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
									}}
								>
									{/* Ícone ou Logo */}
									<div 
										className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
											item.isLogo ? 'shadow-lg' : (isActive ? 'shadow-lg' : 'shadow-sm')
										}`}
										style={{
											backgroundColor: item.isLogo ? 'rgba(0,0,0,0)' : (isActive ? item.color : 'rgba(255,255,255,0.8)'),
											border: item.isLogo ? 'none' : (isActive ? 'none' : '1px solid rgba(255,255,255,0.5)')
										}}
									>
										{item.isLogo ? (
											<Image 
												src="/LOGO3.png" 
												alt="INFINITO Logo" 
												width={24}
												height={24}
												className="w-6 h-6 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
												style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))', background: 'none' }}
											/>
										) : (
											<div 
												className="transition-colors duration-300"
												style={{ color: isActive ? 'white' : item.color }}
											>
												{item.icon}
											</div>
										)}
									</div>

									{/* Label */}
									<span 
										className={`text-base font-semibold transition-colors duration-300 ${
											isActive ? 'text-gray-800' : 'text-gray-600'
										}`}
										style={{
											color: isActive ? item.color : undefined
										}}
									>
										{item.label}
									</span>

									{/* Indicador ativo */}
									{isActive && (
										<div 
											className="w-1 h-1 rounded-full mt-1 animate-pulse"
											style={{ backgroundColor: item.color }}
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Efeitos de fundo no menu */}
				<div className="absolute bottom-2 left-4 w-1 h-1 rounded-full opacity-30 animate-pulse infinito-green" />
				<div className="absolute bottom-2 right-4 w-1 h-1 rounded-full opacity-30 animate-pulse infinito-blue" style={{ animationDelay: '0.5s' }} />
				<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 rounded-full opacity-20 animate-pulse infinito-pink" style={{ animationDelay: '1s' }} />
			</div>
		</>
	);
} 