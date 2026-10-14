// Fig 5. A beam balance doing Bayes (§4.5, §4.4): each pan carries prior × likelihood, renormalised.
// A likelihood of zero empties its pan, however heavy the prior was.
import * as k from "../../vendor/anatomy/iso-kit.mjs";
import * as G from "../../vendor/anatomy/lathe.mjs";
import { DEMONS } from "../model.mjs";

const W = 600, H = 380;
const PLATE = { x: -124, y: -46, w: 248, d: 92, r: 7 };
const PIV = 132, ARM = 86, DROP_ = 62, PAN_R = 24;
const TMAX = (18 * Math.PI) / 180;
const SCALE_Y = 8, NEEDLE = 52;

const P = k.fitProjection([...k.boxCorners(PLATE, -15, 0), [0, 0, PIV + 14], [-ARM - PAN_R, 0, PIV - DROP_ - 10], [ARM + PAN_R, 0, PIV - DROP_ - 10]], W, H, { pad: 26, azimuth: 78 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -15, 10, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 14))) {
    out.push(S(k.cylinder(x, y, 6.4, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.8, -13.4, 3.4, P, 28), { tone: "mid" }));
    out.push(L(k.knurl(x, y, 4.8, -13.4, -10, 22, P), { tone: "lo" }));
  }
  out.push(S(k.slabOf(PLATE, -10, 10, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // Rest pads under each pan.
  for (const x of [-ARM, ARM]) {
    out.push(S(k.cylinder(x, 0, 10, 0, 2, P, 32, 0.4), { tone: "lo" }));
    out.push(L(k.ring(x, 0, 6.5, 2, P, 28), { tone: "faint" }));
  }
  // Tray of spare weights at the front.
  const tray = { x: -36, y: 24, w: 72, d: 16, r: 2 };
  out.push(S(k.slabOf(tray, 0, 4, P, 4, 0.5), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(tray, 1.6), 4, P, 4), { tone: "lo" }));
  [[-26, 3.4, 5], [-14, 3, 4.4], [-3, 2.6, 3.8], [7, 2.2, 3.2], [16, 1.8, 2.6], [24, 1.5, 2]].forEach(([x, r, h]) => {
    out.push(S(k.cylinder(x, 32, r, 2.4, h, P, 24, 0.3), { tone: "mid" }));
    out.push(S(k.cylinder(x, 32, r * 0.35, 2.4 + h, 1.6, P, 12), { tone: "mid" }));
  });
  // Label plate.
  const label = { x: 54, y: 22, w: 30, d: 12, r: 1 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[4, 3.6, 20], [4, 6, 14], [4, 8.4, 17]].map(([dx, dy, w]) => k.lineOnTop([label.x + dx, label.y + dy], [label.x + dx + w, label.y + dy], 0.8, P)).join(""), { tone: "lo", free: true }));
  return out.join("");
}

