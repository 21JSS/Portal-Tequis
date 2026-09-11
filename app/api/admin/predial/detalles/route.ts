import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clave = searchParams.get('clave')?.trim();

    if (!clave) {
      return NextResponse.json({ error: 'Clave es requerida' }, { status: 400 });
    }

    // Consultamos los detalles del predio específico
    const sql = 'SELECT * FROM predio WHERE ClaveCatastral = ? LIMIT 1';
    const results = await dbQuery(sql, [clave]) as any[];

    if (results.length === 0) {
      return NextResponse.json({ error: 'Predio no encontrado' }, { status: 404 });
    }

    const row = results[0];

    const predioInfo = {
      clave: row.ClaveCatastral,
      propietario: row.nombreContribuyente,
      direccion: row.ubicacionPredio,
      valorCatastral: 0, // No está claro en la base de datos si existe, así que usamos 0 por defecto
      usoSuelo: 'Habitacional'
    };

    // Construimos los adeudos desde las columnas
    const adeudos = [];
    if (row.total > 0) {
      adeudos.push({
        anio: row.anoInicialAdeudo || 'N/A',
        bimestre: row.bimestreInicialAdeudo || 'N/A',
        base: Number(row.impuestoAno) || 0,
        recargos: Number(row.Recargo) || 0,
        total: Number(row.total) || 0
      });
    }

    return NextResponse.json({ predioInfo, adeudos, historial: [] });

  } catch (error) {
    console.error('Error fetching predial details:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
