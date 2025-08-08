'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
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
	aiConfidence: number;
}

export default function SellSectionWithAI({ tracking }: { tracking: string }) {
	const [step, setStep] = useState<'register' | 'photos' | 'processing' | 'preview' | 'published'>('register');
	const [seller, setSeller] = useState<any>(null);
	const [error, setError] = useState('');
	const [files, setFiles] = useState<{garment: File|null, label: File|null}>({ garment: null, label: null });
	const [isProcessing, setIsProcessing] = useState(false);
	const [product, setProduct] = useState<ProductCard|null>(null);
	const [userPrice, setUserPrice] = useState<string>('');
	const [form, setForm] = useState({ name: '', email: '', phone: '', payment: '', terms: false });
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('sellerProfile');
			if (saved) {
				setSeller(JSON.parse(saved));
				setStep('photos');
			}
		}
	}, []);

	const handleFormChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
	const handleFormSubmit = (e: any) => {
		e.preventDefault();
		if (!form.name || !form.email || !form.phone || !form.payment || !form.terms) {
			setError('Please fill all required fields and accept the terms.');
			return;
		}
		setSeller(form);
		localStorage.setItem('sellerProfile', JSON.stringify(form));
		setStep('photos');
		setError('');
	};

	const handleFileUpload = (type: 'garment' | 'label') => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (e: any) => {
			const file = e.target.files[0];
			if (file) setFiles(prev => ({ ...prev, [type]: file }));
		};
		input.click();
	};

	const handleAIAnalysis = async () => {
		if (!files.garment || !files.label) {
			setError('Please add both photos.');
			return;
		}
		setIsProcessing(true);
		setStep('processing');
		setTimeout(() => {
					// Simulación de análisis AI
		const productData: ProductCard = {
			name: 'T-Shirt Blue',
			garmentType: 'T-Shirt',
			gender: 'Unisex',
			color: 'Blue',
			size: 'M',
			material: 'Organic Cotton',
			country: 'Portugal',
			condition: 'Good',
			estimatedWeight: 0.3,
			environmentalImpact: { co2: 2, water: 500, resources: 80 },
			aiConfidence: 0.92
		};
			setProduct(productData);
			setStep('preview');
			setIsProcessing(false);
		}, 1800);
	};

	const handlePublish = async () => {
		console.log('🔍 Debug: Starting handlePublish');
		console.log('🔍 Debug: product =', product);
		console.log('🔍 Debug: seller =', seller);
		console.log('🔍 Debug: form =', form);
		console.log('🔍 Debug: tracking =', tracking);

		if (!product) {
			setError('No product data available. Please complete the AI analysis first.');
			return;
		}
		
		// Validación del precio ingresado por el usuario
		if (!userPrice || parseFloat(userPrice) <= 0) {
			setError('Please enter a valid price for your product.');
			return;
		}
		
		// Validación mejorada del tracking
		if (!tracking || tracking.trim().length === 0) {
			setError('A contribution tracking code is required to publish this product.');
			return;
		}

		// Verificar que el tracking existe en la base de datos
		try {
			const trackingResponse = await fetch(`/api/contributions?tracking=${tracking.trim()}`);
			if (!trackingResponse.ok) {
				setError('Error verifying contribution tracking code.');
				return;
			}

			const trackingData = await trackingResponse.json();
			const contributions = trackingData.data || trackingData;

			if (!contributions || contributions.length === 0) {
				setError('Invalid contribution tracking code. Please use a valid contribution code.');
				return;
			}

			const contribution = contributions[0];
			
			// Verificar que la contribución es de tipo "clothing" y tiene estado válido
			if (contribution.tipo !== 'clothing') {
				setError('This tracking code is not for a clothing contribution. Only clothing contributions can be sold.');
				return;
			}

			if (contribution.estado === 'pendiente') {
				setError('This contribution is still pending. Products can only be published for received contributions.');
				return;
			}

			// Preparar el payload con validaciones adicionales
			const payload = {
				name: product.name,
				garmentType: product.garmentType,
				gender: product.gender,
				color: product.color,
				size: product.size,
				material: product.material,
				country: product.country,
				condition: product.condition,
				tracking: tracking.trim(),
				price: Number(product.suggestedPrice) || 15.0, // Asegurar que es un número válido
				originalPrice: Number(product.suggestedPrice) || 15.0,
				commission: Number(product.commission) || 0,
				finalPrice: Number(product.finalPrice) || Number(product.suggestedPrice) || 15.0,
				sellerName: seller?.name || form.name || 'Anonymous Seller',
				sellerEmail: seller?.email || form.email || '',
				sellerPhone: seller?.phone || form.phone || '',
				estimatedWeight: Number(product.estimatedWeight) || 0.25,
				standardImpact: {
					co2: Number(product.environmentalImpact?.co2) || 0,
					water: Number(product.environmentalImpact?.water) || 0,
					resources: Number(product.environmentalImpact?.resources) || 0
				},
				aiDetection: product.name,
				aiConfidence: Number(product.aiConfidence) || 0.9,
				photo1Url: files.garment ? URL.createObjectURL(files.garment) : '',
				photo2Url: files.label ? URL.createObjectURL(files.label) : '',
				photo3Url: '',
				impactCo2: (Number(product.environmentalImpact?.co2) || 0).toString(),
				impactWater: (Number(product.environmentalImpact?.water) || 0).toString(),
				impactEff: (Number(product.environmentalImpact?.resources) || 0).toString() + '%',
				status: 'pending',
				publishedAt: null
			};

			console.log('📦 Debug: Final payload =', payload);
			console.log('💰 Debug: price field =', payload.price);

			const res = await fetch('/api/products', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const errorData = await res.json();
				console.error('❌ API Error Response:', errorData);
				throw new Error(errorData.message || 'Error publishing product');
			}

			const result = await res.json();
			console.log('✅ Product published successfully:', result);

			setStep('published');
			setError(''); // Limpiar errores anteriores
		} catch (err) {
			console.error('💥 Error publishing product:', err);
			setError(err instanceof Error ? err.message : 'Failed to publish product. Please try again.');
		}
	};

	const resetFlow = () => {
		setFiles({ garment: null, label: null });
		setProduct(null);
		setStep('photos');
	};

	// --- UI ---
	if (step === 'register') {
		return (
			<div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 animate-float-card">
				<h2 className="text-2xl font-bold mb-2 text-center">Seller Registration</h2>
				<p className="text-gray-600 mb-6 text-center">One-time registration to start selling</p>
				<form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
					<input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleFormChange} className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base" required />
					<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base" required />
					<input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base" required />
					<select name="payment" value={form.payment} onChange={handleFormChange} className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base" required>
						<option value="">Select Payment Method</option>
						<option value="mbway">MB Way</option>
						<option value="bank">Bank Transfer</option>
						<option value="card">Card</option>
					</select>
					<label className="flex items-center gap-2 text-sm">
						<input type="checkbox" name="terms" checked={form.terms} onChange={handleFormChange} required />
						<span>I accept the terms and conditions</span>
					</label>
					{error && <div className="text-red-600 text-sm text-center">{error}</div>}
					<Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Register</Button>
				</form>
			</div>
		);
	}

	if (step === 'photos') {
		return (
			<div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 animate-float-card">
				<h2 className="text-2xl font-bold mb-2 text-center">Add Photos</h2>
				<p className="text-gray-600 mb-6 text-center">Minimum 2 photos: item and label</p>
				


				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<span className="font-semibold">Item Photo</span>
						{files.garment ? (
							<img src={URL.createObjectURL(files.garment)} alt="Item" className="w-32 h-32 object-cover rounded-xl border-2 border-green-400 shadow" />
						) : (
							<Button onClick={() => handleFileUpload('garment')} className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-full py-3 rounded-xl font-bold shadow hover:scale-105 transition-all">
								<Camera className="w-5 h-5 mr-2" /> Add Item Photo
							</Button>
						)}
					</div>
					<div className="flex flex-col items-center gap-2">
						<span className="font-semibold">Label Photo</span>
						{files.label ? (
							<img src={URL.createObjectURL(files.label)} alt="Label" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-400 shadow" />
						) : (
							<Button onClick={() => handleFileUpload('label')} className="bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-3 rounded-xl font-bold shadow hover:scale-105 transition-all">
								<Upload className="w-5 h-5 mr-2" /> Add Label Photo
							</Button>
						)}
					</div>
					{files.garment && files.label && (
						<Button onClick={handleAIAnalysis} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide flex items-center justify-center gap-2">
							<Sparkles className="w-5 h-5" /> Analyze with AI
						</Button>
					)}
					{error && <div className="text-red-600 text-sm text-center">{error}</div>}
				</div>
			</div>
		);
	}

	if (step === 'processing') {
		return (
			<div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 animate-float-card text-center flex flex-col items-center">
				<div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
				<h2 className="text-2xl font-bold mb-2">Analyzing with AI...</h2>
				<p className="text-gray-600 mb-2">Detecting item type, reading label, calculating impact, suggesting price...</p>
			</div>
		);
	}

	if (step === 'preview' && product) {
		return (
			<div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 animate-float-card">
				<h2 className="text-2xl font-bold mb-4 text-center">Product Preview</h2>
				


				<div className="flex flex-col gap-4">
					<div className="text-center">
						<span className="text-xl font-semibold">{product.name}</span>
						<p className="text-gray-600">{product.size} | {product.material}</p>
					</div>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div><span className="font-medium">Type:</span> {product.garmentType}</div>
						<div><span className="font-medium">Color:</span> {product.color}</div>
						<div><span className="font-medium">Condition:</span> {product.condition}</div>
						<div><span className="font-medium">Country:</span> {product.country}</div>
					</div>
					<div className="bg-green-50 rounded-lg p-4">
						<h4 className="font-semibold text-green-800 mb-2">Environmental Impact</h4>
						<div className="grid grid-cols-3 gap-2 text-sm">
							<div className="text-center"><div className="font-medium">{product.environmentalImpact.co2} kg</div><div className="text-green-600">CO₂</div></div>
							<div className="text-center"><div className="font-medium">{product.environmentalImpact.water} L</div><div className="text-green-600">Water</div></div>
							<div className="text-center"><div className="font-medium">{product.environmentalImpact.resources}%</div><div className="text-green-600">Resources</div></div>
						</div>
					</div>
					<div className="bg-blue-50 rounded-lg p-4">
						<h4 className="font-semibold text-blue-800 mb-2">Set Your Price</h4>
						<div className="text-center">
							<div className="flex items-center justify-center gap-2">
								<input
									type="number"
									value={userPrice}
									onChange={(e) => setUserPrice(e.target.value)}
									placeholder="0"
									className="text-3xl font-bold text-blue-600 bg-transparent border-b-2 border-blue-300 focus:border-blue-600 outline-none text-center w-24"
									min="0"
									step="0.01"
								/>
								<span className="text-3xl font-bold text-blue-600">USDC</span>
							</div>
							<div className="text-sm text-gray-600 mt-2">Enter your desired selling price</div>
						</div>
					</div>
					{error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>}
					<div className="flex gap-2 mt-2">
						<Button onClick={handlePublish} className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Publish</Button>
						<Button variant="outline" onClick={resetFlow} className="flex-1">Try Again</Button>
					</div>
				</div>
			</div>
		);
	}

	if (step === 'published') {
		return (
			<div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mt-8 animate-float-card text-center">
				<CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-fade-in-scale" />
				<h2 className="text-2xl font-bold mb-2 text-green-800">Product Published!</h2>
				<p className="text-gray-600 mb-6">Your product is now live on the marketplace and available for purchase.</p>
				<div className="space-y-3">
					<Button onClick={resetFlow} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-lg tracking-wide">Add Another Product</Button>
					<Button variant="outline" onClick={() => router.push('/marketplace')} className="w-full">View in Marketplace</Button>
				</div>
			</div>
		);
	}

	return null;
} 