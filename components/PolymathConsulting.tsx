"use client";

/**
 * Polymath Consultancy Group — single-page marketing site.
 * Recreated pixel-faithfully from design_handoff_polymath_website.
 *
 * Design rules (from the handoff — do not drift):
 * - Exactly five colors: Carbon #0A0A0C, Graphite #26262E, Steel #6E6E78,
 *   Fog #E9E9E5, Porcelain #FAFAF8. No accents, gradients, or shadows.
 * - Inter (400/500) + Geist Mono for eyebrows/annotations. Sentence case.
 * - Card grids are 1px hairline gaps; cards have no radius, no shadow.
 * - Only motion: hero mark rotation (once, on load) and the FAQ "+" rotate.
 */
import { useState } from "react";
import PolymathMark from "@/components/PolymathMark";
import PolymathAgent from "@/components/PolymathAgent";

/* Config — real data slots (the design keeps these parameterized) */
const HEADLINE = "The intelligence layer for your business."; // approved alternates: "Many industries. One intelligence." · "We make complex businesses run frictionlessly." · "Your operations, minus the friction."
const BOOK_HREF = "/book";
const CONTACT_EMAIL = "emailtosolankiom@gmail.com";
const FOUNDER_NAME = "Omkumar Solanki";
const LINKEDIN_URL = "https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/";

const WHAT_WE_DO = [
  {
    n: "01",
    t: "AI agents that work your workflows",
    b: "Autonomous agents that handle the repetitive middle of your operations — triaging requests, drafting documents, reconciling data, chasing follow-ups — with human approval exactly where it matters.",
  },
  {
    n: "02",
    t: "Workflow & friction audits",
    b: "A structured two-week diagnosis of where your business bleeds time and money. You get a ranked map of every friction point, what fixing it is worth, and what it takes. Useful even if you never hire us again.",
  },
  {
    n: "03",
    t: "Custom ML & prediction systems",
    b: "When off-the-shelf isn't enough: demand forecasting, risk scoring, quality prediction, and decision-support models built on your data, deployed on your cloud, owned by you.",
  },
  {
    n: "04",
    t: "AI strategy for leadership",
    b: "Board-level clarity on what AI can and cannot do for your specific business — roadmaps, build-vs-buy decisions, vendor evaluation, and governance. No jargon, no theatre.",
  },
];

const INDUSTRIES = [
  {
    t: "Manufacturing & industrial",
    b: "Production monitoring, predictive maintenance, and quality-inspection agents that turn machine data into decisions on the floor.",
  },
  {
    t: "Professional services",
    b: "Document drafting, research, and client-intake agents that give partners and consultants their billable hours back.",
  },
  {
    t: "Education & training",
    b: "Assessment, feedback, and preparation systems that scale personal attention — built with the safeguards institutions require.",
  },
  {
    t: "Retail & e-commerce",
    b: "Demand forecasting, catalog operations, and customer-service agents that keep margins intact as you grow.",
  },
  {
    t: "Healthcare & clinics",
    b: "Intake, scheduling, and documentation automation designed around privacy and compliance from day one.",
  },
  {
    t: "Finance & real estate",
    b: "Underwriting support, portfolio monitoring, and reporting agents for teams where accuracy is non-negotiable.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Diagnose",
    b: "We embed with your team for two weeks and map where time, money, and attention actually go. You see the friction ranked by cost before we propose anything.",
  },
  {
    n: "02",
    t: "Design",
    b: "We architect the intelligence layer: which agents, which models, where humans stay in the loop, and what it runs on. You approve the blueprint, not a mystery.",
  },
  {
    n: "03",
    t: "Deploy",
    b: "We build and ship in weeks, not quarters — on your cloud, integrated with the systems you already use. Nothing is thrown away; everything is connected.",
  },
  {
    n: "04",
    t: "Operate",
    b: "We monitor, measure, and improve. Every engagement ends with your team trained and a dashboard that proves the value in hours saved and errors removed.",
  },
];

