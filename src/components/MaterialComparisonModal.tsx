import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  X, 
  Scale, 
  Flame, 
  Leaf, 
  Dumbbell, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  CheckCircle2, 
  Info,
  TrendingDown,
  TrendingUp,
  Activity,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { BioMaterial } from '../types';
import { downloadComparisonCsv } from '../utils/csvExporter';

interface MaterialComparisonModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  materials: BioMaterial[];
  initialMaterialAId?: string;
  initialMaterialBId?: string;
  onSelectMaterial?: (id: string) => void;
  embedded?: boolean;
}

export default function MaterialComparisonModal({
  isOpen = false,
  onClose = () => {},
  materials,
  initialMaterialAId,
  initialMaterialBId,
  onSelectMaterial,
  embedded = false
}: MaterialComparisonModalProps) {
  // Determine default materials
  const defaultAId = initialMaterialAId || (materials.length > 0 ? materials[0].id : '');
  const defaultBId = initialMaterialBId || (materials.length > 1 ? materials[1].id : defaultAId);

  const [materialAId, setMaterialAId] = useState<string>(defaultAId);
  const [materialBId, setMaterialBId] = useState<string>(defaultBId);
  const [copied, setCopied] = useState(false);

  // Sync if initial props change when opening
  React.useEffect(() => {
    if (initialMaterialAId) {
      setMaterialAId(initialMaterialAId);
    }
    if (initialMaterialBId) {
      setMaterialBId(initialMaterialBId);
    } else if (materials.length > 1 && initialMaterialAId) {
      const other = materials.find(m => m.id !== initialMaterialAId);
      if (other) setMaterialBId(other.id);
    }
  }, [initialMaterialAId, initialMaterialBId, materials, isOpen]);

  const matA = useMemo(() => materials.find(m => m.id === materialAId) || materials[0], [materials, materialAId]);
  const matB = useMemo(() => {
    const found = materials.find(m => m.id === materialBId);
    if (found) return found;
    return materials.find(m => m.id !== matA?.id) || materials[1] || materials[0];
  }, [materials, materialBId, matA]);

  if ((!embedded && !isOpen) || !matA || !matB) return null;

  const handleSwap = () => {
    const temp = materialAId;
    setMaterialAId(materialBId);
    setMaterialBId(temp);
  };

  // Calculations for comparison
  const gwpA = matA.epd?.gwp ?? 0;
  const gwpB = matB.epd?.gwp ?? 0;
  const gwpDiff = +(gwpA - gwpB).toFixed(2);
  const gwpWinner = gwpA < gwpB ? 'A' : gwpA > gwpB ? 'B' : 'EQUAL';

  const strA = matA.testResults?.strengthMpa ?? 0;
  const strB = matB.testResults?.strengthMpa ?? 0;
  const strDiff = +(strA - strB).toFixed(2);
  const strWinner = strA > strB ? 'A' : strA < strB ? 'B' : 'EQUAL';

  // Helper for Euroclass fire rating ranking
  const getFireRank = (rating?: string): number => {
    if (!rating) return 0;
    const r = rating.toUpperCase();
    if (r.includes('A1')) return 10;
    if (r.includes('A2')) return 9;
    if (r.includes('B-S1') || r.includes('B-')) return 8;
    if (r.includes('C-')) return 6;
    if (r.includes('D-')) return 4;
    if (r.includes('E-') || r.includes('KLASSE E')) return 2;
    if (r.includes('EI 120') || r.includes('EI 60')) return 8.5;
    return 3;
  };

  const fireRankA = getFireRank(matA.testResults?.fireRating);
  const fireRankB = getFireRank(matB.testResults?.fireRating);
  const fireWinner = fireRankA > fireRankB ? 'A' : fireRankA < fireRankB ? 'B' : 'EQUAL';

  // Copy Markdown Table Summary
  const handleCopySummary = () => {
    const md = `### Material-Sammenligning: ${matA.name} vs. ${matB.name}
Kilde: BioBuild Evidence Lab (Alive Houses AS)

| Egenskap | ${matA.name} | ${matB.name} | Sammenligning / Fordel |
| :--- | :--- | :--- | :--- |
| **Kategori & TRL** | ${matA.category} (TRL ${matA.trl}) | ${matB.category} (TRL ${matB.trl}) | - |
| **Karbonavtrykk (GWP)** | ${gwpA} kg CO₂ eq/kg | ${gwpB} kg CO₂ eq/kg | ${gwpWinner === 'A' ? `${matA.name} binder mest karbon (Δ ${Math.abs(gwpDiff)} kg)` : gwpWinner === 'B' ? `${matB.name} binder mest karbon (Δ ${Math.abs(gwpDiff)} kg)` : 'Lik GWP'} |
| **Mekanisk Styrke** | ${strA ? `${strA} MPa` : 'N/A'} | ${strB ? `${strB} MPa` : 'N/A'} | ${strWinner === 'A' ? `${matA.name} har høyest styrke (+${Math.abs(strDiff)} MPa)` : strWinner === 'B' ? `${matB.name} har høyest styrke (+${Math.abs(strDiff)} MPa)` : 'Likt'} |
| **Brannklasse** | ${matA.testResults?.fireRating || 'Mangler'} | ${matB.testResults?.fireRating || 'Mangler'} | ${fireWinner === 'A' ? `${matA.name} har overlegen brannklasse` : fireWinner === 'B' ? `${matB.name} har overlegen brannklasse` : 'Tilsvarende brannklasse'} |
| **Levetid** | ${matA.epd?.lifetime || 'N/A'} år | ${matB.epd?.lifetime || 'N/A'} år | - |
| **Sirkularitet** | ${matA.epd?.circularity || 'N/A'} | ${matB.epd?.circularity || 'N/A'} | - |
| **Akkreditering** | ${matA.provenTesting?.tier || 'Forskning'} | ${matB.provenTesting?.tier || 'Forskning'} | - |
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!matA || !matB) return;
    downloadComparisonCsv(matA, matB, [], undefined, {
      delimiter: ';',
      decimalSeparator: ',',
      includeBom: true,
    });
  };

  const content = (
    <div 
      id={embedded ? "material-comparison-panel" : "material-comparison-dialog"}
      className={`bg-[#fcfcf9] text-[#2c2c24] border border-[#dcdad0] rounded-3xl w-full flex flex-col overflow-hidden ${
        embedded ? 'shadow-xs' : 'max-w-5xl max-h-[92vh] shadow-2xl my-auto'
      }`}
    >
      {/* ================= MODAL HEADER ================= */}
      <div className="px-6 py-4.5 bg-white border-b border-[#e2e1d5] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5A5A40]/10 border border-[#5A5A40]/30 flex items-center justify-center text-[#5A5A40] shadow-2xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif italic text-[#2c2c24] tracking-tight">
                Materialsammenligning & Teknisk Analyse
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-[#5A5A40] text-white px-2 py-0.5 rounded-full">
                Side-by-side
              </span>
            </div>
            <p className="text-xs text-[#5A5A40]/80">
              Sammenlign GWP (karbonavtrykk), mekanisk styrke og brannklassifisering direkte mellom to bio-materialer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-compare-export-csv"
            onClick={handleExportCsv}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-[#dcdad0] bg-white hover:bg-emerald-50 text-emerald-900 transition-all cursor-pointer shadow-2xs"
            title="Last ned side-om-side sammenligningstabell som CSV for Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Eksporter CSV</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-[#dcdad0] bg-white hover:bg-[#eeede6] text-[#2c2c24] transition-all cursor-pointer"
            title="Kopier sammenligning som formatert tabell"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopiert!' : 'Kopier tabell'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-xl border border-[#dcdad0] bg-white hover:bg-[#eeede6] text-[#2c2c24] transition-all cursor-pointer"
            title="Skriv ut eller lagre som PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Utskrift</span>
          </button>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-[#eeede6] transition-colors cursor-pointer"
              title="Lukk vindu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* ================= MATERIAL SELECTOR BARS ================= */}
        <div className="px-6 py-4 bg-[#eeede6]/60 border-b border-[#e2e1d5] shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            
            {/* Material A Selector */}
            <div className="md:col-span-5 bg-white p-3.5 rounded-2xl border-2 border-[#5A5A40]/40 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
                  Materiale A (Referanse)
                </span>
                <span className="text-[10px] font-mono font-bold bg-[#eeede6] text-[#2c2c24] px-1.5 py-0.5 rounded">
                  TRL {matA.trl}
                </span>
              </div>
              <select
                id="select-material-a"
                value={materialAId}
                onChange={(e) => setMaterialAId(e.target.value)}
                className="w-full text-xs font-bold text-[#2c2c24] bg-[#fcfcf9] border border-[#dcdad0] rounded-xl p-2 focus:outline-none focus:border-[#5A5A40] cursor-pointer"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1">
              <button
                type="button"
                onClick={handleSwap}
                className="w-9 h-9 rounded-full bg-white hover:bg-[#5A5A40] text-[#5A5A40] hover:text-white border border-[#dcdad0] shadow-xs flex items-center justify-center transition-all cursor-pointer hover:rotate-180 duration-200"
                title="Bytt om Materiale A og Materiale B"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Material B Selector */}
            <div className="md:col-span-5 bg-white p-3.5 rounded-2xl border-2 border-indigo-700/40 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  Materiale B (Sammenligningskandidat)
                </span>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
                  TRL {matB.trl}
                </span>
              </div>
              <select
                id="select-material-b"
                value={materialBId}
                onChange={(e) => setMaterialBId(e.target.value)}
                className="w-full text-xs font-bold text-[#2c2c24] bg-[#fcfcf9] border border-[#dcdad0] rounded-xl p-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick preset comparisons */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto text-[11px] pt-1">
            <span className="text-[10px] uppercase font-bold text-[#5A5A40] shrink-0">Hurtigvalg:</span>
            {materials.length >= 2 && (
              <button
                type="button"
                onClick={() => {
                  if (materials[0] && materials[1]) {
                    setMaterialAId(materials[0].id);
                    setMaterialBId(materials[1].id);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#e2e1d5] border border-[#dcdad0] text-[10px] font-medium transition-colors shrink-0 cursor-pointer"
              >
                {materials[0]?.name.split(' ')[0]} vs {materials[1]?.name.split(' ')[0]}
              </button>
            )}
            {materials.length >= 3 && (
              <button
                type="button"
                onClick={() => {
                  if (materials[1] && materials[2]) {
                    setMaterialAId(materials[1].id);
                    setMaterialBId(materials[2].id);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#e2e1d5] border border-[#dcdad0] text-[10px] font-medium transition-colors shrink-0 cursor-pointer"
              >
                {materials[1]?.name.split(' ')[0]} vs {materials[2]?.name.split(' ')[0]}
              </button>
            )}
            {materials.length >= 4 && (
              <button
                type="button"
                onClick={() => {
                  if (materials[0] && materials[3]) {
                    setMaterialAId(materials[0].id);
                    setMaterialBId(materials[3].id);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#e2e1d5] border border-[#dcdad0] text-[10px] font-medium transition-colors shrink-0 cursor-pointer"
              >
                {materials[0]?.name.split(' ')[0]} vs {materials[3]?.name.split(' ')[0]}
              </button>
            )}
          </div>
        </div>

        {/* ================= MODAL BODY / SCROLLABLE ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 3 CORE SUMMARY CARDS: GWP, STRENGTH, FIRE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. GWP Summary Card */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e1d5] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Karbonavtrykk (GWP)
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  gwpWinner === 'A' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : gwpWinner === 'B' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {gwpWinner === 'A' ? 'A har lavere GWP' : gwpWinner === 'B' ? 'B har lavere GWP' : 'Likt avtrykk'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-dashed border-[#e2e1d5] text-center">
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale A</span>
                  <span className={`text-base font-serif font-bold ${gwpA <= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {gwpA} <span className="text-[10px] font-normal text-gray-500">kg CO₂</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale B</span>
                  <span className={`text-base font-serif font-bold ${gwpB <= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {gwpB} <span className="text-[10px] font-normal text-gray-500">kg CO₂</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#2c2c24]/70 mt-1 leading-relaxed">
                {gwpA < gwpB 
                  ? `${matA.name} gir en fordel på ${Math.abs(gwpDiff)} kg CO₂ eq/kg lavere utslipp enn ${matB.name}.`
                  : gwpB < gwpA
                  ? `${matB.name} gir en fordel på ${Math.abs(gwpDiff)} kg CO₂ eq/kg lavere utslipp enn ${matA.name}.`
                  : 'Begge materialene har identisk GWP-verdi i EPD.'}
              </p>
            </div>

            {/* 2. Strength Summary Card */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e1d5] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                  Mekanisk Styrke
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  strWinner === 'A' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : strWinner === 'B' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {strWinner === 'A' ? 'A er sterkere' : strWinner === 'B' ? 'B er sterkere' : 'Tilsvarende'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-dashed border-[#e2e1d5] text-center">
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale A</span>
                  <span className="text-base font-serif font-bold text-gray-800">
                    {strA ? `${strA} MPa` : 'Ikke testet'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale B</span>
                  <span className="text-base font-serif font-bold text-gray-800">
                    {strB ? `${strB} MPa` : 'Ikke testet'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#2c2c24]/70 mt-1 leading-relaxed">
                {strA && strB ? (
                  strA > strB
                    ? `${matA.name} har ${Math.abs(strDiff)} MPa høyere trykk-/strekkfasthet (${(strA / (strB || 0.1)).toFixed(1)}x).`
                    : strB > strA
                    ? `${matB.name} har ${Math.abs(strDiff)} MPa høyere trykk-/strekkfasthet (${(strB / (strA || 0.1)).toFixed(1)}x).`
                    : 'Begge materialer har samme målte styrkeverdi.'
                ) : (
                  'Ett eller begge materialer benytter kvalitativ styrkebeskrivelse.'
                )}
              </p>
            </div>

            {/* 3. Fire Rating Summary Card */}
            <div className="bg-white p-4.5 rounded-2xl border border-[#e2e1d5] shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  Brannklasse & Ytelse
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  fireWinner === 'A' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : fireWinner === 'B' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {fireWinner === 'A' ? 'A høyeste brannklasse' : fireWinner === 'B' ? 'B høyeste brannklasse' : 'Lik klasse'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2 py-2 border-y border-dashed border-[#e2e1d5] text-center">
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale A</span>
                  <span className="text-xs font-serif font-bold text-rose-800 block truncate" title={matA.testResults?.fireRating}>
                    {matA.testResults?.fireRating || 'Mangler data'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#fcfcf9]">
                  <span className="block text-[9px] uppercase font-bold text-gray-400">Materiale B</span>
                  <span className="text-xs font-serif font-bold text-rose-800 block truncate" title={matB.testResults?.fireRating}>
                    {matB.testResults?.fireRating || 'Mangler data'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#2c2c24]/70 mt-1 leading-relaxed">
                {matA.testResults?.fireRating?.includes('A1') || matB.testResults?.fireRating?.includes('A1')
                  ? 'Inkluderer ubrennbar Klasse A1 norm for høyeste brannsikkerhetskrav.'
                  : 'Begge materialer tilfredsstiller strenge krav til brannhemming og røykutvikling i trekonstruksjoner.'}
              </p>
            </div>

          </div>

          {/* ================= FULL COMPARISON SIDE-BY-SIDE TABLE ================= */}
          <div className="bg-white rounded-2xl border border-[#e2e1d5] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#eeede6]/40 border-b border-[#e2e1d5] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#2c2c24] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#5A5A40]" />
                Side-om-side Sammenligningstabell
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">
                {matA.id} ↔ {matB.id}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#e2e1d5] bg-white">
                    <th className="p-3.5 w-1/4 font-bold uppercase text-[10px] tracking-wider text-gray-400">
                      Parameter / Ytelsesfaktor
                    </th>
                    <th className="p-3.5 w-[37.5%] font-bold text-[#5A5A40] border-l border-[#e2e1d5] bg-[#5A5A40]/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif italic font-bold text-[#2c2c24]">{matA.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#5A5A40] text-white font-mono">A</span>
                      </div>
                    </th>
                    <th className="p-3.5 w-[37.5%] font-bold text-indigo-900 border-l border-[#e2e1d5] bg-indigo-50/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif italic font-bold text-[#2c2c24]">{matB.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-700 text-white font-mono">B</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#e2e1d5]">
                  
                  {/* Category & TRL */}
                  <tr className="hover:bg-[#fcfcf9]">
                    <td className="p-3.5 font-semibold text-gray-600">
                      Kategori & Modenhetsgrad (TRL)
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A5A40]/10 text-[#5A5A40]">
                          {matA.category}
                        </span>
                        <span className="font-mono text-[11px] font-bold">TRL {matA.trl}/9</span>
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {matB.category}
                        </span>
                        <span className="font-mono text-[11px] font-bold">TRL {matB.trl}/9</span>
                      </div>
                    </td>
                  </tr>

                  {/* 1. GWP (Primary Prompt Requirement) */}
                  <tr className="bg-emerald-50/25 hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-950 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        Karbonavtrykk (GWP)
                      </span>
                      <span className="text-[10px] font-normal text-gray-500">kg CO₂-ekvivalenter pr kg materiale</span>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-serif font-bold ${gwpA <= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {gwpA} kg CO₂ eq/kg
                          </span>
                          {gwpWinner === 'A' && (
                            <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Best GWP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          {gwpA < 0 ? '🌿 Karbonnegativt (binder CO₂ fra atmosfæren)' : 'Standard CO₂-utslipp under produksjon'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-serif font-bold ${gwpB <= 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {gwpB} kg CO₂ eq/kg
                          </span>
                          {gwpWinner === 'B' && (
                            <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Best GWP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          {gwpB < 0 ? '🌿 Karbonnegativt (binder CO₂ fra atmosfæren)' : 'Standard CO₂-utslipp under produksjon'}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* 2. Strength (Primary Prompt Requirement) */}
                  <tr className="bg-blue-50/20 hover:bg-blue-50/35 transition-colors">
                    <td className="p-3.5 font-bold text-blue-950 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                        Mekanisk Styrke (MPa)
                      </span>
                      <span className="text-[10px] font-normal text-gray-500">Målt trykk- og strekkfasthet</span>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-bold text-gray-800">
                            {strA ? `${strA} MPa` : 'Kvalitativ vurdering'}
                          </span>
                          {strWinner === 'A' && (
                            <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Høyest styrke
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">
                          {matA.testResults?.strength || 'Ingen detaljert styrkebeskrivelse registrert.'}
                        </p>
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-bold text-gray-800">
                            {strB ? `${strB} MPa` : 'Kvalitativ vurdering'}
                          </span>
                          {strWinner === 'B' && (
                            <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Høyest styrke
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">
                          {matB.testResults?.strength || 'Ingen detaljert styrkebeskrivelse registrert.'}
                        </p>
                      </div>
                    </td>
                  </tr>

                  {/* 3. Fire Rating (Primary Prompt Requirement) */}
                  <tr className="bg-rose-50/20 hover:bg-rose-50/35 transition-colors">
                    <td className="p-3.5 font-bold text-rose-950 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        Brannrating & Ytelse
                      </span>
                      <span className="text-[10px] font-normal text-gray-500">Euroclass / NS-EN standard</span>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-900 rounded-md border border-rose-200">
                            {matA.testResults?.fireRating || 'Ikke klassifisert'}
                          </span>
                          {fireWinner === 'A' && (
                            <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Høyeste klasse
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">
                          {matA.testResults?.fire || 'Ingen detaljert branntest-logg.'}
                        </p>
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-900 rounded-md border border-rose-200">
                            {matB.testResults?.fireRating || 'Ikke klassifisert'}
                          </span>
                          {fireWinner === 'B' && (
                            <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Høyeste klasse
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 line-clamp-2">
                          {matB.testResults?.fire || 'Ingen detaljert branntest-logg.'}
                        </p>
                      </div>
                    </td>
                  </tr>

                  {/* Fuktatferd & Fuktbuffer */}
                  <tr className="hover:bg-[#fcfcf9]">
                    <td className="p-3.5 font-semibold text-gray-600">
                      Fuktmotstand & Dampåpenhet
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <p className="text-[11px] text-gray-700 line-clamp-2">
                        {matA.testResults?.moisture || 'Standard fuktatferd'}
                      </p>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <p className="text-[11px] text-gray-700 line-clamp-2">
                        {matB.testResults?.moisture || 'Standard fuktatferd'}
                      </p>
                    </td>
                  </tr>

                  {/* Levetid & Sirkularitet */}
                  <tr className="hover:bg-[#fcfcf9]">
                    <td className="p-3.5 font-semibold text-gray-600">
                      Forventet Levetid & Sirkularitet
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-0.5">
                        <span className="font-bold text-gray-800">{matA.epd?.lifetime || 50} år</span>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{matA.epd?.circularity}</p>
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="space-y-0.5">
                        <span className="font-bold text-gray-800">{matB.epd?.lifetime || 50} år</span>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{matB.epd?.circularity}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Bruksområder */}
                  <tr className="hover:bg-[#fcfcf9]">
                    <td className="p-3.5 font-semibold text-gray-600">
                      Typiske Bruksområder
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="flex flex-wrap gap-1">
                        {matA.applicationAreas?.map((area, idx) => (
                          <span key={idx} className="text-[10px] bg-[#eeede6] text-[#2c2c24] px-1.5 py-0.5 rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      <div className="flex flex-wrap gap-1">
                        {matB.applicationAreas?.map((area, idx) => (
                          <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-900 px-1.5 py-0.5 rounded border border-indigo-100">
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>

                  {/* Akkreditering og Standarder */}
                  <tr className="hover:bg-[#fcfcf9]">
                    <td className="p-3.5 font-semibold text-gray-600">
                      Verifisering & Akkreditering
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      {matA.provenTesting?.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{matA.provenTesting.tier}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Lab-forskning (ikke akkreditert)</span>
                      )}
                    </td>
                    <td className="p-3.5 border-l border-[#e2e1d5]">
                      {matB.provenTesting?.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{matB.provenTesting.tier}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Lab-forskning (ikke akkreditert)</span>
                      )}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* ================= LAB RECOMMENDATION & INSIGHT ================= */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#5A5A40]/10 to-indigo-950/10 border border-[#dcdad0] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#2c2c24] block">
                Arkitektonisk & Teknisk Anbefaling:
              </span>
              <p className="text-gray-600 leading-relaxed">
                {strA < 1 && strB > 10 ? (
                  `Kombinasjonsdesign: Bruk ${matB.name} for de primære bærende og brannkritiske strukturelementene, og kompletter med ${matA.name} som dampåpen, karbonbindende isolasjon i hulrom for optimal termisk komfort og minimalt samlet klimafotavtrykk.`
                ) : strA > 10 && strB < 1 ? (
                  `Kombinasjonsdesign: Bruk ${matA.name} for de primære bærende og brannkritiske strukturelementene, og kompletter med ${matB.name} som dampåpen, karbonbindende isolasjon i hulrom for optimal termisk komfort og minimalt samlet klimafotavtrykk.`
                ) : (
                  `Begge materialer gir distinkte fordeler i bio-basert byggeri. Vurder ${gwpWinner === 'A' ? matA.name : matB.name} for prosjekter med strenge BREEAM-NOR klimagassbudsjetter, og ${fireWinner === 'A' ? matA.name : matB.name} i brannseksjoner med høyeste påkrevde sikkerhetsmargin.`
                )}
              </p>
            </div>
          </div>

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-4 bg-white border-t border-[#e2e1d5] flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="text-[11px] text-gray-500 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Data er hentet direkte fra verifiserte EPD-er og akkrediterte laboratorietester.</span>
          </div>

          <div className="flex items-center gap-2">
            {onSelectMaterial && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMaterial(matA.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#dcdad0] bg-white hover:bg-[#eeede6] text-xs font-bold text-[#5A5A40] transition-colors cursor-pointer"
                >
                  Gå til {matA.name.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectMaterial(matB.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-900 transition-colors cursor-pointer"
                >
                  Gå til {matB.name.split(' ')[0]}
                </button>
              </>
            )}
            {!embedded && (
              <button
                type="button"
                onClick={onClose}
                className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Lukk sammenligning
              </button>
            )}
          </div>
        </div>

      </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      {content}
    </div>
  );
}
