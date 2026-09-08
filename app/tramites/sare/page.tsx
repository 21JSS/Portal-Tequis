'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { Rocket } from "lucide-react"

export default function SarePage() {
  return (
    <TramitePageLayout
      title="SARE — Apertura Rápida de Empresas"
      subtitle="Trámite Empresarial Rápido"
      description="Gestione y controle las solicitudes del Sistema de Apertura Rápida de Empresas para negocios de bajo riesgo."
      emptyStateIcon={<Rocket className="w-8 h-8" />}
      emptyStateTitle="Plataforma de alta empresarial"
      emptyStateDescription="El sistema SARE le permitirá registrar nuevas empresas de bajo riesgo con un proceso simplificado y acelerado."
      gradient="var(--gradient-sare)"
      buttonLabel="Iniciar Registro SARE"
    />
  )
}
