"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let raf: number;
    const W = el.clientWidth  || window.innerWidth;
    const H = el.clientHeight || window.innerHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 0, 20);

    /* ── Neural network layers ── */
    const LAYERS   = [4, 7, 10, 10, 7, 4, 2];
    const LAYER_GAP = 3.4;
    const totalWidth = (LAYERS.length - 1) * LAYER_GAP;

    type NodeData = { mesh: THREE.Mesh; pos: THREE.Vector3; phase: number };
    const nodesByLayer: NodeData[][] = [];

    const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);

    LAYERS.forEach((count, li) => {
      const layer: NodeData[] = [];
      const x    = -totalWidth / 2 + li * LAYER_GAP;
      const vGap = Math.min(1.8, 9 / count);

      for (let ni = 0; ni < count; ni++) {
        const y     = (ni - (count - 1) / 2) * vGap;
        const z     = (Math.random() - 0.5) * 0.6;
        const phase = Math.random() * Math.PI * 2;

        const mat  = new THREE.MeshBasicMaterial({ color: 0x39d9b4, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(nodeGeo, mat);
        const pos  = new THREE.Vector3(x, y, z);
        mesh.position.copy(pos);
        scene.add(mesh);
        layer.push({ mesh, pos, phase });
      }
      nodesByLayer.push(layer);
    });

    /* ── Edges ── */
    for (let li = 0; li < LAYERS.length - 1; li++) {
      for (const a of nodesByLayer[li]) {
        for (const b of nodesByLayer[li + 1]) {
          const geo = new THREE.BufferGeometry().setFromPoints([a.pos, b.pos]);
          const mat = new THREE.LineBasicMaterial({ color: 0x39d9b4, transparent: true, opacity: 0.04 });
          scene.add(new THREE.Line(geo, mat));
        }
      }
    }

    /* ── Signal pulses ── */
    type Pulse = { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; t: number; spd: number };
    const pulses: Pulse[] = [];
    const pulseGeo = new THREE.SphereGeometry(0.09, 6, 6);

    const spawnPulse = (): Pulse => {
      const li = Math.floor(Math.random() * (LAYERS.length - 1));
      const a  = nodesByLayer[li][Math.floor(Math.random() * nodesByLayer[li].length)];
      const b  = nodesByLayer[li + 1][Math.floor(Math.random() * nodesByLayer[li + 1].length)];
      const mat  = new THREE.MeshBasicMaterial({ color: 0x39d9b4, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(pulseGeo, mat);
      scene.add(mesh);
      return { mesh, from: a.pos.clone(), to: b.pos.clone(), t: Math.random(), spd: 0.008 + Math.random() * 0.014 };
    };

    for (let i = 0; i < 28; i++) pulses.push(spawnPulse());

    /* ── Animation loop ── */
    let time = 0;
    const animate = () => {
      raf  = requestAnimationFrame(animate);
      time += 0.004;

      // Lazy camera orbit
      camera.position.x = Math.sin(time * 0.11) * 2.5;
      camera.position.y = Math.sin(time * 0.07) * 1.2;
      camera.lookAt(0, 0, 0);

      // Node pulse
      nodesByLayer.forEach(layer =>
        layer.forEach(n => {
          const g = 0.2 + 0.65 * (0.5 + 0.5 * Math.sin(time * 1.3 + n.phase));
          (n.mesh.material as THREE.MeshBasicMaterial).opacity = g;
        })
      );

      // Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.spd;
        if (p.t >= 1) {
          scene.remove(p.mesh);
          (p.mesh.material as THREE.Material).dispose();
          p.mesh.geometry.dispose();
          pulses.splice(i, 1);
          pulses.push(spawnPulse());
        } else {
          p.mesh.position.lerpVectors(p.from, p.to, p.t);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p.t * Math.PI) * 0.95;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      const W2 = el.clientWidth;
      const H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}
