"use client";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Package, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from "@/components/BottomNavigationMenu";

export default function ContributeClothingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const steps = ["Choose Method", "Select Pickup", "Confirm"];

  const methods = [
    { id: "donate", title: "Donate", description: "Free for those in need" },
    { id: "sell", title: "Sell", description: "2 USDC per item" }
  ];

  const pickupPoints = [
    { id: 1, name: "México City Center", address: "Centro, Ciudad de México" },
    { id: 2, name: "São Paulo Central", address: "Centro, São Paulo" },
    { id: 3, name: "Bogotá Downtown", address: "Centro, Bogotá" }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleComplete = () => {
    // Handle completion
    router.push('/profile/contribution-history');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Contribute Clothing</h1>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div key={index} className={`flex-1 h-2 rounded ${index <= step ? 'bg-blue-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">Step {step + 1} of {steps.length}: {steps[step]}</p>
      </div>

      <div className="p-4">
        {/* Step 0: Choose Method */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">How do you want to contribute?</h2>
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => {setSelectedMethod(method.id); handleNext();}}
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <h3 className="font-medium">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Select Pickup */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Select pickup point:</h2>
            {pickupPoints.map((point) => (
              <button
                key={point.id}
                onClick={() => {setSelectedPoint(point.id); handleNext();}}
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  selectedPoint === point.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{point.name}</h3>
                    <p className="text-sm text-gray-600">{point.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Contribution Registered!</h2>
              <p className="text-gray-600">Your contribution has been certified on the blockchain</p>
            </div>

            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium capitalize">{selectedMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Point:</span>
                <span className="font-medium">{pickupPoints.find(p => p.id === selectedPoint)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code:</span>
                <span className="font-medium">INF-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
            >
              View Full Passport
            </button>
          </div>
        )}
      </div>

      <BottomNavigationMenu />
    </div>
  );
}
