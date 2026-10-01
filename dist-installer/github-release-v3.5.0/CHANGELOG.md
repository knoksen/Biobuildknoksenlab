# Changelog

All notable changes to **BioBuild Evidence Lab (Alive Houses)** are documented in this file.

## [3.5.0] - 2026-09-30

### Added
- **Pin Clustering in `TaggedImageOverlay`**: Automatically merges nearby defect pins (`<= 10%` distance) into a single cluster badge with count, halo, and hover preview list, expanding into a radial fan (*spiderfy*) on click.
- **Right-Click Pin Context Menu (`.pin-context-menu`)**: Allows instant updates to pin category, severity level (`Lav`, `Moderat`, `Kritisk`), and text note directly on the image overlay.
- **Dynamic Category Border Coloring & Lucide Icons**: Context menu border, ring glow, and header dynamically match the selected pin category, accompanied by semantic Lucide icons (`ShieldAlert`, `Droplets`, `Layers`, `AlertTriangle`, `Target`).
- **Framer Motion `AnimatePresence` Exit Animation**: Smoothly shrinks `.group/pin` markers (`scale: 0, opacity: 0`) before unmounting.
- **GitHub Presentation Deck, Badges & Quick-Start Suite**: Added `PRESENTATION.md`, `RELEASE_NOTES.md`, automated test runner (`scripts/test-suite.ts`), GitHub release bundler (`scripts/create-github-release.js`), CI/Release workflows, and in-app Presentation & Release modal.
