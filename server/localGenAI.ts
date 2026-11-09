/**
 * Jarle Local AI drop-in for the subset of @google/genai that server.ts uses:
 *   new GoogleGenAI(opts).models.generateContent({ model, contents, config }) -> { text }
 *   Type.OBJECT / Type.STRING / ...
 *
 * Calls an OpenAI-compatible /chat/completions endpoint (Ollama or the Jarle Local AI
 * gateway). Configuration is server-side only:
 *   AI_BASE_URL       incl. /v1 (default http://127.0.0.1:11434/v1; on the VPS the
 *                     existing SSH tunnel exposes the PC's Ollama as http://127.0.0.1:11436/v1)
 *   AI_MODEL          text model (default qwen3.5:4b)
 *   AI_VISION_MODEL   model used when a request contains images (default AI_MODEL;
 *                     must be a vision-capable model, e.g. gemma4 or a qwen-vl model)
 *   AI_API_KEY        optional bearer token
 *   AI_TIMEOUT_MS     default 120000
 * Gemini model names sent by callers are ignored on purpose.
 */

export const Type = {
  TYPE_UNSPECIFIED: 'TYPE_UNSPECIFIED',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
  NULL: 'NULL',
} as const;

export interface LocalAiConfig {
  baseUrl: string;
  model: string;
  visionModel: string;
  apiKey?: string;
  timeoutMs: number;
}

export function loadLocalAiConfig(env: NodeJS.ProcessEnv = process.env): LocalAiConfig {
  const model = env.AI_MODEL || 'qwen3.5:4b';
  return {
    baseUrl: (env.AI_BASE_URL || 'http://127.0.0.1:11434/v1').replace(/\/+$/, ''),
    model,
    visionModel: env.AI_VISION_MODEL || model,
    apiKey: env.AI_API_KEY || undefined,
    timeoutMs: Number(env.AI_TIMEOUT_MS) || 120_000,
  };
}

type OAContent = string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;
export interface OAMessage { role: 'system' | 'user' | 'assistant'; content: OAContent }

function partToOA(p: any): { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } } | null {
  if (typeof p === 'string') return { type: 'text', text: p };
  if (p && typeof p.text === 'string') return { type: 'text', text: p.text };
  if (p?.inlineData?.data && p.inlineData.mimeType) {
    return { type: 'image_url', image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } };
  }
  return null;
}

function toContent(parts: any[]): OAContent {
  const items = parts.map(partToOA).filter(Boolean) as any[];
  if (items.every((i) => i.type === 'text')) return items.map((i) => i.text).join('\n');
  return items;
}

/** Gemini contents -> OpenAI messages (images become image_url data URIs). */
export function contentsToMessages(contents: any): OAMessage[] {
  if (contents == null) return [];
  if (typeof contents === 'string') return [{ role: 'user', content: contents }];
  if (!Array.isArray(contents)) contents = [contents];
  // A flat list of parts (strings / {text} / {inlineData}) is one user message.
  if ((contents as any[]).every((c) => typeof c === 'string' || (c && !('parts' in c) && !('role' in c)))) {
    return [{ role: 'user', content: toContent(contents) }];
  }
  const out: OAMessage[] = [];
  for (const c of contents as any[]) {
    if (typeof c === 'string') { out.push({ role: 'user', content: c }); continue; }
    const parts = Array.isArray(c?.parts) ? c.parts : [c];
    const content = toContent(parts);
    if (content === '' || (Array.isArray(content) && content.length === 0)) continue;
    out.push({ role: c?.role === 'model' ? 'assistant' : 'user', content });
  }
  return out;
}

export function systemInstructionText(si: any): string {
  if (!si) return '';
  if (typeof si === 'string') return si;
  const parts = Array.isArray(si) ? si : Array.isArray(si.parts) ? si.parts : [si];
  return parts.map((p: any) => (typeof p === 'string' ? p : p?.text || '')).filter(Boolean).join('\n');
}

