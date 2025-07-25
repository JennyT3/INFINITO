"use client";
import { ArrowLeft, BookOpen, Video, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const recursos = [
	{
		title: "BLOG",
		icon: BookOpen,
		link: "#"
	},
	{
		title: "VÍDEOS",
		icon: Video,
		link: "#"
	},
	{
		title: "EVENTOS",
		icon: Calendar,
		link: "#"
	}
];

export default function EducacionPage() {
	const router = useRouter();
	return (
		<div className="min-h-screen font-raleway flex flex-col items-center justify-center" style={{ backgroundColor: '#EDE4DA', backgroundImage: "url('/fondo.png')", backgroundRepeat: 'repeat', backgroundSize: 'cover' }}>
			<button onClick={() => router.back()} className="absolute top-6 left-6 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-gray-200 backdrop-blur-sm">
				<ArrowLeft className="w-5 h-5 text-gray-600" />
			</button>
			<div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-8 max-w-lg w-full flex flex-col items-center mt-10">
				<h1 className="font-extrabold text-3xl text-gray-800 mb-8 tracking-widest uppercase">Educação</h1>
				<div className="grid grid-cols-1 gap-10 w-full">
					{recursos.map((r, idx) => (
						<div key={r.title} className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex flex-col items-center justify-center p-8 shadow hover:shadow-xl hover:scale-[1.04] transition-all cursor-pointer min-h-[120px]">
							<r.icon className="w-14 h-14 text-green-700 mb-2" />
							<div className="font-extrabold text-xl text-gray-800 uppercase tracking-wider">{r.title}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
} 