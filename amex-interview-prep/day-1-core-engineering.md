# Day 1: Core Engineering and System Design

Focus: Python, Go, TypeScript, APIs, Distributed Systems, Kafka, Kubernetes

---

## Q1. Walk me through how you would design a REST API for an AI agent that needs to call external tools (Slack, CRM, database). What would the request/response contract look like?

**Your answer (from your experience):**

At HariKrushna, I built MCP servers that do exactly this. The way it works is the agent sends a tool_call with three things: the tool name (like "slack_send_message"), the parameters (channel, message text), and a context_id so we can trace the call back to the conversation.

The MCP server receives this, validates the parameters against a JSON schema to make sure nothing is missing or malformed, then routes it to the right adapter. Slack goes through REST (their webhook API). The database goes through gRPC because it is faster for internal calls. CRM goes through REST because that is what Salesforce exposes.

The response comes back as a structured JSON with three fields: status (success or error), data (the actual result), and an error object if something went wrong. The agent receives this and decides what to do next.

I deployed this across 5 enterprise clients and it cut integration time from 4 weeks to 3 days because teams stopped writing custom code for each tool.

**What to emphasize:**
- Schema validation before execution (catches hallucinated parameters)
- Error handling and retry logic (not just happy paths)
- Tracing with context_id for debugging
- REST for external, gRPC for internal

**Follow-up they might ask:** How do you handle rate limiting on external APIs?
**Your answer:** Implement a token bucket or sliding window rate limiter in the MCP server. Queue requests that exceed the limit. Return a retry-after header to the agent so it can wait or try a different approach.

---

## Q2. You mention Python and Go on your resume. When do you choose Go over Python for AI infrastructure?

**Your answer (from your experience):**

At HariKrushna, the agent routing logic was in Go because it handles concurrent requests with low memory overhead. We were running on 16 GB machines so memory mattered. Go's goroutines let us serve multiple agent requests simultaneously without the overhead of Python's threading or multiprocessing.

The RAG query pipeline was Python because of the ML ecosystem. PyTorch, transformers, HNSW bindings, scikit-learn, all of these are Python-first. Writing that in Go would mean reimplementing things that already exist.

The MCP server used both: Go for the network layer (gRPC server, connection pooling, request routing) and Python for the LLM inference and embedding generation.

Simple rule: Go for concurrency-heavy, latency-sensitive services where you need low memory. Python for anything touching model weights, ML libraries, or rapid prototyping.

**What to emphasize:**
- Practical tradeoffs, not theoretical preferences
- You actually used both in the same system
- Memory constraints on 16 GB hardware forced real decisions

**Follow-up they might ask:** What about TypeScript?
**Your answer:** TypeScript for frontend and API layers. At Resso.ai the entire Next.js 15 platform is TypeScript. Prisma ORM, API routes, WebSocket handlers, all TypeScript. It is the right choice when the team is full-stack and the API layer sits close to the frontend.

---

## Q3. Describe how you would design an event-driven pipeline for processing financial transactions with AI. What components would you use?

**Your answer (from your experience):**

I built exactly this for a healthcare startup. Clinical records came in from 3 hospital systems. Here is how it worked:

Kafka handled ingestion. Each hospital had its own topic so we could process them independently and scale consumers per hospital based on volume. Messages were JSON with a schema (patient_id, record_type, timestamp, payload).

Lambda functions consumed from Kafka. The first function validated and normalized the record. The second ran AI classification (flagging anomalies, extracting key fields). The third triggered alerts if something needed attention.

Dead letter queue caught any messages that failed processing after 3 retries. We monitored the DLQ daily.

For Amex, map it to: Kafka topics per transaction type (card swipes, disputes, fraud alerts). Consumer groups per processing type (fraud detection, compliance logging, customer notifications). Schema validation on every message. Exactly-once semantics so no transaction gets processed twice or skipped.

Result: freed 120 hours monthly of manual processing across 3 hospital systems.

**What to emphasize:**
- Kafka partitioning and consumer groups
- Dead letter queue for failed messages
- Schema validation on every message
- Exactly-once semantics (critical for financial transactions)

**Follow-up they might ask:** How do you guarantee exactly-once processing?
**Your answer:** Kafka supports exactly-once semantics with idempotent producers and transactional consumers. On the consumer side, commit offsets only after successful processing. Use idempotency keys to prevent duplicate processing if a message is redelivered.

---

## Q4. How do you handle database connection pooling and caching in a multi-tenant AI platform?

**Your answer (from your experience):**

At Resso.ai, every AI session makes multiple database calls: look up the persona, fetch session history, check RBAC permissions, log the conversation turn. With 200+ concurrent sessions, each opening its own PostgreSQL connection, we would exhaust the connection limit fast.

PgBouncer sits between the application and PostgreSQL. It maintains a pool of connections and reuses them. Our app thinks it has a dedicated connection but PgBouncer is multiplexing underneath. We ran in transaction pooling mode so connections are returned to the pool after each transaction, not held open.

Redis handles session caching. The current conversation context (last 10 turns, active persona, user preferences) lives in Redis. When the agent needs to assemble a prompt, it reads from Redis in under 5ms instead of hitting Postgres. Cache invalidation happens on every new conversation turn: write-through to Redis, then async write to Postgres.

Multi-tenancy isolation: each tenant's data is scoped by a tenant_id in every query. RBAC checks happen at the API layer before any database call. Redis keys are prefixed with tenant_id.

**What to emphasize:**
- PgBouncer transaction pooling mode
- Redis for hot path (prompt assembly under 5ms)
- Write-through caching strategy
- Tenant isolation at every layer

