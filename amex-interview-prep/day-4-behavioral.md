# Day 4: Behavioral and Cross-functional Questions

Focus: Leadership, Collaboration, Regulated Environments, Conflict, Growth Mindset

---

## Q1. Tell me about yourself and why you are interested in this role.

**Your answer (under 90 seconds):**

I am an AI engineer based in Toronto. Right now I do two things. At Resso.ai, I built the agent orchestration layer for a real-time AI conversation platform on Azure OpenAI. It routes conversations through multiple agents, handles context memory, and serves 200+ live sessions. At HariKrushna, I consult for enterprise clients in financial services, healthcare, and legal, deploying on-premise agent stacks where data cannot leave the network.

I have also built and shipped my own products. Lawline.tech runs 16 orchestrated AI agents for law firms, and I have built MCP servers that give agents a standard way to connect to external tools.

The Amex role is exciting for three reasons. First, scale. Amex processes billions of transactions and serves millions of customers. Building agents at that scale is a different engineering challenge than anything I can access at a startup. Second, the data. Real financial data with real compliance requirements is where AI gets hard and interesting. Third, the team. Amex is building a dedicated agentic AI group from the ground up, and I want to be part of that foundation.

**Practice tip:** Time yourself. If it goes over 90 seconds, cut the product details and keep just Resso + HariKrushna + why Amex.

---

## Q2. Tell me about a time you had to work with a team that disagreed on a technical approach.

**Your answer (STAR format):**

**Situation:** At Resso.ai, the product team wanted to store full conversation transcripts in PostgreSQL and query them directly to build the agent's context. Their reasoning was simplicity, everything in one database.

**Task:** I needed to convince them that this approach would not scale without being dismissive of their idea.

**Action:** Instead of arguing in a meeting, I ran a quick proof of concept. I took 20 real conversations and built two versions. Version A stuffed the full transcript into the prompt. Version B used a vector database to retrieve only the relevant past turns based on the current query.

**Result:** Version A hit the context window limit after 10 minutes and context retention was 72%. Version B maintained 98% retention with no context window issues. I showed the team the side-by-side results. The data made the decision easy. We shipped the vector approach and it is what runs in production today.

**What to emphasize:**
- You used data to resolve the disagreement, not authority
- You built a POC instead of just arguing
- You respected their idea and showed why yours was better

---

## Q3. Describe a time you had to learn something new quickly to deliver a project.

**Your answer (STAR format):**

**Situation:** When I started the Corol/NunaFab project, I had zero background in concrete science. The project required predicting compressive strength of concrete mixes, which involves understanding ACI standards, water-cement ratios, fly ash percentages, and curing behavior.

**Task:** Deliver a working prediction model that materials scientists would actually trust and use daily.

**Action:** I spent the first week reading papers alongside the materials scientists. Instead of pretending to understand the domain, I asked them to explain what each feature meant and why it mattered. I then ran a feature importance analysis to confirm which inputs actually predicted strength. This built trust because they saw their domain expertise reflected in the model.

**Result:** Trained a 150-estimator Random Forest (R2 = 0.73) on 2,200 samples. Deployed it as a REST API with a React dashboard. 12 research engineers used it daily. They trusted it because they understood it.

**What to emphasize:**
- You learned the domain, you did not just apply ML blindly
- You collaborated with domain experts
- This shows you can do the same at Amex (learn financial services quickly)

---

## Q4. How do you handle working in a regulated environment where you cannot move as fast as you want?

**Your answer (from your experience):**

At HariKrushna, every client in healthcare, legal, and finance had compliance requirements. The fintech client was the strictest. I could not just deploy a model update and iterate. Every change needed:

1. Evaluation on the 500-document held-out test set
2. Hallucination rate verified below 4%
3. Compliance team reviews the evaluation report
4. Written approval before deployment

My approach: I built the evaluation pipeline to automate steps 1 and 2. Push a button, the test runs, the report generates automatically. The compliance team gets a clean report they can review in hours instead of weeks. I did not fight the process. I made the process fast.

At Lawline.tech, law firms required air-gapped deployment. No shortcuts. No "we will add security later." The constraint was non-negotiable, so I designed for it from day one.

