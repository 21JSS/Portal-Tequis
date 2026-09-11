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
    // ── BYPASS PARA DESARROLLO ──────────────────────────
    // Si no es una de las claves mock, usamos la primera por defecto
    const predioMock = MOCK_PREDIOS[clave] || MOCK_PREDIOS['TEQ-001-001-001']
    return NextResponse.json({ predio: { ...predioMock, clave } })
    // ── FIN BYPASS ────────────────────────────────────

    /* ── PRODUCCIÓN (BD REAL) ──────────────────────────
    const { query } = await import('@/lib/db')
    ... (resto del código)
    ── FIN PRODUCCIÓN ────────────────────────────────── */
  } catch (err) {
    console.error('[API predial/predio]', err)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}