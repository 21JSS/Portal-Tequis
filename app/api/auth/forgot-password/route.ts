import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: 'El correo es obligatorio' }, { status: 400 })
    }

    // Verificar si el usuario existe
    const existingUsers = await query<any>(
      "SELECT id, correo_electronico FROM usuario WHERE correo_electronico = ?",
      [email]
    )

    if (existingUsers.length === 0) {
      // Por seguridad, no decimos si existe o no, solo enviamos un mensaje genérico.
      return NextResponse.json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' }, { status: 200 })
    }

    const user = existingUsers[0]

    // Generar Token JWT válido por 1 hora
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_token_key_change_in_production'
    const token = jwt.sign({ id: user.id, email: user.correo_electronico }, secret, { expiresIn: '1h' })

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

    // Configurar el transporte de correo
    let transporter;
    
    // Si no hay variables SMTP reales, usamos una cuenta de prueba de Ethereal automáticamente
    if (!process.env.SMTP_HOST) {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Ventanilla Digital" <onboarding@resend.dev>',
      to: email,
      subject: "Recuperación de Contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Recuperación de Contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva (este enlace expira en 1 hora):</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #8e1432; color: #ffffff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
          <p>Si no fuiste tú quien lo solicitó, ignora este correo.</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)

    // Si usamos Ethereal, imprimimos la URL para que el usuario pueda ver el correo en desarrollo
    if (!process.env.SMTP_HOST) {
      console.log("Correo de prueba generado! Puedes verlo aquí: %s", nodemailer.getTestMessageUrl(info))
    }

    return NextResponse.json({ message: 'Si el correo existe, se enviará un enlace de recuperación.' }, { status: 200 })
  } catch (error) {
    console.error("Error en forgot-password:", error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
