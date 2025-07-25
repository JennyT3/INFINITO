"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Leaf, Droplets, Plus, Trash2, Edit, X, Save, Download, Search, CheckCircle, Award, Zap, MapPin, Shirt, Globe, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../components/theme-provider';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

// Interfaces
interface MixtureComponent {
  fibra: string;
  percentagem: number;
}

interface TextileItem {
  id: number;
  categoria: string;
  fibra: string;
  tipo: string;
  peso: number;
  co2: number;
  agua: number;
  pais: string;
  composicaoMistura?: MixtureComponent[];
  isMixture?: boolean;
}

interface UserData {
  nome: string;
  pais: string;
  data: string;
}

// Constantes
const defaultCountry = "Portugal";

const appBackground = {
  backgroundColor: "#EDE4DA",
  backgroundImage: `url('/fondo.png'), radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px)`,
  backgroundSize: "cover, 20px 20px, 25px 25px",
  backgroundRepeat: "no-repeat, repeat, repeat"
};

// Categorias baseadas no CSV
const categoriesMap = {
  'Fibras Naturais Animais': ['Lã', 'Seda', 'Couro', 'Cashmere', 'Mohair', 'Angora'],
  'Fibras Naturais Vegetais': ['Algodão', 'Linho', 'Cânhamo', 'Juta', 'Bambu'],
  'Fibras Sintéticas': ['Poliéster', 'Nylon', 'Acrílico', 'Elastano', 'Polipropileno', 'Fleece', 'Softshell'],
  'Fibras Artificiais': ['Viscose', 'Modal', 'Tencel'],
  'Fibras Mistas': []
};

