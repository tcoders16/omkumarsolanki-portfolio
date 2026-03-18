# Day 5: Full Mock Interview and Weak Spot Drills

Focus: End-to-End Simulation, Rapid Fire Definitions, Weak Spots to Study

---

## Mock Interview (45 minutes, speak out loud)

Run through these in order. Time yourself. Pretend you are on the call.

### Round 1: Intro (2 min)
"Tell me about yourself."
Use Day 4 Q1 answer. Under 90 seconds.

### Round 2: System Design (10 min)
"Design an agentic system that detects and resolves credit card fraud in real-time."

Your answer: Combine Resso (routing) + Lawline (pipeline) + Freelance (Kafka).

Kafka ingests transaction events in real-time, partitioned by card type. A routing agent classifies each transaction as low/medium/high risk using a lightweight model. Low risk passes through. Medium risk gets flagged for batch review. High risk goes to a fraud investigation agent immediately.

The investigation agent retrieves the cardholder's transaction history from a vector store, cross-references with merchant data and known fraud patterns, and generates a risk assessment with evidence citations.

A verification agent checks the assessment. If confirmed fraud: block the card, notify the cardholder, create a case in the fraud management system. If uncertain: route to a human fraud analyst with the pre-built assessment to speed their review.

Everything is logged: the transaction, the routing decision, the retrieved data, the agent's reasoning, the final action, and the latency. Compliance team can audit any decision end to end.

Mention: sub-second latency target for the routing decision. Schema validation on the risk assessment output. Human fallback for uncertain cases. Evaluation metrics: false positive rate, false negative rate, mean time to detection.

### Round 3: Technical Deep Dive (10 min)
"Walk me through how you built the context memory system at Resso.ai. How does the vector database session memory work?"

Use Day 2 Q5 answer. Go deep on the event-driven triggers (silence timeout, barge-in, topic-switch), the embedding storage, the selective retrieval, and the 72% to 98% metric.

They will follow up with: "What happens when two events fire at the same time?" Your answer: priority ordering. Barge-in takes highest priority because the user is actively interrupting. Topic-switch is second. Silence timeout is lowest. Only one trigger fires per turn.

### Round 4: Code/Problem Solving (8 min)
"Write a function that validates an LLM tool call output against a schema and handles failures."

Think out loud. Something like:

```python
from pydantic import BaseModel, ValidationError
from typing import Optional
import json

class ToolCallResult(BaseModel):
    status: str  # "success" or "error"
    tool_name: str
    data: Optional[dict] = None
    error: Optional[str] = None

def validate_tool_output(raw_output: str, max_retries: int = 2) -> dict:
    for attempt in range(max_retries + 1):
        try:
            parsed = json.loads(raw_output)
            result = ToolCallResult(**parsed)
            return result.dict()
        except (json.JSONDecodeError, ValidationError) as e:
            if attempt < max_retries:
                # In production: retry with constrained prompt
                # including the error message and schema
                continue
            else:
                # Fallback: safe default
                return {
                    "status": "error",
                    "tool_name": "unknown",
                    "error": f"Validation failed after {max_retries} retries: {str(e)}"
                }
```

Explain: Pydantic validates types and required fields. Retry with error context. Safe fallback after retries. In production, the retry would re-prompt the LLM with the schema and the error message.

### Round 5: Behavioral (5 min)
"Tell me about a time you worked in a regulated environment."
Use Day 4 Q4 answer. Fintech client at HariKrushna. Evaluation pipeline. Compliance automation.

### Round 6: Your Questions (5 min)
Ask 3-4 of these:
1. What does the current agent orchestration stack look like and what are the biggest technical challenges right now?
2. How does the team handle evaluation and testing for agentic systems? Is there a dedicated evaluation framework or is that being built?
3. How much autonomy do the AI agents currently have? Is it mostly human-in-the-loop or are some workflows fully autonomous?
4. What does a typical sprint cycle look like for the agentic AI team?
5. What does success look like for someone in this role in the first 6 months?

---

## Rapid Fire Definitions (30 seconds each, practice out loud)

**What is RAG?**
Retrieval-Augmented Generation. Retrieve relevant documents from a vector store and inject them into the LLM prompt so it answers from your data, not just its training data. I built RAG at HariKrushna for 7 clients and at Vadtal for 50,000+ records.

**What is HNSW?**
Hierarchical Navigable Small World. A graph-based algorithm for approximate nearest neighbor search in high-dimensional space. Fast and memory-efficient. I used it at HariKrushna, Vadtal, and Lawline.tech.

**What is GGUF quantization?**
A file format for running large language models in reduced precision (4-bit, 8-bit) so they fit on smaller hardware. I deployed GGUF-quantized models on 16 GB machines at HariKrushna and Lawline. Tradeoff: slight accuracy loss for massive memory savings.

**What is LoRA fine-tuning?**
Low-Rank Adaptation. Train small adapter matrices on top of frozen model weights instead of retraining the whole model. Faster, cheaper, and you can swap adapters per client. I used LoRA/QLoRA at HariKrushna, cut hallucination from 14% to 3.8%.

