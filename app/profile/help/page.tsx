"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, HelpCircle, MessageCircle, Book, Video, ExternalLink } from 'lucide-react';
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
		question: 'Como posso contribuir com roupas?',
		answer: 'Vá até a seção "Contribuir" no menu principal e escolha "Roupas". Siga os passos para entregar suas roupas em pontos de coleta ou solicitar recolha em casa.',
		category: 'Contribuição'
	},
	{
		id: '2',
		question: 'Como funciona o sistema de pontos?',
		answer: 'Você ganha pontos por cada contribuição feita. Estes pontos podem ser usados para descontos no marketplace ou trocados por certificados especiais.',
		category: 'Pontos'
	},
	{
		id: '3',
		question: 'Posso vender minhas roupas?',
		answer: 'Sim! Acesse "Perfil" > "Vender Produtos" e cadastre suas roupas. Nossa IA analisará e ajudará você a definir o preço ideal.',
		category: 'Venda'
	},
	{
		id: '4',
		question: 'Como funciona a calculadora ambiental?',
		answer: 'A calculadora analisa suas roupas e calcula o impacto ambiental positivo de suas contribuições, incluindo CO2 evitado e água poupada.',
		category: 'Ambiental'
	},
	{
		id: '5',
		question: 'O que é o passaporte de impacto?',
		answer: 'É um documento digital que mostra todas as suas contribuições ambientais, certificadas pela blockchain, com métricas detalhadas.',
		category: 'Passaporte'
	}
];

const quickLinks = [
	{
		icon: <Video className="w-5 h-5" />,
		title: 'Tutoriais em Vídeo',
		description: 'Aprenda a usar a app com nossos tutoriais',
		action: () => window.open('https://youtube.com/infinito-tutorials', '_blank')
	},
	{
		icon: <Book className="w-5 h-5" />,
		title: 'Guia Completo',
		description: 'Manual detalhado de todas as funcionalidades',
		action: () => window.open('https://docs.infinito.me', '_blank')
	},
	{
		icon: <MessageCircle className="w-5 h-5" />,
		title: 'Chat ao Vivo',
		description: 'Fale conosco em tempo real',
		action: () => window.open('https://chat.infinito.me', '_blank')
	}
];

export default function HelpPage() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('Todos');

	const categories = ['Todos', 'Contribuição', 'Pontos', 'Venda', 'Ambiental', 'Passaporte'];

	const filteredFAQs = faqData.filter(faq => {
		const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
							  faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

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
						Ajuda
					</h1>
					<div className="w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
						<HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
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
							placeholder="Procurar ajuda..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
						/>
					</div>
				</div>

				{/* Quick Links */}
				<div className="mb-8">
					<h2 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">
						Acesso Rápido
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{quickLinks.map((link, index) => (
							<button
								key={index}
								onClick={link.action}
								className="bg-white/25 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/35 transition-all duration-300 hover:scale-105 text-left group"
								style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
							>
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
										{link.icon}
									</div>
									<ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
								</div>
								<h3 className="font-bold text-gray-800 mb-1">{link.title}</h3>
								<p className="text-sm text-gray-600">{link.description}</p>
							</button>
						))}
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

				{/* FAQ */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">
						Perguntas Frequentes
					</h2>
					{filteredFAQs.map((faq) => (
						<div
							key={faq.id}
							className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:bg-white/35 transition-all duration-300"
							style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
						>
							<div className="flex items-start gap-4">
								<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
									<HelpCircle className="w-4 h-4 text-blue-600" />
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-800 mb-2">
										{faq.question}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{faq.answer}
									</p>
									<span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
										{faq.category}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* No Results */}
				{filteredFAQs.length === 0 && (
					<div className="text-center py-12">
						<HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-bold text-gray-800 mb-2">
							Nenhum resultado encontrado
						</h3>
						<p className="text-gray-600">
							Tente ajustar sua busca ou categoria.
						</p>
					</div>
				)}
			</div>

			<BottomNavigationMenu />
		</div>
	);
} 