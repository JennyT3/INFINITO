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
    <div className="min-h-screen pb-20" style={appBackground}>
      {/* Header */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider text-center flex-1">Environmental Calculator</h1>
          <div className="w-10 md:w-12"></div>
        </div>
      </div>

      <div className="max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl px-6 py-8">
        {step === "user" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calculator className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Impact Calculator</h2>
              <p className="text-gray-600">Calculate the environmental impact of your textile products</p>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={userData.country}
                  onChange={(e) => setUserData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Enter your country"
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                Continue to Calculator
              </button>
            </form>
          </div>
        )}

        {step === "calculator" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Add Garments</h2>
              <p className="text-gray-600">Add your textile products to calculate environmental impact</p>
            </div>

            {/* Add Garment Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/40">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Garment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    value={newGarment.type}
                    onChange={(e) => handleNewGarmentChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="e.g., T-shirt, Jeans"
                  />
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiber</label>
                  <input
                    type="text"
                    value={newGarment.fiber}
                    onChange={(e) => handleNewGarmentChange('fiber', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="e.g., Cotton, Polyester"
                  />
                  {errors.fiber && <p className="text-red-500 text-xs mt-1">{errors.fiber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={newGarment.country}
                    onChange={(e) => handleNewGarmentChange('country', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="e.g., China, India"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newGarment.weight}
                    onChange={(e) => handleNewGarmentChange('weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="0.3"
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                </div>
              </div>

              <button
                onClick={handleAddGarment}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all mt-4"
              >
                Add Garment
              </button>
            </div>

            {/* Garments List */}
            {garments.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/40">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Added Garments</h3>
                <div className="space-y-3">
                  {garments.map((garment) => (
                    <div key={garment.id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{garment.type}</p>
                        <p className="text-sm text-gray-600">{garment.fiber} • {garment.weight}kg</p>
                        <p className="text-xs text-gray-500">CO₂: {garment.co2.toFixed(2)}kg • Water: {garment.water.toFixed(2)}L</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGarment(garment)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGarment(garment.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Calculate Button */}
            {garments.length > 0 && (
              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
              >
                Calculate Impact
              </button>
            )}

            {errors.general && (
              <p className="text-red-500 text-center">{errors.general}</p>
            )}
          </div>
        )}

        {step === "certificate" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Impact Certificate</h2>
              <p className="text-gray-600">Your environmental impact analysis is complete</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Leaf className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">CO₂ Saved</h3>
                  <p className="text-3xl font-bold text-green-600">{getTotalImpact().co2.toFixed(2)} kg</p>
                </div>
                <div className="text-center">
                  <Droplets className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Water Saved</h3>
                  <p className="text-3xl font-bold text-blue-600">{getTotalImpact().water.toFixed(2)} L</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={downloadPDF}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-all mr-4"
                >
                  Download Certificate
                </button>
                <button
                  onClick={resetCalculator}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigationMenu />
    </div>
  );
};

export default SimplifiedEnvironmentalCalculator; 