**What is MCP (Model Context Protocol)?**
A standard protocol for AI agents to connect to external tools (Slack, CRM, databases) through one interface instead of custom code per tool. I built production MCP servers at HariKrushna deployed across 5 enterprise clients.

**What is schema validation in AI?**
Checking that LLM outputs match an expected structure (JSON Schema or Pydantic model) before they reach downstream systems. Catches hallucinated fields, wrong types, and malformed responses. Critical in financial services.

**What is semantic chunking?**
Splitting documents at meaning boundaries instead of fixed character counts. A paragraph about interest rates stays together instead of getting split mid-sentence. Better retrieval quality because each chunk is a coherent unit.

**What is two-phase VAD?**
Voice Activity Detection in two stages. First phase detects if someone is speaking (binary: speech or silence). Second phase classifies the type of speech event (barge-in, pause, topic switch). I designed this at Resso.ai for the real-time conversation engine.

**Explain event-driven architecture.**
Components communicate through events (messages) rather than direct API calls. A producer publishes events to a topic (Kafka). Consumers subscribe and process independently. Decoupled, scalable, fault-tolerant. I used Kafka and Lambda for the healthcare pipeline.

**REST vs gRPC?**
REST uses JSON over HTTP/1.1. Human readable, widely supported, good for external APIs. gRPC uses protobuf over HTTP/2. Binary, faster, strict schema enforcement, bidirectional streaming. I use REST for external integrations and gRPC for internal agent-to-agent communication.

---

## Weak Spots to Study (spend extra time here)

### 1. AWS vs Azure
Your resume is Azure-heavy (Resso.ai). Amex JD says AWS and/or GCP, Kubernetes. Study:
- SageMaker: managed ML training and deployment. Know endpoints, batch transform, model registry.
- Bedrock: managed LLM access. Compare to Azure OpenAI. Know how to call models, set up RAG with Knowledge Bases.
- Step Functions: serverless orchestration. State machines for multi-step workflows. Compare to building your own orchestration.
- Be ready to say: "My production agent experience is on Azure OpenAI, but the patterns transfer directly. SageMaker is like Azure ML, Bedrock is like Azure OpenAI, Step Functions maps to the orchestration layer I built manually."

### 2. Kubernetes deep dive
You list Kubernetes but your bullets do not go deep. Study:
- HPA (Horizontal Pod Autoscaler): auto-scale pods based on CPU/memory/custom metrics.
- Resource requests vs limits: requests guarantee minimum resources, limits cap maximum. Critical for ML workloads that spike during inference.
- Liveness vs readiness probes: liveness restarts crashed containers, readiness stops sending traffic until the model is loaded.
- Rolling updates: how to deploy without downtime. MaxSurge and MaxUnavailable settings.

### 3. AI-assisted development tools
The JD specifically mentions "AI-assisted and agentic development tools for design, implementation, testing, debugging, and refactoring." Be ready to talk about:
- How you use GitHub Copilot or Claude in your daily coding workflow.
- Using AI for code review, test generation, and debugging.
- Responsible use: you always review AI-generated code, run tests, and do not blindly trust suggestions.
- If they ask, describe how you used Claude or similar tools to accelerate development at Resso or HariKrushna.

### 4. Open source contributions
Preferred qualifications mention open-source contributions. If you have any (even small PRs), prepare to talk about them. If not, pivot to: "My products (Lawline, Vadtal, MCP servers) are production systems I architected and built from scratch. While they are not open source, they demonstrate the same engineering depth: designing APIs, writing documentation, handling edge cases, and shipping reliable software."

### 5. GCP experience
The JD says AWS and/or GCP. If you have GCP exposure, mention it. If not, say: "My cloud experience is primarily AWS and Azure. GCP concepts map closely: Vertex AI is like SageMaker, GKE is like EKS, BigQuery is like Redshift. The cloud-agnostic patterns I use (containerization, Kubernetes, CI/CD) transfer directly."

---

## Final Checklist: Night Before the Interview

1. Re-read all 5 day files once more.
2. Practice "Tell me about yourself" out loud 3 times. Under 90 seconds.
3. Know your numbers cold:
   - sub-800ms latency
   - 72% to 98% context retention
   - 14% to 3.8% hallucination
   - 42 seconds per 800-page file
   - 12,000+ files processed
   - 200+ live sessions
   - 7 enterprise clients
   - 16 agents in the pipeline
   - 5-stage pipeline (Ingest, Extract, Reason, Generate, Verify)
   - 4 weeks to 3 days integration time
   - 500+ sessions evaluated
   - 500-document eval set
   - 30+ AI personas
   - 50,000+ donor records
   - 120 hours monthly freed
   - $180K annual revenue added
4. Prepare 3-4 questions to ask the interviewer.
5. Have your resume open on a second screen.
6. Test camera, microphone, and internet if video call.
7. Dress one level above what you think is needed.
8. Sleep well.

You have built real agent systems, shipped real products, and served real users. Most candidates at the AI Engineer I level cannot say that. Walk in knowing that.
