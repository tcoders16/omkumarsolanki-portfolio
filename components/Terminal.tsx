"use client";
import { useEffect, useRef, useState, KeyboardEvent, useCallback } from "react";

type LineType = "cmd"|"out"|"success"|"warn"|"error"|"info"|"dim"|"accent"|"blank"|"header";
type Line = { type: LineType; text: string };

/* ── colour map (VS Code Dark+) ── */
const C: Record<LineType, string> = {
  success: "#23d18b",
  accent:  "#569cd6",
  header:  "#ffffff",
  out:     "#cccccc",
  info:    "#9cdcfe",
  dim:     "#6a6a6a",
  warn:    "#dcdcaa",
  error:   "#f44747",
  cmd:     "#d4d4d4",
  blank:   "transparent",
};

/* ══════════════════════════════════════════════════════════════════
   BOOT SEQUENCE
══════════════════════════════════════════════════════════════════ */
const BOOT: Line[] = [
  { type:"out",     text:"Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)" },
  { type:"blank",   text:"" },
  { type:"dim",     text:" * Documentation:  https://help.ubuntu.com" },
  { type:"dim",     text:" * Support:        https://ubuntu.com/advantage" },
  { type:"blank",   text:"" },
  { type:"out",     text:"  System load:    0.14        Processes:       247" },
  { type:"out",     text:"  Memory usage:   61%         Uptime:          47 days" },
  { type:"out",     text:"  Disk usage:     42%         IPv4:            10.0.2.15" },
  { type:"blank",   text:"" },
  { type:"success", text:"  ● resso-inference   active   (running) since 2026-02-10" },
  { type:"success", text:"  ● rag-server        active   (running) since 2026-02-08" },
  { type:"success", text:"  ● mcp-bridge        active   (running) since 2026-02-07" },
  { type:"blank",   text:"" },
  { type:"dim",     text:"Last login: " + new Date().toDateString() + "  from 127.0.0.1" },
  { type:"blank",   text:"" },
];

/* ══════════════════════════════════════════════════════════════════
   COMMANDS
══════════════════════════════════════════════════════════════════ */
type CmdFn = (args: string[]) => Promise<Line[]> | Line[];

let aiCallCount = 0;
const AI_RATE_LIMIT = 7;

