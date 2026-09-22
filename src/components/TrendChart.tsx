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
  Tooltip,
  Legend,
  ReferenceLine,
  Dot
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Table as TableIcon,
  LineChart as ChartIcon,
  Info,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { BioMaterial, MeasurementPoint } from '../types';

interface TrendChartProps {
  material: BioMaterial;
  measurements?: MeasurementPoint[];
  onAddMeasurementClick?: () => void;
  className?: string;
}

interface ChartDataPoint {
  day: number;
  label: string;
  standardRef: number;
  refLower: number;
  refUpper: number;
  measured?: number;
  delta?: number;
  deltaPercent?: number;
  experimentTitle?: string;
  timestamp?: string;
  measurementId?: string;
  isMeasuredPoint?: boolean;
}

/**
 * Calculates standard reference strength (MPa) at day `t`
 * based on standard NS-EN / Eurocode maturation curves or material-specific target.
 */
function getStandardReferenceStrength(material: BioMaterial, day: number): number {
  const target28 = material.testResults?.strengthMpa || 10;

  // Custom standard baselines for calibrated core materials
  if (material.id === 'mat-1') {
    // Mycelium kompressjonsfasthet (0.20 MPa mål)
    const points: [number, number][] = [
      [0, 0.0],
      [1, 0.01],
      [3, 0.04],
      [7, 0.10],
      [14, 0.16],
      [21, 0.19],
      [28, 0.20],
      [60, 0.21]
    ];
    return interpolateCurve(points, day);
  }

  if (material.id === 'mat-2') {
    // Hampbetong trykkfasthet (0.80 MPa mål)
    const points: [number, number][] = [
      [0, 0.0],
      [1, 0.05],
      [3, 0.18],
      [7, 0.40],
      [14, 0.65],
      [21, 0.74],
      [28, 0.80],
      [60, 0.84]
    ];
    return interpolateCurve(points, day);
  }

  if (material.id === 'mat-3') {
    // Massivtre / CLT bøyefasthet (42.0 MPa mål)
    const points: [number, number][] = [
      [0, 0.0],
      [1, 12.5],
      [3, 24.0],
      [7, 32.5],
      [14, 38.0],
      [21, 40.5],
      [28, 42.0],
      [60, 43.2]
    ];
    return interpolateCurve(points, day);
  }

  // Standard generic bio-aggregate / cementitious curing curve:
  // fcm(t) = target28 * (t / (a + b * t)) where normalized at t=28
  // Typical Eurocode curing curve approximation
  if (day <= 0) return 0;
  const t = Math.max(0.5, day);
  const ratio = Math.min(1.08, (t / (4.5 + 0.84 * t)));
  return Number((target28 * ratio).toFixed(3));
}

function interpolateCurve(points: [number, number][], day: number): number {
  if (day <= points[0][0]) return points[0][1];
  if (day >= points[points.length - 1][0]) return points[points.length - 1][1];

  for (let i = 0; i < points.length - 1; i++) {
    const [d0, v0] = points[i];
    const [d1, v1] = points[i + 1];
    if (day >= d0 && day <= d1) {
      const frac = (day - d0) / (d1 - d0);
      return Number((v0 + frac * (v1 - v0)).toFixed(3));
    }
  }
  return points[points.length - 1][1];
}

