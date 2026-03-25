"use client";
import { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  {
    label: "AI / ML",
    tools: ["PyTorch", "HuggingFace", "scikit-learn", "XGBoost", "ONNX", "MLflow", "Weights & Biases", "OpenAI API", "Anthropic API"],
  },
  {
    label: "Agent Frameworks",
    tools: ["LangGraph", "LangChain", "CrewAI", "AutoGen", "Semantic Kernel", "LlamaIndex"],
  },
  {
    label: "Memory & Vector",
    tools: ["pgvector", "Pinecone", "Chroma", "Weaviate", "Redis", "Qdrant"],
  },
  {
    label: "Backend",
    tools: ["FastAPI", "Node.js", "PostgreSQL", "GraphQL", "REST", "WebSockets", "Celery", "RabbitMQ"],
  },
  {
    label: "Frontend",
    tools: ["Next.js", "React", "TypeScript", "TailwindCSS", "WebRTC"],
  },
  {
    label: "Cloud & Infra",
    tools: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "CI/CD"],
  },
  {
    label: "Observability",
    tools: ["Langfuse", "OpenTelemetry", "Datadog", "Sentry", "Grafana"],
  },
];

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); ob.disconnect(); } },
      { threshold: 0 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={ref} className={`ts-wrap${visible ? " visible" : ""}`}>
      <style>{`
        .ts-wrap {
          background: #000;
          color: #f0f0f0;
          padding: 100px 24px 90px;
          font-family: 'Space Grotesk', sans-serif;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .ts-inner { max-width: 1100px; margin: 0 auto; }

        .ts-fade {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .ts-wrap.visible .ts-fade { opacity: 1; transform: none; }
        .ts-wrap.visible .ts-d1 { transition-delay: 0.05s; }
        .ts-wrap.visible .ts-d2 { transition-delay: 0.12s; }
        .ts-wrap.visible .ts-d3 { transition-delay: 0.20s; }

        .ts-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.22em;
          text-transform: uppercase; color: #39d9b4;
          margin-bottom: 14px;
        }
        .ts-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 800; line-height: 1.1;
          margin: 0 0 12px; color: #f0f0f0;
        }
        .ts-sub {
          font-size: 0.92rem; color: #606060;
          max-width: 480px; line-height: 1.7; margin: 0 0 56px;
        }

        .ts-grid {
          display: flex; flex-direction: column; gap: 28px;
        }
        .ts-row {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 20px;
          align-items: start;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ts-row:last-child { border-bottom: none; padding-bottom: 0; }
        @media (max-width: 640px) {
          .ts-row { grid-template-columns: 1fr; gap: 12px; }
        }

        .ts-cat {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(57,217,180,0.45);
          padding-top: 5px;
        }
        .ts-pills {
          display: flex; flex-wrap: wrap; gap: 7px;
        }
        .ts-pill {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.76rem; font-weight: 500;
          padding: 5px 12px; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(240,240,240,0.6);
          background: rgba(255,255,255,0.025);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: default;
        }
        .ts-pill:hover {
          border-color: rgba(57,217,180,0.4);
          color: #39d9b4;
          background: rgba(57,217,180,0.06);
        }
      `}</style>

      <div className="ts-inner">
        <p className="ts-eyebrow ts-fade ts-d1">Tools of the trade</p>
        <h2 className="ts-h2 ts-fade ts-d2">Full-stack from model weights to browser.</h2>
        <p className="ts-sub ts-fade ts-d2">Every layer of the stack, owned end-to-end.</p>

        <div className="ts-grid ts-fade ts-d3">
          {CATEGORIES.map(cat => (
            <div key={cat.label} className="ts-row">
              <span className="ts-cat">{cat.label}</span>
              <div className="ts-pills">
                {cat.tools.map(t => (
                  <span key={t} className="ts-pill">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
