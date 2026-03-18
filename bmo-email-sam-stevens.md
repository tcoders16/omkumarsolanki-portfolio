To: sfrederickst@teksystems.ca
Subject: AI Engineering Technical Lead, BMO Applied AI / Omkumar Solanki

Hi Sam,

Thanks for reaching out. The BMO role matches what I do today. Here is a quick overview.

At Resso.ai, I built the full agent orchestration layer on Azure OpenAI from scratch. The platform runs real-time AI avatar interviews where each user message gets routed to the right agent, whether it needs context from earlier, handles an interruption, or picks up a new topic. I designed the routing logic, a two-phase voice detection pipeline, and a vector database for session memory so agents remember what was said 20 minutes ago. It runs under 800ms end to end with 200+ live sessions and evaluation dashboards tracking accuracy and retention.

Through HariKrushna Software, I deployed on-premise agent stacks for 7 clients in financial services, healthcare, and legal where data cannot leave the network. Quantised models, vector stores, and semantic chunking all run locally on 16 GB machines. I also built MCP servers that give agents a single protocol to talk to Slack, CRMs, and databases instead of custom code per tool. Integration time dropped from 4 weeks to 3 days. For a fintech client, I fine-tuned their model with LoRA and schema validation, cutting hallucination from 14% to 3.8%.

I also ship my own products. Lawline.tech runs 16 agents in a pipeline that ingests legal documents, extracts facts, reasons over them, generates source-linked chronologies, and verifies the output. It handles 800-page case files in 42 seconds across 6 practice areas, fully air-gapped on-prem.

Stack: Python, Go, TypeScript, Azure OpenAI, AWS (Lambda, S3, SageMaker), LangChain, LangGraph, React, Next.js, Node.js, Express, FastAPI, Prisma, Docker, Kubernetes, Kafka, gRPC, REST, PostgreSQL, Redis, WebSockets, GitHub Actions CI/CD.

Based in Toronto, 2-3 days a week in office works perfectly. Let me know when you are free.

Best,
Omkumar Solanki
emailtosolankiom@gmail.com
omkumarsolanki.com | lawline.tech
linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2
