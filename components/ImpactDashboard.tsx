import React from 'react';
import { TrendingUp, AlertTriangle, Info, ShoppingBag, Package } from 'lucide-react';

interface ImpactData {
  totalCo2Saved: number;
  totalWaterSaved: number;
  totalContributions: number;
  totalPurchases: number;
  uncertainty: string;
  methodology: string;
  reboundEffect: {
    netImpact: 'positive' | 'negative';
    netContributions: number;
    recommendation: string;
  };
}

interface ImpactDashboardProps {
  data: ImpactData;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ data }) => {
  const {
    totalCo2Saved,
    totalWaterSaved,
    totalContributions,
    totalPurchases,
    uncertainty,
    methodology,
    reboundEffect
  } = data;

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/70 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">Teu Impacto Ambiental</h3>
      </div>

      {/* Métricas principais com incerteza */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">CO₂ Poupado</span>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{uncertainty}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">{totalCo2Saved.toFixed(1)}</span>
            <span className="text-sm text-gray-500">kg</span>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Água Poupada</span>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{uncertainty}</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600">{totalWaterSaved}</span>
            <span className="text-sm text-gray-500">L</span>
          </div>
        </div>
      </div>

      {/* Rebound Effect Analysis */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className={`w-5 h-5 ${reboundEffect.netImpact === 'positive' ? 'text-green-500' : 'text-orange-500'}`} />
          <h4 className="font-bold text-gray-800">Análise de Impacto Líquido</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-green-600" />
            <div>
              <span className="text-xs text-gray-500">Contribuído</span>
              <div className="font-bold text-green-600">{totalContributions}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-xs text-gray-500">Comprado</span>
              <div className="font-bold text-blue-600">{totalPurchases}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Balanço Líquido</span>
            <div className={`font-bold ${reboundEffect.netImpact === 'positive' ? 'text-green-600' : 'text-orange-600'}`}>
              {reboundEffect.netContributions > 0 ? '+' : ''}{reboundEffect.netContributions.toFixed(1)} peças
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${reboundEffect.netImpact === 'positive' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
        </div>

        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">{reboundEffect.recommendation}</p>
        </div>
      </div>

      {/* Metodologia e transparência */}
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Metodologia</span>
        </div>
        <div className="text-xs text-gray-600">
          <p className="mb-1">Cálculo baseado em: {methodology}</p>
          <p className="mb-1">Incerteza: {uncertainty}</p>
          <p>Fator de reemplazo: 70% (factor de reposição típico)</p>
        </div>
      </div>

      {/* Equivalências contextuais */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-700">
            {Math.round(totalCo2Saved / 21.77)}
          </div>
          <div className="text-xs text-green-600">árvores equivalentes</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-700">
            {Math.round(totalWaterSaved / 8)}
          </div>
          <div className="text-xs text-blue-600">banhos de duche</div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard; 