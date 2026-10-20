import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  Key,
  FolderPlus,
  Send,
  Sparkles,
  Copy,
  Check,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { BioMaterial } from '../types';

interface NotionSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMaterial?: BioMaterial | null;
  allMaterials: BioMaterial[];
}

interface NotionConfig {
  apiKey: string;
  databaseId: string;
  workspaceName?: string;
  botName?: string;
}

interface SyncLogItem {
  id: string;
  timestamp: string;
  materialName: string;
  status: 'success' | 'error' | 'pending';
  notionUrl?: string;
  message: string;
}

export const NotionSyncModal: React.FC<NotionSyncModalProps> = ({
  isOpen,
  onClose,
  activeMaterial,
  allMaterials
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [databaseId, setDatabaseId] = useState<string>('');
  const [parentPageId, setParentPageId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [botInfo, setBotInfo] = useState<{ name?: string; workspace?: string } | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testError, setTestError] = useState<string | null>(null);

  const [availableDatabases, setAvailableDatabases] = useState<Array<{ id: string; title: string; url: string }>>([]);
  const [isSearchingDbs, setIsSearchingDbs] = useState<boolean>(false);

  const [isSyncingCurrent, setIsSyncingCurrent] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [isCreatingDatabase, setIsCreatingDatabase] = useState<boolean>(false);

  const [syncLogs, setSyncLogs] = useState<SyncLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'sync' | 'config' | 'guide'>('sync');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load configuration from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biobuild_notion_config');
      if (saved) {
        const parsed: NotionConfig = JSON.parse(saved);
        if (parsed.databaseId) setDatabaseId(parsed.databaseId);
        if (parsed.botName || parsed.workspaceName) {
          setBotInfo({ name: parsed.botName, workspace: parsed.workspaceName });
          setIsConnected(true);
        }
      }
    } catch (e) {
      console.warn('Could not read notion config from localStorage', e);
    }
  }, []);

  const saveConfig = (newApiKey: string, newDbId: string, bot?: { name?: string; workspace?: string }) => {
    try {
      const cfg: NotionConfig = {
        databaseId: newDbId,
        botName: bot?.name,
        workspaceName: bot?.workspace
      };
      localStorage.setItem('biobuild_notion_config', JSON.stringify(cfg));
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestError('Vennligst oppgi en Notion API-nøkkel (Internal Integration Secret, f.eks. secret_...)');
      return;
    }

    setIsTesting(true);
    setTestError(null);

    try {
      const res = await fetch('/api/notion/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Feil ved tilkobling til Notion API');
      }

      setIsConnected(true);
      const info = { name: data.botName || 'BioBuild Integration', workspace: data.workspaceName || 'Notion Workspace' };
      setBotInfo(info);
      saveConfig(apiKey.trim(), databaseId.trim(), info);

      // Auto search databases
      handleSearchDatabases(apiKey.trim());
    } catch (err: any) {
      setIsConnected(false);
      setTestError(err.message || 'Kunne ikke koble til Notion');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSearchDatabases = async (keyToUse = apiKey) => {
    if (!keyToUse.trim()) return;
    setIsSearchingDbs(true);
    try {
      const res = await fetch('/api/notion/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyToUse.trim() })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.databases)) {
        setAvailableDatabases(data.databases);
        if (!databaseId && data.databases.length > 0) {
          setDatabaseId(data.databases[0].id);
          saveConfig(keyToUse.trim(), data.databases[0].id, botInfo || undefined);
        }
      }
    } catch (err) {
      console.error('Error searching Notion databases', err);
    } finally {
      setIsSearchingDbs(false);
    }
  };

  const handleCreateDatabase = async () => {
    if (!apiKey.trim()) {
      setTestError('Oppgi API-nøkkel først.');
      return;
    }
    if (!parentPageId.trim()) {
      setTestError('Vennligst oppgi ID eller URL til en overordnet Notion-side hvor databasen skal opprettes.');
      return;
    }

    setIsCreatingDatabase(true);
    setTestError(null);

    try {
      const res = await fetch('/api/notion/create-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          parentPageId: parentPageId.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Kunne ikke opprette Notion-database');
      }

      setDatabaseId(data.database.id);
      saveConfig(apiKey.trim(), data.database.id, botInfo || undefined);

      setSyncLogs((prev) => [
        {
          id: `db-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('nb-NO'),
          materialName: 'Opprettet BioBuild Database',
          status: 'success',
          notionUrl: data.database.url,
          message: `Ny database opprettet: "${data.database.title}" med ferdige EPD-, TRL- og testkolonner!`
        },
        ...prev
      ]);

      handleSearchDatabases(apiKey.trim());
    } catch (err: any) {
      setTestError(err.message || 'Feil ved opprettelse av database');
    } finally {
      setIsCreatingDatabase(false);
    }
  };

  const handleSyncSingleMaterial = async (mat: BioMaterial) => {
    if (!apiKey.trim()) {
      setActiveTab('config');
      setTestError('Vennligst konfigurer Notion API-nøkkel først.');
      return;
    }

    setIsSyncingCurrent(true);
    const logId = `sync-${Date.now()}`;

    setSyncLogs((prev) => [
      {
        id: logId,
        timestamp: new Date().toLocaleTimeString('nb-NO'),
        materialName: mat.name,
        status: 'pending',
        message: 'Sender vitenskapelige EPD- og testdata til Notion...'
      },
      ...prev
    ]);

    try {
      const res = await fetch('/api/notion/sync-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          databaseId: databaseId.trim() || undefined,
          material: mat
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Kunne ikke synkronisere med Notion');
      }

      setSyncLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? {
                ...log,
                status: 'success',
                notionUrl: data.url,
                message: `Vellykket synkronisert! EPD GWP (${mat.epd?.gwp} kg CO₂e), TRL ${mat.trl}, og lab-notater lagt til.`
              }
            : log
        )
      );
    } catch (err: any) {
      setSyncLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? {
                ...log,
                status: 'error',
                message: err.message || 'Feil under synkronisering'
              }
            : log
        )
      );
    } finally {
      setIsSyncingCurrent(false);
    }
  };

  const handleSyncAllMaterials = async () => {
    if (!apiKey.trim()) {
      setActiveTab('config');
      setTestError('Vennligst konfigurer Notion API-nøkkel først.');
      return;
    }

    setIsSyncingAll(true);

    for (const mat of allMaterials) {
      await handleSyncSingleMaterial(mat);
      // Small pause to respect Notion rate limits (3 requests/sec)
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsSyncingAll(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/30">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Notion Integration & Synkronisering</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.2 REST
                </span>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Tilkoblet {botInfo?.workspace ? `(${botInfo.workspace})` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Eksporter og toveis-synkroniser bio-materialer, EPD-analyser, og merkelapp-observasjoner til ditt Notion Workspace.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'sync'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Synkronisering & Eksport
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'config'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Tilkobling & API-nøkkel
            {!isConnected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            1-2-3 Oppsettsguide
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SYNC & EXPORT */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {!isConnected && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200">
                    <p className="font-semibold text-amber-300">Notion er ikke tilkoblet ennå</p>
                    <p className="mt-1">
                      Gå til fanen <strong>Tilkobling & API-nøkkel</strong> og legg inn din Notion Integration Token (eller opprett en gratis på under 1 minutt).
                    </p>
                  </div>
                </div>
              )}

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Material Sync */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        Gjeldende Materiale
                      </span>
                      {activeMaterial && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 text-slate-300 font-mono">
                          TRL {activeMaterial.trl}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      {activeMaterial ? activeMaterial.name : 'Ingen materiale valgt'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {activeMaterial?.description || 'Velg et materiale fra listen for å eksportere full profil.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Inkluderer EPD ({activeMaterial?.epd?.gwp} kg CO₂e) & lab-notater
                    </div>
                    <button
                      onClick={() => activeMaterial && handleSyncSingleMaterial(activeMaterial)}
                      disabled={!activeMaterial || isSyncingCurrent}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      {isSyncingCurrent ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Synkroniserer...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Synkroniser til Notion
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bulk All Materials Sync */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                        Massesynkronisering
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono">
                        {allMaterials.length} materialer
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100">Hele BioBuild Materialregister</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Eksporter alle {allMaterials.length} bio-baserte materialer, EPD-verdier, brannklasser og ISO-akkrediteringer til en samlet Notion-database.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Auto-mapper kolonner og tags
                    </div>
                    <button
                      onClick={handleSyncAllMaterials}
                      disabled={isSyncingAll || allMaterials.length === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      {isSyncingAll ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Synkroniserer ({allMaterials.length})...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Synkroniser Alle ({allMaterials.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Target Database Selection / Display */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      Mål-database i Notion
                    </h4>
                  </div>
                  {databaseId && (
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {databaseId.slice(0, 8)}...{databaseId.slice(-6)}
                    </span>
                  )}
                </div>

                {availableDatabases.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Velg en delt database i ditt Notion Workspace:</label>
                    <select
                      value={databaseId}
                      onChange={(e) => {
                        setDatabaseId(e.target.value);
                        saveConfig(apiKey, e.target.value, botInfo || undefined);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">-- Velg eksisterende Notion Database --</option>
                      {availableDatabases.map((db) => (
                        <option key={db.id} value={db.id}>
                          {db.title} ({db.id.slice(0, 6)}...)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>
                      {databaseId
                        ? 'En spesifikk database-ID er konfigurert. Materialene opprettes som sider i denne databasen.'
                        : 'Ingen database valgt. Materialer opprettes som egne sider i Notion workspace eller du kan velge database under Tilkobling.'}
                    </span>
                    <button
                      onClick={() => handleSearchDatabases()}
                      disabled={isSearchingDbs || !apiKey}
                      className="px-2.5 py-1 text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 rounded border border-indigo-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSearchingDbs ? 'animate-spin' : ''}`} />
                      Søk etter databaser
                    </button>
                  </div>
                )}
              </div>

              {/* Sync Activity Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Aktivitetslogg for Notion-synkronisering
                </h4>
                {syncLogs.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    Ingen synkroniseringer utført i denne økten. Klikk på en av knappene over for å sende data.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {syncLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-start justify-between text-xs gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                          {log.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                          {log.status === 'pending' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-200">{log.materialName}</span>
                              <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">{log.message}</p>
                          </div>
                        </div>

                        {log.notionUrl && (
                          <a
                            href={log.notionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline shrink-0 font-medium"
                          >
                            Åpne i Notion
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-200">Notion API Tilkobling</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Notion Internal Integration Token (Secret)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting || !apiKey.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                      Test tilkobling
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hentes fra <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">notion.so/my-integrations <ExternalLink className="w-2.5 h-2.5" /></a>
                  </p>
                </div>

                {testError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{testError}</span>
                  </div>
                )}

                {isConnected && botInfo && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Tilkoblet Notion som <strong>{botInfo.name}</strong> i workspace <strong>{botInfo.workspace}</strong>!
                    </span>
                  </div>
                )}
              </div>

              {/* Database Auto-Creator or Selector */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-200">Automatisk opprettelse av BioBuild-database</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Vil du at BioBuild skal opprette en skreddersydd database med alle kolonner (Navn, Kategori, TRL, EPD GWP, Brannklasse, Trykkfasthet, osv.) automatisk i ditt Notion?
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Overordnet side i Notion (Parent Page ID eller URL)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={parentPageId}
                      onChange={(e) => setParentPageId(e.target.value)}
                      placeholder="F.eks. https://notion.so/workspace/Mitt-Prosjekt-32tegnsId eller ren ID"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={handleCreateDatabase}
                      disabled={isCreatingDatabase || !apiKey || !parentPageId.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isCreatingDatabase ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FolderPlus className="w-3.5 h-3.5" />}
                      Opprett Database i Notion
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Husk å dele siden med din Notion-integrasjon (via <strong>··· → Connect to</strong> i Notion).
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Eller angi Database-ID manuelt
                  </label>
                  <input
                    type="text"
                    value={databaseId}
                    onChange={(e) => {
                      setDatabaseId(e.target.value);
                      saveConfig(apiKey, e.target.value, botInfo || undefined);
                    }}
                    placeholder="32-sifret database-ID (fra Notion URL)"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/70 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Slik kobler du BioBuild til Notion på 60 sekunder:
                </h3>

                <ol className="list-decimal list-inside space-y-3 pl-1 text-slate-300">
                  <li className="leading-relaxed">
                    <strong className="text-white">Opprett en intern integrasjon i Notion:</strong>
                    <div className="mt-1 pl-4 text-slate-400">
                      Gå til <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">notion.so/my-integrations</a>, klikk <strong>New integration</strong>, gi den navnet <em>BioBuild Lab</em>, og kopier tokenet som starter med <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">secret_...</code>.
                    </div>
                  </li>

                  <li className="leading-relaxed">
                    <strong className="text-white">Del siden eller databasen din med integrasjonen:</strong>
                    <div className="mt-1 pl-4 text-slate-400">
                      Åpne siden eller databasen i Notion, klikk på de tre prikkene <strong>···</strong> øverst til høyre, velg <strong>Connect to</strong> (eller <em>Add connections</em>), og velg <em>BioBuild Lab</em>.
                    </div>
                  </li>

                  <li className="leading-relaxed">
                    <strong className="text-white">Lim inn tokenet i BioBuild:</strong>
                    <div className="mt-1 pl-4 text-slate-400">
                      Gå til fanen <strong>Tilkobling & API-nøkkel</strong>, lim inn hemmeligheten, og klikk <strong>Test tilkobling</strong>. Alt lagres lokalt i nettleseren din.
                    </div>
                  </li>

                  <li className="leading-relaxed">
                    <strong className="text-white">Klar til synkronisering!</strong>
                    <div className="mt-1 pl-4 text-slate-400">
                      Nå kan du eksportere materialer, EPD GWP-beregninger, testresultater og mikroskop-annoteringer direkte med 1 klikk.
                    </div>
                  </li>
                </ol>
              </div>

              {/* Sample Payload Preview */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    Eksempel på felter som overføres til Notion:
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(
                          {
                            Name: activeMaterial?.name || 'Mycelium-Hamp Kompositt',
                            Category: activeMaterial?.category || 'Mykologiske',
                            TRL: activeMaterial?.trl || 8,
                            'EPD GWP (kg CO2e/kg)': activeMaterial?.epd?.gwp || -1.85,
                            'Fire Class': activeMaterial?.testResults?.fireRating || 'B-s1, d0',
                            'Strength (MPa)': activeMaterial?.testResults?.strengthMpa || 1.4,
                            Accreditation: activeMaterial?.provenTesting?.accreditationNumber || 'SINTEF-BIO-2025-089'
                          },
                          null,
                          2
                        ),
                        'sample-json'
                      )
                    }
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'sample-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Kopier JSON-skjema
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-emerald-400 bg-slate-900/90 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`{
  "Title": "${activeMaterial?.name || 'Mycelium-Hamp Kompositt'}",
  "Category": "${activeMaterial?.category || 'Mykologiske'}",
  "TRL": ${activeMaterial?.trl || 8},
  "EPD GWP": ${activeMaterial?.epd?.gwp || -1.85} kg CO₂e/kg,
  "Fire Class": "${activeMaterial?.testResults?.fireRating || 'B-s1, d0'}",
  "Compressive Strength": "${activeMaterial?.testResults?.strengthMpa || 1.4} MPa",
  "Accreditation": "${activeMaterial?.provenTesting?.accreditationNumber || 'SINTEF-BIO-2025-089'}",
  "Blocks": ["Sammendrag", "Biologisk sammensetning", "Forskingshypoteser", "Defekt-annoteringer"]
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-800/80 border-t border-slate-700 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Notion API v1 • Sikker klientoverføring uten skylagring av nøkler</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors cursor-pointer"
            >
              Lukk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
