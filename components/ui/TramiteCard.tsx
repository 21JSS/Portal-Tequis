import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChevronRight, Home, Store, FileText, Users, MapPin, BookOpen, Rocket, ScrollText } from "lucide-react"

interface TramiteProps {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  estado: string
  estadoColor?: "green" | "blue" | "purple" | "orange" | "gray"
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

const hoverShadows: Record<string, string> = {
  green: "hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.25)]",
  blue: "hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.25)]",
  purple: "hover:shadow-[0_8px_30px_-4px_rgba(139,92,246,0.25)]",
  orange: "hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.25)]",
  gray: "hover:shadow-[0_8px_30px_-4px_rgba(100,116,139,0.2)]",
}

export function TramiteCard({ 
  id,
  titulo, 
  descripcion, 
  categoria, 
  estado, 
  estadoColor = "green",
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
  const hoverShadow = hoverShadows[estadoColor] || hoverShadows.green

  return (
    <Card className={`card-hover-lift border-slate-200/80 overflow-hidden flex flex-col bg-white group cursor-pointer ${hoverShadow}`} onClick={alSeleccionar}>
      {/* Gradient Header with Icon */}
      <div 
        className="relative h-36 w-full gradient-shimmer-overlay flex items-center justify-center"
        style={{ background: gradient }}
      >
        <Icon className="w-12 h-12 text-white/90 group-hover:scale-110 transition-transform duration-500 ease-out" strokeWidth={1.5} />
        
        {/* Category badge */}
        <div className="absolute top-3.5 left-3.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
          {categoria}
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
      </div>

      <CardHeader className="pb-1.5 pt-5">
        <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{titulo}</CardTitle>
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
        
        <button 
          className="flex items-center text-sm font-semibold text-[#c5283d] hover:text-red-800 transition-all group/btn"
        >
          Acceder 
          <ChevronRight className="w-4 h-4 ml-0.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </CardFooter>
    </Card>
  )
}