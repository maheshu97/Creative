// Shared live helpers. Inlined once after the Anatomy kit; every figure's live code runs in its own scope.
const STILL = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const follow = (now, target, dt, seconds, calm) => (calm ? target : now + (target - now) * (1 - Math.exp(-dt / seconds)));
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// Runs step(dt, calm) every frame while the stage is on screen and step returns true.
function animate(stage, step) {
  let frame = 0, last = 0, visible = false;
  const tick = (now) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const more = step(dt, STILL.matches);
    frame = visible && more ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
  new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) kick(); }, { rootMargin: "120px 0px" }).observe(stage);
  return kick;
}

// An idle tour that pauses on input and resumes after a quiet spell.
function tourGuard(onResume, quiet = 3600) {
  let timer = 0;
  const state = { touring: !STILL.matches };
  state.hold = () => { state.touring = false; clearTimeout(timer); timer = setTimeout(() => { if (!STILL.matches) { state.touring = true; onResume(); } }, quiet); };
  return state;
}

function say(root, text) {
  const out = root.querySelector("[data-readout]");
  if (out && out.textContent !== text) out.textContent = text;
  const stage = root.querySelector(".iso-stage");
  if (stage) stage.setAttribute("aria-valuetext", text);
}

const fmtPct = (p, digits = 1) => (p * 100).toFixed(digits) + "%";
const fmtInt = (n) => (isFinite(n) ? Math.round(n).toLocaleString("en-US") : "∞");
