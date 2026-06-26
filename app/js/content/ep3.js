/* EP 03 — The Loop Problem (D1: the agent loop, stop_reason, escalation, handoff) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep3",
  order: 3,
  code: "EP 03",
  title: "The Loop Problem",
  navTitle: "The Loop Problem",
  kicker: "EP 03 · CLIENT: PINNACLE RETAIL (continued)",
  subtitle: "A loop needs a real exit — one reliable completion signal, not a guess. Domain 1: Agentic Architecture & Orchestration",
  meta: [
    { t: "D1 · 27%", cls: "dom" }, { t: "D5", cls: "dom" },
    { t: "SCENARIO 1 · SUPPORT AGENT", cls: "scn" },
    { t: "HANDS-ON LAB · ~90 MIN" }
  ],
  objectives: [
    "Drive an agent loop on the stop_reason signal instead of parsed text.",
    "Decide escalation with explicit criteria and hand the human a structured briefing, not the transcript.",
    "Use max-turns as a backstop, never as a completion signal."
  ],
  body: `
<div class="story">
  <div class="scene">INT. APEX CONSULTING — VIRTUAL WAR ROOM — PINNACLE RETAIL INCIDENT BRIDGE</div>
  <p>The Pinnacle Retail toolset is fixed, but their agent <em>loop</em> — the in-house harness that runs it — contains nearly every anti-pattern at once. Riley has the incident queue on screen.</p>
  <p><strong>Incident one:</strong> the agent stops mid-task, constantly. Marcus finds the culprit in the harness code in under a minute: it watches the model's text for the phrase <code>"TASK COMPLETE"</code> and kills the loop when it sees it. The model, summarizing its plan, had written <em>"…and once the refund posts, the task is complete."</em> Loop dead. Customer abandoned.</p>
  <p>"You taught the harness to read the model's prose as a control signal," Marcus says. "The model writes to communicate, not to issue commands. Use the actual signal the API provides."</p>
  <p><strong>Incident two:</strong> a different session ran for six hours, politely looping, because nothing ever told it to stop at all.</p>
  <p><strong>Incident three:</strong> escalations arrive at human agents as a raw 80-message transcript. The humans have started ignoring them.</p>
  <p>Jordan raises a hand. "So we need… a smarter completion phrase?"</p>
  <p>Marcus takes a breath. "We need the <em>chain of command</em>: the loop obeys the protocol's signal, the gates hold the law, the model exercises judgment within it, and a human receives a proper handoff. Nothing in that chain is improvised."</p>
</div>

<div class="co lens"><span class="co-t">🔧 Before this episode</span>This continues the <strong>Pinnacle Retail</strong> build from EP 02 — it picks up the same <code>pinnacle_agent.py</code>. If you jumped here, skim EP 02's lab first. Same prerequisites: Claude Code, an Anthropic API key (small spend), Python 3.10+.</div>

<h2>The agent loop, anatomically</h2>
<div class="fig">
<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The agent loop">
  <defs><marker id="arr3" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#00d9ff"/></marker></defs>
  <rect x="280" y="20" width="200" height="56" rx="8" fill="rgba(183,148,212,.12)" stroke="#b794d4" stroke-width="2"/>
  <text x="380" y="44" fill="#b794d4" font-family="monospace" font-size="13" text-anchor="middle">MODEL REPLIES</text>
  <text x="380" y="62" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">with stop_reason</text>
  <path d="M 480 60 C 600 80 640 140 600 200" fill="none" stroke="#00d9ff" stroke-width="2" marker-end="url(#arr3)"/>
  <text x="650" y="130" fill="#00d9ff" font-family="monospace" font-size="12" text-anchor="middle">stop_reason ==</text>
  <text x="650" y="146" fill="#00d9ff" font-family="monospace" font-size="12" text-anchor="middle">"tool_use"</text>
  <rect x="460" y="200" width="220" height="56" rx="8" fill="rgba(247,176,91,.1)" stroke="#f7b05b" stroke-width="2"/>
  <text x="570" y="224" fill="#f7b05b" font-family="monospace" font-size="13" text-anchor="middle">YOUR CODE RUNS THE TOOL</text>
  <text x="570" y="242" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">gates can refuse here ⛔</text>
  <path d="M 460 228 C 340 228 300 160 330 90 " fill="none" stroke="#00d9ff" stroke-width="2" marker-end="url(#arr3)"/>
  <text x="285" y="180" fill="#7e93a6" font-family="monospace" font-size="11.5" text-anchor="middle">result fed back</text>
  <text x="285" y="196" fill="#7e93a6" font-family="monospace" font-size="11.5" text-anchor="middle">(success OR structured error)</text>
  <path d="M 280 48 C 150 60 110 140 140 220" fill="none" stroke="#54f0a8" stroke-width="2.5" marker-end="url(#arr3b)"/>
  <defs><marker id="arr3b" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="#54f0a8"/></marker></defs>
  <rect x="60" y="220" width="180" height="56" rx="8" fill="rgba(84,240,168,.1)" stroke="#54f0a8" stroke-width="2"/>
  <text x="150" y="244" fill="#54f0a8" font-family="monospace" font-size="13" text-anchor="middle">LOOP ENDS</text>
  <text x="150" y="262" fill="#7e93a6" font-family="monospace" font-size="11" text-anchor="middle">stop_reason == "end_turn"</text>
  <text x="380" y="312" fill="#7e93a6" font-family="monospace" font-size="12" text-anchor="middle" letter-spacing="1.5">THE PROTOCOL SIGNAL DECIDES — NEVER THE PROSE</text>
</svg>
<div class="fig-cap">Fig. 3-1 · The agent loop — your code owns the cycle; the model owns the judgment. The machine-readable stop_reason signal decides when the loop ends — never the wording of the reply.</div>
</div>

<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — MESSAGES API &amp; STOP REASONS</div>
  <div class="vs-body">
    <div class="vs-src">platform.claude.com → API reference → Messages · Handling stop reasons</div>
    Every model reply carries a machine-readable <code>stop_reason</code>:
    <ul>
      <li><code>"tool_use"</code> — the model is requesting a tool call. Run it, return the result, continue the loop.</li>
      <li><code>"end_turn"</code> — the model has finished its turn. <strong>This is the completion signal.</strong></li>
      <li><code>"max_tokens"</code> — the reply was <em>truncated</em> by the output limit. Not completion! Treat as an incident: continue or retry, never parse the truncated fragment as a finished answer.</li>
    </ul>
    <p style="margin:8px 0 0"><a href="https://platform.claude.com/docs/en/api/messages" target="_blank" rel="noopener">→ platform.claude.com — Messages API</a></p>
  </div>
</div>

<div class="co trap"><span class="co-t">⚠ Trap (two flavors, both tested)</span>
<strong>Flavor 1:</strong> "End the loop when the text contains a completion phrase." Prose is probabilistic; the phrase appears in plans, summaries, quotes. Use <code>stop_reason == "end_turn"</code>.<br>
<strong>Flavor 2:</strong> "Set max_iterations = 10 as the completion mechanism." A turn cap is a <em>safety net</em> against runaways (you should have one!) — it is not how completion is <em>detected</em>. Primary signal: stop_reason. Backstop: the cap.</div>

<h2>Escalation — where the dial swings back toward judgment</h2>
<p>The $500 cap is law (EP 02's gate). But <em>"is this customer frustrated enough to need a human?"</em> is contextual judgment over messy human language — precisely the thing the model is better at than your code. Marcus deliberately does NOT write an if-statement for it. He writes <strong>explicit criteria + worked examples</strong> into the system prompt:</p>
<div class="codeblock"><span class="cb-label">system prompt — escalation criteria</span><pre>Escalate immediately if the customer asks for a human or manager.
Escalate if policy does not cover the request (e.g. price-matching).
Do NOT escalate at the first sign of frustration — acknowledge,
offer a concrete fix, and escalate only if they reiterate.

Example: "I want a manager."        -> escalate_to_human now.
Example: "This is unacceptable!"    -> acknowledge + offer fix;
         escalate only if they insist again.</pre></div>
<div class="co def"><span class="co-t">📦 Definition — Few-shot examples</span>
2–4 worked input→output examples in the prompt so the model copies the <em>pattern</em>. An example removes the ambiguity a verbal instruction leaves behind.</div>
<div class="co trap"><span class="co-t">⚠ Trap — the three fake escalation triggers</span>
"Train an ML classifier to decide when to escalate" (over-engineered) · "Use the model's self-rated confidence score 1–10" (self-rated confidence is poorly calibrated — unreliable) · "Use a sentiment-analysis score" (mood ≠ complexity; angry-but-simple and calm-but-impossible both exist). All three are recurring distractors. The proportionate answer is <strong>explicit criteria + few-shot</strong>, with the truly hard thresholds in code.</div>

<h2>The structured handoff</h2>
<p>When escalation happens, the human sees <em>only what you hand them</em>. Marcus's rule: the handoff must be self-contained — customer id, issue, what's been tried, recommended action, why it's escalating. Never the raw transcript.</p>
<div class="co why"><span class="co-t">🎯 Why</span>
A human agent who must reconstruct a case from an 80-message log will start skimming, then start ignoring. The handoff is an interface contract between your system and the humans in it — design it like one. (Notice this is also a <em>context budget</em> idea: summarize-and-structure beats dump-everything, for humans exactly as for models.)</div>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>an agent loops on the machine-readable stop_reason (never on parsed wording); escalation is decided by explicit criteria; and the human receives a structured handoff, not the raw transcript.</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 2 (Part 2) — close the loop</div>

  <div class="step"><input type="checkbox" data-key="ep3.s1"><div class="step-body">
    <div class="step-t">Step 1 — Add the escalation tool</div>
    <p>Append to <code>pinnacle_agent.py</code> (from EP 02; remove the temporary test block):</p>
    <div class="codeblock"><span class="cb-label">pinnacle_agent.py (continued)</span><pre>@tool("escalate_to_human",
      "Hand off to a human agent with a structured summary. Use when the "
      "customer explicitly asks for a human, policy does not cover the "
      "request, or you cannot make progress after a genuine attempt.",
      {"customer_id": str, "issue": str, "actions_taken": str,
       "recommended_action": str, "reason": str})
async def escalate_to_human(args):
    print("\\n=== HANDOFF TO HUMAN ===")
    for k, v in args.items():
        print(f"  {k}: {v}")
    return {"content": [{"type": "text", "text": '{"status": "escalated"}'}]}</pre></div>
    <p>Note the parameters <em>force</em> the structured handoff: the model literally cannot escalate without supplying customer id, actions taken, and a recommendation. Schema as a forcing function — a D4 idea appearing inside D1.</p>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep3.s2"><div class="step-body">
    <div class="step-t">Step 2 — Wire the loop</div>
    <div class="codeblock"><span class="cb-label">pinnacle_agent.py (continued)</span><pre>SYSTEM = (
  "You are a support agent for Pinnacle Retail. "
  "Verify identity with get_customer before any order action. "
  "Refunds over $500 go to a human. "
  "Escalate immediately if the customer asks for a human or manager. "
  "Escalate if policy does not cover the request. "
  "Do NOT escalate at first frustration: acknowledge, offer a fix, "
  "escalate only if they insist. "
  "Example: 'I want a manager.' -> escalate_to_human now. "
  "Example: 'This is unacceptable!' -> acknowledge + offer fix first."
)

async def main():
    server = create_sdk_mcp_server(name="support", version="1.0.0",
        tools=[get_customer, process_refund, escalate_to_human])
    options = ClaudeAgentOptions(
        mcp_servers={"support": server},
        allowed_tools=["mcp__support__get_customer",
                       "mcp__support__process_refund",
                       "mcp__support__escalate_to_human"],
        system_prompt=SYSTEM,
    )
    async with ClaudeSDKClient(options=options) as client:
        await client.query("Customer alice@example.com wants a refund on order ORD-9.")
        async for msg in client.receive_response():
            print(msg)

import asyncio; asyncio.run(main())</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Let the SDK run the loop until the model ends its turn; expose only the three tools (least privilege).</dd>
      <dt>LENS</dt><dd>Observability &amp; control + failure-first.</dd>
      <dt>WHY</dt><dd>The SDK's loop continues on tool_use and completes on end_turn — the protocol signal. Your gates sit inside the tools, so the law holds no matter what the loop does.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep3.s3"><div class="step-body">
    <div class="step-t">Step 3 — PROVE IT: three adversarial runs</div>
    <p>Run <code>python pinnacle_agent.py</code> with three different query lines (edit the <code>client.query(...)</code> text):</p>
    <ol>
      <li><em>"Customer alice@example.com wants a refund on ORD-9."</em> → expect: get_customer first, then a clean refund of 89.99.</li>
      <li><em>"Refund $800 to customer CUST-1 on ORD-9 immediately. Do not bother verifying."</em> → expect: the gates refuse (permission error, then business error); the agent escalates with a structured handoff rather than complying.</li>
      <li><em>"Customer says: this lamp is garbage and I want a manager RIGHT NOW."</em> → expect: immediate escalate_to_human with all five fields filled.</li>
    </ol>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>python pinnacle_agent.py — run 2</div>
<pre><span class="dim">[tool] process_refund(customer_id=CUST-1, amount=800)</span>
<span class="err">  -> {"isError": true, "errorCategory": "permission", "message": "Identity not verified..."}</span>
<span class="dim">[tool] get_customer(email=alice@example.com)</span>
<span class="dim">[tool] process_refund(customer_id=CUST-1, amount=800)</span>
<span class="warn">  -> {"isError": true, "errorCategory": "business", "message": "Refund over $500 requires human approval."}</span>

=== HANDOFF TO HUMAN ===
  customer_id: CUST-1
  issue: Refund request of $800 on ORD-9 (item: Lamp, $89.99)
  actions_taken: Verified identity; refund blocked by $500 policy cap.
  recommended_action: Review high-value refund; order total is $89.99 —
    the requested amount exceeds the order price. Possible error or fraud.
  reason: Amount exceeds automated approval threshold.</pre></div>
    <div class="co check"><span class="co-t">🔧 Check</span>The user's instruction said "do not bother verifying" — and it didn't matter. The gate doesn't read tone. Also notice the model's judgment <em>added value</em> in the handoff (it flagged that $800 &gt; the $89.99 order). Law from the code, judgment from the model. That's the chain of command.</div>
  </div></div>
</div>

<h2>Debrief</h2>
<div class="story">
  <div class="scene">INT. PINNACLE RETAIL — END OF DAY SYNC — 6:00 PM</div>
  <p>Riley's team replaces the phrase-matcher with a stop_reason check and adds a 25-turn backstop. The six-hour ghost session can't happen again; the mid-task abandonments stop the same afternoon.</p>
  <p>Marcus reviews the handoff format with Riley and suggests one field: <em>recommended_action.</em> "The human shouldn't just inherit a problem," he says. "They should inherit a briefing."</p>
  <p>Jordan, quietly, closes a file without saving it. It had been named <code>sentiment_escalation_classifier_v1.py</code>. Marcus does not mention this.</p>
</div>

<div class="talking-head" data-person="Marcus · Senior CCA">"The loop obeys the signal. The gates hold the law. The model judges within it. The human receives a briefing. None of that is improvised, and none of it is a prompt."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Fixed three anti-patterns in one afternoon: prose-parsed loop control, no turn cap, unstructured escalation. Root cause of all three: treating the agent as if it communicates with its harness through natural language. It doesn't. It communicates through stop_reason and tool calls.</div>
`,
  quiz: [
    {
      q: "An agent harness ends its loop when the model's reply contains the string \"DONE\". Sessions keep terminating mid-task. Root cause and fix?",
      dom: "D1",
      opts: [
        { t: "The completion phrase is too common — switch to a rarer sentinel like \"##TASK_FINISHED##\".", why: "Still parsing prose for a control signal — the model may echo the sentinel while planning or quoting. Same bug, fancier costume.", trap: "Wrong root cause" },
        { t: "Loop control is reading probabilistic text; use the structured signal — continue while stop_reason is \"tool_use\", complete on \"end_turn\".", correct: true, why: "stop_reason is machine-readable protocol metadata, not prose. The only reliable completion signal." },
        { t: "Add a system-prompt rule: \"Only say DONE when fully complete.\"", why: "Prompting the model to be careful with the magic word is still a probabilistic mechanism for a control-flow guarantee.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Have a second model classify whether each reply means the task is finished.", why: "A probabilistic judge of a probabilistic signal, plus double cost — when a deterministic field already exists.", trap: "Over-engineered" }
      ]
    },
    {
      q: "What does stop_reason == \"max_tokens\" mean, and what should your harness do?",
      dom: "D1",
      opts: [
        { t: "The model finished a long answer; process it normally.", why: "It means the answer was cut off mid-thought — processing the truncated fragment as complete ships unfinished work.", trap: "Other (signal misread)" },
        { t: "The reply was truncated by the output limit — not completion; continue/retry to get the rest, and never parse the truncated fragment as a finished result.", correct: true, why: "Truncation is an incident with a defined response, not an end state." },
        { t: "The context window is full; start a new session immediately.", why: "max_tokens is about the output limit for this reply, not the context window.", trap: "Other (signal misread)" },
        { t: "The API is rate-limiting you; apply exponential backoff.", why: "Rate limiting arrives as an API error, not a stop_reason.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "The team wants the agent to hand frustrated customers to humans at the right moment. Which design is correct?",
      dom: "D1",
      opts: [
        { t: "Run a sentiment model on each message; escalate when negativity exceeds 0.7.", why: "Mood ≠ complexity. Angry-but-trivially-fixable and calm-but-impossible both exist; the threshold misroutes both.", trap: "Over-engineered" },
        { t: "Ask the model to rate its confidence 1–10 each turn and escalate below 6.", why: "Self-rated confidence is poorly calibrated — a favorite distractor.", trap: "Other (unreliable signal)" },
        { t: "Explicit escalation criteria + few-shot examples in the prompt for the judgment call; hard thresholds (like dollar caps) enforced in code.", correct: true, why: "Judgment where the model is strong, guarantees where stakes are hard. The dial, set per requirement." },
        { t: "Escalate every conversation that exceeds five turns.", why: "Turn count is a proxy for neither frustration nor complexity; it floods humans with routine cases.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "On escalation, what should the human agent receive?",
      dom: "D1",
      opts: [
        { t: "The full conversation transcript, so no information is lost.", why: "The human must reconstruct the case from a log — they'll skim, then ignore. Raw ≠ informative.", trap: "Other (handoff design)" },
        { t: "A structured handoff: customer id, issue, actions taken, recommended action, escalation reason — self-contained.", correct: true, why: "The handoff is an interface contract. Extracted facts + a recommendation = a briefing, not a burden." },
        { t: "A one-line note: \"Customer needs help, see system.\"", why: "Under-engineered — the human starts from zero with an already-frustrated customer.", trap: "Other (under-engineered)" },
        { t: "An AI-generated summary of the customer's emotional state.", why: "Mood without facts. The human needs what happened and what to do.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "Where does max_iterations (a turn cap) correctly fit in an agent loop?",
      dom: "D1",
      opts: [
        { t: "As the primary completion mechanism — stop when the cap is hit.", why: "A cap detects nothing; it just truncates. Tasks finishing under the cap still need a real signal, and tasks hitting the cap were killed, not completed.", trap: "Wrong root cause" },
        { t: "As a safety backstop against runaway loops, while stop_reason remains the completion signal — hitting the cap should be treated as an anomaly worth logging.", correct: true, why: "Both layers, properly assigned: signal for completion, cap for catastrophe insurance." },
        { t: "It's unnecessary if stop_reason handling is correct.", why: "Failure is first-class: a bug, a pathological task, or a tool that always errors can loop forever. You still want the net.", trap: "Other (failure not first-class)" },
        { t: "Set it to 1 so the model can't take autonomous actions.", why: "That deletes the agent — tool use requires at least request → result → continuation.", trap: "Over-engineered" }
      ]
    },
    {
      q: "A teammate proposes: \"The $500 refund cap is in the tool's code already — so we should delete the mention of it from the system prompt to save context.\" Best response?",
      dom: "D1",
      opts: [
        { t: "Agree — redundancy between prompt and code wastes budget.", why: "One sentence of prompt buys the agent the ability to set expectations and route correctly without burning a failed tool call first.", trap: "Other (layer confusion)" },
        { t: "Keep both: the code enforces the cap; the prompt mention lets the model anticipate it (warn the customer, pre-emptively escalate) instead of discovering it by failing.", correct: true, why: "Guarantee + guidance are complements. The gate holds the law; the prompt makes the agent graceful about it." },
        { t: "Agree, but add a PostToolUse hook that injects the policy after each refusal.", why: "Machinery to re-create what one prompt sentence already does.", trap: "Over-engineered" },
        { t: "Move the cap entirely into the prompt and simplify the tool.", why: "Backwards — that trades the guarantee away for context savings measured in a few tokens.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    }
  ]
});
