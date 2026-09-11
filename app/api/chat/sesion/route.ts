import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // Buscar sesión abierta del usuario
    const rows = await query<any>(
      `SELECT * FROM chat_sesion WHERE usuario_id = ? AND estado = 'abierto' ORDER BY creado_en DESC LIMIT 1`,
      [userId]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json({ sesion: null, mensajes: [] })
    }

    const sesion = rows[0]

    // Obtener historial de mensajes
    const mensajes = await query<any>(
      `SELECT * FROM chat_mensaje WHERE sesion_id = ? ORDER BY creado_en ASC`,
      [sesion.id]
    )

    return NextResponse.json({ sesion, mensajes })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
