'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { FileText } from "lucide-react"

export default function TrasladoDominioPage() {
  return (
    <TramitePageLayout
      title="Traslado de Dominio"
      subtitle="Captura de Operaciones"
      description="Realice la captura y pago de las operaciones de Traslados de Dominio, exclusiva para Notarios."
      emptyStateIcon={<FileText className="w-8 h-8" />}
      emptyStateTitle="Formulario de captura notarial"
      emptyStateDescription="Pronto estará disponible el formulario para capturar operaciones de traslado de dominio y generar líneas de pago."
      gradient="var(--gradient-traslado)"
      buttonLabel="Ingresar Documentos"
    />
  )
}
