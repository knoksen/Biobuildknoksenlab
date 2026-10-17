# 🚀 Release Notes — BioBuild Evidence Lab v3.6.0

**Release Title:** `BioBuild Evidence Lab v3.6.0 — Notion Integration, Windows Quick Launchers, Hotkeys Palette & v3.6 Upgrade`  
**Tag:** `v3.6.0`  
**Status:** Verified & Production Ready

---

## 🌟 Hva er nytt i v3.6.0

### 1. Notion Workspace Integrasjon (REST API v1.2)
- Direkte tilkobling til Notion via offisielle Notion REST API v1.2 (`api.notion.com`).
- Validering av hemmelig integrasjonsnøkkel (`secret_...`) med sanntids tilkoblingstest (`/api/notion/test`).
- 1-Klikk synkronisering av bio-materialer til Notion med automatisk kolonnemapping:
  * Tittel, Kategori, TRL-nivå, EPD GWP (kg CO₂e/kg), Trykkfasthet (MPa), Brannklasse og Akkreditering.
- Generering av rike innholdsblokker:
  * Alive Houses sertifiserings-callout med emoji.
  * Biologisk og kjemisk materialsammensetning.
  * ISO 1182 og ISO 12571 laboratorietester.
  * Gjennomførte forsøk, mikroskop-annoteringer og åpne hypoteser.
- Automatisk database-oppretter: Opprett en komplett "BioBuild Research Lab — Alive Houses" database i Notion med 1 klikk under en hvilken som helst overordnet side.
- Bulk-synkronisering av alle materialer med fremdriftsindikator og direktelenker til Notion.

### 2. Windows Quick Launchers & Snarveier (Win Inst Upgrade)
- **`quicklaunch-biobuild.cmd`**: 1-Klikk hurtigstarter for Windows som verifiserer om serveren allerede kjører på port 3000, bygger produksjonspakken ved behov, og automatisk åpner standard nettleser.
- **`scripts/quicklaunch.ps1`**: PowerShell hurtigstarter med farget statuslogg og portdeteksjon.
- **`scripts/make-shortcuts.ps1`**: Automatisk opprettelse av Windows Desktop-snarvei (`.lnk`) og Start-meny-mappe (`Start > Alive Houses > BioBuild Evidence Lab`).
- **Oppdatert `run-win-installer.bat`**: Integrerer direkte hurtigstart og snarveigenerering i installasjonsmenyen.

### 3. Kommandopalett & Hurtigmeny (`Ctrl + K` / `⌘K`)
- Global hurtigstarter tilgjengelig fra alle skjermbilder med tastaturnavigering (`↑`, `↓`, `↵`).
- Lynraskt søk på tvers av materialer, laboratorie-funksjoner og verktøy.
- Hurtigtaster for alle nøkkelfunksjoner (`Alt+N` for Notion, `Alt+W` for Windows, `Alt+P` for Presentasjon, `Alt+C` for Sammenlign, `Alt+T` for Tabell/CSV, `Alt+E` for Unreal, `Alt+U` for Spaces, `?` for Hjelp).

### 4. 8/8 Automatiserte Verifikasjonstester (100% Passing)
- Utvidet testsuite som nå også dekker Windows Quick Launchers og Notion REST API schema mapping.
