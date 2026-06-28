import type { Metadata } from "next";
import ConsultingLight from "@/components/ConsultingLight";

const URL = "https://omkumarsolanki.com/consulting";

export const metadata: Metadata = {
  title: "AI Agents That Do Real Work — Om Solanki",
  description:
    "I help AI startups take agents from demo to production: agents that do real tasks, multi-step workflows that recover, and memory that persists. Tell me where your agent breaks.",
  keywords: [
    "AI agent consultant",
    "agent memory",
    "agent workflows",
    "multi-agent orchestration",
    "AI agent architecture",
    "agent reliability",
    "LLM agents production",
    "startup AI agents",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "AI Agents That Do Real Work — Om Solanki",
    description:
      "Agents that do real tasks, workflows that recover, and memory that persists. I help startups take agents from demo to production.",
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents That Do Real Work — Om Solanki",
    description:
      "Real tasks, multi-step workflows, and memory that persists — agents from demo to production.",
  },
};

/* JSON-LD — ProfessionalService + Person, for rich results & E-E-A-T */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${URL}#service`,
      name: "AI Agent Architecture for Startups",
      url: URL,
      description:
        "I help AI startups take agents from demo to production — agents that do real tasks, multi-step workflows that recover, and memory that persists.",
      areaServed: "Worldwide",
      serviceType: [
        "AI agent architecture",
        "Agent memory design",
        "Multi-agent workflow orchestration",
        "Agent reliability & evaluation",
      ],
      provider: { "@id": `${URL}#person` },
    },
    {
      "@type": "Person",
      "@id": `${URL}#person`,
      name: "Om Kumar Solanki",
      jobTitle: "Senior AI / ML & Agent Engineer",
      email: "mailto:om@resso.ai",
      url: "https://omkumarsolanki.com",
      knowsAbout: [
        "AI agents",
        "Agent reliability",
        "LLM evaluation",
        "RAG",
        "MLOps",
        "AWS Bedrock",
        "Production AI",
      ],
    },
  ],
};

export default function ConsultingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConsultingLight />
    </>
  );
}
