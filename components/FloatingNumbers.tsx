"use client";
import { useEffect, useRef } from "react";

const SYMBOLS = [
  // binary / weights
  "0","1","0","1","0","1","0","1",
  // decimals / model scores
  "0.94","0.82","-0.31","0.001","1.0","0.5","−1","0.0","3e−4",
  // Greek / math chars
  "π","e","σ","∇","λ","μ","Σ","θ","α","β","δ","φ","ε",
  // ML formulas
  "∂L/∂w","∇L","σ(x)","e^x","W^T","tanh","ReLU","softmax",
  "AUC","0.941","R²","0.89","f(x)","ŷ","p(z|x)","p(x|θ)",
  "KL(p‖q)","argmax","log p","1/n","Σwᵢxᵢ","E[x]","tanh(z)",
  // vector similarity & search
  "cos θ","sim(q,d)","‖v‖","‖x−y‖²","v₁·v₂","dot(q,k)",
  "top-k","k-NN","ANN","HNSW","IVF","FAISS","recall@k",
  "dim=768","embed[]","[CLS]","L2 dist","inner·prod",
  "argmin d","cosine","normalize","quantize","INT8",
  // database / index patterns
  "index[]","query→","←match","shard","cluster",
  "0xFFE","nprobe=8","ef=64","M=16","nlist=256",
];

interface Particle {
  x: number; y: number; speed: number;
  char: string; opacity: number; size: number;
  hue: number; // 0=blue, 1=green
}

export default function FloatingNumbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COUNT = 75;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (y?: number): Particle => ({
      x:       rand(0, window.innerWidth),
      y:       y ?? rand(0, window.innerHeight),
      speed:   rand(0.15, 0.55),
      char:    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      opacity: rand(0.025, 0.065),
      size:    rand(8, 13),
      hue:     Math.random() < 0.65 ? 0 : 1, // 65% blue, 35% green
    });

    const particles: Particle[] = Array.from({ length: COUNT }, () => spawn());

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const color = p.hue === 0 ? "74,158,255" : "61,186,126";
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = `rgb(${color})`;
        ctx.font        = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillText(p.char, p.x, p.y);
        p.y -= p.speed;
        if (p.y < -30) {
          // respawn at bottom with new character
          const fresh = spawn(window.innerHeight + 20);
          Object.assign(p, fresh);
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
