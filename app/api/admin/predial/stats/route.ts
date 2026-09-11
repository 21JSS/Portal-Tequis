import { NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adeudoRes = await dbQuery('SELECT COUNT(*) as count, SUM(total) as suma FROM predio WHERE total > 0') as any[];
    const corrienteRes = await dbQuery('SELECT COUNT(*) as count FROM predio WHERE total = 0') as any[];
    
    // Obtener la recaudación y recibos de hoy desde la tabla tramite_pago
    const pagosHoyRes = await dbQuery('SELECT COUNT(*) as recibos, SUM(costo) as recaudacion FROM tramite_pago WHERE fecha_ini = CURDATE()') as any[];

    const conAdeudo = adeudoRes[0]?.count || 0;
    const alCorriente = corrienteRes[0]?.count || 0;
    const totalAdeudado = adeudoRes[0]?.suma || 0;
    const recaudacionHoy = pagosHoyRes[0]?.recaudacion || 0;
    const recibosEmitidos = pagosHoyRes[0]?.recibos || 0;

    return NextResponse.json({
      conAdeudo,
      alCorriente,
      recaudacionHoy,
      recibosEmitidos,
      totalAdeudado
    });

  } catch (error) {
    console.error('Error fetching predial stats:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
