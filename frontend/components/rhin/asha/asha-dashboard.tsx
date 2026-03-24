"use client"

import { Language } from "@/frontend/app/page"
import { OfflineIndicator } from "../offline-banner"
import { 
  AlertTriangle, MapPin, Calendar, ChevronRight, 
  Award, Shield, Clock, Users 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AshaDashboardProps {
  language: Language
  isOnline: boolean
  onStartReport: () => void
}

const translations = {
  te: {
    greeting: "నమస్కారం",
    zone: "జోన్",
    points: "పాయింట్లు",
    priorityAlert: "ప్రాధాన్యత హెచ్చరిక",
    villages: "గ్రామాలు",
    riskScore: "రిస్క్ స్కోర్",
    cases: "కేసులు",
    lastReport: "చివరి నివేదిక",
    submitReport: "నివేదిక సమర్పించు",
  },
  hi: {
    greeting: "नमस्कार",
    zone: "ज़ोन",
    points: "अंक",
    priorityAlert: "प्राथमिकता अलर्ट",
    villages: "गांव",
    riskScore: "जोखिम स्कोर",
    cases: "केस",
    lastReport: "अंतिम रिपोर्ट",
    submitReport: "रिपोर्ट जमा करें",
  },
  en: {
    greeting: "Namaste",
    zone: "Zone",
    points: "Points",
    priorityAlert: "Priority Alert",
    villages: "Villages",
    riskScore: "Risk Score",
    cases: "cases",
    lastReport: "Last report",
    submitReport: "Submit Report",
  },
}

interface Village {
  id: string
  name: string
  riskScore: number
  caseCount: number
  lastReport: string
  hasAlert: boolean
}

const villages: Village[] = [
  {
    id: "1",
    name: "Kondapalli",
    riskScore: 78,
    caseCount: 12,
    lastReport: "2 hours ago",
    hasAlert: true,
  },
  {
    id: "2",
    name: "Ibrahimpatnam",
    riskScore: 45,
    caseCount: 5,
    lastReport: "1 day ago",
    hasAlert: false,
  },
  {
    id: "3",
    name: "Nandigama",
    riskScore: 32,
    caseCount: 3,
    lastReport: "3 days ago",
    hasAlert: false,
  },
  {
    id: "4",
    name: "Mylavaram",
    riskScore: 15,
    caseCount: 1,
    lastReport: "5 days ago",
    hasAlert: false,
  },
]

const getRiskColor = (score: number) => {
  if (score >= 70) return "bg-severity-critical"
  if (score >= 50) return "bg-severity-severe"
  if (score >= 30) return "bg-severity-moderate"
  return "bg-severity-mild"
}

const getRiskLabel = (score: number) => {
  if (score >= 70) return "Critical"
  if (score >= 50) return "High"
  if (score >= 30) return "Moderate"
  return "Low"
}

export function AshaDashboard({ language, isOnline, onStartReport }: AshaDashboardProps) {
  const t = translations[language || "en"]
  const priorityVillage = villages.find((v) => v.hasAlert)

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="bg-accent text-accent-foreground px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">{t.greeting}</p>
              <h1 className="text-xl font-bold">Lakshmi Devi</h1>
            </div>
          </div>
          <OfflineIndicator isOnline={isOnline} />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{t.zone} A-12</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">1,250 {t.points}</span>
          </div>
        </div>
      </header>

      <div className="px-6 -mt-4">
        {/* Priority Alert */}
        {priorityVillage && (
          <div className="bg-severity-critical/10 border border-severity-critical/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-severity-critical/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-severity-critical" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-severity-critical">
                  {t.priorityAlert}
                </p>
                <p className="text-foreground font-semibold">
                  {priorityVillage.name} - {priorityVillage.caseCount} {t.cases}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-severity-critical" />
            </div>
          </div>
        )}

        {/* Villages Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{t.villages}</h2>
            <span className="text-sm text-muted-foreground">{villages.length} assigned</span>
          </div>

          <div className="space-y-3">
            {villages.map((village) => (
              <div
                key={village.id}
                className={cn(
                  "bg-card rounded-2xl border border-border p-4",
                  village.hasAlert && "border-severity-critical/30"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MapPin className={cn(
                      "w-5 h-5",
                      village.hasAlert ? "text-severity-critical" : "text-muted-foreground"
                    )} />
                    <h3 className="font-semibold text-card-foreground">{village.name}</h3>
                  </div>
                  {village.hasAlert && (
                    <span className="px-2 py-0.5 rounded-full bg-severity-critical/10 text-severity-critical text-xs font-medium">
                      Alert
                    </span>
                  )}
                </div>

                {/* Risk Score Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t.riskScore}</span>
                    <span className={cn(
                      "font-medium",
                      village.riskScore >= 70 && "text-severity-critical",
                      village.riskScore >= 50 && village.riskScore < 70 && "text-severity-severe",
                      village.riskScore >= 30 && village.riskScore < 50 && "text-severity-moderate",
                      village.riskScore < 30 && "text-severity-mild"
                    )}>
                      {village.riskScore}% - {getRiskLabel(village.riskScore)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", getRiskColor(village.riskScore))}
                      style={{ width: `${village.riskScore}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{village.caseCount} {t.cases}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{t.lastReport}: {village.lastReport}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
