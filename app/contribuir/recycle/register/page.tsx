"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tipos = ["Têxtil", "Plástico", "Papel", "Metal", "Outro"];

export default function RegisterRecyclePage() {
	const router = useRouter();
	const [form, setForm] = useState({
		nome: "",
		email: "",
		telefone: "",
		tipo: "",
		mensagem: ""
	});
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setForm(f => ({ ...f, [name]: value }));
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		if (!form.nome || !form.email || !form.telefone || !form.tipo) {
			setError("Por favor preencha todos os campos obrigatórios.");
			return;
		}
		setLoading(true);
		// Simular envio (substituir por integração real depois)
		await new Promise(r => setTimeout(r, 1200));
		setLoading(false);
		setSuccess(true);
		setForm({ nome: "", email: "", telefone: "", tipo: "", mensagem: "" });
	}

	return (
		<div className="min-h-screen font-raleway flex flex-col items-center justify-center" style={{ backgroundColor: '#EDE4DA', backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover' }}>
			<button onClick={() => router.back()} className="absolute top-6 left-6 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 backdrop-blur-sm">
				<ArrowLeft className="w-5 h-5 text-gray-600" />
			</button>
			<div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-8 max-w-md w-full flex flex-col items-center">
				<h1 className="font-bold text-2xl text-gray-800 mb-2">Registo de Empresa Recicladora</h1>
				<p className="text-gray-600 text-center mb-6">Preencha o formulário para registar a sua empresa ou perfil de vendedor de reciclados.</p>
				{success ? (
					<div className="text-green-700 font-bold text-center mb-4">Registo enviado com sucesso!</div>
				) : (
					<form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
						<input
							type="text"
							name="nome"
							placeholder="Nome da empresa *"
							value={form.nome}
							onChange={handleChange}
							className="bg-white rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
							maxLength={100}
							required
						/>
						<input
							type="email"
							name="email"
							placeholder="Email de contacto *"
							value={form.email}
							onChange={handleChange}
							className="bg-white rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
							maxLength={100}
							required
						/>
						<input
							type="tel"
							name="telefone"
							placeholder="Telefone *"
							value={form.telefone}
							onChange={handleChange}
							className="bg-white rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
							maxLength={20}
							required
						/>
						<select
							name="tipo"
							value={form.tipo}
							onChange={handleChange}
							className="bg-white rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
							required
						>
							<option value="">Tipo de reciclador *</option>
							{tipos.map(t => <option key={t} value={t}>{t}</option>)}
						</select>
						<textarea
							name="mensagem"
							placeholder="Mensagem opcional"
							value={form.mensagem}
							onChange={handleChange}
							className="bg-white rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
							maxLength={300}
							rows={3}
						/>
						{error && <div className="text-red-600 text-sm mb-2">{error}</div>}
						<button
							type="submit"
							disabled={loading}
							className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-sm disabled:opacity-60"
						>
							{loading ? "A enviar..." : "Registar"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
} 