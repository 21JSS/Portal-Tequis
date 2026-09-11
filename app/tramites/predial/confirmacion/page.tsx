'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PredialLayout } from '@/components/predial/PredialLayout'
import { CreditCard, Landmark, ChevronRight, Loader2, Lock, AlertCircle, Tag } from 'lucide-react'

function formatMoneda(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

function formatCardNum(raw: string) {
  return raw.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(raw: string) {
  return raw.replace(/\D/g, '').substring(0, 4).replace(/(.{2})(.{0,2})/, '$1/$2').replace(/\/$/, '')
}

type Metodo = 'tarjeta' | 'referencia'

export default function ConfirmacionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const clave    = searchParams.get('clave') || ''
  const periodos = searchParams.get('periodos') || ''
  const total    = parseFloat(searchParams.get('total') || '0')
  const nombre   = searchParams.get('nombre') || ''
  const rfc      = searchParams.get('rfc') || ''
  const email    = searchParams.get('email') || ''
  const telefono = searchParams.get('telefono') || ''

  const [metodo, setMetodo]   = useState<Metodo>('tarjeta')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Descuentos
  const [descuentosDisponibles, setDescuentosDisponibles] = useState<any[]>([])
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState<any | null>(null)
  const [totalConDescuento, setTotalConDescuento] = useState(total)
  const [mostrarDescuentos, setMostrarDescuentos] = useState(false)

  useEffect(() => {
    async function fetchDescuentos() {
      try {
        const res = await fetch('/api/descuentos')
        if (res.ok) {
          const data = await res.json()
          setDescuentosDisponibles(data)
        }
      } catch (e) {
        console.error('Error cargando descuentos:', e)
      }
    }
    fetchDescuentos()
  }, [])

  useEffect(() => {
    if (descuentoSeleccionado) {
      const porcentaje = descuentoSeleccionado.porcentaje || 0
      const montoDescuento = total * (porcentaje / 100)
      setTotalConDescuento(total - montoDescuento)
    } else {
      setTotalConDescuento(total)
    }
  }, [descuentoSeleccionado, total])

  // Tarjeta fields
  const [cardNum, setCardNum]         = useState('')
  const [cardName, setCardName]       = useState('')
  const [cardExpiry, setCardExpiry]   = useState('')
  const [cardCVV, setCardCVV]         = useState('')

  async function handlePagar() {
    setError(null)

    if (metodo === 'tarjeta') {
      if (!cardNum.replace(/\s/g, '') || !cardName || !cardExpiry || !cardCVV) {
        setError('Complete todos los datos de la tarjeta.')
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/predial/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clave,
          periodos_ids: periodos.split(',').filter(Boolean),
          total: totalConDescuento,
          metodo,
          pagador: { nombre, rfc, email, telefono },
          ...(metodo === 'tarjeta' ? { tarjeta: { numero_last4: cardNum.replace(/\s/g, '').slice(-4), titular: cardName } } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al procesar el pago.'); return }

      // Navegar al recibo
      const params = new URLSearchParams({
        folio: data.folio,
        fecha: data.fecha,
        total: String(data.total),
        metodo: data.metodo,
        clave,
        nombre,
        email,
        ...(data.referencia ? { referencia: data.referencia, banco: data.banco, convenio: data.convenio, vigencia: data.vigencia_referencia } : {}),
      })
      router.push(`/tramites/predial/recibo?${params.toString()}`)
    } catch {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const numPeriodos = periodos.split(',').filter(Boolean).length

  return (
    <PredialLayout currentStep={5} subtitle="Resumen y Método de Pago">
      <div className="space-y-5">

        {/* Resumen */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c5283d, #e8445a, #ff6b81)' }} />
          <div className="p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Resumen del Pago</h2>
            <div className="space-y-2">
              {[
                { label: 'Clave Catastral', value: clave },
                { label: 'Periodos a pagar', value: `${numPeriodos} periodo${numPeriodos !== 1 ? 's' : ''}` },
                { label: 'Pagador', value: nombre },
                { label: 'Correo', value: email },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-medium text-slate-800 text-right max-w-50 truncate">{r.value}</span>
                </div>
              ))}
            </div>

            {/* Selección de Descuento (Desplegable) */}
            <div className="pt-4 space-y-3">
              <button 
                type="button"
                onClick={() => setMostrarDescuentos(!mostrarDescuentos)}
                className="flex items-center justify-between w-full text-xs font-bold text-slate-600 uppercase tracking-wider group hover:text-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" /> 
                  Aplicar Descuento
                  {descuentoSeleccionado && (
                    <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
                      1 Activo
                    </span>
                  )}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${mostrarDescuentos ? 'rotate-90' : ''}`} />
              </button>
              
              {mostrarDescuentos && (
                <div className="grid grid-cols-1 gap-2 animate-slide-down origin-top mt-2">
                  {descuentosDisponibles.length === 0 ? (
                    <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">No hay descuentos disponibles actualmente.</p>
                  ) : (
                    descuentosDisponibles.map(desc => (
                      <button
                        key={desc.id}
                        onClick={() => setDescuentoSeleccionado(desc.id === descuentoSeleccionado?.id ? null : desc)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                          descuentoSeleccionado?.id === desc.id
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{desc.titulo}</span>
                          {desc.descripcion && <span className="text-[11px] opacity-70 leading-tight mt-0.5">{desc.descripcion}</span>}
                        </div>
                        <span className="text-sm font-extrabold ml-3 shrink-0">{desc.porcentaje}% OFF</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center bg-red-50/60 rounded-xl px-4 py-3 border border-red-100">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">Total a Pagar</span>
                {descuentoSeleccionado && (
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Aplicando {descuentoSeleccionado.porcentaje}% de descuento
                  </span>
                )}
              </div>
              <span className="text-2xl font-bold text-[#c5283d]">{formatMoneda(totalConDescuento)}</span>
            </div>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Método de Pago</h2>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'tarjeta', icon: CreditCard, label: 'Tarjeta de Crédito / Débito' },
                { value: 'referencia', icon: Landmark, label: 'Referencia Bancaria' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  id={`metodo-${opt.value}`}
                  type="button"
                  onClick={() => setMetodo(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                    metodo === opt.value
                      ? 'border-[#c5283d] bg-red-50/50 text-[#c5283d]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <opt.icon className="w-6 h-6" />
                  <span className="text-center text-xs leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Tarjeta form */}
            {metodo === 'tarjeta' && (
              <div className="space-y-4 animate-slide-down">
                <div>
                  <label htmlFor="card-numero" className="block text-xs font-semibold text-slate-600 mb-1.5">Número de Tarjeta</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="card-numero"
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      value={cardNum}
                      onChange={e => setCardNum(formatCardNum(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 text-sm font-mono rounded-xl border-2 border-slate-200 focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="card-nombre" className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre del Titular</label>
                  <input
                    id="card-nombre"
                    type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 text-sm rounded-xl border-2 border-slate-200 focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="card-vencimiento" className="block text-xs font-semibold text-slate-600 mb-1.5">Vencimiento</label>
                    <input
                      id="card-vencimiento"
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      className="w-full px-4 py-3 text-sm font-mono rounded-xl border-2 border-slate-200 focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="block text-xs font-semibold text-slate-600 mb-1.5">CVV</label>
                    <input
                      id="card-cvv"
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cardCVV}
                      onChange={e => setCardCVV(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      className="w-full px-4 py-3 text-sm font-mono rounded-xl border-2 border-slate-200 focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)] outline-none transition-all"
                    />
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="w-3.5 h-3.5" /> Pago procesado de forma segura con cifrado SSL.
                </p>
              </div>
            )}

            {/* Referencia info */}
            {metodo === 'referencia' && (
              <div className="animate-slide-down p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm space-y-2">
                <p className="font-semibold text-blue-800">¿Cómo funciona?</p>
                <ul className="text-blue-600 space-y-1 text-xs leading-relaxed list-disc list-inside">
                  <li>Se generará una referencia bancaria única para su pago.</li>
                  <li>Puede pagar en BBVA, Santander, Banamex u OXXO Pay.</li>
                  <li>La referencia tiene vigencia de <strong>3 días naturales</strong>.</li>
                  <li>Una vez que pague, guarde su comprobante.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 animate-slide-down">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl bg-white transition-all duration-200 disabled:opacity-50"
          >
            ← Atrás
          </button>
          <button
            id="btn-confirmar-pago"
            onClick={handlePagar}
            disabled={loading}
            className={`flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              loading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
            ) : (
              <><Lock className="w-4 h-4" /> Confirmar y Pagar {formatMoneda(total)} <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </PredialLayout>
  )
}
