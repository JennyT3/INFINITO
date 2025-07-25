"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "Sancholiny") {
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "true");
      }
      router.replace("/admin/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <form onSubmit={handleSubmit} className="bg-white/95 rounded-2xl shadow-xl p-8 w-full max-w-xs flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-2">Admin Login</h1>
        <input
          type="text"
          placeholder="Usuario"
          className="border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-center text-sm">{error}</div>}
        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-green-700 transition-all"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
} 