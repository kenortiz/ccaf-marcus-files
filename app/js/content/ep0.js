/* EP 00 — The Onboarding (orientation: the mindset, the dial, the lenses) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep0",
  order: 0,
  group: "Season One",
  code: "EP 00",
  title: "The Onboarding",
  navTitle: "The Onboarding",
  kicker: "APEX CONSULTING — AI CoE · CASE FILE ZERO",
  subtitle: "The architect mindset — the one idea the entire exam is testing",
  meta: [
    { t: "ALL DOMAINS", cls: "dom" },
    { t: "ORIENTATION", cls: "scn" },
    { t: "NO LAB — READ & DRILL" }
  ],
  objectives: [
    "Explain why an architect supplies certainty through architecture, not by prompting harder.",
    "Place a requirement on the determinism dial — model judgment vs. coded guarantee.",
    "Name the four wrong-answer types on sight and run the four questions on any scenario."
  ],
  body: `
<div class="story">
  <div class="scene">INT. APEX CONSULTING GROUP — OPEN PLAN — TUESDAY, 9:04 AM</div>
  <p>The credential email arrives while Marcus is looking at something else. <strong>Certified Claude Architect — Foundational. PASS.</strong></p>
  <p>He reads it once, sets his coffee down, and reads it again. Then he minimizes the tab, because his manager Sam has already sent a Slack message that says: <em>"🎉 MARCUS!!! HUGE for the practice's AI transformation story!!! (How did I know before you told me??? I set a Google Alert for Anthropic cert announcements. Don't tell HR.)"</em></p>
  <p>Within four minutes, Sam has posted to the all-hands channel, added "AI-Certified Team ✓" to the practice deck, and scheduled a "Celebrating Our Win" team lunch for Thursday. Marcus has sent one reply: <em>"Thanks."</em></p>
  <p>Jordan, the junior analyst, spins around from the adjacent desk. Jordan has been at Apex for eleven weeks and has opinions about everything, including fine-tuning. "Does this mean we can take on the Pinnacle Retail engagement? I've been working on a proposal — I think we should add a custom routing layer and maybe a sentiment classifier—"</p>
  <p>"Jordan," Marcus says. "There were sixty questions. Five domains. Six scenarios. I passed. That means I can walk into a client meeting and not embarrass us."</p>
  <p>"So what did they actually test?" Jordan asks.</p>
  <p>Marcus considers this. A lot, technically. And also, really: one thing.</p>
  <p>"One idea," he says. "Wearing five costumes."</p>
</div>

<div class="co tip"><span class="co-t">💡 Don't try to memorize this episode</span>EP 00 is the map, not the territory. It introduces several frameworks at once (the dial, the six lenses, the four questions, the trap types) — that's a lot in one sitting. You're <em>not</em> meant to absorb them all now. Each one comes back, used on a real problem, in the episodes that follow, and they're all collected on one page in <a href="#/ref">The Playbook</a>. Skim here; the repetition does the work.</div>

<h2>The one idea (read this slowly, once)</h2>
<p>A Claude architect builds production systems around a component — the model — that is <strong>probabilistic</strong>, not deterministic.</p>

<div class="co def"><span class="co-t">📦 Definition — Probabilistic vs. deterministic</span>
<strong>Deterministic</strong> = same input always produces the same output, guaranteed. A calculator: 2+2 is <em>always</em> 4.<br>
<strong>Probabilistic</strong> = output varies; usually right, never <em>guaranteed</em>. The model: brilliant at judgment, language, and synthesis — but it might phrase, choose, or decide differently each run.</div>

<p>The model is <em>excellent</em> at judgment — and it is <em>not guaranteed</em>. So the architect's entire job is:</p>

<div class="log"><b>MARCUS'S NOTES:</b> For each requirement, decide how much certainty it needs — then supply that certainty through architecture, while letting the model do what only it can. That is the whole role. Everything else is costume.</div>

<h3>The Determinism Dial</h3>
<div class="fig">
<svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The determinism dial">
  <defs>
    <linearGradient id="dialgrad" x1="0" x2="1">
      <stop offset="0" stop-color="#b794d4"/><stop offset="1" stop-color="#00d9ff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="760" height="230" fill="none"/>
  <path d="M 110 170 A 270 270 0 0 1 650 170" fill="none" stroke="url(#dialgrad)" stroke-width="10" stroke-linecap="round"/>
  <line x1="380" y1="170" x2="380" y2="60" stroke="#f7b05b" stroke-width="5" stroke-linecap="round"/>
  <circle cx="380" cy="170" r="14" fill="#0c1626" stroke="#f7b05b" stroke-width="3"/>
  <text x="110" y="205" fill="#b794d4" font-family="monospace" font-size="15" text-anchor="middle">LET THE MODEL JUDGE</text>
  <text x="110" y="224" fill="#7e93a6" font-family="monospace" font-size="12" text-anchor="middle">(probabilistic)</text>
  <text x="650" y="205" fill="#00d9ff" font-family="monospace" font-size="15" text-anchor="middle">GUARANTEE IT IN CODE</text>
  <text x="650" y="224" fill="#7e93a6" font-family="monospace" font-size="12" text-anchor="middle">(deterministic)</text>
  <text x="205" y="95" fill="#b794d4" font-family="monospace" font-size="12.5" text-anchor="middle">tone · classification</text>
  <text x="205" y="113" fill="#b794d4" font-family="monospace" font-size="12.5" text-anchor="middle">synthesis · messy docs</text>
  <text x="556" y="95" fill="#00d9ff" font-family="monospace" font-size="12.5" text-anchor="middle">identity checks · refund caps</text>
  <text x="556" y="113" fill="#00d9ff" font-family="monospace" font-size="12.5" text-anchor="middle">step order · valid JSON · "never touch X"</text>
  <text x="380" y="40" fill="#f7b05b" font-family="monospace" font-size="13" text-anchor="middle" letter-spacing="3">THE ARCHITECT SETS THE DIAL — PER REQUIREMENT</text>
</svg>
<div class="fig-cap">Fig. 0-1 · The determinism dial — the spine of every exam question</div>
</div>

<p>Turn the dial too far left and you ship a system that <em>usually</em> works (under-engineering). Too far right and you've built a rigid machine that wastes the model's intelligence (over-engineering). The right answer is almost always the <strong>proportionate</strong> one — and the dial is set <em>per requirement</em>, not per system.</p>

<h3>Drill: set the dial yourself</h3>
<p>Tap each requirement. Decide <em>before you tap</em>: does it need a guarantee (code) or judgment (model)?</p>
<div class="dial-chips">
  <button class="chip" data-side="code">"Refunds over $500 must go to a human"<span class="chip-why">→ <strong>CODE.</strong> A hard financial threshold. Must hold 100% of the time — a prompt holds ~95%, and 95% is failure when money moves.</span></button>
  <button class="chip" data-side="model">"Decide if this customer is frustrated enough to escalate"<span class="chip-why">→ <strong>MODEL.</strong> Contextual judgment — exactly what the model is good at. Give it explicit criteria + few-shot examples, not an ML classifier.</span></button>
  <button class="chip" data-side="code">"Output must be valid JSON matching our schema"<span class="chip-why">→ <strong>CODE.</strong> Shape is guaranteeable: schema + forced tool call. Never "please respond in JSON" for a system that parses the result.</span></button>
  <button class="chip" data-side="model">"Summarize this contract in plain English"<span class="chip-why">→ <strong>MODEL.</strong> Reading and synthesizing messy language is the model's home turf. Architecture adds checks around it, not instead of it.</span></button>
  <button class="chip" data-side="code">"Never auto-edit files in migrations/"<span class="chip-why">→ <strong>CODE.</strong> A "never" is a guarantee by definition. In Claude Code that's a PreToolUse hook that vetoes the edit — not a CLAUDE.md plea.</span></button>
  <button class="chip" data-side="model">"Match the client's formal tone in replies"<span class="chip-why">→ <strong>MODEL.</strong> Tone is taste, not threshold. Guidance in the prompt/CLAUDE.md is the proportionate tool.</span></button>
  <button class="chip" data-side="code">"Verify identity before any account action"<span class="chip-why">→ <strong>CODE.</strong> A correctness-critical <em>sequence</em>. Enforce as a precondition gate: the refund tool refuses unless verification already happened.</span></button>
</div>

<h2>The six lenses</h2>
<p>Every concept, every question, every real bug is one of these six in a costume. Name the lens, and the answer usually announces itself.</p>
<table>
  <tr><th>#</th><th>Lens</th><th>The question it asks</th></tr>
  <tr><td><strong>1</strong></td><td><strong>Determinism dial</strong></td><td>Does this requirement need a <em>guarantee</em>? Yes → enforce in code. No → let the model decide.</td></tr>
  <tr><td><strong>2</strong></td><td><strong>Proportionality</strong></td><td>What's the <em>smallest</em> fix that fully solves the <em>root cause</em>? Don't over-build; don't under-build.</td></tr>
  <tr><td><strong>3</strong></td><td><strong>Context is a budget</strong></td><td>Is the model's limited working memory being spent wisely? Trim, isolate, summarize, preserve key facts.</td></tr>
  <tr><td><strong>4</strong></td><td><strong>Design for model behavior</strong></td><td>Am I shaping the model's <em>decision environment</em>? Good tool descriptions, few tools, clear scope.</td></tr>
  <tr><td><strong>5</strong></td><td><strong>Failure is first-class</strong></td><td>What happens when something breaks? Structured errors, partial results, escalation, independent review.</td></tr>
  <tr><td><strong>6</strong></td><td><strong>Observability &amp; control</strong></td><td>Can I see and steer what the system does? Route through a coordinator; use hooks to enforce.</td></tr>
</table>

<div class="co def"><span class="co-t">📦 Definition — Context window</span>
The total amount of text (measured in <em>tokens</em> ≈ word-pieces) the model can "see" at once — its working memory. It holds your instructions, the whole conversation, tool definitions, and every tool result. It is finite, and quality degrades as it fills. Hence lens 3: context is a budget.</div>

<h2>The four questions (Marcus's framework)</h2>
<p>When you hit a practice question, an exam question, or a real 2 a.m. incident — run this loop. It is the same loop a working architect runs all day:</p>
<ol>
  <li><strong>What's the REAL root cause?</strong> Resist fixing the symptom.</li>
  <li><strong>Does this need a GUARANTEE?</strong> Yes = deterministic (code / hook / schema / gate). No = let the model judge (prompt + examples).</li>
  <li><strong>What's the SMALLEST sufficient fix?</strong> Reject over- <em>and</em> under-engineering.</li>
  <li><strong>Does the fix preserve observability, context budget, and graceful failure?</strong></li>
</ol>

<h2>The Rogues' Gallery: the four classic wrong answers</h2>
<p>Almost every exam distractor is one of these four. Learn to name them on sight — half the exam is spotting them.</p>
<table>
  <tr><th>Wrong answer</th><th>Smell</th></tr>
  <tr><td><strong>1 · Prompt-where-a-guarantee-is-needed</strong></td><td>"Just add a line to the prompt telling it to always…" — a probabilistic fix for a deterministic need. The single most common wrong answer on the exam.</td></tr>
  <tr><td><strong>2 · Over-engineered</strong></td><td>"Train a custom classifier / build a routing layer / use a bigger model" — when a small tweak fully solves it.</td></tr>
  <tr><td><strong>3 · Wrong root cause</strong></td><td>Fixes a symptom (dedupe the duplicated work) instead of the cause (partition the work before delegating).</td></tr>
  <tr><td><strong>4 · Fictional feature</strong></td><td>Invents a setting, flag, or capability that doesn't exist — or reaches for an out-of-scope topic (fine-tuning, embeddings, RLHF…).</td></tr>
</table>

<div class="co tip"><span class="co-t">💡 Tip — The "too-simple-looking answer" pattern</span>
On this exam, the answer that looks <em>almost too simple</em> is often correct, because distractors are engineered to look sophisticated. When one option feels suspiciously plain — "improve the tool description," "partition the work first" — look at it <em>harder</em>, don't dismiss it.</div>

<h2>The engagement board: six scenarios, five domains</h2>
<p>Every exam question is grounded in one of six fixed business scenarios (the exam draws 4 at random). In this app, each scenario is a client engagement Marcus works through at Apex Consulting:</p>
<table>
  <tr><th>#</th><th>Exam scenario</th><th>Marcus's client</th><th>Domains</th><th>Episode</th></tr>
  <tr><td>1</td><td>Customer Support Agent</td><td>Pinnacle Retail</td><td>D1, D2, D5</td><td>EP 02–03</td></tr>
  <tr><td>2</td><td>Code Generation with Claude Code</td><td>Atlas Engineering (dev team)</td><td>D3, D5</td><td>EP 01</td></tr>
  <tr><td>3</td><td>Multi-Agent Research System</td><td>Vertex Research</td><td>D1, D2, D5</td><td>EP 04</td></tr>
  <tr><td>4</td><td>Developer Productivity Tools</td><td>Atlas Engineering (legacy codebase crew)</td><td>D2, D3, D1</td><td>EP 01–02, 07</td></tr>
  <tr><td>5</td><td>Claude Code for CI/CD</td><td>Internal — Apex Platform Team</td><td>D3, D4</td><td>EP 07</td></tr>
  <tr><td>6</td><td>Structured Data Extraction</td><td>Cascade Commerce</td><td>D4, D5</td><td>EP 05–06</td></tr>
</table>

<p>And the five domains with exam weights — note that D1 + D3 together are nearly half the exam:</p>
<table>
  <tr><th>#</th><th>Domain</th><th>Weight</th><th>Plain English</th></tr>
  <tr><td><strong>D1</strong></td><td>Agentic Architecture &amp; Orchestration</td><td><strong>27%</strong></td><td>Wiring up agents that act in a loop; coordinating several of them</td></tr>
  <tr><td><strong>D2</strong></td><td>Tool Design &amp; MCP Integration</td><td><strong>18%</strong></td><td>Giving the model functions to call; connecting outside systems</td></tr>
  <tr><td><strong>D3</strong></td><td>Claude Code Configuration &amp; Workflows</td><td><strong>20%</strong></td><td>Configuring Claude Code so it behaves safely and consistently</td></tr>
  <tr><td><strong>D4</strong></td><td>Prompt Engineering &amp; Structured Output</td><td><strong>20%</strong></td><td>Getting reliable, correctly-formatted answers out of the model</td></tr>
  <tr><td><strong>D5</strong></td><td>Context Management &amp; Reliability</td><td><strong>15%</strong></td><td>Handling limited memory; failing gracefully</td></tr>
</table>

<div class="co def"><span class="co-t">📦 Definition — Agent</span>
The model placed in a <strong>loop</strong>: it's given tools, decides which to call, your code runs the tool and hands back the result, and the model decides what's next — repeating until done. A chatbot answers once; an agent <em>acts repeatedly toward a goal</em>.</div>

<div class="co def"><span class="co-t">📦 Definition — MCP (Model Context Protocol)</span>
An open standard for plugging external systems (databases, GitHub, Slack, company APIs) into the model — one shared "USB port" instead of a custom connector per system.</div>

<h2>Exam logistics (the short version)</h2>
<ul>
  <li><strong>~60 multiple-choice questions</strong>, 1 correct of 4, drawn from <strong>4 of the 6 scenarios</strong> at random.</li>
  <li><strong>Pass = 720/1000</strong> · ~120 minutes · proctored · no docs, no Claude, no pausing.</li>
  <li><strong>No guessing penalty — answer every question.</strong></li>
  <li>Booking bar: don't sit until you're at <strong>85%+ on mocks</strong> consistently. 720 leaves no margin for a bad day.</li>
  <li>A list of <strong>explicitly out-of-scope topics</strong> (fine-tuning, embeddings, RLHF, hosting…) lives in <a href="#/ref">The Playbook</a> — out-of-scope answers are usually the "fictional feature" distractor.</li>
</ul>
<div class="co tip"><span class="co-t">💡 Heads-up</span>This is an <strong>unofficial</strong> guide, and exam specifics — question count, the pass mark, scenario mix, time — <strong>can change</strong>. Treat the numbers above as a current snapshot and confirm everything against the <strong>official CCA-F exam guide</strong> and the live docs before you book. The reasoning this guide trains is the durable part.</div>

<h2>How to use this guide</h2>
<ol>
  <li><strong>One episode per sitting.</strong> Read the story, do the lab <em>hands-on</em> (the labs are the learning — reading them is not doing them), run the drill.</li>
  <li><strong>Labs need:</strong> a terminal, <a href="https://code.claude.com/docs" target="_blank" rel="noopener">Claude Code</a> (EP 01 installs it), Python 3.10+, and an Anthropic API key for EP 02+ (small cost). Every step is spelled out in-episode.</li>
  <li><strong>Viewscreen panels</strong> 📡 show what Marcus finds in the official docs — each links to the real page. <strong>Skilljar panels</strong> show which course he queues up.</li>
  <li>Your progress (checkboxes, drill scores) saves in this browser automatically.</li>
  <li>Finish with <a href="#/ep8">EP 08: The Final Assessment</a> — the full mock with trap analytics — and use <a href="#/ref">The Playbook</a> as your night-before sheet.</li>
</ol>

<div class="story">
  <div class="scene">INT. APEX CONSULTING — SAM'S OFFICE — 9:47 AM</div>
  <p>Sam has the first engagement brief open on her laptop. "Atlas Engineering — they adopted Claude Code three weeks ago and their dev lead is, I want to say, nervous?" She looks up. "Enthusiastically nervous. The good kind. The kind that stays on the call."</p>
  <p>"What's the problem?" Marcus asks.</p>
  <p>"The coding agent keeps editing files it shouldn't. They added instructions to a configuration file. It didn't help."</p>
  <p>Marcus nods. He already knows the shape of it.</p>
  <p>"Take Jordan," Sam adds. "Great learning opportunity for the practice's AI talent pipeline."</p>
  <p>Jordan, who has been standing in the doorway, lights up. "I have a proposal — what if we put a routing layer in front of it—"</p>
  <p>"Jordan," Marcus says, already walking out. "We're fixing a config, not building a second AI system."</p>
  <p>It is going to be a long, instructive quarter.</p>
</div>
`,
  quiz: [
    {
      q: "A support agent must never issue refunds above $500 without human approval. The team adds to the system prompt: \"IMPORTANT: Never refund more than $500.\" In testing it works 97% of the time. What's the architect's call?",
      dom: "Mindset",
      opts: [
        { t: "Ship it — 97% is excellent for an LLM system.", why: "97% on a hard financial rule means 3 in 100 refunds break compliance. 'Usually' is failure for a must-hold rule.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Move the $500 rule into code (a gate/hook on the refund action); keep the prompt line as context.", correct: true, why: "A hard threshold needs a guarantee. Code enforces it 100% of the time; the prompt line remains as helpful context for the model's behavior." },
        { t: "Add three more strongly-worded warnings and few-shot examples to push past 99%.", why: "More prompt is still probabilistic — you can approach but never reach 'always' through wording.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Fine-tune the model on refund-policy examples so it internalizes the cap.", why: "Fine-tuning is explicitly out of exam scope and wildly disproportionate to a one-line code check.", trap: "Fictional feature / out-of-scope" }
      ]
    },
    {
      q: "Which requirement belongs on the \"let the model judge\" side of the dial?",
      dom: "Mindset",
      opts: [
        { t: "Output must validate against the invoice JSON schema.", why: "Shape is guaranteeable in code — schema + forced tool use.", trap: "Other (dial misread)" },
        { t: "Deciding whether a customer's complaint is covered by the return policy or needs a human.", correct: true, why: "Contextual judgment over messy language — the model's strength. Give it explicit criteria + examples." },
        { t: "Never editing files under secrets/.", why: "A 'never' is deterministic by definition → hook/gate.", trap: "Other (dial misread)" },
        { t: "Identity verification must precede any account change.", why: "A correctness-critical sequence → precondition gate in code.", trap: "Other (dial misread)" }
      ]
    },
    {
      q: "A research agent occasionally duplicates work: two subagents investigate the same subtopic. The team proposes a post-processing step that detects and removes duplicated findings. What's wrong with that?",
      dom: "Mindset",
      opts: [
        { t: "Nothing — deduplication is a standard data-engineering practice.", why: "It treats the symptom. You already paid (tokens, time) for duplicated work.", trap: "Wrong root cause" },
        { t: "It fixes the symptom; the root cause is unclear task boundaries — the coordinator should partition the work before delegating.", correct: true, why: "Root-cause thinking: prevent the overlap rather than paying for it and cleaning up after." },
        { t: "Deduplication needs an embedding model, which adds cost.", why: "Irrelevant machinery — and embeddings are out of exam scope.", trap: "Fictional feature / out-of-scope" },
        { t: "The subagents should share memory so they can see each other's work.", why: "Subagents don't share context — and 'shared memory' between them isn't a feature you can switch on.", trap: "Fictional feature / out-of-scope" }
      ]
    },
    {
      q: "Exam strategy: you're stuck between two answers on question 14 of 60, four minutes in the hole. Best move?",
      dom: "Exam craft",
      opts: [
        { t: "Work it until certain — early questions build confidence.", why: "Five minutes on one question while 46 wait is how people fail with knowledge they had.", trap: "Other (pace control)" },
        { t: "List what the scenario requires, pick the option meeting more requirements, flag it, move on.", correct: true, why: "The triage rule: requirements-match → lean → flag → move. A later question often unlocks a flagged one." },
        { t: "Skip it and leave it blank to save time.", why: "No guessing penalty — never leave blanks. Answer, flag, move on.", trap: "Other (pace control)" },
        { t: "Pick the most technically sophisticated option — this is an architect exam.", why: "Backwards: the deliberately simple answer is often correct; sophistication is how distractors disguise themselves.", trap: "Over-engineered" }
      ]
    },
    {
      q: "What is the single sentence that describes the Claude architect's job?",
      dom: "Mindset",
      opts: [
        { t: "Make the model as reliable as possible through careful prompting.", why: "You never make the model reliable — it stays probabilistic. You make the SYSTEM reliable.", trap: "Wrong root cause" },
        { t: "Eliminate the model's nondeterminism with strict controls on every output.", why: "Over-rotated: guarantee everything and you've built a rigid machine that wastes the model's judgment.", trap: "Over-engineered" },
        { t: "For each requirement, decide how much certainty it needs, then supply that certainty through architecture — while letting the model do what only it can.", correct: true, why: "That's the whole role. Every exam question is this sentence in costume." },
        { t: "Select the right model size and configure its parameters for each workload.", why: "Model selection is a detail, not the job — and parameter tuning isn't what the exam tests.", trap: "Wrong root cause" }
      ]
    }
  ]
});
