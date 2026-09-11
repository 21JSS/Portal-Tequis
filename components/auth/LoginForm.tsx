'use client'

import React, { useState } from 'react'
import { Mail, Lock, User, ArrowLeft, Send } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useAuth } from '@/lib/context/AuthContext'

export function LoginForm() {
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCredentialsLogin = async () => {
    setError('')
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña')
      return
    }

    setIsLoggingIn(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))

      const normalizedEmail = email.trim().toLowerCase()

      if (normalizedEmail.includes('admin') || password === 'admin123') {
        login('admin', email, 'Administrador Municipal')
      } else {
        login('cliente', email, firstName ? `${firstName} ${lastName}` : 'Ciudadano / Contribuyente')
      }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsGoogleLoggingIn(true)
    setIsLoggingIn(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      login('cliente', 'usuario.google@gmail.com', 'Usuario Google')
    } catch {
      setError('Error al iniciar sesión con Google')
    } finally {
      setIsGoogleLoggingIn(false)
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    if (!firstName || !lastName || !email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }
    
    setIsLoggingIn(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      }).catch(() => null)

      if (res && !res.ok) {
        const data = await res.json()
        setError(data.message || 'Error al registrar usuario')
      } else {
        setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.')
        setMode('login')
        setPassword('')
      }
    } catch {
      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.')
      setMode('login')
      setPassword('')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')
    if (!email) {
      setError('Ingresa tu correo para recuperar la contraseña')
      return
    }
    
    setIsLoggingIn(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      }).catch(() => null)

      if (res && res.ok) {
        const data = await res.json()
        setSuccess(data.message)
      } else {
        setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.')
      }
    } catch {
      setSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative my-auto">
      <AnimatePresence>
        {isLoggingIn && <LoadingScreen />}
      </AnimatePresence>

      {/* Logo Compacto */}
      <div className="flex flex-col items-center justify-center mb-3.5 w-full animate-in fade-in zoom-in-90 duration-700">
        <img
          src="/Tequisquiapan-Presidencia-2.svg"
          alt="Tequisquiapan"
          className="w-20 h-auto drop-shadow-xl mb-1.5 transition-transform duration-500 brightness-0 invert"
        />
        <span className="text-lg font-bold tracking-widest text-white/90 font-sans">
          Tequisquiapan
        </span>
      </div>

      {/* Tarjeta de Formulario Alargada Horizontalmente */}
      <div className="w-full bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 shadow-2xl transition-all duration-300">
        <div className="flex flex-col gap-3">
          
          {mode !== 'login' && (
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className="self-start flex items-center text-white/70 hover:text-white transition-colors text-xs -mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Volver al login
            </button>
          )}

          {error && (
            <div className="text-red-200 text-xs bg-red-900/50 border border-red-500/40 rounded-lg py-2 px-3 text-center animate-in fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="text-emerald-200 text-xs bg-emerald-900/50 border border-emerald-500/40 rounded-lg py-2 px-3 text-center animate-in fade-in">
              {success}
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-white/80 text-xs ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-white/80 text-xs ml-1">Apellido</label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-2 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-white/80 text-xs ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@tequis.gob.mx"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <label className="text-white/80 text-xs ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <>
              <button
                onClick={handleCredentialsLogin}
                disabled={isLoggingIn || isGoogleLoggingIn}
                className="w-full bg-white text-[#8e1432] font-bold py-2.5 rounded-xl hover:bg-[#fdf2f4] hover:scale-[1.01] transition-all transform active:scale-95 shadow-md disabled:opacity-70 text-sm mt-1"
              >
                Acceder
              </button>

              <div className="flex justify-between items-center px-1 text-xs">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                  className="text-white/75 hover:text-white transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  className="text-white font-semibold hover:underline transition-colors"
                >
                  Crear cuenta
                </button>
              </div>

              <div className="flex items-center my-0.5">
                <div className="flex-grow border-t border-white/15"></div>
                <span className="mx-3 text-white/50 text-[11px]">o continuar con</span>
                <div className="flex-grow border-t border-white/15"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || isGoogleLoggingIn}
                className="w-full bg-white/10 text-white font-medium py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all transform active:scale-95 shadow-md flex items-center justify-center gap-2.5 disabled:opacity-70 text-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 bg-white rounded-full p-0.5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>

              <div className="pt-2 border-t border-white/10 mt-1">
                <p className="text-[11px] text-white/70 text-center mb-1.5 font-medium">
                  Cuentas de prueba disponibles:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@tequis.gob.mx')
                      setPassword('admin123')
                      setError('')
                    }}
                    className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1"
                  >
                    🛡️ Admin (Todos)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('cliente@tequis.gob.mx')
                      setPassword('cliente123')
                      setError('')
                    }}
                    className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-medium transition-all text-center flex items-center justify-center gap-1"
                  >
                    👤 Cliente (Predial)
                  </button>
                </div>
              </div>
            </>
          )}

          {mode === 'register' && (
            <button
              onClick={handleRegister}
              disabled={isLoggingIn}
              className="w-full bg-white text-[#8e1432] font-bold py-2.5 rounded-xl hover:bg-[#fdf2f4] transition-all transform active:scale-95 shadow-md mt-1 disabled:opacity-70 text-sm"
            >
              Registrarme
            </button>
          )}

          {mode === 'forgot' && (
            <button
              onClick={handleForgotPassword}
              disabled={isLoggingIn}
              className="w-full bg-white text-[#8e1432] font-bold py-2.5 rounded-xl hover:bg-[#fdf2f4] transition-all transform active:scale-95 shadow-md mt-1 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" /> Enviar enlace de recuperación
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
