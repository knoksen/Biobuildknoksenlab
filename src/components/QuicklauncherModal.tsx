import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  Command,
  Database,
  Monitor,
  Video,
  FileSpreadsheet,
  FileDown,
  Scale,
  Award,
  Layers,
  Terminal,
  ExternalLink,
  Target,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Keyboard,
  ArrowRight,
  Download,
  Copy,
  Check,
  Zap,
  Building2,
  Users
} from 'lucide-react';
import { BioMaterial } from '../types';

interface QuicklauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: BioMaterial[];
  onSelectMaterial: (id: string) => void;
  onOpenNotion: () => void;
  onOpenWindowsDesktop: () => void;
  onOpenPresentation: (section?: 'presentation' | 'quickstart' | 'testing' | 'release') => void;
  onOpenComparison: () => void;
  onOpenTableCsv: () => void;
  onOpenUnreal: () => void;
  onOpenEierallokering: () => void;
  onOpenUserSpaces: () => void;
  onOpenPinClusteringDemo: () => void;
  onExportPdf: () => void;
  initialTab?: 'palette' | 'shortcuts' | 'win-launcher';
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  category: 'Handling' | 'Visning' | 'Eksport' | 'Windows';
  icon: React.ReactNode;
  shortcut?: string;
  badge?: string;
  action: () => void;
}

