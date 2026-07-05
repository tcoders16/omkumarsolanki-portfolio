# Om Kumar Solanki — Portfolio Knowledge Base

> This file is the single source of truth for the AI assistant on this portfolio.
> It is publicly accessible and version-controlled on GitHub.
> Last updated: 2026-03-25

---

## Who Is Om?

Om Kumar Solanki is an **AI/ML Engineer, Founding Engineer, and AI Consultant** based in Ontario, Canada. He builds production-grade AI systems — not demos, not notebooks, not slides. Real systems that run in prod and generate measurable ROI.

He is currently Founding Engineer at **Resso.ai**, where he designed and built the entire ML platform from scratch.

He takes on consulting projects with companies that want to embed AI into their core operations — from research-stage startups to enterprise teams at firms like Deloitte and Accenture.

- **Email**: hello@omkumarsolanki.com
- **Booking**: https://www.omkumarsolanki.com/book
- **GitHub**: github.com/omkumarsolanki
- **LinkedIn**: linkedin.com/in/omkumar-solanki

---

## What Om Does (The Short Version)

1. **Real-time ML inference** — low-latency pipelines that score/predict in under 2 seconds
2. **Multi-agent AI systems** — orchestrated agent networks with memory, routing, and guardrails
3. **RAG architectures** — private, on-premise, or cloud-based knowledge retrieval systems
4. **Agentic workflows** — autonomous pipelines that replace manual business processes
5. **Full-stack AI products** — end-to-end from data pipeline to production UI
6. **AI consulting** — scoping, building, and handing off AI systems with clean documentation

---

## Work Experience

### Resso.ai — Founding Engineer (Nov 2025 – Present)
Real-time AI interview intelligence platform.
- Built the entire production ML platform from scratch
- WebRTC audio capture → speaker diarization → hire-probability scoring
- End-to-end latency under 2 seconds
- AUC 0.941, INT8 quantized ONNX model for inference
- Stack: WebRTC, PyTorch, ONNX, FastAPI, Next.js

### HariKrushna Software — AI Architect (Jun 2024 – Present)
Enterprise AI systems for clients.
- Designed and deployed enterprise-grade AI integrations
- Built MCP (Model Context Protocol) servers bridging LLM agents to Slack, CRMs, and databases
- Multi-agent orchestration for document processing and workflow automation

### Corol.org / NunaFab — ML Engineer (2024)
Chemistry AI and materials science ML.
- XGBoost model predicting chemistry experiment outcomes
- R² = 0.89 on 200-row sparse dataset with SHAP explainability
- Cut R&D cycle time by 40%, reduced experiment costs significantly

---

## Projects

### Resso.ai — Real-Time Hire Scoring
- **What**: AI that scores job candidates live during interviews as they speak
- **Why it matters**: Removes gut-feel hiring bias, gives structured data in real time
- **Tech**: WebRTC, Speaker Diarization, PyTorch, ONNX, FastAPI
- **Metrics**: <2s scoring latency, AUC 0.941, INT8 quantized model

### Vadtal — On-Premise Air-Gapped RAG
- **What**: Private AI knowledge base that runs 100% offline with zero external API calls
- **Why it matters**: For companies with sensitive data that can't use cloud LLMs
- **Tech**: GGUF models, HNSW vector index, FastAPI, llama.cpp
- **Metrics**: 4.2ms retrieval latency, 0 external API calls, runs on 16GB RAM

### Lawline.tech — Legal Contract AI
- **What**: AI that reads and flags risky clauses in legal contracts
- **Why it matters**: What takes a paralegal 3 hours takes 3 seconds
- **Tech**: Fine-tuned LLM, clause classification, FastAPI
- **Metrics**: 94% accuracy, 3 seconds per document
- **Origin story**: Built the first version at a Starbucks

