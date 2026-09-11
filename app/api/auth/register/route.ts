import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const existingUsers = await query<any>(
      "SELECT * FROM usuario WHERE correo_electronico = ?",
      [email]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: 'El correo electrónico ya está registrado' }, { status: 400 })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Crear persona
    const insertPersona = await query<any>(
      `INSERT INTO persona (primer_nombre, primer_apellido, id_municipio) VALUES (?, ?, 1)`,
      [firstName, lastName]
    ) as any
    const newPersonaId = insertPersona.insertId

    // 2. Crear usuario
    const insertUsuario = await query<any>(
      `INSERT INTO usuario (correo_electronico, contrasenia, status, id_persona) 
       VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, 2, newPersonaId]
    ) as any
    const newUserId = insertUsuario.insertId
    
    // 3. Asignar rol "Usuario"
    const roleResult = await query<any>("SELECT id FROM rol WHERE nombre = 'Usuario'")
    const roleId = roleResult.length > 0 ? roleResult[0].id : 2 // ID por defecto
    
    await query(
      "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)",
      [newUserId, roleId]
    )

    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 })
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
