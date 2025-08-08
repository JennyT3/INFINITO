"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, Eye, EyeOff, Copy, MoreVertical, Star, DollarSign } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [walletAddress] = useState("GBXZELDK...VKHEXLTM");
  
  const totalValue = "$5,448.70";
  const stellarBalance = "60.371 XLM";
  const usdcBalance = "5,420.75 USDC";

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/30 max-w-xs">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700">{walletAddress}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              {isBalanceVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Compact Balance */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {isBalanceVisible ? totalValue : "••••••"}
              </div>
              <div className="text-xs text-gray-500">Portfolio</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Stellar</div>
              <div className="text-sm font-medium text-blue-600">{stellarBalance}</div>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-3 border-t border-gray-100">
            {/* USDC Balance */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">USDC</span>
              </div>
              <span className="text-sm font-medium text-green-600">{usdcBalance}</span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 mt-3">
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
