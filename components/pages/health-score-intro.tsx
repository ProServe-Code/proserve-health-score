import React, { useState, useRef } from "react"
import Bullet from "../ui/bullet"
interface IntroProps {
  name: string
  club: string
  email: string
  setName: (v: string) => void
  setClub: (v: string) => void
  setEmail: (v: string) => void
  totalQuestions: number
  onStart: () => void | Promise<void>
}

export default function Intro({
  name,
  club,
  email,
  setName,
  setClub,
  setEmail,
  totalQuestions,
  onStart,
}: IntroProps) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) {
      setError("Please enter your first name.")
      nameInputRef.current?.focus()
      return
    }
    if (name.trim().length > 50) {
      setError("First name cannot be more than 50 characters.")
      nameInputRef.current?.focus()
      return
    }
    const isNameValid = /^[a-zA-Z\s]+$/.test(name.trim())
    if (!isNameValid) {
      setError("First name cannot contain special characters or numbers.")
      nameInputRef.current?.focus()
      return
    }
    if (!club.trim()) {
      setError("Please enter your club name.")
      return
    }
    if (club.trim().length > 50) {
      setError("Club name cannot be more than 50 characters.")
      return
    }
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!isEmailValid) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    setIsSubmitting(true)
    try {
      await onStart()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    setTimeout(() => {
      nameInputRef.current?.focus()
    }, 500)
  }

  return (
    <main style={styles.introWrap} className="fade-up">
      <section style={styles.hero}>
        <div style={styles.kicker}>FOR PICKLEBALL & RACQUET CLUB OWNERS</div>
        <h1 style={styles.h1}>
          Pickleball is now a <span style={styles.h1mark}>$3B+ industry.</span>
          <br />
          So why isn&apos;t <span style={styles.h1blue}>your club</span> cashing
          in?
        </h1>
        <p style={styles.sub}>
          Pickleball is booming. Your club should be too. Take the 3-minute
          Racquet Club Health Score and find out exactly where the money&apos;s
          leaking — and the one fix that unlocks the rest.
        </p>

        <form onSubmit={handleSubmit} style={styles.formCard} ref={formRef}>
          <div className="form-grid">
            <div>
              <label style={styles.fieldLabel}>First Name</label>
              <input
                ref={nameInputRef}
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}
                placeholder="First name"
              />
            </div>
            <div>
              <label style={styles.fieldLabel}>Club Name</label>
              <input
                style={styles.input}
                value={club}
                onChange={(e) => setClub(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase())}
                placeholder="Your facility"
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={styles.fieldLabel}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourclub.com"
            />
          </div>
          {error && <div style={styles.errorText}>{error}</div>}
          <button type="submit" style={{ ...styles.ctaButton, opacity: isSubmitting ? 0.7 : 1 }} className="cta-btn" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : <>Get your Health Score&nbsp;&nbsp;→</>}
          </button>
          <div style={styles.ctaMeta}>
            {totalQuestions} questions · 3 minutes · No call required
          </div>
        </form>
      </section>

      <section style={styles.bullets}>
        <Bullet
          num="01"
          title="3 minutes, not 5 hours"
          text="Twenty-four questions across the six systems that decide whether your club runs on you or runs on its own. Built for owners who don't have time for another long-form thing."
        />
        <Bullet
          num="02"
          title="Built for racquet clubs specifically"
          text="Not generic small-business advice. The diagnostic is tuned to how pickleball and tennis clubs actually make money — court yield, off-peak monetization, program design, member lifecycle, the works."
        />
        <Bullet
          num="03"
          title="Just the read. No call. No pitch."
          text="You get a score, an area-by-area breakdown, and a written diagnosis the moment you finish. Nothing to schedule, nothing to sit through. If you want help after, the door's open. If not, you've got a clearer map either way."
        />
      </section>

      <section style={styles.proofStrip}>
        <div style={styles.proofTag}>WHO IT&apos;S FOR</div>
        <div style={styles.proofRow}>
          <div style={styles.proofItem}>Pickleball franchise owners</div>
          <div style={styles.proofDot}>·</div>
          <div style={styles.proofItem}>Independent racquet clubs</div>
          <div style={styles.proofDot}>·</div>
          <div style={styles.proofItem}>Tennis &amp; multi-sport facilities</div>
          <div style={styles.proofDot}>·</div>
          <div style={styles.proofItem}>Multi-location operators</div>
        </div>
      </section>

      <section style={styles.bottomCtaWrap}>
        <button
          style={{ ...styles.ctaButton, width: "auto" }}
          className="cta-btn"
          onClick={handleScrollToForm}
          type="button"
        >
          Get your Health Score&nbsp;&nbsp;→
        </button>
        <div style={styles.ctaMeta}>
          Built by Mike Manzella · 20+ years running racquet clubs
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  introWrap: { maxWidth: 880, margin: "0 auto" },
  hero: { paddingTop: 16, paddingBottom: 40, textAlign: "center" },
  kicker: {
    color: "var(--primary)",
    fontFamily:"var(--font-heading)",
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: 2.5,
    marginBottom: 24,
  },
  h1: {
    fontWeight: 800,
    fontSize: "3.4rem",
    lineHeight: 1.06,
    letterSpacing: -1.6,
    margin: "0 auto 22px",
    maxWidth: 760,
    color: "var(--heading-color)",
    fontFamily: "var(--font-heading)",
  },
  h1mark: {
    background:
      "linear-gradient(180deg, transparent 58%, var(--yellow) 58%, var(--yellow) 92%, transparent 92%)",
    paddingRight: 4,
  },
  h1blue: { color: "var(--primary)" },
  sub: {
    color: "var(--foreground)",
    fontSize: 18,
    lineHeight: 1.55,
    maxWidth: 580,
    margin: "0 auto 36px",
    fontFamily: "var(--font-sans)",
  },
  formCard: {
    maxWidth: 540,
    margin: "0 auto 40px",
    background: "var(--background)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    padding: "30px 32px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left",
  },
  fieldLabel: {
    fontSize: 12.5,
    color: "var(--foreground)",
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
    fontFamily: "var(--font-sans)",
  },
  input: {
    width: "100%",
    background: "var(--background)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--foreground)",
    fontSize: 15,
    fontFamily: "var(--font-sans)",
    transition: "border-color .15s ease, box-shadow .15s ease",
  },
  ctaButton: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    border: "none",
    borderRadius: 8,
    padding: "16px 32px",
    fontSize: 16.5,
    fontWeight: 700,
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 4px 14px rgba(0,161,156,.25)",
    marginTop: 8,
    display: "block",
    width: "100%",
  },
  ctaMeta: { color: "var(--body-color)", fontSize: 13.5, fontWeight: 500, textAlign: "center", marginTop: 6, fontFamily: "var(--font-sans)" },
  errorText: {
    color: "var(--destructive)",
    fontSize: 13,
    textAlign: "center",
    fontWeight: 600,
    marginTop: 4,
    fontFamily: "var(--font-sans)",
  },
  bullets: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
    marginTop: 24,
    marginBottom: 50,
  },
  proofStrip: {
    background: "var(--background)",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    padding: "20px 26px",
    marginBottom: 40,
    textAlign: "center",
  },
  proofTag: {
    color: "var(--foreground)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily: "var(--font-sans)",
  },
  proofRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    rowGap: 8,
  },
  proofItem: { fontWeight: 600, fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-sans)" },
  proofDot: { color: "var(--foreground)", fontWeight: 700 },
  bottomCtaWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
  },
}
