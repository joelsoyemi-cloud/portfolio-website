"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import Icon from "./Icon";
import { useCanvasSurface } from "./useCanvasSurface";
import type { CanvasDraw } from "./useCanvasSurface";

const fieldModes = ["Orbit", "Ribbon", "Lattice"] as const;
type FieldMode = (typeof fieldModes)[number];
const tau = Math.PI * 2;
const noise = (index: number, seed: number) => {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
};
type Point = { x: number; y: number };

function ParticleField({ motion }: { motion: boolean }) {
  const [mode, setMode] = useState<FieldMode>("Orbit");
  const [seed, setSeed] = useState(1);
  const [bursts, setBursts] = useState(0);
  const points = useRef<Point[]>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const clock = useRef(0);
  const burst = useRef({ time: -10, seed: 0 });
  const down = useRef<Point | null>(null);
  const moved = useRef(false);

  const draw = useCallback<CanvasDraw>((ctx, width, height, seconds, animating) => {
    clock.current += seconds;
    const time = clock.current;
    const centerX = width * 0.5;
    const centerY = height * 0.48;
    const radius = Math.min(width * 0.34, height * 0.37);
    const rotation = time * 0.22 + seed * 0.7;
    ctx.fillStyle = "#102e29";
    ctx.fillRect(0, 0, width, height);
    const halo = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.6);
    halo.addColorStop(0, "#285b454d");
    halo.addColorStop(1, "#102e2900");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#accb9b18";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 1.3, radius * 0.4, -0.3, 0, tau);
    ctx.stroke();
    const count = 216;
    const scatter = Math.exp(-(time - burst.current.time) * 2.4);
    for (let i = 0; i < count; i++) {
      const unit = i / (count - 1);
      let x = 0, y = 0, depth = 0;
      if (mode === "Orbit") {
        const vertical = 1 - 2 * unit;
        const ring = Math.sqrt(1 - vertical * vertical);
        const angle = i * 2.399963 + rotation;
        depth = Math.sin(angle) * ring;
        const perspective = 1 / (1 - depth * 0.18);
        x = Math.cos(angle) * ring * radius * perspective;
        y = vertical * radius * perspective;
      } else if (mode === "Ribbon") {
        const lane = Math.floor(i / 72);
        const along = (i % 72) / 71;
        const angle = along * Math.PI * 4 + rotation + lane * 0.32;
        x = (along - 0.5) * Math.min(width * 0.78, radius * 2.8);
        y = Math.sin(angle) * radius * 0.65 + (lane - 1) * 18;
        depth = Math.cos(angle);
      } else {
        const col = i % 18;
        const row = Math.floor(i / 18);
        x = (col - 8.5) * radius * 0.115;
        y = (row - 5.5) * radius * 0.115;
        const angle = rotation * 0.35;
        const rx = x * Math.cos(angle) - y * Math.sin(angle);
        y = x * Math.sin(angle) + y * Math.cos(angle);
        x = rx;
        depth = Math.sin(col * 0.6 + row * 0.4 + time) * 0.8;
        y += depth * 13;
      }
      let targetX = centerX + x;
      let targetY = centerY + y;
      if (pointer.current.active) {
        const dx = targetX - pointer.current.x;
        const dy = targetY - pointer.current.y;
        const distance = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, 1 - distance / 125) ** 2 * 58;
        targetX += dx / distance * push;
        targetY += dy / distance * push;
      }
      const blastAngle = noise(i, burst.current.seed + 3) * tau;
      targetX += Math.cos(blastAngle) * scatter * radius * noise(i, seed) * 1.1;
      targetY += Math.sin(blastAngle) * scatter * radius * noise(i, seed) * 1.1;
      if (!points.current[i]) points.current[i] = { x: targetX, y: targetY };
      const point = points.current[i];
      const ease = animating ? Math.min(1, seconds * 9) : 1;
      point.x += (targetX - point.x) * ease;
      point.y += (targetY - point.y) * ease;
      if (i > 0 && i % 3 === 0) {
        const previous = points.current[i - 1];
        if (Math.hypot(point.x - previous.x, point.y - previous.y) < radius * 0.43) {
          ctx.strokeStyle = "#bce2ab25";
          ctx.beginPath();
          ctx.moveTo(previous.x, previous.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }
      const warm = noise(i, seed) > 0.79;
      ctx.globalAlpha = 0.45 + (depth + 1) * 0.26;
      ctx.fillStyle = warm ? "#eac1a1" : "#c5efb0";
      ctx.shadowColor = warm ? "#d6a68b" : "#bfe9a6";
      ctx.shadowBlur = depth > 0.4 ? 8 : 0;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.4 + (depth + 1) * 1.25, 0, tau);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [mode, seed]);
  const { canvas, redraw } = useCanvasSurface(motion, draw);

  function scatter() {
    burst.current = { time: clock.current, seed: burst.current.seed + 1 };
    setBursts(value => value + 1);
    redraw();
  }
  function track(event: PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    if (down.current && Math.hypot(event.clientX - down.current.x, event.clientY - down.current.y) > 5) moved.current = true;
    redraw();
  }
  return (
    <article className="creative-card particle-card" aria-labelledby="particle-title">
      <div className="particle-stage">
        <canvas ref={canvas} aria-hidden="true" />
        <div className="field-overlay" aria-hidden="true">
          <span>FIG. 01 — A SMALL UNIVERSE</span><span>216 POINTS / ENDLESS POSSIBILITIES</span>
        </div>
        <button className="canvas-touch" type="button" aria-label="Scatter the particle universe" aria-describedby="particle-hint"
          onPointerDown={event => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            moved.current = false;
            down.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
            track(event);
          }}
          onPointerMove={track}
          onPointerUp={() => { down.current = null; pointer.current.active = false; redraw(); }}
          onPointerLeave={() => { if (!down.current) { pointer.current.active = false; redraw(); } }}
          onPointerCancel={() => { down.current = null; pointer.current.active = false; moved.current = false; redraw(); }}
          onClick={() => { if (!moved.current) scatter(); moved.current = false; }}
        />
        <span className="field-bottom" aria-hidden="true">{motion ? "LIVE" : "STILL BEAUTIFUL WHEN PAUSED"}<i />{mode.toUpperCase()}</span>
      </div>
      <div className="particle-info">
        <span className="experiment-kicker">01 / GENERATIVE PLAY</span>
        <h3 id="particle-title">A universe.<br /><em>At your fingertips.</em></h3>
        <p id="particle-hint">Move through the field to bend it. Tap to scatter it. Give it a completely different shape.</p>
        <div className="experiment-options field-modes" role="group" aria-label="Particle shape">
          {fieldModes.map(value => <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value}</button>)}
        </div>
        <button type="button" className="experiment-remix" onClick={() => { setSeed(value => value + 1); scatter(); }}><Icon name="spark" /> Remix the universe <Icon name="upRight" /></button>
        <div className="experiment-footnote"><span>EDITION {String(seed).padStart(3, "0")}</span><span role="status">{bursts ? bursts + " little big bang" + (bursts === 1 ? "" : "s") : "GO ON. MAKE A LITTLE CHAOS."}</span></div>
      </div>
    </article>
  );
}

