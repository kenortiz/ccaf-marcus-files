# The Marcus Files — CCA-F Story-Driven Study Guide

A free, **story-driven, hands-on study guide** for the **Claude Certified Architect – Foundations (CCA-F)** exam, built as a self-contained static web app.

**▶ Live demo: https://kenortiz.github.io/ccaf-marcus-files/**

Instead of flashcards, you follow **Marcus** — a senior architect on the AI Center of Excellence team at the fictional *Apex Consulting* — through eight client engagements. Each episode dramatizes one slice of the exam: Marcus hits a real production problem, checks the official docs, and rebuilds the system the right way. **You build it alongside Marcus**, step by step, in your own terminal — then drill the exam questions that test that pattern.

> **Unofficial & independent.** Not affiliated with, endorsed by, or sponsored by Anthropic. All characters and companies are fictional. Always trust the live official docs and your official exam guide over this (or any) study aid.

---

## ✨ What's inside

- **8 episodes + a mock exam + a reference sheet**, mapped to all five CCA-F domains.
- **An Office-style narrative** — a workplace comedy at a consulting firm — so the dry architectural patterns actually stick. Cast: **Marcus** (senior architect, dry and competent), **Sam** (practice manager, fluent in buzzwords), **Jordan** (junior analyst who over-engineers everything).
- **Hands-on labs** (collapsible) — real `claude` / Python builds you run yourself: guardrail hooks, a support agent with an escalation gate, a multi-agent research rig, a structured-extraction pipeline, and a headless CI reviewer.
- **A one-question-at-a-time quiz engine** with instant feedback and **trap-type analytics** — it tells you *which kind* of wrong answer keeps catching you (over-engineering, prompt-where-a-guarantee-is-needed, wrong root cause, fictional feature…).
- **A 22-question timed mock exam** with an advisory pace clock and a post-exam review mode.
- **"The Playbook"** — the whole exam on one screen for night-before review.
- **Progress persistence** — lab checkboxes and best quiz scores save to your browser's `localStorage`.
- **Zero build, zero dependencies.** Pure HTML/CSS/JS. Works fully offline. Opens by double-clicking a file.
- **Accessibility-minded** — Inter body font, `prefers-reduced-motion` support, and color-blind-friendly ✓/✗ answer markers (not color alone).

---

## 🎓 The exam at a glance

| Domain | Weight | Theme |
|---|---|---|
| **D1 · Agentic Architecture** | 27% | Agent loops, multi-agent coordination, the determinism dial, escalation design |
| **D2 · Tool Design & MCP** | 18% | Tool descriptions, least privilege, MCP primitives, structured errors |
| **D3 · Claude Code Config** | 20% | CLAUDE.md vs. hooks, settings hierarchy, headless mode, CI/CD |
| **D4 · Prompt & Structured Output** | 20% | Criteria over vibes, few-shot, forced tools, schema design, batch vs. sync |
| **D5 · Context & Reliability** | 15% | Context budget, error taxonomy, lost-in-the-middle, provenance, failure design |

~60 questions · ~120 minutes · **pass = 720/1000**. (Aim for **85%+** on the mock before booking.)

---

## 🗺️ The season

| Episode | Client / setting | Domains | Build |
|---|---|---|---|
| **Welcome to Apex** | Orientation | — | How to use this guide |
| **EP 00 · The Onboarding** | Internal | All | The architect mindset, the determinism dial |
| **EP 01 · The First Engagement** | Atlas Engineering (DevOps) | D3 | Build 1 · CLAUDE.md + a guardrail hook |
| **EP 02 · Tools of the Trade** | Pinnacle Retail (Support Agent) | D1, D2 | Build 2a · Tool design + escalation gate |
| **EP 03 · The Loop Problem** | Pinnacle Retail (cont.) | D1, D5 | Build 2b · Loop control + structured handoff |
| **EP 04 · Divide and Conquer** | Vertex Research | D1, D5 | Build 3 · Multi-agent hub-and-spoke + provenance |
| **EP 05 · Lost in Translation** | Cascade Commerce | D4 | Build 4a · Forced tool + schema design |
| **EP 06 · Night Shift** | Cascade Commerce (cont.) | D4, D5 | Build 4b · Validation + retry-with-feedback |
| **EP 07 · The Internal Review** | Internal Apex Platform | D3, D4 | Build 5 · Headless CI reviewer + structured gate |
| **EP 08 · The Final Assessment** | — | All | 22-question timed mock exam |
| **The Playbook** | — | All | One-screen reference sheet |

