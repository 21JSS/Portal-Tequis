// ============================================================
// GET /api/predial/adeudo?clave=XXXX
// Devuelve los periodos adeudados de un predio.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export interface Periodo {
  id: string
  anio: number
  bimestre: number           // 1-6 (0 = anual)
  descripcion: string        // ej. "Ene–Feb 2024"
  importe_base: number
  recargos: number
  descuento: number
  total: number
  vencimiento: string        // ISO date string
}

export interface ResumenAdeudo {
  clave: string
  total_adeudado: number
  periodos: Periodo[]
}

// ── MOCK DATA ──────────────────────────────────────────────
const MOCK_ADEUDOS: Record<string, ResumenAdeudo> = {
  'TEQ-001-001-001': {
    clave: 'TEQ-001-001-001',
    total_adeudado: 4820,
    periodos: [
      { id: 'p1', anio: 2024, bimestre: 1, descripcion: 'Ene–Feb 2024', importe_base: 680, recargos: 120, descuento: 0,   total: 800,  vencimiento: '2024-02-29' },
      { id: 'p2', anio: 2024, bimestre: 2, descripcion: 'Mar–Abr 2024', importe_base: 680, recargos: 95,  descuento: 0,   total: 775,  vencimiento: '2024-04-30' },
      { id: 'p3', anio: 2024, bimestre: 3, descripcion: 'May–Jun 2024', importe_base: 680, recargos: 65,  descuento: 0,   total: 745,  vencimiento: '2024-06-30' },
      { id: 'p4', anio: 2024, bimestre: 4, descripcion: 'Jul–Ago 2024', importe_base: 680, recargos: 40,  descuento: 0,   total: 720,  vencimiento: '2024-08-31' },
      { id: 'p5', anio: 2024, bimestre: 5, descripcion: 'Sep–Oct 2024', importe_base: 680, recargos: 20,  descuento: 0,   total: 700,  vencimiento: '2024-10-31' },
      { id: 'p6', anio: 2024, bimestre: 6, descripcion: 'Nov–Dic 2024', importe_base: 680, recargos: 0,   descuento: 34,  total: 646,  vencimiento: '2024-12-31' },
      { id: 'p7', anio: 2025, bimestre: 1, descripcion: 'Ene–Feb 2025', importe_base: 720, recargos: 0,   descuento: 36,  total: 684,  vencimiento: '2025-02-28' },
    ],
  },
  'TEQ-002-003-007': {
    clave: 'TEQ-002-003-007',
    total_adeudado: 3200,
    periodos: [
      { id: 'q1', anio: 2024, bimestre: 5, descripcion: 'Sep–Oct 2024', importe_base: 900, recargos: 80,  descuento: 0,   total: 980,  vencimiento: '2024-10-31' },
      { id: 'q2', anio: 2024, bimestre: 6, descripcion: 'Nov–Dic 2024', importe_base: 900, recargos: 0,   descuento: 45,  total: 855,  vencimiento: '2024-12-31' },
      { id: 'q3', anio: 2025, bimestre: 1, descripcion: 'Ene–Feb 2025', importe_base: 950, recargos: 0,   descuento: 47,  total: 903,  vencimiento: '2025-02-28' },
      { id: 'q4', anio: 2025, bimestre: 2, descripcion: 'Mar–Abr 2025', importe_base: 460, recargos: 0,   descuento: 0,   total: 460,  vencimiento: '2025-04-30' },
    ],
  },
}
// ── FIN MOCK ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clave = searchParams.get('clave')?.toUpperCase().trim()

  if (!clave) {
    return NextResponse.json({ error: 'Parámetro "clave" requerido.' }, { status: 400 })
  }

  try {
    // ── MOCK ──────────────────────────────────────────────
    const adeudo = MOCK_ADEUDOS[clave]
    if (!adeudo) {
      return NextResponse.json({ periodos: [], total_adeudado: 0, clave })
    }
    return NextResponse.json(adeudo)
    // ── FIN MOCK ──────────────────────────────────────────

    /* ── PRODUCCIÓN (descomentar cuando BD esté lista) ────
    const { query } = await import('@/lib/db')
    const periodos = await query<Periodo>(
      `SELECT
         id, anio, bimestre, descripcion,
         importe_base, recargos, descuento, total, vencimiento
       FROM adeudos
       WHERE clave = ? AND pagado = 0
       ORDER BY anio ASC, bimestre ASC`,
      [clave]
    )
    const total_adeudado = periodos.reduce((sum, p) => sum + Number(p.total), 0)
    return NextResponse.json({ clave, total_adeudado, periodos })
    ── FIN PRODUCCIÓN ──────────────────────────────────── */
  } catch (err) {
    console.error('[API predial/adeudo]', err)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
