#!/bin/bash

echo "🧹 Cleaning Next.js cache and node_modules..."

# Detener procesos de desarrollo si están corriendo
echo "🛑 Stopping development processes..."
pkill -f "next dev" || true
pkill -f "npm run dev" || true

# Limpiar caché de Next.js
echo "🗑️  Cleaning Next.js cache..."
rm -rf .next
rm -rf .swc

# Limpiar caché de npm
echo "🗑️  Cleaning npm cache..."
npm cache clean --force

# Limpiar node_modules (opcional, descomenta si es necesario)
# echo "🗑️  Removing node_modules..."
# rm -rf node_modules
# npm install

# Limpiar caché de TypeScript
echo "🗑️  Cleaning TypeScript cache..."
rm -rf tsconfig.tsbuildinfo

# Limpiar caché de webpack
echo "🗑️  Cleaning webpack cache..."
rm -rf .webpack

# Regenerar archivos de Prisma
echo "🔄 Regenerating Prisma client..."
npx prisma generate

# Verificar dependencias
echo "🔍 Checking dependencies..."
npm audit fix

# Iniciar servidor de desarrollo
echo "🚀 Starting development server..."
npm run dev 