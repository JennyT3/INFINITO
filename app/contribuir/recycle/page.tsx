"use client";
import { ArrowLeft, Heart, Gift, Bell, Search, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useState } from "react";
import { Repeat2 } from "lucide-react";

const BUTTON_SIZE = 110;

const buttons = [
	{
		title: "Registar",
		icon: Heart,
		iconColor: "text-pink-500",
		hover: "hover:ring-pink-400 focus:ring-pink-400",
		link: "/contribuir/recycle/register"
	},
	{
		title: "Educação",
		icon: Brain,
		iconColor: "text-purple-500",
		hover: "hover:ring-purple-400 focus:ring-purple-400",
		link: "/educacion"
	},
	{
		title: "Vender",
		icon: Repeat2,
		iconColor: "text-green-600",
		hover: "hover:ring-green-400 focus:ring-green-400",
		link: "/profile/sell-products"
	},
	{
		title: "Marketplace",
		icon: Gift,
		iconColor: "text-blue-500",
		hover: "hover:ring-blue-400 focus:ring-blue-400",
		link: "/marketplace"
	}
];

export default function RecycleFlowPage() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<number | null>(null);
	return (
		<div className="min-h-screen font-raleway flex flex-col justify-between bg-[#EDE4DA] relative" style={{backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover'}}>
			{/* Top bar: back and notifications */}
			<div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 pt-4">
				<button onClick={() => router.push('/contribuir')} className="w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center shadow border border-gray-200">
					<ArrowLeft className="w-5 h-5 text-gray-600" />
				</button>
				<button className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow border border-gray-900">
					<Bell className="w-5 h-5 text-white" />
				</button>
			</div>
			{/* Main content */}
			<div className="flex flex-1 flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 gap-12 pt-4 pb-32">
				{/* Título y barra de búsqueda siempre centralizados */}
				<div className="w-full flex flex-col items-center justify-center mb-8">
					<h1 className="font-extrabold text-3xl text-gray-800 mb-2 text-center">Recicla e transforma!</h1>
					<p className="text-gray-600 text-base mb-8 text-center">Dá uma nova vida aos teus resíduos e faz parte da economia circular.</p>
					<div className="flex items-center w-full max-w-md mb-2 justify-center">
						<input
							type="text"
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Pesquisar..."
							className="flex-1 rounded-l-xl border-2 border-turquoise-400 border-r-0 bg-white/80 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-turquoise-400 text-base text-center"
							style={{borderColor: '#43B2D2'}}
						/>
						<button className="rounded-r-xl border-2 border-l-0 border-turquoise-400 bg-white/80 px-4 py-3 flex items-center justify-center" style={{borderColor: '#43B2D2'}}>
							<Search className="w-5 h-5 text-turquoise-400" style={{color: '#43B2D2'}} />
						</button>
					</div>
				</div>
				{/* Grid + imagen: dos columnas en web, todo centrado en móvil */}
				<div className="w-full flex flex-col md:flex-row items-center justify-center gap-0 md:gap-16">
					{/* Grid de botones */}
					<div className="flex flex-col items-center justify-center h-full">
						<div className="grid grid-cols-2 gap-6 w-full max-w-xs md:max-w-none md:w-auto md:h-[244px] content-center items-center justify-center">
							{buttons.map((btn, idx) => (
								<div
									key={btn.title}
									className={`rounded-2xl bg-white/30 shadow-lg flex flex-col items-center justify-center cursor-pointer border border-white/40 hover:shadow-2xl transition-all duration-200 backdrop-blur-xl ${btn.hover} ${selected === idx ? 'ring-4 ' + btn.hover.split(' ')[0].replace('hover:', '') : ''}`}
									onClick={() => router.push(btn.link)}
									onMouseEnter={() => setSelected(idx)}
									onMouseLeave={() => setSelected(null)}
									style={{backdropFilter: 'blur(16px)', width: BUTTON_SIZE, height: BUTTON_SIZE, margin: 0}}
								>
									<btn.icon className={`w-10 h-10 mb-2 ${btn.iconColor}`} />
									<div className="font-bold text-base text-gray-800 tracking-wide text-center">{btn.title}</div>
								</div>
							))}
						</div>
					</div>
					{/* Imagen NFT 4.png del tamaño de 4 botones (2x2) */}
					<div className="mt-8 md:mt-0 md:ml-0 md:flex-1 flex flex-col items-center justify-center h-full">
						<Image src="/NFT/4.png" alt="NFT 4" width={BUTTON_SIZE * 2 + 24} height={BUTTON_SIZE * 2 + 24} priority />
					</div>
				</div>
			</div>
			{/* Menú inferior */}
			<div className="fixed bottom-0 left-0 w-full z-20">
				<BottomNavigationMenu />
			</div>
		</div>
	);
} 