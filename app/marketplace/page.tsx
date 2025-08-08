"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../components/theme-provider';
import Image from 'next/image';
import { 
	Search, Filter, Heart, ShoppingBag, Grid, List, 
	MapPin, Droplets, Leaf, X, ChevronDown, 
	ArrowLeft, Zap, Award, CreditCard, Star, Plus, Palette, Building2, User
} from 'lucide-react';
import InfinitoLayout from '../../components/InfinitoLayout';
import { useTranslation } from '../../hooks/useTranslation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PaymentMethodSelector } from "@/components/ui/payment-method-selector";
import { Button } from "@/components/ui/button";

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

// Interface para produtos
interface Product {
	id: number;
	name: string;
	type: string;
	gender: string;
	size: string;
	color: string;
	colorCode: string;
	price: string;
	material: string;
	country: string;
	city: string;
	seller: string;
	image: string;
	environmental: {
		co2: string;
		water: string;
		resources: string;
	};
}

// Traduções do marketplace
const marketplaceTranslations = {
	pt: {
		title: "Sustainable Marketplace",
		subtitle: "Verified products with transparent environmental impact",
		searchPlaceholder: "Search products...",
		filters: "Filters",
		gridView: "Grid",
		listView: "List",
		addToCart: "Add to Cart",
		buyNow: "Buy Now",
		seller: "Seller",
		condition: "Condition",
		material: "Material",
		origin: "Origin",
		environmentalImpact: "Environmental Impact",
		co2Saved: "CO₂ Saved",
		waterSaved: "Water Saved",
		efficiency: "Efficiency",
		selectPayment: "Select Payment",
		confirmPurchase: "Confirm Purchase",
		paymentMethod: "Payment Method",
		processing: "Processing...",
		close: "Close"
	},
	en: {
		title: "Sustainable Marketplace",
		subtitle: "Verified products with transparent environmental impact",
		searchPlaceholder: "Search products...",
		filters: "Filters",
		gridView: "Grid",
		listView: "List",
		addToCart: "Add to Cart",
		buyNow: "Buy Now",
		seller: "Seller",
		condition: "Condition",
		material: "Material",
		origin: "Origin",
		environmentalImpact: "Environmental Impact",
		co2Saved: "CO₂ Saved",
		waterSaved: "Water Saved",
		efficiency: "Efficiency",
		selectPayment: "Select Payment",
		confirmPurchase: "Confirm Purchase",
		paymentMethod: "Payment Method",
		processing: "Processing...",
		close: "Close"
	},
	es: {
		title: "Marketplace Sostenible",
		subtitle: "Productos verificados con impacto ambiental transparente",
		searchPlaceholder: "Buscar productos...",
		filters: "Filtros",
		gridView: "Cuadrícula",
		listView: "Lista",
		addToCart: "Añadir al Carrito",
		buyNow: "Comprar Ahora",
		seller: "Vendedor",
		condition: "Estado",
		material: "Material",
		origin: "Origen",
		environmentalImpact: "Impacto Ambiental",
		co2Saved: "CO₂ Ahorrado",
		waterSaved: "Agua Ahorrada",
		efficiency: "Eficiencia",
		selectPayment: "Seleccionar Pago",
		confirmPurchase: "Confirmar Compra",
		paymentMethod: "Método de Pago",
		processing: "Procesando...",
		close: "Cerrar"
	}
};

