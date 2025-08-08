"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, DollarSign, TrendingUp } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [walletAddress] = useState("GABC1234567890...XYZ");
  const [stellarBalance] = useState("1,250.50 XLM");
  const [usdcBalance] = useState("5,420.75 USDC");

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-xl shadow-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-gray-800">Stellar Wallet</div>
            <div className="text-xs text-gray-500">{stellarBalance}</div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <DollarSign className="w-3 h-3 text-green-600" />
            <span className="text-xs font-medium text-green-600">{usdcBalance}</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mt-3 mb-3">{walletAddress}</div>
            
            {/* Balances */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg">
                <div className="text-xs opacity-90">Stellar</div>
                <div className="font-bold text-sm">{stellarBalance}</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-lg">
                <div className="text-xs opacity-90">USDC</div>
                <div className="font-bold text-sm">{usdcBalance}</div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Send
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center gap-1">
                <DollarSign className="w-3 h-3" />
                Receive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
