"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [walletAddress] = useState("GABC1234567890...XYZ");
  const [balance] = useState("1,250.50 XLM");

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-lg">
      <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-800">Stellar Wallet</div>
              <div className="text-xs text-gray-500">{walletAddress}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">{balance}</div>
              <div className="text-xs text-green-600">Connected</div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-gray-500">Network</div>
                <div className="font-medium text-gray-800">Testnet</div>
              </div>
              <div>
                <div className="text-gray-500">Sequence</div>
                <div className="font-medium text-gray-800">1,234</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Send
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-green-600 hover:to-blue-600 transition-all">
                Receive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
