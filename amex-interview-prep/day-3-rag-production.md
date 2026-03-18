# Day 3: RAG, Orchestration and Production Systems

Focus: RAG Pipelines, Vector Stores, Evaluation, Monitoring, Reliability, Schema Validation

---

## Q1. Walk me through how you build a RAG pipeline from scratch. What are the key decisions?

**Your answer (from your experience):**

I have built RAG pipelines at HariKrushna (7 clients), Vadtal (50,000+ records), and Lawline.tech (12,000+ legal files). Here are the decisions in order:

**Chunking strategy.** This is the decision most people get wrong. Fixed-size chunks (500 tokens) split documents in the middle of sentences and paragraphs. I use semantic chunking, which splits at meaning boundaries. A paragraph about interest rate policy stays together. A section about fraud detection stays together. At Lawline, this was critical because legal arguments span multiple sentences and splitting them broke the reasoning.

**Embedding model.** I test multiple models on a held-out retrieval set before choosing. The model that gives the best retrieval recall on domain-specific queries wins. For the fintech client at HariKrushna, general-purpose embeddings missed financial terminology. Domain-aware embeddings performed better.

**Vector store.** HNSW (Hierarchical Navigable Small World) for fast approximate nearest neighbor search. At Vadtal, I built a custom HNSW store over 50,000+ donor records running fully offline on local hardware. At HariKrushna, same approach on 16 GB machines with sub-1s query latency.

**Retrieval.** Top-k retrieval returns the k most similar chunks. But similarity is not always relevance. I add a reranker that scores each retrieved chunk against the query and filters out low-relevance results before they reach the LLM. This reduces noise in the context window.

**Prompt construction.** Retrieved chunks go into the system prompt with source citations. The LLM is instructed to only answer from the provided context. If the context does not contain the answer, say so.

**Evaluation.** Track retrieval precision (did we retrieve the right chunks?), answer correctness (did the LLM answer correctly?), and hallucination rate (did the LLM make claims not in the context?). At HariKrushna, I ran this on a 500-document eval set continuously.

**What to emphasize:**
- Semantic chunking over fixed-size (with a real reason why)
- Evaluation is built in from day one, not added later
- Real numbers: sub-1s latency, 7 clients, 50,000+ records

---

## Q2. How do you evaluate an AI system in production? What metrics do you track?

**Your answer (from your experience):**

I track different metrics depending on the system:

At Resso.ai (real-time agent): agent accuracy (does the response match expected behavior for this persona?), latency (target is sub-800ms end to end), context retention (72% to 98% after the vector memory fix), session completion rate (did the user finish the session or drop off?), evaluation dashboards showing all of these per persona and per day.

At HariKrushna (RAG for fintech): hallucination rate on a 500-document held-out set (14% down to 3.8%), retrieval precision (are we retrieving the right chunks?), schema validation pass rate (what percentage of LLM outputs match the expected structure?), latency per query.

At Lawline.tech (multi-agent pipeline): end-to-end processing time (42 seconds per 800-page file), source linking accuracy (every claim must cite a document, and the citation must be correct), stage-level latency (how long does each of the 5 stages take?).