const CMDS: Record<string, CmdFn> = {

  help: () => [
    { type:"header",  text:"╔══════════════════════════════════════════════════════╗" },
    { type:"header",  text:"║               AVAILABLE COMMANDS                    ║" },
    { type:"header",  text:"╚══════════════════════════════════════════════════════╝" },
    { type:"blank",   text:"" },
    { type:"info",    text:"  — IDENTITY ——————————————————————————————————————" },
    { type:"out",     text:"  whoami                  Identity & clearance record" },
    { type:"out",     text:"  linkedin                Open LinkedIn profile ↗" },
    { type:"out",     text:"  x                       Open X.com profile ↗" },
    { type:"out",     text:"  email                   Compose email to emailtosolankiom@gmail.com" },
    { type:"blank",   text:"" },
    { type:"info",    text:"  — DOCUMENTS ——————————————————————————————————————" },
    { type:"out",     text:"  resume                  Download & open resume PDF" },
    { type:"out",     text:"  cat resume              Print resume to stdout" },
    { type:"out",     text:"  ls -la                  List files, skills & projects" },
    { type:"blank",   text:"" },
    { type:"info",    text:"  — NETWORK ———————————————————————————————————————" },
    { type:"out",     text:"  github                  Fetch live repos from GitHub API" },
    { type:"out",     text:"  nmap resso.ai           Scan production service ports" },
    { type:"out",     text:"  ping resso.ai           Real latency measurement" },
    { type:"out",     text:"  ssh om@resso.ai                        Connect to production server" },
    { type:"out",     text:"  traceroute resso.ai     Trace network path" },
    { type:"blank",   text:"" },
    { type:"info",    text:"  — AI ————————————————————————————————————————————" },
    { type:"out",     text:'  ai "<question>"          Ask Om\'s AI anything' },
    { type:"blank",   text:"" },
    { type:"info",    text:"  — SECRETS ———————————————————————————————————————" },
    { type:"out",     text:"  matrix                  ???" },
    { type:"out",     text:"  sudo hire om            [requires root]" },
    { type:"out",     text:"  clear                   Clear terminal" },
    { type:"blank",   text:"" },
  ],

  whoami: () => [
    { type:"header",  text:"╔══════════════════════════════════════════════════════╗" },
    { type:"header",  text:"║           IDENTITY RECORD  ///  CLASSIFIED           ║" },
    { type:"header",  text:"╚══════════════════════════════════════════════════════╝" },
    { type:"blank",   text:"" },
    { type:"out",     text:"  NAME        Om Kumar Solanki" },
    { type:"out",     text:"  ALIAS       os." },
    { type:"out",     text:"  ROLE        Founding Engineer @ Resso.ai" },
    { type:"out",     text:"              AI Architect @ HariKrushna Software" },
    { type:"out",     text:"              ML Engineer — Corol.org & NunaFab" },
    { type:"blank",   text:"" },
    { type:"out",     text:"  CLEARANCE   LEVEL 5 — PRODUCTION AI" },
    { type:"out",     text:"  EDU         BASc Artificial Intelligence (Honours)" },
    { type:"out",     text:"              Sheridan College  |  AWS Academy Graduate" },
    { type:"blank",   text:"" },
    { type:"out",     text:"  LOCATION    Ontario, Canada" },
    { type:"out",     text:"  EMAIL       emailtosolankiom@gmail.com" },
    { type:"out",     text:"  GITHUB      github.com/omkumarsolanki" },
    { type:"out",     text:"  LINKEDIN    linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/" },
    { type:"blank",   text:"" },
    { type:"success", text:"  [OK] Identity verified. Access level: ENGINEER." },
  ],

  ls: (args) => {
    const long = args.some(a => a.includes("l"));
    const files = [
      { p:"drwxr-xr-x", sz:"4.0K", n:"projects/",          d:"Production AI systems" },
      { p:"drwxr-xr-x", sz:"4.0K", n:"skills/",            d:"ML · MLOps · Agentic · Full-stack" },
      { p:"-rw-r--r--", sz:" 12K", n:"resume.pdf",         d:"Full CV" },
      { p:"-rwxr-xr-x", sz:"8.1K", n:"resso_ai.py",        d:"Real-time hire scoring at <2s" },
      { p:"-rwxr-xr-x", sz:"6.2K", n:"rag_server.py",      d:"Air-gapped on-premise RAG" },
      { p:"-rwxr-xr-x", sz:"3.4K", n:"mcp_server.ts",      d:"Multi-agent MCP orchestration" },
      { p:"-rwxr-xr-x", sz:"2.0K", n:"avatar_lipsync.py",  d:"Audio-to-viseme WebSocket" },
      { p:"-rw-r--r--", sz:"1.2K", n:"hire_scorer.onnx",   d:"Production ONNX model (INT8)" },
      { p:"-rw-------", sz:" 820", n:".env.prod",           d:"⚠  classified" },
    ];
    const lines: Line[] = [{ type:"dim", text:`total ${files.length * 4}` }, { type:"blank", text:"" }];
    if (long) {
      files.forEach(f => lines.push({
        type: f.n === ".env.prod" ? "warn" : "out",
        text: `${f.p}  om  staff  ${f.sz}  ${f.n.padEnd(22)}  # ${f.d}`,
      }));
    } else {
      lines.push({ type:"out", text: files.map(f => f.n).join("   ") });
    }
    lines.push({ type:"blank", text:"" });
    return lines;
  },

  cat: (args) => {
    const f = args[0] || "";
    if (["resume", "resume.pdf", "resume.txt"].includes(f)) return [
      { type:"header",  text:"═══════════════════════════════════════════════════════" },
      { type:"header",  text:"  OM KUMAR SOLANKI  //  AI/ML ENGINEER" },
      { type:"header",  text:"═══════════════════════════════════════════════════════" },
      { type:"blank",   text:"" },
      { type:"info",    text:"EXPERIENCE" },
      { type:"out",     text:"  Resso.ai          Founding Engineer        Nov 2025–present" },
      { type:"out",     text:"  HariKrushna Soft  AI Architect             Jun 2024–present" },
      { type:"out",     text:"  Corol.org         ML Engineer — Chem AI    2024" },
      { type:"blank",   text:"" },
      { type:"info",    text:"KEY DELIVERABLES" },
      { type:"out",     text:"  · WebRTC audio → diarization → hire-probability  (<2s end-to-end)" },
      { type:"out",     text:"  · Talking AI avatar: lip-sync, audio-to-viseme, WebSocket bus" },
      { type:"out",     text:"  · On-premise RAG: GGUF + HNSW, 0 external calls, 4.2ms latency" },
      { type:"out",     text:"  · MCP servers bridging LLM agents to Slack, CRMs, databases" },
      { type:"out",     text:"  · XGBoost R²=0.89 on 200-row dataset (SHAP-explainable)" },
      { type:"blank",   text:"" },
      { type:"info",    text:"STACK" },
      { type:"out",     text:"  Python · TypeScript · PyTorch · FastAPI · Next.js · Docker" },
      { type:"out",     text:"  AWS · K8s · MLflow · ONNX · WebRTC · MCP · HNSW · GGUF" },
      { type:"blank",   text:"" },
      { type:"info",    text:"EDUCATION" },
      { type:"out",     text:"  Sheridan College — BASc Artificial Intelligence (Honours)" },
      { type:"out",     text:"  AWS Academy — Cloud Developing Graduate (Dec 2025)" },
      { type:"blank",   text:"" },
      { type:"dim",     text:"  [EOF]  resume.pdf  (2,847 bytes)" },
    ];
    if (f === ".env.prod") return [
      { type:"error", text:"cat: .env.prod: Permission denied" },
      { type:"dim",   text:"hint: Nice try. Try 'sudo hire om' instead." },
    ];
    return [{ type:"error", text:`cat: ${f || "(no file)"}: No such file or directory` }];
  },

  github: async () => {
    try {
      const res = await fetch(
        "https://api.github.com/users/omkumarsolanki/repos?sort=updated&per_page=8",
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );
      if (!res.ok) throw new Error("non-200");
      const repos: {name:string; language:string|null; stargazers_count:number; updated_at:string; description:string|null}[] = await res.json();
      const lines: Line[] = [
        { type:"success", text:`[200 OK]  api.github.com/users/omkumarsolanki/repos` },
        { type:"blank",   text:"" },
        { type:"header",  text:"REPOSITORY                      LANG            ★   UPDATED" },
        { type:"dim",     text:"─".repeat(62) },
      ];
      repos.forEach(r => {
        const name  = r.name.slice(0,30).padEnd(32);
        const lang  = (r.language ?? "—").slice(0,14).padEnd(16);
        const stars = String(r.stargazers_count).padStart(2);
        const date  = r.updated_at?.slice(0,10) ?? "—";
        lines.push({ type:"out", text:`${name}${lang}${stars}   ${date}` });
      });
      lines.push({ type:"blank", text:"" });
      lines.push({ type:"dim",   text:"→  github.com/omkumarsolanki" });
      return lines;
    } catch {
      return [
        { type:"warn", text:"⚠  GitHub API rate-limited. Showing cached manifest." },
        { type:"blank", text:"" },
        { type:"header", text:"REPOSITORY                      LANG            ★   UPDATED" },
        { type:"dim",    text:"─".repeat(62) },
        { type:"out",    text:"resso-interview-ai              Python          2   2026-02-28" },
        { type:"out",    text:"on-premise-rag-stack            Python          1   2026-01-14" },
        { type:"out",    text:"mcp-enterprise-bridge           TypeScript      3   2025-12-08" },
        { type:"out",    text:"portfolio                       TypeScript      0   2026-02-20" },
        { type:"blank",  text:"" },
        { type:"dim",    text:"→  github.com/omkumarsolanki" },
      ];
    }
  },

  nmap: (args) => {
    const t = args[0] || "resso.ai";
    return [
      { type:"dim",     text:`Starting Nmap 7.94  ( https://nmap.org )` },
      { type:"dim",     text:`Nmap scan report for ${t} (44.218.71.93)` },
      { type:"out",     text:`Host is up (0.018s latency).` },
      { type:"blank",   text:"" },
      { type:"header",  text:"PORT       STATE    SERVICE      VERSION" },
      { type:"dim",     text:"─".repeat(52) },
      { type:"success", text:"22/tcp     open     ssh          OpenSSH 9.2p1" },
      { type:"success", text:"80/tcp     open     http         nginx 1.25.3" },
      { type:"success", text:"443/tcp    open     https        nginx + TLS 1.3" },
      { type:"success", text:"8080/tcp   open     http-alt     RAG inference API" },
      { type:"success", text:"50051/tcp  open     grpc         ML model serving" },
      { type:"out",     text:"3306/tcp   filtered mysql" },
      { type:"out",     text:"5432/tcp   filtered postgresql" },
      { type:"blank",   text:"" },
      { type:"dim",     text:"OS: Linux 5.15.0-91-generic (Ubuntu 22.04 LTS)" },
      { type:"dim",     text:`Nmap done: 1 IP (1 host up) scanned in 4.23 seconds` },
      { type:"blank",   text:"" },
      { type:"warn",    text:"⚠  Authorized scan — educational purposes only." },
    ];
  },

  ping: async (args) => {
    const t = args[0] || "resso.ai";
    const lines: Line[] = [{ type:"out", text:`PING ${t} (44.218.71.93): 56 data bytes` }];
    const times: number[] = [];
    for (let i = 0; i < 4; i++) {
      const t0 = performance.now();
      try { await fetch(`https://${t}`, { method:"HEAD", mode:"no-cors", cache:"no-store" }); } catch { /* cors ok */ }
      const ms = (performance.now() - t0).toFixed(3);
      times.push(parseFloat(ms));
      lines.push({ type:"success", text:`64 bytes from ${t}: icmp_seq=${i} ttl=54 time=${ms} ms` });
    }
    const min = Math.min(...times).toFixed(3);
    const max = Math.max(...times).toFixed(3);
    const avg = (times.reduce((a,b)=>a+b,0)/times.length).toFixed(3);
    lines.push({ type:"blank",  text:"" });
    lines.push({ type:"header", text:`--- ${t} ping statistics ---` });
    lines.push({ type:"out",    text:`4 packets transmitted, 4 received, 0% packet loss` });
    lines.push({ type:"out",    text:`round-trip min/avg/max = ${min}/${avg}/${max} ms` });
    return lines;
  },

  ssh: (args) => {
    const target = args[0] || "emailtosolankiom@gmail.com";
    return [
      { type:"dim",     text:`Connecting to ${target}...` },
      { type:"dim",     text:`ED25519 key fingerprint is SHA256:aBcDeFgH1234xYzW...` },
      { type:"dim",     text:`Authenticating with public key "om-prod-key"` },
      { type:"blank",   text:"" },
      { type:"success", text:`Connected to resso-ml-prod-01 (Ubuntu 22.04.3 LTS)` },
      { type:"blank",   text:"" },
      { type:"header",  text:` ____  _____ ____ ____  ___            _    ___` },
      { type:"header",  text:`|  _ \\| ____/ ___/ ___// _ \\     /\\  / / |_ _|` },
      { type:"header",  text:`| |_) |  _| \\___ \\___ \\ | | |   / \\/\\ /   | |` },
      { type:"header",  text:`|  _ <| |___ ___) |__) | |_| |  \\    /    | |` },
      { type:"header",  text:`|_| \\_|_____|____/____/ \\___/    \\__/    |___|` },
      { type:"blank",   text:"" },
      { type:"info",    text:"System information as of " + new Date().toDateString() },
      { type:"blank",   text:"" },
      { type:"out",     text:"  System load:   0.14, 0.21, 0.18" },
      { type:"out",     text:"  Memory:        9.8 GB / 16 GB  (61%)" },
      { type:"out",     text:"  GPU:           NVIDIA T4  |  5.1 GB / 16 GB VRAM" },
      { type:"out",     text:"  Disk:          101 GB / 240 GB  (42%)" },
      { type:"out",     text:"  Processes:     247" },
      { type:"out",     text:"  Uptime:        47 days, 3 hours, 12 minutes" },
      { type:"blank",   text:"" },
      { type:"success", text:"  ● resso-inference   ACTIVE  since Mon 2026-02-10" },
      { type:"success", text:"  ● rag-server        ACTIVE  since Sat 2026-02-08" },
      { type:"success", text:"  ● mcp-bridge        ACTIVE  since Fri 2026-02-07" },
      { type:"blank",   text:"" },
      { type:"warn",    text:"Connection closed (session is read-only for this demo)." },
    ];
  },

  traceroute: (args) => {
    const t = args[0] || "resso.ai";
    return [
      { type:"out",     text:`traceroute to ${t} (44.218.71.93), 30 hops max, 60 byte packets` },
      { type:"blank",   text:"" },
      { type:"success", text:` 1  192.168.1.1              1.204 ms    0.891 ms    0.847 ms` },
      { type:"success", text:` 2  10.0.0.1                 5.422 ms    4.918 ms    5.107 ms` },
      { type:"out",     text:` 3  100.64.0.1               8.341 ms    8.114 ms    8.229 ms` },
      { type:"out",     text:` 4  72.14.215.201           12.774 ms   12.511 ms   12.603 ms   # Google` },
      { type:"out",     text:` 5  108.170.252.33          18.902 ms   18.448 ms   18.614 ms   # Google backbone` },
      { type:"out",     text:` 6  142.251.49.108          22.318 ms   22.091 ms   22.205 ms` },
      { type:"out",     text:` 7  52.94.26.1              28.441 ms   27.988 ms   28.127 ms   # AWS us-east-1` },
      { type:"success", text:` 8  44.218.71.93            31.887 ms   31.514 ms   31.692 ms   # resso.ai` },
      { type:"blank",   text:"" },
      { type:"dim",     text:`8 hops · 31.9 ms total · Ontario, CA  →  us-east-1 (N. Virginia)` },
    ];
  },

  resume: async () => {
    await new Promise(r => setTimeout(r, 1400));
    if (typeof window !== "undefined") window.open("/resume.pdf", "_blank");
    return [
      { type:"dim",     text:"Resolving asset: /public/resume.pdf" },
      { type:"blank",   text:"" },
      { type:"out",     text:"  File      Om_Kumar_Solanki_Resume.pdf" },
      { type:"out",     text:"  Size      12.4 KB  |  application/pdf" },
      { type:"out",     text:"  Server    cdn.resso.ai  [TLS 1.3  AES-256-GCM]" },
      { type:"blank",   text:"" },
      { type:"dim",     text:"  Downloading ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  100%  ✓" },
      { type:"blank",   text:"" },
      { type:"success", text:"  ✓  Transfer complete — 12.4 KB in 0.04s  (310 KB/s)" },
      { type:"dim",     text:"  Checksum SHA-256: a3f8...c91d  [verified]" },
      { type:"blank",   text:"" },
      { type:"accent",  text:"  ↳ Opening resume.pdf in new tab..." },
    ];
  },

  linkedin: async () => {
    await new Promise(r => setTimeout(r, 900));
    if (typeof window !== "undefined") window.open("https://www.linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/", "_blank");
    return [
      { type:"dim",     text:"Establishing TLS 1.3 → linkedin.com..." },
      { type:"dim",     text:"GET /in/omkumar-solanki  HTTP/2" },
      { type:"blank",   text:"" },
      { type:"success", text:"  HTTP/2  200 OK" },
      { type:"blank",   text:"" },
      { type:"header",  text:"╔═════════════════════════════════════════════════════╗" },
      { type:"header",  text:"║          LINKEDIN PROFILE  ///  PUBLIC DATA         ║" },
      { type:"header",  text:"╚═════════════════════════════════════════════════════╝" },
      { type:"blank",   text:"" },
      { type:"out",     text:"  Name       Om Kumar Solanki" },
      { type:"out",     text:"  Handle     /in/omkumar-solanki" },
      { type:"out",     text:"  Headline   AI/ML Engineer · Founding Engineer @ Resso.ai" },
      { type:"out",     text:"  Location   Ontario, Canada" },
      { type:"out",     text:"  Open to    Founding roles · Consulting · AI teams" },
      { type:"blank",   text:"" },
      { type:"success", text:"  ✓  Profile fetched  — connection is mutual, recruiter." },
      { type:"blank",   text:"" },
      { type:"accent",  text:"  ↳ Opening linkedin.com/in/omkumar-solanki-atluxuarywxtchbusinessmandeveloper2/..." },
    ];
  },

  x: async () => {
    await new Promise(r => setTimeout(r, 800));
    if (typeof window !== "undefined") window.open("https://x.com/omkumarsolanki", "_blank");
    return [
      { type:"dim",     text:"GET https://x.com/omkumarsolanki" },
      { type:"blank",   text:"" },
      { type:"success", text:"  HTTP/2  200 OK  ·  edge-cache HIT" },
      { type:"blank",   text:"" },
      { type:"header",  text:"╔═════════════════════════════════════════════════════╗" },
      { type:"header",  text:"║                X (TWITTER)  PROFILE                 ║" },
      { type:"header",  text:"╚═════════════════════════════════════════════════════╝" },
      { type:"blank",   text:"" },
      { type:"out",     text:"  Handle     @omkumarsolanki" },
      { type:"out",     text:"  Bio        Building AI that actually ships." },
      { type:"out",     text:"             ML · LLMs · Agents · RAG · WebRTC" },
      { type:"out",     text:"  Location   Ontario, Canada" },
      { type:"blank",   text:"" },
      { type:"success", text:"  ✓  Profile resolved." },
      { type:"blank",   text:"" },
      { type:"accent",  text:"  ↳ Opening x.com/omkumarsolanki..." },
    ];
  },

  email: async () => {
    await new Promise(r => setTimeout(r, 600));
    if (typeof window !== "undefined") window.location.href = "mailto:emailtosolankiom@gmail.com?subject=Let's%20build%20something&body=Hi%20Om%2C";
    return [
      { type:"dim",     text:"Composing new message..." },
      { type:"blank",   text:"" },
      { type:"out",     text:"  To       emailtosolankiom@gmail.com" },
      { type:"out",     text:"  Subject  Let's build something" },
      { type:"out",     text:"  Encrypt  TLS 1.3  ·  DKIM signed" },
      { type:"blank",   text:"" },
      { type:"success", text:"  ✓  Mail client opened." },
      { type:"dim",     text:"  (Or reach me directly at emailtosolankiom@gmail.com)" },
    ];
  },

  matrix: async () => {
    const K = "アイウエオカキクケコサシスセソタナニヌネノ01アイウエオ10ハヒフヘホマミムメモ";
    const rand = (n: number) => Math.floor(Math.random() * n);
    const rows: Line[] = [{ type:"blank", text:"" }];
    for (let r = 0; r < 14; r++) {
      let row = "  ";
      for (let c = 0; c < 58; c++) {
        row += Math.random() > 0.55 ? K[rand(K.length)] : (Math.random() > 0.7 ? "0" : " ");
      }
      rows.push({ type: Math.random() > 0.4 ? "success" : "dim", text: row });
    }
    rows.push({ type:"blank",   text:"" });
    rows.push({ type:"header",  text:"  ┌─────────────────────────────────────────┐" });
    rows.push({ type:"header",  text:"  │  Wake up, Neo...                        │" });
    rows.push({ type:"header",  text:"  │  The Matrix has you.                    │" });
    rows.push({ type:"header",  text:"  │                                         │" });
    rows.push({ type:"header",  text:"  │  Follow the white rabbit.               │" });
    rows.push({ type:"header",  text:"  └─────────────────────────────────────────┘" });
    rows.push({ type:"blank",   text:"" });
    rows.push({ type:"dim",     text:"  hint: 'sudo hire om'  might free you." });
    rows.push({ type:"blank",   text:"" });
    return rows;
  },

  ai: async (args) => {
    const question = args.join(" ").trim();
    if (!question) return [
      { type:"info",  text:'Usage: ai "<question>"' },
      { type:"dim",   text:"" },
      { type:"out",   text:"Examples:" },
      { type:"out",   text:'  ai "what projects has om built?"' },
      { type:"out",   text:'  ai "should i hire om?"' },
      { type:"out",   text:'  ai "what is om\'s ML stack?"' },
    ];

    if (aiCallCount >= AI_RATE_LIMIT) {
      return [
        { type:"warn",  text:`⚠  AI rate limit reached (${AI_RATE_LIMIT} queries per session).` },
        { type:"dim",   text:"Reach Om directly: emailtosolankiom@gmail.com" },
      ];
    }

    aiCallCount++;
    const remaining = AI_RATE_LIMIT - aiCallCount;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        return [
          { type:"accent", text:`hello om's ai "${question}"` },
          { type:"blank",  text:"" },
          { type:"warn",   text:`⚠  ${data.error || "AI unavailable"}` },
          { type:"dim",    text:"Add OPENAI_API_KEY to .env.local to enable AI." },
        ];
      }

      const lines: Line[] = [
        { type:"accent", text:`hello om's ai "${question}"` },
        { type:"blank",  text:"" },
      ];
      const responseLines = (data.text as string).split("\n").filter((l: string) => l.trim() !== "");
      responseLines.forEach((l: string) => {
        lines.push({ type:"out", text:`  ${l}` });
      });
      lines.push({ type:"blank", text:"" });
      lines.push({ type:"dim",   text:`  [${remaining} ${remaining === 1 ? "query" : "queries"} remaining]` });
      lines.push({ type:"blank", text:"" });
      return lines;
    } catch {
      return [
        { type:"accent", text:`hello om's ai "${question}"` },
        { type:"blank",  text:"" },
        { type:"error",  text:"✗  Network error — is the dev server running?" },
      ];
    }
  },

  sudo: (args) => {
    const sub = args.join(" ").toLowerCase();
    if (sub.includes("hire") && sub.includes("om")) return [
      { type:"dim",     text:"[sudo] password for recruiter: ••••••••" },
      { type:"blank",   text:"" },
      { type:"success", text:"╔═══════════════════════════════════════════════╗" },
      { type:"success", text:"║                                               ║" },
      { type:"success", text:"║   ✓  ACCESS GRANTED: Hire Om Kumar Solanki   ║" },
      { type:"success", text:"║                                               ║" },
      { type:"success", text:"║   EMAIL     emailtosolankiom@gmail.com                       ║" },
      { type:"success", text:"║   LINKEDIN  /in/omkumar-solanki               ║" },
      { type:"success", text:"║                                               ║" },
      { type:"success", text:"╚═══════════════════════════════════════════════╝" },
      { type:"blank",   text:"" },
      { type:"accent",  text:"  Good decision. Let's build something great." },
    ];
    return [
      { type:"dim",   text:"[sudo] password for user: ••••••" },
      { type:"error", text:`sudo: ${args[0] || "(no command)"}: command not found` },
      { type:"dim",   text:"hint: try 'sudo hire om'" },
    ];
  },
};

