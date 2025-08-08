"use client";

import React from 'react';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Training & Education
          </h1>
          <p className="text-lg text-gray-600">
            Learn about sustainable practices and recycling techniques
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Sustainable Fashion</h3>
            <p className="text-gray-600">
              Learn about eco-friendly fashion choices and sustainable practices.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Recycling Techniques</h3>
            <p className="text-gray-600">
              Discover effective methods for recycling textiles and materials.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Environmental Impact</h3>
            <p className="text-gray-600">
              Understand the environmental impact of textile production and disposal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
