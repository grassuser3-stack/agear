# AdvisorAI — Design Brainstorm

## Three Stylistic Approaches

### Approach A — "Clinical Precision"
A sterile, medical-grade interface with sharp edges, monochromatic greys, and dense information density. Probability: 0.04

### Approach B — "Warm Intelligence"
A warm, human-first design with soft cream tones, generous whitespace, and subtle amber accents. Feels like a premium private bank. Probability: 0.08

### Approach C — "Structured Clarity"
A clean, editorial-inspired dashboard with a cool slate palette, crisp typography, and purposeful asymmetry. Feels like a Bloomberg Terminal crossed with a premium SaaS product. Probability: 0.06

---

## Chosen Approach: **B — Warm Intelligence**

### Design Movement
Premium Private Banking meets Modern SaaS — the warmth of a trusted advisor's office, the precision of a fintech product.

### Core Principles
1. **Warmth with authority** — cream/off-white backgrounds with deep navy and amber accents signal trust and expertise
2. **Information hierarchy without clutter** — one focal point per section, progressive disclosure for details
3. **AI as a collaborator** — AI suggestions are visually distinct (soft indigo/violet tint) but never intrusive
4. **Purposeful motion** — transitions reinforce context changes, not decorative

### Color Philosophy
- Background: `#FAFAF8` (warm off-white, not clinical white)
- Primary: `#1E3A5F` (deep navy — authority, trust)
- Accent: `#C8860A` (warm amber — highlights, CTAs, important actions)
- AI color: `#6366F1` (indigo — AI suggestions, always distinct)
- Transcript FA: `#1E3A5F` (navy — FA speech)
- Transcript Client: `#374151` (dark grey — client speech)
- Success: `#059669` (emerald)
- Alert: `#DC2626` (red — compliance alerts)

### Layout Paradigm
Left sidebar for navigation (fixed, narrow), main content area with generous padding. No full-width centered layouts. Cards use subtle shadows, not borders. Sidebar collapses to icons on smaller screens.

### Signature Elements
1. **AI Pulse** — a subtle animated indigo dot next to AI-generated content
2. **Status ribbons** — thin colored left-border on cards to indicate state (upcoming, active, done)
3. **Floating action zones** — contextual action buttons that appear on hover, reducing visual noise

### Interaction Philosophy
Every click should feel intentional. Hover states reveal depth. Modals slide in from the right (drawer pattern). Compliance alerts shake and pulse — urgency is communicated physically.

### Animation
- Page transitions: 200ms fade + slight upward translate
- Card hover: 150ms shadow elevation + 2px lift
- Compliance alert: shake keyframe (400ms) + red pulse ring
- AI suggestion appearance: 180ms fade-in from left with slight scale
- Sidebar: 250ms slide

### Typography System
- Display/Headers: `DM Serif Display` — elegant, authoritative
- Body/UI: `Inter` — clean, readable (used sparingly for body only)
- Monospace (transcription): `JetBrains Mono` — differentiates live text
- Scale: 12/14/16/20/24/32/40px

### Brand Essence
AdvisorAI — the intelligent copilot for financial advisors who care about every client relationship. Precise, warm, trustworthy.
Personality: **Precise. Empathetic. Unobtrusive.**

### Brand Voice
Headlines sound like a trusted colleague, not a tech product.
- "Your next meeting starts in 20 minutes. Here's what matters."
- "Anne turns 10 months old this week — a natural conversation opener."
Ban: "Welcome to AdvisorAI", "Get started today", "Leverage AI-powered insights"

### Wordmark & Logo
A stylized compass rose merged with a speech bubble — representing guidance and conversation. Navy on transparent background.

### Signature Brand Color
Deep Navy `#1E3A5F` — unmistakably AdvisorAI's.
