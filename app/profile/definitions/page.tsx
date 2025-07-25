"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Book, Leaf, Recycle, Heart, Star, Award, Shield, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface Definition {
	id: string;
	term: string;
	category: 'sustainability' | 'platform' | 'contribution' | 'impact' | 'certification';
	definition: string;
	example?: string;
	relatedTerms?: string[];
	icon: any;
}

const definitions: Definition[] = [
	{
		id: '1',
		term: 'Contribuição Sustentável',
		category: 'contribution',
		definition: 'Ação de doar, vender ou reciclar produtos têxteis que geram impacto positivo no meio ambiente e na sociedade.',
		example: 'Doar uma camiseta que não usa mais para uma família necessitada.',
		relatedTerms: ['Impacto Ambiental', 'Pegada de Carbono', 'Economia Circular'],
		icon: Heart
	},
	{
		id: '2',
		term: 'Pegada de Carbono',
		category: 'sustainability',
		definition: 'Medida da quantidade total de gases de efeito estufa emitidos direta ou indiretamente por uma atividade, produto ou serviço.',
		example: 'Uma camiseta nova pode ter uma pegada de carbono de 8-10kg CO2.',
		relatedTerms: ['Sustentabilidade', 'Impacto Ambiental'],
		icon: Leaf
	},
	{
		id: '3',
		term: 'Economia Circular',
		category: 'sustainability',
		definition: 'Modelo econômico que visa eliminar o desperdício e o uso contínuo de recursos através de reutilização, compartilhamento, reparo e reciclagem.',
		example: 'Reutilizar uma jaqueta para fazer uma bolsa nova.',
		relatedTerms: ['Upcycling', 'Reciclagem Têxtil', 'Sustentabilidade'],
		icon: Recycle
	},
	{
		id: '4',
		term: 'Passaporte Ambiental',
		category: 'platform',
		definition: 'Documento digital que registra e certifica todas as suas contribuições sustentáveis na plataforma INFINITO.',
		example: 'Seu passaporte mostra que você salvou 50kg de CO2 este ano.',
		relatedTerms: ['Certificado INFINITO', 'Impacto Ambiental'],
		icon: Shield
	},
	{
		id: '5',
		term: 'Certificado INFINITO',
		category: 'certification',
		definition: 'Documento oficial que comprova sua contribuição sustentável, verificado por blockchain e reconhecido internacionalmente.',
		example: 'Certificado de doação de 10 peças têxteis com impacto de 25kg CO2 reduzido.',
		relatedTerms: ['Passaporte Ambiental', 'Blockchain', 'Verificação'],
		icon: Award
	},
	{
		id: '6',
		term: 'Upcycling',
		category: 'contribution',
		definition: 'Processo de transformar materiais descartados em novos produtos de maior valor, qualidade ou uso.',
		example: 'Transformar jeans velhos em uma bolsa moderna.',
		relatedTerms: ['Economia Circular', 'Reciclagem Têxtil', 'Sustentabilidade'],
		icon: Star
	},
	{
		id: '7',
		term: 'Impacto Ambiental',
		category: 'impact',
		definition: 'Efeito positivo ou negativo que suas ações têm no meio ambiente, medido em reduções de CO2, água economizada e resíduos evitados.',
		example: 'Doar uma camiseta evita 8kg de CO2 e economiza 2.700L de água.',
		relatedTerms: ['Pegada de Carbono', 'Sustentabilidade', 'Economia Circular'],
		icon: Globe
	},
	{
		id: '8',
		term: 'Reciclagem Têxtil',
		category: 'contribution',
		definition: 'Processo de recuperar fibras ou materiais de roupas e tecidos para criar novos produtos têxteis.',
		example: 'Converter camisetas velhas em fibras para fazer novos tecidos.',
		relatedTerms: ['Upcycling', 'Economia Circular', 'Sustentabilidade'],
		icon: Recycle
	},
	{
		id: '9',
		term: 'Sustentabilidade',
		category: 'sustainability',
		definition: 'Capacidade de manter o equilíbrio ecológico através de práticas que não esgotam os recursos naturais.',
		example: 'Comprar apenas o que precisa e reutilizar o que já tem.',
		relatedTerms: ['Pegada de Carbono', 'Economia Circular', 'Impacto Ambiental'],
		icon: Leaf
	},
	{
		id: '10',
		term: 'Verificação Blockchain',
		category: 'platform',
		definition: 'Sistema de verificação descentralizado que garante a autenticidade e transparência dos certificados INFINITO.',
		example: 'Cada certificado tem um código QR que verifica sua autenticidade na blockchain.',
		relatedTerms: ['Certificado INFINITO', 'Transparência', 'Segurança'],
		icon: Shield
	}
];

