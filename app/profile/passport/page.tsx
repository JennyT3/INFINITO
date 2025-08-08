"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/theme-provider';
import BottomNavigationMenu from '@/components/BottomNavigationMenu';
import EnvironmentalPassport from '@/components/environmental-passport';

export default function PassportPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Handler for the back button in the passport
  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <>
      <EnvironmentalPassport onBack={handleBack} />
      <BottomNavigationMenu />
      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4 text-center font-medium">
          {error}
        </div>
      )}
    </>
  );
} 