# Changelog

All notable changes to **BioBuild Evidence Lab (Alive Houses)** are documented in this file.

## [3.6.0] - 2026-10-17

### Added
- **Notion Workspace Integration & Two-Way Sync (`/api/notion`)**:
  - Direct connection to Notion API v1.2 with client-side token management.
  - Endpoints for testing connection (`/api/notion/test`), searching workspace databases (`/api/notion/databases`), and auto-creating "BioBuild Research Lab" database (`/api/notion/create-database`).
  - 1-Click single material and bulk material sync (`/api/notion/sync-material`) mapping structured properties (TRL, EPD GWP, Fire Class, Compressive Strength) and rich blocks (biological/chemical composition, ISO attestations, microscopy annotations).
  - In-app `NotionSyncModal` with connection tester, database selector, and live sync log.
- **Windows Desktop Quick Launchers & Shortcut Generators**:
  - `quicklaunch-biobuild.cmd`: 1-Click Windows quick launcher with port 3000 detection and auto-browser launch.
  - `scripts/quicklaunch.ps1`: Modern PowerShell launcher with color-coded diagnostic feedback.
  - `scripts/make-shortcuts.ps1`: Creates native Windows Desktop `.lnk` and Start Menu shortcuts.
  - Updated `run-win-installer.bat` and `scripts/win-installer.js` to support quick launching and shortcut creation.
- **Quicklauncher Command Palette (`Ctrl + K` / `⌘K`) & Hotkeys**:
  - Global `QuicklauncherModal` command palette with real-time search across materials and system actions.
  - Hotkeys cheat sheet (`Alt+N` for Notion, `Alt+W` for Windows, `Alt+P` for Presentation, `Alt+C` for Compare, `Alt+T` for Table/CSV, `Alt+E` for Unreal, `Alt+U` for Spaces, `?` for Help).
- **Automated Test Suite Expansion**:
  - Added tests for Windows Quick Launchers and Notion REST API serialization in `scripts/test-suite.ts` (8/8 tests passing, 100%).
- **Documentation & Presentation Deck**:
  - Updated `README.md`, `PRESENTATION.md`, and `RELEASE_NOTES.md` to reflect all v3.6.0 features.

## [3.5.0] - 2026-09-30

### Added
- **Pin Clustering in `TaggedImageOverlay`**: Automatically merges nearby defect pins (`<= 10%` distance) into a single cluster badge with count, halo, and hover preview list, expanding into a radial fan (*spiderfy*) on click.
- **Right-Click Pin Context Menu (`.pin-context-menu`)**: Allows instant updates to pin category, severity level (`Lav`, `Moderat`, `Kritisk`), and text note directly on the image overlay.
- **Dynamic Category Border Coloring & Lucide Icons**: Context menu border, ring glow, and header dynamically match the selected pin category, accompanied by semantic Lucide icons (`ShieldAlert`, `Droplets`, `Layers`, `AlertTriangle`, `Target`).
- **Framer Motion `AnimatePresence` Exit Animation**: Smoothly shrinks `.group/pin` markers (`scale: 0, opacity: 0`) before unmounting.
- **GitHub Presentation Deck, Badges & Quick-Start Suite**: Added `PRESENTATION.md`, `RELEASE_NOTES.md`, automated test runner (`scripts/test-suite.ts`), GitHub release bundler (`scripts/create-github-release.js`), CI/Release workflows, and in-app Presentation & Release modal.
