"use client"

import { Language } from "@/frontend/app/page"
import { ArrowLeft, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguagePickerProps {
  onLanguageSelect: (language: Language) => void
  onBack: () => void
}

const languages = [
  {
    id: "te" as Language,
    name: "తెలుగు",
    nameEn: "Telugu",
    greeting: "స్వాగతం",
    greetingEn: "Welcome",
  },
  {
    id: "hi" as Language,
    name: "हिन्दी",
    nameEn: "Hindi",
    greeting: "स्वागत है",
    greetingEn: "Welcome",
  },
  {
    id: "en" as Language,
    name: "English",
    nameEn: "English",
    greeting: "Welcome",
    greetingEn: "Welcome",
  },
]

export function LanguagePicker({ onLanguageSelect, onBack }: LanguagePickerProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Welcome animation area */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-4xl">🙏</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Choose your language
          </h1>
          <p className="text-muted-foreground">
            మీ భాషను ఎంచుకోండి • अपनी भाषा चुनें
          </p>
        </div>

        {/* Language Pills */}
        <div className="w-full max-w-sm space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageSelect(lang.id)}
              className={cn(
                "w-full min-h-[72px] rounded-2xl border-2 border-border bg-card",
                "flex items-center justify-between px-6",
                "transition-all duration-200 ease-out",
                "hover:border-primary hover:bg-primary/5",
                "active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              )}
              aria-label={`Select ${lang.nameEn}`}
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold text-card-foreground">
                  {lang.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {lang.greeting}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Check className="w-5 h-5 text-primary" />
              </div>
            </button>
          ))}
        </div>

        {/* Reassurance */}
        <p className="mt-8 text-sm text-muted-foreground text-center max-w-xs">
          You can change this later in settings
        </p>
      </main>
    </div>
  )
}
