import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  TrendingDown,
  Info,
} from 'lucide-react';
import { BioMaterial, Researcher, UserSpace } from '../types';
import { downloadMaterialsCsv, generateMaterialsCsv, CsvExportOptions } from '../utils/csvExporter';

interface MaterialTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: BioMaterial[];
  researchers: Researcher[];
  userSpaces: UserSpace[];
  onSelectMaterial?: (id: string) => void;
  initialSelectedIds?: string[];
}

type SortField = 'name' | 'category' | 'trl' | 'gwp' | 'strength' | 'recycled';
type SortOrder = 'asc' | 'desc';

export default function MaterialTableModal({
  isOpen,
  onClose,
  materials,
  researchers,
  userSpaces,
  onSelectMaterial,
  initialSelectedIds = [],
}: MaterialTableModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Alle');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [delimiterChoice, setDelimiterChoice] = useState<';' | ',' | '\t'>(';');
  const [exportScope, setExportScope] = useState<'all' | 'filtered' | 'selected'>('all');
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sync initialSelectedIds when modal opens
  React.useEffect(() => {
    if (initialSelectedIds.length > 0) {
      setSelectedIds(initialSelectedIds);
      setExportScope('selected');
    }
  }, [initialSelectedIds, isOpen]);

  // Lookup researcher map
  const researcherMap = useMemo(() => {
    const map = new Map<string, Researcher>();
    researchers.forEach(r => map.set(r.id, r));
    return map;
  }, [researchers]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    materials.forEach(m => set.add(m.category));
    return ['Alle', ...Array.from(set)];
  }, [materials]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.testResults?.fireRating || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.chemicalComposition || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'Alle' || m.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [materials, searchTerm, categoryFilter]);

  // Sorted materials
  const sortedMaterials = useMemo(() => {
    return [...filteredMaterials].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'no');
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category, 'no');
          break;
        case 'trl':
          comparison = a.trl - b.trl;
          break;
        case 'gwp':
          comparison = (a.epd?.gwp ?? 999) - (b.epd?.gwp ?? 999);
          break;
        case 'strength':
          comparison = (a.testResults?.strengthMpa ?? 0) - (b.testResults?.strengthMpa ?? 0);
          break;
        case 'recycled':
          comparison = (a.epd?.recycledContent ?? 0) - (b.epd?.recycledContent ?? 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredMaterials, sortField, sortOrder]);

  if (!isOpen) return null;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMaterials.length && filteredMaterials.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMaterials.map(m => m.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const getTargetMaterialsToExport = (): BioMaterial[] => {
    if (exportScope === 'selected' && selectedIds.length > 0) {
      return materials.filter(m => selectedIds.includes(m.id));
    }
    if (exportScope === 'filtered') {
      return filteredMaterials;
    }
    return materials;
  };

  const handleDownload = () => {
    const targetMaterials = getTargetMaterialsToExport();
    const options: CsvExportOptions = {
      delimiter: delimiterChoice,
      decimalSeparator: delimiterChoice === ';' ? ',' : '.',
      includeBom: true,
      useEnglishHeaders: false,
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `BioBuild_Materialtabell_${targetMaterials.length}_materialer_${dateStr}.csv`;
    downloadMaterialsCsv(targetMaterials, researchers, userSpaces, filename, options);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyClipboard = () => {
    const targetMaterials = getTargetMaterialsToExport();
    const options: CsvExportOptions = {
      delimiter: '\t', // Tab-separated for direct paste into Excel / Google Sheets
      decimalSeparator: ',',
      includeBom: false,
    };
    const tsvContent = generateMaterialsCsv(targetMaterials, researchers, userSpaces, options);
    navigator.clipboard.writeText(tsvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const targetExportCount = getTargetMaterialsToExport().length;

  return (
    <div
      id="modal-material-table"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#fcfcf9] rounded-2xl w-full max-w-6xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col border border-[#e2e1d5] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#e2e1d5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700/10 border border-emerald-700/20 flex items-center justify-center text-emerald-800 shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-serif italic text-[#2c2c24] tracking-tight">
                  Materialtabell & CSV-Eksport
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-800 text-white px-2 py-0.5 rounded-full">
                  Excel & Analyse
                </span>
              </div>
              <p className="text-xs text-[#5A5A40]/80">
                Eksporter laboratoriedata, EPD-karbonavtrykk og fysiske testresultater for direkte import i Excel, R, Python eller SPSS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-close-material-table-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f4f3ec] hover:bg-[#e2e1d5] text-[#2c2c24] flex items-center justify-center transition-colors cursor-pointer"
              title="Lukk tabellvisning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-6 py-3.5 bg-[#f7f6f0] border-b border-[#e2e1d5] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Søk etter navn, kjemisk sammensetning, brannklasse..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-[#dcdad0] focus:outline-none focus:border-[#5A5A40]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#dcdad0] text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] font-bold text-gray-600">Kategori:</span>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-transparent font-medium text-[#2c2c24] focus:outline-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] bg-[#fbfbf8] px-3 py-1.5 rounded-xl border border-[#dcdad0]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span className="text-[11px] font-medium">
                Sortert: <strong className="font-semibold">{
                  sortField === 'name' ? 'Materialnavn' :
                  sortField === 'category' ? 'Kategori' :
                  sortField === 'trl' ? 'TRL' :
                  sortField === 'gwp' ? 'GWP (CO₂)' :
                  sortField === 'strength' ? 'Styrke' : 'Resirkulert'
                }</strong> ({sortOrder === 'asc' ? 'stigende ↑' : 'synkende ↓'})
              </span>
            </div>

            <div className="text-xs text-gray-600 bg-white px-3 py-1.5 rounded-xl border border-[#dcdad0] flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>
                Viser <strong>{filteredMaterials.length}</strong> av {materials.length} materialer
              </span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#f0eee4] text-[#2c2c24] sticky top-0 z-10 border-b border-[#dedccf] select-none text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-[#5A5A40] hover:text-black flex items-center justify-center"
                    title="Velg alle synlige rader"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredMaterials.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Materialnavn</span>
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('category')}
                  className="py-2.5 px-3 cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Kategori</span>
                    {sortField === 'category' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('trl')}
                  className="py-2.5 px-3 text-center cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>TRL</span>
                    {sortField === 'trl' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('gwp')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>GWP (kg CO₂ eq)</span>
                    {sortField === 'gwp' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('strength')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Styrke (MPa)</span>
                    {sortField === 'strength' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Brannklasse</th>
                <th
                  onClick={() => toggleSort('recycled')}
                  className="py-2.5 px-3 text-center cursor-pointer hover:bg-[#e6e4d8] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Resirk. %</span>
                    {sortField === 'recycled' ? (
                      sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-[#5A5A40]" /> : <ArrowDown className="w-3 h-3 text-[#5A5A40]" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-60" />
                    )}
                  </div>
                </th>
                <th className="py-2.5 px-3">Ansvarlig Forsker</th>
                <th className="py-2.5 px-3 text-center">Sertifisering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeede6]">
              <AnimatePresence initial={false} mode="sync">
                {sortedMaterials.length === 0 ? (
                  <motion.tr
                    key="empty-state"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <td colSpan={10} className="py-12 text-center text-gray-400 italic">
                      Ingen materialer matcher gjeldende filtre.
                    </td>
                  </motion.tr>
                ) : (
                  sortedMaterials.map((mat, index) => {
                    const isSelected = selectedIds.includes(mat.id);
                    const owner = mat.ownerId ? researcherMap.get(mat.ownerId) : undefined;
                    const isCarbonNegative = mat.epd?.gwp !== undefined && mat.epd.gwp < 0;

                    return (
                      <motion.tr
                        key={`row-${mat.id}-${sortField}-${sortOrder}-${categoryFilter}-${searchTerm}`}
                        layout="position"
                        initial={{ opacity: 0, x: -12, scale: 0.99 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.99 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                          delay: Math.min(index * 0.02, 0.24),
                        }}
                        className={`hover:bg-[#f7f6f0] transition-colors ${
                          isSelected ? 'bg-emerald-50/60' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(mat.id)}
                            className="cursor-pointer text-[#5A5A40] hover:text-black flex items-center justify-center"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3">
                          <div
                            className="font-bold text-[#2c2c24] hover:text-emerald-800 cursor-pointer flex items-center gap-1.5"
                            onClick={() => {
                              if (onSelectMaterial) {
                                onSelectMaterial(mat.id);
                                onClose();
                              }
                            }}
                            title="Klikk for å åpne materialprofil"
                          >
                            <span>{mat.name}</span>
                            {isCarbonNegative && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                                Carbon-Neg
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">{mat.id}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="bg-[#eeede6] text-[#2c2c24] px-2 py-0.5 rounded-md text-[10.5px] font-medium">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-bold bg-[#f4f3ec] border border-[#e2e1d5] px-1.5 py-0.5 rounded text-[11px]">
                            TRL {mat.trl}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold">
                          <span className={isCarbonNegative ? 'text-emerald-700' : 'text-amber-800'}>
                            {mat.epd?.gwp !== undefined ? `${mat.epd.gwp}` : '-'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#5A5A40]">
                          {mat.testResults?.strengthMpa !== undefined ? `${mat.testResults.strengthMpa} MPa` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="bg-[#f0eee4] text-[#2c2c24] px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {mat.testResults?.fireRating || 'Ikke testet'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          {mat.epd?.recycledContent !== undefined ? `${mat.epd.recycledContent}%` : '-'}
                        </td>
                        <td className="py-2.5 px-3">
                          {owner ? (
                            <div className="text-[11px] font-medium text-[#2c2c24]">
                              {owner.name}
                              <span className="block text-[9.5px] text-gray-400">{owner.title}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">Ikke allokert</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {mat.provenTesting?.badgeLevel ? (
                            <span
                              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                mat.provenTesting.badgeLevel === 'Emerald'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : mat.provenTesting.badgeLevel === 'Platinum'
                                  ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {mat.provenTesting.badgeLevel}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">-</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer / Export Configuration Section */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#e2e1d5] flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          {/* Export Scopes & Format */}
          <div className="flex flex-wrap items-center gap-4 text-xs w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2c2c24]">Eksporter:</span>
              <div className="flex bg-[#eeede6] p-0.5 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setExportScope('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    exportScope === 'all' ? 'bg-white text-[#2c2c24] shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Alle ({materials.length})
                </button>
                <button
                  type="button"
                  onClick={() => setExportScope('filtered')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    exportScope === 'filtered' ? 'bg-white text-[#2c2c24] shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Filtrerte ({filteredMaterials.length})
                </button>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => setExportScope('selected')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-40 ${
                    exportScope === 'selected' ? 'bg-white text-emerald-800 shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Valgte ({selectedIds.length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-[#2c2c24]">Format:</span>
              <select
                value={delimiterChoice}
                onChange={e => setDelimiterChoice(e.target.value as any)}
                className="bg-[#eeede6] border border-[#dcdad0] text-xs font-semibold py-1 px-2.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value=";">Excel Norsk (Semikolon ';' & desimalkomma - Anbefalt)</option>
                <option value=",">Standard CSV (Komma ',' - Python/Pandas/R)</option>
                <option value="&#9;">Tab-separert TSV (Klipp og lim)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              type="button"
              id="btn-copy-table-data"
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-xl border border-[#dcdad0] bg-[#f7f6f0] hover:bg-[#eeede6] text-[#2c2c24] transition-all cursor-pointer shadow-2xs"
              title="Kopier hele tabellen til utklippstavlen for direkte innliming i Excel eller Sheets"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
              <span>{copied ? 'Kopiert til utklippstavle!' : 'Kopier tabell'}</span>
            </button>

            <button
              type="button"
              id="btn-download-csv-file"
              onClick={handleDownload}
              className="flex items-center gap-2 text-xs font-bold py-2 px-4.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-sm"
              title="Generer og last ned komplett .CSV-fil med alle tekniske data og EPD-verdier"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Lastet ned! ({targetExportCount} rader)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Last ned CSV ({targetExportCount} materialer)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
