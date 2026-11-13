# AI Studio rules — knoksen/Biobuildknoksenlab (BioBuild Evidence Lab)

Paste the block below into Google AI Studio (System instructions, or as the first message in every session) before making changes. CI enforces rule 3 with `npm run check:local-ai`.

```text
JARLHALLA RULES FOR AI STUDIO — repo knoksen/Biobuildknoksenlab. Follow them for every change.

1. BRANCH: Never commit or push to main. main changes only through a reviewed pull request.
   Sync to a branch named aistudio/<short-topic>. If the GitHub panel only offers main,
   stop and tell me instead of pushing.
2. START FROM LATEST: Pull from GitHub before changing anything. If your workspace has no
   git history or is behind GitHub, say so and list exactly which files you changed, so
   they can be applied on top of the latest main. Never overwrite server.ts, package.json
   or server/localGenAI.ts with an older copy.
3. AI STACK: This app runs on Jarle Local AI (OpenAI-compatible Ollama on Jarle's PC) through
   server/localGenAI.ts. That file is a local drop-in class named GoogleGenAI; keep using it.
   Do NOT add @google/genai, firebase, firebase-admin or GEMINI_API_KEY. AI is configured
   with AI_BASE_URL / AI_MODEL / AI_VISION_MODEL on the server only.
4. DEPENDENCIES: Change package.json only if the feature needs it, and update the lockfile in
   the same commit. CI installs with "npm install".
5. SMALL CHANGES: One feature per branch. Do not refactor, rename or delete files the feature
   does not need. Keep existing tests in scripts/test-suite.ts and add a test for new logic.
6. CHECKS BEFORE SYNC: npm install, npm run lint, npm test, npm run build,
   npm run check:local-ai. If one fails, fix it or report it. Never push red code.
7. SECRETS: No API keys, tokens or passwords in code, commits or prompts.
8. COMMIT MESSAGE: One line saying what changed and why, then the files touched.
   Never claim tests pass unless you ran them.
9. PREVIEW: AI features need Jarle's PC. In the AI Studio preview they may report
   "offline". That is expected. Do not "fix" it by switching back to Gemini.
10. DATA INTEGRITY (research pilot): Never mark values as accredited, expert-audited or
   literature-verified unless a real source is recorded. Keep accreditationConfirmed and
   expertAudited false by default.
```
