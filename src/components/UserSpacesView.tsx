import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  Pin, 
  PinOff, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Edit3, 
  Check, 
  X, 
  Layers, 
  Beaker, 
  Calendar, 
  Tag, 
  Search,
  ArrowRight,
  ShieldCheck,
  Activity,
  BookmarkCheck
} from 'lucide-react';
import { UserSpace, BioMaterial, Researcher } from '../types';

interface UserSpacesViewProps {
  userSpaces: UserSpace[];
  setUserSpaces: React.Dispatch<React.SetStateAction<UserSpace[]>>;
  materials: BioMaterial[];
  researchers: Researcher[];
  activeSpaceId: string;
  setActiveSpaceId: (spaceId: string) => void;
  onNavigateToMaterials: (filterSpaceId?: string) => void;
}

export default function UserSpacesView({
  userSpaces,
  setUserSpaces,
  materials,
  researchers,
  activeSpaceId,
  setActiveSpaceId,
  onNavigateToMaterials
}: UserSpacesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotesSpaceId, setEditingNotesSpaceId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [managingMaterialsSpaceId, setManagingMaterialsSpaceId] = useState<string | null>(null);

  // New Space Form State
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDepartment, setNewDepartment] = useState('Byggeteknikk & Bio-innovasjon');
  const [newLeadResearcherId, setNewLeadResearcherId] = useState(researchers[0]?.id || 'res-1');
  const [newDescription, setNewDescription] = useState('');
  const [newFocusAreas, setNewFocusAreas] = useState('Bio-kompositter, Fuktregulering, EPD');
  const [newColor, setNewColor] = useState('emerald');
  const [newBadge, setNewBadge] = useState('Spesialisert Lab');
  const [newInitialNotes, setNewInitialNotes] = useState('');

  // Extract unique departments for filtering
  const departments = ['all', ...Array.from(new Set(userSpaces.map(s => s.department)))];

  // Filtered spaces
  const filteredSpaces = userSpaces.filter(space => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.focusAreas.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartmentFilter === 'all' || space.department === selectedDepartmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Handle creating new user space
  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const newSpace: UserSpace = {
      id: `space-custom-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim().toUpperCase(),
      description: newDescription.trim() || 'Spesialisert bruker-arbeidsområde for biomaterialer.',
      leadResearcherId: newLeadResearcherId,
      department: newDepartment.trim(),
      focusAreas: newFocusAreas.split(',').map(s => s.trim()).filter(Boolean),
      pinnedMaterialIds: [],
      activeExperimentsCount: 1,
      memberCount: 2,
      badge: newBadge.trim() || 'Egendefinert Space',
      color: newColor,
      isCustom: true,
      notes: newInitialNotes.trim() || 'Notater for nytt forskningsprosjekt.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUserSpaces(prev => [newSpace, ...prev]);
    setShowCreateModal(false);
    
    // Reset fields
    setNewName('');
    setNewCode('');
    setNewDescription('');
    setNewInitialNotes('');
  };

  // Toggle pinning a material to a space
  const handleToggleMaterialPin = (spaceId: string, materialId: string) => {
    setUserSpaces(prev => prev.map(space => {
      if (space.id !== spaceId) return space;
      const isPinned = space.pinnedMaterialIds.includes(materialId);
      const updatedPinned = isPinned
        ? space.pinnedMaterialIds.filter(id => id !== materialId)
        : [...space.pinnedMaterialIds, materialId];
      return { ...space, pinnedMaterialIds: updatedPinned };
    }));
  };

  // Save edited notes
  const handleSaveNotes = (spaceId: string) => {
    setUserSpaces(prev => prev.map(space => {
      if (space.id === spaceId) {
        return { ...space, notes: tempNotes };
      }
      return space;
    }));
    setEditingNotesSpaceId(null);
  };

  // Color mapper helper
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'amber':
        return {
          bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
          borderAccent: 'border-l-amber-500',
          gradient: 'from-amber-500/10 via-white to-amber-50/20',
          button: 'bg-amber-800 hover:bg-amber-900 text-white'
        };
      case 'purple':
        return {
          bgBadge: 'bg-purple-100 text-purple-900 border-purple-300',
          borderAccent: 'border-l-purple-500',
          gradient: 'from-purple-500/10 via-white to-purple-50/20',
          button: 'bg-purple-800 hover:bg-purple-900 text-white'
        };
      case 'blue':
        return {
          bgBadge: 'bg-blue-100 text-blue-900 border-blue-300',
          borderAccent: 'border-l-blue-500',
          gradient: 'from-blue-500/10 via-white to-blue-50/20',
          button: 'bg-blue-800 hover:bg-blue-900 text-white'
        };
      case 'teal':
        return {
          bgBadge: 'bg-teal-100 text-teal-900 border-teal-300',
          borderAccent: 'border-l-teal-500',
          gradient: 'from-teal-500/10 via-white to-teal-50/20',
          button: 'bg-teal-800 hover:bg-teal-900 text-white'
        };
      case 'rose':
        return {
          bgBadge: 'bg-rose-100 text-rose-900 border-rose-300',
          borderAccent: 'border-l-rose-500',
          gradient: 'from-rose-500/10 via-white to-rose-50/20',
          button: 'bg-rose-800 hover:bg-rose-900 text-white'
        };
      case 'indigo':
        return {
          bgBadge: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          borderAccent: 'border-l-indigo-500',
          gradient: 'from-indigo-500/10 via-white to-indigo-50/20',
          button: 'bg-indigo-800 hover:bg-indigo-900 text-white'
        };
      default:
        return {
          bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          borderAccent: 'border-l-emerald-600',
          gradient: 'from-emerald-500/10 via-white to-emerald-50/20',
          button: 'bg-emerald-800 hover:bg-emerald-900 text-white'
        };
    }
  };

  const totalPinnedAcrossSpaces = userSpaces.reduce((acc, s) => acc + s.pinnedMaterialIds.length, 0);
  const totalActiveExperiments = userSpaces.reduce((acc, s) => acc + (s.activeExperimentsCount || 0), 0);

  return (
    <div id="userspaces-view-container" className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ----------------- EXECUTIVE HEADER ----------------- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e1d5] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3 opacity-70"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#5A5A40] text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5A5A40]">
                Nordic BioBuild Lab Directory
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif italic font-bold text-slate-950">
              Bruker-Spaces & Forsknings-Arbeidsområder
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Administrer spesialiserte laboratorier, tilknyttede forskningsgrupper og dedikerte prosjektrom. 
              Fest relevante biomaterialer, dokumenter hypoteser i sanntid, og bytt mellom aktive forskerspaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-create-new-space"
              onClick={() => setShowCreateModal(true)}
              className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Opprett Nytt Space</span>
            </button>
            <button
              onClick={() => onNavigateToMaterials('all')}
              className="bg-white hover:bg-stone-50 text-slate-800 text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-2xl transition-all border border-[#dcdad0] shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Beaker className="w-4 h-4 text-[#5A5A40]" />
              <span>Gå til Material-Lab</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#eeede6]">
          <div className="bg-[#fcfcf9] p-3.5 rounded-2xl border border-[#e2e1d5]/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Aktive Spaces</span>
            <span className="text-xl font-serif font-bold text-slate-900">{userSpaces.length} rom</span>
            <span className="text-[10px] text-emerald-700 block font-medium mt-0.5">Fullt operative</span>
          </div>

          <div className="bg-[#fcfcf9] p-3.5 rounded-2xl border border-[#e2e1d5]/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Forskere i Nettverket</span>
            <span className="text-xl font-serif font-bold text-slate-900">{researchers.length} forskere</span>
            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Tverrfaglig ekspertise</span>
          </div>

          <div className="bg-[#fcfcf9] p-3.5 rounded-2xl border border-[#e2e1d5]/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Tilknyttede Materialer</span>
            <span className="text-xl font-serif font-bold text-slate-900">{totalPinnedAcrossSpaces} tildelinger</span>
            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Av {materials.length} i registeret</span>
          </div>

          <div className="bg-[#fcfcf9] p-3.5 rounded-2xl border border-[#e2e1d5]/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Aktive Eksperimenter</span>
            <span className="text-xl font-serif font-bold text-slate-900">{totalActiveExperiments} pågående</span>
            <span className="text-[10px] text-indigo-700 block font-medium mt-0.5">Med verifiserte logger</span>
          </div>
        </div>
      </div>

      {/* ----------------- SEARCH & FILTER BAR ----------------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e2e1d5] shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Søk i arbeidsområder, koder, fokusområder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#fcfcf9] border border-[#dcdad0] rounded-xl focus:outline-none focus:border-[#5A5A40]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">Avdeling:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartmentFilter(dept)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedDepartmentFilter === dept
                  ? 'bg-[#5A5A40] text-white shadow-2xs'
                  : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
              }`}
            >
              {dept === 'all' ? 'Alle avdelinger' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------- USER SPACES GRID ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSpaces.map((space) => {
          const colors = getColorClasses(space.color);
          const lead = researchers.find(r => r.id === space.leadResearcherId) || researchers[0];
          const pinnedMaterials = materials.filter(m => space.pinnedMaterialIds.includes(m.id));
          const isActive = activeSpaceId === space.id;

          return (
            <div
              key={space.id}
              className={`bg-white rounded-3xl border ${
                isActive ? 'border-2 border-emerald-600 shadow-md' : 'border-[#e2e1d5] shadow-xs'
              } p-6 space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md`}
            >
              {/* Top Bar with Badges and Active status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg shadow-2xs">
                      {space.code}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${colors.bgBadge}`}>
                      {space.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-extrabold bg-emerald-700 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs animate-pulse">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktivt Arbeidsområde
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      title={isActive ? 'Deaktiver filter' : 'Sett som aktivt filter'}
                      onClick={() => setActiveSpaceId(isActive ? 'all' : space.id)}
                      className={`text-xs px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
                      }`}
                    >
                      {isActive ? 'Valgt' : 'Velg Space'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-950 flex items-center gap-2">
                    <span>{space.name}</span>
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {space.department}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {space.description}
                </p>

                {/* Focus areas */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {space.focusAreas.map((focus, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[9.5px] font-medium bg-[#fcfcf9] text-slate-700 border border-[#e2e1d5] px-2 py-0.5 rounded-md"
                    >
                      #{focus}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Section: Lead Researcher & Pinned Materials */}
              <div className="space-y-4 pt-4 border-t border-[#eeede6]">
                {/* Lead Researcher Card */}
                <div className="flex items-center gap-3 p-3 bg-[#fcfcf9] rounded-2xl border border-[#e2e1d5]">
                  <img
                    src={lead.avatar === 'metahuman_eva' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : lead.avatar}
                    alt={lead.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#5A5A40]/30 shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Fagansvarlig / Lab-leder
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {lead.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {lead.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0 text-[10px] font-mono font-medium text-slate-500">
                    <div>{space.memberCount} medlemmer</div>
                    <div className="text-indigo-700 font-bold">{space.activeExperimentsCount} lab-forsøk</div>
                  </div>
                </div>

                {/* Pinned Materials Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Pin className="w-3 h-3 text-[#5A5A40]" />
                      <span>Tilknyttede Materialer ({pinnedMaterials.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setManagingMaterialsSpaceId(space.id)}
                      className="text-[10px] font-bold text-[#5A5A40] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Legg til / Fjern</span>
                    </button>
                  </div>

                  {pinnedMaterials.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pinnedMaterials.slice(0, 4).map((mat) => (
                        <div
                          key={mat.id}
                          onClick={() => {
                            setActiveSpaceId(space.id);
                            onNavigateToMaterials(space.id);
                          }}
                          className="p-2.5 bg-[#f8fafc] hover:bg-[#f1f5f9] rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="text-[8px] font-bold uppercase text-slate-500 block truncate">
                              {mat.category}
                            </span>
                            <h5 className="text-[11px] font-bold text-slate-900 truncate">
                              {mat.name}
                            </h5>
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 shrink-0">
                            TRL {mat.trl}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-center text-slate-500 text-xs">
                      Ingen materialer er festet til dette rommet ennå.
                    </div>
                  )}

                  {pinnedMaterials.length > 4 && (
                    <div className="text-[10px] text-slate-500 text-right">
                      + {pinnedMaterials.length - 4} flere materialer tilknyttet dette spacet
                    </div>
                  )}
                </div>

                {/* Editable Space Notes / Hypotheses */}
                <div className="space-y-1.5 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-amber-700" />
                      <span>Lab-notater & Hypoteser</span>
                    </span>
                    {editingNotesSpaceId === space.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(space.id)}
                          className="text-[9px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer flex items-center gap-0.5"
                        >
                          <Check className="w-2.5 h-2.5" /> Lagre
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNotesSpaceId(null)}
                          className="text-[9px] bg-stone-200 text-slate-700 font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Avbryt
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesSpaceId(space.id);
                          setTempNotes(space.notes || '');
                        }}
                        className="text-[10px] font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-2.5 h-2.5" /> Rediger
                      </button>
                    )}
                  </div>

                  {editingNotesSpaceId === space.id ? (
                    <textarea
                      rows={3}
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Skriv inn notater, hypoteser eller testmål..."
                      className="w-full bg-white p-2 rounded-xl text-xs text-slate-800 border border-amber-300 focus:outline-none focus:border-amber-600 leading-relaxed mt-1"
                    />
                  ) : (
                    <p className="text-xs text-slate-700 leading-relaxed font-sans italic">
                      "{space.notes || 'Ingen aktive lab-notater registrert ennå.'}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#eeede6] flex items-center justify-between gap-3">
                <span className="text-[10px] font-mono text-slate-400">
                  Opprettet: {space.createdAt || '2026'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSpaceId(space.id);
                      onNavigateToMaterials(space.id);
                    }}
                    className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Åpne i Material-Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------- CREATE NEW SPACE MODAL ----------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#e2e1d5] relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#eeede6] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#5A5A40] text-white shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    Opprett Nytt Bruker-Space
                  </h3>
                  <p className="text-xs text-slate-500">
                    Etabler et dedikert forskningsrom for din gruppe, institusjon eller prosjekt.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Navn på Workspace / Lab *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="F.eks. Sirkulær Betong & Geopolymer Lab"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Lab-Kode (ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="F.eks. CIRC-GEO"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs font-mono uppercase focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Avdeling / Institutt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="F.eks. NTNU Konstruksjonsteknikk"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Fagansvarlig / Lab-leder *
                  </label>
                  <select
                    value={newLeadResearcherId}
                    onChange={(e) => setNewLeadResearcherId(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                  >
                    {researchers.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Formål & Beskrivelse
                </label>
                <textarea
                  rows={2}
                  placeholder="Kort beskrivelse av laboratoriets formål og testmål..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Fokusområder (kommaseparert)
                  </label>
                  <input
                    type="text"
                    placeholder="Trykkfasthet, Saltvann, Resirkulert tilslag"
                    value={newFocusAreas}
                    onChange={(e) => setNewFocusAreas(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                    Fargetema & Identitet
                  </label>
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                  >
                    <option value="emerald">Smaragdgrønn (Bio / Natur)</option>
                    <option value="amber">Rav / Oker (SINTEF / Brann)</option>
                    <option value="purple">Lilla / Violett (Mykologi / Dyrking)</option>
                    <option value="blue">Kongeblå (Sirkulær / EPD)</option>
                    <option value="teal">Blågrønn / Marin (Kyst / Tare)</option>
                    <option value="rose">Rosa / Personlig (Pilot)</option>
                    <option value="indigo">Indigo (Simulator & AI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Initielle Lab-notater / Hypoteser
                </label>
                <textarea
                  rows={2}
                  placeholder="Skriv ned innledende arbeidshypotese..."
                  value={newInitialNotes}
                  onChange={(e) => setNewInitialNotes(e.target.value)}
                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eeede6]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs cursor-pointer"
                >
                  Opprett Space
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MANAGE PINNED MATERIALS MODAL ----------------- */}
      {managingMaterialsSpaceId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e2e1d5] relative space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#eeede6] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5A40]">
                  Administrer Materialer
                </span>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {userSpaces.find(s => s.id === managingMaterialsSpaceId)?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Klikk for å feste eller løsne biologiske materialer til dette rommet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setManagingMaterialsSpaceId(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {materials.map((mat) => {
                const space = userSpaces.find(s => s.id === managingMaterialsSpaceId);
                const isPinned = space?.pinnedMaterialIds.includes(mat.id);

                return (
                  <div
                    key={mat.id}
                    onClick={() => handleToggleMaterialPin(managingMaterialsSpaceId, mat.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isPinned
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                        : 'bg-[#fcfcf9] hover:bg-stone-50 border-[#e2e1d5]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          {mat.category}
                        </span>
                        <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          TRL {mat.trl}
                        </span>
                        {mat.provenTesting?.isVerified && (
                          <span className="text-[8px] bg-emerald-700 text-white font-bold px-1.5 py-0.2 rounded">
                            Akkreditert
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {mat.name}
                      </h4>
                    </div>

                    <div className="shrink-0">
                      {isPinned ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Festet</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                          <span>Fest</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#eeede6]">
              <button
                type="button"
                onClick={() => setManagingMaterialsSpaceId(null)}
                className="bg-[#5A5A40] hover:bg-[#4a4a34] text-white text-xs font-bold py-2 px-6 rounded-xl shadow-xs cursor-pointer"
              >
                Ferdig
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
