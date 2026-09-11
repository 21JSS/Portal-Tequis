'use client'

import React, { useState } from 'react'
import { Mail, Lock, User, ArrowLeft, Send, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { signIn } from "next-auth/react"

export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCredentialsLogin = async () => {
    setError('')
    setIsLoggingIn(true)
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
      setIsLoggingIn(false)
    } else {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoggingIn(true)
    await signIn("google")
  }

  const handleRegister = async () => {
    setError('')
    setSuccess('')
    if(!firstName || !lastName || !email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }
    
    setIsLoggingIn(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
      } else {
        setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.')
        setMode('login')
        setPassword('')
      }
    } catch(err) {
      setError('Error de conexión')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setSuccess('')
    if(!email) {
      setError('Ingresa tu correo para recuperar la contraseña')
      return
    }
    
    setIsLoggingIn(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setSuccess(data.message)
    } catch(err) {
      setError('Error de conexión')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative overflow-hidden pb-10">
      <AnimatePresence>
        {isLoggingIn && <LoadingScreen />}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center mb-8 w-full animate-in fade-in zoom-in-90 duration-1000 delay-300">
        <img
          src="/Tequisquiapan-Presidencia-2.svg"
          alt="Tequisquiapan"
          className="w-32 h-auto drop-shadow-2xl mb-3 transition-transform duration-700 brightness-0 invert"
        />
        <span className={`text-2xl font-bold tracking-widest text-white/90 -mt-0.5 font-sans`}>
          Tequisquiapan
        </span>
      </div>

      <div className="w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl transition-all duration-500">
        <div className="flex flex-col gap-5">
          


          {mode === 'register' && (
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-white/70 text-sm ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-white/70 text-sm ml-1">Apellido</label>
                <div className="relative">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-white/70 text-sm ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@tequis.gob.mx"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <label className="text-white/70 text-sm ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-300 text-sm bg-red-900/40 border border-red-500/50 rounded-lg p-3 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-300 text-sm bg-green-900/40 border border-green-500/50 rounded-lg p-3 text-center">
              {success}
            </div>
          )}

          {mode === 'login' && (
            <>
              <button
                onClick={handleCredentialsLogin}
                disabled={isLoggingIn || isGoogleLoggingIn}
                className="w-full bg-white text-[#8e1432] font-bold py-3 rounded-xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg disabled:opacity-70"
              >
                Acceder
              </button>

              <div className="flex justify-between px-1">
                <button onClick={() => {setMode('forgot'); setError(''); setSuccess('');}} className="text-sm text-white/70 hover:text-white transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
                <button onClick={() => {setMode('register'); setError(''); setSuccess('');}} className="text-sm text-white/70 hover:text-white transition-colors font-semibold">
                  Crear cuenta
                </button>
              </div>

              <div className="flex items-center my-1">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="mx-4 text-white/50 text-sm">o continuar con</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || isGoogleLoggingIn}
                className="w-full bg-white/10 text-white font-bold py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 bg-white rounded-full p-0.5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </>
          )}

          {mode === 'register' && (
             <div className="flex flex-col gap-3 mt-2">
               <button
                onClick={handleRegister}
                disabled={isLoggingIn}
                className="w-full bg-white text-[#8e1432] font-bold py-3 rounded-xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg disabled:opacity-70"
              >
                Registrarme
              </button>
              
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                disabled={isLoggingIn}
                className="w-full h-[52px] bg-white/5 border border-white/20 rounded-xl relative text-white font-bold group flex items-center justify-center transition-all disabled:opacity-70"
                type="button"
              >
                <div className="absolute left-1 top-1 bottom-1 w-11 bg-[#8e1432] rounded-lg flex items-center justify-center group-hover:w-[calc(100%-8px)] z-10 transition-all duration-500 ease-out">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </div>
                <span className="ml-6 tracking-wide">Regresar</span>
              </button>
             </div>
          )}

          {mode === 'forgot' && (
             <div className="flex flex-col gap-3 mt-2">
               <button
                onClick={handleForgotPassword}
                disabled={isLoggingIn}
                className="w-full bg-white text-[#8e1432] font-bold py-3 rounded-xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Send className="w-4 h-4" /> Enviar enlace
              </button>
              
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                disabled={isLoggingIn}
                className="w-full h-[52px] bg-white/5 border border-white/20 rounded-xl relative text-white font-bold group flex items-center justify-center transition-all disabled:opacity-70"
                type="button"
              >
                <div className="absolute left-1 top-1 bottom-1 w-11 bg-[#8e1432] rounded-lg flex items-center justify-center group-hover:w-[calc(100%-8px)] z-10 transition-all duration-500 ease-out">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </div>
                <span className="ml-6 tracking-wide">Regresar</span>
              </button>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
