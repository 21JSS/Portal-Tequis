'use client'

import { MapPin, User, Layers, Home, TrendingUp } from 'lucide-react'

export interface PredioData {
  clave: string
  propietario: string
  domicilio: string
  colonia: string
  municipio: string
  estado: string
  cp: string
  zona: string
  superficie_terreno: number
  superficie_construccion: number
  uso: string
  valor_catastral: number
}

function formatMoneda(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

interface ResumenPredioProps {
  predio: PredioData
  compact?: boolean
}

export function ResumenPredio({ predio, compact = false }: ResumenPredioProps) {
  const fields = [
    { icon: User,      label: 'Propietario',   value: predio.propietario },
    { icon: MapPin,    label: 'Domicilio',      value: `${predio.domicilio}, Col. ${predio.colonia}` },
    { icon: Home,      label: 'Municipio',      value: `${predio.municipio}, ${predio.estado} C.P. ${predio.cp}` },
    { icon: Layers,    label: 'Zona / Uso',     value: `${predio.zona} — ${predio.uso}` },
    { icon: TrendingUp, label: 'Valor Catastral', value: formatMoneda(predio.valor_catastral) },
  ]

  if (compact) {
    return (
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono text-slate-600">{predio.clave}</span>
        <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-medium">{predio.propietario}</span>
        <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">{predio.domicilio}, {predio.colonia}</span>
      </div>
    )
  }

  return (
    <div className="bg-linear-to-br from-slate-50 to-white border border-slate-200/60 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #c5283d 0%, #e8445a 100%)' }}
      >
        <Home className="w-4 h-4 text-white/80" />
        <span className="text-white text-sm font-semibold">Información del Predio</span>
        <span className="ml-auto font-mono text-white/70 text-xs">{predio.clave}</span>
      </div>

      {/* Fields */}
      <div className="divide-y divide-slate-100">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 px-5 py-3">
            <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics bar */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50">
        <div className="px-5 py-3 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sup. Terreno</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">{predio.superficie_terreno.toLocaleString()} m²</p>
        </div>
        <div className="px-5 py-3 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sup. Construcción</p>
          <p className="text-base font-bold text-slate-800 mt-0.5">{predio.superficie_construccion.toLocaleString()} m²</p>
        </div>
      </div>
    </div>
  )
}
