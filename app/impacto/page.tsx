"use client";
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../hooks/useTranslation';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import * as React from "react"

export default function ImpactoPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Simulación de métricas
  const metrics = {
    co2: '5.2 kg',
    water: '2,500 L',
    resources: '85%'
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center mt-12 mb-6">
        <img src="/LOGO1.svg" alt="INFINITO Logo" className="w-32 h-auto mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">{t('environmental_footprint')}</h2>
      <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
        <div className="w-full bg-white/90 rounded-xl p-6 shadow-lg flex flex-col items-center gap-4">
          <div className="text-4xl">🌱</div>
          <div className="text-lg font-medium text-gray-700">{t('co2_avoided')}: <span className="font-bold">{metrics.co2}</span></div>
          <div className="text-lg font-medium text-gray-700">{t('water_preserved')}: <span className="font-bold">{metrics.water}</span></div>
          <div className="text-lg font-medium text-gray-700">{t('resources_saved')}: <span className="font-bold">{metrics.resources}</span></div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/contribuir')}
            className="bg-gray-700 text-white py-2 px-6 rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            ← {t('back')}
          </button>
          <button
            onClick={() => router.push('/verificacion')}
            className="bg-green-600 text-white py-2 px-6 rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            {t('next')} →
          </button>
        </div>
      </div>
      <BottomNavigationMenu />
    </div>
  );
} 