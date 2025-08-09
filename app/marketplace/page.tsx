"use client";
import { useState } from 'react';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import BottomNavigationMenu from '../../components/BottomNavigationMenu';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Blue T-shirt', price: 15, liked: false },
    { id: 2, name: 'Jeans', price: 35, liked: true },
    { id: 3, name: 'Dress', price: 25, liked: false },
    { id: 4, name: 'Jacket', price: 45, liked: false }
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <button className="absolute top-2 right-2 p-2">
                  <Heart className={`w-5 h-5 ${product.liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-lg font-bold text-green-600">${product.price}</p>
                <button className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600">
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigationMenu />
    </div>
  );
}
