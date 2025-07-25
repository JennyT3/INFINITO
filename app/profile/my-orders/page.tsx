"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, MapPin, Clock, Eye, CheckCircle, XCircle, AlertCircle, Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface Order {
	id: string;
	orderNumber: string;
	date: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	total: number;
	items: {
		id: string;
		name: string;
		quantity: number;
		price: number;
		image?: string;
	}[];
	tracking?: {
		code: string;
		carrier: string;
		steps: {
			status: string;
			date: string;
			location: string;
			completed: boolean;
		}[];
	};
	seller: {
		name: string;
		rating: number;
	};
	deliveryAddress: string;
}

// Dados mockados para demonstração
const mockOrders: Order[] = [
	{
		id: '1',
		orderNumber: 'INF-2024-001',
		date: '2024-01-15',
		status: 'shipped',
		total: 129.90,
		items: [
			{ id: '1', name: 'Camiseta Sustentável', quantity: 2, price: 64.95 },
		],
		tracking: {
			code: 'BR123456789',
			carrier: 'Correios',
			steps: [
				{ status: 'Pedido confirmado', date: '2024-01-15', location: 'São Paulo, SP', completed: true },
				{ status: 'Em preparação', date: '2024-01-16', location: 'São Paulo, SP', completed: true },
				{ status: 'Enviado', date: '2024-01-17', location: 'São Paulo, SP', completed: true },
				{ status: 'Em trânsito', date: '2024-01-18', location: 'Rio de Janeiro, RJ', completed: false },
				{ status: 'Entregue', date: '', location: 'Rio de Janeiro, RJ', completed: false },
			]
		},
		seller: { name: 'EcoStore', rating: 4.8 },
		deliveryAddress: 'Rua das Flores, 123 - Rio de Janeiro, RJ'
	},
	{
		id: '2',
		orderNumber: 'INF-2024-002',
		date: '2024-01-10',
		status: 'delivered',
		total: 89.99,
		items: [
			{ id: '2', name: 'Tênis Reciclado', quantity: 1, price: 89.99 },
		],
		seller: { name: 'SustainableShoes', rating: 4.5 },
		deliveryAddress: 'Rua das Flores, 123 - Rio de Janeiro, RJ'
	},
	{
		id: '3',
		orderNumber: 'INF-2024-003',
		date: '2024-01-05',
		status: 'processing',
		total: 45.50,
		items: [
			{ id: '3', name: 'Bolsa Ecológica', quantity: 1, price: 45.50 },
		],
		seller: { name: 'GreenBags', rating: 4.2 },
		deliveryAddress: 'Rua das Flores, 123 - Rio de Janeiro, RJ'
	}
];

