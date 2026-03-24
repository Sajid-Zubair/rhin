"use client"

import { Language } from "@/frontend/app/page"
import { Phone, Ambulance, Heart, Shield, Building2, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface HelplinesProps {
  language: Language
}

const translations = {
  te: {
    title: "అత్యవసర హెల్ప్‌లైన్‌లు",
    subtitle: "24/7 అందుబాటులో",
    call: "కాల్ చేయండి",
    worksOffline: "ఆఫ్‌లైన్‌లో పనిచేస్తుంది",
  },
  hi: {
    title: "आपातकालीन हेल्पलाइन",
    subtitle: "24/7 उपलब्ध",
    call: "कॉल करें",
    worksOffline: "ऑफ़लाइन काम करता है",
  },
  en: {
    title: "Emergency Helplines",
    subtitle: "Available 24/7",
    call: "Call",
    worksOffline: "Works offline",
  },
}

interface Helpline {
  id: string
  name: string
  nameLocal: { te: string; hi: string; en: string }
  description: string
  descriptionLocal: { te: string; hi: string; en: string }
  phone: string
  icon: typeof Phone
  borderColor: string
  iconBg: string
  iconColor: string
}

const helplines: Helpline[] = [
  {
    id: "108",
    name: "108 Ambulance",
    nameLocal: { te: "108 అంబులెన్స్", hi: "108 एम्बुलेंस", en: "108 Ambulance" },
    description: "Free emergency ambulance service",
    descriptionLocal: { 
      te: "ఉచిత అత్యవసర అంబులెన్స్", 
      hi: "मुफ्त आपातकालीन एम्बुलेंस", 
      en: "Free emergency ambulance service" 
    },
    phone: "108",
    icon: Ambulance,
    borderColor: "border-l-severity-critical",
    iconBg: "bg-severity-critical/10",
    iconColor: "text-severity-critical",
  },
  {
    id: "104",
    name: "104 Health Helpline",
    nameLocal: { te: "104 హెల్త్ హెల్ప్‌లైన్", hi: "104 स्वास्थ्य हेल्पलाइन", en: "104 Health Helpline" },
    description: "Medical advice and information",
    descriptionLocal: { 
      te: "వైద్య సలహా & సమాచారం", 
      hi: "चिकित्सा सलाह और जानकारी", 
      en: "Medical advice and information" 
    },
    phone: "104",
    icon: Heart,
    borderColor: "border-l-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "asha",
    name: "ASHA Worker",
    nameLocal: { te: "ఆశా వర్కర్", hi: "आशा कार्यकर्ता", en: "ASHA Worker" },
    description: "Local community health worker",
    descriptionLocal: { 
      te: "స్థానిక ఆరోగ్య కార్యకర్త", 
      hi: "स्थानीय स्वास्थ्य कार्यकर्ता", 
      en: "Local community health worker" 
    },
    phone: "+91 98765 43212",
    icon: Shield,
    borderColor: "border-l-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    id: "phc",
    name: "Kondapalli PHC",
    nameLocal: { te: "కొండపల్లి PHC", hi: "कोंडापल्ली PHC", en: "Kondapalli PHC" },
    description: "Primary Health Centre",
    descriptionLocal: { 
      te: "ప్రాథమిక ఆరోగ్య కేంద్రం", 
      hi: "प्राथमिक स्वास्थ्य केंद्र", 
      en: "Primary Health Centre" 
    },
    phone: "+91 866 234 5678",
    icon: Building2,
    borderColor: "border-l-marker-phc",
    iconBg: "bg-marker-phc/10",
    iconColor: "text-marker-phc",
  },
]

export function Helplines({ language }: HelplinesProps) {
  const t = translations[language || "en"]
  const lang = language || "en"

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`
  }

  return (
    <div className="min-h-full px-6 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-severity-critical/10 flex items-center justify-center">
          <Phone className="w-8 h-8 text-severity-critical" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Helpline Cards */}
      <div className="space-y-4">
        {helplines.map((helpline) => {
          const Icon = helpline.icon
          return (
            <div
              key={helpline.id}
              className={cn(
                "bg-card rounded-2xl border border-border border-l-4 p-5",
                helpline.borderColor
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                  helpline.iconBg
                )}>
                  <Icon className={cn("w-7 h-7", helpline.iconColor)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {helpline.nameLocal[lang]}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {helpline.descriptionLocal[lang]}
                  </p>
                  <p className="text-xl font-bold text-foreground mt-2 tracking-wide">
                    {helpline.phone}
                  </p>
                </div>
              </div>

              {/* Call Button */}
              <button
                onClick={() => handleCall(helpline.phone)}
                className={cn(
                  "w-full h-12 mt-4 rounded-xl font-semibold",
                  "bg-primary text-primary-foreground",
                  "transition-all duration-200",
                  "hover:bg-primary/90 active:scale-[0.98]",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Phone className="w-5 h-5" />
                {t.call}
              </button>
            </div>
          )
        })}
      </div>

      {/* Works Offline Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <WifiOff className="w-4 h-4" />
        <span>{t.worksOffline}</span>
      </div>
    </div>
  )
}