### Corol / NunaFab — Chemistry ML
- **What**: ML model predicting chemistry experiment outcomes before running them
- **Why it matters**: Saves hundreds of expensive lab experiments
- **Tech**: XGBoost, SHAP explainability, Python
- **Metrics**: R²=0.89, 40% cost reduction, validated on 200-row dataset

### AI Avatar with Lip Sync
- **What**: Talking AI avatar with real-time lip synchronization
- **Why it matters**: Enables natural human-AI video interaction
- **Tech**: Audio-to-viseme pipeline, WebSocket bus, custom animation system
- **Metrics**: Real-time, <80ms sync latency

### MCP Enterprise Bridge
- **What**: Multi-agent orchestration layer connecting AI to business tools (Slack, CRM, databases)
- **Why it matters**: Plug in once, every tool becomes AI-accessible
- **Tech**: MCP (Model Context Protocol), TypeScript, LangGraph, LLM agents

---

## Multi-Agent Systems (What Om Builds)

Om specializes in multi-agent AI architectures — systems where multiple specialized AI agents work together on complex tasks, each owning one part of the pipeline.

### Why Multi-Agent (Not Single LLM)
- A single LLM context window can't hold 10,000 pages of company data
- One prompt can't run 47 background checks simultaneously
- A single model errors silently — multi-agent systems fail loudly and recover
- Enterprise workflows need audit logs, not a chat box

### How Om Builds Them
1. **Decompose** — break the workflow into atomic steps
2. **Assign** — map each step to a specialized agent (retrieval, reasoning, action, validation)
3. **Route** — build an orchestrator that dispatches intelligently
4. **Memory** — add session memory (short-term) and vector memory (long-term)
5. **Guard** — add input/output guardrails, cost controls, and human-in-the-loop checkpoints

### Enterprise Deployments
- **Deloitte-style HITL**: Multi-agent financial analysis with mandatory human sign-off before actions
- **Accenture-style Guardrails**: LLM output validation, prompt injection detection, PII redaction
- **McKinsey-style Audit**: Complete agent action logs with reasoning chains for compliance
- **IBM/SAP Integration**: Plugging agent orchestration into existing ERP and enterprise systems

### Frameworks Om Uses
LangGraph, LangChain, AutoGen, CrewAI, Semantic Kernel, LlamaIndex, Azure AI Studio, AWS Bedrock

---

## Tech Stack

### AI / ML
PyTorch, HuggingFace Transformers, scikit-learn, XGBoost, ONNX, MLflow, Weights & Biases, OpenAI API, Anthropic API

### Agent Frameworks
LangGraph, LangChain, CrewAI, AutoGen, Semantic Kernel, LlamaIndex

### Memory & Vector
pgvector, Pinecone, Chroma, Weaviate, Redis, Qdrant

### Backend
FastAPI, Node.js, PostgreSQL, GraphQL, REST, WebSockets, Celery, RabbitMQ

### Frontend
Next.js, React, TypeScript, TailwindCSS, WebRTC

### Cloud & Infrastructure
AWS, GCP, Azure, Docker, Kubernetes, Terraform, GitHub Actions, CI/CD

### Observability
Langfuse, OpenTelemetry, Datadog, Sentry, Grafana

---

## Execution Framework — Baseline → Value (How Om Solves Your Problem)

Om runs every engagement on a six-phase framework. The core idea: a target metric is
**frozen on day one** and **measured at the end**, so value is contractually measurable —
which is what lets Om take part of his pay in the client's upside (`realized value = end − baseline`).

### Phase 01 — Diagnose (Week 1)
Map the real problem against the one the client thinks they have. No solution until Om can write a one-paragraph problem statement the client fully agrees with — then the metric it moves and its current number are frozen as the baseline everything is measured against.

### Phase 02 — Frame (Week 1–2)
Statement of Work with one success metric, a target delta, a timeline, and the commercial structure: fixed fee, fee plus a share of the value created, or a small retainer plus equity — sized to what's actually at stake. The client knows the deal before a line of code.