For Amex, I would track: response correctness (verified against known-good answers for common queries), latency SLAs (per endpoint), hallucination rate (on a held-out financial Q&A set), tool call success rate (did the agent's tool calls execute correctly?), compliance logging completeness (is every step logged?), and customer satisfaction signals if available.

**What to emphasize:**
- Different metrics for different systems
- You already build evaluation dashboards, not just use off-the-shelf tools
- Continuous evaluation, not one-time testing

---

## Q3. How do you handle failures in a multi-agent pipeline? What happens when one agent fails?

**Your answer (from your experience):**

In the Lawline 5-stage pipeline (Ingest, Extract, Reason, Generate, Verify), documents come in batches. If the Extract agent fails on one document, it should not kill the whole batch.

Here is how I handle it:

Each stage has retry logic with exponential backoff. First retry after 1 second, second after 4 seconds, third after 16 seconds. Most failures are transient (LLM rate limit, temporary network issue) and resolve on retry.

If a stage fails after 3 retries, that document moves to a dead letter queue. The error is logged with the document ID, the stage that failed, the error message, and the input that caused it. The pipeline continues processing the remaining documents.

The Verify agent at the end knows about the DLQ. If documents are missing from the expected set, it flags this in the output report so a human knows something was skipped.

For the MCP servers at HariKrushna, tool call failures work differently. If Slack API times out, the orchestration layer returns a structured error to the LLM: {"status": "error", "tool": "slack", "error": "timeout", "suggestion": "retry or use fallback"}. The LLM can then decide to retry, try a different approach, or inform the user.

**What to emphasize:**
- Retry with exponential backoff (not just immediate retry)
- Dead letter queue with full context for debugging
- The pipeline degrades gracefully, it does not crash
- Structured error responses so the LLM can adapt

---

## Q4. Your resume mentions deploying AI systems air-gapped on-premise. How does that work and why does it matter?

**Your answer (from your experience):**

Lawline.tech runs fully air-gapped for law firms. No internet connection. Here is how:

The models are GGUF-quantized so they fit on local hardware. A 70B parameter model quantized to 4-bit runs on 16 GB RAM. No cloud GPU needed.

The vector store (HNSW) is built locally. Documents are chunked, embedded, and indexed on the same machine. The index is persisted to disk.

The entire 16-agent pipeline runs in Docker containers on the local machine. No external API calls. No telemetry. Nothing leaves the network.

Updates are delivered via secure transfer (encrypted USB or internal network), not over the internet. The client reviews and approves each update before it is deployed.

Why it matters: law firms handle attorney-client privileged documents. If that data leaves the premises, even to a cloud provider, the privilege could be waived. At HariKrushna, healthcare clients have HIPAA requirements, finance clients have data residency rules. 7 clients deployed this way.

For Amex: even though Amex likely runs on cloud infrastructure, understanding air-gapped deployment shows I know how to handle data sovereignty constraints. Financial regulators care about where data lives and who can access it. The same principles (data isolation, audit logging, no unauthorized external calls) apply whether you are on-prem or in a regulated cloud environment.

**What to emphasize:**
- You actually built and deployed this, not just read about it
- GGUF quantization makes it practical on small hardware
- The compliance reasoning (privilege, HIPAA, data residency)
- The principles transfer to regulated cloud environments

---

## Q5. How do you monitor and debug an AI agent in production when it gives a wrong answer?

**Your answer (from your experience):**

At Resso.ai, every agent interaction is logged end to end. When something goes wrong, I trace back through the logs step by step:

Step 1: Look at the routing decision. Did the router pick the right agent? If the user asked about topic A but the router sent it to the topic B agent, that is a routing error. Fix: adjust the routing classifier or add training examples for the misclassified intent.

Step 2: Look at the retrieval. Did the vector store return relevant context? If the agent gave a wrong answer but the retrieved documents were irrelevant, that is a retrieval error. Fix: check the embedding quality, chunk boundaries, or add a reranker.

Step 3: Look at the prompt. Was the prompt assembled correctly? Did the relevant context actually make it into the prompt? Sometimes a bug in the prompt template drops a variable.

Step 4: Look at the LLM output. If the routing was correct, retrieval was correct, prompt was correct, but the LLM still gave a wrong answer, that is a generation error. The model ignored the context or hallucinated. Fix: adjust the prompt to be more constrained, add few-shot examples, or fine-tune on similar examples.

Step 5: Look at schema validation. Did the output pass validation? If it did but was still wrong, the schema needs tighter constraints.

I also run the failing input against the evaluation set to check if it is a new failure (one-off) or a regression (something that used to work broke).

**What to emphasize:**
- Systematic debugging, not guessing
- Each failure mode has a different root cause and fix
- Full logging at every step enables this
- Evaluation set catches regressions

---

## Q6. How do you handle schema validation for LLM outputs in production?

**Your answer (from your experience):**

At HariKrushna, every LLM output that touches a downstream system goes through validation. Here is the flow:

Define the schema. I use Pydantic models in Python. For example, a dispute assessment might require: decision (enum: "approve" or "deny"), confidence (float between 0 and 1), reasoning (string, max 500 chars), cited_evidence (list of document_ids, at least one required).

Prompt the model. The system prompt includes the schema definition and instructs the model to output valid JSON matching the schema. I include one example of correct output.

Validate the output. Parse the LLM's response as JSON. Validate against the Pydantic model. Check types, required fields, value constraints.

Handle failures. If validation fails on the first try, retry with a more constrained prompt. This time, include the schema in the user message too, and add the error message so the model knows what went wrong. If it fails again after 2 retries, fall back to a safe default response (like "I could not process this request, routing to a human agent") and log the failure with the full context for debugging.

At HariKrushna, this was part of why hallucination dropped from 14% to 3.8%. Schema validation catches structurally wrong outputs before they reach users. Combined with fine-tuning (which reduces semantically wrong outputs) and RAG (which grounds the model in real data), you get a multi-layered defense.

**What to emphasize:**
- Schema validation is explicitly in the JD. This question is almost guaranteed.
- Pydantic for Python-based validation
- Retry with error context, not just blind retry
- Safe fallback when all retries fail
- Part of a multi-layered defense against hallucination
