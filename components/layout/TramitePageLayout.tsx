'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { EmptyState } from "@/components/ui/EmptyState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState, type ReactNode } from "react"

interface TramitePageLayoutProps {
  title: string
  subtitle: string
  description: string
  emptyStateIcon: ReactNode
  emptyStateTitle: string
  emptyStateDescription: string
  gradient: string
  buttonLabel: string
  children?: ReactNode
}

export function TramitePageLayout({
  title,
  subtitle,
  description,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  gradient,
  buttonLabel,
  children,
}: TramitePageLayoutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { label: "Trámites", href: "/" },
          { label: title },
        ]} />

        {/* Header with gradient accent */}
        <div className={`flex items-center gap-4 pb-5 border-b border-slate-200/60 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: gradient }}>
            <div className="text-white scale-110">{emptyStateIcon}</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-800">{subtitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>

              {children || (
                <EmptyState
                  icon={emptyStateIcon}
                  title={emptyStateTitle}
                  description={emptyStateDescription}
                  gradient={gradient}
                />
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">Este módulo estará disponible próximamente.</p>
                <Button className="bg-[#c5283d] hover:bg-[#a82035] text-white shadow-md shadow-red-500/15 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5">
                  {buttonLabel}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
