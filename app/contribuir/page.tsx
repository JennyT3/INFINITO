"use client";
import { ArrowLeft, Heart, Gift, Bell, Search, Brain, Palette, Repeat2, BrainCircuit, Network, MapPin, Shirt, Image as ArtIcon, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import { useState, useEffect } from "react";
import { useTranslation } from '../../hooks/useTranslation';

const BUTTON_SIZE = 140;

export default function ContribuirPage() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<number | null>(null);
	const { t } = useTranslation();
	const [mounted, setMounted] = useState(false);
	useEffect(() => { setMounted(true); }, []);

	const buttons = [
		{
			title: 'Clothing',
			icon: Shirt,
			gradient: "from-pink-500 to-rose-500",
			cta: true,
			link: "/contribuir/clothing"
		},
		{
			title: 'Art',
			icon: ArtIcon,
			gradient: "from-purple-500 to-pink-400",
			cta: false,
			link: "/contribuir/art"
		},
		{
			title: 'Recycle',
			icon: RefreshCw,
			gradient: "from-green-500 to-blue-500",
			cta: false,
			link: "/contribuir/recycle"
		},
		{
			title: 'Receive',
			icon: Gift,
			gradient: "from-blue-500 to-cyan-400",
			cta: false,
			link: "/contribuir/receive"
		}
	];

	const positions = [
		{ left: '50%', top: '45%', isPrimary: true },  // Ropa
		{ left: '25%', top: '25%', isPrimary: false }, // Arte
		{ left: '75%', top: '25%', isPrimary: false }, // Reciclar
		{ left: '50%', top: '75%', isPrimary: false }, // Recibir
	];

	return (
		<div className="min-h-screen font-raleway flex flex-col justify-between bg-[#EDE4DA] relative overflow-hidden" style={{backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover'}}>
			{/* Fondo fibras textiles animadas y símbolo infinito */}
			<svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 800" fill="none">
				<path d="M0 200 Q360 400 720 200 T1440 200" stroke="#b6c97a33" strokeWidth="2" fill="none" />
				<path d="M0 600 Q480 300 960 600 T1440 600" stroke="#43B2D233" strokeWidth="1.5" fill="none" />
				<ellipse cx="720" cy="400" rx="220" ry="80" stroke="#43B2D2" strokeWidth="4" opacity="0.08" />
			</svg>
			{/* Header glass minimalista igual a profile */}
			<div 
				className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10"
				style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
			>
				<div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
					<button 
						onClick={() => router.push('/')} 
						className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
					</button>
					<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">Contribute</h1>
					<div className="w-10 md:w-12"></div>
				</div>
			</div>
			{/* Hero statement y value prop tech */}
			{/* Eliminado: hero statement y subtítulo */}
			{/* Badges de acciones principales, coherentes y en inglés */}
			<div className="flex flex-1 flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 gap-6 z-10" style={{ minHeight: 'calc(100vh - 96px)' }}>
				<div className="grid grid-cols-2 md:grid-cols-2 gap-8 w-full max-w-lg mx-auto relative items-center justify-center">
					{/* Líneas hilo conectando botones */}
					<svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 200" fill="none">
						<path d="M60 60 Q200 10 340 60" stroke="#43B2D2" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.18" />
						<path d="M60 140 Q200 190 340 140" stroke="#b6c97a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.13" />
					</svg>
					{buttons.map((btn, idx) => (
						<button
							key={btn.title}
							onClick={() => router.push(btn.link)}
							onMouseEnter={() => setSelected(idx)}
							onMouseLeave={() => setSelected(null)}
							className={`group relative overflow-hidden flex flex-col items-center justify-center shadow-xl border-2 transition-all duration-300 rounded-2xl bg-[url('/fondo.png')] bg-cover bg-center ${btn.cta ? 'ring-4 ring-[#43B2D2] border-[#43B2D2] scale-105 animate-pulse-slow' : 'border-white/30'} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} animate-fade-in`}
							style={{ minWidth: btn.cta ? BUTTON_SIZE * 1.15 : BUTTON_SIZE, minHeight: btn.cta ? BUTTON_SIZE * 1.15 : BUTTON_SIZE, boxShadow: btn.cta ? '0 0 0 6px #43B2D222' : '0 2px 12px 0 rgba(0,0,0,0.08)', zIndex: 1, animationDelay: `${idx * 120}ms` }}
						>
							<div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 border-2 ${btn.cta ? 'border-[#43B2D2] bg-cyan-400/80' : 'border-white/40'} bg-gradient-to-br ${btn.gradient} shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-300`}>
								<btn.icon className="w-9 h-9 text-white drop-shadow" />
							</div>
							<span className="text-lg font-bold text-gray-800 tracking-wide font-raleway text-center drop-shadow group-hover:text-[#43B2D2] transition-colors duration-300">{btn.title}</span>
							{/* Ripple efecto hover */}
							<span className="absolute inset-0 pointer-events-none group-hover:bg-white/10 group-active:bg-white/20 transition-all duration-300 rounded-2xl" />
						</button>
					))}
				</div>
				{/* Elemento tech visual extra */}
				<div className="flex items-center gap-3 mt-8 justify-center">
					<MapPin className="w-6 h-6 text-[#689610] opacity-60 animate-pulse" />
					<span className="text-gray-500 text-sm">All actions are certified and traceable</span>
				</div>
			</div>
			{/* Círculos animados de fondo estilo INFINITO */}
			<div className="absolute top-10 left-10 w-4 h-4 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#689610" }}></div>
			<div className="absolute bottom-20 right-16 w-3 h-3 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
			<div className="absolute top-1/2 right-6 w-3 h-3 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
			<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#D42D66" }}></div>
			<BottomNavigationMenu />
			<style jsx>{`
				@keyframes animate-fade-in {
					0% { opacity: 0; transform: translateY(24px); }
					100% { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-in { animation: animate-fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
				@keyframes pulse-slow {
					0%, 100% { box-shadow: 0 0 0 6px #43B2D222; }
					50% { box-shadow: 0 0 0 16px #43B2D211; }
				}
				.animate-pulse-slow { animation: pulse-slow 2.5s infinite; }
			`}</style>
		</div>
	);
} 