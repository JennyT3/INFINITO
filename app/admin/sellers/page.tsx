'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const initialSellers = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', products: 5, status: 'Ativo' },
  { id: 2, name: 'João Costa', email: 'joao@email.com', products: 2, status: 'Ativo' },
  { id: 3, name: 'Ana Sousa', email: 'ana@email.com', products: 0, status: 'Inativo' },
];

export default function AdminSellers() {
  const [sellers, setSellers] = useState(initialSellers);
  const [editingId, setEditingId] = useState<number|null>(null);
  const [editData, setEditData] = useState<any|null>(null);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Vendedores</h1>
      <table className="w-full bg-white rounded-xl shadow text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">Nome</th>
            <th className="p-4">Email</th>
            <th className="p-4">Produtos</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(seller => (
            <tr key={seller.id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">{seller.name}</td>
              <td className="p-4">{seller.email}</td>
              <td className="p-4">{seller.products}</td>
              <td className="p-4">{seller.status}</td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline" onClick={() => { setEditingId(seller.id); setEditData({ ...seller }); }}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal de edición */}
      <Dialog open={!!editingId} onOpenChange={v => { if (!v) { setEditingId(null); setEditData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Vendedor</DialogTitle>
          </DialogHeader>
          {editData && (
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (!editData) return; setSellers(sellers => sellers.map(s => s.id === editData.id ? { ...editData, products: Number(editData.products) } : s)); setEditingId(null); setEditData(null); }}>
              <div>
                <label className="block text-xs font-medium mb-1">Nome</label>
                <input className="w-full border rounded px-2 py-1" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email</label>
                <input className="w-full border rounded px-2 py-1" value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Produtos</label>
                <input type="number" className="w-full border rounded px-2 py-1" value={editData.products} onChange={e => setEditData({ ...editData, products: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Estado</label>
                <input className="w-full border rounded px-2 py-1" value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => { setEditingId(null); setEditData(null); }}>Cancelar</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 