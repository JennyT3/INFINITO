"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Leaf, Droplets, Plus, Trash2, Edit, X, Save, Download, Search, CheckCircle, Award, Zap, MapPin, Shirt, Globe, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../components/theme-provider';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

// Interfaces
interface MixtureComponent {
  fiber: string;
  percentage: number;
}

interface TextileItem {
  id: number;
  category: string;
  fiber: string;
  type: string;
  weight: number;
  co2: number;
  water: number;
  country: string;
  mixtureComposition?: MixtureComponent[];
  isMixture?: boolean;
}

interface UserData {
  name: string;
  country: string;
  date: string;
}

// Constants
const defaultCountry = "United States";

const appBackground = {
  backgroundColor: "#EDE4DA",
  backgroundImage: `url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)`,
  backgroundSize: "cover, 20px 20px, 25px 25px",
  backgroundRepeat: "no-repeat, repeat, repeat"
};

// Categories based on CSV
const categoriesMap: Record<string, string[]> = {
  'Natural Animal Fibers': ['Wool', 'Silk', 'Leather', 'Cashmere', 'Mohair', 'Angora'],
  'Natural Plant Fibers': ['Cotton', 'Linen', 'Hemp', 'Jute', 'Bamboo'],
  'Synthetic Fibers': ['Polyester', 'Nylon', 'Acrylic', 'Elastane', 'Polypropylene', 'Fleece', 'Softshell'],
  'Artificial Fibers': ['Viscose', 'Modal', 'Tencel'],
  'Mixed Fibers': []
};

