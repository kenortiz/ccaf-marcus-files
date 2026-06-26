/* EP 02 — Tools of the Trade (D2: tool design, MCP, structured errors) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep2",
  order: 2,
  code: "EP 02",
  title: "Tools of the Trade",
  navTitle: "Tools of the Trade",
  kicker: "EP 02 · CLIENT: PINNACLE RETAIL — AI Support Agent",
  subtitle: "A tool description is the model's only sense organ — Domain 2: Tool Design & MCP Integration",
  meta: [
    { t: "D2 · 18%", cls: "dom" }, { t: "D1", cls: "dom" },
    { t: "SCENARIO 1 · SUPPORT AGENT", cls: "scn" },
    { t: "HANDS-ON LAB · ~90 MIN" }
  ],
  objectives: [
    "Write a tool description that sets boundaries (what it does, when to use it, when not, what it returns).",
    "Classify a capability as a tool (model-controlled), a resource (app-controlled), or a prompt (user template).",
    "Design a structured error carrying a category and retryability, not just a message."
  ],
  body: `
<div class="story">
  <div class="scene">INT. PINNACLE RETAIL — CUSTOMER OPERATIONS — THURSDAY, 2:00 PM</div>
  <p>Pinnacle Retail runs a national e-commerce operation, and their new AI support agent is — per the client's own dashboard — "actively costing us money."</p>
  <p>The symptoms, as presented by their operations manager Riley, in a tone that suggests she has explained this to three different vendors already: the agent calls the wrong backend function constantly. Asked about an order, it checks loyalty points. Asked for a refund, it opens a complaint ticket. And when a lookup fails, the agent tells the customer "<em>an error occurred</em>" and goes quiet, because that is genuinely all it knows.</p>
  <p>Marcus asks to see the tool definitions. There are <strong>fourteen</strong> of them. He reads the first three descriptions aloud:</p>
  <p><code>handle_customer_thing — handles customer requests</code><br>
  <code>customer_helper — helps with customer stuff</code><br>
  <code>do_support — support actions</code></p>
  <p>Jordan, behind Marcus, makes a face. "Who wrote these?"</p>
  <p>"Someone who believed the model could read minds," Marcus says. "It cannot. It can only read <em>descriptions</em>. These are its eyes. We've given it fourteen blurry ones."</p>
  <p>Riley asks if they should "build a routing classifier in front of the model." Marcus holds up a hand: <em>not yet.</em> First, the four questions.</p>
</div>

<h2>The four questions, run on Pinnacle Retail</h2>
<ol>
  <li><strong>Root cause?</strong> Not "the model is bad at picking tools." The model picks tools <em>from their descriptions</em> — and the descriptions are interchangeable mush. Garbage in, misrouted calls out.</li>
  <li><strong>Needs a guarantee?</strong> Tool <em>selection</em> is the model's judgment (probabilistic, by design). What needs guarantees: which tools are even <em>available</em> (least privilege), and how failures are <em>reported</em> (structured, every time).</li>
  <li><strong>Smallest sufficient fix?</strong> Rewrite the descriptions; merge overlapping tools. Not a routing classifier (over-engineered — and now you maintain two AI systems).</li>
  <li><strong>Observability / failure?</strong> Errors must come back structured — category, retryability, message — so the agent can <em>act</em> on failure rather than apologize vaguely.</li>
</ol>

<div class="viewscreen skilljar">
  <div class="vs-head">SKILLJAR // ANTHROPIC ACADEMY</div>
  <div class="vs-body">
    <div class="vs-src">Course queue: <strong>Introduction to Model Context Protocol</strong></div>
    Marcus's pull-quotes from the course: tools are <em>model-controlled actions</em>; resources are <em>application-controlled data</em>; prompts are <em>user-controlled templates</em>. And the line he underlines twice: <strong>"The description field is doing more work than your code is."</strong>
    <p style="margin:8px 0 0"><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">→ anthropic.skilljar.com (find: Introduction to MCP · MCP Advanced Topics)</a></p>
  </div>
</div>

<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — TOOL USE</div>
  <div class="vs-body">
    <div class="vs-src">platform.claude.com → Build with Claude → Tool use</div>
    <ul>
      <li>The model chooses tools by reading each tool's <strong>name, description, and input schema</strong>. That's the entire decision surface.</li>
      <li>Write descriptions that say <strong>what the tool does, when to use it, when NOT to use it</strong>, and what it returns.</li>
      <li><strong>Fewer, sharper tools beat many vague ones.</strong> Overlapping tools force coin-flips.</li>
      <li>Tool results you return can signal errors (<code>is_error</code>) — and the <em>content</em> of an error should help the model decide what to do next.</li>
    </ul>
    <p style="margin:8px 0 0"><a href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" target="_blank" rel="noopener">→ platform.claude.com — Tool use overview</a> · <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">modelcontextprotocol.io</a></p>
  </div>
</div>

<h2>Teaching moment: the description rewrite</h2>
<p>Marcus rewrites one tool live so the team can watch the thinking. Before:</p>
<div class="codeblock"><span class="cb-label">BEFORE — interchangeable mush</span><pre>name: customer_helper
description: helps with customer stuff</pre></div>
<p>After:</p>
<div class="codeblock"><span class="cb-label">AFTER — a boundary-setting sense organ</span><pre>name: get_customer
description: Look up a customer record by email address. MUST be called
  before any order or refund action, to verify identity. Returns the
  customer's id, name, and tier. Use ONLY for lookup/verification —
  this tool never modifies anything. For order history, use get_orders.</pre></div>
<p>Count what that description carries: <strong>what it does</strong> (lookup by email) · <strong>when it's required</strong> (before any order/refund action) · <strong>what it returns</strong> (id, name, tier) · <strong>what it's NOT for</strong> (no modification; order history lives elsewhere). The model couldn't confuse it with a sibling tool if it tried.</p>

<div class="co why"><span class="co-t">🎯 Why this is lens 4 — design for model behavior</span>
You cannot <em>force</em> correct tool selection (that's judgment, probabilistic). But you can shape the decision environment so the right choice is overwhelmingly likely: precise descriptions, non-overlapping scopes, few tools. Steering beats forcing — and when steering isn't enough, that's what gates are for (next episode).</div>

<div class="co trap"><span class="co-t">⚠ Trap</span>
"The agent keeps picking the wrong tool — put a routing classifier (or a second model) in front of it." Over-engineered. The proportionate fix is almost always <strong>better descriptions and fewer, non-overlapping tools</strong>. The routing layer also has to be maintained, monitored, and debugged — you've doubled your problem surface.</div>

<h2>MCP in one viewscreen</h2>
<div class="co def"><span class="co-t">📦 Definition — MCP server / client</span>
An <strong>MCP server</strong> wraps an external system (database, GitHub, your company API) and exposes it in the standard protocol. The <strong>client</strong> (Claude Code, your agent app) connects to servers and makes their capabilities available to the model. One standard port; no custom connector per system.</div>
<table>
  <tr><th>MCP primitive</th><th>Controlled by</th><th>It is…</th><th>Pinnacle example</th></tr>
  <tr><td><strong>Tool</strong></td><td>The model</td><td>An <em>action</em> the model may decide to take</td><td><code>process_refund</code>, <code>get_orders</code></td></tr>
  <tr><td><strong>Resource</strong></td><td>The application</td><td><em>Data/context</em> your app chooses to provide</td><td>The current return-policy document</td></tr>
  <tr><td><strong>Prompt</strong></td><td>The user</td><td>A reusable <em>template</em> a human invokes</td><td>"Draft a goodwill-credit reply" template</td></tr>
</table>
<div class="co tip"><span class="co-t">💡 The tool-vs-resource rule</span>
Ask: <em>who decides this happens?</em> If the model should decide in-flight ("I need this customer's orders now") → <strong>tool</strong>. If your application decides what context to supply ("every session gets the current policy doc") → <strong>resource</strong>. Exam questions love an action wrongly modeled as a resource, or static reference data wrongly modeled as a tool the model must remember to call.</div>

<h2>Structured errors: failure as data, not apology</h2>
<p>The second root cause at Pinnacle Retail: every backend failure came back as the string <code>"operation failed"</code>. The agent can't act on that — retry? give up? escalate? It has no idea, so it apologizes and stalls. Marcus's standard error payload:</p>
<div class="codeblock"><span class="cb-label">a structured error result</span><pre>{
  "isError": true,
  "errorCategory": "transient",      // transient | validation | business | permission
  "retryable": true,
  "message": "Order service timed out after 5s.",
  "suggestion": "Retry once; if it fails again, tell the customer and offer escalation."
}</pre></div>
<p>Now the agent's next move is <em>computable from the payload</em>: transient → retry with backoff; validation → fix the input, don't retry blindly; business rule → explain to the customer (this isn't a malfunction!); permission → stop and escalate. Full taxonomy drills in <a href="#/ep6">EP 06</a>.</p>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>a tool's description is the model's decision surface — fewer, sharper, non-overlapping tools beat many vague ones, and you grant only the narrowest capability the task needs (least privilege).</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 2 (Part 1) — Pinnacle Retail tools, done right</div>
  <p>You'll build the support agent's toolset with the Claude Agent SDK. (Part 2 — the loop and escalation — is next episode; the file you start here continues there.)</p>

  <div class="step"><input type="checkbox" data-key="ep2.s0"><div class="step-body">
    <div class="step-t">Step 0 — Setup</div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>mkdir pinnacle-agent && cd pinnacle-agent
pip install claude-agent-sdk
export ANTHROPIC_API_KEY="sk-ant-..."   # from console.anthropic.com</pre></div>
    <div class="co def"><span class="co-t">📦 Definition — API key</span>A secret string identifying you to Anthropic's servers. Get one at <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a>. These labs cost small amounts. Never paste the key into code — the SDK reads the environment variable.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep2.s1"><div class="step-body">
    <div class="step-t">Step 1 — The lookup tool with a boundary-setting description</div>
    <p>Create <code>pinnacle_agent.py</code>:</p>
    <div class="codeblock"><span class="cb-label">pinnacle_agent.py</span><pre>from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

# A pretend database, so the build runs without a real backend.
CUSTOMERS = {"alice@example.com": {"id": "CUST-1", "name": "Alice", "tier": "standard"}}
ORDERS = {"CUST-1": [{"order_id": "ORD-9", "item": "Lamp", "status": "delivered", "price": 89.99}]}

# Tracks who has been identity-verified this session (the deterministic gate).
VERIFIED = set()

@tool("get_customer",
      "Look up a customer by email. MUST be called before any order or "
      "refund action to verify identity. Returns the customer's id, name, "
      "and tier. Lookup only — never modifies anything.",
      {"email": str})
async def get_customer(args):
    c = CUSTOMERS.get(args["email"])
    if not c:
        return {"content": [{"type": "text", "text":
            '{"isError": true, "errorCategory": "validation", '
            '"retryable": false, "message": "No customer with that email."}'}]}
    VERIFIED.add(c["id"])   # mark identity verified
    return {"content": [{"type": "text", "text": str(c)}]}</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>The description tells the model what the tool does, when it's mandatory, what it returns, and what it never does.</dd>
      <dt>LENS</dt><dd>Design for model behavior.</dd>
      <dt>WHY</dt><dd>The model selects tools by reading descriptions. Precision here is how you steer selection — not a routing layer.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep2.s2"><div class="step-body">
    <div class="step-t">Step 2 — The refund tool with two gates (the guarantees)</div>
    <p>Append to <code>pinnacle_agent.py</code>:</p>
    <div class="codeblock"><span class="cb-label">pinnacle_agent.py (continued)</span><pre>@tool("process_refund",
      "Refund an order. Requires a verified customer_id (from get_customer) "
      "and the order_id. Refunds above $500 cannot be processed by this "
      "tool and are escalated to a human.",
      {"customer_id": str, "order_id": str, "amount": float})
async def process_refund(args):
    # GATE 1 — identity must already be verified (deterministic precondition).
    if args["customer_id"] not in VERIFIED:
        return {"content": [{"type": "text", "text":
            '{"isError": true, "errorCategory": "permission", "retryable": false, '
            '"message": "Identity not verified. Call get_customer first."}'}]}
    # GATE 2 — the $500 cap (deterministic threshold).
    if args["amount"] > 500:
        return {"content": [{"type": "text", "text":
            '{"isError": true, "errorCategory": "business", "retryable": false, '
            '"message": "Refund over $500 requires human approval. Escalating."}'}]}
    return {"content": [{"type": "text", "text":
        '{"status": "refunded", "amount": ' + str(args["amount"]) + '}'}]}</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Identity-before-refund and the $500 cap live <em>in code</em>, inside the tool.</dd>
      <dt>LENS</dt><dd>Determinism dial — code-enforced side.</dd>
      <dt>WHY</dt><dd>Financial/compliance consequences → must hold every time. A prompt holds <em>most</em> of the time, which is not good enough for money. (In Claude Code, the same move is a PreToolUse hook — same architecture, different costume.)</dd>
    </dl>
    <div class="co trap"><span class="co-t">⚠ Trap — Scenario 1's signature question</span>"12% of the time the agent refunds without verifying identity — improve the system prompt / add few-shot examples." Wrong. A correctness-critical <em>sequence</em> needs a programmatic precondition. The right answer mentions a gate, a hook, or code — not better wording.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep2.s3"><div class="step-body">
    <div class="step-t">Step 3 — Prove the gates (without even running the agent yet)</div>
    <p>Add a quick test at the bottom and run <code>python pinnacle_agent.py</code>:</p>
    <div class="codeblock"><span class="cb-label">pinnacle_agent.py (temporary test)</span><pre>import asyncio

async def _test_gates():
    # Refund WITHOUT verification -> must be refused.
    r1 = await process_refund({"customer_id": "CUST-1", "order_id": "ORD-9", "amount": 50})
    print("unverified refund ->", r1["content"][0]["text"])
    # Verify, then refund over the cap -> must be refused.
    await get_customer({"email": "alice@example.com"})
    r2 = await process_refund({"customer_id": "CUST-1", "order_id": "ORD-9", "amount": 800})
    print("over-cap refund   ->", r2["content"][0]["text"])
    # Verified and under cap -> succeeds.
    r3 = await process_refund({"customer_id": "CUST-1", "order_id": "ORD-9", "amount": 50})
    print("valid refund      ->", r3["content"][0]["text"])

asyncio.run(_test_gates())</pre></div>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>python pinnacle_agent.py</div>
<pre><span class="dim">$ python pinnacle_agent.py</span>
unverified refund -> <span class="err">{"isError": true, "errorCategory": "permission", ... "Call get_customer first."}</span>
over-cap refund   -> <span class="warn">{"isError": true, "errorCategory": "business", ... "requires human approval."}</span>
valid refund      -> <span class="ok">{"status": "refunded", "amount": 50}</span></pre></div>
    <div class="co check"><span class="co-t">✓ Check</span>Both gates refuse <em>deterministically</em> — no model involved in the refusal. That's the point: the guarantee doesn't depend on anyone's prompt. (Delete the test block after — Part 2 builds the real loop here.)</div>
  </div></div>
</div>

<h2>Debrief</h2>
<div class="story">
  <div class="scene">INT. PINNACLE RETAIL — WRAP-UP CALL — 5:15 PM</div>
  <p>Fourteen tools become six. Every description now states scope, preconditions, returns, and exclusions. Errors come back as data the agent can act on. Misrouted calls drop from the dashboard within a day.</p>
  <p>Riley is satisfied and immediately asks if they can add nine more tools "since you're already here." Marcus declines on principle — and explains why, for the third time, in the same call. Jordan, taking notes, writes: <em>"Fewer, sharper tools. Pay the context cost only for what the agent actually needs."</em></p>
  <p>Sam, on the follow-up Slack, calls this "a landmark in our AI transformation journey." Marcus sends a thumbs-up emoji and closes his laptop.</p>
</div>

<div class="talking-head" data-person="Marcus · Senior CCA">"A tool description is not documentation for humans. It is the model's only sense organ. Fourteen blurry eyes isn't a routing problem. It's a description problem."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Six tools, sharp descriptions, structured errors. The misrouting dissolved because it was never a routing problem. The client now wants to add more tools. I said no. This will come up again.</div>
`,
  quiz: [
    {
      q: "An agent has tools search_orders (\"search orders\"), find_purchases (\"find customer purchases\"), and lookup_history (\"look up history\"). It frequently calls the wrong one. The proportionate fix?",
      dom: "D2",
      opts: [
        { t: "Add an intent-classification model in front that routes to the correct tool.", why: "A second AI system to compensate for bad descriptions — now you maintain, monitor, and debug two.", trap: "Over-engineered" },
        { t: "Merge them into one well-described tool (they all query order history) with clear parameters.", correct: true, why: "They overlap entirely — the model is coin-flipping between synonyms. Fewer, sharper, non-overlapping tools is the root-cause fix." },
        { t: "Add a system-prompt section explaining which of the three tools to use in which case.", why: "Patches over the real problem (redundant tools) and burns always-loaded context to do it.", trap: "Wrong root cause" },
        { t: "Set tool_choice to force the correct tool for each request.", why: "Forcing requires already knowing the right tool per request — which is the whole problem. Forcing is for guaranteed-shape output, not routine routing.", trap: "Fictional feature / misapplied" }
      ]
    },
    {
      q: "Your support agent should always have the current return-policy document available, and should be able to look up a customer's orders when it decides it needs them. How do you model these in MCP?",
      dom: "D2",
      opts: [
        { t: "Both as tools — the model fetches the policy when needed.", why: "The policy isn't an in-flight decision; making it a tool means the model must remember to fetch it (probabilistic) when the app could simply supply it (deterministic).", trap: "Other (dial misread)" },
        { t: "Policy as a resource (application-controlled context), order lookup as a tool (model-controlled action).", correct: true, why: "Who decides? App decides every session gets the policy → resource. Model decides when it needs orders → tool." },
        { t: "Both as resources, refreshed each session.", why: "Order lookup is a parameterized action the model takes mid-conversation — that's a tool by definition.", trap: "Other (dial misread)" },
        { t: "Policy in the system prompt, orders as a resource.", why: "Policy-in-prompt is workable, but orders-as-resource breaks: the app can't know in advance which customer's orders the conversation needs.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "A backend tool call fails and returns the string \"Error: operation failed\". What's the architectural problem?",
      dom: "D2",
      opts: [
        { t: "Nothing — the agent knows the call failed and can apologize to the user.", why: "Failure-blindness: the agent can't choose retry vs. fix-input vs. explain vs. escalate from 'operation failed'.", trap: "Other (failure not first-class)" },
        { t: "The error gives the agent no basis for action — it should be structured: category (transient/validation/business/permission), retryability, and a message.", correct: true, why: "Failure is first-class: an error is data that drives the agent's next decision, not an apology string." },
        { t: "The tool should retry internally until it succeeds, so the agent never sees errors.", why: "Infinite/blind retries hang on permanent failures, and hiding all failure removes the agent's ability to escalate or inform the user.", trap: "Wrong root cause" },
        { t: "Errors should be sent to a logging service for the engineering team to review weekly.", why: "Observability is good but doesn't help the agent act in the moment.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "The team is adding a 15th tool to the support agent (\"check_warehouse_humidity — might be useful someday\"). Why does the architect push back?",
      dom: "D2",
      opts: [
        { t: "Each tool's definition consumes context budget every turn, and every added tool dilutes selection accuracy across the set — pay those costs only for capabilities the agent actually needs.", correct: true, why: "Least privilege + context budget + selection quality. Tools are not free even when never called." },
        { t: "More than 10 tools is above the documented hard limit.", why: "No such hard limit — invented constraint.", trap: "Fictional feature" },
        { t: "The model bills per registered tool.", why: "Billing is per token, not per registered tool — though definitions do cost tokens, which is the real version of this concern.", trap: "Fictional feature" },
        { t: "No pushback needed — more capabilities make a more useful agent.", why: "Ignores selection dilution, context cost, and attack surface. 'Might be useful someday' is how 14-tool mush happens.", trap: "Other (under-engineered)" }
      ]
    },
    {
      q: "Which tool description is exam-grade?",
      dom: "D2",
      opts: [
        { t: "\"update_account — updates account\"", why: "Restates the name. Updates what? When? What does it return? What is it not for?", trap: "Other (vague description)" },
        { t: "\"update_account — a powerful tool for all account management needs\"", why: "Marketing copy. 'All needs' guarantees overlap with every sibling tool.", trap: "Other (vague description)" },
        { t: "\"update_account — Update a verified customer's contact fields (email, phone, address). Requires prior get_customer verification. Cannot change tier or billing; use escalate_to_human for those. Returns the updated record.\"", correct: true, why: "What it does, what it requires, what it can't do, where to go instead, what it returns. The model can place its boundaries exactly." },
        { t: "\"update_account — PLEASE be very careful and only use when absolutely necessary!!!\"", why: "Tone instead of information. Urgency doesn't define scope.", trap: "Prompt-where-a-guarantee-is-needed" }
      ]
    },
    {
      q: "Identity verification must precede refunds. Where does this requirement belong?",
      dom: "D2",
      opts: [
        { t: "In the system prompt: \"Always call get_customer before process_refund.\"", why: "Holds ~95% of the time. For money, 95% is a compliance incident on a schedule.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "In the refund tool's description: \"Requires prior verification.\"", why: "Descriptions steer selection — they don't enforce sequence. Better than nothing; not a guarantee.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "As a precondition check inside process_refund (or a PreToolUse hook) that refuses unless verification already happened — plus the description and prompt as steering.", correct: true, why: "Guarantee in code; guidance in prompt/description so the model usually does it right the first time. Both layers, each doing its proper job." },
        { t: "Fine-tune the model on transcripts where verification happens first.", why: "Out of exam scope, enormous effort, and still probabilistic at the end.", trap: "Fictional feature / out-of-scope" }
      ]
    }
  ]
});
