// "use client"

// import { useState } from "react"
// import { Language } from "@/app/page"
// import { ReportData } from "./villager-app"
// import { 
//   User, Calendar, MapPin, AlertCircle, Check, 
//   Edit2, X, Droplets, Bed, Building2, WifiOff, Loader2
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface ConfirmPageProps {
//   language: Language
//   isOnline: boolean
//   reportData: ReportData
//   onSubmit: () => void
//   onEdit: () => void
// }

// const translations = {
//   te: {
//     title: "వివరాలను నిర్ధారించండి",
//     name: "పేరు",
//     age: "వయస్సు",
//     village: "గ్రామం",
//     symptoms: "లక్షణాలు",
//     severity: "తీవ్రత",
//     advice: "సలహా",
//     submit: "నిర్ధారించి సమర్పించండి",
//     savedOffline: "ఆఫ్‌లైన్‌లో సేవ్ చేయబడింది",
//     edit: "మార్చు",
//     namePlaceholder: "మీ పేరు",
//     agePlaceholder: "వయస్సు",
//   },
//   hi: {
//     title: "विवरण की पुष्टि करें",
//     name: "नाम",
//     age: "आयु",
//     village: "गांव",
//     symptoms: "लक्षण",
//     severity: "गंभीरता",
//     advice: "सलाह",
//     submit: "पुष्टि करें और जमा करें",
//     savedOffline: "ऑफ़लाइन सहेजा गया",
//     edit: "संपादित करें",
//     namePlaceholder: "आपका नाम",
//     agePlaceholder: "आयु",
//   },
//   en: {
//     title: "Confirm Details",
//     name: "Name",
//     age: "Age",
//     village: "Village",
//     symptoms: "Symptoms",
//     severity: "Severity",
//     advice: "Advice",
//     submit: "Confirm & Submit",
//     savedOffline: "Saved offline",
//     edit: "Edit",
//     namePlaceholder: "Your name",
//     agePlaceholder: "Age",
//   },
// }

// const severityConfig = {
//   mild: { label: "Mild", color: "bg-severity-mild text-white" },
//   moderate: { label: "Moderate", color: "bg-severity-moderate text-white" },
//   severe: { label: "Severe", color: "bg-severity-severe text-white" },
//   critical: { label: "Critical", color: "bg-severity-critical text-white" },
// }

// const adviceIcons = [Droplets, Bed, Building2]

// export function ConfirmPage({ language, isOnline, reportData, onSubmit, onEdit }: ConfirmPageProps) {
//   const t = translations[language || "en"]
//   const [name, setName] = useState(reportData.name)
//   const [age, setAge] = useState(reportData.age)
//   const [symptoms, setSymptoms] = useState(reportData.symptoms)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleRemoveSymptom = (symptomToRemove: string) => {
//     setSymptoms(symptoms.filter((s) => s !== symptomToRemove))
//   }

//   const handleSubmit = async () => {
//     setIsSubmitting(true)
//     await new Promise((resolve) => setTimeout(resolve, 1500))
//     setIsSubmitting(false)
//     onSubmit()
//   }

//   const severity = severityConfig[reportData.severity]

//   return (
//     <div className="min-h-full px-6 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
//         <button
//           onClick={onEdit}
//           className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//         >
//           <Edit2 className="w-4 h-4" />
//           {t.edit}
//         </button>
//       </div>

//       {/* Data Cards */}
//       <div className="space-y-4">
//         {/* Name & Age Row */}

//         {/* Village */}
//         <div className="bg-card rounded-xl border border-border p-4">
//           <div className="flex items-center gap-2 text-muted-foreground mb-2">
//             <MapPin className="w-4 h-4" />
//             <span className="text-sm">{t.village}</span>
//           </div>
//           <p className="text-lg font-semibold text-card-foreground">{reportData.village}</p>
//         </div>

//         {/* Symptoms */}
//         <div className="bg-card rounded-xl border border-border p-4">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2 text-muted-foreground">
//               <AlertCircle className="w-4 h-4" />
//               <span className="text-sm">{t.symptoms}</span>
//             </div>
//             {/* Severity Badge */}
//             <span className={cn(
//               "px-3 py-1 rounded-full text-sm font-medium",
//               severity.color
//             )}>
//               {severity.label}
//             </span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {symptoms.map((symptom) => (
//               <span
//                 key={symptom}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground"
//               >
//                 {symptom}
//                 <button
//                   onClick={() => handleRemoveSymptom(symptom)}
//                   className="w-4 h-4 rounded-full hover:bg-foreground/10 flex items-center justify-center"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Advice Cards */}
//         <div className="space-y-3">
//           <p className="text-sm text-muted-foreground">{t.advice}</p>
//           {reportData.advice.map((advice, index) => {
//             const Icon = adviceIcons[index] || AlertCircle
//             const colors = [
//               "border-l-severity-mild bg-severity-mild/5",
//               "border-l-severity-moderate bg-severity-moderate/5",
//               "border-l-chart-5 bg-chart-5/5",
//             ]
//             return (
//               <div
//                 key={index}
//                 className={cn(
//                   "flex items-start gap-3 p-4 rounded-xl border border-border border-l-4",
//                   colors[index]
//                 )}
//               >
//                 <Icon className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
//                 <p className="text-sm text-foreground leading-relaxed">{advice}</p>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="mt-8 space-y-3">
//         <button
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           className={cn(
//             "w-full h-14 rounded-2xl font-semibold text-lg",
//             "bg-primary text-primary-foreground",
//             "transition-all duration-200",
//             "hover:bg-primary/90 active:scale-[0.98]",
//             "disabled:opacity-50 disabled:cursor-not-allowed",
//             "flex items-center justify-center gap-2"
//           )}
//         >
//           {isSubmitting ? (
//             <Loader2 className="w-5 h-5 animate-spin" />
//           ) : (
//             <>
//               <Check className="w-5 h-5" />
//               {t.submit}
//             </>
//           )}
//         </button>

//         {/* Offline indicator */}
//         {!isOnline && (
//           <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//             <WifiOff className="w-4 h-4" />
//             <span>{t.savedOffline}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Language } from "@/app/page"
import { ReportData } from "./villager-app"
import { toast } from "sonner"

import {
  MapPin,
  AlertCircle,
  Check,
  Edit2,
  X,
  Droplets,
  Bed,
  Building2,
  WifiOff,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmPageProps {
  language: Language
  isOnline: boolean
  reportData: ReportData
  onSubmit: () => void
  onEdit: () => void
}

const translations = {
  en: {
    title: "Confirm Details",
    village: "Village",
    symptoms: "Symptoms",
    advice: "Advice",
    submit: "Confirm & Submit",
    savedOffline: "Saved offline",
    edit: "Edit",
  },
}

const severityConfig = {
  mild: { label: "Mild", color: "bg-green-500 text-white" },
  moderate: { label: "Moderate", color: "bg-yellow-500 text-white" },
  severe: { label: "Severe", color: "bg-red-500 text-white" },
  critical: { label: "Critical", color: "bg-purple-600 text-white" },
}

const adviceIcons = [Droplets, Bed, Building2]

export function ConfirmPage({
  language,
  isOnline,
  reportData,
  onSubmit,
  onEdit,
}: ConfirmPageProps) {
  const t = translations["en"]

  const [symptoms, setSymptoms] = useState(reportData.symptoms)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptomToRemove))
  }

  // const handleSubmit = async () => {
  //   setIsSubmitting(true)
  //   await new Promise((resolve) => setTimeout(resolve, 1500))
  //   setIsSubmitting(false)
  //   onSubmit()
  // }

//   const handleSubmit = async () => {
//   setIsSubmitting(true)

//   try {
//     const res = await fetch("http://127.0.0.1:8000/report/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         village: reportData.village,
//         symptoms: symptoms,
//       }),
//     })

//     const data = await res.json()

//     if (res.ok) {
//       toast.success("Report saved successfully ✅")
//       onSubmit()
//     } else {
//       toast.error("Failed to save report ❌")
//     }

//   } catch (err) {
//     console.error(err)
//     toast.error("Server error. Try again ❌")
//   }

//   setIsSubmitting(false)
// }

const handleSubmit = async () => {
  setIsSubmitting(true)

  try {
    const res = await fetch("http://127.0.0.1:8000/report/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: reportData.lat,
        longitude: reportData.lon,
        symptoms: symptoms,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Report saved successfully ✅")
      onSubmit()
    } else {
      console.error(data)
      toast.error("Failed to save report ❌")
    }

  } catch (err) {
    console.error(err)
    toast.error("Server error ❌")
  }

  setIsSubmitting(false)
}

  const severity = severityConfig[reportData.severity]

  return (
    <div className="min-h-full px-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <Edit2 className="w-4 h-4" />
          {t.edit}
        </button>
      </div>

      <div className="space-y-5">

        {/* 📝 TRANSCRIPT (FROM SPEECH) */}
        <div className="bg-muted rounded-xl p-4 border">
          <p className="text-sm text-muted-foreground mb-1">Your Input</p>
          <p className="text-sm italic text-foreground">
            "{reportData.transcript}"
          </p>
        </div>

        {/* 📍 Village */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{t.village}</span>
          </div>
          <p className="text-lg font-semibold">
            {reportData.village}
          </p>
        </div>

        {/* 🧠 Symptoms (BLOCK UI) */}
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{t.symptoms}</span>
            </div>

            {/* Severity Badge */}
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                severity.color
              )}
            >
              {severity.label}
            </span>
          </div>

          {/* 🔥 BEAUTIFUL CARDS */}
          <div className="grid grid-cols-2 gap-3">
            {symptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-sm"
              >
                <span className="text-sm font-semibold text-blue-900">
                  {symptom}
                </span>

                <button
                  onClick={() => handleRemoveSymptom(symptom)}
                  className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-100 transition"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 💊 Advice */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t.advice}</p>

          {reportData.advice.map((advice, index) => {
            const Icon = adviceIcons[index] || AlertCircle

            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl border bg-muted/40"
              >
                <Icon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <p className="text-sm">{advice}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ✅ Submit */}
      <div className="mt-8 space-y-3">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 rounded-2xl bg-primary text-white flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              {t.submit}
            </>
          )}
        </button>

        {!isOnline && (
          <div className="flex justify-center gap-2 text-sm text-muted-foreground">
            <WifiOff className="w-4 h-4" />
            <span>{t.savedOffline}</span>
          </div>
        )}
      </div>
    </div>
  )
}