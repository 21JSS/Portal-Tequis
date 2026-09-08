'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { BookOpen } from "lucide-react"

export default function ManualesUsoPage() {
  return (
    <TramitePageLayout
      title="Manuales de Uso"
      subtitle="Descarga de Guías en PDF"
      description="En esta sección Usted podrá descargar los diferentes manuales de uso para los diferentes trámites ofrecidos."
      emptyStateIcon={<BookOpen className="w-8 h-8" />}
      emptyStateTitle="Lista de documentos y PDFs descargables"
      emptyStateDescription="Los manuales de uso y guías paso a paso para cada trámite estarán disponibles aquí para descarga directa."
      gradient="var(--gradient-manuales)"
      buttonLabel="Ver Documentos"
    />
  )
}
