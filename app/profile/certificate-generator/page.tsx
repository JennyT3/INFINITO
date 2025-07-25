import * as React from "react"
import InfinitoCertificateGenerator from '../../../components/InfinitoCertificateGenerator';
import { useLanguage } from '../../../components/theme-provider';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CertificateGeneratorPage() {
	const mockContribution = {
		tracking: "MOCK123",
		nome: "Usuario Demo",
		classification: "Reciclaje",
		destination: "Fábrica",
		co2Saved: 10,
		waterSaved: 100,
		naturalResources: 5
	};
	return <InfinitoCertificateGenerator contributionData={mockContribution} />;
} 