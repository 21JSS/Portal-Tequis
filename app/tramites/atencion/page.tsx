'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { Users } from "lucide-react"

export default function AtencionCiudadanaPage() {
  return (
    <TramitePageLayout
      title="Atención Ciudadana"
      subtitle="Recepción de Solicitudes"
      description="Registre la recepción de nuevas solicitudes, peticiones, quejas o reportes de los ciudadanos."
      emptyStateIcon={<Users className="w-8 h-8" />}
      emptyStateTitle="Formulario de registro ciudadano"
      emptyStateDescription="El módulo de atención ciudadana permitirá registrar y dar seguimiento a solicitudes, quejas y reportes."
      gradient="var(--gradient-atencion)"
      buttonLabel="Generar Reporte"
    />
  )
}
