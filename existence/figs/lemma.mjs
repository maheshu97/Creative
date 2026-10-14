// Fig 4. The lemma (§4.4): a tank holding exactly 100% of probability pays the same share p into
// one cup per century, on a belt that runs back into an endless past. Any p above zero runs dry.
import * as k from "../../vendor/anatomy/iso-kit.mjs";
import * as G from "../../vendor/anatomy/lathe.mjs";
import { LEMMA } from "../model.mjs";

const W = 600, H = 330;
const PLATE = { x: -176, y: -92, w: 262, d: 128, r: 7 };
const BELT = { x: -160, y: -12, w: 228, d: 24, r: 2 };
const BELT_Z = 10, BELT_TOP = 14;
const X_DISP = 44, PITCH = 21, SLOTS = 11;
const CUP_R = 6.2, CUP_H = 9, CUP_TOP = BELT_TOP + CUP_H;
const TANK = { x: 26, y: -84, w: 36, d: 30, r: 3 };
const TANK_Z = 44, TANK_H = 64;
const GLASS = { y0: -78, y1: -71, z0: TANK_Z + 6, z1: TANK_Z + TANK_H - 6 };
const PIPE_Z = TANK_Z + 6;
const NOZZLE_Z = CUP_TOP + 9;

const P = k.fitProjection([...k.boxCorners(PLATE, -15, 0), [TANK.x, TANK.y, TANK_Z + TANK_H + 6], [TANK.x + TANK.w, TANK.y + TANK.d, TANK_Z + TANK_H + 6]], W, H, { pad: 22, azimuth: 58 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const Y = [0, 1, 0];

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -15, 10, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 16))) {
    out.push(S(k.cylinder(x, y, 7, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -13.4, 3.4, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -10, 10, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Century ruler along the front of the belt: one major tick per cup pitch.
  const strip = { x: BELT.x + 4, y: BELT.y + BELT.d + 8, w: BELT.w - 8, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  let minor = "", major = "";
  for (let x = X_DISP; x >= strip.x + 2; x -= PITCH / 3) {
    const big = Math.abs(((X_DISP - x) / PITCH) % 1) < 0.01;
    const d = k.lineOnTop([x, strip.y + 0.8], [x, strip.y + (big ? 4.2 : 2.2)], 0.6, P);
    if (big) major += d; else minor += d;
  }
  out.push(L(minor, { tone: "lo" }), L(major, { tone: "mid" }));
  out.push(D([at([X_DISP, strip.y + 5.6, 0.6])], { size: 0.8, tone: "hi" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  return out.join("");
}

function stand() {
  const out = [];
  const legs = k.corners(TANK, 4);
  for (const [x, y] of byDepth(legs)) {
    out.push(S(k.cylinder(x, y, 3.4, 0, 1.6, P, 20), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 2, 1.6, TANK_Z - 1.6, P, 16), { tone: "mid", inner: L(k.sideArc(x, y, 2, 22, P, 10), { tone: "faint" }) }));
  }
  const frame = k.insetPlan(TANK, -2);
  out.push(S(k.slabOf(frame, TANK_Z - 3, 3, P, 4, 0.5), { tone: "mid" }));
  out.push(D(legs.map(([x, y]) => at([x, y, TANK_Z])), { size: 0.45 }));
  return out.join("");
}

function tank() {
  const out = [];
  const seams = [TANK_Z + 16, TANK_Z + 48].map((z) => k.sideSeam(TANK, z, P, 4)).join("");
  out.push(S(k.slabOf(TANK, TANK_Z, TANK_H, P, 4, 1), { tone: "mid", inner: L(seams, { tone: "faint" }) }));
  // Lid with a filler cap and bolts.
  const lid = k.insetPlan(TANK, 2);
  out.push(S(k.slabOf(lid, TANK_Z + TANK_H, 1.6, P, 4, 0.4), { tone: "mid" }));
  out.push(D(k.corners(lid, 2.5).map(([x, y]) => at([x, y, TANK_Z + TANK_H + 1.6])), { size: 0.45, tone: "hi" }));
  const cx = TANK.x + 12, cy = TANK.y + 15;
  out.push(S(k.cylinder(cx, cy, 5, TANK_Z + TANK_H + 1.6, 3, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(cx, cy, 5, TANK_Z + TANK_H + 1.6, TANK_Z + TANK_H + 4.6, 26, P), { tone: "lo" }));
  // Sight glass on the +x face, with a 0-100% scale hanging from its frame.
  const gx = TANK.x + TANK.w;
  out.push(S(k.slabOf({ x: gx, y: GLASS.y0 - 2, w: 1.6, d: GLASS.y1 - GLASS.y0 + 4, r: 0.6 }, GLASS.z0 - 2, GLASS.z1 - GLASS.z0 + 4, P, 2), { tone: "mid" }));
  const face = gx + 1.6;
  out.push(`<path class="iso-fill" style="fill:var(--anatomy-shade-1)" d="${k.pathOf([[face, GLASS.y0, GLASS.z0], [face, GLASS.y1, GLASS.z0], [face, GLASS.y1, GLASS.z1], [face, GLASS.y0, GLASS.z1]].map(at), true)}"/>`);
  out.push(`<path data-part="level" style="fill:var(--anatomy-lit)" d=""/>`);
  out.push(L(k.pathOf([[face, GLASS.y0, GLASS.z0], [face, GLASS.y1, GLASS.z0], [face, GLASS.y1, GLASS.z1], [face, GLASS.y0, GLASS.z1]].map(at), true), { tone: "lo" }));
  let minor = "", major = "";
  for (let i = 0; i <= 10; i++) {
    const z = GLASS.z0 + ((GLASS.z1 - GLASS.z0) * i) / 10;
    const d = k.segment([face, GLASS.y1, z], [face, GLASS.y1 + (i % 5 === 0 ? 4 : 2.2), z], P);
    if (i % 5 === 0) major += d; else minor += d;
  }
  out.push(L(minor, { tone: "lo" }), L(major, { tone: "mid" }));
  out.push(D([at([face, GLASS.y0 + 3.5, GLASS.z0 - 1]), at([face, GLASS.y0 + 3.5, GLASS.z1 + 1])], { size: 0.4 }));
  // Engraved capacity on the tank's front face.
  out.push(k.faceTextSvg(k.sideMatrix([TANK.x + 18, TANK.y + TANK.d], TANK_Z + 34, P, "left"), "100%", { size: 4.2, tone: "lo", anchor: "middle" }));
  return out.join("");
}

function pipe() {
  const out = [];
  const F = G.frameAlong([X_DISP, 0, PIPE_Z], Y);
  const from = TANK.y + TANK.d;
  out.push(S(G.disc(from - 0, from + 2, 4.2, F, P), { tone: "mid" }));
  out.push(S(G.disc(from + 2, -6, 2.2, F, P), { tone: "mid" }));
  // Valve body and handle partway along.
  out.push(S(G.disc(-34, -26, 3.8, F, P), { tone: "mid" }));
  out.push(S(k.cylinder(X_DISP, -30, 1.2, PIPE_Z + 3.8, 4, P, 12), { tone: "mid" }));
  out.push(S(k.slabOf({ x: X_DISP - 7, y: -31.2, w: 14, d: 2.4, r: 1 }, PIPE_Z + 7.8, 1.6, P, 2), { tone: "hi" }));
  // Elbow and the nozzle down to the cups.
  out.push(S(G.sphereOf([X_DISP, -4.6, PIPE_Z], 3, P), { tone: "mid" }));
  out.push(S(k.cylinder(X_DISP, -4.6, 2.2, NOZZLE_Z + 2, PIPE_Z - NOZZLE_Z - 2.6, P, 16), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(X_DISP, -4.6, 3, NOZZLE_Z, 2, P, 20), { tone: "mid" }));
  return out.join("");
}

function rail(y) {
  const out = [];
  const plan = { x: BELT.x - 4, y, w: BELT.w + 8, d: 4, r: 1 };
  out.push(S(k.slabOf(plan, 0, BELT_TOP - 1, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(plan, 5, P, 3), { tone: "faint" }) }));
  out.push(D([BELT.x + 2, BELT.x + BELT.w / 2, BELT.x + BELT.w - 2].map((x) => at([x, y + 2, BELT_TOP - 1])), { size: 0.45 }));
  return out.join("");
}

function beltSurface() {
  const out = [];
  out.push(S(k.slabOf(BELT, BELT_Z, BELT_TOP - BELT_Z, P, 3), { tone: "lo", crease: "none" }));
  for (const x of [BELT.x + 1, BELT.x + BELT.w - 1]) {
    out.push(S(G.disc(BELT.y - 0.5, BELT.y + BELT.d + 0.5, 2.4, G.frameAlong([x, 0, BELT_Z + 2], Y), P), { tone: "mid" }));
  }
  return out.join("");
}

function cup(i) {
  const x = X_DISP - i * PITCH;
  const rim = k.ring(x, -4.6, CUP_R - 1, CUP_TOP, P, 32);
  return `<g data-slot="${i}">${S(k.cylinder(x, -4.6, CUP_R, BELT_TOP, CUP_H, P, 36, 0.4), { tone: "hi", inner: L(k.sideArc(x, -4.6, CUP_R, BELT_TOP + 2, P, 20), { tone: "faint" }) })}${L(rim, { tone: "lo" })}<path data-liquid style="fill:var(--anatomy-lit);display:none" d="${k.ring(x, -4.6, CUP_R - 1.6, CUP_TOP, P, 28)}"/></g>`;
}

export function build() {
  const svg = k.figureSvg({
    width: W, height: H,
    label: "A tank on a stand holds exactly 100% of probability, with a sight glass on its side. A pipe and nozzle pour into cups on a conveyor belt below, one cup for each century, moving away into the past. Each cup receives the same share. When the tank is empty, every earlier century gets nothing.",
    body: [
      base(), rail(BELT.y - 4), stand(), tank(), beltSurface(),
      `<g data-belt>${Array.from({ length: SLOTS + 1 }, (_, j) => cup(SLOTS - 1 - j)).join("")}</g>`,
      `<path data-part="stream" class="iso-line" data-tone="lit" style="stroke-width:1.6;display:none" d="${k.segment([X_DISP, -4.6, NOZZLE_Z], [X_DISP, -4.6, CUP_TOP], P)}"/>`,
      pipe(),
      rail(BELT.y + BELT.d),
    ],
  });
  const choices = LEMMA.choices.map((p, j) => `<button type="button" class="seg" data-p="${p}" aria-pressed="${j === 1}">${p === 0 ? "0" : (p * 100).toString() + "%"}</button>`).join("");
  const controls = `<div class="controls"><div class="group"><span class="label">Each century gets</span>${choices}</div><div class="group"><button type="button" class="act" data-restart>Refill and run</button></div></div>`;
  const html = k.plateHtml({
    fig: "Fig 4",
    title: "The probability budget",
    hint: "Pick a share per century",
    readout: "1% per century · 0 centuries paid · tank 100%",
    keys: [
      { mark: "lit", label: "Probability: in the tank and in each cup" },
      { mark: "raised", label: "Cups: one per century, present at the nozzle" },
    ],
    caption: "The tank holds all the probability there is, 100%, because E happens at most once (i). Indifference (iii) says no century may get less than the present one. At 10% the tank is dry after 10 centuries, at 1% after 100, at 0.1% after 1,000, and an infinite past (ii) always has more centuries waiting. Only a share of exactly zero can be paid to every century, and then the present century gets zero too.",
    body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Probability budget: left and right arrows change the share per century, Space restarts">${svg}</div>`,
  }).replace("<figcaption", controls + "<figcaption");
  return {
    id: "fig-lemma", html, live,
    constants: { P, SLOTS, PITCH, X_DISP, choices: LEMMA.choices, glass: [TANK.x + TANK.w + 1.6, GLASS.y0, GLASS.y1, GLASS.z0, GLASS.z1], beltEnds: [BELT.x + 4, BELT.x + BELT.w - 2] },
  };
}

function live(root, C) {
  const stage = root.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const beltGroup = svg.querySelector("[data-belt]");
  const slots = new Map([...svg.querySelectorAll("[data-slot]")].map((g) => [Number(g.dataset.slot), g]));
  const level = svg.querySelector('[data-part="level"]');
  const stream = svg.querySelector('[data-part="stream"]');
  const buttons = [...root.querySelectorAll("[data-p]")];
  const [gx, gy0, gy1, gz0, gz1] = C.glass;
  let p = 0.01, c = 0, t = 0, auto = true, hold = 0, shownWhole = -1;
  const guard = tourGuard(() => { auto = true; kick(); }, 5000);
  const paidAfter = (whole) => (p > 0 ? Math.min(whole + 1, Math.ceil(1 / p - 1e-9)) : 0);
  const broke = () => p > 0 && Math.floor(c) + 1 > Math.ceil(1 / p - 1e-9);
  function choose(next, byUser) {
    p = next; c = 0; t = 0; hold = 0; shownWhole = -1;
    if (byUser) auto = false;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.p) === p)));
  }
  function draw() {
    const whole = Math.floor(c), frac = c - whole;
    beltGroup.setAttribute("transform", translateAlong(C.P, [-frac * C.PITCH, 0, 0]));
    for (const [i, g] of slots) {
      const x = C.X_DISP - i * C.PITCH - frac * C.PITCH;
      const edge = Math.min(x - C.beltEnds[0], C.beltEnds[1] - x);
      g.style.opacity = String(clamp(edge / 14, 0, 1));
    }
    if (whole !== shownWhole) {
      shownWhole = whole;
      const paid = paidAfter(whole);
      for (const [i, g] of slots) {
        const century = whole - i; // centuries counted back from the present (0)
        const full = century >= 0 && century < paid && p > 0;
        g.querySelector("[data-liquid]").style.display = full ? "" : "none";
      }
    }
    const paid = paidAfter(whole);
    const left = Math.max(0, 1 - paid * p);
    const z = gz0 + (gz1 - gz0) * left;
    level.setAttribute("d", left > 0 ? "M" + [[gx, gy0, gz0], [gx, gy1, gz0], [gx, gy1, z], [gx, gy0, z]].map((q) => iso(q, C.P).map((v) => v.toFixed(1)).join(" ")).join("L") + "Z" : "");
    stream.style.display = p > 0 && !broke() && frac < 0.45 ? "" : "none";
    const share = p === 0 ? "0%" : (p * 100) + "%";
    let text;
    if (p === 0) text = `0% per century · ${fmtInt(whole + 1)} centuries paid nothing · tank 100%`;
    else if (broke()) text = `${share} per century · tank dry after ${fmtInt(Math.ceil(1 / p - 1e-9))} · century ${fmtInt(Math.ceil(1 / p - 1e-9) + 1)} gets nothing`;
    else text = `${share} per century · ${fmtInt(paid)} centur${paid === 1 ? "y" : "ies"} paid · tank ${(left * 100).toFixed(p < 0.01 ? 1 : 0)}%`;
    say(root, text);
  }
  const kick = animate(stage, (dt, calm) => {
    if (hold > 0) {
      hold -= dt;
      if (hold <= 0 && auto && guard.touring) {
        const i = C.choices.indexOf(p);
        choose(C.choices[(i + 1) % C.choices.length], false);
      }
      draw();
      return hold > 0 || (auto && guard.touring);
    }
    t += dt;
    const speed = Math.min(90, 1.4 * Math.pow(1.4, t));
    c += (calm ? 30 : speed) * dt;
    const end = p > 0 ? Math.ceil(1 / p) + 6 : 40;
    if (c >= end) { c = end; hold = 3.2; }
    draw();
    return true;
  });
  buttons.forEach((b) => b.addEventListener("click", () => { guard.hold(); choose(Number(b.dataset.p), true); kick(); }));
  root.querySelector("[data-restart]").addEventListener("click", () => { guard.hold(); choose(p, true); kick(); });
  stage.addEventListener("keydown", (event) => {
    const i = C.choices.indexOf(p);
    if (event.key === "ArrowRight" && i < C.choices.length - 1) { event.preventDefault(); guard.hold(); choose(C.choices[i + 1], true); kick(); }
    if (event.key === "ArrowLeft" && i > 0) { event.preventDefault(); guard.hold(); choose(C.choices[i - 1], true); kick(); }
    if (event.key === " ") { event.preventDefault(); guard.hold(); choose(p, true); kick(); }
  });
  choose(0.01, false);
  draw();
}
