// The numbers every figure shows. Each comes from Huemer, "Existence Is Evidence of Immortality",
// or from the plain mathematics the paper relies on.

// §2.2 Zeno's dropped ball, run backwards: a fall with no first stage.
export const DROP = {
  height: 1, // metres
  g: 9.81,
  fallTime() { return Math.sqrt((2 * this.height) / this.g); },
  timeAt(share) { return Math.sqrt((2 * this.height * share) / this.g); },
};

// §3 Poincaré recurrence in a bounded phase space: three wheels with coprime notch counts.
export const WHEELS = {
  notches: [7, 9, 11],
  get states() { return this.notches.reduce((a, b) => a * b, 1); }, // 693, and the wheels return after lcm = 693 turns
};

// §4.2 The indexicality of evidence: ten flips of a fair coin.
export const COINS = {
  flips: 10,
  pTen: 1 / 1024,
  someCoin(n) { return 1 - (1 - this.pTen) ** n; },
  choices: [1, 2, 4, 8, 1000, 1e6],
};

// §4.4 The lemma about unrepeatable events: a prior p per century cannot be paid out forever.
export const LEMMA = {
  choices: [0.1, 0.01, 0.001, 0],
  centuriesUntilBroke(p) { return p > 0 ? Math.ceil(1 / p) : Infinity; },
};

// §4.5 The two demons, and the same calculation for theories of persons.
export const DEMONS = {
  survive: [1 / 1024, 0], // P(s | Q1), P(s | Q2)
  posterior(prior, like) {
    const a = prior * like[0], b = (1 - prior) * like[1];
    return a + b > 0 ? a / (a + b) : prior;
  },
  // P(you live in this century | Restrictive) over a past N centuries long, uniform: 1/N.
  // P(you live in this century | Permissive) is any nonzero number; the figure uses 1 in 1,000.
  permissiveLike: 1 / 1000,
  pasts: [10, 100, 1e4, 1e8, 1e16, Infinity],
};
