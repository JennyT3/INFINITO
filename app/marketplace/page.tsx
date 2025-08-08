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

// Produtos de exemplo com dados reais
const sampleProducts: Product[] = [
	{
		id: 1,
		name: "Camiseta Orgânica",
		type: "Camiseta",
		gender: "Unissex",
		size: "M",
		color: "Azul",
		colorCode: "#3E88FF",
		price: "25 €",
		material: "Algodão Orgânico",
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
		name: "Vestido Reciclado",
		type: "Vestido",
		gender: "Feminino",
		size: "S",
		color: "Verde",
		colorCode: "#689610",
		price: "45 €",
		material: "Poliéster Reciclado",
		country: "França",
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
		name: "Jeans Sustentável",
		type: "Calças",
		gender: "Unissex",
		size: "L",
		color: "Azul Escuro",
		colorCode: "#1e3a8a",
		price: "65 €",
		material: "Algodão Orgânico + Elastano",
		country: "Espanha",
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
		name: "Camisola Lã Merino",
		type: "Camisola",
		gender: "Masculino",
		size: "XL",
		color: "Cinza",
		colorCode: "#6b7280",
		price: "85 €",
		material: "Lã Merino Certificada",
		country: "Irlanda",
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

	// Carregar produtos da API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch('/api/products');
				const data = await response.json();
				if (data.products && Array.isArray(data.products)) {
					setProducts(prev => [...prev, ...data.products.map((p: any) => ({
						id: p.id || Math.random(),
						name: p.name || 'Produto sem nome',
						type: p.garmentType || 'Peça',
						gender: p.gender || 'Unissex',
						size: p.size || 'M',
						color: p.color || 'Variado',
						colorCode: '#3E88FF',
						price: typeof p.price === 'number' ? `${p.price} €` : (p.price ?? ''),
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
				console.error('Erro ao carregar produtos:', error);
			}
		};

		fetchProducts();
	}, []);

	// Filtrar produtos
	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
		product.material.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Fuerza el precio a 2 € y ajusta datos de ejemplo
	const forcedProducts = products.map((p, i) => ({
		...p,
		price: '2 €',
		country: 'Portugal',
		city: ['Vila Real', 'Porto', 'Braga', 'Chaves', 'Peso da Régua', 'Sabrosa', 'Murça', 'Alijó'][i % 8],
		material: p.material.includes('+') ? p.material.replace(/\+\s?/g, match => `+ ${Math.floor(80 - i*10)}% `) + `${20 + i*10}%` : p.material
	}));

	// Abrir modal de pagamento
	const handleBuyNow = (product: Product) => {
		setSelectedProduct(product);
		setShowPaymentDialog(true);
	};

	// Confirmar compra
	const handleConfirmPurchase = async () => {
		if (!selectedPaymentId) return;

		setIsProcessing(true);
		
		// Simular processamento
		setTimeout(() => {
			setIsProcessing(false);
			setShowPaymentDialog(false);
			setSelectedProduct(null);
			
			// Mostrar confirmação
			alert(`Compra confirmada! Produto: ${selectedProduct?.name}`);
		}, 2000);
	};

	// Componente de produto
	const ProductCard = ({ product }: { product: Product }) => (
		<div className="group bg-white/90 border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden max-w-sm mx-auto mb-6 px-2 py-2 md:px-0 md:py-0" style={{ minWidth: 0, width: 340, minHeight: 340 }}>
			{/* Imagen grande y precio destacado */}
			<div className="relative w-full flex items-start" style={{ minHeight: 220 }}>
				<Image
					src={product.image}
					alt={product.name}
					width={280}
					height={220}
					className="object-contain h-[220px] w-[280px] rounded-2xl bg-white ml-2 md:h-[260px] md:w-[320px]"
					priority
				/>
				{/* Precio destacado (esquina superior derecha, todo naranja, texto negro) */}
				<div className="absolute top-2 right-4 z-20">
					<div className="flex items-center bg-[#F47802] border-2 border-[#F47802] rounded-xl px-6 py-1 shadow-xl font-extrabold text-xl text-black">
						<span className="mr-1">{product.price.replace(/\s?€/, '')}</span>
						<span className="text-black font-bold">€</span>
					</div>
				</div>
			</div>
			{/* Primera línea: punto color + nombre prenda + género + talle (sin precio aquí) */}
			<div className="flex items-center gap-2 mt-4 px-6">
				<span className="w-3 h-3 rounded-full" style={{ backgroundColor: product.colorCode }}></span>
				<span className="font-bold text-xl text-gray-900 truncate">{product.type} - {product.gender} - {product.size}</span>
			</div>
			{/* Segunda línea: material */}
			<div className="px-6 text-sm text-gray-600 mt-1">
				<span className="flex items-center gap-1"><Palette className="w-5 h-5 text-[#813684]" />{product.material}</span>
			</div>
			{/* Made in */}
			<div className="px-6 flex items-center gap-2 text-sm text-gray-600 mt-1">
				<Building2 className="w-5 h-5 text-[#689610]" />
				<span className="font-medium">Made in {product.country}</span>
			</div>
			{/* Tercera línea: vendedor y calificación */}
			<div className="px-6 flex items-center gap-3 text-sm text-gray-600 mt-1">
				<span className="flex items-center gap-1"><User className="w-5 h-5 text-[#D42D66]" />{product.seller}</span>
				<span className="flex items-center gap-1 text-yellow-400"><Star className="w-5 h-5" />4.5</span>
			</div>
			{/* Cuarta línea: ubicación */}
			<div className="px-6 flex items-center gap-1 text-sm text-gray-600 mt-1 mb-1">
				<MapPin className="w-5 h-5 text-[#43B2D2]" />
				<span>{product.city}, {product.country}</span>
			</div>
			{/* Impacto ambiental destacado */}
			<div className="bg-white border border-[#43B2D2] rounded-xl shadow flex flex-col items-center px-6 py-4 mt-3 mx-6 mb-4">
				<span className="font-bold text-base text-gray-800 mb-2">Pegada ambiental</span>
				<div className="flex w-full items-center justify-between">
					<div className="flex flex-col items-center flex-1">
						<Leaf className="w-7 h-7 text-[#689610] mb-1" />
						<span className="font-bold text-lg text-gray-800">{product.environmental.co2}</span>
						<span className="text-xs text-gray-500">CO₂</span>
					</div>
					<div className="flex flex-col items-center flex-1">
						<Droplets className="w-7 h-7 text-[#3E88FF] mb-1" />
						<span className="font-bold text-lg text-gray-800">{product.environmental.water}</span>
						<span className="text-xs text-gray-500">Água</span>
					</div>
				</div>
			</div>
			{/* Botón comprar grande */}
			<div className="px-6 pb-6">
				<button 
					onClick={() => handleBuyNow(product)}
					className="w-full bg-[#689610] text-white rounded-xl py-3 font-bold text-base hover:bg-[#3E88FF] transition shadow-lg"
				>
					Comprar
				</button>
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
			<div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1'} gap-6`}>
				{forcedProducts.map((product) => (
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