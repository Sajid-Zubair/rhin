"use client"

import { useState } from "react"
import { Language } from "@/app/page"
import { 
  Thermometer, Droplets, Frown, Sparkles, Wind, HelpCircle,
  ArrowLeft, ArrowRight, Check, MapPin, Navigation, Loader2, WifiOff
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AshaReportFormProps {
  language: Language
  isOnline: boolean
  onSubmit: () => void
  onCancel: () => void
}

const translations = {
  te: {
    title: "క్షేత్ర నివేదిక",
    step1: "లక్షణాలు",
    step2: "కేసుల సంఖ్య",
    step3: "స్థానం",
    selectSymptoms: "గమనించిన లక్షణాలను ఎంచుకోండి",
    howManyCases: "ఎన్ని కేసులు?",
    selectVillage: "గ్రామాన్ని ఎంచుకోండి",
    gpsStatus: "GPS స్థితి",
    next: "తదుపరి",
    back: "వెనుకకు",
    submit: "సమర్పించు",
    savedOffline: "ఆఫ్‌లైన్‌లో సేవ్ చేయబడుతుంది",
    fever: "జ్వరం",
    diarrhea: "విరేచనాలు",
    vomiting: "వాంతి",
    rash: "దద్దుర్లు",
    respiratory: "శ్వాసకోశ",
    other: "ఇతర",
  },
  hi: {
    title: "फील्ड रिपोर्ट",
    step1: "लक्षण",
    step2: "केस की संख्या",
    step3: "स्थान",
    selectSymptoms: "देखे गए लक्षण चुनें",
    howManyCases: "कितने केस?",
    selectVillage: "गांव चुनें",
    gpsStatus: "GPS स्थिति",
    next: "अगला",
    back: "पीछे",
    submit: "जमा करें",
    savedOffline: "ऑफ़लाइन सहेजा जाएगा",
    fever: "बुखार",
    diarrhea: "दस्त",
    vomiting: "उल्टी",
    rash: "दाने",
    respiratory: "श्वसन",
    other: "अन्य",
  },
  en: {
    title: "Field Report",
    step1: "Symptoms",
    step2: "Case Count",
    step3: "Location",
    selectSymptoms: "Select observed symptoms",
    howManyCases: "How many cases?",
    selectVillage: "Select village",
    gpsStatus: "GPS status",
    next: "Next",
    back: "Back",
    submit: "Submit",
    savedOffline: "Will be saved offline",
    fever: "Fever",
    diarrhea: "Diarrhea",
    vomiting: "Vomiting",
    rash: "Rash",
    respiratory: "Respiratory",
    other: "Other",
  },
}

const symptoms = [
  { id: "fever", icon: Thermometer },
  { id: "diarrhea", icon: Droplets },
  { id: "vomiting", icon: Frown },
  { id: "rash", icon: Sparkles },
  { id: "respiratory", icon: Wind },
  { id: "other", icon: HelpCircle },
]

const villages = [
  { id: "1", name: "Kondapalli" },
  { id: "2", name: "Ibrahimpatnam" },
  { id: "3", name: "Nandigama" },
  { id: "4", name: "Mylavaram" },
]

export function AshaReportForm({ language, isOnline, onSubmit, onCancel }: AshaReportFormProps) {
  const t = translations[language || "en"]
  const [step, setStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [caseCount, setCaseCount] = useState<number | null>(null)
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null)
  const [hasGps, setHasGps] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((s) => s !== symptomId)
        : [...prev, symptomId]
    )
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else onCancel()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    onSubmit()
  }

  const canProceed = () => {
    if (step === 1) return selectedSymptoms.length > 0
    if (step === 2) return caseCount !== null
    if (step === 3) return selectedVillage !== null
    return false
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">{t.title}</h1>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  s < step && "bg-accent text-accent-foreground",
                  s === step && "bg-accent text-accent-foreground ring-4 ring-accent/20",
                  s > step && "bg-muted text-muted-foreground"
                )}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "w-8 h-0.5 rounded-full transition-all",
                  s < step ? "bg-accent" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 mt-2">
          <span className={cn("text-xs", step === 1 ? "text-accent font-medium" : "text-muted-foreground")}>{t.step1}</span>
          <span className={cn("text-xs", step === 2 ? "text-accent font-medium" : "text-muted-foreground")}>{t.step2}</span>
          <span className={cn("text-xs", step === 3 ? "text-accent font-medium" : "text-muted-foreground")}>{t.step3}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        {/* Step 1: Symptoms */}
        {step === 1 && (
          <div>
            <p className="text-muted-foreground mb-6">{t.selectSymptoms}</p>
            <div className="grid grid-cols-2 gap-3">
              {symptoms.map((symptom) => {
                const Icon = symptom.icon
                const isSelected = selectedSymptoms.includes(symptom.id)
                const label = t[symptom.id as keyof typeof t] as string
                return (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all",
                      "min-h-[100px]",
                      isSelected
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card hover:border-accent/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-8 h-8",
                      isSelected ? "text-accent" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium",
                      isSelected ? "text-accent" : "text-foreground"
                    )}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Case Count */}
        {step === 2 && (
          <div>
            <p className="text-muted-foreground mb-6">{t.howManyCases}</p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => setCaseCount(num)}
                  className={cn(
                    "h-16 rounded-2xl text-xl font-semibold border-2 transition-all",
                    caseCount === num
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-card text-foreground hover:border-accent/50"
                  )}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCaseCount(10)}
                className={cn(
                  "h-16 rounded-2xl text-lg font-semibold border-2 transition-all col-span-3",
                  caseCount === 10
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-card text-foreground hover:border-accent/50"
                )}
              >
                10+
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div>
            <p className="text-muted-foreground mb-6">{t.selectVillage}</p>
            
            {/* Village Dropdown */}
            <div className="space-y-2 mb-6">
              {villages.map((village) => (
                <button
                  key={village.id}
                  onClick={() => setSelectedVillage(village.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    selectedVillage === village.id
                      ? "border-accent bg-accent/10"
                      : "border-border bg-card hover:border-accent/50"
                  )}
                >
                  <MapPin className={cn(
                    "w-5 h-5",
                    selectedVillage === village.id ? "text-accent" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-medium",
                    selectedVillage === village.id ? "text-accent" : "text-foreground"
                  )}>
                    {village.name}
                  </span>
                </button>
              ))}
            </div>

            {/* GPS Status */}
            <div className={cn(
              "flex items-center gap-3 p-4 rounded-xl",
              hasGps ? "bg-severity-mild/10" : "bg-muted"
            )}>
              <Navigation className={cn(
                "w-5 h-5",
                hasGps ? "text-severity-mild" : "text-muted-foreground"
              )} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.gpsStatus}</p>
                <p className={cn(
                  "text-sm",
                  hasGps ? "text-severity-mild" : "text-muted-foreground"
                )}>
                  {hasGps ? "Location acquired" : "Acquiring location..."}
                </p>
              </div>
              {hasGps && <Check className="w-5 h-5 text-severity-mild" />}
            </div>

            {/* Offline indicator */}
            {!isOnline && (
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                <WifiOff className="w-4 h-4" />
                <span>{t.savedOffline}</span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 pb-6 pt-4">
        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "w-full h-14 rounded-2xl font-semibold text-lg",
              "bg-accent text-accent-foreground",
              "transition-all duration-200",
              "hover:bg-accent/90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {t.next}
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className={cn(
              "w-full h-14 rounded-2xl font-semibold text-lg",
              "bg-accent text-accent-foreground",
              "transition-all duration-200",
              "hover:bg-accent/90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {t.submit}
              </>
            )}
          </button>
        )}
      </footer>
    </div>
  )
}
