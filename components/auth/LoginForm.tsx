'use client'

import React from 'react'
import { Mail, Lock } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { Libre_Caslon_Text } from "next/font/google"

const libreCaslon = Libre_Caslon_Text({ weight: ["400", "700"], subsets: ["latin"] })

export function LoginForm() {
  const { login } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Logo Muy Grande y Centrado */}
      <div className="flex flex-col items-center justify-center mb-12 w-full animate-in fade-in zoom-in-90 duration-1000 delay-300">
        <img
          src="/Tequisquiapan-Presidencia-2.svg"
          alt="Tequisquiapan"
          className="w-30 h-auto drop-shadow-2xl mb-0 transition-transform duration-700 brightness-0 invert"
        />
        <span className={`text-4xl font-bold tracking-widest text-white/90 mt-2 ${libreCaslon.className}`}>
          Tequisquiapan
        </span>
      </div>

      {/* Formulario de Login */}
      <div className="w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl animate-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-white/70 text-sm ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                placeholder="usuario@tequis.gob.mx"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-sm ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          <button
            onClick={login}
            className="w-full bg-white text-[#8e1432] font-bold py-3 rounded-xl hover:bg-white/90 transition-all transform active:scale-95 shadow-lg mt-2"
          >
            Acceder
          </button>
        </div>
      </div>
    </div>
  )
}
