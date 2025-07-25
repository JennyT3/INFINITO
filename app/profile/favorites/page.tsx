"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, ShoppingBag, Tag, Package, Star, Trash2, Filter, Grid, List, Search, SortAsc, Eye, Share2, Plus } from 'lucide-react';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useLanguage } from '../../../components/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FavoriteItem {
	id: string;
	name: string;
	type: 'product' | 'contribution';
	image: string;
	description: string;
	price?: number;
	rating?: number;
	location?: string;
	addedDate: string;
	category?: string;
	seller?: string;
	discount?: number;
	isAvailable?: boolean;
}

// Dados mockados para demonstração
const mockFavorites: FavoriteItem[] = [
	{
		id: '1',
		name: 'Camiseta Sustentável Eco',
		type: 'product',
		image: '/images/Item1.jpeg',
		description: 'Camiseta 100% algodão orgânico, produzida de forma sustentável',
		price: 29.99,
		rating: 4.8,
		location: 'Porto',
		addedDate: '2024-01-15',
		category: 'Clothing',
		seller: 'EcoStore',
		discount: 10,
		isAvailable: true
	},
	{
		id: '2',
		name: 'Tênis Reciclado Urban',
		type: 'product',
		image: '/images/Item2.jpeg',
		description: 'Tênis feito com materiais reciclados, design moderno e confortável',
		price: 79.99,
		rating: 4.5,
		location: 'Lisboa',
		addedDate: '2024-01-10',
		category: 'Shoes',
		seller: 'GreenShoes',
		isAvailable: true
	},
	{
		id: '3',
		name: 'Bolsa Ecológica Premium',
		type: 'contribution',
		image: '/images/Item3.jpeg',
		description: 'Bolsa artesanal feita com materiais sustentáveis locais',
		price: 45.50,
		rating: 4.9,
		location: 'Coimbra',
		addedDate: '2024-01-05',
		category: 'Accessories',
		seller: 'LocalCrafts',
		discount: 15,
		isAvailable: false
	},
	{
		id: '4',
		name: 'Jaqueta Upcycled Vintage',
		type: 'product',
		image: '/images/Item4.jpeg',
		description: 'Jaqueta vintage renovada com técnicas de upcycling',
		price: 89.99,
		rating: 4.7,
		location: 'Braga',
		addedDate: '2024-01-01',
		category: 'Clothing',
		seller: 'VintageReborn',
		isAvailable: true
	}
];

