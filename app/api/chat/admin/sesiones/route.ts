import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  // Solo administradores
  if (!session?.user || (session.user.role !== 'Administrador' && session.user.role !== 'SuperAdmin')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const sesiones = await query<any>(
      `SELECT s.id, s.estado, s.creado_en, u.correo_electronico,
              COALESCE(p.primer_nombre, SUBSTRING_INDEX(u.correo_electronico, '@', 1)) as primer_nombre,
              COALESCE(p.primer_apellido, '') as primer_apellido
       FROM chat_sesion s
       JOIN usuario u ON s.usuario_id = u.id
       LEFT JOIN persona p ON u.id_persona = p.id
       WHERE s.estado = 'abierto'
       ORDER BY s.actualizado_en DESC`
    )

    return NextResponse.json({ sesiones })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
