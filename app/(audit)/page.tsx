"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import Intro from "@/components/pages/health-score-intro"
import { useHealthScore } from "@/context/HealthScoreContext"

export default function IntroPage() {
  const router = useRouter()
  const { name, club, email, setName, setClub, setEmail, totalQuestions, resetState } = useHealthScore()

  useEffect(() => {
    resetState()
  }, [resetState])

  const handleStart = async () => {
    try {
      const body = new URLSearchParams()
      body.append("first_name", name)
      body.append("fields[club_name]", club)
      body.append("email_address", email)
      
      // Kit API direct fetch
      await fetch("https://app.kit.com/forms/9597677/subscriptions", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: body.toString(),
      })
    } catch (err) {
      console.log("[v0] Kit submission failed:", err)
    }
    
    // Navigate to quiz
    router.push("/quiz")
  }

  return (
    <Intro
      name={name}
      club={club}
      email={email}
      setName={setName}
      setClub={setClub}
      setEmail={setEmail}
      totalQuestions={totalQuestions}
      onStart={handleStart}
    />
  )
}
