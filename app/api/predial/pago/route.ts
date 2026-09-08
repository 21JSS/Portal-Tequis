// ============================================================
// POST /api/predial/pago
// Registra un pago y genera folio / referencia bancaria.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export interface PagoRequest {
  clave: string
  periodos_ids: string[]      // IDs de los periodos a pagar
  total: number
  metodo: 'tarjeta' | 'referencia'
  pagador: {
    nombre: string
    rfc: string
    email: string
    telefono: string
  }
  // Solo si metodo === 'tarjeta'
  tarjeta?: {
    numero_last4: string
    titular: string
  }
}

export interface PagoResponse {
  folio: string
  fecha: string
  total: number
  metodo: 'tarjeta' | 'referencia'
  referencia?: string         // Solo si metodo === 'referencia'
  banco?: string
  convenio?: string
  vigencia_referencia?: string
  clave: string
  pagador: PagoRequest['pagador']
  periodos_pagados: string[]
}

function generarFolio(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PRD-${ts}-${rand}`
}

function generarReferencia(clave: string): string {
  const num = Math.floor(Math.random() * 9000000000) + 1000000000
  return num.toString()
}

export async function POST(request: NextRequest) {
  try {
    const body: PagoRequest = await request.json()
    const { clave, periodos_ids, total, metodo, pagador, tarjeta } = body

    // Validaciones básicas
    if (!clave || !periodos_ids?.length || !total || !metodo || !pagador) {
      return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 })
    }

    const folio = generarFolio()
    const fecha = new Date().toISOString()

    let respuesta: PagoResponse

    if (metodo === 'referencia') {
      const referencia = generarReferencia(clave)
      const vigencia = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      respuesta = {
        folio,
        fecha,
        total,
        metodo,
        referencia,
        banco: 'BBVA / Santander / OXXO Pay',
        convenio: '1234567',
        vigencia_referencia: vigencia,
        clave,
        pagador,
        periodos_pagados: periodos_ids,
      }
    } else {
      respuesta = {
        folio,
        fecha,
        total,
        metodo,
        clave,
        pagador,
        periodos_pagados: periodos_ids,
      }
    }

    // ── PRODUCCIÓN (descomentar cuando BD esté lista) ────
    /*
    const { query } = await import('@/lib/db')
    await query(
      `INSERT INTO pagos
         (folio, clave, periodos_ids, total, metodo, nombre_pagador, rfc, email, telefono, referencia, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        folio,
        clave,
        JSON.stringify(periodos_ids),
        total,
        metodo,
        pagador.nombre,
        pagador.rfc,
        pagador.email,
        pagador.telefono,
        respuesta.referencia ?? null,
      ]
    )
    // Marcar periodos como pagados
    if (periodos_ids.length > 0) {
      const placeholders = periodos_ids.map(() => '?').join(',')
      await query(
        `UPDATE adeudos SET pagado = 1, folio_pago = ? WHERE id IN (${placeholders})`,
        [folio, ...periodos_ids]
      )
    }
    */
    // ── FIN PRODUCCIÓN ──────────────────────────────────

    return NextResponse.json(respuesta, { status: 200 })
  } catch (err) {
    console.error('[API predial/pago]', err)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
