"use client"

import { useState } from "react"
import { Language } from "@/app/page"
import { OfflineBanner } from "../offline-banner"
import { DeliveryOrders } from "./delivery-orders"
import { OfflineStatusScreen } from "./offline-status-screen"
import { Package, WifiOff, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeliveryAppProps {
  language: Language
  isOnline: boolean
  onOnlineChange: (online: boolean) => void
  onLogout: () => void
}

type DeliveryScreen = "orders" | "offline"

export function DeliveryApp({ language, isOnline, onOnlineChange, onLogout }: DeliveryAppProps) {
  const [currentScreen, setCurrentScreen] = useState<DeliveryScreen>("orders")
  const [pendingCount, setPendingCount] = useState(2)

  // Show offline screen when completely disconnected
  const showOfflineScreen = !isOnline && currentScreen === "offline"

  const renderScreen = () => {
    if (showOfflineScreen) {
      return (
        <OfflineStatusScreen
          language={language || "en"}
          pendingCount={pendingCount}
          onRetry={() => {
            // Simulate reconnection attempt
            setTimeout(() => onOnlineChange(true), 2000)
          }}
        />
      )
    }

    return (
      <DeliveryOrders
        language={language || "en"}
        isOnline={isOnline}
      />
    )
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          <button
            onClick={() => setCurrentScreen("orders")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-xl",
              "transition-all duration-200",
              currentScreen === "orders" && !showOfflineScreen
                ? "text-severity-mild" 
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Orders"
          >
            <Package className={cn(
              "w-6 h-6 transition-transform duration-200",
              currentScreen === "orders" && !showOfflineScreen && "scale-110"
            )} />
            <span className="text-xs font-medium">Orders</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen("offline")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-8 py-2 rounded-xl",
              "transition-all duration-200",
              showOfflineScreen
                ? "text-muted-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Offline Status"
          >
            <WifiOff className="w-6 h-6" />
            <span className="text-xs font-medium">Status</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

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
