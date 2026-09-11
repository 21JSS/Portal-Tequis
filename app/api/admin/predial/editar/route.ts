import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { clave, nombre, direccion } = await request.json();

    if (!clave) {
      return NextResponse.json({ error: 'La Clave Catastral es requerida.' }, { status: 400 });
    }

    // Actualizamos el nombre y dirección del predio en la base de datos
    const sql = `
      UPDATE predio 
      SET nombreContribuyente = ?, 
          ubicacionPredio = ? 
      WHERE ClaveCatastral = ?
    `;

    const results: any = await dbQuery(sql, [
      nombre || '',
      direccion || '',
      clave
    ]);

    if (results.affectedRows === 0) {
      return NextResponse.json({ error: 'Predio no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Padrón modificado correctamente.' });

  } catch (error) {
    console.error('Error updating padron:', error);
    return NextResponse.json({ error: 'Error interno del servidor al actualizar.' }, { status: 500 });
  }
}
