'use client'

import { useState } from "react"
import { Search, Store, Calendar, Activity, AlertCircle, FileText, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LicenciaData {
  folio: number;
  titular: string;
  actividad: string;
  tipoGiro: string;
  vendeAlcohol: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
  estatus: number;
}

export default function LicenciasFuncionamientoPage() {
  const [folio, setFolio] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [licencia, setLicencia] = useState<LicenciaData | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folio.trim()) return

    setLoading(true)
    setError(null)
    setLicencia(null)

    try {
      const res = await fetch(`/api/licencias/search?folio=${encodeURIComponent(folio)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error al buscar la licencia')
      }

      setLicencia(data.licencia)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Botón Regresar */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Regresar al inicio
        </Link>
      </div>

      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Licencias de Funcionamiento</h1>
        <p className="text-slate-500 mt-2 text-lg">Consulta el estado, titular y detalles de cualquier licencia de funcionamiento por medio de su folio.</p>
      </div>

      {/* Tarjeta de Búsqueda */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-6 h-6 text-white/80" />
            <h2 className="text-xl font-semibold">Buscador de Licencias</h2>
          </div>
          <p className="text-white/80 text-sm">Ingrese el folio de solicitud o trámite para buscar en el padrón</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                placeholder="Ejemplo: 42 (Folio de Solicitud)"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Buscar'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Resultados */}
      {licencia && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">Folio: {licencia.folio}</h2>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Encontrado
                </span>
              </div>
              <p className="text-slate-500 text-sm">Detalles extraídos del sistema</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Titular / Razón Social</p>
                <p className="text-lg font-semibold text-slate-900">{licencia.titular}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Actividad Comercial</p>
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                  <p className="text-base text-slate-700">{licencia.actividad}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tipo de Giro</p>
                <p className="text-base text-slate-700">{licencia.tipoGiro}</p>
              </div>
            </div>

            <div className="space-y-6 md:border-l md:border-slate-100 md:pl-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Fechas de Vigencia</p>
                <div className="flex items-center gap-2 text-slate-700 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Inicio: {licencia.fechaInicio ? new Date(licencia.fechaInicio).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Fin: {licencia.fechaFin ? new Date(licencia.fechaFin).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Venta de Alcohol</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${licencia.vendeAlcohol ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                  {licencia.vendeAlcohol ? 'Sí Autorizado' : 'No Autorizado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