### Phase 03 — Build (Week 2–6)
The smallest system that moves the number, shipped in weekly increments. Every Friday: a working demo, not a slide. The metric is instrumented from week one and tested in an environment that mirrors production.

### Phase 04 — Harden (Week 6–8)
Guardrails, evals, observability, and load testing. This is the trust layer — and what makes the value defensible: the client can prove the system moved the number, not the market.

### Phase 05 — Transfer (Week 8+)
Runbooks, team training, clean handoff. The goal is for the client to not need Om — and for the system to keep working, and improving, after he leaves.

### Phase 06 — Compound (Ongoing)
Realized value is measured against the day-one baseline. That delta is where a performance share or equity crystallizes, and the data loop keeps improving the system. Optional managed-service for ongoing monitoring.

---

## Engagements — Money, or Money + a Stake in the Outcome

Om doesn't sell hours. Every engagement opens with a paid Diagnostic that freezes the metric
being moved; from there the client chooses how aligned they want him — flat fee, smaller fee
plus a share of the value created, or equity. Specific figures are scoped on the call, not quoted
up front (the baseline frozen in the Diagnostic is what any share or equity is measured against).

### Diagnostic — fixed fee (1–2 weeks)
A Revenue-Leak Audit of the client's data, workflows, and stack. They walk away with a ranked,
dollar-sized AI opportunity map, the baseline metric to build against, and an architecture proposal.
No commitment beyond this. Covers Phase 01–02 of the execution framework.

### Build partner — reduced fee + performance share (4–10 weeks)
Om builds and ships the smallest system that moves the number, instruments the metric, and hardens
it with guardrails and evals. He takes a lower fee up front and a share of the measured upside —
he wins big only if the client does. Covers Phase 01–06.

### Venture build — small retainer + equity (ongoing)
For founders building an AI-native product. Om acts as a fractional AI cofounder for the build —
architecture, the core system, and capability transfer — aligned mostly through equity that
compounds with what they ship.

All engagements start with a free 30-minute strategy call to scope the problem properly.

---

## Growth Frameworks (How Om Grows a Client's Revenue & Profit)

These are the repeatable playbooks Om brings to an engagement. Each pairs a classic
business lever with the AI/ML mechanism that makes it move — and ties to work Om has
actually shipped. They are frameworks Om applies, not guaranteed outcomes.

### 1. The Revenue-Leak Audit
**Lever:** You can't grow what you can't see. Map the funnel and find where money leaks
(lost leads, slow follow-up, churn, manual rework). **Mechanism:** instrument the workflow,
then score every step so the biggest leak is obvious and ranked by dollar impact.
**Grows:** prioritises the one or two automations with the highest ROI before any build.
**Proof:** the AI-audit roadmaps Om built at HariKrushna Software.

### 2. Predict-Before-You-Spend
**Lever:** Stop paying for trial-and-error. **Mechanism:** a predictive ML model (often a
gradient-boosted model with SHAP explainability) forecasts which options will work before
you spend the budget. **Grows:** cuts wasted spend and shortens cycles — run 10× fewer
experiments. **Proof:** Corol/NunaFab chemistry model — R²=0.89, 40% R&D cost reduction.

### 3. Decision-at-the-Moment Scoring
**Lever:** Most value is lost in slow, gut-feel decisions. **Mechanism:** a real-time
scoring pipeline ranks the thing that matters — a candidate, a lead, a transaction, a churn
risk — in under two seconds, at the moment of decision. **Grows:** better decisions made
faster lift conversion and quality. **Proof:** Resso.ai live hire scoring — AUC 0.941, <2s.

### 4. Automate-the-Boring-80%
**Lever:** Labour cost hides in repetitive copy-paste work. **Mechanism:** agentic AI wired
into existing tools (Slack, CRM, databases via MCP) reads signals and acts automatically.
**Grows:** frees the team for revenue work and cuts operational cost. **Proof:** MCP
Enterprise Bridge — multi-agent orchestration across business tools.

