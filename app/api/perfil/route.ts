import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const users = await query<any>(
      `SELECT u.id, u.correo_electronico, u.imagen, u.telefono,
              p.primer_nombre, p.segundo_nombre, p.primer_apellido, p.segundo_apellido
       FROM usuario u
       LEFT JOIN persona p ON u.id_persona = p.id
       WHERE u.id = ?`,
      [session.user.id]
    )

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ usuario: users[0] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { primer_nombre, primer_apellido, telefono } = body

    // Actualizar persona
    await query(
      `UPDATE persona p
       JOIN usuario u ON u.id_persona = p.id
       SET p.primer_nombre = ?, p.primer_apellido = ?
       WHERE u.id = ?`,
      [primer_nombre, primer_apellido, session.user.id]
    )

    // Actualizar teléfono en usuario
    if (telefono !== undefined) {
      await query(
        `UPDATE usuario SET telefono = ? WHERE id = ?`,
        [telefono, session.user.id]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
