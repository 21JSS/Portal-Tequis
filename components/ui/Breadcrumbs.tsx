'use client'

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm animate-fade-in-left" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-slate-400 hover:text-[#c5283d] transition-colors duration-200"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="font-medium">Inicio</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-400 hover:text-[#c5283d] transition-colors duration-200 font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
