// Guard for the Jarle Local AI architecture (see AI-STUDIO.md).
// Fails CI if Gemini or the Firebase SDKs come back into package.json or the source,
// which is what direct AI Studio edits did twice (07.11 and 09.11.2026).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Forbidden package roots; any subpath (e.g. firebase/app, firebase-admin/firestore) is forbidden too.
const FORBIDDEN = ["@google/genai", "@google/generative-ai", "firebase", "firebase-admin", "firebase-functions"];
const FORBIDDEN_SCOPES = ["@firebase/"]; // scoped Firebase client packages (@firebase/firestore, ...)
// Allowed: Firestore rules lint tooling. tests/rules and the one-off migration scripts are skipped below.
const ALLOWED = new Set(["@firebase/eslint-plugin-security-rules"]);

const isForbidden = (spec) => {
  if (ALLOWED.has(spec)) return false;
  if (FORBIDDEN_SCOPES.some((s) => spec.startsWith(s))) return true;
  return FORBIDDEN.some((root) => spec === root || spec.startsWith(root + "/"));
};

const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage", "data"]);
const SKIP_FILES = [/^tests\/rules\//, /^scripts\/(export|import)-firestore/, /^scripts\/check-local-ai\.mjs$/];
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const isTest = (rel) => /(^|\/)tests?\//.test(rel) || /\.test\.[a-z]+$/.test(rel);

// Module specifiers in every import form: from "x", import "x", import("x"), require("x"), export ... from "x".
const Q = "[\"'`]"; // single, double or template-literal quotes
const SPEC = `${Q}([^"'\`$]+)${Q}`;
const SPECIFIERS = [
  new RegExp(`\\bfrom\\s*${SPEC}`, "g"),
  new RegExp(`\\bimport\\s*${SPEC}`, "g"),
  new RegExp(`\\bimport\\s*\\(\\s*${SPEC}\\s*[,)]`, "g"), // import("x") and import("x", { ... })
  new RegExp(`\\brequire\\s*\\(\\s*${SPEC}\\s*\\)`, "g"),
];
// Ways to reach Gemini without the SDK. Tests may set fake keys to prove they are not bundled.
const KEY_PATTERNS = [
  // dot or bracket notation: process.env.X, process.env["X"]
  [/process\.env(\.|\[\s*["'`])(GEMINI_API_KEY|API_KEY|GOOGLE_API_KEY)\b/, "reads a Gemini/Google API key"],
  [/import\.meta\.env(\.|\[\s*["'`])VITE_[A-Z0-9_]*(GEMINI|GOOGLE)[A-Z0-9_]*/, "exposes a Gemini/Google key to the browser via Vite"],
  [/generativelanguage\.googleapis\.com/, "calls the Gemini REST API directly"],
];

const errors = [];
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const section of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
  for (const name of Object.keys(pkg[section] || {})) {
    if (isForbidden(name)) errors.push(`package.json ${section}: "${name}" is not allowed (use Jarle Local AI / the server store).`);
  }
}

const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p); continue; }
    const rel = relative(".", p).split("\\").join("/");
    if (!CODE.test(rel) || SKIP_FILES.some((r) => r.test(rel))) continue;
    const text = readFileSync(p, "utf8");
    const found = new Set();
    for (const re of SPECIFIERS) for (const m of text.matchAll(re)) if (isForbidden(m[1])) found.add(m[1]);
    for (const spec of found) errors.push(`${rel}: imports "${spec}".`);
    if (!isTest(rel)) for (const [re, why] of KEY_PATTERNS) if (re.test(text)) errors.push(`${rel}: ${why}.`);
  }
};
walk(".");

if (errors.length) {
  console.error("Local AI guard failed. See AI-STUDIO.md.\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log("OK: no Gemini or Firebase SDK code (Jarle Local AI guard).");
