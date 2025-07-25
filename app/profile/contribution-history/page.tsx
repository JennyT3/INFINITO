"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../components/theme-provider';
import { 
  ArrowLeft, Heart, Share2, Calendar, Package, CheckCircle, 
  Award, Download, Trophy, Filter, Search, Clock, Shield, Hash
} from 'lucide-react';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useTranslation } from '../../../hooks/useTranslation';
import InfinitoCertificateGenerator from '../../../components/InfinitoCertificateGenerator';

const appBackground = {
  backgroundColor: '#EDE4DA',
  backgroundImage: `
    radial-gradient(circle at 20% 50%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(120, 119, 108, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(120, 119, 108, 0.08) 1px, transparent 1px),
    radial-gradient(circle at 0% 100%, rgba(120, 119, 108, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px),
    linear-gradient(0deg, rgba(120, 119, 108, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '20px 20px, 25px 25px, 30px 30px, 35px 35px, 15px 15px, 15px 15px',
};

// Tracking states according to INFINITO definition
const TRACKING_STATES = {
  'pendiente': { 
    label: 'Pendiente', 
    color: 'bg-gray-100 text-gray-700', 
    icon: <Clock className="w-4 h-4" />,
    description: 'Aguardando processamento'
  },
  'entregado': { 
    label: 'Entregado ✓', 
    color: 'bg-blue-100 text-blue-700', 
    icon: <Package className="w-4 h-4" />,
    description: 'Prenda entregue e recebida'
  },
  'verificado': { 
    label: 'Verificado ✓', 
    color: 'bg-yellow-100 text-yellow-700', 
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'Processado e classificado pelo admin'
  },
  'certificado_disponible': { 
    label: 'Certificado Disponível ✓', 
    color: 'bg-green-100 text-green-700', 
    icon: <Award className="w-4 h-4" />,
    description: 'Certificado digital com hash SHA-256 pronto'
  }
} as const;

// Classification according to INFINITO definition
const CLASSIFICATIONS = {
  'reutilizable': { 
    label: 'Reutilizable', 
    color: 'bg-green-100 text-green-800',
    destination: 'Marketplace ou Doação'
  },
  'reparable': { 
    label: 'Reparable', 
    color: 'bg-yellow-100 text-yellow-800',
    destination: 'Artistas locais'
  },
  'reciclable': { 
    label: 'Reciclable', 
    color: 'bg-blue-100 text-blue-800',
    destination: 'Centros de reciclagem'
  }
} as const;

interface Contribution {
  id: string;
  tracking: string;
  tipo: string;
  nome: string;
  fecha: string;
  detalles: string;
  trackingState: string;
  classification?: string;
  destination?: string;
  co2Saved?: number;
  waterSaved?: number;
  naturalResources?: number;
  certificateHash?: string;
  certificateDate?: string;
  points?: number;
  verified?: boolean;
}

export default function ContributionHistoryPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [showCertificateGenerator, setShowCertificateGenerator] = useState(false);
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const avatar = typeof window !== 'undefined' && localStorage.getItem('userAvatar')
    ? String(localStorage.getItem('userAvatar'))
    : '/avatar1.svg';
  const userName = typeof window !== 'undefined' && localStorage.getItem('userName')
    ? String(localStorage.getItem('userName'))
    : 'Usuário';

  // Load contributions from API
  useEffect(() => {
    const loadContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/contributions/me', { credentials: 'include' });
        
        if (response.ok) {
          const data = await response.json();
          setContributions(data);
        } else {
          setError('Erro ao carregar contribuições');
        }
      } catch (err) {
        console.error('Error loading contributions:', err);
        setError('Erro ao carregar contribuições');
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: 'Histórico de Contribuições INFINITO', url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  const handleContributionClick = (contribution: Contribution) => {
    setIsAnimating(true);
    setSelectedContribution(contribution);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleGenerateCertificate = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowCertificateGenerator(true);
  };

  const filteredContributions = contributions.filter(contrib => {
    const matchesFilter = filter === 'todos' || contrib.trackingState === filter;
    const matchesSearch = contrib.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrib.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contrib.detalles.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPoints = contributions.reduce((sum, contrib) => sum + (contrib.points || 0), 0);
  const totalCO2 = contributions.reduce((sum, contrib) => sum + (contrib.co2Saved || 0), 0);
  const totalWater = contributions.reduce((sum, contrib) => sum + (contrib.waterSaved || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={appBackground}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={appBackground}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-raleway" style={appBackground}>
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-6">
          <button 
            onClick={() => router.push('/profile')} 
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 tracking-wider">Histórico de Contribuições</h1>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Share2 className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Profile Summary */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{userName}</h2>
              <p className="text-sm text-gray-600">{contributions.length} contribuições</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{totalCO2.toFixed(1)}</div>
              <div className="text-xs text-gray-600">kg CO₂</div>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{totalWater.toFixed(0)}</div>
              <div className="text-xs text-gray-600">L Água</div>
            </div>
            <div className="bg-white/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
              <div className="text-xs text-gray-600">Pontos</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar contribuições..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="entregado">Entregado</option>
            <option value="verificado">Verificado</option>
            <option value="certificado_disponible">Certificado</option>
          </select>
        </div>

        {/* Contributions List */}
        <div className="space-y-4 mb-20">
          {filteredContributions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">Nenhuma contribuição encontrada</div>
              <button 
                onClick={() => router.push('/contribuir')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fazer Primeira Contribuição
              </button>
            </div>
          ) : (
            filteredContributions.map((contrib) => (
              <div 
                key={contrib.id}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                onClick={() => handleContributionClick(contrib)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-800">{contrib.tracking}</div>
                      <div className="text-xs text-gray-600">{contrib.tipo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(contrib.fecha).toLocaleDateString('pt-PT')}
                    </div>
                    <div className="text-xs text-gray-600">
                      {contrib.points || 0} pontos
                    </div>
                  </div>
                </div>

                {/* Tracking State */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    {TRACKING_STATES[contrib.trackingState as keyof typeof TRACKING_STATES]?.icon}
                    <span className={`text-xs px-2 py-1 rounded-full ${TRACKING_STATES[contrib.trackingState as keyof typeof TRACKING_STATES]?.color}`}>
                      {TRACKING_STATES[contrib.trackingState as keyof typeof TRACKING_STATES]?.label || contrib.trackingState}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {TRACKING_STATES[contrib.trackingState as keyof typeof TRACKING_STATES]?.description}
                  </div>
                </div>

                {/* Classification */}
                {contrib.classification && (
                  <div className="mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${CLASSIFICATIONS[contrib.classification as keyof typeof CLASSIFICATIONS]?.color}`}>
                      {CLASSIFICATIONS[contrib.classification as keyof typeof CLASSIFICATIONS]?.label}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Destino: {CLASSIFICATIONS[contrib.classification as keyof typeof CLASSIFICATIONS]?.destination}
                    </div>
                  </div>
                )}

                {/* Environmental Impact */}
                {contrib.verified && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">{contrib.co2Saved || 0}</div>
                      <div className="text-xs text-gray-600">kg CO₂</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">{contrib.waterSaved || 0}</div>
                      <div className="text-xs text-gray-600">L Água</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">{contrib.naturalResources || 0}%</div>
                      <div className="text-xs text-gray-600">Recursos</div>
                    </div>
                  </div>
                )}

                {/* Certificate Hash */}
                {contrib.certificateHash && (
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <div className="text-xs text-gray-600 font-mono">
                      {contrib.certificateHash.substring(0, 16)}...
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {contrib.detalles}
                  </div>
                  {contrib.trackingState === 'certificado_disponible' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateCertificate(contrib);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Certificado
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Certificate Generator Modal */}
        {showCertificateGenerator && selectedContribution && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Certificado Digital</h3>
                <button 
                  onClick={() => setShowCertificateGenerator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <InfinitoCertificateGenerator 
                contributionData={selectedContribution}
                onCertificateGenerated={() => {
                  setShowCertificateGenerator(false);
                  alert('Certificado gerado com sucesso!');
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigationMenu />
    </div>
  );
} 