"use client"

import React, { useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { HealthScoreProvider, useHealthScore } from "@/context/HealthScoreContext"

function AuditLayoutContent({ children }: { children: React.ReactNode }) {
  const { answeredCount, totalQuestions } = useHealthScore()
  const pathname = usePathname()
  const topRef = useRef<HTMLDivElement>(null)

  // Scroll to top on route change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [pathname])

  const showProgress = pathname !== "/"

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
        {showProgress && (
          <div style={styles.progressWrap}>
            <div style={styles.progressLabel}>
              {answeredCount}/{totalQuestions}
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>

      {children}

      <footer style={styles.footer}>
        From <span style={styles.footerBrand}>ProServe</span> · Built for racquet
        club owners who want to run the business, not be the business.
      </footer>
    </div>
  )
}

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return (
    <HealthScoreProvider>
      <AuditLayoutContent>{children}</AuditLayoutContent>
    </HealthScoreProvider>
  )
}

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
