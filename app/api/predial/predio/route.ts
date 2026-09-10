// ============================================================
// GET /api/predial/predio?clave=XXXX
// Devuelve los datos del predio por clave catastral.
// Actualmente usa datos mock. Cuando el colaborador integre
// la BD MySQL, descomenta el bloque "PRODUCCIÓN" y elimina
// el bloque "MOCK".
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

// Tipo del predio
export interface Predio {
  clave: string
  propietario: string
  domicilio: string
  colonia: string
  municipio: string
  estado: string
  cp: string
  zona: string
  superficie_terreno: number
  superficie_construccion: number
  uso: string
  valor_catastral: number
}

// ── MOCK DATA ──────────────────────────────────────────────
const MOCK_PREDIOS: Record<string, Predio> = {
  'TEQ-001-001-001': {
    clave: 'TEQ-001-001-001',
    propietario: 'JUAN PÉREZ GARCÍA',
    domicilio: 'Av. Independencia 123',
    colonia: 'Centro',
    municipio: 'Tequisquiapan',
    estado: 'Querétaro',
    cp: '76750',
    zona: 'Urbana',
    superficie_terreno: 250,
    superficie_construccion: 180,
    uso: 'Habitacional',
    valor_catastral: 850000,
  },
  'TEQ-002-003-007': {
    clave: 'TEQ-002-003-007',
    propietario: 'MARÍA RODRÍGUEZ LÓPEZ',
    domicilio: 'Calle Juárez 45',
    colonia: 'San Juan',
    municipio: 'Tequisquiapan',
    estado: 'Querétaro',
    cp: '76750',
    zona: 'Suburbana',
    superficie_terreno: 500,
    superficie_construccion: 220,
    uso: 'Comercial',
    valor_catastral: 1200000,
  },
}
// ── FIN MOCK ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clave = searchParams.get('clave')?.toUpperCase().trim()

  if (!clave) {
    return NextResponse.json(
      { error: 'Parámetro "clave" requerido.' },
      { status: 400 }
    )
  }

  try {
    // ── PRODUCCIÓN (BD REAL) ──────────────────────────
    const { query } = await import('@/lib/db')
    const rows = await query<any>(
      `SELECT * FROM predio WHERE ClaveCatastral = ?`,
      [clave]
    )
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró ningún predio con la clave catastral proporcionada.' },
        { status: 404 }
      )
    }

    const row = rows[0]
    
    // Mapeamos los datos reales a la interfaz Predio que espera el frontend
    const predio: Predio = {
      clave: row.ClaveCatastral,
      propietario: row.nombreContribuyente,
      domicilio: `${row.ubicacionPredio || ''} ${row.numeroExterior || ''} ${row.numeroInterior ? 'Int ' + row.numeroInterior : ''}`.trim(),
      colonia: row.coloniaPredio || 'No especificada',
      municipio: 'Tequisquiapan',
      estado: 'Querétaro',
      cp: '76750',
      zona: 'Urbana',
      superficie_terreno: 0,
      superficie_construccion: 0,
      uso: row.TipoContribucion === 'U' ? 'Urbano' : (row.TipoContribucion === 'R' ? 'Rústico' : 'No especificado'),
      valor_catastral: row.total || 0,
    }

    return NextResponse.json({ predio })
    // ── FIN PRODUCCIÓN ──────────────────────────────────
  } catch (err) {
    console.error('[API predial/predio]', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
