import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { GoogleGenAI, Type, buildRequest, contentsToMessages, loadLocalAiConfig } from './localGenAI';

let lastBody: any = null;
let reply: { status: number; body: any } = { status: 200, body: {} };
const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    lastBody = JSON.parse(raw || '{}');
    res.writeHead(reply.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reply.body));
  });
});
server.listen(0, '127.0.0.1');
await new Promise<void>((r) => server.once('listening', () => r()));
after(() => server.close());
const cfg = { baseUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`, model: 'qwen3.5:4b', visionModel: 'gemma4:26b', timeoutMs: 5000 };
const ai = new GoogleGenAI(undefined, cfg);
const ok = (content: string) => ({ status: 200, body: { choices: [{ message: { content }, finish_reason: 'stop' }] } });

test('defaults: local Ollama, no Gemini key needed', () => {
  const c = loadLocalAiConfig({} as any);
  assert.equal(c.baseUrl, 'http://127.0.0.1:11434/v1');
  assert.equal(c.visionModel, c.model);
});

test('JSON schema request returns parsed-ready JSON text', async () => {
  reply = ok('```json\n{"name":"Mycelium panel"}\n```');
  const r = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: 'Profile mycelium',
    config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } } },
  });
  assert.deepEqual(JSON.parse(r.text), { name: 'Mycelium panel' });
  assert.equal(lastBody.model, 'qwen3.5:4b');
  assert.equal(lastBody.response_format.json_schema.schema.type, 'object');
});

test('images go to the vision model as data URIs', async () => {
  reply = ok('looks like mould');
  const r = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: { parts: [{ inlineData: { mimeType: 'image/png', data: 'AAAA' } }, { text: 'what is this?' }] },
  });
  assert.equal(r.text, 'looks like mould');
  assert.equal(lastBody.model, 'gemma4:26b');
  const content = lastBody.messages[0].content;
  assert.equal(content[0].type, 'image_url');
  assert.equal(content[0].image_url.url, 'data:image/png;base64,AAAA');
});

test('system instruction becomes the system message', () => {
  const { body } = buildRequest({ contents: 'hei', config: { systemInstruction: 'Du er BioBuild AI' } }, cfg);
  assert.deepEqual((body.messages as any[])[0], { role: 'system', content: 'Du er BioBuild AI' });
});

test('flat part list is one user message', () => {
  assert.deepEqual(contentsToMessages(['a', { text: 'b' }]), [{ role: 'user', content: 'a\nb' }]);
});

test('offline AI throws so routes use their rule-based fallback', async () => {
  const offline = new GoogleGenAI(undefined, { ...cfg, baseUrl: 'http://127.0.0.1:9/v1' });
  await assert.rejects(offline.models.generateContent({ contents: 'x' }), /not reachable/);
});

test('upstream error is reported', async () => {
  reply = { status: 404, body: { error: 'model not found' } };
  await assert.rejects(ai.models.generateContent({ contents: 'x' }), /404/);
});

test('JSON requested but prose returned -> error, so the rule-based fallback runs', async () => {
  reply = ok('Sorry, I cannot do that.');
  await assert.rejects(ai.models.generateContent({ contents: 'x', config: { responseMimeType: 'application/json' } }), /did not return JSON/);
});

test('modelVersion names the local model that answered', async () => {
  reply = ok('hi');
  assert.equal((await ai.models.generateContent({ model: 'gemini-3.8-flash', contents: 'x' })).modelVersion, 'qwen3.5:4b');
});
