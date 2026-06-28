"use client";
import { useState } from "react";

const questions = [
  // ── PART 1: BASICS ──
  {
    part: 1, partTitle: "Basics", id: 1,
    q: "What is an API?",
    a: "A way for two systems to talk to each other. You send a request, you get back data. At Amex, AI agents use APIs to talk to transaction databases, customer profiles, and fraud tools.",
    exp: "REST APIs at every job. FastAPI at Corol. WebSocket APIs at Resso.ai. MCP servers at HariKrushna.",
  },
  {
    part: 1, id: 2,
    q: "What is REST?",
    a: "A style of API that uses HTTP. URLs represent things, HTTP methods act on them.\n\nGET /customers/123 - get customer data\nPOST /disputes - create a dispute\nPUT /disputes/456 - update it\nDELETE /disputes/456 - remove it\n\nData goes back and forth as JSON. Status codes: 200 = success, 400 = bad input, 401 = unauthorized, 404 = not found, 500 = server error.",
    exp: "JWT-secured REST API at Corol. MCP servers expose REST endpoints for Slack at HariKrushna. Session management at Resso.ai.",
  },
  {
    part: 1, id: 3,
    q: "What is gRPC and how is it different from REST?",
    a: "gRPC sends binary data (protobuf) over HTTP/2 instead of JSON over HTTP/1.1.\n\nFaster: binary is smaller, HTTP/2 allows multiple requests on one connection.\nStricter: you define exact types in a .proto file - wrong type fails at serialization, not runtime.\nStreaming: both sides can send a stream of messages.\n\nUse REST for external APIs. Use gRPC for internal service-to-service communication.",
    exp: "HariKrushna: REST for Slack webhooks, gRPC for agent-to-tool communication. Lawline.tech: gRPC streaming between all 5 pipeline stages.",
  },
  {
    part: 1, id: 4,
    q: "What is JSON?",
    a: "A text format for data. Key-value pairs. Values can be strings, numbers, booleans, arrays, or nested objects.\n\nAlmost every API uses it. LLM outputs are structured as JSON so your code can parse and act on them.",
    exp: "Used everywhere - API responses, LLM outputs, tool call schemas.",
  },
  {
    part: 1, id: 5,
    q: "What is Python and why is it used for AI?",
    a: "Python is the default AI language because of the ecosystem: PyTorch, LangChain, FastAPI, Pydantic - all Python.\n\nIt reads like English, which is good for collaboration. It is slower than Go/C++ but the heavy computation (matrix math, inference) is done by C++ libraries under the hood. Python is just the glue.",
    exp: "Primary language across all roles. FastAPI at HariKrushna and Corol. LangChain for orchestration.",
  },
  {
    part: 1, id: 6,
    q: "What is Go and when do you use it over Python?",
    a: "Go is a compiled language - fast, low memory, excellent concurrency using goroutines.\n\nUse Go when you need to handle many concurrent requests with limited memory. At HariKrushna, the agent routing layer was in Go because Python's threading model (GIL) is poor for this.\n\nStick with Python for anything touching ML models, embeddings, or vector stores. Python's ML ecosystem is much larger.",
    exp: "HariKrushna: Go for the MCP server network layer (gRPC, connection pooling). Python for LLM inference and RAG.",
  },
  {
    part: 1, id: 7,
    q: "What is TypeScript?",
    a: "JavaScript with types. You declare what type each variable is - string, number, boolean, custom type. The compiler catches errors before the code runs.\n\nAt Amex the frontend and API layers are likely TypeScript. Type safety prevents production bugs.",
    exp: "Entire Resso.ai platform is TypeScript: Prisma ORM, API routes, WebSocket handlers, React components.",
  },
  {
    part: 1, id: 8,
    q: "What is Docker?",
    a: "Docker packages your app and all its dependencies into a container that runs identically on any machine.\n\nNo more 'works on my machine' problems. Your laptop has Python 3.10, the server has Python 3.8 - containers solve this. The container includes the exact Python version, exact libraries, exact config.",
    exp: "HariKrushna: each client's RAG stack is containerized. Lawline.tech: all 16 agents run in Docker on the client's local machine (air-gapped, no internet).",
  },
  {
    part: 1, id: 9,
    q: "What is Kubernetes?",
    a: "Manages Docker containers in production.\n\nScaling: spins up more containers automatically if load increases (HPA).\nSelf-healing: crashed containers restart automatically.\nRolling updates: deploy new code with zero downtime.\nResource limits: cap CPU/memory per container so one service cannot starve others.\n\nKey terms: Pod (one container), Deployment (manages replicas), Liveness probe (is it running?), Readiness probe (is it ready for traffic?).",
    exp: "HariKrushna client stacks on Kubernetes. Resso.ai deployed across 4 Azure environments with resource limits on 16 GB hardware.",
  },
  {
    part: 1, id: 10,
    q: "What is AWS?",
    a: "Amazon's cloud platform. Key services for AI:\n\nEC2: virtual servers\nS3: file/object storage\nLambda: serverless functions (run on trigger, no server to manage)\nSageMaker: managed ML training and deployment\nBedrock: managed LLM access (Claude, Llama without self-hosting)\nStep Functions: multi-step workflow orchestration",
    exp: "AWS Academy certificate. Lambda + S3 at Freelance for healthcare pipeline. Kafka + Lambda for event-driven ingestion.",
  },
  {
    part: 1, id: 11,
    q: "What is Kafka?",
    a: "A real-time event streaming platform. Producers publish messages to topics. Consumers subscribe and process them. Messages are stored on disk so they can be replayed.\n\nTopics split into partitions for parallelism. Consumer groups share the work - each partition is read by one consumer in the group.\n\nWhy at Amex: millions of transactions happen per second. Kafka ingests them in real-time. Agents consume to detect fraud and classify disputes.",
    exp: "Kafka + Lambda at Freelance for healthcare records across 3 hospital systems, each with its own topic. Freed 120 hours monthly.",
  },
  {
    part: 1, id: 12,
    q: "What is PostgreSQL and connection pooling?",
    a: "PostgreSQL is a relational database - data in tables, queried with SQL.\n\nConnection pooling: every DB connection uses memory. With 200+ concurrent users, you run out fast. PgBouncer sits between the app and Postgres, reusing connections instead of opening a new one for every request.",
    exp: "Resso.ai: PostgreSQL with Prisma ORM and PgBouncer. Redis for caching hot data.",
  },
  {
    part: 1, id: 13,
    q: "What is Redis?",
    a: "An in-memory data store. Sub-millisecond reads because everything is in RAM.\n\nUsed for caching, session storage, and queues.\n\nAt Resso.ai: the current conversation context lives in Redis. Agent reads it in under 5ms instead of querying PostgreSQL. Write-through strategy: write to Redis first, then async to Postgres. Redis is the cache. Postgres is the source of truth.",
    exp: "Resso.ai: Redis for session memory. Handles 200+ concurrent sessions without hitting the database on every message.",
  },

  // ── PART 2: AI & ML FUNDAMENTALS ──
  {
    part: 2, partTitle: "AI & ML Fundamentals", id: 14,
    q: "What is a Large Language Model (LLM)?",
    a: "A neural network trained on massive amounts of text to predict the next word. GPT-4o, Claude, Llama are LLMs.\n\nYou give it a prompt. It generates output one token (word piece) at a time.\n\nKey terms:\nContext window: max tokens it can see at once (GPT-4o = 128K)\nTemperature: 0 = always picks most likely token, 1 = more random\nSystem prompt: instructions that define how the model behaves",
    exp: "Azure OpenAI GPT-4o at Resso.ai. Claude API at HariKrushna. GGUF-quantized open-source models for on-premise deployments.",
  },
  {
    part: 2, id: 15,
    q: "What is an embedding?",
    a: "A list of numbers (a vector) that represents the meaning of text. Similar texts produce similar vectors. Different texts produce very different ones.\n\n'credit card fraud' and 'unauthorized transaction' → close in vector space\n'credit card fraud' and 'chocolate cake recipe' → far apart\n\nThis is how RAG works - you compare vectors to find relevant documents.",
    exp: "Embeddings at HariKrushna (7 clients), Vadtal (50,000+ records), Resso.ai (session memory retrieval).",
  },
  {
    part: 2, id: 16,
    q: "What is a vector store?",
    a: "A database designed for finding similar embeddings fast.\n\nRegular DB: 'give me records where customer_id = 123' (exact match)\nVector store: 'give me the 10 documents most similar to this question' (similarity search)\n\nHNSW (Hierarchical Navigable Small World) is the main algorithm. Builds a graph for fast approximate nearest neighbor search.",
    exp: "Custom HNSW vector stores at HariKrushna (7 clients, sub-1s on 16 GB), Vadtal (50,000+ records), Resso.ai (session memory).",
  },
  {
    part: 2, id: 17,
    q: "What is RAG?",
    a: "Retrieval-Augmented Generation. Instead of relying on training data alone, you retrieve relevant documents from your own database and inject them into the LLM prompt.\n\nFlow:\n1. User asks a question\n2. Embed the question\n3. Search vector store for similar chunks\n4. Put those chunks in the LLM prompt\n5. LLM answers using retrieved context\n\nWhy it matters: Amex's transaction data and policies are not in the model's training data. RAG solves this without retraining the model.",
    exp: "RAG at HariKrushna (7 clients), Vadtal (50,000+ records), Lawline.tech (12,000+ legal files), Resso.ai (session memory).",
  },
  {
    part: 2, id: 18,
    q: "What is an agentic AI system?",
    a: "A chatbot takes input and returns output. One step.\n\nAn agent plans, uses tools, reasons over results, and takes action across multiple steps.\n\nExample: 'Dispute my last Amazon transaction'\nAgent steps: look up last Amazon transaction → retrieve dispute policy → check if it qualifies → create the dispute → notify the customer.\n\nKey capabilities: Planning, Tool use, Reasoning, Memory, Verification.",
    exp: "Resso.ai: orchestration layer routing through sub-agents (context injection, barge-in, topic-switch). Lawline.tech: 16 agents in a 5-stage pipeline. HariKrushna: MCP servers connecting agents to external tools.",
  },
  {
    part: 2, id: 19,
    q: "What is tool calling?",
    a: "How an agent uses external tools. The LLM does not execute anything itself - it generates a structured request, and your code runs it.\n\nFlow: LLM outputs a JSON tool call → your code validates it against a schema → if valid, executes → returns result to LLM → LLM continues reasoning.\n\nSchema validation is critical: if the LLM hallucinates a parameter that does not exist, validation catches it before anything bad happens.",
    exp: "MCP servers at HariKrushna validate every tool call against JSON schema before routing. Reduced integration time from 4 weeks to 3 days across 5 enterprise deployments.",
  },
  {
    part: 2, id: 20,
    q: "What is prompt engineering?",
    a: "Writing instructions that reliably get an LLM to produce the output you want. In production, prompts are engineering artifacts - versioned, tested, and monitored.\n\nTechniques:\nSystem prompt: defines role, personality, constraints\nFew-shot examples: 2-3 correct input/output pairs in the prompt\nChain of thought: ask it to think step by step before answering\nOutput format: tell it to respond in JSON or a specific structure",
    exp: "30+ persona templates at Resso.ai. Schema-constrained prompts at HariKrushna. Evaluation dashboards tracking per-prompt performance.",
  },
  {
    part: 2, id: 21,
    q: "What is fine-tuning and what is LoRA?",
    a: "Fine-tuning: train a pre-trained model on your specific data so it learns your domain.\n\nFull fine-tuning: update all weights. Expensive, risks catastrophic forgetting.\n\nLoRA (Low-Rank Adaptation): freeze the original weights. Add small adapter matrices and train only those. Faster, cheaper, and you can swap adapters per client.\n\nQLoRA: same as LoRA but frozen weights are also compressed (4-bit) to save memory. Fine-tune large models on a single GPU.",
    exp: "HariKrushna: LoRA/QLoRA fine-tuning + schema validation brought hallucination from 14% to 3.8% on a 500-document eval set for a fintech client.",
  },
  {
    part: 2, id: 22,
    q: "What is GGUF quantization?",
    a: "Quantization reduces model weight precision to save memory. Normally weights are 16-bit or 32-bit. You convert to 4-bit or 8-bit.\n\nGGUF is the file format for quantized models. A 70B parameter model that normally needs 140 GB can run on 16 GB RAM in 4-bit.\n\nTradeoff: tiny accuracy loss for massive memory savings. In practice, 4-bit is very close to full precision for most tasks.",
    exp: "GGUF models at HariKrushna (7 clients, 16 GB hardware, sub-1s latency) and Lawline.tech (air-gapped, fully offline).",
  },
  {
    part: 2, id: 23,
    q: "What is schema validation for LLM outputs?",
    a: "You define the exact structure the LLM must output (using Pydantic or JSON Schema). After the LLM responds, your code checks it matches the schema before anything downstream runs.\n\nIf it fails:\n1. Retry with a more constrained prompt (include the schema and the error)\n2. If it fails again, fall back to a safe default (route to a human)\n3. Log the failure\n\nAt Amex: a malformed output could trigger a wrong action on a real customer's account. This is the safety net.",
    exp: "Used at HariKrushna as one layer in cutting hallucination from 14% to 3.8%.",
  },
  {
    part: 2, id: 24,
    q: "What is MCP (Model Context Protocol)?",
    a: "A standard protocol for AI agents to connect to external tools through one interface instead of writing custom code per tool.\n\nWithout MCP: Slack = custom code. CRM = custom code. Database = custom code.\n\nWith MCP: the agent sends a standard tool_call. The MCP server validates and routes it to the right adapter. Every tool looks the same from the agent's perspective.",
    exp: "Built production MCP servers at HariKrushna connecting agents to Slack, CRM, databases, REST and gRPC. Reduced integration time from 4 weeks to 3 days across 5 enterprise deployments.",
  },
  {
    part: 2, id: 25,
    q: "What is semantic chunking?",
    a: "When building RAG you split documents into chunks before embedding them.\n\nFixed-size (every 500 tokens): simple but breaks sentences mid-thought. The chunk loses meaning.\n\nSemantic (split at meaning boundaries - paragraphs, sections, topic changes): each chunk is a complete, coherent unit. Better chunks produce better embeddings, which produce better retrieval.",
    exp: "Used at HariKrushna for regulated industries and at Lawline.tech where legal arguments span multiple sentences.",
  },

  // ── PART 3: SYSTEM DESIGN & PRODUCTION ──
  {
    part: 3, partTitle: "System Design & Production", id: 26,
    q: "How do you design a REST API for an AI agent calling external tools?",
    a: "Agent sends a tool_call with the tool name, parameters, and a context_id for tracing. MCP server validates parameters against a JSON schema. Routes to the right adapter. Returns a structured response with status, data, and an error object.\n\nErrors are structured so the LLM can adapt (retry, fall back, inform user).\n\nRate limiting: token bucket in the MCP server. Queue requests that exceed the limit.",
    exp: "MCP servers at HariKrushna. 5 enterprise deployments. 4 weeks → 3 days integration time.",
  },
  {
    part: 3, id: 27,
    q: "When do you choose Go over Python?",
    a: "Go: concurrent request handling with low memory, network services (gRPC servers, connection pooling), latency-sensitive layers.\n\nPython: anything touching ML models, embeddings, vector stores, LLM inference. Ecosystem is 10x larger.\n\nBoth together: Go handles the network layer, Python handles the intelligence.",
    exp: "HariKrushna: Go for MCP server network layer, Python for RAG and LLM inference.",
  },
  {
    part: 3, id: 28,
    q: "How do you design an event-driven pipeline for financial transactions?",
    a: "Kafka ingests transactions in real-time. One topic per transaction type (card swipes, disputes, fraud alerts). One consumer group per processing type (fraud detection, compliance logging).\n\nValidation on every message. Dead letter queue after 3 retries. Exactly-once semantics: idempotent producers, commit offsets only after successful processing.",
    exp: "Kafka + Lambda at Freelance for healthcare. 3 hospital systems, each with its own topic. Freed 120 hours monthly.",
  },
  {
    part: 3, id: 29,
    q: "How do you handle database connection pooling and caching?",
    a: "PgBouncer sits between the app and Postgres. Transaction pooling mode: connections are returned after each transaction, not after each session.\n\nRedis caches the hot path (prompt assembly reads in under 5ms). Write-through: write to Redis first, then async to Postgres.\n\nMulti-tenancy: scope all queries by tenant_id. RBAC enforced at the API layer, not the database layer.",
    exp: "Resso.ai: 200+ concurrent sessions, 30+ personas, 4 Azure environments.",
  },
  {
    part: 3, id: 30,
    q: "How do you deploy an AI service to Kubernetes?",
    a: "Push code → GitHub Actions runs tests → Docker image built and pushed to registry → Helm chart defines the deployment (replicas, resource limits, health checks) → rolling update with graceful drain.\n\nLiveness probe: restarts crashed containers.\nReadiness probe: stops traffic until the model is loaded.\nResource limits: critical for ML workloads that spike during inference.",
    exp: "HariKrushna client RAG stacks on Kubernetes. Resso.ai across 4 Azure environments with GitHub Actions CI/CD.",
  },
  {
    part: 3, id: 31,
    q: "How do you build a RAG pipeline from scratch?",
    a: "1. Chunk: semantic chunking at meaning boundaries\n2. Embed: test multiple embedding models, pick best recall on your domain\n3. Index: HNSW for fast approximate nearest neighbor search\n4. Retrieve: top-k results, then reranker to filter low-relevance chunks\n5. Prompt: inject chunks with source citations, instruct model to answer from context only\n6. Evaluate: track retrieval precision, answer correctness, and hallucination rate on a held-out test set",
    exp: "RAG at HariKrushna (7 clients), Vadtal (50,000+ records), Lawline (12,000+ files), Resso (session memory).",
  },
  {
    part: 3, id: 32,
    q: "How do you evaluate an AI system in production?",
    a: "Resso.ai: latency (sub-800ms target), context retention (72% → 98%), session completion rate, accuracy per persona.\n\nHariKrushna: hallucination rate on 500-document held-out set (14% → 3.8%), retrieval precision, schema pass rate.\n\nLawline: end-to-end time (42 seconds per 800-page file), source linking accuracy.\n\nFor Amex: response correctness, latency SLAs, hallucination rate, tool call success rate, compliance log completeness.",
    exp: "Evaluation dashboards at every role. Per-persona, per-day tracking at Resso.ai.",
  },
  {
    part: 3, id: 33,
    q: "How do you handle failures in a multi-agent pipeline?",
    a: "Retry with exponential backoff: 1s, 4s, 16s. After 3 failures, move the message to a dead letter queue with full context (document ID, stage, error, input).\n\nPipeline continues processing remaining items. Verify agent flags any gaps in the final output. Structured error responses so the LLM can decide to retry, use a fallback, or surface the issue to the user.",
    exp: "Lawline.tech 5-stage pipeline. MCP server failure handling at HariKrushna.",
  },
  {
    part: 3, id: 34,
    q: "How do you deploy AI air-gapped on-premise?",
    a: "GGUF-quantized models run on 16 GB machines. HNSW vector store is built and persisted locally. All agents run in Docker containers. No internet, no external APIs, no telemetry. Updates are transferred by secure file transfer.\n\nWhy: law firms (attorney-client privilege), healthcare (HIPAA), finance (data residency). The data legally cannot leave the premises.",
    exp: "Lawline.tech: fully air-gapped, 16 agents, 12,000+ files. HariKrushna: 7 clients in regulated industries. Vadtal: 50,000+ records, fully offline.",
  },
  {
    part: 3, id: 35,
    q: "How do you debug a wrong AI agent answer?",
    a: "Trace it step by step:\n1. Routing: did the right agent get selected? If not, fix the router.\n2. Retrieval: did the vector store return relevant chunks? If not, fix chunking or embeddings.\n3. Prompt: was the relevant context actually included? If not, fix the template.\n4. Generation: did the LLM ignore the context? If so, tighten the prompt or fine-tune.\n5. Validation: did schema catch it? If not, tighten the schema.\n\nThen run the failing input against your eval set to check if it is a one-off or a regression.",
    exp: "Full step-by-step logging at every stage at Resso.ai. Evaluation dashboards for ongoing monitoring.",
  },
  {
    part: 3, id: 36,
    q: "How do you handle LLM hallucination?",
    a: "Six layers, all combined at HariKrushna:\n\n1. Fine-tuning (LoRA on domain data)\n2. RAG grounding (answer from retrieved documents only)\n3. Schema validation (check structure before it reaches users)\n4. Evaluation (held-out test set, continuous monitoring)\n5. Human-in-the-loop (route low-confidence outputs to human review)\n6. Source citations (every claim must cite a retrieved document)\n\nResult: 14% → 3.8% hallucination on 500-document fintech eval set.",
    exp: "HariKrushna fintech client. All six layers together.",
  },
  {
    part: 3, id: 37,
    q: "How do you manage context windows for long conversations?",
    a: "Problem: after 10 minutes the context window fills up, the agent loses track. Retention was 72%.\n\nSolution: store every turn as an embedding in a vector database. Instead of stuffing the full transcript into the prompt, retrieve only the relevant past turns using event-driven triggers:\n\nSilence timeout → inject a recap of the conversation\nBarge-in → inject the interrupted topic\nTopic switch → inject history of the new topic\n\nResult: no overflow, retention rose to 98% across 500+ sessions.",
    exp: "Resso.ai. Designed the event-driven trigger system and vector database session memory.",
  },
  {
    part: 3, id: 38,
    q: "How do you design a multi-agent workflow for credit card disputes?",
    a: "Map the Lawline pipeline to Amex:\n\nStage 1 (Ingest): receive claim, extract text from any uploaded documents\nStage 2 (Extract): pull key facts into structured JSON - date, merchant, amount, claim type\nStage 3 (Reason): cross-reference against transaction records, merchant history, dispute policy\nStage 4 (Generate): produce a decision recommendation with evidence citations, strict output schema\nStage 5 (Verify): confirm every claim is grounded in evidence, flag contradictions\n\nStructured JSON between stages (not free text). Schema validation at every handoff. Human review for anything flagged.",
    exp: "Lawline.tech: 16 agents, 5-stage pipeline, 12,000+ files, 94% time reduction.",
  },
  {
    part: 3, id: 39,
    q: "Design a customer support AI system for Amex.",
    a: "Layer 1 - Ingestion: query arrives via WebSocket or REST. Normalize, add request_id, attach customer_id.\nLayer 2 - Router: classify intent (billing, dispute, fraud, account, general). Low confidence → route to human.\nLayer 3 - Specialist agent: selected based on intent. Has access to the relevant data sources.\nLayer 4 - RAG retrieval: query vector store for account data, transactions, and policies. Semantic chunking + reranker.\nLayer 5 - Generation: system prompt + retrieved data + query → LLM output → schema validation.\nLayer 6 - Verification: check claims are grounded. Flag ungrounded claims.\nLayer 7 - Compliance logging: append-only audit log at every step.\nLayer 8 - Response: deliver to customer. Flagged responses → human agent.",
    exp: "Combines Resso (routing), Lawline (pipeline), HariKrushna (RAG), Freelance (event-driven), all roles (evaluation).",
  },

  // ── PART 4: RAPID FIRE DEFINITIONS ──
  {
    part: 4, partTitle: "Rapid Fire Definitions", id: 40,
    q: "What is HNSW?",
    a: "Hierarchical Navigable Small World. A graph-based algorithm for fast approximate nearest neighbor search in high-dimensional space. The main algorithm behind most vector stores.",
    exp: "Used at HariKrushna, Vadtal, and Resso.ai for all vector search.",
  },
  {
    part: 4, id: 41,
    q: "What is two-phase VAD?",
    a: "Voice Activity Detection in two stages. Phase 1: is someone speaking? (binary: speech or silence). Phase 2: what kind of speech event is it? (barge-in, pause, topic switch). Designed at Resso.ai for the real-time conversation engine.",
    exp: "Resso.ai.",
  },
  {
    part: 4, id: 42,
    q: "What is event-driven architecture?",
    a: "Components talk to each other through events (messages) via a broker like Kafka - not direct API calls. Producers publish, consumers subscribe and process independently. Decoupled, scalable, fault-tolerant.",
    exp: "Kafka at Freelance. Event-driven triggers for context memory at Resso.ai.",
  },
  {
    part: 4, id: 43,
    q: "What is CI/CD?",
    a: "Continuous Integration / Continuous Deployment. Every code change automatically triggers tests, a build, and deployment to the environment. No manual steps.",
    exp: "GitHub Actions at Resso.ai and HariKrushna.",
  },
  {
    part: 4, id: 44,
    q: "What is RBAC?",
    a: "Role-Based Access Control. Users get permissions based on their assigned role. An admin can access everything. A coaching persona can only access session memory. Enforced at the API layer.",
    exp: "Resso.ai: 30+ AI personas, each with different tool access levels.",
  },
  {
    part: 4, id: 45,
    q: "What is JWT?",
    a: "JSON Web Token. A signed token that proves who the user is and what they can access. The server signs it, the client sends it with every request, and the server verifies the signature.",
    exp: "JWT-secured REST API at Corol/NunaFab.",
  },
  {
    part: 4, id: 46,
    q: "What is WebSocket?",
    a: "A protocol for real-time two-way communication. Unlike REST (one request, one response), WebSocket keeps the connection open so the server can push data to the client at any time.",
    exp: "Real-time conversation at Resso.ai uses WebSockets.",
  },
  {
    part: 4, id: 47,
    q: "What is Prisma?",
    a: "An ORM for TypeScript/Node.js. You define data models in a schema file, and Prisma generates type-safe database queries. You write Prisma queries instead of raw SQL.",
    exp: "Resso.ai with PostgreSQL.",
  },
  {
    part: 4, id: 48,
    q: "What is PgBouncer?",
    a: "A lightweight connection pooler for PostgreSQL. Sits between the application and the database. Reuses open connections instead of creating a new one for every request.",
    exp: "Resso.ai: handles 200+ concurrent sessions without exhausting Postgres connections.",
  },
  {
    part: 4, id: 49,
    q: "What is FastAPI?",
    a: "A Python web framework for building APIs. Auto-generates documentation, validates inputs using Pydantic, and is one of the fastest Python frameworks available.",
    exp: "HariKrushna, Corol/NunaFab, and Freelance.",
  },
  {
    part: 4, id: 50,
    q: "What is LangChain?",
    a: "A Python framework for building LLM-powered applications. Provides chains (sequences of LLM calls), tool integrations, memory, and retrieval components.",
    exp: "HariKrushna for agent orchestration.",
  },

  // ── PART 5: BEHAVIORAL ──
  {
    part: 5, partTitle: "Behavioral Questions", id: 51,
    q: "Tell me about yourself. (Under 90 seconds)",
    a: "I am an AI engineer based in Toronto.\n\nAt Resso.ai I built the agent orchestration layer for a real-time AI conversation platform on Azure OpenAI. It routes conversations through multiple agents, manages context memory, and serves 200+ live sessions.\n\nAt HariKrushna I consult for enterprise clients in financial services, healthcare, and legal - deploying on-premise agent stacks where data cannot leave the network.\n\nI have also shipped my own products. Lawline.tech runs 16 orchestrated AI agents for law firms. I built MCP servers that give agents a standard way to connect to any external tool.\n\nI am interested in Amex for three reasons: scale (billions of transactions), the data (real financial data with real compliance requirements), and the team (building the agentic AI group from the ground up).",
    exp: "Time yourself. If over 90 seconds, cut the product details and keep Resso + HariKrushna + 3 reasons for Amex.",
  },
  {
    part: 5, id: 52,
    q: "Tell me about a time you disagreed with a team on a technical approach.",
    a: "STAR:\n\nSituation: At Resso.ai, the product team wanted to store full conversation transcripts in PostgreSQL and query them to build the agent's context. Simple, everything in one database.\n\nTask: Convince them it would not scale without dismissing their idea.\n\nAction: I ran a proof of concept. Took 20 real conversations. Version A stuffed the full transcript into the prompt. Version B used a vector database to retrieve only relevant past turns.\n\nResult: Version A hit the context window limit after 10 minutes, retention was 72%. Version B hit 98% with no overflow. I showed them the data side by side. The data made the decision - not me. We shipped the vector approach. That is what runs in production today.",
    exp: "Key: you resolved it with data, not authority. You built a POC instead of arguing.",
  },
  {
    part: 5, id: 53,
    q: "Describe a time you had to learn something new quickly.",
    a: "STAR:\n\nSituation: At Corol/NunaFab I had zero background in concrete science. The project required predicting compressive strength of concrete mixes.\n\nTask: Deliver a model that materials scientists would actually trust and use.\n\nAction: Spent the first week reading papers with the materials scientists. I asked them to explain what each feature meant and why it mattered instead of pretending to understand. Then ran feature importance to confirm which inputs predicted strength - they saw their expertise reflected in the model.\n\nResult: 150-estimator Random Forest, R² = 0.73, 2,200 samples. REST API with React dashboard. 12 engineers used it daily. They trusted it because they understood it.",
    exp: "Shows you can learn a new domain fast - which is exactly what Amex needs (learning financial services).",
  },
  {
    part: 5, id: 54,
    q: "How do you handle working in a regulated environment?",
    a: "At HariKrushna every fintech, healthcare, and legal client had compliance requirements. The fintech client was strictest - every model update needed:\n\n1. Evaluation on the 500-document held-out test set\n2. Hallucination rate verified below 4%\n3. Compliance team review\n4. Written approval before deployment\n\nI did not fight the process. I automated steps 1 and 2. Push a button, the test runs, the report generates. Compliance team gets a clean report in hours, not weeks.\n\nFor Amex: I would build compliance reporting automation into the CI/CD pipeline so every deployment auto-generates the reports the compliance team needs.",
    exp: "You respect process and make it efficient. Do not fight compliance - automate it.",
  },
  {
    part: 5, id: 55,
    q: "Tell me about a time you mentored someone.",
    a: "STAR:\n\nSituation: At HariKrushna, one junior ML engineer was struggling to debug RAG pipeline failures. When retrieval returned wrong results, they did not know where to start.\n\nTask: Make them independent at RAG debugging.\n\nAction: Taught them a four-step process: (1) check query embedding quality, (2) check retrieved chunks for relevance, (3) check if chunks made it into the prompt, (4) check if LLM output is grounded in context. We built a checklist together and worked through 3 real debugging sessions side by side.\n\nResult: Within a month they were debugging RAG pipelines for their own clients without my help. They told me the checklist was the most useful thing anyone had taught them.",
    exp: "Key: structured teaching + reusable artifact + result was their independence.",
  },
  {
    part: 5, id: 56,
    q: "Why American Express? Why not a startup?",
    a: "Three specific reasons:\n\n1. Scale. Amex serves millions of customers and processes billions of transactions. Building agents at that scale means latency requirements and data volumes I cannot access at a startup. I want 99.9% uptime to be a baseline, not a stretch goal.\n\n2. The data. Amex has decades of real financial transaction data. Regulated AI over real data is where this field gets genuinely hard. I have done it from the outside (fintech, healthcare, legal clients). I want to do it from the inside.\n\n3. The team. Amex is building the agentic AI group from scratch - platforms, orchestration, evaluation tooling. I want to be part of building the foundation, not joining after it is already built.",
    exp: "Be specific. No generic 'great company' answers.",
  },
  {
    part: 5, id: 57,
    q: "Where do you see yourself in 2-3 years?",
    a: "Year one: ship production features and learn the Amex stack deeply. Understand how data flows, how compliance works internally, how the team operates.\n\nYear two: own system design decisions. I already do architecture workshops and AI roadmap scoping at HariKrushna for 10+ organizations. I want to do that at much deeper scale within one team.\n\nYear three: mentor newer engineers and help shape the platform architecture. I care about systems that run in production and serve real users - not prototypes.",
    exp: "Tie your growth to Amex's growth. Ambitious but realistic.",
  },
  {
    part: 5, id: 58,
    q: "Tell me about a project that failed or did not go as planned.",
    a: "STAR:\n\nSituation: I built an XGBoost recommendation model for an e-commerce client. Offline evaluation showed conversion going from 2.1% to 2.8%.\n\nTask: Deploy and show business impact.\n\nAction: Deployed it. First two weeks - no clear uplift on the client's dashboard. They got frustrated and questioned the whole project. The problem was not the model. Their traffic was too low for the improvement to be statistically significant in two weeks.\n\nResult: I learned to set expectations upfront. Now every engagement starts with an aligned evaluation plan - what we are measuring, how long it takes to reach significance at their traffic volume, and what the dashboard will look like. The model did work. Conversion settled at 2.8% after a month, adding roughly $180K annual revenue. But the client relationship was strained because I did not manage expectations.",
    exp: "The failure is communication, not technical incompetence. You changed your process.",
  },

  // ── PART 6: MOCK INTERVIEW ──
  {
    part: 6, partTitle: "Mock Interview & Drills", id: 59,
    q: "Mock Round 1 - Intro: Tell me about yourself.",
    a: "Use your Q51 answer. Under 90 seconds.\n\nStructure:\nResso.ai (current: orchestration layer, 200+ live sessions)\nHariKrushna (consulting: 7 clients, regulated industries)\nShipped products (Lawline.tech, MCP servers)\nWhy Amex (scale, data, building the team)",
    exp: "Time yourself. Cut product details if you go over 90 seconds.",
  },
  {
    part: 6, id: 60,
    q: "Mock Round 2 - System Design: Design an agentic fraud detection system.",
    a: "Kafka ingests transaction events real-time, partitioned by card type.\n\nA routing agent classifies each transaction: low / medium / high risk.\nLow risk → passes through.\nMedium risk → flagged for batch review.\nHigh risk → fraud investigation agent immediately.\n\nThe investigation agent retrieves cardholder history from a vector store, cross-references with merchant data and known fraud patterns, generates a risk assessment with evidence citations.\n\nVerification agent checks the assessment. If confirmed fraud: block card, notify cardholder, open a case. If uncertain: route to a human analyst with the pre-built assessment.\n\nEverything is logged: transaction, routing decision, retrieved data, agent reasoning, final action, latency.\n\nMetrics to mention: sub-second routing latency, false positive rate, false negative rate, mean time to detection.",
    exp: "Practice this end-to-end. 10 minutes. Draw it out if you can.",
  },
  {
    part: 6, id: 61,
    q: "Mock Round 3 - Deep Dive: Walk me through the context memory at Resso.ai.",
    a: "Every conversation turn gets embedded and stored in a vector database.\n\nInstead of stuffing the full transcript into the prompt, I retrieve only relevant past turns using event-driven triggers:\n\nSilence timeout (8+ seconds): inject a recap of where the conversation was.\nBarge-in (user interrupts): inject the interrupted topic.\nTopic switch: inject history of the new topic from earlier.\n\nThis keeps the prompt focused. No overflow. Retention went from 72% to 98% across 500+ sessions.\n\n--- Follow-up they will ask ---\n'What if two triggers fire at the same time?'\nPriority order: barge-in > topic switch > silence timeout. Only one fires per turn.",
    exp: "This is your system. You designed it. Know every detail.",
  },
  {
    part: 6, id: 62,
    q: "Mock Round 4 - Coding: Write a function that validates LLM tool call output.",
    a: "Think out loud and write something like:\n\nfrom pydantic import BaseModel, ValidationError\nfrom typing import Optional\nimport json\n\nclass ToolCallResult(BaseModel):\n    status: str\n    tool_name: str\n    data: Optional[dict] = None\n    error: Optional[str] = None\n\ndef validate_tool_output(raw: str, retries: int = 2) -> dict:\n    for attempt in range(retries + 1):\n        try:\n            parsed = json.loads(raw)\n            return ToolCallResult(**parsed).dict()\n        except (json.JSONDecodeError, ValidationError) as e:\n            if attempt < retries:\n                continue  # re-prompt LLM with schema + error\n            return {\n                'status': 'error',\n                'tool_name': 'unknown',\n                'error': f'Failed after {retries} retries: {e}'\n            }\n\nExplain: Pydantic checks types and required fields. Retry re-prompts the LLM with the schema and the error. Safe fallback after all retries.",
    exp: "Think out loud throughout. They want to hear your reasoning.",
  },
  {
    part: 6, id: 63,
    q: "Mock Round 5 - Behavioral: Tell me about working in a regulated environment.",
    a: "Use your Q54 answer.\n\nHariKrushna fintech client → evaluation pipeline automation → compliance report generation → 14% to 3.8% hallucination.",
    exp: "Practice it until it is natural. Do not read it.",
  },
  {
    part: 6, id: 64,
    q: "Mock Round 6 - Your Questions for the Interviewer",
    a: "Pick 3-4 of these:\n\n1. What does the current agent orchestration stack look like? What are the biggest technical challenges right now?\n2. How does the team handle evaluation for agentic systems? Is there a dedicated eval framework?\n3. How much autonomy do the agents currently have - mostly human-in-the-loop, or some fully autonomous?\n4. What does a typical sprint cycle look like for this team?\n5. What does success look like in the first 6 months?",
    exp: "Write these down. Do not wing your questions.",
  },

  // ── PART 7: WEAK SPOTS & CHECKLIST ──
  {
    part: 7, partTitle: "Weak Spots & Checklist", id: 65,
    q: "Weak spot: AWS vs Azure - Your resume is Azure-heavy.",
    a: "Study these four:\n\nSageMaker: managed ML training and deployment. Know endpoints, batch transform, model registry.\nBedrock: managed LLM access. Like Azure OpenAI. Know how to call models and set up RAG with Knowledge Bases.\nStep Functions: serverless orchestration. State machines for multi-step workflows.\nEKS: managed Kubernetes. Like AKS.\n\nYour bridge answer: 'My production agent work is on Azure OpenAI, but the patterns transfer directly. SageMaker is like Azure ML, Bedrock is like Azure OpenAI, Step Functions maps to the orchestration layer I built manually.'",
    exp: "This will come up. Have the bridge answer ready.",
  },
  {
    part: 7, id: 66,
    q: "Weak spot: Kubernetes deep dive.",
    a: "Know these four well:\n\nHPA (Horizontal Pod Autoscaler): auto-scales pods based on CPU, memory, or custom metrics.\nResource requests vs limits: requests guarantee minimum resources, limits cap maximum. Critical for ML inference workloads that spike.\nLiveness vs readiness probes: liveness restarts crashed containers, readiness stops traffic until the model is loaded.\nRolling updates: MaxSurge controls how many extra pods spin up during a deploy, MaxUnavailable controls how many can go down.",
    exp: "Any of these can be a follow-up. Know them cold.",
  },
  {
    part: 7, id: 67,
    q: "Weak spot: AI-assisted development tools.",
    a: "The JD says 'AI-assisted and agentic development tools for design, implementation, testing, debugging, and refactoring.'\n\nPrepare to talk about:\nHow you use GitHub Copilot or Claude in your daily workflow.\nUsing AI for code review, test generation, and debugging.\nResponsible use: you always review AI-generated code, run tests, never blindly trust it.\nHow you accelerated development at Resso or HariKrushna using AI tools.",
    exp: "Have one concrete example from your work ready.",
  },
  {
    part: 7, id: 68,
    q: "Weak spot: Open source contributions.",
    a: "If you have any PRs, talk about them.\n\nIf not, say: 'My products - Lawline, Vadtal, and the MCP servers - are production systems I architected and built from scratch. They are not open source, but they demonstrate the same depth: designing APIs, writing documentation, handling edge cases, and shipping software that real users depend on.'",
    exp: "One sentence pivot is enough.",
  },
  {
    part: 7, id: 69,
    q: "Weak spot: GCP experience.",
    a: "Say: 'My cloud experience is primarily AWS and Azure. GCP maps closely - Vertex AI is like SageMaker, GKE is like EKS, BigQuery is like Redshift. The cloud-agnostic patterns I work with - containerization, Kubernetes, CI/CD - transfer directly.'",
    exp: "One clear sentence. Do not over-explain.",
  },
  {
    part: 7, id: 70,
    q: "Final checklist - night before the interview.",
    a: "1. Read through all questions once more.\n2. Practice 'Tell me about yourself' out loud 3 times. Under 90 seconds.\n3. Know your numbers cold (see the grid below).\n4. Write down 3-4 questions to ask the interviewer.\n5. Have your resume open on a second screen.\n6. Test your camera, microphone, and internet.\n7. Dress one level above what you think is needed.\n8. Sleep well.\n\nYou have built real agent systems, shipped real products, and served real users. Most AI Engineer I candidates cannot say that. Walk in knowing that.",
    exp: "Pre-game routine. Do not skip it.",
  },
];

