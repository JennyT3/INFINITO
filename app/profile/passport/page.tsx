"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';

export default function PassportPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center font-raleway px-2 py-4 pb-24">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 mb-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
          >
            ←
          </button>
          <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">
            Environmental Passport
          </h1>
          <div className="w-10 md:w-12"></div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md md:max-w-4xl lg:max-w-6xl">
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Impact</h2>
          
          {/* Simple Circle */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">11</span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-2 mx-auto">
                🌱
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">25.5 Kg</span>
              <p className="text-xs text-gray-600 font-medium">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-2 mx-auto">
                💧
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">150.2 LT</span>
              <p className="text-xs text-gray-600 font-medium">Water Saved</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-2 mx-auto">
                ⚡
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">85%</span>
              <p className="text-xs text-gray-600 font-medium">Resources</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2 bg-blue-500">
              📥 Download PDF
            </button>
            <button className="flex-1 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30 flex items-center justify-center gap-2 bg-pink-500">
              📤 Share
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
          <h3 className="font-bold text-gray-800 mb-4 tracking-wider">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-green-500">🌱</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm tracking-wider">Contribution</div>
                <div className="text-xs text-gray-600 font-light">2 days ago</div>
              </div>
              <span className="text-xs text-gray-500 font-medium">5.2kg CO₂</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-orange-500">📦</span>
              <div className="flex-1">
                <div className="font-medium text-gray-800 text-sm tracking-wider">Sale</div>
                <div className="text-xs text-gray-600 font-light">1 week ago</div>
              </div>
              <span className="text-xs text-gray-500 font-medium">3.1kg CO₂</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-blue-500">🛍️</span>
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
    </div>
  );
} 