// Sample products with real data
const sampleProducts: Product[] = [
	{
		id: 1,
		name: "Organic T-Shirt",
		type: "T-Shirt",
		gender: "Unisex",
		size: "M",
		color: "Blue",
		colorCode: "#3E88FF",
		price: "2 USDC",
		material: "Organic Cotton",
		country: "Portugal",
		city: "Porto",
		seller: "EcoTextil",
		image: "/images/Item1.jpeg",
		environmental: {
			co2: "2.1 kg",
			water: "1.2K L",
			resources: "A+"
		}
	},
	{
		id: 2,
		name: "Recycled Dress",
		type: "Dress",
		gender: "Women",
		size: "S",
		color: "Green",
		colorCode: "#689610",
		price: "2 USDC",
		material: "Recycled Polyester",
		country: "France",
		city: "Lyon",
		seller: "GreenFashion",
		image: "/images/Item2.jpeg",
		environmental: {
			co2: "1.8 kg",
			water: "0.8K L",
			resources: "A"
		}
	},
	{
		id: 3,
		name: "Sustainable Jeans",
		type: "Pants",
		gender: "Unisex",
		size: "L",
		color: "Dark Blue",
		colorCode: "#1e3a8a",
		price: "65 USDC",
		material: "Organic Cotton + Elastane",
		country: "Spain",
		city: "Barcelona",
		seller: "DenimEco",
		image: "/images/Item3.jpeg",
		environmental: {
			co2: "3.2 kg",
			water: "1.8K L",
			resources: "B+"
		}
	},
	{
		id: 4,
		name: "Merino Wool Sweater",
		type: "Sweater",
		gender: "Men",
		size: "XL",
		color: "Gray",
		colorCode: "#6b7280",
		price: "85 USDC",
		material: "Certified Merino Wool",
		country: "Ireland",
		city: "Dublin",
		seller: "WoolCraft",
		image: "/images/Item4.jpeg",
		environmental: {
			co2: "4.1 kg",
			water: "2.1K L",
			resources: "A"
		}
	}
];

