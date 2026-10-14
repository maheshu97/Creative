// The walkthrough's text and layout. Figures are slotted in by id.

const fig = (figs, id) => (figs[id] ? `<div class="fig" id="${id}">${figs[id].html}</div>` : "");

export function page({ figs, css, script }) {
  const head = `<title>Existence Is Evidence of Immortality</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="An interactive walkthrough of Michael Huemer's argument that your present existence is evidence you will live again.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap">
<style>${css}</style>`;

  const body = `<div class="iso shell">
<header class="masthead">
  <div class="bar">
    <span class="eyebrow">A walkthrough of Michael Huemer’s paper</span>
    <button class="theme" type="button" id="theme-toggle" aria-label="Switch between light and dark theme"><span data-theme-label>Theme</span></button>
  </div>
  <h1>Existence Is Evidence of Immortality</h1>
  <p class="lede">Time may be infinite in both directions. If it is, and if a person could live at most once in all of time, the chance that you would be alive now would be zero. You are alive now. So either the past is finite, or persons can live more than once.</p>
  <p class="byline">Five working machines, one for each step of the argument. Every number on them comes from the paper or from the plain probability it uses. Each figure runs a short tour by itself; touch it to take over.</p>
</header>

<nav class="chain" aria-label="The argument at a glance">
  <a href="#time" class="link"><span class="n">1</span><span class="t">Time has no beginning and no end</span><span class="s">Premise · §2</span></a>
  <a href="#recurrence" class="link"><span class="n">2</span><span class="t">Endless time repeats every repeatable state</span><span class="s">Premise · §3</span></a>
  <a href="#evidence" class="link"><span class="n">3</span><span class="t">You exist now, so you must be repeatable</span><span class="s">The core · §4</span></a>
  <a href="#summary" class="link"><span class="n">4</span><span class="t">So you will live again, infinitely many times</span><span class="s">Conclusion · §6</span></a>
</nav>

<main class="essay">

<section id="time">
  <p class="sec">§2 · The infinitude of time</p>
  <h2>A past with no first moment</h2>
  <p>Almost everyone grants that the future is infinite. Huemer argues that the past plausibly is too. A beginning of time looks impossible in the same way an edge of space does. At any place you can ask what lies one metre to its left, and at any moment you can ask what happened one minute before. Time cannot have come into existence, because coming into existence means there was first a time when the thing did not exist. Even a creator outside time could not make time, since every act of creating already takes place at some time.</p>
  <p>Some philosophers reply that an infinite past is the impossible thing: there cannot be an “actual infinity”, or an infinite series can never be completed one step at a time. Zeno’s paradoxes answer them. A falling ball must cross half the distance, then half of what is left, and so on, and it completes all of those steps. Run the same series the other way and it has no first step at all. Every time an object moves, it completes a series of that kind.</p>
  ${fig(figs, "fig-drop")}
  <p>Physics leaves the question open. Standard Big Bang cosmology starts spacetime about 14 billion years ago, but cyclic models (Steinhardt–Turok, Baum–Frampton, loop quantum cosmology, Penrose’s conformal cyclic cosmology) and eternal multiverses give the past no beginning.</p>
  <aside class="note">
    <p class="note-h">The 1950 universe</p>
    <p>A finite-past Big Bang has to postulate an unexplained, very low-entropy starting state. Penrose puts the odds of such a state at less than 1 in 10<sup>10<sup>124</sup></sup>. Compare a rival theory: the universe began in 1950, already looking exactly as we think it looked then, fossils and false memories included. That state is far <em>more</em> probable, because entropy has risen since the Big Bang. Both theories explain everything observed since 1950 with an uncaused first state. If the Big Bang start is acceptable, so is the 1950 start. The 1950 theory is not acceptable, so an infinite past deserves to be taken seriously.</p>
  </aside>
</section>

<section id="recurrence">
  <p class="sec">§3 · Infinitude yields eternal recurrence</p>
  <h2>Bounded systems come back</h2>
  <p>Seneca and Nietzsche held that everything that happens will happen again, infinitely many times. Infinite time alone does not guarantee this. Two particles flying apart faster than escape velocity never meet again. The Poincaré Recurrence Theorem gives the condition: a system confined to a bounded region of its <em>phase space</em>, the space of all its possible configurations, will return arbitrarily close to any state it was once in, and given infinite time it does so infinitely often.</p>
  ${fig(figs, "fig-wheels")}
  <p>Whether the theorem covers the whole universe is uncertain. An ever-expanding universe has unbounded phase space. But if the past is infinite, the universe is probably cyclic, and then it repeats its present state to any precision you like. If instead we live in an eternal multiverse that keeps spawning daughter universes, some of them will match ours. The argument only needs a person sufficiently like you to recur; the rest of the universe need not match.</p>
</section>

<section id="evidence">
  <p class="sec">§4.1 – 4.2 · Two facts about evidence</p>
  <h2>What counts as evidence, and whose</h2>
  <div class="formula" role="note"><span>E supports H if</span><b>P(E | H) &gt; P(E | ¬H)</b></div>
  <p><strong>The Bayesian conception.</strong> Evidence supports a hypothesis when the evidence is more likely if the hypothesis is true than if it is false, provided neither has prior probability zero. How strongly it supports it is measured by the likelihood ratio P(E | H) / P(E | ¬H).</p>
  <p><strong>The indexicality of evidence.</strong> Some evidence can only be stated with words like “I”, “this” and “now”. Flip a coin ten times and see ten heads. If your evidence were just that <em>some</em> coin landed heads ten times, it would favour the theory that many coins are being flipped across the universe. That is plainly wrong. What you learned is that <em>this</em> coin landed heads ten times <em>just now</em>, and other coins make no difference to that. Correct reasoning uses the most informative description available.</p>
  ${fig(figs, "fig-coins")}
  <p>The same holds for your own life. Your evidence is not that some being with your qualities exists at some time. It is that <em>you</em> are alive <em>now</em>.</p>
</section>

<section id="persons">
  <p class="sec">§4.3 · Theories of persons</p>
  <h2>Would your Poincaré clone be you?</h2>
  <p>Given recurrence, the far future will hold people as similar to you as you like, produced by the blind rearrangement of particles. Call them your Poincaré clones. Whether one of them would literally <em>be</em> you depends on the right theory of personal identity.</p>
  <div class="compare">
    <div class="side">
      <p class="tag">Permissive</p>
      <p>Being you depends on <em>repeatable</em> conditions: a type of brain configuration, mental capacities, character traits, or any repeatable property. Whenever a unique person meets them, that person is you. No close resemblance is required.</p>
      <p class="verdict">A future clone can be a later stage of you.</p>
    </div>
    <div class="side">
      <p class="tag">Restrictive</p>
      <p>Being you requires something that cannot recur, such as a spatiotemporally continuous chain of person-stages, or a particular token event as your cause.</p>
      <p class="verdict">A clone is only someone exactly like you.</p>
    </div>
  </div>
  <p>The argument does not ask you to believe a Permissive theory at the start. It only asks that you be less than 100% certain of a Restrictive one.</p>
</section>

<section id="lemma">
  <p class="sec">§4.4 · Existence confirms reincarnation</p>
  <h2>A once-only event cannot happen now</h2>
  <p>Huemer’s lemma takes an event <em>E</em> with three properties: <span class="pill">i</span> it can occur at most once in the history of the universe, <span class="pill">ii</span> that history is infinite, and <span class="pill">iii</span> <em>E</em> is no more likely to occur at a given time than at any earlier time. Then the probability that <em>E</em> occurs in the present century is zero.</p>
  <p>Suppose you give the present century a probability of 1%. By (iii) the previous century gets at least 1%, and so does the one before. Because <em>E</em> happens at most once, these probabilities add, and two hundred centuries would need 200%. Choose 0.1% and the budget runs out after a thousand centuries. With an infinite past it runs out for every nonzero choice.</p>
  ${fig(figs, "fig-lemma")}
  <div class="branches">
    <div><p class="tag">If E has some chance per century</p><p>An infinite run of past centuries makes it certain that E already happened. Since it happens at most once, it does not happen now.</p></div>
    <div><p class="tag">If E has zero chance per century</p><p>Then it certainly does not happen now.</p></div>
  </div>
  <p>Now let <em>E</em> be your becoming a conscious being. A Restrictive theory says (i) you live at most once. The past is plausibly (ii) infinite. And (iii), before looking, there is no reason your life should fall in this century rather than an earlier one. Together they predict, with certainty, that you are not alive now. You are. A theory that predicts with probability one that something will not happen is refuted when it happens. Whatever your prior in a Permissive theory and whatever chance of living now it gives you, as long as both are above zero, the Restrictive conjunction loses.</p>
</section>

<section id="demons">
  <p class="sec">§4.5 · An analogy</p>
  <h2>Two demons and one survivor</h2>
  <p>Demon Q1 flips a fair coin ten times within an hour and releases you only if every flip is heads. Demon Q2 flips a coin <em>infinitely</em> many times within the hour and releases you only if every flip is heads. You were taken by one of them; you can’t tell which. An hour later you are released. Q1 is very unlikely to release anyone, but Q2’s chance is zero, so you can be certain it was Q1.</p>
  <div class="formula" role="note"><span>Bayes</span><b>P(q₁ | s) = P(q₁)·P(s | q₁) / [P(q₁)·P(s | q₁) + P(q₂)·P(s | q₂)]</b></div>
  ${fig(figs, "fig-balance")}
  <p>The mapping is direct. If persons were unrepeatable and the past infinite, the chance you would be alive now is zero. So once you find that you are alive, and as long as you gave some chance to persons being repeatable or the past being finite, you can infer with certainty that one of those is true. If the past is infinite, persons are repeatable, and given enough time they repeat.</p>
</section>

<section id="objections">
  <p class="sec">§5 · Objections and replies</p>
  <h2>Five objections</h2>
  <div class="objections">
    <details open>
      <summary><span class="o-n">5.1</span><span class="o-t">The heat death of the universe</span></summary>
      <div class="o-b">
        <p class="obj">Entropy rises until thermal equilibrium, and then nothing interesting, life included, ever happens again.</p>
        <p class="rep">The Second Law states a probabilistic tendency, and the recurrence theorem shows that entropy can fall again. A large spontaneous drop is extremely improbable on a human timescale, but in infinite time “extremely improbable” only means “extremely rare”. Some cosmologies also reset entropy at the end of each cycle.</p>
      </div>
    </details>
    <details>
      <summary><span class="o-n">5.2</span><span class="o-t">Physicalism</span></summary>
      <div class="o-b">
        <p class="obj">If the Mona Lisa burns, a perfect repainting, even from the same atoms, is a copy. Persons are physical objects, so a destroyed person can never be recreated.</p>
        <p class="rep">That follows only if persons are individuated like ordinary objects. A physicalist can treat a person as a temporally gappy spacetime worm. A suit can have its trousers in the closet and its jacket at the cleaner with no non-physical glue; a life can likewise be scattered across widely separated times.</p>
      </div>
    </details>
    <details>
      <summary><span class="o-n">5.3</span><span class="o-t">Dualism</span></summary>
      <div class="o-b">
        <p class="obj">If you are an immaterial soul, no qualitative condition makes a future being you; only having your soul does.</p>
        <p class="rep">Then the question becomes under what causal conditions your soul comes to inhabit a body. If those conditions are repeatable, the theory is Permissive; if not, it is Restrictive. The reasoning of §4 applies unchanged: your being alive now confirms that the conditions are repeatable.</p>
      </div>
    </details>
    <details>
      <summary><span class="o-n">5.4</span><span class="o-t">The Principle of Indifference</span></summary>
      <div class="o-b">
        <p class="obj">Giving every century equal prior probability uses the Principle of Indifference, which is controversial, and no uniform distribution exists over an unbounded range.</p>
        <p class="rep">The argument does not need precise priors for everything, and here there is one natural partition: equal stretches of time. A mass between 0 and ∞ must get a distribution skewed toward small values, but two things differ. Different masses are intrinsically different, while every moment is intrinsically like every other and each past moment was once just as present. And a universe must have exactly one mass, but you need not be born exactly once: you could be born never, or more than once. Zero for every interval, or repeatable persons, are coherent alternatives to favouring the present.</p>
      </div>
    </details>
    <details>
      <summary><span class="o-n">5.5</span><span class="o-t">Every alternative is equally surprising</span></summary>
      <div class="o-b">
        <p class="obj">Any century you found yourself in would have had infinitely many centuries before it. Ten coin flips giving H T H H T T T T T H have probability 1/1024, but so does every sequence, so none is surprising.</p>
        <p class="rep">Surprise is not the point. What licenses an inference is the probability of the observation <em>given one theory</em> compared with its probability <em>given a rival</em>. The comparison is not P(L₀ | R) against P(L₋₁ | R), this century against the last. It is P(L₀ | H) against P(L₀ | R). Since P(L₀ | H) &gt; P(L₀ | R) = 0, the evidence favours H.</p>
      </div>
    </details>
  </div>
</section>

<section id="summary">
  <p class="sec">§6 · Summary</p>
  <h2>The whole argument</h2>
  <p>Select a premise to see what rejecting it costs. Huemer names 3a as the premise most likely to draw suspicion.</p>
  <ol class="proof" id="proof">
    <li data-id="1" data-kind="premise"><button type="button" aria-pressed="false"><span class="p-n">1</span><span class="p-t"><b>Infinitude of time.</b> Time is infinite in both directions.</span><span class="p-k">Premise</span></button></li>
    <li data-id="2" data-kind="premise"><button type="button" aria-pressed="false"><span class="p-n">2</span><span class="p-t"><b>Infinitude → recurrence.</b> If the future is infinite, every repeatable condition that obtains has obtained before and will obtain again, infinitely many times.</span><span class="p-k">Premise</span></button></li>
    <li data-id="3" data-kind="derived" data-from="3d"><button type="button" aria-pressed="false" disabled><span class="p-n">3</span><span class="p-t"><b>Recurrence → reincarnation.</b> If every repeatable condition will obtain again infinitely many times, you will be reincarnated infinitely many times.</span><span class="p-k">From 3a–3e</span></button>
      <ol>
        <li data-id="3a" data-kind="premise"><button type="button" aria-pressed="false"><span class="p-n">3a</span><span class="p-t">The probability of your being alive now, given an infinite past and unrepeatable conditions for your incarnation, is zero.</span><span class="p-k">Premise</span></button></li>
        <li data-id="3b" data-kind="premise"><button type="button" aria-pressed="false"><span class="p-n">3b</span><span class="p-t">You are alive now.</span><span class="p-k">Premise</span></button></li>
        <li data-id="3c" data-kind="derived" data-from="1"><button type="button" aria-pressed="false" disabled><span class="p-n">3c</span><span class="p-t">The past is infinite.</span><span class="p-k">From 1</span></button></li>
        <li data-id="3d" data-kind="derived" data-from="3a 3b 3c"><button type="button" aria-pressed="false" disabled><span class="p-n">3d</span><span class="p-t">So the conditions required for you to be incarnated are repeatable.</span><span class="p-k">From 3a, 3b, 3c</span></button></li>
        <li data-id="3e" data-kind="derived" data-from="3d"><button type="button" aria-pressed="false" disabled><span class="p-n">3e</span><span class="p-t">So if every repeatable condition will obtain again infinitely many times, you will be reincarnated infinitely many times.</span><span class="p-k">From 3d</span></button></li>
      </ol>
    </li>
    <li data-id="4" data-kind="derived" data-from="1 2 3"><button type="button" aria-pressed="false" disabled><span class="p-n">4</span><span class="p-t"><b>Reincarnation.</b> You will be reincarnated, infinitely many times.</span><span class="p-k">From 1, 2, 3</span></button></li>
  </ol>
  <div class="cost" id="cost" aria-live="polite">
    <p class="cost-h">All premises accepted</p>
    <p>The conclusion follows: you will live again, infinitely many times.</p>
  </div>
  <p class="closing">If you could live at most once in the history of the universe, no probability above zero could be given to your living at the present time, with infinitely many earlier centuries available. The best explanation of your otherwise surprising existence is that you are repeatable. Then your living earlier would not have prevented your living now, and your present life will not prevent any number of future lives.</p>
</section>

<footer class="foot">
  <p>Source: Michael Huemer, “Existence Is Evidence of Immortality”. Figures drawn with the <a href="https://github.com/wheresryan22/anatomy">Anatomy</a> isometric kit (MIT): each idea is built as a working object, and each readout is computed from the same model that moves its parts.</p>
</footer>
</main>
</div>`;

  const scriptTag = `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>`;
  const fragment = `${head}\n${body}\n${scriptTag}\n`;
  const standalone = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">${head}</head><body>${body}${scriptTag}</body></html>\n`;
  return { fragment, standalone };
}
