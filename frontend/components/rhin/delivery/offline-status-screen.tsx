"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { Button } from "@/frontend/components/ui/button"
import { Badge } from "@/frontend/components/ui/badge"
import { 
  WifiOff, 
  RefreshCw, 
  Package, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  CloudOff,
  Database
} from "lucide-react"

interface PendingSync {
  id: string
  type: "delivery_update" | "status_change" | "location_update"
  data: {
    orderId?: string
    status?: string
    timestamp: string
  }
  attempts: number
}

interface OfflineStatusScreenProps {
  onRetry: () => void
  language: "en" | "te" | "hi"
  pendingCount?: number
}

const translations = {
  en: {
    title: "Offline Mode",
    subtitle: "You are currently working offline",
    syncPending: "Pending Sync",
    lastSync: "Last Synced",
    pendingItems: "pending items",
    retrySync: "Retry Sync",
    syncing: "Syncing...",
    offlineCapabilities: "Available Offline",
    viewOrders: "View assigned orders",
    updateStatus: "Update delivery status",
    viewRoute: "View saved routes",
    needsInternet: "Needs Internet",
    newAssignments: "Receive new assignments",
    realTimeUpdates: "Real-time location tracking",
    chatSupport: "Chat with support",
    deliveryUpdate: "Delivery Update",
    statusChange: "Status Change",
    locationUpdate: "Location Update",
    attempts: "attempts",
    savedLocally: "All changes saved locally",
    willSyncAutomatically: "Will sync automatically when online"
  },
  te: {
    title: "ఆఫ్‌లైన్ మోడ్",
    subtitle: "మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో పని చేస్తున్నారు",
    syncPending: "సమకాలీకరణ పెండింగ్",
    lastSync: "చివరి సమకాలీకరణ",
    pendingItems: "పెండింగ్ అంశాలు",
    retrySync: "మళ్ళీ ప్రయత్నించు",
    syncing: "సమకాలీకరిస్తోంది...",
    offlineCapabilities: "ఆఫ్‌లైన్‌లో అందుబాటులో",
    viewOrders: "కేటాయించిన ఆర్డర్లు చూడండి",
    updateStatus: "డెలివరీ స్థితి అప్‌డేట్ చేయండి",
    viewRoute: "సేవ్ చేసిన మార్గాలు చూడండి",
    needsInternet: "ఇంటర్నెట్ అవసరం",
    newAssignments: "కొత్త కేటాయింపులు స్వీకరించండి",
    realTimeUpdates: "నిజ-సమయ స్థానం ట్రాకింగ్",
    chatSupport: "సపోర్ట్‌తో చాట్",
    deliveryUpdate: "డెలివరీ అప్‌డేట్",
    statusChange: "స్థితి మార్పు",
    locationUpdate: "స్థానం అప్‌డేట్",
    attempts: "ప్రయత్నాలు",
    savedLocally: "అన్ని మార్పులు స్థానికంగా సేవ్ చేయబడ్డాయి",
    willSyncAutomatically: "ఆన్‌లైన్‌లో ఉన్నప్పుడు స్వయంచాలకంగా సమకాలీకరిస్తుంది"
  },
  hi: {
    title: "ऑफ़लाइन मोड",
    subtitle: "आप वर्तमान में ऑफ़लाइन काम कर रहे हैं",
    syncPending: "सिंक लंबित",
    lastSync: "अंतिम सिंक",
    pendingItems: "लंबित आइटम",
    retrySync: "पुनः प्रयास करें",
    syncing: "सिंक हो रहा है...",
    offlineCapabilities: "ऑफ़लाइन उपलब्ध",
    viewOrders: "असाइन किए गए ऑर्डर देखें",
    updateStatus: "डिलीवरी स्थिति अपडेट करें",
    viewRoute: "सहेजे गए मार्ग देखें",
    needsInternet: "इंटरनेट आवश्यक",
    newAssignments: "नए असाइनमेंट प्राप्त करें",
    realTimeUpdates: "रीयल-टाइम लोकेशन ट्रैकिंग",
    chatSupport: "सपोर्ट से चैट करें",
    deliveryUpdate: "डिलीवरी अपडेट",
    statusChange: "स्थिति परिवर्तन",
    locationUpdate: "लोकेशन अपडेट",
    attempts: "प्रयास",
    savedLocally: "सभी परिवर्तन स्थानीय रूप से सहेजे गए",
    willSyncAutomatically: "ऑनलाइन होने पर स्वचालित रूप से सिंक होगा"
  }
}

export function OfflineStatusScreen({ onRetry, language, pendingCount = 3 }: OfflineStatusScreenProps) {
  const t = translations[language]
  const [isSyncing, setIsSyncing] = useState(false)
  
  const pendingItems: PendingSync[] = [
    {
      id: "1",
      type: "delivery_update",
      data: { orderId: "ORD-2847", status: "delivered", timestamp: new Date().toISOString() },
      attempts: 2
    },
    {
      id: "2",
      type: "status_change",
      data: { orderId: "ORD-2848", status: "in_transit", timestamp: new Date().toISOString() },
      attempts: 1
    },
    {
      id: "3",
      type: "location_update",
      data: { timestamp: new Date().toISOString() },
      attempts: 3
    }
  ]

  const handleRetrySync = async () => {
    setIsSyncing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSyncing(false)
    onRetry()
  }

  const getSyncTypeIcon = (type: PendingSync["type"]) => {
    switch (type) {
      case "delivery_update":
        return <Package className="h-4 w-4" />
      case "status_change":
        return <RefreshCw className="h-4 w-4" />
      case "location_update":
        return <Clock className="h-4 w-4" />
    }
  }

  const getSyncTypeLabel = (type: PendingSync["type"]) => {
    switch (type) {
      case "delivery_update":
        return t.deliveryUpdate
      case "status_change":
        return t.statusChange
      case "location_update":
        return t.locationUpdate
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="flex flex-col items-center justify-center py-8 mb-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <CloudOff className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-center">{t.subtitle}</p>
      </div>

      <Card className="mb-4 border-accent/30 bg-accent/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              {t.syncPending}
            </CardTitle>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              {pendingItems.length} {t.pendingItems}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {pendingItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getSyncTypeIcon(item.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{getSyncTypeLabel(item.type)}</p>
                    {item.data.orderId && (
                      <p className="text-xs text-muted-foreground">{item.data.orderId}</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {item.attempts} {t.attempts}
                </Badge>
              </div>
            ))}
          </div>

          <Button 
            className="w-full" 
            onClick={handleRetrySync}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {t.syncing}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.retrySync}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            {t.offlineCapabilities}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </div>
              {t.viewOrders}
            </li>
            <li className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </div>
              {t.updateStatus}
            </li>
            <li className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </div>
              {t.viewRoute}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-muted-foreground" />
            {t.needsInternet}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              {t.newAssignments}
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              {t.realTimeUpdates}
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
              {t.chatSupport}
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <p className="text-sm font-medium text-foreground">{t.savedLocally}</p>
        <p className="text-xs text-muted-foreground mt-1">{t.willSyncAutomatically}</p>
      </div>
    </div>
  )
}
