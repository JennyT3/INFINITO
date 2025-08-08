"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  User, 
  Share2, 
  Trash2, 
  Home, 
  Recycle,
  Leaf,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PassportPage() {
  const router = useRouter();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [progressStep, setProgressStep] = useState(3); // 0-4 steps
  

  
  // Statistical data
  const sectionData = {
    sales: { number: 12, color: '#4CAF50', label: 'Sales' },
    donations: { number: 25, color: '#E91E63', label: 'Donations' },
    purchases: { number: 8, color: '#2196F3', label: 'Purchases' },
    collectibles: { number: 34, color: '#FF9800', label: 'Collectibles' },
    footprint: { 
      co2: '142.5', 
      water: '8,450', 
      resources: '89',
      color: '#FF9800', 
      label: 'Environmental Footprint' 
    }
  };

  // Timeline tracking data
  const timelineData = [
    { date: '15 Jan 2025', status: 'Registered', completed: true },
    { date: '16 Jan 2025', status: 'Received', completed: true },
    { date: '18 Jan 2025', status: 'Verified', completed: true },
    { date: '20 Jan 2025', status: 'Blockchain Certified', completed: false }
  ];
  
  // Exact beige background from image
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
  };

  // Interactive colored circle component
  const InteractiveCircle = () => (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
        {/* Green Segment - Sales */}
        <path
          d="M 20 128 A 108 108 0 0 1 128 20 L 128 128 Z"
          fill={hoveredSection === 'sales' ? '#66BB6A' : '#4CAF50'}
          className="cursor-pointer transition-all duration-300"
          onMouseEnter={() => setHoveredSection('sales')}
          onMouseLeave={() => setHoveredSection(null)}
        />
        {/* Pink/Magenta Segment - Donations */}
        <path
          d="M 128 20 A 108 108 0 0 1 236 128 L 128 128 Z"
          fill={hoveredSection === 'donations' ? '#EC407A' : '#E91E63'}
          className="cursor-pointer transition-all duration-300"
          onMouseEnter={() => setHoveredSection('donations')}
          onMouseLeave={() => setHoveredSection(null)}
        />
        {/* Orange Segment - Environmental footprint */}
        <path
          d="M 236 128 A 108 108 0 0 1 128 236 L 128 128 Z"
          fill={hoveredSection === 'footprint' ? '#FFB74D' : '#FF9800'}
          className="cursor-pointer transition-all duration-300"
          onMouseEnter={() => setHoveredSection('footprint')}
          onMouseLeave={() => setHoveredSection(null)}
        />
        {/* Blue Segment - Purchases */}
        <path
          d="M 128 236 A 108 108 0 0 1 20 128 L 128 128 Z"
          fill={hoveredSection === 'purchases' ? '#42A5F5' : '#2196F3'}
          className="cursor-pointer transition-all duration-300"
          onMouseEnter={() => setHoveredSection('purchases')}
          onMouseLeave={() => setHoveredSection(null)}
        />
        
        {/* Inner circle */}
        <circle cx="128" cy="128" r="60" fill="#EDE4DA" />
        
        {/* Dynamic central text */}
        {hoveredSection && (
          <text 
            x="128" 
            y="135" 
            textAnchor="middle" 
            className="font-bold text-lg fill-gray-800 transform rotate-90"
            style={{ transformOrigin: '128px 128px' }}
          >
            {hoveredSection === 'footprint' 
              ? sectionData.footprint.co2 
              : (sectionData[hoveredSection as keyof typeof sectionData] as any)?.number}
          </text>
        )}
      </svg>
      
      {/* Section labels that appear on hover */}
      {hoveredSection === 'donations' && (
        <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-2 transition-all duration-300">
          <span className="text-sm font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow">
            Donations
          </span>
          <div className="w-px h-8 bg-gray-400 mx-auto"></div>
        </div>
      )}
      
      {hoveredSection === 'footprint' && (
        <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 transition-all duration-300">
          <div className="text-right bg-white/90 px-2 py-1 rounded shadow">
            <span className="text-sm font-medium text-gray-700">Environmental</span>
            <br />
            <span className="text-sm font-medium text-gray-700">Footprint</span>
          </div>
          <div className="w-8 h-px bg-gray-400 ml-2"></div>
        </div>
      )}
      
      {hoveredSection === 'purchases' && (
        <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 transition-all duration-300">
          <div className="text-left bg-white/90 px-2 py-1 rounded shadow">
            <span className="text-sm font-medium text-gray-700">Purchases</span>
          </div>
          <div className="w-8 h-px bg-gray-400 mr-2"></div>
        </div>
      )}
      
      {hoveredSection === 'sales' && (
        <div className="absolute top-8 left-8 transition-all duration-300">
          <div className="text-left bg-white/90 px-2 py-1 rounded shadow">
            <span className="text-sm font-medium text-gray-700">Sales</span>
          </div>
          <div className="w-6 h-px bg-gray-400 rotate-45 mt-1"></div>
        </div>
      )}
    </div>
  );

  // Share modal
  const ShareModal = () => {
    if (!showShareModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Share Profile</h3>
          <p className="text-gray-600 mb-4">
            Share your environmental impact with friends and family
          </p>
          
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium">
              Share via WhatsApp
            </button>
            <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium">
              Copy Link
            </button>
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <div className="min-h-screen font-sans" style={appBackground}>
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pt-12 pb-6 px-4">
          <button 
            onClick={handleBack}
            className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center"
          >
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

        {/* Logo INFINITO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-600">I</span>
            <span className="text-red-500">N</span>
            <span className="text-yellow-500">F</span>
            <span className="text-blue-600">I</span>
            <span className="text-red-500">N</span>
            <span className="text-green-500">I</span>
            <span className="text-purple-600">T</span>
            <span className="text-orange-500">O</span>
            <span className="text-gray-600 text-2xl">.me</span>
          </h1>
        </div>



        {/* Interactive Central Circle */}
        <InteractiveCircle />

        {/* Bottom sections with colored numbers */}
        <div className="grid grid-cols-3 gap-3 mb-6 px-4">
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-sm border border-gray-200">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: sectionData.donations.color }}
            >
              {sectionData.donations.number}
            </div>
            <div className="text-sm font-medium text-gray-800">Donations</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-sm border border-gray-200">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: sectionData.purchases.color }}
            >
              {sectionData.purchases.number}
            </div>
            <div className="text-sm font-medium text-gray-800">Purchases</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-4 text-center shadow-sm border border-gray-200">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: sectionData.collectibles.color }}
            >
              {sectionData.collectibles.number}
            </div>
            <div className="text-sm font-medium text-gray-800">Collectibles</div>
          </div>
        </div>

        {/* Interactive tracking button */}
        <div className="px-4 mb-6">
          <button 
            className="w-full bg-white/90 rounded-2xl py-3 px-4 text-left border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setProgressStep((progressStep + 1) % 5)}
          >
            <span className="text-gray-700 font-medium">Track your donations journey →</span>
            <div className="text-xs text-gray-500 mt-1">
              {timelineData[progressStep]?.status} - {timelineData[progressStep]?.date}
            </div>
          </button>
        </div>

        {/* Interactive progress bar */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
              <div 
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500" 
                style={{width: `${(progressStep / 4) * 100}%`}}
              ></div>
              
              {/* Progress points */}
              {timelineData.map((item, index) => (
                <div 
                  key={index}
                  className={`absolute -top-1 w-4 h-4 rounded-full transition-colors duration-300 cursor-pointer ${
                    index <= progressStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{left: `${(index / 4) * 100}%`}}
                  onClick={() => setProgressStep(index)}
                  title={`${item.status} - ${item.date}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Timeline labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            {timelineData.map((item, index) => (
              <div key={index} className="text-center" style={{width: '25%'}}>
                <div className="font-medium">{item.status}</div>
                <div>{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Footprint Card with real values */}
        <div className="mx-4 mb-6">
          <div className="bg-white/95 rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">Environmental Footprint</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">☁️</span>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-800">{sectionData.footprint.co2} Kg</div>
                      <div className="text-sm text-gray-600">Carbon emissions avoided</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">💧</span>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-800">{sectionData.footprint.water} LT</div>
                      <div className="text-sm text-gray-600">Water consumption preserved</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">⚡</span>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-gray-800">{sectionData.footprint.resources}%</div>
                      <div className="text-sm text-gray-600">Natural resources saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share profile modal */}
        <div className="mx-4 mb-6">
          <div className="bg-white/95 rounded-2xl p-4 shadow-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Share your INFINITO.me profile</h4>
            <p className="text-sm text-gray-600 mb-4">
              Anyone can access this link to view your profile on the web
            </p>
            
            <div className="flex gap-3">
              <input 
                type="text" 
                value="infinito.me/User" 
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Share modal */}
        <ShareModal />
      </div>
    </div>
  );
} 