export default function MyOrdersPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>(mockOrders);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
	const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		applyFilters();
	}, [filter, searchTerm, orders]);

	const applyFilters = () => {
		let filtered = orders;

		// Filtrar por status
		if (filter !== 'all') {
			filtered = filtered.filter(order => order.status === filter);
		}

		// Filtrar por termo de busca
		if (searchTerm) {
			filtered = filtered.filter(order => 
				order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		setFilteredOrders(filtered);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'processing': return 'bg-blue-100 text-blue-800';
			case 'shipped': return 'bg-purple-100 text-purple-800';
			case 'delivered': return 'bg-green-100 text-green-800';
			case 'cancelled': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending': return <Clock className="h-4 w-4" />;
			case 'processing': return <AlertCircle className="h-4 w-4" />;
			case 'shipped': return <Package className="h-4 w-4" />;
			case 'delivered': return <CheckCircle className="h-4 w-4" />;
			case 'cancelled': return <XCircle className="h-4 w-4" />;
			default: return <Clock className="h-4 w-4" />;
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending': return 'Pendente';
			case 'processing': return 'Preparando';
			case 'shipped': return 'Enviado';
			case 'delivered': return 'Entregue';
			case 'cancelled': return 'Cancelado';
			default: return 'Desconhecido';
		}
	};

	const getTrackingProgress = (tracking?: Order['tracking']) => {
		if (!tracking) return 0;
		const completed = tracking.steps.filter(step => step.completed).length;
		return (completed / tracking.steps.length) * 100;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR');
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(price);
	};

	const getFilterStats = () => {
		const pending = orders.filter(o => o.status === 'pending').length;
		const processing = orders.filter(o => o.status === 'processing').length;
		const shipped = orders.filter(o => o.status === 'shipped').length;
		const delivered = orders.filter(o => o.status === 'delivered').length;
		const cancelled = orders.filter(o => o.status === 'cancelled').length;
		return { pending, processing, shipped, delivered, cancelled, total: orders.length };
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
						{t('profile.myOrders')}
					</h1>
					
					<p className="text-gray-600">
						{t('profile.ordersDescription')}
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-gray-800">{stats.total}</p>
								<p className="text-sm text-gray-500">Total</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
								<p className="text-sm text-gray-500">Pendentes</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
								<p className="text-sm text-gray-500">Preparando</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
								<p className="text-sm text-gray-500">Enviados</p>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
								<p className="text-sm text-gray-500">Entregues</p>
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
										placeholder="Buscar pedidos..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							{/* Filter Buttons */}
							<div className="flex gap-2 flex-wrap">
								<Button
									variant={filter === 'all' ? 'default' : 'outline'}
									onClick={() => setFilter('all')}
									className="flex items-center gap-2"
								>
									<Filter className="h-4 w-4" />
									Todos
								</Button>
								<Button
									variant={filter === 'pending' ? 'default' : 'outline'}
									onClick={() => setFilter('pending')}
									size="sm"
								>
									Pendentes
								</Button>
								<Button
									variant={filter === 'processing' ? 'default' : 'outline'}
									onClick={() => setFilter('processing')}
									size="sm"
								>
									Preparando
								</Button>
								<Button
									variant={filter === 'shipped' ? 'default' : 'outline'}
									onClick={() => setFilter('shipped')}
									size="sm"
								>
									Enviados
								</Button>
								<Button
									variant={filter === 'delivered' ? 'default' : 'outline'}
									onClick={() => setFilter('delivered')}
									size="sm"
								>
									Entregues
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Orders List */}
				<div className="space-y-4">
					{filteredOrders.length === 0 ? (
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-8 text-center">
								<Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Nenhum pedido encontrado
								</h3>
								<p className="text-gray-600">
									{filter === 'all' 
										? 'Você ainda não fez nenhum pedido. Comece explorando nosso marketplace!'
										: `Nenhum pedido com status "${getStatusText(filter)}" encontrado.`
									}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredOrders.map((order) => (
							<Card key={order.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
								<CardHeader className="pb-3">
									<div className="flex justify-between items-start">
										<div>
											<CardTitle className="text-lg font-semibold text-gray-800">
												{order.orderNumber}
											</CardTitle>
											<p className="text-sm text-gray-600">
												{formatDate(order.date)} • {order.seller.name}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
												{getStatusIcon(order.status)}
												{getStatusText(order.status)}
											</Badge>
										</div>
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									{/* Items */}
									<div className="space-y-2 mb-4">
										{order.items.map((item) => (
											<div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
												<div className="flex-1">
													<p className="font-medium text-gray-800">{item.name}</p>
													<p className="text-sm text-gray-600">
														Qtd: {item.quantity} • {formatPrice(item.price)}
													</p>
												</div>
											</div>
										))}
									</div>

									{/* Tracking Info */}
									{order.tracking && (
										<div className="bg-gray-50 p-4 rounded-lg mb-4">
											<div className="flex items-center gap-2 mb-3">
												<Package className="h-4 w-4 text-gray-600" />
												<span className="text-sm font-medium text-gray-800">
													Rastreamento: {order.tracking.code}
												</span>
											</div>
											
											<Progress value={getTrackingProgress(order.tracking)} className="mb-3" />
											
											<div className="space-y-2">
												{order.tracking.steps.map((step, index) => (
													<div key={index} className={`flex items-center gap-3 text-sm ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
														<div className={`w-2 h-2 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
														<div className="flex-1">
															<span className="font-medium">{step.status}</span>
															{step.date && <span className="text-gray-500"> • {formatDate(step.date)}</span>}
														</div>
														<span className="text-xs text-gray-400">{step.location}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Total and Actions */}
									<div className="flex justify-between items-center pt-4 border-t border-gray-100">
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-gray-400" />
											<span className="text-sm text-gray-600">{order.deliveryAddress}</span>
										</div>
										<div className="flex items-center gap-4">
											<span className="text-lg font-bold text-gray-800">
												{formatPrice(order.total)}
											</span>
											<Button variant="outline" size="sm" className="flex items-center gap-2">
												<Eye className="h-4 w-4" />
												Detalhes
											</Button>
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
						<p className="text-gray-600 mt-2">Carregando pedidos...</p>
					</div>
				)}
			</div>
		</div>
	);
} 