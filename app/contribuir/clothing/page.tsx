"use client";
import React, { useState } from "react";
import { Heart, ArrowLeft, ArrowRight, CheckCircle2, Package, Download, Share2, Sparkles, Leaf, Shield, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from "@/components/BottomNavigationMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import InfinitoLayout from "@/components/InfinitoLayout";
import { useTranslation } from '../../../hooks/useTranslation';

const steps = [
  "start",
  "method",
  "map",
  "confirmation",
  "decision", // Nuevo paso para elegir vender o doar
  "tracking"
];

export default function ContributeClothingPage() {
  // Declarar todos los hooks al inicio
  const [currentStep, setCurrentStep] = useState("start");
  const [openModal, setOpenModal] = useState(false); // Para el modal de método
  const [selected, setSelected] = useState<number | null>(null); // Para el paso del mapa
  const router = useRouter();
  const { t } = useTranslation();
  // Estado para los datos del formulario de recolha
  const [pickupPhone, setPickupPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupWeight, setPickupWeight] = useState("");
  const [pickupDay, setPickupDay] = useState("");
  const [pickupItems, setPickupItems] = useState("");
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
      errors.phone = "Phone number is required";
    } else if (!/^[+]?[0-9\s\-\(\)]{9,15}$/.test(pickupPhone.trim())) {
      errors.phone = "Invalid phone format";
    }
    
    // Validar dirección
    if (!pickupAddress.trim()) {
      errors.address = "Address is required";
    } else if (pickupAddress.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }
    
    // Validar peso
    if (!pickupWeight.trim()) {
      errors.weight = "Weight is required";
    } else {
      const weight = parseFloat(pickupWeight);
      if (isNaN(weight) || weight <= 0) {
        errors.weight = "Weight must be a positive number";
      } else if (weight < 10) {
        errors.weight = "Minimum pickup weight is 10kg";
      } else if (weight > 100) {
        errors.weight = "Maximum pickup weight is 100kg";
      }
    }
    
    // Validar dia
    if (!pickupDay.trim()) {
      errors.day = "Pickup day is required";
    } else {
      const selectedDate = new Date(pickupDay);
      const today = new Date();
      const dayOfWeek = selectedDate.getDay();
      
      if (selectedDate < today) {
        errors.day = "Date must be in the future";
      } else if (dayOfWeek !== 2 && dayOfWeek !== 4) { // Terça = 2, Quinta = 4
        errors.day = "Pickup only on Tuesdays and Thursdays";
      }
    }

    // Validar número de items
    if (!pickupItems.trim()) {
      errors.items = "Number of items is required";
    } else {
      const items = parseInt(pickupItems);
      if (isNaN(items) || items <= 0) {
        errors.items = "Number of items must be a positive number";
      } else if (items > 100) {
        errors.items = "Maximum number of items is 100";
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
    console.log("Creando contribución con payload:", payload);
    
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Respuesta del servidor:", res.status, res.statusText);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        setError(`Error del servidor: ${res.status} - ${errorData.message || 'Error desconocido'}`);
        return;
      }
      
      const data = await res.json();
      console.log("Datos de respuesta completos:", JSON.stringify(data, null, 2));
      
      // Extraer el código de tracking correctamente
      const trackingCode = data?.data?.tracking || data?.tracking;
      console.log("Código de tracking extraído:", trackingCode);
      
      if (!trackingCode || trackingCode === "null" || trackingCode === undefined) {
        console.error("No se pudo extraer el código de tracking de la respuesta:", data);
        setError("No se pudo generar el código de contribución. Inténtalo de nuevo.");
        setGeneratedCode(null);
      } else {
        // Guardar en localStorage para el flujo de venta
        localStorage.setItem('contributionTracking', trackingCode);
        console.log("Código guardado en localStorage:", trackingCode);
        
        setGeneratedCode(trackingCode);
        setFullBackendResponse(data);
        setCurrentStep("confirmation");
        console.log("Contribución creada exitosamente, código:", trackingCode);
      }
    } catch (error) {
      console.error("Error al crear contribución:", error);
      setError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
    }
  };

  // Función para manejar el envío del formulario de pickup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePickupForm()) {
      return;
    }

    const pickupPayload = {
      tipo: "clothing",
      nome: `${pickupPhone} - ${pickupAddress}`,
      totalItems: Number(pickupItems) || 0,
      detalles: `Peso: ${pickupWeight}kg, Dia: ${pickupDay}, Items: ${pickupItems}`,
      estado: "pending"
    };

    console.log("Enviando formulario de pickup con payload:", pickupPayload);

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pickupPayload),
      });

      console.log("Respuesta del servidor (pickup):", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor (pickup):", errorData);
        setError(`Error del servidor: ${response.status} - ${errorData.message || 'Error desconocido'}`);
        return;
      }

      const data = await response.json();
      console.log("Datos de respuesta completos (pickup):", JSON.stringify(data, null, 2));
      
      // Extraer el código de tracking correctamente
      const trackingCode = data?.data?.tracking || data?.tracking || "No disponible";
      console.log("Código de tracking extraído (pickup):", trackingCode);
      
      // Guardar en localStorage para el flujo de venta
      if (trackingCode && trackingCode !== "No disponible") {
        localStorage.setItem('contributionTracking', trackingCode);
        console.log("Código guardado en localStorage (pickup):", trackingCode);
      }
      
      setFullBackendResponse(data);
      setGeneratedCode(trackingCode);
      console.log("Estado generatedCode actualizado (pickup):", trackingCode);
      setOpenModal(false);
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Error al enviar formulario de pickup:", error);
      setError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
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

  // Traducción de textos del formulario de recogida a domicilio:
  const pickupFormLabels = {
	title: 'Home Pickup',
	description: 'Home pickup is only available for quantities over 10kg. The INFINITO team will be in Vila Real on Tuesdays and Thursdays, from 9am to 6pm.',
	phone: 'Phone number',
	phonePlaceholder: '+351 123 456 789',
	address: 'Full address',
	addressPlaceholder: 'Street, number, postal code, city',
	weight: 'Estimated weight (kg)',
	weightPlaceholder: 'Minimum 10kg',
	weightMessage: 'Pickup available for quantities over 10kg',
	day: 'Desired pickup day',
	dayPlaceholder: 'dd/mm/yyyy',
	dayMessage: 'Pickup on Tuesdays and Thursdays, from 9am to 6pm',
	confirm: 'Confirm Pickup',
	cancel: 'Cancel',
	processing: 'Processing...'
};

  // Actualizar el JSX del formulario con validación:
  const renderPickupForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Phone number</label>
        <input
          type="tel"
          value={pickupPhone}
          onChange={(e) => {
            setPickupPhone(e.target.value);
            clearFieldError('phone');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          placeholder="+351 123 456 789"
        />
        {validationErrors.phone && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Full address</label>
        <input
          type="text"
          value={pickupAddress}
          onChange={(e) => {
            setPickupAddress(e.target.value);
            clearFieldError('address');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          placeholder="Street, number, postal code, city"
        />
        {validationErrors.address && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Number of items</label>
        <input
          type="number"
          value={pickupItems}
          onChange={(e) => {
            setPickupItems(e.target.value);
            clearFieldError('items');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.items ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          placeholder="How many pieces of clothing?"
          min="1"
          max="100"
        />
        {validationErrors.items && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.items}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Estimated weight (kg)</label>
        <input
          type="number"
          value={pickupWeight}
          onChange={(e) => {
            setPickupWeight(e.target.value);
            clearFieldError('weight');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.weight ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          placeholder="Minimum 10kg"
          min="10"
          max="100"
        />
        {validationErrors.weight && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.weight}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Pickup available for quantities over 10kg</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Desired pickup day</label>
        <input
          type="date"
          value={pickupDay}
          onChange={(e) => {
            setPickupDay(e.target.value);
            clearFieldError('day');
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${validationErrors.day ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
          min={new Date().toISOString().split('T')[0]}
          placeholder="dd/mm/yyyy"
        />
        {validationErrors.day && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.day}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Pickup on Tuesdays and Thursdays, from 9am to 6pm</p>
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
            Cancel
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
              Processing...
            </>
          ) : (
            'Confirm Pickup'
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
          setError(t('selectPickupPointError'));
          return false;
        }
        return true;
        
      case "confirmation":
        // Validar que se generó el código
        if (!generatedCode || generatedCode === "null") {
          setError(t('confirmationError'));
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
      setError(t('selectPickupPointError'));
      return false;
    }
    
    // Validar que el punto seleccionado es válido
    const points = [
      { name: t('vilaRealCenterPoint'), address: t('vilaRealCenterAddress') },
      { name: t('vilaRealLibraryPoint'), address: t('vilaRealLibraryAddress') },
      { name: t('vilaRealMarketPoint'), address: t('vilaRealMarketAddress') }
    ];
    
    if (selected >= points.length) {
      setError(t('invalidPickupPointError'));
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
        <BackButton />
        
        {/* Indicador de progreso */}
        <div className="flex-1 mx-4 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((steps.indexOf(currentStep)+1)/steps.length)*100}%` }}
          />
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
            {t('continueButton')}
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

  const BackButton = () => {
    return (
      <button type="button" onClick={goBack} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Back</button>
    );
  };

  // Paso 1: Bienvenida
  if (currentStep === "start") {
	return (
		<InfinitoLayout
			title=""
			subtitle=""
			showHeader={true}
			showBackButton={true}
			showBottomMenu={true}
			showLogo={false}
			userName="User"
		>
			<div className="flex flex-col items-center justify-start bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center min-h-screen pt-10" style={{ minHeight: 'calc(100vh - 96px)' }}>
				<div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg max-w-md w-full animate-float-card">
					<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-white/40" style={{ backgroundColor: '#D42D66' }}>
						<Heart className="w-10 h-10 text-white" />
					</div>
					<h1 className="font-bold text-2xl text-gray-800 mb-2 text-center">Contribute Clothes</h1>
					<p className="text-gray-600 text-base mb-6 text-center">Give a new life to your textiles and receive certified impact</p>
					<ul className="space-y-2 mb-6 w-full">
						<li className="flex items-center gap-2 text-gray-700"><Leaf className="w-5 h-5 text-green-600" /> Verified environmental impact</li>
						<li className="flex items-center gap-2 text-gray-700"><Shield className="w-5 h-5 text-blue-600" /> Blockchain certificate</li>
						<li className="flex items-center gap-2 text-gray-700"><Sparkles className="w-5 h-5 text-purple-600" /> Exclusive contribution NFT</li>
						<li className="flex items-center gap-2 text-gray-700"><Heart className="w-5 h-5 text-pink-600" /> Second life for your clothes</li>
					</ul>
					<button onClick={() => setCurrentStep("method")} className="mt-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all text-lg tracking-wide">
						Start Contribution
					</button>
				</div>
				{/* Círculos animados de fondo estilo INFINITO */}
				<div className="absolute top-10 left-10 w-4 h-4 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#D42D66" }}></div>
				<div className="absolute bottom-20 right-16 w-3 h-3 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
				<div className="absolute top-1/2 right-6 w-3 h-3 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
				<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#689610" }}></div>
			</div>
		</InfinitoLayout>
	);
}

  // Paso 2: Método de entrega
  if (currentStep === "method") {
	return (
		<InfinitoLayout
			title="How to deliver?"
			subtitle=""
			showHeader={true}
			showBackButton={true}
			showBottomMenu={true}
			showLogo={true}
			userName="User"
		>
			<div className="flex-1 w-full flex flex-col items-center justify-start pt-10 overflow-y-auto pb-40 bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-0">
					{/* Card Pickup Point */}
					<div className="group bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden" style={{ filter: 'drop-shadow(0 8px 24px #68961022)' }}>
						<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-white/40" style={{ backgroundColor: '#689610' }}>
							<Package className="w-10 h-10 text-white" />
						</div>
						<h2 className="font-bold text-xl text-gray-800 mb-2">Go to Pickup Point</h2>
						<p className="text-gray-600 text-sm mb-6 text-center">Deliver at a certified point</p>
						<button
							onClick={() => setCurrentStep("map")}
							className="mt-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all text-lg tracking-wide"
						>
							Select
						</button>
					</div>
					{/* Card Home Pickup */}
					<div className="group bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden" style={{ filter: 'drop-shadow(0 8px 24px #43B2D222)' }}>
						<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-white/40" style={{ backgroundColor: '#43B2D2' }}>
							<Package className="w-10 h-10 text-white" />
						</div>
						<h2 className="font-bold text-xl text-gray-800 mb-2">Request Home Pickup</h2>
						<p className="text-gray-600 text-sm mb-6 text-center">We pick up at your address (min. 10kg)</p>
						<button
							onClick={() => setOpenModal(true)}
							className="mt-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all text-lg tracking-wide"
						>
							Select
						</button>
					</div>
				</div>
				{/* Modal Home Pickup */}
				<Dialog open={openModal} onOpenChange={setOpenModal}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Home Pickup</DialogTitle>
							<DialogDescription>Home pickup is only available for quantities over 10kg. The INFINITO team will be in Vila Real on Tuesdays and Thursdays, from 9am to 6pm.</DialogDescription>
						</DialogHeader>
						{renderPickupForm()}
					</DialogContent>
				</Dialog>
				{/* Círculos animados de fondo estilo INFINITO */}
				<div className="absolute top-10 left-10 w-4 h-4 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#43B2D2" }}></div>
				<div className="absolute bottom-20 right-16 w-3 h-3 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
				<div className="absolute top-1/2 right-6 w-3 h-3 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
				<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#689610" }}></div>
			</div>
		</InfinitoLayout>
	);
}

  // Paso 3: Mapa (Google Maps interactivo con puntos de recolha)
  if (currentStep === "map") {
    // Mock points for Vila Real
    const points = [
      { name: "Vila Real Center", lat: 41.1511, lng: -7.8029 },
      { name: "Municipal Library", lat: 41.3086, lng: -7.7461 },
      { name: "Municipal Market", lat: 41.3006, lng: -7.7441 }
    ];
    const center = selected !== null ? points[selected] : { lat: 41.3006, lng: -7.7441 };
    // OpenStreetMap embed URL
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-7.7500,41.2900,-7.7200,41.3100&layer=mapnik&marker=${center.lat},${center.lng}`;
    return (
      <InfinitoLayout
        title="Pickup Points"
        subtitle=""
        showHeader={true}
        showBackButton={true}
        showBottomMenu={true}
        showLogo={true}
        userName="User"
      >
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4 overflow-y-auto">
          <div className="max-w-sm mx-auto mt-0">
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg text-center">
              <div className="mb-3 text-gray-700 font-medium">Select a pickup point:</div>
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
                  title="Pickup Points Map"
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
              onClick={async () => {
                if (selected !== null) {
                  const points = [
                    { name: "Vila Real Center", lat: 41.1511, lng: -7.8029 },
                    { name: "Municipal Library", lat: 41.3086, lng: -7.7461 },
                    { name: "Municipal Market", lat: 41.3006, lng: -7.7441 }
                  ];
                  const selectedPoint = points[selected];
                  
                  const payload = {
                    tipo: "clothing",
                    nome: `Delivery to ${selectedPoint.name}`,
                    totalItems: 5, // Default value for map delivery
                    detalles: `Pickup point: ${selectedPoint.name} (${selectedPoint.lat}, ${selectedPoint.lng})`,
                    estado: "pending"
                  };
                  
                  await handleCreateContribution(payload);
                }
              }}
              disabled={selected===null}
              className={`w-full py-4 rounded-xl font-bold shadow transition-all ${selected!==null ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Confirm Delivery
            </button>
          </div>
        </div>
      </InfinitoLayout>
    );
  }

  // Paso 4: Confirmación
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
							{(!generatedCode || generatedCode === "null" || generatedCode === undefined) ? "Not available" : generatedCode}
						</p>
						<p className="text-xs text-gray-500 mt-2">Save this code for tracking your contribution</p>
					</div>
					<button onClick={() => setCurrentStep("decision")}
						className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 mb-3">
						Continue
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

  // Nuevo paso: Decisión vender/doar
  if (currentStep === "decision") {
	return (
		<InfinitoLayout
			title={t('chooseClothesDestination')}
			subtitle={t('donateOrSellMessage')}
			showHeader={true}
			showBackButton={true}
			showBottomMenu={true}
			showLogo={true}
			userName="User"
		>
			<div className="min-h-screen bg-[#EDE4DA] bg-[url('/fondo.png')] bg-cover bg-center flex flex-col items-center justify-center py-10 relative">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
					{/* Card Donar */}
					<div className="group bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden" style={{ filter: 'drop-shadow(0 8px 24px #68961022)' }}>
						<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-white/40" style={{ backgroundColor: '#689610' }}>
							<Heart className="w-10 h-10 text-white" />
						</div>
						<h2 className="font-bold text-xl text-gray-800 mb-2">{t('donateFree')}</h2>
						<p className="text-gray-600 text-sm mb-6 text-center">{t('donateCardDesc')}</p>
						<button
							onClick={() => setCurrentStep("tracking")}
							className="mt-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all text-lg tracking-wide"
						>
							{t('selectButton')}
						</button>
					</div>
					{/* Card Vender */}
					<div className="group bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden" style={{ filter: 'drop-shadow(0 8px 24px #F4780222)' }}>
						<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 border border-white/40" style={{ backgroundColor: '#F47802' }}>
							<Package className="w-10 h-10 text-white" />
						</div>
						<h2 className="font-bold text-xl text-gray-800 mb-2">{t('sellClothes')}</h2>
						<p className="text-gray-600 text-sm mb-6 text-center">{t('sellCardDesc')}</p>
						<button
							onClick={() => setCurrentStep("tracking")}
							className="mt-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 transition-all text-lg tracking-wide"
						>
							{t('selectButton')}
						</button>
					</div>
				</div>
				{/* Círculos animados de fondo estilo INFINITO */}
				<div className="absolute top-10 left-10 w-4 h-4 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#689610" }}></div>
				<div className="absolute bottom-20 right-16 w-3 h-3 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
				<div className="absolute top-1/2 right-6 w-3 h-3 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
				<div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#D42D66" }}></div>
			</div>
		</InfinitoLayout>
	);
}

  // Paso 5: Tracking (placeholder)
  if (currentStep === "tracking") {
    return (
      <InfinitoLayout
        title={t('contributeClothing')}
        subtitle={t('giveNewLife')}
        showHeader={true}
        showBackButton={true}
        showBottomMenu={true}
        showLogo={true}
        userName="Utilizador"
      >
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
          <div className="max-w-sm mx-auto">
            <div className="flex items-center mb-6">
              <h1 className="text-xl font-bold text-gray-800">{t('myContributions')}</h1>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow-lg text-center">
              <p className="text-gray-600">{t('trackingDashboardMessage')}</p>
            </div>
            <button onClick={() => router.push("/profile/passport")}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg">
              {t('viewFullPassport')}
            </button>
          </div>
        </div>
      </InfinitoLayout>
    );
  }

  return null;
}