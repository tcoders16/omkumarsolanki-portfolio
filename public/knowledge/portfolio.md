# Om Kumar Solanki — Portfolio Knowledge Base

> This file is the single source of truth for the AI assistant on this portfolio.
> It is publicly accessible and version-controlled on GitHub.
> Last updated: 2026-03-25

---

## Who Is Om?

Om Kumar Solanki is an **AI/ML Engineer, Founding Engineer, and AI Consultant** based in Ontario, Canada. He builds production-grade AI systems — not demos, not notebooks, not slides. Real systems that run in prod and generate measurable ROI.

He is currently Founding Engineer at **Resso.ai**, where he designed and built the entire ML platform from scratch.

He takes on consulting projects with companies that want to embed AI into their core operations — from research-stage startups to enterprise teams at firms like Deloitte and Accenture.

- **Email**: emailtosolankiom@gmail.com
- **Booking**: https://cal.com/om-solanki/consultation
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

## Engagement Process (How Om Works)

### Step 01 — Diagnose (Week 1)
Stakeholder interviews, system audit, root cause analysis. No solution proposed until Om can write a one-paragraph problem statement the client fully agrees with.

### Step 02 — Scope (Week 1–2)
Statement of Work with a fixed deliverable, success metric, and timeline. The client knows exactly what they're getting before a single line of code is written.

### Step 03 — Build (Week 2–6)
Weekly increments. Every Friday: a working demo, not a slide. Every agent, model, or API is tested in an environment that mirrors production.

### Step 04 — Harden (Week 6–8)
Guardrails, observability, and load testing. Every pipeline node is instrumented so the client can see latency, error rates, and model drift without calling Om.

### Step 05 — Transfer (Week 8+)
Runbooks, team training, clean handoff. The goal is for the client to not need Om — and for the system to keep working after he leaves.

---

## Services & Rates

### Fractional AI/ML Lead — $180/hr
Best for startups that need ML expertise without a full-time hire. Includes architecture decisions, code reviews, and mentoring the engineering team.

### Agentic System Build — $6,000–$15,000
Fixed-scope project: multi-agent pipeline, RAG system, or workflow automation. Includes full documentation and handoff.

### ML Pipeline Productionization — $4,500–$10,000
Take an existing model or prototype and turn it into a production system with CI/CD, monitoring, and observability.

### Enterprise AI Consulting — Custom
For larger organizations. Includes audit, strategy, proof-of-concept, and implementation roadmap.

All engagements start with a free 30-minute strategy call to scope the problem properly.

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

**Q: What's the smallest project you take?**
A: Minimum engagement is a focused 2-week sprint (typically $4,500–$6,000). Anything smaller is usually better addressed in a strategy call.

**Q: Where are you located?**
A: Ontario, Canada. Work remotely with teams globally.

---

## Contact & Booking

- **Email**: emailtosolankiom@gmail.com
- **Book a free strategy call**: https://cal.com/om-solanki/consultation
- **GitHub**: https://github.com/omkumarsolanki
- **LinkedIn**: https://linkedin.com/in/omkumar-solanki

For urgent inquiries, email is fastest. Strategy call bookings are reviewed daily.