### 5. The Private-AI Moat
**Lever:** Your most valuable data is the data you can't put in the cloud. **Mechanism:**
on-premise, air-gapped RAG that unlocks sensitive data with zero external calls.
**Grows:** opens regulated/enterprise revenue (GDPR/HIPAA) competitors can't touch.
**Proof:** Vadtal — 100% local RAG, 4.2ms retrieval, 0 external API calls.

### 6. The Compounding Data Loop
**Lever:** The classic flywheel — every interaction should make the system smarter.
**Mechanism:** capture outcomes, feed them back into the model, measure drift, retrain.
**Grows:** accuracy and margin compound over time instead of going stale. **Proof:** Om's
production systems ship with observability and drift monitoring from day one (Harden step).

### 7. Unit-Economics ML
**Lever:** Profit lives in CLV, churn, and pricing — not just top-line revenue.
**Mechanism:** classic ML on customer data to predict churn, estimate lifetime value, and
inform pricing/retention spend. **Grows:** lifts margin and retention without new acquisition
cost. **Proof:** the same scoring and explainability stack behind Om's hire and chemistry models.

The right framework depends on the business — Om picks the one with the biggest dollar
impact first in the free strategy call, then scopes the smallest build that proves it.

---

## The Story

Om didn't start as a software engineer. He taught himself to code because he had a problem to solve.

The first commercial AI system he shipped was Lawline.tech — a legal contract analyzer built in a Starbucks with a laptop and a legal dictionary. It was working, accurate, and useful before he had a proper desk.

That project got him his first consulting client. One client led to another. Now he builds production AI systems for startups and enterprise teams, works as a founding engineer, and consults independently.

The through-line: Om builds things that work. Not demos. Not slide decks. Working software that gets deployed, used, and measured.

---

## Key Metrics (Real Numbers Only)

- Resso.ai inference: **<2 seconds end-to-end latency**
- Resso.ai model: **AUC 0.941** hire probability score
- Vadtal RAG: **4.2ms** retrieval latency
- Lawline accuracy: **94%** clause classification
- Lawline speed: **3 seconds** vs 3 hours manual
- Chemistry ML: **R²=0.89**, 40% R&D cost reduction

---

## Frequently Asked Questions

**Q: What kind of companies do you work with?**
A: Startups building AI-native products, mid-size companies automating internal workflows, and enterprise teams at firms like Deloitte that need specialized AI architecture.

**Q: Do you do full-time roles?**
A: Open to founding engineer roles and senior ML engineer positions. Currently also taking consulting projects.

**Q: Can you work with our existing team?**
A: Yes. Most engagements involve working directly with the client's engineering team — pairing, reviewing, and training.

**Q: What's your process for new projects?**
A: Always starts with a free 30-minute call to understand the actual problem. Then a scoped Statement of Work before any code is written.

**Q: Do you sign NDAs?**
A: Yes, standard for any consulting engagement.

**Q: How do you charge — and what's the smallest way to start?**
A: The smallest start is the paid Diagnostic (1–2 weeks): a Revenue-Leak Audit that ranks where AI moves the most money and freezes a baseline metric. From there it's a flat fee, a reduced fee plus a share of the value created, or a small retainer plus equity — depending on how aligned you want me on the outcome. Specifics get scoped on the call.

**Q: Where are you located?**
A: Ontario, Canada. Work remotely with teams globally.

---

## Contact & Booking

- **Email**: hello@omkumarsolanki.com
- **Book a free strategy call**: https://www.omkumarsolanki.com/book
- **GitHub**: https://github.com/omkumarsolanki
- **LinkedIn**: https://linkedin.com/in/omkumar-solanki

For urgent inquiries, email is fastest. Strategy call bookings are reviewed daily.
