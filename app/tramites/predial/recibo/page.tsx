'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CheckCircle2, Printer, Home, Copy, Landmark, CreditCard } from 'lucide-react'

function formatMoneda(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)
}

function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function ReciboPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const printRef = useRef<HTMLDivElement>(null)

  const folio = searchParams.get('folio') || ''
  const fecha = searchParams.get('fecha') || ''
  const total = parseFloat(searchParams.get('total') || '0')
  const metodo = (searchParams.get('metodo') || 'tarjeta') as 'tarjeta' | 'referencia'
  const clave = searchParams.get('clave') || ''
  const nombre = searchParams.get('nombre') || ''
  const email = searchParams.get('email') || ''
  const referencia = searchParams.get('referencia') || ''
  const banco = searchParams.get('banco') || ''
  const convenio = searchParams.get('convenio') || ''
  const vigencia = searchParams.get('vigencia') || ''

  function handlePrint() {
    window.print()
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => { })
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Breadcrumbs items={[
          { label: 'Trámites', href: '/' },
          { label: 'Pago de Predial', href: '/tramites/predial/busqueda' },
          { label: 'Recibo' },
        ]} />

        {/* Print area */}
        <div ref={printRef} id="recibo-predial" className="print:pt-0">

          {/* Header Logo - Visible only on print/PDF */}
          <div className="hidden print:flex flex-col items-center justify-center pt-0 pb-2 border-b border-slate-200 mb-4">
            <img
              src="/Logo-PDF-Tequisquiapan.svg"
              alt="Logo Tequisquiapan"
              className="h-40 w-auto block"
              style={{ marginBottom: '10px' }}
            />
            <p className="text-sm font-bold text-slate-800 uppercase tracking-wide z-10">
              H. Ayuntamiento de Tequisquiapan, Qro.
            </p>
            <p className="text-xs text-slate-500 italic z-10">
              Recibo Oficial de Pago de Impuesto Predial
            </p>
          </div>

          {/* Success banner */}
          <div
            className="rounded-2xl p-6 text-center text-white relative overflow-hidden mb-4"
            style={{ background: 'linear-gradient(135deg, #c5283d 0%, #e8445a 40%, #ff6b81 100%)' }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold mb-1">
                {metodo === 'referencia' ? '¡Referencia Generada!' : '¡Pago Exitoso!'}
              </h1>
              <p className="text-white/80 text-xs">
                {metodo === 'referencia'
                  ? 'Pague con la referencia bancaria en cualquier banco o OXXO.'
                  : 'Su pago de predial ha sido registrado correctamente.'}
              </p>
            </div>
          </div>

          {/* Folio */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Folio de Pago</p>
                <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">{folio}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${metodo === 'tarjeta' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                {metodo === 'tarjeta' ? <CreditCard className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                {metodo === 'tarjeta' ? 'Tarjeta' : 'Referencia Bancaria'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {[
                { label: 'Fecha y Hora', value: formatFecha(fecha) },
                { label: 'Clave Catastral', value: clave },
                { label: 'Pagador', value: nombre },
                { label: 'Correo', value: email },
                { label: 'Total Pagado', value: formatMoneda(total), bold: true },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-2">
                  <span className="text-slate-500 text-xs">{r.label}</span>
                  <span className={r.bold ? 'font-bold text-[#8e1432] text-sm' : 'font-medium text-slate-800 text-xs'}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referencia bancaria */}
          {metodo === 'referencia' && referencia && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Landmark className="w-5 h-5" />
                Datos para Pago Bancario / OXXO
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Referencia', value: referencia },
                  { label: 'Banco(s)', value: banco },
                  { label: 'Convenio CIE', value: convenio },
                  { label: 'Monto', value: formatMoneda(total) },
                  { label: 'Vigencia', value: vigencia },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-amber-100">
                    <div>
                      <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider">{r.label}</p>
                      <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">{r.value}</p>
                    </div>
                    {(r.label === 'Referencia' || r.label === 'Convenio CIE') && (
                      <button
                        onClick={() => handleCopy(r.value)}
                        className="p-2 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            id="btn-imprimir-recibo"
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-[#c5283d] hover:text-[#c5283d] transition-all duration-200"
          >
            <Printer className="w-3 h-3" style={{ color: '#8e1432' }} />
            Imprimir / Guardar PDF
          </button>
          <button
            id="btn-nuevo-tramite"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-slate-400 text-center pb-6">
          Municipio de Tequisquiapan — Ventanilla Digital · {new Date().getFullYear()}
        </p>
      </div>
    </DashboardLayout>
  )
}
