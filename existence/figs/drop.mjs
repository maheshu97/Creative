// Fig 1. A drop tower: the ball's fall is a series of stages with no first stage (§2.2, Zeno run backwards).
import * as k from "../../vendor/anatomy/iso-kit.mjs";
import * as G from "../../vendor/anatomy/lathe.mjs";
import { DROP } from "../model.mjs";

const W = 500, H = 500;
const PLATE = { x: -78, y: -62, w: 156, d: 124, r: 6 };
const COL = { x: -6, y: -50, w: 12, d: 12, r: 1.5 };
const COL_TOP = 236;
const STRIP = { x: -5, y: -38, w: 10, d: 0.9, r: 0.3 };
const BALL = [0, -24];
const BALL_R = 5;
const MAG_Z = 214;
const TOP = MAG_Z - BALL_R; // ball centre when held
const CUP_Z = 6;
const REST = CUP_Z + BALL_R - 1.4; // ball centre in the cup
const DIST = TOP - REST; // world units for DROP.height metres
const MARKS = 18;
const markZ = (n) => TOP - DIST / 2 ** n;
const GATE_Z = markZ(1);
const BOX = { x: 26, y: 8, w: 40, d: 30, r: 2 };

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -16, 0), [COL.x, COL.y, COL_TOP + 2], [0, -22, COL_TOP]],
  W, H, { pad: 22, azimuth: 52 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -16, 10, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 16))) {
    out.push(S(k.cylinder(x, y, 6.4, -16, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.8, -14.4, 4.4, P, 28), { tone: "mid" }));
    out.push(L(k.knurl(x, y, 4.8, -14.4, -10, 22, P), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -10, 10, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Spirit level along the front edge.
  const level = { x: -54, y: 46, w: 34, d: 7, r: 3 };
  out.push(S(k.slabOf(level, 0, 2.4, P, 4, 0.4), { tone: "mid" }));
  const vial = { x: -46, y: 48, w: 18, d: 3, r: 1.5 };
  out.push(L(k.planOutline(vial, 2.4, P, 4), { tone: "lo" }));
  out.push(L(k.lineOnTop([-39.5, 48], [-39.5, 51], 2.4, P) + k.lineOnTop([-34.5, 48], [-34.5, 51], 2.4, P), { tone: "mid" }));
  out.push(L(k.ring(-37, 49.5, 1.2, 2.4, P, 14), { tone: "hi" }));
  // Label plate.
  const label = { x: -6, y: 44, w: 26, d: 11, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[-2, 47, 16], [-2, 49.5, 12], [-2, 52, 14]].map(([x, y, w]) => k.lineOnTop([x, y], [x + w, y], 0.8, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([-4, 46, 0.8]), at([18, 53, 0.8])], { size: 0.4 }));
  return out.join("");
}

function cup() {
  const out = [];
  out.push(S(k.cylinder(BALL[0], BALL[1], 12, 0, 1.6, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(BALL[0], BALL[1], 9.5, 1.6, CUP_Z - 1.6, P, 40, 0.5), { tone: "mid" }));
  out.push(L(k.ring(BALL[0], BALL[1], 7.2, CUP_Z, P, 36), { tone: "lo" }));
  out.push(L(k.ring(BALL[0], BALL[1], 4.4, CUP_Z, P, 28), { tone: "faint" }));
  out.push(L(k.sideArc(BALL[0], BALL[1], 9.5, 3.8, P, 24), { tone: "faint" }));
  out.push(D(k.circleRing(BALL[0], BALL[1], 10.8, 6).map(([x, y]) => at([x, y, 1.6])), { size: 0.4 }));
  return out.join("");
}

function column() {
  const out = [];
  // Foot flange with four bolts.
  const flange = k.insetPlan(COL, -6);
  out.push(S(k.slabOf(flange, 0, 4, P, 4, 0.6), { tone: "mid" }));
  out.push(D(k.corners(flange, 2.6).map(([x, y]) => at([x, y, 4])), { size: 0.5, tone: "hi" }));
  out.push(S(k.slabOf(COL, 4, COL_TOP - 4, P, 3, 0.6), { tone: "mid", inner: L([60, 160].map((z) => k.sideSeam(COL, z, P, 3)).join(""), { tone: "faint" }) }));
  // Scale strip on the front face, with a centimetre scale on its left edge.
  out.push(S(k.slabOf(STRIP, 10, TOP + 6 - 10, P, 2), { tone: "lo", crease: "none" }));
  const face = STRIP.y + STRIP.d;
  const per5 = (DIST / DROP.height) * 0.05;
  let minor = "", major = "";
  for (let i = 0; REST + i * per5 <= TOP + 0.01; i++) {
    const z = REST + i * per5;
    const len = i % 5 === 0 ? 3.2 : 1.6;
    const d = k.segment([STRIP.x, face, z], [STRIP.x + len, face, z], P);
    if (i % 5 === 0) major += d; else minor += d;
  }
  out.push(L(minor, { tone: "lo" }), L(major, { tone: "mid" }));
  out.push(D([at([0, face, 13]), at([0, face, TOP + 3])], { size: 0.35 }));
  return out.join("");
}

// The halving marks: ticks growing from the strip's right edge, at 1/2, 1/4, 1/8 ... of the fall from the top.
function marks() {
  const face = STRIP.y + STRIP.d;
  const out = [];
  for (let n = 1; n <= MARKS; n++) {
    const len = Math.max(1.1, 6.2 - (n - 1) * 0.7);
    const z = markZ(n);
    out.push(`<path class="iso-line" data-mark="${n}" data-tone="lo" d="${k.segment([STRIP.x + STRIP.w, face, z], [STRIP.x + STRIP.w - len, face, z], P)}"/>`);
  }
  return out.join("");
}

function head() {
  const out = [];
  const arm = { x: -4.5, y: -40, w: 9, d: 22, r: 1.5 };
  out.push(S(k.slabOf({ x: -8, y: -54, w: 16, d: 16, r: 2 }, 220, 12, P, 3, 0.5), { tone: "mid" }));
  out.push(D([at([-4, -38, 226]), at([4, -38, 226])].map((p) => p), { size: 0.45 }));
  out.push(S(k.slabOf(arm, 222, 6, P, 3, 0.5), { tone: "mid" }));
  out.push(D([at([0, -34, 228]), at([0, -22, 228])], { size: 0.45 }));
  // Electromagnet: housing, coil band, pole face.
  out.push(S(k.cylinder(0, -24, 5.6, MAG_Z + 2, 6, P, 32, 0.4), { tone: "mid", inner: L(k.sideArc(0, -24, 5.6, MAG_Z + 5, P, 20), { tone: "faint" }) }));
  out.push(L(k.knurl(0, -24, 5.6, MAG_Z + 2.4, MAG_Z + 4.6, 24, P), { tone: "lo" }));
  out.push(S(k.cylinder(0, -24, 3.4, MAG_Z, 2, P, 24), { tone: "lo" }));
  // Release knob on the head block.
  out.push(S(k.slabOf({ x: 8, y: -48, w: 3, d: 4, r: 0.8 }, 224, 4, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(14, -46, 3.4, 222, 8, P, 24), { tone: "mid" }));
  out.push(L(k.knurl(14, -46, 3.4, 222, 230, 20, P), { tone: "lo" }));
  out.push(L(k.lineOnTop([14, -46], [17, -46], 230, P), { tone: "hi" }));
  return out.join("");
}

function gate() {
  const out = [];
  const z = GATE_Z - 4;
  out.push(S(k.slabOf({ x: -9, y: -53, w: 18, d: 18, r: 2 }, z - 2, 12, P, 3, 0.5), { tone: "mid" }));
  out.push(D([at([-5, -35, z + 10]), at([5, -35, z + 10])], { size: 0.45 }));
  // Thumb screw on the clamp's right side.
  out.push(S(k.slabOf({ x: 9, y: -46, w: 3, d: 4, r: 0.8 }, z + 2, 4, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(14, -44, 2.8, z + 1, 6, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(14, -44, 2.8, z + 1, z + 7, 16, P), { tone: "lo" }));
  // The fork: two arms either side of the ball's path, emitter and receiver.
  for (const x of [-13, 9]) {
    out.push(S(k.slabOf({ x, y: -36, w: 4, d: 22, r: 1 }, z, 8, P, 2, 0.4), { tone: "mid" }));
  }
  out.push(S(k.slabOf({ x: -13, y: -38, w: 26, d: 4, r: 1 }, z, 8, P, 2, 0.4), { tone: "mid" }));
  out.push(`<g data-part="beam">${D([at([9, -24, GATE_Z])], { size: 0.9, tone: "lo" })}</g>`);
  out.push(D([at([13, -16, z + 8]), at([13, -32, z + 8])], { size: 0.4 }));
  return out.join("");
}

function timer() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(BOX, 0, 2, P)}" style="filter:blur(4px)"/>`);
  out.push(S(k.slabOf(BOX, 0, 16, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(BOX, 3, P, 4), { tone: "faint" }) }));
  const win = { x: BOX.x + 5, y: BOX.y + 5, w: 22, d: 10, r: 1 };
  out.push(S(k.slabOf(win, 16, 0.4, P, 3), { tone: "lo", crease: "none" }));
  out.push(`<g data-part="digits">${L([0, 1, 2, 3].map((i) => k.lineOnTop([win.x + 3 + i * 4.6, win.y + 3], [win.x + 3 + i * 4.6, win.y + 7], 16.4, P)).join(""), { tone: "faint", free: true })}</g>`);
  out.push(S(k.cylinder(BOX.x + 8, BOX.y + 22, 3, 16, 2.2, P, 20), { tone: "hi" }));
  out.push(S(k.cylinder(BOX.x + 18, BOX.y + 22, 3, 16, 2.2, P, 20), { tone: "mid" }));
  out.push(D(k.corners(BOX, 2).map(([x, y]) => at([x, y, 16])), { size: 0.4 }));
  // Cable from the gate fork down to the box, ending on terminal dots.
  out.push(k.wireSvg(at([BOX.x + 33, BOX.y + 4, 16]), at([11, -14, GATE_Z - 4]), { via: [at([BOX.x + 33, BOX.y + 4, 40]), at([11, -6, 60])], tone: "lo" }));
  return out.join("");
}

const ball = () => S(G.sphereOf([BALL[0], BALL[1], 0], BALL_R, P), { tone: "hi", className: "drop-ball" });

export function build() {
  const svg = k.figureSvg({
    width: W, height: H,
    label: "A ball-drop tower. A ball hangs from an electromagnet at the top of a column and falls one metre into a cup. A strip on the column carries marks at a half, a quarter, an eighth and so on of the fall, measured from the top; the marks crowd without end toward the release point. A light gate at the halfway mark is wired to a timer.",
    body: [
      base(), timer(), column(), marks(), gate(), cup(),
      `<g data-part="ball" transform="${k.translateAlong(P, [0, 0, TOP])}">${ball()}</g>`,
      head(),
    ],
  });
  const html = k.plateHtml({
    fig: "Fig 1",
    title: "No first step",
    hint: "Drag up or down · Space drops",
    readout: "held · 1.000 m to fall",
    keys: [
      { mark: "lit", label: "The ball" },
      { mark: "raised", label: "Marks at ½, ¼, ⅛ … of the fall, crowding toward the top" },
    ],
    caption: `The ball falls ${DROP.height.toFixed(2)} m in ${DROP.fallTime().toFixed(3)} s and crosses the halfway gate at ${DROP.timeAt(0.5).toFixed(3)} s. Before it reaches the ½ mark it must pass the ¼ mark, before that the ⅛ mark, and so on with no end. Every mark it has passed has another before it, so there is no first stage. Shown 8× slower than real time.`,
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Ball drop: drag or use the arrow keys to move through the fall; Space drops the ball" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0">${svg}</div>`,
  });
  return { id: "fig-drop", html, live, constants: { P, TOP, REST, DIST, MARKS, BALL_R, height: DROP.height, g: DROP.g, slow: 8 } };
}

function live(root, C) {
  const stage = root.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const ball = svg.querySelector('[data-part="ball"]');
  const beam = svg.querySelector('[data-part="beam"] .iso-dots');
  const ticks = [...svg.querySelectorAll("[data-mark]")];
  const T = Math.sqrt((2 * C.height) / C.g);
  let t = 0, target = 0, clock = 0, shown = -1;
  const guard = tourGuard(() => { clock = 0; kick(); });
  // Tour: hold, fall at 1/8 speed, rest in the cup, lift back.
  const HOLD = 1.4, FALL = T * C.slow, REST = 1.8, LIFT = 1.2, LOOP = HOLD + FALL + REST + LIFT;
  const tourAt = (s) => {
    s %= LOOP;
    if (s < HOLD) return { t: 0, lift: 0 };
    if (s < HOLD + FALL) return { t: (s - HOLD) / C.slow, lift: 0 };
    if (s < HOLD + FALL + REST) return { t: T, lift: 0 };
    return { t: T, lift: ease((s - HOLD - FALL - REST) / LIFT) };
  };
  let lift = 0;
  function draw() {
    const fallen = Math.min(C.height, 0.5 * C.g * t * t);
    const z = lift > 0 ? C.REST + (C.TOP - C.REST) * lift : C.TOP - (fallen / C.height) * C.DIST;
    ball.setAttribute("transform", translateAlong(C.P, [0, 0, z]));
    const share = (C.TOP - z) / C.DIST;
    const passed = share <= 0 ? C.MARKS + 1 : Math.ceil(Math.log2(1 / share) - 1e-9);
    if (passed !== shown) {
      shown = passed;
      ticks.forEach((tick, i) => tick.setAttribute("data-tone", i + 1 >= passed ? "hi" : "lo"));
    }
    const near = Math.abs(share - 0.5) < 0.03 && lift === 0;
    beam.setAttribute("data-tone", near ? "hi" : "lo");
    let text;
    if (lift > 0) text = "resetting";
    else if (t <= 0) text = "held · " + C.height.toFixed(3) + " m to fall";
    else if (t >= T) text = "landed at " + T.toFixed(3) + " s · every mark passed, none first";
    else text = "t " + t.toFixed(3) + " s · fallen " + (fallen * 100).toFixed(1) + " cm · last mark 1/" + 2 ** passed + " · marks before it ∞";
    say(root, text);
    stage.setAttribute("aria-valuenow", String(Math.round((t / T) * 1000)));
  }
  const kick = animate(stage, (dt, calm) => {
    if (guard.touring) {
      clock += dt;
      const pose = tourAt(clock);
      t = pose.t; lift = pose.lift; target = t;
    } else {
      lift = 0;
      t = calm ? target : follow(t, target, dt, 0.12, calm);
      if (Math.abs(t - target) < 1e-4) t = target;
    }
    draw();
    return guard.touring || t !== target;
  });
  const steer = (next) => { guard.hold(); target = clamp(next, 0, T); kick(); };
  stage.addEventListener("pointermove", (event) => {
    const box = svg.getBoundingClientRect();
    const share = clamp(((event.clientY - box.top) / box.height - 0.08) / 0.78, 0, 1);
    const fallen = share * C.height;
    steer(Math.sqrt((2 * fallen) / C.g));
  });
  stage.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? T / 4 : T / 20;
    let to = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") to = target + step;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") to = target - step;
    if (event.key === "Home") to = 0;
    if (event.key === "End") to = T;
    if (event.key === " ") { event.preventDefault(); guard.touring = true; clock = HOLD; kick(); return; }
    if (to === null) return;
    event.preventDefault();
    steer(to);
  });
  draw();
}
