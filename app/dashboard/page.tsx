"use client";
import { useRouter } from 'next/navigation';
import { useLanguage, useUser } from '../../components/theme-provider';
import { Heart, ShoppingBag, Tag, Fingerprint, Calculator } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import Image from 'next/image';

export default function DashboardPage() {
	const router = useRouter();
	const { language } = useLanguage();
	const { userName, email } = useUser();
	const { t } = useTranslation();

	const handleClick = (path: string) => {
		router.push(path);
	};

	const mainActions = [
		{
			id: 'contribute',
			icon: <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />, 
			label: t('contribute'),
			description: t('donateDesc'),
			path: '/contribuir',
			color: '#689610',
			hoverColor: '#7BA428'
		},
		{
			id: 'buy',
			icon: <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" />, 
			label: t('buy'),
			description: t('buyDesc'),
			path: '/marketplace',
			color: '#813684',
			hoverColor: '#9B4A97'
		},
		{
			id: 'sell',
			icon: <Tag className="w-6 h-6 md:w-8 md:h-8 text-white" />, 
			label: t('sell'),
			description: t('sellDesc'),
			path: '/profile/sell-products',
			color: '#F47802',
			hoverColor: '#FF8C15'
		},
		{
			id: 'passport',
			icon: <Fingerprint className="w-6 h-6 md:w-8 md:h-8 text-white" />, 
			label: t('footprint'),
			description: t('footprintDesc'),
			path: '/profile/impact-passport',
			color: '#43B2D2',
			hoverColor: '#56C4E5'
		}
	];

	// Banner de publicidad aleatorio
	const banners = [
		{
			text: "Stellar Network",
			subtitle: "Fast & Sustainable Payments",
			color: '#813684',
			bg: 'from-purple-200 to-pink-50'
		},
		{
			text: "USDC Payments",
			subtitle: "Stable & Secure",
			color: '#43B2D2',
			bg: 'from-blue-200 to-cyan-50'
		},
		{
			text: "MoneyGram",
			subtitle: "Global Transfers",
			color: '#F47802',
			bg: 'from-orange-200 to-red-50'
		},
		{
			text: "Environmental Impact",
			subtitle: "Track Your Contribution",
			color: '#689610',
			bg: 'from-green-200 to-emerald-50'
		}
	];
	const [bannerIdx, setBannerIdx] = useState(0);
	useEffect(() => {
		setBannerIdx(Math.floor(Math.random() * banners.length));
	}, []);

	// SVG para el banner de impacto
	const BannerImpactSVG = () => (
		<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="32" cy="32" r="32" fill="#EDE4DA"/>
			<ellipse cx="32" cy="44" rx="18" ry="6" fill="#B6C97A" fillOpacity="0.25"/>
			<path d="M32 44C38.6274 44 44 38.6274 44 32C44 25.3726 38.6274 20 32 20C25.3726 20 20 25.3726 20 32C20 38.6274 25.3726 44 32 44Z" fill="#B6C97A"/>
			<circle cx="32" cy="32" r="10" fill="#43B2D2" fillOpacity="0.18"/>
			<path d="M32 28C34.2091 28 36 29.7909 36 32C36 34.2091 34.2091 36 32 36C29.7909 36 28 34.2091 28 32C28 29.7909 29.7909 28 32 28Z" fill="#D42D66" fillOpacity="0.22"/>
			<path d="M24 40C26.5 36 37.5 36 40 40" stroke="#689610" strokeWidth="2" strokeLinecap="round"/>
			<circle cx="24" cy="28" r="2" fill="#EAB308"/>
			<circle cx="40" cy="28" r="2" fill="#3E88FF"/>
			<rect x="28" y="38" width="8" height="2" rx="1" fill="#B6C97A"/>
		</svg>
	);



	// Animaciones CSS para la Tierra y los botones futuristas
	const dashboardStyles = `
	@keyframes earth-rotation {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	.earth-rotation {
		animation: earth-rotation 18s linear infinite;
		will-change: transform;
	}
	.futuristic-btn {
		background: linear-gradient(90deg, #689610, #3E88FF, #D42D66, #EAB308, #F47802, #43B2D2, #813684);
		background-size: 400% 400%;
		animation: gradient-move 8s ease-in-out infinite;
		border: 2px solid #b6c97a;
		box-shadow: 0 0 24px 4px rgba(104,150,16,0.12), 0 0 48px 8px rgba(62,136,255,0.10);
		color: #fff;
		font-weight: bold;
		letter-spacing: 0.04em;
		text-shadow: 0 2px 8px rgba(0,0,0,0.12);
		transition: box-shadow 0.3s, transform 0.2s;
		position: relative;
		overflow: hidden;
	}
	.futuristic-btn:hover, .futuristic-btn:focus {
		box-shadow: 0 0 40px 10px #3E88FF99, 0 0 80px 20px #D42D6699;
		transform: scale(1.06);
		outline: none;
	}
	@keyframes gradient-move {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	.futuristic-btn .icon-glow {
		filter: drop-shadow(0 0 12px #43B2D2) drop-shadow(0 0 24px #81368433);
		transition: filter 0.3s;
	}
	.futuristic-btn:hover .icon-glow {
		filter: drop-shadow(0 0 32px #EAB308) drop-shadow(0 0 48px #D42D66);
	}
	`;

	return (
		<div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center pb-20 font-raleway overflow-y-auto flex flex-col pt-4">
			{/* Header superior */}
			<div className="flex justify-between items-center px-8 pt-8 pb-4">
				<div className="bg-white/70 border border-[#b6c97a] rounded-xl px-6 py-3 flex items-center gap-4 shadow-sm" style={{ minWidth: 220 }}>
					<span className="text-lg font-bold text-infinito-pink">{t('hello')} <span className="text-gray-700">{userName}</span></span>
					<span className="text-2xl">🖐️</span>
				</div>
				<button className="w-12 h-12 bg-white/70 border border-[#b6c97a] rounded-xl flex items-center justify-center shadow-sm">
					<svg className="lucide lucide-bell w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
				</button>
			</div>
			{/* Layout principal */}
			<div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-8 max-w-7xl mx-auto w-full px-2 md:px-8 pb-8">
				{/* Columna izquierda: Planeta */}
				<div className="flex-1 flex flex-col items-center justify-center md:justify-start pt-2 md:pt-12">
					<div className="relative earth-orbit" style={{ filter: 'drop-shadow(0 16px 48px rgba(104,150,16,0.18))' }}>
						<div className="relative w-72 h-72 md:w-[420px] md:h-[420px] mx-auto">
							<Image alt="Earth" width={420} height={420} className="absolute inset-0 w-full h-full earth-rotation rounded-full z-10" style={{ color: 'transparent' }} src="/earth.png" />
							{/* Highlight superior izquierdo */}
							<div className="absolute inset-0 rounded-full z-20 pointer-events-none" style={{
								background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 18%, transparent 60%)'
							}} />
							{/* Sombra inferior derecha */}
							<div className="absolute inset-0 rounded-full z-20 pointer-events-none" style={{
								background: 'radial-gradient(circle at 70% 75%, rgba(0,0,0,0.13) 0%, transparent 60%)'
							}} />
							{/* Glow ambiental */}
							<div style={{ background: 'radial-gradient(circle at 30% 30%, rgba(104,150,16,0.13) 0%, transparent 70%)' }} className="absolute inset-0 rounded-full animate-glow z-0"></div>
						</div>
					</div>
				</div>
				{/* Columna derecha: Contenido */}
				<div className="flex-1 flex flex-col items-center md:items-start justify-center md:justify-start pt-8 md:pt-20 gap-8 max-w-xl mx-auto w-full">
					<h1 className="text-2xl md:text-4xl font-light text-gray-700 tracking-infinito-wide mb-6 text-center md:text-left" style={{ fontFamily: 'Raleway, sans-serif' }}>{t('whatDo')}</h1>
					{/* Botones principales */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-2">
						{mainActions.map((action) => (
							<button
								key={action.id}
								onClick={() => handleClick(action.path)}
								className="group bg-white/90 border-2 border-[#b6c97a] rounded-2xl flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105 min-h-[90px] md:min-h-[110px]"
								style={{ minWidth: 90 }}
							>
								<div className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-2 border border-white/40 group-hover:scale-110 transition-transform duration-300 shadow-sm" style={{ backgroundColor: action.color, boxShadow: `0 2px 12px 0 ${action.color}22` }}>
									{action.icon}
								</div>
								<span className="text-base md:text-lg font-bold text-gray-800 tracking-wide font-raleway" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>{action.label}</span>
							</button>
						))}
					</div>
					{/* Banner */}
					<div className="w-full rounded-xl flex items-center gap-4 px-4 py-3 bg-[#f6e7d6] border border-[#e2d3c3] shadow-sm">
						<div className="flex-shrink-0">
							<BannerImpactSVG />
						</div>
						<div className="flex-1">
							<div className="text-base md:text-lg font-bold text-[#7a5c2e]">{banners[bannerIdx].text}</div>
							<div className="text-xs md:text-sm text-[#7a5c2e] opacity-80">{banners[bannerIdx].subtitle}</div>
						</div>
						<button className="ml-2 text-[#7a5c2e] opacity-60 hover:opacity-100 text-xl">✕</button>
					</div>
					{/* Calculadora Ambiental */}
					<div className="w-full rounded-xl bg-white/90 border border-[#b6c97a] shadow-md flex items-center px-4 py-4 gap-4">
						<div className="flex-shrink-0">
							<div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center infinito-green shadow animate-float">
								<Calculator className="w-7 h-7 md:w-10 md:h-10 text-white" />
							</div>
						</div>
						<div className="flex-1">
							<div className="font-bold text-gray-800 text-base md:text-lg mb-1">{t('calcTitle')}</div>
							<div className="text-xs md:text-sm text-gray-600">{t('calcDesc')}</div>
						</div>
						<button onClick={() => handleClick('/calculadora-ambiental')} className="futuristic-btn px-6 py-3 text-base md:text-lg rounded-xl font-bold shadow transition">{t('calcBtn')}</button>
					</div>
				</div>
			</div>
			<style jsx>{dashboardStyles}</style>
		</div>
	);
} 