const multiAgentArticleHtml = `
<div class="article-meta">
  <span>Agentic AI</span>
  <span>March 26, 2026</span>
</div>

<h1>Why Multi-Agent Systems Break — And the 3 Patterns That Actually Fix Them</h1>

<p class="subtitle">Two LLM primitives, three nested failure loops, and checkpoint-based execution. What I learned building a production agentic pipeline with 100+ autonomous agent invocations.</p>

<div class="author-row">
  <div class="author-avatar">SP</div>
  <div class="author-info">
    <div class="author-name">Shantanu Patil</div>
    <div class="author-title">AI Engineer · Building production agentic systems</div>
  </div>
</div>

<!-- HERO DIAGRAM -->
<div class="hero-img">
  <svg class="hero-svg" viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#e8956a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
    <!-- Boxes -->
    <rect x="20" y="60" width="120" height="80" rx="8" fill="#111520" stroke="#e8956a" stroke-width="1"/>
    <text x="80" y="92" text-anchor="middle" fill="#e8c87a" font-family="Inter, sans-serif" font-size="11" font-weight="500">USER PROMPT</text>
    <text x="80" y="114" text-anchor="middle" fill="#888" font-family="Inter, sans-serif" font-size="10">raw input</text>

    <rect x="180" y="60" width="120" height="80" rx="8" fill="#111520" stroke="#5DCAA5" stroke-width="1"/>
    <text x="240" y="92" text-anchor="middle" fill="#7FC9A0" font-family="Inter, sans-serif" font-size="11" font-weight="500">CLASSIFIER</text>
    <text x="240" y="114" text-anchor="middle" fill="#4A9B70" font-family="Inter, sans-serif" font-size="10">.ai() — single shot</text>

    <rect x="340" y="20" width="140" height="56" rx="8" fill="#111520" stroke="#e8c87a" stroke-width="1"/>
    <text x="410" y="44" text-anchor="middle" fill="#e8c87a" font-family="Inter, sans-serif" font-size="11" font-weight="500">FAST PATH</text>
    <text x="410" y="60" text-anchor="middle" fill="#a08030" font-family="Inter, sans-serif" font-size="10">2 agents</text>

    <rect x="340" y="120" width="140" height="56" rx="8" fill="#111520" stroke="#E88A8A" stroke-width="1"/>
    <text x="410" y="144" text-anchor="middle" fill="#E88A8A" font-family="Inter, sans-serif" font-size="11" font-weight="500">THOROUGH PATH</text>
    <text x="410" y="160" text-anchor="middle" fill="#B06060" font-family="Inter, sans-serif" font-size="10">4 agents + QA</text>

    <rect x="540" y="60" width="120" height="80" rx="8" fill="#111520" stroke="#e8956a" stroke-width="1"/>
    <text x="600" y="92" text-anchor="middle" fill="#e8c87a" font-family="Inter, sans-serif" font-size="11" font-weight="500">DRAFT PR</text>
    <text x="600" y="114" text-anchor="middle" fill="#888" font-family="Inter, sans-serif" font-size="10">verified output</text>

    <!-- Arrows -->
    <line x1="140" y1="100" x2="178" y2="100" stroke="#e8956a" stroke-width="1.5" marker-end="url(#ha)"/>
    <path d="M300 85 L338 48" fill="none" stroke="#e8c87a" stroke-width="1.2" marker-end="url(#ha)"/>
    <path d="M300 115 L338 148" fill="none" stroke="#E88A8A" stroke-width="1.2" marker-end="url(#ha)"/>
    <path d="M480 48 L538 85" fill="none" stroke="#e8c87a" stroke-width="1.2" marker-end="url(#ha)"/>
    <path d="M480 148 L538 115" fill="none" stroke="#E88A8A" stroke-width="1.2" marker-end="url(#ha)"/>
  </svg>
</div>


<p>Everyone's building with AI agents right now. Most of it is demos. Single agent, single prompt, maybe a tool call or two. Looks great in a Loom video. Falls apart the moment you try to ship it.</p>

<p>I've been deep in building a production agentic platform for months — LangGraph pipelines, multiple specialized agents coordinating on the same output, real users on the other end. Not a hackathon project. A product that has to work every time someone hits "build."</p>

<p>The first time I ran 30+ agent invocations in parallel on a shared codebase, I got back output that looked correct until I noticed one agent had built its entire layer on a module another agent never exported. Tests passed because the downstream agent mocked the dependency. Code compiled. Everything looked clean. The system did not work.</p>

<p>That's the convergence problem: getting N autonomous processes to produce one coherent result requires actual primitives for isolation, failure recovery, and state reconciliation. Not better prompts.</p>

<p>Here are the three patterns I've landed on after months of debugging this in production.</p>


<div class="sep">· · ·</div>


<h2>1. You Need Two Modes of LLM Integration, Not One</h2>

<p>The most common architectural mistake in multi-agent systems is giving every agent the same kind of LLM access. I made this mistake early on.</p>

<p>When every call can use any tool, take any amount of time, and produce any shape of output, you lose the ability to reason about the system operationally. You can't set SLAs. You can't predict costs. You can't even build retry logic, because the meaning of "retry" changes depending on whether you're re-running a 45-minute autonomous loop or re-running a 200ms classification call.</p>

<p>The fix was separating LLM integration into two distinct primitives.</p>

<!-- DIAGRAM: Two Primitives -->
<div class="diagram-container">
  <svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="d1a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>

    <!-- Left: Constrained Call -->
    <rect x="40" y="30" width="280" height="260" rx="16" fill="#0d1520" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="180" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#e8c87a">Constrained call</text>
    <text x="180" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#5a8fbf">single-shot · structured · no tools</text>

    <rect x="70" y="100" width="220" height="40" rx="6" fill="#111d2e" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="180" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Structured input</text>

    <line x1="180" y1="140" x2="180" y2="160" stroke="#1e3a5f" stroke-width="1" marker-end="url(#d1a)"/>

    <rect x="70" y="160" width="220" height="40" rx="6" fill="#111d2e" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="180" y="184" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Classification / routing</text>

    <line x1="180" y1="200" x2="180" y2="220" stroke="#1e3a5f" stroke-width="1" marker-end="url(#d1a)"/>

    <rect x="70" y="220" width="220" height="40" rx="6" fill="#111d2e" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="180" y="244" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Structured output</text>

    <text x="180" y="282" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#5a8fbf">~200ms · fractions of a cent</text>

    <!-- Right: Autonomous Loop -->
    <rect x="360" y="30" width="280" height="260" rx="16" fill="#1a1508" stroke="#3d2e10" stroke-width="0.5"/>
    <text x="500" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#e8c87a">Autonomous loop</text>
    <text x="500" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#a08030">multi-turn · tool-using · goal-driven</text>

    <rect x="390" y="100" width="220" height="40" rx="6" fill="#1f1a0a" stroke="#3d2e10" stroke-width="0.5"/>
    <text x="500" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Goal + toolset</text>

    <line x1="500" y1="140" x2="500" y2="160" stroke="#3d2e10" stroke-width="1" marker-end="url(#d1a)"/>

    <rect x="390" y="160" width="220" height="40" rx="6" fill="#1f1a0a" stroke="#3d2e10" stroke-width="0.5"/>
    <text x="500" y="184" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Iterate: write → test → fix</text>

    <!-- Loop arrow -->
    <path d="M612 180 Q 630 180, 630 150 Q 630 120, 612 120" fill="none" stroke="#a08030" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="644" y="154" font-family="Inter, sans-serif" font-size="10" fill="#a08030">retry</text>

    <line x1="500" y1="200" x2="500" y2="220" stroke="#3d2e10" stroke-width="1" marker-end="url(#d1a)"/>

    <rect x="390" y="220" width="220" height="40" rx="6" fill="#1f1a0a" stroke="#3d2e10" stroke-width="0.5"/>
    <text x="500" y="244" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#e8c87a">Verifiable outcome</text>

    <text x="500" y="282" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#a08030">minutes · dollars per invocation</text>
  </svg>
  <div class="diagram-caption">Two primitives: constrained single-shot call vs. autonomous iteration loop</div>
</div>

<p>The first is a <strong>constrained call</strong>. Single-shot, structured input and output, no tools, no iteration. It handles routing and classification. "Is this a new project or a modification?" "Does this need backend?" "What complexity tier?" During planning, each task gets a guidance block like this:</p>

<div class="code-block">
<span class="key">TaskGuidance</span>:
  <span class="key">needs_new_tests</span>: <span class="value">true</span>
  <span class="key">estimated_scope</span>: <span class="string">"medium"</span>
  <span class="key">touches_interfaces</span>: <span class="value">true</span>
  <span class="key">needs_deeper_qa</span>: <span class="value">true</span>
  <span class="key">agent_guidance</span>: <span class="string">"Complex parsing logic with edge cases, run QA in parallel"</span>
</div>

<p>The structured fields drive routing. The guidance string carries context for downstream agents. A call like this costs fractions of a cent and takes milliseconds.</p>

<p>The second is an <strong>autonomous loop</strong>. Multi-turn, tool-using, goal-driven. It receives a goal and a toolset, then iterates until it produces a verifiable outcome. It reads files, writes code, runs tests, discovers failures, and tries again. You check what it delivered, not how it got there. A single complex invocation can run 150+ tool-use turns and cost over $4.</p>

<p>A single boolean from a cheap classification call — <code>needs_deeper_qa</code> — determines whether a task runs through a lean two-call path (coder, then reviewer) or a thorough four-call path (coder, QA and reviewer in parallel, then synthesizer). Routing is cheap. Execution is expensive. Keeping them separate is what makes the system both flexible and cost-efficient.</p>


<div class="sep">· · ·</div>


<h2>2. What Happens When Agents Fail (Which They Will, Constantly)</h2>

<p>In a 100+ invocation build, failures are the normal path — not edge cases. Let me walk through what actually happens.</p>

<h3>Deadlocks that retrying can't fix</h3>

<p>One of my integration test tasks timed out after 2700 seconds. The tests themselves were correct — code review approved them — but the binary they tested had an infinite loop. The inner retry loop ran the same agent on the same binary. Same timeout. Same failure. Retrying would never help.</p>

<div class="code-block">
{
  <span class="key">"iteration"</span>: <span class="value">2</span>,
  <span class="key">"action"</span>: <span class="string">"block"</span>,
  <span class="key">"summary"</span>: <span class="string">"Task is stuck in a loop. Tests timeout after 2700s in iteration 2,
    same failure as iteration 1 despite attempted fix. The test suite is
    well-written and passes code review, but the underlying binary hangs."</span>,
  <span class="key">"qa_passed"</span>: <span class="value">false</span>,
  <span class="key">"review_approved"</span>: <span class="value">true</span>,
  <span class="key">"review_blocking"</span>: <span class="value">false</span>
}
</div>

<p>Notice: <code>review_approved: true</code> alongside <code>qa_passed: false</code>. The tests were good. The code was broken. There are four responses to this kind of failure, and three are wrong. Retrying burns budget. Aborting wastes the 80% that already succeeded. Silently dropping ships broken code. The fourth option — <strong>block</strong> the task, record a typed debt item, and let the rest of the build work around the gap:</p>

<div class="code-block">
{
  <span class="key">"type"</span>: <span class="string">"dropped_acceptance_criterion"</span>,
  <span class="key">"criterion"</span>: <span class="string">"integration tests pass end-to-end"</span>,
  <span class="key">"severity"</span>: <span class="string">"high"</span>,
  <span class="key">"justification"</span>: <span class="string">"Binary deadlocks on invocation; test suite correct
    but needs runtime debugging beyond automated repair"</span>
}
</div>

<p>This debt record is a typed, severity-rated data structure that downstream agents consume. Not a log message. When a dependent task starts, it receives <code>debt_notes</code> explaining what upstream failed to deliver, so it can work around known gaps instead of building on assumptions that no longer hold.</p>

<h3>Review catches that tests miss</h3>

<p>Another task produced 119 passing tests and met all acceptance criteria. QA approved. But code review blocked — one missing <code>pub mod app;</code> line meant the module was invisible to consumers. Every test passed. Every criterion met. The module was useless. The inner loop caught it, and the next iteration fixed it.</p>

<h3>Regressions on trivial tasks</h3>

<p>The simplest task in the entire build — literally "create the project scaffold" — passed on iteration 1. Then iteration 2 regressed. The coder, trying to be helpful, added module declarations for code that didn't exist yet. A regression in the simplest task, on the second try. Autonomous code generation fails in ways you don't predict, even on trivial work.</p>

<h3>The escalation hierarchy</h3>

<p>These failures illustrate why a single retry loop is insufficient. The system needs three nested control loops.</p>

<!-- DIAGRAM: Three Loops -->
<div class="diagram-container">
  <svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer loop -->
    <rect x="30" y="20" width="620" height="340" rx="20" fill="none" stroke="#6b63c7" stroke-width="1" stroke-dasharray="6 4"/>
    <text x="340" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#9b93e8">OUTER LOOP — Replanner</text>
    <text x="340" y="66" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#7F77DD">Restructures remaining work graph on cascading failures</text>

    <!-- Middle loop -->
    <rect x="60" y="82" width="560" height="240" rx="14" fill="none" stroke="#5DCAA5" stroke-width="1" stroke-dasharray="6 4"/>
    <text x="340" y="108" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#5DCAA5">MIDDLE LOOP — Issue Advisor</text>
    <text x="340" y="124" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#3da885">5 recovery actions when inner loop is exhausted</text>

    <!-- Inner loop -->
    <rect x="90" y="140" width="500" height="150" rx="10" fill="#111d2e" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="340" y="168" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#e8c87a">INNER LOOP — Per-task retry</text>
    <text x="340" y="186" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#5a8fbf">Up to 5 iterations with feedback from QA + review</text>

    <!-- Inner boxes -->
    <rect x="120" y="204" width="100" height="36" rx="6" fill="#0d1520" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="170" y="226" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#e8c87a">Code</text>

    <rect x="240" y="204" width="100" height="36" rx="6" fill="#0d1520" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="290" y="226" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#e8c87a">Test</text>

    <rect x="360" y="204" width="100" height="36" rx="6" fill="#0d1520" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="410" y="226" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#e8c87a">Review</text>

    <rect x="480" y="204" width="90" height="36" rx="6" fill="#0d1520" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="525" y="226" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="500" fill="#e8c87a">Fix</text>

    <!-- Arrows -->
    <line x1="220" y1="222" x2="238" y2="222" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="340" y1="222" x2="358" y2="222" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="460" y1="222" x2="478" y2="222" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Loop back arrow -->
    <path d="M525 240 Q 525 262, 340 262 Q 170 262, 170 240" fill="none" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="340" y="276" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#5a8fbf">retry with feedback</text>
  </svg>
  <div class="diagram-caption">Three nested control loops: inner (per-task), middle (advisor), outer (replanner)</div>
</div>

<p>The <strong>inner loop</strong> runs per task, up to 5 iterations. The agent retries itself with feedback from QA and review. The missing export I mentioned? Caught and fixed here. This handles problems that the same agent can solve given better information.</p>

<p>The <strong>middle loop</strong> is a task advisor that activates when the inner loop is exhausted. It has five typed recovery actions:</p>

<div class="table-wrap">
<table>
  <thead>
    <tr><th>Action</th><th>What happens</th></tr>
  </thead>
  <tbody>
    <tr><td>RETRY_MODIFIED</td><td>Relax acceptance criteria, record the gap as typed debt</td></tr>
    <tr><td>RETRY_APPROACH</td><td>Same criteria, different strategy ("use a different library")</td></tr>
    <tr><td>SPLIT</td><td>Break the task into smaller sub-tasks</td></tr>
    <tr><td>ACCEPT_WITH_DEBT</td><td>Close enough — record each gap as typed, severity-rated debt</td></tr>
    <tr><td>ESCALATE_TO_REPLAN</td><td>Can't be fixed locally — restructure the remaining work</td></tr>
  </tbody>
</table>
</div>

<p>On its final invocation, the prompt explicitly warns that this is the last chance, biasing the advisor toward acceptance or escalation rather than another futile retry.</p>

<p>The <strong>outer loop</strong> is a replanner. When failures cascade — when a dependency that three downstream tasks rely on is fundamentally broken — someone needs to restructure the remaining work graph. Skip dependents, reduce scope, or abort gracefully. And if the replanner itself crashes? Default to <strong>continue</strong>, not abort. For expensive workflows, graceful degradation beats fail-fast every time.</p>


<div class="sep">· · ·</div>


<h2>3. Making Expensive Builds Survivable</h2>

<p>A full build with 100+ agent invocations can cost over $100 and run for 30+ minutes. A crash at invocation 80 cannot mean restarting from invocation 1.</p>

<p>Coming from a background where long-running jobs can fail at any time, I brought the same assumption here: a multi-agent build is a long-running, expensive process, and the infrastructure must treat it that way from the start.</p>

<h3>Checkpoint everything</h3>

<p>LLM timeouts, rate limits, network errors, and malformed output can each crash a build on their own. Checkpointing at every level boundary is what makes this survivable:</p>

<div class="code-block">
{
  <span class="key">"current_level"</span>: <span class="value">3</span>,
  <span class="key">"completed_levels"</span>: [<span class="value">0</span>, <span class="value">1</span>, <span class="value">2</span>],
  <span class="key">"all_tasks"</span>: [
    <span class="string">"project-scaffold"</span>, <span class="string">"types-module"</span>, <span class="string">"error-module"</span>,
    <span class="string">"lexer"</span>, <span class="string">"parser"</span>, <span class="string">"validator"</span>,
    <span class="string">"layout-engine"</span>, <span class="string">"renderer"</span>, <span class="string">"app-module"</span>,
    <span class="string">"integration-tests"</span>, <span class="string">"documentation"</span>, <span class="string">"final-verification"</span>
  ],
  <span class="key">"replan_count"</span>: <span class="value">0</span>,
  <span class="key">"accumulated_debt"</span>: [...]
}
</div>

<p>A <code>resume_build()</code> call loads the checkpoint, skips completed levels, and continues from the exact failure point. A 30-minute build that fails at minute 25 doesn't restart from minute 0. The checkpoint also captures git state — branch names, initial commit SHA, worktree mappings — so the resumed build can reconstruct the full workspace without re-cloning.</p>

<h3>Isolate agents with git worktrees</h3>

<p>Each task gets a git worktree on a dedicated branch. When three tasks run in parallel at the same dependency level — say a lexer, parser, and validator — each works in its own worktree, modifying different files. No lock contention. No conflicts during coding.</p>

<!-- DIAGRAM: Gate Sequence -->
<div class="diagram-container">
  <svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="d3a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>

    <text x="340" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#9b93e8">Gate sequence between every dependency level</text>

    <!-- Gates -->
    <rect x="20" y="50" width="92" height="50" rx="6" fill="#161228" stroke="#6b63c7" stroke-width="0.5"/>
    <text x="66" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#9b93e8">Merge</text>
    <text x="66" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#9b93e8">branches</text>

    <line x1="112" y1="75" x2="130" y2="75" stroke="#6b63c7" stroke-width="1" marker-end="url(#d3a)"/>

    <rect x="132" y="50" width="92" height="50" rx="6" fill="#111d2e" stroke="#1e3a5f" stroke-width="0.5"/>
    <text x="178" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#e8c87a">Integration</text>
    <text x="178" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#5a8fbf">test gate</text>

    <line x1="224" y1="75" x2="242" y2="75" stroke="#1e3a5f" stroke-width="1" marker-end="url(#d3a)"/>

    <rect x="244" y="50" width="92" height="50" rx="6" fill="#1a1508" stroke="#3d2e10" stroke-width="0.5"/>
    <text x="290" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#e8c87a">Debt</text>
    <text x="290" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#a08030">propagate</text>

    <line x1="336" y1="75" x2="354" y2="75" stroke="#3d2e10" stroke-width="1" marker-end="url(#d3a)"/>

    <rect x="356" y="50" width="92" height="50" rx="6" fill="#0a1a14" stroke="#5DCAA5" stroke-width="0.5"/>
    <text x="402" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#5DCAA5">Split</text>
    <text x="402" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#5DCAA5">sub-tasks</text>

    <line x1="448" y1="75" x2="466" y2="75" stroke="#5DCAA5" stroke-width="1" marker-end="url(#d3a)"/>

    <rect x="468" y="50" width="92" height="50" rx="6" fill="#1a0e0e" stroke="#5a2020" stroke-width="0.5"/>
    <text x="514" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#E88A8A">Replan</text>
    <text x="514" y="88" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" fill="#B06060">if needed</text>

    <line x1="560" y1="75" x2="578" y2="75" stroke="#5a2020" stroke-width="1" marker-end="url(#d3a)"/>

    <rect x="580" y="50" width="80" height="50" rx="6" fill="#0f1a0a" stroke="#3a5a20" stroke-width="0.5"/>
    <text x="620" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="500" fill="#97C459">Checkpoint</text>

    <!-- Bottom note -->
    <text x="340" y="136" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#888">Every level starts clean. No level inherits dirty state from the previous one.</text>
    <text x="340" y="156" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#888">Any gate can pause for human approval in regulated environments.</text>
  </svg>
  <div class="diagram-caption">Six-gate handoff between dependency levels ensures clean state transitions</div>
</div>

<p>Between levels, a merger agent integrates completed branches. It's not a mechanical <code>git merge</code> — it reads the architecture spec and file conflict annotations from the planning phase to make intent-aware resolution decisions. When two tasks modify the same file, the merger understands what each change was trying to accomplish.</p>

<p>The gate sequence enforces a clean handoff: merge, integration test, debt propagation, split injection, replan check, and checkpoint. Every level starts clean. No level inherits dirty state from the previous one.</p>


<div class="sep">· · ·</div>


<h2>Architecture Beats Model Selection</h2>

<p>I assumed smarter models would produce better results. They didn't — at least not in the way I expected.</p>

<p>The same pipeline architecture, with proper verification loops and escalation, produced near-identical quality whether I ran cheap models or expensive ones on the same benchmark. The verification loops do the heavy lifting that people usually attribute to model intelligence. More inner loop cycles, cheaper per cycle, same outcome.</p>

<div class="callout">
  <strong>The takeaway:</strong> Instead of asking "which model is smartest?", ask "which model gives the best cost-quality tradeoff for this specific role?" Then make the model a runtime parameter — not a hardcoded choice.
</div>

<p>What actually matters is role-based model allocation. The model config is a flat map:</p>

<div class="code-block">
{
  <span class="key">"models"</span>: {
    <span class="key">"default"</span>: <span class="string">"sonnet"</span>,
    <span class="key">"coder"</span>: <span class="string">"haiku"</span>,
    <span class="key">"qa"</span>: <span class="string">"haiku"</span>,
    <span class="key">"architect"</span>: <span class="string">"sonnet"</span>,
    <span class="key">"reviewer"</span>: <span class="string">"sonnet"</span>
  }
}
</div>

<p>Swap <code>"coder": "haiku"</code> for <code>"coder": "opus"</code> and re-run. The architecture stays constant. Every role — coder, reviewer, QA, planner, merger — can be assigned independently. Track everything: which model handled which role, iterations per task, cost breakdown per agent type. Model selection becomes an empirical question with data behind it, not a gut feel.</p>


<div class="sep">· · ·</div>


<h2>What I'd Do Differently</h2>

<p><strong>Cross-agent memory is harder than it looks.</strong> I maintain a shared key-value store that propagates conventions and failure patterns across tasks in a build. When conventions discovered by the first successful agent — naming patterns, project structure idioms, testing conventions — reach every subsequent agent, it prevents a lot of repeated mistakes. But too much context in the prompt and the agent starts ignoring the actual task. I'm still tuning the tradeoff between memory breadth and prompt focus. Keeping the memory store simple and structured helps reliability, but it means manually defining what gets stored and when.</p>

<p><strong>The verify-fix loop saves builds, but it can mask bad planning.</strong> After all tasks complete, a verifier checks every acceptance criterion against the actual output. If anything fails, the system generates targeted fix tasks and feeds them back through the execution engine. This is powerful. But if you're generating fix tasks on every run, the real problem might be upstream in the planner, not downstream in the verifier. I've started tracking fix-task frequency as a signal for planning quality. Haven't solved this yet, but at least I'm measuring it.</p>

<p><strong>100+ invocations at $100+ is too expensive for iteration.</strong> The architecture works. But the cost per build makes rapid iteration impractical. The right answer is smarter risk-proportional allocation — routing low-risk tasks to cheaper models, cutting unnecessary QA passes on straightforward work — rather than cheaper models across the board. There's a lot of room to optimize here.</p>


<div class="sep">· · ·</div>


<p>None of this is theoretical. These patterns come from watching real builds fail, debugging real regressions at 2 AM, and slowly extracting the abstractions that keep showing up. The gap between "agent demo" and "agent in production" is enormous, and most of it is failure handling, state management, and cost control — not prompt engineering.</p>

<p>If you're building multi-agent systems and haven't hit these walls yet, you will. Hopefully this saves you a few iterations.</p>


<div class="tags">
  <span class="tag">#AgenticAI</span>
  <span class="tag">#LLM</span>
  <span class="tag">#MultiAgentSystems</span>
  <span class="tag">#ProductionAI</span>
  <span class="tag">#LangGraph</span>
  <span class="tag">#SoftwareEngineering</span>
  <span class="tag">#AIEngineering</span>
</div>

`;

export default multiAgentArticleHtml;
