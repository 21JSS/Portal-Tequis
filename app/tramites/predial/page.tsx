'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { Home } from "lucide-react"

export default function PagoPredialPage() {
  return (
    <TramitePageLayout
      title="Pago de Predial"
      subtitle="Búsqueda por Clave Catastral"
      description="Ingrese su clave catastral para consultar su saldo y realizar el pago del impuesto predial de manera segura."
      emptyStateIcon={<Home className="w-8 h-8" />}
      emptyStateTitle="Formulario de búsqueda de predio"
      emptyStateDescription="Pronto podrá consultar su adeudo de predial ingresando su clave catastral y realizar el pago directamente en línea."
      gradient="var(--gradient-predial)"
      buttonLabel="Consultar Saldo"
    />
  )
}
