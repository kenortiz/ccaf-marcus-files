/* EP 06 — Night Shift (D5: reliability, error taxonomy, context management) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep6",
  order: 6,
  code: "EP 06",
  title: "Night Shift",
  navTitle: "Night Shift",
  kicker: "EP 06 · CLIENT: CASCADE COMMERCE (night shift)",
  subtitle: "The night it half-failed — Domain 5: Context Management & Reliability",
  meta: [
    { t: "D5 · 15%", cls: "dom" }, { t: "D4", cls: "dom" },
    { t: "SCENARIO 6 · EXTRACTION", cls: "scn" },
    { t: "HANDS-ON LAB · ~2 HRS" }
  ],
  objectives: [
    "Classify a failure (transient / validation / business / permission) and pick its recovery.",
    "Return partial results with the gaps annotated instead of crashing or hiding them.",
    "Externalize load-bearing facts before compaction can drop them, and never let an instance grade its own work."
  ],
  body: `
<div class="story">
  <div class="scene">INT. APEX CONSULTING — ON-CALL BRIDGE — 2:47 AM</div>
  <p>Marcus's phone buzzes at the hour when only disasters call. Cascade Commerce's overnight batch — fifty thousand invoices — is down. Document #31,407 arrived malformed (a corrupted scan, half ledger, half static), the pipeline threw an unhandled exception, and the whole run died with it. Forty-nine thousand good documents, hostage to one bad one.</p>
  <p>He opens his laptop and joins the call.</p>
  <p>In the incident bridge, the junior on-call engineer proposes the obvious patch: wrap everything in a try/except that skips failures silently. Marcus shakes his head. <em>Silently</em> skipping failures is how an audit discovers, months later, that some fraction of invoices simply never existed in the system and nobody can say which.</p>
  <p>"Crash on one failure, or hide every failure," he says. "Your pipeline offers two ways to be wrong and no way to be right. Tonight we build the third option."</p>
  <p>And because disasters travel in pairs: the long-running triage session he's been using all night just <em>compacted</em> — and the summary quietly dropped the one number that mattered, the $500 refund cap from a policy doc forty turns ago. He notices only because he always checks.</p>
</div>

<div class="co lens"><span class="co-t">🔧 Before this episode</span>This continues the <strong>Cascade Commerce</strong> extraction pipeline from EP 05 (same <code>cascade-pipeline</code>, plus Pydantic). If you jumped here, do EP 05's lab first. Same prerequisites: an Anthropic API key (small spend) and Python 3.10+.</div>

<h2>Failure is first-class — the four-part rebuild</h2>

<h3>1 · The error taxonomy (failure as data)</h3>
<table>
  <tr><th>Category</th><th>Example</th><th>Correct response</th></tr>
  <tr><td><strong>Transient</strong></td><td>Timeout; service briefly down; rate limit</td><td><strong>Retry with exponential backoff</strong> (1s, 2s, 4s…). Never hammer; never instantly give up.</td></tr>
  <tr><td><strong>Validation</strong></td><td>Output fails schema/value checks; malformed input</td><td><strong>Retry WITH the specific error fed back</strong> so the model can self-correct. Blind retries repeat the mistake.</td></tr>
  <tr><td><strong>Business rule</strong></td><td>Refund over cap; policy forbids action</td><td><strong>Don't retry — it's not a malfunction.</strong> Explain, route, or escalate per policy.</td></tr>
  <tr><td><strong>Permission</strong></td><td>Identity not verified; access denied</td><td><strong>Stop and escalate.</strong> Never retry your way around a permission boundary.</td></tr>
</table>
<div class="fig">
<svg viewBox="0 0 760 248" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Error taxonomy diagram. Transient: retry with exponential backoff. Validation: retry with the error fed back so the model self-corrects. Business rule: do not retry — explain, route, or escalate. Permission: stop and escalate, never retry around the boundary.">
  <g font-family="'Inter','Segoe UI',sans-serif">
    <rect x="18" y="14" rx="8" width="210" height="44" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
    <text x="123" y="41" text-anchor="middle" font-weight="700" font-size="15" fill="#2563eb">TRANSIENT</text>
    <text x="245" y="42" font-size="20" fill="#64748b">&#8594;</text>
    <text x="278" y="41" font-size="14.5" fill="#1e293b">Retry with exponential backoff (1s &#183; 2s &#183; 4s)</text>

    <rect x="18" y="72" rx="8" width="210" height="44" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="123" y="99" text-anchor="middle" font-weight="700" font-size="15" fill="#d97706">VALIDATION</text>
    <text x="245" y="100" font-size="20" fill="#64748b">&#8594;</text>
    <text x="278" y="99" font-size="14.5" fill="#1e293b">Retry <tspan font-weight="700">with the error fed back</tspan> (self-correct)</text>

    <rect x="18" y="130" rx="8" width="210" height="44" fill="#ede9fe" stroke="#7c3aed" stroke-width="2"/>
    <text x="123" y="157" text-anchor="middle" font-weight="700" font-size="15" fill="#7c3aed">BUSINESS RULE</text>
    <text x="245" y="158" font-size="20" fill="#64748b">&#8594;</text>
    <text x="278" y="157" font-size="14.5" fill="#1e293b"><tspan font-weight="700">Don't retry</tspan> — explain / route / escalate</text>

    <rect x="18" y="188" rx="8" width="210" height="44" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
    <text x="123" y="215" text-anchor="middle" font-weight="700" font-size="15" fill="#dc2626">PERMISSION</text>
    <text x="245" y="216" font-size="20" fill="#64748b">&#8594;</text>
    <text x="278" y="215" font-size="14.5" fill="#1e293b"><tspan font-weight="700">Stop &amp; escalate</tspan> — never retry around it</text>
  </g>
</svg>
<div class="fig-cap">Fig. 6-1 · Four failure categories, four responses — transient → retry with backoff; validation → retry with the error fed back; business rule → don't retry, explain/escalate; permission → stop &amp; escalate. Naming the category gives you the action.</div>
</div>
<div class="co why"><span class="co-t">🎯 Why the taxonomy is the answer key</span>
Most D5 distractors are just a <em>category error</em>: retrying a business-rule refusal, hard-failing a transient timeout, blind-retrying a validation failure without feedback, or treating "0 results" (a valid finding) like an access failure. Name the category and the correct action falls out.</div>

<h3>2 · Local recovery, then propagation</h3>
<p>A worker retries its own transient failures once or twice. If it still can't, it passes <strong>partial results up with a structured note</strong> — never crashing the run, never silently vanishing. The coordinator (or report) annotates the gap. You saw the report-side of this in EP 04; tonight you build the worker-side.</p>

<h3>3 · Validate → retry-with-feedback (the value check)</h3>
<p>EP 05 guaranteed the <em>shape</em>. Tonight checks the <em>values</em>: does the total match the line items? Is the date plausible? On failure, retry <em>telling the model exactly what was wrong</em>. And know the limit: if the data simply isn't in the document, no retry will conjure it — that's a route-to-human, not a retry.</p>

<h3>4 · Independent review + confidence routing</h3>
<div class="co trap"><span class="co-t">⚠ Trap — self-review</span>
"Have the model double-check its own output." An author is a poor proofreader of their own work — the instance that produced it is biased toward defending its reasoning. Checking requires a <strong>fresh, independent</strong> pass (new context, review framing — or a human).</div>
<p>Low-confidence extractions route to humans. And calibrate: 97% aggregate accuracy can hide 40% errors on one document <em>type</em> — audit samples by type and field, not just the global average.</p>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>categorize each failure (transient / validation / business / permission), retry with the error fed back, return partial results with the gaps marked, and write key numbers somewhere deterministic before compaction.</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 4 (Part 2) — survive the bad night</div>
  <p>Continue in <code>cascade-pipeline/extract.py</code> from EP 05.</p>

  <div class="step"><input type="checkbox" data-key="ep6.s1"><div class="step-body">
    <div class="step-t">Step 1 — Validate → retry with feedback</div>
    <div class="codeblock"><span class="cb-label">extract.py (continued)</span><pre>def extract_validated(doc_text: str, max_tries: int = 2):
    last_error = None
    for attempt in range(max_tries + 1):
        prompt_doc = doc_text if not last_error else (
            doc_text + "\\n\\nYour previous output failed validation: "
            + last_error + ". Fix exactly that and try again.")
        try:
            raw = extract(prompt_doc)
            inv = Invoice(**raw)          # types + structure
            if inv.total <= 0:            # value sanity checks
                raise ValueError("total must be positive, got "
                                 + str(inv.total))
            return inv
        except Exception as e:
            last_error = str(e)           # feed the SPECIFIC error back
    return {"status": "needs_human_review", "reason": last_error,
            "doc_preview": doc_text[:80]}</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>On validation failure, retry <em>with the error message in the prompt</em>; after max_tries, route to a human with the reason attached.</dd>
      <dt>LENS</dt><dd>Failure-first.</dd>
      <dt>WHY</dt><dd>"Total doesn't match" lets the model self-correct; a blind retry re-rolls the same dice. And the give-up path is itself structured — a review queue item, not an exception.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep6.s2"><div class="step-body">
    <div class="step-t">Step 2 — The batch that isolates failure + routes by confidence</div>
    <div class="codeblock"><span class="cb-label">extract.py (continued)</span><pre>def run_batch(documents: list):
    results, needs_review = [], []
    for i, doc in enumerate(documents):
        out = extract_validated(doc)      # one bad doc cannot crash the run
        if isinstance(out, Invoice) and out.confidence >= 0.8:
            results.append({"id": i, "data": out.model_dump()})
        else:
            needs_review.append({"id": i, "data": out if isinstance(out, dict)
                                 else out.model_dump()})
    return {"auto_processed": results, "human_review": needs_review}

if __name__ == "__main__":
    batch = [
        "INVOICE - Northwind Supply Co.. Total due: $1,240.50 (incl. tax). "
        "Ref PO-77821. Dated March 3, 2026.",
        "Receipt. Pinnacle Retail. 47.25 USD. No PO on file.",
        "x%4#9 LEDGER ::: corrupted scan ::: total -??- vendor [static]",
    ]
    import json
    print(json.dumps(run_batch(batch), indent=2, default=str))</pre></div>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>python extract.py — the bad night, survived</div>
<pre><span class="dim">$ python extract.py</span>
{
  "auto_processed": [
    { "id": 0, "data": { "vendor": "Northwind Supply Co.", <span class="ok">"confidence": 0.97</span> ... } },
    { "id": 1, "data": { "vendor": "Pinnacle Retail",  <span class="ok">"confidence": 0.88</span> ... } }
  ],
  "human_review": [
    { "id": 2, "data": { "status": "needs_human_review",
      <span class="warn">"reason": "validation failed after retries..."</span>,
      "doc_preview": "x%4#9 LEDGER ::: corrupted scan ..." } }
  ]
}</pre></div>
    <div class="co check"><span class="co-t">✓ Check</span>The corrupted document is <strong>isolated, flagged, and routed</strong> — and documents 0 and 1 processed cleanly. Nothing crashed; nothing shipped silently wrong. That's the third option Marcus promised the night shift.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep6.s3"><div class="step-body">
    <div class="step-t">Step 3 — Independent review (not self-review)</div>
    <p>Add a verifier that sees only the document and the extraction — fresh context, no stake in defending the answer:</p>
    <div class="codeblock"><span class="cb-label">extract.py (continued)</span><pre>def independent_review(doc_text: str, extraction: dict) -> str:
    resp = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=400,
        system="You are a skeptical auditor. You did NOT produce this "
               "extraction. Verify each field against the document. "
               "Reply VALID, or list every discrepancy.",
        messages=[{"role": "user", "content":
            "<document>" + doc_text + "</document>\\n"
            "<extraction>" + str(extraction) + "</extraction>"}],
    )
    return resp.content[0].text</pre></div>
    <div class="co check"><span class="co-t">🔧 Check</span>Feed it a deliberately wrong extraction (change the total to 9999) and watch the auditor catch it. Then note what made this work: a <em>fresh instance with an auditor's framing</em> — not the original asked "are you sure?"</div>
  </div></div>
</div>

<h2>The second disaster: context</h2>
<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — CONTEXT &amp; COMPACTION</div>
  <div class="vs-body">
    <div class="vs-src">code.claude.com/docs → Context window · platform.claude.com → Context windows</div>
    <ul>
      <li>The context window holds <em>everything</em>: system prompt, conversation, tool definitions, every tool result. It is finite, and <strong>quality degrades as it fills</strong>.</li>
      <li><strong>Lost in the middle:</strong> recall is strongest at the start and end of a long context, weakest in the middle. Put key facts at the edges; use clear headers.</li>
      <li><strong>Compaction</strong> (<code>/compact</code> in Claude Code) summarizes the session to free space. Summaries are lossy — <strong>exact numbers, dates, and identifiers are what they lose first.</strong> Preserve critical facts outside the conversation (a file, CLAUDE.md, a structured store) before relying on a summary.</li>
      <li>Long agent runs should <em>externalize state</em>: write decisions and key values to files/notes rather than trusting the transcript to remember.</li>
    </ul>
    <p style="margin:8px 0 0"><a href="https://code.claude.com/docs/en/context-window" target="_blank" rel="noopener">→ code.claude.com/docs — explore the context window</a></p>
  </div>
</div>
<p>Which is exactly what bit Marcus at 2:47 AM: the compaction summary kept the <em>narrative</em> ("we discussed refund policy") and dropped the <em>number</em> ($500). His fix is the standing Apex rule now: <strong>before compacting, write load-bearing facts somewhere deterministic.</strong> The transcript is working memory, not a system of record.</p>

<div class="co trap"><span class="co-t">⚠ Trap roundup — D5's most common traps</span>
"Retry until it succeeds" (hangs on permanent failures) · "Skip failures silently to keep the batch green" (audit nightmare) · "Retry the same prompt on validation failure" (no feedback = same error) · "The model will remember the figure from earlier in the long session" (middle-loss + compaction) · "Have it re-check its own work" (self-review) · "Escalate based on the model's self-rated confidence alone" (poorly calibrated — use it to <em>route to review</em>, never as the sole gate on high-stakes actions).</div>

<div class="story">
  <div class="scene">INT. APEX CONSULTING — ON-CALL BRIDGE — 6:12 AM</div>
  <p>The rerun finishes as the status board goes green. 49,994 invoices auto-processed. Six in the review queue, each with a reason attached. Zero crashes. Zero silent garbage.</p>
  <p>The junior engineer studies the review queue. "So we didn't actually make the extractions better."</p>
  <p>"No," Marcus says. "We made the <em>system</em> honest about which ones to trust. The model was never the thing you could fix at three in the morning. The architecture was."</p>
  <p>He closes the call and makes coffee. Jordan, who was apparently awake through all of this, sends a Slack message: <em>"I now fully understand failure-first. Please send me the architecture diagram."</em></p>
</div>

<div class="talking-head" data-person="Marcus · Senior CCA">"'Crash on one failure, or hide every failure' — those aren't the only two options. But they are the two options you get if you don't think about it."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Categorize every failure. Recover locally, propagate partially, annotate honestly. Validate values, feed errors back, route doubt to humans, and never let the author grade their own work. And write the important numbers somewhere deterministic — memory is a budget, not a vault.</div>
`,
  quiz: [
    {
      q: "An extraction's validation fails: \"total (1480.00) does not equal sum of line items (1240.50)\". The pipeline retries with the identical prompt and fails identically, three times. What's wrong?",
      dom: "D5",
      opts: [
        { t: "Nothing — three retries is the standard resilience pattern.", why: "Blind retries re-roll the same dice. Retry count isn't the issue; retry content is.", trap: "Wrong root cause" },
        { t: "The retry must feed back the specific validation error so the model can correct it — and after max attempts, route to human review with the reason.", correct: true, why: "Validation failures are correctable only when the model learns what failed. Feedback in, structured give-up out." },
        { t: "Switch to a bigger model for retries.", why: "Cost escalation in place of information. The small model with the error message beats the big one without it.", trap: "Over-engineered" },
        { t: "Loosen validation so near-matches pass.", why: "That ships wrong financial data to stop an alarm. The alarm was the system working.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "A tool call times out. Match the correct response.",
      dom: "D5",
      opts: [
        { t: "Treat it as permanent: mark the task failed and move on.", why: "Transient errors are defined by being temporary — giving up instantly wastes recoverable work.", trap: "Other (category error)" },
        { t: "Retry immediately in a tight loop until it responds.", why: "Hammering a struggling service makes the outage worse and can run forever.", trap: "Other (category error)" },
        { t: "Retry with exponential backoff (1s, 2s, 4s…), then if still failing, propagate a structured partial-failure note upward.", correct: true, why: "The canonical transient response: spaced retries, then honest propagation — never crash, never hide." },
        { t: "Escalate to a human immediately — timeouts may indicate fraud.", why: "Category error: timeouts are temporary infrastructure conditions, not policy violations.", trap: "Other (category error)" }
      ]
    },
    {
      q: "The refund tool returns: errorCategory \"business\", message \"Refund exceeds $500 cap\". The agent retries the call four times. What's the design flaw?",
      dom: "D5",
      opts: [
        { t: "The retry limit should be lower for refund tools.", why: "The correct number of retries for a business-rule refusal is zero — it's not a malfunction.", trap: "Wrong root cause" },
        { t: "Business-rule refusals are working-as-intended outcomes: the agent should explain the policy and escalate per criteria, never retry. The error category exists precisely to make that computable.", correct: true, why: "Taxonomy → action. Retrying a policy boundary is a category error (and looks like an evasion attempt in an audit log)." },
        { t: "The cap should return success with a warning so the loop doesn't get stuck.", why: "Disguising refusals as successes is silent failure with extra steps.", trap: "Other (failure hidden)" },
        { t: "The tool should block retries by rate-limiting the agent.", why: "Infrastructure machinery to compensate for the agent not reading the category it was handed.", trap: "Over-engineered" }
      ]
    },
    {
      q: "After /compact in a long Claude Code session, the agent misremembers a deployment port discussed an hour ago. The lesson?",
      dom: "D5",
      opts: [
        { t: "Never use compaction; long sessions should just run until the window is full.", why: "A full window degrades too (middle-loss, truncation). Compaction is a tool — the lesson is about what it costs.", trap: "Other (overcorrection)" },
        { t: "Compaction summaries are lossy and shed exact values first — preserve critical facts deterministically (a notes file, CLAUDE.md, structured store) before relying on a summary.", correct: true, why: "Transcript = working memory; system of record = somewhere a summary can't erode." },
        { t: "Increase the context window so compaction never triggers.", why: "You don't escape compaction by sizing up — larger windows still degrade in the middle, and the externalize-state principle stands regardless.", trap: "Fictional feature" },
        { t: "Add 'remember the port number' to the compaction instruction.", why: "Begging the summarizer is the prompt-trap shape; one fact survives, the next one doesn't.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "Extraction accuracy is 97% overall. A periodic audit finds handwritten invoices fail 40% of the time. What's the right takeaway?",
      dom: "D5",
      opts: [
        { t: "97% aggregate is excellent; handwritten invoices are an acceptable edge case.", why: "Aggregates hide stratified failure — Cascade's handwritten vendors get systematically wrong records.", trap: "Other (calibration)" },
        { t: "Audit by type and field, not just in aggregate — and route the weak stratum (handwritten) to human review until its accuracy is fixed.", correct: true, why: "Calibration is per-segment. Confidence routing + stratified audits catch what the average conceals." },
        { t: "Retrain the OCR layer — extraction is fine.", why: "Maybe a contributor, but the architectural takeaway is the auditing/routing pattern; 'retrain a component' assumes the root cause uninvestigated.", trap: "Wrong root cause" },
        { t: "Raise the global confidence threshold to 0.95 for all documents.", why: "Floods reviewers with fine typed invoices while not specifically addressing the failing stratum.", trap: "Over-engineered (blunt instrument)" }
      ]
    },
    {
      q: "Who should verify a high-stakes extraction before it posts to the ledger?",
      dom: "D5",
      opts: [
        { t: "The same model instance: \"Review your answer carefully and confirm.\"", why: "Self-review — the author defends its own reasoning. The most-tested reliability trap.", trap: "Other (self-review)" },
        { t: "A fresh instance with auditor framing and only the document + extraction — or a human, for the highest stakes.", correct: true, why: "Independence is the active ingredient: new context, no stake in the original answer." },
        { t: "No verification — the schema already guaranteed the output.", why: "The schema guaranteed the shape. The values — the part the ledger cares about — were never checked.", trap: "Other (shape vs values)" },
        { t: "Three parallel extractions with majority voting on every document.", why: "Triple cost on every document, when targeted independent review of high-stakes/low-confidence cases is proportionate.", trap: "Over-engineered" }
      ]
    },
    {
      q: "One document in a 50-document batch is unparseable. Rank the three behaviors: (A) the run crashes; (B) the document is silently skipped; (C) 49 process, one is flagged to review with a reason.",
      dom: "D5",
      opts: [
        { t: "A is safest — fail fast and loud.", why: "Fail-fast is for programmer errors, not data variance: holding 49 good documents hostage to one bad scan is the original disaster.", trap: "Other (failure design)" },
        { t: "B is most practical — the batch completes and throughput stays high.", why: "Worse than the crash: invisible data loss that surfaces months later in an audit, untraceable.", trap: "Other (failure hidden)" },
        { t: "C — isolate the failure, keep the good work, flag the gap with a reason attached.", correct: true, why: "Partial results + honest annotation: failure as a first-class, visible, routable outcome." },
        { t: "A in production, C only in development.", why: "Backwards — production, where reruns are most expensive and audits matter most, is exactly where C is required.", trap: "Other (failure design)" }
      ]
    }
  ]
});
