"use client";
import React, { useState } from "react";
import { Heart, ArrowLeft, ArrowRight, CheckCircle2, Package, Download, Share2, Sparkles, Leaf, Shield, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from "@/components/BottomNavigationMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const steps = [
  "start",
  "method",
  "map",
  "confirmation",
  "tracking"
];

export default function ContributeClothingPage() {
  // Declarar todos los hooks al inicio
  const [currentStep, setCurrentStep] = useState("start");
  const [openModal, setOpenModal] = useState(false); // Para el modal de método
  const [selected, setSelected] = useState<number | null>(null); // Para el paso del mapa
  const router = useRouter();
  // Estado para los datos del formulario de recolha
  const [pickupPhone, setPickupPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupWeight, setPickupWeight] = useState("");
  const [pickupDay, setPickupDay] = useState("");
  // Estado para el código generado
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [fullBackendResponse, setFullBackendResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para validación
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función de validación
  const validatePickupForm = () => {
    const errors: Record<string, string> = {};
    
    // Validar teléfono
    if (!pickupPhone.trim()) {
      errors.phone = "Número de teléfono é obrigatório";
    } else if (!/^[+]?[0-9\s\-\(\)]{9,15}$/.test(pickupPhone.trim())) {
      errors.phone = "Formato de teléfono inválido";
    }
    
    // Validar dirección
    if (!pickupAddress.trim()) {
      errors.address = "Endereço é obrigatório";
    } else if (pickupAddress.trim().length < 10) {
      errors.address = "Endereço deve ter pelo menos 10 caracteres";
    }
    
    // Validar peso
    if (!pickupWeight.trim()) {
      errors.weight = "Peso é obrigatório";
    } else {
      const weight = parseFloat(pickupWeight);
      if (isNaN(weight) || weight <= 0) {
        errors.weight = "Peso deve ser um número positivo";
      } else if (weight < 10) {
        errors.weight = "Peso mínimo para recolha é 10kg";
      } else if (weight > 100) {
        errors.weight = "Peso máximo para recolha é 100kg";
      }
    }
    
    // Validar dia
    if (!pickupDay.trim()) {
      errors.day = "Dia de recolha é obrigatório";
    } else {
      const selectedDate = new Date(pickupDay);
      const today = new Date();
      const dayOfWeek = selectedDate.getDay();
      
      if (selectedDate < today) {
        errors.day = "Data deve ser no futuro";
      } else if (dayOfWeek !== 2 && dayOfWeek !== 4) { // Terça = 2, Quinta = 4
        errors.day = "Recolha apenas às terças e quintas";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goBack = () => {
    if (currentStep === "method" || currentStep === "map") setCurrentStep("start");
    else if (currentStep === "confirmation") setCurrentStep("map");
    else if (currentStep === "tracking") setCurrentStep("confirmation");
    else setCurrentStep("start");
  };

  // Definir la función antes de su uso en el formulario:
  const handleCreateContribution = async (payload: any) => {
    setError(null);
    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.tracking || data.tracking === "null" || data.tracking === undefined) {
      setError("No hay contribución encontrada.");
      setGeneratedCode(null);
    } else {
      setGeneratedCode(data.tracking);
      setFullBackendResponse(data);
      setCurrentStep("confirmation");
    }
  };

  // Dentro del modal de recolha, actualizar el formulario:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validatePickupForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Recopilar datos del formulario
      const payload = {
        tipo: "ropa",
        metodo: "recolha",
        nome: `${pickupPhone} - ${pickupAddress}`, // mejorado
        estado: "Pendente",
        fecha: new Date().toISOString(),
        detalles: `Peso: ${pickupWeight}kg, Dia: ${pickupDay}`,
        totalItems: Number(pickupWeight) || 0,
        recyclingPercentage: 0,
        repairPercentage: 0,
        cotton: 0,
        polyester: 0,
        wool: 0,
        other: 0,
        co2Saved: 0,
        waterSaved: 0,
        naturalResources: 0,
        aiConfidence: null,
        methodology: "manual",
        uncertainty: "±25%",
        region: "Vila Real",
        verified: false,
        imageUrls: null,
        trackingState: "pendiente",
        adminUserId: null,
        classification: null,
        destination: null,
        certificateHash: null,
        certificateDate: null
      };

      console.log("Enviando payload:", payload);
      
      // Enviar al backend
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del servidor:", response);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al procesar la solicitud');
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);
      
      setFullBackendResponse(data);
      setGeneratedCode(data?.data?.tracking || "No disponible");
      setOpenModal(false);
      setCurrentStep("confirmation");
      
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para limpiar errores cuando el usuario escribe
  const clearFieldError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Actualizar el JSX del formulario con validación:
  const renderPickupForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Número de teléfono</label>
        <input 
          type="tel" 
          value={pickupPhone} 
          onChange={(e) => {
            setPickupPhone(e.target.value);
            clearFieldError('phone');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validationErrors.phone 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="+351 123 456 789"
        />
        {validationErrors.phone && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Endereço completo</label>
        <input 
          type="text" 
          value={pickupAddress} 
          onChange={(e) => {
            setPickupAddress(e.target.value);
            clearFieldError('address');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validationErrors.address 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Rua, número, código postal, cidade"
        />
        {validationErrors.address && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Peso estimado (kg)</label>
        <input 
          type="number" 
          value={pickupWeight} 
          onChange={(e) => {
            setPickupWeight(e.target.value);
            clearFieldError('weight');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validationErrors.weight 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Mínimo 10kg"
          min="10"
          max="100"
        />
        {validationErrors.weight && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.weight}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Recolha disponível para quantidades superiores a 10kg</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dia pretendido</label>
        <input 
          type="date" 
          value={pickupDay} 
          onChange={(e) => {
            setPickupDay(e.target.value);
            clearFieldError('day');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            validationErrors.day 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          min={new Date().toISOString().split('T')[0]}
        />
        {validationErrors.day && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.day}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Recolha às terças e quintas, entre 9h e 18h</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <button 
            type="button" 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </DialogClose>
        <button 
          type="submit" 
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </>
          ) : (
            'Confirmar Recolha'
          )}
        </button>
      </DialogFooter>
    </form>
  );

  // Función para validar antes de avanzar a siguiente paso
  const validateStepNavigation = (fromStep: string, toStep: string): boolean => {
    switch (fromStep) {
      case "start":
        // No hay validación necesaria para empezar
        return true;
        
      case "method":
        // No hay validación necesaria para elegir método
        return true;
        
      case "map":
        // Validar que se seleccionó un punto de recolha
        if (selected === null) {
          setError("Por favor, selecione um ponto de recolha antes de continuar");
          return false;
        }
        return true;
        
      case "confirmation":
        // Validar que se generó el código
        if (!generatedCode || generatedCode === "null") {
          setError("Erro na confirmação. Tente novamente.");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  // Función mejorada para navegar entre pasos
  const navigateToStep = (newStep: string) => {
    const currentStepIndex = steps.indexOf(currentStep);
    const newStepIndex = steps.indexOf(newStep);
    
    // Si vamos hacia adelante, validar
    if (newStepIndex > currentStepIndex) {
      if (!validateStepNavigation(currentStep, newStep)) {
        return; // No proceder si la validación falla
      }
    }
    
    // Limpiar errores al navegar
    setError(null);
    setCurrentStep(newStep);
  };

  // Actualizar botones de navegación para usar la nueva función
  const updateNavigationButtons = () => {
    // En lugar de setCurrentStep("method"), usar:
    // navigateToStep("method")
    
    // En lugar de setCurrentStep("map"), usar:
    // navigateToStep("map")
    
    // etc.
  };

  // Validación adicional para puntos de recolha
  const validateMapSelection = () => {
    if (selected === null) {
      setError("Selecione um ponto de recolha para continuar");
      return false;
    }
    
    // Validar que el punto seleccionado es válido
    const points = [
      { name: "Centro de Vila Real", address: "Rua Central, 123" },
      { name: "Biblioteca Municipal", address: "Av. da Cultura, 456" },
      { name: "Mercado Municipal", address: "Praça do Mercado, 789" }
    ];
    
    if (selected >= points.length) {
      setError("Ponto de recolha inválido. Selecione um ponto válido.");
      return false;
    }
    
    return true;
  };

  // Función para validar antes de confirmar entrega
  const validateConfirmDelivery = () => {
    if (!validateMapSelection()) {
      return false;
    }
    
    // Aquí podríamos añadir más validaciones si es necesario
    return true;
  };

  // Actualizar la navegación en el JSX
  const renderStepNavigation = () => {
    return (
      <div className="flex justify-between items-center mt-6">
        {/* Botón de retroceso */}
        <button 
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        
        {/* Indicador de progreso */}
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                steps.indexOf(currentStep) >= index
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* Botón de avance (si aplica) */}
        {currentStep !== "tracking" && (
          <button 
            onClick={() => {
              const currentIndex = steps.indexOf(currentStep);
              const nextStep = steps[currentIndex + 1];
              if (nextStep) {
                navigateToStep(nextStep);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentStep === "map" && selected === null}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Mostrar errores de validación de forma más prominente
  const renderValidationError = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
        <button 
          onClick={() => setError(null)}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Paso 1: Bienvenida
  if (currentStep === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Contribuir Roupas</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg mb-6">
            <h3 className="font-bold text-gray-800 mb-4">O que você ganha:</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Leaf className="w-5 h-5 text-green-600" /> Impacto ambiental verificado</li>
              <li className="flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600" /> Certificado blockchain</li>
              <li className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" /> NFT exclusivo de contribuição</li>
              <li className="flex items-center gap-2"><Heart className="w-5 h-5 text-pink-600" /> Segunda vida para suas roupas</li>
            </ul>
          </div>
          <button onClick={() => setCurrentStep("method")}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            Começar Contribuição
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Método
  if (currentStep === "method") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-4 pb-24">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Como Entregar?</h1>
          </div>
          <div className="space-y-4">
            <button onClick={() => setCurrentStep("map")}
              className="w-full bg-orange-100 text-orange-800 py-4 rounded-xl font-bold shadow hover:bg-orange-200 mb-2">
              Ir ao Ponto de Recolha
            </button>
            <button onClick={() => setOpenModal(true)}
              className="w-full bg-teal-100 text-teal-800 py-4 rounded-xl font-bold shadow hover:bg-teal-200">
              Solicitar Recolha em Casa
            </button>
          </div>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recolha ao domicílio</DialogTitle>
              <DialogDescription>
                A recolha ao domicílio só está disponível para quantidades superiores a 10kg.<br />
                A equipa INFINITO passará por Vila Real às terças e quintas, entre as 9h e as 18h.
              </DialogDescription>
            </DialogHeader>
            {renderPickupForm()}
          </DialogContent>
        </Dialog>
        <BottomNavigationMenu />
      </div>
    );
  }

  // Paso 3: Mapa (Google Maps interactivo con puntos de recolha)
  if (currentStep === "map") {
    // Mock points for Vila Real
    const points = [
      { name: "Campanha", lat: 41.1511, lng: -7.8029 },
      { name: "Cumeira", lat: 41.3086, lng: -7.7461 },
      { name: "Avenida Carvalho Araújo (Centro)", lat: 41.3006, lng: -7.7441 }
    ];
    const center = selected !== null ? points[selected] : { lat: 41.3006, lng: -7.7441 };
    // OpenStreetMap embed URL
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-7.7500,41.2900,-7.7200,41.3100&layer=mapnik&marker=${center.lat},${center.lng}`;
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Pontos de Recolha</h1>
          </div>
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg text-center">
            <div className="mb-3 text-gray-700 font-medium">Selecione um ponto de recolha:</div>
            <div className="space-y-2 mb-4">
              {points.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full py-3 rounded-xl font-semibold border transition-all ${selected===i ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-orange-100'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            {/* OpenStreetMap iframe centered on selected point with marker */}
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-2">
              <iframe
                title="Mapa Pontos de Recolha"
                width="100%"
                height="220"
                frameBorder="0"
                style={{ border: 0 }}
                src={mapSrc}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <button
            onClick={() => selected!==null && setCurrentStep("confirmation")}
            disabled={selected===null}
            className={`w-full py-4 rounded-xl font-bold shadow transition-all ${selected!==null ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            Confirmar Entrega
          </button>
        </div>
      </div>
    );
  }

  // Paso 4: Confirmación
  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 pb-24">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Contribuição Registrada!</h1>
          </div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-gray-600">Sua contribuição foi certificada na blockchain</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg text-center">
            <p className="text-sm text-gray-600 mb-2">Código da Contribuição:</p>
            <p className="text-lg font-mono font-bold text-gray-800 bg-gray-100 p-3 rounded-lg">
              {(!generatedCode || generatedCode === "null" || generatedCode === undefined) ? "No disponible" : generatedCode}
            </p>
            {/* Log visual de depuración */}
            {fullBackendResponse && (
              <pre className="bg-yellow-50 text-xs text-yellow-900 p-2 mt-2 rounded border border-yellow-200 overflow-x-auto max-h-32">
                {JSON.stringify(fullBackendResponse, null, 2)}
              </pre>
            )}
            {generatedCode === "null" && (
              <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-2 text-center font-medium">
                Advertencia: El backend devolvió el string "null" como código de contribución. Por favor, revisa la lógica de generación en el backend.
              </div>
            )}
          </div>
          <button onClick={() => setCurrentStep("tracking")}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 mb-3">
            <Package className="w-5 h-5" />
            Ver no Passaporte
          </button>
          <button onClick={() => setCurrentStep("start")}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-medium">
            Fazer Nova Contribuição
          </button>
        </div>
        <BottomNavigationMenu />
      </div>
    );
  }

  // Paso 5: Tracking (placeholder)
  if (currentStep === "tracking") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={goBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Minhas Contribuições</h1>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg text-center">
            <p className="text-gray-600">(Dashboard de tracking em breve)</p>
          </div>
          <button onClick={() => router.push("/profile/passport")}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg">
            Ver Passaporte Completo
          </button>
        </div>
      </div>
    );
  }

  return null;
}