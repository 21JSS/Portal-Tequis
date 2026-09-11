import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: 'El token y la contraseña son obligatorios' }, { status: 400 })
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_token_key_change_in_production'

    let decoded;
    try {
      decoded = jwt.verify(token, secret) as { id: number, email: string }
    } catch (error) {
      return NextResponse.json({ message: 'El enlace de recuperación es inválido o ha expirado' }, { status: 400 })
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar usuario en DB
    await query(
      "UPDATE usuario SET contrasenia = ? WHERE id = ?",
      [hashedPassword, decoded.id]
    )

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' }, { status: 200 })
  } catch (error) {
    console.error("Error en reset-password:", error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
