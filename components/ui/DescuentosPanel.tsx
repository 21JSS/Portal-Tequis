'use client'

import { useEffect, useState } from 'react'
import { BadgePercent, Tag, Calendar, Sparkles, Check, Copy, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react'

export interface Descuento {
  id: string
  titulo: string
  descripcion: string
  porcentaje: number
  tramiteAsociado?: string
  vigencia?: string
  codigo?: string
  activo: boolean
  creadoEn: string
}

interface DescuentosPanelProps {
  onSelectTramite?: (tramiteName: string) => void
}

export function DescuentosPanel({ onSelectTramite }: DescuentosPanelProps) {
  const [descuentos, setDescuentos] = useState<Descuento[]>([])
  const [loading, setLoading] = useState(true)
  const [copiadoId, setCopiadoId] = useState<string | null>(null)
  const [colapsado, setColapsado] = useState(false)

  const cargarDescuentos = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/descuentos', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setDescuentos(data)
      }
    } catch (error) {
      console.error('Error al cargar descuentos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDescuentos()
  }, [])

  const copiarCodigo = (id: string, codigo: string) => {
    navigator.clipboard.writeText(codigo)
    setCopiadoId(id)
    setTimeout(() => setCopiadoId(null), 2000)
  }

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
      <div className="sticky top-24 bg-gradient-to-b from-white to-slate-50/80 rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-100/50 backdrop-blur-sm space-y-4">
        {/* Header — clickable to collapse */}
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-3 cursor-pointer select-none"
          onClick={() => setColapsado(v => !v)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <BadgePercent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                Descuentos Vigentes
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Beneficios e incentivos activos</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={cargarDescuentos}
              disabled={loading}
              title="Actualizar descuentos"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setColapsado(v => !v)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title={colapsado ? 'Expandir' : 'Colapsar'}
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${colapsado ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
          </div>
        </div>

        {/* Collapsible body */}
        <div
          style={{
            maxHeight: colapsado ? '0px' : '9999px',
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Content */}
          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs">Consultando beneficios...</span>
            </div>
          ) : descuentos.length === 0 ? (
            <div className="py-8 px-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <Tag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Sin descuentos por el momento</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Las promociones y subsidios municipales aprobados aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {descuentos.map((desc) => (
                <div
                  key={desc.id}
                  className="group relative overflow-hidden rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-4 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10 hover:border-emerald-300"
                >
                  {/* Accent notch */}
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600" />

                  <div className="pl-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {desc.tramiteAsociado || 'General'}
                      </span>
                      <span className="text-base font-extrabold text-emerald-600 tracking-tight">
                        {desc.porcentaje}% OFF
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-900 transition-colors">
                      {desc.titulo}
                    </h4>

                    {desc.descripcion && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {desc.descripcion}
                      </p>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-emerald-100/60 flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[130px]">{desc.vigencia || 'Vigente'}</span>
                      </div>

                      {desc.codigo ? (
                        <button
                          onClick={() => copiarCodigo(desc.id, desc.codigo!)}
                          className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] border transition-all ${
                            copiadoId === desc.id
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                          title="Copiar código promocional"
                        >
                          {copiadoId === desc.id ? (
                            <><Check className="w-3 h-3" /> Copiado</>
                          ) : (
                            <><Copy className="w-3 h-3 text-emerald-600" /> {desc.codigo}</>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-[10px]">
                          Aplica automático
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-800 mt-3">
            <AlertCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              Los descuentos se reflejan al momento de realizar el pago en ventanilla o en línea.
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
