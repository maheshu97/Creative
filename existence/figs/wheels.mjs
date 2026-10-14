// Fig 2. Three index wheels on one crank: a bounded system with 7 × 9 × 11 = 693 states must come back (§3, Poincaré recurrence).
import * as k from "../../vendor/anatomy/iso-kit.mjs";
import * as G from "../../vendor/anatomy/lathe.mjs";
import { WHEELS } from "../model.mjs";

const W = 600, H = 330;
const N = WHEELS.notches;
const R = N.map((n) => 2.4 * n + 7);
const GAP = 9;
const CX = [];
{ let x = -104; N.forEach((_, i) => { if (i) x += R[i - 1] + GAP + R[i]; CX.push(x); }); }
const PLATE = { x: CX[0] - R[0] - 16, y: -78, w: CX[2] + R[2] + 44 - (CX[0] - R[0] - 16), d: 140, r: 7 };
const WZ = 10, WH = 7, WTOP = WZ + WH;
const SHAFT_Y = -60, SHAFT_Z = 13, SHAFT_R = 2.4;
const SHAFT_X0 = PLATE.x + 10, SHAFT_X1 = PLATE.x + PLATE.w - 14;
const CRANK_X = SHAFT_X1 + 2, CRANK_R = 9;
const ARM_Z = WTOP + 4;
const LAMP_Y = 39;

const P = k.fitProjection([...k.boxCorners(PLATE, -15, 0), [CX[1], 0, ARM_Z + 6], [CRANK_X, SHAFT_Y, SHAFT_Z + CRANK_R + 4]], W, H, { pad: 28, azimuth: 40 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const X = [1, 0, 0];

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -15, 10, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 18))) {
    out.push(S(k.cylinder(x, y, 7, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -13.4, 3.4, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -10, 10, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Ruler strip along the front edge.
  const strip = { x: CX[0] - 20, y: PLATE.y + PLATE.d - 14, w: CX[2] - CX[0] + 20, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // Label plate at the front right.
  const label = { x: CX[2] + 4, y: PLATE.y + PLATE.d - 26, w: 30, d: 14, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[4, 4, 20], [4, 7, 14], [4, 10, 17]].map(([dx, dy, w]) => k.lineOnTop([label.x + dx, label.y + dy], [label.x + dx + w, label.y + dy], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([label.x + 2, label.y + 2, 0.8]), at([label.x + label.w - 2, label.y + label.d - 2, 0.8])], { size: 0.4 }));
  return out.join("");
}

function lamps() {
  const out = [];
  N.forEach((_, i) => {
    const x = CX[i];
    out.push(S(k.cylinder(x, LAMP_Y, 4.6, 0, 1.4, P, 24), { tone: "lo" }));
    out.push(`<g data-lamp="${i}">${S(k.cylinder(x, LAMP_Y, 3, 1.4, 2.6, P, 24, 0.4), { tone: "mid" })}</g>`);
    out.push(D(k.circleRing(x, LAMP_Y, 3.9, 4).map(([px, py]) => at([px, py, 1.4])), { size: 0.35 }));
  });
  return out.join("");
}

function shaft() {
  const out = [];
  out.push(S(G.disc(SHAFT_X0, CRANK_X, SHAFT_R, G.frameAlong([0, SHAFT_Y, SHAFT_Z], X), P), { tone: "mid" }));
  const blocks = [SHAFT_X0 + 2, ...CX, SHAFT_X1 - 4];
  for (const bx of blocks) {
    const plan = { x: bx - 5, y: SHAFT_Y - 7, w: 10, d: 14, r: 1.5 };
    out.push(S(k.slabOf(plan, 0, SHAFT_Z + 5, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam(plan, SHAFT_Z, P, 3), { tone: "faint" }) }));
    out.push(D([at([bx - 2.5, SHAFT_Y - 4, SHAFT_Z + 5]), at([bx + 2.5, SHAFT_Y + 4, SHAFT_Z + 5])], { size: 0.45 }));
    out.push(S(k.cylinder(bx, SHAFT_Y, 2.6, SHAFT_Z + 5, 1.2, P, 16), { tone: "lo" }));
  }
  return out.join("");
}

function crank() {
  const F = G.frameAlong([CRANK_X, SHAFT_Y, SHAFT_Z], X);
  const out = [];
  out.push(S(G.disc(0, 3, CRANK_R, F, P), { tone: "mid" }));
  out.push(L(G.circleOf(G.frameAlong([CRANK_X + 3, SHAFT_Y, SHAFT_Z], X), 0, CRANK_R - 2, P, 48), { tone: "faint" }));
  out.push(D([at([CRANK_X + 3, SHAFT_Y, SHAFT_Z])], { size: 0.6, tone: "hi" }));
  return out.join("");
}

const handleAt = (phi) => [CRANK_X + 3, SHAFT_Y + Math.sin(phi) * (CRANK_R - 2), SHAFT_Z + Math.cos(phi) * (CRANK_R - 2)];

function wheel(i) {
  const x = CX[i], r = R[i];
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - r, y: -r, w: 2 * r, d: 2 * r, r }, WZ, 0.1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.cylinder(x, 0, 7, 0, 3, P, 32), { tone: "lo" }));
  out.push(S(k.cylinder(x, 0, 4.6, 3, WZ - 3, P, 28), { tone: "mid" }));
  out.push(S(k.cylinder(x, 0, r, WZ, WH, P, 72, 0.8), { tone: "hi", crease: "lo", inner: L(k.sideArc(x, 0, r, WZ + 2.4, P, 48), { tone: "faint" }) }));
  out.push(L(k.ring(x, 0, r - 7, WTOP, P, 64), { tone: "faint" }));
  out.push(`<g data-wheel="${i}"></g>`);
  out.push(S(k.cylinder(x, 0, 5, WTOP, 2.2, P, 28, 0.4), { tone: "mid" }));
  out.push(D([at([x, 0, WTOP + 2.2])], { size: 0.6, tone: "hi" }));
  return out.join("");
}

