"use client"

import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { Language } from "@/app/page"
import type { MapMarker } from "../maps/leaflet-map"
import { 
  AlertTriangle, Clock, Send, X, MapPin, 
  Users, TrendingUp, ChevronRight, RefreshCw,
  Activity, Bell
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(
  () => import("../maps/leaflet-map").then((mod) => mod.LeafletMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Loading district map...</p>
        </div>
      </div>
    )
  }
)

interface AdminMapProps {
  language: Language
}

interface Alert {
  id: string
  village: string
  tier: "critical" | "high" | "moderate" | "low"
  caseCount: number
  symptoms: string[]
  countdown: number
  lat: number
  lng: number
  timeAgo: string
}

interface VillageData {
  id: string
  name: string
  lat: number
  lng: number
  riskScore: number
  totalCases: number
  symptoms: { name: string; count: number }[]
  timeline: { date: string; cases: number }[]
  population: number
  ashaWorker: string
}

// Real village data for Krishna District, Andhra Pradesh
const villageData: VillageData[] = [
  {
    id: "1",
    name: "Kondapalli",
    lat: 16.6192,
    lng: 80.5426,
    riskScore: 85,
    totalCases: 15,
    symptoms: [
      { name: "Fever", count: 12 },
      { name: "Diarrhea", count: 8 },
      { name: "Vomiting", count: 6 },
    ],
    timeline: [
      { date: "Mon", cases: 2 },
      { date: "Tue", cases: 3 },
      { date: "Wed", cases: 5 },
      { date: "Thu", cases: 6 },
      { date: "Fri", cases: 9 },
      { date: "Sat", cases: 12 },
      { date: "Sun", cases: 15 },
    ],
    population: 4500,
    ashaWorker: "Lakshmi Devi",
  },
  {
    id: "2",
    name: "Ibrahimpatnam",
    lat: 16.5547,
    lng: 80.6090,
    riskScore: 62,
    totalCases: 8,
    symptoms: [
      { name: "Fever", count: 7 },
      { name: "Cough", count: 5 },
    ],
    timeline: [
      { date: "Mon", cases: 1 },
      { date: "Tue", cases: 2 },
      { date: "Wed", cases: 3 },
      { date: "Thu", cases: 4 },
      { date: "Fri", cases: 5 },
      { date: "Sat", cases: 7 },
      { date: "Sun", cases: 8 },
    ],
    population: 12000,
    ashaWorker: "Padma Rani",
  },
  {
    id: "3",
    name: "Nandigama",
    lat: 16.7729,
    lng: 80.2864,
    riskScore: 45,
    totalCases: 4,
    symptoms: [
      { name: "Skin Rash", count: 3 },
      { name: "Fever", count: 2 },
    ],
    timeline: [
      { date: "Mon", cases: 1 },
      { date: "Tue", cases: 1 },
      { date: "Wed", cases: 2 },
      { date: "Thu", cases: 2 },
      { date: "Fri", cases: 3 },
      { date: "Sat", cases: 3 },
      { date: "Sun", cases: 4 },
    ],
    population: 28000,
    ashaWorker: "Sarojini",
  },
  {
    id: "4",
    name: "Mylavaram",
    lat: 16.7479,
    lng: 80.6505,
    riskScore: 25,
    totalCases: 2,
    symptoms: [
      { name: "Fever", count: 2 },
    ],
    timeline: [
      { date: "Mon", cases: 0 },
      { date: "Tue", cases: 0 },
      { date: "Wed", cases: 1 },
      { date: "Thu", cases: 1 },
      { date: "Fri", cases: 1 },
      { date: "Sat", cases: 2 },
      { date: "Sun", cases: 2 },
    ],
    population: 18000,
    ashaWorker: "Anita",
  },
  {
    id: "5",
    name: "Tiruvuru",
    lat: 16.9034,
    lng: 80.6021,
    riskScore: 18,
    totalCases: 1,
    symptoms: [
      { name: "Cough", count: 1 },
    ],
    timeline: [
      { date: "Mon", cases: 0 },
      { date: "Tue", cases: 0 },
      { date: "Wed", cases: 0 },
      { date: "Thu", cases: 1 },
      { date: "Fri", cases: 1 },
      { date: "Sat", cases: 1 },
      { date: "Sun", cases: 1 },
    ],
    population: 22000,
    ashaWorker: "Ramya",
  },
  {
    id: "6",
    name: "Gannavaram",
    lat: 16.5411,
    lng: 80.8028,
    riskScore: 35,
    totalCases: 3,
    symptoms: [
      { name: "Fever", count: 3 },
      { name: "Body Pain", count: 2 },
    ],
    timeline: [
      { date: "Mon", cases: 1 },
      { date: "Tue", cases: 1 },
      { date: "Wed", cases: 2 },
      { date: "Thu", cases: 2 },
      { date: "Fri", cases: 2 },
      { date: "Sat", cases: 3 },
      { date: "Sun", cases: 3 },
    ],
    population: 35000,
    ashaWorker: "Kavitha",
  },
]

