'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PredialLayout } from '@/components/predial/PredialLayout'
import { Search, AlertCircle, Loader2, Hash, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import Link from 'next/link'

function formatClave(raw: string): string {
  // Permite formato libre, mayúsculas automáticas
  return raw.toUpperCase().replace(/[^A-Z0-9\-]/g, '')
}

export default function BusquedaPage() {
  const router = useRouter()
  const { userRole } = useAuth()
  const isAdmin = userRole === 'admin' || userRole === 'Administrador'
  const [clave, setClave] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    const claveClean = clave.trim()
    if (!claveClean) {
      setError('Por favor ingrese una clave catastral.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Bypass temporal para desarrollo: saltar validación de BD
      router.push(`/tramites/predial/adeudo?clave=${encodeURIComponent(claveClean)}`)
    } catch {
      setError('Error de navegación. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PredialLayout currentStep={1} subtitle="Ingrese su Clave Catastral">
      <div className="space-y-6">
        
        {/* Alerta para Administradores */}
        {isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-800">Estás en el Área Pública de Trámites</h3>
              <p className="text-xs text-amber-700 mt-0.5">Como administrador, aquí puedes ver cómo los ciudadanos realizan sus pagos. Para gestionar predios y padrón, ve a tu panel especial.</p>
            </div>
            <Link 
              href="/admin/predial"
              className="px-4 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              Ir a Gestión Predial <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          {/* Top accent */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c5283d, #e8445a, #ff6b81)' }} />

        <div className="p-8 space-y-8">
          {/* Instruction */}
          <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Hash className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-800 mb-1">¿Dónde encuentro mi Clave Catastral?</p>
              <p className="text-blue-600 leading-relaxed">
                La clave catastral aparece en su recibo de agua, boleta predial anterior o en el
                certificado catastral emitido por el municipio. Ejemplo: <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">TEQ-001-001-001</code>
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleBuscar} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="clave-catastral" className="block text-sm font-semibold text-slate-700">
                Clave Catastral <span className="text-[#c5283d]">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="clave-catastral"
                  type="text"
                  value={clave}
                  onChange={e => { setClave(formatClave(e.target.value)); setError(null) }}
                  placeholder="Ej. TEQ-001-001-001"
                  maxLength={30}
                  disabled={loading}
                  className={`w-full pl-11 pr-4 py-3.5 text-sm font-mono rounded-xl border-2 outline-none transition-all duration-300
                    bg-white text-slate-900 placeholder:text-slate-400
                    ${error
                      ? 'border-red-300 focus:border-red-400 bg-red-50/30'
                      : 'border-slate-200 focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)]'
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-red-600 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              id="btn-buscar-predio"
              disabled={loading || !clave.trim()}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300
                ${loading || !clave.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Buscar Predio
                </>
              )}
            </button>
          </form>

        </div>
      </div>
      </div>
    </PredialLayout>
  )
}