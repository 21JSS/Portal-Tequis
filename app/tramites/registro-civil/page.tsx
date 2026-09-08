'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { ScrollText } from "lucide-react"

export default function RegistroCivilPage() {
  return (
    <TramitePageLayout
      title="Registro Civil"
      subtitle="Solicitud de Certificaciones y Actas"
      description="Consulte, solicite la expedición de actas y gestione otros trámites registrales del Municipio de forma rápida."
      emptyStateIcon={<ScrollText className="w-8 h-8" />}
      emptyStateTitle="Listado de solicitudes de actas"
      emptyStateDescription="Pronto podrá solicitar actas de nacimiento, matrimonio, defunción y otros certificados del Registro Civil en línea."
      gradient="var(--gradient-registro)"
      buttonLabel="Solicitar Acta"
    />
  )
}