For Amex: I expect and respect compliance requirements. Financial regulators require explainability, audit trails, and controlled deployments. I would build the evaluation and compliance automation into the CI/CD pipeline so every deployment automatically generates the reports the compliance team needs.

**What to emphasize:**
- You respect compliance, you do not fight it
- You automate the slow parts so the overall pace stays reasonable
- You have done this for fintech, healthcare, and legal already

---

## Q5. Tell me about a time you mentored someone or helped a team member grow.

**Your answer (STAR format):**

**Situation:** At HariKrushna, I worked with 3 junior ML engineers across concurrent client engagements. One engineer was struggling with RAG pipeline debugging. When retrieval returned wrong results, they did not know where to start looking.

**Task:** Help them become independent at debugging RAG issues.

**Action:** I taught them a step-by-step debugging process: First, check the query embedding. Is it capturing the right semantics? Second, check retrieval results. Are the returned chunks relevant? If not, the issue is chunking or embedding quality. Third, check prompt construction. Did the relevant chunks actually make it into the prompt? Fourth, check the LLM output. Is it grounded in the context? We built a debugging checklist together and I sat with them through 3 real debugging sessions using the checklist.

**Result:** Within a month, that engineer was independently debugging RAG pipelines for their own clients without my involvement. They later told me the checklist was the most useful thing anyone had taught them.

**What to emphasize:**
- Structured teaching, not just "figure it out"
- You built a reusable artifact (the checklist)
- The result was independence, not dependence on you

---

## Q6. Why American Express? Why not stay at your current role or go to a startup?

**Your answer:**

Three specific reasons.

Scale. Amex serves millions of customers and processes billions of transactions. Building AI agents at that scale means dealing with latency requirements, data volumes, and reliability standards I cannot access at a startup. I want to solve problems where 99.9% uptime is not a stretch goal, it is a baseline.

The data. Amex sits on decades of financial transaction data. Building AI agents over real financial data with real compliance requirements is where this field gets genuinely hard. I have done regulated AI for fintech, healthcare, and legal clients, but always from the outside. Being inside Amex means working with the actual data and the actual constraints.

The team. Amex is building a dedicated agentic AI team. The JD describes building platforms, orchestration components, and evaluation tooling from the ground up. I want to be part of building that foundation, not joining after it is already built.

**What to emphasize:**
- Be specific to Amex. Not generic "great company" answers.
- Show you understand what makes Amex different (scale, data, regulated, building new team)

---

## Q7. Where do you see yourself in 2-3 years?

**Your answer:**

In year one, I want to ship production agentic features and learn the Amex engineering stack deeply. Understand how the data flows, how compliance works internally, how the team operates.

In year two, I want to start owning system design decisions. I am already doing architecture workshops and scoping AI roadmaps at HariKrushna for 10+ organizations. At Amex, I want to do that within a single team at much deeper scale.

In year three, I want to be mentoring newer engineers on the agentic AI team and helping shape the platform architecture. I care about building systems that run in production and serve real customers, not just prototypes.

**What to emphasize:**
- Tie your growth to Amex's growth
- Show you are ambitious but realistic
- Mention mentoring (shows leadership trajectory)

---

## Q8. Tell me about a project that failed or did not go as planned. What did you learn?

**Your answer (STAR format):**

**Situation:** Early in my freelance work, I built an XGBoost recommendation model for an e-commerce client. The model improved predicted conversion from 2.1% to 2.8% in offline evaluation.

**Task:** Deploy the model and demonstrate business impact.

**Action:** I deployed the model into production. The first two weeks, the client checked their dashboard daily and saw no clear uplift. The problem was not the model. The problem was that they did not have enough traffic for the improvement to be statistically significant in two weeks. They got frustrated and questioned the entire project.

**Result:** I learned to set expectations upfront. After that experience, every client engagement starts with an aligned evaluation plan: what metric we are tracking, how long it takes to reach statistical significance at their traffic volume, and what the monitoring dashboard will look like. The model did work, conversion settled at 2.8% after a month, adding roughly $180K annual revenue. But the client relationship was strained because I did not manage expectations.

**What to emphasize:**
- The failure is about communication, not technical incompetence
- You learned and changed your process
- Show self-awareness without self-destruction
