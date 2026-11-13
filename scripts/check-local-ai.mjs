// Guard for the Jarle Local AI architecture (see AI-STUDIO.md).
// Fails CI if Gemini or the Firebase client SDK comes back into package.json or the source,
// which is what direct AI Studio edits have done twice (07.11 and 09.11.2026).
// Note: server/localGenAI.ts is a local drop-in class named GoogleGenAI; only the real SDK import is blocked.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const FORBIDDEN_PACKAGES = ["@google/genai", "@google/generative-ai", "firebase", "firebase-admin", "firebase-functions"];
// Allowed: Firestore rules tooling and the one-off migration scripts that read the old data.
const ALLOWED_PACKAGES = new Set(["@firebase/eslint-plugin-security-rules"]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage", "data"]);
const SKIP_FILES = [/^tests\/rules\//, /^scripts\/(export|import)-firestore/, /^scripts\/check-local-ai\.mjs$/];
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const PATTERNS = [
  [/from\s+["'](@google\/genai|@google\/generative-ai)["']/, "imports the Gemini SDK"],
  [/from\s+["']firebase(\/[^"']*)?["']|import\(\s*["']firebase(\/[^"']*)?["']\s*\)/, "imports the Firebase client SDK"],
  [/process\.env\.(GEMINI_API_KEY|API_KEY)\b/, "reads a Gemini API key", "app-only"],
];
const isTest = (rel) => /(^|\/)tests?\//.test(rel) || /\.test\.[a-z]+$/.test(rel);

const errors = [];
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
  for (const name of Object.keys(pkg[section] || {})) {
    if (ALLOWED_PACKAGES.has(name)) continue;
    if (FORBIDDEN_PACKAGES.includes(name)) errors.push(`package.json ${section}: "${name}" is not allowed (use Jarle Local AI / the server store).`);
  }
}

const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p); continue; }
    const rel = relative(".", p).split("\\").join("/");
    if (!CODE.test(rel) || SKIP_FILES.some((r) => r.test(rel))) continue;
    const text = readFileSync(p, "utf8");
    for (const [re, why, scope] of PATTERNS) {
      if (scope === "app-only" && isTest(rel)) continue; // tests may set fake keys to prove they are not bundled
      if (re.test(text)) errors.push(`${rel}: ${why}.`);
    }
  }
};
walk(".");

if (errors.length) {
  console.error("Local AI guard failed. See AI-STUDIO.md.\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log("OK: no Gemini or Firebase client code (Jarle Local AI guard).");
