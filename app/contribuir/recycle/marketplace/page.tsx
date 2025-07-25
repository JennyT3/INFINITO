"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarketplaceRecyclePage() {
	const router = useRouter();
	return (
		<div className="min-h-screen font-raleway flex flex-col items-center justify-center" style={{ backgroundColor: '#EDE4DA', backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover' }}>
			<button onClick={() => router.back()} className="absolute top-6 left-6 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 backdrop-blur-sm">
				<ArrowLeft className="w-5 h-5 text-gray-600" />
			</button>
			<div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-8 max-w-md w-full flex flex-col items-center">
				<h1 className="font-bold text-2xl text-gray-800 mb-2">Marketplace com Impacto Certificado</h1>
				<p className="text-gray-600 text-center mb-6">Em breve poderá descobrir e adquirir produtos reciclados com impacto ambiental certificado.</p>
			</div>
		</div>
	);
} 