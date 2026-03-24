"use client"

import { useState } from "react"
import { Language } from "@/frontend/app/page"
import { OfflineIndicator } from "../offline-banner"
import { 
  Package, MapPin, Navigation, Check, Clock, 
  Truck, Phone, ChevronRight, Pill
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DeliveryOrdersProps {
  language: Language
  isOnline: boolean
}

interface Order {
  id: string
  medicines: string[]
  landmark: string
  village: string
  distance: string
  status: "new" | "in_transit" | "delivered"
  patientName: string
  patientPhone: string
  lat: number
  lng: number
  priority: boolean
}

const translations = {
  te: {
    title: "డెలివరీ ఆర్డర్లు",
    zone: "జోన్",
    new: "కొత్త",
    inTransit: "రవాణాలో",
    delivered: "డెలివరీ అయింది",
    navigate: "నావిగేట్",
    markDelivered: "డెలివరీ అయినట్లు గుర్తించు",
    call: "కాల్",
    medicines: "మందులు",
    landmark: "ల్యాండ్‌మార్క్",
    noOrders: "ఆర్డర్లు లేవు",
  },
  hi: {
    title: "डिलीवरी ऑर्डर",
    zone: "ज़ोन",
    new: "नया",
    inTransit: "रास्ते में",
    delivered: "डिलीवर किया",
    navigate: "नेविगेट",
    markDelivered: "डिलीवर के रूप में चिह्नित करें",
    call: "कॉल",
    medicines: "दवाइयां",
    landmark: "लैंडमार्क",
    noOrders: "कोई ऑर्डर नहीं",
  },
  en: {
    title: "Delivery Orders",
    zone: "Zone",
    new: "New",
    inTransit: "In Transit",
    delivered: "Delivered",
    navigate: "Navigate",
    markDelivered: "Mark as Delivered",
    call: "Call",
    medicines: "Medicines",
    landmark: "Landmark",
    noOrders: "No orders",
  },
}

const statusConfig = {
  new: { 
    label: "new", 
    color: "bg-accent text-accent-foreground",
    icon: Package 
  },
  in_transit: { 
    label: "inTransit", 
    color: "bg-severity-moderate text-white",
    icon: Truck 
  },
  delivered: { 
    label: "delivered", 
    color: "bg-severity-mild text-white",
    icon: Check 
  },
}

const initialOrders: Order[] = [
  {
    id: "1",
    medicines: ["Paracetamol 500mg x 10", "ORS Sachets x 5", "Zinc Tablets x 20"],
    landmark: "Near Hanuman Temple, Main Road",
    village: "Kondapalli",
    distance: "2.3 km",
    status: "new",
    patientName: "Ramu Naidu",
    patientPhone: "+91 98765 43210",
    lat: 16.6192,
    lng: 80.5426,
    priority: true,
  },
  {
    id: "2",
    medicines: ["Cetrizine 10mg x 10", "Calamine Lotion x 1"],
    landmark: "Opposite Govt School",
    village: "Ibrahimpatnam",
    distance: "5.1 km",
    status: "in_transit",
    patientName: "Lakshmi Devi",
    patientPhone: "+91 98765 43211",
    lat: 16.5547,
    lng: 80.6090,
    priority: false,
  },
  {
    id: "3",
    medicines: ["Amoxicillin 250mg x 15"],
    landmark: "Behind Panchayat Office",
    village: "Nandigama",
    distance: "8.7 km",
    status: "delivered",
    patientName: "Venkat Rao",
    patientPhone: "+91 98765 43212",
    lat: 16.7729,
    lng: 80.2864,
    priority: false,
  },
]

export function DeliveryOrders({ language, isOnline }: DeliveryOrdersProps) {
  const t = translations[language || "en"]
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState<"all" | "new" | "in_transit" | "delivered">("all")

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter((o) => o.status === filter)

  const handleNavigate = (order: Order) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${order.lat},${order.lng}`
    window.open(url, "_blank")
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`
  }

  const handleMarkDelivered = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "delivered" as const } : o
      )
    )
  }

  const handleStartDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "in_transit" as const } : o
      )
    )
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-severity-mild text-white px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t.title}</h1>
              <p className="text-sm opacity-80">{t.zone} B-5</p>
            </div>
          </div>
          <OfflineIndicator isOnline={isOnline} />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "new", "in_transit", "delivered"] as const).map((status) => {
            const count = status === "all" 
              ? orders.length 
              : orders.filter((o) => o.status === status).length
            const label = status === "all" ? "All" : t[statusConfig[status]?.label as keyof typeof t] || status
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  filter === status
                    ? "bg-white text-severity-mild"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>
      </header>

      {/* Orders List */}
      <div className="px-4 -mt-4 space-y-4 pb-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">{t.noOrders}</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status]
            const StatusIcon = status.icon
            return (
              <div
                key={order.id}
                className={cn(
                  "bg-card rounded-2xl border border-border overflow-hidden",
                  order.priority && order.status === "new" && "border-accent"
                )}
              >
                {/* Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                        status.color
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {t[status.label as keyof typeof t]}
                      </span>
                      {order.priority && order.status === "new" && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                          Priority
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{order.distance}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground">{order.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{order.village}</p>
                </div>

                {/* Medicines */}
                <div className="p-4 bg-muted/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Pill className="w-4 h-4" />
                    <span>{t.medicines}</span>
                  </div>
                  <ul className="space-y-1">
                    {order.medicines.map((med, i) => (
                      <li key={i} className="text-sm text-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Landmark */}
                <div className="px-4 py-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Navigation className="w-4 h-4" />
                    <span>{t.landmark}</span>
                  </div>
                  <p className="text-sm text-foreground">{order.landmark}</p>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border flex gap-3">
                  {order.status === "new" && (
                    <>
                      <button
                        onClick={() => handleStartDelivery(order.id)}
                        className="flex-1 h-11 rounded-xl bg-severity-mild text-white font-medium flex items-center justify-center gap-2"
                      >
                        <Truck className="w-5 h-5" />
                        Start Delivery
                      </button>
                      <button
                        onClick={() => handleNavigate(order)}
                        className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Navigation className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </>
                  )}

                  {order.status === "in_transit" && (
                    <>
                      <button
                        onClick={() => handleMarkDelivered(order.id)}
                        className="flex-1 h-11 rounded-xl bg-severity-mild text-white font-medium flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        {t.markDelivered}
                      </button>
                      <button
                        onClick={() => handleNavigate(order)}
                        className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Navigation className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleCall(order.patientPhone)}
                        className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Phone className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </>
                  )}

                  {order.status === "delivered" && (
                    <div className="flex-1 flex items-center justify-center gap-2 text-severity-mild">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">{t.delivered}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
