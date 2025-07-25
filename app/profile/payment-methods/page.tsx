"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Building2, Smartphone, Bitcoin, Plus, Edit, Trash2, Shield, Star, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { PaymentMethodSelector } from "@/components/ui/payment-method-selector";
import { useLanguage } from "../../../components/theme-provider";
import BottomNavigationMenu from "../../../components/BottomNavigationMenu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Colores INFINITO específicos para cada método
const availablePaymentMethods = [
  {
    id: "card",
    name: "Cartão",
    description: "Visa, Mastercard",
    icon: CreditCard,
    logos: ["💳"],
    color: "#3E88FF", // Azul INFINITO
    iconColor: "text-white",
    popular: true,
    fees: "2.9% + €0.30",
    processing: "Instantâneo",
    security: "3DS, PCI DSS"
  },
  {
    id: "transfer",
    name: "Transferência",
    description: "Nacional/Euro",
    icon: Building2,
    logos: ["🏦"],
    color: "#689610", // Verde INFINITO
    iconColor: "text-white",
    popular: false,
    fees: "€0.00",
    processing: "1-2 dias",
    security: "Encriptado"
  },
  {
    id: "mbway",
    name: "MB WAY",
    description: "Telemóvel",
    icon: Smartphone,
    logos: ["📱"],
    color: "#F47802", // Naranja INFINITO
    iconColor: "text-white",
    popular: true,
    fees: "€0.00",
    processing: "Instantâneo",
    security: "Biometria"
  },
  {
    id: "wise",
    name: "Wise",
    description: "Internacional",
    icon: Building2,
    logos: ["🌍"],
    color: "#813684", // Morado INFINITO
    iconColor: "text-white",
    popular: false,
    fees: "0.5-1.5%",
    processing: "1-2 dias",
    security: "Regulamentado"
  },
  {
    id: "binance",
    name: "Binance",
    description: "Cripto",
    icon: Bitcoin,
    logos: ["🟡"],
    color: "#EAB308", // Amarillo INFINITO
    iconColor: "text-white",
    popular: false,
    fees: "0.1%",
    processing: "5-15 min",
    security: "Blockchain"
  },
  {
    id: "usdc-stellar",
    name: "USDC Stellar",
    description: "Rede Stellar",
    icon: Bitcoin,
    logos: ["⭐"],
    color: "#43B2D2", // Celeste INFINITO
    iconColor: "text-white",
    popular: false,
    fees: "€0.01",
    processing: "3-5 seg",
    security: "Stellar"
  },
  {
    id: "revolut",
    name: "Revolut",
    description: "Instantâneo",
    icon: Building2,
    logos: ["💳"],
    color: "#689610", // Verde INFINITO
    iconColor: "text-white",
    popular: true,
    fees: "€0.00",
    processing: "Instantâneo",
    security: "Encriptado"
  },
];

const translations = {
  pt: {
    title: "Métodos de Pagamento",
    saved: "Guardados",
    add: "Adicionar Método",
    available: "Disponíveis",
    noSaved: "Nenhum método guardado",
    security: "Segurança",
    securityDesc: "Todos os dados são encriptados e protegidos com os mais altos padrões de segurança. Nunca partilhamos as suas informações.",
    default: "Predefinido",
    popular: "Popular",
    editSoon: "Edição brevemente",
    addNew: "Adicionar",
    back: "Voltar",
    fees: "Taxas",
    processing: "Processamento",
    securityLevel: "Segurança",
    setDefault: "Definir como predefinido",
    showDetails: "Mostrar detalhes",
    hideDetails: "Ocultar detalhes",
    totalMethods: "Total de métodos",
    activeMethods: "Métodos ativos",
    stats: "Estatísticas",
    manageNotifications: "Gerir notificações",
    autoSave: "Guardar automaticamente",
    biometricAuth: "Autenticação biométrica"
  },
  en: {
    title: "Payment Methods",
    saved: "Saved",
    add: "Add Method",
    available: "Available",
    noSaved: "No methods saved",
    security: "Security",
    securityDesc: "All data is encrypted and protected with the highest security standards. We never share your information.",
    default: "Default",
    popular: "Popular",
    editSoon: "Edit coming soon",
    addNew: "Add",
    back: "Back",
    fees: "Fees",
    processing: "Processing",
    securityLevel: "Security",
    setDefault: "Set as default",
    showDetails: "Show details",
    hideDetails: "Hide details",
    totalMethods: "Total methods",
    activeMethods: "Active methods",
    stats: "Statistics",
    manageNotifications: "Manage notifications",
    autoSave: "Auto-save",
    biometricAuth: "Biometric authentication"
  },
  es: {
    title: "Métodos de Pago",
    saved: "Guardados",
    add: "Agregar Método",
    available: "Disponibles",
    noSaved: "Ningún método guardado",
    security: "Seguridad",
    securityDesc: "Todos los datos están encriptados y protegidos con los más altos estándares de seguridad. Nunca compartimos tu información.",
    default: "Predeterminado",
    popular: "Popular",
    editSoon: "Edición próximamente",
    addNew: "Agregar",
    back: "Volver",
    fees: "Tarifas",
    processing: "Procesamiento",
    securityLevel: "Seguridad",
    setDefault: "Establecer como predeterminado",
    showDetails: "Mostrar detalles",
    hideDetails: "Ocultar detalles",
    totalMethods: "Total de métodos",
    activeMethods: "Métodos activos",
    stats: "Estadísticas",
    manageNotifications: "Gestionar notificaciones",
    autoSave: "Guardar automáticamente",
    biometricAuth: "Autenticación biométrica"
  }
};

