"use client";
import { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentMethods() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('stellar');

  const paymentMethods = [
    {
      id: 'stellar',
      name: 'Stellar Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Pay with Stellar network'
    },
    {
      id: 'usdc',
      name: 'USDC',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'USD Coin on Stellar'
    },
    {
      id: 'moneygram',
      name: 'MoneyGram',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'MoneyGram transfer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  selectedMethod === method.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}>
                  {method.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">{method.name}</h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button className="w-full mt-8 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
          Save Payment Method
        </button>
      </div>
    </div>
  );
}