function pillar() {
  const out = [];
  out.push(S(k.cylinder(0, 0, 13, 0, 4, P, 48, 0.6), { tone: "mid" }));
  out.push(D(k.circleRing(0, 0, 10.5, 6).map(([x, y]) => at([x, y, 4])), { size: 0.45, tone: "hi" }));
  out.push(S(k.cylinder(0, 0, 7.4, 4, 6, P, 36, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(0, 0, 4.4, 10, PIV - 22, P, 32), { tone: "mid", crease: "none", inner: L([40, 80].map((z) => k.sideArc(0, 0, 4.4, z, P, 20)).join(""), { tone: "faint" }) }));
  out.push(S(k.cylinder(0, 0, 5.6, PIV - 12, 3, P, 28), { tone: "mid" }));
  // Back plate of the yoke.
  out.push(S(k.slabOf({ x: -6, y: -6.5, w: 12, d: 2.5, r: 0.8 }, PIV - 9, 15, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}

function scale() {
  const out = [];
  const pts = (r, steps = 24) => Array.from({ length: steps + 1 }, (_, i) => {
    const a = -TMAX - 0.09 + ((2 * TMAX + 0.18) * i) / steps;
    return [Math.sin(a) * r, SCALE_Y, PIV - Math.cos(a) * r];
  });
  const outer = pts(NEEDLE + 4), inner = pts(NEEDLE - 8);
  const shape = [...outer, ...inner.reverse()].map(at);
  out.push(`<path class="iso-fill" d="${k.pathOf(shape, true)}"/>`);
  out.push(L(k.pathOf(shape, true), { tone: "mid" }));
  let minor = "", major = "";
  for (let i = 0; i <= 20; i++) {
    const a = -TMAX + (2 * TMAX * i) / 20;
    const big = i % 10 === 0;
    const d = k.segment([Math.sin(a) * (NEEDLE + 4), SCALE_Y, PIV - Math.cos(a) * (NEEDLE + 4)], [Math.sin(a) * (NEEDLE + (big ? -2 : 1)), SCALE_Y, PIV - Math.cos(a) * (NEEDLE + (big ? -2 : 1))], P);
    if (big) major += d; else minor += d;
  }
  out.push(L(minor, { tone: "lo" }), L(major, { tone: "hi" }));
  // Bracket holding the scale to the pillar.
  out.push(S(k.slabOf({ x: -2, y: 3.6, w: 4, d: SCALE_Y - 3.6, r: 0.5 }, PIV - NEEDLE - 6, 6, P, 2), { tone: "mid" }));
  out.push(D([at([0, SCALE_Y, PIV - NEEDLE - 3])], { size: 0.5 }));
  return out.join("");
}

function pan(side) {
  // Built at z = 0 under the beam end, moved with the beam.
  const x = side * ARM;
  const out = [];
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: x - PAN_R, y: -PAN_R, w: 2 * PAN_R, d: 2 * PAN_R, r: PAN_R }, 0, 0.1, P)}" style="filter:blur(6px);opacity:.5"/>`);
  out.push(S(k.cylinder(x, 0, PAN_R - 4, -1.2, 1.2, P, 48), { tone: "lo" }));
  out.push(S(k.cylinder(x, 0, PAN_R, 0, 2.4, P, 64, 0.6), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(x, 0, PAN_R - 2.4, 2.4, P, 56), { tone: "lo" }));
  out.push(`<g data-weights="${side}"></g>`);
  return out.join("");
}

export function build() {
  const svg = k.figureSvg({
    width: W, height: H,
    label: "An equal-arm balance on a base. A pillar holds a beam on a pivot; a pan hangs from each end. A needle under the pivot reads against an arc scale. Each pan carries weights in proportion to prior probability times likelihood, so the needle reads the probability of the left-hand hypothesis.",
    body: [
      base(),
      `<g data-part="hangers-0"></g>`,
      `<g data-pan="-1" transform="${k.translateAlong(P, [0, 0, PIV - DROP_])}">${pan(-1)}</g>`,
      pillar(), scale(),
      `<g data-part="needle"></g>`,
      `<g data-part="beam"></g>`,
      S(k.slabOf({ x: -6, y: 4, w: 12, d: 2.5, r: 0.8 }, PIV - 9, 15, P, 2, 0.4), { tone: "mid" }),
      D([at([0, 6.5, PIV])], { size: 1, tone: "hi" }),
      `<g data-part="hangers-1"></g>`,
      `<g data-pan="1" transform="${k.translateAlong(P, [0, 0, PIV - DROP_])}">${pan(1)}</g>`,
    ],
  });
  const seg = (attr, list, label, pressed) => list.map(([v, t]) => `<button type="button" class="seg" ${attr}="${v}" aria-pressed="${v === pressed}">${t}</button>`).join("");
  const controls = `<div class="controls balance-controls">
<div class="group"><span class="label">Weigh</span>${seg("data-mode", [["demons", "The two demons"], ["persons", "Theories of you"]], "", "demons")}</div>
<div class="group"><span class="label" data-prior-label>Prior P(Q1)</span>${seg("data-prior", [["0.01", "1%"], ["0.1", "10%"], ["0.5", "50%"], ["0.9", "90%"]], "", "0.5")}</div>
<div class="group" data-for="demons"><button type="button" class="act" data-evidence>One hour later: you are released</button></div>
<div class="group" data-for="persons" hidden><span class="label">Past</span>${seg("data-past", DEMONS.pasts.map((n) => [String(n), n === Infinity ? "∞" : n >= 1e4 ? "10" + String(Math.log10(n)).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("") : String(n)]), "", "10000")}<span class="unit">centuries</span></div>
</div>`;
  const html = k.plateHtml({
    fig: "Fig 5",
    title: "Weighing the evidence",
    hint: "Choose a prior, then add the evidence",
    readout: "P(Q1) 50.0% · before the evidence",
    keys: [
      { mark: "lit", label: "Needle: probability of the left pan’s hypothesis" },
      { mark: "raised", label: "Left pan: Q1 (ten flips) · right pan: Q2 (infinitely many)" },
    ],
    caption: "Each pan holds its hypothesis’s prior times the likelihood of the evidence, rescaled to sum to one, so the needle shows the posterior. Q1 releases you with probability 1/1024 and Q2 with probability 0, so survival empties Q2’s pan whatever its prior. For theories of you, a Restrictive theory gives a chance of 1 in N that a once-only life falls in this century of an N-century past; a Permissive theory gives some fixed nonzero chance (1 in 1,000 here; any value works). As the past grows without bound, the Restrictive pan empties.",
    body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Balance: left and right arrows change the prior, Space adds the evidence" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">${svg}</div>`,
  }).replace("<figcaption", controls + "<figcaption");
  return {
    id: "fig-balance", html, live,
    constants: { P, PIV, ARM, DROP_, PAN_R, TMAX, NEEDLE, SCALE_Y, survive: DEMONS.survive, c: DEMONS.permissiveLike, pasts: DEMONS.pasts.map((n) => (n === Infinity ? -1 : n)) },
  };
}

function live(root, C) {
  const stage = root.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const beam = svg.querySelector('[data-part="beam"]');
  const needle = svg.querySelector('[data-part="needle"]');
  const pans = { "-1": svg.querySelector('[data-pan="-1"]'), "1": svg.querySelector('[data-pan="1"]') };
  const hangers = { "-1": svg.querySelector('[data-part="hangers-0"]'), "1": svg.querySelector('[data-part="hangers-1"]') };
  const weights = { "-1": svg.querySelector('[data-weights="-1"]'), "1": svg.querySelector('[data-weights="1"]') };
  const keyLabels = root.querySelectorAll(".iso-key");
  const priorLabel = root.querySelector("[data-prior-label]");
  let mode = "demons", prior = 0.5, evidence = 0, evidenceTarget = 0, past = 1e4;
  let angle = 0, rate = 0, clock = 0, shown = { "-1": -1, "1": -1 };
  const guard = tourGuard(() => { clock = 0; kick(); }, 4500);
  const pastOf = (v) => (v < 0 ? Infinity : v);
  function posterior() {
    if (mode === "demons") {
      const a = prior * C.survive[0], b = (1 - prior) * C.survive[1];
      const post = a + b > 0 ? a / (a + b) : prior;
      return prior + (post - prior) * ease(evidence);
    }
    const a = prior * C.c, b = isFinite(past) ? (1 - prior) / past : 0;
    return a / (a + b);
  }
  const pt = (p) => iso(p, C.P).map((v) => v.toFixed(1)).join(" ");
  function beamPaths(phi) {
    const u = [Math.cos(phi), 0, Math.sin(phi)], v = [-Math.sin(phi), 0, Math.cos(phi)];
    const q = (s, t, y) => [u[0] * s + v[0] * t, y, C.PIV + u[2] * s + v[2] * t];
    const L = C.ARM + 4, T = 2.6, Y = 2.6;
    const front = [q(-L, -T, Y), q(L, -T, Y), q(L, T, Y), q(-L, T, Y)];
    const top = [q(-L, T, -Y), q(L, T, -Y), q(L, T, Y), q(-L, T, Y)];
    const end = [q(L, -T, Y), q(L, -T, -Y), q(L, T, -Y), q(L, T, Y)];
    const poly = (list) => "M" + list.map(pt).join("L") + "Z";
    const hull = [q(-L, -T, Y), q(L, -T, Y), q(L, -T, -Y), q(L, T, -Y), q(-L, T, -Y), q(-L, T, Y)];
    const mid = [q(-L + 6, 0, Y), q(L - 6, 0, Y)];
    const knife = q(0, 0, Y);
    return `<g class="iso-solid"><path class="iso-fill" d="${poly(hull)}"/><path class="iso-shade" data-shade="1" d="${poly(front)}"/><path class="iso-shade" data-shade="2" d="${poly(end)}"/><path class="iso-top" d="${poly(top)}"/><path class="iso-line" data-tone="faint" d="M${pt(mid[0])}L${pt(mid[1])}"/><path class="iso-line iso-crease" data-tone="lo" d="M${pt(q(-L, T, Y))}L${pt(q(L, T, Y))}"/><path class="iso-line iso-edge" data-tone="hi" d="${poly(hull)}"/></g><circle cx="${iso(knife, C.P)[0].toFixed(1)}" cy="${iso(knife, C.P)[1].toFixed(1)}" r="1.4" style="fill:var(--anatomy-paper);stroke:var(--anatomy-hi);stroke-width:.6"/>`;
  }
  function endOf(side, phi) { return [side * C.ARM * Math.cos(phi), 0, C.PIV + side * C.ARM * Math.sin(phi)]; }
  function stack(side, count) {
    let out = "";
    const x = side * C.ARM;
    for (let i = 0; i < count; i++) {
      const r = 8 - i * 0.25;
      out += solidSvg(cylinder(x, 0, r, 2.4 + i * 3, 2.6, C.P, 32, 0.3), { tone: "hi" });
    }
    if (count > 0) out += solidSvg(cylinder(x, 0, 2.2, 2.4 + count * 3 - 0.4, 2.4, C.P, 16), { tone: "mid" });
    return out;
  }
  function draw() {
    const post = posterior();
    beam.innerHTML = beamPaths(angle);
    const tipPt = [Math.sin(angle) * C.NEEDLE, C.SCALE_Y + 0.6, C.PIV - Math.cos(angle) * C.NEEDLE];
    needle.innerHTML = `<path class="iso-line" data-tone="lit" style="stroke-width:1.2" d="M${pt([0, C.SCALE_Y + 0.6, C.PIV])}L${pt(tipPt)}"/>`;
    for (const side of [-1, 1]) {
      const end = endOf(side, angle);
      pans[side].setAttribute("transform", translateAlong(C.P, [end[0] - side * C.ARM, 0, end[2] - C.DROP_]));
      const panZ = end[2] - C.DROP_ + 2.4;
      const hooks = [0, 1, 2].map((j) => { const a = (j / 3) * Math.PI * 2 + 0.5; return [end[0] + Math.cos(a) * (C.PAN_R - 2), Math.sin(a) * (C.PAN_R - 2), panZ]; });
      hangers[side].innerHTML = hooks.map((h) => `<path class="iso-line" data-tone="mid" d="M${pt([end[0], 0, end[2] - 4])}L${pt(h)}"/>`).join("") + `<path class="iso-line" data-tone="hi" d="M${pt([end[0], 0, end[2] - 1])}L${pt([end[0], 0, end[2] - 4])}"/>` + dotsSvg([iso([end[0], 0, end[2] - 4], C.P)], { size: 1, tone: "hi" });
      const share = side === -1 ? post : 1 - post;
      const count = Math.round(share * 10);
      if (count !== shown[side]) { shown[side] = count; weights[side].innerHTML = stack(side, count); }
    }
    const pct = (post * 100).toFixed(post > 0.999 && post < 1 ? 3 : 1) + "%";
    let text;
    if (mode === "demons") text = evidenceTarget ? `P(Q1) ${(prior * 100).toFixed(0)}% → P(Q1 | released) ${pct}` : `P(Q1) ${pct} · before the evidence`;
    else text = `past ${isFinite(past) ? fmtInt(past) + " centuries" : "infinite"} · P(Permissive) ${(prior * 100).toFixed(0)}% → ${pct} given you live now`;
    say(root, text);
    stage.setAttribute("aria-valuenow", String(Math.round(post * 100)));
  }
  const kick = animate(stage, (dt, calm) => {
    if (guard.touring) {
      clock += dt;
      if (mode === "demons") {
        const s = clock % 9;
        evidenceTarget = s > 2.5 && s < 7 ? 1 : 0;
      } else {
        const list = C.pasts.map(pastOf);
        past = list[Math.floor(clock / 2.4) % list.length];
        syncPast();
      }
    }
    evidence = calm ? evidenceTarget : follow(evidence, evidenceTarget, dt, 0.35, calm);
    if (Math.abs(evidence - evidenceTarget) < 1e-3) evidence = evidenceTarget;
    const post = posterior();
    const target = C.TMAX * (2 * post - 1);
    if (calm) { angle = target; rate = 0; }
    else {
      for (let i = 0; i < 4; i++) { rate += ((target - angle) * 26 - rate * 3.2) * dt / 4; angle += rate * dt / 4; }
      if (Math.abs(target - angle) < 1e-4 && Math.abs(rate) < 1e-4) { angle = target; rate = 0; }
    }
    draw();
    return guard.touring || rate !== 0 || angle !== target || evidence !== evidenceTarget;
  });
  const buttons = (attr) => [...root.querySelectorAll(`[${attr}]`)];
  const press = (attr, value) => buttons(attr).forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute(attr) === value)));
  function syncPast() { press("data-past", String(past)); }
  function setMode(next) {
    mode = next; clock = 0; evidence = evidenceTarget = 0;
    press("data-mode", mode);
    root.querySelectorAll("[data-for]").forEach((g) => { g.hidden = g.dataset.for !== mode; });
    priorLabel.textContent = mode === "demons" ? "Prior P(Q1)" : "Prior P(Permissive)";
    const right = keyLabels[1].lastChild;
    right.textContent = mode === "demons" ? "Left pan: Q1 (ten flips) · right pan: Q2 (infinitely many)" : "Left pan: Permissive (repeatable you) · right pan: Restrictive (once only)";
    if (mode === "persons") { prior = 0.1; press("data-prior", "0.1"); syncPast(); }
    kick();
  }
  buttons("data-mode").forEach((b) => b.addEventListener("click", () => { guard.hold(); setMode(b.dataset.mode); }));
  buttons("data-prior").forEach((b) => b.addEventListener("click", () => { guard.hold(); prior = Number(b.dataset.prior); press("data-prior", b.dataset.prior); kick(); }));
  buttons("data-past").forEach((b) => b.addEventListener("click", () => { guard.hold(); past = Number(b.dataset.past); syncPast(); kick(); }));
  root.querySelector("[data-evidence]").addEventListener("click", () => { guard.hold(); evidenceTarget = evidenceTarget ? 0 : 1; kick(); });
  stage.addEventListener("keydown", (event) => {
    const list = [0.01, 0.1, 0.5, 0.9];
    const i = list.indexOf(prior);
    if (event.key === "ArrowRight" && i < list.length - 1) { event.preventDefault(); guard.hold(); prior = list[i + 1]; press("data-prior", String(prior)); kick(); }
    if (event.key === "ArrowLeft" && i > 0) { event.preventDefault(); guard.hold(); prior = list[i - 1]; press("data-prior", String(prior)); kick(); }
    if (event.key === " ") { event.preventDefault(); guard.hold(); evidenceTarget = evidenceTarget ? 0 : 1; kick(); }
  });
  angle = C.TMAX * (2 * posterior() - 1);
  draw();
}
