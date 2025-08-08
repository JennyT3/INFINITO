"use client";
import { ArrowLeft, Building2, Package, MapPin, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigationMenu from '../../../components/BottomNavigationMenu';
import { useState } from "react";

export default function RecycleFlowPage() {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState("form");
	const [formData, setFormData] = useState({
		companyName: "",
		email: "",
		phone: "",
		address: "",
		recyclingType: "",
		capacity: ""
	});
	const [trackingNumber, setTrackingNumber] = useState("");

	const goBack = () => {
		if (currentStep === "success") {
			setCurrentStep("form");
		} else {
			router.back();
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Generate tracking number
		const tracking = `REC-${Date.now()}`;
		setTrackingNumber(tracking);
		setCurrentStep("success");
	};

	const handleAction = (action: "sell" | "receive") => {
		if (action === "sell") {
			router.push("/profile/sell-products");
		} else {
			router.push("/contribuir/clothing");
		}
	};

	return (
		<div className="min-h-screen font-raleway flex flex-col justify-between bg-[#EDE4DA] relative" style={{backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover'}}>
			{/* Header */}
			<div className="bg-white/20 backdrop-blur-md border-b border-white/30 px-6 py-4 sticky top-0 z-10">
				<div className="flex items-center justify-between max-w-sm mx-auto md:max-w-4xl lg:max-w-6xl">
					<button 
						onClick={goBack}
						className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 hover:bg-white/100 transition-all duration-300 hover:scale-105"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
					>
						<ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
					</button>
					<h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-wider">Recycling Company</h1>
					<div className="w-10 md:w-12"></div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-8">
				{currentStep === "form" ? (
					<div className="w-full bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg">
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<Building2 className="w-8 h-8 text-white" />
							</div>
							<h2 className="text-xl font-bold text-gray-800 mb-2">Recycling Company Registration</h2>
							<p className="text-gray-600 text-sm">Join our circular economy network</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
								<input
									type="text"
									value={formData.companyName}
									onChange={(e) => setFormData({...formData, companyName: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({...formData, email: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
								<input
									type="tel"
									value={formData.phone}
									onChange={(e) => setFormData({...formData, phone: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
								<input
									type="text"
									value={formData.address}
									onChange={(e) => setFormData({...formData, address: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Recycling Type</label>
								<select
									value={formData.recyclingType}
									onChange={(e) => setFormData({...formData, recyclingType: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								>
									<option value="">Select type</option>
									<option value="textiles">Textiles</option>
									<option value="electronics">Electronics</option>
									<option value="plastics">Plastics</option>
									<option value="paper">Paper</option>
									<option value="metal">Metal</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Monthly Capacity (tons)</label>
								<input
									type="number"
									value={formData.capacity}
									onChange={(e) => setFormData({...formData, capacity: e.target.value})}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
									required
								/>
							</div>

							<button
								type="submit"
								className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all"
							>
								Register Company
							</button>
						</form>
					</div>
				) : (
					<div className="w-full bg-white/25 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg text-center">
						<div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckCircle className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
						<p className="text-gray-600 text-sm mb-4">Your tracking number: <strong>{trackingNumber}</strong></p>
						
						<div className="space-y-3 mt-6">
							<button
								onClick={() => handleAction("sell")}
								className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all"
							>
								<Package className="w-5 h-5 inline mr-2" />
								Sell Products
							</button>
							
							<button
								onClick={() => handleAction("receive")}
								className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
							>
								<MapPin className="w-5 h-5 inline mr-2" />
								Receive Orders
							</button>
						</div>
					</div>
				)}
			</div>

			<BottomNavigationMenu />
		</div>
	);
} 