"use client";
import React, { useState, useEffect } from "react";
import { Gift, ArrowLeft, CheckCircle2, Package, User, Shirt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from '../../../hooks/useTranslation';

const steps = ["start", "eligibility", "browse", "request", "confirmation", "tracking"];

const mockClothes = [
  { id: 1, name: "Camiseta Azul", size: "M", state: "Ótimo", location: "Funchal", img: "👕" },
  { id: 2, name: "Calças Jeans", size: "L", state: "Bom", location: "Ribeira Brava", img: "👖" },
  { id: 3, name: "Vestido Floral", size: "S", state: "Novo", location: "Câmara de Lobos", img: "👗" },
];

export default function ReceiveClothesFlowPage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState("start");
  const [requested, setRequested] = useState(false);
  const router = useRouter();

  const goBack = () => {
    if (currentStep === "start") router.push("/contribuir");
    else setCurrentStep(steps[steps.indexOf(currentStep) - 1]);
  };

  // Paso 1: Inicio
  if (currentStep === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Receber Roupas</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg mb-6 flex flex-col items-center">
            <Gift className="w-12 h-12 text-blue-600 mb-2" />
            <div className="font-bold text-gray-800 mb-2">Roupas para quem precisa</div>
            <ul className="space-y-2 text-gray-700 text-sm mt-2 mb-2 w-full">
              <li className="flex items-center gap-2"><Shirt className="w-5 h-5 text-blue-500" /> Roupas limpas e em bom estado</li>
              <li className="flex items-center gap-2"><User className="w-5 h-5 text-cyan-500" /> Para pessoas em situação de vulnerabilidade</li>
              <li className="flex items-center gap-2"><Package className="w-5 h-5 text-green-500" /> Entrega rápida e sem custo</li>
            </ul>
            <div className="text-xs text-gray-500 mt-2">Processo simples, seguro e confidencial</div>
          </div>
          <button onClick={() => setCurrentStep("eligibility")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            Começar
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Elegibilidad
  if (currentStep === "eligibility") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{/* TODO: Add to translations */}Elegibilidade</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg mb-6">
            <div className="font-bold text-gray-800 mb-2">Tu enquadras-te nos critérios?</div>
            <div className="flex gap-2 mb-2">
              <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">Sim</button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-bold">Não</button>
            </div>
          </div>
          <button onClick={() => setCurrentStep("browse")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            {t('next')}
          </button>
        </div>
      </div>
    );
  }

  // Paso 3: Explorar ropa
  if (currentStep === "browse") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{/* TODO: Add to translations */}Roupas disponíveis</h1>
          </div>
          <div className="space-y-4">
            {mockClothes.map((item) => (
              <div key={item.id} className="bg-white/80 rounded-xl p-4 shadow-md border border-gray-200 flex items-center gap-4">
                <span className="text-3xl">{item.img}</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500">{/* TODO: Add to translations */}Tamanho: {item.size} | {item.state}</div>
                  <div className="text-xs text-blue-600">{item.location}</div>
                </div>
                <button onClick={() => setCurrentStep("request")}
                  className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium text-xs hover:bg-blue-200">
                  {/* TODO: Add to translations */}Solicitar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Paso 4: Solicitar
  if (currentStep === "request") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{/* TODO: Add to translations */}Solicitar</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg mb-6 flex flex-col items-center">
            <User className="w-12 h-12 text-blue-600 mb-2" />
            <div className="font-bold text-gray-800 mb-2">{/* TODO: Add to translations */}Solicitação enviada</div>
            <div className="text-sm text-gray-600 mb-2">{/* TODO: Add to translations */}Aguarde confirmação</div>
          </div>
          <button onClick={() => setCurrentStep("confirmation")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            {t('next')}
          </button>
        </div>
      </div>
    );
  }

  // Paso 5: Confirmación
  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-white animate-bounce" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{/* TODO: Add to translations */}Solicitação confirmada</h1>
            <p className="text-gray-600">{/* TODO: Add to translations */}Siga as instruções para retirada</p>
          </div>
          <button onClick={() => setCurrentStep("tracking")}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 mb-3">
            <Package className="w-5 h-5" />
            {/* TODO: Add to translations */}Ver no passaporte
          </button>
          <button onClick={() => setCurrentStep("start")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium">
            {/* TODO: Add to translations */}Nova solicitação
          </button>
        </div>
      </div>
    );
  }

  // Paso 6: Tracking (placeholder)
  if (currentStep === "tracking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{/* TODO: Add to translations */}Minhas solicitações</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg text-center">
            <p className="text-gray-600">(Dashboard de tracking em breve)</p>
          </div>
          <button onClick={() => router.push("/profile/passport")}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg">
            {/* TODO: Add to translations */}Ver passaporte completo
          </button>
        </div>
      </div>
    );
  }

  return null;
} 