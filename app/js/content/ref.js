/* The Playbook — the night-before reference */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ref",
  order: 9,
  group: "Reference",
  code: "REF",
  title: "The Playbook",
  navTitle: "The Playbook (Reference)",
  kicker: "Apex AI CoE · Reference Sheet",
  subtitle: "The whole exam on one screen — lenses, scenarios, traps, glossary. Your night-before sheet.",
  meta: [{ t: "ALL DOMAINS", cls: "dom" }, { t: "REFERENCE — NO DRILL" }],
  body: `
<h2>The one idea</h2>
<div class="log"><b>THE ROLE IN ONE LINE:</b> For each requirement, decide how much certainty it needs — then supply that certainty through architecture, while letting the model do what only it can. You never make the model reliable; you make the <em>system</em> reliable.</div>

<h2>The six lenses</h2>
<table>
  <tr><th>Lens</th><th>Question</th><th>Reflex</th></tr>
  <tr><td>1 · Determinism dial</td><td>Does this need a guarantee?</td><td>Yes → code/hook/schema/gate. No → prompt + examples.</td></tr>
  <tr><td>2 · Proportionality</td><td>Smallest fix for the root cause?</td><td>Reject over- AND under-engineering. The plain answer is often right.</td></tr>
  <tr><td>3 · Context is a budget</td><td>Is working memory spent wisely?</td><td>Trim, isolate (subagents/fork), distill tool results, externalize key facts.</td></tr>
  <tr><td>4 · Design for model behavior</td><td>Am I shaping the decision environment?</td><td>Sharp tool descriptions, few tools, clear scope, criteria not impressions.</td></tr>
  <tr><td>5 · Failure is first-class</td><td>What happens when it breaks?</td><td>Categorized errors, partial results, retry-with-feedback, escalation, independent review.</td></tr>
  <tr><td>6 · Observability &amp; control</td><td>Can I see and steer it?</td><td>Hub-and-spoke, structured handoffs/outputs, hooks, validated gates.</td></tr>
</table>

<h2>The four questions</h2>
<ol>
  <li><strong>Real root cause?</strong> (not the symptom)</li>
  <li><strong>Guarantee needed?</strong> (yes → deterministic; no → model judgment)</li>
  <li><strong>Smallest sufficient fix?</strong></li>
  <li><strong>Preserves observability, budget, graceful failure?</strong></li>
</ol>

<h2>The four wrong answers (name them on sight)</h2>
<table>
  <tr><th>Distractor</th><th>Smell</th><th>Instant counter</th></tr>
  <tr><td>Prompt-where-a-guarantee-is-needed</td><td>"Add a line telling it to always/never…"</td><td>Must-hold → hook/gate/schema. Prompts approach, never reach, 100%.</td></tr>
  <tr><td>Over-engineered</td><td>"Train a classifier / add a routing layer / bigger model / more agents"</td><td>What's the small fix? Descriptions, criteria, partition, schema.</td></tr>
  <tr><td>Wrong root cause</td><td>Patches the symptom (dedupe, regex-strip, retry harder)</td><td>Ask why it happened at all.</td></tr>
  <tr><td>Fictional feature</td><td>A flag/toggle/capability that doesn't exist, or out-of-scope tech</td><td>If you've never seen it in the docs, it's bait.</td></tr>
</table>

<h2>The six scenarios + signature failure modes</h2>
<table>
  <tr><th>#</th><th>Scenario</th><th>Domains</th><th>Classic failures the questions probe</th></tr>
  <tr><td>1</td><td><strong>Customer Support Agent</strong> (EP 02–03)</td><td>D1, D2, D5</td><td>Refund without identity check (→ gate, not prompt) · escalation via sentiment/self-confidence (→ criteria + few-shot) · raw-transcript handoff (→ structured) · loop ends on parsed text (→ stop_reason)</td></tr>
  <tr><td>2</td><td><strong>Code Gen with Claude Code</strong> (EP 01)</td><td>D3, D5</td><td>Must-hold rule in CLAUDE.md (→ hook) · big refactor in direct mode (→ plan first) · personal taste in project config (→ user level) · secrets in config (→ never)</td></tr>
  <tr><td>3</td><td><strong>Multi-Agent Research</strong> (EP 04)</td><td>D1, D2, D5</td><td>Subagent "inherits" context (→ it doesn't; pass packets) · duplicated work (→ partition first) · fabricated citations (→ provenance schema + verification) · 0-results treated as timeout (→ different categories)</td></tr>
  <tr><td>4</td><td><strong>Developer Productivity Tools</strong> (EP 02, 07)</td><td>D2, D3, D1</td><td>Tool sprawl/overlap (→ consolidate + describe) · powers granted "for flexibility" (→ least privilege) · vague descriptions (→ boundary-setting ones)</td></tr>
  <tr><td>5</td><td><strong>Claude Code for CI/CD</strong> (EP 07)</td><td>D3, D4</td><td>Prose verdict grepped (→ JSON + validate) · noisy reviews ignored (→ severity criteria, out-of-scope list) · reviewer with write access (→ read-only) · malformed output gates anyway (→ fail safe + alert)</td></tr>
  <tr><td>6</td><td><strong>Structured Data Extraction</strong> (EP 05–06)</td><td>D4, D5</td><td>All-required schema causes invention (→ nullable) · "respond in JSON please" (→ forced tool) · blind retries (→ feed the error back) · one bad doc kills batch (→ isolate + route) · schema "guaranteed the values" (→ shape ≠ truth)</td></tr>
</table>

<h2>Domain weights</h2>
<table>
  <tr><th>Domain</th><th>Weight</th><th>Core reflexes</th></tr>
  <tr><td>D1 Agentic Architecture</td><td>27%</td><td>Loop on stop_reason; max-turns as backstop only; hub-and-spoke; blank-slate subagents; partition first; multi-agent only for isolation/parallelism</td></tr>
  <tr><td>D2 Tool Design &amp; MCP</td><td>18%</td><td>Description = decision surface (what/when/when-not/returns); fewer tools; tool=model-controlled action, resource=app-controlled data, prompt=user template; structured errors with category+retryability</td></tr>
  <tr><td>D3 Claude Code Config</td><td>20%</td><td>CLAUDE.md=guidance, hooks=guarantee; hierarchy user→project→local (git=team); skills=repeatable prompts (allowed-tools, fork); plan mode ∝ blast radius; headless: -p, --output-format json (text in .result), --tools restricts / --allowedTools auto-approves, --json-schema → structured_output, --max-turns; secrets in CI store</td></tr>
  <tr><td>D4 Prompt &amp; Structured Output</td><td>20%</td><td>Criteria not impressions; few-shot incl. edge case; XML tags; role; CoT when complexity warrants; schema+tool_choice for parsed shape; nullable prevents invention; shape≠values; batch=bulk/nobody-waiting, sync=someone-waiting</td></tr>
  <tr><td>D5 Context &amp; Reliability</td><td>15%</td><td>Error taxonomy: transient→backoff-retry, validation→retry-with-feedback, business→don't retry, permission→stop+escalate; partial results + annotated gaps; independent review (never self); confidence routes to humans (never sole gate); lost-in-the-middle → edges; compaction loses numbers → externalize facts</td></tr>
</table>

<h2>OUT OF SCOPE — if an answer hinges on these, it's bait</h2>
<p>Fine-tuning · model training / internals · RLHF · embeddings · vector databases (as a topic) · authentication/billing · hosting/infrastructure · cloud configs (Bedrock/Vertex) · computer use · vision · streaming internals · rate limits · token-counting mechanics · prompt-caching internals.</p>

<h2>Glossary (the fast pass)</h2>
<table>
  <tr><th>Term</th><th>One-liner</th></tr>
  <tr><td>Agent</td><td>Model in a loop: pick tool → your code runs it → result back → repeat until end_turn.</td></tr>
  <tr><td>stop_reason</td><td>Machine-readable end-of-reply flag: tool_use (continue), end_turn (done), max_tokens (truncated — incident).</td></tr>
  <tr><td>Hook</td><td>Script auto-fired at a lifecycle moment (PreToolUse can block; PostToolUse checks after; also SessionStart, UserPromptSubmit, Stop…). Always fires → guarantee.</td></tr>
  <tr><td>CLAUDE.md</td><td>Project constitution read each session. Guidance — the model can drift from it.</td></tr>
  <tr><td>Skill / slash command</td><td>Saved prompt template (/name); allowed-tools restricts powers; context: fork isolates output.</td></tr>
  <tr><td>Plan mode</td><td>Read-only propose-then-approve gate before any edits. Size it to blast radius.</td></tr>
  <tr><td>Headless mode</td><td>claude -p: one prompt in, answer out, exit. CI's shape. Output JSON via --output-format json (answer in .result).</td></tr>
  <tr><td>MCP</td><td>Open standard plugging external systems into the model. Tools (model acts), resources (app supplies), prompts (user templates).</td></tr>
  <tr><td>Gate / precondition</td><td>Code check that must pass before an action runs (identity-before-refund). Deterministic by construction.</td></tr>
  <tr><td>Coordinator / subagent</td><td>Hub partitions and delegates; spokes start blank and see only their task packet; results return with provenance.</td></tr>
  <tr><td>Context window</td><td>Finite working memory: instructions + conversation + tool defs + tool results. Quality degrades as it fills.</td></tr>
  <tr><td>Lost in the middle</td><td>Long-context recall is strongest at the edges. Key facts top and bottom; headers throughout.</td></tr>
  <tr><td>Compaction (/compact)</td><td>Lossy session summarization. Loses exact numbers/dates first — externalize critical facts beforehand.</td></tr>
  <tr><td>Few-shot</td><td>2–4 worked input→output examples (include an edge case). Patterns beat adjectives.</td></tr>
  <tr><td>JSON schema / tool_choice</td><td>Schema defines the shape; forcing a tool guarantees output matches it. Guarantees structure, never truth.</td></tr>
  <tr><td>Nullable field</td><td>Permission to say "absent". All-required schemas force invention.</td></tr>
  <tr><td>Validate → retry-with-feedback</td><td>Check values in code; on failure, retry WITH the specific error so the model can fix it; then route to human.</td></tr>
  <tr><td>Error taxonomy</td><td>transient (backoff-retry) · validation (retry w/ feedback) · business rule (don't retry; explain/escalate) · permission (stop + escalate).</td></tr>
  <tr><td>Exponential backoff</td><td>Retry waits 1s, 2s, 4s… Standard transient response.</td></tr>
  <tr><td>Provenance</td><td>Claim→source mapping that travels with the data, schema-enforced, independently verified.</td></tr>
  <tr><td>Independent review</td><td>A fresh instance (or human) checks the work — never the author instance.</td></tr>
  <tr><td>Batch vs. sync API</td><td>Batch: async (typically &lt;24h, no guaranteed completion time), ~50% cost, bulk/overnight. Sync: someone is waiting.</td></tr>
  <tr><td>Least privilege</td><td>Grant the narrowest tools/permissions the task needs. Expand on evidence, not "flexibility".</td></tr>
</table>

<h2>Resource stack (stop collecting, start drilling)</h2>
<table>
  <tr><th>Tier</th><th>Resource</th><th>Use for</th></tr>
  <tr><td>1 · Authority</td><td>Official CCA-F exam guide</td><td>Final word on conflicts; the hands-on exercises</td></tr>
  <tr><td>2 · Official</td><td><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">Skilljar courses</a> · <a href="https://code.claude.com/docs" target="_blank" rel="noopener">code.claude.com/docs</a> · <a href="https://docs.claude.com" target="_blank" rel="noopener">docs.claude.com</a></td><td>Concept grounding; verifying exact flags/syntax</td></tr>
  <tr><td>2.5 · Supplement</td><td>Community guides &amp; practice question banks</td><td>Theory reference + timed mock volume</td></tr>
</table>
<p>Skilljar order that mirrors this season: Claude Code in Action (EP 01) → Intro to Agent Skills (EP 01) → Intro to Subagents (EP 04) → Intro to MCP + MCP Advanced (EP 02) → Building with the Claude API (EP 05). Skip AI-fluency tracks and anything cloud/hosting.</p>

<h2>The final filter</h2>
<div class="log"><b>CARRY THIS INTO EVERY QUESTION:</b> "What would someone who supplies certainty through architecture do here — not someone who prompts harder, not someone who over-builds?" If that question is loaded, the proportionate, root-cause, appropriately-deterministic answer announces itself.</div>
`,
  quiz: []
});
