"use client"

import { useState } from "react"
import { Language } from "@/frontend/app/page"
import { AdminMap } from "./admin-map"
import { LogOut, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminAppProps {
  language: Language
  onLogout: () => void
}

export function AdminApp({ language, onLogout }: AdminAppProps) {
  const [alertCount] = useState(3)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">R</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">RHIN Admin</h1>
            <p className="text-xs text-muted-foreground">Krishna District</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-severity-critical text-white text-xs font-medium flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>
          <button className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AdminMap language={language} />
      </main>
    </div>
  )
}