const ALL_CMDS = Object.keys(CMDS);

const AI_PROMPTS = [
  "should i hire om?",
  "what has om built?",
  "what is om's ML stack?",
  "how fast is resso.ai?",
  "is om available for consulting?",
  "what is lawline.tech?",
  "what is vadtal?",
  "what is the hire score AUC?",
  "can om build an air-gapped AI?",
  "what is MCP?",
];

/* ══════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════ */
type HistEntry = { cmd: string; output: Line[] };

export default function Terminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const bootedRef  = useRef(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState<Line[]>([]);
  const [history,  setHistory]  = useState<HistEntry[]>([]);
  const [input,    setInput]    = useState("");
  const [histIdx,  setHistIdx]  = useState(-1);
  const [running,  setRunning]  = useState(false);
  const [usedQs,   setUsedQs]   = useState<Set<string>>(new Set());
  const [sugPage,  setSugPage]  = useState(0);
  const [animIdx,  setAnimIdx]  = useState(0);
  const [animChars,setAnimChars]= useState(0);
  const [animPhase,setAnimPhase]= useState<"typing"|"hold"|"erasing">("typing");
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ALL_SUGGESTIONS = [
    "ai should i hire om?",
    "ai what has om built?",
    "ai what is om's ML stack?",
    "ai how fast is resso.ai inference?",
    "ai is om available for consulting?",
    "ai what is lawline.tech?",
    "ai what is vadtal and how does it work?",
    "ai explain the chemistry ML project",
    "ai what companies has om worked for?",
    "ai what makes om different from other ML engineers?",
    "ai what is the hire scoring model's AUC?",
    "ai can om build an air-gapped AI system?",
    "ai what is MCP and how does om use it?",
    "ai what is om's education background?",
    "ai how does the WebRTC pipeline work?",
    "ai what is resso.ai?",
    "ai how long has om been building AI?",
    "ai what is ONNX and why does om use it?",
  ];

  const suggestedQuestions = (() => {
    const unused = ALL_SUGGESTIONS.filter(q => !usedQs.has(q));
    const pool = unused.length >= 5 ? unused : ALL_SUGGESTIONS;
    const pageSize = 5;
    const start = (sugPage * pageSize) % pool.length;
    return [...pool.slice(start, start + pageSize), ...pool.slice(0, Math.max(0, start + pageSize - pool.length))].slice(0, pageSize);
  })();

  /* scroll body to bottom */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bootLines, history, running]);

  /* boot sequence — fires when section enters viewport */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bootedRef.current) {
        bootedRef.current = true;
        el.querySelectorAll(".reveal").forEach(c => c.classList.add("visible"));
        let i = 0;
        const tick = () => {
          if (i >= BOOT.length) { setBootDone(true); return; }
          const line = BOOT[i];
          setBootLines(prev => [...prev, line]);
          i++;
          setTimeout(tick, line.type === "blank" ? 60 : 110);
        };
        setTimeout(tick, 300);
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* animated placeholder typewriter */
  useEffect(() => {
    if (!bootDone || input !== "") {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      return;
    }
    const q = AI_PROMPTS[animIdx % AI_PROMPTS.length];
    if (animPhase === "typing") {
      animTimerRef.current = setTimeout(() => {
        if (animChars < q.length) setAnimChars(c => c + 1);
        else setAnimPhase("hold");
      }, animChars === 0 ? 600 : 55);
    } else if (animPhase === "hold") {
      animTimerRef.current = setTimeout(() => setAnimPhase("erasing"), 2000);
    } else {
      animTimerRef.current = setTimeout(() => {
        if (animChars > 0) setAnimChars(c => c - 1);
        else { setAnimIdx(i => i + 1); setAnimPhase("typing"); }
      }, 28);
    }
    return () => { if (animTimerRef.current) clearTimeout(animTimerRef.current); };
  }, [bootDone, input, animIdx, animChars, animPhase]);

  /* run a command */
  const runCommand = useCallback(async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase().startsWith("ai ")) {
      setUsedQs(prev => new Set([...prev, trimmed.toLowerCase()]));
    }

    if (trimmed.toLowerCase() === "clear") {
      setHistory([]); setInput(""); setHistIdx(-1); return;
    }

    const parts = trimmed.split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    // Handle "ls -la" style
    const fn = CMDS[cmd];
    setRunning(true);
    const output: Line[] = fn
      ? await fn(args)
      : [
          { type:"error", text:`bash: ${cmd}: command not found` },
          { type:"dim",   text:`type 'help' to see available commands` },
        ];

    setHistory(prev => [...prev, { cmd: trimmed, output }]);
    setInput(""); setHistIdx(-1); setRunning(false);
  }, []);

  /* keyboard handler */
  const onKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!running) runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx(prev => {
        const next = Math.min(prev + 1, history.length - 1);
        if (history.length > 0) setInput(history[history.length - 1 - next]?.cmd ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx(prev => {
        const next = Math.max(prev - 1, -1);
        setInput(next === -1 ? "" : (history[history.length - 1 - next]?.cmd ?? ""));
        return next;
      });
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) {
        const q = AI_PROMPTS[animIdx % AI_PROMPTS.length];
        setInput(`ai ${q}`);
        setAnimChars(0); setAnimPhase("typing"); setAnimIdx(i => i + 1);
      } else {
        const match = ALL_CMDS.find(k => k.startsWith(input.toLowerCase()));
        if (match) setInput(match);
      }
    }
  }, [input, history, running, runCommand, animIdx]);

  return (
    <section id="terminal" ref={sectionRef} className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">

        {/* Section rule */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:52 }} className="reveal">
          <span className="section-index">05 //</span>
          <div style={{ flex:1, height:1, background:"var(--border)" }} />
        </div>

        <div className="reveal" style={{ marginBottom:10 }}>
          <span className="label-accent">Live Terminal</span>
        </div>
        <h2 className="display-lg reveal reveal-d1" style={{ marginBottom:14 }}>
          Ask me anything.{" "}
          <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--accent)" }}>
            For real.
          </span>
        </h2>
        <p className="body-lg reveal reveal-d2" style={{ maxWidth:580, marginBottom:8 }}>
          Powered by{" "}
          <code style={{ fontFamily:"var(--font-mono)", fontSize:"0.85em", color:"#23d18b", background:"rgba(35,209,139,0.08)", padding:"1px 6px", borderRadius:2 }}>GPT-4o mini</code>
          {" "}via OpenAI — type{" "}
          <code style={{ fontFamily:"var(--font-mono)", fontSize:"0.85em", color:"#9cdcfe", background:"rgba(156,220,254,0.08)", padding:"1px 6px", borderRadius:2 }}>ai &lt;anything&gt;</code>
          {" "}to ask about Om.
        </p>

        {/* AI question suggestions */}
        <div className="reveal reveal-d2" style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#555", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              suggested questions
            </span>
            <button
              onClick={() => setSugPage(p => p + 1)}
              style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", color:"#555", background:"none", border:"1px solid #333",
                borderRadius:2, padding:"1px 8px", cursor:"pointer", letterSpacing:"0.06em" }}
              onMouseEnter={e => { e.currentTarget.style.color="#888"; e.currentTarget.style.borderColor="#555"; }}
              onMouseLeave={e => { e.currentTarget.style.color="#555"; e.currentTarget.style.borderColor="#333"; }}
            >
              shuffle ↻
            </button>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {suggestedQuestions.map(q => (
              <button key={q}
                onClick={() => {
                  if (!bootDone || running) return;
                  setUsedQs(prev => new Set([...prev, q]));
                  runCommand(q);
                  inputRef.current?.focus();
                }}
                style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", letterSpacing:"0.04em",
                  padding:"5px 12px", border:"1px solid rgba(35,209,139,0.3)", borderRadius:3,
                  background:"rgba(35,209,139,0.06)", color:"#23d18b", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(35,209,139,0.6)"; e.currentTarget.style.background="rgba(35,209,139,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(35,209,139,0.3)"; e.currentTarget.style.background="rgba(35,209,139,0.06)"; }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.05)", marginBottom:14 }} className="reveal reveal-d2" />

        {/* Quick-run command chips */}
        <div className="reveal reveal-d2" style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {ALL_CMDS.map(cmd => (
            <button key={cmd}
              onClick={() => { if (bootDone && !running) { runCommand(cmd); inputRef.current?.focus(); }}}
              style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", letterSpacing:"0.06em",
                padding:"4px 12px", border:"1px solid rgba(255,255,255,0.1)", borderRadius:3,
                background: cmd === "ai" ? "rgba(86,156,214,0.1)" : "rgba(255,255,255,0.04)",
                color: cmd === "ai" ? "#569cd6" : "#808080",
                borderColor: cmd === "ai" ? "rgba(86,156,214,0.35)" : "rgba(255,255,255,0.1)",
                cursor:"pointer", transition:"all 0.15s" }}
              onMouseEnter={e => {
                if (cmd === "ai") { e.currentTarget.style.borderColor="rgba(86,156,214,0.7)"; e.currentTarget.style.background="rgba(86,156,214,0.18)"; }
                else { e.currentTarget.style.borderColor="rgba(255,255,255,0.25)"; e.currentTarget.style.color="#cccccc"; e.currentTarget.style.background="rgba(255,255,255,0.07)"; }
              }}
              onMouseLeave={e => {
                if (cmd === "ai") { e.currentTarget.style.borderColor="rgba(86,156,214,0.35)"; e.currentTarget.style.background="rgba(86,156,214,0.1)"; }
                else { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="#808080"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }
              }}
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* ── THE TERMINAL ── */}
        <div className="reveal reveal-d3"
          onClick={() => inputRef.current?.focus()}
          style={{ borderRadius:8, overflow:"hidden", cursor:"text",
            boxShadow:"0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)" }}
        >
          {/* Title bar */}
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 14px",
            background:"#323233", borderBottom:"1px solid #1e1e1e", userSelect:"none" }}>
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#ff5f57" }} />
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#febc2e" }} />
            <div style={{ width:12, height:12, borderRadius:"50%", background:"#28c840" }} />
            <span style={{ flex:1, textAlign:"center", fontFamily:"var(--font-mono)", fontSize:"0.6rem",
              color:"#858585", letterSpacing:"0.04em" }}>
              om@resso-ml — zsh
            </span>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.52rem", color:"#555" }}>
              ↑↓ · Tab
            </span>
          </div>

          {/* Body */}
          <div ref={bodyRef} style={{ padding:"14px 18px", height:460, overflowY:"auto",
            background:"#1e1e1e", fontFamily:"var(--font-mono)", fontSize:"0.72rem",
            lineHeight:1.7, scrollbarWidth:"none" }}>

            {/* Boot output */}
            {bootLines.map((l, i) => (
              <div key={`b${i}`} style={{
                color: C[l.type as LineType],
                height: l.type === "blank" ? 6 : undefined,
                whiteSpace:"pre",
              }}>
                {l.type !== "blank" && l.text}
              </div>
            ))}

            {/* Command history */}
            {history.map((entry, hi) => (
              <div key={hi}>
                <div style={{ display:"flex", alignItems:"baseline", marginTop:2, marginBottom:1 }}>
                  <span style={{ color:"#23d18b", flexShrink:0 }}>om@resso-ml</span>
                  <span style={{ color:"#555" }}>:</span>
                  <span style={{ color:"#569cd6" }}>~</span>
                  <span style={{ color:"#cccccc" }}>&nbsp;$&nbsp;</span>
                  <span style={{ color:"#d4d4d4" }}>{entry.cmd}</span>
                </div>
                {entry.output.map((l, li) => (
                  <div key={li} style={{
                    color: C[l.type as LineType],
                    paddingLeft: l.type === "blank" ? 0 : 0,
                    height: l.type === "blank" ? 6 : undefined,
                    whiteSpace:"pre",
                  }}>
                    {l.type !== "blank" && l.text}
                  </div>
                ))}
                <div style={{ height:2 }} />
              </div>
            ))}

            {/* Running indicator */}
            {running && (
              <div style={{ color:"#6a6a6a", fontStyle:"italic" }}>
                …
              </div>
            )}

            {/* Prompt + input */}
            {bootDone && !running && (
              <div style={{ display:"flex", alignItems:"center", marginTop:2 }}>
                <span style={{ color:"#23d18b", flexShrink:0 }}>om@resso-ml</span>
                <span style={{ color:"#555" }}>:</span>
                <span style={{ color:"#569cd6" }}>~</span>
                <span style={{ color:"#cccccc" }}>&nbsp;$&nbsp;</span>
                <div style={{ position:"relative", flex:1, display:"flex", alignItems:"center" }}>
                  {/* animated placeholder overlay */}
                  {!input && (
                    <div style={{ position:"absolute", inset:0, pointerEvents:"none",
                      fontFamily:"var(--font-mono)", fontSize:"0.72rem", display:"flex",
                      alignItems:"center", whiteSpace:"pre" }}>
                      <span style={{ color:"#4a9eff" }}>ai </span>
                      <span style={{ color:"#2d5a7a" }}>{AI_PROMPTS[animIdx % AI_PROMPTS.length].slice(0, animChars)}</span>
                      <span style={{ color:"#4a9eff", opacity: animPhase === "hold" ? 1 : 0.6,
                        animation:"termBlink 1s step-end infinite" }}>▌</span>
                    </div>
                  )}
                  {!input && (
                    <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.45rem",
                      color:"#2a3a44", position:"absolute", right:0, flexShrink:0,
                      letterSpacing:"0.05em", pointerEvents:"none" }}>
                      [tab]
                    </span>
                  )}
                  <input ref={inputRef} value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKey}
                    spellCheck={false} autoComplete="off" autoCapitalize="off"
                    style={{ background:"transparent", border:"none", outline:"none",
                      color: !input ? "transparent"
                           : input.toLowerCase().startsWith("ai") ? "#4a9eff"
                           : "#d4d4d4",
                      fontFamily:"var(--font-mono)",
                      fontSize:"0.72rem", width:"100%", caretColor:"#4a9eff" }}
                  />
                </div>
              </div>
            )}
            {bootDone && running && <div style={{ height:6 }} />}
          </div>

          {/* Status bar */}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 14px",
            background:"#007acc", fontFamily:"var(--font-mono)", fontSize:"0.5rem",
            color:"#ffffff", letterSpacing:"0.05em", userSelect:"none" }}>
            <span>⎇  main  ·  Python 3.11  ·  PyTorch 2.2  ·  CUDA 12.1</span>
            <span>{running ? "⟳ running" : `✓ ${history.length} cmd${history.length !== 1 ? "s" : ""}`}</span>
          </div>
        </div>

        {/* Stat strip */}
        <div className="reveal reveal-d4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:1, background:"#111", marginTop:16, borderRadius:4, overflow:"hidden",
          border:"1px solid rgba(255,255,255,0.06)" }}>
          {[
            { v:"<2s",   l:"Inference latency" },
            { v:"0.941", l:"AUC — hire scoring" },
            { v:"0%",    l:"External calls (RAG)" },
            { v:"3×",    l:"R&D cycle speedup" },
          ].map(({ v, l }) => (
            <div key={l} style={{ background:"#1a1a1a", padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"1.25rem", color:"#23d18b",
                lineHeight:1, marginBottom:5, fontWeight:700 }}>{v}</div>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                color:"#555", letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        #terminal input::selection { background: rgba(38,79,120,0.7); }
        #terminal div::-webkit-scrollbar { display: none; }
        @keyframes termBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media (max-width: 768px) {
          #terminal [style*="repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