export const TrendChart: React.FC<TrendChartProps> = ({
  material,
  measurements,
  onAddMeasurementClick,
  className = ''
}) => {
  const [showToleranceBand, setShowToleranceBand] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [activeDataKey, setActiveDataKey] = useState<'all' | 'comparison'>('all');

  // Strength measurements from props or material
  const strengthMeasurements = useMemo(() => {
    const list = measurements || material.measurements || [];
    return list.filter(m => m.parameter === 'strength');
  }, [measurements, material.measurements]);

  // Standard reference target at 28 days
  const target28DayStrength = useMemo(() => {
    return material.testResults?.strengthMpa || 10;
  }, [material]);

  // Generate unified chart data comparing standard reference curve with actual measurements
  const chartData = useMemo(() => {
    // 1. Base standard curve days to plot smooth reference line
    const standardDays = [1, 3, 5, 7, 10, 14, 18, 21, 25, 28, 35, 42];

    // 2. Extract parsed days from historical measurements
    const parsedMeasurements = strengthMeasurements.map(m => {
      const dayMatch = m.label.match(/\d+/);
      const parsedDay = dayMatch ? parseInt(dayMatch[0], 10) : 15;
      return {
        ...m,
        day: parsedDay
      };
    });

    // 3. Union of all day positions
    const allDays = Array.from(new Set([
      ...standardDays,
      ...parsedMeasurements.map(pm => pm.day)
    ])).sort((a, b) => a - b);

    // 4. Map each day to standard reference and measured values
    return allDays.map(day => {
      const standardRef = getStandardReferenceStrength(material, day);
      const tolerance = Number((standardRef * 0.10).toFixed(3)); // 10% standard tolerance band
      const refLower = Math.max(0, Number((standardRef - tolerance).toFixed(3)));
      const refUpper = Number((standardRef + tolerance).toFixed(3));

      // Check if there is an actual measurement at this day
      const matched = parsedMeasurements.find(pm => pm.day === day);

      const point: ChartDataPoint = {
        day,
        label: `Dag ${day}`,
        standardRef,
        refLower,
        refUpper
      };

      if (matched) {
        const delta = Number((matched.value - standardRef).toFixed(3));
        const deltaPercent = standardRef > 0 
          ? Number(((delta / standardRef) * 100).toFixed(1))
          : 0;

        point.measured = matched.value;
        point.delta = delta;
        point.deltaPercent = deltaPercent;
        point.experimentTitle = matched.experimentTitle;
        point.timestamp = matched.timestamp;
        point.measurementId = matched.id;
        point.isMeasuredPoint = true;
      }

      return point;
    });
  }, [material, strengthMeasurements]);

  // Statistical KPIs for comparison
  const stats = useMemo(() => {
    if (strengthMeasurements.length === 0) {
      return {
        count: 0,
        lastMeasured: null as number | null,
        lastDay: null as number | null,
        avgDeltaPercent: null as number | null,
        highestMeasured: null as number | null,
        complianceStatus: 'Venter på måledata'
      };
    }

    const measuredPoints = chartData.filter(d => d.measured !== undefined);
    const lastPoint = measuredPoints[measuredPoints.length - 1];

    let totalDeltaPercent = 0;
    let highest = -Infinity;

    measuredPoints.forEach(p => {
      if (p.deltaPercent !== undefined) {
        totalDeltaPercent += p.deltaPercent;
      }
      if (p.measured !== undefined && p.measured > highest) {
        highest = p.measured;
      }
    });

    const avgDelta = measuredPoints.length > 0 
      ? Number((totalDeltaPercent / measuredPoints.length).toFixed(1)) 
      : 0;

    let status = 'I henhold til referanse';
    if (avgDelta >= 5) status = 'Over standardkurve (+ytelse)';
    else if (avgDelta < -10) status = 'Under forventet toleranse';

    return {
      count: strengthMeasurements.length,
      lastMeasured: lastPoint?.measured ?? null,
      lastDay: lastPoint?.day ?? null,
      avgDeltaPercent: avgDelta,
      highestMeasured: highest === -Infinity ? null : highest,
      complianceStatus: status
    };
  }, [strengthMeasurements, chartData]);

  // Custom Dot for measured points with spring ping for the latest data point
  const renderMeasuredDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.measured === undefined || payload.measured === null) {
      return null;
    }

    const isAbove = (payload.delta || 0) >= 0;
    const isLatest = stats.lastDay === payload.day;

    return (
      <g key={`dot-${payload.day}-${payload.measured}`}>
        {/* Pulsing spring halo for latest added or measured data point */}
        {isLatest && (
          <circle
            cx={cx}
            cy={cy}
            r={13}
            fill={isAbove ? '#10b981' : '#f59e0b'}
            fillOpacity={0.25}
            className="animate-ping"
            style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '2.5s' }}
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={isLatest ? 8.5 : 7}
          fill={isAbove ? '#10b981' : '#f59e0b'}
          fillOpacity={isLatest ? 0.35 : 0.25}
        />
        <circle
          cx={cx}
          cy={cy}
          r={isLatest ? 5.5 : 4.5}
          fill={isAbove ? '#059669' : '#d97706'}
          stroke="#ffffff"
          strokeWidth={isLatest ? 2 : 1.5}
        />
      </g>
    );
  };

  return (
    <div id="biobuild-strength-trend-chart" className={`bg-white rounded-2xl border border-[#e2e1d5] shadow-xs overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-5 border-b border-[#eeede6] bg-[#fcfcf9]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40]">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-serif font-bold text-gray-900 tracking-tight">
                Styrkeutvikling & Referansekurve (Trend Chart)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#5A5A40] text-white">
                NS-EN Validert
              </span>
              <AnimatePresence>
                {strengthMeasurements.length > 0 && (
                  <motion.span
                    key={`sync-badge-${strengthMeasurements.length}-${stats.lastMeasured}`}
                    initial={{ scale: 0.82, opacity: 0, x: -4 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.82, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="inline-flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Spring-synkronisert • {strengthMeasurements.length} målepunkter</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Historiske trykk-/bøyefasthetsmålinger (MPa) sammenlignet mot standard herde- og referansekurve for {material.name}.
            </p>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowToleranceBand(!showToleranceBand)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
                showToleranceBand
                  ? 'bg-stone-100 border-[#5A5A40]/30 text-[#5A5A40]'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-stone-50'
              }`}
              title="Vis ±10% standard referansebånd"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>±10% Toleransebånd</span>
            </button>

            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
                  viewMode === 'chart'
                    ? 'bg-[#5A5A40] text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <ChartIcon className="w-3 h-3" />
                <span>Graf</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-[#5A5A40] text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>Tabell</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comparison KPI Cards with Spring Transition */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <motion.div
            key={`kpi-last-${stats.lastMeasured}-${stats.lastDay}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="bg-white rounded-xl p-3 border border-[#eeede6] shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
              Siste måling
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-serif font-bold text-gray-900">
                {stats.lastMeasured !== null ? `${stats.lastMeasured} MPa` : 'Ingen måling'}
              </span>
              {stats.lastDay && (
                <span className="text-[10px] text-gray-500 font-medium">
                  (Dag {stats.lastDay})
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Faktisk laboratorieresultat
            </span>
          </motion.div>

          <div className="bg-white rounded-xl p-3 border border-[#eeede6] shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
              28d Standard Mål
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-serif font-bold text-[#5A5A40]">
                {target28DayStrength} MPa
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Nominell normverdi ($f_{'{ck,28}'}$)
            </span>
          </div>

          <motion.div
            key={`kpi-delta-${stats.avgDeltaPercent}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="bg-white rounded-xl p-3 border border-[#eeede6] shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
              Gjennomsnittlig Avvik
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              {stats.avgDeltaPercent !== null ? (
                <>
                  <span className={`text-lg font-serif font-bold ${
                    stats.avgDeltaPercent >= 0 ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {stats.avgDeltaPercent >= 0 ? `+${stats.avgDeltaPercent}%` : `${stats.avgDeltaPercent}%`}
                  </span>
                  {stats.avgDeltaPercent >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 self-center" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600 self-center" />
                  )}
                </>
              ) : (
                <span className="text-sm font-serif text-gray-400">N/A</span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Relativt til standardkurve
            </span>
          </motion.div>

          <motion.div
            key={`kpi-status-${stats.complianceStatus}-${stats.count}`}
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="bg-white rounded-xl p-3 border border-[#eeede6] shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
              Valideringsstatus
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span className="text-xs font-bold text-gray-800 truncate">
                {stats.complianceStatus}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              {stats.count} registrerte testpunkter
            </span>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5">
        {viewMode === 'chart' ? (
          <div>
            <motion.div
              key={`chart-surface-${strengthMeasurements.length}-${stats.lastMeasured}`}
              initial={{ opacity: 0.92, scale: 0.992 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 25 }}
              className="h-80 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <defs>
                    {/* Tolerance corridor gradient */}
                    <linearGradient id="toleranceBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5A5A40" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#5A5A40" stopOpacity={0.03} />
                    </linearGradient>

                    {/* Measured glow gradient */}
                    <linearGradient id="colorMeasured" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#eeede6" vertical={false} />

                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 'dataMax + 2']}
                    tick={{ fontSize: 11, fill: '#666' }}
                    label={{
                      value: 'Herdetid / Alder (Dager)',
                      position: 'insideBottom',
                      offset: -3,
                      fontSize: 11,
                      fill: '#78716c'
                    }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: '#666' }}
                    label={{
                      value: 'Fasthet (MPa)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 12,
                      fontSize: 11,
                      fill: '#78716c'
                    }}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                  />

                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />

                  {/* 28-day reference goal benchmark line */}
                  <ReferenceLine
                    y={target28DayStrength}
                    stroke="#a8a29e"
                    strokeDasharray="4 4"
                    label={{
                      value: `28d Norm: ${target28DayStrength} MPa`,
                      position: 'right',
                      fill: '#78716c',
                      fontSize: 10
                    }}
                  />

                  {/* Shaded standard tolerance area (+/- 10%) */}
                  {showToleranceBand && (
                    <Area
                      name="Standard toleransebånd (±10%)"
                      type="monotone"
                      dataKey="refUpper"
                      stroke="none"
                      fill="url(#toleranceBand)"
                      fillOpacity={1}
                      legendType="square"
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                    />
                  )}

                  {/* Standard reference curve (NS-EN / standard model) */}
                  <Line
                    name="Standard referansekurve"
                    type="monotone"
                    dataKey="standardRef"
                    stroke="#5A5A40"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 4, stroke: '#5A5A40', strokeWidth: 2, fill: '#ffffff' }}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />

                  {/* Historical measured strength values */}
                  <Line
                    key={`measured-line-${strengthMeasurements.length}-${stats.lastMeasured}`}
                    name="Målte laboratorieverdier"
                    type="monotone"
                    dataKey="measured"
                    stroke="#059669"
                    strokeWidth={2.5}
                    connectNulls={true}
                    dot={renderMeasuredDot}
                    activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' }}
                    isAnimationActive={true}
                    animationDuration={750}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Explanatory legend & instructions footer */}
            <div className="mt-4 pt-3 border-t border-[#eeede6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 border-b-2 border-dashed border-[#5A5A40]"></span>
                  <span className="text-gray-700 font-medium">Standard referansekurve</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-white shadow-xs"></span>
                  <span className="text-gray-700 font-medium">Faktiske målinger (Lab)</span>
                </span>
                {showToleranceBand && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#5A5A40]/15 border border-[#5A5A40]/30"></span>
                    <span>Tillatt toleranseintervall (±10%)</span>
                  </span>
                )}
              </div>

              {onAddMeasurementClick && (
                <button
                  onClick={onAddMeasurementClick}
                  className="text-xs text-[#5A5A40] hover:text-[#434330] font-bold inline-flex items-center gap-1 self-start sm:self-auto underline decoration-dotted"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Registrer ny måling for kurven</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Table Comparison View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#eeede6] text-gray-400 font-bold uppercase tracking-wider text-[10px] bg-[#f9f9f7]">
                  <th className="py-2.5 px-3">Herdetid</th>
                  <th className="py-2.5 px-3">Standard Referanse</th>
                  <th className="py-2.5 px-3">Målt Labverdi</th>
                  <th className="py-2.5 px-3">Avvik ($\Delta$)</th>
                  <th className="py-2.5 px-3">Prosentuelt</th>
                  <th className="py-2.5 px-3">Evaluering</th>
                  <th className="py-2.5 px-3">Forsøk / Dato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeede6]">
                {chartData
                  .filter(item => item.isMeasuredPoint || [1, 7, 14, 28].includes(item.day))
                  .map(row => {
                    const hasMeasurement = row.measured !== undefined;
                    const delta = row.delta ?? 0;
                    const isWithin = Math.abs(row.deltaPercent ?? 0) <= 10;
                    const isAbove = delta > 0;

                    return (
                      <tr 
                        key={row.day} 
                        className={`hover:bg-[#fcfcf9] transition-colors ${
                          hasMeasurement ? 'bg-emerald-50/20 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-gray-800">
                          {row.label}
                        </td>
                        <td className="py-2.5 px-3 text-[#5A5A40] font-mono">
                          {row.standardRef} MPa
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {hasMeasurement ? (
                            <span className="font-bold text-gray-900">
                              {row.measured} MPa
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {hasMeasurement ? (
                            <span className={delta >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                              {delta >= 0 ? `+${delta}` : delta} MPa
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {hasMeasurement && row.deltaPercent !== undefined ? (
                            <span className={row.deltaPercent >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                              {row.deltaPercent >= 0 ? `+${row.deltaPercent}%` : `${row.deltaPercent}%`}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {hasMeasurement ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isWithin
                                ? 'bg-emerald-100 text-emerald-800'
                                : isAbove
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isWithin ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Innenfor toleranse</span>
                                </>
                              ) : isAbove ? (
                                <>
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Over forventning</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Under toleranse</span>
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">Referansemål</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 text-[11px]">
                          {hasMeasurement ? (
                            <div>
                              <div className="font-medium text-gray-700">
                                {row.experimentTitle || 'Generell labmåling'}
                              </div>
                              <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {row.timestamp || 'Registrert'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Teoretisk NS-EN kurve</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Tooltip component for rich comparison details
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const dataPoint: ChartDataPoint = payload[0]?.payload;
  if (!dataPoint) return null;

  const hasMeasurement = dataPoint.measured !== undefined;

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-[#dcdad0] rounded-xl p-3 shadow-md text-xs min-w-[210px]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 mb-2">
        <span className="font-serif font-bold text-gray-900">
          {dataPoint.label} ({dataPoint.day} dager)
        </span>
        {hasMeasurement && (
          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Målt punkt
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
            Standard referanse:
          </span>
          <span className="font-mono font-bold text-[#5A5A40]">
            {dataPoint.standardRef} MPa
          </span>
        </div>

        {hasMeasurement && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                Målt verdi:
              </span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {dataPoint.measured} MPa
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-100">
              <span className="text-gray-500">Avvik fra referanse:</span>
              <span className={`font-mono font-bold ${
                (dataPoint.delta || 0) >= 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {(dataPoint.delta || 0) >= 0 ? `+${dataPoint.delta}` : dataPoint.delta} MPa
                {dataPoint.deltaPercent !== undefined && (
                  <span className="text-[10px] ml-1">
                    ({dataPoint.deltaPercent >= 0 ? `+${dataPoint.deltaPercent}%` : `${dataPoint.deltaPercent}%`})
                  </span>
                )}
              </span>
            </div>

            {dataPoint.experimentTitle && (
              <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-50">
                Tilknyttet: <span className="font-medium text-gray-600">{dataPoint.experimentTitle}</span>
              </div>
            )}
            {dataPoint.timestamp && (
              <div className="text-[9px] text-gray-400">
                Dato: {dataPoint.timestamp}
              </div>
            )}
          </>
        )}

        <div className="text-[10px] text-gray-400 pt-1 flex justify-between">
          <span>Toleranse (±10%):</span>
          <span className="font-mono">{dataPoint.refLower} - {dataPoint.refUpper} MPa</span>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
