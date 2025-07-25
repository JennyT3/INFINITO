"use client";
import React, { useState } from 'react';
import { QrCode, Download, FileText, Heart, Recycle, Droplets, Leaf, Car, Edit3, Save, RefreshCw, Share2, Shield, CheckCircle, Hash, Clock } from 'lucide-react';
import { generateCertificateHash } from '@/lib/utils';

interface CertificateData {
  tracking: string;
  nome: string;
  classification: string;
  destination: string;
  impacto: {
    co2: number;
    water: number;
    resources: number;
  };
  timestamp: string;
  certificateHash: string;
  admin: string;
}

interface InfinitoCertificateGeneratorProps {
  contributionData: any;
  onCertificateGenerated?: (certificateData: CertificateData) => void;
}

export default function InfinitoCertificateGenerator({ 
  contributionData, 
  onCertificateGenerated 
}: InfinitoCertificateGeneratorProps) {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async () => {
    setIsGenerating(true);
    
    try {
      const timestamp = new Date().toISOString();
      const impactData = {
        co2: contributionData.co2Saved || 0,
        water: contributionData.waterSaved || 0,
        resources: contributionData.naturalResources || 0
      };

      const certificateContent = {
        tracking: contributionData.tracking,
        nome: contributionData.nome,
        classification: contributionData.classification,
        destination: contributionData.destination,
        impacto: impactData,
        timestamp,
        admin: 'admin@infinito.me'
      };

      // Generate SHA-256 hash
      const hash = await generateCertificateHash(certificateContent);
      
      const finalCertificate: CertificateData = {
        ...certificateContent,
        certificateHash: hash
      };

      setCertificateData(finalCertificate);
      onCertificateGenerated?.(finalCertificate);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Erro ao gerar certificado');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCertificate = () => {
    if (!certificateData) return;
    
    const certificateContent = `
INFINITO - CERTIFICADO DIGITAL DE CONTRIBUIÇÃO
==============================================

CÓDIGO ÚNICO: ${certificateData.tracking}
CONTRIBUIDOR: ${certificateData.nome}
DATA: ${new Date(certificateData.timestamp).toLocaleDateString('pt-PT')}

CLASSIFICAÇÃO: ${certificateData.classification.toUpperCase()}
DESTINO: ${certificateData.destination}

IMPACTO AMBIENTAL VERIFICADO:
- CO₂ poupado: ${certificateData.impacto.co2} kg
- Água poupada: ${certificateData.impacto.water} L
- Recursos conservados: ${certificateData.impacto.resources}%

CERTIFICAÇÃO DIGITAL:
- Hash SHA-256: ${certificateData.certificateHash}
- Timestamp: ${certificateData.timestamp}
- Verificado por: ${certificateData.admin}

Este certificado comprova o impacto real da sua contribuição 
para a economia circular têxtil.

Verificação disponível em: https://infinito.me/verify/${certificateData.certificateHash}

© INFINITO - Plataforma de Economia Circular Têxtil
`;

    const element = document.createElement('a');
    const file = new Blob([certificateContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `INFINITO_${certificateData.tracking}_Certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareCertificate = () => {
    if (!certificateData) return;
    
    const shareUrl = `https://infinito.me/verify/${certificateData.certificateHash}`;
    const shareText = `Contribuí para a economia circular têxtil! Veja o meu certificado digital com impacto real verificado: ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Certificado INFINITO',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-gray-200 shadow-lg">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificado Digital INFINITO</h2>
        <p className="text-gray-600">Certificação com hash SHA-256 + timestamp</p>
      </div>

      {!certificateData ? (
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Dados da Contribuição</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Código:</span> {contributionData.tracking}
              </div>
              <div>
                <span className="font-medium">Contribuidor:</span> {contributionData.nome}
              </div>
              <div>
                <span className="font-medium">Classificação:</span> {contributionData.classification}
              </div>
              <div>
                <span className="font-medium">Destino:</span> {contributionData.destination}
              </div>
              <div>
                <span className="font-medium">CO₂ poupado:</span> {contributionData.co2Saved || 0} kg
              </div>
              <div>
                <span className="font-medium">Água poupada:</span> {contributionData.waterSaved || 0} L
              </div>
            </div>
          </div>
          
          <button
            onClick={generateCertificate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Gerando certificado...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                Gerar Certificado Digital
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-800">Certificado Gerado</h3>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Hash SHA-256:</div>
                  <div className="text-sm font-mono text-gray-600 break-all">
                    {certificateData.certificateHash}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Timestamp:</div>
                  <div className="text-sm text-gray-600">
                    {new Date(certificateData.timestamp).toLocaleString('pt-PT')}
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium mb-2">Impacto Verificado:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{certificateData.impacto.co2} kg</div>
                    <div className="text-gray-600">CO₂</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{certificateData.impacto.water} L</div>
                    <div className="text-gray-600">Água</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{certificateData.impacto.resources}%</div>
                    <div className="text-gray-600">Recursos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={downloadCertificate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Descarregar
            </button>
            
            <button
              onClick={shareCertificate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Partilhar
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Certificado verificável em: 
            <a 
              href={`https://infinito.me/verify/${certificateData.certificateHash}`}
              className="text-blue-600 hover:underline ml-1"
            >
              infinito.me/verify/{certificateData.certificateHash.substring(0, 8)}...
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 