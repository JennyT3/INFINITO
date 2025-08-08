"use client";
import { useLanguage } from '../../../components/theme-provider';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SellSectionWithAI from '@/components/calculadora-ambiental/SellSectionWithAI';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useEffect, useState } from 'react';

const translations = {
	en: { title: 'Sell Products' },
	pt: { title: 'Vender Produtos' },
	es: { title: 'Vender Productos' },
};

export default function SellProductsPage() {
	const { language } = useLanguage();
	const t = translations[language] || translations.en;
	const router = useRouter();

	// Nuevo: tracking de la contribución
	const [tracking, setTracking] = useState<string>("");

	useEffect(() => {
		// Intentar obtener tracking de localStorage (simulación de flujo real)
		const saved = localStorage.getItem('contributionTracking');
		if (saved) setTracking(saved);
	}, []);

	return (
		<div 
			className="min-h-screen font-raleway relative pb-24"
			style={{
				backgroundColor: "#EDE4DA",
				backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
				backgroundSize: "cover, 20px 20px, 25px 25px",
				backgroundRepeat: "no-repeat, repeat, repeat"
			}}
		>
			{/* Header glassmorphism sticky, igual que /profile */}
			<div 
				className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10"
				style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
			>
				<div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
					<button 
						onClick={() => router.push('/profile')} 
						className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
					</button>
					<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">{t.title}</h1>
					<div className="w-10 md:w-12"></div>
				</div>
			</div>

			{/* Tarjeta principal glassmorphism con animación y layout responsivo */}
			<div className="max-w-2xl mx-auto p-4 md:p-8">
				<div 
					className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl animate-float-card"
					style={{ filter: "drop-shadow(0 8px 16px rgba(67,178,210,0.12))" }}
				>
					{/* Si no hay tracking, mostrar input temporal */}
					{!tracking ? (
						<div className="mb-4">
							<label className="block mb-2 font-semibold">Contribution Code (tracking):</label>
							<input type="text" value={tracking} onChange={e => setTracking(e.target.value)} className="p-2 border rounded w-full" placeholder="INF_..." />
							<p className="text-xs text-gray-500 mt-1">Paste the code generated when you created your contribution.</p>
						</div>
					) : null}
					{tracking && (
						<SellSectionWithAI tracking={tracking} />
					)}
				</div>
			</div>

			<BottomNavigationMenu />
		</div>
	);
} 