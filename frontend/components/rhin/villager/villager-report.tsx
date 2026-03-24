"use client"

import { useState, useRef, useEffect } from "react"
import { Language } from "@/app/page"
import { ReportData } from "./villager-app"
import { OfflineIndicator } from "../offline-banner"
import { Mic, Loader2, Phone, Heart } from "lucide-react"

interface VillagerReportPageProps {
  language: Language
  isOnline: boolean
  onReportComplete: (data: ReportData) => void
}

type RecordingState = "idle" | "recording" | "processing"

const translations = {
  en: {
    greeting: "How are you feeling right now?",
    subtitle: "Tell us about your symptoms",
    textPlaceholder: "Describe your symptoms...",
    submit: "Submit",
    callMe: "Call me back",
    callMeDesc: "An ASHA worker will call you",
  },
}

// ✅ FINAL FIXED extractSymptoms
const extractSymptoms = (text: string): ReportData => {
  const symptoms: string[] = []
  const t = text.toLowerCase()

  // English
  if (t.includes("fever")) symptoms.push("Fever")
  if (t.includes("headache")) symptoms.push("Headache")
  if (t.includes("cough")) symptoms.push("Cough")
  if (t.includes("cold")) symptoms.push("Cold")
  if (t.includes("vomit")) symptoms.push("Vomiting")
  if (t.includes("diarrhea")) symptoms.push("Diarrhea")

  // Hindi
  if (t.includes("बुखार")) symptoms.push("Fever")
  if (t.includes("सिरदर्द")) symptoms.push("Headache")
  if (t.includes("खांसी")) symptoms.push("Cough")

  // Telugu
  if (t.includes("జ్వరం")) symptoms.push("Fever")
  if (t.includes("తలనొప్పి")) symptoms.push("Headache")
  if (t.includes("దగ్గు")) symptoms.push("Cough")

  // fallback
  if (symptoms.length === 0) {
    symptoms.push("General Weakness")
  }

  let severity: ReportData["severity"] = "mild"
  if (symptoms.length >= 2) severity = "moderate"
  if (symptoms.includes("Vomiting") || symptoms.includes("Diarrhea")) {
    severity = "severe"
  }

  return {
    name: "",
    age: "",
    village: "",
    symptoms,
    severity,
    advice: [
      "Stay hydrated",
      "Take proper rest",
      "Visit doctor if symptoms persist",
    ],
    transcript: text, // ✅ THIS sends your transcribed text
  }
}

export function VillagerReportPage({
  language,
  isOnline,
  onReportComplete,
}: VillagerReportPageProps) {
  const t = translations["en"]

  const [recordingState, setRecordingState] =
    useState<RecordingState>("idle")
  const [textInput, setTextInput] = useState("")
  const [showLangSelect, setShowLangSelect] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  const recognitionRef = useRef<any>(null)

  // 🌍 Geolocation setup
  useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude

          setLocation({ lat, lon })
        },
        (err) => {
          console.error("Location error:", err)
        }
      )
    }, [])

  // 🎤 Speech setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event: any) => {
      let text = ""
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTextInput(text)
    }

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e.error)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = async (lang: string) => {
    if (!recognitionRef.current) return

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })

      recognitionRef.current.lang = lang
      recognitionRef.current.start()

      setRecordingState("recording")
      setShowLangSelect(false)
    } catch (err) {
      console.error(err)
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setRecordingState("idle")
  }

  const handleMicClick = () => {
    setShowLangSelect(true)
  }

  // const handleSubmit = async () => {
  //   if (!textInput.trim()) return

  //   setRecordingState("processing")

  //   await new Promise((r) => setTimeout(r, 1000))

  //   const reportData = extractSymptoms(textInput)

  //   console.log("FINAL DATA SENT:", reportData) // 🔥 debug

  //   onReportComplete(reportData)
  // }

  const handleSubmit = async () => {
  if (!textInput.trim()) return

  if (!location) {
    alert("Please enable location access")
    return
  }

  setRecordingState("processing")

  await new Promise((r) => setTimeout(r, 1000))

  const extracted = extractSymptoms(textInput)

  onReportComplete({
    ...extracted,
    lat: location.lat,
    lon: location.lon,
  })
}

  return (
      <div className="min-h-full flex flex-col px-6 py-6">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Heart className="text-primary" />
            </div>
            <span className="font-semibold text-lg">RHIN</span>
          </div>
          <OfflineIndicator isOnline={isOnline} />
        </header>

        {/* Main */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold mb-2">
            {t.greeting}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t.subtitle}
          </p>

          {/* Mic */}
          <button
            onClick={handleMicClick}
            className="w-28 h-28 flex items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform active:scale-95"
          >
            {recordingState === "processing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          {/* Language */}
          {showLangSelect && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => startListening("en-US")}
                className="px-4 py-2 rounded-full border text-sm hover:bg-muted transition"
              >
                English
              </button>
              <button
                onClick={() => startListening("hi-IN")}
                className="px-4 py-2 rounded-full border text-sm hover:bg-muted transition"
              >
                Hindi
              </button>
            </div>
          )}

          {/* Recording */}
          {recordingState === "recording" && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-primary font-medium">
                Listening...
              </p>
              <button
                onClick={stopListening}
                className="text-sm text-red-500 hover:underline"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 space-y-4">

          {/* Textarea */}
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.textPlaceholder}
            className="w-full h-28 p-4 rounded-2xl border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium transition active:scale-[0.98]"
          >
            {t.submit}
          </button>

          {/* Call */}
          <button className="w-full py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-muted transition">
            <Phone className="w-4 h-4" />
            {t.callMe}
          </button>
        </div>
      </div>
  )
}