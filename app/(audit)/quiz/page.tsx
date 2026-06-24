"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Quiz from "@/components/pages/health-score-quiz"
import { useHealthScore } from "@/context/HealthScoreContext"

export default function QuizPage() {
  const router = useRouter()
  const {
    name,
    email,
    activeSection,
    setActiveSection,
    answers,
    setAnswer,
    totalQuestions,
    answeredCount,
    sectionComplete,
  } = useHealthScore()

  React.useEffect(() => {
    if (!name.trim() || !email.trim()) {
      router.replace("/")
    }
  }, [name, email, router])

  const handleFinish = () => {
    router.replace("/results")
  }

  // The scrolling is now handled by the layout when the path changes,
  // but if the Quiz internally needs to scroll top on section change,
  // we can pass a no-op or window.scrollTo(0, 0)
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Quiz
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      answers={answers}
      totalQuestions={totalQuestions}
      answeredCount={answeredCount}
      setAnswer={setAnswer}
      sectionComplete={sectionComplete}
      onFinish={handleFinish}
      scrollTop={scrollTop}
    />
  )
}
