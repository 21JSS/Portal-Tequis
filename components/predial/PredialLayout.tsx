'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { StepIndicator } from '@/components/predial/StepIndicator'
import { DescuentosPanel } from '@/components/ui/DescuentosPanel'
import { Home } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

interface PredialLayoutProps {
  currentStep: number
  children: ReactNode
  title?: string
  subtitle?: string
}

export function PredialLayout({ currentStep, children, title, subtitle }: PredialLayoutProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-8">
        <div className="flex-1 w-full space-y-6">

          {/* Breadcrumbs */}
          <Breadcrumbs items={[
            { label: 'Trámites', href: '/' },
            { label: 'Pago de Predial', href: '/tramites/predial/busqueda' },
            ...(title ? [{ label: title }] : []),
          ]} />

          {/* Header */}
          <div className={`flex items-center gap-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #c5283d 0%, #e8445a 50%, #ff6b81 100%)' }}
            >
              <Home className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pago de Predial</h1>
              {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Step Indicator */}
          <div className={`bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-6 py-5 shadow-sm transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <StepIndicator currentStep={currentStep} />
          </div>

          {/* Content */}
          <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {children}
          </div>

        </div>

        {/* Panel de Descuentos (lado derecho) */}
        <div className={`w-full lg:w-auto transition-all duration-500 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <DescuentosPanel />
        </div>

      </div>
    </DashboardLayout>
  )
}