**Follow-up they might ask:** What happens when Redis goes down?
**Your answer:** Fallback to Postgres directly. Latency increases but the system does not break. Redis is a cache, not a source of truth. Postgres is the source of truth.

---

## Q5. Walk me through deploying a containerized AI service to Kubernetes. What does your deployment pipeline look like?

**Your answer (from your experience):**

At HariKrushna, each client's on-premise RAG stack was containerized and deployed to Kubernetes. Here is the pipeline:

1. Developer pushes code to GitHub.
2. GitHub Actions runs: lint, unit tests, and a smoke test that spins up a test vector store and runs a sample query.
3. If tests pass, build the Docker image and push to a private container registry.
4. Helm chart defines the deployment: replicas, resource limits (critical because we run on 16 GB hardware), health checks, environment variables.
5. Helm deploys to the cluster with rolling updates. New pods come up, health check passes, old pods drain and terminate.
6. Liveness probe pings the /health endpoint every 30 seconds. Readiness probe checks if the model is loaded and the vector store is connected.

Resource limits were critical. The LLM inference container gets 8 GB memory limit and 4 CPU cores. The vector store container gets 4 GB. If a container exceeds its limit, Kubernetes kills and restarts it instead of letting it starve other services.

At Resso.ai, same pattern but deployed across 4 Azure environments (dev, staging, production-NA, production-EU) with GitHub Actions CI/CD.

**What to emphasize:**
- Health checks (liveness and readiness probes)
- Resource limits (especially for ML workloads)
- Rolling updates with graceful drain
- Smoke tests before deployment

**Follow-up they might ask:** How do you handle GPU workloads on Kubernetes?
**Your answer:** Use node selectors or taints/tolerations to schedule GPU pods on GPU nodes. Set GPU resource limits in the pod spec. For our on-prem deployments we did not use GPUs (ran quantized models on CPU), but the pattern is the same: define resource requests and limits so the scheduler places pods correctly.

---

## Q6. How do you design a gRPC service vs REST? When would you pick one over the other?

**Your answer (from your experience):**

I use both in the same system. At HariKrushna, the MCP servers use REST for external-facing integrations (Slack webhooks, CRM APIs) because those services already speak REST. But for internal agent-to-tool communication, gRPC is better for three reasons:

1. Speed: binary protobuf encoding is faster than JSON serialization. On the 16 GB hardware we ran, this mattered.
2. Schema enforcement: protobuf defines the contract at compile time. If the agent sends a malformed tool call, it fails at serialization, not at runtime. This is a form of schema validation the JD mentions.
3. Bidirectional streaming: at Lawline.tech, the 5-stage pipeline used gRPC streaming between agents. The Extract agent streams extracted facts to the Reason agent as it finds them instead of waiting for the full extraction to finish. This cut pipeline latency.

REST is better when: the consumer is a browser or external service, you need human-readable payloads for debugging, or the team is more familiar with REST tooling.

**What to emphasize:**
- You use both in production, not just one
- Protobuf as compile-time schema validation
- Streaming for agent-to-agent communication
- Practical reasons, not just "gRPC is faster"

---

## Q7. System Design Exercise: Design a system that takes a customer support query, routes it to the right AI agent, retrieves relevant account data, generates a response, and logs everything for compliance.

**Your answer (map Resso.ai architecture to Amex):**

Here is the architecture, layer by layer:

**1. Ingestion Layer**
Customer query arrives via WebSocket (real-time chat) or REST (async email/form). Normalize the input: strip PII tokens, add a request_id for tracing, attach customer_id from the session.

**2. Router Agent**
A lightweight classifier determines intent. At Resso.ai I built this as a routing layer that decides between context-injection, barge-in, and topic-switch agents. For Amex, the intents might be: billing question, dispute, fraud report, account inquiry, general help. The router uses the LLM with a constrained output schema (must return one of the defined intents plus a confidence score). If confidence is below a threshold, route to a human agent.

**3. Specialist Agent**
Based on intent, route to the right specialist. The dispute agent, for example, needs access to transaction history, merchant data, and dispute policy rules.

**4. RAG Retrieval**
The specialist agent queries a vector store to retrieve relevant account data. For a dispute: pull the specific transaction, the merchant's history, and the relevant section of the dispute policy. Use semantic chunking so policy sections stay intact. Top-k retrieval with a reranker to filter low-relevance results.

**5. Generation**
The LLM receives: system prompt with agent instructions, retrieved account data with source citations, and the customer's query. Schema validation on the output: the response must have a message field, a confidence score, and a list of cited sources.

**6. Verification (optional for high-stakes)**
A verification agent checks that every claim in the response is grounded in the retrieved documents. Ungrounded claims get flagged. This is the Verify stage from my Lawline pipeline.

**7. Compliance Logging**
Every step is logged: the raw query, the routing decision, the retrieved documents, the full prompt sent to the LLM, the raw LLM output, the post-processed response, the latency at each step, and the customer_id. Stored in an append-only audit log. This is non-negotiable in financial services.

**8. Response Delivery**
Send the response back to the customer. If the verification agent flagged anything, route to a human agent instead of sending an unverified response.

**What to emphasize:**
- Compliance logging at every step (Amex cares about this)
- Schema validation on LLM outputs
- Human fallback for low confidence
- Tracing with request_id for debugging
- You have built each of these components in different projects: routing (Resso), multi-agent pipeline (Lawline), RAG (HariKrushna), event-driven (Freelance healthcare)
