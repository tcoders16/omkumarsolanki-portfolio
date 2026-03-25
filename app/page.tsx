import Nav              from "@/components/Nav";
import Hero             from "@/components/Hero";
import Work             from "@/components/Work";
import CapabilityStack  from "@/components/CapabilityStack";
import TechStack        from "@/components/TechStack";
import Process          from "@/components/Process";
import Agentic          from "@/components/Agentic";
import MathShowcase     from "@/components/MathShowcase";
import Story            from "@/components/Story";
import Terminal         from "@/components/Terminal";
import About            from "@/components/About";
import Rates            from "@/components/Rates";
import Contact          from "@/components/Contact";
import BusinessChat     from "@/components/BusinessChat";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <CapabilityStack />
      <TechStack />
      <Work />
      <Process />
      <Agentic />
      <MathShowcase />
      <Story />
      <Terminal />
      <About />
      <Rates />
      <Contact />
      <BusinessChat />
    </>
  );
}
