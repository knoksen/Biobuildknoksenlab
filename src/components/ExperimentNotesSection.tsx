import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  Trash2,
  Clock,
  User,
  Tag,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Filter,
  Calendar,
  PenTool,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { ExperimentNote } from '../types';

interface ExperimentNotesSectionProps {
  experimentId: string;
  experimentTitle: string;
  notes?: ExperimentNote[];
  isCompleted?: boolean;
  onAddNote: (expId: string, note: Omit<ExperimentNote, 'id'>) => void;
  onDeleteNote: (expId: string, noteId: string) => void;
  className?: string;
}

const CATEGORY_COLORS: Record<ExperimentNote['category'], { bg: string; text: string; border: string; dot: string }> = {
  'Observasjon': {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-600'
  },
  'Måling & Prøving': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600'
  },
  'Miljø & Klima': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    dot: 'bg-cyan-600'
  },
  'Avvik / Anomali': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-600'
  },
  'Metodejustering': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-600'
  }
};

const CATEGORIES: ExperimentNote['category'][] = [
  'Observasjon',
  'Måling & Prøving',
  'Miljø & Klima',
  'Avvik / Anomali',
  'Metodejustering'
];

export const ExperimentNotesSection: React.FC<ExperimentNotesSectionProps> = ({
  experimentId,
  experimentTitle,
  notes = [],
  isCompleted = false,
  onAddNote,
  onDeleteNote,
  className = ''
}) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [author, setAuthor] = useState('Dr. L. Vinterberg (Lab)');
  const [category, setCategory] = useState<ExperimentNote['category']>('Observasjon');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Filter & Search states for the history stream
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('alle');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Handle adding tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Submit note
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteContent.trim()) return;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeFormatted = now.toLocaleTimeString('no-NO', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const timestamp = `${dateFormatted} kl. ${timeFormatted}`;

    onAddNote(experimentId, {
      content: noteContent.trim(),
      author: author.trim() || 'Labforsker',
      category,
      timestamp,
      tags: tags.length > 0 ? tags : undefined
    });

    // Reset composer form
    setNoteContent('');
    setTags([]);
    setTagInput('');
    setIsComposerOpen(false);
  };

  // Copy note to clipboard
  const handleCopyNote = (note: ExperimentNote) => {
    const textToCopy = `[${note.timestamp}] [${note.category}] (${note.author}):\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let list = [...notes];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(n =>
        n.content.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (selectedFilterCategory !== 'alle') {
      list = list.filter(n => n.category === selectedFilterCategory);
    }

    // Sort order (notes have timestamps e.g. "19.09.2026 kl. 14:30")
    list.sort((a, b) => {
      // Compare by order if newer ones were prepended or parse
      if (sortOrder === 'desc') {
        return b.timestamp.localeCompare(a.timestamp);
      } else {
        return a.timestamp.localeCompare(b.timestamp);
      }
    });

    return list;
  }, [notes, searchQuery, selectedFilterCategory, sortOrder]);

  return (
    <div id={`experiment-notes-${experimentId}`} className={`mt-4 pt-4 border-t border-[#f0f0e8] space-y-3 ${className}`}>
      {/* Header bar of notes section */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[#5A5A40]/10 text-[#5A5A40]">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] uppercase font-bold text-gray-700 tracking-wider">
            Laboratorieobservasjoner & Forskningsnotater
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f0efe6] text-[#5A5A40]">
            {notes.length} {notes.length === 1 ? 'notat' : 'notater'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsComposerOpen(prev => !prev)}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all shadow-2xs ${
              isComposerOpen
                ? 'bg-stone-100 text-stone-800 border-[#5A5A40]/40'
                : 'bg-white text-[#5A5A40] border-[#dcdad0] hover:bg-[#fcfcf9] hover:border-[#5A5A40]'
            }`}
          >
            {isComposerOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Lukk skjema</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Ny observasjon</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Composer for writing new observation note */}
      <AnimatePresence>
        {isComposerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-4 border border-[#5A5A40]/30 shadow-xs space-y-3 mt-1"
            >
              <div className="flex items-center justify-between border-b border-[#f0f0e8] pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <PenTool className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Loggfør laboratorieobservasjon for "{experimentTitle}"</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">
                  Tidsstempel genereres automatisk
                </span>
              </div>

              {/* Main text area */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">
                  Observasjonstekst / Forskningsnotat:
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                  rows={3}
                  placeholder="Skriv utfyllende observasjoner, mikroskopfunn, krystalliseringsmønster, fuktvandring, avvik fra testprotokoll eller herdereaksjoner..."
                  className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-xl p-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5A5A40] focus:border-[#5A5A40] resize-y"
                  autoFocus
                />
              </div>

              {/* Metadata row: Category, Author, and Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                {/* Category picker */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    Kategori:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExperimentNote['category'])}
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#5A5A40]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author input */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Forsker / Labansvarlig:
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ditt navn / tittel"
                    className="w-full bg-[#fcfcf9] border border-[#dcdad0] rounded-lg px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Tags input */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Nøkkelord / Emneknagger (valgfritt):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Legg til tag (f.eks. SEM, 20°C, kapillærsug)..."
                    className="flex-1 bg-[#fcfcf9] border border-[#dcdad0] rounded-lg px-2.5 py-1 text-xs text-gray-800 focus:outline-none focus:border-[#5A5A40]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    Legg til
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 font-bold ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f0f0e8]">
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  Trykk <kbd className="px-1 py-0.5 bg-stone-100 rounded border border-stone-300 font-mono">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-stone-100 rounded border border-stone-300 font-mono">Enter</kbd> for å lagre
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 rounded-lg"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={!noteContent.trim()}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      noteContent.trim()
                        ? 'bg-[#5A5A40] text-white hover:bg-[#484833] shadow-2xs'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lagre observasjon</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and search toolbar when there are multiple notes */}
      {notes.length > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 pb-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk i laboratorienotater..."
              className="w-full pl-8 pr-2.5 py-1 text-[11px] bg-white border border-[#dcdad0] rounded-lg focus:outline-none focus:border-[#5A5A40]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
            <button
              onClick={() => setSelectedFilterCategory('alle')}
              className={`px-2 py-0.5 rounded-md font-medium border transition-colors ${
                selectedFilterCategory === 'alle'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-stone-50'
              }`}
            >
              Alle ({notes.length})
            </button>
            {CATEGORIES.map(cat => {
              const count = notes.filter(n => n.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md font-medium border transition-colors ${
                    selectedFilterCategory === cat
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-stone-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Timestamped History Stream */}
      {filteredNotes.length === 0 ? (
        <div className="bg-[#fcfcf9] rounded-xl p-4 text-center border border-dashed border-[#e2e1d5] text-gray-500 text-xs">
          {notes.length === 0 ? (
            <div className="space-y-1 py-1">
              <p className="font-serif italic text-gray-700">
                Ingen utfyllende laboratorieobservasjoner er lagret for dette forsøket ennå.
              </p>
              <p className="text-[11px] text-gray-400">
                Klikk på <span className="font-semibold text-[#5A5A40]">«Ny observasjon»</span> for å loggføre mikroskopering, herdereaksjoner eller avvik med automatisk tidsstempel.
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Ingen notater matchet søkekriteriene dine.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotes.map((note, nIdx) => {
            const catStyle = CATEGORY_COLORS[note.category] || CATEGORY_COLORS['Observasjon'];
            const isCopied = copiedNoteId === note.id;

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: nIdx * 0.04 }}
                className="bg-white rounded-xl p-3.5 border border-[#eeede6] hover:border-[#5A5A40]/30 shadow-2xs hover:shadow-xs transition-all space-y-2 group"
              >
                {/* Note header: Category, Timestamp, Author, and Action buttons */}
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category badge */}
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`}></span>
                      {note.category}
                    </span>

                    {/* Timestamp with clock icon */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {note.timestamp}
                    </span>

                    {/* Author tag */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded">
                      <User className="w-3 h-3 text-stone-400" />
                      {note.author}
                    </span>
                  </div>

                  {/* Actions: Copy & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyNote(note)}
                      title="Kopier notat til utklippstavle"
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-stone-100 rounded transition-colors"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Er du sikker på at du vil slette dette laboratorienotatet?')) {
                          onDeleteNote(experimentId, note.id);
                        }
                      }}
                      title="Slett notat"
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note body text */}
                <div className="text-xs text-gray-800 font-sans leading-relaxed whitespace-pre-wrap pl-0.5">
                  {note.content}
                </div>

                {/* Optional tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] text-gray-500 bg-stone-50 border border-stone-200 px-1.5 py-0.5 rounded font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExperimentNotesSection;