---

## 🚀 Run it

No build step, no server, no dependencies.

```bash
# Option 1 — just open the file
open app/index.html            # macOS
# or double-click app/index.html in any modern browser

# Option 2 — serve it locally (nicer URLs, identical result)
cd app && python3 serve.py     # → http://127.0.0.1:8765
```

Online fonts are optional — the app falls back to system fonts and works fully offline.

---

## 🧠 How to study with it

1. **Read the story.** Each episode opens with a cold open that frames the problem — the scenario *is* the lesson.
2. **Work the build.** Expand the lab and run the commands in your own terminal. Reps beat reading.
3. **Drill the questions.** Answer the scenario drill at the end of each episode; read the explanation and note the *trap type* on every wrong answer.
4. **Sit the mock.** Run **EP 08** timed and honest. Study the trap report under your score, then rerun a few days later.
5. **Review.** Skim **The Playbook** the night before.

### What you need for the labs

- A terminal (macOS/Linux/WSL or PowerShell)
- [Claude Code](https://code.claude.com/docs) — EP 01 walks through installation (paid Claude plan or API key)
- Python 3.10+ and an [Anthropic API key](https://console.anthropic.com) for EP 02+ (small usage cost)

---

## 📁 Project structure

```
app/
├── index.html              # entry point
├── serve.py                # optional local static server
├── css/style.css           # corporate-light theme
└── js/
    ├── app.js              # engine: hash router, progress, quiz stepper, lab collapse
    └── content/
        ├── home.js         # Welcome to Apex (landing page)
        ├── ep0.js … ep8.js # episodes + mock exam
        └── ref.js          # The Playbook (reference)
```

Each content file pushes a page object onto `window.CCAF.pages`; `app.js` renders them. To add or edit an episode, copy an existing `ep*.js`, tweak the `title` / `body` / `quiz`, and add a `<script>` tag in `index.html`.

---

## 🙏 Acknowledgments & credits

- **[paullarionov/claude-certified-architect](https://github.com/paullarionov/claude-certified-architect)** — a comprehensive community study guide for the CCA-F by **Paul Larionov**. It was an invaluable reference for scenario framing and domain coverage while building this project. If you're studying for the exam, **go read it** — it's an excellent companion to this app. Huge thanks, Paul. 🙌
- **[Anthropic](https://www.anthropic.com)** — the official [CCA-F exam guide](https://www.anthropic.com), [`code.claude.com/docs`](https://code.claude.com/docs), [`docs.claude.com`](https://docs.claude.com), and the [Skilljar courses](https://anthropic.skilljar.com) are the source of truth for everything taught here.
- **[Model Context Protocol](https://modelcontextprotocol.io)** docs for the MCP material.

---

## ⚠️ Disclaimer

This is an **unofficial, independent, free** study aid. It is not affiliated with, endorsed by, or sponsored by Anthropic. All characters, companies, and engagements are **fictional**. Terminal panels in the episodes are **recreations** of expected output, not screenshots — your exact results will differ. Exam format, weights, and content can change; always verify against the **official CCA-F exam guide** and the **live documentation**.

---

## 🤝 Contributing

Issues and PRs are welcome — fixes to explanations, clearer labs, new drill questions, or accessibility improvements. Keep it **shareable and impersonal**: no real names, employers, or private information in any content.

---

## 📄 License

Released under the [MIT License](LICENSE) — free to use, modify, and share. "Claude", "Anthropic", and related marks belong to their respective owners; this project is unofficial and uses them only nominatively to describe the exam it helps you study for.

---

*Built with Claude Code.*
