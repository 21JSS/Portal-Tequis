import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Intentamos hacer una consulta simple a la tabla ropredial
    const data = await query('SELECT * FROM ropredial LIMIT 5');
    return NextResponse.json({ 
      status: 'success', 
      message: 'Conexión exitosa', 
      data 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Error conectando a la base de datos', 
      details: error.message 
    }, { status: 500 });
  }
}