// Alerts derived from village data
const alerts: Alert[] = villageData
  .filter(v => v.riskScore >= 40)
  .map(v => ({
    id: v.id,
    village: v.name,
    tier: v.riskScore >= 70 ? "critical" : v.riskScore >= 50 ? "high" : "moderate",
    caseCount: v.totalCases,
    symptoms: v.symptoms.map(s => s.name),
    countdown: v.riskScore >= 70 ? 45 : v.riskScore >= 50 ? 120 : 240,
    lat: v.lat,
    lng: v.lng,
    timeAgo: v.riskScore >= 70 ? "8 min ago" : v.riskScore >= 50 ? "32 min ago" : "1 hour ago",
  }))
  .sort((a, b) => {
    const tierOrder = { critical: 0, high: 1, moderate: 2, low: 3 }
    return tierOrder[a.tier] - tierOrder[b.tier]
  })

const tierConfig = {
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-600", borderColor: "border-red-500" },
  high: { label: "High", color: "bg-orange-500", textColor: "text-orange-600", borderColor: "border-orange-500" },
  moderate: { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600", borderColor: "border-yellow-500" },
  low: { label: "Low", color: "bg-green-500", textColor: "text-green-600", borderColor: "border-green-500" },
}

// District center (Krishna District, AP)
const DISTRICT_CENTER: [number, number] = [16.65, 80.55]

export function AdminMap({ language }: AdminMapProps) {
  const [selectedVillage, setSelectedVillage] = useState<string | null>("1")
  const [lastUpdated] = useState(new Date())
  const [mapCenter, setMapCenter] = useState<[number, number]>(DISTRICT_CENTER)
  const [showAlertPanel, setShowAlertPanel] = useState(true)

  const selectedData = villageData.find(v => v.id === selectedVillage)
  const selectedAlert = alerts.find(a => a.id === selectedVillage)

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedVillage(marker.id)
    setMapCenter([marker.lat, marker.lng])
  }, [])

  // Convert villages to map markers
  const mapMarkers: MapMarker[] = useMemo(() => {
    return villageData.map(village => ({
      id: village.id,
      lat: village.lat,
      lng: village.lng,
      type: "village" as const,
      name: village.name,
      details: `${village.totalCases} cases`,
      riskScore: village.riskScore,
      caseCount: village.totalCases,
    }))
  }, [])

  const formatCountdown = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600"
    if (score >= 50) return "text-orange-600"
    if (score >= 30) return "text-yellow-600"
    return "text-green-600"
  }

  const getTrend = (timeline: { cases: number }[]) => {
    if (timeline.length < 2) return 0
    const first = timeline[0].cases
    const last = timeline[timeline.length - 1].cases
    if (first === 0) return last > 0 ? 100 : 0
    return Math.round(((last - first) / first) * 100)
  }

  return (
    <div className="h-full flex flex-col lg:flex-row bg-background">
      {/* Left Sidebar - Alert List */}
      <aside className={cn(
        "w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-auto transition-all",
        showAlertPanel ? "max-h-[40vh] lg:max-h-full" : "max-h-12 lg:max-h-full"
      )}>
        <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-red-500" />
              </div>
              <h2 className="font-semibold text-foreground">Active Alerts</h2>
            </div>
            <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
              {alerts.length}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="divide-y divide-border">
          {alerts.map((alert) => {
            const tier = tierConfig[alert.tier]
            const isSelected = selectedVillage === alert.id
            return (
              <div
                key={alert.id}
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  isSelected ? "bg-muted" : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setSelectedVillage(alert.id)
                  const village = villageData.find(v => v.id === alert.id)
                  if (village) setMapCenter([village.lat, village.lng])
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-white", tier.color)}>
                      {tier.label}
                    </Badge>
                    <span className="font-medium text-foreground">{alert.village}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{formatCountdown(alert.countdown)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {alert.caseCount} cases
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({alert.timeAgo})
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {alert.symptoms.slice(0, 3).map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-full",
                    alert.tier === "critical" && "border-red-500 text-red-600 hover:bg-red-500/10"
                  )}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Team
                </Button>
              </div>
            )
          })}
        </div>
      </aside>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <LeafletMap
          center={mapCenter}
          zoom={10}
          markers={mapMarkers}
          selectedMarkerId={selectedVillage}
          onMarkerClick={handleMarkerClick}
          showUserLocation={false}
          className="w-full h-full"
        />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-card shadow-lg"
            onClick={() => setMapCenter(DISTRICT_CENTER)}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 z-[500] bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Krishna District</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Total Cases</p>
              <p className="text-xl font-bold">{villageData.reduce((sum, v) => sum + v.totalCases, 0)}</p>
            </div>
            <div className="bg-muted rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Villages</p>
              <p className="text-xl font-bold">{villageData.length}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[500] bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">Risk Level</p>
          <div className="space-y-1.5">
            {Object.entries(tierConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", config.color)} />
                <span className="text-xs text-foreground">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Village Details */}
      {selectedData && (
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card overflow-auto max-h-[50vh] lg:max-h-full">
          <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">{selectedData.name}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVillage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-muted border-0">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">Total Cases</p>
                  <p className="text-2xl font-bold">{selectedData.totalCases}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted border-0">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className={cn("text-2xl font-bold", getRiskColor(selectedData.riskScore))}>
                    {selectedData.riskScore}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Population</p>
                <p className="font-semibold">{selectedData.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ASHA Worker</p>
                <p className="font-semibold">{selectedData.ashaWorker}</p>
              </div>
            </div>

            {/* Symptom Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Symptom Breakdown</h3>
              <div className="space-y-2">
                {selectedData.symptoms.map((symptom) => (
                  <div key={symptom.name} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{symptom.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(symptom.count / selectedData.totalCases) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-6 text-right">
                        {symptom.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">7-Day Trend</h3>
                <div className={cn(
                  "flex items-center gap-1",
                  getTrend(selectedData.timeline) > 50 ? "text-red-600" : "text-muted-foreground"
                )}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">+{getTrend(selectedData.timeline)}%</span>
                </div>
              </div>
              <div className="flex items-end justify-between h-20 gap-1">
                {selectedData.timeline.map((day, i) => {
                  const maxCases = Math.max(...selectedData.timeline.map((d) => d.cases), 1)
                  const height = Math.max((day.cases / maxCases) * 100, 5)
                  const isLast = i === selectedData.timeline.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={cn(
                          "w-full rounded-t transition-all",
                          isLast ? "bg-red-500" : "bg-primary/60"
                        )}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{day.date}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Dispatch Response Team
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                View Full Report
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
