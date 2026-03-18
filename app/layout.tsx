import type { Metadata } from "next";
import "./globals.css";
import FloatingNumbers from "@/components/FloatingNumbers";

export const metadata: Metadata = {
  title: "Omkumar Solanki - AI & ML Engineer",
  description:
    "AI/ML Engineer and consultant. I build production systems - real-time inference pipelines, autonomous agents, RAG architectures, and MLOps infrastructure.",
  keywords: [
    "AI Engineer", "ML Engineer", "Founding Engineer", "Resso.ai",
    "RAG Architecture", "MCP Server", "MLOps", "Agentic AI",
    "Omkumar Solanki", "Machine Learning Consultant",
  ],
  authors: [{ name: "Omkumar Solanki" }],
  openGraph: {
    title: "Omkumar Solanki - AI & ML Engineer",
    description: "Production AI systems. Real-time ML pipelines. Autonomous agents.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omkumar Solanki - AI & ML Engineer",
    description: "Production AI systems. Real-time ML pipelines. Autonomous agents.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Syne (display/hero - ultra-bold geometric) + Space Grotesk (UI) + JetBrains Mono + Inter + Instrument Serif */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" />
        <FloatingNumbers />
        <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
