'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, ShoppingBag, Calculator, Euro, Zap, Eye, Share2, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { calculateStandardWeight, calculateEnvironmentalImpact, calculateRevenue } from '@/lib/utils';
import { analyzeClothing } from '@/lib/ai-services';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductCard {
  name: string;
  garmentType: string;
  gender: string;
  color: string;
  size: string;
  material: string;
  country: string;
  condition: string;
  estimatedWeight: number;
  environmentalImpact: {
    co2: number;
    water: number;
    resources: number;
  };
  suggestedPrice: number;
  commission: number;
  finalPrice: number;
  aiConfidence: number;
}

export default function SellSectionWithAI({ language = 'pt', t }: { language?: string, t?: any }) {
  const [step, setStep] = useState<'sellerForm' | 'photoUpload' | 'aiProcessing' | 'productPreview' | 'published'>('sellerForm');
  const [sellerData, setSellerData] = useState<any>(null);
  const [sellerError, setSellerError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{garmentPhoto: File | null, labelPhoto: File | null}>({
    garmentPhoto: null,
    labelPhoto: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [productCard, setProductCard] = useState<ProductCard | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    payment: '',
    nif: '',
    terms: false,
  });
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Check if seller already registered (one-time registration)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sellerProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSellerData(parsed);
        setStep('photoUpload');
      }
    }
  }, []);

  // Step 1: One-time seller registration
  const handleFormChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFormCheck = (e: any) => setForm({ ...form, [e.target.name]: e.target.checked });
  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.payment || !form.terms) {
      setSellerError('Preencha todos os campos obrigatórios e aceite os termos.');
      return;
    }
    setSellerData(form);
    localStorage.setItem('sellerProfile', JSON.stringify(form));
    setStep('photoUpload');
    setSellerError('');
  };

  // Step 2: Photo upload (minimum 2 photos: garment + label)
  const handleFileUpload = (type: 'garment' | 'label') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (type === 'garment') {
          setUploadedFiles(prev => ({ ...prev, garmentPhoto: file }));
        } else {
          setUploadedFiles(prev => ({ ...prev, labelPhoto: file }));
        }
      }
    };
    input.click();
  };

  // Step 3: AI processing and autocomplete
  const handleAIAnalysis = async () => {
    if (!uploadedFiles.garmentPhoto || !uploadedFiles.labelPhoto) {
      alert('Por favor, adicione ambas as fotos: prenda e etiqueta');
      return;
    }

    setIsProcessing(true);
    setStep('aiProcessing');

    try {
      // Convert files to base64 for AI analysis
      const garmentBase64 = await fileToBase64(uploadedFiles.garmentPhoto);
      const labelBase64 = await fileToBase64(uploadedFiles.labelPhoto);

      // AI analysis
      const aiResults = await analyzeClothing(garmentBase64, labelBase64);
      
      // Calculate standard weight based on garment type
      const estimatedWeight = calculateStandardWeight(aiResults.garmentType);
      
      // Calculate environmental impact
      const environmentalImpact = calculateEnvironmentalImpact(estimatedWeight);
      
      // Calculate revenue model
      const suggestedPrice = calculateSuggestedPrice(aiResults.garmentType, aiResults.condition);
      const revenueModel = calculateRevenue(suggestedPrice);

      // Create product card
      const productData: ProductCard = {
        name: `${aiResults.garmentType} ${aiResults.color}`,
        garmentType: aiResults.garmentType,
        gender: 'gender' in aiResults && typeof aiResults.gender === 'string' ? aiResults.gender : 'Unissex',
        color: aiResults.color || '',
        size: aiResults.size || '',
        material: aiResults.material || '',
        country: aiResults.country || '',
        condition: aiResults.condition || '',
        estimatedWeight,
        environmentalImpact,
        suggestedPrice,
        commission: revenueModel.commission,
        finalPrice: revenueModel.finalPrice,
        aiConfidence: aiResults.confidence || 0.85
      };

      setProductCard(productData);
      setStep('productPreview');
      
    } catch (error) {
      console.error('Error in AI analysis:', error);
      alert('Erro na análise. Tente novamente.');
      setStep('photoUpload');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Auto-publish to marketplace
  const handlePublishToMarketplace = async () => {
    if (!productCard) return;

    try {
      setIsProcessing(true);
      
      // Upload photos to cloud storage first
      const garmentPhotoUrl = await uploadToCloudinary(uploadedFiles.garmentPhoto!);
      const labelPhotoUrl = await uploadToCloudinary(uploadedFiles.labelPhoto!);

      // Create product in marketplace
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productCard.name,
          garmentType: productCard.garmentType,
          gender: productCard.gender,
          color: productCard.color,
          size: productCard.size,
          material: productCard.material,
          country: productCard.country,
          condition: productCard.condition,
          price: productCard.suggestedPrice,
          sellerName: sellerData.name,
          sellerEmail: sellerData.email,
          sellerPhone: sellerData.phone,
          photo1Url: garmentPhotoUrl,
          photo2Url: labelPhotoUrl,
          aiDetection: productCard,
          aiConfidence: productCard.aiConfidence
        })
      });

      if (response.ok) {
        setStep('published');
        alert(`Produto publicado com sucesso! Preço final: €${productCard.finalPrice} (incluindo comissão de €${productCard.commission})`);
      } else {
        throw new Error('Erro ao publicar produto');
      }
    } catch (error) {
      console.error('Error publishing product:', error);
      alert('Erro ao publicar produto no marketplace');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // TODO: Implement actual Cloudinary upload
    // For now, return a placeholder URL
    return `https://placeholder.com/${file.name}`;
  };

  const calculateSuggestedPrice = (garmentType: string, condition: string): number => {
    const basePrice = {
      'camiseta': 8,
      'camisa': 12,
      'vestido': 20,
      'jeans': 15,
      'casaco': 25,
      'default': 10
    };
    
    const conditionMultiplier = {
      'excelente': 1.2,
      'bom': 1.0,
      'regular': 0.8,
      'deteriorado': 0.6
    };
    
    const base = basePrice[garmentType?.toLowerCase() as keyof typeof basePrice] || basePrice.default;
    const multiplier = conditionMultiplier[condition?.toLowerCase() as keyof typeof conditionMultiplier] || 1.0;
    
    return Math.round(base * multiplier);
  };

  const resetFlow = () => {
    setUploadedFiles({ garmentPhoto: null, labelPhoto: null });
    setProductCard(null);
    setStep('photoUpload');
  };

  // UI Components for each step
  if (step === 'sellerForm') {
    const router = useRouter();
    return (
      <div className="min-h-screen bg-blue-300/80 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-start justify-center gap-20 py-8 md:py-16">
          {/* Columna izquierda: Imagen + botón perfil solo en web */}
          <div className="hidden md:flex flex-col items-center w-[320px]">
            <Image
              src="/NFT/3.png"
              alt="NFT 3"
              width={320}
              height={400}
              className="mb-6 w-full object-contain rounded-xl shadow-xl"
              priority
            />
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-xl font-bold text-base tracking-wide shadow-xl bg-[#D42D66] text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-300"
            >
              Perfil Vendedor
            </button>
          </div>
          {/* Columna derecha: Formulario + botón registro */}
          <div className="flex flex-col items-center w-full md:w-auto max-w-md">
            <div className="w-full max-w-xs md:w-[320px] rounded-xl bg-white/90 shadow-xl flex flex-col items-center justify-center p-4 md:p-6 mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-center mt-2">Registro de Vendedor</h2>
              <p className="text-gray-600 mb-4 text-center">Registro único para começar a vender</p>
              <form id="seller-form" onSubmit={handleFormSubmit} className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">Nome completo</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={form.phone}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">Endereço</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Endereço"
                    value={form.address}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">Método de pagamento</label>
                  <select
                    name="payment"
                    value={form.payment}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                    required
                  >
                    <option value="">Método de pagamento</option>
                    <option value="mbway">MB Way</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank">Transferência bancária</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">NIF (opcional)</label>
                  <input
                    type="text"
                    name="nif"
                    placeholder="NIF (opcional)"
                    value={form.nif}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleFormChange}
                    required
                  />
                  <span>Aceito os termos e condições</span>
                </label>
                {sellerError && (
                  <div className="text-red-600 text-xs text-center">{sellerError}</div>
                )}
                <button
                  type="submit"
                  className="w-full max-w-xs mx-auto py-3 mt-4 rounded-xl font-bold text-base tracking-wide shadow-xl bg-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
                  style={{ letterSpacing: '0.08em' }}
                >
                  Registrarse como vendedor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'photoUpload') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Adicionar Fotos</h2>
        <p className="text-gray-600 mb-6 text-center">Mínimo 2 fotos: prenda + etiqueta</p>
        
        <div className="space-y-4">
          {/* Garment Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Foto da Prenda</h3>
              {uploadedFiles.garmentPhoto ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(uploadedFiles.garmentPhoto)} 
                    alt="Prenda" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-green-600">✓ Foto adicionada</p>
                </div>
              ) : (
                <Button 
                  onClick={() => handleFileUpload('garment')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Adicionar Foto da Prenda
                </Button>
              )}
            </div>
          </div>
          
          {/* Label Photo */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Foto da Etiqueta</h3>
              {uploadedFiles.labelPhoto ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(uploadedFiles.labelPhoto)} 
                    alt="Etiqueta" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-green-600">✓ Foto adicionada</p>
                </div>
              ) : (
                <Button 
                  onClick={() => handleFileUpload('label')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Foto da Etiqueta
                </Button>
              )}
            </div>
          </div>
          
          {uploadedFiles.garmentPhoto && uploadedFiles.labelPhoto && (
            <Button 
              onClick={handleAIAnalysis}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analisar com IA
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'aiProcessing') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto text-center">
        <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">Processando com IA</h2>
        <div className="space-y-2 text-left">
          <p className="text-sm">🔍 Detectando tipo de prenda...</p>
          <p className="text-sm">🏷️ Lendo etiqueta...</p>
          <p className="text-sm">📊 Calculando impacto ambiental...</p>
          <p className="text-sm">💰 Sugerindo preço...</p>
        </div>
      </div>
    );
  }

  if (step === 'productPreview' && productCard) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Pré-visualização do Produto</h2>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold">{productCard.name}</h3>
            <p className="text-gray-600">{productCard.size} | {productCard.material}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tipo:</span> {productCard.garmentType}
            </div>
            <div>
              <span className="font-medium">Cor:</span> {productCard.color}
            </div>
            <div>
              <span className="font-medium">Condição:</span> {productCard.condition}
            </div>
            <div>
              <span className="font-medium">País:</span> {productCard.country}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Impacto Ambiental</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-medium">{productCard.environmentalImpact.co2} kg</div>
                <div className="text-green-600">CO₂</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{productCard.environmentalImpact.water} L</div>
                <div className="text-green-600">Água</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{productCard.environmentalImpact.resources}%</div>
                <div className="text-green-600">Recursos</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Preço Sugerido</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">€{productCard.suggestedPrice}</div>
              <div className="text-sm text-gray-600">
                + €{productCard.commission} comissão = €{productCard.finalPrice} total
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              Confiança da IA: {Math.round(productCard.aiConfidence * 100)}%
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handlePublishToMarketplace}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isProcessing}
              >
                {isProcessing ? 'Publicando...' : 'Publicar no Marketplace'}
              </Button>
              <Button 
                variant="outline"
                onClick={resetFlow}
                className="flex-1"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'published') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-green-800">Produto Publicado!</h2>
        <p className="text-gray-600 mb-6">
          Seu produto foi publicado automaticamente no marketplace e está disponível para compra.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={resetFlow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Adicionar Outro Produto
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/marketplace'}
            className="w-full"
          >
            Ver no Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return null;
} 