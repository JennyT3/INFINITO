"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/theme-provider';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';
import { Heart, ArrowLeft, Download, Share2, Leaf, Droplets, Zap, Award, Package, ShoppingBag, User, Star } from 'lucide-react';

export default function PassportPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handler for the back button in the passport
  const handleBack = () => {
    router.push('/profile');
  };

  // Mock data for the passport
  const userStats = {
    contributions: 5,
    sales: 3,
    purchases: 2,
    donations: 1,
    totalImpact: {
      co2Saved: 25.5,
      waterSaved: 150.2,
      resourcesConserved: 85
    }
  };

  const downloadCertificate = () => {
    // Mock PDF download functionality
    console.log('Downloading certificate...');
  };

  const shareProfile = () => {
    // Mock share functionality
    console.log('Sharing profile...');
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center font-raleway px-2 py-4 pb-24"
      style={{
        backgroundColor: "#EDE4DA",
        backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
        backgroundSize: "cover, 20px 20px, 25px 25px",
        backgroundRepeat: "no-repeat, repeat, repeat"
      }}
    >
      {/* Header */}
      <div 
        className="w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 mb-6 rounded-2xl sticky top-4 z-10"
        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">
            Environmental Passport
          </h1>
          <div className="w-10 md:w-12"></div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl">
        {/* Círculo de métricas */}
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Impact</h2>
          
          {/* Círculo SVG */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg width="256" height="256" viewBox="0 0 256 256" className="w-full h-full">
              {/* Segmento Verde - Contribuciones */}
              <path
                d="M 128 20 A 108 108 0 0 1 236 128 L 128 128 Z"
                fill="#689610"
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
              
              {/* Segmento Azul - Compras */}
              <path
                d="M 236 128 A 108 108 0 0 1 128 236 L 128 128 Z"
                fill="#3E88FF"
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
              
              {/* Segmento Naranja - Ventas */}
              <path
                d="M 128 236 A 108 108 0 0 1 20 128 L 128 128 Z"
                fill="#F47802"
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
              
              {/* Segmento Rosa - Donaciones */}
              <path
                d="M 20 128 A 108 108 0 0 1 128 20 L 128 128 Z"
                fill="#D42D66"
                className="cursor-pointer transition-all duration-300 hover:opacity-80"
              />
              
              {/* Círculo interno */}
              <circle cx="128" cy="128" r="60" fill="#EDE4DA" />
              
              {/* Texto central */}
              <text 
                x="128" 
                y="135" 
                textAnchor="middle" 
                className="font-bold text-2xl fill-gray-800"
              >
                {userStats.contributions + userStats.sales + userStats.purchases + userStats.donations}
              </text>
            </svg>
          </div>

          {/* Leyenda de secciones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#689610" }}></div>
              <span className="text-sm font-medium text-gray-700">Contributions: {userStats.contributions}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#3E88FF" }}></div>
              <span className="text-sm font-medium text-gray-700">Purchases: {userStats.purchases}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#F47802" }}></div>
              <span className="text-sm font-medium text-gray-700">Sales: {userStats.sales}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#D42D66" }}></div>
              <span className="text-sm font-medium text-gray-700">Donations: {userStats.donations}</span>
            </div>
          </div>

          {/* Métricas de impacto */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#689610" }}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{userStats.totalImpact.co2Saved} Kg</span>
              <p className="text-xs text-gray-600 font-medium">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#43B2D2" }}>
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{userStats.totalImpact.waterSaved} LT</span>
              <p className="text-xs text-gray-600 font-medium">Water Saved</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: "#F47802" }}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{userStats.totalImpact.resourcesConserved}%</span>
              <p className="text-xs text-gray-600 font-medium">Resources</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={downloadCertificate}
              className="flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: "#3E88FF",
                filter: "drop-shadow(0 4px 8px rgba(62,136,255,0.3))"
              }}
            >
              <Download className="w-4 h-4" />
              <span className="tracking-wider text-sm">Download PDF</span>
            </button>
            <button
              onClick={shareProfile}
              className="flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: "#D42D66",
                filter: "drop-shadow(0 4px 8px rgba(212,45,102,0.3))"
              }}
            >
              <Share2 className="w-4 h-4" />
              <span className="tracking-wider text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
          <h3 className="font-bold text-gray-800 mb-4 tracking-wider">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Leaf className="w-5 h-5" style={{ color: "#689610" }} />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm tracking-wider">Contribution</div>
                <div className="text-xs text-gray-600 font-light">2 days ago</div>
              </div>
              <span className="text-xs text-gray-500 font-medium">5.2kg CO₂</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Package className="w-5 h-5" style={{ color: "#F47802" }} />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm tracking-wider">Sale</div>
                <div className="text-xs text-gray-600 font-light">1 week ago</div>
              </div>
              <span className="text-xs text-gray-500 font-medium">3.1kg CO₂</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <ShoppingBag className="w-5 h-5" style={{ color: "#3E88FF" }} />
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm tracking-wider">Purchase</div>
                <div className="text-xs text-gray-600 font-light">2 weeks ago</div>
              </div>
              <span className="text-xs text-gray-500 font-medium">2.8kg CO₂</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigationMenu />
      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
} 