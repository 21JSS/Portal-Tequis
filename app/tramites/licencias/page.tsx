'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { Store } from "lucide-react"

export default function LicenciasFuncionamientoPage() {
  return (
    <TramitePageLayout
      title="Licencias de Funcionamiento"
      subtitle="Alta o Refrendo"
      description="Seleccione el tipo de trámite comercial que desea realizar para su establecimiento."
      emptyStateIcon={<Store className="w-8 h-8" />}
      emptyStateTitle="Opciones de Alta / Refrendo / Giro Comercial"
      emptyStateDescription="Aquí podrá realizar el alta de nuevas licencias comerciales o el refrendo anual de licencias existentes."
      gradient="var(--gradient-licencias)"
      buttonLabel="Iniciar Solicitud"
    />
  )
}
