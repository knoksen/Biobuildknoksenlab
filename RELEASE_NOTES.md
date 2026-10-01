# 🚀 Release Notes — BioBuild Evidence Lab v3.5.0

**Release Title:** `BioBuild Evidence Lab v3.5.0 — Pin Clustering, Interactive Presentation & Production Release`  
**Tag:** `v3.5.0`  
**Status:** Verified & Production Ready

---

## 🌟 Hva er nytt i v3.5.0

### 1. Markør-klynger (Pin Clustering) i `TaggedImageOverlay`
- Når flere bilde-markører plasseres tett på hverandre (innenfor `10 %` avstand), slås de automatisk sammen til en felles klyngeindikator med antall markører, puls-halo og forhåndsvisning ved sveving.
- Klikk på klyngeindikatoren utvider klyngen i en sirkulær vifte (*spiderfy*) rundt klyngens senter med en sentral **«Samle (N)»**-knapp for å lukke klyngen igjen.

### 2. Høyreklikk-kontekstmeny med dynamisk rammefarge & Lucide-ikoner
- Høyreklikk på enhver `.group/pin`-markør åpner en hurtigmeny for umiddelbart bytte av kategori, alvorlighetsgrad (`Lav`, `Moderat`, `Kritisk`) og tekstnotat.
- Menyens ytterramme, glød og toppfelt oppdateres dynamisk etter valgt kategori (`Sprekk`, `Fukt`, `Delaminering`, `Misfarging`, `Generelt`).
- Dynamiske Lucide-ikoner (`ShieldAlert`, `Droplets`, `Layers`, `AlertTriangle`, `Target`) vises ved siden av kategorinavnet i både kontekstmenyen, markøretiketten og svevetipset.

### 3. Framer Motion `AnimatePresence` Exit-animasjon
- Markører krymper jevnt ned til `scale: 0` og `opacity: 0` før de fjernes fra DOM-en.

### 4. Interaktiv Presentasjon, Badges, Hurtigstart-knapper & Systemtest
- Ny innebygd **Presentasjon & Release v3.5.0**-modul med interaktive lysbilder (slides), kopierbare GitHub-badges, ett-klikks hurtigstart-knapper og en sanntids diagnostikk- og test-suite (6/6 tester bestått).
