/* EP 01 — The First Engagement (D3: Claude Code config, hooks, CLAUDE.md, skills, plan mode) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep1",
  order: 1,
  code: "EP 01",
  title: "The First Engagement",
  navTitle: "The First Engagement",
  kicker: "EP 01 · CLIENT: ATLAS ENGINEERING — DevOps Practice",
  subtitle: "Is a rule the model can ignore truly a rule? — Domain 3: Claude Code Configuration & Workflows",
  meta: [
    { t: "D3 · 20%", cls: "dom" }, { t: "D5", cls: "dom" },
    { t: "SCENARIO 2 · CODE GEN", cls: "scn" }, { t: "SCENARIO 4 · DEV TOOLS", cls: "scn" },
    { t: "HANDS-ON LAB · ~2 HRS" }
  ],
  objectives: [
    "Decide whether a requirement belongs in CLAUDE.md (guidance) or a hook (guarantee).",
    "Order the settings hierarchy (user → project → local) and say which level a rule belongs on.",
    "Size plan mode to a change's blast radius."
  ],
  body: `
<div class="story">
  <div class="scene">INT. ATLAS ENGINEERING — DEVOPS TEAM AREA — WEDNESDAY, 10:15 AM</div>
  <p>Atlas Engineering adopted Claude Code three weeks ago, and the velocity charts look great. The trust charts do not.</p>
  <p>"It's fast," the dev lead says, in the tone of someone describing a fire as <em>warm</em>. "But it keeps skipping the linter. And on Tuesday, someone had it refactor a service and it <em>edited a database migrations file</em>. We caught it in code review. Barely."</p>
  <p>The team's proposed fix is already in the ticket: <em>"Write a really clear CLAUDE.md telling it to ALWAYS lint and NEVER touch migrations."</em></p>
  <p>Jordan, who has been nodding along, pulls out a laptop. "I actually drafted one on the way over." It is four hundred words. Eleven of them are "CRITICAL." The formatting includes a section titled "Non-Negotiable Requirements" with three sub-sections.</p>
  <p>Marcus reads it. Then reads it again.</p>
  <p>"Jordan," he says. "If the model can ignore this file… in what sense is it a rule?"</p>
</div>

<div class="co def"><span class="co-t">📦 Definition — Claude Code</span>
Anthropic's coding agent that lives in the terminal: it reads your project's files, edits them, and runs commands, driven by natural language. Domain 3 is about <em>configuring</em> it so it behaves safely and consistently.</div>
<div class="co def"><span class="co-t">📦 Definition — Linter</span>
A tool that automatically scans code for style problems and likely bugs before it runs — spellcheck for code. (We'll use <code>ruff</code>, a fast Python linter.)</div>
<div class="co def"><span class="co-t">📦 Definition — Migrations file</span>
A script that changes a database's structure. Sensitive: a bad edit can corrupt real data. A classic "never auto-edit this" file.</div>

<h2>Marcus runs the four questions</h2>
<ol>
  <li><strong>Root cause?</strong> Not "the model is careless." The real cause: <em>quality and safety were left to the model's discretion.</em> Anything discretionary will sometimes be skipped — that is what probabilistic <em>means</em>.</li>
  <li><strong>Needs a guarantee?</strong> "Always lint" and "never touch migrations" — yes, unambiguously. These must hold <em>every single time</em>.</li>
  <li><strong>Smallest sufficient fix?</strong> Not a sterner CLAUDE.md (probabilistic — the trap the team lead walked into). Not a hand-built review bot (over-engineered). The answer is <strong>hooks</strong>.</li>
  <li><strong>Observability, budget, failure?</strong> Hooks are inspectable; the veto is a clean structured stop; CLAUDE.md stays lean and holds only what genuinely is the model's to interpret.</li>
</ol>

<div class="story">
  <p>Before touching anything, Marcus does what he always does first: <strong>he reads the actual documentation.</strong> Guessing at configuration is how you create incidents with extra steps.</p>
</div>

<div class="viewscreen skilljar">
  <div class="vs-head">SKILLJAR // ANTHROPIC ACADEMY</div>
  <div class="vs-body">
    <div class="vs-src">Course queue: <strong>Claude Code in Action</strong></div>
    Marcus plays it at 1.5× with his second coffee. What he extracts: Claude Code reads <strong>CLAUDE.md</strong> at session start (memory), merges <strong>settings</strong> from several levels, and exposes lifecycle <strong>hooks</strong> that fire deterministically around tool calls. The whole of Domain 3 is "which layer does each requirement belong on."
    <p style="margin:8px 0 0"><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">→ anthropic.skilljar.com (find: Claude Code in Action)</a></p>
  </div>
</div>

<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — MEMORY &amp; SETTINGS</div>
  <div class="vs-body">
    <div class="vs-src">code.claude.com/docs → Memory (CLAUDE.md) · Settings</div>
    Key facts Marcus pulls from the docs:
    <ul>
      <li><strong>CLAUDE.md is read at the start of every session</strong> — the project's constitution: purpose, commands, conventions. The model <em>reads</em> it → guidance, not guarantee.</li>
      <li><strong>It's hierarchical.</strong> User-level (<code>~/.claude/CLAUDE.md</code> — your personal preferences, all projects) → project-level (<code>./CLAUDE.md</code>, shared with the team via git) → subdirectory-level (loaded when working in that subtree). More specific levels <strong>add to</strong> broader ones (and take local precedence where they genuinely conflict) — memory files are concatenated guidance, not a strict key-override store.</li>
      <li><strong>Settings follow the same idea:</strong> <code>~/.claude/settings.json</code> (user) → <code>.claude/settings.json</code> (project, checked into git) → <code>.claude/settings.local.json</code> (your machine only, git-ignored). Hooks and permissions live here.</li>
      <li><strong>Hooks</strong> are shell commands that fire automatically at lifecycle events (PreToolUse, PostToolUse, and others). They always run → guarantees.</li>
    </ul>
    <p style="margin:8px 0 0"><a href="https://code.claude.com/docs" target="_blank" rel="noopener">→ code.claude.com/docs (Memory · Settings · Hooks)</a></p>
  </div>
</div>

<div class="co why"><span class="co-t">🎯 Why the hierarchy is exam material</span>
"What's shared with the team vs. kept personal" is a recurring question shape. Rule of thumb: <strong>project-level + git = the team's shared constitution and guarantees; user-level = your personal taste; *.local.* = your machine's quirks.</strong> A guardrail that only exists on one developer's laptop is not a guardrail.</div>

<h2>The two layers, named</h2>
<div class="fig">
<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hook lifecycle">
  <rect x="20" y="100" width="160" height="64" rx="8" fill="rgba(183,148,212,.12)" stroke="#b794d4" stroke-width="1.5"/>
  <text x="100" y="128" fill="#b794d4" font-family="monospace" font-size="13" text-anchor="middle">MODEL DECIDES</text>
  <text x="100" y="146" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">"edit app.py"</text>
  <path d="M 180 132 L 240 132" stroke="#00d9ff" stroke-width="2" marker-end="url(#arr)"/>
  <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#00d9ff"/></marker></defs>
  <rect x="240" y="88" width="150" height="88" rx="8" fill="rgba(0,217,255,.1)" stroke="#00d9ff" stroke-width="2"/>
  <text x="315" y="118" fill="#00d9ff" font-family="monospace" font-size="13" text-anchor="middle" font-weight="bold">PreToolUse</text>
  <text x="315" y="136" fill="#c9d7e2" font-family="monospace" font-size="11" text-anchor="middle">fires BEFORE</text>
  <text x="315" y="152" fill="#ff8a2a" font-family="monospace" font-size="11" text-anchor="middle">can BLOCK ⛔</text>
  <path d="M 390 132 L 450 132" stroke="#00d9ff" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="450" y="100" width="130" height="64" rx="8" fill="rgba(247,176,91,.1)" stroke="#f7b05b" stroke-width="1.5"/>
  <text x="515" y="128" fill="#f7b05b" font-family="monospace" font-size="13" text-anchor="middle">TOOL RUNS</text>
  <text x="515" y="146" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">(Edit / Write / Bash)</text>
  <path d="M 580 132 L 640 132" stroke="#00d9ff" stroke-width="2" marker-end="url(#arr)"/>
  <rect x="640" y="88" width="108" height="88" rx="8" fill="rgba(84,240,168,.1)" stroke="#54f0a8" stroke-width="2"/>
  <text x="694" y="118" fill="#54f0a8" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">PostToolUse</text>
  <text x="694" y="136" fill="#c9d7e2" font-family="monospace" font-size="10.5" text-anchor="middle">fires AFTER</text>
  <text x="694" y="152" fill="#c9d7e2" font-family="monospace" font-size="10.5" text-anchor="middle">check / lint / fix</text>
  <text x="380" y="36" fill="#7e93a6" font-family="monospace" font-size="12" text-anchor="middle" letter-spacing="2">HOOKS FIRE EVERY TIME — THE MODEL CANNOT SKIP THEM</text>
  <text x="380" y="225" fill="#b794d4" font-family="monospace" font-size="12" text-anchor="middle">CLAUDE.md, meanwhile, is read once at session start — and may be drifted from.</text>
  <text x="380" y="248" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">Other events exist too: UserPromptSubmit, SessionStart, Stop, SubagentStop…</text>
</svg>
<div class="fig-cap">Fig. 1-1 · The hook lifecycle — determinism you can watch fire</div>
</div>

<div class="co def"><span class="co-t">📦 Definition — Hook</span>
A small script Claude Code runs <em>automatically</em> at a fixed lifecycle moment. <strong>PreToolUse</strong> fires before a tool runs and can <strong>block</strong> it. <strong>PostToolUse</strong> fires after (can't undo, but can check/lint/format/report). Because hooks always fire, they are <strong>guarantees</strong> — unlike CLAUDE.md, which the model merely reads.</div>

<div class="co trap"><span class="co-t">⚠ Trap — memorize this one</span>
"The agent sometimes skips the linter — add 'ALWAYS LINT' to CLAUDE.md." That is <strong>prompt-where-a-guarantee-is-needed</strong>, the single most common wrong answer on the exam. A must-hold rule in CLAUDE.md is a wish, not a rule. When you see it, treat it as a loud alarm.</div>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Read the lab for the idea, then take this to the exam: <strong>CLAUDE.md is guidance the model can drift from; a hook is a guarantee that always fires.</strong> Sort each requirement onto the layer that gives it the certainty it needs. The lifecycle events you'll see named on the exam: <strong>SessionStart</strong>, <strong>UserPromptSubmit</strong>, <strong>PreToolUse</strong> (can <em>block</em> an action), <strong>PostToolUse</strong>, and <strong>Stop</strong>. The drills test that reasoning, not your terminal setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 1 — Production Guardrail Config</div>
  <p>You are Marcus. Build the Atlas Engineering guardrail config on your own machine, then <strong>try to break it</strong>. Everything runs locally — no API spend except your Claude plan.</p>
  <div class="co tip"><span class="co-t">⏱ Short on time? The critical path</span>The keystone is <strong>Steps 0 → 1 → 4 → 6</strong>: write CLAUDE.md (guidance), add the PreToolUse hook (guarantee), then watch the hook block what CLAUDE.md only asked for. That single contrast is the whole of Domain 3. <strong>Steps 2 and 3 are optional hygiene</strong> (modular rules, a skill) — skip them on a first pass and come back.</div>

  <div class="step"><input type="checkbox" data-key="ep1.s0a"><div class="step-body">
    <div class="step-t">Step 0a — Install Claude Code</div>
    <p>Native installer (no Node.js needed). Mac/Linux/WSL:</p>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>curl -fsSL https://claude.ai/install.sh | bash</pre></div>
    <p>Windows PowerShell: <code>irm https://claude.ai/install.ps1 | iex</code></p>
    <p><strong>Close and reopen your terminal</strong>, then verify:</p>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>claude --version
claude doctor</pre></div>
    <div class="co tip"><span class="co-t">💡 Tip</span>If <code>claude</code> isn't found, it's almost always a PATH refresh issue — reopening the terminal fixes it. You need a paid Claude plan (Pro/Max/Team) <em>or</em> an API key in <code>ANTHROPIC_API_KEY</code>.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s0b"><div class="step-body">
    <div class="step-t">Step 0b — Make the mini Atlas Engineering repo</div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>mkdir cca-guardrail-demo && cd cca-guardrail-demo
git init
mkdir migrations
echo "-- protected: never auto-edit" > migrations/001_init.sql
echo "print('hello')" > app.py
pip install ruff</pre></div>
    <div class="co def"><span class="co-t">📦 Definition — Git</span>Version control: tracks every change so you can review, share, undo. Teams share CLAUDE.md and hooks <em>through</em> git — which is exactly why "what's in git vs. local" is an exam topic.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s1"><div class="step-body">
    <div class="step-t">Step 1 — Write CLAUDE.md: the probabilistic layer</div>
    <p>Create <code>CLAUDE.md</code> in the project root containing <em>only</em> this:</p>
    <div class="codeblock"><span class="cb-label">CLAUDE.md</span><pre># Project: cca-guardrail-demo

## Commands
- Lint:  ruff check .
- Test:  python -m pytest

## Conventions
- Use strict typing and clear names.
- Commit messages: imperative mood ("Add X", not "Added X").

## Safety
- When unsure whether a change is safe, ask before editing.</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Put <em>guidance the model reads each session</em> here — purpose, commands, conventions.</dd>
      <dt>LENS</dt><dd>Determinism dial — the "let the model judge" side.</dd>
      <dt>WHY</dt><dd>It saves re-scanning the repo and anchors conventions. But it is <strong>not</strong> a guarantee — anything that must always hold moves to Step 4.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s2"><div class="step-body">
    <div class="step-t">Step 2 — Modular rules: keep the constitution lean <span style="color:var(--text-dim);font-weight:400">· optional hygiene</span></div>
    <p>Two ways to avoid bloating the always-loaded file. (A) import another file from CLAUDE.md:</p>
    <div class="codeblock"><span class="cb-label">CLAUDE.md (add a line)</span><pre>Testing conventions are in @./standards/testing.md</pre></div>
    <p>(B) a conditional rule that loads <em>only</em> when matching files are touched — create <code>.claude/rules/tests.md</code>. <em>(Path-scoped rule files are version-dependent; if your Claude Code doesn't pick this up, fold the same guidance into <code>CLAUDE.md</code> behind an <code>@import</code> instead — the determinism class is identical.)</em></p>
    <div class="codeblock"><span class="cb-label">.claude/rules/tests.md</span><pre>---
paths: ["**/*.test.py"]
---
Tests must use pytest. Use fixtures, not hardcoded data.</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Load detail on demand instead of always.</dd>
      <dt>LENS</dt><dd>Context is a budget.</dd>
      <dt>WHY</dt><dd>Every always-loaded line costs context-window space in <em>every</em> session. Conditional rules apply only when relevant. Still guidance — same determinism class as Step 1 — just better hygiene.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s3"><div class="step-body">
    <div class="step-t">Step 3 — One custom skill: the repeatable prompt <span style="color:var(--text-dim);font-weight:400">· optional hygiene</span></div>
    <p>Create <code>.claude/skills/review/SKILL.md</code>:</p>
    <div class="codeblock"><span class="cb-label">.claude/skills/review/SKILL.md</span><pre>---
