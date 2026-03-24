"use client"

import { useState } from "react"
import { Language } from "@/app/page"
import { ArrowLeft, Shield, WifiOff, Loader2, Delete } from "lucide-react"
import { cn } from "@/lib/utils"

interface AshaLoginProps {
  language: Language
  onSuccess: () => void
  onBack: () => void
}

const translations = {
  te: {
    title: "ASHA లాగిన్",
    ashaId: "ASHA ID",
    enterPin: "మీ PIN నమోదు చేయండి",
    login: "లాగిన్",
    offlineNote: "సిగ్నల్ అవసరం లేదు",
    placeholder: "ASHA ID నమోదు చేయండి",
  },
  hi: {
    title: "ASHA लॉगिन",
    ashaId: "ASHA ID",
    enterPin: "अपना PIN दर्ज करें",
    login: "लॉगिन",
    offlineNote: "सिग्नल की आवश्यकता नहीं",
    placeholder: "ASHA ID दर्ज करें",
  },
  en: {
    title: "ASHA Login",
    ashaId: "ASHA ID",
    enterPin: "Enter your PIN",
    login: "Login",
    offlineNote: "Works offline",
    placeholder: "Enter your ASHA ID",
  },
}

export function AshaLogin({ language, onSuccess, onBack }: AshaLoginProps) {
  const t = translations[language || "en"]
  const [ashaId, setAshaId] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"id" | "pin">("id")

  const handleIdSubmit = () => {
    if (ashaId.length >= 6) {
      setStep("pin")
    }
  }

  const handlePinPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      if (newPin.length === 4) {
        handleLogin(newPin)
      }
    }
  }

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1))
  }

  const handleLogin = async (pinValue: string) => {
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    onSuccess()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={step === "pin" ? () => setStep("id") : onBack}
          className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        
        {/* Offline indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
          <WifiOff className="w-4 h-4" />
          <span>{t.offlineNote}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 pt-8">
        <div className="max-w-sm mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-accent" />
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-8">
            {t.title}
          </h1>

          {step === "id" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.ashaId}
                </label>
                <input
                  type="text"
                  value={ashaId}
                  onChange={(e) => setAshaId(e.target.value.toUpperCase())}
                  placeholder={t.placeholder}
                  className={cn(
                    "w-full h-14 px-4 rounded-xl border-2 border-input bg-card",
                    "text-lg font-medium text-card-foreground uppercase tracking-wider",
                    "placeholder:text-muted-foreground/50 placeholder:normal-case",
                    "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "transition-all duration-200"
                  )}
                  autoFocus
                />
              </div>

              <button
                onClick={handleIdSubmit}
                disabled={ashaId.length < 6}
                className={cn(
                  "w-full h-14 rounded-xl font-semibold text-lg",
                  "bg-accent text-accent-foreground",
                  "transition-all duration-200",
                  "hover:bg-accent/90 active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-muted-foreground">
                {t.enterPin}
              </p>

              {/* PIN Display */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-14 h-14 rounded-xl border-2 flex items-center justify-center",
                      "transition-all duration-200",
                      pin.length > index
                        ? "border-accent bg-accent/10"
                        : "border-input bg-card"
                    )}
                  >
                    {pin.length > index && (
                      <div className="w-4 h-4 rounded-full bg-accent" />
                    )}
                  </div>
                ))}
              </div>

              {/* PIN Pad */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handlePinPress(digit.toString())}
                      className={cn(
                        "h-16 rounded-xl text-2xl font-semibold",
                        "bg-card border border-border text-card-foreground",
                        "transition-all duration-150",
                        "hover:bg-muted active:scale-95 active:bg-muted"
                      )}
                    >
                      {digit}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => handlePinPress("0")}
                    className={cn(
                      "h-16 rounded-xl text-2xl font-semibold",
                      "bg-card border border-border text-card-foreground",
                      "transition-all duration-150",
                      "hover:bg-muted active:scale-95 active:bg-muted"
                    )}
                  >
                    0
                  </button>
                  <button
                    onClick={handlePinDelete}
                    disabled={pin.length === 0}
                    className={cn(
                      "h-16 rounded-xl flex items-center justify-center",
                      "bg-card border border-border text-muted-foreground",
                      "transition-all duration-150",
                      "hover:bg-muted active:scale-95",
                      "disabled:opacity-30"
                    )}
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