const SimplifiedEnvironmentalCalculator = () => {
  const { language } = useLanguage();
  const router = useRouter();
  
  // Estados principais
  const [step, setStep] = useState<"user" | "calculator" | "certificate">("user");
  const [garments, setGarments] = useState<TextileItem[]>([]);
  const [textileDatabase, setTextileDatabase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedPDF, setGeneratedPDF] = useState<jsPDF | null>(null);
  
  // Estados para formulário
  const [newGarment, setNewGarment] = useState({
    tipo: '',
    categoria: '',
    fibra: '',
    pais: '',
    peso: 0.3,
    isMixture: false,
    composicaoMistura: [] as MixtureComponent[]
  });
  
  // Estados para busca
  const [typeSearch, setTypeSearch] = useState('');
  const [showTypeSearch, setShowTypeSearch] = useState(false);
  
  // Estados para edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editState, setEditState] = useState<TextileItem | null>(null);
  
  // Estados para validação
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Estados para dados do usuário
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    pais: 'Portugal',
    data: new Date().toISOString().split('T')[0]
  });

  // Carregar dados da base de dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products?public=1');
        const data = await response.json();
        console.log('Database response:', data);
        setTextileDatabase(data.products || []);
      } catch (error) {
        console.error('Error fetching textile database:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Função para obter categoria da fibra baseada no CSV
  const getFiberCategory = (material: string): string => {
    for (const [category, materials] of Object.entries(categoriesMap)) {
      if (materials.some(mat => material.toLowerCase().includes(mat.toLowerCase()))) {
        return category;
      }
    }
    return 'Outras Fibras';
  };

  // Obter opções únicas da base de dados
  const getUniqueOptions = () => {
    const types = [...new Set(textileDatabase.map(item => item.garmentType).filter(Boolean))];
    const fibers = [...new Set(textileDatabase.map(item => item.material).filter(Boolean))];
    const countries = [...new Set(textileDatabase.map(item => item.country).filter(Boolean))];
    const categories = Object.keys(categoriesMap);
    
    console.log('Categories:', categories);
    console.log('All types:', types);
    console.log('All fibers:', fibers);
    console.log('All countries:', countries);
    
    return { types, fibers, countries, categories };
  };

  const { types, fibers, countries, categories } = getUniqueOptions();

  // Filtrar tipos baseado na busca
  const filteredTypes = types.filter(type => 
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );

  // Handlers para mudanças no formulário
  const handleNewGarmentChange = (field: string, value: any) => {
    setNewGarment(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validação do formulário do usuário
  const validateUserForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!userData.nome.trim()) newErrors.nome = '¡Hey! ¿Cómo quieres que te llame?';
    if (!userData.pais) newErrors.pais = 'Necesitamos saber tu país';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validação do formulário da calculadora
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!newGarment.tipo.trim()) newErrors.tipo = 'Campo obrigatório';
    if (!newGarment.categoria) newErrors.categoria = 'Campo obrigatório';
    if (!newGarment.fibra && !newGarment.isMixture) newErrors.fibra = 'Campo obrigatório';
    if (!newGarment.pais) newErrors.pais = 'Campo obrigatório';
    if (newGarment.peso <= 0) newErrors.peso = 'O peso deve ser maior que 0';
    
    // Validação para fibras mistas
    if (newGarment.isMixture) {
      if (newGarment.composicaoMistura.length === 0) {
        newErrors.composicaoMistura = 'Adicione pelo menos uma fibra';
      } else {
        const totalPercentage = newGarment.composicaoMistura.reduce((sum, comp) => sum + comp.percentagem, 0);
        if (totalPercentage !== 100) {
          newErrors.composicaoMistura = 'A soma das percentagens deve ser 100%';
        }
        
        // Verificar se todas as fibras têm nome e percentagem
        const hasEmptyFibers = newGarment.composicaoMistura.some(comp => !comp.fibra || comp.percentagem <= 0);
        if (hasEmptyFibers) {
          newErrors.composicaoMistura = 'Todas as fibras devem ter nome e percentagem válida';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle user form submission
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserForm()) return;
    
    setStep("calculator");
  };

  // Função para encontrar item na base de dados com melhor matching
  const findDatabaseItem = (tipo: string, fibra: string, pais: string) => {
    // Busca exata primeiro
    let dbItem = textileDatabase.find(item => 
      item.garmentType?.toLowerCase() === tipo.toLowerCase() && 
      item.material?.toLowerCase() === fibra.toLowerCase() && 
      item.country?.toLowerCase() === pais.toLowerCase()
    );
    
    // Se não encontrar exato, busca por tipo e fibra
    if (!dbItem) {
      dbItem = textileDatabase.find(item => 
        item.garmentType?.toLowerCase() === tipo.toLowerCase() && 
        item.material?.toLowerCase() === fibra.toLowerCase()
      );
    }
    
    // Se não encontrar, busca só por fibra
    if (!dbItem) {
      dbItem = textileDatabase.find(item => 
        item.material?.toLowerCase() === fibra.toLowerCase()
      );
    }
    
    console.log('Searching for:', { tipo, fibra, pais });
    console.log('Found item:', dbItem);
    
    return dbItem;
  };

  // Função para calcular impacto de fibras mistas
  const calculateMixtureImpact = (composicaoMistura: MixtureComponent[], peso: number, tipo: string, pais: string) => {
    let totalCo2 = 0;
    let totalWater = 0;
    
    composicaoMistura.forEach(comp => {
      const dbItem = findDatabaseItem(tipo, comp.fibra, pais);
      const percentage = comp.percentagem / 100;
      
      if (dbItem) {
        totalCo2 += (dbItem.impactCo2 || 2.5) * peso * percentage;
        totalWater += (dbItem.impactWater || 1500) * peso * percentage;
      } else {
        // Valores padrão se não encontrar na base de dados
        totalCo2 += 2.5 * peso * percentage;
        totalWater += 1500 * peso * percentage;
      }
    });
    
    return { co2: totalCo2, water: totalWater };
  };

  // Adicionar peça de roupa
  const addGarment = () => {
    if (!validateForm()) return;
    
    let co2Impact = 0;
    let waterImpact = 0;
    let fiberDescription = '';
    
    if (newGarment.isMixture) {
      // Para fibras mistas, calcular impacto baseado na composição
      const mixedImpact = calculateMixtureImpact(newGarment.composicaoMistura, newGarment.peso, newGarment.tipo, newGarment.pais);
      co2Impact = mixedImpact.co2;
      waterImpact = mixedImpact.water;
      fiberDescription = newGarment.composicaoMistura.map(comp => `${comp.fibra} (${comp.percentagem}%)`).join(', ');
    } else {
      // Para fibra única, buscar na base de dados
      const dbItem = findDatabaseItem(newGarment.tipo, newGarment.fibra, newGarment.pais);
      
      if (dbItem) {
        co2Impact = (dbItem.impactCo2 || 2.5) * newGarment.peso;
        waterImpact = (dbItem.impactWater || 1500) * newGarment.peso;
      } else {
        // Valores padrão se não encontrar na base de dados
        co2Impact = 2.5 * newGarment.peso;
        waterImpact = 1500 * newGarment.peso;
      }
      fiberDescription = newGarment.fibra;
    }
    
    const newItem: TextileItem = {
      id: Date.now(),
      categoria: newGarment.categoria,
      fibra: fiberDescription,
      tipo: newGarment.tipo,
      peso: newGarment.peso,
      pais: newGarment.pais,
      co2: co2Impact,
      agua: waterImpact,
      isMixture: newGarment.isMixture,
      composicaoMistura: newGarment.composicaoMistura
    };
    
    console.log('New item:', newItem);
    setGarments(prev => [...prev, newItem]);
    
    // Reset form
    setNewGarment({
      tipo: '',
      categoria: '',
      fibra: '',
      pais: '',
      peso: 0.3,
      isMixture: false,
      composicaoMistura: []
    });
    setTypeSearch('');
    setShowTypeSearch(false);
    setErrors({});
  };

  // Handlers para edição
  const startEdit = (garment: TextileItem) => {
    setEditingId(garment.id);
    setEditState({
      ...garment,
      composicaoMistura: garment.composicaoMistura ? [...garment.composicaoMistura] : []
    });
  };

  const saveEdit = () => {
    if (!editState) return;
    
    let co2Impact = 0;
    let waterImpact = 0;
    let fiberDescription = '';
    
    if (editState.isMixture && editState.composicaoMistura) {
      // Para fibras mistas, calcular impacto baseado na composição
      const mixedImpact = calculateMixtureImpact(editState.composicaoMistura, editState.peso, editState.tipo, editState.pais);
      co2Impact = mixedImpact.co2;
      waterImpact = mixedImpact.water;
      fiberDescription = editState.composicaoMistura.map(comp => `${comp.fibra} (${comp.percentagem}%)`).join(', ');
    } else {
      // Para fibra única, buscar na base de dados
      const dbItem = findDatabaseItem(editState.tipo, editState.fibra, editState.pais);
      
      if (dbItem) {
        co2Impact = (dbItem.impactCo2 || 2.5) * editState.peso;
        waterImpact = (dbItem.impactWater || 1500) * editState.peso;
      } else {
        // Valores padrão se não encontrar na base de dados
        co2Impact = 2.5 * editState.peso;
        waterImpact = 1500 * editState.peso;
      }
      fiberDescription = editState.fibra;
    }
    
    const updatedGarment = {
      ...editState,
      peso: Number(editState.peso),
      fibra: fiberDescription,
      co2: co2Impact,
      agua: waterImpact,
    };
    
    setGarments(prev => prev.map(g => g.id === editingId ? updatedGarment : g));
    setEditingId(null);
    setEditState(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditState(null);
  };

  const removeGarment = (id: number) => {
    setGarments(prev => prev.filter(g => g.id !== id));
  };

  // Cálculos de impacto
  const calculateTotalImpact = () => {
    return garments.reduce((total, garment) => ({
      co2: total.co2 + garment.co2,
      agua: total.agua + garment.agua
    }), { co2: 0, agua: 0 });
  };

  // Funções auxiliares
  const clearErrors = (field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleContinueToCalculator = () => {
    if (!validateUserForm()) return;
    setStep("calculator");
  };

  const handleAddGarment = () => {
    addGarment();
  };

  const handleCalculate = () => {
    if (garments.length === 0) {
      setErrors({ general: 'Adicione pelo menos uma peça para calcular o impacto.' });
      return;
    }
    setStep("certificate");
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

  // Geração de PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const totalImpact = calculateTotalImpact();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Background color
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Header with INFINITO branding
    doc.setFillColor(45, 90, 39);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('INFINITO', pageWidth / 2, 25, { align: 'center' });
    
    // Certificate title
    doc.setFontSize(20);
    doc.setTextColor(45, 90, 39);
    doc.text('Certificado de Contribuição Ambiental', pageWidth / 2, 60, { align: 'center' });
    
    // Certificate number and date
    const certNumber = `INF-${Date.now().toString().slice(-6)}`;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Certificado Nº: ${certNumber}`, pageWidth - 20, 75, { align: 'right' });
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth - 20, 82, { align: 'right' });
    
    // User information box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 90, pageWidth - 40, 35, 3, 3, 'F');
    doc.setDrawColor(45, 90, 39);
    doc.roundedRect(20, 90, pageWidth - 40, 35, 3, 3, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(45, 90, 39);
    doc.text(`Nome: ${userData.nome}`, 30, 105);
    doc.text(`País: ${userData.pais}`, 30, 115);
    
    // Impact summary
    doc.setFontSize(16);
    doc.setTextColor(45, 90, 39);
    doc.text('Resumo da Contribuição', 20, 145);
    
    // Impact metrics
    doc.setFillColor(255, 245, 245);
    doc.roundedRect(20, 155, pageWidth - 40, 25, 3, 3, 'F');
    doc.setDrawColor(220, 53, 69);
    doc.roundedRect(20, 155, pageWidth - 40, 25, 3, 3, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(220, 53, 69);
    doc.text(`Emissões de CO₂: ${totalImpact.co2.toFixed(2)} kg`, 30, 170);
    
    doc.setFillColor(245, 248, 255);
    doc.roundedRect(20, 185, pageWidth - 40, 25, 3, 3, 'F');
    doc.setDrawColor(13, 110, 253);
    doc.roundedRect(20, 185, pageWidth - 40, 25, 3, 3, 'S');
    
    doc.setTextColor(13, 110, 253);
    doc.text(`Consumo de Água: ${totalImpact.agua.toFixed(0)} L`, 30, 200);
    
    // Items list
    doc.setFontSize(14);
    doc.setTextColor(45, 90, 39);
    doc.text('Peças Analisadas:', 20, 225);
    
    let yPosition = 235;
    garments.forEach((garment, index) => {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${garment.tipo} - ${garment.fibra} (${garment.peso}kg)`, 25, yPosition);
      yPosition += 10;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Gerado por INFINITO', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('Obrigado pela sua contribuição para um futuro mais sustentável!', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    return doc;
  };

  // Generate certificate
  const generateCertificate = () => {
    const pdf = generatePDF();
    setGeneratedPDF(pdf);
    setStep("certificate");
  };

  // Download PDF
  const downloadPDF = () => {
    if (generatedPDF) {
      generatedPDF.save(`certificado-ambiental-${userData.nome.replace(/\s+/g, '-')}.pdf`);
    }
  };

  // Reset calculator
  const resetCalculator = () => {
    setGarments([]);
    setUserData({
      nome: '',
      pais: 'Portugal',
      data: new Date().toISOString().split('T')[0]
    });
    setGeneratedPDF(null);
    setStep("user");
  };

  if (loading) {
    return (
      <div style={appBackground} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
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
                Calculadora Ambiental
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
                  Descubra o Seu Impacto
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Analise o impacto ambiental dos seus têxteis
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
                      Informações Pessoais
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          ¿Cómo quieres que te llame?
                        </label>
                        <input
                          type="text"
                          value={userData.nome}
                          onChange={(e) => setUserData({...userData, nome: e.target.value})}
                          className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                          placeholder="Seu nome"
                        />
                        {errors.nome && (
                          <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                            {errors.nome}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          Em que país estás?
                        </label>
                        <select
                          value={userData.pais}
                          onChange={(e) => setUserData({...userData, pais: e.target.value})}
                          className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        >
                          <option value="Portugal">Portugal</option>
                          <option value="Brasil">Brasil</option>
                          <option value="Espanha">Espanha</option>
                          <option value="França">França</option>
                          <option value="Alemanha">Alemanha</option>
                          <option value="Itália">Itália</option>
                          <option value="Reino Unido">Reino Unido</option>
                          <option value="Estados Unidos">Estados Unidos</option>
                          <option value="China">China</option>
                          <option value="Índia">Índia</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                          Data
                        </label>
                        <input
                          type="date"
                          value={userData.data}
                          onChange={(e) => setUserData({...userData, data: e.target.value})}
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
                        Continuar para Calculadora
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
                  Olá <span style={{ color: "#D42D66" }}>{userData.nome}</span>!
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Configure as suas peças têxteis para análise
                </p>
              </div>

              {/* Grid responsivo para formulário */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Composição */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(67,178,210,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Shirt className="w-6 h-6" style={{ color: "#43B2D2" }} />
                    Composição
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Tipo de Peça
                      </label>
                      <input
                        type="text"
                        value={newGarment.tipo}
                        onChange={(e) => {
                          setNewGarment({...newGarment, tipo: e.target.value});
                          setTypeSearch(e.target.value);
                          setShowTypeSearch(true);
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        placeholder="Ex: Camisa, Calça, Vestido..."
                      />
                      {errors.tipo && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.tipo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={newGarment.categoria}
                        onChange={(e) => {
                          setNewGarment({...newGarment, categoria: e.target.value, fibra: ''});
                          clearErrors('categoria');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      >
                        <option value="">Selecionar categoria</option>
                        {Object.keys(categoriesMap).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.categoria && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.categoria}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Fibra
                      </label>
                      <select
                        value={newGarment.fibra}
                        onChange={(e) => {
                          setNewGarment({...newGarment, fibra: e.target.value});
                          clearErrors('fibra');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                        disabled={!newGarment.categoria}
                      >
                        <option value="">Selecionar fibra</option>
                        {newGarment.categoria && categoriesMap[newGarment.categoria as keyof typeof categoriesMap]?.map(fibra => (
                          <option key={fibra} value={fibra}>{fibra}</option>
                        ))}
                      </select>
                      {errors.fibra && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.fibra}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dados Técnicos */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(244,120,2,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Globe className="w-6 h-6" style={{ color: "#F47802" }} />
                    Dados Técnicos
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        País de Origem
                      </label>
                      <select
                        value={newGarment.pais}
                        onChange={(e) => {
                          setNewGarment({...newGarment, pais: e.target.value});
                          clearErrors('pais');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      >
                        <option value="">Selecionar país</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Brasil">Brasil</option>
                        <option value="China">China</option>
                        <option value="Índia">Índia</option>
                        <option value="Turquia">Turquia</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Vietname">Vietname</option>
                        <option value="Itália">Itália</option>
                        <option value="Alemanha">Alemanha</option>
                        <option value="França">França</option>
                        <option value="Reino Unido">Reino Unido</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="Marrocos">Marrocos</option>
                        <option value="Tunísia">Tunísia</option>
                        <option value="Outro">Outro</option>
                      </select>
                      {errors.pais && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.pais}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newGarment.peso}
                        onChange={(e) => {
                          setNewGarment({...newGarment, peso: parseFloat(e.target.value) || 0});
                          clearErrors('peso');
                        }}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/40 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                      />
                      {errors.peso && (
                        <p className="text-red-600 text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">
                          {errors.peso}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleAddGarment}
                      className="w-full px-6 py-4 md:px-8 md:py-5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-gray-800 font-bold hover:bg-white/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 tracking-wider"
                      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
                    >
                      <Plus className="w-5 h-5 md:w-6 md:h-6" />
                      Adicionar Peça
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de peças */}
              {garments.length > 0 && (
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(129,54,132,0.2))" }}>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                    <Award className="w-6 h-6" style={{ color: "#813684" }} />
                    Peças Adicionadas ({garments.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {garments.map((garment, index) => (
                      <div key={garment.id} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/40" style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${index * 0.2}s` }}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm md:text-base font-bold text-gray-800">
                                {garment.tipo}
                              </span>
                              <span className="text-xs md:text-sm text-gray-600 bg-white/60 px-2 py-1 rounded-full border border-white/40">
                                {garment.fibra}
                              </span>
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 space-y-1">
                              <div className="font-medium">País: {garment.pais}</div>
                              <div className="font-medium">Peso: {garment.peso}kg</div>
                              <div className="flex gap-4 mt-2">
                                <span className="font-bold text-gray-800">CO₂: {garment.co2.toFixed(1)} kg</span>
                                <span className="font-bold text-gray-800">Água: {garment.agua.toFixed(1)} L</span>
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
                    Calcula tu pegada ambiental
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
                  Certificado de Impacto Ambiental
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Resultado da análise das suas peças têxteis
                </p>
              </div>

              {/* Impacto ambiental - mesmo design do passport */}
              <div 
                className="w-full bg-white/25 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 mb-6 border border-white/30"
                style={{ filter: "drop-shadow(0 8px 16px rgba(104,150,16,0.2))" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#689610" }} />
                  <span className="text-lg md:text-xl font-bold text-gray-800 tracking-wider">Impacto Ambiental</span>
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
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wider">{calculateTotalImpact().agua.toFixed(0)} LT</span>
                    <span className="text-sm md:text-base text-gray-600 font-medium">Água</span>
                  </div>
                  <div 
                    className="flex flex-col items-center flex-1 p-4 md:p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 w-full"
                    style={{ animation: "pulse-metric 2s ease-in-out infinite 0.6s" }}
                  >
                    <Zap className="w-10 h-10 md:w-12 md:h-12 mb-2" style={{ color: "#EAB308" }} />
                    <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-wider">100%</span>
                    <span className="text-sm md:text-base text-gray-600 font-medium">Recursos</span>
                  </div>
                </div>
              </div>

              {/* Detalhes das peças */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30" style={{ filter: "drop-shadow(0 6px 12px rgba(212,45,102,0.2))" }}>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6 tracking-wider flex items-center gap-3">
                  <Award className="w-6 h-6 md:w-8 md:h-8" style={{ color: "#D42D66" }} />
                  Peças Analisadas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {garments.map((garment, index) => (
                    <div key={garment.id} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/40" style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${index * 0.2}s` }}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm md:text-base font-bold text-gray-800">
                              {garment.tipo}
                            </span>
                            <span className="text-xs md:text-sm text-gray-600 bg-white/60 px-2 py-1 rounded-full border border-white/40">
                              {garment.fibra}
                            </span>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 space-y-1">
                            <div className="font-medium">País: {garment.pais}</div>
                            <div className="font-medium">Peso: {garment.peso}kg</div>
                            <div className="flex gap-4 mt-2">
                              <span className="font-bold text-gray-800">CO₂: {garment.co2.toFixed(1)} kg</span>
                              <span className="font-bold text-gray-800">Água: {garment.agua.toFixed(1)} L</span>
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
                  Descarregar PDF
                </button>
                
                <button
                  onClick={() => setStep("calculator")}
                  className="flex-1 px-6 py-4 md:px-8 md:py-5 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 tracking-wider border border-white/30"
                  style={{ 
                    backgroundColor: "#689610",
                    filter: "drop-shadow(0 6px 12px rgba(104,150,16,0.3))"
                  }}
                >
                  Nova Análise
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