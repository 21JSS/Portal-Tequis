'use client'

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { useAuth } from "@/lib/context/AuthContext"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  // Show the splash screen briefly on every page load / navigation
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 900)
    return () => clearTimeout(timer)
  }, [])

  if (!isAuthenticated) {
    return <Sidebar />
  }

  return (
    <div className="flex min-h-screen bg-slate-50/80 bg-dot-pattern">
      <AnimatePresence>
        {showSplash && <LoadingScreen />}
      </AnimatePresence>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
