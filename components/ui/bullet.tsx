import React from "react"

const styles: Record<string, React.CSSProperties> = {
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
}

interface BulletProps {
  num: string
  title: string
  text: string
}

export default function Bullet({ num, title, text }: BulletProps) {
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
