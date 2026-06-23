const SECTIONS = [
  {
    id: "staffing",
    name: "Staffing & Talent Engine",
    blurb: "Whether the operation can run without you in the building.",
    questions: [
      {
        q: "How stable and reliable is your current coaching and team structure?",
        low: "Constant turnover, unreliable",
        high: "Fully stable with depth and coverage",
      },
      {
        q: "How proactive is your hiring and talent pipeline?",
        low: "No pipeline, hire when desperate",
        high: "Always have qualified candidates ready",
      },
      {
        q: "How dependent is your operation on one or two key people?",
        low: "The whole business rides on 1–2 people",
        high: "Fully distributed and system-supported",
      },
      {
        q: "How clearly defined are roles, expectations, and accountability?",
        low: "Unclear and inconsistent",
        high: "Fully defined and consistently managed",
      },
    ],
  },
  {
    id: "conversion",
    name: "Lead Conversion Engine",
    blurb: "Leads are rarely the problem. What happens after they show up is.",
    questions: [
      {
        q: "How consistent is your weekly flow of new leads and players?",
        low: "No consistent flow",
        high: "Predictable and scalable",
      },
      {
        q: "How strong is your entry-level offer for new players (beginner / on-ramp)?",
        low: "No clear entry point",
        high: "Clear, compelling, and high-converting",
      },
      {
        q: "How consistent and fast is your follow-up with new leads?",
        low: "Rare or delayed",
        high: "Immediate and systemized",
      },
      {
        q: "How well do you track and understand your conversion rates?",
        low: "Not tracked, or bad reporting",
        high: "Fully tracked and optimized",
      },
    ],
  },
  {
    id: "court",
    name: "Court Utilization & Revenue Yield",
    blurb: "Money you already have access to, sitting in empty court time.",
    questions: [
      {
        q: "How effectively are your prime-time courts utilized?",
        low: "Frequently empty",
        high: "Fully optimized / waitlisted",
      },
      {
        q: "How predictable is your revenue per court?",
        low: "Unpredictable",
        high: "Highly predictable and optimized",
      },
      {
        q: "How actively do you manage your schedule mix (programs vs. open play)?",
        low: "Set-and-forget",
        high: "Actively optimized weekly",
      },
      {
        q: "How much unused or underperforming court time exists each week?",
        low: "Significant unused time",
        high: "Minimal to none",
      },
    ],
  },
  {
    id: "program",
    name: "Program & Experience Design",
    blurb: "Whether players know what to do next, and keep coming back.",
    questions: [
      {
        q: "How clearly do your programs guide player progression?",
        low: "No structure",
        high: "Clear, intentional progression",
      },
      {
        q: "How balanced and intentional is your program mix?",
        low: "One-dimensional",
        high: "Fully diversified and intentional",
      },
      {
        q: "How well do your programs drive repeat participation?",
        low: "One-off participation",
        high: "High frequency and habit-building",
      },
      {
        q: "How easy is it for a player to know what to do next?",
        low: "Confusing",
        high: "Seamless journey",
      },
    ],
  },
  {
    id: "retention",
    name: "Member Lifecycle & Retention",
    blurb: "Whether you can see, hold, and grow the members you already have.",
    questions: [
      {
        q: "How well do you track and monitor member engagement?",
        low: "Not tracked",
        high: "Fully tracked with insights",
      },
      {
        q: "How proactive are you at re-engaging inactive members?",
        low: "No system",
        high: "Automated and proactive",
      },
      {
        q: "How clearly defined is your pathway from trial to long-term member?",
        low: "No defined pathway",
        high: "Fully mapped and consistent",
      },
      {
        q: "How well do you understand and manage churn?",
        low: "No visibility",
        high: "Measured and actively reduced",
      },
    ],
  },
  {
    id: "systems",
    name: "Systems, Marketing & Leverage",
    blurb: "Whether the business runs on systems or on your willpower.",
    questions: [
      {
        q: "How integrated and effective are your systems (CRM, booking, etc.)?",
        low: "Disconnected or manual",
        high: "Fully integrated ecosystem",
      },
      {
        q: "How consistent is your marketing cadence (social, email, ads)?",
        low: "Inconsistent or nonexistent",
        high: "Structured and consistent",
      },
      {
        q: "How much of your operation depends on manual effort?",
        low: "Fully manual",
        high: "Highly systemized",
      },
      {
        q: "How often do you use data to guide decisions?",
        low: "Gut-based",
        high: "Data-driven consistently",
      },
    ],
  },
] as const

const WEIGHTS: Record<string, number> = {
  systems: 1.25,
  conversion: 1.15,
  court: 1.15,
  staffing: 1.1,
  retention: 1.0,
  program: 0.85,
}

const SCALE = [1, 2, 3, 4, 5]
export { SECTIONS, WEIGHTS, SCALE}