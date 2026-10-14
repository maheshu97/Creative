# Creative

## Existence Is Evidence of Immortality: an interactive walkthrough

`existence/index.html` is a standalone, interactive walkthrough of Michael Huemer's paper "Existence Is Evidence of Immortality". Open it in a browser; it needs no server.

It follows the method of the [Anatomy](https://github.com/wheresryan22/anatomy) skill: each idea is built as a real, working object rather than a diagram, and every number a figure shows is computed from the same small model (`existence/model.mjs`) that moves its parts.

| Fig | Paper | Object | What it shows |
|---|---|---|---|
| 1 | §2.2 | Ball-drop tower | Zeno run backwards: marks at ½, ¼, ⅛ … of the fall crowd toward the top, so the fall has no first stage. Real timing for a 1 m drop. |
| 2 | §3 | Three index wheels on one crank | Poincaré recurrence: 7 × 9 × 11 = 693 states, so the machine returns to its starting state at turn 693. |
| 3 | §4.2 | Bench of coin flippers | Indexical evidence: "some coin got ten heads" grows likelier with more coins; "this coin, just now" stays at 1/1024. |
| 4 | §4.4 | Probability tank over a century conveyor | The lemma: any fixed share per century runs a 100% budget dry after 1/p centuries; only zero can be paid forever. |
| 5 | §4.5 | Beam balance | Bayes: prior × likelihood on each pan. The two demons, and Permissive vs Restrictive theories of persons as the past grows. |

The page also covers theories of persons (§4.3), the five objections and replies (§5), and the summary argument (§6) as an interactive proof where you can reject a premise and see what it costs.

### Build

```sh
node existence/build.mjs
```

This writes `existence/index.html` (standalone) and `existence/artifact.html` (the same page without the document shell). Node 20+; no dependencies.

- `existence/figs/*.mjs`: one module per figure: static geometry built once with the kit, plus its live code.
- `existence/model.mjs`: the numbers.
- `existence/page.mjs`, `page.css`, `page.js`: the essay, layout, theme toggle and the §6 proof.
- `vendor/anatomy/`: the Anatomy isometric kit (`iso-kit.mjs`, `lathe.mjs`), MIT licensed, see `vendor/anatomy/LICENSE`.
