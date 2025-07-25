"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, FileText } from 'lucide-react';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';

const privacySections = [
	{
		id: 'collection',
		title: 'Coleta de Dados',
		icon: <Database className="w-5 h-5" />,
		content: 'Coletamos apenas os dados necessários para fornecer nossos serviços: informações de perfil, dados de contribuições, localização para recolha, e análise de impacto ambiental. Todos os dados são coletados com seu consentimento explícito.'
	},
	{
		id: 'usage',
		title: 'Uso dos Dados',
		icon: <Eye className="w-5 h-5" />,
		content: 'Utilizamos seus dados para: processar suas contribuições, calcular impacto ambiental, gerar certificados, facilitar recolhas, e melhorar nossos serviços. Nunca vendemos seus dados a terceiros.'
	},
	{
		id: 'security',
		title: 'Segurança',
		icon: <Lock className="w-5 h-5" />,
		content: 'Implementamos medidas rigorosas de segurança: criptografia end-to-end, autenticação OAuth, certificados blockchain, e armazenamento seguro. Seus dados estão protegidos com tecnologia de ponta.'
	},
	{
		id: 'sharing',
		title: 'Compartilhamento',
		icon: <Users className="w-5 h-5" />,
		content: 'Compartilhamos dados apenas quando necessário: com parceiros de logística para recolhas, organizações beneficiárias (sem dados pessoais), e autoridades quando legalmente obrigatório.'
	},
	{
		id: 'rights',
		title: 'Seus Direitos',
		icon: <FileText className="w-5 h-5" />,
		content: 'Você tem direito a: acessar todos os seus dados, corrigir informações incorretas, excluir sua conta e dados, exportar seus dados, e revogar consentimentos a qualquer momento.'
	},
	{
		id: 'retention',
		title: 'Retenção de Dados',
		icon: <Shield className="w-5 h-5" />,
		content: 'Mantemos seus dados apenas pelo tempo necessário: dados de perfil enquanto a conta estiver ativa, dados de contribuições por 7 anos (requisitos legais), e dados de impacto permanentemente para histórico ambiental.'
	}
];

export default function PrivacyPage() {
	const router = useRouter();

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
						Política de Privacidade
					</h1>
					<div className="w-10 md:w-12 h-10 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
						<Shield className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-6 py-8">
				{/* Introduction */}
				<div className="mb-8">
					<div 
						className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center relative overflow-hidden"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Shield className="w-8 h-8 text-green-600" />
						</div>
						<h2 className="text-xl font-bold text-gray-800 mb-4 tracking-wider">
							Sua Privacidade é Prioridade
						</h2>
						<p className="text-gray-600 leading-relaxed">
							Na INFINITO, respeitamos sua privacidade e protegemos seus dados com as melhores práticas de segurança. 
							Esta política explica como coletamos, usamos e protegemos suas informações.
						</p>
					</div>
				</div>

				{/* Privacy Sections */}
				<div className="space-y-6">
					{privacySections.map((section) => (
						<div
							key={section.id}
							className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/30 hover:bg-white/35 transition-all duration-300"
							style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
						>
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
									{section.icon}
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-800 mb-3 text-lg tracking-wider">
										{section.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{section.content}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* GDPR Compliance */}
				<div className="mt-8">
					<div 
						className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/30"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<h3 className="font-bold text-gray-800 mb-4 text-lg tracking-wider flex items-center gap-2">
							<FileText className="w-5 h-5" />
							Conformidade GDPR
						</h3>
						<p className="text-gray-600 leading-relaxed mb-4">
							Estamos em total conformidade com o Regulamento Geral de Proteção de Dados (GDPR) da União Europeia. 
							Isso significa que você tem controle total sobre seus dados pessoais.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-white/20 rounded-lg p-4">
								<h4 className="font-semibold text-gray-800 mb-2">Direito de Acesso</h4>
								<p className="text-sm text-gray-600">Acesse todos os seus dados a qualquer momento</p>
							</div>
							<div className="bg-white/20 rounded-lg p-4">
								<h4 className="font-semibold text-gray-800 mb-2">Direito de Correção</h4>
								<p className="text-sm text-gray-600">Corrija informações incorretas</p>
							</div>
							<div className="bg-white/20 rounded-lg p-4">
								<h4 className="font-semibold text-gray-800 mb-2">Direito de Exclusão</h4>
								<p className="text-sm text-gray-600">Delete sua conta e dados</p>
							</div>
							<div className="bg-white/20 rounded-lg p-4">
								<h4 className="font-semibold text-gray-800 mb-2">Portabilidade</h4>
								<p className="text-sm text-gray-600">Exporte seus dados</p>
							</div>
						</div>
					</div>
				</div>

				{/* Contact */}
				<div className="mt-8">
					<div 
						className="bg-white/25 backdrop-blur-md rounded-xl p-6 border border-white/30 text-center"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<h3 className="font-bold text-gray-800 mb-4 text-lg tracking-wider">
							Dúvidas sobre Privacidade?
						</h3>
						<p className="text-gray-600 mb-6">
							Entre em contato conosco para esclarecimentos sobre nossa política de privacidade.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								onClick={() => window.open('mailto:privacy@infinito.me', '_blank')}
								className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105"
							>
								Contactar DPO
							</button>
							<button
								onClick={() => router.push('/profile/help')}
								className="px-6 py-3 bg-white/20 backdrop-blur-sm text-gray-700 rounded-xl font-medium hover:bg-white/30 border border-white/40 transition-all duration-300 hover:scale-105"
							>
								Centro de Ajuda
							</button>
						</div>
					</div>
				</div>

				{/* Last Updated */}
				<div className="mt-8 text-center">
					<p className="text-sm text-gray-500">
						Última atualização: {new Date().toLocaleDateString('pt-PT', { 
							day: 'numeric', 
							month: 'long', 
							year: 'numeric' 
						})}
					</p>
				</div>
			</div>

			<BottomNavigationMenu />
		</div>
	);
} 