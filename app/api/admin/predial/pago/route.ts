import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { clave, action } = await request.json();

    if (!clave || !action) {
      return NextResponse.json({ error: 'Clave y acción son requeridas.' }, { status: 400 });
    }

    if (action === 'condonar') {
      // Condonación: ponemos Recargo y multa en 0, y recalculamos el total.
      // Suponemos que el total es = impuestoAno + rezagoAnosAnteriores + rezagoAnoTranscurre + adicional + actualización + requerimientoGastoEjecucion + embargoGastosEjecucion - descuento
      // Como no conocemos la fórmula exacta que usan, simplemente calcularemos la diferencia o setearemos Recargo y multa a 0, y le restamos ese valor al total.
      
      const selectSql = 'SELECT Recargo, multa, total FROM predio WHERE ClaveCatastral = ?';
      const rows: any = await dbQuery(selectSql, [clave]);
      
      if (rows.length === 0) return NextResponse.json({ error: 'Predio no encontrado.' }, { status: 404 });
      
      const predio = rows[0];
      const recargo = Number(predio.Recargo) || 0;
      const multa = Number(predio.multa) || 0;
      const sumaDescontar = recargo + multa;
      
      // Actualizamos restando recargo y multa del total, y poniéndolos a 0
      const updateSql = `
        UPDATE predio 
        SET Recargo = 0, 
            multa = 0, 
            total = GREATEST(0, total - ?) 
        WHERE ClaveCatastral = ?
      `;
      await dbQuery(updateSql, [sumaDescontar, clave]);

      return NextResponse.json({ success: true, message: 'Condonación aplicada correctamente (Recargos y Multas a $0).' });

    } else if (action === 'pagar') {
      // Pagar: Obtener primero el monto total adeudado
      const selectSql = 'SELECT total FROM predio WHERE ClaveCatastral = ?';
      const rows: any = await dbQuery(selectSql, [clave]);
      
      if (rows.length === 0) return NextResponse.json({ error: 'Predio no encontrado.' }, { status: 404 });
      const montoTotal = Number(rows[0].total) || 0;

      // Poner todo el adeudo en 0
      const updateSql = `
        UPDATE predio 
        SET total = 0,
            Recargo = 0,
            multa = 0,
            impuestoAno = 0,
            rezagoAnosAnteriores = 0,
            rezagoAnoTranscurre = 0
        WHERE ClaveCatastral = ?
      `;
      await dbQuery(updateSql, [clave]);
      
      // Registrar en tramite_pago para que aparezca en Recaudación de Hoy
      if (montoTotal > 0) {
        const insertSql = `
          INSERT INTO tramite_pago (id_sol, costo, fecha_ini, folio) 
          VALUES (0, ?, CURDATE(), ?)
        `;
        const folio = 'PAGO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        await dbQuery(insertSql, [montoTotal, folio]);
      }
      
      return NextResponse.json({ success: true, message: 'Predio marcado como pagado exitosamente.' });
    }

    return NextResponse.json({ error: 'Acción no válida.' }, { status: 400 });

  } catch (error) {
    console.error('Error procesando pago/condonación:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
