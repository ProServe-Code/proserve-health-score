
export function bandFor(pct: number) {
  if (pct >= 80)
    return {
      label: "Dialed In",
      color: "#2563eb",
      read:
        "Your club is running like a real business, not a hobby that got big. The systems are holding. From here the game is leverage — turning a strong operation into a second location, a higher ceiling, or more time out of the building.",
    }
  if (pct >= 60)
    return {
      label: "Solid, With Leaks",
      color: "#eab308",
      read:
        "You've built something good. The bones are there. But money and time are leaking through a few specific gaps, and you can feel it — you're still the one holding it together. Plug the lowest-scoring areas below and you free up both revenue and your own hours.",
    }
  if (pct >= 40)
    return {
      label: "Running on Willpower",
      color: "#f97316",
      read:
        "The business works because you work. Take a week off and things start to break. You're not short on effort or even on demand — you're short on the systems that let the place run without you. The good news: this is the most fixable stage there is.",
    }
  return {
    label: "You Are the Business",
    color: "#dc2626",
    read:
      "Right now, the club is you. Every decision, every fix, every fire comes back to your desk. That's exhausting and it caps how big this can get. None of this means you're doing it wrong — it means nobody's built the operating system yet. That's exactly what gets fixed first.",
  }
}
