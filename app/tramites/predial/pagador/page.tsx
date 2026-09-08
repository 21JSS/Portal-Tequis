'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PredialLayout } from '@/components/predial/PredialLayout'
import { ChevronRight, User, Mail, Phone, Hash, AlertCircle } from 'lucide-react'

interface FormData {
  nombre: string
  rfc: string
  email: string
  telefono: string
}

interface Errors {
  nombre?: string
  rfc?: string
  email?: string
  telefono?: string
}

function validateRFC(rfc: string): boolean {
  const re = /^([A-ZÑ&]{3,4})\d{6}([A-Z\d]{3})?$/
  return re.test(rfc.toUpperCase().trim())
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function PagadorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clave = searchParams.get('clave') || ''
  const periodos = searchParams.get('periodos') || ''
  const total = searchParams.get('total') || '0'

  const [form, setForm] = useState<FormData>({ nombre: '', rfc: '', email: '', telefono: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function handleChange(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) validate({ ...form, [field]: value })
  }

  function handleBlur(field: keyof FormData) {
    setTouched(prev => ({ ...prev, [field]: true }))
    validate(form)
  }

  function validate(data: FormData): boolean {
    const e: Errors = {}
    if (!data.nombre.trim() || data.nombre.trim().length < 3) e.nombre = 'Ingrese el nombre completo.'
    if (!data.rfc.trim()) { e.rfc = 'RFC requerido.' } else if (!validateRFC(data.rfc)) { e.rfc = 'RFC inválido. Formato: AAAA000000AA0' }
    if (!data.email.trim()) { e.email = 'Correo requerido.' } else if (!validateEmail(data.email)) { e.email = 'Correo electrónico inválido.' }
    if (!data.telefono.trim() || data.telefono.replace(/\D/g, '').length < 10) e.telefono = 'Teléfono de 10 dígitos requerido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ nombre: true, rfc: true, email: true, telefono: true })
    if (!validate(form)) return
    const params = new URLSearchParams({
      clave,
      periodos,
      total,
      nombre: form.nombre.trim().toUpperCase(),
      rfc: form.rfc.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      telefono: form.telefono.replace(/\D/g, ''),
    })
    router.push(`/tramites/predial/confirmacion?${params.toString()}`)
  }

  const fields = [
    {
      id: 'pagador-nombre',
      field: 'nombre' as keyof FormData,
      label: 'Nombre Completo',
      placeholder: 'Ej. JUAN PÉREZ GARCÍA',
      icon: User,
      type: 'text',
    },
    {
      id: 'pagador-rfc',
      field: 'rfc' as keyof FormData,
      label: 'RFC',
      placeholder: 'Ej. PEGJ800101ABC',
      icon: Hash,
      type: 'text',
    },
    {
      id: 'pagador-email',
      field: 'email' as keyof FormData,
      label: 'Correo Electrónico',
      placeholder: 'ejemplo@correo.com',
      icon: Mail,
      type: 'email',
    },
    {
      id: 'pagador-telefono',
      field: 'telefono' as keyof FormData,
      label: 'Teléfono',
      placeholder: '4421234567',
      icon: Phone,
      type: 'tel',
    },
  ]

  return (
    <PredialLayout currentStep={4} subtitle="Datos del Pagador">
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c5283d, #e8445a, #ff6b81)' }} />

        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingrese los datos de quien realizará el pago. Esta información aparecerá en el recibo oficial.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map(({ id, field, label, placeholder, icon: Icon, type }) => (
              <div key={field} className={field === 'nombre' ? 'sm:col-span-2' : ''}>
                <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {label} <span className="text-[#c5283d]">*</span>
                </label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id={id}
                    type={type}
                    value={form[field]}
                    onChange={e => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 outline-none transition-all duration-300
                      ${touched[field] && errors[field]
                        ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                        : 'border-slate-200 bg-white focus:border-[#c5283d] focus:shadow-[0_0_0_3px_rgba(197,40,61,0.1)]'
                      }`}
                  />
                </div>
                {touched[field] && errors[field] && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-500 animate-slide-down">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-xs">{errors[field]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
            Sus datos personales son utilizados únicamente para la generación del recibo de pago y no serán compartidos con terceros, conforme a la Ley Federal de Protección de Datos Personales.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl bg-white transition-all duration-200"
            >
              ← Atrás
            </button>
            <button
              type="submit"
              id="btn-continuar-pagador"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white text-sm font-semibold shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Continuar <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </PredialLayout>
  )
}
