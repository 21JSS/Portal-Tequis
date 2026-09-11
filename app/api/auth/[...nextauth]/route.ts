import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo Electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, ingresa tu correo y contraseña")
        }

        // Buscar usuario en DB
        const users = await query<any>(
          "SELECT * FROM usuario WHERE correo_electronico = ?",
          [credentials.email]
        )

        if (!users || users.length === 0) {
          throw new Error("No existe una cuenta con ese correo")
        }

        const user = users[0]

        // Validar contraseña
        const isPasswordValid = await bcrypt.compare(credentials.password, user.contrasenia)
        
        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta")
        }

        // Obtener rol
        const userRoles = await query<any>(
          `SELECT r.nombre 
           FROM rol r 
           INNER JOIN usuario_rol ur ON r.id = ur.id_rol 
           WHERE ur.id_usuario = ?`,
          [user.id]
        )

        const role = userRoles.length > 0 ? userRoles[0].nombre : "Usuario"

        return {
          id: user.id.toString(),
          email: user.correo_electronico,
          name: user.correo_electronico, 
          image: user.imagen,
          role: role
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Verificar si el usuario ya existe
        const existingUsers = await query<any>(
          "SELECT * FROM usuario WHERE correo_electronico = ?",
          [user.email]
        )

        if (existingUsers.length === 0) {
          // Registrar automáticamente
          // 1. Crear persona primero
          let primer_nombre = user.name?.split(" ")[0] || "Usuario"
          let primer_apellido = user.name?.split(" ").slice(1).join(" ") || "Google"
          
          const insertPersona = await query<any>(
            `INSERT INTO persona (primer_nombre, primer_apellido, id_municipio) VALUES (?, ?, 1)`,
            [primer_nombre, primer_apellido]
          ) as any
          
          const newPersonaId = insertPersona.insertId

          // 2. Crear usuario
          const insertUsuario = await query<any>(
            `INSERT INTO usuario (correo_electronico, contrasenia, status, id_persona, imagen) 
             VALUES (?, ?, ?, ?, ?)`,
            [user.email, "", 2, newPersonaId, user.image]
          ) as any
          
          const newUserId = insertUsuario.insertId
          
          // 3. Asignar rol "Usuario"
          const roleResult = await query<any>("SELECT id FROM rol WHERE nombre = 'Usuario'")
          const roleId = roleResult.length > 0 ? roleResult[0].id : 2 // ID por defecto
          
          await query(
            "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)",
            [newUserId, roleId]
          )
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      // Obtener el rol actualizado desde la base de datos para login con Google
      if (account?.provider === "google") {
         const dbUsers = await query<any>(
           "SELECT id FROM usuario WHERE correo_electronico = ?",
           [token.email]
         )
         if (dbUsers.length > 0) {
            token.id = dbUsers[0].id.toString()
            const userRoles = await query<any>(
              `SELECT r.nombre 
               FROM rol r 
               INNER JOIN usuario_rol ur ON r.id = ur.id_rol 
               WHERE ur.id_usuario = ?`,
              [dbUsers[0].id]
            )
            token.role = userRoles.length > 0 ? userRoles[0].nombre : "Usuario"
         }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/', // Usar la ruta actual como pagina de login
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