const posterPalettes = ["Clay", "Jade", "Electric"] as const;
const posterPrompts = ["what if?", "make waves.", "why not?", "stay curious.", "play is work."];
function TypePlayground() {
  const [text, setText] = useState("what if?");
  const [font, setFont] = useState("Editorial");
  const [stretch, setStretch] = useState(100);
  const [palette, setPalette] = useState<(typeof posterPalettes)[number]>("Clay");
  const prompt = useRef(0);
  return (
    <article className="creative-card type-card" aria-labelledby="type-title">
      <div className="experiment-card-heading"><span className="experiment-kicker">02 / TYPE AS MATERIAL</span><span aria-hidden="true">Aa ↗</span></div>
      <div className={"type-poster poster-" + palette.toLowerCase() + " font-" + font.toLowerCase() + (text.length > 14 ? " poster-long" : "")} style={{ "--type-stretch": stretch / 100 } as CSSProperties}>
        <span className="poster-meta" aria-hidden="true">THE CURIOSITY DEPARTMENT<span>EST. IN PLAY</span></span>
        <div className="poster-word" role="img" aria-label={"Typography poster: " + (text || "your words here")}>
          <span className="poster-echo" aria-hidden="true">{text || "your words"}</span>
          <span aria-hidden="true">{text || "your words"}</span>
        </div>
        <span className="poster-bottom" aria-hidden="true">A SMALL CHANGE OF TYPE.<span>A WHOLE NEW FEELING.</span></span>
      </div>
      <div className="experiment-card-body">
        <h3 id="type-title">Words with a personality.</h3>
        <p>Your words. Your proportions. Your little piece of graphic design.</p>
        <label className="poster-input-label">Make it say something<input type="text" maxLength={22} value={text} onChange={event => setText(event.target.value)} aria-label="Poster text" spellCheck={false} /></label>
        <div className="type-control-row">
          <div className="experiment-options" role="group" aria-label="Poster typeface">{["Editorial", "Grotesk"].map(value => <button key={value} type="button" aria-pressed={font === value} onClick={() => setFont(value)}>{value}</button>)}</div>
          <div className="poster-swatches" role="group" aria-label="Poster palette">{posterPalettes.map(value => <button type="button" key={value} className={"swatch-" + value.toLowerCase()} aria-pressed={palette === value} aria-label={value + " palette"} onClick={() => setPalette(value)}><span className="sr-only">{value}</span></button>)}</div>
        </div>
        <label className="experiment-range">Stretch <input type="range" min={75} max={115} value={stretch} onChange={event => setStretch(Number(event.target.value))} aria-label="Type stretch" /><output>{stretch}%</output></label>
        <button className="text-remix" type="button" onClick={() => { prompt.current = (prompt.current + 1) % posterPrompts.length; setText(posterPrompts[prompt.current]); }}>Give me a new thought <Icon name="arrow" /></button>
      </div>
    </article>
  );
}