export default function DefinitionsPage() {
	const router = useRouter();
	const { t } = useTranslation();
	const { user } = useAuth();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const categories = [
		{ id: 'all', name: 'Todos', count: definitions.length },
		{ id: 'sustainability', name: 'Sustentabilidade', count: definitions.filter(d => d.category === 'sustainability').length },
		{ id: 'platform', name: 'Plataforma', count: definitions.filter(d => d.category === 'platform').length },
		{ id: 'contribution', name: 'Contribuição', count: definitions.filter(d => d.category === 'contribution').length },
		{ id: 'impact', name: 'Impacto', count: definitions.filter(d => d.category === 'impact').length },
		{ id: 'certification', name: 'Certificação', count: definitions.filter(d => d.category === 'certification').length },
	];

	const filteredDefinitions = definitions.filter(def => {
		const matchesSearch = def.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
			def.definition.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || def.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'sustainability': return 'bg-green-100 text-green-800';
			case 'platform': return 'bg-blue-100 text-blue-800';
			case 'contribution': return 'bg-purple-100 text-purple-800';
			case 'impact': return 'bg-orange-100 text-orange-800';
			case 'certification': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryName = (category: string) => {
		switch (category) {
			case 'sustainability': return 'Sustentabilidade';
			case 'platform': return 'Plataforma';
			case 'contribution': return 'Contribuição';
			case 'impact': return 'Impacto';
			case 'certification': return 'Certificação';
			default: return 'Outros';
		}
	};

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
					
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
							<Book className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-800">
								Definições INFINITO
							</h1>
							<p className="text-gray-600">
								Aprenda sobre os conceitos fundamentais da sustentabilidade e da plataforma INFINITO
							</p>
						</div>
					</div>
				</div>

				{/* Search and Categories */}
				<div className="mb-6 space-y-4">
					{/* Search */}
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									type="text"
									placeholder="Pesquisar definições..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Categories */}
					<div className="flex gap-2 overflow-x-auto pb-2">
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
									selectedCategory === category.id
										? 'bg-green-500 text-white shadow-lg'
										: 'bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-green-50'
								}`}
							>
								{category.name} ({category.count})
							</button>
						))}
					</div>
				</div>

				{/* Definitions List */}
				<div className="space-y-4">
					{filteredDefinitions.length === 0 ? (
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
							<CardContent className="p-8 text-center">
								<Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Nenhuma definição encontrada
								</h3>
								<p className="text-gray-600">
									Tente buscar por outros termos ou selecionar uma categoria diferente.
								</p>
							</CardContent>
						</Card>
					) : (
						filteredDefinitions.map((definition) => {
							const IconComponent = definition.icon;
							return (
								<Card key={definition.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
									<CardHeader className="pb-3">
										<div className="flex items-start gap-4">
											<div className="p-3 bg-green-50 rounded-full">
												<IconComponent className="h-6 w-6 text-green-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<CardTitle className="text-xl font-bold text-gray-800">
														{definition.term}
													</CardTitle>
													<Badge className={getCategoryColor(definition.category)}>
														{getCategoryName(definition.category)}
													</Badge>
												</div>
											</div>
										</div>
									</CardHeader>

									<CardContent className="pt-0">
										<div className="space-y-4">
											{/* Definition */}
											<div>
												<p className="text-gray-700 leading-relaxed">
													{definition.definition}
												</p>
											</div>

											{/* Example */}
											{definition.example && (
												<div className="bg-green-50 p-4 rounded-lg">
													<p className="text-sm font-medium text-green-800 mb-1">
														Exemplo:
													</p>
													<p className="text-sm text-green-700">
														{definition.example}
													</p>
												</div>
											)}

											{/* Related Terms */}
											{definition.relatedTerms && definition.relatedTerms.length > 0 && (
												<div>
													<p className="text-sm font-medium text-gray-800 mb-2">
														Termos relacionados:
													</p>
													<div className="flex flex-wrap gap-2">
														{definition.relatedTerms.map((term, i) => (
															<Badge key={i} className="text-xs">
																{term}
															</Badge>
														))}
													</div>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							);
						})
					)}
				</div>

				{/* Footer */}
				<div className="mt-8 text-center">
					<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
						<CardContent className="p-6">
							<div className="flex items-center justify-center gap-3 mb-3">
								<div className="p-2 bg-green-50 rounded-full">
									<Globe className="h-5 w-5 text-green-600" />
								</div>
								<h3 className="text-lg font-semibold text-gray-800">
									Quer saber mais?
								</h3>
							</div>
							<p className="text-gray-600 text-sm">
								Explore nossa plataforma e descubra como suas contribuições fazem a diferença para o planeta.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
} 