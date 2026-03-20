export interface BlogData {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

const blogs: BlogData[] = [
  {
    slug: "multi-agent-system-ships-real-software",
    title: "How We Built a Multi-Agent System That Ships Real Software",
    description:
      "A deep dive into the architecture behind Vibe — intent classification, LangGraph state graphs, and bounded ReAct loops in production.",
    date: "Mar 2026",
    readTime: "8 min read",
    tags: ["Agentic AI", "LangGraph", "Production"],
    content: `
## The Problem

Most AI demos generate code. Very few ship it. The gap between "here's some code" and "here's a deployed web app" is enormous — you need intent understanding, pipeline orchestration, error recovery, and a system that doesn't fall apart when the LLM hallucinates.

At Sav.com, we built **Vibe** — an agentic platform that takes a user prompt and ships a deployable web app. This is how.

## Architecture Overview

The entry point is an **Intent Agent** I designed. It classifies user input across a 25+ field schema with custom validation rules. Based on that classification, a **LangGraph state graph** picks which of four pipelines to run:

- **Full Build** — generate an entire application from scratch
- **Fix** — debug and repair broken code
- **Feature** — add functionality to an existing app
- **Plan** — create a technical plan before building

Each pipeline spins up the right downstream agents.

## Bounded ReAct Loops

The agents run in bounded ReAct loops. This is critical. An unbounded agent will:

1. Burn through your token budget
2. Hallucinate increasingly wild solutions
3. Ship unvalidated output

Our agents have **token ceilings** and **step limits**. They get enough room to reason through complex problems — self-correct across multiple steps — but they're hard-capped. Every agent pipeline in Vibe runs on this pattern now.

## Intent Classification

The Intent Agent has **48 test cases** across 5 groups and uses a weighted memory retrieval system with a hard **2,000-token context budget**. It doesn't just classify "build me a website" — it extracts structured metadata like framework preferences, deployment targets, and feature requirements.

## Exception Handling

Agents negotiate **three possible outcomes** across **six failure categories** instead of just crashing. This started as an RFC I wrote that went through full engineering review before we built it. The categories cover:

- Model failures (rate limits, context overflow)
- Validation failures (generated code doesn't pass checks)
- Infrastructure failures (deployment issues)
- Schema mismatches
- Timeout and resource exhaustion
- Dependency conflicts

## Streaming Partial Output

We stream partial agent output back to the client while generation is still running. Otherwise, long builds feel broken — the user stares at a spinner for 60 seconds with no feedback. The streaming layer sits on top of FastAPI with Server-Sent Events.

## What I Learned

Building production agent systems is fundamentally different from building demos. The agent reasoning is maybe 20% of the work. The other 80% is:

- **Observability** — knowing what your agents are doing and why
- **Failure modes** — every LLM call can fail in novel ways
- **Cost control** — unbounded agents will bankrupt you
- **Validation** — never trust agent output without verification

Nothing ships without a written plan that's been reviewed by the EM and the team. This is how we caught three schema gaps and two backward-compatibility issues before they hit production.
`,
  },
  {
    slug: "bounded-react-token-ceilings",
    title: "Bounded ReAct: Why Your AI Agents Need Token Ceilings",
    description:
      "Agents that can self-correct are powerful. Agents that spiral are expensive. Here's how we cap reasoning without killing capability.",
    date: "Feb 2026",
    readTime: "6 min read",
    tags: ["ReAct", "Agent Design", "LLMs"],
    content: `
## The Spiral Problem

Give an LLM agent a complex task with no guardrails and watch what happens. It reasons, hits a wall, tries again, reasons more, tries a different approach, backtracks, and keeps going. Token usage goes exponential. Output quality goes to zero.

This is the **agent spiral problem**, and every team building production agents hits it.

## What is Bounded ReAct?

ReAct (Reasoning + Acting) is a well-known pattern where agents alternate between thinking and tool use. **Bounded ReAct** adds hard constraints:

- **Token ceiling** — maximum tokens per reasoning cycle
- **Step limit** — maximum number of reason-act iterations
- **Verification checkpoints** — mandatory validation between cycles

The key insight: you're not limiting the agent's intelligence. You're limiting its tendency to overthink.

## How We Implement It

At Vibe, every agent pipeline runs on bounded ReAct. Here's the structure:

\`\`\`
Agent receives task
  → Reason (within token budget)
  → Act (execute tool/generate code)
  → Verify (mandatory checkpoint)
  → If not done AND under limits → loop
  → If limits hit → graceful exit with partial result
  → If verified → return result
\`\`\`

The token ceiling is set per-pipeline. A simple CSS fix gets a small budget. A full application build gets more — but still capped.

## Why Not Just Let Agents Run?

Three reasons:

1. **Cost** — GPT-4 class models at $30-60/M tokens add up fast when agents spiral
2. **Latency** — users don't wait 5 minutes for a color change
3. **Quality degrades** — after ~3 failed attempts, agent output gets worse, not better

## The 2,000-Token Context Budget

Our Intent Agent uses a weighted memory retrieval system with a hard 2,000-token context budget. This isn't arbitrary — we tested budgets from 500 to 10,000 tokens. Below 1,500, classification accuracy dropped. Above 3,000, it plateaued but cost increased linearly.

2,000 is the sweet spot for our schema.

## Results

After implementing bounded ReAct across all pipelines:

- **Token usage dropped 60%** per build
- **Build success rate went up** — fewer spirals means fewer corrupted outputs
- Average build time became **more predictable** — variance dropped significantly

## Takeaway

If you're building production agents, cap them. Not because they're dumb — because they're expensive and unpredictable when uncapped. The right constraints make agents more reliable, not less capable.
`,
  },
  {
    slug: "exception-handling-ai-agents",
    title: "Exception Handling for AI Agents — Beyond Try/Catch",
    description:
      "When your agents negotiate outcomes across six failure categories instead of just crashing. An RFC that became production code.",
    date: "Jan 2026",
    readTime: "7 min read",
    tags: ["Reliability", "Agentic AI", "Architecture"],
    content: `
## Why Standard Error Handling Fails for Agents

In traditional software, errors are predictable. A database query fails, you retry or return an error. An API times out, you have a fallback.

AI agents fail in **novel ways**. The LLM might:

- Generate syntactically valid but logically wrong code
- Exceed context windows mid-reasoning
- Produce output that passes type checks but fails at runtime
- Hallucinate dependencies that don't exist

A try/catch around an LLM call catches the exception. It doesn't solve the problem.

## The RFC

This started as an RFC I wrote at Sav.com. The core idea: instead of binary success/failure, agents should negotiate **three possible outcomes** for every operation:

1. **Success** — proceed normally
2. **Recoverable failure** — agent can fix this itself with a different approach
3. **Escalation** — agent can't fix this, surface it with context

## Six Failure Categories

We identified six categories that cover every failure mode we've seen in production:

### 1. Model Failures
Rate limits, context overflow, malformed responses. These are infrastructure-level — the agent's reasoning is fine, the model just couldn't execute.

### 2. Validation Failures
Generated code doesn't pass linting, type checking, or our custom validators. The agent needs to see the errors and self-correct.

### 3. Infrastructure Failures
Deployment issues, git operations failing, file system problems. Usually not the agent's fault.

### 4. Schema Mismatches
The agent's output doesn't match the expected structure. Common when switching between pipeline stages.

### 5. Timeout and Resource Exhaustion
Agent hit its bounded ReAct limits without completing the task. Needs graceful degradation.

### 6. Dependency Conflicts
Agent introduced packages that conflict with existing ones, or referenced APIs that don't exist.

## How Negotiation Works

When an agent encounters a failure, it doesn't just retry blindly. It:

1. **Classifies** the failure into one of the six categories
2. **Assesses** whether it can recover (based on remaining budget and failure type)
3. **Chooses** an outcome: self-correct, try alternative approach, or escalate

For example, a validation failure with 3 remaining steps → agent sees the errors and self-corrects. A validation failure with 0 remaining steps → escalation with the error context attached.

## Engineering Review

Nothing ships at Vibe without a written plan reviewed by the EM and the team. This RFC went through full engineering review. The review process caught:

- Three schema gaps where failure categories overlapped
- Two backward-compatibility issues with existing pipeline stages
- An edge case where model failures could masquerade as validation failures

All fixed before any code was written.

## Results

After deploying the exception handling layer:

- **Crash rate dropped significantly** — agents recover from most failures autonomously
- **Debugging time decreased** — when agents do escalate, they provide rich context
- **User experience improved** — instead of "something went wrong," users see specific, actionable feedback

## Takeaway

Treat your agents like distributed services, not scripts. They need structured error handling, failure classification, and graceful degradation. A try/catch is not enough.
`,
  },
  {
    slug: "multilingual-speech-to-intent-pipelines",
    title: "From Voice to Intent: Building Multilingual Speech Pipelines",
    description:
      "How we built a speech-to-intent system with mid-utterance interrupts for ISRO-aligned human–robot collaboration.",
    date: "Oct 2025",
    readTime: "7 min read",
    tags: ["Speech AI", "NLP", "Robotics"],
    content: `
## The Challenge

Build a speech-to-intent pipeline for humanoid robots that:

- Handles **multiple languages** (not just English)
- Maps voice input to **structured intents** (not just transcription)
- Supports **mid-utterance interruptions** — operators can correct commands without waiting
- Runs with **low enough latency** for real-time robot control

This was for Muks Robotics, part of the ISRO-aligned Mars 2029/32 roadmap for human–robot collaboration.

## Why Not Just Use Whisper + GPT?

The obvious approach — transcribe with Whisper, classify with GPT — doesn't work for robotics:

1. **Latency** — round-trip to cloud APIs is 500ms-2s. A robot mid-motion can't wait that long.
2. **Interrupts** — cloud APIs process complete utterances. We need to handle "go forward— no, stop!" as two separate intents.
3. **Edge deployment** — robots in space don't have reliable internet.

## Architecture

The pipeline has three stages:

### 1. Streaming ASR (Automatic Speech Recognition)
We use a fine-tuned Transformer-based model that processes audio chunks as they arrive. It doesn't wait for the speaker to finish — it outputs partial transcripts in real-time.

### 2. Intent Detection with Interrupt Model
This is the novel part. A lightweight classifier runs on every partial transcript, looking for two things:

- **Intent boundaries** — "go forward" is a complete intent
- **Interrupt signals** — "no" or "stop" or sudden pitch changes indicate the operator is correcting

When an interrupt is detected, the system:
1. Immediately halts the current robot action
2. Flushes the intent buffer
3. Starts listening for the corrected command

### 3. Intent-to-Action Mapping
Structured intents map to robot control commands. "Go forward 2 meters" becomes a velocity vector with distance constraint. The mapping is deterministic — no LLM involved here.

## Multilingual Support

We fine-tuned the ASR model on datasets covering Hindi, Tamil, and English. The intent classifier is language-agnostic — it works on semantic embeddings, not raw text. This means adding a new language only requires ASR fine-tuning, not retraining the entire pipeline.

## Edge Deployment

The full pipeline runs on NVIDIA Jetson hardware. We quantized the models and optimized the inference path to get end-to-end latency under 200ms. That's from audio input to robot command output.

## The Interrupt Model in Detail

Mid-utterance interruption is harder than it sounds. You can't just listen for "stop" because:

- The operator might say "stop" as part of a longer command ("don't stop until you reach the wall")
- Different languages have different interrupt patterns
- Background noise on a robot platform is significant

Our approach combines three signals:

1. **Lexical** — keyword detection for interrupt words
2. **Prosodic** — sudden pitch increase or volume spike
3. **Temporal** — long pause followed by speech restart

All three signals are fused with a lightweight attention model. If the combined confidence exceeds threshold, it's an interrupt.

## Results

- End-to-end latency: **<200ms** on edge hardware
- Interrupt detection accuracy: **94%** across three languages
- The system handled field testing in noisy lab environments

## Takeaway

Speech-to-intent for robotics is a fundamentally different problem than speech-to-text for apps. Latency, interrupts, and edge deployment change every architectural decision. If you're building voice-controlled physical systems, don't start with cloud API wrappers.
`,
  },
];

export default blogs;
