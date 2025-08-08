"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImpactPassportPage() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleBack = () => {
    router.push('/profile');
  };

  const searchContribution = async () => {
    if (!trackingCode.trim()) {
      setSearchError("Please enter a contribution code");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setContributionData(null);

    try {
      const response = await fetch(`/api/contributions?tracking=${trackingCode.trim()}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Could not search for contribution`);
      }

      const data = await response.json();
      const contributions = data.data || data;

      if (contributions && contributions.length > 0) {
        const contribution = contributions[0];
        
        // Verificar si la contribución es de hoy
        const today = new Date().toISOString().split('T')[0];
        const contributionDate = new Date(contribution.createdAt).toISOString().split('T')[0];
        
        if (contributionDate === today) {
          setContributionData(contribution);
        } else {
          setSearchError("This contribution is not from today. Only today's contributions are shown.");
        }
      } else {
        setSearchError("No contribution found with this code.");
      }
    } catch (error) {
      console.error("Error searching for contribution:", error);
      setSearchError(error instanceof Error ? error.message : "Error searching for contribution");
    } finally {
      setIsSearching(false);
    }
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
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">Track Your Contribution</h2>
          <p className="text-gray-700 mb-4">
            Enter your contribution tracking code to see the status and environmental impact.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Code
              </label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Enter tracking code..."
                className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchContribution()}
              />
            </div>
            
            <button
              onClick={searchContribution}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search Contribution"}
            </button>
          </div>

          {searchError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
              {searchError}
            </div>
          )}
        </div>

        {/* Contribution Results */}
        {contributionData && (
          <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contribution Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="font-semibold text-gray-700">Tracking:</span>
                <p className="text-gray-800 font-mono">{contributionData.tracking}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Type:</span>
                <p className="text-gray-800 capitalize">{contributionData.tipo}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status:</span>
                <p className="text-gray-800 capitalize">{contributionData.estado}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Items:</span>
                <p className="text-gray-800">
                  {contributionData.estado === 'pendiente' ? 'Pending verification' : contributionData.totalItems}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Date:</span>
                <p className="text-gray-800">{new Date(contributionData.fecha || contributionData.createdAt).toLocaleDateString('pt-PT')}</p>
              </div>
            </div>

            {contributionData.detalles && (
              <div className="mt-3">
                <span className="font-semibold text-gray-700">Details:</span>
                <p className="text-gray-800 text-sm">{contributionData.detalles}</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
              ✅ Contribution found! This contribution is from today and can be tracked.
            </div>
          </div>
        )}

        <div className="bg-white/25 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Example Tracking Code</h3>
          <p className="text-gray-700 mb-2">
            Try with your contribution: <span className="font-mono text-green-600">INF_1753475802913_3ewhghxth</span>
          </p>
          <button
            onClick={() => {
              setTrackingCode("INF_1753475802913_3ewhghxth");
              setTimeout(searchContribution, 100);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Click to try with example code
          </button>
        </div>
      </div>
    </div>
  );
} 