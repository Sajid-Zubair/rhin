"use client"

import { useState, useRef, useEffect } from "react"
import { Language } from "@/frontend/app/page"
import { ReportData } from "./villager-app"
import { OfflineIndicator } from "../offline-banner"
import { Mic, MicOff, Keyboard, Phone, Loader2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface VillagerReportPageProps {
  language: Language
  isOnline: boolean
  onReportComplete: (data: ReportData) => void
}

type RecordingState = "idle" | "recording" | "processing"

const translations = {
  te: {
    greeting: "ఇప్పుడు మీకు ఎలా అనిపిస్తుంది?",
    subtitle: "మీ లక్షణాలను మాకు చెప్పండి",
    holdToSpeak: "మాట్లాడటానికి నొక్కి పట్టుకోండి",
    recording: "వినడం...",
    processing: "ప్రాసెస్ చేస్తోంది...",
    orType: "లేదా టైప్ చేయండి",
    textPlaceholder: "మీ లక్షణాలను వర్ణించండి...",
    submit: "సమర్పించు",
    callMe: "నన్ను తిరిగి కాల్ చేయండి",
    callMeDesc: "ASHA కార్యకర్త మిమ్మల్ని కాల్ చేస్తారు",
  },
  hi: {
    greeting: "अभी आप कैसा महसूस कर रहे हैं?",
    subtitle: "हमें अपने लक्षण बताएं",
    holdToSpeak: "बोलने के लिए दबाकर रखें",
    recording: "सुन रहा है...",
    processing: "प्रोसेस हो रहा है...",
    orType: "या टाइप करें",
    textPlaceholder: "अपने लक्षण बताएं...",
    submit: "जमा करें",
    callMe: "मुझे वापस कॉल करें",
    callMeDesc: "आशा कार्यकर्ता आपको कॉल करेगी",
  },
  en: {
    greeting: "How are you feeling right now?",
    subtitle: "Tell us about your symptoms",
    holdToSpeak: "Hold to speak",
    recording: "Listening...",
    processing: "Processing...",
    orType: "or type instead",
    textPlaceholder: "Describe your symptoms...",
    submit: "Submit",
    callMe: "Call me back",
    callMeDesc: "An ASHA worker will call you",
  },
}

// Simulated symptom extraction from voice/text
const extractSymptoms = (text: string): ReportData => {
  // This would be AI-powered in production
  const symptoms: string[] = []
  const textLower = text.toLowerCase()
  
  if (textLower.includes("fever") || textLower.includes("జ్వరం") || textLower.includes("बुखार")) {
    symptoms.push("Fever")
  }
  if (textLower.includes("headache") || textLower.includes("తలనొప్పి") || textLower.includes("सिरदर्द")) {
    symptoms.push("Headache")
  }
  if (textLower.includes("cough") || textLower.includes("దగ్గు") || textLower.includes("खांसी")) {
    symptoms.push("Cough")
  }
  if (textLower.includes("vomit") || textLower.includes("వాంతి") || textLower.includes("उल्टी")) {
    symptoms.push("Vomiting")
  }
  if (textLower.includes("diarrhea") || textLower.includes("విరేచనాలు") || textLower.includes("दस्त")) {
    symptoms.push("Diarrhea")
  }
  if (textLower.includes("rash") || textLower.includes("దద్దుర్లు") || textLower.includes("दाने")) {
    symptoms.push("Skin Rash")
  }
  
  // Default symptoms if none detected
  if (symptoms.length === 0) {
    symptoms.push("General Weakness", "Body Pain")
  }

  // Determine severity
  let severity: ReportData["severity"] = "mild"
  if (symptoms.length >= 3) severity = "moderate"
  if (symptoms.includes("Vomiting") && symptoms.includes("Diarrhea")) severity = "severe"

  return {
    name: "",
    age: "",
    village: "Kondapalli",
    symptoms,
    severity,
    advice: [
      "Stay hydrated - drink plenty of water",
      "Rest and avoid strenuous activity",
      "Visit PHC if symptoms persist beyond 48 hours"
    ],
    transcript: text,
  }
}

export function VillagerReportPage({ language, isOnline, onReportComplete }: VillagerReportPageProps) {
  const t = translations[language || "en"]
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [showTextInput, setShowTextInput] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>()

  // Recording timer
  useEffect(() => {
    if (recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setRecordingTime(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recordingState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleMicPress = () => {
    if (recordingState === "idle") {
      setRecordingState("recording")
    }
  }

  const handleMicRelease = async () => {
    if (recordingState === "recording") {
      setRecordingState("processing")
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // Extract symptoms from simulated transcript
      const reportData = extractSymptoms("I have fever and headache for two days")
      onReportComplete(reportData)
    }
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return
    setRecordingState("processing")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const reportData = extractSymptoms(textInput)
    onReportComplete(reportData)
  }

  const handleCallMeBack = () => {
    // Would trigger IVR callback in production
    alert("An ASHA worker will call you shortly")
  }

  return (
    <div className="min-h-full flex flex-col px-6 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">RHIN</span>
        </div>
        <OfflineIndicator isOnline={isOnline} />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-12">
        {/* Greeting */}
        <h1 className="text-2xl font-bold text-center text-foreground mb-2 text-balance">
          {t.greeting}
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          {t.subtitle}
        </p>

        {/* Microphone Button */}
        <div className="relative mb-8">
          {/* Pulse rings for recording state */}
          {recordingState === "recording" && (
            <>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "1.5s" }} />
              <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute -inset-8 rounded-full bg-primary/5 animate-pulse" style={{ animationDelay: "0.5s" }} />
            </>
          )}
          
          <button
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onMouseLeave={() => recordingState === "recording" && handleMicRelease()}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            disabled={recordingState === "processing"}
            className={cn(
              "relative w-32 h-32 rounded-full flex items-center justify-center",
              "transition-all duration-300 ease-out",
              "focus:outline-none focus:ring-4 focus:ring-primary/30",
              recordingState === "idle" && "bg-primary hover:bg-primary/90 active:scale-95",
              recordingState === "recording" && "bg-primary scale-110",
              recordingState === "processing" && "bg-muted cursor-not-allowed"
            )}
            aria-label={t.holdToSpeak}
          >
            {recordingState === "processing" ? (
              <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
            ) : recordingState === "recording" ? (
              <MicOff className="w-12 h-12 text-primary-foreground" />
            ) : (
              <Mic className="w-12 h-12 text-primary-foreground" />
            )}
          </button>
        </div>

        {/* Status Text */}
        <p className={cn(
          "text-lg font-medium mb-2",
          recordingState === "recording" ? "text-primary" : "text-muted-foreground"
        )}>
          {recordingState === "recording" && t.recording}
          {recordingState === "processing" && t.processing}
          {recordingState === "idle" && t.holdToSpeak}
        </p>

        {/* Recording Timer */}
        {recordingState === "recording" && (
          <p className="text-2xl font-mono text-primary mb-4">
            {formatTime(recordingTime)}
          </p>
        )}

        {/* Waveform visualization placeholder */}
        {recordingState === "recording" && (
          <div className="flex items-center gap-1 h-8 mb-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 24 + 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.5s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        {/* Text Input Toggle */}
        {!showTextInput ? (
          <button
            onClick={() => setShowTextInput(true)}
            disabled={recordingState !== "idle"}
            className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Keyboard className="w-5 h-5" />
            <span>{t.orType}</span>
          </button>
        ) : (
          <div className="space-y-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.textPlaceholder}
              className={cn(
                "w-full h-24 p-4 rounded-2xl border-2 border-input bg-card",
                "text-base text-card-foreground resize-none",
                "placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
              autoFocus
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || recordingState === "processing"}
              className={cn(
                "w-full h-14 rounded-2xl font-semibold text-lg",
                "bg-primary text-primary-foreground",
                "transition-all duration-200",
                "hover:bg-primary/90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {recordingState === "processing" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t.submit
              )}
            </button>
          </div>
        )}

        {/* Call Me Back */}
        <button
          onClick={handleCallMeBack}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all"
        >
          <Phone className="w-5 h-5 text-accent" />
          <div className="text-left">
            <p className="font-medium text-foreground">{t.callMe}</p>
            <p className="text-sm text-muted-foreground">{t.callMeDesc}</p>
          </div>
        </button>
      </div>
    </div>
  )
}
