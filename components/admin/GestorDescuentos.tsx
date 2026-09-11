'use client'

import { useEffect, useState } from 'react'
import { 
  BadgePercent, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  X,
  FileText,
  Tag,
  ChevronDown
} from 'lucide-react'
import { Descuento } from '@/app/api/descuentos/route'

const TRAMITES_OPCIONES = [
  'Todos los trámites',
  'Pago de Predial',
  'Licencias de Funcionamiento',
  'Traslado de Dominio',
  'Atención Ciudadana',
  'Consulta Catastral',
  'SARE',
  'Registro Civil'
]

export function GestorDescuentos() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [colapsado, setColapsado] = useState(false)

  // Form states
  const [titulo, setTitulo] = useState('')
  const [porcentaje, setPorcentaje] = useState<number>(10)
  const [tramiteAsociado, setTramiteAsociado] = useState('Pago de Predial')
  const [vigencia, setVigencia] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const cargarDescuentos = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/descuentos', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setDescuentos(data)
      }
    } catch (err) {
      console.error('Error cargando descuentos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDescuentos()
  }, [])

  const limpiarFormulario = () => {
    setTitulo('')
    setPorcentaje(10)
    setTramiteAsociado('Pago de Predial')
    setVigencia('')
    setCodigo('')
    setDescripcion('')
    setErrorForm(null)
  }

  const crearDescuento = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim()) {
      setErrorForm('El título del descuento es obligatorio.')
      return
    }
    if (porcentaje <= 0 || porcentaje > 100) {
      setErrorForm('El porcentaje debe estar entre 1% y 100%.')
      return
    }

    try {
      setGuardando(true)
      setErrorForm(null)
      const res = await fetch('/api/descuentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          porcentaje: Number(porcentaje),
          tramiteAsociado,
          vigencia: vigencia.trim() || 'Vigente durante el año en curso',
          codigo: codigo.trim() || undefined,
          descripcion: descripcion.trim()
        })
      })

      if (res.ok) {
        const nuevo = await res.json()
        setDescuentos([nuevo, ...descuentos])
        setMensajeExito(`Descuento "${nuevo.titulo}" publicado exitosamente.`)
        limpiarFormulario()
        setMostrarForm(false)
        setTimeout(() => setMensajeExito(null), 4000)
      } else {
        const data = await res.json()
        setErrorForm(data.error || 'Error al guardar el descuento.')
      }
    } catch {
      setErrorForm('Ocurrió un error al comunicarse con el servidor.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarDescuento = async (id: string, nombre: string) => {
    if (!confirm(`¿Está seguro de eliminar el descuento "${nombre}"? Los ciudadanos dejarán de verlo de inmediato.`)) {
      return
    }

    try {
      setEliminandoId(id)
      const res = await fetch(`/api/descuentos?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setDescuentos(descuentos.filter(d => d.id !== id))
        setMensajeExito(`Descuento "${nombre}" eliminado.`)
        setTimeout(() => setMensajeExito(null), 3000)
      } else {
        alert('No se pudo eliminar el descuento.')
      }
    } catch {
      alert('Error de conexión al eliminar el descuento.')
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header Bar — clickeable para colapsar/expandir */}
      <div
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
        onClick={() => setColapsado(!colapsado)}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-400 shadow-inner">
            <BadgePercent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500/30 border border-red-400/40 text-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Módulo Administrativo
              </span>
              <span className="text-xs text-slate-400">
                {descuentos.length} {descuentos.length === 1 ? 'activo' : 'activos'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Gestor de Descuentos e Incentivos Fiscales
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Administre las promociones, incentivos y condonaciones visibles para la ciudadanía.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
          <button
            onClick={cargarDescuentos}
            disabled={loading}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10"
            title="Recargar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setMostrarForm(!mostrarForm)
              if (!mostrarForm) limpiarFormulario()
              if (colapsado) setColapsado(false)
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              mostrarForm 
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-600 shadow-red-900/30'
            }`}
          >
            {mostrarForm ? (
              <>
                <X className="w-4 h-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Dar de Alta Descuento
              </>
            )}
          </button>

          {/* Chevron de colapso */}
          <button
            onClick={() => setColapsado(!colapsado)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10"
            title={colapsado ? 'Expandir módulo' : 'Colapsar módulo'}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${colapsado ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>
        </div>
      </div>

      {/* Cuerpo colapsable */}
      <div
        style={{
          maxHeight: colapsado ? '0px' : '9999px',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >

      {/* Notifications */}
      {mensajeExito && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Creation Form Accordion */}
      {mostrarForm && (
        <form onSubmit={crearDescuento} className="p-6 border-b border-slate-200 bg-slate-50/60 animate-fadeIn">
          <div className="max-w-4xl">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              Alta de Nuevo Descuento o Estímulo Municipal
            </h4>

            {errorForm && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorForm}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título del Descuento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 15% Descuento por Pronto Pago Predial"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                />
              </div>

              {/* Porcentaje */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Porcentaje de Descuento (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white pr-8 font-bold text-red-600"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              {/* Trámite Asociado */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trámite al que Aplica
                </label>
                <select
                  value={tramiteAsociado}
                  onChange={(e) => setTramiteAsociado(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                >
                  {TRAMITES_OPCIONES.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Vigencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vigencia / Fecha Límite
                </label>
                <input
                  type="text"
                  placeholder="Ej. 31 de Marzo, 2026"
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                />
              </div>

              {/* Código Promocional (Opcional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Código de Cupón (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. PREDIAL2026"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
                />
              </div>

              {/* Descripción */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción o Condiciones del Descuento
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre quién califica, requisitos o aplicación automática al realizar el pago..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#c5283d] hover:bg-[#a82234] text-white transition-all shadow-md shadow-red-500/20 disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Publicar Descuento
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Discounts List */}
      <div className="p-6">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-red-600 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Cargando descuentos...</span>
          </div>
        ) : descuentos.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
            <Tag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No hay descuentos dados de alta</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Presione el botón "Dar de Alta Descuento" para configurar una nueva promoción fiscal municipal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {descuentos.map((desc) => (
              <div
                key={desc.id}
                className="relative bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200/90 p-4 shadow-sm hover:shadow transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                      {desc.tramiteAsociado || 'General'}
                    </span>

                    <span className="text-base font-black text-red-600 tracking-tight bg-red-50/50 px-2 py-0.5 rounded border border-red-100/50">
                      {desc.porcentaje}%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                    {desc.titulo}
                  </h4>

                  {desc.descripcion && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {desc.descripcion}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[130px]">{desc.vigencia || 'Sin vigencia fija'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {desc.codigo && (
                      <span className="font-mono font-bold text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        {desc.codigo}
                      </span>
                    )}

                    <button
                      onClick={() => eliminarDescuento(desc.id, desc.titulo)}
                      disabled={eliminandoId === desc.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors title='Eliminar descuento'"
                      title="Eliminar descuento"
                    >
                      {eliminandoId === desc.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cierre del cuerpo colapsable */}
      </div>
    </div>
  )
}
