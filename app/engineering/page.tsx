import type { Metadata } from "next";
import EngineeringMono from "@/components/EngineeringMono";
import HashScroller from "@/components/HashScroller";

const URL = "https://omkumarsolanki.com/engineering";

export const metadata: Metadata = {
  title: "Omkumar Solanki — Applied AI Engineer · Agents & Orchestration",
  description:
    "Applied AI engineer. I design and ship AI agent systems — multi-agent orchestration, on-premise RAG, real-time inference — end-to-end, running in production.",
  keywords: [
    "Applied AI engineer",
    "AI agents",
    "multi-agent orchestration",
    "MCP server",
    "RAG architecture",
    "founding engineer",
    "agentic AI",
    "Omkumar Solanki",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Omkumar Solanki — Applied AI Engineer",
    description:
      "AI agent systems shipped to production: orchestration, memory, RAG, real-time inference.",
    url: URL,
    type: "website",
  },
};

export default function Engineering() {
  return (
    <>
      <HashScroller />
      <EngineeringMono />
    </>
  );
}
