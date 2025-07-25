'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
	LayoutDashboard, 
	Package, 
	Users, 
	ShoppingCart, 
	FileText, 
	Settings,
	Heart,
	Shield,
	TrendingUp,
	LogOut
} from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (localStorage.getItem('isAdmin') !== 'true') {
				router.replace('/admin/login');
			}
		}
	}, [router]);

	// Navegación del admin con colores INFINITO
	const adminNavigation = [
		{
			name: 'Dashboard',
			href: '/admin/dashboard',
			icon: <LayoutDashboard className="w-5 h-5" />,
			color: '#689610'
		},
		{
			name: 'Contribuições',
			href: '/admin/contributions',
			icon: <Heart className="w-5 h-5" />,
			color: '#D42D66'
		},
		{
			name: 'Vendedores',
			href: '/admin/sellers',
			icon: <Users className="w-5 h-5" />,
			color: '#3E88FF'
		},
		{
			name: 'Produtos',
			href: '/admin/products',
			icon: <Package className="w-5 h-5" />,
			color: '#F47802'
		},
		{
			name: 'Certificados',
			href: '/admin/certificates',
			icon: <Shield className="w-5 h-5" />,
			color: '#43B2D2'
		},
		{
			name: 'Recolhas',
			href: '/admin/pickups',
			icon: <ShoppingCart className="w-5 h-5" />,
			color: '#813684'
		}
	];

	const handleLogout = () => {
		localStorage.removeItem('isAdmin');
		router.replace('/admin/login');
	};

	return (
		<>
			{/* Estilos JSX específicos para admin */}
			<style jsx>{`
				@keyframes admin-glow {
					0%, 100% { box-shadow: 0 0 20px rgba(104,150,16,0.2); }
					50% { box-shadow: 0 0 30px rgba(104,150,16,0.4); }
				}
				
				.admin-nav-item {
					transition: all 0.3s ease;
				}
				
				.admin-nav-item:hover {
					transform: translateX(8px);
					background: rgba(255, 255, 255, 0.1);
				}
			`}</style>

			<div 
				className="min-h-screen flex font-raleway"
				style={{
					backgroundColor: "#EDE4DA",
					backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
					backgroundSize: "cover, 20px 20px, 25px 25px",
					backgroundRepeat: "no-repeat, repeat, repeat"
				}}
			>
				{/* Sidebar Admin con glassmorphism */}
				<aside className="w-64 infinito-admin-sidebar shadow-2xl relative overflow-hidden">
					{/* Header del Admin */}
					<div className="p-6 border-b border-white/20">
						<div className="flex items-center justify-center mb-4">
							<Image 
								src="/LOGO1.svg" 
								alt="INFINITO Admin" 
								width={140}
								height={50}
								className="h-10 w-auto"
								style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
							/>
						</div>
						<div className="text-center">
							<h2 className="text-xl font-bold text-gray-800 tracking-wider mb-1">
								Admin Panel
							</h2>
							<p className="text-sm text-gray-600">
								Gestão INFINITO
							</p>
						</div>
					</div>

					{/* Navegación */}
					<nav className="flex-1 px-4 py-6 space-y-2">
						{adminNavigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className="admin-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-gray-900 font-medium group"
								style={{
									filter: `drop-shadow(0 2px 4px ${item.color}20)`
								}}
							>
								<div 
									className="w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300"
									style={{ backgroundColor: item.color }}
								>
									{item.icon}
								</div>
								<span className="tracking-wider">{item.name}</span>
							</Link>
						))}
					</nav>

					{/* Footer do Admin */}
					<div className="p-4 border-t border-white/20">
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 font-medium admin-nav-item"
							style={{ filter: "drop-shadow(0 2px 4px rgba(239,68,68,0.2))" }}
						>
							<div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-red-500">
								<LogOut className="w-5 h-5" />
							</div>
							<span>Sair</span>
						</button>
					</div>

					{/* Efectos de fondo en sidebar */}
					<div className="absolute top-20 right-4 w-2 h-2 rounded-full opacity-30 animate-pulse infinito-green" />
					<div className="absolute bottom-32 left-4 w-1.5 h-1.5 rounded-full opacity-40 animate-pulse infinito-blue" style={{ animationDelay: '0.5s' }} />
					<div className="absolute top-1/2 left-6 w-1 h-1 rounded-full opacity-25 animate-pulse infinito-pink" style={{ animationDelay: '1s' }} />
				</aside>

				{/* Contenido principal */}
				<main className="flex-1 overflow-auto">
					{/* Header del contenido */}
					<div className="infinito-header px-8 py-6 border-b border-white/20">
						<div className="flex items-center justify-between">
							<h1 className="text-2xl font-bold text-gray-800 tracking-wider">
								Panel de Administração
							</h1>
							<div className="flex items-center gap-4">
								<div className="infinito-glass rounded-full px-4 py-2">
									<span className="text-sm font-medium text-gray-700">
										Sistema INFINITO
									</span>
								</div>
								<div className="w-10 h-10 infinito-green rounded-full flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-white" />
								</div>
							</div>
						</div>
					</div>

					{/* Contenido de las páginas */}
					<div className="p-8 relative">
						{children}
						
						{/* Efectos de fondo en el contenido */}
						<div className="absolute top-16 right-8 w-3 h-3 rounded-full opacity-20 animate-pulse infinito-orange" />
						<div className="absolute bottom-20 left-12 w-2 h-2 rounded-full opacity-25 animate-pulse infinito-cyan" style={{ animationDelay: '0.7s' }} />
						<div className="absolute top-1/3 right-16 w-1.5 h-1.5 rounded-full opacity-15 animate-pulse infinito-purple" style={{ animationDelay: '1.2s' }} />
					</div>
				</main>
			</div>
		</>
	);
} 