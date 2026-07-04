import type { Metadata } from "next";
import "./globals.css";
import FloatingNumbers from "@/components/FloatingNumbers";
import Agent from "@/components/Agent";
import Analytics from "@/components/Analytics";

export const metadata: Metadata = {
  title: "Omkumar Solanki — Applied AI Engineer · Agents & Orchestration",
  description:
    "Applied AI engineer and consultant. I design and ship AI agent systems — multi-agent orchestration, on-premise RAG, real-time inference — running in production.",
  keywords: [
    "Applied AI Engineer", "AI Agents", "Agent Orchestration", "Founding Engineer",
    "Resso.ai", "RAG Architecture", "MCP Server", "Agentic AI",
    "Omkumar Solanki", "AI Consultant",
  ],
  authors: [{ name: "Omkumar Solanki" }],
  openGraph: {
    title: "Omkumar Solanki — Applied AI Engineer",
    description: "AI agent systems shipped to production. Orchestration, memory, RAG, real-time inference.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omkumar Solanki — Applied AI Engineer",
    description: "AI agent systems shipped to production. Orchestration, memory, RAG, real-time inference.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fraunces (display serif) + Inter (body) + Geist Mono (eyebrows) — monochrome system.
            Syne / Space Grotesk / JetBrains Mono / Instrument Serif kept for legacy pages (/resume /leads /admin). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,300..700;1,14..32,300&family=Geist+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" />
        <FloatingNumbers />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
        <Agent />
        <Analytics />
      </body>
    </html>
  );
}