export default function MarketplacePage() {
	const router = useRouter();
	const { language } = useLanguage();
	const [products, setProducts] = useState<Product[]>(sampleProducts);
	const [searchQuery, setSearchQuery] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
	const [isProcessing, setIsProcessing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const t = marketplaceTranslations[language] || marketplaceTranslations.pt;

	// Load products from API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('/api/products');
				const data = await response.json();
				if (data.products && Array.isArray(data.products)) {
					setProducts(prev => [...prev, ...data.products.map((p: any) => ({
						id: p.id || Math.random(),
						name: p.name || 'Unnamed Product',
						type: p.garmentType || 'Item',
						gender: p.gender || 'Unisex',
						size: p.size || 'M',
						color: p.color || 'Varied',
						colorCode: '#3E88FF',
						price: typeof p.price === 'number' ? `${p.price} USDC` : (p.price ?? ''),
						material: p.material ?? '',
						country: p.country ?? '',
						city: '',
						seller: p.sellerName ?? '',
						image: p.photo1Url ?? '/images/Item1.jpeg',
						environmental: {
							co2: p.impactCo2 ?? '',
							water: p.impactWater ?? '',
							resources: p.impactEff ?? '',
						},
					}))]);
				}
			} catch (error) {
				console.error('Error loading products:', error);
			}
		};

		fetchProducts();
	}, []);

	// Filter products
	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.material.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Use original products without forcing prices
	const displayProducts = products;

	// Open payment modal
	const handleBuyNow = (product: Product) => {
		setSelectedProduct(product);
		setShowPaymentDialog(true);
	};

	// Confirm purchase
	const handleConfirmPurchase = async () => {
		if (!selectedPaymentId) return;

		setIsProcessing(true);
		
		// Simulate processing
		setTimeout(() => {
			setIsProcessing(false);
			setShowPaymentDialog(false);
			setSelectedProduct(null);
			
			// Show confirmation
			alert(`Purchase confirmed! Product: ${selectedProduct?.name}`);
		}, 2000);
	};

	// Product component
	const ProductCard = ({ product }: { product: Product }) => (
		<div className="group bg-white/90 border border-gray-200 rounded-xl shadow-lg flex flex-col overflow-hidden max-w-xs mx-auto mb-4" style={{ minWidth: 0, width: 280, minHeight: 280 }}>
			{/* Imagen y precio */}
			<div className="relative w-full flex items-start" style={{ minHeight: 160 }}>
				<Image
					src={product.image}
					alt={product.name}
					width={240}
					height={160}
					className="object-contain h-[160px] w-[240px] rounded-xl bg-white ml-2"
					priority
				/>
				{/* Precio destacado */}
				<div className="absolute top-2 right-3 z-20">
					<div className="flex items-center bg-[#F47802] border border-[#F47802] rounded-lg px-3 py-1 shadow-lg font-bold text-sm text-black">
						<span className="mr-1">{product.price.replace(/\s?USDC/, '')}</span>
						<span className="text-black font-bold">USDC</span>
					</div>
				</div>
			</div>
			
			{/* Información del producto */}
			<div className="p-4 space-y-2">
				{/* Nombre y tipo */}
				<div className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full" style={{ backgroundColor: product.colorCode }}></span>
					<span className="font-semibold text-sm text-gray-900 truncate">{product.type} - {product.gender}</span>
				</div>
				
				{/* Material y país */}
				<div className="flex items-center justify-between text-xs text-gray-600">
					<span className="flex items-center gap-1">
						<Palette className="w-3 h-3 text-[#813684]" />
						{product.material}
					</span>
					<span className="flex items-center gap-1">
						<Building2 className="w-3 h-3 text-[#689610]" />
						{product.country}
					</span>
				</div>
				
				{/* Vendedor y calificación */}
				<div className="flex items-center justify-between text-xs text-gray-600">
					<span className="flex items-center gap-1">
						<User className="w-3 h-3 text-[#D42D66]" />
						{product.seller}
					</span>
					<span className="flex items-center gap-1 text-yellow-400">
						<Star className="w-3 h-3" />
						4.5
					</span>
				</div>
				
				{/* Ubicación */}
				<div className="flex items-center gap-1 text-xs text-gray-600">
					<MapPin className="w-3 h-3 text-[#43B2D2]" />
					<span>{product.city}, {product.country}</span>
				</div>
				
				{/* Impacto ambiental compacto */}
				<div className="bg-gray-50 border border-[#43B2D2] rounded-lg p-3 mt-3">
					<span className="font-semibold text-xs text-gray-800 mb-2 block">Environmental Impact</span>
					<div className="flex items-center justify-between">
						<div className="flex flex-col items-center">
							<Leaf className="w-4 h-4 text-[#689610] mb-1" />
							<span className="font-bold text-sm text-gray-800">{product.environmental.co2}</span>
							<span className="text-xs text-gray-500">CO₂</span>
						</div>
						<div className="flex flex-col items-center">
							<Droplets className="w-4 h-4 text-[#3E88FF] mb-1" />
							<span className="font-bold text-sm text-gray-800">{product.environmental.water}</span>
							<span className="text-xs text-gray-500">Water</span>
						</div>
					</div>
				</div>
				
				{/* Botón comprar */}
				<div className="pt-2">
					<button 
						onClick={() => handleBuyNow(product)}
						className="w-full bg-[#689610] text-white rounded-lg py-2 font-semibold text-sm hover:bg-[#3E88FF] transition shadow-md"
					>
						Buy Now
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<InfinitoLayout
			title={t.title}
			subtitle={t.subtitle}
			userName="Utilizador"
			showHeader={true}
			showBackButton={true}
			showBottomMenu={true}
		>
			{/* Barra de pesquisa e filtros */}
			<div className="mb-6 space-y-4">
				{/* Pesquisa */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						ref={inputRef}
						type="text"
						placeholder={t.searchPlaceholder}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-3 infinito-glass rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-infinito-green/50 text-gray-800 placeholder-gray-500"
					/>
				</div>

				{/* Controles */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2 px-4 py-2 infinito-glass rounded-xl infinito-btn"
						>
							<Filter className="w-4 h-4" />
							<span className="text-sm font-medium">{t.filters}</span>
						</button>
						<span className="text-sm text-gray-600">
							{filteredProducts.length} produtos
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => setViewMode('grid')}
							className={`w-10 h-10 infinito-glass rounded-lg flex items-center justify-center infinito-btn ${
								viewMode === 'grid' ? 'infinito-green' : ''
							}`}
						>
							<Grid className="w-4 h-4 text-white" />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`w-10 h-10 infinito-glass rounded-lg flex items-center justify-center infinito-btn ${
								viewMode === 'list' ? 'infinito-green' : ''
							}`}
						>
							<List className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>
			</div>

			{/* Grid de produtos */}
							<div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{/* Modal de pagamento */}
			<Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
				<DialogContent className="max-w-md mx-auto infinito-glass">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold text-gray-800">
							{t.confirmPurchase}
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							{selectedProduct?.name} - {selectedProduct?.price}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<PaymentMethodSelector id={selectedPaymentId} onSelect={setSelectedPaymentId} />
					</div>

					<DialogFooter className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setShowPaymentDialog(false)}
							className="flex-1"
						>
							{t.close}
						</Button>
						<Button
							onClick={handleConfirmPurchase}
							disabled={!selectedPaymentId || isProcessing}
							className="flex-1 infinito-button infinito-green"
						>
							{isProcessing ? t.processing : t.confirmPurchase}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</InfinitoLayout>
	);
} 