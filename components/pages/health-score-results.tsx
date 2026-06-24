import React from "react"
import { bandFor } from "@/lib/utils"

export default function Results({
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
            Strongest area: <strong>{results.strongest.name}</strong> ({results.strongest.pct}%). Build from there.
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
        <a
          href="https://calendly.com/mike-proservesolutions/club-health-score-diagnostic"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.ctaWhite, display: "inline-block", textDecoration: "none" }}
          className="cta-btn"
        >
          Book a call with Mike →
        </a>
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

const styles: Record<string, React.CSSProperties> = {
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
}
