'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useState, useEffect } from "react"
import { Activity, CheckCircle2, Clock, Zap, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { GestorDescuentos } from "@/components/admin/GestorDescuentos"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 18) return "Buenas tardes"
  return "Buenas noches"
}

export default function AdminDashboardPage() {
  const { isAuthenticated, userRole } = useAuth()
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated && userRole !== 'admin' && userRole !== 'Administrador') {
      router.push('/')
    }
  }, [isAuthenticated, userRole, router])

  if (!mounted || (userRole !== 'admin' && userRole !== 'Administrador')) return null

  const stats = [
    {
      label: "Servicios Totales",
      value: "8",
      icon: Activity,
    },
    {
      label: "En Línea Ahora",
      value: "8",
      icon: CheckCircle2,
    },
    {
      label: "Modo Activo",
      value: "Admin",
      icon: ShieldCheck,
    },
    {
      label: "Disponibilidad",
      value: "24/7",
      icon: Zap,
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Indicador de Modo Administrador */}
        <div className={`flex items-center gap-2 mb-2 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5283d]" /> Modo Administrador
          </span>
        </div>

        {/* Gestor de Descuentos para Administrador */}
        <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <GestorDescuentos />
        </div>

      </div>
    </DashboardLayout>
  )
}
