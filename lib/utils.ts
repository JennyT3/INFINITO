import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Peso estándar por tipo de prenda (en kg)
export const STANDARD_WEIGHTS: Record<string, number> = {
  'camiseta': 0.20,
  'camisa': 0.25,
  'polo': 0.22,
  'vestido': 0.35,
  'saia': 0.18,
  'calcas': 0.45,
  'jeans': 0.55,
  'casaco': 0.65,
  'blazer': 0.50,
  'camisola': 0.40,
  'sweater': 0.45,
  'shorts': 0.25,
  'lingerie': 0.05,
  'meias': 0.03,
  'acessorios': 0.10,
  'default': 0.25
}

// Impacto ambiental estándar por kg de roupa
export const STANDARD_IMPACT_PER_KG = {
  co2: 26.2, // kg CO2 per kg of clothing
  water: 10500, // liters per kg
  resources: 85 // % efficiency
}

// Calcula o peso estándar baseado no tipo de prenda
export function calculateStandardWeight(garmentType: string): number {
  const type = garmentType.toLowerCase()
  return STANDARD_WEIGHTS[type] || STANDARD_WEIGHTS.default
}

// Calcula o impacto ambiental baseado no peso
export function calculateEnvironmentalImpact(weight: number) {
  return {
    co2: Math.round(weight * STANDARD_IMPACT_PER_KG.co2 * 100) / 100,
    water: Math.round(weight * STANDARD_IMPACT_PER_KG.water),
    resources: Math.round(STANDARD_IMPACT_PER_KG.resources)
  }
}

// Modelo de revenue: 5% comisión, mínimo €1, máximo €10
export function calculateRevenue(originalPrice: number): {
  commission: number;
  finalPrice: number;
  commissionPercentage: number;
} {
  const baseCommission = originalPrice * 0.05 // 5%
  let commission = baseCommission
  
  // Mínimo €1
  if (commission < 1) {
    commission = 1
  }
  
  // Máximo €10
  if (commission > 10) {
    commission = 10
  }
  
  const finalPrice = originalPrice + commission
  const commissionPercentage = (commission / originalPrice) * 100
  
  return {
    commission: Math.round(commission * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    commissionPercentage: Math.round(commissionPercentage * 100) / 100
  }
}

// Gera hash SHA-256 para certificado
export async function generateCertificateHash(data: any): Promise<string> {
  const encoder = new TextEncoder()
  const dataStr = JSON.stringify(data)
  const dataBuffer = encoder.encode(dataStr)
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}