type Pebble = { x: number; y: number; vx: number; vy: number; radius: number; color: string; angle: number };
const pebbleColors = ["#bbb0e0", "#d3e5b3", "#e8b2a4", "#b6cbe3", "#e5d8a7"];
function makePebbles(width: number, height: number): Pebble[] {
  return Array.from({ length: 5 }, (_, i) => ({ x: width * (0.16 + i * 0.17), y: height * (0.24 + i % 2 * 0.16), vx: (i - 2) * 18, vy: 0, radius: Math.min(32, width / 12) + i % 2 * 3, color: pebbleColors[i], angle: i * 0.8 }));
}
function GravityPlayground({ motion }: { motion: boolean }) {
  const bodies = useRef<Pebble[]>([]);
  const initialized = useRef(false);
  const size = useRef({ width: 0, height: 0 });
  const drag = useRef<{ index: number; x: number; y: number; time: number } | null>(null);
  const didDrag = useRef(false);
  const force = useRef(1);
  const shakeCount = useRef(0);
  const [gravity, setGravity] = useState(1);
  const [count, setCount] = useState(5);

  const draw = useCallback<CanvasDraw>((ctx, width, height, seconds, animating) => {
    if (!initialized.current) { bodies.current = makePebbles(width, height); initialized.current = true; }
    if (size.current.width && (size.current.width !== width || size.current.height !== height)) {
      for (const body of bodies.current) { body.x *= width / size.current.width; body.y *= height / size.current.height; body.radius = Math.min(body.radius, width / 9); }
    }
    size.current = { width, height };
    const floor = height - 17;
    if (animating) {
      for (let i = 0; i < bodies.current.length; i++) {
        const body = bodies.current[i];
        if (drag.current?.index === i) continue;
        body.vy += 850 * force.current * seconds;
        body.x += body.vx * seconds;
        body.y += body.vy * seconds;
        body.angle += body.vx * seconds * 0.012;
        body.vx *= Math.exp(-0.3 * seconds);
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < bodies.current.length; i++) {
          for (let j = i + 1; j < bodies.current.length; j++) {
            const a = bodies.current[i], b = bodies.current[j];
            const dx = b.x - a.x, dy = b.y - a.y;
            const distance = Math.hypot(dx, dy) || 0.1;
            const overlap = a.radius + b.radius - distance;
            if (overlap <= 0) continue;
            const nx = distance === 0.1 && dx === 0 ? 1 : dx / distance, ny = dy / distance;
            const inverseA = drag.current?.index === i ? 0 : 1;
            const inverseB = drag.current?.index === j ? 0 : 1;
            const total = inverseA + inverseB;
            if (!total) continue;
            a.x -= nx * overlap * inverseA / total;
            a.y -= ny * overlap * inverseA / total;
            b.x += nx * overlap * inverseB / total;
            b.y += ny * overlap * inverseB / total;
            const speed = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (speed < 0) {
              const impulse = -1.65 * speed / total;
              a.vx -= impulse * nx * inverseA; a.vy -= impulse * ny * inverseA;
              b.vx += impulse * nx * inverseB; b.vy += impulse * ny * inverseB;
            }
          }
        }
      }
    }
    ctx.fillStyle = "#e9e5ef";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#c7bfd4";
    ctx.font = "italic " + Math.min(width * 0.19, 105) + "px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("let it fall.", width * 0.5, height * 0.53);
    ctx.strokeStyle = "#d3ccdd";
    ctx.beginPath(); ctx.moveTo(18, floor + 1); ctx.lineTo(width - 18, floor + 1); ctx.stroke();
    for (const body of bodies.current) {
      if (body.x < body.radius) { body.x = body.radius; body.vx = Math.abs(body.vx) * 0.75; }
      if (body.x > width - body.radius) { body.x = width - body.radius; body.vx = -Math.abs(body.vx) * 0.75; }
      if (body.y < body.radius) { body.y = body.radius; body.vy = Math.abs(body.vy) * 0.6; }
      if (body.y > floor - body.radius) {
        body.y = floor - body.radius;
        body.vy = Math.abs(body.vy) < 35 ? 0 : -Math.abs(body.vy) * 0.64;
        body.vx *= 0.96;
      }
      ctx.save();
      ctx.translate(body.x, body.y); ctx.rotate(body.angle);
      const paint = ctx.createRadialGradient(-body.radius * 0.35, -body.radius * 0.45, 1, 0, 0, body.radius * 1.2);
      paint.addColorStop(0, "#fffef8"); paint.addColorStop(0.33, body.color); paint.addColorStop(1, body.color);
      ctx.fillStyle = paint; ctx.shadowColor = "#30204426"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 7;
      ctx.beginPath(); ctx.arc(0, 0, body.radius, 0, tau); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.strokeStyle = "#ffffff60"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, body.radius * 0.72, -2.6, -0.7); ctx.stroke();
      ctx.restore();
    }
  }, []);
  const { canvas, redraw } = useCanvasSurface(motion, draw);

  function add(x?: number, y?: number) {
    const bounds = canvas.current?.getBoundingClientRect();
    if (!bounds || bodies.current.length >= 18) return;
    if (!initialized.current) { bodies.current = makePebbles(bounds.width, bounds.height); initialized.current = true; }
    const index = bodies.current.length;
    bodies.current.push({ x: x ?? bounds.width * 0.5, y: y ?? 45, vx: (noise(index, 2) - 0.5) * 160, vy: -60, radius: Math.min(20 + noise(index, 4) * 13, bounds.width / 10), color: pebbleColors[index % pebbleColors.length], angle: noise(index, 5) * tau });
    setCount(bodies.current.length); redraw();
  }
  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    let index = -1;
    for (let i = bodies.current.length - 1; i >= 0; i--) {
      const body = bodies.current[i];
      if (Math.hypot(body.x - x, body.y - y) <= body.radius + 8) { index = i; break; }
    }
    didDrag.current = false;
    if (index >= 0) { drag.current = { index, x, y, time: performance.now() }; event.currentTarget.setPointerCapture(event.pointerId); }
  }
  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    const now = performance.now();
    const elapsed = Math.max((now - drag.current.time) / 1000, 0.016);
    const body = bodies.current[drag.current.index];
    if (!body) return;
    if (Math.hypot(x - drag.current.x, y - drag.current.y) > 2) didDrag.current = true;
    body.vx = Math.max(-1000, Math.min(1000, (x - drag.current.x) / elapsed));
    body.vy = Math.max(-1000, Math.min(1000, (y - drag.current.y) / elapsed));
    body.x = x; body.y = y;
    drag.current = { index: drag.current.index, x, y, time: now }; redraw();
  }
  function nudge(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const body = bodies.current[bodies.current.length - 1];
    if (!body) return;
    const dx = event.key === "ArrowLeft" ? -25 : event.key === "ArrowRight" ? 25 : 0;
    const dy = event.key === "ArrowUp" ? -30 : event.key === "ArrowDown" ? 30 : 0;
    body.x += dx; body.y += dy; body.vx += dx * 8; body.vy += dy * 8; redraw();
  }
  return (
    <article className="creative-card gravity-card" aria-labelledby="gravity-title">
      <div className="experiment-card-heading"><span className="experiment-kicker">03 / A LITTLE WEIGHT</span><span aria-hidden="true">↓</span></div>
      <div className="gravity-stage">
        <canvas ref={canvas} aria-hidden="true" />
        <button type="button" className="canvas-touch" aria-label="Drop a pebble in the gravity sandbox" aria-describedby="gravity-hint" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; didDrag.current = true; }} onKeyDown={nudge}
          onClick={event => {
            if (didDrag.current) { didDrag.current = false; return; }
            const bounds = event.currentTarget.getBoundingClientRect();
            add(event.detail === 0 ? undefined : event.clientX - bounds.left, event.detail === 0 ? undefined : event.clientY - bounds.top);
          }} />
        <span className="gravity-stamp" aria-hidden="true">HANDLE WITH CURIOSITY.</span>
      </div>
      <div className="experiment-card-body">
        <h3 id="gravity-title">Good ideas have a little weight.</h3>
        <p id="gravity-hint">Tap to drop. Drag to throw. Enter adds a pebble; arrow keys nudge the newest one.</p>
        <div className="gravity-actions"><button type="button" onClick={() => add()} disabled={count >= 18}>Drop a pebble <span aria-hidden="true">+</span></button><button type="button" onClick={() => {
          shakeCount.current++;
          bodies.current.forEach((body, index) => { body.vx = (noise(index, shakeCount.current) - 0.5) * 850; body.vy = -200 - noise(index, shakeCount.current + 1) * 480; if (!motion) { body.x = body.radius + noise(index, shakeCount.current) * Math.max(0, size.current.width - body.radius * 2); body.y = body.radius + noise(index, shakeCount.current + 1) * Math.max(0, size.current.height - body.radius * 2 - 17); } }); redraw();
        }}>Shake it ↗</button><button className="gravity-reset" type="button" onClick={() => { drag.current = null; bodies.current = makePebbles(size.current.width, size.current.height); setCount(5); redraw(); }}>Reset</button></div>
        <label className="experiment-range">Gravity <input type="range" min={0.2} max={2} step={0.1} value={gravity} onChange={event => { const value = Number(event.target.value); setGravity(value); force.current = value; redraw(); }} aria-label="Gravity strength" /><output>{gravity.toFixed(1)}×</output></label>
        <div className="experiment-footnote"><span role="status">{count} / 18 PEBBLES</span><span>{motion ? "A TINY WORLD, REAL CONSEQUENCES." : "MOTION PAUSED · YOU CAN STILL ARRANGE THEM."}</span></div>
      </div>
    </article>
  );
}

export default function CreativePlayground({ motion }: { motion: boolean }) {
  return <div className="creative-playground"><ParticleField motion={motion} /><TypePlayground /><GravityPlayground motion={motion} /></div>;
}
