/* ============================================================
   CCA-F: THE MARCUS FILES — app engine
   Hash router + progress persistence + quiz/exam engine.
   Content lives in js/content/*.js, which push onto window.CCAF.
   ============================================================ */

window.CCAF = window.CCAF || { pages: [] };

(function () {
  const STORE_KEY = "ccaf-apex-progress-v1";

  // ---------- persistence ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
  let P = load();
  P.checks = P.checks || {};     // lab checkbox states
  P.quizBest = P.quizBest || {}; // best quiz scores  {quizId: {score, total}}
  P.visited = P.visited || {};   // pages opened

  // ---------- helpers ----------
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ---------- trap taxonomy + remediation ----------
  // Map any quiz `trap:` label onto one of the four canonical wrong-answer types
  // (the durable model the course teaches), keeping the specific label as a sub-tag.
  function canonTrap(t) {
    if (!t) return "Other architectural misread";
    if (/prompt[- ]where|prompt-where-a-guarantee/i.test(t)) return "Prompt-where-a-guarantee-is-needed";
    if (/over-?engineer/i.test(t)) return "Over-engineered";
    if (/wrong root cause/i.test(t)) return "Wrong root cause";
    if (/fictional feature/i.test(t)) return "Fictional feature";
    return "Other architectural misread";
  }
  const REMEDY = {
    "Prompt-where-a-guarantee-is-needed": "Re-read the determinism dial (EP 00) and CLAUDE.md-vs-hooks (EP 01): must-hold rules belong in code, not prompts.",
    "Over-engineered": "Re-read proportionality (EP 00): find the smallest fix for the root cause before adding layers, agents, or bigger models.",
    "Wrong root cause": "Re-run the four questions (EP 00): name why it happened, not just the symptom you can see.",
    "Fictional feature": "Check the out-of-scope list in The Playbook: if a flag, toggle, or capability isn't in the docs, it's bait.",
    "Other architectural misread": "Revisit the lens this question targets (use its domain tag) in The Playbook."
  };

  // ---------- sidebar / progress (mastery-aware) ----------
  function passBar(pg) { return pg.exam ? 85 : 70; }
  function quizPct(pg) {
    const b = P.quizBest[pg.id];
    if (!b || !b.total) return null;
    return Math.round((b.score / b.total) * 100);
  }
  // "mastered" = quiz at/above its pass bar (or a non-quiz page that's been read).
  // "attempted" = quiz tried but below the bar. "read"/"none" otherwise.
  function pageState(pg) {
    if (pg.quiz && pg.quiz.length) {
      const pct = quizPct(pg);
      if (pct === null) return "none";
      return pct >= passBar(pg) ? "mastered" : "attempted";
    }
    return P.visited[pg.id] ? "read" : "none";
  }
  function pageDone(pg) {
    const s = pageState(pg);
    return s === "mastered" || s === "read";
  }

  function overallProgress() {
    const pages = CCAF.pages;
    if (!pages.length) return 0;
    let done = 0;
    pages.forEach(pg => { if (pageDone(pg)) done++; });
    return Math.round((done / pages.length) * 100);
  }

  // Aggregate per-domain mastery from stored best-run per-domain tallies.
  function domainMastery() {
    const acc = {};
    CCAF.pages.forEach(pg => {
      const b = P.quizBest[pg.id];
      if (!b || !b.dom) return;
      Object.keys(b.dom).forEach(d => {
        acc[d] = acc[d] || { c: 0, t: 0 };
        acc[d].c += b.dom[d].c;
        acc[d].t += b.dom[d].t;
      });
    });
    return acc;
  }

  function renderSidebar() {
    const nav = document.getElementById("nav");
    nav.innerHTML = "";
    const cur = location.hash.replace(/^#\/?/, "") || CCAF.pages[0].id;
    let lastGroup = null;
    CCAF.pages.forEach(pg => {
      if (pg.group && pg.group !== lastGroup) {
        nav.appendChild(el('<div class="nav-group">' + esc(pg.group) + "</div>"));
        lastGroup = pg.group;
      }
      const st = pageState(pg);
      const mark = st === "mastered" ? '<span class="done-mark" title="Mastered (passed the drill)">◆</span>'
        : st === "read" ? '<span class="done-mark" title="Read">◆</span>'
        : st === "attempted" ? '<span class="done-mark partial" title="Attempted — below the pass bar, keep drilling">◐</span>'
        : "";
      const a = el(
        '<a class="nav-item' + (pg.id === cur ? " active" : "") + '" href="#/' + pg.id + '">' +
        '<span class="ep-pip">' + esc(pg.code) + "</span>" +
        "<span>" + esc(pg.navTitle || pg.title) + "</span>" +
        mark +
        "</a>"
      );
      nav.appendChild(a);
    });
    const foot = el('<div class="nav-foot"><button id="reset-progress" class="reset-btn">Reset progress</button><span class="nav-note">Checkboxes &amp; scores save to <strong>this browser only</strong>. ◆ mastered · ◐ attempted.</span></div>');
    foot.querySelector("#reset-progress").addEventListener("click", function() {
      if (!window.confirm("Reset all progress (lab checkboxes and drill scores) in this browser? This can't be undone.")) return;
      P = { checks: {}, quizBest: {}, visited: {} };
      save(P);
      render();
    });
    nav.appendChild(foot);
    const pct = overallProgress();
    document.getElementById("prog-pct").textContent = pct + "%";
    document.getElementById("prog-fill").style.width = pct + "%";
  }

  // ---------- page render ----------
  function findPage(id) { return CCAF.pages.find(p => p.id === id); }

  function render() {
    const id = location.hash.replace(/^#\/?/, "") || CCAF.pages[0].id;
    const pg = findPage(id) || CCAF.pages[0];
    P.visited[pg.id] = true;
    save(P);

    const main = document.getElementById("main");
    main.innerHTML = "";
    const page = el('<div class="page"></div>');

    page.appendChild(el(
      '<header class="ep-head">' +
      '<div class="ep-kicker">' + esc(pg.kicker || "CCA-F · THE MARCUS FILES") + "</div>" +
      "<h1>" + esc(pg.title) + "</h1>" +
      (pg.subtitle ? '<div class="ep-sub">' + pg.subtitle + "</div>" : "") +
      (pg.meta ? '<div class="ep-meta">' + pg.meta.map(m => '<span class="tag ' + (m.cls || "") + '">' + esc(m.t) + "</span>").join("") + "</div>" : "") +
      "</header>"
    ));

    // Exam-payoff / measurable objectives band (per-episode header)
    if (pg.objectives && pg.objectives.length) {
      page.appendChild(el(
        '<div class="ep-objectives"><div class="eo-h">After this episode you\'ll be able to</div><ul>' +
        pg.objectives.map(o => "<li>" + o + "</li>").join("") +
        "</ul></div>"
      ));
    }

    const body = el("<div></div>");
    body.innerHTML = pg.body;
    page.appendChild(body);

    // Home page: inject the live per-domain mastery panel into its placeholder
    if (pg.id === "home") {
      const slot = body.querySelector("#domain-bars");
      if (slot) {
        const dm = domainMastery();
        const order = ["D1", "D2", "D3", "D4", "D5"];
        const labels = {
          D1: "Agentic Architecture", D2: "Tool Design & MCP", D3: "Claude Code Config",
          D4: "Prompt & Structured Output", D5: "Context & Reliability"
        };
        const anyData = order.some(d => dm[d] && dm[d].t);
        if (!anyData) {
          slot.innerHTML = '<p class="dm-empty">Take the drills and the mock, and your mastery by domain will appear here.</p>';
        } else {
          slot.innerHTML = order.map(function(d) {
            const e = dm[d] || { c: 0, t: 0 };
            const pct = e.t ? Math.round((e.c / e.t) * 100) : 0;
            const cls = !e.t ? "none" : pct >= 80 ? "good" : pct >= 60 ? "mid" : "low";
            return '<div class="dm-row"><span class="dm-name">' + d + " · " + esc(labels[d]) + "</span>" +
              '<span class="dm-track"><span class="dm-fill ' + cls + '" style="width:' + pct + '%"></span></span>' +
              '<span class="dm-pct">' + (e.t ? pct + "%" : "—") + "</span></div>";
          }).join("");
        }
      }
    }

    // Collapse each lab into a <details> (collapsed by default) to cut scrolling
    body.querySelectorAll(".lab").forEach(function(lab) {
      const head = lab.querySelector(".lab-head");
      const headText = head ? head.textContent.trim() : "Engagement Lab";
      const steps = lab.querySelectorAll(".step").length;
      const meta = steps ? (steps + " step" + (steps === 1 ? "" : "s") + " · click to open") : "click to open";
      const det = el('<details class="lab-collapse"></details>');
      const sum = el(
        '<summary class="lab-summary">' +
        '<span class="ls-title">' + esc(headText) + "</span>" +
        '<span class="ls-meta">' + esc(meta) + "</span>" +
        '<span class="ls-caret" aria-hidden="true">▾</span>' +
        "</summary>"
      );
      lab.parentNode.insertBefore(det, lab);
      det.appendChild(sum);
      det.appendChild(lab);
      if (head) head.style.display = "none"; // summary now carries the title
    });

    // Jump nav — auto-detect Story / Concepts / Build / Drill sections
    const firstStory = body.querySelector(".story");
    if (firstStory && !firstStory.id) firstStory.id = "ep-s";
    const firstH2 = body.querySelector("h2");
    if (firstH2 && !firstH2.id) firstH2.id = "ep-c";
    const firstLab = body.querySelector("details.lab-collapse");
    if (firstLab && !firstLab.id) firstLab.id = "ep-l";
    const jumpSections = [];
    if (firstStory) jumpSections.push({ id: "ep-s", label: "Story" });
    if (firstH2) jumpSections.push({ id: "ep-c", label: "Concepts" });
    if (firstLab) jumpSections.push({ id: "ep-l", label: "Build" });
    if (pg.quiz && pg.quiz.length) jumpSections.push({ id: "ep-d", label: "Drill" });
    if (jumpSections.length >= 2) {
      const jn = el('<nav class="ep-jumpnav"></nav>');
      jumpSections.forEach(function(s) {
        const a = el('<a class="jn-link" tabindex="0">' + esc(s.label) + "</a>");
        a.addEventListener("click", function() {
          const target = document.getElementById(s.id);
          if (!target) return;
          if (target.tagName === "DETAILS") target.open = true; // expand the lab before scrolling
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        jn.appendChild(a);
      });
      page.insertBefore(jn, body);
    }

    if (pg.quiz && pg.quiz.length) {
      page.appendChild(buildQuiz(pg));
    }

    // Bottom pager: Prev (left) ↔ Next (right). Home has its own start CTA in the body.
    const idx = CCAF.pages.indexOf(pg);
    if (pg.id !== "home") {
      const prevPg = idx > 0 ? CCAF.pages[idx - 1] : null;
      const nextPg = idx < CCAF.pages.length - 1 ? CCAF.pages[idx + 1] : null;
      if (prevPg || nextPg) {
        const pager = el('<div class="os-pagenav"></div>');
        pager.appendChild(prevPg
          ? el('<a class="next-link prev" href="#/' + prevPg.id + '">← Prev: ' + esc(prevPg.code) + " · " + esc(prevPg.navTitle || prevPg.title) + "</a>")
          : el("<span></span>"));
        pager.appendChild(nextPg
          ? el('<a class="next-link" href="#/' + nextPg.id + '">Next: ' + esc(nextPg.code) + " · " + esc(nextPg.navTitle || nextPg.title) + " →</a>")
          : el("<span></span>"));
        page.appendChild(pager);
      }
    }

    // Wrap the page in an ApexOS window (retro chrome around readable content)
    const win = el('<div class="os-window"></div>');
    win.appendChild(el(
      '<div class="os-titlebar"><span class="os-tt"><span class="d" aria-hidden="true">◆</span> ' +
      esc(pg.code) + " · " + esc(pg.title) +
      '</span><span class="wb" aria-hidden="true"><b>—</b><b>□</b><b>✕</b></span></div>'
    ));
    const menubar = el('<div class="os-menubar"><button data-go="home"><u>F</u>ile</button><button type="button"><u>E</u>dit</button><button type="button" id="os-view"><u>V</u>iew</button><button data-go="ref"><u>H</u>elp</button></div>');
    menubar.querySelectorAll("button[data-go]").forEach(function(b){ b.addEventListener("click", function(){ location.hash = "#/" + b.getAttribute("data-go"); }); });
    const vbtn = menubar.querySelector("#os-view");
    if (vbtn) vbtn.addEventListener("click", toggleScanlines);
    win.appendChild(menubar);
    const wbody = el('<div class="os-window-body"></div>');
    wbody.appendChild(page);
    win.appendChild(wbody);
    main.appendChild(win);

    const wbtn = document.getElementById("os-winbtn");
    if (wbtn) wbtn.textContent = pg.code + " · " + (pg.navTitle || pg.title);
    const prg = document.getElementById("os-prog");
    if (prg) prg.textContent = overallProgress() + "% complete";

    wireChecks(page);
    wireCopy(page);
    wireChips(page);
    renderSidebar();
    lastPageId = pg.id;
    window.scrollTo(0, 0);
  }

  // ---------- lab checkboxes ----------
  function wireChecks(root) {
    root.querySelectorAll("input[type=checkbox][data-key]").forEach(cb => {
      const k = cb.getAttribute("data-key");
      cb.checked = !!P.checks[k];
      cb.addEventListener("change", () => {
        P.checks[k] = cb.checked;
        save(P);
      });
    });
  }

  // ---------- copy buttons ----------
  function copyText(txt, btn) {
    function ok() {
      btn.classList.add("copied"); btn.textContent = "COPIED ✓";
      setTimeout(() => { btn.classList.remove("copied"); btn.textContent = "COPY"; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(ok).catch(() => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      document.body.removeChild(ta);
    }
  }
  function wireCopy(root) {
    root.querySelectorAll(".codeblock").forEach(cb => {
      if (cb.querySelector(".copy-btn")) return;
      const pre = cb.querySelector("pre");
      if (!pre) return;
      const btn = el('<button class="copy-btn">COPY</button>');
      btn.addEventListener("click", () => copyText(pre.textContent, btn));
      cb.appendChild(btn);
    });
  }

  // ---------- reveal chips (determinism dial etc.) ----------
  function wireChips(root) {
    root.querySelectorAll(".chip[data-side]").forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("revealed")) {
          chip.classList.remove("revealed", "flip-code", "flip-model");
          return;
        }
        chip.classList.add("revealed");
        chip.classList.add(chip.getAttribute("data-side") === "code" ? "flip-code" : "flip-model");
      });
    });
  }

  // ---------- quiz engine (inline one-question-at-a-time stepper) ----------
  function buildQuiz(pg) {
    const isExam = !!pg.exam;
    // The mock shuffles each run so domains interleave (blocked practice inflates confidence).
    const questions = isExam ? shuffle(pg.quiz.slice()) : pg.quiz;
    const total = questions.length;
    const qz = el('<div class="quiz" id="ep-d"></div>');
    qz.appendChild(el('<div class="quiz-title">' + (isExam ? "The Final Assessment — Full Mock Exam" : "Scenario Drill — " + esc(pg.code)) + "</div>"));

    if (isExam) {
      qz.appendChild(el(
        '<p>Suggested pace: <strong>2 minutes per question</strong> (' + total * 2 + ' min total). ' +
        'The timer is advisory — the real exam is ~120 min for ~60 questions. Answer <em>every</em> question; there is no guessing penalty.</p>'
      ));
      qz.appendChild(el('<div class="exam-hud"><span>⏱</span><span class="timer" id="exam-timer">--:--</span><span class="dim" style="color:var(--text-dim)">advisory pace clock</span></div>'));
    }

    // progress dots — also clickable to jump
    const dots = el('<div class="qdots"></div>');
    for (let i = 0; i < total; i++) {
      dots.appendChild(el('<button class="qdot" data-i="' + i + '" aria-label="Go to question ' + (i + 1) + '"></button>'));
    }
    qz.appendChild(dots);

    // single-question stage + nav
    const stage = el('<div class="quiz-stage"></div>');
    qz.appendChild(stage);
    const nav = el('<div class="quiz-nav"></div>');
    const prevBtn = el('<button class="btn q-prev">‹ Prev</button>');
    const counter = el('<span class="q-counter"></span>');
    const nextBtn = el('<button class="btn q-next">Next ›</button>');
    nav.appendChild(prevBtn); nav.appendChild(counter); nav.appendChild(nextBtn);
    qz.appendChild(nav);

    // score + report
    const actions = el('<div class="quiz-actions"></div>');
    const scoreEl = el('<span class="quiz-score"></span>');
    const best0 = P.quizBest[pg.id];
    const bestEl = el("<span>" + (best0 ? '<span class="best-badge">BEST: ' + best0.score + "/" + best0.total + "</span>" : "") + "</span>");
    const reset = el('<button class="btn" style="display:none">Run it again</button>');
    actions.appendChild(scoreEl); actions.appendChild(bestEl); actions.appendChild(reset);
    qz.appendChild(actions);
    const reportSlot = el("<div></div>");
    qz.appendChild(reportSlot);

    // ---- state ----
    const answers = new Array(total).fill(-1);
    const checked = new Array(total).fill(false); // drill: feedback revealed only after "Check answer"
    let current = 0;
    let graded = false;
    let nextMode = "next";
    let timerHandle = null;

    function updateDots() {
      dots.querySelectorAll(".qdot").forEach((d, i) => {
        d.className = "qdot";
        if (i === current) d.classList.add("active");
        if (answers[i] !== -1) d.classList.add("answered");
        if (graded) {
          const ci = questions[i].opts.findIndex(o => o.correct);
          d.classList.add(answers[i] === ci ? "correct" : "wrong");
        }
      });
    }

    function updateNav() {
      counter.textContent = "Question " + (current + 1) + " / " + total;
      prevBtn.disabled = current === 0;
      nextBtn.classList.remove("warn");
      const answered = answers[current] !== -1;
      if (graded) {
        nextMode = "next";
        nextBtn.textContent = "Next ›";
        nextBtn.disabled = current === total - 1;
      } else if (!isExam && answered && !checked[current]) {
        // retrieval friction: commit the answer before seeing feedback
        nextMode = "check";
        nextBtn.textContent = "Check answer";
        nextBtn.classList.add("warn");
        nextBtn.disabled = false;
      } else if (current === total - 1) {
        nextMode = "grade";
        nextBtn.textContent = isExam ? "End simulation & grade" : "Lock in answers";
        nextBtn.classList.add("warn");
        nextBtn.disabled = false;
      } else {
        nextMode = "next";
        nextBtn.textContent = "Next ›";
        nextBtn.disabled = false;
      }
    }

    function renderQuestion(qi) {
      const q = questions[qi];
      const correctIdx = q.opts.findIndex(o => o.correct);
      stage.innerHTML = "";
      const qd = el('<div class="qq" data-qi="' + qi + '"></div>');
      qd.appendChild(el('<div class="qnum">QUESTION ' + (qi + 1) + " / " + total + (q.dom ? " · " + esc(q.dom) : "") + "</div>"));
      qd.appendChild(el('<div class="qtext">' + q.q + "</div>"));
      // Feedback is revealed only after the learner commits: drills on "Check answer", exams after grading.
      const revealed = graded || (!isExam && checked[qi]);
      q.opts.forEach((o, oi) => {
        const lab = el(
          '<label class="qopt" data-oi="' + oi + '">' +
          '<input type="radio" name="q-' + pg.id + "-" + qi + '" value="' + oi + '">' +
          "<span>" + o.t + "</span>" +
          '<div class="opt-why">' +
          (o.trap ? '<span class="opt-trap">⚠ TRAP: ' + esc(o.trap) + "</span><br>" : "") +
          (o.why || "") +
          "</div></label>"
        );
        const input = lab.querySelector("input");
        if (answers[qi] === oi) { input.checked = true; lab.classList.add("sel"); }
        if (revealed) {
          lab.classList.add("show-why");
          input.disabled = true;
          if (oi === correctIdx) lab.classList.add("right");
          if (oi === answers[qi] && oi !== correctIdx) lab.classList.add("wrong");
        }
        input.addEventListener("change", () => {
          if (graded || (!isExam && checked[qi])) return; // locked once feedback is shown
          answers[qi] = oi;
          qd.querySelectorAll(".qopt").forEach(x => x.classList.remove("sel"));
          lab.classList.add("sel");
          updateDots();
          updateNav();
        });
        qd.appendChild(lab);
      });
      if (!graded && !isExam && answers[qi] !== -1 && !checked[qi]) {
        qd.appendChild(el('<p class="q-hint">Selected — click <strong>Check answer</strong> to see why.</p>'));
      }
      stage.appendChild(qd);
      updateDots();
      updateNav();
    }

    function grade() {
      if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
      graded = true;
      let score = 0;
      const domTally = {};                 // per-domain {c,t} for the mastery bars
      const groups = {};                   // canonical trap → { count, specifics:{}, firstQ }
      questions.forEach((q, qi) => {
        const correctIdx = q.opts.findIndex(o => o.correct);
        const chosenIdx = answers[qi];
        const d = q.dom || "—";
        domTally[d] = domTally[d] || { c: 0, t: 0 };
        domTally[d].t++;
        if (chosenIdx === correctIdx) { score++; domTally[d].c++; return; }
        // wrong (or skipped): attribute to a canonical trap type
        const specific = (chosenIdx !== -1 && q.opts[chosenIdx] && q.opts[chosenIdx].trap) || "Skipped / judgment miss";
        const canon = canonTrap(specific);
        const g = groups[canon] || (groups[canon] = { count: 0, specifics: {}, firstQ: qi });
        g.count++;
        g.specifics[specific] = (g.specifics[specific] || 0) + 1;
      });

      const pct = Math.round((score / total) * 100);
      const pass = isExam ? pct >= 85 : pct >= 70;
      scoreEl.className = "quiz-score" + (pass ? "" : " fail");
      scoreEl.textContent = "SCORE: " + score + "/" + total + " (" + pct + "%)" +
        (isExam ? (pct >= 85 ? " — GREEN LIGHT (≥85%)" : " — below the 85% booking bar") : (pass ? " — solid" : " — review & rerun"));

      const prev = P.quizBest[pg.id];
      if (!prev || score > prev.score) P.quizBest[pg.id] = { score: score, total: total, dom: domTally };
      save(P);
      renderSidebar();

      // trap report — grouped by the four canonical wrong-answer types, deep-linked + remediated
      reportSlot.innerHTML = "";
      const ordered = Object.keys(groups).sort((a, b) => groups[b].count - groups[a].count);
      if (ordered.length) {
        const max = groups[ordered[0]].count;
        const rep = el('<div class="trap-report"><h3>⚠ Distractors that got you</h3><p>Grouped by wrong-answer <em>type</em> — study the pattern, not the question. Click a bar to jump back to the first one you missed.</p></div>');
        ordered.forEach(name => {
          const g = groups[name];
          const specifics = Object.keys(g.specifics).map(s => esc(s) + (g.specifics[s] > 1 ? " ×" + g.specifics[s] : "")).join(" · ");
          const row = el(
            '<div class="trap-group">' +
            '<div class="trap-bar" role="button" tabindex="0" title="Jump to the first missed question of this type">' +
            '<div class="tb" style="width:' + (30 + (g.count / max) * 170) + 'px"></div>' +
            "<span><strong>" + esc(name) + "</strong> × " + g.count + ' <span class="tb-jump">↜ review</span></span></div>' +
            '<div class="trap-specifics">' + specifics + "</div>" +
            '<div class="trap-remedy">→ ' + (REMEDY[name] || REMEDY["Other architectural misread"]) + "</div>" +
            "</div>"
          );
          const bar = row.querySelector(".trap-bar");
          const jump = function() { current = g.firstQ; renderQuestion(current); stage.scrollIntoView({ behavior: "smooth", block: "center" }); };
          bar.addEventListener("click", jump);
          bar.addEventListener("keydown", function(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); } });
          rep.appendChild(row);
        });
        reportSlot.appendChild(rep);
      } else if (score === total) {
        reportSlot.appendChild(el('<div class="co check"><span class="co-t">✓ Clean run</span>No distractors landed. ' + (isExam ? "Green light. Schedule the exam." : "Zero traps. Good to move on.") + "</div>"));
      }

      reset.style.display = "";
      renderQuestion(current); // re-render current with feedback + dots colored
      if (isExam) {
        osDialog(pct >= 85 ? "ok" : "error", "Assessment complete",
          "Score: <strong>" + score + " / " + total + " (" + pct + "%)</strong>. " +
          (pct >= 85 ? "Green light — you're at the booking bar." : "Below the 85% booking bar — study the trap report and rerun."));
      }
    }

    // ---- wire controls ----
    dots.querySelectorAll(".qdot").forEach(d => {
      d.addEventListener("click", () => { current = parseInt(d.getAttribute("data-i"), 10); renderQuestion(current); });
    });
    prevBtn.addEventListener("click", () => { if (current > 0) { current--; renderQuestion(current); } });
    nextBtn.addEventListener("click", () => {
      if (graded) { if (current < total - 1) { current++; renderQuestion(current); } return; }
      if (nextMode === "check") {
        checked[current] = true;
        renderQuestion(current);
        const q = questions[current], ci = q.opts.findIndex(o => o.correct);
        if (answers[current] === ci) {
          osDialog("ok", "Correct", (q.opts[ci].why || "Correct."));
        } else {
          const opt = q.opts[answers[current]] || {};
          const rem = REMEDY[canonTrap(opt.trap)] || "";
          osDialog("error", "Incorrect", (opt.why || "Not quite.") + (rem ? '<span class="od-rem">→ ' + rem + "</span>" : ""));
        }
        return;
      }
      if (nextMode === "grade") { grade(); return; }
      if (current < total - 1) { current++; renderQuestion(current); }
    });
    reset.addEventListener("click", () => { render(); });

    // exam timer (auto-grades at 0, with a one-time ~2-minute warning)
    if (isExam) {
      let remaining = total * 120;
      let warned = false;
      timerHandle = setInterval(() => {
        remaining--;
        const t = qz.querySelector("#exam-timer");
        if (!t) { clearInterval(timerHandle); timerHandle = null; return; }
        const m = Math.max(0, Math.floor(remaining / 60)), s = Math.max(0, remaining % 60);
        t.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        if (remaining <= 120) {
          t.classList.add("low");
          if (!warned) {
            warned = true;
            const note = qz.querySelector(".exam-hud .dim");
            if (note) { note.textContent = "⚠ ~2 min left — it auto-grades whatever you've answered at 0:00"; note.classList.add("warn"); }
          }
        }
        if (remaining <= 0) { clearInterval(timerHandle); timerHandle = null; if (!graded) grade(); }
      }, 1000);
      const t0 = qz.querySelector("#exam-timer");
      if (t0) t0.textContent = String(total * 2).padStart(2, "0") + ":00";
    }

    renderQuestion(0);
    return qz;
  }

  // ---------- ApexOS chrome ----------
  let lastPageId = null;
  function prefersReducedMotion() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function applyScanlines() {
    let on = false; try { on = localStorage.getItem("ccaf-apex-scan") === "1"; } catch (e) {}
    document.body.classList.toggle("os-scan", on && !prefersReducedMotion());
  }
  function toggleScanlines() {
    const on = !document.body.classList.contains("os-scan");
    try { localStorage.setItem("ccaf-apex-scan", on ? "1" : "0"); } catch (e) {}
    document.body.classList.toggle("os-scan", on);
  }
  function startClock() {
    const elc = document.getElementById("os-clock"); if (!elc) return;
    function tick() {
      const d = new Date(); let h = d.getHours(); const m = d.getMinutes();
      const ap = h < 12 ? "AM" : "PM"; h = h % 12; if (h === 0) h = 12;
      elc.textContent = h + ":" + String(m).padStart(2, "0") + " " + ap;
    }
    tick(); setInterval(tick, 15000);
  }
  function runBoot() {
    const boot = document.getElementById("os-boot"); if (!boot) return;
    let already = false; try { already = !!localStorage.getItem("ccaf-apex-booted"); } catch (e) {}
    function done() { boot.classList.add("hide"); try { localStorage.setItem("ccaf-apex-booted", "1"); } catch (e) {} }
    if (already || prefersReducedMotion()) { done(); return; }
    const skip = document.getElementById("os-bootskip");
    function finish() { document.removeEventListener("keydown", onKey); done(); }
    function onKey() { finish(); }
    if (skip) skip.addEventListener("click", finish);
    document.addEventListener("keydown", onKey);
    setTimeout(finish, 1900);
  }
  function showLoader(cb) {
    const ld = document.getElementById("os-loader");
    if (!ld || prefersReducedMotion()) { cb(); return; }
    const epc = document.getElementById("os-loader-ep");
    const pg = findPage(location.hash.replace(/^#\/?/, ""));
    if (epc) epc.textContent = pg ? " " + pg.code : "";
    ld.classList.remove("hide");
    const bar = ld.querySelector(".ldbar i"); if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
    setTimeout(function () { ld.classList.add("hide"); cb(); }, 480);
  }
  function ensureDialog() {
    let layer = document.getElementById("os-dialog-layer"); if (layer) return layer;
    layer = el('<div class="os-dialog-layer hide" id="os-dialog-layer"><div class="os-dialog" role="dialog" aria-modal="true" aria-labelledby="od-ttext"><div class="od-title" id="od-title"><span id="od-ttext">Incorrect</span></div><div class="od-body"><span class="os-haz" id="od-haz"><span id="od-hazg">!</span></span><span class="od-msg" id="od-msg"></span></div><div class="od-actions"><button class="btn" id="od-ok">OK</button></div></div></div>');
    document.body.appendChild(layer);
    const close = function () { layer.classList.add("hide"); };
    layer.querySelector("#od-ok").addEventListener("click", close);
    layer.addEventListener("click", function (e) { if (e.target === layer) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !layer.classList.contains("hide")) close(); });
    return layer;
  }
  function osDialog(kind, title, msgHtml) {
    const layer = ensureDialog();
    const ok = kind === "ok";
    layer.querySelector("#od-title").className = "od-title" + (ok ? " ok" : "");
    layer.querySelector("#od-haz").className = "os-haz" + (ok ? " ok" : "");
    layer.querySelector("#od-hazg").textContent = ok ? "✓" : "!";
    layer.querySelector("#od-ttext").textContent = title;
    layer.querySelector("#od-msg").innerHTML = msgHtml;
    layer.classList.remove("hide");
    const dlg = layer.querySelector(".os-dialog");
    if (!prefersReducedMotion()) { dlg.classList.remove("os-shake"); void dlg.offsetWidth; dlg.classList.add("os-shake"); }
    const okb = layer.querySelector("#od-ok"); if (okb) okb.focus();
  }

  // ---------- boot / routing ----------
  window.addEventListener("hashchange", function () {
    const id = location.hash.replace(/^#\/?/, "");
    const isEp = /^ep\d/.test(id), wasEp = lastPageId && /^ep\d/.test(lastPageId);
    if (isEp && wasEp && id !== lastPageId) showLoader(render);
    else render();
  });
  window.addEventListener("DOMContentLoaded", function () {
    CCAF.pages.sort((a, b) => (a.order || 0) - (b.order || 0));
    applyScanlines();
    startClock();
    runBoot();
    const launch = document.getElementById("os-launch");
    if (launch) launch.addEventListener("click", function () { location.hash = "#/home"; window.scrollTo(0, 0); });
    renderSidebar();
    render();
  });
})();
