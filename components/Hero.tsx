"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════════
   FLOATING MATH SYMBOLS
════════════════════════════════════════════════════════════════════ */
const MATH_SMALL = [
  "∇θ","σ(z)","∂L/∂w","P(y|x)","E[x]","argmax",
  "KL(P‖Q)","μ±σ","dL/dθ","tanh(z)","α·∇L","Σxᵢ/n","p(z|x)","Q(s,a)","V(π)","∂²f/∂x²",
];
const MATH_LARGE = [
  { sym:"ŷ = f(x ; θ*)",    x:62, y:6  },
  { sym:"∑wᵢxᵢ + b",        x:4,  y:16 },
  { sym:"∂L/∂w = δ · xᵀ",  x:68, y:35 },
  { sym:"P(hire|x) = 0.97", x:54, y:60 },
  { sym:"ReLU(z) = max(0,z)",x:1, y:70 },
  { sym:"λ||θ||² → 0",      x:67, y:78 },
  { sym:"ẑ ~ N(μ, σ²)",     x:77, y:20 },
  { sym:"AUC = 0.941",       x:38, y:10 },
];

function FloatingSymbols() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {MATH_SMALL.map((sym, i) => (
        <span key={sym} style={{
          position:"absolute",
          left:`${2 + (i * 6.1) % 94}%`, top:`${5 + (i * 11.3) % 88}%`,
          fontFamily:"var(--font-mono)", fontSize:"0.65rem",
          color:"var(--accent)", opacity:0, letterSpacing:"0.06em", userSelect:"none",
          animation:`fadeIn ${16 + (i*3.7)%18}s ease-in-out ${(i*1.9)%10}s infinite alternate`,
        }}>{sym}</span>
      ))}
      {MATH_LARGE.map((item, i) => (
        <span key={item.sym} style={{
          position:"absolute", left:`${item.x}%`, top:`${item.y}%`,
          fontFamily:"var(--font-mono)", fontSize:"0.9rem", fontWeight:500,
          color: i%2===0 ? "var(--accent)" : "#9cdcfe",
          opacity:0, letterSpacing:"0.03em", userSelect:"none",
          animation:`fadeIn ${14+(i*3.1)%14}s ease-in-out ${(i*2.3)%8}s infinite alternate`,
        }}>{item.sym}</span>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   NEURAL NETWORK BACKGROUND
════════════════════════════════════════════════════════════════════ */
const LAYERS = [3, 5, 7, 7, 5, 3, 1];

function NeuralNetBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    type Node = { x:number; y:number; layer:number };
    const getNodes = (): Node[] => {
      const W=canvas.width, H=canvas.height, nodes:Node[]=[];
      LAYERS.forEach((count,li) => {
        const x = W*0.05 + (li/(LAYERS.length-1))*W*0.9;
        for (let ni=0; ni<count; ni++) nodes.push({ x, y:H*0.12+((ni+0.5)/count)*H*0.76, layer:li });
      });
      return nodes;
    };
    type Conn={from:number;to:number;baseOpacity:number};
    const getConns=(nodes:Node[]):Conn[]=>{
      const conns:Conn[]=[];
      for(let li=0;li<LAYERS.length-1;li++){
        nodes.filter(n=>n.layer===li).forEach(fn=>{
          nodes.filter(n=>n.layer===li+1).forEach(tn=>{
            conns.push({from:nodes.indexOf(fn),to:nodes.indexOf(tn),baseOpacity:0.04+Math.random()*0.06});
          });
        });
      }
      return conns;
    };
    type Pulse={connIdx:number;progress:number;speed:number;bright:number};
    const pulses:Pulse[]=[]; let frameId:number, lastSpawn=0;
    const AC="57,217,180";
    const draw=(ts:number)=>{
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);
      const nodes=getNodes(), conns=getConns(nodes);
      if(ts-lastSpawn>100&&pulses.length<35){
        pulses.push({connIdx:Math.floor(Math.random()*conns.length),progress:0,speed:0.005+Math.random()*0.01,bright:0.5+Math.random()*0.5});
        lastSpawn=ts;
      }
      conns.forEach(c=>{
        const f=nodes[c.from],t=nodes[c.to];
        ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(t.x,t.y);
        ctx.strokeStyle=`rgba(${AC},${c.baseOpacity})`; ctx.lineWidth=0.6; ctx.stroke();
      });
      for(let i=pulses.length-1;i>=0;i--){
        const p=pulses[i]; p.progress+=p.speed;
        if(p.progress>=1){pulses.splice(i,1);continue;}
        const c=conns[p.connIdx],f=nodes[c.from],t=nodes[c.to];
        const px=f.x+(t.x-f.x)*p.progress, py=f.y+(t.y-f.y)*p.progress;
        const g=ctx.createRadialGradient(px,py,0,px,py,9);
        g.addColorStop(0,`rgba(${AC},${p.bright})`); g.addColorStop(1,`rgba(${AC},0)`);
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(px,py,9,0,Math.PI*2); ctx.fill();
      }
      nodes.forEach(n=>{
        ctx.beginPath(); ctx.arc(n.x,n.y,5,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${AC},0.35)`; ctx.lineWidth=1; ctx.stroke();
        ctx.beginPath(); ctx.arc(n.x,n.y,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(${AC},0.1)`; ctx.fill();
      });
      const out=nodes[nodes.length-1];
      const og=ctx.createRadialGradient(out.x,out.y,0,out.x,out.y,22);
      og.addColorStop(0,`rgba(${AC},0.4)`); og.addColorStop(1,`rgba(${AC},0)`);
      ctx.fillStyle=og; ctx.beginPath(); ctx.arc(out.x,out.y,22,0,Math.PI*2); ctx.fill();
      frameId=requestAnimationFrame(draw);
    };
    frameId=requestAnimationFrame(draw);
    return ()=>{ cancelAnimationFrame(frameId); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />;
}

/* ════════════════════════════════════════════════════════════════════
   WAVEFORM (audio input visualizer)
════════════════════════════════════════════════════════════════════ */
function Waveform({ active }:{ active:boolean }) {
  const bars = Array.from({length:28},(_,i)=>i);
  return (
    <div style={{display:"flex",alignItems:"center",gap:2,height:28,padding:"2px 0"}}>
      {bars.map(i=>(
        <div key={i} style={{
          width:3, borderRadius:2, background:"var(--accent)",
          height:`${active ? 20+Math.abs(Math.sin(i*0.7))*60 : 15}%`,
          opacity: active ? 0.5+(i%4)*0.12 : 0.15,
          transition:"height 0.12s, opacity 0.12s",
          animation: active ? `waveBar ${0.3+(i%5)*0.07}s ease-in-out ${(i%7)*0.04}s infinite alternate` : "none",
        }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   LIVE INFERENCE PANEL
════════════════════════════════════════════════════════════════════ */
type Phase="idle"|"capture"|"diarize"|"infer"|"score"|"done";
const STEPS=[
  {id:"capture", label:"WebRTC audio capture",     ms:"14ms" },
  {id:"diarize", label:"Speaker diarization",      ms:"91ms" },
  {id:"infer",   label:"NLP token inference",      ms:"847ms"},
  {id:"score",   label:"ONNX hire-scorer (INT8)",  ms:"< 2s" },
];

function LiveInferencePanel() {
  const [phase, setPhase]=useState<Phase>("idle");
  const [score, setScore]=useState(0);
  const [barW,  setBarW] =useState(0);

  useEffect(()=>{
    let alive=true;
    const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
    (async()=>{
      await sleep(1200);
      while(alive){
        setPhase("capture"); setScore(0); setBarW(0); await sleep(1400);
        setPhase("diarize"); await sleep(1000);
        setPhase("infer");   await sleep(1200);
        setPhase("score");
        for(let i=0;i<=97;i+=2){ if(!alive) return; setScore(i); setBarW(i); await sleep(18); }
        setScore(97); setBarW(97);
        setPhase("done");    await sleep(3200);
        setPhase("idle");    await sleep(600);
      }
    })();
    return ()=>{ alive=false; };
  },[]);

  const stepDone=(id:string)=>{
    const order=["capture","diarize","infer","score","done"];
    const pi=order.indexOf(phase), si=order.indexOf(id);
    return pi>si || phase==="done";
  };
  const stepActive=(id:string)=>phase===id;

  return (
    <div style={{
      border:"1px solid rgba(255,255,255,0.08)", borderRadius:6,
      background:"rgba(10,10,10,0.82)", backdropFilter:"blur(24px)",
      overflow:"hidden", fontFamily:"var(--font-mono)",
    }}>
      {/* Title bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:8, padding:"9px 14px",
        background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#ff5f57",display:"inline-block"}}/>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#febc2e",display:"inline-block"}}/>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#28c840",display:"inline-block"}}/>
        <span style={{marginLeft:8,fontSize:"0.58rem",color:"#555",letterSpacing:"0.06em"}}>resso-inference · v2.1</span>
        <span style={{marginLeft:"auto",fontSize:"0.52rem",color:phase==="done"?"var(--accent)":"#f59e0b",letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:4}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"currentColor",display:"inline-block",
            animation: phase!=="idle"?"pulse 1s ease infinite":"none"}}/>
          {phase==="idle"?"IDLE":"LIVE"}
        </span>
      </div>

      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
        {/* Audio input */}
        <div>
          <div style={{fontSize:"0.5rem",color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>
            ▪ Audio Input
          </div>
          <Waveform active={phase==="capture"||phase==="diarize"} />
        </div>

        {/* Pipeline steps */}
        <div>
          <div style={{fontSize:"0.5rem",color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>
            ▪ Pipeline
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {STEPS.map(s=>{
              const done=stepDone(s.id), active=stepActive(s.id);
              return (
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.6rem"}}>
                  <span style={{
                    width:14, height:14, borderRadius:2, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0, fontSize:"0.55rem",
                    border: done?"1px solid var(--accent)": active?"1px solid #f59e0b":"1px solid #333",
                    color: done?"var(--accent)": active?"#f59e0b":"#444",
                    background: done?"rgba(57,217,180,0.08)": active?"rgba(245,158,11,0.08)":"transparent",
                  }}>
                    {done?"✓": active?"⟳":"○"}
                  </span>
                  <span style={{color: done?"#ccc": active?"#ccc":"#444", flex:1}}>{s.label}</span>
                  <span style={{color: done?"var(--accent)":"#333", fontSize:"0.52rem"}}>{done||active?s.ms:"—"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score output */}
        <div>
          <div style={{fontSize:"0.5rem",color:"#555",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>
            ▪ Hire Score
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
            <div style={{flex:1,height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
              <div style={{
                height:"100%", width:`${barW}%`, borderRadius:3,
                background:"linear-gradient(90deg, rgba(57,217,180,0.6), var(--accent))",
                transition:"width 0.02s linear",
              }}/>
            </div>
            <span style={{
              fontSize:"0.8rem", fontWeight:700,
              color: score>0?"var(--accent)":"#333", minWidth:34, textAlign:"right",
            }}>
              {score>0?`0.${String(score).padStart(2,"0")}`:"—"}
            </span>
          </div>
          <div style={{
            fontSize:"0.58rem", letterSpacing:"0.06em",
            color: phase==="done"?"var(--accent)":"#444",
            padding:"5px 10px", border:"1px solid",
            borderColor: phase==="done"?"rgba(57,217,180,0.3)":"rgba(255,255,255,0.06)",
            borderRadius:2, background: phase==="done"?"rgba(57,217,180,0.06)":"transparent",
            transition:"all 0.4s",
          }}>
            {phase==="done"
              ? "● RECOMMENDATION: HIRE  ·  confidence 97%"
              : "○ awaiting inference..."}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MINI TERMINAL (auto-typing)
════════════════════════════════════════════════════════════════════ */
type TLine={ prompt?:boolean; text:string; color?:string };
const TERMINAL_SCRIPT: TLine[][] = [
  [
    {prompt:true,  text:"python hire_scorer.py --live --model onnx/int8"},
    {text:"[INFO] Loading onnx/hire_scorer_int8.onnx  (2.3 MB)", color:"#6a6a6a"},
    {text:"[INFO] Connecting to WebRTC stream...",               color:"#6a6a6a"},
    {text:"[INFO] Streaming inference — press Ctrl+C to stop",   color:"#6a6a6a"},
    {text:'{"step":"capture",  "ms":14,  "speakers":2}',         color:"#9cdcfe"},
    {text:'{"step":"diarize",  "ms":91,  "segments":7}',         color:"#9cdcfe"},
    {text:'{"step":"infer",    "ms":847, "tokens":312}',         color:"#9cdcfe"},
    {text:'{"score":0.97, "decision":"HIRE", "latency":"1.8s"}', color:"#23d18b"},
  ],
  [
    {prompt:true,  text:"curl -s api.resso.ai/v1/status | jq"},
    {text:'{',                                                    color:"#d4d4d4"},
    {text:'  "model":   "hire-scorer-v2-int8",',                 color:"#9cdcfe"},
    {text:'  "gpu":     "NVIDIA T4 · CUDA 12.1",',               color:"#9cdcfe"},
    {text:'  "uptime":  "47d 3h 12m",',                          color:"#9cdcfe"},
    {text:'  "requests": 18429,',                                 color:"#9cdcfe"},
    {text:'  "p99_ms":  1847',                                    color:"#23d18b"},
    {text:'}',                                                    color:"#d4d4d4"},
  ],
];

function MiniTerminal() {
  const [lines, setLines] = useState<TLine[]>([]);
  const [typing, setTyping] = useState("");
  const [cursor, setCursor] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    let alive=true;
    const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
    (async()=>{
      await sleep(600);
      let scriptIdx=0;
      while(alive){
        const script=TERMINAL_SCRIPT[scriptIdx%TERMINAL_SCRIPT.length];
        for(const line of script){
          if(!alive)return;
          if(line.prompt){
            // type character by character
            for(let c=0;c<=line.text.length;c++){
              if(!alive)return;
              setTyping(line.text.slice(0,c));
              await sleep(28+Math.random()*22);
            }
            await sleep(200);
            setLines(prev=>[...prev,{prompt:true,text:line.text}]);
            setTyping("");
          } else {
            await sleep(180+Math.random()*120);
            setLines(prev=>[...prev,line]);
          }
        }
        await sleep(2000);
        setLines([]);
        scriptIdx++;
        await sleep(400);
      }
    })();
    const cursorT=setInterval(()=>setCursor(v=>!v),530);
    return ()=>{ alive=false; clearInterval(cursorT); };
  },[]);

  useEffect(()=>{
    if(bodyRef.current) bodyRef.current.scrollTop=bodyRef.current.scrollHeight;
  },[lines,typing]);

  return (
    <div style={{
      border:"1px solid rgba(255,255,255,0.08)", borderRadius:6,
      background:"rgba(10,10,10,0.82)", backdropFilter:"blur(24px)",
      overflow:"hidden", fontFamily:"var(--font-mono)", fontSize:"0.6rem",
    }}>
      {/* Title bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
        background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#ff5f57",display:"inline-block"}}/>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#febc2e",display:"inline-block"}}/>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#28c840",display:"inline-block"}}/>
        <span style={{marginLeft:8,fontSize:"0.56rem",color:"#555",letterSpacing:"0.06em"}}>om@resso-ml — zsh</span>
      </div>
      {/* Body */}
      <div ref={bodyRef} style={{
        padding:"10px 14px", height:148, overflowY:"auto",
        scrollbarWidth:"none", lineHeight:1.7,
      }}>
        {lines.map((l,i)=>(
          <div key={i} style={{display:"flex",gap:0}}>
            {l.prompt&&(
              <span>
                <span style={{color:"#23d18b"}}>om@resso-ml</span>
                <span style={{color:"#555"}}>:~</span>
                <span style={{color:"#ccc"}}>&nbsp;$&nbsp;</span>
              </span>
            )}
            <span style={{color:l.color||"#ccc",whiteSpace:"pre"}}>{l.text}</span>
          </div>
        ))}
        {typing!==undefined&&(
          <div style={{display:"flex"}}>
            <span style={{color:"#23d18b"}}>om@resso-ml</span>
            <span style={{color:"#555"}}>:~</span>
            <span style={{color:"#ccc"}}>&nbsp;$&nbsp;</span>
            <span style={{color:"#d4d4d4"}}>{typing}</span>
            <span style={{color:"var(--accent)",opacity:cursor?1:0}}>▌</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   AI AGENT TICKER
════════════════════════════════════════════════════════════════════ */
const AGENT_STEPS=[
  {icon:"⬡", text:"agent[resso-ai] initialised",                    color:"var(--accent)"},
  {icon:"→", text:"retrieving context from RAG index (42,819 vecs)", color:"var(--muted)"},
  {icon:"→", text:"running hire-scoring inference  [ONNX · INT8]",   color:"var(--muted)"},
  {icon:"✓", text:"score: 0.97  — recommendation: HIRE  ✦",         color:"var(--accent)"},
  {icon:"→", text:"routing result → Slack  #recruiting-pipeline",    color:"var(--muted)"},
  {icon:"●", text:"agent idle — awaiting next candidate",            color:"var(--dim)"},
];

function AgentTicker() {
  const [step,setStep]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setStep(s=>(s+1)%AGENT_STEPS.length),2400);
    return ()=>clearInterval(t);
  },[]);
  const s=AGENT_STEPS[step];
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:8,
      fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.04em",
      padding:"7px 14px", border:"1px solid var(--border)", borderRadius:2,
      background:"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)",
    }}>
      <span style={{color:"var(--accent)",fontSize:"0.7rem"}}>{s.icon}</span>
      <span style={{color:s.color}}>{s.text}</span>
      <span style={{color:"var(--accent)",animation:"pulse 1s ease infinite"}}>_</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const sectionRef=useRef<HTMLElement>(null);
  const wrapRef=useRef<HTMLDivElement>(null);

  const handleMouse=useCallback((e:MouseEvent)=>{
    const wrap=wrapRef.current; if(!wrap)return;
    const rect=wrap.getBoundingClientRect();
    wrap.style.setProperty("--mx",`${e.clientX-rect.left}px`);
    wrap.style.setProperty("--my",`${e.clientY-rect.top}px`);
  },[]);

  useEffect(()=>{
    const el=sectionRef.current; if(!el)return;
    const t=setTimeout(()=>el.querySelectorAll(".reveal").forEach(c=>c.classList.add("visible")),100);
    el.addEventListener("mousemove",handleMouse);
    return ()=>{ clearTimeout(t); el.removeEventListener("mousemove",handleMouse); };
  },[handleMouse]);

  return (
    <section ref={sectionRef} id="hero" style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      justifyContent:"center", position:"relative", overflow:"hidden",
    }}>
      <div ref={wrapRef} className="spotlight-wrap" style={{position:"absolute",inset:0}}/>

      {/* Neural network background */}
      <div style={{position:"absolute",inset:0,opacity:0.65}}>
        <NeuralNetBg/>
      </div>

      {/* Floating math */}
      <div style={{position:"absolute",inset:0,opacity:0.72}}>
        <FloatingSymbols/>
      </div>

      {/* Scan line */}
      <div style={{
        position:"absolute",left:0,right:0,height:"1px",
        background:"linear-gradient(90deg,transparent,rgba(57,217,180,0.12),transparent)",
        animation:"scan 8s linear infinite",pointerEvents:"none",
      }}/>

      {/* ── Content ── */}
      <div className="container" style={{position:"relative",zIndex:2,paddingTop:100,paddingBottom:56}}>

        {/* Status pill */}
        <div className="reveal" style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:32}}>
          <span style={{width:5,height:5,borderRadius:"50%",background:"var(--accent)",
            boxShadow:"0 0 8px var(--accent)",animation:"pulse 2.5s ease infinite"}}/>
          <span className="label" style={{color:"var(--muted)"}}>
            Open to founding roles &amp; AI consulting
          </span>
        </div>

        {/* Two-column layout */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:48,alignItems:"start"}}
          className="hero-grid">

          {/* ── LEFT: identity ── */}
          <div>
            {/* Name */}
            <div className="reveal reveal-d1" style={{lineHeight:0.88,marginBottom:6}}>
              <span style={{
                fontFamily:"var(--font-display)",fontWeight:800,
                fontSize:"clamp(2.6rem,7vw,7.5rem)",letterSpacing:"-0.045em",color:"var(--white)",
              }}>Om kumar</span>
            </div>
            <div className="reveal reveal-d2" style={{lineHeight:0.88,marginBottom:20}}>
              <span style={{
                fontFamily:"var(--font-display)",fontWeight:800,
                fontSize:"clamp(1.8rem,5vw,5.5rem)",letterSpacing:"-0.045em",color:"rgba(255,255,255,0.45)",
              }}>Solanki</span>
              <span style={{
                fontFamily:"var(--font-display)",fontWeight:800,
                fontSize:"clamp(1.8rem,5vw,5.5rem)",letterSpacing:"-0.045em",color:"var(--accent)",
              }}>.</span>
            </div>

            {/* Role tags — sequential teal pulse */}
            <style>{`
              @keyframes tagPulse {
                0%,100% {
                  border-color: rgba(57,217,180,0.18);
                  color: rgba(57,217,180,0.45);
                  background: transparent;
                  box-shadow: none;
                }
                50% {
                  border-color: rgba(57,217,180,0.7);
                  color: #39d9b4;
                  background: rgba(57,217,180,0.09);
                  box-shadow: 0 0 10px rgba(57,217,180,0.18);
                }
              }
            `}</style>
            <div className="reveal reveal-d2" style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:24}}>
              {[
                "Founding Engineer",
                "AI / ML Engineer",
                "AI Consultant",
                "Solutions Architect",
                "Full-Stack Engineer",
              ].map((label, i) => (
                <span key={label} style={{
                  fontFamily:"var(--font-mono)",
                  fontSize:"0.62rem",
                  letterSpacing:"0.07em",
                  textTransform:"uppercase",
                  padding:"6px 13px",
                  borderRadius:"3px",
                  border:"1px solid rgba(57,217,180,0.18)",
                  color:"rgba(57,217,180,0.45)",
                  background:"transparent",
                  animation:`tagPulse 4s ease-in-out ${i * 0.7}s infinite`,
                }}>
                  {label}
                </span>
              ))}
            </div>

            {/* Role */}
            <div className="reveal reveal-d3" style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:28,height:1,background:"var(--accent)",opacity:0.4}}/>
              <span style={{
                fontFamily:"var(--font-mono)",fontSize:"0.6rem",fontWeight:500,
                letterSpacing:"0.1em",color:"var(--accent)",textTransform:"uppercase",
              }}>Founding Engineer @ Resso.ai &nbsp;·&nbsp; AI / ML Architect</span>
            </div>

            {/* Math identity */}
            <div className="reveal reveal-d3" style={{marginBottom:16}}>
              <span style={{fontFamily:"var(--font-mono)",fontSize:"0.64rem",color:"var(--dim)",letterSpacing:"0.04em"}}>
                ŷ = <span style={{color:"var(--accent)",opacity:0.75}}>f</span>(
                <span style={{color:"var(--cream)",opacity:0.55}}>real data</span>
                <span style={{color:"var(--dim)"}}> ; θ*</span>
                ) → <span style={{color:"var(--accent)",opacity:0.75}}>production</span>
              </span>
            </div>

            {/* Agent ticker */}
            <div className="reveal reveal-d3" style={{marginBottom:22}}>
              <AgentTicker/>
            </div>

            {/* Tagline */}
            <p className="reveal reveal-d4 body-lg" style={{maxWidth:440,marginBottom:36}}>
              I build AI systems that run in production — real-time ML pipelines,
              agentic architectures with context memory, and cloud infrastructure
              engineered to handle real-world load.
            </p>

            {/* CTAs */}
            <div className="reveal reveal-d5" style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:48}}>
              <a href="#contact" className="btn btn-primary">
                Start a project
                <svg width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </a>
              <a href="#work"     className="btn btn-ghost">See my work</a>
              <a href="#terminal" className="btn btn-ghost" style={{fontFamily:"var(--font-mono)",fontSize:"0.63rem"}}>
                Run terminal →
              </a>
            </div>

            {/* Metrics */}
            <div className="reveal reveal-d6" style={{
              display:"flex",gap:28,flexWrap:"wrap",
              paddingTop:20,borderTop:"1px solid var(--border)",
            }}>
              {[
                {value:"3+",    label:"Years prod AI"},
                {value:"<2s",   label:"Inference latency"},
                {value:"0.97",  label:"AUC hire-scoring"},
                {value:"3",     label:"Companies built"},
                {value:"0%",    label:"External calls (RAG)"},
              ].map(({value,label})=>(
                <div key={label}>
                  <div style={{fontFamily:"var(--font-display)",fontWeight:800,
                    fontSize:"clamp(1rem,1.8vw,1.5rem)",color:"var(--white)",
                    letterSpacing:"-0.04em",lineHeight:1}}>{value}</div>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:"0.48rem",fontWeight:500,
                    color:"var(--muted)",marginTop:4,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: live demo panels ── */}
          <div className="reveal reveal-d3" style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontSize:"0.5rem",fontFamily:"var(--font-mono)",color:"var(--dim)",
              letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>
              ▸ Live inference — resso-ai
            </div>
            <LiveInferencePanel/>
            <div style={{fontSize:"0.5rem",fontFamily:"var(--font-mono)",color:"var(--dim)",
              letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2,marginTop:4}}>
              ▸ Terminal — om@resso-ml
            </div>
            <MiniTerminal/>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
        display:"flex",flexDirection:"column",alignItems:"center",gap:6,
        opacity:0,animation:"fadeIn 1s ease 2.5s forwards",
      }}>
        <span className="label" style={{fontSize:"0.5rem",letterSpacing:"0.16em"}}>scroll</span>
        <div style={{width:1,height:22,
          background:"linear-gradient(to bottom,var(--accent),transparent)",
          opacity:0.3,animation:"float 2.5s ease-in-out infinite"}}/>
      </div>

      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}
