"use client";
import { useLanguage } from '@/components/theme-provider';
import { ArrowLeft, Sparkles, Zap, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SellSectionWithAI from '@/components/calculadora-ambiental/SellSectionWithAI';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';

const translations = {
  pt: { title: 'Sell Products', calculator: 'Environmental Calculator', add: 'Add Product', added: 'product(s) added', productsAdded: 'Products Added', product: 'Product', condition: 'Good condition', price: 'Price', back: 'Back', impact: 'Your Items Impact' },
  en: { title: 'Sell Products', calculator: 'Environmental Calculator', add: 'Add Product', added: 'product(s) added', productsAdded: 'Products Added', product: 'Product', condition: 'Good condition', price: 'Price', back: 'Back', impact: 'Your Items Impact' },
  es: { title: 'Sell Products', calculator: 'Environmental Calculator', add: 'Add Product', added: 'product(s) added', productsAdded: 'Products Added', product: 'Product', condition: 'Good condition', price: 'Price', back: 'Back', impact: 'Your Items Impact' },
};

const SellProductsPage = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.pt;
  const router = useRouter();

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY || 'AIzaSyAdeyOswy4LIgdyNmv_Bhkdg9zUXKJGml8';

  return (
    <div 
      className="min-h-screen font-raleway relative"
      style={{
        backgroundColor: "#EDE4DA",
        backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
        backgroundSize: "cover, 20px 20px, 25px 25px",
        backgroundRepeat: "no-repeat, repeat, repeat"
      }}
    >
      <div className="relative z-10">
        {/* Header solo para móvil */}
        <div className="md:hidden">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl mx-4 mt-4 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/profile')} 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-bold text-lg text-gray-800 tracking-wide">{t.title}</h1>
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Mensaje motivacional */}
          <div className="mx-4 mt-4 mb-6">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-sm font-bold text-gray-800">Transform fashion into impact</h2>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every piece you sell is a contribution to a more sustainable future. 
                Use our AI to optimize your sales! 🌱
              </p>
            </div>
          </div>
        </div>

        {/* Header web */}
        <div className="hidden md:block">
          <div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between">
              <button
                onClick={() => router.push('/profile')}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 tracking-wider">{t.title}</h1>
                <p className="text-sm text-gray-600">Transform your items into sustainable impact</p>
              </div>
              
              <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                <Zap className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Componente principal - sem limitações de width */}
        <div className="w-full">
          <SellSectionWithAI language={language} t={t} />
        </div>
      </div>
      
      <BottomNavigationMenu />
    </div>
  );
};

export default SellProductsPage; 