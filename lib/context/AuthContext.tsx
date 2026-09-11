'use client'

import React, { createContext, useContext } from 'react'
import { SessionProvider, useSession, signOut } from "next-auth/react"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContextInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  const isAuthenticated = status === "authenticated"
  const userRole = session?.user?.role || null

  const login = () => {
    // LoginForm ahora usa signIn de next-auth/react
  }
  const logout = () => signOut()

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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
