"use client";
import { useState } from 'react';
import { ArrowLeft, Download, CheckCircle, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useTranslation } from '../../../hooks/useTranslation';
import InfinitoCertificateGenerator from '../../../components/InfinitoCertificateGenerator';

export default function ContributionHistory() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);

  // Simplified contributions data
  const contributions = [
    {
      id: 1,
      date: '2025-01-15',
      items: ['T-shirt', 'Jeans'],
      status: 'verified',
      impact: { co2: 2.5, water: 1200 }
    },
    {
      id: 2,
      date: '2025-01-10',
      items: ['Dress'],
      status: 'delivered',
      impact: { co2: 1.8, water: 800 }
    }
  ];

  const handleDownloadCertificate = (contribution: any) => {
    setSelectedContribution(contribution);
    setShowCertificate(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">{t('contributions')}</h1>
        </div>
      </div>

      {/* Contributions List */}
      <div className="p-4 space-y-4">
        {contributions.map((contribution) => (
          <div key={contribution.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{contribution.items.join(', ')}</p>
                <p className="text-sm text-gray-500">{contribution.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm capitalize">{contribution.status}</span>
              </div>
            </div>

            {/* Impact */}
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              <span>CO₂: {contribution.impact.co2}kg</span>
              <span>Water: {contribution.impact.water}L</span>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleDownloadCertificate(contribution)}
              className="flex items-center gap-2 text-blue-600 text-sm"
            >
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
          </div>
        ))}
      </div>

      {/* Certificate Generator */}
      {showCertificate && selectedContribution && (
        <InfinitoCertificateGenerator
          contributionData={selectedContribution}
          onClose={() => setShowCertificate(false)}
        />
      )}

      <BottomNavigationMenu />
    </div>
  );
}
