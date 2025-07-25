"use client";
import { useLanguage } from '../../components/theme-provider';
import { ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SellSectionWithAI from '@/components/calculadora-ambiental/SellSectionWithAI';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';

const translations = {
  pt: { title: 'Vender Peças', calculator: 'Calculadora Ambiental', add: 'Adicionar Peça', added: 'peça(s) adicionada(s)', productsAdded: 'Peças Adicionadas', product: 'Peça', condition: 'Bom estado', price: 'Preço', back: 'Voltar', impact: 'Impacto das Tuas Peças' },
};

const SellProductsPage = () => {
  const { language } = useLanguage();
  const t = translations['pt'];
  const router = useRouter();

  return (
    <div 
      className="min-h-screen font-raleway relative"
      style={{
        backgroundColor: "#EDE4DA",
        backgroundImage: "url('/fondo.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="relative z-10">
        {/* Header web y móvil tipo /profile */}
        <div className="bg-white/30 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="w-5 h-5 text-green-700" />
            </button>
            <h1 className="font-bold text-lg md:text-xl text-green-800 tracking-wider">{t.title}</h1>
            <div className="w-10"></div>
          </div>
        </div>
        {/* Mensaje motivacional ecológico */}
        <div className="max-w-2xl mx-auto px-4 mt-6 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-base font-bold text-green-800">Transforma moda em impacto ecológico</h2>
            </div>
            <p className="text-xs text-gray-600 text-center">
              Cada peça que vendes é uma contribuição para um futuro mais sustentável. Usa a IA para otimizar as tuas vendas!
            </p>
          </div>
        </div>
        {/* Componente principal - visual minimalista y armónico */}
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white/80 rounded-2xl shadow-xl p-4 mb-8">
            <SellSectionWithAI language={language} t={t} />
          </div>
        </div>
      </div>
      <BottomNavigationMenu />
    </div>
  );
};

export default SellProductsPage; 