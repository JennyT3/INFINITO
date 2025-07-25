"use client";
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/theme-provider';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';

export default function VerificacionPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const translations = {
    pt: {
      title: "Verificação Blockchain",
      success: "Transação certificada na blockchain! NFT gerado.",
      next: "Avançar",
      back: "Voltar"
    },
    en: {
      title: "Blockchain Verification",
      success: "Transaction certified on blockchain! NFT generated.",
      next: "Next",
      back: "Back"
    },
    es: {
      title: "Verificación Blockchain",
      success: "¡Transacción certificada en blockchain! NFT generado.",
      next: "Siguiente",
      back: "Volver"
    }
  };
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center mt-12 mb-6">
        <img src="/LOGO1.svg" alt="INFINITO Logo" className="w-32 h-auto mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">{t.title}</h2>
      <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
        <div className="w-full bg-white/90 rounded-xl p-6 shadow-lg flex flex-col items-center gap-4">
          <div className="text-4xl">🔗</div>
          <div className="text-lg font-medium text-green-700 text-center">{t.success}</div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/impacto')}
            className="bg-gray-700 text-white py-2 px-6 rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            ← {t.back}
          </button>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-green-600 text-white py-2 px-6 rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            {t.next} →
          </button>
        </div>
      </div>
      <BottomNavigationMenu />
    </div>
  );
} 