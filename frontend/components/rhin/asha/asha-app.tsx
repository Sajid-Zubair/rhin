"use client"

import { useState } from "react"
import { Language } from "@/frontend/app/page"
import { OfflineBanner } from "../offline-banner"
import { AshaDashboard } from "./asha-dashboard"
import { AshaReportForm } from "./asha-report-form"
import { LayoutDashboard, FileText, LogOut, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface AshaAppProps {
  language: Language
  isOnline: boolean
  onOnlineChange: (online: boolean) => void
  onLogout: () => void
}

type AshaScreen = "dashboard" | "report"

const navItems = [
  { id: "dashboard" as AshaScreen, icon: LayoutDashboard, label: "Dashboard" },
  { id: "report" as AshaScreen, icon: FileText, label: "Report" },
]

export function AshaApp({ language, isOnline, onOnlineChange, onLogout }: AshaAppProps) {
  const [currentScreen, setCurrentScreen] = useState<AshaScreen>("dashboard")
  const [pendingCount, setPendingCount] = useState(0)

  const handleReportSubmit = () => {
    if (!isOnline) {
      setPendingCount(pendingCount + 1)
    }
    setCurrentScreen("dashboard")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return (
          <AshaDashboard 
            language={language} 
            isOnline={isOnline}
            onStartReport={() => setCurrentScreen("report")}
          />
        )
      case "report":
        return (
          <AshaReportForm
            language={language}
            isOnline={isOnline}
            onSubmit={handleReportSubmit}
            onCancel={() => setCurrentScreen("dashboard")}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Offline Banner */}
      <OfflineBanner 
        isOnline={isOnline} 
        pendingCount={pendingCount}
        onSync={() => {
          setTimeout(() => setPendingCount(0), 2000)
        }}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {renderScreen()}
      </main>

      {/* FAB for new report */}
      {currentScreen === "dashboard" && (
        <button
          onClick={() => setCurrentScreen("report")}
          className={cn(
            "fixed right-4 bottom-20 w-14 h-14 rounded-full",
            "bg-accent text-accent-foreground shadow-lg",
            "flex items-center justify-center",
            "transition-all duration-200",
            "hover:scale-105 active:scale-95"
          )}
          aria-label="Submit new report"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-xl",
                  "transition-all duration-200",
                  isActive 
                    ? "text-accent" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium">Exit</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
