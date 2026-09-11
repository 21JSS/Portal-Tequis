import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'clave';
    const searchQuery = searchParams.get('query')?.trim() || '';

    let sql = 'SELECT ClaveCatastral, nombreContribuyente, ubicacionPredio, total FROM predio';
    let params: any[] = [];

    if (searchQuery) {
      if (type === 'clave') {
        sql += ' WHERE ClaveCatastral LIKE ?';
      } else if (type === 'propietario') {
        sql += ' WHERE nombreContribuyente LIKE ?';
      } else if (type === 'direccion') {
        sql += ' WHERE ubicacionPredio LIKE ?';
      }
      params.push(`%${searchQuery}%`);
    }

    sql += ' LIMIT 50'; // Limitamos los resultados por seguridad y rendimiento

    const results = await dbQuery(sql, params) as any[];

    // Mapeamos los resultados al formato esperado por la tabla
    const predios = results.map(row => ({
      clave: row.ClaveCatastral,
      propietario: row.nombreContribuyente,
      direccion: row.ubicacionPredio,
      estado: row.total > 0 ? 'Con Adeudo' : 'Al Corriente',
      monto: Number(row.total) || 0
    }));

    return NextResponse.json({ predios });

  } catch (error) {
    console.error('Error searching predial:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
