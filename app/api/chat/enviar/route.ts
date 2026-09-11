import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const userId = session.user.id
  const body = await req.json()
  const { mensaje, sesionId, esAdmin } = body

  if (!mensaje) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 })
  }

  try {
    let currentSessionId = sesionId

    // Si es un ciudadano y no envió un sesionId, creamos una nueva sesión
    if (!currentSessionId && !esAdmin) {
      const insertSesion = await query<any>(
        `INSERT INTO chat_sesion (usuario_id, estado) VALUES (?, 'abierto')`,
        [userId]
      )
      currentSessionId = insertSesion.insertId
      
      // Avisamos a todos los admins que hay un nuevo chat
      await pusherServer.trigger('admin-chats', 'nueva-sesion', {
        id: currentSessionId,
        usuario_id: userId,
        creado_en: new Date().toISOString()
      })
    }

    if (!currentSessionId) {
      return NextResponse.json({ error: 'Falta sesionId' }, { status: 400 })
    }

    // Guardar el mensaje en la base de datos
    const remitenteTipo = esAdmin ? 'admin' : 'ciudadano'
    const insertMensaje = await query<any>(
      `INSERT INTO chat_mensaje (sesion_id, remitente_tipo, remitente_id, mensaje) VALUES (?, ?, ?, ?)`,
      [currentSessionId, remitenteTipo, userId, mensaje]
    )

    const nuevoMensaje = {
      id: insertMensaje.insertId,
      sesion_id: currentSessionId,
      remitente_tipo: remitenteTipo,
      remitente_id: userId,
      mensaje: mensaje,
      creado_en: new Date().toISOString()
    }

    // Disparar evento de Pusher para el canal de esta sesión
    await pusherServer.trigger(`chat-sesion-${currentSessionId}`, 'nuevo-mensaje', nuevoMensaje)

    return NextResponse.json({ success: true, mensaje: nuevoMensaje })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