// The index arm reaches from the wheel's bearing block over the back of its rim: the fixed mark each gate returns to.
function arm(i) {
  const x = CX[i], r = R[i];
  const out = [];
  out.push(S(k.cylinder(x, SHAFT_Y, 2.2, SHAFT_Z + 6.2, ARM_Z - SHAFT_Z - 6.2, P, 16), { tone: "mid" }));
  const tipY = -r + 9;
  out.push(S(k.slabOf({ x: x - 2, y: SHAFT_Y - 3, w: 4, d: tipY - SHAFT_Y + 3, r: 1 }, ARM_Z, 2, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at([x, SHAFT_Y, ARM_Z + 2])], { size: 0.5, tone: "hi" }));
  out.push(L(k.lineOnTop([x, tipY - 6], [x, tipY - 0.6], ARM_Z + 2, P), { tone: "hi" }));
  return out.join("");
}

export function build() {
  const svg = k.figureSvg({
    width: W, height: H,
    label: "Three index wheels with 7, 9 and 11 notches stand on a base, driven by one crank shaft behind them. Every turn of the crank moves each wheel on by one notch. Each wheel carries a gate line, and a fixed arm marks where the gate started. Lamps in front light when a wheel's gate is home.",
    body: [base(), lamps(), shaft(), crank(), `<g data-part="handle"></g>`, ...[0, 1, 2].map((i) => wheel(i) + arm(i))],
  });
  const states = WHEELS.states;
  const controls = `<div class="controls"><div class="group"><span class="label">Crank</span><button type="button" class="seg" data-turn="1">+1 turn</button><button type="button" class="seg" data-turn="10">+10</button><button type="button" class="seg" data-turn="100">+100</button></div><div class="group"><button type="button" class="act" data-run>Run until it repeats</button></div></div>`;
  const html = k.plateHtml({
    fig: "Fig 2",
    title: "Bounded, so it returns",
    hint: "Drag sideways to crank",
    readout: `turn 0 · state 0·0·0 · repeats in ${states}`,
    keys: [
      { mark: "lit", label: "Gate on each wheel" },
      { mark: "raised", label: "Fixed arm: where the gate started" },
    ],
    caption: `Each crank turn advances the wheels by one notch each. The machine has only 7 × 9 × 11 = ${states} possible states, a bounded phase space, so it must revisit a state, and because each step can be undone it comes back to its very first state at turn ${states}, then again at ${2 * states}, and forever after. A system whose state can run off without limit, like two particles flying apart, need never return.`,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Recurrence wheels: drag sideways or use the arrow keys to turn the crank" aria-valuemin="0" aria-valuemax="${states}" aria-valuenow="0">${svg}</div>`,
  }).replace("<figcaption", controls + "<figcaption");
  return { id: "fig-wheels", html, live, constants: { P, N, R, CX, WTOP, states, handle: [CRANK_X + 3, SHAFT_Y, SHAFT_Z, CRANK_R - 2] } };
}

