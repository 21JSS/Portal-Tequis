'use client'

import React from 'react'
import { User, LayoutGrid, CreditCard, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Libre_Caslon_Text } from "next/font/google"
import { useAuth } from "@/lib/context/AuthContext"
import { LoginForm } from "@/components/auth/LoginForm"

const libreCaslon = Libre_Caslon_Text({ weight: ["400", "700"], subsets: ["latin"] })

export function Sidebar() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <aside className="fixed inset-0 bg-gradient-to-b from-[#b1193f] to-[#8e1432] z-50 flex flex-col items-center justify-center p-4 overflow-y-auto transition-all ease-in-out animate-in fade-in duration-500">
        <LoginForm />
      </aside>
    )
  }

  return (
    <aside className="w-[88px] bg-gradient-to-b from-[#b1193f] to-[#8e1432] h-screen sticky top-0 flex flex-col items-center py-6 shadow-xl z-20 transition-all duration-500">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-6 w-full px-1 mt-3 animate-fade-in-up">
        <img 
          src="/Tequisquiapan-Presidencia-2.svg" 
          alt="Tequisquiapan" 
          className="w-[50px] h-auto drop-shadow-md mb-1 transition-all brightness-0 invert" 
        />
        <span className={`text-[10px] font-bold tracking-wider text-white/90 -mt-0.5 ${libreCaslon.className}`}>Tequisquiapan</span>
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-white/20 mb-4" />

      {/* User Profile Avatar */}
      <div className="mb-5 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/20">
        <User className="w-5 h-5 text-white" />
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-white/20 mb-4" />

      {/* Navigation */}
      <nav className="flex flex-col gap-2 w-full px-3">
        <NavItem href="/" icon={LayoutGrid} label="Dashboard" isActive={pathname === "/"} />
        <NavItem href="/" icon={CreditCard} label="Trámites" isActive={pathname.startsWith("/tramites")} />
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-2 w-full px-3">
        <div className="w-10 h-px bg-white/20 mx-auto mb-2" />
        <NavItem href="#" icon={Settings} label="Ajustes" isActive={false} />
        <NavItem 
          href="#" 
          icon={LogOut} 
          label="Salir" 
          isActive={false} 
          onClick={logout}
        />
      </div>
    </aside>
  )
}

function NavItem({ icon: Icon, isActive, href, label, onClick }: { icon: any, isActive: boolean, href: string, label: string, onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      className={`sidebar-nav-item w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-300 relative ${isActive
        ? 'bg-white/20 text-white shadow-lg shadow-black/10'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
    >
      <Icon className="w-5 h-5" />
      {isActive && <div className="sidebar-active-indicator" />}
      <span className="sidebar-tooltip">{label}</span>
    </Link>
  )
}
