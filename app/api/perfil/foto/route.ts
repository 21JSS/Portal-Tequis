import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('foto') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no válido. Usa JPG, PNG o WebP' }, { status: 400 })
    }

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe pesar más de 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadDir, { recursive: true })

    // Generar nombre único
    const ext = file.name.split('.').pop()
    const fileName = `avatar_${session.user.id}_${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    // Guardar ruta en la base de datos
    const imagenUrl = `/uploads/avatars/${fileName}`
    await query(
      `UPDATE usuario SET imagen = ? WHERE id = ?`,
      [imagenUrl, session.user.id]
    )

    return NextResponse.json({ success: true, imagen: imagenUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
