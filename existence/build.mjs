// Builds the walkthrough page: node existence/build.mjs
// Writes existence/index.html (a standalone page) and existence/artifact.html (the same page without the document shell).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ISO_CSS } from "../vendor/anatomy/iso-kit.mjs";
import { page } from "./page.mjs";
import * as drop from "./figs/drop.mjs";
import * as wheels from "./figs/wheels.mjs";
import * as coins from "./figs/coins.mjs";
import * as lemma from "./figs/lemma.mjs";
import * as balance from "./figs/balance.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (file) => readFileSync(join(HERE, file), "utf8");
const kitSource = read("../vendor/anatomy/iso-kit.mjs").replace(/^export /gm, "");

const figs = Object.fromEntries([drop, wheels, coins, lemma, balance].map((mod) => { const f = mod.build(); return [f.id, f]; }));

// The kit's theme blocks become tokens that follow the viewer: light by default, dark by preference or toggle.
const darkVars = ISO_CSS.match(/\.iso\{([^}]*)\}/)[1];
const lightVars = ISO_CSS.match(/\.iso\[data-theme="light"\]\{([^}]*)\}/)[1];
const isoCss = ISO_CSS.replace(/\.iso\{[^}]*\}/, "").replace(/\.iso\[data-theme="light"\]\{[^}]*\}/, "");
const themeCss = `.iso{${darkVars}${lightVars}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .iso{${darkVars}}}
:root[data-theme="dark"] .iso{${darkVars}}`;

const live = Object.values(figs)
  .map((f) => `try{(${f.live.toString()})(document.getElementById(${JSON.stringify(f.id)}), ${JSON.stringify(f.constants)});}catch(error){console.error(${JSON.stringify(f.id)}, error);}`)
  .join("\n");
const script = kitSource + "\n" + read("runtime.js") + "\n" + read("page.js") + "\n" + live;

const { fragment, standalone } = page({ figs, css: themeCss + isoCss + read("page.css"), script });
writeFileSync(join(HERE, "artifact.html"), fragment);
writeFileSync(join(HERE, "index.html"), standalone);
console.log("wrote existence/index.html and existence/artifact.html", (standalone.length / 1024).toFixed(0) + " KB");