const FAQS = [
  {
    q: 'Do we need to already "use AI" to work with you?',
    a: "No. Most clients come to us with a friction problem, not an AI plan. The diagnosis phase exists precisely to figure out where — and whether — AI belongs in your business.",
  },
  {
    q: "Who owns what you build?",
    a: "You do. Systems are deployed on your cloud accounts, code and models are handed over, and your team is trained to run them.",
  },
  {
    q: "How do you handle our data?",
    a: "Everything is built inside your environment with your access controls. Where required, we design fully private deployments that never send data to third-party services.",
  },
  {
    q: "What does an engagement cost?",
    a: "Friction audits are fixed-price. Build engagements are scoped after diagnosis, so you're never quoted for a mystery. Ask us for the current rate card.",
  },
  {
    q: "What if it doesn't work?",
    a: "Every build ships with success metrics defined before we start. If the numbers aren't there, we keep working until they are — that's in the agreement, not just on the website.",
  },
];

const CASE_STUDIES = [
  {
    name: "[Client / industry name]",
    friction: "[One sentence describing the broken process.]",
    layer: "[One sentence describing what we built.]",
    result: "[One metric.]",
  },
  {
    name: "[Client / industry name]",
    friction: "[One sentence describing the broken process.]",
    layer: "[One sentence describing what we built.]",
    result: "[One metric.]",
  },
];

