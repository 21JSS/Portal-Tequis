'use client'

import { Search, Bell, HelpCircle, Keyboard, ShieldCheck, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/context/AuthContext"
import { WeatherWidget } from "@/components/ui/WeatherWidget"
import { useSession } from "next-auth/react"

export function Topbar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

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
            type="text"
            placeholder="Buscar trámite, clave o servicio..."
            className="search-expandable pl-10 pr-16 py-2.5 w-72 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#c5283d]/40 focus:ring-2 focus:ring-[#c5283d]/10 transition-all bg-slate-50/80 placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            <Keyboard className="w-3 h-3" />
            <span>Ctrl+K</span>
          </div>
        </div>

        {/* User Role Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${isAdmin
            ? 'bg-amber-50 text-amber-900 border-amber-200/90'
            : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
          {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> : <User className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isAdmin ? 'Administrador' : 'Ciudadano'}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c5283d] rounded-full border-2 border-white animate-pulse-dot" />
        </button>

        {/* Guide Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
          <HelpCircle className="w-4 h-4 text-[#c5283d]" />
          Guía Rápida
        </button>

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
