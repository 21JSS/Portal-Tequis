'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useState, useEffect } from "react"
import { Search, Building2, User, MapPin, ChevronRight, FileText, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPredialDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('clave') // clave, propietario, direccion
  
  const [predios, setPredios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dbStats, setDbStats] = useState({
    conAdeudo: 0,
    alCorriente: 0,
    recaudacionHoy: 0,
    recibosEmitidos: 0,
    totalAdeudado: 0
  })

  useEffect(() => {
    setMounted(true)
    fetchPredios()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/predial/stats')
      if (res.ok) {
        const data = await res.json()
        setDbStats(data)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const fetchPredios = async (query = '', type = 'clave') => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/predial/search?type=${type}&query=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error('Error al consultar predios')
      const data = await res.json()
      setPredios(data.predios || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    fetchPredios(searchQuery, searchType)
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('es-MX').format(val);

  const stats = [
    { label: "Adeudo Total (Pendiente)", value: formatCurrency(dbStats.totalAdeudado), icon: TrendingUp, color: "text-red-500", bg: "bg-red-50" },
    { label: "Recaudación (Hoy)", value: formatCurrency(dbStats.recaudacionHoy), icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Predios con Adeudo", value: formatNumber(dbStats.conAdeudo), icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Predios al Corriente", value: formatNumber(dbStats.alCorriente), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#c5283d]" />
              Gestión de Predial
            </h1>
            <p className="text-slate-500 mt-1">Panel de control de padrón catastral y recaudación municipal.</p>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buscador y Tabla */}
        <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Buscador Universal</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <select 
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="px-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-[#c5283d] transition-colors"
              >
                <option value="clave">Por Clave Catastral</option>
                <option value="propietario">Por Nombre de Propietario</option>
                <option value="direccion">Por Dirección</option>
              </select>

              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={`Buscar por ${searchType}...`}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-slate-200 text-sm outline-none focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)] transition-all"
                />
              </div>

              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Buscando...' : 'Buscar Predios'}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Clave Catastral</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Propietario / Dirección</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Adeudo</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {predios.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No se encontraron predios con esos criterios.</td>
                  </tr>
                ) : predios.map((predio, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">{predio.clave}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {predio.propietario}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {predio.direccion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        predio.estado === 'Con Adeudo' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {predio.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${predio.monto > 0 ? 'text-[#c5283d]' : 'text-slate-400'}`}>
                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(predio.monto)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/admin/predial/${encodeURIComponent(predio.clave)}`)}
                        className="p-2 rounded-lg text-[#c5283d] hover:bg-red-50 transition-colors inline-flex items-center justify-center group-hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
