import Nav              from "@/components/Nav";
import Hero             from "@/components/Hero";
import CapabilityStack  from "@/components/CapabilityStack";
import Work             from "@/components/Work";
import Process          from "@/components/Process";
import About            from "@/components/About";
import Contact          from "@/components/Contact";
import HashScroller     from "@/components/HashScroller";
import EngineeringAgent from "@/components/EngineeringAgent";

/* Trimmed to the important topics — leaner, minimal. */
export default function Engineering() {
  return (
    <>
      <HashScroller />   {/* scrolls to #hash after full page loads from another page */}
      <Nav />
      <Hero />           {/* id="hero"       ← Home           */}
      <CapabilityStack />{/* id="agents"     ← Capabilities   */}
      <Work />           {/* id="work"       ← Work           */}
                         {/* id="experience" ← Experience (inside Work) */}
      <Process />        {/* id="process"    ← Process        */}

      {/* engineering-specific deep agentic chatbot */}
      <section id="ai" style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "84px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#39d9b4", marginBottom: 14 }}>
            Ask my AI
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.4vw,36px)", letterSpacing: "-0.03em", color: "#f0f0f0", margin: "0 0 28px" }}>
            Put a problem to the agent
          </h2>
          <EngineeringAgent />
        </div>
      </section>

      <About />          {/* id="about"      ← About          */}
      <Contact />        {/* id="contact"    ← Contact        */}
    </>
  );
}
