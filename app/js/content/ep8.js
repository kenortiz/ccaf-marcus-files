/* EP 08 — The Final Assessment (exam-day playbook + full mock with trap analytics) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep8",
  order: 8,
  code: "EP 08",
  title: "The Final Assessment",
  navTitle: "The Final Assessment (Mock Exam)",
  kicker: "EP 08 · THE FINAL ASSESSMENT — Apex AI CoE",
  subtitle: "The mock you CAN pass — exam-day playbook + full timed mock",
  meta: [
    { t: "ALL DOMAINS", cls: "dom" },
    { t: "22-QUESTION MOCK · TIMED", cls: "scn" },
    { t: "TARGET: 85%+ BEFORE BOOKING" }
  ],
  exam: true,
  objectives: [
    "Triage under time pressure: answer what you know cold, flag and move on the rest.",
    "Name the trap type before choosing on every question that resists.",
    "Reach 85%+ consistently before booking the exam."
  ],
  body: `
<div class="story">
  <div class="scene">COLD OPEN — APEX CONSULTING — CONFERENCE ROOM B, 8:00 AM</div>
  <p>Jordan's CCA-F exam is in two weeks. Jordan has made the classic mistake of mentioning this to Marcus, who has therefore blocked Conference Room B for the morning and printed a blank practice schedule.</p>
  <p>"This looks like a lot," Jordan says, surveying the whiteboard Marcus has already filled with domain weights and failure mode categories.</p>
  <p>"It's sixty questions," Marcus says. "Two minutes each. Four answer choices, engineered by people who know exactly how you think. It is winnable — not because it's easy, but because the patterns repeat. High scorers don't know more than you. They <em>recognize faster</em> and they <em>control the clock</em>."</p>
  <p>He hands Jordan a printout. "Before you touch the mock: the playbook. Walk me through it."</p>
</div>

<h2>The exam-day playbook</h2>
<h3>Triage — the single most important habit</h3>
<ol>
  <li><strong>Know it cold?</strong> Pick it. Move. Do not second-guess answers you knew instantly.</li>
  <li><strong>Stuck between two?</strong> List what the scenario <em>requires</em>; pick the option meeting more requirements. Still tied? Eliminate whichever contradicts a stated fact. Still tied? Pick your lean, <strong>flag it</strong>, move.</li>
  <li><strong>No idea?</strong> Eliminate the obvious wrong (usually a fictional feature or an out-of-scope topic), narrow to two, apply rule 2. Flag. Move. <strong>Never leave a blank</strong> — there's no guessing penalty.</li>
</ol>
<h3>Pace control</h3>
<ul>
  <li>Checkpoints: <strong>Q15 ≈ 30 minutes · Q30 ≈ 60 minutes.</strong> Behind? Flag more aggressively. Never five minutes on one question while fifty wait.</li>
  <li>Flagging pays twice: a later question often hands you the term that unlocks an earlier one.</li>
</ul>
<h3>The two CCA-specific patterns</h3>
<ul>
  <li><strong>The plain, too-simple-looking answer is often right.</strong> Distractors disguise themselves as sophistication; "improve the description" beats "add a routing layer" more often than instinct says.</li>
  <li><strong>Run the four questions</strong> on anything that resists: root cause → guarantee? → smallest fix → observability/budget/failure.</li>
</ul>
<h3>Readiness gate (the day before you book)</h3>
<ul>
  <li>☐ Six scenarios recitable cold (name + 2–3 failure modes each — table in <a href="#/ref">The Playbook</a>)</li>
  <li>☐ The four wrong-answer types nameable on sight</li>
  <li>☐ All four builds done; each gate/hook <em>provably</em> fired in your own terminal</li>
  <li>☐ Mocks consistently <strong>85%+</strong> (720/1000 to pass leaves no bad-day margin)</li>
  <li>☐ Logistics confirmed: registration access, format, sit date, quiet room, charged machine</li>
</ul>
<div class="co tip"><span class="co-t">💡 How to use this mock</span>
Run it timed and honest — no notes, no peeking at The Playbook. Grade, then study the <strong>trap report</strong> below your score: it tallies which distractor <em>types</em> caught you. Rerun days later; the questions repeat but the reflex you're training ("name the trap before picking") is the transferable asset. The drill buttons in every episode reset on rerun, so drill freely.</div>
`,
  quiz: [
    {
      q: "S1 · A support agent must check order status before promising delivery dates. In 8% of conversations it promises dates without checking. The team proposes adding \"ALWAYS check order status before promising a date\" in bold at the top of the system prompt. Evaluate.",
      dom: "D1",
      opts: [
        { t: "Good fix — placement at the top maximizes instruction-following.", why: "Position tunes probability; it cannot reach 'always'. A correctness-critical sequence needs enforcement.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Insufficient — make the promise-path depend on the check: the reply tool (or a gate) requires a fresh order-status result before a date can be included.", correct: true, why: "Sequence guarantees live in code: the gated path makes the unchecked promise impossible, not just discouraged." },
        { t: "Replace the agent with a decision tree for delivery questions.", why: "Deletes the model's value across all the messy variants of the question — over-rotation to the deterministic end.", trap: "Over-engineered" },
        { t: "Add few-shot examples of correct check-then-promise behavior.", why: "Better, still probabilistic. Examples narrow the 8%; they don't zero it.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S1 · The same agent should decide when a customer's issue is too unusual for self-service and write a handoff. Which division of labor is correct?",
      dom: "D1",
      opts: [
        { t: "Code decides escalation via keyword list; model writes the handoff.", why: "Keyword lists are brittle for judgment — 'unusual-ness' is contextual, the model's strength.", trap: "Other (dial misread)" },
        { t: "Model decides escalation via explicit criteria + examples; the handoff content is forced into a structured schema (id, issue, actions, recommendation, reason).", correct: true, why: "Judgment to the model with criteria; structure to the schema. Both sides of the dial, correctly assigned." },
        { t: "Model decides via its self-reported confidence; handoff is the transcript.", why: "Both halves are the classic traps: uncalibrated confidence as trigger, raw transcript as handoff.", trap: "Other (unreliable signal)" },
        { t: "Code decides via sentiment score; model summarizes feelings for the human.", why: "Mood ≠ complexity, and the human needs facts and a recommendation, not impressions.", trap: "Over-engineered" }
      ]
    },
    {
      q: "S3 · A coordinator spawns three research subagents. Mid-run, subagent B needs a fact subagent A discovered. The team wants A and B to share a memory space. Architect's answer?",
      dom: "D1",
      opts: [
        { t: "Enable shared memory between subagents for efficiency.", why: "No such toggle — isolation is structural. Distractors love inventing inter-agent memory.", trap: "Fictional feature" },
        { t: "Route it through the hub: A returns findings to the coordinator, which includes the relevant fact in B's task packet (or re-delegates B after A completes).", correct: true, why: "Hub-and-spoke exists for exactly this: the coordinator owns information flow — observable, budgeted, explicit." },
        { t: "Merge A and B into one subagent so the fact is naturally available.", why: "Sometimes valid! But as a reflex it surrenders parallelism/isolation to dodge a sequencing problem the hub already solves.", trap: "Wrong root cause" },
        { t: "Have B re-research the fact independently to stay decoupled.", why: "Paying twice for the same fact is the duplication bug as a design principle.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "S3 · A synthesis agent receives 60 pages of subagent findings and its reports keep missing facts from pages 25–40. What's happening and what helps?",
      dom: "D5",
      opts: [
        { t: "The model is lazy; instruct it to \"read everything carefully\".", why: "Lost-in-the-middle is an attention property, not an effort problem; pleading doesn't relocate the weak zone.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Lost in the middle — restructure: key-findings summary at the top, clear section headers, critical constraints repeated at the end; distill subagent outputs before synthesis.", correct: true, why: "Place load-bearing content at the high-attention edges and shrink the middle. Structure beats exhortation." },
        { t: "Split synthesis across three agents, one per 20 pages.", why: "Now three partial syntheses must be synthesized — the problem recursed, with more cost.", trap: "Over-engineered" },
        { t: "Raise max_tokens so the model can attend to more input.", why: "max_tokens caps output length; it has nothing to do with input attention.", trap: "Fictional feature" }
      ]
    },
    {
      q: "S4 · An agent exploring an unfamiliar codebase has 22 tools, including six different search variants contributed by different teams. Selection accuracy is poor. First move?",
      dom: "D1",
      opts: [
        { t: "Consolidate to a minimal, non-overlapping toolset with boundary-setting descriptions.", correct: true, why: "Fewer, sharper tools = better selection, smaller context cost, smaller attack surface. The plain answer that's actually right." },
        { t: "Group tools into categories and add a category-picker tool the model calls first.", why: "A routing layer made of tools — sophistication where subtraction was needed.", trap: "Over-engineered" },
        { t: "Log misselections for a month to understand patterns before changing anything.", why: "Observation is good, but six overlapping search tools is a root cause you can already see.", trap: "Wrong root cause" },
        { t: "Set tool_choice to \"any\" to make selection more decisive.", why: "tool_choice 'any' forces using some tool; it does nothing for choosing among confusable ones.", trap: "Fictional feature / misapplied" }
      ]
    },
    {
      q: "S1 · Which error payload best serves the agent when a customer lookup fails because the CRM is down for maintenance?",
      dom: "D2",
      opts: [
        { t: "\"Error: lookup failed\"", why: "Unactionable — retry? escalate? apologize? The agent can only guess.", trap: "Other (failure not first-class)" },
        { t: "isError + errorCategory \"transient\", retryable true, message \"CRM maintenance window, ends ~10:00\", suggestion \"retry after, or offer the customer a callback\".", correct: true, why: "Category, retryability, and a next-step suggestion: failure as decision-grade data." },
        { t: "HTTP 503 passed through raw.", why: "Status codes are for HTTP clients; the agent needs semantics (is this retryable? what do I tell the customer?).", trap: "Other (failure not first-class)" },
        { t: "Return an empty customer record so the conversation continues smoothly.", why: "Fabricating an empty success is silent failure — the agent now reasons on false data.", trap: "Other (failure hidden)" }
      ]
    },
    {
      q: "S4 · The team wants Claude to always know the repo's build commands, branch conventions, and \"never push to main\" policy. Sort the three into mechanisms.",
      dom: "D3",
      opts: [
        { t: "All three in CLAUDE.md — that's what it's for.", why: "Two of three, yes. 'Never push to main' is a must-hold rule; in CLAUDE.md it's a wish.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Build commands + conventions in CLAUDE.md (guidance); \"never push to main\" as a PreToolUse hook blocking the push command (guarantee).", correct: true, why: "Each requirement on its certainty layer — D3's entire thesis in one question." },
        { t: "All three as PreToolUse hooks for consistency.", why: "Hooking guidance (build commands? conventions?) is meaningless — hooks enforce actions, they don't inform judgment.", trap: "Over-engineered" },
        { t: "All three in settings.json under a policies key.", why: "settings.json has no generic 'policies' interpreter — that's an invented mechanism.", trap: "Fictional feature" }
      ]
    },
    {
      q: "S2 · A developer runs Claude Code on a critical payments module. Claude proposes a 9-file refactor in plan mode. The developer doesn't fully understand the plan but it \"looks reasonable\". Best practice?",
      dom: "D3",
      opts: [
        { t: "Approve — plan mode already added the safety gate.", why: "A gate nobody actually evaluates is just for show. The approval IS the control; approving without reviewing the plan removes it.", trap: "Other (approval without review)" },
        { t: "Interrogate the plan first (ask for rationale, risks, alternatives; shrink scope if possible) and approve only what's understood — the human judgment is the gate's entire value.", correct: true, why: "Plan mode supplies the checkpoint; the architect supplies the checking. Especially on payments." },
        { t: "Reject and write the refactor by hand — payments code shouldn't be AI-touched.", why: "Over-rotation: with plan review, tests, and hooks, the model is a supervised power tool, not a banned substance.", trap: "Over-engineered" },
        { t: "Approve but add a CLAUDE.md line: \"be extra careful in payments code\".", why: "An impression-based safety net under a 9-file change nobody understood.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S5 · Security wants the CI reviewer to also auto-commit fixes for the issues it finds, \"to save a cycle\". Architect's response?",
      dom: "D3",
      opts: [
        { t: "Accept — finding and fixing in one pass is efficient.", why: "An unattended agent with write access whose input is attacker-influencable PR content = prompt-injection-to-commit pipeline.", trap: "Other (least privilege)" },
        { t: "Keep the reviewer read-only; fixes happen in a separate, human-approved flow (e.g. suggested patches a developer applies).", correct: true, why: "Separation of powers: the unattended path stays read-only; writes stay behind a human. Least privilege is the spine of CI design." },
        { t: "Allow auto-commit only for \"low\" severity findings.", why: "Severity is the model's own probabilistic judgment — using it to unlock write access gates the danger with the thing being doubted.", trap: "Other (least privilege)" },
        { t: "Allow it, but add a prompt rule: \"never modify files outside the flagged ones\".", why: "A prompt boundary on an unattended write-capable agent is the trap in its purest form.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S2 · A team wants every Claude Code session in the repo to start by running their environment-check script. Mechanism?",
      dom: "D3",
      opts: [
        { t: "A SessionStart hook that runs the script automatically.", correct: true, why: "Lifecycle event + must-happen-every-time = hook. SessionStart exists for exactly this." },
        { t: "A CLAUDE.md line: \"Always run ./check-env.sh before starting work.\"", why: "The model usually will. Usually. The requirement said 'every session'.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "A skill /checkenv developers should invoke first.", why: "Skills are on-demand by design — 'should invoke' reintroduces the human forgetting problem.", trap: "Wrong root cause" },
        { t: "A cron job running the check every five minutes.", why: "Machinery outside the session lifecycle, checking even when nobody's working.", trap: "Over-engineered" }
      ]
    },
    {
      q: "S6 · Legal-document extraction must output a contract_type field that is exactly one of: NDA, MSA, SOW, OTHER. Today the prompt asks for it and the model occasionally returns \"Master Services Agreement\". Fix?",
      dom: "D4",
      opts: [
        { t: "Add to the prompt: \"contract_type MUST be exactly one of NDA, MSA, SOW, OTHER\".", why: "Closer, still a request. Parsers downstream need the enum to hold every time.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Define contract_type as an enum in the forced tool's input_schema — the constraint becomes structural.", correct: true, why: "Schema enums make off-vocabulary output impossible, not discouraged. Shape contract = schema mechanism." },
        { t: "Post-process with a synonym mapper (\"Master Services Agreement\" → MSA).", why: "A growing translation table chasing a distribution you could simply constrain.", trap: "Wrong root cause" },
        { t: "Few-shot examples showing the four valid values.", why: "Helps the judgment, doesn't bind the format — the 0.5% off-vocab case still breaks the parser.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S6 · A document analyst asks: \"Why not make the model output its reasoning inside the JSON, in a required analysis field, for every extraction?\" Best answer?",
      dom: "D4",
      opts: [
        { t: "Great idea — reasoning always improves accuracy and the field documents it.", why: "For simple extractions it adds cost/latency without accuracy; 'always' is the tell.", trap: "Over-engineered" },
        { t: "Use reasoning where the task is genuinely complex (e.g. reconciling totals), and don't burden every simple field-grab with it — proportionality applies to prompting too.", correct: true, why: "Chain-of-thought is a paid feature: spend it where reasoning is the bottleneck." },
        { t: "Never mix reasoning with structured output — it corrupts the schema.", why: "They coexist fine (think, then emit the structured block); 'never' is as wrong as 'always'.", trap: "Other (mechanism misread)" },
        { t: "Reasoning fields are required for the model to use tools correctly.", why: "Invented dependency — tool use doesn't require an in-schema reasoning field.", trap: "Fictional feature" }
      ]
    },
    {
      q: "S6 · 120,000 historical contracts need one-time classification by next month; meanwhile the same schema serves a live API where users wait ~2s for single-document results. Architecture?",
      dom: "D4",
      opts: [
        { t: "Batch API for the archive; synchronous API for the live endpoint.", correct: true, why: "Bulk + nobody waiting = batch (~50% cost). Human waiting = sync. The cleanest dial question on the exam." },
        { t: "Batch API for both — the cost savings are too large to ignore.", why: "A ~24h async window behind a 2-second user expectation.", trap: "Other (batch vs sync)" },
        { t: "Synchronous for both, parallelized heavily for the archive.", why: "Pays double for the archive and builds throughput machinery the Batch API already is.", trap: "Over-engineered" },
        { t: "Batch for both, with a webhook to make live requests feel responsive.", why: "A webhook reports when results arrive; it cannot make a 24h window feel like 2 seconds.", trap: "Fictional feature" }
      ]
    },
    {
      q: "S6 · After deployment, the extraction pipeline meets its schema 100% of the time, yet the finance team reports wrong totals posting to the ledger. The PM is confused: \"we guaranteed the output\". What did they actually guarantee?",
      dom: "D4",
      opts: [
        { t: "Nothing — schemas don't guarantee anything under load.", why: "They guarantee a lot: structure, fields, types. Just not the part finance cares about.", trap: "Other (shape vs values)" },
        { t: "Structure only — valid shape, fields, types. Value correctness needs separate validation (cross-checks, independent review, confidence routing).", correct: true, why: "The shape/values boundary is the most reliable single mark on this exam. Guaranteed JSON can be confidently, validly wrong." },
        { t: "Structure and values — the wrong totals must come from upstream OCR.", why: "Possibly a contributor, but claiming the schema validated values is exactly the misunderstanding being tested.", trap: "Wrong root cause" },
        { t: "Values only — schemas check content, not formatting.", why: "Inverted: schemas check shape, not truth.", trap: "Other (shape vs values)" }
      ]
    },
    {
      q: "S1 · An agent's context fills with thousands of tokens of raw API responses from order lookups (full JSON dumps per order). Conversations degrade after ~15 turns. Best fix?",
      dom: "D5",
      opts: [
        { t: "Have tools return distilled, relevant fields (status, ETA, item) instead of raw dumps; fetch detail on demand.", correct: true, why: "Spend the budget on signal: tool results are context purchases — buy only what the conversation needs." },
        { t: "Compact the conversation every 10 turns automatically.", why: "Periodic lossy summarization to absorb waste you could simply not generate — and key facts erode each cycle.", trap: "Wrong root cause" },
        { t: "Route each customer turn to a fresh agent instance with no history.", why: "Cures bloat by amnesia — multi-turn issues need continuity.", trap: "Over-engineered (and breaks the product)" },
        { t: "Instruct the agent to ignore irrelevant parts of tool results.", why: "Attention is influenced by, not exempt from, what's in context; the tokens still crowd the window.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S3 · For a due-diligence report, every claim must be traceable to a verifiable source even after three rounds of summarization between subagents and final output. Mechanism?",
      dom: "D5",
      opts: [
        { t: "Add \"preserve all citations\" to each summarization prompt.", why: "Each lossy hop probabilistically sheds attribution; three hops compound it.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Make claim→source pairs the structural unit that flows between stages (schema-enforced), so a claim physically cannot travel without its source; verify sources before shipping.", correct: true, why: "Provenance by structure: the mapping is the data format, not a request — plus an independent existence check." },
        { t: "Skip intermediate summarization so nothing is lost.", why: "Then raw bulk floods every downstream context — provenance preserved, attention destroyed.", trap: "Wrong root cause" },
        { t: "Store all sources in a vector database for later retrieval.", why: "Out-of-scope tech invoked as a magic provenance fairy — retrieval doesn't reconnect orphaned claims.", trap: "Fictional feature / out-of-scope" }
      ]
    },
    {
      q: "S5 · A nightly headless Claude Code job summarizes the day's commits. Some nights it hangs indefinitely on a pathological repo state, blocking the pipeline until morning. Smallest robust fix?",
      dom: "D5",
      opts: [
        { t: "--max-turns plus a process-level timeout, with the job reporting a structured \"did not complete\" status the pipeline treats as a visible, non-blocking failure.", correct: true, why: "Backstops at both layers + failure as a first-class reported state. Small, complete, observable." },
        { t: "Have the on-call engineer check the job each night.", why: "A human cron job to compensate for a missing timeout.", trap: "Over-engineered (organizationally)" },
        { t: "Add \"work quickly and never get stuck\" to the prompt.", why: "Pleading with the model about loop mechanics it doesn't control.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Re-run the job in a retry loop until it completes before sunrise.", why: "Retrying a hang spawns serial hangs; nothing reports, nothing bounds.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "S2 · Two teammates dispute where to put a rule. Alpha: \"Use TypeScript strict mode in new files\" → PreToolUse hook. Beta: \"Block any edit adding eval()\" → CLAUDE.md. Who's right?",
      dom: "D3",
      opts: [
        { t: "Both are right.", why: "Both are exactly backwards.", trap: "Other (dial misread)" },
        { t: "Both are backwards: strict-mode preference is convention guidance (CLAUDE.md); blocking eval() is a security must-hold (hook).", correct: true, why: "Sort by certainty needed, not by which mechanism feels more 'serious'. Security 'never' → deterministic; style preference → guidance." },
        { t: "Alpha is right; Beta is wrong.", why: "Alpha is hooking a style preference — deterministic machinery for a taste call.", trap: "Over-engineered" },
        { t: "Beta is right; Alpha is wrong.", why: "Beta is wishing a security rule — the most dangerous direction to be wrong in.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "S1 · Product wants the support agent to \"sound warmer\" — customers describe it as robotic. The team debates mechanisms. The architect's pick?",
      dom: "D4",
      opts: [
        { t: "Tone guidance + 2–3 example exchanges in the system prompt; review samples after deployment.", correct: true, why: "Tone is judgment — the dial's left side. Guidance + examples is proportionate; sampling closes the loop." },
        { t: "A PostToolUse hook that rewrites replies through a 'warmth filter' model.", why: "A second model rewriting the first, deterministically invoked, to adjust a vibe. Costume-level sophistication.", trap: "Over-engineered" },
        { t: "A warmth score threshold each reply must pass before sending.", why: "Quantifying warmth to gate on it inherits all the unreliability of sentiment scoring, now in the critical path.", trap: "Over-engineered" },
        { t: "Schema-constrain replies to include an empathy_statement field.", why: "Structurally mandated empathy is how you get 'I understand your frustration' stapled to every message — more robotic, not less.", trap: "Other (dial misread)" }
      ]
    },
    {
      q: "S4 · A productivity agent's MCP server exposes read_file, and a teammate proposes adding execute_shell \"for flexibility — we can restrict it later.\" The architect's call, and the principle?",
      dom: "D2",
      opts: [
        { t: "Add it — flexibility now, restrictions when problems appear.", why: "Powers are easy to grant and politically hard to revoke; 'later' means 'after the incident'.", trap: "Other (least privilege)" },
        { t: "Refuse: grant the narrowest capability the current task needs (least privilege); add specific, described tools when a real need appears.", correct: true, why: "Every capability is attack surface and context cost. Scope to need, expand on evidence." },
        { t: "Add it but instruct the agent in the prompt to use it sparingly.", why: "A prompt leash on arbitrary shell execution.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Add it with logging so misuse is visible afterward.", why: "Observability of a capability that shouldn't exist is a well-documented incident.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "S6 · An extraction pipeline occasionally posts wrong totals to the ledger. The simplest proposed fix: have the same model re-read and confirm its own answer before submitting. Best response? <em>(Careful — the simplest option isn't always the right one.)</em>",
      dom: "D5",
      opts: [
        { t: "Good — keep it simple: tell the model to double-check its own answer before submitting.", why: "Self-review is the most-tested reliability trap: an instance defends its own reasoning. Here the plainest option is the wrong one.", trap: "Other (self-review)" },
        { t: "Add a deterministic cross-check (totals vs. line items) and route mismatched or low-confidence extractions to an independent reviewer — a fresh instance or a human, never the authoring instance.", correct: true, why: "Value-correctness needs a coded cross-check plus an independent pass; the author can't grade itself. The right answer is the more deliberate one." },
        { t: "It already meets the schema 100% of the time, so it's validated — no change needed.", why: "Shape ≠ values: a schema-valid total can be confidently, validly wrong.", trap: "Other (shape vs values)" },
        { t: "Re-run the extraction twice and ship it if the two runs agree.", why: "Two runs of the same model share the same blind spots — agreement isn't independence.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "S6 · \"The simplest way to get reliable JSON is to clearly ask for JSON in the prompt and parse what comes back.\" Evaluate, for a pipeline whose output is parsed downstream.",
      dom: "D4",
      opts: [
        { t: "Correct — a clear \"respond only in valid JSON\" instruction is the simplest sufficient fix.", why: "Still a request: prose can reach 'usually', never 'every time'. For a parsed shape the plain answer under-delivers.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Force a tool whose input_schema IS the output format (tool_choice) — the structure is then guaranteed, not requested.", correct: true, why: "A parsed contract needs a structural guarantee, not a polite ask. The right answer is the more deliberate mechanism." },
        { t: "Strip markdown fences with a regex and retry on parse failure.", why: "Patching the symptom of unconstrained output instead of constraining it at the source.", trap: "Wrong root cause" },
        { t: "Switch to a larger model so it follows the format more reliably.", why: "Spends money to make a probabilistic format slightly less probabilistic — the constraint belongs in the schema.", trap: "Over-engineered" }
      ]
    }
  ]
});
