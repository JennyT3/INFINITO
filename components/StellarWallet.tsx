"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, Eye, EyeOff, Copy, Star, DollarSign, Send, Download } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [walletAddress] = useState("GBXZELDK...VKHEXLTM");
  
  const totalValue = "$5,448.70";
  const stellarBalance = "60.371 XLM";
  const usdcBalance = "5,420.75 USDC";

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Compact Wallet Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/30 flex items-center gap-3 px-4 py-2">
        {/* Stellar Icon */}
        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
        
        {/* Balance */}
        <div className="text-sm font-medium text-gray-700">
          {isBalanceVisible ? totalValue : "••••••"}
        </div>
        
        {/* Visibility Toggle */}
        <button 
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          {isBalanceVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
        
        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Wallet Panel */}
      {isExpanded && (
        <div className="mt-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/30 max-w-xs">
          {/* Header */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{walletAddress}</span>
              <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Balances */}
          <div className="p-3 border-b border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">Stellar</span>
                </div>
                <span className="text-sm font-medium text-blue-600">{stellarBalance}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">USDC</span>
                </div>
                <span className="text-sm font-medium text-green-600">{usdcBalance}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-3">
            <div className="flex gap-2">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-1">
                <Send className="w-3 h-3" />
                Send
              </button>
              <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-green-600 hover:to-blue-600 transition-all flex items-center justify-center gap-1">
                <Download className="w-3 h-3" />
                Receive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
