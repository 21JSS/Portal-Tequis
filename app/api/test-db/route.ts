import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
<<<<<<< HEAD
    const result = await query('SELECT id, ClaveCatastral, nombreContribuyente FROM predio LIMIT 3');
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
=======
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
>>>>>>> d0033406a38fbf1e599f3af04a5d6f0ef8a7ece5
  }
}
