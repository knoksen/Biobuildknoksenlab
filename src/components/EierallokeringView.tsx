import React from 'react';
import { 
  Bot, 
  User, 
  Users, 
  Award, 
  CheckCircle, 
  Clock, 
  Loader2, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight, 
  Database,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  UserCheck
} from 'lucide-react';
import { BioMaterial, Researcher } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface EierallokeringViewProps {
  materials: BioMaterial[];
  researchers: Researcher[];
  selectedMaterialIdForPredictiveAI: string;
  setSelectedMaterialIdForPredictiveAI: (id: string) => void;
  predictionLoading: boolean;
  predictionError: string | null;
  predictedAllocation: {
    ownerId: string;
    confidence: number;
    reasoning: string;
    workloadFactor: string;
    successProbability: number;
  } | null;
  handlePredictOwner: () => void;
  handleApproveOwner: () => void;
}

export default function EierallokeringView({
  materials,
  researchers,
  selectedMaterialIdForPredictiveAI,
  setSelectedMaterialIdForPredictiveAI,
  predictionLoading,
  predictionError,
  predictedAllocation,
  handlePredictOwner,
  handleApproveOwner
}: EierallokeringViewProps) {

  // Selected material for prediction details
  const activeMaterial = materials.find(m => m.id === selectedMaterialIdForPredictiveAI) || materials[0];

  // Helper: Count materials owned by researcher
  const getProjectCount = (resId: string) => {
    return materials.filter(m => m.ownerId === resId).length;
  };

  // Helper: Get material names owned by researcher
  const getOwnedMaterialNames = (resId: string) => {
    return materials.filter(m => m.ownerId === resId).map(m => m.name);
  };

  // STATISTICS DATA PREPARATION
  // 1. Projects per Researcher
  const projectsData = researchers.map(res => ({
    name: res.name.split(' ').slice(-1)[0], // last name for brevity in chart
    'Prosjekter': getProjectCount(res.id),
    fullName: res.name
  }));

  // 2. Workload Hours
  const workloadData = researchers.map(res => ({
    name: res.name.split(' ').slice(-1)[0],
    'Timer': res.activeHours,
    fullName: res.name
  }));

  // 3. Average EPD GWP per Owner
  const avgGwpData = researchers.map(res => {
    const owned = materials.filter(m => m.ownerId === res.id);
    const avgGwp = owned.length > 0 
      ? parseFloat((owned.reduce((sum, m) => sum + (m.epd?.gwp || 0), 0) / owned.length).toFixed(2))
      : 0;
    return {
      name: res.name.split(' ').slice(-1)[0],
      'GWP Avtrykk': avgGwp,
      fullName: res.name
    };
  });

  const COLORS = ['#5A5A40', '#8c8c60', '#a43a3a', '#2c5234', '#312e81', '#1e1b4b'];

  return (
    <div className="flex-1 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      
      {/* HEADER SUMMARY */}
      <div className="bg-gradient-to-r from-amber-950/90 to-stone-900 text-white rounded-[24px] p-6 shadow-xl border border-amber-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl font-serif italic font-bold text-amber-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" />
            AI-Eierallokering & Forskningsstatistikk
          </h2>
          <p className="text-xs text-amber-200/80 max-w-xl mt-1">
            En prediktiv tildelingsmotor drevet av Gemini 3.5 Flash som kobler nylig utviklede bio-materialer til det optimale forskningsteamet basert på belastning, kjernekompetanse og porteføljematch.
          </p>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span className="block opacity-65 text-[10px]">TOTALE PROSJEKTER</span>
            <span className="text-lg font-bold">{materials.length}</span>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span className="block opacity-65 text-[10px]">FORSKERE I LABEN</span>
            <span className="text-lg font-bold">{researchers.length}</span>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <span className="block opacity-65 text-[10px]">AVG SUKSESSRATE</span>
            <span className="text-lg font-bold text-emerald-400">
              {Math.floor(researchers.reduce((sum, r) => sum + r.successRate, 0) / researchers.length)}%
            </span>
          </div>
        </div>
      </div>

      {/* TOP GRID: PREDICTIVE ENGINE vs RESEARCHERS DATABASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PREDICTIVE ALLOCATION CONSOLE (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#e2e1d5] rounded-[24px] p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-[#e2e1d5] pb-3 flex justify-between items-center">
            <h3 className="font-serif italic text-base font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              Prediktiv Eier-allokering
            </h3>
            <span className="text-[9px] font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Gemini predictive engine
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Velg et bio-materiale fra laben under. AI-motoren vil vurdere dets kjemiske/biologiske struktur og koble det med den ideelle forskningslederen.
          </p>

          {/* Material selector */}
          <div className="flex flex-col gap-1 text-xs">
            <label className="font-bold text-gray-600">Velg materiale til analyse:</label>
            <select
              value={selectedMaterialIdForPredictiveAI}
              onChange={(e) => {
                setSelectedMaterialIdForPredictiveAI(e.target.value);
                // Clear any old prediction to avoid confusion
              }}
              className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 focus:outline-none focus:border-amber-600 font-medium text-[#2c2c24]"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category})
                </option>
              ))}
            </select>
          </div>

          {/* Selected material metadata summary */}
          {activeMaterial && (
            <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-[11px]">{activeMaterial.name}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-[#eeede6] font-medium font-mono">
                  TRL {activeMaterial.trl}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 line-clamp-2">{activeMaterial.description}</p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-stone-200/50 pt-2">
                <div>
                  <span className="block opacity-50 uppercase">GWP Avtrykk</span>
                  <span className={`font-bold ${activeMaterial.epd?.gwp < 0 ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {activeMaterial.epd?.gwp} kg CO2/kg
                  </span>
                </div>
                <div>
                  <span className="block opacity-50 uppercase">Nåværende eier</span>
                  <span className="font-bold text-amber-800">
                    {researchers.find(r => r.id === activeMaterial.ownerId)?.name || 'Ingen eier tildelt'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Button to run predict AI */}
          <button
            onClick={handlePredictOwner}
            disabled={predictionLoading}
            className="w-full bg-amber-950 hover:bg-amber-900 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs disabled:opacity-40 uppercase tracking-wider"
          >
            {predictionLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyserer med AI-Lab Partner...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                Kjør Prediktiv AI-analyse
              </>
            )}
          </button>

          {/* Error notice */}
          {predictionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] p-3 rounded-xl flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-bold block">Feil ved AI-beregning</span>
                <span>{predictionError}</span>
              </div>
            </div>
          )}

          {/* Prediction Allocation Result Card */}
          {predictedAllocation && (
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 mt-1 flex flex-col gap-3 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-inner">
                    <UserCheck className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold uppercase block tracking-wider">Optimal Match</span>
                    <h4 className="text-sm font-bold text-gray-900">
                      {researchers.find(r => r.id === predictedAllocation.ownerId)?.name}
                    </h4>
                  </div>
                </div>
                
                {/* Confidence circle mockup */}
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-amber-950 block">{predictedAllocation.confidence}%</span>
                  <span className="text-[8px] text-gray-400 uppercase font-semibold">Match score</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-gray-700">
                <p>
                  <strong>Begrunnelse:</strong> {predictedAllocation.reasoning}
                </p>
                <p className="border-t border-amber-200/50 pt-2 text-[10px] text-gray-500 font-mono">
                  <strong>Arbeidsbelastningsvurdering:</strong> {predictedAllocation.workloadFactor}
                </p>
              </div>

              {/* Success Probability scale */}
              <div className="flex flex-col gap-1 border-t border-amber-200/50 pt-2 text-[10px]">
                <div className="flex justify-between font-bold text-gray-600">
                  <span>Sannsynlighet for forskningssuksess:</span>
                  <span className="text-emerald-700 font-mono font-bold">{predictedAllocation.successProbability}%</span>
                </div>
                <div className="w-full bg-amber-200/30 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${predictedAllocation.successProbability}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleApproveOwner}
                className="w-full bg-[#5A5A40] hover:bg-[#4a4a34] text-white py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1 mt-1"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-200" /> Godkjenn & Tildel Forsknings-eier
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CENTRAL RESEARCHERS DATABASE (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#e2e1d5] rounded-[24px] p-5 shadow-sm flex flex-col gap-4">
          <div className="border-b border-[#e2e1d5] pb-3 flex justify-between items-center">
            <h3 className="font-serif italic text-base font-bold text-gray-900 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-[#5A5A40]" />
              Forskerdatabase & Belastningsregister
            </h3>
            <span className="text-[9px] font-mono uppercase bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full text-stone-700">
              {researchers.length} Registerte forskere
            </span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {researchers.map(res => {
              const ownedCount = getProjectCount(res.id);
              const ownedNames = getOwnedMaterialNames(res.id);
              return (
                <div key={res.id} className="bg-stone-50 hover:bg-[#eeede6]/35 transition-all p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-4">
                  {/* Photo / ID */}
                  <div className="shrink-0 flex md:flex-col items-center justify-center text-center gap-2">
                    {res.avatar === 'metahuman_eva' ? (
                      <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden bg-radial-gradient">
                        <img 
                          src="/src/assets/images/metahuman_eva_render_1784065181087.jpg" 
                          alt="Eva-01" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <img 
                        src={res.avatar} 
                        alt={res.name} 
                        className="w-12 h-12 rounded-full object-cover border border-[#e2e1d5] shadow-xs"
                      />
                    )}
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-[#5A5A40]/10 text-[#5A5A40] px-1.5 py-0.5 rounded-md">
                      {res.id}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                          {res.name}
                          {res.id === 'res-5' && <span className="text-[9px] font-mono text-indigo-700 font-normal">(Virtual Partner)</span>}
                        </h4>
                        <span className="text-[10px] text-gray-500 italic font-medium">{res.department}</span>
                      </div>
                      <span className="text-[10px] text-[#5A5A40] font-semibold">{res.title}</span>
                    </div>

                    <p className="text-[10px] text-gray-500 leading-relaxed">{res.bio}</p>

                    {/* Expertise Pills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.expertise.map((exp, i) => (
                        <span key={i} className="text-[9px] bg-white border border-stone-200 px-2 py-0.5 rounded-md font-medium text-gray-600">
                          {exp}
                        </span>
                      ))}
                    </div>

                    {/* Owned projects badge list */}
                    {ownedCount > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-stone-200/50 mt-2 text-[9px]">
                        <span className="text-stone-400 font-bold uppercase font-mono">Eier av ({ownedCount}):</span>
                        {ownedNames.map((name, i) => (
                          <span key={i} className="bg-[#eeede6] text-[#2c2c24]/90 px-2 py-0.5 rounded-full border border-[#dcdad0] font-medium">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Load / Performance numbers */}
                  <div className="md:border-l md:border-stone-200 md:pl-4 shrink-0 flex flex-row md:flex-col justify-around md:justify-center gap-4 text-xs font-mono">
                    <div className="text-center md:text-left">
                      <span className="block text-[8px] text-gray-400 uppercase font-bold flex items-center justify-center md:justify-start gap-1">
                        <Clock className="w-3 h-3 text-[#5A5A40]" /> Arbeidstid
                      </span>
                      <span className="text-sm font-bold text-gray-900">{res.activeHours}t</span>
                    </div>
                    <div className="text-center md:text-left">
                      <span className="block text-[8px] text-gray-400 uppercase font-bold flex items-center justify-center md:justify-start gap-1">
                        <Award className="w-3 h-3 text-emerald-600" /> Suksessrate
                      </span>
                      <span className="text-sm font-bold text-emerald-600">{res.successRate}%</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* BOTTOM GRID: RECHARTS ANALYTICS STATISTICS DASHBOARDS */}
      <div className="bg-white border border-[#e2e1d5] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
        <div className="border-b border-[#e2e1d5] pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <h3 className="font-serif italic text-base font-bold text-gray-900 flex items-center gap-1.5">
              <BarChart3 className="w-5 h-5 text-[#5A5A40]" />
              Forskningsanalyser & Lab-belastning (Visualisert)
            </h3>
            <p className="text-xs text-gray-500">
              Sanntidsvisuelle diagrammer som oppdateres dynamisk når du godkjenner eierallokeringer.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Koblede diagrammer: Synkronisert</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Chart 1: Project Ownership distribution */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">Antall prosjekter per eier</span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e1d5" />
                  <XAxis dataKey="name" stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fcfcf9', border: '1px solid #e2e1d5', borderRadius: '8px', fontSize: '11px' }}
                    labelFormatter={(label) => `Forsker: ${label}`}
                  />
                  <Bar dataKey="Prosjekter" fill="#5A5A40" radius={[4, 4, 0, 0]}>
                    {projectsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Workload distribution (activeHours) */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">Arbeidsbelastning (Timer)</span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e1d5" />
                  <XAxis dataKey="name" stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <YAxis stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fcfcf9', border: '1px solid #e2e1d5', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="Timer" fill="#8c8c60" radius={[4, 4, 0, 0]}>
                    {workloadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Avg EPD GWP Carbon footprint per owner */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">Gjennomsnittlig EPD GWP per portefølje</span>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avgGwpData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e1d5" />
                  <XAxis dataKey="name" stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <YAxis stroke="#5A5A40" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#fcfcf9', border: '1px solid #e2e1d5', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Bar dataKey="GWP Avtrykk" fill="#a43a3a" radius={[4, 4, 0, 0]}>
                    {avgGwpData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry['GWP Avtrykk'] < 0 ? '#15803d' : '#b91c1c'} // green for negative CO2, red for positive!
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        <div className="bg-amber-50/45 p-4 border border-amber-100 rounded-xl text-[11px] leading-relaxed text-amber-900 font-mono">
          <strong>FORSKER-TILDELINGSREGEL:</strong> Godkjenning av en AI-eierallokering tildeler automatisk materialet til forskeren og legger til <strong>25 timer</strong> prosjekttid til forskerens aktive tidsregnskap. Dette påvirker fremtidige prediksjoner, ettersom AI-modellen overvåker belastningskapasitet i sanntid for å forhindre over-allokering.
        </div>
      </div>

    </div>
  );
}
