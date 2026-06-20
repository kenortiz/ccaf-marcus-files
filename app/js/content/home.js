/* HOME — Welcome to Apex (landing page) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "home",
  order: -1,
  group: "Briefing",
  code: "HOME",
  title: "Welcome to Apex",
  navTitle: "Welcome to Apex",
  kicker: "APEX CONSULTING — AI CENTER OF EXCELLENCE",
  subtitle: "A story-driven study guide for the CCA-F exam",
  meta: [
    { t: "ORIENTATION", cls: "dom" },
    { t: "START HERE" }
  ],
  body: `
<div class="story">
  <div class="scene">APEX CONSULTING — AI CENTER OF EXCELLENCE, OPEN PLAN — MONDAY</div>
  <p>You've been staffed to the AI Center of Excellence team. Your manager Sam sent a calendar invite titled "Onboarding" at 7:58 AM this morning. Your desk is the one with the sticky note that says <em>new person</em>.</p>
  <p>Marcus, Senior CCA, walks over without being asked. He sets a printed document on your desk. It's dense, single-spaced, titled <strong>CCA-F Exam Domains and Scenario Coverage</strong>.</p>
  <p>"We'll be working together on eight client engagements," he says. "Each one covers a real piece of the exam. You'll read the case, work the lab, and drill the questions. By the time you're done with all eight, you should have enough pattern recognition to pass."</p>
  <p>He pauses. "Questions?"</p>
  <p>Jordan leans over from the next desk. "I put together a pre-reading list with seventeen sources if you want—"</p>
  <p>"You don't," Marcus says.</p>
</div>

<div class="co def"><span class="co-t">📋 What is this?</span>
An unofficial, story-driven study guide for the <strong>Certified Claude Architect – Foundational (CCA-F)</strong> exam. Eight episodes, five domains, one mock exam. Each episode is a client engagement at the fictional Apex Consulting AI CoE — you learn the exam material by watching Marcus work through real architectural problems.</div>

<div class="co tip"><span class="co-t">💡 How to use this</span>
<ol style="margin:8px 0 0;padding-left:1.4em">
  <li><strong>Read the story.</strong> Each episode opens with a cold open that sets up the problem. The story is not decoration — the scenario is the lesson.</li>
  <li><strong>Hit the concepts.</strong> The technical content follows. Use the jump nav at the top to skip ahead after your second read-through.</li>
  <li><strong>Do the build <em>(optional for non-coders)</em>.</strong> Every episode has a hands-on lab — run the commands in your own terminal; the reflexes stick faster when you do it yourself. Not hands-on, or short on time? The exam is multiple-choice — you can read each lab for the concept and put your effort into the drills instead.</li>
  <li><strong>Drill the questions.</strong> Each episode ends with scenario drills tied to that episode's domain. The <a href="#/ep8">Final Assessment</a> is a timed 22-question mock covering all five domains.</li>
</ol>
<p style="margin:12px 0 0"><strong>Time budget:</strong> roughly <strong>30–40 min per episode</strong> if you do the builds (~4–5 hours total), or a read-and-drill <strong>fast track of ~10–15 min per episode</strong> if you skip them. Do one episode per sitting — this is not meant to be finished in one go.</p>
</div>

<div class="co lens"><span class="co-t">🎯 Calibrate your effort to your background</span>
<ul style="margin:8px 0 0;padding-left:1.4em">
  <li><strong>Not a coder (but you build agents)?</strong> Skip the builds, bank the concepts and drills. Your weak spot is the Claude Code mechanics in EP 01 / EP 07 — read those carefully.</li>
  <li><strong>A strong developer, newer to agents?</strong> The labs will be easy — <strong>don't skip the story.</strong> Your blind spot is the opposite one: reaching for code (a classifier, a routing layer, a vector DB) where the right answer is model judgment or the <em>smallest</em> fix. That instinct is exactly what the narrative (and the proportionality calls in the drills) is built to retrain.</li>
</ul></div>

<h2>The exam at a glance</h2>
<table>
  <tr><th>Domain</th><th>Weight</th><th>Core theme</th></tr>
  <tr><td><strong>D1 · Agentic Architecture</strong></td><td>27%</td><td>Agent loops, multi-agent coordination, determinism dial, escalation design</td></tr>
  <tr><td><strong>D2 · Tool Design &amp; MCP</strong></td><td>18%</td><td>Tool descriptions, least privilege, MCP primitives, structured errors</td></tr>
  <tr><td><strong>D3 · Claude Code Config</strong></td><td>20%</td><td>CLAUDE.md vs hooks, settings hierarchy, headless mode, CI/CD use</td></tr>
  <tr><td><strong>D4 · Prompt &amp; Structured Output</strong></td><td>20%</td><td>Criteria over impressions, few-shot, forced tools, schema design, batch vs sync</td></tr>
  <tr><td><strong>D5 · Context &amp; Reliability</strong></td><td>15%</td><td>Context budget, error taxonomy, lost-in-the-middle, provenance, failure design</td></tr>
  <tr><td colspan="2"><strong>Total</strong></td><td>~60 questions · 2 hours · Pass = 720/1000</td></tr>
</table>

<h2>Your mastery by domain</h2>
<p>This fills in as you take the drills and the mock — it weights toward the heaviest domains (D1, D3, D4), so you can see where to spend your remaining time.</p>
<div id="domain-bars"></div>

<h2>The engagement map</h2>
<table>
  <tr><th>Episode</th><th>Client</th><th>Domains</th><th>Build</th></tr>
  <tr><td><a href="#/ep0">EP 00 · The Onboarding</a></td><td>Internal / orientation</td><td>All</td><td>— (orientation)</td></tr>
  <tr><td><a href="#/ep1">EP 01 · The First Engagement</a></td><td>Atlas Engineering (DevOps)</td><td>D3</td><td>Build 1 · CLAUDE.md + hook guardrail</td></tr>
  <tr><td><a href="#/ep2">EP 02 · Tools of the Trade</a></td><td>Pinnacle Retail (Support Agent)</td><td>D1, D2</td><td>Build 2 Part 1 · Tool design + escalation gate</td></tr>
  <tr><td><a href="#/ep3">EP 03 · The Loop Problem</a></td><td>Pinnacle Retail (continued)</td><td>D1, D5</td><td>Build 2 Part 2 · Loop control + structured handoff</td></tr>
  <tr><td><a href="#/ep4">EP 04 · Divide and Conquer</a></td><td>Vertex Research (Research Agent)</td><td>D1, D5</td><td>Build 3 · Multi-agent hub-and-spoke + provenance</td></tr>
  <tr><td><a href="#/ep5">EP 05 · Lost in Translation</a></td><td>Cascade Commerce (Document Pipeline)</td><td>D4</td><td>Build 4 Part 1 · Forced tool + schema design</td></tr>
  <tr><td><a href="#/ep6">EP 06 · Night Shift</a></td><td>Cascade Commerce (continued)</td><td>D4, D5</td><td>Build 4 Part 2 · Validation + retry-with-feedback</td></tr>
  <tr><td><a href="#/ep7">EP 07 · The Internal Review</a></td><td>Internal Apex Platform Team</td><td>D3, D4</td><td>Build 5 · Headless CI reviewer + structured gate</td></tr>
  <tr><td><a href="#/ep8">EP 08 · The Final Assessment</a></td><td>—</td><td>All</td><td>22-question timed mock</td></tr>
  <tr><td><a href="#/ref">The Playbook</a></td><td>—</td><td>All</td><td>Reference sheet (night-before)</td></tr>
</table>

<h2>What you need</h2>
<div class="co lens"><span class="co-t">🔧 Prerequisites</span>
<ul style="margin:8px 0 0;padding-left:1.4em">
  <li><strong>Claude Code</strong> installed and configured (<code>npm install -g @anthropic-ai/claude-code</code>)</li>
  <li><strong>Anthropic API key</strong> set in your environment (<code>ANTHROPIC_API_KEY</code>)</li>
  <li><strong>Python 3.10+</strong> for the extraction pipeline builds (EP 05–06)</li>
  <li>A terminal, a text editor, and a git repo to work in</li>
</ul>
The builds use only standard tools — no cloud accounts, no Docker. The labs assume <strong>macOS, Linux, or WSL</strong> (they use a Unix shell plus <code>jq</code> and <code>chmod</code>); <strong>on Windows, run them inside WSL</strong>. None of this is needed just to read the episodes and take the drills.</div>

<div class="story">
  <div class="scene">CONTINUATION</div>
  <p>Jordan is still standing there. "I also made a Notion page with all the—"</p>
  <p>"Jordan," Marcus says, without turning around, "go set up the lab environment."</p>
  <p>Jordan goes.</p>
  <p>Marcus looks at you. "EP 00 is the orientation. Read it, then start the labs in order. Don't skip builds — the exam has hands-on questions and pattern recognition requires repetition, not coverage." He pauses. "Good luck. You won't need it."</p>
  <p>It's unclear if that's a compliment.</p>
</div>

<p style="text-align:center;margin:40px 0 8px">
  <a href="#/ep0" class="next-link">Start with EP 00 → The Onboarding</a>
</p>
`
});
