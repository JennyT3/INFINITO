"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Edit, Trash2, Plus } from "lucide-react";

interface PickupRequest {
  id: number;
  phone: string;
  address: string;
  weight: number;
  pickupDay: string;
  createdAt: string;
}

export default function AdminPickupsPage() {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/pickups")
      .then(res => res.json())
      .then((data: PickupRequest[]) => { setPickups(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 font-raleway">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/admin/dashboard")} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Solicitudes de Recolha</h1>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          ) : pickups.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No hay solicitudes.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 font-semibold">Teléfono</th>
                    <th className="p-2 font-semibold">Dirección</th>
                    <th className="p-2 font-semibold">Peso (kg)</th>
                    <th className="p-2 font-semibold">Día</th>
                    <th className="p-2 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pickups.map((p, i) => (
                    <tr key={p.id || i} className="border-b hover:bg-gray-50">
                      <td className="p-2 whitespace-nowrap">{p.phone}</td>
                      <td className="p-2 whitespace-nowrap">{p.address}</td>
                      <td className="p-2 whitespace-nowrap">{p.weight}</td>
                      <td className="p-2 whitespace-nowrap">{p.pickupDay}</td>
                      <td className="p-2 whitespace-nowrap">{new Date(p.createdAt).toLocaleString("pt-PT")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 