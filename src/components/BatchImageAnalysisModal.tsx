import React, { useState, useRef, useId, useMemo } from 'react';
import {
  Upload,
  Sparkles,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  Play,
  RotateCcw,
  Download,
  Filter,
  Eye,
  Maximize2,
  Clock,
  Check,
  AlertCircle,
  Cpu,
  BarChart3,
  Sliders,
  ChevronRight,
  ZoomIn,
  Flame,
  Droplets,
  Zap,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { BatchImageItem, BatchAnalysisSummary, BioMaterial } from '../types';
import { SAMPLE_BATCH_SPECIMENS } from '../data/sampleBatchImages';

interface BatchImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMaterial?: BioMaterial | null;
  availableMaterials: BioMaterial[];
  onSaveToMaterialTests?: (savedTests: {
    materialId: string;
    specimenLabel: string;
    testStage: string;
    integrityScore: number;
    notes: string;
    photoDataUrl: string;
    defects: string[];
  }[]) => void;
}

export default function BatchImageAnalysisModal({
  isOpen,
  onClose,
  activeMaterial,
  availableMaterials,
  onSaveToMaterialTests,
}: BatchImageAnalysisModalProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Batch Queue
  const [items, setItems] = useState<BatchImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Configuration
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(activeMaterial?.id || availableMaterials[0]?.id || '');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [analysisFocus, setAnalysisFocus] = useState<'comprehensive' | 'cracks' | 'moisture' | 'delamination'>('comprehensive');
  const [testStagePreset, setTestStagePreset] = useState<string>('Standard laboratorietest');

  // Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1);
  const [batchSummary, setBatchSummary] = useState<BatchAnalysisSummary | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Inspection Drawer
  const [inspectedItem, setInspectedItem] = useState<BatchImageItem | null>(null);

  // Filter & View Mode
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'kritisk' | 'moderat' | 'lav' | 'sound'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Target material object
  const targetMaterial = useMemo(() => {
    return availableMaterials.find(m => m.id === selectedMaterialId) || activeMaterial || availableMaterials[0];
  }, [availableMaterials, selectedMaterialId, activeMaterial]);

  if (!isOpen) return null;

  // Handle file uploads (multiple at once)
  const handleFilesAdded = (files: FileList | File[]) => {
    const newItems: BatchImageItem[] = [];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/tiff'];

    Array.from(files).forEach((file, index) => {
      if (!validImageTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|svg|tiff)$/i)) {
        return;
      }

      const reader = new FileReader();
      const itemId = `img-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`;
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const specimenLabel = `Prøve #${items.length + newItems.length + 1} (${cleanName})`;

      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        setItems(prev => prev.map(item => item.id === itemId ? { ...item, previewUrl } : item));
      };
      reader.readAsDataURL(file);

      newItems.push({
        id: itemId,
        name: file.name,
        file,
        previewUrl: '', // updated upon reader.onload
        fileSizeKb: Math.round(file.size / 1024),
        specimenLabel,
        testStage: testStagePreset,
        materialName: targetMaterial?.name || 'Bio-materiale',
        status: 'pending',
      });
    });

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
      setGlobalError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Load standard benchmark specimen dataset
  const handleLoadSampleDataset = () => {
    const sampleItems: BatchImageItem[] = SAMPLE_BATCH_SPECIMENS.map((spec) => ({
      id: `sample-${spec.id}-${Date.now()}`,
      name: spec.name,
      previewUrl: spec.dataUri,
      fileSizeKb: spec.fileSizeKb,
      specimenLabel: spec.specimenLabel,
      testStage: spec.testStage,
      materialName: spec.materialName,
      status: 'pending',
    }));

    setItems(prev => [...prev, ...sampleItems]);
    setGlobalError(null);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (inspectedItem?.id === id) {
      setInspectedItem(null);
    }
  };

  const handleClearAll = () => {
    if (isProcessing) return;
    setItems([]);
    setBatchSummary(null);
    setInspectedItem(null);
    setGlobalError(null);
    setSaveSuccessMessage(null);
  };

  const handleUpdateItem = (id: string, updates: Partial<BatchImageItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    if (inspectedItem?.id === id) {
      setInspectedItem(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Run Batch Processing Pipeline
  const handleRunBatchPipeline = async () => {
    if (items.length === 0) {
      setGlobalError('Legg til minst ett testbilde for å starte batch-analysen.');
      return;
    }

    setIsProcessing(true);
    setGlobalError(null);
    setSaveSuccessMessage(null);

    // Mark all pending
    setItems(prev => prev.map(item => ({ ...item, status: 'pending', errorMessage: undefined })));

    try {
      // Package images for batch request
      const payloadImages = items.map((item, idx) => ({
        id: item.id,
        name: item.name,
        specimenLabel: item.specimenLabel,
        testStage: item.testStage,
        materialName: item.materialName || targetMaterial?.name || 'Bio-materiale',
        capturedImage: item.previewUrl,
      }));

      // Call dedicated batch endpoint
      const response = await fetch('/api/gemini/batch-analyze-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: payloadImages,
          commonMaterialName: targetMaterial?.name || 'Bio-materiale',
          category: targetMaterial?.category || 'Mykologiske',
          model: selectedModel,
          analysisFocus,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Serveren feilet under batch-analysen.');
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        setItems(prev => {
          return prev.map(item => {
            const match = data.results.find((r: any) => r.id === item.id);
            if (!match) return item;
            if (match.status === 'completed' && match.analysis) {
              return {
                ...item,
                status: 'completed',
                durationMs: match.durationMs,
                result: match.analysis,
              };
            }
            return {
              ...item,
              status: 'error',
              errorMessage: match.error || 'Ukjent feil under bildebehandling.',
              durationMs: match.durationMs,
            };
          });
        });
      }

      if (data.batchSummary) {
        setBatchSummary(data.batchSummary);
      }
    } catch (err: any) {
      console.error('Batch pipeline error:', err);
      setGlobalError(err.message || 'Kommunikasjon med Gemini API feilet under batchkjøringen.');
    } finally {
      setIsProcessing(false);
      setActiveItemIndex(-1);
    }
  };

  // Save completed results to material test database
  const handleSaveAllToTestLog = () => {
    const completed = items.filter(it => it.status === 'completed' && it.result);
    if (completed.length === 0) return;

    if (onSaveToMaterialTests && targetMaterial) {
      const records = completed.map(it => ({
        materialId: targetMaterial.id,
        specimenLabel: it.specimenLabel,
        testStage: it.testStage,
        integrityScore: it.result?.integrityScore || 70,
        notes: `[Gemini Batch Forensikk]: ${it.result?.overallCondition}. Defekter: ${it.result?.defectsDetected.join(', ')}. ${it.result?.detailedAnalysis}`,
        photoDataUrl: it.previewUrl,
        defects: it.result?.defectsDetected || [],
      }));

      onSaveToMaterialTests(records);
      setSaveSuccessMessage(`${completed.length} analyserte testprøver ble registrert i testloggen for ${targetMaterial.name}!`);
      setTimeout(() => setSaveSuccessMessage(null), 6000);
    }
  };

  // Export JSON Report
  const handleExportJson = () => {
    const exportData = {
      reportTitle: 'BioBuild Evidence Lab - Batch AI Testrapport',
      exportDate: new Date().toISOString(),
      material: targetMaterial?.name,
      modelUsed: selectedModel,
      analysisFocus,
      summary: batchSummary,
      specimens: items.map(it => ({
        id: it.id,
        filename: it.name,
        specimenLabel: it.specimenLabel,
        testStage: it.testStage,
        materialName: it.materialName,
        status: it.status,
        result: it.result,
        errorMessage: it.errorMessage,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioBuild_Batch_Analyse_${(targetMaterial?.name || 'BioMaterial').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export CSV Summary
  const handleExportCsv = () => {
    const completed = items.filter(it => it.result);
    if (completed.length === 0) return;

    const headers = [
      'Prøvenavn',
      'Filnavn',
      'Teststadium',
      'Materiale',
      'Integritetsscore (%)',
      'Alvorlighetsgrad',
      'Primær feilmodus',
      'Oppdagede defekter',
      'Konfidens (%)',
      'Behandlingstid (ms)'
    ];

    const rows = completed.map(it => [
      `"${it.specimenLabel.replace(/"/g, '""')}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      `"${it.testStage.replace(/"/g, '""')}"`,
      `"${(it.materialName || '').replace(/"/g, '""')}"`,
      it.result?.integrityScore ?? '',
      it.result?.severity ?? '',
      `"${(it.result?.primaryFailureMode || '').replace(/"/g, '""')}"`,
      `"${(it.result?.defectsDetected || []).join('; ').replace(/"/g, '""')}"`,
      it.result?.confidenceScore ?? '',
      it.result?.processingTimeMs ?? ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioBuild_Batch_Analyse_${(targetMaterial?.name || 'BioMaterial').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search
      const matchesSearch = searchTerm === '' ||
        item.specimenLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.result?.defectsDetected.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      // Severity filter
      if (filterSeverity === 'all') return true;
      if (filterSeverity === 'sound') return (item.result?.integrityScore ?? 0) >= 85;
      return item.result?.severity === filterSeverity;
    });
  }, [items, searchTerm, filterSeverity]);

  // Aggregate Stats
  const completedCount = items.filter(i => i.status === 'completed').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;
  const errorCount = items.filter(i => i.status === 'error').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount + errorCount) / items.length * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-pipeline-title"
    >
      <div className="bg-[#fcfbf9] text-[#1c1917] border border-[#d6d3d1] w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="px-6 py-4.5 bg-white border-b border-[#e7e5e4] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800 flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 id="batch-pipeline-title" className="text-base font-bold text-slate-900 tracking-tight">
                  Batch AI Bildeanalyse & Materialforensikk
                </h2>
                <span className="text-[11px] font-mono text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-semibold">
                  Multi-Image Pipeline
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Last opp flere prøvebilder samtidig</span>
                <span aria-hidden="true">·</span>
                <span>Visuell feildiagnostikk</span>
                <span aria-hidden="true">·</span>
                <span>Gemini Multimodal Vision</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Lukk batch-vindu"
              aria-label="Lukk batch-vindu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Action & Feedback Notifications */}
        {saveSuccessMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-semibold text-emerald-800 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {globalError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs font-semibold text-red-800 flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{globalError}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Section 1: Batch Configuration Bar */}
          <section className="bg-white border border-[#e7e5e4] rounded-2xl p-4.5 space-y-4 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Material and Stage Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[220px]">
                  <label htmlFor="batch-material-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tilknyttet bio-materiale
                  </label>
                  <select
                    id="batch-material-select"
                    value={selectedMaterialId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedMaterialId(id);
                      const mat = availableMaterials.find(m => m.id === id);
                      if (mat) {
                        setItems(prev => prev.map(item => ({ ...item, materialName: mat.name })));
                      }
                    }}
                    className="text-xs font-semibold text-slate-800 bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {availableMaterials.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[200px]">
                  <label htmlFor="batch-stage-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Standard teststadium
                  </label>
                  <select
                    id="batch-stage-select"
                    value={testStagePreset}
                    onChange={(e) => {
                      const stage = e.target.value;
                      setTestStagePreset(stage);
                      setItems(prev => prev.map(item => ({ ...item, testStage: stage })));
                    }}
                    className="text-xs font-semibold text-slate-800 bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Standard laboratorietest">Standard laboratorietest</option>
                    <option value="Før mekanisk belastning (Referanse)">Før mekanisk belastning (Referanse)</option>
                    <option value="Etter kompresjonstest (40-60 kN)">Etter kompresjonstest (40-60 kN)</option>
                    <option value="Etter strekk-/bøyeprøving (EN 12089)">Etter strekk-/bøyeprøving (EN 12089)</option>
                    <option value="Etter klimakammer (72t, 95% RH)">Etter klimakammer (72t, 95% RH)</option>
                    <option value="Akselerert aldring / UV-syklus">Akselerert aldring / UV-syklus</option>
                    <option value="Etter frost-tø syklus">Etter frost-tø syklus</option>
                  </select>
                </div>
              </div>

              {/* Model & Analysis Focus */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1 min-w-[210px]">
                  <label htmlFor="batch-model-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-purple-700" />
                    <span>Gemini AI Modell</span>
                  </label>
                  <select
                    id="batch-model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="text-xs font-semibold text-slate-800 bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="gemini-3.8-flash">Gemini 3.8 Flash (Høy hastighet & mikroskopi)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Dyp feilanalyse & resonnering)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Hurtigskann)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[190px]">
                  <label htmlFor="batch-focus-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-blue-700" />
                    <span>Analysefokus</span>
                  </label>
                  <select
                    id="batch-focus-select"
                    value={analysisFocus}
                    onChange={(e) => setAnalysisFocus(e.target.value as any)}
                    className="text-xs font-semibold text-slate-800 bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="comprehensive">Omfattende (Helhetlig test)</option>
                    <option value="cracks">Mikrosprekker & bruddforløp</option>
                    <option value="moisture">Fuktinntrengning & biologisk slitasje</option>
                    <option value="delamination">Delaminering & fiberavbinding</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Drag & Drop Upload Zone */}
          <section
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
              isDragging
                ? 'border-purple-600 bg-purple-50/80 scale-[1.005]'
                : 'border-[#cbd5e1] hover:border-purple-400 bg-white'
            }`}
          >
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) handleFilesAdded(e.target.files);
              }}
              className="sr-only"
            />

            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shadow-xs">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Dra og slipp flere testbilder her
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Støtter JPG, PNG, WebP og SVG fra laboratoriekamera eller mikroskop. Last opp hele prøveserier på én gang.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <label
                  htmlFor={fileInputId}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer transition-all shadow-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Velg filer fra datamaskinen</span>
                </label>

                <button
                  type="button"
                  onClick={handleLoadSampleDataset}
                  className="bg-[#f5f5f4] hover:bg-[#e7e5e4] text-slate-800 border border-[#d6d3d1] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center gap-2"
                  title="Last inn 5 standard laboratorie-prøvebilder med ulike defektmønstre"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Last inn testprøvesett</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Batch Queue & Pipeline Controls */}
          {items.length > 0 && (
            <section className="space-y-4">
              
              {/* Queue Header & Primary Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">
                    Prøvekø ({items.length} bilder lagt til)
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{completedCount} fullført</span>
                    <span aria-hidden="true">·</span>
                    <span>{pendingCount} venter</span>
                    {errorCount > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-red-600 font-semibold">{errorCount} feil</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={isProcessing}
                    className="text-xs font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 px-3 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Tøm liste</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunBatchPipeline}
                    disabled={isProcessing || items.length === 0}
                    className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Kjører AI-Pipeline ({progressPercent}%)...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        <span>Kjør AI-Pipeline på alle {items.length} bilder</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Progress Bar */}
              {isProcessing && (
                <div className="bg-white border border-purple-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-700 animate-pulse" />
                      Prosesserer prøveserie gjennom {selectedModel}...
                    </span>
                    <span className="font-mono font-bold text-purple-800">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                    <span>{completedCount} av {items.length} analysert</span>
                    <span>Parallell chunk-størrelse: 3 forespørsler</span>
                  </div>
                </div>
              )}

              {/* Section 4: Aggregate Batch Synthesis Dashboard */}
              {batchSummary && (
                <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white border border-purple-800/60 rounded-3xl p-6 space-y-5 shadow-xl">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-800/40 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold tracking-tight text-white">
                          Syntetisert Batch-Vurdering
                        </h3>
                        <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                          {batchSummary.totalCompleted} prøver analysert
                        </span>
                      </div>
                      <p className="text-xs text-purple-200/80 mt-1 max-w-2xl leading-relaxed">
                        {batchSummary.batchVerdict}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSaveAllToTestLog}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Lagre alle analyserte prøver i materialets permanente testlogg"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lagre i Testlogg</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportJson}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-3 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Eksporter full JSON-rapport"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportCsv}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-3 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Eksporter CSV-tabell"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                        Gjennomsnittlig Integritet
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-mono font-bold ${
                          batchSummary.avgIntegrityScore >= 80 ? 'text-emerald-400' :
                          batchSummary.avgIntegrityScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {batchSummary.avgIntegrityScore}%
                        </span>
                        <span className="text-[11px] text-purple-200/70 font-sans">
                          {batchSummary.avgIntegrityScore >= 80 ? 'Høy fasthet' :
                           batchSummary.avgIntegrityScore >= 60 ? 'Moderat' : 'Kritisk svikt'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                        Kritiske Prøver
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-rose-400">
                          {batchSummary.defectDistribution.critical}
                        </span>
                        <span className="text-[11px] text-purple-200/70 font-sans">
                          av {batchSummary.totalCompleted}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                        Moderate Avvik
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-amber-300">
                          {batchSummary.defectDistribution.moderate}
                        </span>
                        <span className="text-[11px] text-purple-200/70 font-sans">
                          prøvestykker
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-300/80 tracking-wider">
                        Intakte / Friske
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-mono font-bold text-emerald-400">
                          {batchSummary.defectDistribution.sound}
                        </span>
                        <span className="text-[11px] text-purple-200/70 font-sans">
                          &gt;85% integritet
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Detected Defects Pill List */}
                  {batchSummary.topDefects.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-purple-200/90 uppercase tracking-wider block">
                        Mest frekvente observasjoner i serien:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {batchSummary.topDefects.map((def, idx) => (
                          <div
                            key={idx}
                            className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span className="text-white font-medium">{def.defect}</span>
                            <span className="text-[10px] font-mono bg-purple-400/30 text-purple-200 px-1.5 py-0.5 rounded font-bold">
                              {def.count}x
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* View & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e7e5e4] shadow-2xs">
                
                {/* Search & Severity Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Søk i prøver eller defekter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-xs bg-[#f8fafc] border border-slate-300 rounded-xl px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFilterSeverity('all')}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        filterSeverity === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Alle ({items.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterSeverity('kritisk')}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        filterSeverity === 'kritisk'
                          ? 'bg-white text-rose-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Kritisk
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterSeverity('moderat')}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        filterSeverity === 'moderat'
                          ? 'bg-white text-amber-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Moderat
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterSeverity('sound')}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                        filterSeverity === 'sound'
                          ? 'bg-white text-emerald-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Intakt (&gt;85%)
                    </button>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kortvisning
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tabellvisning
                  </button>
                </div>
              </div>

              {/* View 1: Card Grid */}
              {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item, index) => {
                    const res = item.result;
                    const isCompleted = item.status === 'completed' && res;
                    const isError = item.status === 'error';
                    const isPending = item.status === 'pending';

                    return (
                      <div
                        key={item.id}
                        className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                          isCompleted
                            ? res.severity === 'kritisk'
                              ? 'border-rose-200'
                              : res.severity === 'moderat'
                              ? 'border-amber-200'
                              : 'border-emerald-200'
                            : isError
                            ? 'border-red-300 bg-red-50/20'
                            : 'border-[#e7e5e4]'
                        }`}
                      >
                        <div className="space-y-3">
                          
                          {/* Card Header: Specimen Label & Remove button */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={item.specimenLabel}
                                onChange={(e) => handleUpdateItem(item.id, { specimenLabel: e.target.value })}
                                className="text-xs font-bold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 focus:outline-none transition-colors"
                              />
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                <span>{item.testStage}</span>
                                <span aria-hidden="true">·</span>
                                <span>{item.fileSizeKb} KB</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isProcessing}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Fjern fra batch"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Image Thumbnail with Overlay Badges */}
                          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                            {item.previewUrl ? (
                              <img
                                src={item.previewUrl}
                                alt={item.specimenLabel}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                                Laster forhåndsvisning...
                              </div>
                            )}

                            {/* Floating Action: Inspect Zoom */}
                            <button
                              type="button"
                              onClick={() => setInspectedItem(item)}
                              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                              title="Forstørr og inspiser prøve"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Badge */}
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                              {isCompleted && (
                                <div className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shadow-xs ${
                                  res.integrityScore >= 80
                                    ? 'bg-emerald-600 text-white'
                                    : res.integrityScore >= 60
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}>
                                  {res.integrityScore}% Integritet
                                </div>
                              )}

                              {isPending && (
                                <div className="bg-slate-900/80 text-slate-200 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium backdrop-blur-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Klar for analyse</span>
                                </div>
                              )}

                              {isError && (
                                <div className="bg-rose-700 text-white px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold">
                                  Analyse feilet
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Analysis Diagnosis Content */}
                          {isCompleted && (
                            <div className="space-y-2 pt-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 line-clamp-1">
                                  {res.overallCondition}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                                  {res.primaryFailureMode}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                {res.detailedAnalysis}
                              </p>

                              {/* Defect Tags */}
                              {res.defectsDetected.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {res.defectsDetected.slice(0, 3).map((def, dIdx) => (
                                    <span
                                      key={dIdx}
                                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                    >
                                      {def}
                                    </span>
                                  ))}
                                  {res.defectsDetected.length > 3 && (
                                    <span className="text-[10px] text-slate-400 px-1 py-0.5">
                                      +{res.defectsDetected.length - 3} til
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {isError && (
                            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                              {item.errorMessage}
                            </p>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => setInspectedItem(item)}
                            className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Se detaljrapport</span>
                          </button>

                          {isCompleted && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {res.processingTimeMs} ms
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View 2: Structured Laboratory Table */}
              {viewMode === 'table' && (
                <div className="bg-white border border-[#e7e5e4] rounded-2xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8fafc] text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Prøve</th>
                          <th className="py-3 px-4">Teststadium</th>
                          <th className="py-3 px-4">Status / Score</th>
                          <th className="py-3 px-4">Feilmodus</th>
                          <th className="py-3 px-4">Oppdagede Avvik</th>
                          <th className="py-3 px-4 text-right">Handling</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredItems.map((item) => {
                          const res = item.result;
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                                    <img
                                      src={item.previewUrl}
                                      alt={item.specimenLabel}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block">{item.specimenLabel}</span>
                                    <span className="text-[11px] text-slate-400 font-mono">{item.name}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-slate-600">
                                {item.testStage}
                              </td>

                              <td className="py-3 px-4">
                                {res ? (
                                  <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                      res.integrityScore >= 80
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : res.integrityScore >= 60
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {res.integrityScore}%
                                    </span>
                                    <span className="text-[11px] text-slate-500 capitalize">{res.severity}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-xs">Venter...</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-medium text-slate-800">
                                {res?.primaryFailureMode || '-'}
                              </td>

                              <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                                {res?.defectsDetected.join(', ') || '-'}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setInspectedItem(item)}
                                  className="text-purple-700 hover:text-purple-900 font-bold px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                  Inspiser
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="px-6 py-4 bg-white border-t border-[#e7e5e4] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            <span>BioBuild Evidence Lab Multi-Image Pipeline</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Gemini Vision API v2.4</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              Lukk
            </button>

            {items.some(i => i.status === 'completed') && (
              <button
                type="button"
                onClick={handleSaveAllToTestLog}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lagre analyseresultater i testlogg</span>
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Specimen Detail Forensic Drawer / Modal */}
      {inspectedItem && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800 border border-purple-200">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Forensisk Prøveinspeksjon: {inspectedItem.specimenLabel}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{inspectedItem.materialName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{inspectedItem.testStage}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* High-Res Specimen Image */}
              <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-inner">
                <img
                  src={inspectedItem.previewUrl}
                  alt={inspectedItem.specimenLabel}
                  className="w-full h-full object-contain"
                />

                {inspectedItem.result && (
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-2">
                    <span className={
                      inspectedItem.result.integrityScore >= 80 ? 'text-emerald-400' :
                      inspectedItem.result.integrityScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }>
                      Integritet: {inspectedItem.result.integrityScore}%
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="capitalize">{inspectedItem.result.severity} risiko</span>
                  </div>
                )}
              </div>

              {/* Diagnosis Details */}
              {inspectedItem.result ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Overordnet Laboratoriestatus
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Primær svikt: {inspectedItem.result.primaryFailureMode}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {inspectedItem.result.overallCondition}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed pt-1">
                      {inspectedItem.result.detailedAnalysis}
                    </p>
                  </div>

                  {/* Detected Defects */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Spesifikke Visuelle Observasjoner ({inspectedItem.result.defectsDetected.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {inspectedItem.result.defectsDetected.map((defect, i) => (
                        <div
                          key={i}
                          className="bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-medium text-slate-800 flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>{defect}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Microscopic Observations */}
                  {inspectedItem.result.microscopicObservations && inspectedItem.result.microscopicObservations.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Mikroskopisk Overflateanalyse
                      </span>
                      <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-3.5 space-y-1.5">
                        {inspectedItem.result.microscopicObservations.map((obs, i) => (
                          <div key={i} className="text-xs text-purple-950 flex items-start gap-2">
                            <span className="text-purple-600 font-bold">›</span>
                            <span>{obs}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Anbefalte Tiltak for Laboratoriet
                    </span>
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 space-y-1.5">
                      {inspectedItem.result.recommendations.map((rec, i) => (
                        <div key={i} className="text-xs text-amber-950 flex items-start gap-2 font-medium">
                          <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Denne prøven er ikke analysert enda. Klikk "Kjør AI-Pipeline" for å generere full forensisk rapport.
                </div>
              )}
            </div>

            <footer className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
              >
                Lukk inspeksjon
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
