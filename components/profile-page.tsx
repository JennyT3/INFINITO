"use client"
import {
  Search,
  User,
  ArrowLeft,
  ChevronRight,
  FileText,
  History,
  ShoppingBag,
  Package,
  CreditCard,
  Star,
  Trophy,
  Settings,
} from "lucide-react"
import { useLanguage } from "./theme-provider"

interface ProfilePageProps {
  onBack: () => void
  onNavigate: (page: string) => void
}

export default function ProfilePage({ onBack, onNavigate }: ProfilePageProps) {
  const { language, setLanguage } = useLanguage()
  const translations = {
    pt: { profile: "Perfil" },
    en: { profile: "Profile" },
    es: { profile: "Perfil" }
  }
  const t = translations[language]

  // 1. Reordenar y jerarquizar el menú
	const menuItems = [
		{ title: "Passaporte de impacto", icon: FileText, action: () => onNavigate("passport"), priority: true },
		{ title: "Histórico de doações", icon: History, action: () => onNavigate("donation-history"), priority: true },
		{ title: "Colecionáveis", icon: Trophy, action: () => onNavigate("collectibles"), priority: true },
		{ title: "Favoritos", icon: Star, action: () => onNavigate("favorites"), priority: false },
		{ title: "As minhas encomendas", icon: Package, action: () => onNavigate("my-orders"), priority: false },
		{ title: "As minhas avaliações", icon: Star, action: () => onNavigate("my-reviews"), priority: false },
		{ title: "Métodos de pagamento", icon: CreditCard, action: () => onNavigate("payment-methods"), priority: false },
		{ title: "Definições", icon: Settings, action: () => onNavigate("settings"), priority: false },
	];

  // Fundo beige com textura consistente
  const appBackground = {
    backgroundColor: "#EDE4DA",
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 40% 80%, rgba(120, 119, 108, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 0% 100%, rgba(120, 119, 108, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px),
      linear-gradient(0deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px, 25px 25px, 30px 30px, 35px 35px, 15px 15px, 15px 15px",
  }

  return (
    <div className="min-h-screen font-raleway" style={appBackground}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 text-gray-700 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 text-gray-700 hover:bg-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 text-gray-700 hover:bg-white transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-md">
        {/* Selector de Idioma en la parte superior */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-600 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M2.05 11h19.9M12 2.05v19.9M17.94 6.06L6.06 17.94M6.06 6.06l11.88 11.88"/></svg>
              {['pt', 'en', 'es'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as 'pt' | 'en' | 'es')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === lang
                      ? 'bg-gray-800 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-0 h-auto bg-transparent border-none hover:opacity-80 transition-opacity"
          >
            <img
              src="/LOGO1.svg"
              alt="INFINITO"
              className="w-32 h-auto mx-auto opacity-80"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            />
          </button>
        </div>

        {/* Estado da Ligação Google */}
        <div className="mb-6 border border-green-200 bg-green-50/80 rounded-2xl shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-lg text-green-700">Ligado ao Google</span>
                <p className="text-sm text-green-600">maria.silva@gmail.com</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Perfil do Utilizador */}
		<div className="mb-6 bg-white/95 rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col items-center">
			{/* 2. Avatar interactivo con overlay de cámara y efecto glow */}
			<div 
				className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/30 flex items-center justify-center mb-4 overflow-hidden cursor-pointer relative group border-2 border-white/40 hover:border-[#43B2D2]/60 transition-all duration-500"
				style={{ 
					animation: "glow-avatar 3s ease-in-out infinite",
					filter: "drop-shadow(0 4px 12px rgba(67,178,210,0.3))"
				}}
			>
				<User className="w-14 h-14 md:w-20 md:h-20 text-[#43B2D2]" />
				{/* Overlay cámara */}
				<div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
					<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A2 2 0 0122 9.618V17a2 2 0 01-2 2H4a2 2 0 01-2-2V9.618a2 2 0 012.447-1.894L9 10m6 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v4m6 0H9" /></svg>
				</div>
			</div>
			<h2 className="text-xl font-bold text-gray-800">Maria Silva</h2>
			<p className="text-gray-600">Eco-Warrior Nível 3</p>
			<div className="flex gap-4 mt-2">
				<div className="text-center">
					<div className="text-sm font-bold text-green-600">15</div>
					<div className="text-xs text-gray-600">Doações</div>
				</div>
				<div className="text-center">
					<div className="text-sm font-bold text-blue-600">8</div>
					<div className="text-xs text-gray-600">Compras</div>
				</div>
				<div className="text-center">
					<div className="text-sm font-bold text-purple-600">12</div>
					<div className="text-xs text-gray-600">NFTs</div>
				</div>
			</div>
		</div>

        {/* Itens do Menu */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                className={`group bg-white/20 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center gap-3 text-left relative overflow-hidden ${item.priority ? 'ring-2 ring-white/20' : ''}`}
                onClick={item.action}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-800 font-medium">{item.title}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 1. Eliminar la sección de estadísticas de impacto total */}
        {/* Información Adicional eliminada */}

        {/* Versão da App */}
        <div className="text-center text-gray-500 text-sm mb-4">
          <p>INFINITO App v1.0.0</p>
          <p>Economia Circular Têxtil</p>
        </div>
      </main>
    </div>
  )
}
