"use client"

import { useState, useRef, useEffect } from "react"
import { Language, UserRole } from "@/app/page"
import { ArrowLeft, Phone, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface OTPLoginProps {
  role: UserRole
  language: Language
  onSuccess: () => void
  onBack: () => void
}

const roleMap = {
  villager: "villager",
  asha: "asha_worker",
  admin: "admin_phc",
  delivery: "delivery_partner",
}

const translations = {
  te: {
    title: "మీ ఫోన్ నంబర్",
    subtitle: "మేము మీకు OTP పంపుతాము",
    phonePlaceholder: "ఫోన్ నంబర్ నమోదు చేయండి",
    sendOtp: "OTP పంపండి",
    enterOtp: "OTP నమోదు చేయండి",
    verify: "ధృవీకరించండి",
    resend: "మళ్ళీ పంపండి",
    noPassword: "పాస్‌వర్డ్ అవసరం లేదు",
  },
  hi: {
    title: "आपका फ़ोन नंबर",
    subtitle: "हम आपको OTP भेजेंगे",
    phonePlaceholder: "फ़ोन नंबर दर्ज करें",
    sendOtp: "OTP भेजें",
    enterOtp: "OTP दर्ज करें",
    verify: "सत्यापित करें",
    resend: "दोबारा भेजें",
    noPassword: "पासवर्ड की आवश्यकता नहीं",
  },
  en: {
    title: "Your Phone Number",
    subtitle: "We'll send you a one-time code",
    phonePlaceholder: "Enter phone number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verify: "Verify",
    resend: "Resend",
    noPassword: "No password needed",
  },
}

export function OTPLogin({ role, language, onSuccess, onBack }: OTPLoginProps) {
  const t = translations[language || "en"]
  const [phone, setPhone] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    const isVerified = localStorage.getItem("isVerified")

    if (isVerified === "true") {
      onSuccess()
    }
  }, [])

  const handleSendOtp = async () => {
  if (phone.length < 10) return

  setIsLoading(true)
  try {
    const res = await fetch("http://localhost:8000/send-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: "+91" + phone,
        user_type: roleMap[role as keyof typeof roleMap],
      }),
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || "Failed")

    setStep("otp")
    setCountdown(30)
    setTimeout(() => otpRefs.current[0]?.focus(), 100)

  } catch (err) {
    console.error(err)
    alert("Failed to send OTP")
  } finally {
    setIsLoading(false)
  }
}

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit if all filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleVerify(newOtp)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpValue = otp) => {
    if (otpValue.some((digit) => digit === "")) return
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)

    localStorage.setItem("isVerified", "true")
    localStorage.setItem("phone", phone)

    onSuccess()
  }

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""])
    setCountdown(30)
    otpRefs.current[0]?.focus()
  }

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
      <main className="flex-1 px-6 pt-8">
        <div className="max-w-sm mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Phone className="w-8 h-8 text-primary" />
          </div>

          {step === "phone" ? (
            <>
              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                {t.title}
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                {t.subtitle}
              </p>

              {/* Phone Input */}
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder={t.phonePlaceholder}
                    className={cn(
                      "w-full h-16 pl-16 pr-4 rounded-2xl border-2 border-input bg-card",
                      "text-xl font-medium text-card-foreground",
                      "placeholder:text-muted-foreground/50",
                      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                      "transition-all duration-200"
                    )}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || isLoading}
                  className={cn(
                    "w-full h-14 rounded-2xl font-semibold text-lg",
                    "bg-primary text-primary-foreground",
                    "transition-all duration-200",
                    "hover:bg-primary/90 active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t.sendOtp
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  {t.noPassword}
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center text-foreground mb-2">
                {t.enterOtp}
              </h1>
              <p className="text-center text-muted-foreground mb-8">
                Sent to +91 {phone}
              </p>

              {/* OTP Grid */}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={cn(
                      "w-12 h-14 rounded-xl border-2 border-input bg-card",
                      "text-center text-2xl font-bold text-card-foreground",
                      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                      "transition-all duration-200"
                    )}
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={otp.some((d) => !d) || isLoading}
                className={cn(
                  "w-full h-14 rounded-2xl font-semibold text-lg",
                  "bg-primary text-primary-foreground",
                  "transition-all duration-200",
                  "hover:bg-primary/90 active:scale-[0.98]",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t.verify
                )}
              </button>

              {/* Resend */}
              <div className="mt-6 text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t.resend} in {countdown}s
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t.resend}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
