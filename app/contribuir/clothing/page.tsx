"use client";
import React, { useState } from "react";
import { Heart, ArrowLeft, ArrowRight, CheckCircle2, Package, Download, Share2, Sparkles, Leaf, Shield, AlertTriangle, X, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from "@/components/BottomNavigationMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import InfinitoLayout from "@/components/InfinitoLayout";
import { useTranslation } from '../../../hooks/useTranslation';

const steps = [
  "start",
  "method",
  "pickup",
  "confirmation"
];

export default function ContributeClothingPage() {
  const [currentStep, setCurrentStep] = useState("start");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<number | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { t } = useTranslation();

  const pickupPoints = [
    { name: "Bogotá Center", country: "Colombia", flag: "🇨🇴", lat: 4.7110, lng: -74.0721 },
    { name: "Rio de Janeiro", country: "Brazil", flag: "🇧🇷", lat: -22.9068, lng: -43.1729 },
    { name: "Buenos Aires", country: "Argentina", flag: "🇦🇷", lat: -34.6118, lng: -58.3960 },
    { name: "Santiago", country: "Chile", flag: "🇨🇱", lat: -33.4489, lng: -70.6693 },
    { name: "La Paz", country: "Bolivia", flag: "🇧🇴", lat: -16.4897, lng: -68.1193 },
    { name: "Mexico City", country: "Mexico", flag: "🇲🇽", lat: 19.4326, lng: -99.1332 }
  ];

  const handleCreateContribution = async (payload: any) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const code = `CLT-${Date.now()}`;
      setGeneratedCode(code);
      setCurrentStep("confirmation");
    } catch (err) {
      setError("Failed to create contribution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setCurrentStep("pickup");
  };

  const handlePickupPointSelect = (index: number) => {
    setSelectedPickupPoint(index);
  };

  const handleConfirmDelivery = async () => {
    if (selectedPickupPoint === null) return;
    
    const selectedPoint = pickupPoints[selectedPickupPoint];
    const payload = {
      tipo: "clothing",
      nome: `Delivery to ${selectedPoint.name}`,
      totalItems: 5,
      detalles: `Pickup point: ${selectedPoint.name} (${selectedPoint.lat}, ${selectedPoint.lng})`,
      estado: "pending"
    };
    
    if (selectedMethod === "donate") {
      router.push("/profile/passport");
    } else if (selectedMethod === "sell") {
      router.push("/profile/sell-products");
    } else {
      await handleCreateContribution(payload);
    }
  };

  const goBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  // Step 1: Start - Select Pickup Point
  if (currentStep === "start") {
    return (
      <InfinitoLayout
        title="Select Pickup Point"
        subtitle="Choose where to deliver your clothes"
        showHeader={true}
        showBackButton={true}
        showBottomMenu={true}
        showLogo={true}
        userName="User"
      >
        <div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center p-4 pb-24">
          <div className="max-w-md mx-auto space-y-4">
            {pickupPoints.map((point, index) => (
              <div
                key={index}
                onClick={() => handlePickupPointSelect(index)}
                className={`bg-white/80 backdrop-blur-md border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPickupPoint === index 
                    ? 'border-[#689610] shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-[#689610]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{point.flag}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{point.name}</h3>
                      <p className="text-sm text-gray-600">{point.country}</p>
                    </div>
                  </div>
                  {selectedPickupPoint === index && (
                    <CheckCircle2 className="w-6 h-6 text-[#689610]" />
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => setCurrentStep("pickup")}
              disabled={selectedPickupPoint === null}
              className={`w-full py-4 rounded-xl font-bold shadow transition-all ${
                selectedPickupPoint !== null
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </InfinitoLayout>
    );
  }

  // Step 2: Pickup Point Selection
  if (currentStep === "pickup") {
    return (
      <InfinitoLayout
        title="Select Pickup Point"
        subtitle="Choose where to deliver your clothes"
        showHeader={true}
        showBackButton={true}
        showBottomMenu={true}
        showLogo={true}
        userName="User"
      >
        <div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center p-4 pb-24">
          <div className="max-w-md mx-auto space-y-4">
            {pickupPoints.map((point, index) => (
              <div
                key={index}
                onClick={() => handlePickupPointSelect(index)}
                className={`bg-white/80 backdrop-blur-md border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedPickupPoint === index 
                    ? 'border-[#689610] shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-[#689610]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{point.flag}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{point.name}</h3>
                      <p className="text-sm text-gray-600">{point.country}</p>
                    </div>
                  </div>
                  {selectedPickupPoint === index && (
                    <CheckCircle2 className="w-6 h-6 text-[#689610]" />
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={handleConfirmDelivery}
              disabled={selectedPickupPoint === null || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold shadow transition-all ${
                selectedPickupPoint !== null && !isSubmitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? "Processing..." : "Confirm Delivery"}
            </button>
          </div>
        </div>
      </InfinitoLayout>
    );
  }

  // Step 3: Confirmation
  if (currentStep === "confirmation") {
    return (
      <InfinitoLayout
        title="Contribution Registered!"
        subtitle=""
        showHeader={true}
        showBackButton={true}
        showBottomMenu={true}
        showLogo={true}
        userName="User"
      >
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 pb-24">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in-scale">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Contribution Created Successfully!</h2>
              <p className="text-gray-600">Your contribution has been registered and certified on the blockchain</p>
            </div>
            
            <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Your Contribution Code:</p>
              <p className="text-lg font-mono font-bold text-gray-800 bg-gray-100 p-3 rounded-lg">
                {generatedCode || "Not available"}
              </p>
              <p className="text-xs text-gray-500 mt-2">Save this code for tracking your contribution</p>
            </div>
            
            <button 
              onClick={() => router.push("/profile/passport")}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
            >
              View Passport
            </button>
            
            <button 
              onClick={() => setCurrentStep("start")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              New Contribution
            </button>
          </div>
          
          <style jsx>{`
            @keyframes fade-in-scale {
              0% { opacity: 0; transform: scale(0.7); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in-scale { animation: fade-in-scale 0.7s cubic-bezier(.4,0,.2,1) both; }
          `}</style>
        </div>
      </InfinitoLayout>
    );
  }

  // Default fallback
  return (
    <InfinitoLayout
      title="Error"
      subtitle="Something went wrong"
      showHeader={true}
      showBackButton={true}
      showBottomMenu={true}
      showLogo={true}
      userName="User"
    >
      <div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Page Error</h2>
          <p className="text-gray-600 mb-4">Please try again</p>
          <button
            onClick={() => setCurrentStep("start")}
            className="bg-[#689610] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E88FF] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </InfinitoLayout>
  );
}