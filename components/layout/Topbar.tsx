'use client'

import { Search, Keyboard, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { WeatherWidget } from "@/components/ui/WeatherWidget"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Topbar() {
  const { user } = useAuth()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")
  const { data: session } = useSession()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }))
      setCurrentDate(now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const tramitesList = [
    { id: 'predial', nombre: 'Pago de Predial', url: '/tramites/predial/busqueda' },
    { id: 'licencias', nombre: 'Licencias de Funcionamiento', url: '/tramites/licencias' },
    { id: 'traslado', nombre: 'Traslado de Dominio', url: '/tramites/traslado' },
    { id: 'atencion', nombre: 'Atención Ciudadana', url: '/tramites/atencion' },
    { id: 'catastral', nombre: 'Consulta Catastral', url: '/tramites/catastral' },
    { id: 'manuales', nombre: 'Manuales de Uso', url: '/tramites/manuales' },
    { id: 'sare', nombre: 'SARE', url: '/tramites/sare' },
    { id: 'registro-civil', nombre: 'Registro Civil', url: '/tramites/registro-civil' },
  ]

  const filteredTramites = tramitesList.filter(t => t.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || ''
  const userImage = session?.user?.image

  return (
    <header className="h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 animate-slide-down">
      {/* Left: Date & Time + Weather */}
      <div className="flex items-center gap-3.5">
        <div className="text-sm">
          <p className="font-semibold text-slate-800 capitalize">{currentDate}</p>
          <p className="text-xs text-slate-400">{currentTime}</p>
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-7 w-px bg-slate-200/80" />

        {/* Weather Widget */}
        <WeatherWidget />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#c5283d]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Buscar trámite, clave o servicio..."
            className="search-expandable pl-10 pr-16 py-2.5 w-72 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#c5283d]/40 focus:ring-2 focus:ring-[#c5283d]/10 transition-all bg-slate-50/80 placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            <Keyboard className="w-3 h-3" />
            <span>Ctrl+K</span>
          </div>

          {/* Search Dropdown */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50">
              {filteredTramites.length > 0 ? (
                <div className="max-h-64 overflow-y-auto py-1">
                  {filteredTramites.map(tramite => (
                    <button
                      key={tramite.id}
                      onClick={() => {
                        router.push(tramite.url)
                        setSearchQuery('')
                        setShowResults(false)
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <span className="text-sm text-slate-700 font-medium">{tramite.nombre}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No se encontraron trámites.
                </div>
              )}
            </div>
          )}
        </div>

        {/* User info */}
        {session?.user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            {userImage ? (
              <img src={userImage} alt="Perfil" className="w-8 h-8 rounded-full object-cover border-2 border-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5283d] to-[#8e1432] flex items-center justify-center text-white text-xs font-bold">
                {userName[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{session.user.role || 'Ciudadano'}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
