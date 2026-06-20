/* EP 05 — Lost in Translation (D4: prompt engineering & structured output) */
window.CCAF = window.CCAF || { pages: [] };
window.CCAF.pages.push({
  id: "ep5",
  order: 5,
  code: "EP 05",
  title: "Lost in Translation",
  navTitle: "Lost in Translation",
  kicker: "EP 05 · CLIENT: CASCADE COMMERCE — Document Processing",
  subtitle: "Communicating through examples — Domain 4: Prompt Engineering & Structured Output",
  meta: [
    { t: "D4 · 20%", cls: "dom" }, { t: "D5", cls: "dom" },
    { t: "SCENARIO 6 · EXTRACTION", cls: "scn" },
    { t: "HANDS-ON LAB · ~2 HRS" }
  ],
  objectives: [
    "Replace a vague instruction with explicit criteria plus a worked edge-case example.",
    "Force a tool/schema to guarantee output shape, and use nullable fields to prevent invention.",
    "Choose Batch vs. synchronous API by whether a human is waiting on the result."
  ],
  body: `
<div class="story">
  <div class="scene">INT. CASCADE COMMERCE — FINANCE OPERATIONS — TUESDAY, 10:30 AM</div>
  <p>Cascade Commerce processes tens of thousands of vendor invoices — scans, faxes (faxes!), free-text forms, at least three different date formats — and they've pointed Claude at the pile. The prompt their team wrote, in its entirety:</p>
  <p><code>"Extract the important fields from this invoice."</code></p>
  <p>The results are exactly what you'd expect when one vague word — <em>important</em> — has to define the whole task. One run returns vendor and total. The next adds three fields nobody asked for. Dates arrive in four formats. And when a purchase-order number is missing from the source document, the model — required by the output format to produce one — <em>helpfully invents one</em>.</p>
  <p>The finance lead is exasperated. "It's like we're not speaking the same language."</p>
  <p>"You're speaking English," Marcus says. "The problem is that 'important' isn't an instruction. It's a mood. The model doesn't know what fields you care about any more than a new hire would on day one."</p>
  <p>Jordan, helpfully: "What if we just wrote a much longer list of all the fields we might want—"</p>
  <p>"We need to show it," Marcus says. "Not just tell it." He pulls up a blank doc. "The only thing that works as well as a clear rule is a clear example."</p>
</div>

<h2>Part 1 — Prompting: criteria, not impressions</h2>
<div class="viewscreen">
  <div class="vs-head">VIEWSCREEN // OFFICIAL DOCS — PROMPT ENGINEERING</div>
  <div class="vs-body">
    <div class="vs-src">docs.claude.com → Build with Claude → Prompt engineering</div>
    The doc-distilled hierarchy Marcus writes on the whiteboard:
    <ul>
      <li><strong>Be clear and direct.</strong> Replace judgment words ("important", "relevant", "appropriate") with explicit criteria. If a competent temp couldn't follow your instruction on day one, the model can't either.</li>
      <li><strong>Use examples (multishot/few-shot).</strong> 2–4 worked input→output pairs — including an edge case — beat paragraphs of description.</li>
      <li><strong>Structure with XML tags.</strong> Wrap distinct parts in tags like <code>&lt;document&gt;</code>, <code>&lt;criteria&gt;</code>, <code>&lt;example&gt;</code> so instructions can't blur into data.</li>
      <li><strong>Give it a role</strong> via the system prompt ("You are a meticulous financial-records clerk") to set tone and rigor.</li>
      <li><strong>Let it think</strong> (chain of thought) for genuinely complex reasoning — ask for analysis before the answer when accuracy beats latency.</li>
      <li><strong>Prefill</strong> the start of the assistant's reply to constrain format when you're not using tools.</li>
    </ul>
    <p style="margin:8px 0 0"><a href="https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noopener">→ docs.claude.com — Prompt engineering overview</a></p>
  </div>
</div>

<div class="viewscreen skilljar">
  <div class="vs-head">SKILLJAR // ANTHROPIC ACADEMY</div>
  <div class="vs-body">
    <div class="vs-src">Course queue: <strong>Building with the Claude API</strong></div>
    The module Marcus queues twice is the one on <em>structured output</em>: "If a system parses the model's reply, the reply's shape is a <strong>contract</strong> — and contracts are enforced, not requested."
    <p style="margin:8px 0 0"><a href="https://anthropic.skilljar.com" target="_blank" rel="noopener">→ anthropic.skilljar.com (find: Building with the Claude API)</a></p>
  </div>
</div>

<h3>The makeover, on the viewscreen</h3>
<div class="codeblock"><span class="cb-label">BEFORE — a mood</span><pre>Extract the important fields from this invoice.</pre></div>
<div class="codeblock"><span class="cb-label">AFTER — criteria + structure + examples</span><pre>You are a meticulous financial-records clerk for Cascade Commerce.

Extract from the invoice in &lt;document&gt;:
- vendor: the issuing company's legal name, exactly as printed
- total: the final payable amount, after tax, as a number
- currency: ISO code (USD, EUR...) - infer from symbol if needed
- po_number: the purchase-order reference. If absent, return null.
  NEVER invent a value.
- invoice_date: ISO format YYYY-MM-DD

&lt;example&gt;
Input: "INVOICE - Northwind Supply Co.. Total due: $1,240.50 (incl. tax).
        Ref PO-77821. Dated March 3, 2026."
Output: {"vendor": "Northwind Supply Co.", "total": 1240.50,
         "currency": "USD", "po_number": "PO-77821",
         "invoice_date": "2026-03-03"}
&lt;/example&gt;
&lt;example&gt;
Input: "Receipt. Pinnacle Retail. 47.25 USD. No PO on file. 12/01/26."
Output: {"vendor": "Pinnacle Retail", "total": 47.25,
         "currency": "USD", "po_number": null,
         "invoice_date": "2026-12-01"}
&lt;/example&gt;

&lt;document&gt;
{invoice_text}
&lt;/document&gt;</pre></div>
<p>Note what each piece does: the <strong>role</strong> sets rigor; the <strong>criteria</strong> kill the word "important"; the <strong>second example is an edge case</strong> that teaches the null rule better than the instruction does; the <strong>tags</strong> keep document text from bleeding into instructions. (That second example also deliberately uses an ambiguous US-style date, <code>12/01/26</code>, and shows it resolved to ISO <code>2026-12-01</code> — the examples define how the model normalizes, so you don't leave format to chance.)</p>

<h2>Part 2 — Structured output: the shape is a contract</h2>
<p>Better prompting fixed <em>what</em> gets extracted. But Cascade Commerce's pipeline <em>parses</em> the output — and "please respond in JSON" still occasionally yields a chatty preamble, a markdown fence, a missing brace. For a parsed shape, the dial goes hard right:</p>

<div class="co def"><span class="co-t">📦 Definition — JSON schema</span>
A formal description of the exact shape data must take (fields, types, required vs. nullable). Used with the tool mechanism, it <em>guarantees</em> structurally valid output. It does <strong>not</strong> guarantee the <em>values</em> are true — that's a separate check (EP 06).</div>
<div class="co def"><span class="co-t">📦 Definition — tool_choice</span>
Controls tool use: <code>auto</code> (model decides) · <code>any</code> (must call <em>some</em> tool) · <code>{"type":"tool","name":"X"}</code> (must call <em>this</em> tool). Forcing a specific tool whose input schema is your output format = guaranteed structured extraction.</div>

<div class="co tip"><span class="co-t">💡 Not running the build?</span> Skip the terminal and take this to the exam: <strong>for a shape you parse, force a tool/schema instead of asking nicely; nullable fields stop the model inventing data; and a valid schema guarantees structure, not truth.</strong> The drills test that reasoning, not your setup.</div>

<div class="lab">
  <div class="lab-head">Engagement Lab · Build 4 (Part 1) — the Cascade Commerce pipeline, shape-guaranteed</div>

  <div class="step"><input type="checkbox" data-key="ep5.s0"><div class="step-body">
    <div class="step-t">Step 0 — Setup</div>
    <div class="codeblock"><span class="cb-label">terminal</span><pre>mkdir cascade-pipeline && cd cascade-pipeline
pip install anthropic pydantic
export ANTHROPIC_API_KEY="sk-ant-..."</pre></div>
    <div class="co def"><span class="co-t">📦 Definition — Pydantic</span>A Python library that validates data against a declared shape and generates a JSON schema from it. It's how your <em>code</em> checks the model's output after receipt.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep5.s1"><div class="step-body">
    <div class="step-t">Step 1 — Define the schema (nullable where truth requires it)</div>
    <p>Create <code>extract.py</code>:</p>
    <div class="codeblock"><span class="cb-label">extract.py</span><pre>from pydantic import BaseModel
from typing import Optional

class Invoice(BaseModel):
    vendor: str
    total: float
    currency: str
    po_number: Optional[str] = None   # may genuinely be absent -> nullable
    invoice_date: Optional[str] = None
    confidence: float                 # model's per-extraction confidence, 0-1</pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Required = always truly present in real documents. Uncertain fields are nullable.</dd>
      <dt>LENS</dt><dd>Determinism dial + failure-first.</dd>
      <dt>WHY</dt><dd>A required field with no source data <em>forces</em> the model to invent — Cascade's phantom PO numbers were caused by their own format. Nullable lets the model tell the truth.</dd>
    </dl>
    <div class="co trap"><span class="co-t">⚠ Trap</span>"Make every field required so output is always complete." That <em>causes</em> hallucination. Required means "always truly present," not "I would like it filled in."</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep5.s2"><div class="step-body">
    <div class="step-t">Step 2 — Force the shape with tool_choice</div>
    <div class="codeblock"><span class="cb-label">extract.py (continued)</span><pre>import anthropic
client = anthropic.Anthropic()

PROMPT = """You are a meticulous financial-records clerk for Cascade Commerce.
Extract the invoice fields. If a field is absent from the document,
return null for it - NEVER invent a value. Set confidence to your
honest estimate (0-1) that every extracted value is correct.

<document>
{doc}
</document>"""

extract_tool = {
    "name": "record_invoice",
    "description": "Record the extracted invoice fields.",
    "input_schema": Invoice.model_json_schema(),   # Pydantic -> JSON schema
}

def extract(doc_text: str) -> dict:
    resp = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=1024,
        tools=[extract_tool],
        tool_choice={"type": "tool", "name": "record_invoice"},  # FORCED
        messages=[{"role": "user", "content": PROMPT.format(doc=doc_text)}],
    )
    return next(b.input for b in resp.content if b.type == "tool_use")

if __name__ == "__main__":
    print(extract("INVOICE - Northwind Supply Co.. Total due: $1,240.50 "
                  "(incl. tax). Ref PO-77821. Dated March 3, 2026."))
    print(extract("Receipt. Pinnacle Retail. 47.25 USD. No PO on file."))</pre></div>
    <div class="term"><div class="term-bar"><span class="dots"><i></i><i></i><i></i></span>python extract.py</div>
<pre><span class="dim">$ python extract.py</span>
<span class="ok">{'vendor': 'Northwind Supply Co.', 'total': 1240.5, 'currency': 'USD',
 'po_number': 'PO-77821', 'invoice_date': '2026-03-03', 'confidence': 0.97}</span>
<span class="ok">{'vendor': "Pinnacle Retail", 'total': 47.25, 'currency': 'USD',
 'po_number': None, 'invoice_date': None, 'confidence': 0.88}</span></pre></div>
    <dl class="decision">
      <dt>DECISION</dt><dd>Force the tool whose input schema is your output contract.</dd>
      <dt>LENS</dt><dd>Determinism dial — hard right, because a parser is waiting.</dd>
      <dt>WHY</dt><dd>Forced tool call = no preamble, no markdown fences, no missing braces, fields and types guaranteed. The <em>reading</em> of the messy document stays the model's judgment — exactly the division of labor the exam wants.</dd>
    </dl>
    <div class="co check"><span class="co-t">🔧 Check</span>Run it. The second document returns <code>po_number: None</code> — <em>no invented PO number</em>. The schema made honesty possible; the prompt made it explicit; neither alone is enough.</div>
  </div></div>

  <div class="step"><input type="checkbox" data-key="ep5.s3"><div class="step-body">
    <div class="step-t">Step 3 — A/B the prompt (feel D4 directly)</div>
    <p>Temporarily swap PROMPT for the original <code>"Extract the important fields from this invoice: {doc}"</code> (keep the forced tool) and run both documents a few times each.</p>
    <div class="co check"><span class="co-t">🔧 Check</span>Shape stays perfect every run — that's the schema's guarantee. But watch the <em>values</em> wobble across runs (fields interpreted differently, dates reformatted, confidence drifting). Structure comes from the schema; <em>consistency of judgment</em> comes from criteria + examples. Two different mechanisms, two different layers. Restore the good prompt.</div>
  </div></div>
</div>

<h2>Batch vs. live — one more dial</h2>
<p>Cascade's pile is overnight bulk work: no clerk is waiting on any single invoice. That's the <strong>Batch API</strong> — asynchronous (typically well under 24h, but with <em>no</em> guaranteed completion time), ~50% cost. The moment a human is waiting on the answer (a clerk querying one record, a support customer mid-chat), it must be the <strong>synchronous</strong> API.</p>
<div class="co trap"><span class="co-t">⚠ Trap</span>"Cut costs by using the Batch API for the live support agent." An async window with no completion-time guarantee makes it categorically wrong for anything user-facing. Batch = overnight/bulk; sync = someone is waiting. (Conversely: processing 50,000 archival invoices synchronously is the over-engineered twin.)</div>

<div class="story">
  <div class="scene">INT. CASCADE COMMERCE — RECORDS HALL — END OF DAY</div>
  <p>The finance lead runs fifty invoices through the rebuilt pipeline. Uniform fields. Honest nulls. Confidence scores she can sort by. She asks Marcus how the pipeline was "taught their invoice format."</p>
  <p>"I didn't teach it your format," Marcus says. "I told it precisely what a correct answer looks like — and showed it two examples. The model crossed the rest of the distance itself. It always could. It was waiting for someone to say something <em>specific</em>."</p>
  <p>Jordan makes a note: <em>"Replace judgment words with criteria. Show one edge case. That's it."</em></p>
</div>

<div class="talking-head" data-person="Marcus · Senior CCA">"'Extract the important fields.' That was the entire prompt. I've seen that exact prompt, or something like it, on three different engagements. The single word 'important' was expected to do the job of an entire requirements document."</div>

<div class="log"><b>MARCUS'S NOTES:</b> Replaced judgment words with criteria, added two examples (one edge case), forced the output shape with tool_choice, made nullable fields nullable. Phantom PO numbers: gone. Inconsistent date formats: gone. Time spent: four hours. Time the original prompt had been in production: eleven months.</div>
`,
  quiz: [
    {
      q: "A prompt says \"Flag any concerning clauses in this contract.\" Reviewers complain results vary wildly run to run. The D4 fix?",
      dom: "D4",
      opts: [
        { t: "Raise the temperature down to 0 so outputs are repeatable.", why: "Lower variance in wording doesn't define 'concerning' — the criteria are still missing, so runs (and documents) still disagree. Also parameter-fiddling is rarely the exam's answer.", trap: "Wrong root cause" },
        { t: "Replace the judgment word with explicit criteria (e.g. auto-renewal &gt; 12 months, indemnification without caps, unilateral termination) plus 2–3 worked examples including an edge case.", correct: true, why: "'Concerning' is a mood. Criteria + few-shot turn it into a checkable instruction." },
        { t: "Run it three times and majority-vote the flags.", why: "Triples cost to average over an ambiguity you could simply remove.", trap: "Over-engineered" },
        { t: "Fine-tune on the firm's past contract reviews.", why: "Out of scope and massively disproportionate to writing down what 'concerning' means.", trap: "Fictional feature / out-of-scope" }
      ]
    },
    {
      q: "Your service parses the model's reply as JSON. About 2% of replies arrive wrapped in markdown fences or prefixed with \"Here's the JSON you requested:\". Best fix?",
      dom: "D4",
      opts: [
        { t: "Strengthen the prompt: \"Respond with ONLY raw JSON, no other text, no code fences.\"", why: "Tightens the distribution; doesn't close it. 2% becomes 0.4% — a parser still crashes on schedule.", trap: "Prompt-where-a-guarantee-is-needed" },
        { t: "Strip fences and preambles with a regex before parsing.", why: "A scraper bolted onto a probabilistic format — new wrapper variants keep arriving. Symptom patch.", trap: "Wrong root cause" },
        { t: "Define the output as a tool's input_schema and force it with tool_choice — the reply is then structurally guaranteed.", correct: true, why: "When a parser waits, shape is a contract: enforce it with the mechanism built for enforcement." },
        { t: "Switch to a larger model with better instruction-following.", why: "Better adherence is still adherence — probabilistic. And costlier.", trap: "Over-engineered" }
      ]
    },
    {
      q: "An extraction schema marks every field required. The model fills missing purchase-order numbers with plausible-looking fakes. Why, and what's the fix?",
      dom: "D4",
      opts: [
        { t: "The model is hallucinating; add \"never fabricate values\" to the prompt.", why: "Helpful sentence, but the schema still demands a string when none exists — the format itself forces the lie.", trap: "Wrong root cause" },
        { t: "The required field leaves no honest path when data is absent — make genuinely-optional fields nullable (and keep the no-fabrication instruction).", correct: true, why: "Required = 'always truly present.' Nullable gives the model a truthful output for missing data; prompt reinforces it." },
        { t: "Post-process: detect and remove PO numbers that don't match known formats.", why: "Now you're laundering fabricated data downstream instead of preventing it.", trap: "Wrong root cause" },
        { t: "Lower max_tokens so the model has less room to invent.", why: "Output length doesn't govern fabrication — nonsense fits in few tokens. Invented mechanism.", trap: "Fictional feature" }
      ]
    },
    {
      q: "What does a forced tool call (tool_choice: specific tool) guarantee — and not guarantee?",
      dom: "D4",
      opts: [
        { t: "Guarantees both valid structure and correct values.", why: "Half right, dangerously: the schema can't know whether 1240.50 is the real total.", trap: "Other (shape vs values)" },
        { t: "Guarantees syntactically valid output matching the schema's fields and types; does NOT guarantee the values are correct — that needs separate validation.", correct: true, why: "Shape is guaranteed; truth is checked. The exam loves this exact boundary." },
        { t: "Guarantees nothing — the model can still reply in prose.", why: "Forcing a tool is precisely the mechanism that removes the prose path.", trap: "Other (mechanism misread)" },
        { t: "Guarantees the model will pick the most appropriate tool for the request.", why: "Forcing removes the choice entirely — that's its point. Appropriateness was decided by you.", trap: "Other (mechanism misread)" }
      ]
    },
    {
      q: "Which job belongs on the Batch API?",
      dom: "D4",
      opts: [
        { t: "The customer-support agent's replies, to halve token costs.", why: "A customer is waiting; an async window with no guaranteed completion time is categorically wrong for live traffic.", trap: "Other (batch vs sync)" },
        { t: "Overnight classification of 80,000 archived support tickets for a quarterly report.", correct: true, why: "Bulk, asynchronous, nobody waiting: the Batch API's exact design case, at ~50% cost." },
        { t: "Validating each invoice extraction immediately after it returns.", why: "Validation is part of a live pipeline step, not deferred bulk work.", trap: "Other (batch vs sync)" },
        { t: "An interactive code-review session in Claude Code.", why: "Interactive = someone waiting = synchronous by definition.", trap: "Other (batch vs sync)" }
      ]
    },
    {
      q: "When is adding chain-of-thought (\"think step by step before answering\") the right call?",
      dom: "D4",
      opts: [
        { t: "Always — more reasoning is always more accurate.", why: "It costs latency and tokens; for simple extraction or classification it adds expense without accuracy.", trap: "Over-engineered" },
        { t: "For genuinely complex multi-step reasoning where accuracy outweighs latency — e.g. reconciling a total against line items before judging an invoice valid.", correct: true, why: "Proportionality applied to prompting: pay the thinking cost where reasoning is actually the bottleneck." },
        { t: "Never in production — reasoning text breaks JSON parsers.", why: "Reasoning and structured output coexist fine (think first, then emit the tool call / final block).", trap: "Other (mechanism misread)" },
        { t: "Only when using the Batch API, where latency is free.", why: "Batch makes latency cheaper but the criterion is task complexity, not API mode.", trap: "Wrong root cause" }
      ]
    }
  ]
});
