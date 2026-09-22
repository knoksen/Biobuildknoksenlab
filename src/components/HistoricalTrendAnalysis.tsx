import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RecTooltip,
  Legend,
  ReferenceLine,
  Brush,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  Download,
  Plus,
  Trash2,
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  FileSpreadsheet,
  Table as TableIcon,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  FlaskConical,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { BioMaterial, MeasurementPoint } from '../types';
import { CsvExportOptions } from '../utils/csvExporter';

export interface HistoricalTrendAnalysisProps {
  material: BioMaterial;
  allMaterials?: BioMaterial[];
  onAddMeasurement?: (measurement: MeasurementPoint) => void;
  onDeleteMeasurement?: (id: string) => void;
  onBatchAddMeasurements?: (measurements: MeasurementPoint[]) => void;
}

export type TrendParameter = 'strength' | 'moisture' | 'gwp';

interface ChartPoint {
  id?: string;
  rawDate: string;
  displayDate: string;
  timestampMs: number;
  value: number;
  label: string;
  experimentTitle?: string;
  previousValue?: number;
  delta?: number;
  deltaPercent?: number;
  targetRef?: number;
  compareValue?: number;
  trendProjection?: number;
}

export default function HistoricalTrendAnalysis({
  material,
  allMaterials = [],
  onAddMeasurement,
  onDeleteMeasurement,
  onBatchAddMeasurements,
}: HistoricalTrendAnalysisProps) {
  // Selected parameter
  const [selectedParam, setSelectedParam] = useState<TrendParameter>('strength');
  // View mode
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'split'>('chart');
  // Comparison material
  const [compareMaterialId, setCompareMaterialId] = useState<string>('');
  // Show projection trendline
  const [showProjection, setShowProjection] = useState<boolean>(true);
  // Show target spec reference line
  const [showTargetLine, setShowTargetLine] = useState<boolean>(true);
  // Time span filter
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '90d'>('all');
  // Quick-add measurement modal / card state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newValue, setNewValue] = useState<number | ''>('');
  const [newLabel, setNewLabel] = useState('');
  const [newExpTitle, setNewExpTitle] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Parameter configuration
  const paramConfig = useMemo(() => {
    switch (selectedParam) {
      case 'strength':
        return {
          title: 'Mekanisk Styrke & Trykkfasthet',
          shortTitle: 'Trykkfasthet',
          unit: 'MPa',
          color: '#2e7d32', // Emerald/Forest green
          areaColor: '#10b981',
          gradientId: 'gradientStrength',
          defaultTarget: material.testResults?.strengthMpa || 10,
          targetLabel: `Mål: Sluttfasthet 28d (${material.testResults?.strengthMpa || 10} MPa)`,
          description:
            'Kronologisk herde- og styrkeutvikling målt over tid. Sammenlignes med 28-dagers nominell referansefasthet etter NS-EN standard.',
        };
      case 'moisture':
        return {
          title: 'Fuktabsorpsjon & Hygroskopisk Balanse',
          shortTitle: 'Fuktinnhold',
          unit: '%',
          color: '#2563eb', // Royal Blue
          areaColor: '#3b82f6',
          gradientId: 'gradientMoisture',
          defaultTarget: 15.0,
          targetLabel: 'Maks anbefalt fuktnivå i bygg (15%)',
          description:
            'Måling av fuktopptak under klimakammereksponering eller in-situ prøving. Viser materialets evne til å bufre fuktighet over tid.',
        };
      case 'gwp':
        return {
          title: 'Drivhuspotensial & EPD Karbonavtrykk',
          shortTitle: 'GWP Karbonavtrykk',
          unit: 'kg CO₂ eq/kg',
          color: material.epd?.gwp !== undefined && material.epd.gwp < 0 ? '#059669' : '#d97706',
          areaColor: '#f59e0b',
          gradientId: 'gradientGwp',
          defaultTarget: 0.0,
          targetLabel: 'Netto Null (0.0 kg CO₂ eq)',
          description:
            'Historisk oppfølging av livsløpsvurderinger (LCA) og EPD-revisjoner. Negative verdier indikerer netto biogent karbonopptak.',
        };
    }
  }, [selectedParam, material]);

  // Extract measurements for the active parameter
  const rawMeasurements = useMemo(() => {
    const list = material.measurements || [];
    return list.filter(m => m.parameter === selectedParam);
  }, [material.measurements, selectedParam]);

  // Comparison material
  const compareMaterial = useMemo(() => {
    if (!compareMaterialId) return null;
    return allMaterials.find(m => m.id === compareMaterialId) || null;
  }, [allMaterials, compareMaterialId]);

  const compareMeasurements = useMemo(() => {
    if (!compareMaterial) return [];
    return (compareMaterial.measurements || []).filter(m => m.parameter === selectedParam);
  }, [compareMaterial, selectedParam]);

  // Helper to parse date string safely into timestamp
  const parseTimestamp = (dateStr: string, index: number): { ms: number; display: string } => {
    // Check if ISO format YYYY-MM-DD
    const isoMatch = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) {
      const d = new Date(isoMatch[0]);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
        return {
          ms: d.getTime(),
          display: `${day}. ${monthNames[d.getMonth()]}`,
        };
      }
    }

    // Check if day label e.g. "Dag 14"
    const dayMatch = dateStr.match(/(\d+)/);
    if (dayMatch) {
      const dayNum = parseInt(dayMatch[1], 10);
      const baseDate = new Date('2026-06-01');
      baseDate.setDate(baseDate.getDate() + dayNum);
      const day = baseDate.getDate();
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
      return {
        ms: baseDate.getTime(),
        display: `${day}. ${monthNames[baseDate.getMonth()]}`,
      };
    }

    // Fallback: incremental dates starting from base date
    const fallback = new Date('2026-06-01');
    fallback.setDate(fallback.getDate() + index * 5);
    return {
      ms: fallback.getTime(),
      display: dateStr,
    };
  };

  // Process data for Recharts
  const chartData = useMemo(() => {
    if (rawMeasurements.length === 0) return [];

    // Parse all points
    const pointsWithTime = rawMeasurements.map((m, idx) => {
      const parsed = parseTimestamp(m.timestamp || m.label, idx);
      return {
        ...m,
        timestampMs: parsed.ms,
        displayDate: parsed.display,
      };
    });

    // Sort chronologically
    pointsWithTime.sort((a, b) => a.timestampMs - b.timestampMs);

    // Apply time filter
    let filtered = pointsWithTime;
    if (timeFilter !== 'all' && pointsWithTime.length > 1) {
      const latestMs = pointsWithTime[pointsWithTime.length - 1].timestampMs;
      const days = timeFilter === '30d' ? 30 : 90;
      const cutoff = latestMs - days * 24 * 60 * 60 * 1000;
      filtered = pointsWithTime.filter(p => p.timestampMs >= cutoff);
      if (filtered.length === 0) filtered = pointsWithTime; // fallback
    }

    // Linear regression for trendline projection if at least 2 points
    let slope = 0;
    let intercept = 0;
    if (filtered.length >= 2) {
      const n = filtered.length;
      let sumX = 0;
      let sumY = 0;
      let sumXY = 0;
      let sumXX = 0;
      filtered.forEach((p, i) => {
        sumX += i;
        sumY += p.value;
        sumXY += i * p.value;
        sumXX += i * i;
      });
      const denom = n * sumXX - sumX * sumX;
      if (denom !== 0) {
        slope = (n * sumXY - sumX * sumY) / denom;
        intercept = (sumY - slope * sumX) / n;
      }
    }

    // Build finalized chart objects
    return filtered.map((p, idx) => {
      const prev = idx > 0 ? filtered[idx - 1] : undefined;
      const delta = prev !== undefined ? Number((p.value - prev.value).toFixed(3)) : 0;
      const deltaPercent = prev !== undefined && prev.value !== 0 ? Number(((delta / Math.abs(prev.value)) * 100).toFixed(1)) : 0;

      // Check comparison material value for closest date
      let compareVal: number | undefined;
      if (compareMeasurements.length > 0) {
        const closest = compareMeasurements.reduce((prevComp, currComp) => {
          const compMs = parseTimestamp(currComp.timestamp || currComp.label, 0).ms;
          const prevMs = parseTimestamp(prevComp.timestamp || prevComp.label, 0).ms;
          return Math.abs(compMs - p.timestampMs) < Math.abs(prevMs - p.timestampMs) ? currComp : prevComp;
        });
        compareVal = closest.value;
      }

      const trendProjection = filtered.length >= 2 ? Number((intercept + slope * idx).toFixed(3)) : undefined;

      const chartPoint: ChartPoint = {
        id: p.id,
        rawDate: p.timestamp,
        displayDate: p.displayDate,
        timestampMs: p.timestampMs,
        value: p.value,
        label: p.label,
        experimentTitle: p.experimentTitle,
        previousValue: prev?.value,
        delta,
        deltaPercent,
        targetRef: paramConfig.defaultTarget,
        compareValue: compareVal,
        trendProjection,
      };

      return chartPoint;
    });
  }, [rawMeasurements, timeFilter, compareMeasurements, paramConfig.defaultTarget]);

  // Statistical summary indicators
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        count: 0,
        latest: null as number | null,
        latestDate: '',
        avg: null as number | null,
        min: null as number | null,
        max: null as number | null,
        trendDirection: 'neutral' as 'up' | 'down' | 'neutral',
        trendRate: null as number | null,
        changeTotal: null as number | null,
        changeTotalPercent: null as number | null,
      };
    }

    const values = chartData.map(d => d.value);
    const sum = values.reduce((acc, v) => acc + v, 0);
    const avg = Number((sum / values.length).toFixed(3));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const first = values[0];
    const latest = values[values.length - 1];
    const latestDate = chartData[chartData.length - 1].rawDate || chartData[chartData.length - 1].displayDate;

    const changeTotal = Number((latest - first).toFixed(3));
    const changeTotalPercent = first !== 0 ? Number(((changeTotal / Math.abs(first)) * 100).toFixed(1)) : 0;

    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';
    if (changeTotal > 0.005) trendDirection = 'up';
    else if (changeTotal < -0.005) trendDirection = 'down';

    const trendRate = chartData.length > 1 ? Number((changeTotal / (chartData.length - 1)).toFixed(3)) : 0;

    return {
      count: chartData.length,
      latest,
      latestDate,
      avg,
      min,
      max,
      trendDirection,
      trendRate,
      changeTotal,
      changeTotalPercent,
    };
  }, [chartData]);

  // Quick-add new measurement handler
  const handleAddNewMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newValue === '' || isNaN(Number(newValue))) return;

    const newPoint: MeasurementPoint = {
      id: `meas-${Date.now()}`,
      parameter: selectedParam,
      value: Number(newValue),
      label: newLabel.trim() || `Måling ${newDate}`,
      timestamp: newDate,
      experimentTitle: newExpTitle.trim() || undefined,
    };

    if (onAddMeasurement) {
      onAddMeasurement(newPoint);
    }

    setNewValue('');
    setNewLabel('');
    setNewExpTitle('');
    setShowAddForm(false);
    showNotification(`Registrerte ny måling for ${paramConfig.shortTitle}: ${newPoint.value} ${paramConfig.unit}`);
  };

  // Generate realistic test series for demonstration
  const handleGenerateSampleSeries = () => {
    const today = new Date();
    const generated: MeasurementPoint[] = [];

    if (selectedParam === 'strength') {
      const target = material.testResults?.strengthMpa || 10;
      const days = [1, 3, 7, 14, 21, 28, 35];
      days.forEach(d => {
        const date = new Date(today);
        date.setDate(date.getDate() - (35 - d));
        // Maturation curing curve: target * (d / (4.5 + 0.84 * d)) + random slight jitter
        const curveRatio = Math.min(1.05, d / (4.2 + 0.85 * d));
        const jitter = (Math.random() - 0.5) * 0.04 * target;
        const val = Number((target * curveRatio + jitter).toFixed(3));
        generated.push({
          id: `sample-${selectedParam}-${d}-${Date.now()}`,
          parameter: 'strength',
          value: Math.max(0.01, val),
          label: `Dag ${d} (Herdetilsyn)`,
          timestamp: date.toISOString().split('T')[0],
          experimentTitle: material.experiments?.[0]?.title || 'Akkreditert standardherding',
        });
      });
    } else if (selectedParam === 'moisture') {
      const weeks = [1, 2, 4, 6, 8, 12];
      const baseMoisture = 6.5;
      weeks.forEach((w, idx) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (12 - w) * 7);
        // Typical hygroscopic curve stabilizing around 11-13%
        const val = Number((baseMoisture + 5.5 * (1 - Math.exp(-w / 3.5)) + (Math.random() - 0.5) * 0.4).toFixed(2));
        generated.push({
          id: `sample-${selectedParam}-${w}-${Date.now()}`,
          parameter: 'moisture',
          value: val,
          label: `Uke ${w} (Fuktkammer 75% RH)`,
          timestamp: date.toISOString().split('T')[0],
          experimentTitle: material.experiments?.[0]?.title || 'Klimatisk fuktbufring',
        });
      });
    } else {
      // GWP
      const revisions = ['Revisjon A (Råstoffutvinning)', 'Revisjon B (Produksjonsfase A1-A3)', 'Revisjon C (Optimalisert bio-herder)', 'Revisjon D (Verifisert EPD)'];
      const baseGwp = material.epd?.gwp !== undefined ? material.epd.gwp : -0.8;
      revisions.forEach((rev, idx) => {
        const date = new Date(today);
        date.setMonth(date.getMonth() - (3 - idx));
        // GWP optimization over time
        const val = Number((baseGwp + (3 - idx) * 0.25 + (Math.random() - 0.5) * 0.05).toFixed(3));
        generated.push({
          id: `sample-${selectedParam}-${idx}-${Date.now()}`,
          parameter: 'gwp',
          value: val,
          label: rev,
          timestamp: date.toISOString().split('T')[0],
          experimentTitle: 'LCA Vugge-til-port validering',
        });
      });
    }

    if (onBatchAddMeasurements) {
      onBatchAddMeasurements(generated);
    } else if (onAddMeasurement) {
      generated.forEach(p => onAddMeasurement(p));
    }

    showNotification(`Genererte ${generated.length} testpunkter for ${paramConfig.shortTitle}`);
  };

  // Export current trend series to CSV
  const handleExportTrendCsv = () => {
    if (chartData.length === 0) return;

    const headers = ['Dato', 'Måleverdi', 'Enhet', 'Parameter', 'Etikett / Prøve', 'Eksperiment', 'Endring fra forrige'];
    const rows = chartData.map(d => [
      d.rawDate || d.displayDate,
      d.value.toString().replace('.', ','),
      paramConfig.unit,
      paramConfig.shortTitle,
      `"${(d.label || '').replace(/"/g, '""')}"`,
      `"${(d.experimentTitle || 'Generell test').replace(/"/g, '""')}"`,
      d.delta !== undefined ? d.delta.toString().replace('.', ',') : '',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioBuild_Trend_${material.name.replace(/\s+/g, '_')}_${selectedParam}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Lastet ned tidsserie som CSV');
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data: ChartPoint = payload[0].payload;

    return (
      <div className="bg-[#2c2c24] text-white p-3.5 rounded-xl shadow-xl border border-white/10 text-xs min-w-[220px]">
        <div className="flex items-center justify-between border-b border-white/15 pb-2 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{data.rawDate || data.displayDate}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">#{data.id?.slice(-4) || 'mål'}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-gray-300 text-[11px]">{paramConfig.shortTitle}:</span>
            <span className="text-base font-bold font-mono text-emerald-300">
              {data.value} {paramConfig.unit}
            </span>
          </div>

          {data.delta !== undefined && data.delta !== 0 && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400">Endring fra forrige:</span>
              <span
                className={`font-semibold flex items-center gap-0.5 ${
                  data.delta > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {data.delta > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {data.delta > 0 ? `+${data.delta}` : data.delta} {paramConfig.unit} ({data.deltaPercent}%)
              </span>
            </div>
          )}

          {data.targetRef !== undefined && (
            <div className="flex items-center justify-between text-[11px] border-t border-white/10 pt-1.5 text-gray-300">
              <span>Målkrav:</span>
              <span className="font-mono text-gray-300">
                {data.targetRef} {paramConfig.unit}
              </span>
            </div>
          )}

          {data.compareValue !== undefined && (
            <div className="flex items-center justify-between text-[11px] text-purple-300">
              <span>{compareMaterial?.name.slice(0, 15)}...:</span>
              <span className="font-mono font-bold">
                {data.compareValue} {paramConfig.unit}
              </span>
            </div>
          )}

          {data.label && (
            <div className="text-[10.5px] text-gray-300 pt-1 border-t border-white/10">
              <span className="text-gray-400 block text-[9.5px] uppercase font-bold">Prøve / Testnotat:</span>
              {data.label}
            </div>
          )}

          {data.experimentTitle && (
            <div className="text-[10px] text-gray-400 italic">
              Labforsøk: {data.experimentTitle}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="section-historical-trend-analysis" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-950 text-white px-4 py-2.5 rounded-xl border border-emerald-500/50 shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e1d5] shadow-xs space-y-6">
        {/* Header & Sub-title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#eeede6] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-800/10 border border-emerald-800/20 text-emerald-900 flex items-center justify-center shadow-2xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#2c2c24] font-serif italic tracking-tight flex items-center gap-2">
                Trendanalyse & Historisk Måleserie
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full not-italic">
                  Recharts Tidsserie
                </span>
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
              Følg bio-materialets fysiske, hygroskopiske og miljømessige utvikling over tid. Analyser modningskurver, fuktdiffusjon og verifiserte laboratoriemålinger med referansekrav og statistisk regresjon.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              id="btn-trend-export-csv"
              onClick={handleExportTrendCsv}
              disabled={chartData.length === 0}
              className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border border-[#dcdad0] bg-[#f9f9f7] hover:bg-[#eeede6] text-[#2c2c24] transition-all cursor-pointer disabled:opacity-40"
              title="Eksporter denne tidsserien til CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
              <span>Eksporter CSV</span>
            </button>

            <button
              type="button"
              id="btn-trend-add-measurement"
              onClick={() => setShowAddForm(prev => !prev)}
              className="flex items-center gap-1.5 text-xs font-bold py-1.5 px-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrer måling</span>
            </button>
          </div>
        </div>

        {/* Parameter Selector & Global Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f9f9f7] p-3.5 rounded-2xl border border-[#eeede6]">
          {/* Parameter Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1">
              Parameter:
            </span>

            <button
              type="button"
              id="btn-param-strength"
              onClick={() => setSelectedParam('strength')}
              className={`flex items-center gap-2 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedParam === 'strength'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Styrke / Trykkfasthet (MPa)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedParam === 'strength' ? 'bg-emerald-800 text-emerald-100' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {material.measurements?.filter(m => m.parameter === 'strength').length || 0}
              </span>
            </button>

            <button
              type="button"
              id="btn-param-moisture"
              onClick={() => setSelectedParam('moisture')}
              className={`flex items-center gap-2 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedParam === 'moisture'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Fuktinnhold / Absorpsjon (%)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedParam === 'moisture' ? 'bg-blue-800 text-blue-100' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {material.measurements?.filter(m => m.parameter === 'moisture').length || 0}
              </span>
            </button>

            <button
              type="button"
              id="btn-param-gwp"
              onClick={() => setSelectedParam('gwp')}
              className={`flex items-center gap-2 text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedParam === 'gwp'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-amber-50 border border-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>EPD GWP (kg CO₂ eq)</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedParam === 'gwp' ? 'bg-amber-800 text-amber-100' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {material.measurements?.filter(m => m.parameter === 'gwp').length || 0}
              </span>
            </button>
          </div>

          {/* View Toggles & Filters */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Time Filter */}
            <div className="flex items-center bg-white border border-[#dcdad0] p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === 'all' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                Alt
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('90d')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === '90d' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                90d
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('30d')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  timeFilter === '30d' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                30d
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-[#dcdad0] p-0.5 rounded-xl text-xs">
              <button
                type="button"
                id="btn-viewmode-chart"
                onClick={() => setViewMode('chart')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'chart' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:bg-stone-100'
                }`}
                title="Vis som interaktiv graf"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="btn-viewmode-split"
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:bg-stone-100'
                }`}
                title="Vis både graf og tabell side-om-side"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="btn-viewmode-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#5A5A40] text-white' : 'text-gray-600 hover:bg-stone-100'
                }`}
                title="Vis som strukturert datatabell"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Form Drawer (expandable) */}
        {showAddForm && (
          <form
            onSubmit={handleAddNewMeasurement}
            className="p-5 bg-[#fcfcf9] rounded-2xl border border-emerald-600/30 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#e2e1d5] pb-2.5">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-bold text-[#2c2c24] uppercase tracking-wider">
                  Legg til ny måling for {paramConfig.shortTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-gray-500 hover:text-black font-semibold cursor-pointer"
              >
                Avbryt
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Måledato
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-white border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Måleverdi ({paramConfig.unit})
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder={`F.eks. ${paramConfig.defaultTarget}`}
                  value={newValue}
                  onChange={e => setNewValue(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs font-bold focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Etikett / Prøvenummer
                </label>
                <input
                  type="text"
                  placeholder="F.eks. Dag 28 (Kontrollprøve B)"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full bg-white border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Tilknyttet laboratorieforsøk
                </label>
                <select
                  value={newExpTitle}
                  onChange={e => setNewExpTitle(e.target.value)}
                  className="w-full bg-white border border-[#dcdad0] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                >
                  <option value="">Generell laboratoriemåling</option>
                  {(material.experiments || []).map(exp => (
                    <option key={exp.id} value={exp.title}>
                      {exp.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Lagre måling i historikken
              </button>
            </div>
          </form>
        )}

        {/* Statistical Summary Grid with Spring Transitions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Latest */}
          <motion.div
            key={`hist-kpi-latest-${stats.latest}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="bg-[#fcfcf9] p-3.5 rounded-xl border border-[#eeede6]"
          >
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Siste måling
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#2c2c24]">
                {stats.latest !== null ? `${stats.latest}` : 'N/A'}
              </span>
              <span className="text-xs font-mono text-gray-500">{paramConfig.unit}</span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
              {stats.latestDate ? `Dato: ${stats.latestDate}` : 'Ingen data'}
            </span>
          </motion.div>

          {/* Average */}
          <motion.div
            key={`hist-kpi-avg-${stats.avg}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="bg-[#fcfcf9] p-3.5 rounded-xl border border-[#eeede6]"
          >
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Gjennomsnitt
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#5A5A40]">
                {stats.avg !== null ? `${stats.avg}` : 'N/A'}
              </span>
              <span className="text-xs font-mono text-gray-500">{paramConfig.unit}</span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Over {stats.count} målepunkter
            </span>
          </motion.div>

          {/* Min / Max Range */}
          <div className="bg-[#fcfcf9] p-3.5 rounded-xl border border-[#eeede6]">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Variasjonsbredde (Min - Maks)
            </span>
            <div className="text-sm font-bold font-mono text-[#2c2c24]">
              {stats.min !== null ? `${stats.min} – ${stats.max}` : 'N/A'}{' '}
              <span className="text-[10px] font-normal text-gray-400">{paramConfig.unit}</span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Spenn: {stats.max !== null && stats.min !== null ? Number((stats.max - stats.min).toFixed(3)) : 0}{' '}
              {paramConfig.unit}
            </span>
          </div>

          {/* Trend Direction & Growth */}
          <motion.div
            key={`hist-kpi-trend-${stats.trendDirection}-${stats.changeTotalPercent}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className="bg-[#fcfcf9] p-3.5 rounded-xl border border-[#eeede6]"
          >
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Historisk Trend
            </span>
            <div className="flex items-center gap-1.5">
              {stats.trendDirection === 'up' && (
                <>
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-emerald-800">
                    +{stats.changeTotalPercent}%
                  </span>
                </>
              )}
              {stats.trendDirection === 'down' && (
                <>
                  <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-amber-800">
                    {stats.changeTotalPercent}%
                  </span>
                </>
              )}
              {stats.trendDirection === 'neutral' && (
                <>
                  <div className="w-5 h-5 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Minus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-gray-600">Stabil</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Total endring: {stats.changeTotal !== null && stats.changeTotal > 0 ? `+${stats.changeTotal}` : stats.changeTotal}{' '}
              {paramConfig.unit}
            </span>
          </motion.div>

          {/* Target Reference Status */}
          <div className="bg-[#fcfcf9] p-3.5 rounded-xl border border-[#eeede6]">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Referansekrav
            </span>
            <div className="text-sm font-bold text-[#2c2c24] font-mono">
              {paramConfig.defaultTarget} {paramConfig.unit}
            </div>
            <span className="text-[10px] text-gray-500 block mt-0.5 truncate">
              {stats.latest !== null && stats.latest >= paramConfig.defaultTarget
                ? '✓ Målkrav oppnådd'
                : 'Under observasjon'}
            </span>
          </div>
        </div>

        {/* Visualizer & Comparison Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-2 border-b border-[#eeede6]">
          {/* Comparison material dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-600 text-[11px]">Sammenlign kurve med:</span>
            <select
              value={compareMaterialId}
              onChange={e => setCompareMaterialId(e.target.value)}
              className="bg-[#f9f9f7] border border-[#dcdad0] rounded-lg py-1 px-2.5 text-xs text-[#2c2c24] focus:outline-none cursor-pointer max-w-[220px]"
            >
              <option value="">Ingen (Kun {material.name.slice(0, 18)}...)</option>
              {allMaterials
                .filter(m => m.id !== material.id)
                .map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
            </select>
          </div>

          {/* Graph auxiliary toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                checked={showTargetLine}
                onChange={e => setShowTargetLine(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px]">Mållinje ({paramConfig.defaultTarget} {paramConfig.unit})</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                checked={showProjection}
                onChange={e => setShowProjection(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px]">Trendlinje (Regresjon)</span>
            </label>
          </div>
        </div>

        {/* Chart View */}
        {(viewMode === 'chart' || viewMode === 'split') && (
          <div className="relative">
            {chartData.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-[#fcfcf9] rounded-2xl border border-dashed border-[#dcdad0]">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-gray-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-700">
                  Ingen målinger registrert for {paramConfig.shortTitle} ennå
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Du kan enten legge inn faktiske testresultater manuelt, eller generere en realistisk laboratorie-tidsserie for å evaluere materialet.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Legg til første måling
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateSampleSeries}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Generer testserie (30 dager)</span>
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                key={`hist-chart-wrap-${chartData.length}-${stats.latest}-${selectedParam}`}
                initial={{ opacity: 0.9, scale: 0.994 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 25 }}
                className="h-[380px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 25, left: -5, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id={paramConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={paramConfig.areaColor} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={paramConfig.areaColor} stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gradientCompare" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" vertical={false} />

                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 10, fill: '#666' }}
                      tickLine={false}
                      axisLine={{ stroke: '#dcdad0' }}
                    />

                    <YAxis
                      tick={{ fontSize: 10, fill: '#666' }}
                      tickLine={false}
                      axisLine={{ stroke: '#dcdad0' }}
                      domain={['auto', 'auto']}
                      label={{
                        value: `${paramConfig.shortTitle} (${paramConfig.unit})`,
                        angle: -90,
                        position: 'insideLeft',
                        offset: 12,
                        fontSize: 10,
                        fill: '#666',
                      }}
                    />

                    <RecTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                    {/* Target reference horizontal line */}
                    {showTargetLine && (
                      <ReferenceLine
                        y={paramConfig.defaultTarget}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{
                          value: paramConfig.targetLabel,
                          fill: '#64748b',
                          fontSize: 10,
                          position: 'top',
                        }}
                      />
                    )}

                    {/* Gradient area under main line */}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="none"
                      fill={`url(#${paramConfig.gradientId})`}
                      isAnimationActive={true}
                      animationDuration={750}
                      animationEasing="ease-out"
                    />

                    {/* Primary trend line */}
                    <Line
                      key={`hist-line-${chartData.length}-${stats.latest}`}
                      type="monotone"
                      dataKey="value"
                      name={`${material.name} (${paramConfig.unit})`}
                      stroke={paramConfig.color}
                      strokeWidth={3}
                      dot={{ r: 4.5, fill: '#ffffff', stroke: paramConfig.color, strokeWidth: 2 }}
                      activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2, fill: paramConfig.color }}
                      isAnimationActive={true}
                      animationDuration={750}
                      animationEasing="ease-out"
                    />

                    {/* Optional linear regression line */}
                    {showProjection && chartData.length >= 2 && (
                      <Line
                        type="linear"
                        dataKey="trendProjection"
                        name="Trendlinje (Lineær regresjon)"
                        stroke="#64748b"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                      />
                    )}

                    {/* Optional comparison line */}
                    {compareMaterial && compareMeasurements.length > 0 && (
                      <Line
                        type="monotone"
                        dataKey="compareValue"
                        name={`Sammenligning: ${compareMaterial.name}`}
                        stroke="#9333ea"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={{ r: 3.5, fill: '#9333ea' }}
                        isAnimationActive={true}
                        animationDuration={750}
                        animationEasing="ease-out"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        )}

        {/* Data Table View */}
        {(viewMode === 'table' || viewMode === 'split') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-1.5">
                <TableIcon className="w-3.5 h-3.5" />
                Registrerte Målepunkter ({chartData.length})
              </h4>
              {chartData.length > 0 && (
                <button
                  type="button"
                  onClick={handleGenerateSampleSeries}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
                  title="Utvid serien med flere testpunkter"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generer flere labdata</span>
                </button>
              )}
            </div>

            {chartData.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-6">
                Ingen data å vise i tabellen.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#eeede6]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#f0eee4] text-[#2c2c24] text-[10.5px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Dato</th>
                      <th className="py-2.5 px-3">Prøvenavn / Etikett</th>
                      <th className="py-2.5 px-3 text-right">Måleverdi</th>
                      <th className="py-2.5 px-3 text-right">Endring (Δ)</th>
                      <th className="py-2.5 px-3">Laboratorieforsøk</th>
                      <th className="py-2.5 px-3 text-center">Handling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eeede6]">
                    <AnimatePresence initial={false}>
                      {chartData.map((row, idx) => (
                        <motion.tr
                          key={row.id || `row-${idx}`}
                          layout="position"
                          initial={{ opacity: 0, x: -8, scale: 0.99 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 26,
                            delay: Math.min(idx * 0.02, 0.2),
                          }}
                          className="hover:bg-[#fcfcf9] transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-bold text-gray-700">
                            {row.rawDate || row.displayDate}
                          </td>
                          <td className="py-2 px-3 font-medium text-[#2c2c24]">
                            {row.label || `Måling ${idx + 1}`}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-900">
                            {row.value} {paramConfig.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-[11px]">
                            {row.delta !== undefined && row.delta !== 0 ? (
                              <span className={row.delta > 0 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                {row.delta > 0 ? `+${row.delta}` : row.delta} {paramConfig.unit} ({row.deltaPercent}%)
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-gray-600 text-[11px]">
                            {row.experimentTitle || 'Generell laboratorietest'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {row.id && onDeleteMeasurement && (
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteMeasurement(row.id!);
                                  showNotification('Måling slettet');
                                }}
                                className="text-gray-400 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                                title="Slett denne målingen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Scientific Context & Bio-Material Note */}
        <div className="p-4 bg-[#fcfcf9] rounded-xl border border-[#eeede6] text-xs text-gray-600 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#2c2c24] block">
              Vitenskapelig veiledning for {paramConfig.shortTitle}:
            </span>
            <p className="leading-relaxed">
              {paramConfig.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
