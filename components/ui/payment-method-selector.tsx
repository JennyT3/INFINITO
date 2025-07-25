import * as React from "react"
import { CreditCard, Building2, Smartphone, Bitcoin, Star, CheckCircle2, Plus } from "lucide-react";

const mainMethods = [
	{
		id: "mbway",
		name: "MB WAY",
		description: "Telemóvel",
		icon: Smartphone,
		color: "#F47802",
		iconColor: "text-white",
		logos: ["📱"],
		popular: true,
	},
	{
		id: "transfer",
		name: "Transferência",
		description: "Nacional/Euro",
		icon: Building2,
		color: "#689610",
		iconColor: "text-white",
		logos: ["🏦"],
	},
	{
		id: "card",
		name: "Cartão",
		description: "Visa, Mastercard",
		icon: CreditCard,
		color: "#3E88FF",
		iconColor: "text-white",
		logos: ["💳"],
		popular: true,
	},
];

const extraMethods = [
	{
		id: "wise",
		name: "Wise",
		description: "Internacional",
		icon: Building2,
		color: "#813684",
		iconColor: "text-white",
		logos: ["🌍"],
	},
	{
		id: "binance",
		name: "Binance",
		description: "Cripto",
		icon: Bitcoin,
		color: "#EAB308",
		iconColor: "text-white",
		logos: ["🟡"],
	},
	{
		id: "usdc-stellar",
		name: "USDC Stellar",
		description: "Rede Stellar",
		icon: Bitcoin,
		color: "#43B2D2",
		iconColor: "text-white",
		logos: ["⭐"],
	},
	{
		id: "revolut",
		name: "Revolut",
		description: "Instantâneo",
		icon: Building2,
		color: "#689610",
		iconColor: "text-white",
		logos: ["💳"],
	},
];

export interface PaymentMethodSelectorProps {
	id: string;
	onSelect: (id: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ id, onSelect }) => {
	const [showExtras, setShowExtras] = React.useState(false);
	return (
		<div className="grid grid-cols-1 gap-3 w-full">
			{mainMethods.map((method) => {
				const Icon = method.icon;
				const selected = id === method.id;
				return (
					<button
						key={method.id}
						onClick={() => onSelect(method.id)}
						type="button"
						className={`group bg-white/20 backdrop-blur-sm rounded-xl p-3 border transition-all duration-300 relative overflow-hidden flex items-center gap-3 w-full text-left hover:bg-white/30 hover:scale-105 ${selected ? 'border-4 border-[#F47802] shadow-xl' : 'border border-white/30'} `}
						style={{ filter: `drop-shadow(0 4px 8px ${method.color}20)` }}
					>
						<div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0" style={{ backgroundColor: method.color }}>
							<Icon className={`w-5 h-5 ${method.iconColor}`} />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<h3 className="font-bold text-gray-800 tracking-wide text-sm truncate">{method.name}</h3>
								<span className="text-base flex-shrink-0">{method.logos[0]}</span>
								{method.popular && (
									<span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"><Star className="w-3 h-3 mr-1" />Popular</span>
								)}
							</div>
							<p className="text-xs text-gray-600 font-medium">{method.description}</p>
						</div>
						{selected && (
							<span className="ml-auto flex items-center gap-1 font-bold text-[#F47802]">
								<CheckCircle2 className="w-5 h-5" />Selecionado
							</span>
						)}
					</button>
				);
			})}

			{!showExtras && (
				<button
					type="button"
					className="flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-xl border border-[#EDE4DA] bg-white/80 text-[#3E88FF] font-bold shadow hover:bg-[#F4780215] transition-all"
					onClick={() => setShowExtras(true)}
				>
					<Plus className="w-5 h-5" />Adicionar outro método
				</button>
			)}

			{showExtras && extraMethods.map((method) => {
				const Icon = method.icon;
				const selected = id === method.id;
				return (
					<button
						key={method.id}
						onClick={() => onSelect(method.id)}
						type="button"
						className={`group bg-white/20 backdrop-blur-sm rounded-xl p-3 border transition-all duration-300 relative overflow-hidden flex items-center gap-3 w-full text-left hover:bg-white/30 hover:scale-105 ${selected ? 'border-4 border-[#F47802] shadow-xl' : 'border border-white/30'} `}
						style={{ filter: `drop-shadow(0 4px 8px ${method.color}20)` }}
					>
						<div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/40 flex-shrink-0" style={{ backgroundColor: method.color }}>
							<Icon className={`w-5 h-5 ${method.iconColor}`} />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<h3 className="font-bold text-gray-800 tracking-wide text-sm truncate">{method.name}</h3>
								<span className="text-base flex-shrink-0">{method.logos[0]}</span>
							</div>
							<p className="text-xs text-gray-600 font-medium">{method.description}</p>
						</div>
						{selected && (
							<span className="ml-auto flex items-center gap-1 font-bold text-[#F47802]">
								<CheckCircle2 className="w-5 h-5" />Selecionado
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
} 