export default function FavoritesPage() {
	const router = useRouter();
	const { language } = useLanguage();
	const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
	const [filteredFavorites, setFilteredFavorites] = useState<FavoriteItem[]>(mockFavorites);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState<'all' | 'product' | 'contribution'>('all');
	const [sortBy, setSortBy] = useState<'date' | 'price' | 'rating' | 'name'>('date');
	const [loading, setLoading] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) {
			applyFilters();
		}
	}, [hydrated, favorites, searchTerm, filterType, sortBy]);

	const applyFilters = () => {
		let filtered = [...favorites];

		// Filtrar por termo de busca
		if (searchTerm) {
			filtered = filtered.filter(item => 
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.seller?.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filtrar por tipo
		if (filterType !== 'all') {
			filtered = filtered.filter(item => item.type === filterType);
		}

		// Ordenar
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'date':
					return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
				case 'price':
					return (b.price || 0) - (a.price || 0);
				case 'rating':
					return (b.rating || 0) - (a.rating || 0);
				case 'name':
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});

		setFilteredFavorites(filtered);
	};

	const removeFavorite = (id: string) => {
		const updatedFavorites = favorites.filter(item => item.id !== id);
		setFavorites(updatedFavorites);
		if (typeof window !== 'undefined') {
			localStorage.setItem('userFavorites', JSON.stringify(updatedFavorites));
		}
	};

	const getItemIcon = (type: string) => {
		switch (type) {
			case 'product':
				return <ShoppingBag className="w-5 h-5 text-white" />;
			case 'contribution':
				return <Heart className="w-5 h-5 text-white" />;
			default:
				return <Package className="w-5 h-5 text-white" />;
		}
	};

	const getItemColor = (type: string) => {
		switch (type) {
			case 'product':
				return '#813684';
			case 'contribution':
				return '#D42D66';
			default:
				return '#3E88FF';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR');
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'EUR'
		}).format(price);
	};

	const getStats = () => {
		const products = favorites.filter(f => f.type === 'product').length;
		const contributions = favorites.filter(f => f.type === 'contribution').length;
		const available = favorites.filter(f => f.isAvailable).length;
		const totalValue = favorites.reduce((sum, item) => sum + (item.price || 0), 0);
		return { products, contributions, available, totalValue, total: favorites.length };
	};

	const stats = getStats();

	if (!hydrated) return null;

	return (
		<div 
			className="min-h-screen font-raleway pb-20 relative overflow-hidden"
			style={{
				backgroundColor: "#EDE4DA",
				backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
				backgroundSize: "cover, 20px 20px, 25px 25px",
				backgroundRepeat: "no-repeat, repeat, repeat"
			}}
		>
			{/* Header */}
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
					<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">
						Favoritos
					</h1>
					<div className="w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
						<Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-6 py-6">
				
				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-gray-800">{stats.total}</div>
							<div className="text-sm text-gray-600">Total</div>
						</CardContent>
					</Card>
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-purple-600">{stats.products}</div>
							<div className="text-sm text-gray-600">Produtos</div>
						</CardContent>
					</Card>
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-pink-600">{stats.contributions}</div>
							<div className="text-sm text-gray-600">Contribuições</div>
						</CardContent>
					</Card>
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4 text-center">
							<div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</div>
							<div className="text-sm text-gray-600">Valor Total</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters and Search */}
				<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg mb-6">
					<CardContent className="p-4">
						<div className="flex flex-col md:flex-row gap-4">
							{/* Search */}
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
									<Input
										type="text"
										placeholder="Buscar favoritos..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Filter Type */}
							<Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
								<SelectTrigger className="w-full md:w-40">
									<SelectValue placeholder="Tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos</SelectItem>
									<SelectItem value="product">Produtos</SelectItem>
									<SelectItem value="contribution">Contribuições</SelectItem>
								</SelectContent>
							</Select>

							{/* Sort */}
							<Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
								<SelectTrigger className="w-full md:w-40">
									<SelectValue placeholder="Ordenar" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date">Data</SelectItem>
									<SelectItem value="price">Preço</SelectItem>
									<SelectItem value="rating">Avaliação</SelectItem>
									<SelectItem value="name">Nome</SelectItem>
								</SelectContent>
							</Select>

							{/* View Mode */}
							<div className="flex gap-2">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('grid')}
								>
									<Grid className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === 'list' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setViewMode('list')}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{loading ? (
					<div className="text-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Carregando favoritos...</p>
					</div>
				) : filteredFavorites.length === 0 ? (
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-12 text-center">
							<div 
								className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6"
								style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
							>
								<Heart className="w-10 h-10 text-pink-600" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">
								{searchTerm || filterType !== 'all' ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
							</h2>
							<p className="text-gray-600 mb-8 leading-relaxed">
								{searchTerm || filterType !== 'all' 
									? 'Tente ajustar os filtros ou buscar por outros termos.'
									: 'Explore o marketplace e adicione produtos aos seus favoritos para vê-los aqui.'
								}
							</p>
							<div className="flex justify-center gap-4">
								{(searchTerm || filterType !== 'all') && (
									<Button
										variant="outline"
										onClick={() => {
											setSearchTerm('');
											setFilterType('all');
										}}
									>
										Limpar Filtros
									</Button>
								)}
								<Button
									onClick={() => router.push('/marketplace')}
									className="flex items-center gap-2"
								>
									<ShoppingBag className="w-5 h-5" />
									Explorar Marketplace
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
						{filteredFavorites.map((item) => (
							<Card
								key={item.id}
								className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
								style={{ 
									filter: `drop-shadow(0 4px 8px ${getItemColor(item.type)}20)` 
								}}
							>
								{/* Background gradient */}
								<div 
									className="absolute inset-0 opacity-5"
									style={{
										background: `linear-gradient(135deg, ${getItemColor(item.type)} 0%, transparent 70%)`
									}}
								/>

								<CardContent className="p-6 relative z-10">
									<div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center gap-4'}>
										{/* Item Icon & Status */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div 
													className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0"
													style={{ backgroundColor: getItemColor(item.type) }}
												>
													{getItemIcon(item.type)}
												</div>
												<div className="flex flex-col">
													<Badge className={`text-xs ${getItemColor(item.type) === '#813684' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'}`}>
														{item.type === 'product' ? 'Produto' : 'Contribuição'}
													</Badge>
													{!item.isAvailable && (
														<Badge className="text-xs mt-1">
															Indisponível
														</Badge>
													)}
												</div>
											</div>
											{item.discount && (
												<Badge className="bg-orange-100 text-orange-800 text-xs">
													-{item.discount}%
												</Badge>
											)}
										</div>

										{/* Item Info */}
										<div className="flex-1">
											<h3 className="font-bold text-gray-800 text-lg mb-1 tracking-wider">
												{item.name}
											</h3>
											<p className="text-gray-600 text-sm mb-2 line-clamp-2">
												{item.description}
											</p>
											
											<div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
												{item.seller && <span>por {item.seller}</span>}
												{item.location && <span>{item.location}</span>}
												{item.rating && (
													<div className="flex items-center gap-1">
														<Star className="w-3 h-3 text-yellow-500 fill-current" />
														<span>{item.rating.toFixed(1)}</span>
													</div>
												)}
											</div>

											{/* Price */}
											{item.price && (
												<div className="flex items-center gap-2 mb-3">
													<span className="text-xl font-bold text-gray-800">
														{formatPrice(item.price)}
													</span>
													{item.discount && (
														<span className="text-sm text-gray-500 line-through">
															{formatPrice(item.price / (1 - item.discount / 100))}
														</span>
													)}
												</div>
											)}

											{/* Added Date */}
											<p className="text-xs text-gray-500">
												Adicionado em {formatDate(item.addedDate)}
											</p>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2">
											<Button variant="outline" size="sm" className="flex items-center gap-2">
												<Eye className="w-4 h-4" />
												Ver
											</Button>
											<Button variant="outline" size="sm">
												<Share2 className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => removeFavorite(item.id)}
												className="text-red-600 hover:text-red-700"
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Quick Actions */}
				<div className="mt-8 flex justify-center">
					<Button
						onClick={() => router.push('/marketplace')}
						className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
					>
						<Plus className="w-5 h-5" />
						Descobrir Novos Produtos
					</Button>
				</div>
			</div>

			{/* Animated Background Elements */}
			<div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#D42D66" }}></div>
			<div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#813684" }}></div>
			<div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#3E88FF" }}></div>
			<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#689610" }}></div>
			<div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse delay-300" style={{ backgroundColor: "#EAB308" }}></div>
			<div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full opacity-35 animate-pulse delay-800" style={{ backgroundColor: "#43B2D2" }}></div>
			<div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-20 animate-pulse delay-400" style={{ backgroundColor: "#F47802" }}></div>
			<div className="absolute top-3/4 right-1/3 w-2 h-2 rounded-full opacity-30 animate-pulse delay-600" style={{ backgroundColor: "#689610" }}></div>

			<BottomNavigationMenu />
		</div>
	);
} 