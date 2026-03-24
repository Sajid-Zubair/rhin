"use client"

import { WifiOff, RefreshCw, Check, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface OfflineBannerProps {
  isOnline: boolean
  pendingCount?: number
  isSyncing?: boolean
  onSync?: () => void
}

export function OfflineBanner({ 
  isOnline, 
  pendingCount = 0, 
  isSyncing = false,
  onSync 
}: OfflineBannerProps) {
  // Don't show if online and no pending items
  if (isOnline && pendingCount === 0) return null

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3",
        "transition-all duration-300",
        isOnline 
          ? "bg-severity-mild/10 text-severity-mild" 
          : "bg-muted text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        {isOnline ? (
          <Cloud className="w-5 h-5" />
        ) : (
          <WifiOff className="w-5 h-5" />
        )}
        <div>
          <p className="text-sm font-medium">
            {isOnline ? "Back online" : "You're offline"}
          </p>
          {pendingCount > 0 && (
            <p className="text-xs opacity-80">
              {pendingCount} {pendingCount === 1 ? "item" : "items"} pending sync
            </p>
          )}
        </div>
      </div>

      {pendingCount > 0 && isOnline && (
        <button
          onClick={onSync}
          disabled={isSyncing}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "text-sm font-medium",
            "bg-severity-mild/20 hover:bg-severity-mild/30",
            "transition-colors duration-200",
            "disabled:opacity-50"
          )}
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Sync now</span>
            </>
          )}
        </button>
      )}

      {isOnline && pendingCount === 0 && (
        <Check className="w-5 h-5" />
      )}
    </div>
  )
}

// Compact version for headers
export function OfflineIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
        "transition-all duration-300",
        isOnline 
          ? "bg-severity-mild/10 text-severity-mild" 
          : "bg-muted text-muted-foreground"
      )}
    >
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-severity-mild animate-pulse" : "bg-muted-foreground"
        )} 
      />
      <span>{isOnline ? "Online" : "Offline"}</span>
    </div>
  )
}
