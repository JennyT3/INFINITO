// MOCK API para desarrollo sin base de datos
import { NextRequest, NextResponse } from 'next/server';

const mockPickups = [
  {
    id: 1,
    phone: '+351 912345678',
    address: 'Rua das Flores, 123',
    weight: 12,
    pickupDay: '2025-01-15',
    status: 'Pendente',
  },
];

export async function GET() {
  return NextResponse.json(mockPickups);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Simula creación exitosa
  return NextResponse.json({ ...data, id: Date.now() }, { status: 201 });
} 