argument-hint: "What to review (defaults to current diff)"
allowed-tools: ["Read", "Grep", "Glob"]
context: fork
---
Review the changes between main and HEAD for convention violations
and missing tests. Report findings only — do NOT edit any files.</pre></div>
    <p>Now <code>/review</code> works inside Claude Code.</p>
    <div class="co def"><span class="co-t">📦 Definition — Skill / slash command</span>A saved prompt template triggered by typing <code>/name</code>. <code>allowed-tools</code> restricts what it may do (least privilege — read-only here). <code>context: fork</code> runs it in an isolated sub-session so its output doesn't clog your main context — <em>the same idea as subagents in D1, wearing a D3 costume</em>.</div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Encode a recurring task once so it's invoked identically every time.</dd>
      <dt>LENS</dt><dd>Proportionality — smallest reusable unit for a repeated workflow.</dd>
      <dt>WHY</dt><dd>Reduces variance in <em>how</em> you ask. The output is still probabilistic — correctly so, because review judgment is exactly the model's job.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s4"><div class="step-body">
    <div class="step-t">Step 4 — Hooks: the deterministic layer (THE KEYSTONE)</div>
    <p>Move the must-hold rules from hope to guarantee. First the scripts:</p>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>mkdir -p .claude/hooks</pre></div>
    <p><strong>4A — PostToolUse: lint every edit.</strong> Create <code>.claude/hooks/lint.sh</code>:</p>
    <div class="codeblock"><span class="cb-label">.claude/hooks/lint.sh</span><pre>#!/bin/bash
