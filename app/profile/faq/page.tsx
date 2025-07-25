"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Info, Search } from 'lucide-react';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';

interface FAQItem {
	id: string;
	question: string;
	answer: string;
	category: string;
}

const faqData: FAQItem[] = [
	{
		id: '1',
		question: 'O que é a INFINITO?',
		answer: 'A INFINITO é uma plataforma de economia circular que permite contribuir com roupas usadas, transformando-as em recursos para quem precisa, arte sustentável ou reciclagem responsável.',
		category: 'Geral'
	},
	{
		id: '2',
		question: 'Como posso contribuir com roupas?',
		answer: 'Acesse "Contribuir" no menu principal, escolha "Roupas", e siga os passos para entregar em pontos de coleta ou solicitar recolha em casa.',
		category: 'Contribuição'
	},
	{
		id: '3',
		question: 'O que acontece com as roupas que contribuo?',
		answer: 'Suas roupas passam por triagem: itens em bom estado vão para quem precisa, roupas danificadas viram arte sustentável, e materiais não aproveitáveis são reciclados responsavelmente.',
		category: 'Contribuição'
	},
	{
		id: '4',
		question: 'Como funciona o sistema de pontos?',
		answer: 'Você ganha pontos por cada contribuição. Estes pontos podem ser usados para descontos no marketplace ou trocados por certificados especiais.',
		category: 'Pontos'
	},
	{
		id: '5',
		question: 'Posso vender minhas roupas na plataforma?',
		answer: 'Sim! Acesse "Perfil" > "Vender Produtos" e cadastre suas roupas. Nossa IA analisará e ajudará a definir o preço ideal.',
		category: 'Venda'
	},
	{
		id: '6',
		question: 'Como funciona a calculadora ambiental?',
		answer: 'A calculadora analisa suas roupas e calcula o impacto ambiental positivo, incluindo CO2 evitado, água poupada e recursos preservados.',
		category: 'Ambiental'
	},
	{
		id: '7',
		question: 'O que é o passaporte de impacto?',
		answer: 'É um documento digital certificado pela blockchain que mostra todas as suas contribuições ambientais com métricas detalhadas.',
		category: 'Passaporte'
	},
	{
		id: '8',
		question: 'Como posso receber roupas gratuitamente?',
		answer: 'Acesse "Contribuir" > "Receber" e verifique se você atende aos critérios de elegibilidade. Depois, explore as roupas disponíveis e faça sua solicitação.',
		category: 'Recebimento'
	},
	{
		id: '9',
		question: 'Os certificados são válidos?',
		answer: 'Sim! Todos os certificados são registrados na blockchain e podem ser verificados publicamente através do código fornecido.',
		category: 'Certificados'
	},
	{
		id: '10',
		question: 'Como funciona a inteligência artificial?',
		answer: 'Nossa IA analisa fotos das suas roupas para identificar material, estado, valor estimado e calcular o impacto ambiental automaticamente.',
		category: 'Tecnologia'
	}
];

export default function FAQPage() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('Todos');
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const categories = ['Todos', 'Geral', 'Contribuição', 'Pontos', 'Venda', 'Ambiental', 'Passaporte', 'Recebimento', 'Certificados', 'Tecnologia'];

	const filteredFAQs = faqData.filter(faq => {
		const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
							  faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const toggleExpanded = (id: string) => {
		setExpandedItems(prev => 
			prev.includes(id) 
				? prev.filter(item => item !== id)
				: [...prev, id]
		);
	};

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
						onClick={() => router.push('/profile/settings')}
						className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
					</button>
					<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">
						FAQ
					</h1>
					<div className="w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
						<Info className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-6 py-8">
				{/* Search Bar */}
				<div className="mb-8">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Procurar perguntas..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
						/>
					</div>
				</div>

				{/* Categories */}
				<div className="mb-6">
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
									selectedCategory === category
										? 'bg-blue-600 text-white shadow-lg'
										: 'bg-white/20 backdrop-blur-sm text-gray-700 hover:bg-white/30 border border-white/40'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* FAQ Items */}
				<div className="space-y-4">
					{filteredFAQs.map((faq) => (
						<div
							key={faq.id}
							className="bg-white/25 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/35 transition-all duration-300 overflow-hidden"
							style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
						>
							<button
								onClick={() => toggleExpanded(faq.id)}
								className="w-full p-6 text-left hover:bg-white/10 transition-colors duration-300"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 className="font-bold text-gray-800 mb-2">
											{faq.question}
										</h3>
										<span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
											{faq.category}
										</span>
									</div>
									<div className="ml-4">
										{expandedItems.includes(faq.id) ? (
											<ChevronUp className="w-5 h-5 text-gray-600" />
										) : (
											<ChevronDown className="w-5 h-5 text-gray-600" />
										)}
									</div>
								</div>
							</button>
							
							{expandedItems.includes(faq.id) && (
								<div className="px-6 pb-6 border-t border-white/20">
									<p className="text-gray-600 leading-relaxed pt-4">
										{faq.answer}
									</p>
								</div>
							)}
						</div>
					))}
				</div>

				{/* No Results */}
				{filteredFAQs.length === 0 && (
					<div className="text-center py-12">
						<Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-gray-800 mb-2">
							Nenhuma pergunta encontrada
						</h3>
						<p className="text-gray-600">
							Tente ajustar sua busca ou categoria.
						</p>
					</div>
				)}

				{/* Help Section */}
				<div className="mt-12 bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/30 text-center">
					<h3 className="text-lg font-bold text-gray-800 mb-2">
						Não encontrou sua resposta?
					</h3>
					<p className="text-gray-600 mb-4">
						Entre em contato conosco para ajuda personalizada.
					</p>
					<button
						onClick={() => window.open('mailto:support@infinito.me', '_blank')}
						className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105"
					>
						Contactar Suporte
					</button>
				</div>
			</div>

			<BottomNavigationMenu />
		</div>
	);
} 