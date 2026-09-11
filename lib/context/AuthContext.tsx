'use client'

import React, { createContext, useContext, useState } from 'react'

export type UserRole = 'admin' | 'cliente'

export interface User {
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (role?: UserRole, email?: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const login = (
    role: UserRole = 'cliente',
    email: string = 'cliente@tequis.gob.mx',
    name: string = role === 'admin' ? 'Administrador Municipal' : 'Ciudadano'
  ) => {
    setUser({ email, name, role })
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
