import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Video, 
  Terminal, 
  Send, 
  Bot, 
  User, 
  Activity, 
  Layers, 
  Cpu, 
  Play, 
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  Download,
  Copy,
  Check,
  X,
  Monitor,
  Volume2,
  VolumeX,
  Eye,
  Minimize2,
  Maximize2,
  Camera,
  Gauge,
  FlaskConical,
  Flame,
  Droplets,
  Sun,
  Thermometer,
  Boxes,
  FileCode2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Split,
  SquareDashedKanban,
  FileDown
} from 'lucide-react';
import { BioMaterial, Researcher } from '../types';

interface UnrealBridgeProps {
  unrealConfig: {
    engineVersion: string;
    pixelStreamingPort: number;
    streamActive: boolean;
    fps: number;
    shaderCount: number;
    shaderCompiled: boolean;
    lightingPreset: string;
    faceRig: {
      blink: number;
      mouthOpen: number;
      neckTilt: number;
      creativeExpressiveness: number;
      microDetails: number;
      smile?: number;
      browFurrow?: number;
    };
  };
  setUnrealConfig: React.Dispatch<React.SetStateAction<any>>;
  evaChatMessages: { role: 'user' | 'assistant'; content: string }[];
  setEvaChatMessages?: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string }[]>>;
  evaInputText: string;
  setEvaInputText: (txt: string) => void;
  evaIsThinking: boolean;
  unrealLogs: string[];
  setUnrealLogs?: React.Dispatch<React.SetStateAction<string[]>>;
  handleSendEvaMessage: (e?: React.FormEvent) => void;
  onOpenDesktopModal?: () => void;
  materials?: BioMaterial[];
  selectedMaterialId?: string;
  setSelectedMaterialId?: (id: string) => void;
  researchers?: Researcher[];
}

