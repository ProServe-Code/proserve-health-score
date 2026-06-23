"use client"

import { SCALE, SECTIONS, WEIGHTS } from "@/constants/QuestionSections"
import { bandFor } from "@/lib/utils"
import React, { useState, useMemo, useRef } from "react"

// ============================================================
// ProServe Health Score — Racquet Club Ops & Growth Audit
// A diagnostic for racquet club owners & franchisees.
// Built for Mike Manzella / Baseline.
// Light theme, modeled on the ThatPickleballSchool layout.

const PREVIEW = [
  { name: "Systems & Leverage", color: "#2563eb", pct: 35 },
  { name: "Court Yield", color: "#1e3a8a", pct: 30 },
  { name: "Lead Conversion", color: "#eab308", pct: 20 },
  { name: "Retention", color: "#93c5fd", pct: 15 },
]

type Answers = Record<string, number>

export default function HealthScoreAudit() {
  const [stage, setStage] = useState<"intro" | "quiz" | "results">("intro")
  const [name, setName] = useState("")
  const [club, setClub] = useState("")
  const [email, setEmail] = useState("")
  const [answers, setAnswers] = useState<Answers>({})
  const [activeSection, setActiveSection] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)

  const totalQuestions = SECTIONS.reduce((n, s) => n + s.questions.length, 0)
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
        weight: WEIGHTS[s.id],
      }
    })
    const weightedSum = perSection.reduce((a, s) => a + s.pct * s.weight, 0)
    const weightTotal = perSection.reduce((a, s) => a + s.weight, 0)
    const overall = Math.round(weightedSum / weightTotal)
    const sorted = [...perSection].sort((a, b) => a.pct - b.pct)
    return {
      perSection,
      overall,
      weakest: sorted.slice(0, 2),
      strongest: sorted[sorted.length - 1],
    }
  }, [answers])

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  return (
    <div style={styles.root} ref={topRef}>
      <style>{css}</style>

      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>PS</div>
          <div>
            <div style={styles.brandName}>ProServe</div>
            <div style={styles.brandSub}>Racquet Club Ops &amp; Growth Audit</div>
          </div>
        </div>
        {stage !== "intro" && (
          <div style={styles.progressWrap}>
            <div style={styles.progressLabel}>
              {answeredCount}/{totalQuestions}
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(answeredCount / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {stage === "intro" && (
        <Intro
          name={name}
          club={club}
          email={email}
          setName={setName}
          setClub={setClub}
          setEmail={setEmail}
          totalQuestions={totalQuestions}
          onStart={async () => {
            try {
              const body = new URLSearchParams()
              body.append("first_name", name)
              body.append("fields[club_name]", club)
              body.append("email_address", email)
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
            setStage("quiz")
            scrollTop()
          }}
        />
      )}

      {stage === "quiz" && (
        <Quiz
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          answers={answers}
          setAnswer={setAnswer}
          sectionComplete={sectionComplete}
          onFinish={() => {
            setStage("results")
            scrollTop()
          }}
          scrollTop={scrollTop}
        />
      )}

      {stage === "results" && (
        <Results
          name={name}
          club={club}
          results={results}
          onRestart={() => {
            setAnswers({})
            setActiveSection(0)
            setStage("intro")
            scrollTop()
          }}
        />
      )}

      <footer style={styles.footer}>
        From <span style={styles.footerBrand}>ProServe</span> · Built for racquet
        club owners who want to run the business, not be the business.
      </footer>
    </div>
  )
}

function Intro({
  name,
  club,
  email,
  setName,
  setClub,
  setEmail,
  totalQuestions,
  onStart,
}: {
  name: string
  club: string
  email: string
  setName: (v: string) => void
  setClub: (v: string) => void
  setEmail: (v: string) => void
  totalQuestions: number
  onStart: () => void
}) {
  const [error, setError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) {
      setError("Please enter your first name.")
      nameInputRef.current?.focus()
      return
    }
    if (!club.trim()) {
      setError("Please enter your club name.")
      return
    }
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!isEmailValid) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    onStart()
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
          Pickleball is now a <span style={styles.h1mark}>$1B industry.</span>
          <br />
          So why isn&apos;t <span style={styles.h1blue}>your club</span> cashing
          in?
        </h1>
        <p style={styles.sub}>
          Pickleball is booming. Your club should be too. Take the 5-minute
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
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
            </div>
            <div>
              <label style={styles.fieldLabel}>Club Name</label>
              <input
                style={styles.input}
                value={club}
                onChange={(e) => setClub(e.target.value)}
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
          <button type="submit" style={styles.ctaButton} className="cta-btn">
            Get your Health Score&nbsp;&nbsp;→
          </button>
          <div style={styles.ctaMeta}>
            {totalQuestions} questions · 5 minutes · No call required
          </div>
        </form>
      </section>

      <section style={styles.bullets}>
        <Bullet
          num="01"
          title="5 minutes, not 5 hours"
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

function Bullet({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div style={styles.bulletItem}>
      <div style={styles.bulletNum}>{num}</div>
      <div>
        <div style={styles.bulletTitle}>{title}</div>
        <div style={styles.bulletText}>{text}</div>
      </div>
    </div>
  )
}

function Quiz({
  activeSection,
  setActiveSection,
  answers,
  setAnswer,
  sectionComplete,
  onFinish,
  scrollTop,
}: {
  activeSection: number
  setActiveSection: React.Dispatch<React.SetStateAction<number>>
  answers: Answers
  setAnswer: (sid: string, qi: number, val: number) => void
  sectionComplete: (s: (typeof SECTIONS)[number]) => boolean
  onFinish: () => void
  scrollTop: () => void
}) {
  const s = SECTIONS[activeSection]
  const isLast = activeSection === SECTIONS.length - 1
  const complete = sectionComplete(s)

  const next = () => {
    if (isLast) onFinish()
    else {
      setActiveSection((i) => i + 1)
      scrollTop()
    }
  }
  const prev = () => {
    setActiveSection((i) => Math.max(0, i - 1))
    scrollTop()
  }

  return (
    <main style={styles.quiz} className="fade-up" key={s.id}>
      <div style={styles.sectionNav}>
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => {
              setActiveSection(i)
              scrollTop()
            }}
            style={{
              ...styles.navDot,
              ...(i === activeSection ? styles.navDotActive : {}),
              ...(sectionComplete(sec) && i !== activeSection
                ? styles.navDotDone
                : {}),
            }}
            title={sec.name}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={styles.sectionHead}>
        <div style={styles.sectionIndex}>
          AREA {activeSection + 1} OF {SECTIONS.length}
        </div>
        <h2 style={styles.h2}>{s.name}</h2>
        <p style={styles.sectionBlurb}>{s.blurb}</p>
      </div>

      {s.questions.map((item, qi) => {
        const key = `${s.id}-${qi}`
        const val = answers[key]
        return (
          <div key={key} style={styles.qCard}>
            <div style={styles.qText}>{item.q}</div>
            <div style={styles.scaleRow}>
              {SCALE.map((n) => (
                <button
                  key={n}
                  onClick={() => setAnswer(s.id, qi, n)}
                  className="scale-btn"
                  style={{
                    ...styles.scaleBtn,
                    ...(val === n ? styles.scaleBtnActive : {}),
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div style={styles.anchorRow}>
              <span>{item.low}</span>
              <span style={{ textAlign: "right" }}>{item.high}</span>
            </div>
          </div>
        )
      })}

      <div style={styles.quizNav}>
        <button
          style={{ ...styles.ghostBtn, opacity: activeSection === 0 ? 0.4 : 1 }}
          onClick={prev}
          disabled={activeSection === 0}
        >
          ← Back
        </button>
        <button
          style={{ ...styles.cta, ...(complete ? {} : styles.ctaDisabled) }}
          onClick={next}
          disabled={!complete}
          className={complete ? "cta-btn" : ""}
        >
          {isLast ? "See my Health Score →" : "Next area →"}
        </button>
      </div>
      {!complete && (
        <div style={styles.helperNote}>
          Answer all four to continue. There are no wrong answers — be honest.
        </div>
      )}
    </main>
  )
}

function Results({
  name,
  club,
  results,
  onRestart,
}: {
  name: string
  club: string
  results: {
    perSection: { id: string; name: string; pct: number }[]
    overall: number
    weakest: { id: string; name: string; pct: number }[]
    strongest?: { id: string; name: string; pct: number }
  }
  onRestart: () => void
}) {
  const band = bandFor(results.overall)
  const heading = club ? club : "Your club"

  return (
    <main style={styles.results} className="fade-up">
      <div style={styles.scoreHero} className="score-hero">
        <ScoreRing pct={results.overall} color={band.color} />
        <div style={styles.scoreHeroText}>
          <div style={styles.resultKicker}>
            {name ? `${name}, here's your read` : "Your read"}
          </div>
          <h1 style={styles.resultH1}>
            {heading} scored{" "}
            <span style={{ color: band.color }}>{results.overall}</span>
            <span style={styles.scoreOutOf}>/100</span>
          </h1>
          <div
            style={{
              ...styles.bandBadge,
              color: band.color,
              borderColor: band.color,
              background: `${band.color}14`,
            }}
          >
            {band.label}
          </div>
          <p style={styles.resultRead}>{band.read}</p>
        </div>
      </div>

      <div style={styles.breakdownHead}>Your ranking by area</div>
      <div style={styles.breakdown}>
        {results.perSection.map((s) => {
          const b = bandFor(s.pct)
          return (
            <div key={s.id} style={styles.barRow}>
              <span style={{ ...styles.previewDot, background: b.color }} />
              <div style={styles.barLabel}>{s.name}</div>
              <div style={styles.barTrack}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${s.pct}%`,
                    background: b.color,
                  }}
                />
              </div>
              <div style={{ ...styles.barPct, color: b.color }}>{s.pct}%</div>
            </div>
          )
        })}
      </div>

      <div style={styles.focusCard}>
        <div style={styles.focusKicker}>WHERE TO START</div>
        <p style={styles.focusLede}>
          Your two lowest-scoring areas are where the most time and money are
          leaking right now. Fix these first — everything else gets easier.
        </p>
        <div style={styles.focusGrid}>
          {results.weakest.map((w) => (
            <div key={w.id} style={styles.focusItem}>
              <div style={styles.focusItemScore}>{w.pct}%</div>
              <div style={styles.focusItemName}>{w.name}</div>
            </div>
          ))}
        </div>
        {results.strongest && (
          <div style={styles.strengthNote}>
            Strongest area: <strong>{results.strongest.name}</strong> (
            {results.strongest.pct}%). Build from there.
          </div>
        )}
      </div>

      <div style={styles.ctaCard}>
        <h3 style={styles.ctaCardTitle}>Want to turn this score into a plan?</h3>
        <p style={styles.ctaCardText}>
          {
            "This is the same diagnostic I run with the owners I work with across the country. On a quick call I'll walk through your results and show you exactly what I'd fix first — no pitch, just the read."
          }
        </p>
        <button style={styles.ctaWhite} className="cta-btn">
          Book a call with Mike →
        </button>
        <button style={styles.restartBtn} onClick={onRestart}>
          Retake the audit
        </button>
      </div>
    </main>
  )
}

function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const r = 72
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div style={styles.ringWrap}>
      <svg width="184" height="184" viewBox="0 0 184 184">
        <circle cx="92" cy="92" r={r} fill="none" stroke="#e8edf5" strokeWidth="13" />
        <circle
          cx="92"
          cy="92"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 92 92)"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }}
        />
        <text x="92" y="90" textAnchor="middle" fontSize="46" fontWeight="800" fill="#0c1722" fontFamily="Georgia, serif">
          {pct}
        </text>
        <text x="92" y="116" textAnchor="middle" fontSize="12" fill="#8493a5" letterSpacing="2">
          / 100
        </text>
      </svg>
    </div>
  )
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
:root{
  --ink:#0c1722; --ink-soft:#5a6b7c; --hint:#8493a5;
  --blue:#2563eb; --blue-dk:#1e3a8a; --yellow:#facc15;
  --bg:#f5f7fa; --surface:#ffffff; --line:#e4e9f0;
  --font:'Plus Jakarta Sans',system-ui,sans-serif;
}
*{box-sizing:border-box;}
.fade-up{animation:fadeUp .5s cubic-bezier(.2,.8,.2,1) both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
.cta-btn{transition:transform .15s ease, box-shadow .15s ease, filter .15s ease;}
.cta-btn:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 12px 28px rgba(37,99,235,.25);}
.scale-btn{transition:transform .12s ease, background .15s ease, border-color .15s ease, color .15s ease;}
.scale-btn:hover{transform:translateY(-2px);border-color:var(--blue);}
input:focus{outline:none;border-color:var(--blue)!important;box-shadow:0 0 0 3px rgba(37,99,235,.12);}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 580px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width:720px) {
  .score-hero{flex-direction:column!important;text-align:center!important;align-items:center!important;}
}
`

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "var(--bg)",
    color: "var(--ink)",
    fontFamily: "var(--font)",
    minHeight: "100vh",
    padding: "0 20px 56px",
  },
  header: {
    maxWidth: 880,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 0 18px",
    gap: 20,
  },
  brandRow: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 11,
    background: "var(--blue)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontFamily: "Georgia, serif",
    fontSize: 18,
  },
  brandName: { fontWeight: 800, fontSize: 18, lineHeight: 1, color: "var(--ink)" },
  brandSub: { color: "var(--ink-soft)", fontSize: 12.5, marginTop: 3 },
  progressWrap: { display: "flex", alignItems: "center", gap: 10, minWidth: 150 },
  progressLabel: {
    fontSize: 12,
    color: "var(--ink-soft)",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    background: "var(--line)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "var(--blue)",
    borderRadius: 99,
    transition: "width .4s ease",
  },

  introWrap: { maxWidth: 880, margin: "0 auto" },
  hero: { paddingTop: 56, paddingBottom: 40, textAlign: "center" },
  kicker: {
    color: "var(--blue)",
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
  },
  h1mark: {
    background:
      "linear-gradient(180deg, transparent 58%, var(--yellow) 58%, var(--yellow) 92%, transparent 92%)",
    paddingRight: 4,
  },
  h1blue: { color: "var(--blue)" },
  sub: {
    color: "var(--ink-soft)",
    fontSize: 18,
    lineHeight: 1.55,
    maxWidth: 580,
    margin: "0 auto 36px",
  },
  formCard: {
    maxWidth: 540,
    margin: "0 auto 40px",
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 20,
    padding: "30px 32px",
    boxShadow: "0 10px 35px rgba(12,23,34,.05)",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left",
  },
  fieldLabel: {
    fontSize: 12.5,
    color: "var(--ink-soft)",
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    background: "#fff",
    border: "1px solid var(--line)",
    borderRadius: 11,
    padding: "12px 14px",
    color: "var(--ink)",
    fontSize: 15,
    fontFamily: "var(--font)",
    transition: "border-color .15s ease, box-shadow .15s ease",
  },
  ctaButton: {
    background: "var(--blue)",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "16px 32px",
    fontSize: 16.5,
    fontWeight: 700,
    fontFamily: "var(--font)",
    cursor: "pointer",
    textAlign: "center",
    boxShadow: "0 8px 22px rgba(37,99,235,.22)",
    marginTop: 8,
    display: "block",
    width: "100%",
  },
  ctaMeta: { color: "var(--hint)", fontSize: 13.5, fontWeight: 500, textAlign: "center", marginTop: 6 },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    textAlign: "center",
    fontWeight: 600,
    marginTop: 4,
  },
  bullets: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
    marginTop: 24,
    marginBottom: 50,
  },
  bulletItem: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "22px 22px 20px",
    boxShadow: "0 2px 10px rgba(12,23,34,.03)",
  },
  bulletNum: {
    color: "var(--blue)",
    fontSize: 12.5,
    fontWeight: 800,
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: "Georgia, serif",
  },
  bulletTitle: {
    fontWeight: 800,
    fontSize: 16,
    marginBottom: 8,
    color: "var(--ink)",
  },
  bulletText: { color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.55 },
  proofStrip: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "20px 26px",
    marginBottom: 40,
    textAlign: "center",
  },
  proofTag: {
    color: "var(--hint)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 12,
  },
  proofRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    rowGap: 8,
  },
  proofItem: { fontWeight: 600, fontSize: 14, color: "var(--ink)" },
  proofDot: { color: "var(--hint)", fontWeight: 700 },
  bottomCtaWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
  },

  quiz: { maxWidth: 720, margin: "0 auto", paddingTop: 6 },
  sectionNav: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginBottom: 28,
    flexWrap: "wrap",
  },
  navDot: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--line)",
    background: "var(--surface)",
    color: "var(--ink-soft)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "var(--font)",
    transition: "all .15s ease",
  },
  navDotActive: { borderColor: "var(--blue)", color: "#fff", background: "var(--blue)" },
  navDotDone: { borderColor: "#bfdbfe", color: "var(--blue)", background: "#eff6ff" },
  sectionHead: { marginBottom: 24 },
  sectionIndex: {
    color: "var(--blue)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 9,
  },
  h2: { fontWeight: 800, fontSize: "2rem", letterSpacing: -0.8, margin: "0 0 9px" },
  sectionBlurb: { color: "var(--ink-soft)", fontSize: 15.5, margin: 0, lineHeight: 1.5 },
  qCard: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 16,
    padding: "20px 22px 16px",
    marginBottom: 13,
    boxShadow: "0 2px 10px rgba(12,23,34,.03)",
  },
  qText: { fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 16 },
  scaleRow: { display: "flex", gap: 9, marginBottom: 11 },
  scaleBtn: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 11,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--line)",
    background: "#f8fafc",
    color: "var(--ink)",
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
  scaleBtnActive: {
    background: "var(--blue)",
    color: "#fff",
    borderColor: "var(--blue)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 20px rgba(37,99,235,.28)",
  },
  anchorRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    fontSize: 12.5,
    color: "var(--ink-soft)",
    lineHeight: 1.35,
  },
  quizNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginTop: 22,
  },
  ghostBtn: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
    borderRadius: 99,
    padding: "13px 22px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font)",
  },
  helperNote: { color: "var(--ink-soft)", fontSize: 13, textAlign: "center", marginTop: 14 },

  results: { maxWidth: 720, margin: "0 auto", paddingTop: 10 },
  scoreHero: {
    display: "flex",
    gap: 32,
    alignItems: "center",
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 20,
    padding: 30,
    marginBottom: 28,
    boxShadow: "0 8px 30px rgba(12,23,34,.06)",
  },
  ringWrap: { flexShrink: 0 },
  scoreHeroText: { flex: 1 },
  resultKicker: {
    color: "var(--blue)",
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 12,
  },
  resultH1: {
    fontWeight: 800,
    fontSize: "1.9rem",
    letterSpacing: -0.8,
    margin: "0 0 14px",
    lineHeight: 1.15,
  },
  scoreOutOf: { color: "var(--hint)", fontSize: "1.1rem", fontWeight: 600 },
  bandBadge: {
    display: "inline-block",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderRadius: 99,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 700,
  },
  resultRead: { color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6, margin: "16px 0 0" },
  breakdownHead: {
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 1.5,
    color: "var(--hint)",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  breakdown: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 18,
    padding: "10px 22px",
    marginBottom: 28,
    boxShadow: "0 2px 10px rgba(12,23,34,.03)",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    padding: "13px 0",
    borderBottom: "1px solid var(--line)",
  },
  barLabel: { flex: "0 0 190px", fontSize: 14.5, fontWeight: 600 },
  barTrack: { flex: 1, height: 9, background: "#eef2f8", borderRadius: 99, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 99, transition: "width 1s cubic-bezier(.2,.8,.2,1)" },
  barPct: {
    flex: "0 0 42px",
    textAlign: "right",
    fontWeight: 800,
    fontFamily: "Georgia, serif",
    fontSize: 16,
    fontVariantNumeric: "tabular-nums",
  },

  focusCard: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 20,
    padding: 26,
    marginBottom: 22,
  },
  focusKicker: { color: "#a16207", fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 11 },
  focusLede: { color: "#854d0e", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" },
  focusGrid: { display: "flex", gap: 14, flexWrap: "wrap" },
  focusItem: {
    flex: "1 1 200px",
    background: "#fff",
    border: "1px solid #fde68a",
    borderRadius: 14,
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: 15,
  },
  focusItemScore: { fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 30, color: "#d97706", lineHeight: 1 },
  focusItemName: { fontSize: 14.5, fontWeight: 600, lineHeight: 1.3, color: "var(--ink)" },
  strengthNote: { marginTop: 18, fontSize: 14, color: "#854d0e", paddingTop: 16, borderTop: "1px solid #fde68a" },

  ctaCard: { background: "var(--blue)", borderRadius: 20, padding: 32, textAlign: "center", color: "#fff" },
  ctaCardTitle: { fontWeight: 800, fontSize: "1.6rem", margin: "0 0 12px", letterSpacing: -0.4 },
  ctaCardText: { fontSize: 15.5, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 22px", color: "#dbeafe" },
  ctaWhite: {
    background: "#fff",
    color: "var(--blue)",
    border: "none",
    borderRadius: 99,
    padding: "14px 28px",
    fontSize: 15.5,
    fontWeight: 700,
    fontFamily: "var(--font)",
    cursor: "pointer",
  },
  restartBtn: {
    display: "block",
    margin: "16px auto 0",
    background: "transparent",
    border: "none",
    color: "#bfdbfe",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "var(--font)",
  },

  footer: {
    maxWidth: 720,
    margin: "46px auto 0",
    textAlign: "center",
    color: "var(--hint)",
    fontSize: 12.5,
    lineHeight: 1.6,
    paddingTop: 22,
    borderTop: "1px solid var(--line)",
  },
  footerBrand: { color: "var(--blue)", fontWeight: 700 },
}
