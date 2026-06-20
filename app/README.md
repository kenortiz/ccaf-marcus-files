# CCA-F: The Marcus Files

A story-driven, hands-on study guide for the **Certified Claude Architect – Foundational (CCA-F)** exam.

Follow Marcus — a Senior CCA at Apex Consulting's AI Center of Excellence — through eight client engagements. Each episode is one exam domain in costume: Marcus hits a real production problem, looks up the official docs on the viewscreen, and rebuilds the system. **You build it alongside Marcus**, step by step, in your own terminal.

Supporting cast: Sam (Practice Manager, fluent in buzzwords) and Jordan (junior analyst, enthusiastically over-engineers everything).

## Run it

No build step, no server, no dependencies. Just open the file:

```
open index.html        # macOS
# or double-click index.html in any modern browser
```

(Online fonts are optional — the app works fully offline with system fonts.)

## The season

| Episode | Title | Covers |
|---|---|---|
| HOME | Welcome to Apex | Orientation — what this is, how to use it, episode map |
| EP 00 | The Onboarding | The architect mindset, the determinism dial, six lenses, four questions, the exam itself |
| EP 01 | The First Engagement | **D3** — CLAUDE.md vs. hooks, config hierarchy, skills, plan mode *(Build 1: guardrail config)* |
| EP 02 | Tools of the Trade | **D2** — tool descriptions, MCP tools/resources/prompts, structured errors *(Build 2a)* |
| EP 03 | The Loop Problem | **D1** — the agent loop, stop_reason, escalation judgment, structured handoffs *(Build 2b)* |
| EP 04 | Divide and Conquer | **D1+D5** — coordinator/subagents, context isolation, partitioning, provenance *(Build 3)* |
| EP 05 | Lost in Translation | **D4** — prompting with criteria + few-shot, schemas, tool_choice, nullable fields *(Build 4a)* |
| EP 06 | Night Shift | **D5** — error taxonomy, retry-with-feedback, partial failure, compaction, independent review *(Build 4b)* |
| EP 07 | The Internal Review | **D3+D4** — headless Claude Code in CI/CD, structured review output, fail-safe gates *(Build 5)* |
| EP 08 | The Final Assessment | Exam-day playbook + 22-question timed mock with **trap-type analytics** |
| REF | The Playbook | Everything on one screen — the night-before reference sheet |

## What you need for the labs

- A terminal (macOS/Linux/WSL or PowerShell)
- [Claude Code](https://code.claude.com/docs) — EP 01 walks through installation (paid Claude plan or API key)
- Python 3.10+ and an [Anthropic API key](https://console.anthropic.com) for EP 02+ (small usage cost)

## Notes

- Progress (lab checkboxes, drill scores, the progress bar) saves to your browser's localStorage. Different browser = fresh start.
- Terminal panels in the episodes are **recreations** of what you should see, not screenshots — your exact output will differ slightly.
- Doc links point to official sources: `code.claude.com/docs`, `docs.claude.com`, `anthropic.skilljar.com`, `modelcontextprotocol.io`. Always trust the live docs over any study guide, including this one.
- This is an unofficial study aid. All characters and companies are fictional.

Share the whole `app/` folder — it's self-contained.
