'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Edit, Trash2, Plus } from 'lucide-react';
import * as React from "react"
const products = [
  { id: 1, name: 'Camiseta Verde', seller: 'Maria Silva', status: 'Ativo', price: '€12', date: '2024-06-01' },
  { id: 2, name: 'Calças Jeans', seller: 'João Costa', status: 'Ativo', price: '€18', date: '2024-05-28' },
  { id: 3, name: 'Casaco', seller: 'Ana Sousa', status: 'Inativo', price: '€25', date: '2024-05-15' },
];
export default function AdminProducts() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Produtos</h1>
      <table className="w-full bg-white rounded-xl shadow text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">Nome</th>
            <th className="p-4">Vendedor</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Preço</th>
            <th className="p-4">Data</th>
            <th className="p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium">{product.name}</td>
              <td className="p-4">{product.seller}</td>
              <td className="p-4">{product.status}</td>
              <td className="p-4">{product.price}</td>
              <td className="p-4">{product.date}</td>
              <td className="p-4"><button className="text-blue-600 hover:underline">Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 