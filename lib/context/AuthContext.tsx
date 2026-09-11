'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, useSession, signOut } from "next-auth/react"

export interface AuthUser {
  email: string
  name: string | null
  role: string | null
  image?: string | null
}

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  user: AuthUser | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContextInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === "authenticated"
  const userRole = (session?.user as any)?.role || null

  const user: AuthUser | null = session?.user
    ? {
        email: session.user.email ?? '',
        name: session.user.name ?? null,
        role: userRole,
        image: session.user.image ?? null,
      }
    : null

  const login = () => {
    // LoginForm usa signIn de next-auth/react
  }
  const logout = () => signOut()

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextInner>
        {children}
      </AuthContextInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