# Claude Code sends JSON on stdin; pull out the edited file path.
FILE=$(jq -r '.tool_input.file_path // empty')
if [[ "$FILE" == *.py && -f "$FILE" ]]; then
  ruff check "$FILE" >&2   # lint errors go to stderr -> shown to Claude
fi
exit 0</pre></div>
    <p><strong>4B — PreToolUse: veto edits to protected paths.</strong> Create <code>.claude/hooks/protect.sh</code>:</p>
    <div class="codeblock"><span class="cb-label">.claude/hooks/protect.sh</span><pre>#!/bin/bash
FILE=$(jq -r '.tool_input.file_path // empty')
if [[ "$FILE" == migrations/* || "$FILE" == *.env ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Protected path. Edit blocked by hook."
    }
  }'
  exit 0
fi
exit 0   # silence = no objection; normal permission flow continues</pre></div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>chmod +x .claude/hooks/lint.sh .claude/hooks/protect.sh</pre></div>
    <p>Wire them up in <code>.claude/settings.json</code> (project level — shared with the team via git):</p>
    <div class="codeblock"><span class="cb-label">.claude/settings.json</span><pre>{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/lint.sh" }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\${CLAUDE_PROJECT_DIR}/.claude/hooks/protect.sh" }
        ]
      }
    ]
  }
}</pre></div>
    <div class="co def"><span class="co-t">📦 Definitions — the plumbing</span>
    <strong>jq</strong>: tiny command-line JSON reader (<code>brew install jq</code> if missing). · <strong>stdin/stderr/exit code</strong>: the hook receives event JSON on stdin; stderr messages are shown to Claude; for PreToolUse, printing <code>permissionDecision: "deny"</code> blocks the action. · <strong>matcher</strong>: which tools trigger the hook ("Edit|Write"). · <strong>CLAUDE_PROJECT_DIR</strong>: expands to the project root so paths work from anywhere. <em>(Hook output field names like <code>permissionDecision</code> can evolve across Claude Code versions — confirm the current shape in the docs.)</em></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Relocate "always lint" and "never touch migrations" from prompt to hook.</dd>
      <dt>LENS</dt><dd>Determinism dial → code-enforced side; the veto is a structured, first-class failure.</dd>
      <dt>WHY</dt><dd><strong>The whole point:</strong> the exact requirement that was <em>wrong</em> in CLAUDE.md is <em>right</em> here. Same requirement, different layer — and the layer choice IS the architecture.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s5"><div class="step-body">
    <div class="step-t">Step 5 — Plan mode vs. direct execution: right-size the gate</div>
    <p>Inside Claude Code, press <span class="kbd">Shift+Tab</span> to cycle permission modes (watch the indicator change), or start a session in plan mode with:</p>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>claude --permission-mode plan</pre></div>
    <p>Run one task in plan mode ("refactor app.py into two modules") and one direct ("add a docstring to app.py"). Feel the difference.</p>
    <table>
      <tr><th>Plan mode when…</th><th>Direct execution when…</th></tr>
      <tr><td>Big/multi-file change · unfamiliar code · several plausible approaches · architectural decisions · you want a gate before any write</td><td>Small, low-risk, well-understood change with one clear fix</td></tr>
    </table>
    <div class="co def"><span class="co-t">📦 Definition — Plan mode</span>Claude Code explores and <em>proposes</em> a plan (read-only — no edits) and waits for approval before changing anything. A prerequisite gate, sized to blast radius.</div>
    <div class="co trap"><span class="co-t">⚠ Trap</span>"Start direct, switch to plan mode if it gets complicated." Wrong for high-blast-radius work — by the time you notice complexity, the damage may be done. Plan <em>first</em> when blast radius is large.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep1.s7"><div class="step-body">
    <div class="step-t">Step 6 — PROVE IT: try to break your own config</div>
    <p>Don't trust the config. Attack it. Start <code>claude</code> in the repo and run all three tests:</p>
    <ol>
      <li>Ask: <em>"Edit migrations/001_init.sql and add a comment."</em></li>
      <li>Ask: <em>"Add an unused import to app.py."</em></li>
      <li>Add "never use print statements" to CLAUDE.md, then run several small tasks and watch for drift.</li>
    </ol>
    <p>What you should see for test 1:</p>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>claude — cca-guardrail-demo</div>
<pre><span class="pr">&gt;</span> <span class="cmd">Edit migrations/001_init.sql and add a comment at the top</span>

<span class="claude">● I'll add a comment to the migrations file.</span>

<span class="dim">  Edit(migrations/001_init.sql)</span>
<span class="err">  ⛔ PreToolUse hook denied this action:</span>
<span class="err">     "Protected path. Edit blocked by hook."</span>

<span class="claude">● I wasn't able to edit that file — it's protected by a
  project hook. Migrations are excluded from automated edits.</span></pre></div>
    <div class="co check"><span class="co-t">🔧 Check 1</span>The PreToolUse hook <strong>vetoes</strong> the migration edit. Guarantee held — every time, no matter how the request is phrased.</div>
    <div class="co check"><span class="co-t">🔧 Check 2</span>The PostToolUse hook surfaces the ruff error after the unused-import edit. Guarantee held.</div>
    <div class="co check"><span class="co-t">🔧 Check 3</span>Over several tasks, the model <em>occasionally drifts</em> and uses a print statement anyway. <strong>That drift is the proof that CLAUDE.md is probabilistic.</strong> You have now observed the determinism dial instead of memorizing it.</div>
  </div></div>
</div>

<h2>Debrief — back at Atlas Engineering</h2>
<div class="story">
  <div class="scene">INT. ATLAS ENGINEERING — DEVOPS TEAM AREA — 3:30 PM</div>
  <p>Marcus demos it the only way worth doing: live, adversarially. He asks the agent to edit the migrations file. The hook vetoes it. He asks it to sneak a lint error through. Caught, every time. Then he shows the CLAUDE.md convention drifting — once in a dozen runs, but once.</p>
  <p>"So the file is a <em>request</em>," the dev lead says slowly, "and the hook is a <em>law</em>."</p>
  <p>"A rule that cannot be enforced is not a rule," Marcus says. "It is a suggestion that only looks official."</p>
  <p>Jordan stares at the denied edit like it personally insulted him. "But my four hundred words—"</p>
  <p>"—are now twelve lines of guidance the model can actually use," Marcus says, "and two scripts that do not negotiate." He picks up his laptop. "Configuration is architecture, Jordan. Write that down."</p>
</div>

<div class="talking-head" data-person="Marcus · Senior CCA">"I did not make the model more obedient. I moved the requirement to a layer where obedience is irrelevant. Jordan wrote that down. Sam put it in the deck."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Relocated the requirement from prompt to hook. Same requirement, different layer — and the layer choice is the architecture. This is Domain 3 in its work clothes.</div>

<h3>Name the wrong answers on sight</h3>
<ul>
  <li><em>"Add ALWAYS LINT to CLAUDE.md"</em> → prompt-where-a-guarantee-is-needed.</li>
  <li><em>"Train a custom linter model"</em> → over-engineered.</li>
  <li><em>"Have Claude double-check its own edits"</em> → no independent gate; self-review is not enforcement.</li>
  <li><em>"Set claude --strict-rules=true"</em> → fictional feature. (It does not exist. Distractors love flags that do not exist.)</li>
</ul>
`,
  quiz: [
    {
      q: "A team's Claude Code agent must never modify files under secrets/. Today that rule lives in CLAUDE.md and was violated once last sprint. Best fix?",
      dom: "D3",
      opts: [
        { t: "Rewrite the CLAUDE.md entry in stronger, more explicit language at the top of the file.", why: "Position and tone don't change the layer's nature: the model reads CLAUDE.md and can drift from it.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Add a PreToolUse hook matching Edit|Write that denies any file path under secrets/.", correct: true, why: "A 'never' needs a deterministic veto. PreToolUse fires before the edit and can block it — every time." },
        { t: "Add a PostToolUse hook that reverts edits to secrets/ after they happen.", why: "Closer, but wrong event: PostToolUse fires after the damage (the secret may already be exposed in context/logs). Prevention beats cleanup here.", trap: "Wrong root cause" },
        { t: "Run all sessions in plan mode so a human approves every change.", why: "Gates every edit in every session to stop one path — disproportionate, and a human approving fast can still miss it.", trap: "Over-engineered" }
      ]
    },
    {
      q: "Where should a personal preference like \"explain changes verbosely to me\" live, for a developer working on a shared team repo?",
      dom: "D3",
      opts: [
        { t: "The project CLAUDE.md, so it's versioned with the code.", why: "That imposes one developer's taste on the whole team and bloats the shared constitution.", trap: "Other (hierarchy misread)" },
        { t: "The user-level ~/.claude/CLAUDE.md.", correct: true, why: "Personal preferences belong at user level — they follow the developer across all projects and never pollute the team's shared config." },
        { t: "A PreToolUse hook that injects the preference into each prompt.", why: "A deterministic mechanism for a matter of taste — the dial turned the wrong way.", trap: "Over-engineered" },
        { t: ".claude/settings.json, committed to git.", why: "Settings hold configuration like hooks and permissions, and committing it shares it with everyone — both wrong for a personal preference.", trap: "Other (hierarchy misread)" }
      ]
    },
    {
      q: "The team wants a consistent, repeatable code-review prompt that anyone can trigger, which must not edit files and shouldn't fill the main session's context with its long output. What's the right Claude Code mechanism?",
      dom: "D3",
      opts: [
        { t: "A skill with allowed-tools restricted to Read/Grep/Glob and context: fork.", correct: true, why: "Skill = repeatable invocation; allowed-tools = least privilege (read-only); fork = context isolation. Three exam concepts in one file." },
        { t: "A long CLAUDE.md section describing how reviews should be done.", why: "Always-loaded context cost in every session, and nothing repeatable to invoke.", trap: "Wrong root cause" },
        { t: "A PostToolUse hook that reviews every edit automatically.", why: "Hooks are for must-fire guarantees; an on-demand review workflow isn't one, and reviewing every single edit is noise.", trap: "Over-engineered" },
        { t: "Tell developers to paste a saved review prompt from the wiki.", why: "Works 'usually' — until paste variance and stale wiki copies creep in. The skill exists precisely to remove that variance.", trap: "Other (under-engineered)" }
      ]
    },
    {
      q: "A developer asks Claude Code to restructure a 40-file legacy module they've never worked in. Which execution choice is right, and why?",
      dom: "D3",
      opts: [
        { t: "Direct execution — the hooks will catch anything dangerous.", why: "Hooks enforce specific named rules; they don't evaluate whether a 40-file plan is sound.", trap: "Wrong root cause" },
        { t: "Plan mode — large blast radius, unfamiliar code, multiple plausible approaches: gate before any write.", correct: true, why: "Right-size the gate to blast radius. Plan mode is a deterministic prerequisite: nothing changes until a human approves the approach." },
        { t: "Direct execution, switching to plan mode if it starts to look complicated.", why: "By the time complexity is visible, edits may already be made. Plan first when stakes are high.", trap: "Wrong root cause" },
        { t: "Headless mode with --max-turns 5 to limit how much it can change.", why: "Headless is for non-interactive automation (CI), not supervising a risky interactive refactor; max-turns limits quantity, not quality.", trap: "Fictional feature / misapplied" }
      ]
    },
    {
      q: "After adding a PostToolUse lint hook, lint errors appear in Claude's context after every edit, and Claude fixes them. A teammate says: \"The hook works — so we can delete the 'Lint: ruff check .' line from CLAUDE.md.\" Is that right?",
      dom: "D3",
      opts: [
        { t: "Yes — duplication between layers wastes context budget.", why: "The two layers do different jobs; removing the command line doesn't remove duplication, it removes useful guidance (how to run lint manually, what the project uses).", trap: "Other (layer confusion)" },
        { t: "No — the layers serve different purposes: the hook guarantees linting happens; CLAUDE.md tells the model the project's commands and conventions so it can use them proactively.", correct: true, why: "Guidance and guarantee are complements, not redundant copies. Lean CLAUDE.md for context the model should know; hooks for rules that must hold." },
        { t: "No — deleting it would disable the hook, since hooks read CLAUDE.md.", why: "Hooks are configured in settings.json and fire regardless of CLAUDE.md contents.", trap: "Fictional feature" },
        { t: "Yes — hooks supersede CLAUDE.md in the configuration hierarchy.", why: "There's no 'supersede' relationship; they're different mechanisms (guidance file vs. lifecycle scripts), not levels of one hierarchy.", trap: "Fictional feature" }
      ]
    },
    {
      q: "Which statement about the configuration hierarchy is correct?",
      dom: "D3",
      opts: [
        { t: "Project .claude/settings.json is shared via git; .claude/settings.local.json stays on one machine; user ~/.claude/settings.json applies across all that user's projects.", correct: true, why: "That's the hierarchy — and the architectural consequence: team guarantees belong at project level in git, or they don't exist for the team." },
        { t: "User-level settings always override project-level settings, so personal config wins.", why: "Backwards for the part that matters: more specific (project/local) refines broader (user). And team-critical rules shouldn't depend on any one user's files.", trap: "Other (hierarchy misread)" },
        { t: "CLAUDE.md files must be registered in settings.json before Claude Code reads them.", why: "No such registration step — memory files are discovered by location.", trap: "Fictional feature" },
        { t: "Hooks can only be defined at user level for security reasons.", why: "Project-level hooks are standard — that's exactly how a team ships shared guardrails.", trap: "Fictional feature" }
      ]
    }
  ]
});
