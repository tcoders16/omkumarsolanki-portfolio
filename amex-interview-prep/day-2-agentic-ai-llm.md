# Day 2: Agentic AI and LLM Deep Dive

Focus: Agent Workflows, Tool Use, Prompt Engineering, LLM Integration, Schema Validation

---

## Q1. What is an agentic AI system and how is it different from a simple LLM chatbot?

**Your answer (from your experience):**

A chatbot takes input and returns output. One step. An agent plans, reasons, uses tools, and takes actions across multiple steps.

At Resso.ai, the system does not just generate text. When a user speaks, the agent decides which sub-agent to route to. If the user needs memory from earlier, it calls the vector database to retrieve session history, injects the relevant turns into the prompt, and generates a contextual response. If the user interrupts, the barge-in agent takes over and handles the transition. If the topic changes, the topic-switch agent loads the new topic's history. Each of these is a decision the agent makes, not something hardcoded.

At Lawline.tech, 16 agents work in a pipeline. The first agent ingests documents. The next extracts facts. The third reasons over them. The fourth generates a chronology with source links. The fifth verifies everything. Each agent's output becomes the next agent's input. The pipeline plans what to do, uses tools (document parser, vector store, LLM), takes actions (extract, reason, generate), and verifies its own work.

That is agentic: planning, tool use, multi-step reasoning, and self-verification.

**What to emphasize:**
- Planning and reasoning, not just generation
- Tool calling (vector DB, APIs, databases)
- Multi-step workflows where each step depends on the previous
- Self-verification (the Verify agent in Lawline)

**Follow-up they might ask:** What levels of autonomy have you implemented?
**Your answer:** At Resso.ai, the agents are fully autonomous within a session. No human in the loop during a conversation. At HariKrushna, for the fintech client, the output goes through schema validation and if the confidence is below a threshold, it routes to a human reviewer. The level of autonomy depends on the stakes. For customer-facing financial decisions at Amex, I would start with human-in-the-loop and gradually increase autonomy as the evaluation metrics prove reliability.

---

## Q2. How do you implement tool calling in an LLM-based agent? Walk me through the flow.

**Your answer (from your experience):**

Here is exactly how it works in my MCP servers:

Step 1: The LLM receives a system prompt that lists available tools. Each tool has a name, description, and parameter schema. For example: name is "query_database", description is "search the client database by customer ID", parameters are customer_id (string, required) and fields (array of strings, optional).

Step 2: The LLM processes the user's request and decides it needs to use a tool. It outputs a structured JSON tool_call with the tool name and parameters.

Step 3: My orchestration layer intercepts this. Before executing anything, it validates the parameters against the JSON schema. If the LLM hallucinated a parameter that does not exist, or sent the wrong type, the validation catches it here. This is critical in financial services where a malformed query could return wrong data.

Step 4: If validation passes, the MCP server routes the call to the right adapter. Slack goes through REST. Database goes through gRPC. CRM goes through REST.

Step 5: The tool executes and returns a result.

Step 6: The result goes back to the LLM as a tool_response message. The LLM uses this result to continue reasoning or generate a final answer.

Step 7: If the tool call failed (timeout, auth error, invalid response), the orchestration layer returns a structured error to the LLM so it can decide to retry, use a fallback tool, or tell the user it could not complete the request.

**What to emphasize:**
- Schema validation BEFORE execution (the JD mentions this explicitly)
- Structured error handling so the LLM can adapt
- The orchestration layer sits between the LLM and the tools
- You built this in production for 5 enterprise deployments

**Follow-up they might ask:** How do you prevent the LLM from calling tools it should not have access to?
**Your answer:** RBAC at the tool level. Each agent persona has a list of permitted tools. The orchestration layer checks permissions before executing any tool call. At Resso.ai, different AI personas have different tool access. A coaching persona can access the session memory but not the admin database. This maps directly to Amex where a customer-facing agent should not have access to internal compliance tools.

---

## Q3. How do you handle LLM hallucination in a financial services context where accuracy is critical?

**Your answer (from your experience):**

I attacked this at HariKrushna for a fintech client. Off-the-shelf LLMs hallucinated on domain-specific terminology at a 14% rate. Here is what I did:

Layer 1: Fine-tuning. LoRA/QLoRA on the client's domain data so the model learns the correct terminology. Not the entire model, just small adapter weights that are fast to train and can be swapped per client.

Layer 2: Retrieval grounding. RAG forces the model to answer from retrieved documents, not from its training data. If the retrieved context does not contain the answer, the model is instructed to say it does not know rather than making something up.

Layer 3: Schema validation on outputs. Every structured response gets checked against a JSON schema before it reaches the user. If the LLM outputs a field that should be a dollar amount but gives a string, the validation catches it.

Layer 4: Held-out evaluation. I maintained a 500-document test set that the model never saw during training. After every update, I run the model against this set and measure hallucination rate. If the rate goes above the threshold, the update does not deploy.

Result: hallucination dropped from 14% to 3.8%.

For Amex, I would add: human-in-the-loop for high-stakes decisions (fraud alerts, credit limit changes), confidence scoring on every output so low-confidence responses get routed to a human, and source citations on every claim so the reviewer can verify quickly.

**What to emphasize:**
- Multiple layers, not just one fix
- Evaluation is continuous, not one-time
- You have real numbers: 14% to 3.8%
- Financial services needs extra layers (human-in-the-loop, confidence scoring)

