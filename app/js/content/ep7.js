/* EP 07 — The Internal Review (D3/D4: headless Claude Code in CI/CD) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep7",
  order: 7,
  code: "EP 07",
  title: "The Internal Review",
  navTitle: "The Internal Review",
  kicker: "EP 07 · INTERNAL — Apex Platform Team",
  subtitle: "Automated reviews worth acting on — Claude Code in CI/CD (Scenario 5)",
  meta: [
    { t: "D3 · 20%", cls: "dom" }, { t: "D4 · 20%", cls: "dom" },
    { t: "SCENARIO 5 · CI/CD", cls: "scn" },
    { t: "HANDS-ON LAB · ~1 HR" }
  ],
  objectives: [
    "Restrict a headless reviewer to read-only tools (--tools) and return structured output.",
    "Validate the model's output in code and fail safe before any gate acts on it.",
    "Keep secrets in the CI store — never in the repo, CLAUDE.md, or settings.json."
  ],
  body: `
<div class="story">
  <div class="scene">COLD OPEN — APEX CONSULTING — INTERNAL ENGAGEMENT, PLATFORM TEAM</div>
  <p>For once the client is the home office. The Apex platform team bolted Claude onto their merge pipeline months ago as an automated PR reviewer, and the experiment has achieved the worst possible outcome: <strong>it works just badly enough that everyone ignores it.</strong></p>
  <p>The numbers: forty-one comments per pull request, average. "Consider a more descriptive variable name." "This function could theoretically be refactored." Developers have built a browser extension that collapses the bot's comments on sight. Last month it flagged 312 issues; engineers acted on four. And because the bot's verdict arrives as free-form prose, the pipeline "parses" it by — Marcus reads the ticket twice to be sure — <em>grepping for the word "LGTM"</em>.</p>
  <p>"The whole thing is inside-out," says the platform lead, a twelve-year Apex veteran who has survived four CTO changes and two reorganizations. "We gave it infinite authority and no scope. That's not a reviewer. That's a comment machine."</p>
  <p>"Then we build a better one," Marcus says. "One with a severity bar. And one that files a <em>report</em>, not a monologue."</p>
</div>

<div class="co def"><span class="co-t">📦 Definition — CI/CD</span>
Continuous Integration / Continuous Deployment: the automated assembly line that runs on every proposed code change — build, test, check, ship. A <strong>PR (pull request)</strong> is the proposed change; Scenario 5 is plugging Claude into that line as a reviewer whose feedback is <em>trustworthy enough to act on</em>.</div>
<div class="co def"><span class="co-t">📦 Definition — Headless mode</span>
Running Claude Code non-interactively: <code>claude -p "prompt"</code> takes one prompt, prints the result, exits. Required in CI because no human is present to answer questions or approve actions.</div>

<h2>The four questions, run on the sentry</h2>
<ol>
  <li><strong>Root cause?</strong> Not "the model is too chatty." The job was never scoped: no severity bar, no output contract, no tool limits. Given infinite license, the model reviews <em>everything</em> — and prose verdicts make the pipeline's gate a string-match.</li>
  <li><strong>Needs a guarantee?</strong> The output <em>shape</em> (CI parses it) → yes. The tool surface (a CI reviewer must never edit code) → yes. The <em>judgment</em> about what's actually a bug → no; that's why a model is here at all.</li>
  <li><strong>Smallest fix?</strong> Constrain scope (read-only tools), define severity criteria with examples, demand JSON, validate before gating. Not a fine-tuned review model; not a second bot to review the first bot.</li>
  <li><strong>Observability / failure?</strong> Structured findings are countable and trendable; a malformed result must fail safe (skip the gate, alert) — never act on garbage.</li>
</ol>

<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — HEADLESS / CLI REFERENCE</div>
  <div class="vs-body">
    <div class="vs-src">code.claude.com/docs → CLI reference · Headless / programmatic use</div>
    The flags that matter for CI, verified current:
    <ul>
      <li><code>claude -p "..."</code> — one-shot, non-interactive prompt.</li>
      <li><code>--output-format json</code> — machine-readable envelope; the model's answer is in the <code>.result</code> field. (Also: <code>text</code>, <code>stream-json</code>.)</li>
      <li><code>--tools "Read,Grep,Glob"</code> — <strong>restricts</strong> the built-in tool surface. <em>This</em> is what makes the reviewer read-only by construction: Edit, Write, and Bash aren't available at all. (Add <code>--disallowedTools "mcp__*"</code> or <code>--strict-mcp-config</code> to keep MCP tools out too.)</li>
      <li><code>--allowedTools "Read,Grep,Glob"</code> — <strong>auto-approves</strong> those tools so an unattended run never blocks on a permission prompt. It does <em>not</em> restrict the surface — that's the opposite job, handled by <code>--tools</code>. In CI you pair the two.</li>
      <li><code>--max-turns N</code> — backstop against runaway sessions; <code>--bare</code> skips local hooks/MCP/CLAUDE.md so the run is reproducible across machines.</li>
    </ul>
    <strong>Schema enforcement exists:</strong> <code>--output-format json --json-schema '{…}'</code> returns schema-conforming output in the <code>structured_output</code> field (the model's free-text answer stays in <code>.result</code>). Use it — but remember <strong>shape is not values</strong>: still <strong>validate the parsed result in your own script</strong> and fail safe if it's wrong.
    <p style="margin:8px 0 0"><a href="https://code.claude.com/docs" target="_blank" rel="noopener">→ code.claude.com/docs — CLI reference</a></p>
  </div>
</div>

<div class="co why"><span class="co-t">🎯 Why low false positives is THE metric</span>
Scenario 5's stated success measure is trustworthy feedback. A reviewer that raises too many false alarms trains humans to ignore it — at which point it has negative value, because it provides cover ("the bot reviewed it") without protection. You buy trust by <em>constraining scope and raising the severity bar</em>, accepting that the bot stays silent on most PRs. Silence is a feature.</div>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>a headless CI reviewer is restricted to read-only tools with <code>--tools</code>, returns structured output, and the pipeline validates before the gate — failing safe (skip + alert) on malformed output.</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 5 — deploy the sentry</div>
  <p>Run this in any git repo with some code — your <code>cca-guardrail-demo</code> from EP 01 works.</p>

  <div class="step"><input type="checkbox" data-key="ep7.s1"><div class="step-body">
    <div class="step-t">Step 1 — Feel headless mode</div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>claude -p "List the Python files in this project and one risk you see in each. Two sentences max." --tools "Read,Grep,Glob"</pre></div>
    <p>One prompt in, one answer out, process exits. No session, no follow-up. That's the CI shape.</p>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep7.s2"><div class="step-body">
    <div class="step-t">Step 2 — Structured output with an explicit contract</div>
    <p>Create something to review, then run the sentry prompt:</p>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>cat > risky.py << 'EOF'
import os
def run(cmd):
    os.system("sh -c " + cmd)     # injection risk
PASSWORD = "hunter2"              # hardcoded secret
EOF

claude -p 'Review the file risky.py for real bugs and security issues only.
Severity bar: report ONLY issues that could cause incorrect behavior,
data loss, or a security vulnerability. Style and naming are OUT OF SCOPE.
Return ONLY a JSON array, each item: {"file": str, "line": int,
"severity": "high"|"medium"|"low", "issue": str}.
Example of a valid finding:
[{"file":"app.py","line":12,"severity":"high","issue":"SQL built by string concatenation"}]
If there are no qualifying issues, return [].' \
  --tools "Read,Grep,Glob" --output-format json > review.json

cat review.json | jq -r '.result'</pre></div>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>jq -r '.result' review.json</div>
<pre>[
  {"file": "risky.py", "line": 3, "severity": "high",
   "issue": "os.system with concatenated input - command injection"},
  {"file": "risky.py", "line": 4, "severity": "high",
   "issue": "Hardcoded credential committed to source"}
]</pre></div>
    <p>Count what the prompt did: <strong>severity bar</strong> (criteria, not impressions — D4) · <strong>explicit out-of-scope</strong> (style/naming — kills the 41-comment problem) · <strong>exact shape + example</strong> (few-shot) · <strong>an empty-result path</strong> (silence is valid output).</p>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep7.s3"><div class="step-body">
    <div class="step-t">Step 3 — Gate the pipeline, validating before acting</div>
    <p>Create <code>sentry.sh</code> — note it never trusts the output blindly:</p>
    <div class="codeblock"><span class="cb-label">sentry.sh</span><pre>#!/bin/bash
RESULT=$(jq -r '.result' review.json)

# 1. VALIDATE: is it parseable JSON of the right shape?
if ! echo "$RESULT" | jq -e 'type == "array"' > /dev/null 2>&1; then
  echo "::warning:: sentry output malformed - skipping gate, alerting team"
  exit 0          # fail SAFE: never block (or pass!) a PR on garbage
fi

# 2. GATE: high-severity findings block the merge.
HIGH=$(echo "$RESULT" | jq '[.[] | select(.severity == "high")] | length')
echo "$RESULT" | jq -r '.[] | "[\\(.severity)] \\(.file):\\(.line) \\(.issue)"'
if [ "$HIGH" -gt 0 ]; then
  echo "BLOCKED: $HIGH high-severity finding(s)."
  exit 1
fi
echo "Sentry: no blocking findings."</pre></div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>chmod +x sentry.sh && ./sentry.sh</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Validate the structure in code <em>before</em> the gate consumes it; malformed output skips the gate and alerts instead of deciding.</dd>
      <dt>LENS</dt><dd>Determinism dial (the gate is code) + failure-first (a broken reviewer must not become a random merge-blocker).</dd>
      <dt>WHY</dt><dd>The model judges severity (probabilistic, its job); the pipeline enforces the threshold (deterministic, your job). And in CI the failure mode of <em>acting on garbage</em> is worse than the failure mode of <em>one unreviewed PR</em>.</dd>
    </dl>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep7.s4"><div class="step-body">
    <div class="step-t">Step 4 — (Read-through) The real pipeline wiring</div>
    <p>In production this runs on every PR — e.g. a GitHub Actions step:</p>
    <div class="codeblock"><span class="cb-label">.github/workflows/sentry.yml (sketch)</span><pre>- name: Claude sentry review
  run: |
    claude --bare -p "$(cat .ci/review-prompt.txt)" \
      --tools "Read,Grep,Glob" --allowedTools "Read,Grep,Glob" \
      --output-format json --max-turns 10 > review.json
    ./sentry.sh
  env:
    ANTHROPIC_API_KEY: \$\{\{ secrets.ANTHROPIC_API_KEY \}\}</pre></div>
    <p>Details that are exam bait: the API key comes from <strong>CI secrets</strong> (never the repo); <code>--max-turns</code> backstops the unattended run; the review prompt lives in a versioned file so the severity bar is itself code-reviewed; <code>--tools</code> restricts the surface to read-only (<code>--allowedTools</code> only auto-approves, so the two are paired to avoid prompts); and the sentry <strong>comments and gates — it never auto-fixes and never auto-merges.</strong> A reviewer with write access is no longer a reviewer.</p>
  </div></div>
</div>

<h2>Debrief</h2>
<div class="story">
  <div class="scene">APEX CONSULTING — PLATFORM TEAM STANDUP, TWO SPRINTS LATER</div>
  <p>Comments per PR: forty-one → three, median zero. Engineers acted on 19 of last month's 22 findings, including one injection bug two human reviewers had scrolled past. Someone uninstalled the comment-collapsing extension.</p>
  <p>"Sixty-seven percent action rate," the platform lead says, pulling up the dashboard. "That's better than most humans on code review."</p>
  <p>"Because it stays quiet when there's nothing worth saying," Marcus says. Jordan writes that down in the engagement notes without being asked.</p>
</div>
<div class="talking-head" data-person="Marcus · Senior CCA">Silence is the feature. The moment you optimize for comment count, you're optimizing for the wrong thing.</div>
<div class="log"><b>MARCUS'S NOTES:</b> An automated reviewer earns exactly as much trust as its silence is worth. Scope it read-only, set the severity bar in criteria and examples, demand a contract for its output, and validate before the gate. The judgment is the model's. The gate is mine.</div>
`,
  quiz: [
    {
      q: "A CI review bot's verdict is consumed by grepping its prose for \"LGTM\". Last week a review containing \"this is NOT LGTM-worthy\" auto-passed the gate. The fix?",
      dom: "D3",
      opts: [
        { t: "Grep for a stricter phrase and require it at the start of the reply.", why: "Still parsing prose for a control signal — the same bug that kills agent loops (EP 03), wearing a CI costume.", trap: "Wrong root cause" },
        { t: "Demand structured JSON output (explicit shape in the prompt, --output-format json), validate it in the pipeline, and gate on parsed fields.", correct: true, why: "Machine-consumed output is a contract: structured, validated, then gated in code." },
        { t: "Have a second Claude call classify whether the first reply approves the PR.", why: "A probabilistic parser for probabilistic prose, at double cost.", trap: "Over-engineered" },
        { t: "Make the bot's approval comment trigger the merge via webhook.", why: "Automates the merge without fixing the unreliable signal feeding it.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "Developers ignore the CI reviewer because it averages 40 comments per PR, mostly style nits. Scenario 5's success metric is trustworthy feedback. Best move?",
      dom: "D4",
      opts: [
        { t: "Raise the severity bar in the prompt with explicit criteria and out-of-scope list (style/naming excluded), few-shot examples of qualifying findings, and a valid empty-result path.", correct: true, why: "False-positive volume is a scoping problem. Criteria + exclusions + 'silence is valid' rebuild trust." },
        { t: "Cap output at 5 comments per PR.", why: "On a bad PR the 6th finding might be the vulnerability; on a clean PR 5 nits still appear. Quantity cap ≠ quality bar.", trap: "Wrong root cause" },
        { t: "Fine-tune a model on the team's past review comments.", why: "Out of scope, heavy, and it would faithfully learn to produce… the team's old nitpicks.", trap: "Fictional feature / out-of-scope" },
        { t: "Send the comments to team leads instead of developers.", why: "Re-routes the noise; trust erodes one level up instead.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "Which tool configuration is right for a headless CI code reviewer?",
      dom: "D3",
      opts: [
        { t: "--tools \"Read,Grep,Glob\" to restrict the surface (Edit/Write/Bash don't exist), paired with --allowedTools so CI doesn't stall on a prompt.", correct: true, why: "Least privilege with the right flag: --tools restricts what the agent can do at all; --allowedTools only skips the permission prompt (it is NOT a restriction). A reviewer needs eyes, not hands — Edit/Bash are a prompt-injection incident waiting to happen." },
        { t: "Full tool access, so it can fix the issues it finds.", why: "A reviewer that edits code under nobody's supervision merges its own opinions. Review and write must be separate powers.", trap: "Other (least privilege)" },
        { t: "Read tools plus Bash, so it can run the tests itself.", why: "Bash is arbitrary execution — in unattended CI that's the entire attack surface. Let the pipeline run tests; give the model the results.", trap: "Other (least privilege)" },
        { t: "No tools — paste the diff into the prompt.", why: "Workable for tiny diffs but loses the ability to read surrounding context; restricting to read-only tools achieves safety without blinding the reviewer.", trap: "Other (over-restriction)" }
      ]
    },
    {
      q: "The sentry script receives unparseable output from the model one night. What should the pipeline do?",
      dom: "D5",
      opts: [
        { t: "Block the merge — malformed review means the PR wasn't properly checked.", why: "Now a flaky reviewer randomly blocks unrelated PRs; developers lose trust again — this time angrily.", trap: "Other (failure design)" },
        { t: "Pass the merge — the reviewer is advisory anyway.", why: "Half right (don't block), but missing the alert: silent reviewer outages become permanent unnoticed coverage gaps.", trap: "Other (failure hidden)" },
        { t: "Fail safe: skip the gate for this run, surface a visible warning/alert so the team knows review coverage lapsed.", correct: true, why: "Never act on garbage in either direction — and never fail silently. Failure is first-class even for the reviewer itself." },
        { t: "Retry the review with the same prompt until output parses.", why: "Unbounded retries in CI, with no feedback about what failed — the blind-retry trap on a billable loop.", trap: "Wrong root cause" }
      ]
    },
    {
      q: "Where does the ANTHROPIC_API_KEY belong in the CI setup?",
      dom: "D3",
      opts: [
        { t: "In the CI platform's secrets store, injected as an environment variable at runtime.", correct: true, why: "Standard secret hygiene — and the exam's only acceptable answer shape for credentials." },
        { t: "In .claude/settings.json, committed so the whole team shares it.", why: "A credential in version control is leaked-by-design — settings.json is for config, never secrets.", trap: "Other (secret hygiene)" },
        { t: "Hardcoded in sentry.sh since the repo is private.", why: "Private repos get cloned, forked, mirrored, and breached. Hardcoded secrets are always wrong.", trap: "Other (secret hygiene)" },
        { t: "In CLAUDE.md so the agent knows its own key.", why: "CLAUDE.md is loaded into model context — you'd be feeding the secret to every session and every log.", trap: "Other (secret hygiene)" }
      ]
    }
  ]
});
