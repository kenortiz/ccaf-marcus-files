/* EP 04 — Divide and Conquer (D1 multi-agent + D5 provenance) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep4",
  order: 4,
  code: "EP 04",
  title: "Divide and Conquer",
  navTitle: "Divide and Conquer",
  kicker: "EP 04 · CLIENT: VERTEX RESEARCH — Research Division",
  subtitle: "They start with nothing, they multiply when unsupervised, and they do not share memory — Domain 1 × Domain 5",
  meta: [
    { t: "D1 · 27%", cls: "dom" }, { t: "D5 · 15%", cls: "dom" },
    { t: "SCENARIO 3 · RESEARCH SYSTEM", cls: "scn" },
    { t: "HANDS-ON LAB · ~2 HRS" }
  ],
  objectives: [
    "Partition work before delegating so subagents don't duplicate effort.",
    "Explain why subagents start blank and why facts route through the coordinator (hub-and-spoke).",
    "Make provenance (claim → source) travel with the data by schema, then verify it."
  ],
  body: `
<div class="story">
  <div class="scene">INT. VERTEX RESEARCH — DIGITAL CONFERENCE ROOM — MONDAY, 11:00 AM</div>
  <p>Vertex Research built themselves a multi-agent research system: a coordinator that farms subtopics out to research subagents and synthesizes a final report. The demo was excellent. Production has been… eventful.</p>
  <p>Exhibit A: a beautiful 30-page market analysis citing, among its sources, the journal <em>"Quantum Synthesis Review, Vol. 12"</em> — which does not exist. Has never existed. The research director found out when a board member tried to look it up.</p>
  <p>Exhibit B: the billing dashboard. Two subagents spent four hours last Tuesday researching <em>the same subtopic</em>, in parallel, at full token burn. When Marcus charts the duplicated work over time, the curve climbs steadily upward.</p>
  <p>"They duplicate," Jordan says, staring at it. "Like… forwarded meeting invites. One becomes two becomes four and nobody knows who started it."</p>
  <p>Exhibit C is the one Marcus finds most instructive. A staff engineer shows Marcus the coordinator's delegation prompt for the analysis step. It reads, in full: <code>"Analyze the document."</code></p>
  <p>"Which document?" Marcus asks.</p>
  <p>"The one the coordinator was discussing. It's right there in the conversation."</p>
  <p>"<em>Whose</em> conversation?" Marcus says, and waits for the silence to do its work.</p>
</div>

<h2>The one fact that decides half of Domain 1</h2>
<div class="co trap"><span class="co-t">⚠ The most-tested multi-agent trap</span>
<strong>A subagent does NOT inherit the coordinator's context.</strong> It starts with a blank slate and sees only what you explicitly pass it. "Analyze the document" hands a fresh model no document, no goal, no output format — nothing. If the exam shows a confused subagent, look for missing explicit context before anything else.</div>
<div class="co def"><span class="co-t">📦 Definition — Coordinator / subagent (hub-and-spoke)</span>
One central agent (the coordinator) splits the job, hands each piece to a specialized subagent (search, analyze, synthesize), and combines results. Everything flows through the hub — which is what makes the system observable and steerable (lens 6).</div>

<div class="fig">
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hub and spoke">
  <defs><marker id="arr4" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#00d9ff"/></marker></defs>
  <rect x="300" y="110" width="160" height="64" rx="10" fill="rgba(0,217,255,.12)" stroke="#00d9ff" stroke-width="2"/>
  <text x="380" y="138" fill="#00d9ff" font-family="monospace" font-size="13" text-anchor="middle">COORDINATOR</text>
  <text x="380" y="156" fill="#7e93a6" font-family="monospace" font-size="10.5" text-anchor="middle">partitions · delegates · merges</text>
  <rect x="40" y="30" width="170" height="52" rx="8" fill="rgba(183,148,212,.1)" stroke="#b794d4" stroke-width="1.5"/>
  <text x="125" y="52" fill="#b794d4" font-family="monospace" font-size="11.5" text-anchor="middle">SUBAGENT: academic</text>
  <text x="125" y="68" fill="#7e93a6" font-family="monospace" font-size="10" text-anchor="middle">blank slate + task packet</text>
  <rect x="40" y="210" width="170" height="52" rx="8" fill="rgba(183,148,212,.1)" stroke="#b794d4" stroke-width="1.5"/>
  <text x="125" y="232" fill="#b794d4" font-family="monospace" font-size="11.5" text-anchor="middle">SUBAGENT: industry</text>
  <text x="125" y="248" fill="#7e93a6" font-family="monospace" font-size="10" text-anchor="middle">blank slate + task packet</text>
  <rect x="560" y="118" width="160" height="52" rx="8" fill="rgba(84,240,168,.1)" stroke="#54f0a8" stroke-width="1.5"/>
  <text x="640" y="140" fill="#54f0a8" font-family="monospace" font-size="11.5" text-anchor="middle">SYNTHESIS</text>
  <text x="640" y="156" fill="#7e93a6" font-family="monospace" font-size="10" text-anchor="middle">claims keep provenance</text>
  <path d="M 300 130 L 215 70" stroke="#00d9ff" stroke-width="1.8" marker-end="url(#arr4)"/>
  <path d="M 300 155 L 215 225" stroke="#00d9ff" stroke-width="1.8" marker-end="url(#arr4)"/>
  <path d="M 215 85 L 300 142" stroke="#54f0a8" stroke-width="1.8" marker-end="url(#arr4)"/>
  <path d="M 215 212 L 300 162" stroke="#54f0a8" stroke-width="1.8" marker-end="url(#arr4)"/>
  <path d="M 460 142 L 555 142" stroke="#54f0a8" stroke-width="1.8" marker-end="url(#arr4)"/>
  <text x="258" y="92" fill="#00d9ff" font-family="monospace" font-size="10" text-anchor="middle">full task packet ↓</text>
  <text x="258" y="200" fill="#54f0a8" font-family="monospace" font-size="10" text-anchor="middle">↑ findings + sources</text>
  <text x="380" y="288" fill="#7e93a6" font-family="monospace" font-size="11.5" text-anchor="middle" letter-spacing="1.5">EVERYTHING THROUGH THE HUB = OBSERVABLE, STEERABLE, BUDGETED</text>
</svg>
<div class="fig-cap">Fig. 4-1 · Hub-and-spoke: partition before delegating; results return with provenance. Everything flows through the coordinator (the hub), which keeps the work observable, steerable, and budgeted.</div>
</div>

<div class="viewscreen skilljar">
  <div class="vs-head">SKILLJAR // ANTHROPIC ACADEMY</div>
  <div class="vs-body">
    <div class="vs-src">Course queue: <strong>Introduction to Subagents</strong></div>
    Marcus's notes: subagents exist for <strong>context isolation</strong> (a noisy 50-page search result stays in the subagent's window, not the coordinator's) and <strong>parallelism</strong> — not because "more agents = smarter." Each subagent should return a <em>distilled, structured</em> result. And in Claude Code, the same concept ships as custom subagents in <code>.claude/agents/</code> — D1 wearing the D3 costume.
    <p style="margin:8px 0 0"><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">→ anthropic.skilljar.com (find: Introduction to Subagents)</a></p>
  </div>
</div>

<h2>Marcus's three fixes</h2>
<h3>1 · The task packet (context isolation, done honestly)</h3>
<p>Every delegation now ships a complete, self-contained packet: the role, the <em>specific</em> slice, any needed source text, and the exact output format. If it isn't in the packet, the subagent doesn't know it.</p>
<h3>2 · Partition before delegating (the duplicate-work fix)</h3>
<p>The duplicated research wasn't a dedup problem — it was an <em>unclear boundaries</em> problem. The coordinator now slices the topic into non-overlapping subtopics <em>first</em>, then assigns one each. No overlap to clean up, because no overlap is created.</p>
<h3>3 · Provenance, by structure (the fabricated-journal fix)</h3>
<p>"Please cite carefully" is a wish. Marcus makes each finding <em>structurally</em> carry its source: claim, source URL/identifier, confidence. The synthesis step is forbidden (by format) from emitting any claim that lacks one — and a verification pass checks the sources are real before the report ships.</p>
<div class="co def"><span class="co-t">📦 Definition — Provenance</span>
The record of where each claim came from. The model loses attribution during summarization unless you force a claim→source mapping to travel with the data. A report whose claims can't be traced is not a report; it's a nicely formatted but unverifiable claim.</div>
<div class="co def"><span class="co-t">📦 Definition — Lost in the middle</span>
Models recall the <em>beginning and end</em> of a long context far better than the middle. Mitigations: put key findings at the top (primacy), repeat critical constraints at the end, use clear section headers. This drives the report layout below.</div>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>a coordinator partitions the work first, subagents start blank (they inherit nothing), and every finding carries its source by schema — hub-and-spoke keeps the work observable and budgeted.</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 3 — the Vertex Research rig, rebuilt</div>
  <p>Plain <code>anthropic</code> SDK on purpose: each subagent is literally a fresh API call with its own message list, so "subagents inherit nothing" stops being a slogan and becomes something you can see in your own code.</p>

  <div class="step"><input type="checkbox" data-key="ep4.s0"><div class="step-body">
    <div class="step-t">Step 0 — Setup</div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>mkdir vertex-rig && cd vertex-rig
pip install anthropic
export ANTHROPIC_API_KEY="sk-ant-..."</pre></div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep4.s1"><div class="step-body">
    <div class="step-t">Step 1 — A subagent is an isolated call</div>
    <p>Create <code>research_rig.py</code>:</p>
    <div class="codeblock"><span class="cb-label">research_rig.py</span><pre>import anthropic, json
client = anthropic.Anthropic()

def run_subagent(role_prompt: str, task_packet: str) -> str:
    """A brand-new context every call. The subagent knows ONLY task_packet."""
    resp = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=1024,
        system=role_prompt,
        messages=[{"role": "user", "content": task_packet}],
    )
    return resp.content[0].text</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Build the subagent so it <em>cannot</em> rely on hidden shared memory.</dd>
      <dt>LENS</dt><dd>Context isolation (D1) + context budget (D5).</dd>
      <dt>WHY</dt><dd>The messy intermediate work stays in the subagent's window; the coordinator receives only the distilled result. Isolation is the feature — not a limitation to work around.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep4.s2"><div class="step-body">
    <div class="step-t">Step 2 — The coordinator partitions, then delegates</div>
    <div class="codeblock"><span class="cb-label">research_rig.py (continued)</span><pre>def coordinate(topic: str):
    # Partition BEFORE delegating: non-overlapping slices.
    subtopics = [
        f"academic and technical research on {topic}",
        f"industry adoption and news coverage of {topic}",
    ]
    findings = []
    for st in subtopics:
        packet = (
            f"Research this specific angle ONLY: {st}.\\n"
            "Do not cover other angles; another agent handles those.\\n"
            "Return EXACTLY 3 findings as a JSON list, each with keys: "
            "claim, source (a real, checkable URL or publication), "
            "confidence (0-1). If you cannot find a real source for a "
            "claim, set source to null - do NOT invent one."
        )
        try:
            findings.append({"subtopic": st, "status": "ok",
                "result": run_subagent("You are a research subagent.", packet)})
        except Exception as e:
            # One failed slice must not sink the run: record and continue.
            findings.append({"subtopic": st, "status": "failed",
                "error_category": "transient", "detail": str(e)})
    return findings</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Distinct slices assigned up front; failures recorded as data, not raised as crashes.</dd>
      <dt>LENS</dt><dd>Proportionality (root cause: boundaries) + failure-first.</dd>
      <dt>WHY</dt><dd>Letting agents overlap and de-duplicating afterward pays full price for waste, then pays again to clean it. Partition first.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep4.s3"><div class="step-body">
    <div class="step-t">Step 3 — Synthesis with provenance and honest gaps</div>
    <div class="codeblock"><span class="cb-label">research_rig.py (continued)</span><pre>def synthesize(topic: str, findings: list) -> str:
    ok     = [f for f in findings if f["status"] == "ok"]
    failed = [f for f in findings if f["status"] != "ok"]
    report  = f"# Research Report: {topic}\\n\\n## Key findings (summary)\\n"
    report += "(top placement: models and humans both read edges best)\\n"
    for f in ok:
        report += f"\\n## {f['subtopic']}  [FULL COVERAGE]\\n{f['result']}\\n"
    for f in failed:
        report += (f"\\n## {f['subtopic']}  [!] PARTIAL - "
                   f"{f['error_category']} failure: {f['detail']}\\n")
    return report

if __name__ == "__main__":
    topic = "agentic AI systems in customer support"
    print(synthesize(topic, coordinate(topic)))</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Summary at the top, claim→source per finding, failed slices annotated — never silently dropped.</dd>
      <dt>LENS</dt><dd>Provenance + lost-in-the-middle + failure-first.</dd>
      <dt>WHY</dt><dd>A gap you can see is a known limitation; a gap that's hidden ships an incomplete report as if complete. Mark the gap; don't silently drop it.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep4.s4"><div class="step-body">
    <div class="step-t">Step 4 — PROVE IT: reproduce Vertex's bugs, watch them not happen</div>
    <ol>
      <li><strong>The blank-slate proof.</strong> Temporarily replace the packet with just <code>"Analyze the document."</code> and run it. Watch the subagent ask <em>what document?</em> — or worse, confidently analyze an imaginary one. Put the real packet back. You have now personally met the #1 multi-agent trap.</li>
      <li><strong>The provenance proof.</strong> Check the output: every claim carries a source or an honest <code>null</code>. Spot-check one URL. (In production you'd verify automatically — a fresh independent pass, not the author reviewing itself; more in EP 06.)</li>
      <li><strong>The partial-failure proof.</strong> Set your API key to garbage for one run (<code>export ANTHROPIC_API_KEY=broken</code> — restore it after!). The run should produce a report with PARTIAL sections, not a stack trace.</li>
    </ol>
    <div class="co check"><span class="co-t">🔧 Check</span>Blank packet → lost subagent. Full packet → focused result with sources. Broken slice → annotated gap, surviving report. Three Vertex Research incidents, three structural cures.</div>
  </div></div>
</div>

<h2>When NOT to multi-agent</h2>
<p>Marcus's standing rule: <strong>multi-agent is a cost you pay for isolation and parallelism — not a default.</strong> One focused agent with good tools beats a committee for most tasks. Reach for subagents when: subtask outputs are large/noisy (isolation), slices are independent (parallelism), or specializations genuinely differ. The exam's over-engineered distractor is often "split it into more agents."</p>

<div class="story">
  <div class="scene">INT. VERTEX RESEARCH — ONE WEEK LATER</div>
  <p>The token bill drops 40%. The board member's citation checks out. The research director asks what Marcus changed about "the AI's intelligence."</p>
  <p>"Nothing," Marcus says. "Intelligence was never the deficiency. Your agents were capable and uninformed, duplicated and unaccountable. I changed what they are <em>told</em>, what they are <em>assigned</em>, and what they must <em>carry back</em>."</p>
  <p>On the way out, Jordan stops in the hallway. "You know what they remind me of? Jira tickets. A hundred of them, half duplicate, none of them with enough context to actually act on." Marcus is already at the elevator. "Write that down," he says. "That's actually a good analogy."</p>
</div>

<div class="talking-head" data-person="Jordan · Junior Analyst">"Marcus said my Jira analogy was good. I'm putting that in my performance review."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Three incidents, three structural cures: blank-slate isolation (brief explicitly), unclear partitioning (slice first), and missing provenance (claim must carry source). None of these required a larger model. All of them required better architecture.</div>
`,
  quiz: [
    {
      q: "A coordinator hands a subagent the prompt \"Summarize the key risks in the contract\" and the subagent responds it has no contract. The team is baffled — \"the contract is right there in the coordinator's conversation.\" What's the fix?",
      dom: "D1",
      opts: [
        { t: "Enable context sharing between the coordinator and its subagents.", why: "No such switch — subagent isolation is structural, not a setting you toggle.", trap: "Fictional feature" },
        { t: "Pass the contract text (and the goal and output format) explicitly in the delegation — a subagent starts blank and sees only what it's handed.", correct: true, why: "The #1 multi-agent fact: no inheritance. The task packet must be self-contained." },
        { t: "Tell the subagent in its system prompt to ask the coordinator for missing materials.", why: "There's no channel for it to 'ask' through — and even with one, you'd be patching the symptom of an incomplete packet.", trap: "Wrong root cause" },
        { t: "Use one agent instead — multi-agent systems can't handle documents.", why: "They handle documents fine when context is passed properly; abandoning the architecture over a briefing bug is overcorrection.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "Two research subagents keep producing overlapping findings, doubling token cost. Best fix?",
      dom: "D1",
      opts: [
        { t: "Add a deduplication pass over the combined findings.", why: "You already paid for the duplicate work; this pays again to clean it. Symptom, not cause.", trap: "Wrong root cause" },
        { t: "Have the coordinator partition the topic into explicit non-overlapping slices before delegating, and state the boundary in each task packet (\"another agent covers X\").", correct: true, why: "Root cause is unclear boundaries. Prevent the overlap at assignment time." },
        { t: "Let subagents see each other's progress so they avoid collisions.", why: "Cross-agent visibility isn't how isolation works, and even conceptually it adds coordination machinery to dodge a problem partitioning removes outright.", trap: "Over-engineered / fictional" },
        { t: "Reduce to one subagent so overlap is impossible.", why: "Throws away parallelism to avoid writing a clear assignment. Under-engineered disguised as simplicity.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "The research system's final reports cite sources that don't exist. The proposed fix: add \"CRITICAL: only cite real sources\" to every subagent prompt. The architect's better answer?",
      dom: "D5",
      opts: [
        { t: "The proposal is fine — fabrication is a prompting problem.", why: "A wish, not a structure. The model can still fabricate; nothing checks.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Require findings in a schema where every claim carries a source (or explicit null), forbid synthesis from emitting unsourced claims, and verify sources in an independent pass before shipping.", correct: true, why: "Provenance by structure plus verification: the claim→source mapping travels with the data and gets checked by something other than its author." },
        { t: "Use a larger model for the synthesis step.", why: "Capability isn't the issue — attribution is lost structurally during summarization regardless of model size.", trap: "Over-engineered / wrong root cause" },
        { t: "Have the synthesis agent re-read its own report and remove suspicious citations.", why: "Self-review: the instance that produced the work defends its own reasoning. Verification must be independent.", trap: "Other (self-review)" }
      ]
    },
    {
      q: "Why route subagent results through a coordinator instead of letting subagents pass results directly to each other?",
      dom: "D1",
      opts: [
        { t: "Direct passing is faster, so actually peer-to-peer is preferred.", why: "Marginal latency for the loss of any central point of observation and control.", trap: "Other (observability)" },
        { t: "The hub gives one place to observe, steer, budget, and merge — peer-to-peer flows are invisible and unsteerable.", correct: true, why: "Lens 6: hub-and-spoke is chosen for observability and control, not elegance." },
        { t: "Subagents are technically unable to communicate directly.", why: "You could build direct passing; the point is you usually shouldn't. 'Impossible' is the wrong reason.", trap: "Other (wrong rationale)" },
        { t: "The coordinator caches results, halving token costs.", why: "Invented mechanism — routing through a hub doesn't inherently cache or halve anything.", trap: "Fictional feature" }
      ]
    },
    {
      q: "A search subagent returns zero results for its slice. The pipeline treats this identically to the time the search service timed out. Why is that wrong?",
      dom: "D5",
      opts: [
        { t: "It's not wrong — both are failures and should be retried.", why: "Retrying a genuine empty result wastes turns chasing data that isn't there.", trap: "Other (error conflation)" },
        { t: "\"0 results\" is a valid, informative outcome (report it as a finding); a timeout is an access failure (retry with backoff, then annotate as a gap). Different categories, different actions.", correct: true, why: "Scenario 3's signature error-handling distinction: absence of data ≠ failure to access data." },
        { t: "Zero results means the query was malformed; the subagent should rewrite it until results appear.", why: "Rewriting-until-nonempty manufactures confirmation. Sometimes the truthful answer is 'nothing exists'.", trap: "Wrong root cause" },
        { t: "Timeouts should fail the whole run so the report is never incomplete.", why: "Failure-first says the opposite: isolate the failed slice, annotate it, ship the partial with honesty.", trap: "Other (failure not first-class)" }
      ]
    },
    {
      q: "A team wants to split a simple FAQ-answering bot into five specialized subagents (greeting, lookup, tone, formatting, sign-off). The architect's call?",
      dom: "D1",
      opts: [
        { t: "Approve — specialization always improves quality.", why: "Multi-agent adds cost, latency, and coordination failure modes. It's purchased for isolation/parallelism, neither of which an FAQ bot needs.", trap: "Over-engineered" },
        { t: "Decline — one agent with a clear prompt and the right tools handles this; multi-agent is a cost paid for context isolation and parallel independent work, which this task lacks.", correct: true, why: "Proportionality. The over-engineered distractor often arrives dressed as 'more agents'." },
        { t: "Approve, but route them all through a coordinator for observability.", why: "Observability hygiene applied to an architecture that shouldn't exist for this task.", trap: "Over-engineered" },
        { t: "Decline, because subagents can't generate text responses.", why: "They generate text fine — the reason is proportionality, not capability.", trap: "Fictional feature" }
      ]
    }
  ]
});
