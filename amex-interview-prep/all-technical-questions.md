# Amex AI Engineer I - Agentic AI: Complete Technical Questions

All technical questions in one place. Read top to bottom. Every answer uses your real experience.

---

# PART 1: BASICS (Start Here)

---

## 1. What is an API?

An API is how two pieces of software talk to each other. When your phone app shows your bank balance, the app sends a request to the bank's server through an API, and the server sends back your balance as data.

At Amex, AI agents will use APIs to talk to internal systems like transaction databases, customer profiles, and fraud detection tools.

Your experience: You built REST and gRPC APIs at every job. MCP servers at HariKrushna, FastAPI at Corol, WebSocket APIs at Resso.ai.

---

## 2. What is REST?

REST is a style of building APIs using HTTP. You have URLs that represent resources, and you use HTTP methods to act on them.

GET /customers/123 means give me customer 123's data.
POST /disputes means create a new dispute.
PUT /disputes/456 means update dispute 456.
DELETE /disputes/456 means remove dispute 456.

Requests and responses are JSON. Status codes tell you what happened: 200 is success, 400 is bad request, 401 is unauthorized, 404 is not found, 500 is server error.

Your experience: At Corol/NunaFab you built a JWT-secured REST API with FastAPI. At HariKrushna your MCP servers expose REST endpoints for Slack and CRM integrations. At Resso.ai the platform uses REST for session management and RBAC.

---

## 3. What is gRPC and how is it different from REST?

gRPC is another way to build APIs. Instead of JSON over HTTP/1.1 like REST, gRPC uses protobuf (a binary format) over HTTP/2.

Why gRPC is faster: binary data is smaller than JSON text. HTTP/2 allows multiplexing (multiple requests on one connection). Protobuf serialization is faster than JSON parsing.

Why gRPC has stricter contracts: you define your API in a .proto file with exact types. If someone sends a string where a number is expected, it fails at serialization time, not at runtime. This is a form of schema validation.

Why gRPC supports streaming: you can send a stream of messages in both directions. At Lawline.tech, the Extract agent streams extracted facts to the Reason agent as it finds them instead of waiting for the full extraction to finish.

When to use which: REST for external-facing APIs (browsers, third-party services). gRPC for internal service-to-service communication where speed and strict contracts matter.

Your experience: At HariKrushna, MCP servers use REST for Slack webhooks and gRPC for internal agent-to-tool communication. At Lawline.tech, gRPC streaming between the 5 pipeline stages.

---

## 4. What is JSON?

JSON (JavaScript Object Notation) is a text format for structuring data. It looks like this:

```json
{
  "customer_id": "123",
  "name": "John Smith",
  "transactions": [
    {"amount": 50.00, "merchant": "Amazon", "date": "2025-03-01"},
    {"amount": 120.00, "merchant": "Apple", "date": "2025-03-05"}
  ]
}
```

It uses key-value pairs. Values can be strings, numbers, booleans, arrays, or nested objects. Almost every API in the world uses JSON.

Why it matters for AI: LLM outputs are often structured as JSON so downstream systems can parse them programmatically. Schema validation checks that the JSON matches the expected structure.

---

## 5. What is Python and why is it used for AI?

Python is a programming language. It is the default language for AI and ML because:

The ecosystem: PyTorch, TensorFlow, scikit-learn, LangChain, FastAPI, Pydantic all exist in Python. Writing AI in Go or Java means reimplementing things that already exist.

Readability: Python code reads almost like English. This matters when collaborating with data scientists and product teams who need to understand the code.

Speed tradeoff: Python is slower than Go or C++ for raw computation, but the heavy lifting (matrix math, model inference) is done by C/C++ libraries under the hood. Python is just the glue.

Your experience: Python is your primary language across all roles. FastAPI at HariKrushna and Corol. PyTorch and scikit-learn for model training. LangChain for agent orchestration.

---

## 6. What is Go and when do you use it instead of Python?

Go is a compiled language built by Google. It is fast, has great concurrency support (goroutines), and uses less memory than Python.

