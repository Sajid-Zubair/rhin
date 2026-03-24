"use client"

import { useState } from "react"
import { Language } from "@/app/page"
import { OfflineBanner } from "../offline-banner"
import { VillagerReportPage } from "./villager-report"
import { ConfirmPage } from "./confirm-page"
import { VillageMap } from "./village-map"
import { Helplines } from "./helplines"
import { Mic, Map, Phone, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface VillagerAppProps {
  language: Language
  isOnline: boolean
  onOnlineChange: (online: boolean) => void
  onLogout: () => void
}

type VillagerScreen = "report" | "confirm" | "map" | "helplines"

export interface ReportData {
  name: string
  age: string
  village: string
  symptoms: string[]
  severity: "mild" | "moderate" | "severe" | "critical"
  advice: string[]
  audioUrl?: string
  transcript?: string
}

const navItems = [
  { id: "report" as VillagerScreen, icon: Mic, label: "Report" },
  { id: "map" as VillagerScreen, icon: Map, label: "Map" },
  { id: "helplines" as VillagerScreen, icon: Phone, label: "Helplines" },
]

export function VillagerApp({ language, isOnline, onOnlineChange, onLogout }: VillagerAppProps) {
  const [currentScreen, setCurrentScreen] = useState<VillagerScreen>("report")
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  const handleReportComplete = (data: ReportData) => {
    setReportData(data)
    setCurrentScreen("confirm")
  }

  const handleSubmitReport = () => {
    if (!isOnline) {
      setPendingCount(pendingCount + 1)
    }
    // Reset and go back to report screen
    setReportData(null)
    setCurrentScreen("report")
  }

  const handleEditReport = () => {
    setCurrentScreen("report")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "report":
        return (
          <VillagerReportPage
            language={language}
            isOnline={isOnline}
            onReportComplete={handleReportComplete}
          />
        )
      case "confirm":
        return reportData ? (
          <ConfirmPage
            language={language}
            isOnline={isOnline}
            reportData={reportData}
            onSubmit={handleSubmitReport}
            onEdit={handleEditReport}
          />
        ) : (
          <VillagerReportPage
            language={language}
            isOnline={isOnline}
            onReportComplete={handleReportComplete}
          />
        )
      case "map":
        return <VillageMap language={language} isOnline={isOnline} />
      case "helplines":
        return <Helplines language={language} />
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
          // Simulate sync
          setTimeout(() => setPendingCount(0), 2000)
        }}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id || 
              (currentScreen === "confirm" && item.id === "report")
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "report") {
                    setReportData(null)
                  }
                  setCurrentScreen(item.id)
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl",
                  "transition-all duration-200",
                  isActive 
                    ? "text-primary" 
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
            className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200"
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
