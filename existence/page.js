// Page behaviour: the theme toggle and the interactive summary of the argument (§6).
(function theme() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  const root = document.documentElement;
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.getAttribute("data-theme") || (dark.matches ? "dark" : "light");
  const label = () => { button.querySelector("[data-theme-label]").textContent = current() === "dark" ? "Light" : "Dark"; };
  try { const saved = localStorage.getItem("eei-theme"); if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved); } catch (error) {}
  button.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("eei-theme", next); } catch (error) {}
    label();
  });
  dark.addEventListener("change", label);
  label();
})();

(function proof() {
  const list = document.getElementById("proof");
  const cost = document.getElementById("cost");
  if (!list || !cost) return;
  const items = new Map([...list.querySelectorAll("li[data-id]")].map((li) => [li.dataset.id, li]));
  const COST = {
    "1": ["Reject 1: the past is finite", "Then 3c fails and nothing forces you to be repeatable. Your existence still proves a disjunction: either the past is finite or persons are repeatable. You pay for the first option the way the standard Big Bang does, with an unexplained first state that §2 argues is no better than a universe that began in 1950."],
    "2": ["Reject 2: endless time need not repeat everything", "This fits an ever-expanding universe with unbounded phase space. You would still be repeatable (3d stands), but nothing guarantees the repeat happens. Huemer replies that an infinite past makes a cyclic universe or an eternal multiverse likely, and either one brings recurrence back."],
    "3a": ["Reject 3a: your living now could have nonzero probability", "You must give this century a positive chance while you live at most once in an infinite past. The lemma of §4.4 shows any fixed positive chance per century adds up past 100%. The only escape is a prior skewed toward the present, and §5.4 argues nothing makes the present moment intrinsically special."],
    "3b": ["Reject 3b: you are not alive now", "This is the one premise you know for certain. Denying it is not a live option."],
  };
  const sources = (li) => (li.dataset.from || "").split(" ").filter(Boolean);
  function update() {
    const rejected = new Set([...items].filter(([, li]) => li.dataset.kind === "premise" && li.dataset.state === "rejected").map(([id]) => id));
    const lost = new Set();
    for (let pass = 0; pass < 4; pass++) {
      for (const [id, li] of items) if (li.dataset.kind === "derived" && sources(li).some((s) => rejected.has(s) || lost.has(s))) lost.add(id);
    }
    for (const [id, li] of items) {
      if (li.dataset.kind === "derived") { if (lost.has(id)) li.dataset.state = "lost"; else delete li.dataset.state; }
      const kind = li.querySelector(":scope > button .p-k");
      if (li.dataset.kind === "premise") kind.textContent = rejected.has(id) ? "Rejected" : "Premise";
    }
    if (!rejected.size) {
      cost.innerHTML = '<p class="cost-h">All premises accepted</p><p>The conclusion follows: you will live again, infinitely many times.</p>';
      return;
    }
    const lostLine = lost.size ? "No longer supported: " + [...lost].join(", ") + "." : "";
    cost.innerHTML = [...rejected].map((id) => `<p class="cost-h">${COST[id][0]}</p><p>${COST[id][1]}</p>`).join("") + (lostLine ? `<p class="cost-h" style="margin-top:12px">${lostLine}</p>` : "");
  }
  for (const [id, li] of items) {
    if (li.dataset.kind !== "premise") continue;
    const button = li.querySelector(":scope > button");
    button.addEventListener("click", () => {
      const off = li.dataset.state === "rejected";
      if (off) delete li.dataset.state; else li.dataset.state = "rejected";
      button.setAttribute("aria-pressed", String(!off));
      update();
    });
  }
  update();
})();