export const QuicklauncherModal: React.FC<QuicklauncherModalProps> = ({
  isOpen,
  onClose,
  materials,
  onSelectMaterial,
  onOpenNotion,
  onOpenWindowsDesktop,
  onOpenPresentation,
  onOpenComparison,
  onOpenTableCsv,
  onOpenUnreal,
  onOpenEierallokering,
  onOpenUserSpaces,
  onOpenPinClusteringDemo,
  onExportPdf,
  initialTab = 'palette'
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'palette' | 'shortcuts' | 'win-launcher'>(initialTab);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const triggerDownload = (filename: string, content: string, mimeType: string = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Base list of quick launcher actions
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'action-notion',
        title: 'Notion Synkronisering & Eksport',
        subtitle: 'Koble til Notion workspace, eksporter materialer og EPD-rapporter med 1 klikk',
        category: 'Handling',
        icon: <Database className="w-4 h-4 text-indigo-400" />,
        shortcut: 'Alt + N',
        badge: 'Notion API',
        action: () => {
          onClose();
          onOpenNotion();
        }
      },
      {
        id: 'action-win-desktop',
        title: 'Windows Desktop Installer (Win Inst)',
        subtitle: '1-Klikk Windows setup, Inno Setup EXE, NSIS og skrivebordsnarveier',
        category: 'Windows',
        icon: <Monitor className="w-4 h-4 text-cyan-400" />,
        shortcut: 'Alt + W',
        badge: 'Win 10/11',
        action: () => {
          onClose();
          onOpenWindowsDesktop();
        }
      },
      {
        id: 'action-presentation',
        title: 'GitHub Presentasjon & Slides Deck',
        subtitle: 'Interaktiv lysbildepresentasjon av BioBuild-arkitektur, EPD og Vision AI',
        category: 'Handling',
        icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
        shortcut: 'Alt + P',
        badge: 'v3.6.0',
        action: () => {
          onClose();
          onOpenPresentation('presentation');
        }
      },
      {
        id: 'action-clustering-demo',
        title: 'Vision AI: Pin Clustering & Spiderfy Demo',
        subtitle: 'Test automatisk samling av defekt-merkelapper (<= 10%), radius-ekspansjon og hurtigmeny',
        category: 'Handling',
        icon: <Target className="w-4 h-4 text-purple-400" />,
        shortcut: 'Alt + D',
        badge: 'Framer Motion',
        action: () => {
          onClose();
          onOpenPinClusteringDemo();
        }
      },
      {
        id: 'action-compare',
        title: 'Sammenligningsmatrise (Side-by-side)',
        subtitle: 'Sammenlign to bio-materialer mot hverandre for GWP, styrke og brannmotstand',
        category: 'Handling',
        icon: <Scale className="w-4 h-4 text-amber-400" />,
        shortcut: 'Alt + C',
        action: () => {
          onClose();
          onOpenComparison();
        }
      },
      {
        id: 'action-table-csv',
        title: 'Materialtabell & Excel CSV Eksport',
        subtitle: 'Tabelloversikt over alle bio-materialer med UTF-8 semikolondelt CSV-eksport',
        category: 'Eksport',
        icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
        shortcut: 'Alt + T',
        action: () => {
          onClose();
          onOpenTableCsv();
        }
      },
      {
        id: 'action-export-pdf',
        title: 'Generer Offisiell ISO PDF Rapport',
        subtitle: 'Generer akkreditert laboratorierapport med SHA-256 verifikasjonsstempel',
        category: 'Eksport',
        icon: <FileDown className="w-4 h-4 text-blue-400" />,
        shortcut: 'Alt + R',
        action: () => {
          onClose();
          onExportPdf();
        }
      },
      {
        id: 'action-unreal',
        title: 'Unreal Engine 5.4 Pixel Streaming & Eva-01',
        subtitle: 'Sanntids 3D-klimakammer og MetaHuman Eva telemetri',
        category: 'Visning',
        icon: <Video className="w-4 h-4 text-indigo-400" />,
        shortcut: 'Alt + E',
        badge: 'UE 5.4.3',
        action: () => {
          onClose();
          onOpenUnreal();
        }
      },
      {
        id: 'action-eierallokering',
        title: 'Eierallokering & Prediktiv AI',
        subtitle: 'Match materialers kjemiske egenskaper med forskerteamets kapasitet og TRL-kompetanse',
        category: 'Visning',
        icon: <Users className="w-4 h-4 text-purple-400" />,
        shortcut: 'Alt + O',
        action: () => {
          onClose();
          onOpenEierallokering();
        }
      },
      {
        id: 'action-userspaces',
        title: 'Laboratorierom & Brukerrom (Spaces)',
        subtitle: 'Organiser bio-materialer i dedikerte forskningsrom med egne fargekoder og filter',
        category: 'Visning',
        icon: <Building2 className="w-4 h-4 text-cyan-400" />,
        shortcut: 'Alt + U',
        action: () => {
          onClose();
          onOpenUserSpaces();
        }
      },
      {
        id: 'action-tests',
        title: 'Kjør 6/6 Automatiserte Verifikasjonstester',
        subtitle: 'Kjør full testsuite for materialskjema, ISO-attestering, pin clustering og release',
        category: 'Handling',
        icon: <FlaskConical className="w-4 h-4 text-amber-400" />,
        shortcut: 'Alt + X',
        action: () => {
          onClose();
          onOpenPresentation('testing');
        }
      }
    ],
    [
      onClose,
      onOpenNotion,
      onOpenWindowsDesktop,
      onOpenPresentation,
      onOpenPinClusteringDemo,
      onOpenComparison,
      onOpenTableCsv,
      onExportPdf,
      onOpenUnreal,
      onOpenEierallokering,
      onOpenUserSpaces
    ]
  );

  // Material items mapped for search
  const materialActions: QuickAction[] = useMemo(
    () =>
      materials.map((m) => ({
        id: `mat-${m.id}`,
        title: m.name,
        subtitle: `${m.category} • TRL ${m.trl} • EPD GWP: ${m.epd?.gwp} kg CO₂e • ${m.testResults?.fireRating || 'Brannklasse N/A'}`,
        category: 'Visning',
        icon: <Layers className="w-4 h-4 text-emerald-400" />,
        badge: (m.epd?.gwp ?? 0) < 0 ? 'Karbonnegativ' : undefined,
        action: () => {
          onClose();
          onSelectMaterial(m.id);
        }
      })),
    [materials, onClose, onSelectMaterial]
  );

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return [...quickActions, ...materialActions.slice(0, 4)];
    }
    const q = query.toLowerCase();
    const actions = quickActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
    const mats = materialActions.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q)
    );
    return [...actions, ...mats];
  }, [query, quickActions, materialActions]);

  // Keyboard navigation inside search results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Søk i materialer, hurtighandlinger, Notion, Windows-installasjon eller hurtigtaster..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          <div className="flex items-center gap-2 ml-2">
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300 border border-slate-600">
              ESC for å lukke
            </span>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-1">
          <button
            onClick={() => setActiveTab('palette')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'palette'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Hurtighandlinger & Søk ({filteredItems.length})
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            Hurtigtaster (Hotkeys Cheat Sheet)
          </button>
          <button
            onClick={() => setActiveTab('win-launcher')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'win-launcher'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Windows Quicklaunchers & Snarveier
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === 'palette' && (
            <div className="space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Ingen resultater for "{query}". Prøv et annet søkeord som "Notion", "Windows", "Mycelium", eller "PDF".
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-3 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-sm'
                          : 'hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-100 truncate">{item.title}</span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="p-3 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-400" />
                  Globale Hurtigtaster i BioBuild Evidence Lab
                </h3>
                <span className="text-[11px] text-slate-400">Virker fra hvilken som helst fane</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Åpne Hurtigmeny & Kommandopalett</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-amber-300">
                    Ctrl + K / ⌘K
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Notion Synkronisering</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-indigo-300">
                    Alt + N
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Windows Desktop Installer (Win Inst)</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-300">
                    Alt + W
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">GitHub Presentasjon & Slides</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-emerald-300">
                    Alt + P
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Sammenligningsmatrise (Side-by-side)</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-200">
                    Alt + C
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Materialtabell & Excel CSV</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-200">
                    Alt + T
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Unreal Engine 5.4 & MetaHuman Eva</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-200">
                    Alt + E
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Forskningsrom (User Spaces)</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-200">
                    Alt + U
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Generer ISO 1182 PDF Rapport</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-slate-200">
                    Alt + R
                  </kbd>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-300">Vis Hurtigtaster-hjelp</span>
                  <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-[11px] text-amber-300">
                    ? eller Shift + /
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'win-launcher' && (
            <div className="p-3 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    Windows Quick Launchers & Hurtigstartere
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Start BioBuild Evidence Lab direkte fra Windows Skrivebord, Start-meny eller Terminal.
                  </p>
                </div>
              </div>

              {/* Launcher 1: Batch Command Launcher */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">1. Rask Windows Hurtigstarter (.CMD)</span>
                  </div>
                  <button
                    onClick={() => {
                      const content = `@echo off\nchcp 65001 >nul\ntitle BioBuild Evidence Lab Quick Launcher\ncd /d "%~dp0"\nstart http://localhost:3000\nif not exist "dist\\server.cjs" (\n    call npm run build\n)\nnode dist/server.cjs\n`;
                      triggerDownload('quicklaunch-biobuild.cmd', content);
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    Last ned quicklaunch-biobuild.cmd
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Dobbeltklikk for å starte den lokale Express- og Vite-serveren og automatisk åpne nettleseren på <code>http://localhost:3000</code>.
                </p>
                <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-cyan-300 flex items-center justify-between">
                  <code>.\\quicklaunch-biobuild.cmd</code>
                  <button
                    onClick={() => copyToClipboard('.\\quicklaunch-biobuild.cmd', 'cmd-line')}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    {copiedKey === 'cmd-line' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Launcher 2: PowerShell Desktop Shortcut Creator */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">2. Opprett Skrivebordsnarvei (.LNK) via PowerShell</span>
                  </div>
                  <button
                    onClick={() => {
                      const ps1Content = `$WshShell = New-Object -comObject WScript.Shell\n$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)\n$shortcut = $WshShell.CreateShortcut("$desktopPath\\BioBuild Evidence Lab.lnk")\n$shortcut.TargetPath = "$PWD\\start-app.cmd"\n$shortcut.WorkingDirectory = "$PWD"\n$shortcut.Description = "BioBuild Evidence Lab"\n$shortcut.Save()\nWrite-Host "[✓] Snarvei opprettet på Skrivebordet!" -ForegroundColor Green\n`;
                      triggerDownload('make-shortcuts.ps1', ps1Content);
                    }}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    Last ned make-shortcuts.ps1
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Kjør denne 1-linjeren i PowerShell for å plassere et ekte BioBuild-ikon direkte på Skrivebordet:
                </p>
                <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-[10.5px] text-amber-300 flex items-center justify-between overflow-x-auto">
                  <span className="truncate mr-2">
                    powershell -ExecutionPolicy Bypass -File .\\scripts\\make-shortcuts.ps1
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'powershell -ExecutionPolicy Bypass -File .\\scripts\\make-shortcuts.ps1',
                        'ps-shortcut'
                      )
                    }
                    className="text-slate-400 hover:text-slate-200 shrink-0"
                  >
                    {copiedKey === 'ps-shortcut' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Launcher 3: Standalone Windows .EXE Installer */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-slate-200">3. Frittstående Windows .EXE Installer</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWindowsDesktop();
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Åpne full veiviser <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Bygger en Inno Setup 6 eller NSIS installasjonspakke som installerer BioBuild i <code>C:\Program Files\BioBuild Evidence Lab</code> med avinstalleringsprogram og brannmur-konfigurasjon for Unreal Engine Pixel Streaming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-t border-slate-700 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[9px] text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[9px] text-slate-300">↓</kbd>
              <span>for å navigere</span>
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-[9px] text-slate-300">↵</kbd>
              <span>for å velge</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            BioBuild Quicklauncher v3.6.0
          </div>
        </div>
      </div>
    </div>
  );
};
