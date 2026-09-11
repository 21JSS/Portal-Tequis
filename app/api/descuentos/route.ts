import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export interface Descuento {
  id: string
  titulo: string
  descripcion: string
  porcentaje: number
  tramiteAsociado?: string
  vigencia?: string
  codigo?: string
  activo: boolean
  creadoEn: string
}

const filePath = path.join(process.cwd(), 'data', 'descuentos.json')

async function getDescuentosFromFile(): Promise<Descuento[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveDescuentosToFile(data: Descuento[]): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving discounts:', error)
    return false
  }
}

export async function GET() {
  const descuentos = await getDescuentosFromFile()
  return NextResponse.json(descuentos, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { titulo, descripcion, porcentaje, tramiteAsociado, vigencia, codigo } = body

    if (!titulo || typeof porcentaje !== 'number') {
      return NextResponse.json({ error: 'Título y porcentaje son requeridos' }, { status: 400 })
    }

    const descuentos = await getDescuentosFromFile()
    const nuevoDescuento: Descuento = {
      id: `desc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      porcentaje: Math.min(100, Math.max(1, Number(porcentaje))),
      tramiteAsociado: tramiteAsociado || 'Todos los trámites',
      vigencia: vigencia ? vigencia.trim() : 'Hasta nuevo aviso',
      codigo: codigo ? codigo.trim().toUpperCase() : undefined,
      activo: true,
      creadoEn: new Date().toISOString()
    }

    descuentos.unshift(nuevoDescuento)
    await saveDescuentosToFile(descuentos)

    return NextResponse.json(nuevoDescuento, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
    }

    const descuentos = await getDescuentosFromFile()
    const index = descuentos.findIndex(d => d.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Descuento no encontrado' }, { status: 404 })
    }

    descuentos.splice(index, 1)
    await saveDescuentosToFile(descuentos)

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar descuento' }, { status: 500 })
  }
}
