import React, { useState } from "react";
import "./App.css"
// ============================================================
// ProServe / Baseline — Founders Launch Landing Page
// Headline-driven, two-step opt-in to the Health Score assessment.
// ============================================================
export default function App() {
  const [stage, setStage] = useState("hero"); // hero | email | done
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleStart = () => setStage("email");
  const handleSubmit = (e) => {
    e?.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setError("Enter a valid email so we can send your score.");
      return;
    }
    setError("");
    setStage("done");
    // In production: POST to email provider + redirect to assessment.
  };
  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark}>PS</div>
          <div>
            <div style={styles.brandName}>ProServe</div>
            <div style={styles.brandSub}>Built for racquet club owners</div>
          </div>
        </div>
      </header>
      <main style={styles.main}>
        <section style={styles.hero} className="fade-up">
          <div style={styles.kicker}>FOR PICKLEBALL & RACQUET CLUB OWNERS</div>
          <h1 style={styles.h1}>
            Pickleball is now a{" "}
            <span style={styles.h1mark}>$1B industry.</span>
            <br />
            So why isn't <span style={styles.h1blue}>your club</span>{" "}
            cashing in?
          </h1>
          <p style={styles.sub}>
            Pickleball is booming. Your club should be too. Take the 5-minute
            Racquet Club Health Score and find out exactly where the money's
            leaking — and the one fix that unlocks the rest.
          </p>
          {stage === "hero" && (
            <div style={styles.ctaWrap}>
              <button
                style={styles.cta}
                className="cta-btn"
                onClick={handleStart}
              >
                Get your Health Score&nbsp;&nbsp;→
              </button>
              <div style={styles.ctaMeta}>
                24 questions · 5 minutes · No call required
              </div>
            </div>
          )}
          {stage === "email" && (
            <form
              style={styles.emailForm}
              onSubmit={handleSubmit}
              className="fade-up"
            >
              <div style={styles.emailRow}>
                <input
                  type="email"
                  style={styles.emailInput}
                  placeholder="you@yourclub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  style={styles.emailBtn}
                  className="cta-btn"
                >
                  Start the audit →
                </button>
              </div>
              {error && <div style={styles.errorText}>{error}</div>}
              <div style={styles.emailMeta}>
                We'll send your score and a short read on where to start. No
                spam. Unsubscribe anytime.
              </div>
            </form>
          )}
          {stage === "done" && (
            <div style={styles.doneCard} className="fade-up">
              <div style={styles.doneCheck}>✓</div>
              <div>
                <div style={styles.doneTitle}>You're in. Check your inbox.</div>
                <div style={styles.doneText}>
                  We just sent a link to start your Health Score. Most owners
                  finish in under 5 minutes.
                </div>
              </div>
            </div>
          )}
        </section>
        <section style={styles.bullets} className="fade-up">
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
        <section style={styles.proofStrip} className="fade-up">
          <div style={styles.proofTag}>WHO IT'S FOR</div>
          <div style={styles.proofRow}>
            <div style={styles.proofItem}>Pickleball franchise owners</div>
            <div style={styles.proofDot}>·</div>
            <div style={styles.proofItem}>Independent racquet clubs</div>
            <div style={styles.proofDot}>·</div>
            <div style={styles.proofItem}>Tennis & multi-sport facilities</div>
            <div style={styles.proofDot}>·</div>
            <div style={styles.proofItem}>Multi-location operators</div>
          </div>
        </section>
        {stage === "hero" && (
          <section style={styles.bottomCtaWrap}>
            <button
              style={styles.cta}
              className="cta-btn"
              onClick={handleStart}
            >
              Get your Health Score&nbsp;&nbsp;→
            </button>
            <div style={styles.ctaMeta}>
              Built by Mike Manzella · 20+ years running racquet clubs
            </div>
          </section>
        )}
      </main>
      <footer style={styles.footer}>
        © ProServe · <a style={styles.footerLink} href="#">Privacy</a> ·{" "}
        <a style={styles.footerLink} href="#">Terms</a>
      </footer>
    </div>
  );
}
function Bullet({ num, title, text }) {
  return (
    <div style={styles.bulletItem}>
      <div style={styles.bulletNum}>{num}</div>
      <div>
        <div style={styles.bulletTitle}>{title}</div>
        <div style={styles.bulletText}>{text}</div>
      </div>
    </div>
  );
}
const styles = {
  root: {
    background: "var(--bg)",
    color: "var(--ink)",
    fontFamily: "var(--font)",
    minHeight: "100vh",
    padding: "0 20px 50px",
  },
  header: {
    maxWidth: 880,
    margin: "0 auto",
    padding: "24px 0 18px",
    display: "flex",
    alignItems: "center",
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
  main: { maxWidth: 880, margin: "0 auto" },
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
  ctaWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  cta: {
    background: "var(--blue)",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "17px 34px",
    fontSize: 16.5,
    fontWeight: 700,
    fontFamily: "var(--font)",
    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(37,99,235,.22)",
  },
  ctaMeta: { color: "var(--hint)", fontSize: 13.5, fontWeight: 500 },
  emailForm: {
    maxWidth: 520,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  emailRow: {
    display: "flex",
    gap: 8,
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 99,
    padding: 6,
    boxShadow: "0 8px 28px rgba(12,23,34,.08)",
  },
  emailInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "12px 18px",
    fontSize: 15.5,
    fontFamily: "var(--font)",
    color: "var(--ink)",
  },
  emailBtn: {
    background: "var(--blue)",
    color: "#fff",
    border: "none",
    borderRadius: 99,
    padding: "12px 22px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "var(--font)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emailMeta: { color: "var(--hint)", fontSize: 13, textAlign: "center" },
  errorText: { color: "#dc2626", fontSize: 13, textAlign: "center", fontWeight: 600 },
  doneCard: {
    maxWidth: 480,
    margin: "0 auto",
    background: "var(--surface)",
    border: "1px solid #bbf7d0",
    borderRadius: 16,
    padding: "20px 22px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    textAlign: "left",
    boxShadow: "0 8px 28px rgba(12,23,34,.06)",
  },
  doneCheck: {
    width: 40,
    height: 40,
    borderRadius: 99,
    background: "#16a34a",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    fontWeight: 800,
    flexShrink: 0,
  },
  doneTitle: { fontWeight: 800, fontSize: 16, marginBottom: 3 },
  doneText: { color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.5 },
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
  bulletTitle: { fontWeight: 800, fontSize: 16, marginBottom: 8, color: "var(--ink)" },
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
  footer: {
    maxWidth: 880,
    margin: "40px auto 0",
    textAlign: "center",
    color: "var(--hint)",
    fontSize: 12.5,
    paddingTop: 22,
    borderTop: "1px solid var(--line)",
  },
  footerLink: { color: "var(--hint)", textDecoration: "underline" },
};
