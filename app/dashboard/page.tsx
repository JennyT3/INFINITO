"use client";
import { useRouter } from 'next/navigation';
import { useLanguage, useUser } from '../../components/theme-provider';
import { Heart, ShoppingBag, Tag, Fingerprint, Calculator, TrendingUp, Leaf, Award } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import StellarWallet from '../../components/StellarWallet';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';

export default function DashboardPage() {
	const router = useRouter();
	const { language } = useLanguage();
	const { userName, email } = useUser();
	const { t } = useTranslation();
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleClick = (path: string) => {
		router.push(path);
	};

	const mainActions = [
		{
			id: 'contribute',
			icon: Heart,
			label: 'Contribute',
			description: 'Donate clothes for free',
			path: '/contribuir',
			color: '#689610',
			gradient: 'from-green-500 to-emerald-500'
		},
		{
			id: 'buy',
			icon: ShoppingBag,
			label: 'Marketplace',
			description: 'Buy sustainable products',
			path: '/marketplace',
			color: '#813684',
			gradient: 'from-purple-500 to-pink-500'
		},
		{
			id: 'sell',
			icon: Tag,
			label: 'Sell',
			description: 'Sell your items',
			path: '/profile/sell-products',
			color: '#F47802',
			gradient: 'from-orange-500 to-red-500'
		},
		{
			id: 'passport',
			icon: Fingerprint,
			label: 'Impact Passport',
			description: 'View your environmental impact',
			path: '/profile/impact-passport',
			color: '#43B2D2',
			gradient: 'from-blue-500 to-cyan-500'
		}
	];

	// Calculate clock hands positions
	const hours = currentTime.getHours() % 12;
	const minutes = currentTime.getMinutes();
	const seconds = currentTime.getSeconds();
	
	const hourAngle = (hours * 30) + (minutes * 0.5);
	const minuteAngle = minutes * 6;
	const secondAngle = seconds * 6;

	return (
		<>
			<style jsx>{`
				@keyframes gradient-flow {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				
				@keyframes float-card {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-5px); }
				}

				@keyframes clock-tick {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
			
			<StellarWallet />
			
			<div 
				className="min-h-screen font-raleway relative pb-24 pt-16"
				style={{
					backgroundColor: "#EDE4DA",
					backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
					backgroundSize: "cover, 20px 20px, 25px 25px",
					backgroundRepeat: "no-repeat, repeat, repeat"
				}}
			>
				{/* Header */}
				<div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-16 z-10">
					<div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
								<TrendingUp className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="font-bold text-lg text-gray-800">Dashboard</h1>
								<p className="text-sm text-gray-600">Welcome back, {userName || 'User'}!</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-4 py-6">
					{/* Clock Section */}
					<div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-6 mb-6 shadow-lg">
						<div className="text-center mb-4">
							<h2 className="text-xl font-bold text-gray-800 mb-2">Circular Time</h2>
							<p className="text-sm text-gray-600">Your sustainable journey</p>
						</div>
						
						<div className="flex justify-center mb-4">
							<div className="relative w-32 h-32">
								{/* Clock face */}
								<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
									<div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
										{/* Clock hands */}
										<div className="relative w-24 h-24">
											{/* Hour hand */}
											<div 
												className="absolute top-1/2 left-1/2 w-1 h-8 bg-gray-800 origin-bottom"
												style={{ 
													transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)`,
													transition: 'transform 0.5s ease-out'
												}}
											/>
											{/* Minute hand */}
											<div 
												className="absolute top-1/2 left-1/2 w-0.5 h-10 bg-gray-600 origin-bottom"
												style={{ 
													transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)`,
													transition: 'transform 0.5s ease-out'
												}}
											/>
											{/* Second hand */}
											<div 
												className="absolute top-1/2 left-1/2 w-0.5 h-12 bg-red-500 origin-bottom"
												style={{ 
													transform: `translateX(-50%) translateY(-100%) rotate(${secondAngle}deg)`,
													transition: 'transform 0.1s linear'
												}}
											/>
											{/* Center dot */}
											<div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 rounded-full transform -translate-x-1 -translate-y-1" />
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<div className="text-center">
							<div className="text-2xl font-bold text-gray-800">
								{currentTime.toLocaleTimeString()}
							</div>
							<div className="text-sm text-gray-600">
								{currentTime.toLocaleDateString()}
							</div>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
									<Leaf className="w-5 h-5 text-white" />
								</div>
								<div>
									<div className="text-sm text-gray-600">CO₂ Saved</div>
									<div className="text-lg font-bold text-gray-800">24.5 kg</div>
								</div>
							</div>
						</div>
						
						<div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
									<Award className="w-5 h-5 text-white" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Contributions</div>
									<div className="text-lg font-bold text-gray-800">12</div>
								</div>
							</div>
						</div>
					</div>

					{/* Main Actions Grid */}
					<div className="grid grid-cols-2 gap-4">
						{mainActions.map((action) => (
							<div
								key={action.id}
								onClick={() => handleClick(action.path)}
								className="group bg-white/25 backdrop-blur-md border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
								style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.1))' }}
							>
								<div className="flex flex-col items-center text-center">
									<div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
										<action.icon className="w-6 h-6 text-white" />
									</div>
									<h3 className="font-bold text-gray-800 mb-1">{action.label}</h3>
									<p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<BottomNavigationMenu />
			</div>
		</>
	);
} 