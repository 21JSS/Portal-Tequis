import { type ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  gradient: string
}

export function EmptyState({ icon, title, description, gradient }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-10 flex flex-col items-center justify-center text-center">
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.04]" style={{ background: gradient }} />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-[0.04]" style={{ background: gradient }} />

      {/* Floating icon */}
      <div
        className="animate-float mb-5 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: gradient }}
      >
        <div className="text-white">
          {icon}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">{description}</p>

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mt-6">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse-dot" style={{ animationDelay: '0s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse-dot" style={{ animationDelay: '0.3s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse-dot" style={{ animationDelay: '0.6s' }} />
      </div>
    </div>
  )
}
