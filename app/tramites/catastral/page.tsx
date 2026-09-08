'use client'

import { TramitePageLayout } from "@/components/layout/TramitePageLayout"
import { MapPin } from "lucide-react"

export default function ConsultaCatastralPage() {
  return (
    <TramitePageLayout
      title="Consulta Catastral"
      subtitle="Padrón Oficial de Predios"
      description="Acceda a la relación oficial de predios y propietarios para revisar el estado administrativo y jurídico."
      emptyStateIcon={<MapPin className="w-8 h-8" />}
      emptyStateTitle="Motor de búsqueda del padrón"
      emptyStateDescription="Próximamente podrá buscar predios, verificar propietarios y consultar el estado administrativo de cada registro catastral."
      gradient="var(--gradient-catastral)"
      buttonLabel="Buscar Predio"
    />
  )
}
