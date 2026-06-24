import React from "react"

const styles: Record<string, React.CSSProperties> = {
  bulletItem: {
    background: "#FFFFFF",
    border: "0.5px solid var(--border)",
    borderRadius: 8,
    padding: "22px 22px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  bulletNum: {
    color: "#00A19C",
    fontSize: 12.5,
    fontWeight: 800,
    letterSpacing: 1.5,
    marginBottom: 10,
    fontFamily: "var(--font-sans)",
  },
  bulletTitle: {
    fontWeight: 800,
    fontSize: 16,
    marginBottom: 8,
    color: "#000000",
    fontFamily: "var(--font-heading)",
  },
  bulletText: { color: "var(--foreground)", fontSize: 14.5, lineHeight: 1.55, fontFamily: "var(--font-sans)" },
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