export default function PolymathConsulting() {
  const [faq, setFaq] = useState<number>(-1);

  return (
    <div className="pm" id="top">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .pm { font-family:'Inter','Helvetica Neue',sans-serif; font-optical-sizing:auto;
          color:#0A0A0C; background:#FAFAF8; -webkit-font-smoothing:antialiased;
          text-rendering:optimizeLegibility; }
        .pm *, .pm *::before, .pm *::after { box-sizing:border-box; }
        .pm a { text-decoration:none; }
        .pm ::selection { background:#26262E; color:#FAFAF8; }
        .pm-w { max-width:1100px; margin:0 auto; padding:0 32px; }
        .pm h1, .pm h2 { text-wrap:balance; }
        .pm p { text-wrap:pretty; }

        .pm-eyebrow { font-family:'Geist Mono',monospace; font-size:11px; font-weight:400;
          letter-spacing:0.22em; text-transform:uppercase; color:#6E6E78; }
        .pm-h2 { margin:24px 0 0; font-size:42px; font-weight:500; letter-spacing:-0.025em;
          line-height:1.15; color:#0A0A0C; }
        .pm-intro { margin:30px 0 0; font-size:18px; font-weight:400; line-height:1.7;
          color:#26262E; max-width:720px; }

        @keyframes pmTo30 { from { transform:rotate(0deg); } to { transform:rotate(30deg); } }
        @keyframes pmTo60 { from { transform:rotate(0deg); } to { transform:rotate(60deg); } }
        @keyframes pmDot { from { opacity:0; } to { opacity:1; } }

        /* ============ Nav ============ */
        .pm-nav { position:sticky; top:0; z-index:100; background:#0A0A0C; border-bottom:1px solid #26262E; }
        .pm-nav-in { max-width:1100px; margin:0 auto; padding:0 32px; height:64px;
          display:flex; align-items:center; justify-content:space-between; }
        .pm-brand { display:flex; align-items:center; gap:12px; }
        .pm-brand span { font-size:16.5px; font-weight:500; letter-spacing:-0.01em; color:#FAFAF8; }
        .pm-nav-r { display:flex; align-items:center; gap:28px; }
        .pm-nav-link { font-size:14px; font-weight:400; color:#6E6E78; transition:color 0.15s; }
        .pm-nav-link:hover { color:#FAFAF8; }
        .pm-nav-cta { font-size:14px; font-weight:500; color:#0A0A0C; background:#FAFAF8;
          padding:9px 18px; border-radius:7px; transition:background 0.15s; }
        .pm-nav-cta:hover { background:#E9E9E5; }

        /* ============ Hero ============ */
        .pm-hero { background:#0A0A0C; }
        .pm-hero-in { max-width:1100px; margin:0 auto; padding:104px 32px 96px;
          display:grid; grid-template-columns:1.15fr 0.85fr; gap:64px; align-items:center; }
        .pm-h1 { margin:26px 0 0; font-size:64px; font-weight:500; letter-spacing:-0.03em;
          line-height:1.05; color:#FAFAF8; }
        .pm-hero-sub { margin:28px 0 0; font-size:18px; font-weight:400; line-height:1.7;
          color:#6E6E78; max-width:520px; }
        .pm-hero-cta { margin-top:40px; display:flex; align-items:center; gap:28px; flex-wrap:wrap; }
        .pm-btn { display:inline-block; font-size:15px; font-weight:500; color:#0A0A0C;
          background:#FAFAF8; padding:14px 26px; border-radius:8px; transition:background 0.15s; }
        .pm-btn:hover { background:#E9E9E5; }
        .pm-hero-link { font-size:15px; font-weight:500; color:#FAFAF8; opacity:0.9; transition:opacity 0.15s; }
        .pm-hero-link:hover { opacity:0.6; }
        .pm-hero-mark { display:flex; justify-content:center; }
        .pm-hero-mark svg { display:block; }
        .pm-r30 { transform-box:fill-box; transform-origin:50% 50%; transform:rotate(30deg);
          animation:pmTo30 2.2s cubic-bezier(0.3,0,0.15,1) 0.5s both; }
        .pm-r60 { transform-box:fill-box; transform-origin:50% 50%; transform:rotate(60deg);
          animation:pmTo60 2.9s cubic-bezier(0.3,0,0.15,1) 0.5s both; }
        .pm-hdot { animation:pmDot 0.9s ease 3.1s both; }

        /* Trust bar */
        .pm-trust { border-top:1px solid #26262E; }
        .pm-trust-in { max-width:1100px; margin:0 auto; padding:26px 32px;
          display:flex; align-items:center; gap:40px; }
        .pm-trust-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; white-space:nowrap; }
        .pm-trust-stats { display:flex; align-items:center; gap:36px; flex:1; justify-content:flex-end; }
        .pm-trust-stat { font-size:14px; font-weight:400; color:#FAFAF8; }
        .pm-trust-div { width:1px; height:20px; background:#26262E; flex-shrink:0; }

        /* ============ Sections ============ */
        .pm-sec { background:#FAFAF8; }
        .pm-sec.hairline { border-bottom:1px solid #E9E9E5; }
        .pm-sec-in { max-width:1100px; margin:0 auto; padding:120px 32px; }
        .pm-prose { margin-top:36px; max-width:720px; }
        .pm-prose p { margin:0; font-size:18px; font-weight:400; line-height:1.7; color:#26262E; }
        .pm-prose p + p { margin-top:24px; }
        .pm-strong { font-weight:500; color:#0A0A0C; }

        /* Hairline card grids */
        .pm-grid { margin-top:56px; display:grid; gap:1px; background:#E9E9E5; border:1px solid #E9E9E5; }
        .pm-grid.c2 { grid-template-columns:1fr 1fr; }
        .pm-grid.c3 { grid-template-columns:1fr 1fr 1fr; }
        .pm-grid.c4 { grid-template-columns:repeat(4,1fr); }
        .pm-card { background:#FAFAF8; padding:36px; }
        .pm-card-n { font-family:'Geist Mono',monospace; font-size:11px; color:#6E6E78; }
        .pm-card-t { margin-top:20px; font-size:20px; font-weight:500; letter-spacing:-0.01em; color:#0A0A0C; }
        .pm-card-b { margin:14px 0 0; font-size:15.5px; font-weight:400; line-height:1.65; color:#26262E; }

        /* Industries cards */
        .pm-ind { background:#FAFAF8; padding:32px; display:flex; flex-direction:column; }
        .pm-ind-t { font-size:18px; font-weight:500; letter-spacing:-0.01em; color:#0A0A0C; }
        .pm-ind-b { margin:13px 0 0; font-size:15px; font-weight:400; line-height:1.65; color:#26262E; flex:1; }
        .pm-tlink { margin-top:22px; font-size:14px; font-weight:500; color:#6E6E78; transition:color 0.15s; }
        .pm-tlink:hover { color:#0A0A0C; }

        /* ============ How we work (dark) ============ */
        .pm-dark { background:#0A0A0C; }
        .pm-dark .pm-h2 { color:#FAFAF8; }
        .pm-grid.dark { background:#26262E; border-color:#26262E; }
        .pm-step { background:#0A0A0C; padding:32px 28px 40px; }
        .pm-step-n { font-family:'Geist Mono',monospace; font-size:12px; color:#6E6E78; }
        .pm-step-t { margin-top:22px; font-size:19px; font-weight:500; letter-spacing:-0.01em; color:#FAFAF8; }
        .pm-step-b { margin:14px 0 0; font-size:15px; font-weight:400; line-height:1.65; color:#6E6E78; }
        .pm-foot-note { margin-top:26px; font-family:'Geist Mono',monospace; font-size:11px;
          letter-spacing:0.12em; text-transform:uppercase; color:#6E6E78; }

        /* ============ Diagnosis (chatbot) ============ */
        .pm-agent-wrap { max-width:760px; margin-top:56px; }

        /* ============ Results ============ */
        .pm-stat { background:#FAFAF8; padding:30px 28px 34px; }
        .pm-stat-v { font-size:48px; font-weight:500; letter-spacing:-0.03em; color:#0A0A0C; }
        .pm-stat-v .br { color:#E9E9E5; }
        .pm-stat-v .unit { font-size:26px; color:#26262E; }
        .pm-stat-c { margin-top:12px; font-size:14px; line-height:1.55; color:#6E6E78; }
        .pm-stat-note { margin-top:18px; font-family:'Geist Mono',monospace; font-size:10.5px;
          letter-spacing:0.1em; text-transform:uppercase; color:#6E6E78; }
        .pm-cases { margin-top:48px; }
        .pm-case { background:#FAFAF8; padding:34px; }
        .pm-case-t { font-size:19px; font-weight:500; color:#0A0A0C; }
        .pm-case-rows { margin-top:24px; display:grid; grid-template-columns:110px 1fr;
          gap:10px 18px; align-items:baseline; }
        .pm-case-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.14em;
          text-transform:uppercase; color:#6E6E78; }
        .pm-case-v { font-size:15px; line-height:1.6; color:#6E6E78; }
        .pm-case .pm-tlink { display:inline-block; margin-top:26px; }

        /* ============ About ============ */
        .pm-about-in { max-width:1100px; margin:0 auto; padding:120px 32px;
          display:grid; grid-template-columns:1.2fr 0.8fr; gap:72px; align-items:start; }
        .pm-about-p { margin:30px 0 0; font-size:17px; font-weight:400; line-height:1.7; color:#26262E; }
        .pm-about-p + .pm-about-p { margin-top:22px; }
        .pm-founder { border:1px solid #E9E9E5; background:#FAFAF8; padding:34px; margin-top:62px; }
        .pm-founder-n { margin-top:26px; font-size:19px; font-weight:500; color:#0A0A0C; }
        .pm-founder-r { margin-top:6px; font-family:'Geist Mono',monospace; font-size:10.5px;
          letter-spacing:0.14em; text-transform:uppercase; color:#6E6E78; }
        .pm-founder-b { margin:20px 0 0; font-size:14.5px; font-weight:400; line-height:1.65; color:#26262E; }
        .pm-founder-f { margin-top:20px; padding-top:18px; border-top:1px solid #E9E9E5;
          font-size:13.5px; color:#6E6E78; }

        /* ============ FAQ ============ */
        .pm-faq-in { max-width:900px; margin:0 auto; padding:120px 32px; }
        .pm-faq-h2 { margin:24px 0 12px; font-size:42px; font-weight:500; letter-spacing:-0.025em;
          line-height:1.15; color:#0A0A0C; }
        .pm-faq-list { margin-top:34px; border-top:1px solid #E9E9E5; }
        .pm-faq-item { border-bottom:1px solid #E9E9E5; }
        .pm-faq-q { width:100%; background:none; border:none; text-align:left;
          display:flex; justify-content:space-between; align-items:center; gap:24px;
          padding:24px 0; cursor:pointer; font-family:inherit; }
        .pm-faq-qt { font-size:17px; font-weight:500; color:#0A0A0C; }
        .pm-faq-plus { font-size:20px; font-weight:400; color:#6E6E78; line-height:1;
          transition:transform 0.25s; flex-shrink:0; }
        .pm-faq-plus.open { transform:rotate(45deg); }
        .pm-faq-a { margin:0; padding:0 40px 24px 0; font-size:16px; line-height:1.7;
          color:#26262E; max-width:760px; }

        /* ============ Final CTA ============ */
        .pm-cta-in { max-width:900px; margin:0 auto; padding:140px 32px; text-align:center; }
        .pm-cta-in .pm-mark-c { display:flex; justify-content:center; }
        .pm-cta-h2 { margin:44px 0 0; font-size:46px; font-weight:500; letter-spacing:-0.025em;
          line-height:1.15; color:#FAFAF8; }
        .pm-cta-sub { margin:26px auto 0; font-size:17px; font-weight:400; line-height:1.7;
          color:#6E6E78; max-width:520px; }
        .pm-cta-row { margin-top:40px; display:flex; flex-direction:column; align-items:center; gap:18px; }
        .pm-cta-btn { padding:15px 30px; }
        .pm-cta-mail { font-size:14px; color:#6E6E78; }
        .pm-cta-mail a { color:#FAFAF8; }

        /* ============ Footer ============ */
        .pm-footer { background:#0A0A0C; border-top:1px solid #26262E; }
        .pm-footer-in { max-width:1100px; margin:0 auto; padding:72px 32px 0;
          display:grid; grid-template-columns:1.6fr 1fr 1fr 1fr; gap:48px; }
        .pm-fbrand { display:flex; align-items:center; gap:12px; }
        .pm-fbrand span { font-size:16px; font-weight:500; color:#FAFAF8; }
        .pm-ftag { margin-top:14px; font-size:14px; line-height:1.6; color:#6E6E78; }
        .pm-fcol-l { font-family:'Geist Mono',monospace; font-size:10px; letter-spacing:0.16em;
          text-transform:uppercase; color:#6E6E78; }
        .pm-fcol-links { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
        .pm-flink { font-size:14px; color:#FAFAF8; opacity:0.85; transition:opacity 0.15s; }
        a.pm-flink:hover { opacity:0.5; }
        .pm-fmuted { font-size:14px; color:#6E6E78; }
        .pm-legal-w { max-width:1100px; margin:56px auto 0; padding:0 32px; }
        .pm-legal { border-top:1px solid #26262E; padding:24px 0 28px;
          display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap; }
        .pm-legal-c { font-size:13px; color:#6E6E78; }
        .pm-legal-links { display:flex; gap:24px; }
        .pm-legal-links a { font-size:13px; color:#6E6E78; transition:color 0.15s; }
        .pm-legal-links a:hover { color:#FAFAF8; }

        .pm a:focus-visible, .pm button:focus-visible { outline:1px solid #6E6E78; outline-offset:3px; }

        /* ============ Responsive ============ */
        @media (max-width: 900px) {
          .pm-nav-link { display:none; }
          .pm-hero-in { grid-template-columns:1fr; gap:48px; padding:72px 32px 64px; }
          .pm-h1 { font-size:44px; }
          .pm-hero-mark svg { width:220px; height:220px; }
          .pm-trust-in { flex-direction:column; align-items:flex-start; gap:16px; }
          .pm-trust-stats { flex-direction:column; align-items:flex-start; gap:10px; justify-content:flex-start; }
          .pm-trust-div { display:none; }
          .pm-h2, .pm-faq-h2 { font-size:32px; }
          .pm-cta-h2 { font-size:34px; }
          .pm-sec-in, .pm-faq-in, .pm-about-in { padding:88px 32px; }
          .pm-cta-in { padding:100px 32px; }
          .pm-grid.c2, .pm-grid.c3 { grid-template-columns:1fr; }
          .pm-grid.c4 { grid-template-columns:1fr 1fr; }
          .pm-about-in { grid-template-columns:1fr; gap:48px; }
          .pm-founder { margin-top:0; }
          .pm-footer-in { grid-template-columns:1fr 1fr; }
        }
        @media (max-width: 560px) {
          .pm-w, .pm-nav-in, .pm-hero-in, .pm-trust-in, .pm-sec-in, .pm-faq-in,
          .pm-about-in, .pm-cta-in, .pm-footer-in, .pm-legal-w { padding-left:24px; padding-right:24px; }
          .pm-h1 { font-size:38px; }
          .pm-grid.c4 { grid-template-columns:1fr; }
          .pm-footer-in { grid-template-columns:1fr; gap:36px; }
          .pm-case-rows { grid-template-columns:1fr; gap:4px 0; }
          .pm-case-rows .pm-case-v { margin-bottom:10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pm-r30, .pm-r60, .pm-hdot { animation:none; }
          .pm-faq-plus { transition:none; }
        }
      `}</style>

      {/* ============ Nav ============ */}
      <div className="pm-nav">
        <div className="pm-nav-in">
          <a href="#top" className="pm-brand">
            <PolymathMark size={26} ink="#FAFAF8" sw={1.25} />
            <span>Polymath</span>
          </a>
          <div className="pm-nav-r">
            <a className="pm-nav-link" href="#what-we-do">What we do</a>
            <a className="pm-nav-link" href="#industries">Industries</a>
            <a className="pm-nav-link" href="#how-we-work">How we work</a>
            <a className="pm-nav-link" href="#results">Results</a>
            <a className="pm-nav-link" href="#about">About</a>
            <a className="pm-nav-cta" href={BOOK_HREF}>Book a consultation</a>
          </div>
        </div>
      </div>

      {/* ============ Hero ============ */}
      <div className="pm-hero">
        <div className="pm-hero-in">
          <div>
            <div className="pm-eyebrow">AI consultancy group</div>
            <h1 className="pm-h1">{HEADLINE}</h1>
            <p className="pm-hero-sub">
              Polymath designs and deploys AI agents that remove friction from how your
              business actually works — so your people spend time on decisions, not
              busywork. One consultancy, every industry.
            </p>
            <div className="pm-hero-cta">
              <a className="pm-btn" href={BOOK_HREF}>Book a consultation</a>
              <a className="pm-hero-link" href="#how-we-work">See how we work →</a>
            </div>
          </div>
          <div className="pm-hero-mark">
            <svg width="340" height="340" viewBox="0 0 96 96" fill="none">
              <rect x="18" y="18" width="60" height="60" stroke="#FAFAF8" strokeWidth="0.5" />
              <rect className="pm-r30" x="18" y="18" width="60" height="60" stroke="#FAFAF8" strokeWidth="0.5" />
              <rect className="pm-r60" x="18" y="18" width="60" height="60" stroke="#FAFAF8" strokeWidth="0.5" />
              <circle className="pm-hdot" cx="48" cy="48" r="3.5" fill="#FAFAF8" />
            </svg>
          </div>
        </div>

        {/* Trust bar */}
        <div className="pm-trust">
          <div className="pm-trust-in">
            <div className="pm-trust-l">Trusted across sectors</div>
            <div className="pm-trust-stats">
              <div className="pm-trust-stat">10+ years combined AI &amp; ML engineering</div>
              <div className="pm-trust-div" />
              <div className="pm-trust-stat">Production systems serving institutional clients</div>
              <div className="pm-trust-div" />
              <div className="pm-trust-stat">Deployments across education, retail, and manufacturing</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ The problem ============ */}
      <div className="pm-sec hairline">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">The problem</div>
          <h2 className="pm-h2" style={{ maxWidth: 780 }}>
            Every industry has the same problem. It just wears a different uniform.
          </h2>
          <div className="pm-prose">
            <p>
              In a factory, it&apos;s production data trapped in machines nobody queries. In a
              clinic, it&apos;s staff re-typing the same intake form three times. In a firm, it&apos;s
              partners spending billable hours on documents an agent could draft. Different
              industries, same disease: friction. Work that consumes your best people without
              requiring their best thinking.
            </p>
            <p>
              Most companies respond by hiring more people or buying more software. Both add
              complexity. <span className="pm-strong">We remove it.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ============ What we do ============ */}
      <div id="what-we-do" className="pm-sec hairline">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">What we do</div>
          <h2 className="pm-h2" style={{ maxWidth: 820 }}>
            One layer of intelligence, placed exactly where your business loses time.
          </h2>
          <p className="pm-intro">
            We don&apos;t sell tools. We study how your work actually flows, find where it
            breaks, and build the AI layer that fixes it — then stay until it runs on its own.
          </p>
          <div className="pm-grid c2">
            {WHAT_WE_DO.map(card => (
              <div className="pm-card" key={card.n}>
                <div className="pm-card-n">{card.n}</div>
                <div className="pm-card-t">{card.t}</div>
                <p className="pm-card-b">{card.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Industries ============ */}
      <div id="industries" className="pm-sec">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">Industries</div>
          <h2 className="pm-h2">Different fields. Same discipline.</h2>
          <p className="pm-intro">
            A polymath is someone who masters many fields. Our method transfers because
            friction behaves the same way everywhere — only the vocabulary changes.
          </p>
          <div className="pm-grid c3">
            {INDUSTRIES.map(ind => (
              <div className="pm-ind" key={ind.t}>
                <div className="pm-ind-t">{ind.t}</div>
                <p className="pm-ind-b">{ind.b}</p>
                <a className="pm-tlink" href="#contact">See what this looks like →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ How we work (dark) ============ */}
      <div id="how-we-work" className="pm-dark">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">How we work</div>
          <h2 className="pm-h2">Four steps. No black boxes.</h2>
          <div className="pm-grid c4 dark">
            {STEPS.map(step => (
              <div className="pm-step" key={step.n}>
                <div className="pm-step-n">{step.n}</div>
                <div className="pm-step-t">{step.t}</div>
                <p className="pm-step-b">{step.b}</p>
              </div>
            ))}
          </div>
          <div className="pm-foot-note">
            Typical first engagement: 6–10 weeks from diagnosis to a working system.
          </div>
        </div>
      </div>

      {/* ============ Diagnosis agent (the chatbot) ============ */}
      <div id="diagnosis" className="pm-sec hairline">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">Live diagnosis</div>
          <h2 className="pm-h2" style={{ maxWidth: 780 }}>
            Tell the agent where your business loses time.
          </h2>
          <p className="pm-intro">
            The same diagnosis we run in an engagement, in miniature. Describe how your work
            flows and where it breaks — an agent we built reads the problem and writes the
            first draft of the fix.
          </p>
          <div className="pm-agent-wrap">
            <PolymathAgent />
          </div>
        </div>
      </div>

      {/* ============ Results ============ */}
      <div id="results" className="pm-sec hairline">
        <div className="pm-sec-in">
          <div className="pm-eyebrow">Results</div>
          <h2 className="pm-h2" style={{ maxWidth: 720 }}>
            Measured in hours returned and errors removed.
          </h2>
          <div className="pm-grid c4">
            <div className="pm-stat">
              <div className="pm-stat-v"><span className="br">[</span>XX<span className="br">]</span>%</div>
              <div className="pm-stat-c">reduction in manual processing time, [industry] client</div>
            </div>
            <div className="pm-stat">
              <div className="pm-stat-v"><span className="br">[</span>XX<span className="br">]</span><span className="unit"> hrs/wk</span></div>
              <div className="pm-stat-c">returned to a [role] team of [N]</div>
            </div>
            <div className="pm-stat">
              <div className="pm-stat-v"><span className="br">[</span>X<span className="br">]</span>×</div>
              <div className="pm-stat-c">faster [process name] turnaround</div>
            </div>
            <div className="pm-stat">
              <div className="pm-stat-v">$<span className="br">[</span>XXX<span className="br">]</span><span className="unit">k</span></div>
              <div className="pm-stat-c">annual operating cost removed</div>
            </div>
          </div>
          <div className="pm-stat-note">
            Placeholder metrics — replaced with client data as engagements complete
          </div>

          <div className="pm-grid c2 pm-cases">
            {CASE_STUDIES.map((cs, i) => (
              <div className="pm-case" key={i}>
                <div className="pm-case-t">{cs.name}</div>
                <div className="pm-case-rows">
                  <div className="pm-case-l">The friction</div>
                  <div className="pm-case-v">{cs.friction}</div>
                  <div className="pm-case-l">The layer</div>
                  <div className="pm-case-v">{cs.layer}</div>
                  <div className="pm-case-l">The result</div>
                  <div className="pm-case-v">{cs.result}</div>
                </div>
                <a className="pm-tlink" href="#contact">Read the full story →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ About ============ */}
      <div id="about" className="pm-sec hairline">
        <div className="pm-about-in">
          <div>
            <div className="pm-eyebrow">About</div>
            <h2 className="pm-h2">Built by engineers who ship, not decks.</h2>
            <p className="pm-about-p">
              Polymath was founded by {FOUNDER_NAME}, an AI/ML engineer who has spent years
              building production AI systems — from agentic platforms serving institutional
              education clients to prediction models running in live business environments.
              We are engineers first and consultants second: every recommendation we make is
              one we know how to build, because we&apos;re the ones who build it.
            </p>
            <p className="pm-about-p">
              We work with a small number of clients at a time, deliberately.{" "}
              <span className="pm-strong">Depth over volume.</span>
            </p>
          </div>
          <div className="pm-founder">
            <PolymathMark size={44} ink="#0A0A0C" sw={1.5} />
            <div className="pm-founder-n">{FOUNDER_NAME}</div>
            <div className="pm-founder-r">Founder &amp; Principal</div>
            <p className="pm-founder-b">
              AI/ML engineer. Builder of production agentic systems, ML pipelines, and cloud
              architecture (AWS, Azure). Instructor in computer systems.
            </p>
            <div className="pm-founder-f">
              Based in Ontario, Canada — working with clients everywhere.
            </div>
          </div>
        </div>
      </div>

      {/* ============ FAQ ============ */}
      <div className="pm-sec">
        <div className="pm-faq-in">
          <div className="pm-eyebrow">FAQ</div>
          <h2 className="pm-faq-h2">Fair questions.</h2>
          <div className="pm-faq-list">
            {FAQS.map((f, i) => (
              <div className="pm-faq-item" key={f.q}>
                <button
                  className="pm-faq-q"
                  aria-expanded={faq === i}
                  onClick={() => setFaq(faq === i ? -1 : i)}
                >
                  <span className="pm-faq-qt">{f.q}</span>
                  <span className={`pm-faq-plus${faq === i ? " open" : ""}`}>+</span>
                </button>
                {faq === i && <p className="pm-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Final CTA ============ */}
      <div id="contact" className="pm-dark">
        <div className="pm-cta-in">
          <div className="pm-mark-c">
            <PolymathMark size={56} ink="#FAFAF8" sw={1.5} />
          </div>
          <h2 className="pm-cta-h2">
            Tell us where your business loses time. We&apos;ll tell you what it&apos;s worth to fix.
          </h2>
          <p className="pm-cta-sub">
            A 30-minute conversation. No pitch deck, no obligation — just an engineer&apos;s
            honest read on your problem.
          </p>
          <div className="pm-cta-row">
            <a className="pm-btn pm-cta-btn" href={BOOK_HREF}>Book a consultation</a>
            <div className="pm-cta-mail">
              Or write to us — <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Footer ============ */}
      <div className="pm-footer">
        <div className="pm-footer-in">
          <div>
            <div className="pm-fbrand">
              <PolymathMark size={26} ink="#FAFAF8" sw={1.25} />
              <span>Polymath Consultancy Group</span>
            </div>
            <div className="pm-ftag">The intelligence layer for your business.</div>
          </div>
          <div>
            <div className="pm-fcol-l">Company</div>
            <div className="pm-fcol-links">
              <a className="pm-flink" href="#what-we-do">What we do</a>
              <a className="pm-flink" href="#industries">Industries</a>
              <a className="pm-flink" href="#how-we-work">How we work</a>
              <a className="pm-flink" href="#about">About</a>
            </div>
          </div>
          <div>
            <div className="pm-fcol-l">Resources</div>
            <div className="pm-fcol-links">
              <a className="pm-flink" href="#what-we-do">Friction audit</a>
              <a className="pm-flink" href="#results">Case studies</a>
              <a className="pm-flink" href="#top">FAQ</a>
            </div>
          </div>
          <div>
            <div className="pm-fcol-l">Contact</div>
            <div className="pm-fcol-links">
              <a className="pm-flink" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              <a className="pm-flink" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <div className="pm-fmuted">Ontario, Canada</div>
            </div>
          </div>
        </div>
        <div className="pm-legal-w">
          <div className="pm-legal">
            <div className="pm-legal-c">© 2026 Polymath Consultancy Group. All rights reserved.</div>
            <div className="pm-legal-links">
              <a href="#top">Privacy</a>
              <a href="#top">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
