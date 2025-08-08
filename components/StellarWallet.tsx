"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [walletAddress] = useState("GABC1234567890...XYZ");
  const [balance] = useState("1,250.50 XLM");

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-3 h-3 text-white" />
          </div>
          <div className="text-xs">
            <div className="font-medium text-gray-800">Stellar</div>
            <div className="text-gray-500">{balance}</div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mt-2 mb-2">{walletAddress}</div>
            <div className="flex gap-1">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1 px-2 rounded text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Send
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-1 px-2 rounded text-xs font-medium hover:from-green-600 hover:to-blue-600 transition-all">
                Receive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