// Definir tipo para métodos guardados
interface PaymentMethod {
	id: string;
	name: string;
	description: string;
	icon: any;
	details: string;
	isDefault?: boolean;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [hydrated, setHydrated] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([
    {
      id: "mbway",
      name: "MB WAY",
      description: "Telemóvel",
      icon: Smartphone,
      details: "+351 912 ••• 678",
      isDefault: true,
    },
    {
      id: "usdc-stellar",
      name: "USDC Stellar",
      description: "Rede Stellar",
      icon: Bitcoin,
      details: "GABCD•••STELLAR",
    },
    {
      id: "card",
      name: "Cartão",
      description: "Visa",
      icon: CreditCard,
      details: "•••• •••• •••• 5678",
    },
  ]);

  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return null;

  const handleAddPaymentMethod = (methodId: string) => {
    const method = availablePaymentMethods.find((m) => m.id === methodId);
    if (!method) return;
    
    // Verificar se já existe
    const exists = savedMethods.some(m => m.id === methodId);
    if (exists) return;
    
    setSavedMethods((prev) => [
      ...prev,
      {
        id: method.id,
        name: method.name,
        description: method.description,
        icon: method.icon,
        details: method.id === "mbway" ? "+351 900 ••• 000" : 
                method.id === "usdc-stellar" ? "GEXAMPLE•••STELLAR" : 
                method.id === "binance" ? "binance_•••" : 
                method.id === "card" ? "•••• •••• •••• 5678" : 
                method.id === "revolut" ? "revolut_•••" : 
                method.id === "transfer" ? "PT50•••9015" : 
                method.id === "wise" ? "wise_•••" : 
                method.id === "moneygram" ? "money_•••" : "-",
      },
    ]);
  };

  const handleEditMethod = (methodId: string) => {
    alert(t.editSoon);
  };

  const handleDeleteMethod = (methodId: string) => {
    setSavedMethods(savedMethods.filter((method) => method.id !== methodId));
  };

