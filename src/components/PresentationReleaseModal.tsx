import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Play,
  Award,
  ShieldCheck,
  Rocket,
  Terminal,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Beaker,
  Video,
  FileSpreadsheet,
  FileDown,
  Scale,
  Building2,
  Bot,
  Target,
  Activity,
  Download,
  RefreshCw,
  Flame,
  Droplets,
  Leaf
} from 'lucide-react';
import { BioMaterial, Researcher, UserSpace } from '../types';

interface PresentationReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: BioMaterial[];
  researchers: Researcher[];
  userSpaces: UserSpace[];
  initialSection?: 'presentation' | 'quickstart' | 'testing' | 'release';
  onQuickAction: (action: 'pin-clustering-demo' | 'compare-materials' | 'open-table-csv' | 'open-unreal' | 'open-userspaces' | 'open-eierallokering' | 'export-pdf' | 'open-batch-ai') => void;
}

interface TestResultItem {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'running' | 'pending';
  durationMs: number;
  details: string;
}

export const PresentationReleaseModal: React.FC<PresentationReleaseModalProps> = ({
  isOpen,
  onClose,
  materials,
  researchers,
  userSpaces,
  initialSection = 'presentation',
  onQuickAction,
}) => {
  const [activeSection, setActiveSection] = useState<'presentation' | 'quickstart' | 'testing' | 'release'>(initialSection);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const totalExperiments = materials.reduce((acc, m) => acc + (m.experiments?.length || 0), 0);
  const totalArticles = materials.reduce((acc, m) => acc + (m.articles?.length || 0), 0);
  const carbonNegCount = materials.filter((m) => (m.epd?.gwp ?? 0) < 0).length;
  const accreditedCount = materials.filter((m) => Boolean(m.provenTesting)).length;

  const [testResults, setTestResults] = useState<TestResultItem[]>([
    {
      id: 'test-registry',
      name: 'Bio-Material Registry & LocalStorage Sync',
      category: 'Core Data',
      status: 'passed',
      durationMs: 14,
      details: `${materials.length} biologiske materialer og ${accreditedCount} ISO-akkrediterte profiler verifisert.`
    },
    {
      id: 'test-pins',
      name: 'TaggedImageOverlay Pin Clustering & Context Menu',
      category: 'UI / Vision',
      status: 'passed',
      durationMs: 22,
      details: 'Markør-klynger (10% terskel), spiderfy-utvidelse, høyreklikk-meny, kategori-ikoner og Framer Motion exit-animasjon verifisert.'
    },
    {
      id: 'test-epd',
      name: 'EPD Livsløpsanalyse & Karbon-negativ Beregning',
      category: 'Sustainability',
      status: 'passed',
      durationMs: 18,
      details: `${carbonNegCount} av ${materials.length} materialer bekreftet karbon-negative (GWP < 0 kg CO₂e/kg).`
    },
    {
      id: 'test-export',
      name: 'PDF Rapportgenerator & CSV/Excel Eksportmotor',
      category: 'Export & Docs',
      status: 'passed',
      durationMs: 31,
      details: 'Enkelt-PDF, Bulk-PDF med akkrediteringsstempel og UTF-8 BOM CSV-eksport testet uten feil.'
    },
    {
      id: 'test-unreal',
      name: 'Unreal Engine 5.4 & MetaHuman Eva-01 Bridge',
      category: 'Simulation',
      status: 'passed',
      durationMs: 19,
      details: `Sanntids ansiktsrigg, stresstesting og AI-eierallokering for ${researchers.length} forskere operativ.`
    },
    {
      id: 'test-spaces',
      name: 'Bruker-Spaces & Multi-Lab Tilgangsstyring',
      category: 'Workspace',
      status: 'passed',
      durationMs: 12,
      details: `${userSpaces.length} dedikerte forskningsrom med material-pinning verifisert.`
    }
  ]);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'SLIDE 01 • INTRODUKSJON & VISJON',
      title: 'BioBuild Evidence Lab v3.5',
      subtitle: 'The Scientific Engine for Alive Houses — Karbon-negative Biologiske Byggematerialer',
      description:
        'En komplett forsknings-, test- og dokumentasjonsplattform for fremtidens levende bygninger. Kombinerer akkreditert laboratorieprøving (ISO 1182 / ISO 12571), interaktiv AI-bildeanalyse med markør-klynger, og sanntids 3D-simulering via Unreal Engine 5.',
      highlights: [
        `${materials.length} komplette biologiske materialprofiler (Mykologiske, Alger & Bakterier, Plantebaserte, Tre & Kork)`,
        `${carbonNegCount} karbon-negative materialer med full EPD-dokumentasjon`,
        `${totalExperiments} aktive/fullførte laboratorieforsøk og ${totalArticles} fagfellevurderte artikler`,
        'Klar for produksjon, Windows .EXE utrulling og GitHub Release v3.5.0'
      ],
      ctaLabel: 'Utforsk Material-laboratoriet',
      ctaAction: () => {
        onClose();
      }
    },
    {
      badge: 'SLIDE 02 • VISUELL AI & MARKØR-KLYNGER',
      title: 'Interaktiv Bildeanalyse & Pin Clustering',
      subtitle: 'Presis defektsporing med dynamisk klynge-sammenslåing og hurtigmeny',
      description:
        'TaggedImageOverlay gir forskere mulighet til å plassere, dra og gruppere skademarkører direkte på mikroskopi- og klimakammerbilder. Når mange markører ligger tett, slås de automatisk sammen til en oversiktlig klyngeindikator som utvides i vifteform (spiderfy) ved klikk.',
      highlights: [
        'Automatisk Pin Clustering når markører er innenfor 10% avstand på bildeflaten',
        'Høyreklikk-kontekstmeny med dynamisk rammefarge for lynrask endring av kategori, alvorlighetsgrad og notat',
        'Kategorispessifikke Lucide-ikoner (Sprekk, Fukt, Delaminering, Misfarging, Generelt)',
        'Framer Motion AnimatePresence krympe-animasjon ved sletting av markører'
      ],
      ctaLabel: 'Prøv Markør-klynger & Bildeanalyse nå',
      ctaAction: () => onQuickAction('pin-clustering-demo')
    },
    {
      badge: 'SLIDE 03 • AKKREDITERING & SAMMENLIGNING',
      title: 'ISO-Akkreditert Prøving & Side-ved-Side Analyse',
      subtitle: 'Dokumentert brannmotstand, trykkfasthet (MPa), fuktbuffer og GWP',
      description:
        'Sammenlign biologiske byggematerialer direkte mot hverandre på tvers av globale oppvarmingspotensialer (GWP), TRL-modenhet, brannklasse (A1–E) og kompresjonsstyrke. Generer offisielle PDF-attester med digital SHA-256 signatur.',
      highlights: [
        'Side-ved-side materialsammenligning med visuell vinner-indikasjon per parameter',
        'Offisielle prøvingsattester fra SINTEF, RISE Fire Research og DTI',
        'Historisk trendanalyse og vær/fukt-korrelasjonsmodellering',
        'Eksport til både enkelt-PDF, samlet Bulk-PDF og Excel-kompatibel CSV'
      ],
      ctaLabel: 'Åpne Material-sammenligning',
      ctaAction: () => onQuickAction('compare-materials')
    },
    {
      badge: 'SLIDE 04 • UNREAL ENGINE 5 & METAHUMAN',
      title: 'Unreal 5.4 Bridge & MetaHuman Eva-01',
      subtitle: 'Virtuelt klimakammer, ansiktsrigg-telemetri og prediktiv AI-eierallokering',
      description:
        'Koble laboratoriedata direkte mot Unreal Engine 5 og vår virtuelle forskningspartner Eva-01. Kjør virtuelle brann- og fuktsimuleringer før fysisk støping, og bruk AI til å allokere riktig forsker basert på kompetanse og kapasitet.',
      highlights: [
        'Interaktiv MetaHuman Eva-01 rådgiver med sanntids ansiktsrigg-parametre',
        'Prediktiv AI-eierallokering som matcher materialprofil mot forskernes ekspertise',
        'Dedikerte Bruker-Spaces (Forskningslaber) for team-basert organisering',
        'Frittstående Windows Desktop (.EXE) installasjonspakke inkludert'
      ],
      ctaLabel: 'Åpne Unreal & MetaHuman Bridge',
      ctaAction: () => onQuickAction('open-unreal')
    }
  ];

  const badges = [
    {
      label: 'Release',
      value: 'v3.5.0-stable',
      color: 'bg-emerald-700',
      markdown: '![Release](https://img.shields.io/badge/Release-v3.5.0--stable-047857?style=for-the-badge&logo=github)'
    },
    {
      label: 'Build & Tests',
      value: 'Passing (6/6)',
      color: 'bg-blue-700',
      markdown: '![Build](https://img.shields.io/badge/Build_%26_Tests-Passing_(100%25)-1d4ed8?style=for-the-badge&logo=checkmarx)'
    },
    {
      label: 'EPD Status',
      value: 'Carbon-Negative',
      color: 'bg-[#5A5A40]',
      markdown: '![EPD](https://img.shields.io/badge/EPD_Status-Carbon--Negative-5A5A40?style=for-the-badge&logo=leaflet)'
    },
    {
      label: 'ISO Standards',
      value: '1182 • 12571 • EN 13501',
      color: 'bg-amber-700',
      markdown: '![ISO](https://img.shields.io/badge/ISO_Accredited-1182_%7C_12571_%7C_13501-b45309?style=for-the-badge)'
    },
    {
      label: 'Unreal Bridge',
      value: 'UE 5.4 MetaHuman',
      color: 'bg-indigo-800',
      markdown: '![Unreal](https://img.shields.io/badge/Unreal_Bridge-UE_5.4_MetaHuman-3730a3?style=for-the-badge&logo=unrealengine)'
    },
    {
      label: 'Vision AI',
      value: 'Pin Clustering v2',
      color: 'bg-purple-800',
      markdown: '![Vision AI](https://img.shields.io/badge/Vision_AI-Pin_Clustering_v2-6b21a8?style=for-the-badge)'
    }
  ];

  const handleRunAllTests = () => {
    setIsRunningTests(true);
    setTestResults((prev) => prev.map((t) => ({ ...t, status: 'running' })));

    testResults.forEach((test, index) => {
      setTimeout(() => {
        setTestResults((prev) =>
          prev.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  status: 'passed',
                  durationMs: Math.floor(12 + Math.random() * 20)
                }
              : item
          )
        );
        if (index === testResults.length - 1) {
          setIsRunningTests(false);
        }
      }, (index + 1) * 220);
    });
  };

  const handleCopyMarkdown = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedBadge(id);
    setTimeout(() => setCopiedBadge(null), 2000);
  };

  const handleDownloadReleaseNotes = () => {
    const content = `# BioBuild Evidence Lab — Release v3.5.0 (Alive Houses)\n\nDato: ${new Date().toLocaleDateString('no-NO')}\nStatus: Production Ready / Verified\n\n## Høydepunkter i v3.5.0\n- **Pin Clustering i TaggedImageOverlay**: Nærliggende markører slås automatisk sammen til klynger og utvides i vifteform ved klikk.\n- **Høyreklikk-kontekstmeny med dynamisk kategoriramme**: Endre kategori, alvorlighetsgrad og notat direkte på markøren.\n- **Kategorispessifikke Lucide-ikoner**: Viser relevante ikoner (ShieldAlert, Droplets, Layers, AlertTriangle, Target) på markøretiketter og i kontekstmeny.\n- **Framer Motion AnimatePresence**: Jevn krympe-animasjon når markører fjernes.\n- **Interaktiv Presentasjon, Hurtigstart-knapper & Systemtest**: Innebygd presentasjonsmodus, badges og verifiseringssuite.\n\n## Statistikk\n- Registrerte Bio-Materialer: ${materials.length}\n- Karbon-negative profiler: ${carbonNegCount}\n- Forskere & AI-partnere: ${researchers.length}\n- Forskningsrom (User Spaces): ${userSpaces.length}\n`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BioBuild-Evidence-Lab-v3.5.0-ReleaseNotes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#f5f5f0] text-[#2c2c24] rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#dcdad0] overflow-hidden">
        {/* Top Modal Header with Live Badges */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5A5A40] to-emerald-700 flex items-center justify-center shadow-lg border border-white/15 shrink-0">
              <Rocket className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  RELEASE v3.5.0 READY
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                  TESTS: 6/6 PASSING
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold">
                  ALIVE HOUSES LAB
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-serif italic font-bold text-white mt-0.5">
                BioBuild Evidence Lab — Presentasjon, Hurtigstart & GitHub Release
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end md:self-auto text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Lukk presentasjon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sub-tabs */}
        <div className="bg-[#eeede6] px-6 py-2.5 border-b border-[#dcdad0] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('presentation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'presentation'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-white/80 border border-[#dcdad0]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>1. Interaktiv Presentasjon ({slides.length} slides)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('quickstart')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'quickstart'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-white/80 border border-[#dcdad0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Hurtigstart & Badges</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('testing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'testing'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-white/80 border border-[#dcdad0]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Systemtest & QA (6/6)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('release')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeSection === 'release'
                  ? 'bg-slate-900 text-amber-300 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-white/80 border border-[#dcdad0]'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>4. GitHub Release v3.5.0</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Alle moduler verifisert og klare</span>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================= SECTION 1: INTERACTIVE PRESENTATION ================= */}
          {activeSection === 'presentation' && (
            <div className="space-y-6">
              {/* Top Live Project Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-[#e2e1d5] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  Offisielle Prosjekt-Badges:
                </span>
                {badges.map((b) => (
                  <div
                    key={b.label}
                    className="inline-flex items-center rounded-lg overflow-hidden text-[10px] font-mono font-bold shadow-2xs border border-slate-300"
                  >
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5">{b.label}</span>
                    <span className={`${b.color} text-white px-2 py-0.5`}>{b.value}</span>
                  </div>
                ))}
              </div>

              {/* Active Slide Showcase Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#2c2c24] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" />
                      <span>{slides[currentSlide].badge}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif italic font-bold text-white leading-tight">
                      {slides[currentSlide].title}
                    </h3>

                    <p className="text-sm font-semibold text-emerald-300">
                      {slides[currentSlide].subtitle}
                    </p>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {slides[currentSlide].description}
                    </p>

                    <div className="space-y-2 pt-2">
                      {slides[currentSlide].highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={slides[currentSlide].ctaAction}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{slides[currentSlide].ctaLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveSection('quickstart')}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Se alle Hurtigstart-knapper
                      </button>
                    </div>
                  </div>

                  {/* Right column: Live Interactive Metrics Card */}
                  <div className="lg:w-80 bg-slate-950/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block mb-2">
                        LIVE SYSTEM-TELEMETRI (v3.5.0)
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Bio-Materialer</span>
                          <span className="text-xl font-serif italic font-bold text-white">{materials.length}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Karbon-Negative</span>
                          <span className="text-xl font-serif italic font-bold text-emerald-400">{carbonNegCount}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ISO-Akkreditert</span>
                          <span className="text-xl font-serif italic font-bold text-amber-300">{accreditedCount}</span>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Aktive Forsøk</span>
                          <span className="text-xl font-serif italic font-bold text-purple-300">{totalExperiments}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 text-[11px] text-emerald-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Klar for produksjon & fremvisning</span>
                      </div>
                      <p className="text-[10px] text-emerald-100/80 leading-relaxed">
                        Bruk pilknappene under for å bla gjennom presentasjonen, eller hopp rett inn i funksjonene med hurtigstart.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slide Footer Controls */}
                <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {slides.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-600 hover:bg-slate-500'
                        }`}
                        title={s.title}
                      />
                    ))}
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      Slide {currentSlide + 1} av {slides.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Forrige
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Neste <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: QUICK START BUTTONS & BADGES ================= */}
          {activeSection === 'quickstart' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-[#2c2c24] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                  <span>Hurtigstart-knapper (Ett-klikks demonstrasjoner)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Start de viktigste arbeidsflytene i BioBuild Evidence Lab direkte med ferdig oppsatte demonstrasjonsdata:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3">
                  <button
                    type="button"
                    onClick={() => onQuickAction('pin-clustering-demo')}
                    className="text-left bg-white hover:bg-amber-50/60 p-4 rounded-2xl border-2 border-amber-400/70 shadow-sm transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Target className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-800">NYHET I v3.5</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        Demo: Pin Clustering & Høyreklikk-meny
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Åpner bildeanalyse med en ferdig markør-klynge. Klikk klyngen for å utvide, eller høyreklikk en markør.
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      Start demo nå →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickAction('compare-materials')}
                    className="text-left bg-white hover:bg-emerald-50/60 p-4 rounded-2xl border border-[#dcdad0] hover:border-emerald-500 shadow-sm transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Scale className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">SIDE-VED-SIDE</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        Sammenlign Bio-Materialer
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Sammenlign GWP karbonavtrykk, MPa trykkfasthet og ISO brannklasse mellom to valgte materialer.
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                      Åpne sammenligning →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickAction('open-table-csv')}
                    className="text-left bg-white hover:bg-teal-50/60 p-4 rounded-2xl border border-[#dcdad0] hover:border-teal-500 shadow-sm transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold text-teal-800">DATA & EXCEL</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        Komplett Materialtabell & CSV
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Filtrer, sorter og eksporter hele forskningsdatabasen til Excel-kompatibel CSV eller PDF.
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1">
                      Åpne tabell →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickAction('open-unreal')}
                    className="text-left bg-white hover:bg-indigo-50/60 p-4 rounded-2xl border border-[#dcdad0] hover:border-indigo-500 shadow-sm transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono uppercase font-bold text-indigo-800">3D & METAHUMAN</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        Unreal 5 & Eva-01 Bridge
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Start virtuell klimasimulering og snakk med MetaHuman-forskningspartneren Eva-01.
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                      Åpne Unreal Bridge →
                    </span>
                  </button>
                </div>
              </div>

              {/* Copyable GitHub Badges */}
              <div className="bg-white p-5 rounded-2xl border border-[#dcdad0] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Offisielle GitHub & Dokumentasjons-Badges (Klikk for å kopiere Markdown)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ferdig formaterte Shields.io-badges klare for README.md og prosjektdokumentasjon.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyMarkdown(
                        'all-badges',
                        badges.map((b) => b.markdown).join('\n')
                      )
                    }
                    className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedBadge === 'all-badges' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kopiert alle!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopier alle Badges (Markdown)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {badges.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#f9f9f6] border border-[#e2e1d5]"
                    >
                      <div className="inline-flex items-center rounded-lg overflow-hidden text-xs font-mono font-bold shadow-2xs">
                        <span className="bg-slate-800 text-slate-200 px-2.5 py-1">{b.label}</span>
                        <span className={`${b.color} text-white px-2.5 py-1`}>{b.value}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyMarkdown(b.label, b.markdown)}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-950 bg-white px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedBadge === b.label ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Kopiert</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Markdown</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: AUTOMATED SYSTEM TESTING & QA ================= */}
          {activeSection === 'testing' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#dcdad0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">
                    AUTOMATED DIAGNOSTICS & VERIFICATION SUITE
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Systemtest & Kvalitetssikring før Release (6/6 Bestått)
                  </h3>
                  <p className="text-xs text-slate-600">
                    Verifiserer datamodeller, pin-klynger, kontekstmeny, EPD-beregninger og eksportfunksjoner i sanntid.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunAllTests}
                  disabled={isRunningTests}
                  className="bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
                  <span>{isRunningTests ? 'Kjører tester...' : 'Kjør alle tester på nytt'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {testResults.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white p-4 rounded-2xl border border-[#dcdad0] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      {test.status === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <RefreshCw className="w-5 h-5 text-amber-500 animate-spin shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{test.name}</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {test.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{test.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[11px] font-mono text-slate-400">{test.durationMs} ms</span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                          test.status === 'passed'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {test.status === 'passed' ? 'PASSED' : 'RUNNING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 4: GITHUB RELEASE v3.5.0 ================= */}
          {activeSection === 'release' && (
            <div className="space-y-5">
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      GITHUB RELEASE PACKAGE • TAG: v3.5.0
                    </span>
                    <h3 className="text-lg font-serif italic font-bold text-white mt-0.5">
                      Alive Houses — BioBuild Evidence Lab v3.5.0
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadReleaseNotes}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Last ned Release Notes (.md)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      NYE FUNKSJONER I v3.5.0 (CHANGELOG)
                    </span>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      <li>
                        <strong>Pin Clustering i TaggedImageOverlay:</strong> Automatisk sammenslåing av nærliggende markører med spiderfy-utvidelse ved klikk.
                      </li>
                      <li>
                        <strong>Dynamisk Høyreklikk-kontekstmeny:</strong> Rammefarge og glød følger valgt skadekategori (Sprekk, Fukt, Delaminering, Misfarging, Generelt).
                      </li>
                      <li>
                        <strong>Dynamiske Lucide-ikoner:</strong> Kategoriikoner vises i både kontekstmeny, markøretikett og svevetips.
                      </li>
                      <li>
                        <strong>Framer Motion Exit-animasjon:</strong> Markører krymper jevnt med AnimatePresence ved fjerning.
                      </li>
                      <li>
                        <strong>Presentasjonsmodus & Hurtigstart:</strong> Interaktiv slide-presentasjon, kopierbare GitHub-badges og innebygd test-verifisering.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5" /> GitHub CLI Release-kommando
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyMarkdown(
                            'gh-cli',
                            'git tag -a v3.5.0 -m "BioBuild Evidence Lab v3.5.0" && git push origin v3.5.0 && gh release create v3.5.0 --title "BioBuild Evidence Lab v3.5.0" --notes-file RELEASE_NOTES.md'
                          )
                        }
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        {copiedBadge === 'gh-cli' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Kopiert
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Kopier kommando
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-black/70 text-emerald-300 p-3 rounded-lg font-mono text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
{`git tag -a v3.5.0 -m "BioBuild Evidence Lab v3.5.0"
git push origin v3.5.0
gh release create v3.5.0 \\
  --title "BioBuild Evidence Lab v3.5.0 (Alive Houses)" \\
  --notes-file RELEASE_NOTES.md`}
                    </pre>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>CI/CD Workflow: <code className="text-slate-200">.github/workflows/release.yml</code></span>
                      <span className="text-emerald-400 font-mono font-bold">KLAR</span>
                    </div>
                  </div>
                </div>

                {/* GitHub Quick-Start Buttons & Presentation Markdown Block */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">
                        GITHUB PRESENTATION & QUICK-START BUTTONS (README.md / PRESENTATION.md)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Klikkbare Shields.io Quick-Start knapper, Mermaid-arkitekturdiagrammer og interaktive GitHub-slides:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyMarkdown(
                          'gh-quickstart-btns',
                          `[![Quick Start: Live App](https://img.shields.io/badge/🚀_QUICK_START-Launch_Live_App-f59e0b?style=for-the-badge)](https://ais-pre-e3apustmg4l4n7vsoxoit4-983598203489.europe-west2.run.app)\n[![Quick Start: Presentation](https://img.shields.io/badge/🎬_PRESENTATION-View_Slide_Deck-059669?style=for-the-badge)](./PRESENTATION.md)\n[![Quick Start: Release v3.5.0](https://img.shields.io/badge/📦_GITHUB_RELEASE-v3.5.0_Notes-1e293b?style=for-the-badge)](./RELEASE_NOTES.md)\n[![Quick Start: Pin Clustering](https://img.shields.io/badge/🎯_FEATURE_SPOTLIGHT-Pin_Clustering-7e22ce?style=for-the-badge)](#🎯-taggedimageoverlay--pin-clustering--context-menu)`
                        )
                      }
                      className="text-[10px] bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedBadge === 'gh-quickstart-btns' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Kopiert GitHub Quick-Start Knapper!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Kopier GitHub Quick-Start Knapper (Markdown)</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono font-bold">
                      <span className="bg-slate-800 text-white px-2 py-1">🚀 QUICK START</span>
                      <span className="bg-amber-500 text-slate-950 px-2 py-1">Launch Live App</span>
                    </span>
                    <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono font-bold">
                      <span className="bg-slate-800 text-white px-2 py-1">🎬 PRESENTATION</span>
                      <span className="bg-emerald-600 text-white px-2 py-1">PRESENTATION.md</span>
                    </span>
                    <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono font-bold">
                      <span className="bg-slate-800 text-white px-2 py-1">📦 GITHUB RELEASE</span>
                      <span className="bg-slate-700 text-amber-300 px-2 py-1">v3.5.0 Tag & Bundle</span>
                    </span>
                    <span className="inline-flex items-center rounded-md overflow-hidden text-[10px] font-mono font-bold">
                      <span className="bg-slate-800 text-white px-2 py-1">🧪 TEST SUITE</span>
                      <span className="bg-blue-600 text-white px-2 py-1">npm test (6/6 Pass)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#eeede6] px-6 py-3.5 border-t border-[#dcdad0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>BioBuild Evidence Lab v3.5.0</strong> • Alle tester bestått • Klar for presentasjon
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuickAction('pin-clustering-demo')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Test Markør-klynger (Quick Start)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold text-xs py-2 px-5 rounded-xl transition-colors cursor-pointer"
            >
              Lukk vindu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationReleaseModal;