When to use Go over Python: when you need to handle many concurrent requests with low memory. At HariKrushna, the agent routing logic was in Go because it needed to serve multiple agent requests simultaneously on 16 GB hardware. Go's goroutines handle this efficiently. Python's threading (with the GIL) is worse at this.

When to stick with Python: anything touching ML models, embeddings, vector stores, or rapid prototyping. The Python ecosystem for ML is 10x larger than Go's.

Your experience: At HariKrushna you used Go for the MCP server network layer (gRPC, connection pooling) and Python for LLM inference and RAG pipelines.

---

## 7. What is TypeScript?

TypeScript is JavaScript with types. You declare what type each variable is (string, number, boolean, custom types) and the compiler catches errors before the code runs.

Why it matters: at Amex, the frontend and API layers are likely TypeScript. Type safety prevents bugs that would otherwise reach production.

Your experience: At Resso.ai, the entire Next.js 15 platform is TypeScript. Prisma ORM, API routes, WebSocket handlers, React components, all TypeScript.

---

## 8. What is Docker?

Docker packages your application and all its dependencies into a container. The container runs the same way on your laptop, on a test server, and in production.

Without Docker: "it works on my machine" problems. Your laptop has Python 3.10, the server has Python 3.8, and things break.

With Docker: the container includes the exact Python version, exact libraries, exact config. It runs identically everywhere.

