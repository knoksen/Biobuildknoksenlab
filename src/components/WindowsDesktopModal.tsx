import React, { useState } from 'react';
import { 
  Monitor, 
  X, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Play, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  FileCode, 
  FolderCheck, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Laptop
} from 'lucide-react';

interface WindowsDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunWinInst?: () => void;
}

export default function WindowsDesktopModal({
  isOpen,
  onClose,
  onRunWinInst
}: WindowsDesktopModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inno' | 'nsis' | 'batch' | 'wizard'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simulation wizard state
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [installProgress, setInstallProgress] = useState<number>(0);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [installPath, setInstallPath] = useState<string>('C:\\Program Files\\BioBuild Evidence Lab');
  const [createDesktopIcon, setCreateDesktopIcon] = useState<boolean>(true);
  const [installFirewallRule, setInstallFirewallRule] = useState<boolean>(true);
  const [installUE5Bridge, setInstallUE5Bridge] = useState<boolean>(true);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
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

  const handleDownloadInnoScript = () => {
    const script = `; BioBuild Evidence Lab - Inno Setup 6 Script
#define MyAppName "BioBuild Evidence Lab"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Alive Houses AS"
#define MyAppURL "https://alivehouses.no"

[Setup]
AppId={{D3A15812-7890-4A3C-9428-B4C728E298F1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
DefaultDirName={localappdata}\\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=..\\dist-installer
OutputBaseFilename=BioBuild_Evidence_Lab_Setup_v1.0.0
Compression=lzma2/ultra64
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\\Norwegian.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "..\\dist\\*"; DestDir: "{app}\\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\\package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\\metadata.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\\start-app.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\\run-win-inst.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\\node_modules\\*"; DestDir: "{app}\\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist

[Icons]
Name: "{group}\\{#MyAppName}"; Filename: "{app}\\start-app.cmd"; WorkingDir: "{app}"
Name: "{autodesktop}\\{#MyAppName}"; Filename: "{app}\\start-app.cmd"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\\start-app.cmd"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: shellexec nowait postinstall skipifsilent
`;
    triggerDownload('BioBuild-Installer.iss', script);
  };

  const handleDownloadBatchInstaller = () => {
    window.location.href = '/api/desktop/file/run-win-installer.bat';
  };

  const handleStartSimulatedInstall = () => {
    setIsInstalling(true);
    setInstallProgress(5);
    setWizardStep(4);

    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsInstalling(false);
          setWizardStep(5);
          return 100;
        }
        return prev + 15;
      });
    }, 350);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#18181f] border border-indigo-900/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        
        {/* Header */}
        <div className="p-5 border-b border-indigo-900/60 bg-indigo-950/70 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif italic text-white tracking-wide">
                  Windows Desktop App & EXE Installer
                </h3>
                <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                  v1.0.0 x64
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Frittstående installasjonsprogram for Windows 10 & 11 med Unreal Engine 5.4 Pixel Streaming
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Lukk vindu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-black/40 border-b border-indigo-900/40 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Oversikt & Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inno')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inno'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Inno Setup 6 (.ISS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nsis')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'nsis'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
            <span>NSIS Setup (.NSI)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-300" />
            <span>1-Klikk Setup (.BAT)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wizard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'wizard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Installer Wizard (Simulator)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-gray-300 space-y-6">

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Architecture highlights banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="bg-indigo-950/40 border border-indigo-900/60 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-indigo-300 font-bold">Målmiljø</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-indigo-400" /> Windows 10 & 11 (x64)
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">D3D12, Vulkan SM6, NVENC</span>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-900/60 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-indigo-300 font-bold">Nettverk & Porter</span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Port 3000 & 8888
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">Express API & WebRTC Signaling</span>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-900/60 p-4 rounded-2xl flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-indigo-300 font-bold">Installasjonsformat</span>
                  <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-amber-300" /> .EXE Setup & Portable
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">Inno Setup 6 / NSIS / CMD</span>
                </div>
              </div>

              {/* Build commands quick bar */}
              <div className="bg-black/50 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    Kommandoer for Windows-pakking
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">package.json scripts</span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">1. Bygg produksjonspakke:</span>
                      <span className="text-emerald-400 font-bold">npm run desktop:build</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm run desktop:build', 'cmd-build')}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'cmd-build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cmd-build' ? 'Kopiert' : 'Kopier'}</span>
                    </button>
                  </div>

                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">2. Klargjør EXE-distribusjon:</span>
                      <span className="text-amber-300 font-bold">npm run dist:win</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm run dist:win', 'cmd-dist')}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'cmd-dist' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cmd-dist' ? 'Kopiert' : 'Kopier'}</span>
                    </button>
                  </div>

                  <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 block text-[9px] uppercase font-bold">3. Kjør Unreal Pixel Streaming Bridge:</span>
                      <span className="text-sky-300 font-bold">npm run win:inst</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('npm run win:inst', 'cmd-win-inst')}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'cmd-win-inst' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cmd-win-inst' ? 'Kopiert' : 'Kopier'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Ready to compile files overview */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FolderCheck className="w-4 h-4 text-emerald-400" />
                  Opprettede Windows Desktop filer i prosjektet
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">installer/BioBuild-Installer.iss</span>
                      <span className="text-[10px] text-gray-400">Inno Setup 6 Compiler Skript</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">installer/BioBuild-Setup.nsi</span>
                      <span className="text-[10px] text-gray-400">NSIS Modern UI Setup Skript</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">run-win-installer.bat</span>
                      <span className="text-[10px] text-gray-400">1-Klikk Windows Setup Launcher</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">desktop/main.cjs</span>
                      <span className="text-[10px] text-gray-400">Electron Native Desktop Bridge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: INNO SETUP ================= */}
          {activeTab === 'inno' && (
            <div className="space-y-4">
              <div className="bg-amber-950/25 border border-amber-800/50 rounded-2xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-amber-200 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    Inno Setup 6 (.ISS) — Standard Windows EXE Installasjonsprogram
                  </h4>
                  <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                    Kompilerer til en frittstående <code>BioBuild_Evidence_Lab_Setup_v1.0.0.exe</code> med grafisk veiviser,
                    skrivebordsikoner, avinstalleringsstøtte i Windows Innstillinger og automatisk brannmuroppsett.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadInnoScript}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Last ned .ISS
                </button>
              </div>

              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-4 space-y-3 font-mono text-[11px]">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Slik kompileres .EXE på Windows:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('ISCC.exe installer\\BioBuild-Installer.iss', 'inno-cmd')}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'inno-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'inno-cmd' ? 'Kopiert!' : 'Kopier kompilatorkommando'}</span>
                  </button>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-amber-300">
                  &quot;%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe&quot; installer\BioBuild-Installer.iss
                </div>
                <p className="text-[10px] text-gray-400">
                  Tips: Inno Setup kan lastes ned gratis fra <a href="https://jrsoftware.org/isinfo.php" target="_blank" rel="noreferrer" className="text-indigo-300 underline">jrsoftware.org</a>.
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 3: NSIS SETUP ================= */}
          {activeTab === 'nsis' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/25 border border-emerald-800/50 rounded-2xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-emerald-200 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    NSIS Setup (.NSI) — Nullsoft Scriptable Install System
                  </h4>
                  <p className="text-xs text-emerald-100/70 mt-1 leading-relaxed">
                    Kompilerer til <code>BioBuild_Setup.exe</code> med Nullsoft Modern UI 2.
                    Kompakt, rask og krever minimale systemressurser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerDownload('BioBuild-Setup.nsi', '; NSIS Script for BioBuild Evidence Lab\nName "BioBuild Evidence Lab"\nOutFile "dist-installer\\BioBuild_Setup.exe"\nInstallDir "$LOCALAPPDATA\\Programs\\BioBuild Evidence Lab"\nSection "Core"\nFile /r "dist"\nSectionEnd\n');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Last ned .NSI
                </button>
              </div>

              <div className="bg-black/60 border border-neutral-800 rounded-2xl p-4 space-y-3 font-mono text-[11px]">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Kompileringskommando:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('makensis installer\\BioBuild-Setup.nsi', 'nsis-cmd')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'nsis-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'nsis-cmd' ? 'Kopiert!' : 'Kopier'}</span>
                  </button>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-emerald-300">
                  makensis installer\BioBuild-Setup.nsi
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: 1-KLIKK BATCH SETUP ================= */}
          {activeTab === 'batch' && (
            <div className="space-y-4">
              <div className="bg-sky-950/25 border border-sky-800/50 rounded-2xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-sky-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    1-Klikk Windows Setup (.BAT / .CMD / .PS1)
                  </h4>
                  <p className="text-xs text-sky-100/70 mt-1 leading-relaxed">
                    Installerer applikasjonen direkte på Windows uten å kreve eksterne kompilatorer.
                    Kopierer filer til <code>%LOCALAPPDATA%\Programs\BioBuild Evidence Lab</code> og genererer skrivebordsikoner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadBatchInstaller}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Last ned .CMD
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-white block">run-win-installer.bat</span>
                  <p className="text-[11px] text-gray-400">
                    Hovedveiviser for Windows med interaktiv meny for installasjon, bygging og start av Unreal Engine 5.4 Pixel Streaming.
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('.\\run-win-installer.bat', 'bat-cmd')}
                    className="bg-neutral-800 hover:bg-neutral-700 text-sky-300 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'bat-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kjør i CMD: .\run-win-installer.bat</span>
                  </button>
                </div>

                <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-2">
                  <span className="font-bold text-white block">run-win-installer.ps1</span>
                  <p className="text-[11px] text-gray-400">
                    Moderne PowerShell-skript for Windows 10 og Windows 11 med fargekodet logg og snarveier.
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('.\\run-win-installer.ps1', 'ps1-cmd')}
                    className="bg-neutral-800 hover:bg-neutral-700 text-sky-300 px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey === 'ps1-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Kjør i PS: .\run-win-installer.ps1</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: WIZARD SIMULATOR ================= */}
          {activeTab === 'wizard' && (
            <div className="space-y-4">
              <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(wizardStep / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Windows title bar mockup */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">
                      BioBuild Evidence Lab Setup Wizard (Steg {wizardStep} av 5)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Windows Installer Simulation</span>
                </div>

                {/* Wizard Step 1: Welcome */}
                {wizardStep === 1 && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                        <Monitor className="w-8 h-8 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          Velkommen til installasjonsveiviseren for BioBuild Evidence Lab
                        </h4>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                          Dette programmet vil installere BioBuild Evidence Lab på din Windows-datamaskin.
                          Inkluderer lokal forskningsdatabase, kjemiske/biologiske analysatorer, og Unreal Engine 5.4 MetaHuman Eva Live Link.
                        </p>
                      </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl border border-neutral-800 text-[11px] text-gray-400">
                      Versjon: <strong>1.0.0</strong> | Utgiver: <strong>Alive Houses AS</strong> | Plattform: <strong>Windows x64</strong>
                    </div>
                  </div>
                )}

                {/* Wizard Step 2: Install Path */}
                {wizardStep === 2 && (
                  <div className="space-y-4 py-2">
                    <h4 className="text-sm font-bold text-white">Velg installasjonsmappe</h4>
                    <p className="text-xs text-gray-300">
                      Hvor vil du at BioBuild Evidence Lab skal installeres?
                    </p>
                    <div className="bg-black/40 p-3 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={installPath}
                        onChange={(e) => setInstallPath(e.target.value)}
                        className="bg-transparent text-white font-mono text-xs w-full focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 block">Nødvendig diskplass: ca. 145 MB</span>
                  </div>
                )}

                {/* Wizard Step 3: Components */}
                {wizardStep === 3 && (
                  <div className="space-y-3 py-2">
                    <h4 className="text-sm font-bold text-white">Velg tilleggsoppgaver</h4>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-neutral-800 cursor-pointer hover:bg-black/50">
                        <input
                          type="checkbox"
                          checked={createDesktopIcon}
                          onChange={(e) => setCreateDesktopIcon(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>Opprett skrivebordsikon (BioBuild Evidence Lab.lnk)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-neutral-800 cursor-pointer hover:bg-black/50">
                        <input
                          type="checkbox"
                          checked={installFirewallRule}
                          onChange={(e) => setInstallFirewallRule(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>Åpne Windows Firewall for Pixel Streaming (Port 3000 & 8888)</span>
                      </label>

                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/30 border border-neutral-800 cursor-pointer hover:bg-black/50">
                        <input
                          type="checkbox"
                          checked={installUE5Bridge}
                          onChange={(e) => setInstallUE5Bridge(e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>Inkluder Unreal Engine 5.4.3 & MetaHuman Eva Live Link-skript</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Wizard Step 4: Progress */}
                {wizardStep === 4 && (
                  <div className="space-y-4 py-4 text-center">
                    <h4 className="text-sm font-bold text-white">Installerer BioBuild Evidence Lab...</h4>
                    <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${installProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-gray-400">
                      <span>Kopierer applikasjonsfiler, shaders og forskningsmodeller...</span>
                      <span>{installProgress}%</span>
                    </div>
                  </div>
                )}

                {/* Wizard Step 5: Finish */}
                {wizardStep === 5 && (
                  <div className="space-y-4 py-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Installasjonen er fullført!
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">
                        BioBuild Evidence Lab er nå installert og klar til bruk på din Windows-datamaskin.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-3.5 py-1.5 rounded-xl">
                      <Check className="w-4 h-4" /> Snarvei opprettet på skrivebordet
                    </div>
                  </div>
                )}

                {/* Wizard Footer Controls */}
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setInstallProgress(0);
                    }}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start på nytt
                  </button>

                  <div className="flex items-center gap-2">
                    {wizardStep > 1 && wizardStep < 4 && (
                      <button
                        type="button"
                        onClick={() => setWizardStep((s) => s - 1)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Tilbake
                      </button>
                    )}

                    {wizardStep < 3 && (
                      <button
                        type="button"
                        onClick={() => setWizardStep((s) => s + 1)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Neste</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {wizardStep === 3 && (
                      <button
                        type="button"
                        onClick={handleStartSimulatedInstall}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Installer nå</span>
                      </button>
                    )}

                    {wizardStep === 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onRunWinInst) onRunWinInst();
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Fullfør & Start BioBuild</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-indigo-900/60 bg-indigo-950/40 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-[11px] text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Klar for Windows-distribusjon: Inno Setup (.iss), NSIS (.nsi) & Batch (.bat)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadInnoScript}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Last ned .ISS</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadBatchInstaller}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Last ned 1-Klikk Setup (.CMD)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
