"use client"

import React, { useState, useEffect, useRef } from "react"

// Types
type Disease = {
  disease: string
  symptoms: string[]
  treatment: string[]
  probability?: number
}

type ChatMessage = {
  sender: "user" | "bot"
  message: string
}

export default function AIHealthBot() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [askedSymptoms, setAskedSymptoms] = useState<Set<string>>(new Set())
  const [currentSymptom, setCurrentSymptom] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [finished, setFinished] = useState<boolean>(false)
  const [result, setResult] = useState<Disease | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [chatHistory])

  useEffect(() => {
    fetch("/d.json")
      .then(res => res.json())
      .then((data: Disease[]) => setDiseases(data))
  }, [])

  const resetBot = () => {
    setAskedSymptoms(new Set())
    setCurrentSymptom(null)
    setAnswers({})
    setFinished(false)
    setResult(null)
    setChatHistory([])
    pickNextQuestion(diseases, {}, new Set())
  }

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false)
      resetBot()
    } else {
      setIsOpen(true)
      if (chatHistory.length === 0) {
        pickNextQuestion(diseases, {}, new Set())
      }
    }
  }

  const pickNextQuestion = (
    diseaseList: Disease[],
    answersMap: Record<string, boolean>,
    askedSet: Set<string>
  ) => {
    const symptomCounts: Record<string, number> = {}

    diseaseList.forEach(d => {
      d.symptoms.forEach(s => {
        if (!askedSet.has(s)) {
          symptomCounts[s] = (symptomCounts[s] || 0) + 1
        }
      })
    })

    if (Object.keys(symptomCounts).length === 0) {
      finishDiagnosis(diseaseList, answersMap)
      return
    }

    const total = diseaseList.length

    const next = Object.entries(symptomCounts)
      .sort((a, b) => Math.abs(total / 2 - a[1]) - Math.abs(total / 2 - b[1]))[0][0]

    setCurrentSymptom(next)

    setChatHistory(prev => [
      ...prev,
      { sender: "bot", message: `Hello! Do you have "${next}"?` }
    ])
  }

  const handleAnswer = (yes: boolean) => {
    if (!currentSymptom) return

    const newAnswers = { ...answers, [currentSymptom]: yes }

    setAnswers(newAnswers)
    setAskedSymptoms(new Set([...askedSymptoms, currentSymptom]))

    setChatHistory(prev => [
      ...prev,
      { sender: "user", message: yes ? "Yes" : "No" }
    ])

    pickNextQuestion(
      diseases,
      newAnswers,
      new Set([...askedSymptoms, currentSymptom])
    )
  }

  const finishDiagnosis = (
    diseaseList: Disease[],
    answersMap: Record<string, boolean>
  ) => {
    const scored: Disease[] = diseaseList.map(d => {
      const totalSymptoms = d.symptoms.length
      let matchCount = 0

      d.symptoms.forEach(s => {
        if (answersMap[s] === true) matchCount += 1
      })

      let noPenalty = 0
      d.symptoms.forEach(s => {
        if (answersMap[s] === false) noPenalty += 0.5
      })

      const probability = Math.max((matchCount - noPenalty) / totalSymptoms, 0)

      return { ...d, probability }
    })

    scored.sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))

    setResult(scored[0])
    setFinished(true)

    setChatHistory(prev => [
      ...prev,
      { sender: "bot", message: "Diagnosis completed!" }
    ])
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 text-white text-2xl shadow-lg hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
          <div className="bg-blue-600 text-white p-3 font-bold flex justify-between items-center">
            <span>AI Health Assistant</span>
            <button onClick={toggleChat} className="text-white text-xl font-bold">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {chatHistory.map((c, i) => (
              <div
                key={i}
                className={`my-2 flex ${c.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                    c.sender === "user"
                      ? "bg-green-200 text-green-900"
                      : "bg-blue-200 text-blue-900"
                  }`}
                >
                  {c.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {!finished && currentSymptom && (
            <div className="p-3 flex justify-center space-x-4 bg-gray-100">
              <button
                onClick={() => handleAnswer(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition"
              >
                No
              </button>
            </div>
          )}

          {finished && result && (
            <div className="p-3 bg-blue-100 text-blue-900">
              <p className="font-bold text-lg">{result.disease}</p>
              <p>Confidence: {(result.probability! * 100).toFixed(0)}%</p>
              <p>Suggested Medicines: {result.treatment.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}