function live(root, C) {
  const stage = root.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const marks = C.N.map((_, i) => svg.querySelector(`[data-wheel="${i}"]`));
  const lamps = C.N.map((_, i) => svg.querySelector(`[data-lamp="${i}"] .iso-solid`));
  const handle = svg.querySelector('[data-part="handle"]');
  const [hx, hy, hz, hr] = C.handle;
  let c = 0, target = 0, clock = 0, base = 0, drawn = -1;
  const guard = tourGuard(() => { base = Math.round(c) % C.states; clock = 0; kick(); });
  const stepOf = (turns) => Math.floor(turns) + ease(clamp((turns - Math.floor(turns) - 0.45) / 0.5, 0, 1));
  const tourAt = (s) => {
    const loop = 17;
    s %= loop;
    if (s < 6) return s * 0.8;
    if (s < 14) return 4.8 + (C.states - 4.8) * ease((s - 6) / 8);
    return C.states;
  };
  function wheelPath(i, steps) {
    const x = C.CX[i], r = C.R[i], n = C.N[i];
    const turn = -(steps / n) * Math.PI * 2;
    let ticks = "";
    for (let j = 0; j < n; j++) {
      const a = turn + (j / n) * Math.PI * 2;
      ticks += lineOnTop([x + Math.sin(a) * (r - 1.2), -Math.cos(a) * (r - 1.2)], [x + Math.sin(a) * (r - 4.6), -Math.cos(a) * (r - 4.6)], C.WTOP, C.P);
    }
    const gate = lineOnTop([x + Math.sin(turn) * 5.4, -Math.cos(turn) * 5.4], [x + Math.sin(turn) * (r - 1), -Math.cos(turn) * (r - 1)], C.WTOP + 0.1, C.P);
    const notch = iso([x + Math.sin(turn) * (r - 2.6), -Math.cos(turn) * (r - 2.6), C.WTOP], C.P);
    return `<path class="iso-line" data-tone="mid" d="${ticks}"/><path class="iso-line" data-tone="lit" style="stroke-width:1.2" d="${gate}"/><circle cx="${notch[0].toFixed(1)}" cy="${notch[1].toFixed(1)}" r="1.1" style="fill:var(--anatomy-lit)"/>`;
  }
  function draw() {
    const steps = stepOf(c);
    if (steps !== drawn) {
      drawn = steps;
      marks.forEach((g, i) => { g.innerHTML = wheelPath(i, steps); });
    }
    const phi = c * Math.PI * 2;
    const tip = iso([hx, hy + Math.sin(phi) * hr, hz + Math.cos(phi) * hr], C.P), hub = iso([hx, hy, hz], C.P);
    handle.innerHTML = `<path class="iso-line" data-tone="hi" style="stroke-width:1.6" d="M${hub[0].toFixed(1)} ${hub[1].toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}"/><circle cx="${tip[0].toFixed(1)}" cy="${tip[1].toFixed(1)}" r="2.2" style="fill:var(--anatomy-face);stroke:var(--anatomy-hi);stroke-width:.7"/>`;
    const turn = Math.floor(c + 1e-6);
    const state = C.N.map((n) => ((turn % n) + n) % n);
    lamps.forEach((lamp, i) => { if (state[i] === 0) lamp.setAttribute("data-lit", ""); else lamp.removeAttribute("data-lit"); });
    const left = C.states - (turn % C.states);
    const text = turn > 0 && turn % C.states === 0
      ? `turn ${turn.toLocaleString("en-US")} · state 0·0·0 · back at the start`
      : `turn ${turn.toLocaleString("en-US")} · state ${state.join("·")} · repeats in ${left}`;
    say(root, text);
    stage.setAttribute("aria-valuenow", String(turn % C.states));
  }
  const kick = animate(stage, (dt, calm) => {
    if (guard.touring) { clock += dt; c = base + tourAt(clock); target = c; }
    else {
      const speed = Math.max(1.2, Math.abs(target - c) * 2.2);
      const delta = clamp(target - c, -speed * dt, speed * dt);
      c = calm ? target : c + delta;
      if (Math.abs(target - c) < 1e-4) c = target;
    }
    draw();
    return guard.touring || c !== target;
  });
  const turnBy = (n) => { guard.hold(); target = Math.round(target) + n; kick(); };
  root.querySelectorAll("[data-turn]").forEach((b) => b.addEventListener("click", () => turnBy(Number(b.dataset.turn))));
  root.querySelector("[data-run]").addEventListener("click", () => {
    const now = Math.round(target);
    turnBy((C.states - (now % C.states)) || C.states);
  });
  let dragFrom = null;
  stage.addEventListener("pointerdown", (event) => { dragFrom = { x: event.clientX, at: target }; stage.setPointerCapture(event.pointerId); });
  stage.addEventListener("pointermove", (event) => {
    if (!dragFrom) return;
    guard.hold();
    const width = svg.getBoundingClientRect().width;
    target = Math.max(0, dragFrom.at + ((event.clientX - dragFrom.x) / width) * 12);
    kick();
  });
  const end = () => { if (dragFrom) { target = Math.max(0, Math.round(target)); dragFrom = null; kick(); } };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);
  stage.addEventListener("keydown", (event) => {
    const n = event.shiftKey ? 10 : 1;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); turnBy(n); }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); if (target >= n) turnBy(-n); }
  });
  draw();
}
