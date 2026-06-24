"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import Results from "@/components/pages/health-score-results"
import { useHealthScore } from "@/context/HealthScoreContext"

export default function ResultsPage() {
  const router = useRouter()
  const { name, club, results, resetState, answeredCount, totalQuestions } = useHealthScore()

  // If the user lands directly on /results without taking the quiz,
  // redirect them to /intro
  useEffect(() => {
    if (answeredCount < totalQuestions && totalQuestions > 0) {
      router.push("/")
    }
  }, [answeredCount, totalQuestions, router])

  const handleRestart = () => {
    resetState()
    router.push("/")
  }

  return (
    <Results
      name={name}
      club={club}
      results={results}
      onRestart={handleRestart}
    />
  )
}
