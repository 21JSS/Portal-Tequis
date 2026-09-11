'use client'

import { TramiteCard } from "@/components/ui/TramiteCard"
import { AnimatedCard } from "@/components/ui/AnimatedCard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, CheckCircle2, Clock, Zap, Sparkles, ShieldCheck, User as UserIcon } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { DescuentosPanel } from "@/components/ui/DescuentosPanel"
import { GestorDescuentos } from "@/components/admin/GestorDescuentos"

// Types for our array
type EstadoColor = "green" | "blue" | "purple" | "orange" | "gray"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 18) return "Buenas tardes"
  return "Buenas noches"
}

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [filtroActivo, setFiltroActivo] = useState("Todos (8)")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const listaTramites = [
    {
      id: "predial",
      titulo: "Pago de Predial",
      descripcion: "Aquí podrá realizar el pago del impuesto predial de manera rápida y segura, mediante su Clave Catastral.",
      categoria: "Clave Catastral",
      estado: "En Línea 24/7",
      estadoColor: "green" as EstadoColor,
      disponible: true, // Disponible tanto para admin como para cliente
      imagen: ""
    },
    {
      id: "licencias",
      titulo: "Licencias de Funcionamiento",
      descripcion: "En este módulo podrá realizar el Alta o Refrendo de las Licencias de Funcionamiento otorgadas por el municipio.",
      categoria: "Comercio",
      estado: isAdmin ? "Alta y Refrendo" : "Próximamente",
      estadoColor: (isAdmin ? "blue" : "gray") as EstadoColor,
      disponible: isAdmin, // Solo admin
      imagen: ""
    },
    {
      id: "traslado",
      titulo: "Traslado de Dominio",
      descripcion: "Realice la captura y pago de las operaciones de Traslados de Dominio posteriores al 27/01/2012.",
      categoria: "Notarial",
      estado: isAdmin ? "Captura y Pago" : "Próximamente",
      estadoColor: (isAdmin ? "purple" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    },
    {
      id: "atencion",
      titulo: "Atención Ciudadana",
      descripcion: "Proporcione requisitos de los diferentes trámites a los ciudadanos y Registre la recepción de nuevas solicitudes.",
      categoria: "Ventanilla",
      estado: isAdmin ? "Recepción" : "Próximamente",
      estadoColor: (isAdmin ? "orange" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    },
    {
      id: "catastral",
      titulo: "Consulta Catastral",
      descripcion: "En esta opción encontrará la relación de predios y propietarios así como su administración.",
      categoria: "Predios",
      estado: isAdmin ? "Padrón Oficial" : "Próximamente",
      estadoColor: (isAdmin ? "blue" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    },
    {
      id: "manuales",
      titulo: "Manuales de Uso",
      descripcion: "En esta sección Usted podrá descargar los diferentes manuales de uso para los diferentes trámites ofrecidos.",
      categoria: "Descargas",
      estado: isAdmin ? "PDF / Guías" : "Próximamente",
      estadoColor: (isAdmin ? "gray" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    },
    {
      id: "sare",
      titulo: "SARE",
      descripcion: "Mediante esta opción podrán controlarse las solicitudes del Sistema de Apertura Rápida de Empresas.",
      categoria: "Apertura Rápida",
      estado: isAdmin ? "Empresarial" : "Próximamente",
      estadoColor: (isAdmin ? "green" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    },
    {
      id: "registro-civil",
      titulo: "Registro Civil",
      descripcion: "Registro Civil. Consulta, expedición de actas y gestión de trámites registrales del Municipio.",
      categoria: "Actas y Registros",
      estado: isAdmin ? "Certificaciones" : "Próximamente",
      estadoColor: (isAdmin ? "purple" : "gray") as EstadoColor,
      disponible: isAdmin,
      imagen: ""
    }
  ]

  const stats = [
    {
      label: "Servicios Totales",
      value: "8",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      label: "En Línea Ahora",
      value: isAdmin ? "8" : "1",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      label: isAdmin ? "Modo Activo" : "Próximamente",
      value: isAdmin ? "Admin" : "7",
      icon: isAdmin ? ShieldCheck : Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      label: "Disponibilidad",
      value: "24/7",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100"
    },
  ]

  const manejarTramite = (id: string, disponible: boolean) => {
    if (!disponible) return
    if (id === 'predial') {
      router.push('/tramites/predial/busqueda')
    } else {
      router.push(`/tramites/${id}`)
    }
  }

  const filtros = isAdmin 
    ? ["Todos (8)", "Impuestos y Predial", "Empresas y Comercio"]
    : ["Todos (8)", "Disponibles (1)", "Próximamente (7)"]

  const tramitesFiltrados = listaTramites.filter(t => {
    if (!isAdmin) {
      if (filtroActivo === "Disponibles (1)") return t.disponible
      if (filtroActivo === "Próximamente (7)") return !t.disponible
      return true
    } else {
      if (filtroActivo === "Impuestos y Predial") return t.id === 'predial' || t.id === 'catastral' || t.id === 'traslado'
      if (filtroActivo === "Empresas y Comercio") return t.id === 'licencias' || t.id === 'sare'
      return true
    }
  })

  return (
    <DashboardLayout>
      <div className="max-w-[1440px] mx-auto space-y-8">

        {/* Welcome Banner (solo visible para Administrador) */}
        {isAdmin && (
          <div
            className="relative overflow-hidden rounded-2xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, #c5283d 0%, #e8445a 40%, #ff6b81 100%)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className={`flex items-center gap-2 mb-2 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <span className="flex items-center gap-1.5 bg-white/20 border border-white/25 px-3 py-1 rounded-full text-xs font-semibold text-white">
                    <ShieldCheck className="w-3.5 h-3.5" /> Modo Administrador — Acceso Completo
                  </span>
                </div>
                <h1 className={`text-2xl md:text-3xl font-bold text-white mb-1 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {getGreeting()}, {user?.name || "Administrador"} 👋
                </h1>
                <p className={`text-white/70 text-sm md:text-base transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  Panel de administración municipal: dispone de acceso activo a todos los módulos y trámites del sistema.
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className={`relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/15 backdrop-blur-md rounded-xl p-3.5 border border-white/20 hover:bg-white/25 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-white/80" />
                    <span className="text-[11px] text-white/70 font-medium">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gestor de Descuentos para Administrador */}
        {isAdmin && (
          <div className={`transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <GestorDescuentos />
          </div>
        )}

        {/* Sección Principal con Trámites y Panel de Descuentos para Cliente */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1 w-full space-y-6">
            {/* Header with filters */}
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-[#c5283d] rounded-full" />
                  <h2 className="text-2xl font-bold text-slate-900">Trámites Disponibles</h2>
                </div>
                <p className="text-slate-500 mt-1.5 ml-4 text-sm">
                  Explora los servicios municipales disponibles para gestión digital.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Filtrar:</span>
                <div className="flex gap-2">
                  {filtros.map(f => (
                    <button
                      key={f}
                      onClick={() => setFiltroActivo(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                        filtroActivo === f 
                          ? 'bg-[#c5283d] text-white border-[#c5283d] shadow-md shadow-red-500/20' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid with animated cards */}
            <section className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-2 xl:grid-cols-3'} gap-6`}>
              {tramitesFiltrados.map((tramite, index) => (
                <AnimatedCard key={tramite.id} delay={index * 0.05}>
                  <TramiteCard
                    id={tramite.id}
                    titulo={tramite.titulo}
                    descripcion={tramite.descripcion}
                    categoria={tramite.categoria}
                    estado={tramite.estado}
                    estadoColor={tramite.estadoColor}
                    disponible={tramite.disponible}
                    imagen={tramite.imagen}
                    alSeleccionar={() => manejarTramite(tramite.id, tramite.disponible)}
                  />
                </AnimatedCard>
              ))}
            </section>
          </div>

          {/* Panel de Descuentos para el Cliente (lado derecho) */}
          {!isAdmin && (
            <div className={`w-full lg:w-auto transition-all duration-500 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <DescuentosPanel />
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className={`flex items-center justify-between py-4 px-5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 text-xs text-slate-400 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>Ventanilla Digital — Municipio de Tequisquiapan</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-dot" />
            Sistema en línea
          </span>
        </div>

      </div>
    </DashboardLayout>
  )
}