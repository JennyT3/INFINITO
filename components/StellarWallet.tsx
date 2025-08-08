"use client";
import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, Eye, EyeOff, Copy, MoreVertical, Star } from 'lucide-react';

export default function StellarWallet() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [walletAddress] = useState("GBXZELDK...VKHEXLTM");
  
  const assets = [
    {
      name: "Lumens",
      ticker: "XLM",
      network: "stellar.org",
      quantity: "60.371 XLM",
      value: "$27.86",
      icon: "⭐"
    },
    {
      name: "USDC",
      ticker: "USDC",
      network: "stellar.org",
      quantity: "5,420.75 USDC",
      value: "$5,420.75",
      icon: "💵"
    },
    {
      name: "AQUA",
      ticker: "AQUA",
      network: "aqua.network",
      quantity: "88.8816 AQUA",
      value: "$0.09",
      icon: "🌊"
    }
  ];

  const totalValue = "$5,448.70";

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">{walletAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <Copy className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {isBalanceVisible ? totalValue : "••••••"}
              </div>
              <div className="text-sm text-gray-500">Estimated portfolio value</div>
            </div>
            <button 
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Assets List */}
        <div className="max-h-64 overflow-y-auto">
          {assets.map((asset, index) => (
            <div key={asset.ticker} className={`flex items-center justify-between p-4 ${index !== assets.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                  {asset.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{asset.name}</div>
                  <div className="text-xs text-gray-500">{asset.ticker} ({asset.network})</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-blue-600">{asset.quantity}</div>
                <div className="text-xs text-gray-500">{asset.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
              Send
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-green-600 hover:to-blue-600 transition-all">
              Receive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
