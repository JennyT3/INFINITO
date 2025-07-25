"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, Calendar, User, Package, Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface Review {
	id: string;
	type: 'given' | 'received';
	rating: number;
	comment: string;
	date: string;
	product: string;
	user: string;
	verified: boolean;
}

// Dados mockados para demonstração
const mockReviews: Review[] = [
	{
		id: '1',
		type: 'given',
		rating: 5,
		comment: 'Produto excelente, chegou em perfeito estado. Recomendo!',
		date: '2024-01-15',
		product: 'Camiseta Sustentável',
		user: 'João Silva',
		verified: true
	},
	{
		id: '2',
		type: 'received',
		rating: 4,
		comment: 'Vendedor muito atencioso, produto conforme descrito.',
		date: '2024-01-10',
		product: 'Tênis Reciclado',
		user: 'Maria Santos',
		verified: true
	},
	{
		id: '3',
		type: 'given',
		rating: 5,
		comment: 'Entrega rápida e produto sustentável de qualidade.',
		date: '2024-01-05',
		product: 'Bolsa Ecológica',
		user: 'Ana Costa',
		verified: false
	}
];

export default function MyReviewsPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [reviews, setReviews] = useState<Review[]>(mockReviews);
	const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
	const [filter, setFilter] = useState<'all' | 'given' | 'received'>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		applyFilters();
	}, [filter, searchTerm, reviews]);

	const applyFilters = () => {
		let filtered = reviews;

		// Filtrar por tipo
		if (filter !== 'all') {
			filtered = filtered.filter(review => review.type === filter);
		}

		// Filtrar por termo de busca
		if (searchTerm) {
			filtered = filtered.filter(review => 
				review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
				review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
				review.comment.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredReviews(filtered);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`h-4 w-4 ${
					i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
				}`}
			/>
		));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR');
	};

	const getFilterStats = () => {
		const given = reviews.filter(r => r.type === 'given').length;
		const received = reviews.filter(r => r.type === 'received').length;
		return { given, received, total: reviews.length };
	};

	const stats = getFilterStats();

	return (
		<div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center">
			<div className="container mx-auto px-4 py-6">
				{/* Header */}
				<div className="mb-6">
					<button
						onClick={() => router.back()}
						className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
					>
						<ChevronLeft className="h-5 w-5 mr-1" />
						{t('common.back')}
					</button>
					
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						{t('profile.myReviews')}
					</h1>
					
					<p className="text-gray-600">
						{t('profile.reviewsDescription')}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-green-100 rounded-full">
									<Star className="h-5 w-5 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Total de Reviews</p>
									<p className="text-2xl font-bold text-gray-800">{stats.total}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-blue-100 rounded-full">
									<User className="h-5 w-5 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Reviews Dados</p>
									<p className="text-2xl font-bold text-gray-800">{stats.given}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-purple-100 rounded-full">
									<Package className="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Reviews Recebidos</p>
									<p className="text-2xl font-bold text-gray-800">{stats.received}</p>
								</div>
							</div>
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
										placeholder="Buscar reviews..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Filter Buttons */}
							<div className="flex gap-2">
								<Button
									variant={filter === 'all' ? 'default' : 'outline'}
									onClick={() => setFilter('all')}
									className="flex items-center gap-2"
								>
									<Filter className="h-4 w-4" />
									Todos
								</Button>
								<Button
									variant={filter === 'given' ? 'default' : 'outline'}
									onClick={() => setFilter('given')}
								>
									Dados
								</Button>
								<Button
									variant={filter === 'received' ? 'default' : 'outline'}
									onClick={() => setFilter('received')}
								>
									Recebidos
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Reviews List */}
				<div className="space-y-4">
					{filteredReviews.length === 0 ? (
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-8 text-center">
								<Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Nenhum review encontrado
								</h3>
								<p className="text-gray-600">
									{filter === 'all' 
										? 'Você ainda não tem reviews. Comece comprando ou vendendo produtos!'
										: `Nenhum review ${filter === 'given' ? 'dado' : 'recebido'} encontrado.`
									}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredReviews.map((review) => (
							<Card key={review.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
								<CardContent className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<Badge className="text-xs">
												{review.type === 'given' ? 'Review Dado' : 'Review Recebido'}
											</Badge>
											{review.verified && (
												<Badge className="text-xs text-green-600">
													✓ Verificado
												</Badge>
											)}
										</div>
										<div className="flex items-center space-x-1">
											{renderStars(review.rating)}
										</div>
									</div>

									<div className="space-y-3">
										<div className="flex items-center space-x-2 text-sm text-gray-600">
											<Package className="h-4 w-4" />
											<span>{review.product}</span>
										</div>

										<div className="flex items-center space-x-2 text-sm text-gray-600">
											<User className="h-4 w-4" />
											<span>{review.user}</span>
										</div>

										<div className="flex items-center space-x-2 text-sm text-gray-600">
											<Calendar className="h-4 w-4" />
											<span>{formatDate(review.date)}</span>
										</div>

										<div className="bg-gray-50 p-3 rounded-lg">
											<p className="text-gray-700">{review.comment}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Loading State */}
				{loading && (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
						<p className="text-gray-600 mt-2">Carregando reviews...</p>
					</div>
				)}
			</div>
		</div>
	);
} 