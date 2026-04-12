# Wireframes (low fidelity)

Goal: lock hierarchy, one primary CTA, card structure. Visual design comes later; direction: clean, premium, mobile-first.

## Global patterns

- Top: short screen title (optional back control).
- Center: one card or a vertical stack of cards with generous spacing.
- Bottom: one primary button; secondary actions as text links or outline — must not compete with primary.

---

## Auth

### Sign up

```
┌─────────────────────────┐
│  NOETERA (logo/text)    │
│                         │
│  Create account         │
│  [ Email            ]   │
│  [ Password         ]   │
│  [ Confirm password ]   │
│                         │
│  [ Sign up          ]   │  ← primary
│  Already have account?  │
└─────────────────────────┘
```

### Login

```
┌─────────────────────────┐
│  Sign in                │
│  [ Email            ]   │
│  [ Password         ]   │
│                         │
│  [ Sign in          ]   │  ← primary
│  Forgot password?       │
│  No account? Sign up    │
└─────────────────────────┘
```

### Forgot password

```
┌─────────────────────────┐
│  Reset password         │
│  Email for reset link   │
│  [ Email            ]   │
│  [ Send link        ]   │  ← primary
│  ← Back to sign in      │
└─────────────────────────┘
```

---

## Dashboard (home)

```
┌─────────────────────────┐
│  Hi, {name/short}       │
│                         │
│  ┌───────────────────┐  │
│  │ Your profile      │  │
│  │ {Profile name}    │  │
│  │ [ Details → ]    │  │  ← one card, link to results
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ 5-day program     │  │
│  │ Day 2 of 5        │  │
│  │ [ Continue      ] │  │  ← primary
│  └───────────────────┘  │
│                         │
│  Progress: ●●○○○        │
│                         │
│  [ Retake NPP       ]   │  secondary / text
└─────────────────────────┘
```

---

## Program — day

```
┌─────────────────────────┐
│  ← Back     Day 2       │
│                         │
│  Thought detachment     │
│  (2–4 lines insight)    │
│                         │
│  ┌───────────────────┐  │
│  │  ▶ Audio ~4 min   │  │
│  │  [====····]       │  │
│  └───────────────────┘  │
│                         │
│  Reflection             │
│  [ Option A ]           │
│  [ Option B ]           │
│  [ Option C ]           │
│                         │
│  [ Complete day     ]   │  ← primary (disabled until rules met)
└─────────────────────────┘
```

---

## NPP Lite (single question screen)

```
┌─────────────────────────┐
│  ←        3 / 10        │
│  ████░░░░░░             │
│                         │
│  Question text          │
│  (short)                │
│                         │
│  Almost never — Always  │
│  ○ 1 ○ 2 ○ 3 ○ 4 ○ 5   │
│                         │
│  [ Next             ]   │  ← primary
└─────────────────────────┘
```

---

## Results

### 1 — Profile

```
┌─────────────────────────┐
│  Your profile           │
│  {Profile Name}         │
│                         │
│  (Short insight         │
│   paragraph)            │
│                         │
│  [ Next: domains    ]   │  ← primary
└─────────────────────────┘
```

### 2 — Domains

```
┌─────────────────────────┐
│  Domains                │
│                         │
│  Focus    ████░ 3.8     │
│  (one-line insight)     │
│  Thought  ███░░ …       │
│  …                      │
│                         │
│  [ Next: strengths  ]   │  ← primary
└─────────────────────────┘
```

### 3 — Strengths & focus

```
┌─────────────────────────┐
│  Strengths              │
│  • …  • …               │
│  Focus areas            │
│  • …  • …               │
│  (brief guidance)       │
│                         │
│  [ Back to home     ]   │  ← primary
└─────────────────────────┘
```

---

## Note

A dedicated “program progress only” screen is optional if the dashboard already shows a tracker; if navigation grows, a single screen listing days with a “current day” affordance is enough.
