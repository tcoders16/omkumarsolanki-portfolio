import type { Metadata } from "next";
import PolymathConsulting from "@/components/PolymathConsulting";

const URL = "https://omkumarsolanki.com/consulting";

export const metadata: Metadata = {
  title: "Polymath Consultancy Group — The intelligence layer for your business",
  description:
    "Polymath designs and deploys AI agents that remove friction from how your business actually works — so your people spend time on decisions, not busywork. One consultancy, every industry.",
  keywords: [
    "AI consultancy",
    "AI agents",
    "workflow automation",
    "friction audit",
    "custom ML systems",
    "AI strategy",
    "agent deployment",
    "Polymath Consultancy Group",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Polymath Consultancy Group — The intelligence layer for your business",
    description:
      "AI agents that remove friction from how your business actually works. One consultancy, every industry.",
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Polymath Consultancy Group",
    description:
      "The intelligence layer for your business. AI agents that remove operational friction — one consultancy, every industry.",
  },
};

/* JSON-LD — ProfessionalService + Person, for rich results & E-E-A-T */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${URL}#service`,
      name: "Polymath Consultancy Group",
      url: URL,
      slogan: "The intelligence layer for your business.",
      description:
        "Polymath designs and deploys AI agents that remove friction from how businesses actually work — workflow audits, autonomous agents, custom ML systems, and AI strategy for leadership.",
      areaServed: "Worldwide",
      serviceType: [
        "AI agent deployment",
        "Workflow & friction audits",
        "Custom ML & prediction systems",
        "AI strategy for leadership",
      ],
      address: {
        "@type": "PostalAddress",
        addressRegion: "Ontario",
        addressCountry: "CA",
      },
      founder: { "@id": `${URL}#person` },
      provider: { "@id": `${URL}#person` },
    },
    {
      "@type": "Person",
      "@id": `${URL}#person`,
      name: "Omkumar Solanki",
      jobTitle: "Founder & Principal, Polymath Consultancy Group",
      email: "mailto:hello@omkumarsolanki.com",
      url: "https://omkumarsolanki.com",
      knowsAbout: [
        "AI agents",
        "Machine learning",
        "MLOps",
        "RAG",
        "Cloud architecture",
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
      <PolymathConsulting />
    </>
  );
}
