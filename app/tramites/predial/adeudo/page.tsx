'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PredialLayout } from '@/components/predial/PredialLayout'
import { ResumenPredio, type PredioData } from '@/components/predial/ResumenPredio'
import { ChevronRight, Loader2, AlertCircle, DollarSign } from 'lucide-react'

function formatMoneda(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export default function AdeudoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clave = searchParams.get('clave') || ''

  const [predio, setPredio] = useState<PredioData | null>(null)
  const [totalAdeudo, setTotalAdeudo] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clave) { router.replace('/tramites/predial/busqueda'); return }

    async function fetchData() {
      try {
        const [predioRes, adeudoRes] = await Promise.all([
          fetch(`/api/predial/predio?clave=${encodeURIComponent(clave)}`),
          fetch(`/api/predial/adeudo?clave=${encodeURIComponent(clave)}`),
        ])
        const predioData = await predioRes.json()
        const adeudoData = await adeudoRes.json()

        if (!predioRes.ok) {
          setError(predioData.error || 'No se pudo cargar la información del predio.')
          return
        }
        setPredio(predioData.predio)
        setTotalAdeudo(adeudoData.total_adeudado || 0)
      } catch {
        setError('Error de conexión. Intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clave, router])

  if (loading) {
    return (
      <PredialLayout currentStep={2} subtitle="Cargando información del predio...">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#c5283d] animate-spin" />
          </div>
          <p className="text-sm text-slate-500">Consultando información del predio...</p>
        </div>
      </PredialLayout>
    )
  }

  if (error) {
    return (
      <PredialLayout currentStep={2} subtitle="Error">
        <div className="bg-white/80 backdrop-blur-sm border border-red-200/60 rounded-2xl shadow-sm p-12 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-slate-700 font-medium">{error}</p>
          <button
            onClick={() => router.push('/tramites/predial/busqueda')}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#c5283d] text-white text-sm font-semibold hover:bg-[#a82035] transition-colors"
          >
            Volver a buscar
          </button>
        </div>
      </PredialLayout>
    )
  }

  return (
    <PredialLayout currentStep={2} subtitle="Resumen del Predio y Adeudo">
      <div className="space-y-5">
        {/* Resumen Predio */}
        {predio && <ResumenPredio predio={predio} />}

        {/* Total Adeudo Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c5283d, #e8445a, #ff6b81)' }} />
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#c5283d]" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Adeudo Total</p>
                {totalAdeudo > 0 ? (
                  <p className="text-2xl font-bold text-[#c5283d] mt-0.5">{formatMoneda(totalAdeudo)}</p>
                ) : (
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">Sin adeudo</p>
                )}
              </div>
            </div>
            {totalAdeudo > 0 && (
              <span className="text-xs font-medium text-slate-500 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                Puede seleccionar periodos
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => router.push('/tramites/predial/busqueda')}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl bg-white transition-all duration-200"
          >
            ← Cambiar clave
          </button>

          {totalAdeudo > 0 ? (
            <button
              id="btn-seleccionar-periodos"
              onClick={() => router.push(`/tramites/predial/periodos?clave=${encodeURIComponent(clave)}`)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Seleccionar Periodos <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              ✓ Al corriente
            </div>
          )}
        </div>
      </div>
    </PredialLayout>
  )
}