const SimplifiedEnvironmentalCalculator = () => {
  const { language } = useLanguage();
  const router = useRouter();
  
  // Main states
  const [step, setStep] = useState<"user" | "calculator" | "certificate">("user");
  const [garments, setGarments] = useState<TextileItem[]>([]);
  const [textileDatabase, setTextileDatabase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedPDF, setGeneratedPDF] = useState<jsPDF | null>(null);
  
  // Form states
  const [newGarment, setNewGarment] = useState({
    type: '',
    category: '',
    fiber: '',
    country: '',
    weight: 0.3,
    isMixture: false,
    mixtureComposition: [] as MixtureComponent[]
  });
  
  // Search states
  const [typeSearch, setTypeSearch] = useState('');
  const [showTypeSearch, setShowTypeSearch] = useState(false);
  
  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<TextileItem | null>(null);
  
  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // User data states
  const [userData, setUserData] = useState<UserData>({
    name: '',
    country: 'United States',
    date: new Date().toISOString().split('T')[0]
  });

  // Load database data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products?public=1');
        const data = await response.json();
        console.log('Database response:', data);
        setTextileDatabase(data.products || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper functions
  const getFiberCategory = (material: string): string => {
    for (const [category, fibers] of Object.entries(categoriesMap)) {
      if (fibers && fibers.includes(material)) {
        return category;
      }
    }
    return 'Mixed Fibers';
  };

  const getUniqueOptions = () => {
    const types = [...new Set(textileDatabase.map(item => item.type))];
    const fibers = [...new Set(textileDatabase.map(item => item.fiber))];
    const countries = [...new Set(textileDatabase.map(item => item.country))];
    
    return { types, fibers, countries };
  };

  const handleNewGarmentChange = (field: string, value: any) => {
    setNewGarment(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'type' && value) {
      const databaseItem = textileDatabase.find(item => item.type === value);
      if (databaseItem) {
        setNewGarment(prev => ({
          ...prev,
          fiber: databaseItem.fiber,
          category: getFiberCategory(databaseItem.fiber),
          country: databaseItem.country
        }));
      }
    }
    
    clearErrors(field);
  };

  const validateUserForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!userData.name.trim()) newErrors.name = 'Name is required';
    if (!userData.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newGarment.type.trim()) newErrors.type = 'Type is required';
    if (!newGarment.fiber.trim()) newErrors.fiber = 'Fiber is required';
    if (!newGarment.country.trim()) newErrors.country = 'Country is required';
    if (newGarment.weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    
    if (newGarment.isMixture) {
      const totalPercentage = newGarment.mixtureComposition.reduce((sum, comp) => sum + comp.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.1) {
        newErrors.mixture = 'Total percentage must equal 100%';
      }
    }
    
    return newErrors;
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userErrors = validateUserForm();
    if (Object.keys(userErrors).length === 0) {
      setStep("calculator");
    } else {
      setErrors(userErrors);
    }
  };

  const findDatabaseItem = (type: string, fiber: string, country: string) => {
    return textileDatabase.find(item => 
      item.type === type && 
      item.fiber === fiber && 
      item.country === country
    );
  };

  const calculateMixtureImpact = (mixtureComposition: MixtureComponent[], weight: number, type: string, country: string) => {
    let totalCO2 = 0;
    let totalWater = 0;
    
    mixtureComposition.forEach(comp => {
      const databaseItem = findDatabaseItem(type, comp.fiber, country);
      if (databaseItem) {
        const percentage = comp.percentage / 100;
        totalCO2 += databaseItem.co2 * percentage * weight;
        totalWater += databaseItem.water * percentage * weight;
      }
    });
    
    return { co2: totalCO2, water: totalWater };
  };

  const addGarment = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let co2 = 0;
    let water = 0;

    if (newGarment.isMixture) {
      const impact = calculateMixtureImpact(newGarment.mixtureComposition, newGarment.weight, newGarment.type, newGarment.country);
      co2 = impact.co2;
      water = impact.water;
    } else {
      const databaseItem = findDatabaseItem(newGarment.type, newGarment.fiber, newGarment.country);
      if (databaseItem) {
        co2 = databaseItem.co2 * newGarment.weight;
        water = databaseItem.water * newGarment.weight;
      }
    }

    const newItem: TextileItem = {
      id: Date.now(),
      category: newGarment.category,
      fiber: newGarment.fiber,
      type: newGarment.type,
      weight: newGarment.weight,
      co2,
      water,
      country: newGarment.country,
      mixtureComposition: newGarment.isMixture ? newGarment.mixtureComposition : undefined,
      isMixture: newGarment.isMixture
    };

    setGarments(prev => [...prev, newItem]);
    
    // Reset form
    setNewGarment({
      type: '',
      category: '',
      fiber: '',
      country: '',
      weight: 0.3,
      isMixture: false,
      mixtureComposition: []
    });
    
    setErrors({});
  };

  const startEdit = (garment: TextileItem) => {
    setEditingId(garment.id);
    setEditState(garment);
  };

  const saveEdit = () => {
    if (!editState) return;
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    let co2 = 0;
    let water = 0;

    if (editState.isMixture) {
      const impact = calculateMixtureImpact(editState.mixtureComposition || [], editState.weight, editState.type, editState.country);
      co2 = impact.co2;
      water = impact.water;
    } else {
      const databaseItem = findDatabaseItem(editState.type, editState.fiber, editState.country);
      if (databaseItem) {
        co2 = databaseItem.co2 * editState.weight;
        water = databaseItem.water * editState.weight;
      }
    }

    const updatedItem: TextileItem = {
      ...editState,
      co2,
      water
    };

    setGarments(prev => prev.map(item => item.id === editingId ? updatedItem : item));
    setEditingId(null);
    setEditState(null);
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
    setErrors({});
  };

  const removeGarment = (id: number) => {
    setGarments(prev => prev.filter(item => item.id !== id));
  };

  const calculateTotalImpact = () => {
    return garments.reduce((total, garment) => ({
      co2: total.co2 + garment.co2,
      water: total.water + garment.water
    }), { co2: 0, water: 0 });
  };

  const clearErrors = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleContinueToCalculator = () => {
    setStep("calculator");
  };

  const handleAddGarment = () => {
    addGarment();
  };

  const handleCalculate = () => {
    if (garments.length === 0) {
      setErrors({ general: 'Add at least one garment to calculate impact' });
      return;
    }
    setStep("certificate");
    generatePDF();
  };

  const handleEditGarment = (garment: TextileItem) => {
    startEdit(garment);
  };

  const handleDeleteGarment = (id: number) => {
    removeGarment(id);
  };

  const getTotalImpact = () => {
    return calculateTotalImpact();
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const totalImpact = getTotalImpact();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(104, 150, 16);
    pdf.text('INFINITO Environmental Impact Certificate', 105, 20, { align: 'center' });
    
    // User info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${userData.name}`, 20, 40);
    pdf.text(`Country: ${userData.country}`, 20, 50);
    pdf.text(`Date: ${userData.date}`, 20, 60);
    
    // Garments list
    pdf.setFontSize(14);
    pdf.setTextColor(104, 150, 16);
    pdf.text('Garments Analyzed:', 20, 80);
    
    let yPosition = 90;
    garments.forEach((garment, index) => {
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${index + 1}. ${garment.type} - ${garment.fiber}`, 25, yPosition);
      pdf.text(`Weight: ${garment.weight}kg`, 25, yPosition + 5);
      pdf.text(`CO₂: ${garment.co2.toFixed(2)}kg`, 25, yPosition + 10);
      pdf.text(`Water: ${garment.water.toFixed(2)}L`, 25, yPosition + 15);
      yPosition += 25;
    });
    
    // Total impact
    pdf.setFontSize(14);
    pdf.setTextColor(104, 150, 16);
    pdf.text('Total Environmental Impact:', 20, yPosition + 10);
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`CO₂ Saved: ${totalImpact.co2.toFixed(2)}kg`, 25, yPosition + 20);
    pdf.text(`Water Saved: ${totalImpact.water.toFixed(2)}L`, 25, yPosition + 25);
    
    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by INFINITO Environmental Calculator', 105, 280, { align: 'center' });
    
    setGeneratedPDF(pdf);
  };

  const generateCertificate = () => {
    generatePDF();
  };

  const downloadPDF = () => {
    if (generatedPDF) {
      generatedPDF.save(`infinito-certificate-${userData.name}-${userData.date}.pdf`);
    }
  };

  const resetCalculator = () => {
    setGarments([]);
    setStep("user");
    setGeneratedPDF(null);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={appBackground}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading environmental data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(104,150,16,0.3); }
          50% { box-shadow: 0 0 30px rgba(104,150,16,0.6); }
        }
        
        @keyframes pulse-metric {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      <div 
        className="min-h-screen pb-20 font-raleway relative overflow-hidden"
        style={{
          backgroundColor: "#EDE4DA",
          backgroundImage: "url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)",
          backgroundSize: "cover, 20px 20px, 25px 25px",
          backgroundRepeat: "no-repeat, repeat, repeat"
        }}
      >
        <BottomNavigationMenu />
        
        {/* Header futurista con glassmorphism */}
        <div 
          className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}
        >
          <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">
                Environmental Calculator
              </h1>
            </div>
            
            <div 
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
            >
              <Calculator className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl p-6">
          {/* Formulário de dados do usuário */}
          {step === "user" && (
            <div className="space-y-6">
              {/* Título principal */}
              <div className="text-center mb-8 mt-8">
                <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 tracking-wider">
                  Discover Your Impact
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Analyze the environmental impact of your textiles
                </p>
              </div>

              {/* Layout responsivo */}
              <div className="md:flex md:gap-8 md:items-start">
                {/* Imagem central em móvil, lateral em desktop */}
                <div className="flex justify-center mb-8 md:mb-0 md:w-1/3">
                  <div 
                    className="relative"
                    style={{ 
                      filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))",
                      animation: "float 4s ease-in-out infinite"
                    }}
                  >
                    <div 
                      className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full flex items-center justify-center mx-auto"
                      style={{ 
                        background: "linear-gradient(135deg, #689610 0%, #3E88FF 25%, #D42D66 50%, #813684 100%)",
                        animation: "glow 3s ease-in-out infinite"
                      }}
                    >
                      <Calculator className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-white" />
                    </div>
                  </div>
                </div>

                {/* Formulário */}
                <div className="md:w-2/3 md:pl-8">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(104,150,16,0.2))" }}>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                      <User className="w-6 h-6" style={{ color: "#689610" }} />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          What should I call you?
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({...userData, name: e.target.value})}
                          className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          What country are you in?
                        </label>
                        <select
                          value={userData.country}
                          onChange={(e) => setUserData({...userData, country: e.target.value})}
                          className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        >
                          <option value="United States">United States</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Spain">Spain</option>
                          <option value="France">France</option>
                          <option value="Germany">Germany</option>
                          <option value="Italy">Italy</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="China">China</option>
                          <option value="India">India</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={userData.date}
                          onChange={(e) => setUserData({...userData, date: e.target.value})}
                          className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        />
                      </div>

                      <button
                        onClick={handleContinueToCalculator}
                        className="w-full px-6 py-4 md:px-8 md:py-5 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 tracking-wider border border-white/30"
                        style={{ 
                          backgroundColor: "#689610",
                          filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))"
                        }}
                      >
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        Continue to Calculator
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calculadora */}
          {step === "calculator" && (
            <div className="space-y-6">
              {/* Título com saudação */}
              <div className="text-center mb-8 mt-8">
                <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-2 tracking-wider">
                  Hello <span style={{ color: "#D42D66" }}>{userData.name}</span>!
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Configure your textile pieces for analysis
                </p>
              </div>

              {/* Grid responsivo para formulário */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Composição */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(67,178,210,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Shirt className="w-6 h-6" style={{ color: "#43B2D2" }} />
                    Composition
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Piece Type
                      </label>
                      <input
                        type="text"
                        value={newGarment.type}
                        onChange={(e) => {
                          setNewGarment({...newGarment, type: e.target.value});
                          setTypeSearch(e.target.value);
                          setShowTypeSearch(true);
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        placeholder="Ex: Shirt, Pants, Dress..."
                      />
                      {errors.type && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.type}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newGarment.category}
                        onChange={(e) => {
                          setNewGarment({...newGarment, category: e.target.value, fiber: ''});
                          clearErrors('category');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      >
                        <option value="">Select category</option>
                        {Object.keys(categoriesMap).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Fiber
                      </label>
                      <select
                        value={newGarment.fiber}
                        onChange={(e) => {
                          setNewGarment({...newGarment, fiber: e.target.value});
                          clearErrors('fiber');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        disabled={!newGarment.category}
                      >
                        <option value="">Select fiber</option>
                        {newGarment.category && categoriesMap[newGarment.category as keyof typeof categoriesMap]?.map(fiber => (
                          <option key={fiber} value={fiber}>{fiber}</option>
                        ))}
                      </select>
                      {errors.fiber && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.fiber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dados Técnicos */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(244,120,2,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Globe className="w-6 h-6" style={{ color: "#F47802" }} />
                    Technical Data
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Country of Origin
                      </label>
                      <select
                        value={newGarment.country}
                        onChange={(e) => {
                          setNewGarment({...newGarment, country: e.target.value});
                          clearErrors('country');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      >
                        <option value="">Select country</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Brazil">Brazil</option>
                        <option value="China">China</option>
                        <option value="India">India</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Italy">Italy</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.country}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newGarment.weight}
                        onChange={(e) => {
                          setNewGarment({...newGarment, weight: parseFloat(e.target.value) || 0});
                          clearErrors('weight');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      />
                      {errors.weight && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.weight}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleAddGarment}
                      className="w-full px-6 py-4 md:px-8 md:py-5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-gray-800 font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 tracking-wider"
                      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
                    >
                      <Plus className="w-5 h-5 md:w-6 md:h-6" />
                      Add Piece
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de peças */}
              {garments.length > 0 && (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(129,54,132,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Award className="w-6 h-6" style={{ color: "#813684" }} />
                    Added Pieces ({garments.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {garments.map((garment, index) => (
                      <div key={garment.id} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/40" style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${index * 0.2}s` }}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm md:text-base font-bold text-gray-800">
                                {garment.type}
                              </span>
                              <span className="text-xs md:text-sm text-gray-600 bg-white/60 px-2 py-1 rounded-full border border-white/40">
                                {garment.fiber}
                              </span>
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 space-y-1">
                              <div className="font-medium">Country: {garment.country}</div>
                              <div className="font-medium">Weight: {garment.weight}kg</div>
                              <div className="flex gap-4 mt-2">
                                <span className="font-bold text-gray-800">CO₂: {garment.co2.toFixed(1)} kg</span>
                                <span className="font-bold text-gray-800">Water: {garment.water.toFixed(1)} L</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditGarment(garment)}
                              className="p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-all duration-300 hover:scale-105"
                            >
                              <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteGarment(garment.id)}
                              className="p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-all duration-300 hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botão de cálculo */}
              {garments.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={handleCalculate}
                    className="px-8 py-5 md:px-12 md:py-6 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 tracking-wider mx-auto border border-white/30"
                    style={{ 
                      backgroundColor: "#689610",
                      filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))"
                    }}
                  >
                    <Calculator className="w-6 h-6 md:w-8 md:h-8" />
                    Calculate your environmental footprint
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certificado */}
          {step === "certificate" && (
            <div className="space-y-6">
              <div className="text-center mb-8 mt-8">
                <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 tracking-wider">
                  Environmental Impact Certificate
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Result of your textile pieces analysis
                </p>
              </div>

              {/* Impacto ambiental - mesmo design do passport */}
              <div 
                className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 mb-6 border border-white/30"
                style={{ filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.2))" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#689610" }} />
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">Environmental Impact</span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4 md:gap-6">
                  <div 
                    className="flex flex-col items-center flex-1 p-4 md:p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 w-full"
                    style={{ animation: "pulse-metric 2s ease-in-out infinite" }}
                  >
                    <Leaf className="w-10 h-10 md:w-12 md:h-12 mb-2" style={{ color: "#689610" }} />
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wider">{calculateTotalImpact().co2.toFixed(1)} Kg</span>
                    <span className="text-sm md:text-base text-gray-600 font-medium">CO₂</span>
                  </div>
                  <div 
                    className="flex flex-col items-center flex-1 p-4 md:p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 w-full"
                    style={{ animation: "pulse-metric 2s ease-in-out infinite 0.3s" }}
                  >
                    <Droplets className="w-10 h-10 md:w-12 md:h-12 mb-2" style={{ color: "#43B2D2" }} />
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wider">{calculateTotalImpact().water.toFixed(0)} LT</span>
                    <span className="text-sm md:text-base text-gray-600 font-medium">Water</span>
                  </div>
                  <div 
                    className="flex flex-col items-center flex-1 p-4 md:p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 w-full"
                    style={{ animation: "pulse-metric 2s ease-in-out infinite 0.6s" }}
                  >
                    <Zap className="w-10 h-10 md:w-12 md:h-12 mb-2" style={{ color: "#EAB308" }} />
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wider">100%</span>
                    <span className="text-sm md:text-base text-gray-600 font-medium">Resources</span>
                  </div>
                </div>
              </div>

              {/* Detalhes das peças */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.2))" }}>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                  <Award className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#D42D66" }} />
                  Analyzed Pieces
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garments.map((garment, index) => (
                    <div key={garment.id} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/40" style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${index * 0.2}s` }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm md:text-base font-bold text-gray-800">
                              {garment.type}
                            </span>
                            <span className="text-xs md:text-sm text-gray-600 bg-white/60 px-2 py-1 rounded-full border border-white/40">
                              {garment.fiber}
                            </span>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 space-y-1">
                            <div className="font-medium">Country: {garment.country}</div>
                            <div className="font-medium">Weight: {garment.weight}kg</div>
                            <div className="flex gap-4 mt-2">
                              <span className="font-bold text-gray-800">CO₂: {garment.co2.toFixed(1)} kg</span>
                              <span className="font-bold text-gray-800">Water: {garment.water.toFixed(1)} L</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={generatePDF}
                  className="flex-1 px-6 py-4 md:px-8 md:py-5 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 tracking-wider border border-white/30"
                  style={{ 
                    backgroundColor: "#689610",
                    filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.3))"
                  }}
                >
                  <Download className="w-5 h-5 md:w-6 md:h-6" />
                  Download PDF
                </button>
                
                <button
                  onClick={() => setStep("calculator")}
                  className="flex-1 px-6 py-4 md:px-8 md:py-5 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 tracking-wider border border-white/30"
                  style={{ 
                    backgroundColor: "#689610",
                    filter: "drop-shadow(0 6px 12px rgba(104,150,16,0.3))"
                  }}
                >
                  New Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SimplifiedEnvironmentalCalculator; 