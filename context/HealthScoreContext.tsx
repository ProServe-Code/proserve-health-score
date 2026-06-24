"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from "react"
import { SECTIONS, WEIGHTS } from "@/constants/QuestionSections"

type Answers = Record<string, number>

interface SectionResult {
  id: string
  name: string
  raw: number
  max: number
  pct: number
  weight: number
}

interface Results {
  perSection: SectionResult[]
  overall: number
  weakest: SectionResult[]
  strongest: SectionResult
}

interface HealthScoreContextType {
  name: string
  setName: (val: string) => void
  club: string
  setClub: (val: string) => void
  email: string
  setEmail: (val: string) => void
  answers: Answers
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>
  activeSection: number
  setActiveSection: React.Dispatch<React.SetStateAction<number>>
  totalQuestions: number
  answeredCount: number
  setAnswer: (sid: string, qi: number, val: number) => void
  sectionComplete: (s: (typeof SECTIONS)[number]) => boolean
  results: Results
  resetState: () => void
}

const HealthScoreContext = createContext<HealthScoreContextType | undefined>(undefined)

export function HealthScoreProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("")
  const [club, setClub] = useState("")
  const [email, setEmail] = useState("")
  const [answers, setAnswers] = useState<Answers>({})
  const [activeSection, setActiveSection] = useState(0)

  const totalQuestions = useMemo(() => SECTIONS.reduce((n, s) => n + s.questions.length, 0), [])
  const answeredCount = Object.keys(answers).length

  const setAnswer = (sid: string, qi: number, val: number) =>
    setAnswers((a) => ({ ...a, [`${sid}-${qi}`]: val }))

  const sectionComplete = (s: (typeof SECTIONS)[number]) =>
    s.questions.every((_, qi) => answers[`${s.id}-${qi}`] != null)

  const results = useMemo(() => {
    const perSection = SECTIONS.map((s) => {
      const vals = s.questions.map((_, qi) => answers[`${s.id}-${qi}`] || 0)
      const raw = vals.reduce((a, b) => a + b, 0)
      const max = s.questions.length * 5
      return {
        id: s.id,
        name: s.name,
        raw,
        max,
        pct: Math.round((raw / max) * 100),
        weight: WEIGHTS[s.id as keyof typeof WEIGHTS],
      }
    })
    const weightedSum = perSection.reduce((a, s) => a + s.pct * s.weight, 0)
    const weightTotal = perSection.reduce((a, s) => a + s.weight, 0)
    const overall = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0
    const sorted = [...perSection].sort((a, b) => a.pct - b.pct)
    return {
      perSection,
      overall,
      weakest: sorted.slice(0, 2),
      strongest: sorted[sorted.length - 1],
    }
  }, [answers])

  const resetState = useCallback(() => {
    setName("")
    setClub("")
    setEmail("")
    setAnswers({})
    setActiveSection(0)
  }, [])

  return (
    <HealthScoreContext.Provider
      value={{
        name,
        setName,
        club,
        setClub,
        email,
        setEmail,
        answers,
        setAnswers,
        activeSection,
        setActiveSection,
        totalQuestions,
        answeredCount,
        setAnswer,
        sectionComplete,
        results,
        resetState,
      }}
    >
      {children}
    </HealthScoreContext.Provider>
  )
}

export function useHealthScore() {
  const context = useContext(HealthScoreContext)
  if (!context) {
    throw new Error("useHealthScore must be used within a HealthScoreProvider")
  }
  return context
}
