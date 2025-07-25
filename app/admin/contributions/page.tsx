"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Download, Upload, Edit, Filter, Calculator, CheckCircle, Package, Recycle, Palette, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calculateStandardWeight, calculateEnvironmentalImpact, generateCertificateHash } from "@/lib/utils";
import jsPDF from "jspdf";
import * as React from "react";

const TABS = [
  { key: "ropa", label: "Roupas" },
  { key: "arte", label: "Arte" },
  { key: "reciclaje", label: "Reciclagem" },
  { key: "solicitudes", label: "Solicitações de Roupa" },
];

// Classification options according to INFINITO definition
const CLASSIFICATION_OPTIONS = [
  { 
    key: "reutilizable", 
    label: "Reutilizable", 
    description: "Prenda em bom estado → Marketplace ou Doação",
    color: "bg-green-100 text-green-800",
    icon: <Package className="w-4 h-4" />
  },
  { 
    key: "reparable", 
    label: "Reparable", 
    description: "Prenda com pequenos defeitos → Artistas locais",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Palette className="w-4 h-4" />
  },
  { 
    key: "reciclable", 
    label: "Reciclable", 
    description: "Prenda deteriorada → Centros de reciclagem",
    color: "bg-blue-100 text-blue-800",
    icon: <Recycle className="w-4 h-4" />
  }
];

// Tracking states according to INFINITO definition
const TRACKING_STATES = [
  { key: "pendiente", label: "Pendiente", color: "bg-gray-100 text-gray-800" },
  { key: "entregado", label: "Entregado ✓", color: "bg-blue-100 text-blue-800" },
  { key: "verificado", label: "Verificado ✓", color: "bg-yellow-100 text-yellow-800" },
  { key: "certificado_disponible", label: "Certificado disponível ✓", color: "bg-green-100 text-green-800" }
];

export default function AdminContributionsPage() {
  const [tab, setTab] = useState("ropa");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string|null>(null);
  const [contribs, setContribs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingModal, setProcessingModal] = useState<any>(null);
  const [calculatorData, setCalculatorData] = useState({
    type: '',
    material: '',
    weight: '',
    condition: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const loadContributions = async () => {
    try {
      const response = await fetch('/api/contributions');
      const data = await response.json();
      setContribs(data);
    } catch (error) {
      console.error('Error loading contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
  }, []);

  const handleProcessContribution = (contrib: any) => {
    setProcessingModal(contrib);
    setCalculatorData({
      type: contrib.tipo || '',
      material: '',
      weight: '',
      condition: ''
    });
  };

  const handleCalculateImpact = () => {
    const weight = parseFloat(calculatorData.weight) || 0;
    const impact = calculateEnvironmentalImpact(weight);
    return impact;
  };

  const handleClassifyContribution = async (classification: string) => {
    if (!processingModal) return;
    
    try {
      const impact = handleCalculateImpact();
      const updatedData = {
        ...processingModal,
        trackingState: 'verificado',
        classification,
        destination: getDestinationForClassification(classification),
        co2Saved: impact.co2,
        waterSaved: impact.water,
        naturalResources: impact.resources,
        verified: true
      };
      
      // Update contribution
      const response = await fetch(`/api/contributions/${processingModal.tracking}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        setProcessingModal(null);
        loadContributions();
        alert('Contribuição processada com sucesso!');
      }
    } catch (error) {
      console.error('Error processing contribution:', error);
      alert('Erro ao processar contribuição');
    }
  };

  const getDestinationForClassification = (classification: string) => {
    switch (classification) {
      case 'reutilizable': return 'marketplace';
      case 'reparable': return 'artistas';
      case 'reciclable': return 'reciclaje';
      default: return 'pending';
    }
  };

  const handleGenerateCertificate = async (contrib: any) => {
    try {
      const certificateData = {
        tracking: contrib.tracking,
        nome: contrib.nome,
        classification: contrib.classification,
        impacto: {
          co2: contrib.co2Saved,
          water: contrib.waterSaved,
          resources: contrib.naturalResources
        },
        timestamp: new Date().toISOString()
      };
      
      const hash = await generateCertificateHash(certificateData);
      
      // Update contribution with certificate
      const response = await fetch(`/api/contributions/${contrib.tracking}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contrib,
          trackingState: 'certificado_disponible',
          certificateHash: hash,
          certificateDate: new Date()
        })
      });
      
      if (response.ok) {
        loadContributions();
        alert('Certificado gerado com sucesso!');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Erro ao gerar certificado');
    }
  };

  const filtered = contribs.filter(c => 
    c.tracking?.toLowerCase().includes(search.toLowerCase()) ||
    c.nome?.toLowerCase().includes(search.toLowerCase()) ||
    c.tipo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/admin')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin - Processar Contribuições</h1>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar contribuições..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Carregando contribuições...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma contribuição encontrada
                    </td>
                  </tr>
                ) : (
                  filtered.map((contrib) => (
                    <tr key={contrib.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{contrib.tracking}</div>
                        <div className="text-sm text-gray-500">{new Date(contrib.fecha).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contrib.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contrib.tipo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          TRACKING_STATES.find(s => s.key === contrib.trackingState)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {TRACKING_STATES.find(s => s.key === contrib.trackingState)?.label || contrib.trackingState}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contrib.classification ? (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            CLASSIFICATION_OPTIONS.find(c => c.key === contrib.classification)?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {CLASSIFICATION_OPTIONS.find(c => c.key === contrib.classification)?.label || contrib.classification}
                          </span>
                        ) : (
                          <span className="text-gray-400">Pendente</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {contrib.trackingState === 'pendiente' && (
                            <button
                              onClick={() => handleProcessContribution(contrib)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            >
                              <Calculator className="w-4 h-4" />
                              Processar
                            </button>
                          )}
                          {contrib.trackingState === 'verificado' && (
                            <button
                              onClick={() => handleGenerateCertificate(contrib)}
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Gerar Certificado
                            </button>
                          )}
                          {contrib.trackingState === 'certificado_disponible' && (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Completo
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing Modal */}
        <Dialog open={!!processingModal} onOpenChange={() => setProcessingModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Processar Contribuição - {processingModal?.tracking}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Calculadora Ambiental */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculadora Ambiental
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <input
                      type="text"
                      value={calculatorData.type}
                      onChange={(e) => setCalculatorData({...calculatorData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <input
                      type="text"
                      value={calculatorData.material}
                      onChange={(e) => setCalculatorData({...calculatorData, material: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={calculatorData.weight}
                      onChange={(e) => setCalculatorData({...calculatorData, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condição</label>
                    <select
                      value={calculatorData.condition}
                      onChange={(e) => setCalculatorData({...calculatorData, condition: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecionar...</option>
                      <option value="excelente">Excelente</option>
                      <option value="bom">Bom</option>
                      <option value="regular">Regular</option>
                      <option value="deteriorado">Deteriorado</option>
                    </select>
                  </div>
                </div>
                
                {/* Impact Preview */}
                {calculatorData.weight && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Impacto Calculado:</h4>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="text-sm">
                        <div className="font-medium">CO₂</div>
                        <div className="text-blue-600">{handleCalculateImpact().co2} kg</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Água</div>
                        <div className="text-blue-600">{handleCalculateImpact().water} L</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Recursos</div>
                        <div className="text-blue-600">{handleCalculateImpact().resources}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Classificação */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Classificação da Prenda</h3>
                <div className="space-y-3">
                  {CLASSIFICATION_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleClassifyContribution(option.key)}
                      className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-left transition-colors ${option.color}`}
                    >
                      <div className="flex items-center gap-3">
                        {option.icon}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm opacity-75">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 