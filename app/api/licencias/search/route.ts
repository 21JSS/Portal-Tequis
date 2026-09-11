import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folio = searchParams.get('folio')

  if (!folio) {
    return NextResponse.json(
      { error: 'Debe proporcionar un folio (ID de solicitud)' },
      { status: 400 }
    )
  }

  try {
    const rows = await query<any>(
      `SELECT 
        s.id AS folio,
        s.fecha_inicio,
        s.fecha_fin,
        s.estatus,
        p.primer_nombre,
        p.primer_apellido,
        p.razon_social,
        g.actividad,
        g.tipo,
        g.vta_alcohol
       FROM solicitud s
       LEFT JOIN persona p ON s.id_ciudadano = p.id
       LEFT JOIN solicitud_giro sg ON s.id = sg.id_solicitud
       LEFT JOIN giro g ON sg.id_giro = g.id
       WHERE s.id = ?`,
      [folio]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ninguna licencia con el folio proporcionado.' },
        { status: 404 }
      )
    }

    const row = rows[0]
    
    // Armamos el nombre completo (ya sea persona física o moral)
    const nombreCompleto = row.razon_social 
      ? row.razon_social 
      : `${row.primer_nombre || ''} ${row.primer_apellido || ''}`.trim()

    // Mapeamos los datos para la interfaz
    const licencia = {
      folio: row.folio,
      titular: nombreCompleto || 'Desconocido',
      actividad: row.actividad || 'No especificada',
      tipoGiro: row.tipo || 'General',
      vendeAlcohol: row.vta_alcohol === 1,
      fechaInicio: row.fecha_inicio,
      fechaFin: row.fecha_fin,
      estatus: row.estatus,
    }

    return NextResponse.json({ licencia })
  } catch (err: any) {
    console.error('[API licencias/search]', err)
    return NextResponse.json(
      { error: 'Error interno del servidor al buscar la licencia' },
      { status: 500 }
    )
  }
}
