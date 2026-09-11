'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!token) {
      setError('Enlace inválido o expirado.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Error al restablecer contraseña')
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/') // redirigir al login
        }, 3000)
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">¡Contraseña Actualizada!</h2>
        <p className="text-white/80">Serás redirigido al inicio de sesión en unos segundos...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-1000">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Crea una nueva contraseña</h2>
        <p className="text-white/70 text-sm">Ingresa tu nueva contraseña para acceder a tu cuenta.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-white/70 text-sm ml-1">Nueva Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-white/70 text-sm ml-1">Confirmar Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-300 text-sm bg-red-900/40 border border-red-500/50 rounded-lg p-3 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-white text-[#8e1432] font-bold py-3 rounded-xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg mt-2 disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Restablecer Contraseña'}
        </button>

        <div className="text-center mt-4">
          <Link href="/" className="text-white/70 text-sm hover:text-white underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8e1432] to-[#5a0d20] flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative">
        <div className="flex flex-col items-center justify-center mb-12 w-full">
          <img
            src="/Tequisquiapan-Presidencia-2.svg"
            alt="Tequisquiapan"
            className="w-32 h-auto drop-shadow-2xl mb-3 brightness-0 invert"
          />
          <span className="text-2xl font-bold tracking-widest text-white/90 -mt-0.5 font-sans">
            Tequisquiapan
          </span>
        </div>

        <Suspense fallback={<div className="text-white">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