A Dockerfile tells Docker how to build the container:
```
FROM python:3.10
COPY . /app
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

Your experience: At HariKrushna, each client's RAG stack was containerized with Docker. At Lawline.tech, all 16 agents run in Docker containers on the client's local machine (air-gapped).

---

## 9. What is Kubernetes?

Kubernetes (K8s) manages Docker containers in production. It handles:

Scaling: if one container is overloaded, Kubernetes spins up more copies automatically (Horizontal Pod Autoscaler).

Self-healing: if a container crashes, Kubernetes restarts it automatically.

Rolling updates: deploy new code without downtime. New containers come up, health check passes, old containers shut down.

Resource management: you set memory and CPU limits per container so one service cannot starve others.

Key concepts:
- Pod: the smallest unit, usually one container.
- Deployment: manages replicas of a pod.
- Service: a stable network endpoint for a set of pods.
- Liveness probe: checks if the container is alive. If not, restart it.
- Readiness probe: checks if the container is ready to serve traffic. If not, stop sending requests to it.

Your experience: At HariKrushna, client RAG stacks deployed on Kubernetes. At Resso.ai, deployed across 4 Azure environments. You set resource limits because models ran on 16 GB hardware.

---

## 10. What is AWS?

Amazon Web Services is a cloud platform. Key services for AI:

EC2: virtual servers. You rent a machine in the cloud.
S3: object storage. Store files, model weights, datasets.
Lambda: serverless functions. Code runs only when triggered, no server to manage.
SageMaker: managed ML platform. Train, deploy, and monitor models.
Bedrock: managed LLM access. Call models like Claude or Llama without hosting them yourself.
Step Functions: orchestrate multi-step workflows as state machines.

Your experience: AWS Academy certificate (EC2, S3, Lambda, SageMaker, IAM, CloudWatch). Used Lambda and S3 at Freelance for the healthcare pipeline. Kafka + Lambda for event-driven ingestion.

---

## 11. What is Kafka?

Kafka is a distributed event streaming platform. It handles real-time data feeds at massive scale.

How it works: producers publish messages to topics. Consumers subscribe to topics and process messages. Messages are stored on disk so consumers can replay them.

Key concepts:
- Topic: a named category of messages (like "transactions" or "fraud_alerts").
- Partition: topics are split into partitions for parallelism. Each partition is an ordered log.
- Consumer group: a set of consumers that share the work of reading from a topic. Each partition is read by exactly one consumer in the group.
- Offset: each message has a position number. Consumers track their offset to know where they left off.

Why Kafka for AI at Amex: millions of card transactions happen every second. Kafka ingests them in real-time. AI agents consume from Kafka topics to detect fraud, classify disputes, and trigger alerts.

Your experience: At Freelance, you built an event-driven pipeline with Kafka and Lambda for healthcare record ingestion across 3 hospital systems. Each hospital had its own topic.

---

## 12. What is a database and what is PostgreSQL?

A database stores data in a structured way so you can query it. PostgreSQL (Postgres) is a relational database where data lives in tables with rows and columns.

SQL queries let you ask questions:
```sql
SELECT * FROM transactions WHERE customer_id = '123' AND amount > 100;
```

PostgreSQL is great for structured data with relationships (customers have transactions, transactions have merchants).

Connection pooling: each database connection uses memory. With 200+ concurrent users at Resso.ai, you would exhaust connections fast. PgBouncer sits between the app and Postgres, reusing connections instead of opening new ones for every request.

Your experience: PostgreSQL at Resso.ai (with Prisma ORM, PgBouncer pooling). PostgreSQL at Freelance for the healthcare pipeline. Redis for caching (session context at Resso.ai).

---

## 13. What is Redis?

Redis is an in-memory data store. It is extremely fast (sub-millisecond reads) because everything lives in RAM, not on disk.

Used for: caching (store frequently accessed data so you do not hit the database every time), session storage (keep user session data fast), message queues.

At Resso.ai: the current conversation context (last 10 turns, active persona, user preferences) lives in Redis. When the agent needs to build a prompt, it reads from Redis in under 5ms instead of querying PostgreSQL. Write-through strategy: every new turn writes to Redis first, then async to Postgres.

What happens if Redis goes down: fall back to Postgres directly. Latency increases but the system does not break. Redis is a cache, not the source of truth. Postgres is the source of truth.

---

# PART 2: AI AND ML FUNDAMENTALS

---

## 14. What is a Large Language Model (LLM)?

An LLM is a neural network trained on massive amounts of text to predict the next word. GPT-4o, Claude, Llama are LLMs. They can generate text, answer questions, write code, and reason over information.

How they work at a high level: you give the model a prompt (input text). The model processes it through billions of parameters (learned weights). It generates output text one token (word/piece) at a time, each time predicting the most likely next token.

Key concepts:
- Tokens: pieces of text. "Hello world" might be 2 tokens. Models have a context window limit (how many tokens they can see at once).
- Temperature: controls randomness. 0 means deterministic (always picks the most likely token). 1 means more creative/random.
- System prompt: instructions that define how the model should behave.
- Context window: the maximum input + output tokens. GPT-4o has 128K tokens. If your input exceeds this, the model cannot see everything.

Your experience: Azure OpenAI GPT-4o at Resso.ai. Claude API at HariKrushna. GGUF-quantized open-source models for on-premise deployments.

---

## 15. What is an embedding?

An embedding is a list of numbers (a vector) that represents the meaning of a piece of text. Similar texts have similar embeddings (close together in vector space). Different texts have different embeddings (far apart).

Example: "credit card fraud" and "unauthorized transaction" would have similar embeddings because they mean similar things. "Credit card fraud" and "chocolate cake recipe" would have very different embeddings.

Why embeddings matter: they are how RAG works. You embed your documents, embed the user's question, and find which documents are closest (most similar) to the question.

Your experience: embeddings at HariKrushna for RAG (7 clients), at Vadtal for semantic search over 50,000+ records, at Resso.ai for session memory retrieval.

---

## 16. What is a vector store?

A vector store is a database optimized for storing and searching embeddings. You put in a query embedding and it returns the most similar stored embeddings.

Regular database: "give me all records where customer_id = 123" (exact match).
Vector store: "give me the 10 records most similar to this question" (similarity search).

HNSW (Hierarchical Navigable Small World) is the algorithm most vector stores use. It builds a graph structure that allows fast approximate nearest neighbor search. Not exact, but very fast and very close to exact.

Your experience: custom HNSW vector stores at HariKrushna (7 clients, sub-1s latency on 16 GB hardware), at Vadtal (50,000+ records), and at Resso.ai (session memory).

---

## 17. What is RAG (Retrieval-Augmented Generation)?

RAG is a technique where you retrieve relevant documents from a vector store and inject them into the LLM prompt so the model answers based on your data, not just its training data.

The flow:
1. User asks a question.
2. Embed the question into a vector.
3. Search the vector store for the most similar document chunks.
4. Put those chunks into the LLM prompt along with the question.
5. The LLM generates an answer based on the retrieved context.

Why RAG matters: LLMs are trained on public data. Amex's transaction data, customer records, and internal policies are not in the training data. RAG lets the model answer questions about Amex-specific data without retraining the model.

Key decisions when building RAG:
- Chunking: how you split documents. Fixed-size (every 500 tokens) is simple but breaks sentences. Semantic chunking (split at meaning boundaries) is better because each chunk is a complete thought.
- Embedding model: which model converts text to vectors. Test multiple and pick the one with best retrieval recall on your domain.
- Retrieval: top-k returns the k most similar chunks. Add a reranker to filter out low-relevance results.
- Prompt construction: put retrieved chunks in the system prompt with citations. Instruct the model to only answer from the provided context.

Your experience: RAG at HariKrushna (7 clients, regulated industries, on-premise), RAG at Vadtal (50,000+ records), RAG at Lawline.tech (legal documents), RAG at Resso.ai (session memory).

---

## 18. What is an agentic AI system?

A chatbot takes input and returns output. One step. An agentic AI system plans, reasons, uses tools, and takes actions across multiple steps.

The difference:

Chatbot: "What is my balance?" > Model generates "Your balance is $500."

Agent: "Dispute my last transaction at Amazon." > Agent plans: (1) look up the last Amazon transaction, (2) retrieve dispute policy, (3) check if this transaction qualifies, (4) create the dispute, (5) notify the customer. Each step involves calling a tool, reasoning over the result, and deciding the next action.

Key capabilities of agents:
- Planning: deciding what steps to take.
- Tool use: calling APIs, databases, search engines.
- Reasoning: using the results of tool calls to make decisions.
- Memory: remembering what happened earlier in the conversation.
- Verification: checking its own work before finalizing.

Your experience: At Resso.ai, the agent routes conversations through multiple sub-agents (context injection, barge-in, topic-switch). At Lawline.tech, 16 agents work in a 5-stage pipeline (Ingest, Extract, Reason, Generate, Verify). At HariKrushna, MCP servers give agents the ability to call tools (Slack, CRM, databases).

---

## 19. What is tool calling in an LLM agent?

Tool calling is how an agent uses external tools. The LLM does not actually execute anything. It generates a structured request, and your code executes it.

The flow:
1. System prompt lists available tools with their names, descriptions, and parameter schemas.
2. User sends a message.
3. LLM decides it needs a tool. It outputs a JSON tool_call: {"tool": "query_database", "params": {"customer_id": "123"}}.
4. Your orchestration code intercepts this. Validates the parameters against the schema.
5. If valid, executes the tool call (queries the database).
6. Returns the result to the LLM as a tool_response.
7. LLM uses the result to continue reasoning or generate a final answer.

Schema validation is critical: if the LLM hallucinates a parameter that does not exist (like "customer_ssn" when only "customer_id" is defined), schema validation catches it before execution. This prevents bad queries from hitting production databases.

Your experience: MCP servers at HariKrushna. The universal protocol validates every tool call against a JSON schema before routing to the right adapter (REST for Slack, gRPC for database). Reduced integration time from 4 weeks to 3 days.

---

## 20. What is prompt engineering?

Prompt engineering is writing instructions for an LLM to get the output you want. In production, prompts are engineering artifacts, not experiments.

Basic techniques:
- System prompt: defines the agent's role, personality, and constraints.
- Few-shot examples: include 2-3 examples of correct input/output in the prompt so the model learns the pattern.
- Chain of thought: ask the model to think step by step before giving a final answer. Improves reasoning.
- Output format: tell the model to respond in JSON, markdown, or a specific structure.

Production prompt engineering (what you do at Resso.ai):
- Versioned: every prompt has a version number. Old versions available for rollback.
- Templated: 30+ AI personas each have a template with variables (session_context, persona_instructions, user_history). Change a variable without rewriting the prompt.
- Tested: before a prompt change deploys, run it against an evaluation set. If metrics regress, it does not ship.
- Monitored: evaluation dashboards track accuracy, latency, and retention continuously.

Your experience: 30+ persona templates at Resso.ai. Schema-constrained prompts at HariKrushna. Evaluation dashboards tracking prompt performance.

---

## 21. What is fine-tuning and what is LoRA?

Fine-tuning means training a pre-trained model on your specific data so it learns your domain.

Full fine-tuning: update all model weights. Expensive, requires lots of GPU memory, risk of catastrophic forgetting (model forgets general knowledge).

LoRA (Low-Rank Adaptation): freeze the original weights. Add small adapter matrices and only train those. Much faster, much cheaper, and you can swap adapters per client.

QLoRA: LoRA but the frozen weights are quantized (4-bit) to save memory. You can fine-tune a large model on a single GPU.

Your experience: At HariKrushna, off-the-shelf LLMs hallucinated at 14% on domain-specific terminology. You ran LoRA/QLoRA fine-tuning with schema validation and held-out test monitoring. Hallucination dropped to 3.8% on a 500-document eval set for a fintech client.

---

## 22. What is GGUF quantization?

Quantization reduces the precision of model weights to use less memory. A model normally uses 16-bit or 32-bit numbers for each weight. Quantization converts them to 8-bit or 4-bit.

GGUF is a file format for quantized models. A 70 billion parameter model that normally needs 140 GB of memory can be quantized to 4-bit and run on 16 GB of RAM.

Tradeoff: slight accuracy loss for massive memory savings. In practice, 4-bit quantization loses very little quality for most tasks.

Your experience: GGUF-quantized models at HariKrushna (7 clients on 16 GB hardware, sub-1s latency) and at Lawline.tech (air-gapped on-premise, fully offline).

---

## 23. What is schema validation for LLM outputs?

Schema validation checks that the LLM's output matches an expected structure before it reaches downstream systems.

You define a schema (using JSON Schema or Pydantic in Python):
```python
class DisputeAssessment(BaseModel):
    decision: Literal["approve", "deny"]
    confidence: float  # between 0 and 1
    reasoning: str  # max 500 chars
    cited_evidence: list[str]  # at least one required