const numbers = [
  { metric: "sub-800ms", context: "latency", source: "Resso.ai" },
  { metric: "72% → 98%", context: "context retention", source: "Resso.ai" },
  { metric: "14% → 3.8%", context: "hallucination rate", source: "HariKrushna fintech" },
  { metric: "42 seconds", context: "per 800-page file", source: "Lawline.tech" },
  { metric: "12,000+", context: "files processed", source: "Lawline.tech" },
  { metric: "200+", context: "live sessions", source: "Resso.ai" },
  { metric: "500+", context: "sessions evaluated", source: "Resso.ai" },
  { metric: "7", context: "enterprise clients", source: "HariKrushna" },
  { metric: "16", context: "agents in pipeline", source: "Lawline.tech" },
  { metric: "5-stage", context: "Ingest → Extract → Reason → Generate → Verify", source: "Pipeline" },
  { metric: "4 wks → 3 days", context: "integration time", source: "HariKrushna MCP" },
  { metric: "30+", context: "AI personas", source: "Resso.ai" },
  { metric: "50,000+", context: "donor records", source: "Vadtal" },
  { metric: "120 hrs/mo", context: "time freed", source: "Freelance healthcare" },
  { metric: "$180K", context: "annual revenue added", source: "Freelance e-commerce" },
  { metric: "16 GB", context: "hardware deployment", source: "HariKrushna" },
  { metric: "R² = 0.73", context: "2,200 samples, 150 estimators", source: "Corol" },
];

