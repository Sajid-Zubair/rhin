"use client"

import { UserRole } from "@/frontend/app/page"
import { Users, Heart, LayoutDashboard, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void
}
const roleMap = {
  villager: "villager",
  asha: "asha_worker",
  admin: "admin_phc",
  delivery: "delivery_partner",
}

const roles = [
  {
    id: "villager" as UserRole,
    titleEn: "Villager",
    titleTe: "గ్రామస్థుడు",
    titleHi: "ग्रामीण",
    description: "Report health issues, find nearby facilities",
    icon: Users,
    color: "bg-primary",
    hoverColor: "hover:bg-primary/90",
    iconBg: "bg-primary/10",
  },
  {
    id: "asha" as UserRole,
    titleEn: "ASHA Worker",
    titleTe: "ఆశా వర్కర్",
    titleHi: "आशा कार्यकर्ता",
    description: "Monitor villages, submit field reports",
    icon: Heart,
    color: "bg-accent",
    hoverColor: "hover:bg-accent/90",
    iconBg: "bg-accent/10",
  },
  {
    id: "admin" as UserRole,
    titleEn: "Admin / PHC",
    titleTe: "అడ్మిన్ / PHC",
    titleHi: "व्यवस्थापक / PHC",
    description: "District overview, outbreak alerts",
    icon: LayoutDashboard,
    color: "bg-chart-5",
    hoverColor: "hover:bg-chart-5/90",
    iconBg: "bg-chart-5/10",
  },
  {
    id: "delivery" as UserRole,
    titleEn: "Delivery Partner",
    titleTe: "డెలివరీ పార్ట్నర్",
    titleHi: "डिलीवरी पार्टनर",
    description: "Medicine delivery, route navigation",
    icon: Truck,
    color: "bg-severity-mild",
    hoverColor: "hover:bg-severity-mild/90",
    iconBg: "bg-severity-mild/10",
  },
]

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Heart className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">RHIN</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Rural Health Intelligence Network
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Real-time disease surveillance for rural India
        </p>
      </header>

      {/* Role Cards */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground mb-6">
            Select your role to continue
          </p>
          
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className={cn(
                  "w-full min-h-[88px] rounded-2xl border border-border bg-card p-5",
                  "flex items-center gap-4 text-left",
                  "transition-all duration-200 ease-out",
                  "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  "active:scale-[0.98]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                )}
                aria-label={`Continue as ${role.titleEn}`}
              >
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                  role.iconBg
                )}>
                  <Icon className={cn("w-7 h-7", {
                    "text-primary": role.id === "villager",
                    "text-accent": role.id === "asha",
                    "text-chart-5": role.id === "admin",
                    "text-severity-mild": role.id === "delivery",
                  })} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-card-foreground">
                      {role.titleEn}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {role.titleTe}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by AI for rural healthcare
        </p>
      </footer>
    </div>
  )
}
