"use client";
import { useState, useEffect } from 'react';
import { 
	TrendingUp, 
	Users, 
	Package, 
	Heart, 
	ShoppingBag, 
	Award,
	AlertCircle,
	CheckCircle,
	Clock,
	Leaf,
	Droplets,
	Zap
} from 'lucide-react';

export default function AdminDashboardPage() {
	const [stats, setStats] = useState({
		totalContributions: 0,
		totalProducts: 0,
		totalUsers: 0,
		totalSales: 0,
		pendingApprovals: 0,
		environmentalImpact: {
			co2Saved: 0,
			waterSaved: 0,
			efficiency: 0
		}
	});

	const [loading, setLoading] = useState(true);

	// Carregar estatísticas
	useEffect(() => {
		const fetchStats = async () => {
			try {
				// Simular dados por enquanto
				setTimeout(() => {
					setStats({
						totalContributions: 1247,
						totalProducts: 892,
						totalUsers: 3456,
						totalSales: 234,
						pendingApprovals: 23,
						environmentalImpact: {
							co2Saved: 2847.5,
							waterSaved: 125400,
							efficiency: 87
						}
					});
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Erro ao carregar estatísticas:', error);
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	// Métricas principais
	const mainMetrics = [
		{
			title: 'Contribuições Totais',
			value: stats.totalContributions.toLocaleString(),
			icon: <Heart className="w-6 h-6 text-white" />,
			color: '#D42D66',
			trend: '+12.5%',
			trendUp: true
		},
		{
			title: 'Produtos Ativos',
			value: stats.totalProducts.toLocaleString(),
			icon: <Package className="w-6 h-6 text-white" />,
			color: '#F47802',
			trend: '+8.3%',
			trendUp: true
		},
		{
			title: 'Utilizadores',
			value: stats.totalUsers.toLocaleString(),
			icon: <Users className="w-6 h-6 text-white" />,
			color: '#3E88FF',
			trend: '+15.2%',
			trendUp: true
		},
		{
			title: 'Vendas Concluídas',
			value: stats.totalSales.toLocaleString(),
			icon: <ShoppingBag className="w-6 h-6 text-white" />,
			color: '#813684',
			trend: '+4.7%',
			trendUp: true
		}
	];

	// Métricas ambientais
	const environmentalMetrics = [
		{
			title: 'CO₂ Evitado',
			value: `${stats.environmentalImpact.co2Saved.toLocaleString()} kg`,
			icon: <Leaf className="w-6 h-6 text-white" />,
			color: '#689610',
			description: 'Emissões evitadas'
		},
		{
			title: 'Água Poupada',
			value: `${stats.environmentalImpact.waterSaved.toLocaleString()} L`,
			icon: <Droplets className="w-6 h-6 text-white" />,
			color: '#43B2D2',
			description: 'Litros conservados'
		},
		{
			title: 'Eficiência Global',
			value: `${stats.environmentalImpact.efficiency}%`,
			icon: <Zap className="w-6 h-6 text-white" />,
			color: '#EAB308',
			description: 'Aproveitamento recursos'
		}
	];

	// Ações pendentes
	const pendingActions = [
		{
			title: 'Contribuições Pendentes',
			count: stats.pendingApprovals,
			icon: <Clock className="w-5 h-5 text-amber-600" />,
			color: '#F59E0B',
			urgent: stats.pendingApprovals > 20
		},
		{
			title: 'Produtos para Aprovar',
			count: 15,
			icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
			color: '#F97316',
			urgent: true
		},
		{
			title: 'Certificados Emitidos',
			count: 156,
			icon: <Award className="w-5 h-5 text-green-600" />,
			color: '#10B981',
			urgent: false
		}
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-96">
				<div className="infinito-glass rounded-2xl p-8 text-center">
					<div className="w-12 h-12 border-4 border-infinito-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando estatísticas...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="infinito-glass rounded-2xl p-6">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl font-bold text-gray-800 tracking-wider">
						Dashboard Administrativo
					</h1>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full infinito-green animate-pulse"></div>
						<span className="text-sm text-gray-600">Sistema Online</span>
					</div>
				</div>
				<p className="text-gray-600">
					Visão geral do sistema INFINITO em tempo real
				</p>
			</div>

			{/* Métricas principais */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{mainMetrics.map((metric, index) => (
					<div
						key={index}
						className="infinito-admin-card group hover:scale-105 transition-all duration-300"
						style={{ 
							filter: `drop-shadow(0 4px 12px ${metric.color}20)`
						}}
					>
						<div className="flex items-center justify-between mb-4">
							<div 
								className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
								style={{ backgroundColor: metric.color }}
							>
								{metric.icon}
							</div>
							<div className={`text-sm font-medium ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
								{metric.trend}
							</div>
						</div>
						<div className="text-2xl font-bold text-gray-800 mb-1">
							{metric.value}
						</div>
						<div className="text-sm text-gray-600">
							{metric.title}
						</div>
					</div>
				))}
			</div>

			{/* Métricas ambientais */}
			<div className="infinito-admin-card">
				<h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wider">
					Impacto Ambiental Global
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{environmentalMetrics.map((metric, index) => (
						<div
							key={index}
							className="infinito-glass rounded-xl p-6 text-center group hover:scale-105 transition-all duration-300"
							style={{ 
								filter: `drop-shadow(0 4px 12px ${metric.color}20)`
							}}
						>
							<div 
								className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300"
								style={{ backgroundColor: metric.color }}
							>
								{metric.icon}
							</div>
							<div className="text-2xl font-bold text-gray-800 mb-2">
								{metric.value}
							</div>
							<div className="text-sm font-medium text-gray-700 mb-1">
								{metric.title}
							</div>
							<div className="text-xs text-gray-600">
								{metric.description}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Ações pendentes */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Ações urgentes */}
				<div className="infinito-admin-card">
					<h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wider">
						Ações Pendentes
					</h2>
					<div className="space-y-4">
						{pendingActions.map((action, index) => (
							<div
								key={index}
								className={`infinito-glass rounded-xl p-4 flex items-center justify-between ${
									action.urgent ? 'border-l-4 border-red-500' : ''
								}`}
							>
								<div className="flex items-center gap-3">
									<div 
										className="w-10 h-10 rounded-lg flex items-center justify-center"
										style={{ backgroundColor: `${action.color}20` }}
									>
										{action.icon}
									</div>
									<div>
										<div className="font-medium text-gray-800">
											{action.title}
										</div>
										<div className="text-sm text-gray-600">
											{action.urgent ? 'Requer atenção' : 'Atualizado'}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-gray-800">
										{action.count}
									</div>
									{action.urgent && (
										<div className="text-xs text-red-600 font-medium">
											Urgente
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Atividade recente */}
				<div className="infinito-admin-card">
					<h2 className="text-xl font-bold text-gray-800 mb-6 tracking-wider">
						Atividade Recente
					</h2>
					<div className="space-y-4">
						{[
							{
								action: 'Nova contribuição aprovada',
								user: 'João Silva',
								time: '2 min atrás',
								type: 'success'
							},
							{
								action: 'Produto adicionado ao marketplace',
								user: 'Maria Santos',
								time: '15 min atrás',
								type: 'info'
							},
							{
								action: 'Certificado emitido',
								user: 'Pedro Costa',
								time: '1h atrás',
								type: 'success'
							},
							{
								action: 'Pendente aprovação',
								user: 'Ana Ferreira',
								time: '2h atrás',
								type: 'warning'
							}
						].map((activity, index) => (
							<div key={index} className="infinito-glass rounded-xl p-4">
								<div className="flex items-start gap-3">
									<div className={`w-2 h-2 rounded-full mt-2 ${
										activity.type === 'success' ? 'bg-green-500' :
										activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
									}`} />
									<div className="flex-1">
										<div className="font-medium text-gray-800 text-sm">
											{activity.action}
										</div>
										<div className="text-xs text-gray-600 mt-1">
											{activity.user} • {activity.time}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Footer com estatísticas resumidas */}
			<div className="infinito-admin-card">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-bold text-gray-800">
							Sistema INFINITO
						</h3>
						<p className="text-sm text-gray-600">
							Economia circular em tempo real
						</p>
					</div>
					<div className="flex items-center gap-6">
						<div className="text-center">
							<div className="text-lg font-bold text-infinito-green">
								{((stats.totalContributions / 1000) * 100).toFixed(1)}%
							</div>
							<div className="text-xs text-gray-600">Eficiência</div>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-infinito-blue">
								24/7
							</div>
							<div className="text-xs text-gray-600">Uptime</div>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-infinito-pink">
								{stats.pendingApprovals}
							</div>
							<div className="text-xs text-gray-600">Pendentes</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 