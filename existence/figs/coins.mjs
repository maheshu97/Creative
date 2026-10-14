// Fig 3. A bench of coin flippers: "a coin came up heads ten times" versus "this coin did, just now" (§4.2).
import * as k from "../../vendor/anatomy/iso-kit.mjs";
import { COINS } from "../model.mjs";

const W = 600, H = 300;
const STATIONS = 8; // drawn; more coins are "elsewhere"
const PITCH = 27;
const ROW_Y = -6;
const BENCH = { x: -120, y: -52, w: 240, d: 112, r: 6 };
const POD_Z = 0, POD_H = 6, COIN_R = 6.4, COIN_H = 1.2;
const PAD_Y = 22; // tally strip row
const xs = Array.from({ length: STATIONS }, (_, i) => BENCH.x + 26 + i * PITCH);
const THIS = 3; // the observed coin
const THIS_Y = 0;

const P = k.fitProjection([...k.boxCorners(BENCH, -15, 0), [xs[0], -36, 40]], W, H, { pad: 18, azimuth: 62 });
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BENCH, -15, 10, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BENCH, 16))) {
    out.push(S(k.cylinder(x, y, 6.6, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5, -13.4, 3.4, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(BENCH, -10, 10, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(BENCH, -4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(BENCH, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(BENCH, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // A bus bar behind the flippers feeding every coil.
  const bus = { x: xs[0] - 10, y: -40, w: xs[STATIONS - 1] - xs[0] + 20, d: 5, r: 1.5 };
  out.push(S(k.slabOf(bus, 0, 5, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(bus, 2.5, P, 3), { tone: "faint" }) }));
  out.push(D(xs.map((x) => at([x, -37.5, 5])), { size: 0.5, tone: "hi" }));
  // Controller at the right end.
  const box = { x: xs[STATIONS - 1] + 16, y: -42, w: 26, d: 34, r: 2 };
  out.push(S(k.slabOf(box, 0, 18, P, 4, 0.8), { tone: "mid", inner: L(k.sideSeam(box, 4, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline({ x: box.x + 4, y: box.y + 4, w: 18, d: 12, r: 1 }, 18, P, 3), { tone: "lo" }));
  out.push(S(k.cylinder(box.x + 13, box.y + 25, 4, 18, 3, P, 24), { tone: "hi" }));
  out.push(L(k.knurl(box.x + 13, box.y + 25, 4, 18, 21, 22, P), { tone: "lo" }));
  out.push(k.wireSvg(at([box.x, -37.5, 3]), at([bus.x + bus.w, -37.5, 3]), { tone: "lo" }));
  return out.join("");
}

function station(i) {
  const x = xs[i];
  const y = i === THIS ? THIS_Y : ROW_Y;
  const out = [];
  const pod = { x: x - 9, y: y - 9, w: 18, d: 18, r: 3 };
  out.push(S(k.slabOf(pod, POD_Z, 2, P, 4, 0.4), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, 7.6, 2, POD_H - 2, P, 32, 0.4), { tone: "mid", inner: L(k.sideArc(x, y, 7.6, 3.8, P, 24), { tone: "faint" }) }));
  out.push(L(k.ring(x, y, 3, POD_H, P, 20), { tone: "lo" }));
  out.push(D(k.corners(pod, 2).map(([px, py]) => at([px, py, 2])), { size: 0.4 }));
  // Feed wire from the bus bar to the coil.
  out.push(k.wireSvg(at([x, -37.5, 5]), at([x, y - 7.6, 4]), { tone: "faint", size: 0.8 }));
  // Tally strip: ten pads, one per flip.
  const strip = { x: x - 9, y: PAD_Y + (i === THIS ? 6 : 0), w: 18, d: 14, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  for (let f = 0; f < COINS.flips; f++) {
    const px = strip.x + 1.6 + (f % 5) * 3.1, py = strip.y + 1.8 + Math.floor(f / 5) * 5.6;
    out.push(`<g data-pad="${i}-${f}">${S(k.slabOf({ x: px, y: py, w: 2.4, d: 4.4, r: 0.5 }, 0.8, 0.6, P, 2), { tone: "lo", crease: "none" })}</g>`);
  }
  return out.join("");
}

// Coins are drawn at rest height and lifted with a transform; the face mark is redrawn on landing.
function coin(i) {
  const x = xs[i];
  const y = i === THIS ? THIS_Y : ROW_Y;
  const lit = i === THIS;
  return `<g data-coin="${i}">${S(k.cylinder(x, y, COIN_R, POD_H, COIN_H, P, 40, 0.3), { tone: "hi", lit })}<g data-face></g></g>`;
}

export function build() {
  const order = byDepth(xs.map((x, i) => [x, i === THIS ? THIS_Y : ROW_Y, i])).map((p) => p[2]);
  const svg = k.figureSvg({
    width: W, height: H,
    label: "A bench of eight coin flippers fed from one bus bar. The coin standing forward of the row is the one you watch. In front of each flipper a strip of ten pads records its ten flips: dark for heads.",
    body: [bench(), ...order.map((i) => station(i) + coin(i))],
  });
  const choices = COINS.choices.map((n, j) => `<button type="button" class="seg" data-coins="${n}" aria-pressed="${j === 0}">${n >= 1e6 ? "10⁶" : n.toLocaleString("en-US")}</button>`).join("");
  const controls = `<div class="controls"><div class="group"><span class="label">Coins in the universe</span>${choices}</div><div class="group"><button type="button" class="act" data-flip>Flip ten times</button></div></div>`;
  const html = k.plateHtml({
    fig: "Fig 3",
    title: "This coin, just now",
    hint: "Choose how many coins exist",
    readout: "1 coin · ‘a coin’ ×1.00 · ‘this coin’ ×1.00",
    keys: [
      { mark: "lit", label: "The coin you watched" },
      { mark: "raised", label: "Tally pads: dark for heads" },
    ],
    caption: `Readout: how many times more likely your evidence is if this many coins exist than if only yours does. Ten heads from one fair coin has probability 1/1024. Read as “some coin got ten heads”, that evidence grows more likely with every extra coin (1 − (1023/1024)ⁿ), so it seems to favour a universe full of flippers. Read correctly as “this coin got ten heads just now”, it stays at 1/1024 however many coins exist, and supports nothing about them. The run shown is the one the paper imagines: your coin lands heads ten times.`,
    body: `<div class="iso-stage" tabindex="0" role="group" aria-label="Coin flippers">${svg}</div>`,
  }).replace("<figcaption", controls + "<figcaption");
  return { id: "fig-coins", html, live, constants: { P, xs, THIS, THIS_Y, ROW_Y, POD_H, COIN_H, COIN_R, STATIONS, flips: COINS.flips, pTen: COINS.pTen } };
}

function live(root, C) {
  const stage = root.querySelector(".iso-stage");
  const svg = stage.querySelector("svg");
  const coins = [...Array(C.STATIONS)].map((_, i) => svg.querySelector(`[data-coin="${i}"]`));
  const faces = coins.map((c) => c.querySelector("[data-face]"));
  const pads = [...Array(C.STATIONS)].map((_, i) => [...Array(C.flips)].map((_, f) => svg.querySelector(`[data-pad="${i}-${f}"] .iso-solid`)));
  const stationGroups = (i) => [coins[i], ...pads[i].map((p) => p.parentElement)];
  const buttons = [...root.querySelectorAll("[data-coins]")];
  let n = 1, flip = 0, phase = 0, results = [], clock = 0, running = false;
  const guard = tourGuard(() => { clock = 0; kick(); }, 4200);
  const someCoin = (count) => 1 - (1 - C.pTen) ** count;
  const yOf = (i) => (i === C.THIS ? C.THIS_Y : C.ROW_Y);
  const face = (i, heads) => {
    const x = C.xs[i], y = yOf(i), z = C.POD_H + C.COIN_H;
    const ring = ring_(x, y, C.COIN_R - 1.6, z);
    const mark = heads
      ? `<path class="iso-line" data-tone="${i === C.THIS ? "lit" : "hi"}" style="stroke-width:1.1" d="${ring_(x, y, 1.8, z)}"/>`
      : `<path class="iso-line" data-tone="mid" d="${lineOnTop([x - 2.4, y], [x + 2.4, y], z, C.P)}"/>`;
    return `<path class="iso-line" data-tone="faint" d="${ring}"/>${mark}`;
  };
  function ring_(x, y, r, z) { return ring(x, y, r, z, C.P, 28); }
  function newRun() {
    results = coins.map((_, i) => [...Array(C.flips)].map(() => (i === C.THIS ? true : Math.random() < 0.5)));
    flip = 0; phase = 0;
    pads.forEach((row) => row.forEach((p) => p.setAttribute("data-shown", "")));
    pads.forEach((row) => row.forEach((p) => { p.querySelector(".iso-edge").setAttribute("data-tone", "lo"); p.querySelector(".iso-top").style.fill = ""; }));
  }
  function setCount(count) {
    n = count;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.coins) === n)));
    for (let i = 0; i < C.STATIONS; i++) {
      const visible = i === C.THIS || (n >= C.STATIONS) || order(i) < n;
      stationGroups(i).forEach((g) => { g.style.opacity = visible ? "" : "0.12"; });
    }
    report();
  }
  // Which stations count as existing when fewer than eight coins exist: yours first, then its neighbours.
  const rank = [C.THIS, 4, 2, 5, 1, 6, 0, 7];
  const order = (i) => rank.indexOf(i);
  function report() {
    const general = someCoin(n) / someCoin(1);
    const extra = n > C.STATIONS ? ` (${C.STATIONS} shown)` : "";
    say(root, `${n >= 1e6 ? "10⁶" : n.toLocaleString("en-US")} coin${n > 1 ? "s" : ""}${extra} · ‘a coin’ ×${general.toFixed(general < 10 ? 2 : 0)} · ‘this coin’ ×1.00`);
  }
  const FLIP = 0.9;
  const kick = animate(stage, (dt, calm) => {
    if (!running) {
      if (!guard.touring) return false;
      clock += dt;
      if (clock < 1.2) return true;
      running = true; newRun();
    }
    phase += dt / (calm ? 0.01 : FLIP);
    const lift = calm ? 0 : Math.sin(Math.min(1, phase) * Math.PI) * 18;
    coins.forEach((c, i) => {
      const active = i === C.THIS || n >= C.STATIONS || order(i) < n;
      c.setAttribute("transform", translateAlong(C.P, [0, 0, active ? lift * (0.85 + 0.15 * ((i * 37) % 7) / 7) : 0]));
    });
    if (phase >= 1) {
      coins.forEach((c, i) => {
        faces[i].innerHTML = face(i, results[i][flip]);
        const pad = pads[i][flip];
        if (results[i][flip]) { pad.querySelector(".iso-top").style.fill = "var(--anatomy-hi)"; pad.querySelector(".iso-edge").setAttribute("data-tone", "hi"); }
        else pad.querySelector(".iso-edge").setAttribute("data-tone", "mid");
      });
      flip += 1; phase = 0;
      if (flip >= C.flips) {
        running = false; clock = -2.5;
        coins.forEach((c) => c.setAttribute("transform", ""));
        return guard.touring;
      }
    }
    return true;
  });
  buttons.forEach((b) => b.addEventListener("click", () => { setCount(Number(b.dataset.coins)); }));
  root.querySelector("[data-flip]").addEventListener("click", () => { guard.hold(); running = true; newRun(); kick(); });
  stage.addEventListener("keydown", (event) => {
    const list = buttons.map((b) => Number(b.dataset.coins));
    const j = list.indexOf(n);
    if (event.key === "ArrowRight" && j < list.length - 1) { event.preventDefault(); setCount(list[j + 1]); }
    if (event.key === "ArrowLeft" && j > 0) { event.preventDefault(); setCount(list[j - 1]); }
    if (event.key === " ") { event.preventDefault(); guard.hold(); running = true; newRun(); kick(); }
  });
  // Start with a finished run on the bench, so the first frame already shows the evidence.
  results = coins.map((_, i) => [...Array(C.flips)].map((_, f) => (i === C.THIS ? true : ((i * 7 + f * 3) % 5) < 2)));
  coins.forEach((_, i) => {
    faces[i].innerHTML = face(i, results[i][C.flips - 1]);
    pads[i].forEach((pad, f) => {
      if (results[i][f]) { pad.querySelector(".iso-top").style.fill = "var(--anatomy-hi)"; pad.querySelector(".iso-edge").setAttribute("data-tone", "hi"); }
      else pad.querySelector(".iso-edge").setAttribute("data-tone", "mid");
    });
  });
  setCount(1);
  clock = -4;
}
