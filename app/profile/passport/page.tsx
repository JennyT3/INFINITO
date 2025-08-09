"use client";
import React, { useState } from 'react';
import { ArrowLeft, Search, User, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PassportPage() {
  const router = useRouter();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [progressStep, setProgressStep] = useState(3);

  const data = {
    sales: { number: 12, color: '#4CAF50' },
    donations: { number: 25, color: '#E91E63' },
    purchases: { number: 8, color: '#2196F3' },
    collectibles: { number: 34, color: '#FF9800' },
    footprint: { co2: '142.5', water: '8,450', resources: '89', color: '#FF9800' }
  };

  const timeline = [
    { date: '15 Jan 2025', status: 'Registered' },
    { date: '16 Jan 2025', status: 'Received' },
    { date: '18 Jan 2025', status: 'Verified' },
    { date: '20 Jan 2025', status: 'Blockchain Certified' }
  ];

  const appBackground = {
    backgroundColor: "#EDE4DA",
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px, 25px 25px, 15px 15px",
  };

  const Circle = () => (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
        <path d="M 20 128 A 108 108 0 0 1 128 20 L 128 128 Z" fill={hoveredSection === 'sales' ? '#66BB6A' : '#4CAF50'} className="cursor-pointer" onMouseEnter={() => setHoveredSection('sales')} onMouseLeave={() => setHoveredSection(null)} />
        <path d="M 128 20 A 108 108 0 0 1 236 128 L 128 128 Z" fill={hoveredSection === 'donations' ? '#EC407A' : '#E91E63'} className="cursor-pointer" onMouseEnter={() => setHoveredSection('donations')} onMouseLeave={() => setHoveredSection(null)} />
        <path d="M 236 128 A 108 108 0 0 1 128 236 L 128 128 Z" fill={hoveredSection === 'footprint' ? '#FFB74D' : '#FF9800'} className="cursor-pointer" onMouseEnter={() => setHoveredSection('footprint')} onMouseLeave={() => setHoveredSection(null)} />
        <path d="M 128 236 A 108 108 0 0 1 20 128 L 128 128 Z" fill={hoveredSection === 'purchases' ? '#42A5F5' : '#2196F3'} className="cursor-pointer" onMouseEnter={() => setHoveredSection('purchases')} onMouseLeave={() => setHoveredSection(null)} />
        <circle cx="128" cy="128" r="60" fill="#EDE4DA" />
        {hoveredSection && (
          <text x="128" y="135" textAnchor="middle" className="font-bold text-lg fill-gray-800 transform rotate-90" style={{ transformOrigin: '128px 128px' }}>
            {hoveredSection === 'footprint' ? data.footprint.co2 : (data[hoveredSection as keyof typeof data] as any)?.number}
          </text>
        )}
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={appBackground}>
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pt-12 pb-6 px-4">
          <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center border border-gray-300">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-600">I</span><span className="text-red-500">N</span><span className="text-yellow-500">F</span><span className="text-blue-600">I</span><span className="text-red-500">N</span><span className="text-green-500">I</span><span className="text-purple-600">T</span><span className="text-orange-500">O</span><span className="text-gray-600 text-2xl">.me</span>
          </h1>
        </div>

        <Circle />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 px-4">
          {['donations', 'purchases', 'collectibles'].map(key => (
            <div key={key} className="bg-white/90 rounded-2xl p-4 text-center shadow-sm border border-gray-200">
              <div className="text-2xl font-bold mb-1" style={{ color: data[key as keyof typeof data].color }}>
                {data[key as keyof typeof data].number}
              </div>
              <div className="text-sm font-medium text-gray-800 capitalize">{key}</div>
            </div>
          ))}
        </div>

        {/* Track Button */}
        <div className="px-4 mb-6">
          <button className="w-full bg-white/90 rounded-2xl py-3 px-4 text-left border border-gray-200" onClick={() => setProgressStep((progressStep + 1) % 4)}>
            <span className="text-gray-700 font-medium">Track your donations journey →</span>
            <div className="text-xs text-gray-500 mt-1">{timeline[progressStep]?.status} - {timeline[progressStep]?.date}</div>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 mb-6">
          <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
            <div className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500" style={{width: `${(progressStep / 3) * 100}%`}}></div>
            {timeline.map((item, index) => (
              <div key={index} className={`absolute -top-1 w-4 h-4 rounded-full cursor-pointer ${index <= progressStep ? 'bg-blue-500' : 'bg-gray-300'}`} style={{left: `${(index / 3) * 100}%`}} onClick={() => setProgressStep(index)}></div>
            ))}
          </div>
        </div>

        {/* Environmental Card */}
        <div className="mx-4 mb-6">
          <div className="bg-white/95 rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Environmental Footprint</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs">☁️</span>
                <div>
                  <div className="font-bold text-xl text-gray-800">{data.footprint.co2} Kg</div>
                  <div className="text-sm text-gray-600">Carbon emissions avoided</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs">💧</span>
                <div>
                  <div className="font-bold text-xl text-gray-800">{data.footprint.water} LT</div>
                  <div className="text-sm text-gray-600">Water preserved</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs">⚡</span>
                <div>
                  <div className="font-bold text-xl text-gray-800">{data.footprint.resources}%</div>
                  <div className="text-sm text-gray-600">Resources saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mx-4 mb-6">
          <div className="bg-white/95 rounded-2xl p-4 shadow-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Share your INFINITO.me profile</h4>
            <p className="text-sm text-gray-600 mb-4">Anyone can access this link to view your profile on the web</p>
            <div className="flex gap-3">
              <input type="text" value="infinito.me/User" readOnly className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => setShowShareModal(true)} className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">Share</button>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Share Profile</h3>
              <p className="text-gray-600 mb-4">Share your environmental impact with friends and family</p>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium">Share via WhatsApp</button>
                <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium">Copy Link</button>
                <button onClick={() => setShowShareModal(false)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
