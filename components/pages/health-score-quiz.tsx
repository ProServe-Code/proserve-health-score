import React from "react"
import { SCALE, SECTIONS } from "@/constants/QuestionSections"

type Answers = Record<string, number>
interface QuizProps {
  activeSection: number
  setActiveSection: React.Dispatch<React.SetStateAction<number>>
  answers: Answers
  setAnswer: (sid: string, qi: number, val: number) => void
  sectionComplete: (s: (typeof SECTIONS)[number]) => boolean
  onFinish: () => void
  scrollTop: () => void
  totalQuestions: number
  answeredCount: number
}

export default function Quiz({
  activeSection,
  setActiveSection,
  answers,
  setAnswer,
  sectionComplete,
  onFinish,
  scrollTop,
  totalQuestions,
  answeredCount,
}: QuizProps) {
  const s = SECTIONS[activeSection]
  const isLast = activeSection === SECTIONS.length - 1
  const isCompleted = totalQuestions === answeredCount
  const complete = sectionComplete(s)


  const next = () => {
    if (isLast && !isCompleted) { return }
    if (isCompleted && isLast) onFinish()
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
                  onClick={() => {
                    setAnswer(s.id, qi, n);
                    window.scrollBy({ top: 200, behavior: "smooth" })
                  }}
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
          style={{ ...styles.ghostBtn, opacity: activeSection === 0 ? 0.4 : 1, ...(activeSection === 0 ? styles.ghostBtnDisabled : {}) }}
          onClick={prev}
          disabled={activeSection === 0}
        >
          ← Back
        </button>
        <button
          style={{ ...styles.cta, ...(!complete || (isLast && !isCompleted) ? styles.ctaDisabled : {}) }}
          onClick={next}
          disabled={!complete || (isLast && !isCompleted)}
          className={(isLast && !isCompleted) || complete ? "cta-btn" : ""}
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

const styles: Record<string, React.CSSProperties> = {
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
    borderRadius: 8,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "var(--border)",
    background: "var(--background)",
    color: "var(--foreground)",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    transition: "all .15s ease",
  },
  navDotActive: { borderColor: "var(--primary)", color: "var(--primary-foreground)", background: "var(--primary)" },
  navDotDone: { borderColor: "var(--primary)", color: "var(--primary)", background: "var(--accent)" },
  sectionHead: { marginBottom: 24 },
  sectionIndex: {
    color: "var(--primary)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 9,
  },
  h2: { fontWeight: 800, fontSize: "2rem", letterSpacing: -0.8, margin: "0 0 9px", color: "var(--heading-color)", fontFamily: "var(--font-heading)" },
  sectionBlurb: { color: "var(--foreground)", fontSize: 15.5, margin: 0, lineHeight: 1.5, fontFamily: "var(--font-sans)" },
  qCard: {
    background: "#FFFFFF",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    padding: "20px 22px 16px",
    marginBottom: 13,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  qText: { fontSize: 16, fontWeight: 600, lineHeight: 1.4, marginBottom: 16, color: "var(--heading-color)", fontFamily: "var(--font-heading)" },
  scaleRow: { display: "flex", gap: 9, marginBottom: 11 },
  scaleBtn: {
    flex: 1,
    padding: "14px 0",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--border)",
    background: "var(--accent)",
    color: "var(--body-color)",
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  scaleBtnActive: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    borderColor: "var(--primary)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 14px rgba(0,161,156,.25)",
  },
  anchorRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    fontSize: 12.5,
    color: "var(--foreground)",
    lineHeight: 1.35,
    fontFamily: "var(--font-sans)",
  },
  quizNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginTop: 22,
  },
  ghostBtn: {
    background: "#FFFFFF",
    border: "0.5px solid var(--border)",
    color: "var(--foreground)",
    borderRadius: 8,
    padding: "13px 22px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  ghostBtnDisabled: {
    cursor: "not-allowed"
  },
  helperNote: { color: "var(--foreground)", fontSize: 13, textAlign: "center", marginTop: 14, fontFamily: "var(--font-sans)" },
  cta: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    border: "none",
    borderRadius: 8,
    padding: "13px 26px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
  },
  ctaDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}