**Follow-up they might ask:** How do you measure hallucination?
**Your answer:** Compare the model's output against ground truth on the held-out set. For factual claims, check if the claim is supported by the retrieved documents. For structured outputs, check if every field matches the expected value. I categorize failures: factual hallucination (made up a fact), structural hallucination (wrong format), and referential hallucination (cited a source that does not exist).

---

## Q4. Explain how you would design a multi-agent workflow for processing a credit card dispute.

**Your answer (map Lawline.tech pipeline to Amex):**

I built a 5-stage pipeline at Lawline.tech for legal documents. The same pattern applies to credit card disputes:

**Stage 1 - Ingest Agent:** Receives the dispute claim. Extracts text from uploaded documents (receipt photo, email correspondence, bank statement screenshot). Normalizes everything into structured text with metadata (document type, date, source).

**Stage 2 - Extract Agent:** Pulls out key facts: transaction date, merchant name, amount, cardholder's claim ("I did not authorize this"), any supporting evidence. Outputs a structured JSON with every fact and its source document.

**Stage 3 - Reason Agent:** Cross-references the extracted facts against transaction records (did this transaction actually happen?), merchant history (has this merchant had other disputes?), and Amex's dispute policy rules (is this claim type eligible for a chargeback?). Outputs a reasoning chain showing how it reached its conclusion.

**Stage 4 - Generate Agent:** Produces a structured decision recommendation. Either "approve refund" or "deny with explanation." Includes evidence citations for every claim. The output follows a strict schema: decision, confidence_score, reasoning, cited_evidence, recommended_action.

**Stage 5 - Verify Agent:** Reviews the entire chain. Checks that every claim in the recommendation is grounded in the extracted evidence. If the Generate agent said "the transaction was unauthorized" but the Extract agent found a signed receipt, the Verify agent flags the contradiction. Ungrounded claims get removed or flagged for human review.

Inter-agent communication uses structured JSON, not free text. Each agent gets clean, validated input from the previous stage.

**What to emphasize:**
- The 5-stage pattern is proven (12,000+ files at Lawline)
- Each stage has a clear input/output contract
- Verification at the end catches errors
- Schema validation between stages
- Human review for flagged cases

---

## Q5. How do you manage context windows when conversations get long? Your resume mentions context retention going from 72% to 98%.

**Your answer (from your experience):**

At Resso.ai, after 10 minutes of conversation the context window filled up and the agent started repeating itself or going off-topic. The retention metric measured whether the agent correctly referenced information from earlier in the conversation. It was at 72%.

The fix was not to stuff the entire conversation into the prompt. Instead:

Every conversation turn gets stored in a vector database as an embedding. When the agent needs to generate a response, it does not get the full transcript. Instead, event-driven triggers decide which past turns are relevant right now:

Silence timeout: the user paused for a long time. Inject a recap of where the conversation was so the agent can smoothly resume.

Barge-in: the user interrupted mid-sentence. Inject the interrupted topic so the agent knows what it was talking about and can either finish or transition.

Topic-switch: the user changed subjects. Inject the history for the new topic from earlier in the conversation, not the entire conversation.

The agent prompt gets: system instructions + selected relevant past turns + the current user message. Focused and relevant instead of bloated.

Result: retention rose from 72% to 98% across 500+ sessions.

**What to emphasize:**
- Selective retrieval, not full-context stuffing
- Event-driven triggers (not random retrieval)
- Vector database for conversation memory
- Clear before/after metrics

**Follow-up they might ask:** How do you decide what is relevant?
**Your answer:** Cosine similarity between the current query embedding and stored turn embeddings. Plus the event-driven triggers that override pure similarity when the conversation state changes (barge-in, topic-switch, silence). It is a hybrid of semantic similarity and conversation state awareness.

---

## Q6. What is your approach to prompt engineering for production systems versus prototyping?

**Your answer (from your experience):**

For prototyping I iterate fast with natural language prompts in a notebook. Change the prompt, run it, look at the output, repeat.

For production at Resso.ai, prompts are engineering artifacts, not experiments:

Versioned: every prompt has a version number. When I update a prompt, the old version stays available for rollback. Stored in the codebase alongside the application code.

Templated: each of the 30+ AI personas has a system prompt template with variables. The template takes session_context, persona_instructions, and user_history. The rendering function fills in these variables at runtime. This means changing one variable (like adding a new persona instruction) does not require rewriting the entire prompt.

Tested: before a prompt change deploys, I run it against an evaluation set and compare the metrics (accuracy, latency, retention) to the current production prompt. If the new prompt regresses on any metric, it does not ship.

Monitored: the evaluation dashboards track prompt performance continuously. If a prompt starts performing worse over time (model drift, changing user behavior), I catch it.

At HariKrushna, schema validation adds another layer. The prompt instructs the LLM to output JSON matching a specific schema. If the output fails validation, the system retries with a more constrained prompt that includes the schema explicitly. If it fails again, fall back to a safe default response and log the failure.

**What to emphasize:**
- Versioning, templating, testing, monitoring (not just "write a good prompt")
- You manage 30+ personas, each with their own prompt
- Schema validation as a guardrail
- Evaluation before deployment

**Follow-up they might ask:** How do you handle prompt injection attacks?
**Your answer:** Input sanitization strips known injection patterns. The system prompt is separated from user input with clear delimiters. Output validation catches unexpected behaviors. For Amex, you would also limit the tools available to each agent so even if a prompt injection succeeds, the damage is bounded by RBAC.
