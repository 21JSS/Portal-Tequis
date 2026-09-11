'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PredialLayout } from '@/components/predial/PredialLayout'
import { ChevronRight, Loader2, AlertCircle, Tag, CheckSquare, Square } from 'lucide-react'

interface Periodo {
  id: string
  anio: number
  bimestre: number
  descripcion: string
  importe_base: number
  recargos: number
  descuento: number
  total: number
  vencimiento: string
}

function formatMoneda(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

export default function PeriodosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clave = searchParams.get('clave') || ''

  const [periodos, setPeriodos] = useState<Periodo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clave) { router.replace('/tramites/predial/busqueda'); return }
    fetch(`/api/predial/adeudo?clave=${encodeURIComponent(clave)}`)
      .then(r => r.json())
      .then(data => {
        setPeriodos(data.periodos || [])
      })
      .catch(() => setError('Error al cargar los periodos.'))
      .finally(() => setLoading(false))
  }, [clave, router])

  const totalBase = periodos.reduce((s, p) => s + p.importe_base, 0)
  const totalRecargos = periodos.reduce((s, p) => s + p.recargos, 0)
  const totalDescuento = periodos.reduce((s, p) => s + p.descuento, 0)
  const totalFinal = periodos.reduce((s, p) => s + p.total, 0)

  function handleContinuar() {
    const ids = periodos.map(p => p.id).join(',')
    router.push(`/tramites/predial/pagador?clave=${encodeURIComponent(clave)}&periodos=${encodeURIComponent(ids)}&total=${totalFinal}`)
  }

  if (loading) {
    return (
      <PredialLayout currentStep={3} subtitle="Cargando periodos...">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-16 flex flex-col items-center gap-4">
          <Loader2 className="w-7 h-7 text-[#c5283d] animate-spin" />
          <p className="text-sm text-slate-500">Obteniendo periodos adeudados...</p>
        </div>
      </PredialLayout>
    )
  }

  if (error) {
    return (
      <PredialLayout currentStep={3} subtitle="Error">
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl p-12 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-slate-700">{error}</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 rounded-xl bg-[#c5283d] text-white text-sm font-semibold">Volver</button>
        </div>
      </PredialLayout>
    )
  }

  return (
    <PredialLayout currentStep={3} subtitle="Seleccione los Periodos a Pagar">
      <div className="space-y-5">

        {/* Periodos list */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c5283d, #e8445a, #ff6b81)' }} />

          {/* Tabla header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-700">Desglose de Adeudos</span>
            <span className="text-xs text-slate-400">{periodos.length} {periodos.length === 1 ? 'periodo' : 'periodos'}</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50">
            {periodos.map(p => {
              const tieneDescuento = p.descuento > 0

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-slate-50"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">{p.descripcion}</span>
                      {tieneDescuento && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <Tag className="w-3 h-3" />
                          Descuento 5%
                        </span>
                      )}
                      {p.recargos > 0 && (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          +recargos
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      <span>Base: {formatMoneda(p.importe_base)}</span>
                      {p.recargos > 0 && <span className="text-amber-600">Recargos: +{formatMoneda(p.recargos)}</span>}
                      {p.descuento > 0 && <span className="text-emerald-600">Descuento: -{formatMoneda(p.descuento)}</span>}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-slate-600">{formatMoneda(p.total)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Totalizador */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-5 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span><span>{formatMoneda(totalBase)}</span>
          </div>
          {totalRecargos > 0 && (
            <div className="flex justify-between text-sm text-amber-600">
              <span>Recargos</span><span>+{formatMoneda(totalRecargos)}</span>
            </div>
          )}
          {totalDescuento > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Descuentos</span><span>-{formatMoneda(totalDescuento)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-base font-bold text-slate-900">Total a pagar</span>
            <span className="text-xl font-bold text-[#c5283d]">{formatMoneda(totalFinal)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl bg-white transition-all duration-200"
          >
            ← Atrás
          </button>
          <button
            id="btn-continuar-periodos"
            disabled={periodos.length === 0}
            onClick={handleContinuar}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              periodos.length === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5'
            }`}
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </PredialLayout>
  )
}