export function geminiSchemaToJsonSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;
  if (Array.isArray(schema)) return schema.map(geminiSchemaToJsonSchema);
  const out: any = {};
  for (const [k, v] of Object.entries(schema)) {
    if (k === 'type' && typeof v === 'string') out.type = v.toLowerCase();
    else if (k === 'properties' && v && typeof v === 'object') {
      out.properties = Object.fromEntries(Object.entries(v).map(([pk, pv]) => [pk, geminiSchemaToJsonSchema(pv)]));
    } else if (k === 'items') out.items = geminiSchemaToJsonSchema(v);
    else if (['required', 'enum', 'description', 'minItems', 'maxItems', 'minimum', 'maximum', 'format'].includes(k)) out[k] = v;
  }
  if (schema.nullable && typeof out.type === 'string') out.type = [out.type, 'null'];
  return out;
}

export function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  try { JSON.parse(candidate); return candidate; } catch { /* continue */ }
  const start = candidate.search(/[[{]/);
  const end = Math.max(candidate.lastIndexOf('}'), candidate.lastIndexOf(']'));
  if (start >= 0 && end > start) {
    const slice = candidate.slice(start, end + 1);
    try { JSON.parse(slice); return slice; } catch { /* continue */ }
  }
  return text;
}

export function buildRequest(params: { contents: any; config?: any }, cfg: LocalAiConfig) {
  const config = params.config || {};
  const messages: OAMessage[] = [];
  const system = systemInstructionText(config.systemInstruction);
  if (system) messages.push({ role: 'system', content: system });
  messages.push(...contentsToMessages(params.contents));
  const hasImage = messages.some((m) => Array.isArray(m.content) && m.content.some((c) => c.type === 'image_url'));
  const body: Record<string, unknown> = {
    model: hasImage ? cfg.visionModel : cfg.model,
    messages,
    stream: false,
    reasoning_effort: 'none',
  };
  if (typeof config.temperature === 'number') body.temperature = config.temperature;
  const wantsJson = config.responseMimeType === 'application/json';
  if (wantsJson && config.responseSchema) {
    body.response_format = { type: 'json_schema', json_schema: { name: 'response', schema: geminiSchemaToJsonSchema(config.responseSchema) } };
  } else if (wantsJson) {
    body.response_format = { type: 'json_object' };
  }
  return { body, wantsJson };
}

export class GoogleGenAI {
  private cfg: LocalAiConfig;
  constructor(_opts?: unknown, cfg: LocalAiConfig = loadLocalAiConfig(), private fetchImpl: typeof fetch = fetch) {
    this.cfg = cfg;
  }

  models = {
    generateContent: async (params: { model?: string; contents: any; config?: any }): Promise<{ text: string; modelVersion: string }> => {
      const { body, wantsJson } = buildRequest(params, this.cfg);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.cfg.apiKey) headers.Authorization = `Bearer ${this.cfg.apiKey}`;
      let res: Response;
      try {
        res = await this.fetchImpl(`${this.cfg.baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          redirect: 'error',
          signal: AbortSignal.timeout(this.cfg.timeoutMs),
        });
      } catch (e: any) {
        const why = e?.name === 'TimeoutError' ? `timed out after ${this.cfg.timeoutMs} ms` : 'is not reachable';
        throw new Error(`Jarle Local AI ${why}`);
      }
      if (!res.ok) {
        const detail = (await res.text().catch(() => '')).slice(0, 300);
        throw new Error(`Jarle Local AI returned ${res.status}${detail ? `: ${detail}` : ''}`);
      }
      const data: any = await res.json();
      const choice = data?.choices?.[0];
      const raw: string = choice?.message?.content ?? '';
      if (!raw.trim()) {
        throw new Error(`Jarle Local AI returned an empty answer${choice?.finish_reason === 'length' ? ' (cut off by context limit)' : ''}`);
      }
      return { text: wantsJson ? extractJson(raw) : raw, modelVersion: String(body.model) };
    },
  };
}