```

The LLM is prompted to output JSON matching this schema. Your code parses the output and validates it against the schema. If it fails:
1. Retry with a more constrained prompt (include the schema and the error message).
2. If it fails again, fall back to a safe default (route to human agent).
3. Log the failure for debugging.

Why it matters at Amex: a malformed LLM output could trigger a wrong action on a real customer's account. Schema validation is the safety net.

Your experience: Schema validation at HariKrushna as part of the hallucination reduction (14% to 3.8%). Pydantic models for structured outputs. Retry logic with constrained prompts.

---

## 24. What is MCP (Model Context Protocol)?

MCP is a standard protocol for AI agents to connect to external tools through one interface instead of writing custom code for each tool.

Without MCP: to connect an agent to Slack you write Slack-specific code. To connect to a CRM you write CRM-specific code. To connect to a database you write database-specific code. Every integration is custom.

With MCP: the agent sends a standard tool_call message. The MCP server validates it and routes it to the right adapter. Slack, CRM, and database all speak the same protocol from the agent's perspective.

Your experience: You built production MCP servers at HariKrushna connecting agents to Slack, CRM, databases, and REST/gRPC APIs. Reduced integration time from 4 weeks to 3 days across 5 enterprise deployments.

---

## 25. What is semantic chunking?

When you build a RAG pipeline, you need to split documents into chunks before embedding them. There are two approaches:

Fixed-size chunking: split every 500 tokens. Simple but dumb. It might split a sentence in the middle: "The interest rate for this product is" in one chunk and "4.5% annually, effective from January" in another. Now neither chunk makes sense on its own.

Semantic chunking: split at meaning boundaries. Paragraphs, sections, topic changes. A paragraph about interest rates stays together. A section about fraud detection stays together. Each chunk is a complete, coherent unit.

Why it matters: better chunks mean better retrieval. If the user asks "what is the interest rate?" and the chunk containing the answer is coherent, the embedding will be more accurate and retrieval will find it.

Your experience: Semantic chunking at HariKrushna for regulated industries (healthcare, legal, finance). Critical for legal documents at Lawline.tech where arguments span multiple sentences.

---

# PART 3: SYSTEM DESIGN AND PRODUCTION

---

## 26. How do you design a REST API for an AI agent that calls external tools?

The contract: agent sends a tool_call with tool name, parameters, and context_id for tracing. MCP server validates parameters against JSON schema. Routes to the right adapter (REST for Slack, gRPC for database). Returns structured response with status, data, and error object.

Error handling: timeout returns a retry-after suggestion. Auth failure returns a re-auth instruction. Malformed parameters return the validation error. The LLM receives structured errors so it can adapt (retry, use fallback, inform user).

Rate limiting: token bucket rate limiter in the MCP server. Queue requests that exceed the limit.

Your experience: MCP servers at HariKrushna. 5 enterprise deployments. Integration time from 4 weeks to 3 days.

---

## 27. When do you choose Go over Python?

Go for: concurrent request handling with low memory (agent routing on 16 GB hardware), network services (gRPC server, connection pooling), latency-sensitive services.

Python for: anything touching ML models, embeddings, vector stores, LLM inference. The Python ecosystem (PyTorch, LangChain, Pydantic) is 10x larger.

Both in one system: at HariKrushna, Go for the MCP server network layer, Python for RAG and LLM inference.

---

## 28. How do you design an event-driven pipeline for financial transactions?

Kafka ingests transactions in real-time. Topics per transaction type (card swipes, disputes, fraud alerts). Consumer groups per processing type (fraud detection, compliance logging).

Each message has a schema. Validation on every message. Dead letter queue for failed messages after 3 retries. Exactly-once semantics: idempotent producers, transactional consumers, commit offsets only after successful processing.

Your experience: Kafka + Lambda at Freelance for healthcare. 3 hospital systems, each with its own topic. Freed 120 hours monthly.

---

## 29. How do you handle database connection pooling and caching?

PgBouncer for PostgreSQL connection pooling. Transaction pooling mode returns connections after each transaction. Redis for hot path caching (prompt assembly in under 5ms). Write-through: write to Redis first, async to Postgres. Multi-tenancy: scope everything by tenant_id. RBAC checks at the API layer.

Your experience: Resso.ai with 200+ concurrent sessions, 30+ personas, 4 Azure environments.

---

## 30. How do you deploy an AI service to Kubernetes?

Pipeline: push code to GitHub. GitHub Actions runs lint, tests, smoke test. Build Docker image, push to registry. Helm chart defines deployment (replicas, resource limits, health checks, env vars). Rolling update with graceful drain.

Health checks: liveness probe restarts crashed containers. Readiness probe stops traffic until model is loaded. Resource limits prevent one container from starving others (critical for ML workloads on limited hardware).

Your experience: HariKrushna clients on Kubernetes. Resso.ai across 4 Azure environments with GitHub Actions CI/CD.

---

## 31. How do you build a RAG pipeline from scratch?

Step 1 - Chunking: semantic chunking at meaning boundaries.
Step 2 - Embedding: test multiple models, pick best retrieval recall on domain.
Step 3 - Vector store: HNSW for fast approximate nearest neighbor search.
Step 4 - Retrieval: top-k with reranker to filter low-relevance chunks.
Step 5 - Prompt: inject retrieved chunks with source citations. Instruct model to answer from context only.
Step 6 - Evaluation: track retrieval precision, answer correctness, hallucination rate on held-out set.

Your experience: RAG at HariKrushna (7 clients, sub-1s, 16 GB hardware), Vadtal (50,000+ records), Lawline (12,000+ files), Resso (session memory).

---

## 32. How do you evaluate an AI system in production?

Resso.ai metrics: agent accuracy, latency (sub-800ms target), context retention (72% to 98%), session completion rate. Evaluation dashboards per persona per day.

HariKrushna metrics: hallucination rate on 500-document held-out set (14% to 3.8%), retrieval precision, schema validation pass rate, query latency.

Lawline metrics: end-to-end processing time (42 seconds per 800-page file), source linking accuracy, stage-level latency.

For Amex: response correctness, latency SLAs, hallucination rate, tool call success rate, compliance logging completeness.

---

## 33. How do you handle failures in a multi-agent pipeline?

Retry with exponential backoff (1s, 4s, 16s). Dead letter queue after 3 retries with full context (document ID, stage, error, input). Pipeline continues with remaining items. Verify agent flags gaps. Structured error responses so LLM can adapt (retry, fallback, inform user).

Your experience: Lawline 5-stage pipeline (Ingest, Extract, Reason, Generate, Verify). MCP server tool call failure handling at HariKrushna.

---

## 34. How do you deploy AI air-gapped on-premise?

GGUF-quantized models fit on 16 GB machines. HNSW vector store built and persisted locally. All agents in Docker containers. No internet, no external API calls, no telemetry. Updates via secure transfer. The stack runs fully offline.

Why it matters: law firms (attorney-client privilege), healthcare (HIPAA), finance (data residency). Data legally cannot leave the premises.

Your experience: Lawline.tech (fully air-gapped, 16 agents, 12,000+ files), HariKrushna (7 clients, regulated industries), Vadtal (50,000+ records, fully offline).

---

## 35. How do you monitor and debug a wrong AI agent answer?

Step-by-step trace:
1. Routing: did the router pick the right agent? Wrong agent = routing error.
2. Retrieval: did the vector store return relevant context? Wrong context = retrieval error (check embedding quality, chunking).
3. Prompt: was the prompt assembled correctly? Missing context = template bug.
4. Generation: LLM ignored context or hallucinated = generation error (constrain prompt, add examples, fine-tune).
5. Validation: did schema catch it? If not = tighten schema constraints.

Run failing input against evaluation set to check if one-off or regression.

Your experience: full logging at every step at Resso.ai. Evaluation dashboards tracking accuracy and retention.

---

## 36. How do you handle LLM hallucination?

Layer 1 - Fine-tuning: LoRA/QLoRA on domain data (14% to 3.8%).
Layer 2 - RAG grounding: model answers from retrieved documents only.
Layer 3 - Schema validation: check structure before reaching users.
Layer 4 - Evaluation: held-out 500-document test set, continuous monitoring.
Layer 5 - Human-in-the-loop: route low-confidence outputs to human review.
Layer 6 - Source citations: every claim must cite a retrieved document.

Your experience: HariKrushna fintech client. 14% hallucination to 3.8% using all these layers combined.

---

## 37. How do you manage context windows for long conversations?

Problem: after 10 minutes, the context window fills up and the agent repeats itself. Retention was 72%.

Solution: store every turn as an embedding in a vector database. Instead of stuffing the full transcript into the prompt, selectively retrieve relevant past turns based on event-driven triggers:
- Silence timeout: inject recap of where the conversation was.
- Barge-in: inject the interrupted topic.
- Topic-switch: inject history of the new topic.

Result: focused prompts, no context window overflow, retention rose to 98% across 500+ sessions.

Your experience: Resso.ai. Designed the event-driven trigger system and the vector database session memory.

---

## 38. How do you design a multi-agent workflow for credit card disputes?

Map Lawline pipeline to Amex:
Stage 1 (Ingest): receive claim, extract text from uploaded documents.
Stage 2 (Extract): pull key facts (date, merchant, amount, claim type) into structured JSON.
Stage 3 (Reason): cross-reference facts against transaction records, merchant history, dispute policy.
Stage 4 (Generate): produce decision recommendation with evidence citations, strict schema.
Stage 5 (Verify): check every claim is grounded in evidence, flag contradictions.

Inter-agent communication: structured JSON between stages, not free text. Schema validation at every handoff. Human review for flagged cases.

Your experience: Lawline.tech (16 agents, 5-stage pipeline, 12,000+ files, 94% time reduction).

---

## 39. Design a customer support AI system for Amex.

Layer 1 - Ingestion: query arrives via WebSocket or REST. Normalize input, add request_id, attach customer_id.

Layer 2 - Router: classify intent (billing, dispute, fraud, account, general). Constrained output schema. Low confidence routes to human.

Layer 3 - Specialist agent: selected based on intent. Needs access to relevant data sources.

Layer 4 - RAG retrieval: query vector store for account data, transaction history, policy documents. Semantic chunking. Reranker filters noise.

Layer 5 - Generation: LLM receives system prompt + retrieved data + query. Schema validation on output.

Layer 6 - Verification: check claims are grounded. Flag ungrounded claims.

Layer 7 - Compliance logging: log everything at every step. Append-only audit log.

Layer 8 - Response: send to customer. Flagged responses route to human instead.

Your experience: routing (Resso), multi-agent pipeline (Lawline), RAG (HariKrushna), event-driven (Freelance healthcare), evaluation (all roles).

---

# PART 4: RAPID FIRE DEFINITIONS

---

## 40. What is HNSW?
Hierarchical Navigable Small World. Graph-based algorithm for approximate nearest neighbor search. Fast retrieval from vector stores.

## 41. What is two-phase VAD?
Voice Activity Detection in two stages. Phase 1: detect if someone is speaking. Phase 2: classify the event (barge-in, pause, topic switch). Designed at Resso.ai.

## 42. What is event-driven architecture?
Components communicate through events (messages) via a broker (Kafka). Producers publish, consumers subscribe. Decoupled, scalable, fault-tolerant.

## 43. What is CI/CD?
Continuous Integration / Continuous Deployment. Code changes automatically trigger tests, build, and deployment. GitHub Actions at Resso.ai and HariKrushna.

## 44. What is RBAC?
Role-Based Access Control. Users get permissions based on their role. At Resso.ai, different personas have different tool access. Admin can access everything, coaching persona only accesses session memory.

## 45. What is JWT?
JSON Web Token. A signed token that proves who the user is and what they can access. At Corol/NunaFab, the REST API was JWT-secured.

## 46. What is WebSocket?
A protocol for real-time two-way communication. Unlike REST (request/response), WebSocket keeps a connection open so the server can push data to the client. At Resso.ai, real-time conversation uses WebSockets.

## 47. What is Prisma?
An ORM (Object-Relational Mapper) for TypeScript/Node.js. Instead of writing SQL, you define data models and Prisma generates type-safe database queries. Used at Resso.ai with PostgreSQL.

## 48. What is PgBouncer?
A lightweight connection pooler for PostgreSQL. Sits between app and database, reuses connections. Used at Resso.ai to handle 200+ concurrent sessions.

## 49. What is FastAPI?
A Python web framework for building APIs. Fast, automatic docs, type validation with Pydantic. Used at HariKrushna, Corol/NunaFab, and Freelance.

## 50. What is LangChain?
A Python framework for building LLM applications. Provides chains (sequences of LLM calls), tools, memory, and retrieval. Used at HariKrushna for agent orchestration.

---

# YOUR NUMBERS (Memorize These)

- sub-800ms latency (Resso.ai)
- 72% to 98% context retention (Resso.ai)
- 14% to 3.8% hallucination (HariKrushna fintech)
- 42 seconds per 800-page file (Lawline.tech)
- 12,000+ files processed (Lawline.tech)
- 200+ live sessions (Resso.ai)
- 500+ sessions evaluated (Resso.ai)
- 7 enterprise clients (HariKrushna)
- 16 agents in pipeline (Lawline.tech)
- 5-stage pipeline: Ingest, Extract, Reason, Generate, Verify
- 4 weeks to 3 days integration time (HariKrushna MCP)
- 5 enterprise deployments (HariKrushna MCP)
- 500-document eval set (HariKrushna)
- 30+ AI personas (Resso.ai)
- 50,000+ donor records (Vadtal)
- 120 hours monthly freed (Freelance healthcare)
- $180K annual revenue added (Freelance e-commerce)
- 4 Azure environments (Resso.ai)
- 16 GB hardware deployment (HariKrushna)
- R2 = 0.73, 2,200 samples, 150 estimators (Corol)
- 12 research engineers daily (Corol)