  const handleSetDefault = (methodId: string) => {
    setSavedMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  const toggleDetails = (methodId: string) => {
    setShowDetails(showDetails === methodId ? null : methodId);
  };

  const getMethodDetails = (methodId: string) => {
    return availablePaymentMethods.find(m => m.id === methodId);
  };

  const stats = {
    total: savedMethods.length,
    active: savedMethods.length,
    default: savedMethods.filter(m => m.isDefault).length
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow-card {
          0%, 100% { box-shadow: 0 0 20px rgba(67,178,210,0.3); }
          50% { box-shadow: 0 0 30px rgba(67,178,210,0.6); }
        }
        
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes pulse-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div 
        className="min-h-screen font-raleway relative pb-24"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        {/* Header futurista com glassmorphism */}
        <div 
          className="bg-white/20 backdrop-blur-md border-b border-white/30 px-4 py-3 sticky top-0 z-10"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
        >
          <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
            <button 
              onClick={() => router.back()} 
              className="w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            </button>
            <h1 className="font-bold text-base md:text-lg text-gray-800 tracking-wider">{t.title}</h1>
            <div className="w-9 md:w-10"></div>
          </div>
        </div>

        <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl p-4 md:p-6">
          
          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-600">{t.totalMethods}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">{t.activeMethods}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.default}</div>
                <div className="text-sm text-gray-600">{t.default}</div>
              </CardContent>
            </Card>
          </div>

          {/* Configurações */}
          <div 
            className="bg-white/25 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 border border-white/30"
            style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))" }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Configurações</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{t.autoSave}</p>
                  <p className="text-sm text-gray-600">Salvar dados automaticamente</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{t.biometricAuth}</p>
                  <p className="text-sm text-gray-600">Usar biometria para confirmações</p>
                </div>
                <Switch checked={biometricAuth} onCheckedChange={setBiometricAuth} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{t.manageNotifications}</p>
                  <p className="text-sm text-gray-600">Receber notificações de pagamento</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </div>

          {/* Métodos Guardados */}
          <div 
            className="bg-white/25 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 border border-white/30 relative overflow-hidden"
            style={{ 
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
              animation: "float-card 4s ease-in-out infinite"
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40"
                style={{ 
                  backgroundColor: "#43B2D2",
                  animation: "pulse-icon 2s ease-in-out infinite"
                }}
              >
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{t.saved}</h2>
            </div>

            {savedMethods.length === 0 ? (
              <div 
                className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/40"
                  style={{ backgroundColor: "#D42D66" }}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{t.noSaved}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  const colors = ["#F47802", "#43B2D2", "#689610", "#D42D66"];
                  const currentColor = colors[index % colors.length];
                  const methodDetails = getMethodDetails(method.id);
                  
                  return (
                    <div key={method.id} className="space-y-2">
                      <div
                        className="group bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                        style={{ 
                          filter: `drop-shadow(0 4px 8px ${currentColor}20)`,
                          animation: "float-card 4s ease-in-out infinite"
                        }}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40"
                              style={{ backgroundColor: currentColor }}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-800 tracking-wide text-sm">{method.name}</h3>
                                {method.isDefault && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {t.default}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 font-medium">{method.details}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleDetails(method.id)}
                              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
                              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                            >
                              {showDetails === method.id ? <EyeOff className="w-3 h-3 text-gray-600" /> : <Eye className="w-3 h-3 text-gray-600" />}
                            </button>
                            <button
                              onClick={() => handleEditMethod(method.id)}
                              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
                              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                            >
                              <Edit className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteMethod(method.id)}
                              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
                              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detalhes expandidos */}
                      {showDetails === method.id && methodDetails && (
                        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 slide-in">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-800 mb-1">{t.fees}</p>
                              <p className="text-gray-600">{methodDetails.fees}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 mb-1">{t.processing}</p>
                              <p className="text-gray-600">{methodDetails.processing}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 mb-1">{t.securityLevel}</p>
                              <p className="text-gray-600">{methodDetails.security}</p>
                            </div>
                          </div>
                          {!method.isDefault && (
                            <div className="mt-3 pt-3 border-t border-white/20">
                              <Button 
                                onClick={() => handleSetDefault(method.id)}
                                size="sm"
                                className="text-xs"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {t.setDefault}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Métodos Disponibles */}
          <div 
            className="bg-white/25 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 border border-white/30 relative overflow-hidden"
            style={{ 
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
              animation: "float-card 4s ease-in-out infinite"
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40"
                style={{ 
                  backgroundColor: "#689610",
                  animation: "pulse-icon 2s ease-in-out infinite"
                }}
              >
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">{t.available}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePaymentMethods.map((method, index) => {
                const IconComponent = method.icon;
                const isAdded = savedMethods.some(m => m.id === method.id);

                return (
                  <div
                    key={method.id}
                    className={`group bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 relative overflow-hidden ${
                      isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => !isAdded && handleAddPaymentMethod(method.id)}
                    style={{ 
                      filter: `drop-shadow(0 4px 8px ${method.color}20)`,
                      animation: "float-card 4s ease-in-out infinite"
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
                    
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0"
                        style={{ backgroundColor: method.color }}
                      >
                        <IconComponent className={`w-5 h-5 ${method.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 tracking-wide text-sm truncate">{method.name}</h3>
                          <span className="text-base flex-shrink-0">{method.logos[0]}</span>
                          {method.popular && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              {t.popular}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{method.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{method.fees} • {method.processing}</p>
                      </div>

                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center border border-white/40 flex-shrink-0"
                        style={{ backgroundColor: isAdded ? '#9CA3AF' : method.color }}
                      >
                        {isAdded ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Informação de Segurança */}
          <div 
            className="bg-white/25 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/30 relative overflow-hidden"
            style={{ 
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
              animation: "float-card 4s ease-in-out infinite"
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40"
                style={{ 
                  backgroundColor: "#D42D66",
                  animation: "pulse-icon 2s ease-in-out infinite"
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 tracking-wider text-lg">{t.security}</h3>
            </div>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">
              {t.securityDesc}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">SSL</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">PCI DSS</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <AlertCircle className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">3DS</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <Eye className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">GDPR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Efectos de fondo con colores INFINITO */}
        <div className="absolute top-32 left-8 w-3 h-3 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: "#689610" }}></div>
        <div className="absolute bottom-40 right-10 w-2 h-2 rounded-full opacity-40 animate-pulse delay-1000" style={{ backgroundColor: "#3E88FF" }}></div>
        <div className="absolute top-1/2 right-6 w-2.5 h-2.5 rounded-full opacity-35 animate-pulse delay-500" style={{ backgroundColor: "#F47802" }}></div>
        <div className="absolute bottom-1/3 left-4 w-2 h-2 rounded-full opacity-30 animate-pulse delay-700" style={{ backgroundColor: "#D42D66" }}></div>
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse delay-300" style={{ backgroundColor: "#EAB308" }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full opacity-35 animate-pulse delay-800" style={{ backgroundColor: "#43B2D2" }}></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full opacity-20 animate-pulse delay-400" style={{ backgroundColor: "#813684" }}></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 rounded-full opacity-30 animate-pulse delay-600" style={{ backgroundColor: "#689610" }}></div>
        <div className="absolute bottom-1/2 left-1/2 w-1.5 h-1.5 rounded-full opacity-25 animate-pulse delay-900" style={{ backgroundColor: "#3E88FF" }}></div>

        <BottomNavigationMenu />
      </div>
    </>
  );
} 