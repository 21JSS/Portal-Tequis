import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  
  // Solo administradores
  if (!session?.user || (session.user.role !== 'Administrador' && session.user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const sesionId = searchParams.get('id')

  if (!sesionId) {
    return NextResponse.json({ error: 'Falta id de sesión' }, { status: 400 })
  }

  try {
    const mensajes = await query<any>(
      `SELECT * FROM chat_mensaje WHERE sesion_id = ? ORDER BY creado_en ASC`,
      [sesionId]
    )

    return NextResponse.json({ mensajes })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