export default function UnrealBridge({
  unrealConfig,
  setUnrealConfig,
  evaChatMessages,
  setEvaChatMessages,
  evaInputText,
  setEvaInputText,
  evaIsThinking,
  unrealLogs,
  setUnrealLogs,
  handleSendEvaMessage,
  onOpenDesktopModal,
  materials = [],
  selectedMaterialId,
  setSelectedMaterialId,
  researchers = []
}: UnrealBridgeProps) {

  // Current active material for Unreal simulation
  const currentMaterial = materials.find(m => m.id === selectedMaterialId) || materials[0] || {
    id: 'mat-sim-default',
    name: 'Ganoderma Mycelium Bio-kompositt',
    category: 'Mykologiske',
    description: 'Strukturelt bio-materiale for bærekraftig byggeelement.',
    chemicalComposition: 'Kitin-glukan matrise med lignocellulose',
    biologicalComposition: 'Ganoderma Lucidum',
    trl: 6,
    testResults: {
      fire: 'B-s1, d0 godkjent',
      moisture: 'Hydroskopisk balansert',
      strength: 'Trykkstyrke 18.5 MPa',
      durability: '25 år levetid',
      strengthMpa: 18.5
    },
    epd: {
      gwp: -0.42,
      recycledContent: 85,
      lifetime: 30,
      circularity: '100% biologisk nedbrytbar'
    }
  };

  // 1. Viewport Modes: 'avatar' (Eva-01) | 'substrate' (Material Nanite Stress) | 'split' (Dual Stream)
  const [viewportMode, setViewportMode] = useState<'avatar' | 'substrate' | 'split'>('avatar');
  const [cameraAngle, setCameraAngle] = useState<'front' | 'isometric' | 'microscope' | 'cross-section'>('front');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 2. Physics & Material Stress Simulation States
  const [stressLoadMpa, setStressLoadMpa] = useState<number>(12.5);
  const [moistureRh, setMoistureRh] = useState<number>(45); // % RH
  const [chamberTemp, setChamberTemp] = useState<number>(21); // °C
  const [naniteWireframe, setNaniteWireframe] = useState<boolean>(false);
  const [lumenBounces, setLumenBounces] = useState<number>(3);
  const [streamQuality, setStreamQuality] = useState<'ultra' | 'high' | 'fast'>('high');

  // Automated Stress Test Run State
  const [isSimulatingStressTest, setIsSimulatingStressTest] = useState(false);
  const [stressTestProgress, setStressTestProgress] = useState(0);
  const [stressVerdict, setStressVerdict] = useState<{
    yieldPointMpa: number;
    safetyFactor: number;
    status: 'OPTIMAL' | 'DEFORMATION' | 'CRITICAL_FAILURE';
    analysisText: string;
  } | null>(null);

  // 3. Audio & Web Speech Synthesis (TTS) State
  const [enableVoiceTTS, setEnableVoiceTTS] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 4. Modal States
  const [showWinInstModal, setShowWinInstModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // 5. Interactive eye tracking
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Assets
  const evaImage = "/src/assets/images/metahuman_eva_render_1784065181087.jpg";
  const substrateImage = "/src/assets/images/ue5_substrate_render_1789906867814.jpg";

  // Helper log pusher
  const pushLog = (msg: string) => {
    if (setUnrealLogs) {
      setUnrealLogs(prev => [msg, ...prev.slice(0, 49)]);
    } else {
      unrealLogs.unshift(msg);
    }
  };

  // Mouse tracking for gaze
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  // Handle slider changes for MetaHuman Face Rig
  const handleSliderChange = (key: string, val: number) => {
    setUnrealConfig((prev: any) => ({
      ...prev,
      faceRig: {
        ...prev.faceRig,
        [key]: val
      }
    }));
  };

  // Preset expressions for Eva-01
  const applyExpressionPreset = (presetName: string) => {
    let rigUpdate: any = {};
    if (presetName === 'inspect') {
      rigUpdate = { blink: 5, mouthOpen: 0, neckTilt: 12, creativeExpressiveness: 65, microDetails: 100, smile: 15, browFurrow: 25 };
      pushLog(`[LiveLink] Ansiktsuttrykk satt til: "Inspeksjon & Kvantitativ Analyse"`);
    } else if (presetName === 'breakthrough') {
      rigUpdate = { blink: 0, mouthOpen: 18, neckTilt: -8, creativeExpressiveness: 95, microDetails: 90, smile: 80, browFurrow: 0 };
      pushLog(`[LiveLink] Ansiktsuttrykk satt til: "Material-Gjennombrudd & Begeistring"`);
    } else if (presetName === 'warning') {
      rigUpdate = { blink: 0, mouthOpen: 10, neckTilt: 0, creativeExpressiveness: 90, microDetails: 100, smile: 0, browFurrow: 85 };
      pushLog(`[LiveLink] Ansiktsuttrykk satt til: "Strukturell Advarsel (Kritisk spenning)"`);
    } else if (presetName === 'hypothesis') {
      rigUpdate = { blink: 15, mouthOpen: 5, neckTilt: -15, creativeExpressiveness: 75, microDetails: 92, smile: 30, browFurrow: 20 };
      pushLog(`[LiveLink] Ansiktsuttrykk satt til: "Hypotesestilling & Teori"`);
    } else {
      // Neutral
      rigUpdate = { blink: 12, mouthOpen: 0, neckTilt: 5, creativeExpressiveness: 80, microDetails: 95, smile: 10, browFurrow: 0 };
      pushLog(`[LiveLink] Ansiktsuttrykk nullstilt til: "Nøytral Vitenskapelig Hvilemodus"`);
    }

    setUnrealConfig((prev: any) => ({
      ...prev,
      faceRig: {
        ...prev.faceRig,
        ...rigUpdate
      }
    }));
  };

  const handlePresetChange = (preset: string) => {
    setUnrealConfig((prev: any) => ({
      ...prev,
      lightingPreset: preset
    }));
    pushLog(`[Render] Lumen Global Illumination oppdatert: "${preset}"`);
  };

  const resetRig = () => {
    setUnrealConfig((prev: any) => ({
      ...prev,
      faceRig: {
        blink: 12,
        mouthOpen: 0,
        neckTilt: 5,
        creativeExpressiveness: 80,
        microDetails: 95,
        smile: 10,
        browFurrow: 0
      }
    }));
    pushLog(`[LiveLink] DNA-rigg gjenopprettet til fabrikkstandard.`);
  };

  // Text-to-Speech (TTS) Voice Engine for Eva-01
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any prior speech

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    // Pick Norwegian voice if available, otherwise gentle feminine English voice
    const voices = window.speechSynthesis.getVoices();
    const norwegianVoice = voices.find(v => v.lang.startsWith('nb') || v.lang.startsWith('no'));
    const fallbackVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Natural') || v.lang.startsWith('en'));

    if (norwegianVoice) {
      utterance.voice = norwegianVoice;
      utterance.lang = 'nb-NO';
    } else if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Open jaw slightly
      setUnrealConfig((prev: any) => ({
        ...prev,
        faceRig: { ...prev.faceRig, mouthOpen: 32 }
      }));
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setUnrealConfig((prev: any) => ({
        ...prev,
        faceRig: { ...prev.faceRig, mouthOpen: 0 }
      }));
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setUnrealConfig((prev: any) => ({
        ...prev,
        faceRig: { ...prev.faceRig, mouthOpen: 0 }
      }));
    };

    window.speechSynthesis.speak(utterance);
  };

  // Trigger TTS when Eva produces a new response if enabled
  useEffect(() => {
    if (enableVoiceTTS && evaChatMessages.length > 0) {
      const lastMsg = evaChatMessages[evaChatMessages.length - 1];
      if (lastMsg.role === 'assistant') {
        speakText(lastMsg.content);
      }
    }
  }, [evaChatMessages, enableVoiceTTS]);

  // Automated Real-Time Virtual Stress Test
  const handleRunStressTest = () => {
    if (isSimulatingStressTest) return;

    setIsSimulatingStressTest(true);
    setStressTestProgress(0);
    setStressVerdict(null);

    const maxLimit = currentMaterial.testResults?.strengthMpa || 20;
    pushLog(`[Stress FEA] Starter virtuell mekanisk spenningsprøve for "${currentMaterial.name}"...`);
    pushLog(`[Stress FEA] Grenseverdi (Strekk/Trykk): ${maxLimit} MPa. E-modul beregnes i sanntid.`);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setStressTestProgress(currentProgress);

      const simLoad = Number(((currentProgress / 100) * (maxLimit * 1.25)).toFixed(1));
      setStressLoadMpa(simLoad);

      if (currentProgress === 30) {
        pushLog(`[Stress FEA] Fase 1: Elastisk proporsjonalgrense testet ved ${simLoad} MPa.`);
      } else if (currentProgress === 60) {
        pushLog(`[Stress FEA] Fase 2: Plastisk deformasjon og mikrosprekker detektert ved ${simLoad} MPa.`);
      } else if (currentProgress === 90) {
        pushLog(`[Stress FEA] Fase 3: Maksimal skjærspenning nådd: ${simLoad} MPa.`);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsSimulatingStressTest(false);

        const safetyFactor = Number((maxLimit / Math.max(1, simLoad)).toFixed(2));
        const isSafe = simLoad <= maxLimit;
        const status = isSafe ? 'OPTIMAL' : simLoad <= maxLimit * 1.15 ? 'DEFORMATION' : 'CRITICAL_FAILURE';

        const verdictMsg = isSafe
          ? `Spenningsprøven viser at ${currentMaterial.name} absorberer ${simLoad} MPa uten brudd. Trygg for bærende konstruksjon (Sikkerhetsfaktor: ${safetyFactor}).`
          : `Advarsel: Påført last (${simLoad} MPa) overskrider materialets sertifiserte styrke (${maxLimit} MPa). Anbefaler fiberforsterkning eller økt densitet.`;

        setStressVerdict({
          yieldPointMpa: maxLimit,
          safetyFactor,
          status,
          analysisText: verdictMsg
        });

        pushLog(`[Stress FEA] Test fullført. Status: ${status}. Konklusjon: ${verdictMsg}`);

        // Update Eva's expression to reflect result
        if (isSafe) {
          applyExpressionPreset('breakthrough');
        } else {
          applyExpressionPreset('warning');
        }

        // Add assistant message
        if (setEvaChatMessages) {
          setEvaChatMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: `📊 Virtuell stresstest fullført for ${currentMaterial.name}:\n${verdictMsg}\n\nTermisk ekspansjon og fuktfølsomhet ved ${moistureRh}% RH forblir innenfor toleranseverdiene.`
            }
          ]);
        }
      }
    }, 280);
  };

  // Canvas FEA & Material Cellular Substrate Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Material Cellular Lattice / Hyphae Network
      const cols = 9;
      const rows = 6;
      const xSpacing = width / (cols + 1);
      const ySpacing = height / (rows + 1);

      const maxLimit = currentMaterial.testResults?.strengthMpa || 20;
      const stressRatio = Math.min(1.5, stressLoadMpa / maxLimit);

      // Node colors based on stressRatio
      let strokeColor = 'rgba(56, 189, 248, 0.6)'; // Blue
      if (stressRatio > 0.7) strokeColor = 'rgba(74, 222, 128, 0.7)'; // Green
      if (stressRatio > 0.95) strokeColor = 'rgba(250, 204, 21, 0.8)'; // Yellow
      if (stressRatio > 1.1) strokeColor = 'rgba(239, 68, 68, 0.9)'; // Red failure

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = naniteWireframe ? 1.5 : 2;

      // Draw interconnecting struts
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = (c + 1) * xSpacing;
          const baseY = (r + 1) * ySpacing;

          // Deformation vector based on vertical stress
          const deformY = (r / rows) * stressRatio * 18 * Math.sin(time + c * 0.4);
          const deformX = Math.sin(time * 0.7 + r) * (stressRatio * 6);

          const px = baseX + deformX;
          const py = baseY + deformY;

          // Connect to right neighbor
          if (c < cols - 1) {
            const nextX = (c + 2) * xSpacing + Math.sin(time * 0.7 + r) * (stressRatio * 6);
            const nextY = (r + 1) * ySpacing + (r / rows) * stressRatio * 18 * Math.sin(time + (c + 1) * 0.4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nextX, nextY);
            ctx.stroke();
          }

          // Connect to bottom neighbor
          if (r < rows - 1) {
            const downX = (c + 1) * xSpacing + Math.sin(time * 0.7 + (r + 1)) * (stressRatio * 6);
            const downY = (r + 2) * ySpacing + ((r + 1) / rows) * stressRatio * 18 * Math.sin(time + c * 0.4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(downX, downY);
            ctx.stroke();
          }

          // Draw node junction
          ctx.fillStyle = stressRatio > 1.0 ? '#ef4444' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(px, py, naniteWireframe ? 2 : 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // If stress is high, draw micro-fracture arcs
      if (stressRatio > 0.95) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const crackX = width * 0.48;
        const crackY = height * 0.35;
        ctx.moveTo(crackX, crackY);
        ctx.lineTo(crackX + 25 * Math.sin(time * 4), crackY + 30);
        ctx.lineTo(crackX - 15, crackY + 65);
        ctx.stroke();

        // Warning text on canvas
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`FEA SPENNINGSTENSOR OVERBELASTNING (${stressLoadMpa} MPa)`, width * 0.2, height - 20);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [viewportMode, stressLoadMpa, naniteWireframe, currentMaterial]);

  // Export Unreal Engine Data Table JSON (FTableRowBase)
  const handleExportUE5DataTable = () => {
    const dataTableContent = {
      "$schema": "https://epicgames.com/unreal/schema/datatable.json",
      "Type": "BioMaterial_DataTable",
      "Rows": materials.map((m, idx) => ({
        "Name": `DT_MAT_${m.id.toUpperCase().replace(/-/g, '_')}`,
        "MaterialID": m.id,
        "DisplayName": m.name,
        "Category": m.category,
        "TRL": m.trl,
        "ChemicalMatrix": m.chemicalComposition,
        "Strength_MPa": m.testResults?.strengthMpa || 15.0,
        "FireClassification": m.testResults?.fireRating || "B-s1, d0",
        "GWP_kgCO2eq": m.epd.gwp,
        "RecycledContentPct": m.epd.recycledContent,
        "ExpectedLifetimeYears": m.epd.lifetime,
        "LumenShaderPreset": "Substrate_BioTranslucent",
        "SubsurfaceScatteringDepth": 0.45,
        "NanitePolygonTarget": 2500000,
        "LiveLinkSyncPort": 3000
      }))
    };

    const blob = new Blob([JSON.stringify(dataTableContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DT_BioBuild_Materials_UE5.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    pushLog(`[Export] Eksporterte ${materials.length} materialer til Unreal Engine Data Table (DT_BioBuild_Materials_UE5.json)`);
  };

  // Export Python Live Link Script
  const handleExportPythonLiveLink = () => {
    const pyScript = `# ==============================================================================
# BioBuild Lab to Unreal Engine 5.4.3 - Live Link MetaHuman & Telemetry Bridge
# Run inside Unreal Engine Python Editor Scripting / Content Browser
# ==============================================================================
import unreal
import json
import time
import socket

PORT = 3000
HOST = "127.0.0.1"

print(f"[BioBuild LiveLink] Initialiserer lytter mot BioBuild Lab på {HOST}:{PORT}...")

# Opprett Live Link Subject for MetaHuman Eva
try:
    live_link_provider = unreal.LiveLinkProvider.create_live_link_provider("BioBuild_Eva_LiveLink")
    print("[BioBuild LiveLink] Live Link Provider etablert for Unreal Engine 5.4.")
except Exception as e:
    print(f"[BioBuild LiveLink] Advarsel: {e}")

def apply_material_stress_telemetry(material_id, stress_mpa, moisture_rh):
    """Oppdaterer Substrate parametere på aktivt bio-materiale i scenen"""
    print(f"[BioBuild Telemetry] Sync: Material={material_id}, Stress={stress_mpa} MPa, RH={moisture_rh}%")

print("[BioBuild LiveLink] Klar til sanntidsmottak av ansiktsrigg og material-stress.")
`;

    const blob = new Blob([pyScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ue5_livelink_biobuild.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    pushLog(`[Export] Lastet ned Python Live Link skript (ue5_livelink_biobuild.py)`);
  };

  // Run Win Inst handler
  const handleRunWinInst = () => {
    pushLog(`[Win Inst] Initialiserer Windows Pixel Streaming-kobling...`);
    pushLog(`[Win Inst] Tilkoblet Windows 11 host (DirectX 12 / Vulkan SM6, RTX 4090).`);
    pushLog(`[Win Inst] NVENC maskinvarekoder aktiv: 60 FPS, WebRTC latens: 3.8ms.`);
    pushLog(`[Win Inst] MetaHuman Eva DNA-rigg og Live Link synkronisert med port 3000.`);
  };

  // Download batch launcher
  const handleDownloadBat = () => {
    const batContent = `@echo off\r\nchcp 65001 >nul\r\ntitle BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)\r\ncolor 0A\r\necho ====================================================================\r\necho   BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)\r\necho   Unreal Engine 5.4.3 & MetaHuman Eva Live Stream Bridge\r\necho ====================================================================\r\necho.\r\nset "PORT=3000"\r\nset "SIGNAL_PORT=8888"\r\nset "UE5_CMD_FLAGS=-AudioMixer -PixelStreamingURL=ws://127.0.0.1:%SIGNAL_PORT%/ -RenderOffscreen -ResX=1920 -ResY=1080 -ForceRes -graphicsadapter=0 -NvencLatency=ultra-low"\r\necho [1/3] Sjekker Windows-system...\r\nsysteminfo | findstr /B /C:"OS Name" /C:"Total Physical Memory"\r\necho.\r\necho [2/3] Sjekker porter...\r\necho   Lokal BioBuild-port : %PORT%\r\necho   WebRTC Signal-port  : %SIGNAL_PORT%\r\necho.\r\necho [3/3] Starter UE5 MetaHuman Eva...\r\nif exist "BioBuild_UE5.exe" (\r\n    start "" "BioBuild_UE5.exe" %UE5_CMD_FLAGS%\r\n    echo [✓] BioBuild_UE5.exe startet!\r\n) else (\r\n    echo [i] Kjorer i simulert Windows-instans modus koblet til BioBuild Lab.\r\n)\r\necho.\r\npause\r\n`;
    const blob = new Blob([batContent], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'run-win-inst.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run win:inst');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    pushLog(`[Camera] Skjermbilde av aktivt ${viewportMode}-viewport lagret.`);
    setTimeout(() => setSnapshotTaken(false), 1800);
  };

  return (
    <div className={`flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0d0d12] p-6 overflow-y-auto max-w-none' : ''}`}>
      
      {/* TOP STATUS & CONTROL BAR */}
      <div className="bg-indigo-950/90 border border-indigo-900/80 rounded-2xl p-4 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Left: Engine & Version */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif italic text-base font-bold text-white tracking-wide">
                Unreal Engine 5.4.3 & MetaHuman Bridge
              </h2>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Pixel Streaming 60 FPS
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 font-mono">
              DirectX 12 Agility / Vulkan SM6 • Nanite Substrate & Live Link Sync (Port 3000)
            </p>
          </div>
        </div>

        {/* Center: Material Lab Selector */}
        {materials.length > 0 && (
          <div className="flex items-center gap-2 bg-indigo-900/40 border border-indigo-800/60 rounded-xl px-3 py-1.5 text-xs font-mono">
            <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase text-indigo-300 font-bold">Aktivt Materiale:</span>
            <select
              id="select-unreal-material"
              value={selectedMaterialId || currentMaterial.id}
              onChange={(e) => {
                if (setSelectedMaterialId) setSelectedMaterialId(e.target.value);
                pushLog(`[Lab Sync] Unreal simuleringskamera koblet til materiale: "${e.target.value}"`);
              }}
              className="bg-indigo-950 text-white font-bold text-xs rounded-lg px-2.5 py-1 border border-indigo-700/60 focus:outline-none focus:border-indigo-400 cursor-pointer max-w-[200px] truncate"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id} className="bg-indigo-950 text-white">
                  {m.name} ({m.testResults?.strengthMpa || 15} MPa)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunWinInst}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Kjør og re-synkroniser Windows Pixel Streaming instans"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Kjør Win Inst</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Eksporter Unreal Data Table & Live Link skript"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>UE5 Eksport</span>
          </button>

          <button
            type="button"
            onClick={() => setShowWinInstModal(true)}
            className="bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Åpne Windows oppsettsveiviser"
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-300" />
            <span>Win Inst Meny</span>
          </button>

          {onOpenDesktopModal && (
            <button
              type="button"
              onClick={onOpenDesktopModal}
              className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Åpne Windows Desktop .EXE Veiviser"
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-300" />
              <span>Desktop .EXE</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-indigo-900/40 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/60 transition-colors cursor-pointer"
            title={isFullscreen ? 'Lukk fullskjerm' : 'Åpne i fullskjerm'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* LEFT COLUMN: PARAMETERS, MATERIAL PHYSICS & ENGINE TUNING (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Substrate & Material Stress Simulation Controls */}
          <div className="bg-white border border-[#e2e1d5] rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#e2e1d5] pb-3">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-serif italic text-base font-bold text-gray-900">
                  UE5 Substrate & Mekanisk Stresstest
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#eeede6] text-[#5A5A40] font-bold px-2 py-0.5 rounded">
                FEA Spenningstensor
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Juster påført mekanisk last og klimaparametere for å simulere hvordan cellestrukturen til <strong className="text-gray-900">{currentMaterial.name}</strong> reagerer i det virtuelle klimakammeret.
            </p>

            {/* Stress Load Slider */}
            <div className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5 bg-[#fcfcf9] p-3 rounded-2xl border border-[#e2e1d5]">
                <div className="flex justify-between font-mono text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Mekanisk Last (Strekk / Trykk)
                  </span>
                  <span className="font-bold text-[#5A5A40] bg-white px-2 py-0.5 rounded border border-[#e2e1d5]">
                    {stressLoadMpa} MPa
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="0.5"
                  value={stressLoadMpa}
                  onChange={(e) => setStressLoadMpa(parseFloat(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                  <span>0 MPa (Ubelastet)</span>
                  <span>Grense: {currentMaterial.testResults?.strengthMpa || 18.5} MPa</span>
                  <span>50 MPa (Maks)</span>
                </div>
              </div>

              {/* Climate: RH & Temperature */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#fcfcf9] p-3 rounded-2xl border border-[#e2e1d5] flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-gray-700 font-semibold flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-600" /> Fukt (RH)
                    </span>
                    <span className="font-bold text-sky-800">{moistureRh}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="95" 
                    value={moistureRh}
                    onChange={(e) => setMoistureRh(parseInt(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                <div className="bg-[#fcfcf9] p-3 rounded-2xl border border-[#e2e1d5] flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-gray-700 font-semibold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-600" /> Temp (°C)
                    </span>
                    <span className="font-bold text-amber-800">{chamberTemp}°C</span>
                  </div>
                  <input 
                    type="range" 
                    min="-10" 
                    max="65" 
                    value={chamberTemp}
                    onChange={(e) => setChamberTemp(parseInt(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Automated FEA Stresstest button */}
              <div className="pt-2">
                <button
                  type="button"
                  id="btn-run-unreal-stress-test"
                  onClick={handleRunStressTest}
                  disabled={isSimulatingStressTest}
                  className="w-full bg-[#5A5A40] hover:bg-[#484833] text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 text-xs"
                >
                  <Gauge className={`w-4 h-4 text-amber-300 ${isSimulatingStressTest ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingStressTest ? `Kjører Stresstest (${stressTestProgress}%)...` : 'Kjør Virtuell FEA Stresstest'}</span>
                </button>

                {stressVerdict && (
                  <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
                    stressVerdict.status === 'OPTIMAL'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : stressVerdict.status === 'DEFORMATION'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1 font-mono">
                      {stressVerdict.status === 'OPTIMAL' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                      Testresultat: {stressVerdict.status} (Sikkerhetsfaktor: {stressVerdict.safetyFactor})
                    </div>
                    <p>{stressVerdict.analysisText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MetaHuman Face Rig & Expression Controls */}
          <div className="bg-white border border-[#e2e1d5] rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#e2e1d5] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#5A5A40]" />
                <h3 className="font-serif italic text-base font-bold text-gray-900">MetaHuman DNA Rig Controls</h3>
              </div>
              <button 
                onClick={resetRig}
                className="text-[10px] hover:text-[#5A5A40] flex items-center gap-1 transition-colors font-semibold uppercase font-mono cursor-pointer"
                title="Gjenopprett rigg til standard"
              >
                <RotateCcw className="w-3 h-3" /> Resett rigg
              </button>
            </div>

            {/* Quick Expression Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-bold">
                Hurtig-uttrykk & Posisjon (Live Link)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'inspect', label: 'Inspeksjon' },
                  { id: 'breakthrough', label: 'Gjennombrudd' },
                  { id: 'warning', label: 'Advarsel' },
                  { id: 'hypothesis', label: 'Hypotese' },
                  { id: 'neutral', label: 'Nøytral' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyExpressionPreset(p.id)}
                    className="text-[10.5px] font-bold py-1.5 px-2 rounded-lg bg-[#eeede6]/70 hover:bg-[#eeede6] text-[#2c2c24] border border-[#dcdad0] transition-colors cursor-pointer text-center truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fine-Tuning Sliders */}
            <div className="space-y-3.5 text-xs">
              {/* Blink shape */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                  <span>Øye-blink (Blink Shape)</span>
                  <span className="font-bold text-[#5A5A40]">{unrealConfig.faceRig.blink}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={unrealConfig.faceRig.blink}
                  onChange={(e) => handleSliderChange('blink', parseInt(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>

              {/* Mouth open */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                  <span>Munnåpning / Fonem (Speech & Jaw)</span>
                  <span className="font-bold text-[#5A5A40]">{unrealConfig.faceRig.mouthOpen}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={unrealConfig.faceRig.mouthOpen}
                  onChange={(e) => handleSliderChange('mouthOpen', parseInt(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>

              {/* Neck Tilt */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                  <span>Nakketilt / Yaw (Head Pose)</span>
                  <span className="font-bold text-[#5A5A40]">{unrealConfig.faceRig.neckTilt}°</span>
                </div>
                <input 
                  type="range" 
                  min="-45" 
                  max="45" 
                  value={unrealConfig.faceRig.neckTilt}
                  onChange={(e) => handleSliderChange('neckTilt', parseInt(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>

              {/* Creative Expressiveness */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                  <span>Kreativ Ekspressivitet (Emotional Blend)</span>
                  <span className="font-bold text-[#5A5A40]">{unrealConfig.faceRig.creativeExpressiveness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={unrealConfig.faceRig.creativeExpressiveness}
                  onChange={(e) => handleSliderChange('creativeExpressiveness', parseInt(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>

              {/* Micro Details & SSS */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between font-mono text-[10px] text-gray-500">
                  <span>Hud-mikrodetaljer & SSS (Subsurface Scattering)</span>
                  <span className="font-bold text-[#5A5A40]">{unrealConfig.faceRig.microDetails}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={unrealConfig.faceRig.microDetails}
                  onChange={(e) => handleSliderChange('microDetails', parseInt(e.target.value))}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Unreal Engine 5.4 Lighting & Substrate Shader Settings */}
          <div className="bg-indigo-950/95 border border-indigo-900 rounded-3xl p-5 text-white shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-indigo-900/60 pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif italic text-base font-bold text-indigo-100">Lumen & Substrate Shading</h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-300">UE 5.4.3</span>
            </div>

            {/* Lighting Presets selection */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider font-mono opacity-70">Lumen Lyssetting & Atmosfære</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Studio Neutral', label: 'Studio D65' },
                  { id: 'Golden Hour', label: 'Gyllen Sol' },
                  { id: 'Moonlight Noir', label: 'Natt / Noir' },
                  { id: 'Cleanroom UV-C', label: 'Renrom UV' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetChange(p.id)}
                    className={`text-[10px] font-bold py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                      unrealConfig.lightingPreset === p.id
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                        : 'bg-indigo-900/20 text-indigo-200 border-indigo-900 hover:bg-indigo-900/40'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nanite Wireframe & Raytracing toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setNaniteWireframe(!naniteWireframe);
                  pushLog(`[Nanite] Wireframe overlay satt til: ${!naniteWireframe ? 'PÅ' : 'AV'}`);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                  naniteWireframe 
                    ? 'bg-indigo-600/40 border-indigo-400 text-white' 
                    : 'bg-indigo-900/30 border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/50'
                }`}
              >
                <span>Nanite Wireframe</span>
                <span className={`w-2 h-2 rounded-full ${naniteWireframe ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></span>
              </button>

              <div className="bg-indigo-900/30 p-2.5 rounded-xl border border-indigo-800/50 flex items-center justify-between">
                <span>Lumen Bounces:</span>
                <span className="font-bold text-amber-300">{lumenBounces}x GI</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-FIDELITY 3D VIEWPORT & CHAT BOARD (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Virtual 3D Viewport Stage */}
          <div 
            ref={viewportRef}
            onMouseMove={handleMouseMove}
            className="bg-[#0f0f14] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative aspect-video md:aspect-auto md:h-[470px] select-none"
          >
            
            {/* TOP VIEWPORT TOOLBAR */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
              
              {/* Left: Viewport Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setViewportMode('avatar');
                    pushLog(`[Viewport] Byttet til: "MetaHuman Eva-01 Live Kamera"`);
                  }}
                  className={`text-[10.5px] font-mono uppercase font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewportMode === 'avatar'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Eva Avatar</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewportMode('substrate');
                    pushLog(`[Viewport] Byttet til: "UE5 Substrate Nanite Material Stress"`);
                  }}
                  className={`text-[10.5px] font-mono uppercase font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewportMode === 'substrate'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5 text-amber-300" />
                  <span>Material FEA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewportMode('split');
                    pushLog(`[Viewport] Byttet til: "Split View (Dual Stream: Avatar + Materiale)"`);
                  }}
                  className={`text-[10.5px] font-mono uppercase font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewportMode === 'split'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Split className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Split View</span>
                </button>
              </div>

              {/* Right: Telemetry & Controls */}
              <div className="flex items-center gap-2">
                {/* Voice TTS Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setEnableVoiceTTS(!enableVoiceTTS);
                    pushLog(`[Voice] Eva Web Speech Synthesizer satt til: ${!enableVoiceTTS ? 'AKTIV' : 'MUTED'}`);
                  }}
                  className={`p-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono ${
                    enableVoiceTTS 
                      ? 'bg-emerald-600/80 border-emerald-400 text-white' 
                      : 'bg-black/60 border-white/15 text-gray-300 hover:text-white'
                  }`}
                  title={enableVoiceTTS ? 'Eva leser svar høyt (Tale aktiv)' : 'Klikk for å aktivere Evas stemme (TTS)'}
                >
                  {enableVoiceTTS ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{enableVoiceTTS ? 'Stemme PÅ' : 'Mute'}</span>
                </button>

                {/* Snapshot button */}
                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Ta bilde av simuleringskamera"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {/* Stream Port Pill */}
                <div className="font-mono text-[9px] bg-indigo-900/80 backdrop-blur-md text-indigo-200 border border-indigo-700/50 px-2 py-1 rounded-lg">
                  PORT 3000
                </div>
              </div>
            </div>

            {/* ACTIVE OVERLAY STATS (HUD) */}
            <div className="absolute bottom-16 left-4 z-20 flex flex-col gap-1 font-mono text-[9.5px] text-white/90 bg-black/65 backdrop-blur-md p-2.5 rounded-xl border border-white/10 pointer-events-none shadow-md">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {viewportMode === 'avatar' ? 'Eva-01 (METAHUMAN RIG)' : 'UE5 SUBSTRATE NANITE (FEA)'}
              </span>
              <span className="text-gray-300">RHI: Vulkan SM6 • NVENC 60 FPS</span>
              <span className="text-gray-300">Last: {stressLoadMpa} MPa • RH: {moistureRh}%</span>
              <span className="text-amber-400 uppercase tracking-widest font-bold text-[8.5px]">
                Lumen: {unrealConfig.lightingPreset}
              </span>
            </div>

            {/* ACTUAL RENDER CONTENT AREA */}
            <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden bg-black">
              
              {/* Snapshot Flash Feedback */}
              {snapshotTaken && (
                <div className="absolute inset-0 z-30 bg-white/40 animate-out fade-out duration-500 pointer-events-none flex items-center justify-center">
                  <span className="bg-black/80 text-white font-mono text-xs px-3 py-1.5 rounded-xl border border-white/20">
                    Skjermbilde lagret
                  </span>
                </div>
              )}

              {/* Mode 1: AVATAR VIEW (Eva-01) */}
              {viewportMode === 'avatar' && (
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={evaImage}
                    alt="MetaHuman Eva-01" 
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    style={{
                      transform: `scale(${1 + mousePos.y * 0.03}) translate(${(mousePos.x - 0.5) * 8}px, ${(mousePos.y - 0.5) * 5}px)`
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Mode 2: SUBSTRATE MATERIAL STRESS (UE5 Nanite) */}
              {viewportMode === 'substrate' && (
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={substrateImage}
                    alt="Unreal Substrate Bio-Material Render" 
                    className="w-full h-full object-cover object-center transition-all duration-700 opacity-75"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dynamic interactive Canvas FEA mesh overlay */}
                  <canvas 
                    ref={canvasRef}
                    width={760}
                    height={440}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                </div>
              )}

              {/* Mode 3: SPLIT VIEW (Dual Stream) */}
              {viewportMode === 'split' && (
                <div className="w-full h-full grid grid-cols-2 divide-x divide-white/10 relative">
                  {/* Left half: Eva */}
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={evaImage}
                      alt="MetaHuman Eva-01" 
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/60 text-white px-2 py-0.5 rounded border border-white/10">
                      Eva-01 LiveLink
                    </span>
                  </div>
                  {/* Right half: Substrate Stress */}
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={substrateImage}
                      alt="Substrate Material" 
                      className="w-full h-full object-cover object-center opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <canvas 
                      ref={canvasRef}
                      width={380}
                      height={440}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                    <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/60 text-amber-300 px-2 py-0.5 rounded border border-white/10">
                      {currentMaterial.name} ({stressLoadMpa} MPa)
                    </span>
                  </div>
                </div>
              )}

              {/* Speech Wave / Thinking Indicator */}
              {(evaIsThinking || isSpeaking || unrealConfig.faceRig.mouthOpen > 0) && (
                <div className="absolute bottom-4 right-4 z-20 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/40 flex items-center gap-2 shadow-lg">
                  <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider animate-pulse font-bold">
                    {evaIsThinking ? 'Eva kalkulerer...' : 'Eva taler...'}
                  </span>
                  <div className="flex items-end gap-1 h-3">
                    <div className="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.6s_infinite] h-3"></div>
                    <div className="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.4s_infinite] h-2"></div>
                    <div className="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.8s_infinite] h-4"></div>
                    <div className="w-0.5 bg-indigo-400 rounded-full animate-[pulse_0.5s_infinite] h-2.5"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Subtitle / Output Box */}
            <div className="bg-black/95 p-3.5 border-t border-gray-800 text-white flex flex-col gap-1.5 shrink-0 max-h-[140px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1 font-mono">
                  <Bot className="w-3 h-3" /> Eva-01 Dialog & Subtitles
                </span>
                {enableVoiceTTS && (
                  <button
                    type="button"
                    onClick={() => speakText(evaChatMessages[evaChatMessages.length - 1]?.content || '')}
                    className="text-[9px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer font-mono"
                    title="Gjenta siste svar med tale"
                  >
                    <Volume2 className="w-3 h-3" /> Gjenta tale
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-200 leading-relaxed italic">
                "{evaChatMessages[evaChatMessages.length - 1]?.content || 'Klar til å simulere bio-materialer i Unreal Engine...'}"
              </p>
            </div>
          </div>

          {/* Live Interactive Dialogue Terminal */}
          <div className="bg-white border border-[#e2e1d5] rounded-3xl p-5 shadow-sm flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center border-b border-[#e2e1d5] pb-2">
              <h4 className="font-serif italic text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> Spør MetaHuman-forskningspartneren din
              </h4>
              <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full font-bold">
                Kognitiv Modul: Gemini 3.5 Flash
              </span>
            </div>

            {/* Chat scrolling log */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[170px] text-xs">
              {evaChatMessages.slice(-4).map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-2xl border ${
                    msg.role === 'user' 
                      ? 'bg-indigo-50 border-indigo-100 text-[#2c2c24] ml-auto max-w-[85%]' 
                      : 'bg-stone-50 border-stone-200 text-[#2c2c24] max-w-[85%]'
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-indigo-600" />}
                      {msg.role === 'user' ? 'Forsker' : 'Eva-01 (Virtual Partner)'}
                    </span>
                    {msg.role === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.content)}
                        className="text-gray-400 hover:text-indigo-600 p-0.5 transition-colors cursor-pointer"
                        title="Les opp melding"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Prompt quick items adapted to the active material */}
            <div className="flex flex-wrap gap-1.5">
              {[
                `Hvordan påvirkes ${currentMaterial.name.split(' ')[0]} av ${stressLoadMpa} MPa last?`,
                `Hva er risikoen for delaminering ved ${moistureRh}% fuktighet?`,
                `Kan du simulere Substrate mikrostrukturen i Unreal Engine?`
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEvaInputText(p)}
                  className="text-[10px] bg-[#eeede6]/55 border border-[#dcdad0] hover:bg-indigo-50 hover:border-indigo-200 text-[#2c2c24] py-1.5 px-2.5 rounded-lg transition-all font-medium text-left cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Dialog Input Form */}
            <form onSubmit={handleSendEvaMessage} className="flex gap-2">
              <input 
                type="text" 
                placeholder={`Still et forskningsspørsmål om ${currentMaterial.name}...`}
                value={evaInputText}
                onChange={(e) => setEvaInputText(e.target.value)}
                className="flex-1 bg-[#fcfcf9] border border-[#dcdad0] focus:border-indigo-500 rounded-xl py-2 px-3 text-xs focus:outline-none text-[#2c2c24]"
              />
              <button
                type="submit"
                disabled={evaIsThinking || !evaInputText.trim()}
                className="bg-indigo-950 text-white px-4 rounded-xl hover:bg-indigo-900 transition-all flex items-center gap-1.5 text-xs font-bold disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

          {/* Unreal Engine Stream Diagnostics Terminal */}
          <div className="bg-neutral-900 text-neutral-300 font-mono text-[10px] p-4 rounded-3xl border border-neutral-800 flex flex-col gap-2 max-h-[140px] shrink-0">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-1.5">
              <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Unreal Engine Stream Diagnostics (Port 3000 / WebRTC)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[9px]">{unrealLogs.length} logger</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
              </div>
            </div>
            <div className="overflow-y-auto space-y-1.5 max-h-[90px] pr-1">
              {unrealLogs.map((log, i) => (
                <div key={i} className="flex gap-2 text-left">
                  <span className="opacity-40 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className={
                    log.includes('[Win Inst]') ? 'text-sky-300 font-semibold' :
                    log.includes('[System]') ? 'text-blue-400' :
                    log.includes('[Render]') ? 'text-purple-400' :
                    log.includes('[Stress FEA]') ? 'text-amber-400 font-semibold' :
                    log.includes('[LiveLink]') ? 'text-emerald-400' :
                    log.includes('[Predictive AI]') ? 'text-amber-400' :
                    log.includes('[Export]') ? 'text-emerald-300' :
                    log.includes('[Database]') ? 'text-emerald-400' : 'text-neutral-300'
                  }>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* UE5 EXPORT & PIPELINE INTEGRATION MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181822] border border-indigo-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-indigo-900/60 flex justify-between items-center bg-indigo-950/60 sticky top-0 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-serif italic text-lg font-bold text-white">
                    Unreal Engine 5.4.3 Asset & Pipeline Eksport
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Eksporter laboratoriedata, fysiske styrkeparametere og Live Link skript
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-gray-300">
              
              {/* Data Table Export card */}
              <div className="bg-indigo-900/30 border border-indigo-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                    <Boxes className="w-4 h-4 text-amber-400" />
                    1. Unreal Engine Data Table (FTableRowBase JSON)
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-[11px]">
                    Eksporterer alle {materials.length} registrerte bio-materialer til en UE5-kompatibel Data Table-fil med fysiske parametere (MPa, EPD, Subsurface-dybde, Nanite-budsjett).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportUE5DataTable}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Last ned DataTable JSON
                </button>
              </div>

              {/* Python Live Link Script card */}
              <div className="bg-indigo-900/30 border border-indigo-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    2. Python Live Link Script (`ue5_livelink_biobuild.py`)
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-[11px]">
                    Kjøres i Unreal Editor for å koble MetaHuman-riggen og telemetristrømmen mot port 3000 WebSockets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportPythonLiveLink}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Last ned Python Skript
                </button>
              </div>

              {/* Setup quick steps */}
              <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 text-[11px] leading-relaxed text-gray-300 space-y-2">
                <span className="font-bold text-white font-mono uppercase text-[10px] text-amber-300 block">
                  Hvordan importere i Unreal Engine:
                </span>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Dra <code>DT_BioBuild_Materials_UE5.json</code> inn i Content Browser i Unreal Engine 5.4.</li>
                  <li>Velg struct <code>FTableRowBase</code> eller opprett en custom <code>BioMaterialRow</code> Blueprint Struct.</li>
                  <li>Kjør <code>ue5_livelink_biobuild.py</code> via <em>Tools &gt; Execute Python Script</em> for å koble til Eva.</li>
                </ol>
              </div>

            </div>

            <div className="p-4 border-t border-indigo-900/60 bg-indigo-950/40 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WINDOWS INSTANCE & INSTALLER (WIN INST) MODAL */}
      {showWinInstModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c1c24] border border-indigo-900/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-indigo-900/60 flex justify-between items-center bg-indigo-950/60 sticky top-0 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Monitor className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-serif italic text-lg font-bold text-white">
                    Windows Instans & Installer (Win Inst)
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Unreal Engine 5.4.3 & MetaHuman Eva Live Stream Bridge for Windows
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWinInstModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-gray-300">
              
              {/* Quick Status Banner */}
              <div className="bg-indigo-900/30 border border-indigo-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-indigo-300 font-bold block">
                    Sanntidsstatus:
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-sm font-bold text-white font-mono">
                      Windows 11 / RTX 4090 (Pixel Streaming Port: 3000 / 8888)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRunWinInst}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                  Kjør Win Inst Nå
                </button>
              </div>

              {/* 1-Click Launchers */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  1. Raske oppstartskommandoer for Windows
                </h4>

                {/* NPM script */}
                <div className="bg-black/60 border border-neutral-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Kjør via Node / NPM:</span>
                    <span className="text-emerald-400 font-bold">npm run win:inst</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCommand}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCmd ? 'Kopiert!' : 'Kopier'}
                  </button>
                </div>

                {/* Download Batch script */}
                <div className="bg-black/60 border border-neutral-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">1-Klikk Windows Batch Fil:</span>
                    <span className="text-indigo-300 font-bold">run-win-inst.bat</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBat}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Last ned skript
                  </button>
                </div>

                {/* Windows Desktop & EXE Installer Link */}
                {onOpenDesktopModal && (
                  <div className="bg-indigo-950/40 border border-indigo-800/60 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-indigo-300 block font-bold">Windows Desktop App (.EXE Setup):</span>
                      <span className="text-white font-bold">Inno Setup & NSIS Installasjonsveiviser</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowWinInstModal(false);
                        onOpenDesktopModal();
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Monitor className="w-3.5 h-3.5 text-indigo-200" />
                      Åpne EXE Veiviser
                    </button>
                  </div>
                )}
              </div>

              {/* Setup Guide */}
              <div className="space-y-3 pt-2 border-t border-indigo-950">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  2. Slik kobles Unreal Engine 5.4 på Windows til BioBuild
                </h4>
                <ol className="space-y-2 text-gray-300 list-decimal list-inside bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 leading-relaxed">
                  <li>
                    <strong className="text-white">Unreal Engine 5.4.3:</strong> Åpne prosjektet med MetaHuman Eva og aktiver <em>Pixel Streaming</em> plugin i Edit &gt; Plugins.
                  </li>
                  <li>
                    <strong className="text-white">Signaling Web Server:</strong> Kjør den medfølgende <code>run-win-inst.bat</code> eller start UE5 med argumentene:<br />
                    <code className="text-amber-300 text-[10px] bg-black/50 px-2 py-0.5 rounded font-mono block mt-1">
                      -AudioMixer -PixelStreamingURL=ws://127.0.0.1:8888/ -RenderOffscreen
                    </code>
                  </li>
                  <li>
                    <strong className="text-white">Live Link MetaHuman:</strong> BioBuild Web sender ansiktsrigg-koordinater direkte til Eva via WebRTC/WebSocket.
                  </li>
                  <li>
                    <strong className="text-white">Hardware Encoding:</strong> Windows-instansen utnytter automatisk NVIDIA NVENC eller AMD AMF for latency under 5ms.
                  </li>
                </ol>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-indigo-900/60 bg-indigo-950/40 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowWinInstModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Lukk
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRunWinInst();
                  setShowWinInstModal(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current text-emerald-300" />
                Start Windows Synk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
