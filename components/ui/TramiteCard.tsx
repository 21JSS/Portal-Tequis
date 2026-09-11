import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChevronRight, Home, Store, FileText, Users, MapPin, BookOpen, Rocket, ScrollText, Lock, Sparkles } from "lucide-react"

interface TramiteProps {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  estado: string
  estadoColor?: "green" | "blue" | "purple" | "orange" | "gray"
  disponible?: boolean
  imagen: string
  alSeleccionar: () => void
}

const categoryIcons: Record<string, any> = {
  predial: Home,
  licencias: Store,
  traslado: FileText,
  atencion: Users,
  catastral: MapPin,
  manuales: BookOpen,
  sare: Rocket,
  "registro-civil": ScrollText,
}

const categoryGradients: Record<string, string> = {
  predial: "var(--gradient-predial)",
  licencias: "var(--gradient-licencias)",
  traslado: "var(--gradient-traslado)",
  atencion: "var(--gradient-atencion)",
  catastral: "var(--gradient-catastral)",
  manuales: "var(--gradient-manuales)",
  sare: "var(--gradient-sare)",
  "registro-civil": "var(--gradient-registro)",
}

export function TramiteCard({
  id,
  titulo,
  descripcion,
  categoria,
  estado,
  estadoColor = "green",
  disponible = true,
  alSeleccionar
}: TramiteProps) {

  const colorStyles = {
    green: "border-emerald-200 text-emerald-700 bg-emerald-50",
    blue: "border-blue-200 text-blue-700 bg-blue-50",
    purple: "border-purple-200 text-purple-700 bg-purple-50",
    orange: "border-orange-200 text-orange-700 bg-orange-50",
    gray: "border-slate-200 text-slate-600 bg-slate-50",
  }

  const dotColors = {
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    gray: "bg-slate-400",
  }

  const selectedColorStyle = colorStyles[estadoColor] || colorStyles.green
  const selectedDotColor = dotColors[estadoColor] || dotColors.green
  const Icon = categoryIcons[id] || Home
  const gradient = categoryGradients[id] || categoryGradients.predial

  return (
    <Card
      className={`relative overflow-hidden flex flex-col transition-all duration-300 ${disponible
        ? "bg-white border-2 border-[#c5283d]/50 shadow-xl shadow-red-500/10 ring-2 ring-[#c5283d]/20 hover:border-[#c5283d] hover:ring-8 hover:ring-[#c5283d]/25 hover:shadow-2xl hover:shadow-red-500/25 hover:scale-[1.03] cursor-pointer group"
        : "bg-slate-50/70 border-slate-200/60 shadow-xs cursor-default select-none"
        }`}
      onClick={() => {
        if (disponible) alSeleccionar()
      }}
    >
      {/* Badge destacado para el módulo disponible */}
      {disponible && (
        <div className="absolute top-3 right-3 z-20 bg-white/95 text-[#c5283d] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md border border-red-200 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3 h-3 text-[#c5283d]" />
          <span>Habilitado</span>
        </div>
      )}

      {/* Contenido interior de la tarjeta con blur disminuido */}
      <div className={`flex flex-col flex-1 ${!disponible ? "filter blur-[1.2px] opacity-80" : ""}`}>
        {/* Gradient Header with Icon */}
        <div
          className="relative h-36 w-full gradient-shimmer-overlay flex items-center justify-center transition-all"
          style={{ background: gradient }}
        >
          <Icon className={`w-12 h-12 text-white/90 transition-transform duration-500 ease-out ${disponible ? "group-hover:scale-110" : ""}`} strokeWidth={1.5} />

          {/* Category badge */}
          <div className="absolute top-3.5 left-3.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
            {categoria}
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
        </div>

        <CardHeader className="pb-1.5 pt-5">
          <CardTitle className={`text-lg font-bold text-slate-900 transition-colors ${disponible ? "group-hover:text-[#c5283d]" : ""}`}>
            {titulo}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-5 flex-1">
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">{descripcion}</p>
        </CardContent>

        {/* Footer / Actions */}
        <CardFooter className="pt-3.5 pb-4 border-t border-slate-100 flex items-center justify-between">
          <span className={`text-[11px] font-medium px-2.5 py-1 border rounded-full flex items-center gap-1.5 ${selectedColorStyle}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${selectedDotColor} ${estadoColor === 'green' ? 'animate-pulse-dot' : ''}`} />
            {estado}
          </span>

          {disponible ? (
            <button
              type="button"
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-[#c5283d] to-[#e8445a] text-white text-xs font-bold shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 hover:scale-105 transition-all group/btn"
            >
              Acceder
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          ) : null}
        </CardFooter>
      </div>
    </Card>
  )
}