const parts = [1, 2, 3, 4, 5, 6, 7];
const partTitles: Record<number, string> = {
  1: "Basics",
  2: "AI & ML Fundamentals",
  3: "System Design & Production",
  4: "Rapid Fire Definitions",
  5: "Behavioral",
  6: "Mock Interview",
  7: "Weak Spots & Checklist",
};

export default function AmexPrepPage() {
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(true);
  const [activePart, setActivePart] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const filtered = activePart ? questions.filter((q) => q.part === activePart) : questions;
  const progress = completed.size / questions.length;

  const toggleDone = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{background:#080808;font-family:'Inter',system-ui,sans-serif;color:#e0e0e0;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}
        .shell{max-width:860px;margin:0 auto;padding:48px 24px 80px}

        /* hero */
        .hero{margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid #161616}
        .chip{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#39d9b4;margin-bottom:10px}
        .title{font-family:'Syne',sans-serif;font-size:clamp(26px,5vw,38px);font-weight:800;color:#f0f0f0;letter-spacing:-.02em;line-height:1.15;margin-bottom:8px}
        .sub{font-size:14px;color:#666;max-width:560px}

        /* stats */
        .stats{display:flex;gap:28px;flex-wrap:wrap;padding:16px 0;margin-bottom:24px;border-bottom:1px solid #111}
        .stat-n{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#39d9b4}
        .stat-l{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#444}

        /* pills */
        .nav{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:18px}
        .pill{font-family:'JetBrains Mono',monospace;font-size:10px;padding:6px 11px;border-radius:4px;border:1px solid #181818;background:#0a0a0a;color:#555;cursor:pointer;transition:all .15s;white-space:nowrap}
        .pill:hover{border-color:#39d9b440;color:#999}
        .pill.active{background:#39d9b408;border-color:#39d9b4;color:#39d9b4}

        /* toggle */
        .tog-row{display:flex;align-items:center;gap:9px;margin-bottom:20px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#555}
        .tog{width:32px;height:17px;border-radius:9px;background:#1e1e1e;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
        .tog.on{background:#39d9b4}
        .tog::after{content:'';position:absolute;top:2.5px;left:2.5px;width:12px;height:12px;border-radius:50%;background:#fff;transition:transform .2s}
        .tog.on::after{transform:translateX(15px)}

        /* section label */
        .sec{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:#39d9b4;padding:12px 0 6px;border-bottom:1px solid #131313;margin-top:32px}

        /* question card */
        .card{border-bottom:1px solid #0e0e0e;transition:background .12s}
        .card:hover{background:#0b0b0b}
        .card.done{opacity:.4}

        .qh{display:flex;align-items:center;gap:11px;padding:14px 0;cursor:pointer;user-select:none}
        .chk{width:16px;height:16px;border-radius:3px;border:1.5px solid #2a2a2a;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:transparent;cursor:pointer;transition:all .15s}
        .chk.on{border-color:#39d9b4;background:#39d9b4;color:#080808}
        .qn{font-family:'JetBrains Mono',monospace;font-size:10px;color:#39d9b4;opacity:.6;min-width:26px}
        .qt{font-size:14px;font-weight:500;color:#d8d8d8;flex:1}
        .card.done .qt{text-decoration:line-through;color:#444}
        .arr{font-size:14px;color:#2a2a2a;transition:transform .2s}
        .arr.open{transform:rotate(180deg);color:#39d9b4}

        /* answer */
        .body{padding:0 0 16px 52px;animation:fd .18s ease}
        @keyframes fd{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        .ans{font-size:13.5px;line-height:1.85;color:#888;white-space:pre-wrap}
        .xp{margin-top:10px;padding:9px 13px;background:#39d9b405;border-left:2px solid #39d9b440;border-radius:0 4px 4px 0;font-size:12px;color:#39d9b4cc;line-height:1.6}
        .xp-l{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#39d9b450;margin-bottom:3px}

        /* numbers */
        .nums{margin-top:48px;padding-top:24px;border-top:1px solid #161616}
        .nt{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#f0f0f0;margin-bottom:14px}
        .ngrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
        .nc{background:#0c0c0c;border:1px solid #141414;border-radius:6px;padding:12px;transition:border-color .15s}
        .nc:hover{border-color:#39d9b425}
        .nm{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:#39d9b4;margin-bottom:1px}
        .nctx{font-size:11px;color:#777}
        .nsrc{font-family:'JetBrains Mono',monospace;font-size:8px;color:#3a3a3a;margin-top:3px}

        /* progress */
        .bar{position:fixed;top:0;left:0;height:2px;background:#39d9b4;z-index:100;transition:width .3s ease}

        /* back */
        .back{font-family:'JetBrains Mono',monospace;font-size:10px;color:#3a3a3a;text-decoration:none;letter-spacing:.05em;margin-bottom:20px;display:inline-block;transition:color .2s}
        .back:hover{color:#39d9b4}
        .cnt{font-family:'JetBrains Mono',monospace;font-size:11px;color:#2e2e2e;margin-bottom:10px}
        .cnt span{color:#39d9b4}

        @media(max-width:600px){
          .shell{padding:24px 14px 60px}
          .ngrid{grid-template-columns:1fr 1fr}
          .body{padding-left:36px}
          .stats{gap:18px}
        }
      `}</style>

      <div className="bar" style={{ width: `${progress * 100}%` }} />

      <div className="shell">
        <a href="/" className="back">← back</a>

        <div className="hero">
          <div className="chip">Interview Prep</div>
          <div className="title">Amex AI Engineer I<br />Technical &amp; Behavioral</div>
          <div className="sub">70 questions, simple clear answers. Check off as you go.</div>
        </div>

        <div className="stats">
          {[
            { n: questions.length, l: "Total" },
            { n: completed.size, l: "Done" },
            { n: questions.length - completed.size, l: "Left" },
            { n: `${Math.round(progress * 100)}%`, l: "Progress" },
          ].map((s) => (
            <div key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="nav">
          <div className={`pill ${activePart === null ? "active" : ""}`} onClick={() => setActivePart(null)}>
            All ({questions.length})
          </div>
          {parts.map((p) => (
            <div key={p} className={`pill ${activePart === p ? "active" : ""}`} onClick={() => setActivePart(p)}>
              {partTitles[p]} ({questions.filter((q) => q.part === p).length})
            </div>
          ))}
        </div>

        <div className="tog-row">
          <div className={`tog ${showExp ? "on" : ""}`} onClick={() => setShowExp(!showExp)} />
          Show your experience
        </div>

        <div className="cnt"><span>{filtered.length}</span> questions{activePart ? ` · ${partTitles[activePart]}` : ""}</div>

        {parts
          .filter((p) => !activePart || activePart === p)
          .map((p) => {
            const qs = filtered.filter((q) => q.part === p);
            if (!qs.length) return null;
            return (
              <div key={p}>
                <div className="sec">Part {p} · {partTitles[p]}</div>
                {qs.map((q) => (
                  <div key={q.id} className={`card ${completed.has(q.id) ? "done" : ""}`}>
                    <div className="qh" onClick={() => setOpenQ(openQ === q.id ? null : q.id)}>
                      <div className={`chk ${completed.has(q.id) ? "on" : ""}`} onClick={(e) => toggleDone(q.id, e)}>
                        {completed.has(q.id) ? "✓" : ""}
                      </div>
                      <span className="qn">{q.id}</span>
                      <span className="qt">{q.q}</span>
                      <span className={`arr ${openQ === q.id ? "open" : ""}`}>▾</span>
                    </div>
                    {openQ === q.id && (
                      <div className="body">
                        <div className="ans">{q.a}</div>
                        {showExp && q.exp && (
                          <div className="xp">
                            <div className="xp-l">Your Experience</div>
                            {q.exp}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

        <div className="nums">
          <div className="nt">Your Numbers</div>
          <div className="ngrid">
            {numbers.map((n, i) => (
              <div key={i} className="nc">
                <div className="nm">{n.metric}</div>
                <div className="nctx">{n.context}</div>
                <div className="nsrc">{n.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
