import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dns from 'dns/promises';
import net from 'net';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = 3000;
const ALLOWED_REFERENCE_IMAGE_ORIGINS = new Set<string>([
  // Add trusted origins that are allowed to host reference images.
  // Example: 'https://images.example.com'
]);

// Initialize Google GenAI client lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Windows Desktop & Installer Info endpoint
app.get('/api/desktop/info', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'BioBuild Evidence Lab',
    version: '1.0.0',
    platform: 'win32',
    arch: ['x64', 'arm64'],
    ports: {
      appPort: PORT,
      pixelStreamingPort: 8888
    },
    installers: [
      {
        id: 'inno',
        name: 'Inno Setup 6 (.ISS -> .EXE)',
        scriptPath: 'installer/BioBuild-Installer.iss',
        outputExe: 'dist-installer/BioBuild_Evidence_Lab_Setup_v1.0.0.exe',
        command: 'ISCC.exe installer\\BioBuild-Installer.iss',
        downloadUrl: '/api/desktop/file/BioBuild-Installer.iss'
      },
      {
        id: 'nsis',
        name: 'Nullsoft Scriptable Install System (.NSI -> .EXE)',
        scriptPath: 'installer/BioBuild-Setup.nsi',
        outputExe: 'dist-installer/BioBuild_Setup.exe',
        command: 'makensis installer\\BioBuild-Setup.nsi',
        downloadUrl: '/api/desktop/file/BioBuild-Setup.nsi'
      },
      {
        id: 'batch',
        name: '1-Klikk Windows Setup (.BAT / .CMD)',
        scriptPath: 'run-win-installer.bat',
        command: '.\\run-win-installer.bat',
        downloadUrl: '/api/desktop/file/run-win-installer.bat'
      }
    ]
  });
});

// Download Windows installer scripts directly
app.get('/api/desktop/file/:filename', (req, res) => {
  const allowedFiles: Record<string, string> = {
    'run-win-installer.bat': path.join(process.cwd(), 'run-win-installer.bat'),
    'install-biobuild.cmd': path.join(process.cwd(), 'installer', 'install-biobuild.cmd'),
    'BioBuild-Installer.iss': path.join(process.cwd(), 'installer', 'BioBuild-Installer.iss'),
    'BioBuild-Setup.nsi': path.join(process.cwd(), 'installer', 'BioBuild-Setup.nsi'),
    'start-app.cmd': path.join(process.cwd(), 'start-app.cmd'),
    'make-win-exe.bat': path.join(process.cwd(), 'installer', 'make-win-exe.bat'),
  };

  const filePath = allowedFiles[req.params.filename];
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, req.params.filename);
});

// 1. Generate Material Profile
app.post('/api/gemini/generate-material', async (req, res) => {
  try {
    const { materialName, category } = req.body;
    if (!materialName) {
      return res.status(400).json({ error: 'Material name is required.' });
    }

    const ai = getAiClient();
    const prompt = `Du er en ledende forsker innen bio-arkitektur, bio-baserte materialer og regenerative byggemetoder for konseptet "Alive Houses".
Generer en fullstendig vitenskapelig materialprofil i JSON-format for materialet: "${materialName}" innen kategorien "${category || 'Annet'}".

Svar på NORSK. Vær faglig nøyaktig, realistisk og inspirerende.
Følgende felter må fylles ut i JSON:
- name: Navn på materialet
- description: En god vitenskapelig beskrivelse av materialet og dets rolle i Alive Houses (2-4 setninger)
- chemicalComposition: Kjemisk sammensetning (f.eks. hvilke molekyler, bindemidler, mineraler)
- biologicalComposition: Biologisk sammensetning (f.eks. spesifikke organismer som sopp, alger, bakterier, plantefibre)
- trl: Foreslått TRL-nivå (Technology Readiness Level) som et heltall mellom 1 og 9
- applicationAreas: Liste med 2-4 reelle bruksområder i bygg (f.eks. "Akustisk isolasjon", "Bærende konstruksjon")
- suppliers: Liste med 1-3 virkelige eller høyst sannsynlige forskningspartnere/leverandører (f.eks. "NTNU", "SINTEF", "Ecovative")
- epd: Et objekt med:
  - gwp: Global Warming Potential i kg CO2 eq per kg (bruk realistisk verdi, gjerne negativt for bio-lagring, f.eks. -1.2 eller 0.15)
  - recycledContent: Prosentandel resirkulert eller sirkulært innhold (heltall mellom 0 og 100)
  - lifetime: Forventet levetid i år (heltall)
  - circularity: En kort setning om sirkularitet (f.eks. "100% komposterbar i natur")
- testResults: Et objekt med:
  - fire: Detaljert beskrivelse av brannmotstand
  - moisture: Detaljert beskrivelse av fuktoppførsel og hygroskopiske egenskaper
  - strength: Detaljert beskrivelse av trykk/strekkfasthet
  - durability: Detaljert beskrivelse av bestandighet mot nedbrytning over tid
  - fireRating: Brannklasse (f.eks. "B-s1, d0", "A1", "D-s2, d0")
  - strengthMpa: Typisk styrke i MPa (tall)
  - durabilityYears: Forventet bestandighet i år (tall)
- healthRisk: Beskrivelse av helse- og miljørisiko, utgassing (VOC), allergener, og eventuell spore-inaktivering.
- openQuestions: En liste med 1-2 åpne forskningsspørsmål (objekter med "question", "importance" ('Høy'|'Medium'|'Lav'), og "status" ('Åpen')).
- hypotheses: En liste med 1-2 innledende hypoteser/forsøk (objekter med "title", "hypothesis", "independentVariable", "dependentVariable", "status" ('Utkast')).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: [
            'name', 'description', 'chemicalComposition', 'biologicalComposition',
            'trl', 'applicationAreas', 'suppliers', 'epd', 'testResults',
            'healthRisk', 'openQuestions', 'hypotheses'
          ],
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            chemicalComposition: { type: Type.STRING },
            biologicalComposition: { type: Type.STRING },
            trl: { type: Type.INTEGER },
            applicationAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suppliers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            epd: {
              type: Type.OBJECT,
              required: ['gwp', 'recycledContent', 'lifetime', 'circularity'],
              properties: {
                gwp: { type: Type.NUMBER },
                recycledContent: { type: Type.INTEGER },
                lifetime: { type: Type.INTEGER },
                circularity: { type: Type.STRING }
              }
            },
            testResults: {
              type: Type.OBJECT,
              required: ['fire', 'moisture', 'strength', 'durability', 'fireRating', 'strengthMpa', 'durabilityYears'],
              properties: {
                fire: { type: Type.STRING },
                moisture: { type: Type.STRING },
                strength: { type: Type.STRING },
                durability: { type: Type.STRING },
                fireRating: { type: Type.STRING },
                strengthMpa: { type: Type.NUMBER },
                durabilityYears: { type: Type.INTEGER }
              }
            },
            healthRisk: { type: Type.STRING },
            openQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['question', 'importance', 'status'],
                properties: {
                  question: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  status: { type: Type.STRING }
                }
              }
            },
            hypotheses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['title', 'hypothesis', 'independentVariable', 'dependentVariable', 'status'],
                properties: {
                  title: { type: Type.STRING },
                  hypothesis: { type: Type.STRING },
                  independentVariable: { type: Type.STRING },
                  dependentVariable: { type: Type.STRING },
                  status: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returned an empty response.');
    }

    const materialData = JSON.parse(resultText.trim());
    res.json(materialData);
  } catch (error: any) {
    console.error('Error generating material profile:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke generere materialprofil.' });
  }
});

function isPrivateOrLocalIp(ip: string): boolean {
  if (net.isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 0) return true;
    return false;
  }

  if (net.isIP(ip) === 6) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1') return true;
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // ULA
    if (normalized.startsWith('fe80:')) return true; // link-local
    return false;
  }

  return true;
}

async function isSafeExternalHttpUrl(rawUrl: string): Promise<boolean> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
  if (parsed.username || parsed.password) return false;
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') return false;

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) return false;

  if (net.isIP(hostname)) {
    return !isPrivateOrLocalIp(hostname);
  }

  try {
    const records = await dns.lookup(hostname, { all: true });
    if (!records || records.length === 0) return false;
    for (const record of records) {
      if (isPrivateOrLocalIp(record.address)) return false;
    }
  } catch {
    return false;
  }

  return true;
}

// Helper for fetching image URL and converting to base64
async function urlToBase64(url: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      console.warn('Blocked invalid referenceImage URL');
      return null;
    }

    if (!ALLOWED_REFERENCE_IMAGE_ORIGINS.has(parsed.origin)) {
      console.warn('Blocked non-allowlisted referenceImage origin:', parsed.origin);
      return null;
    }

    const normalizedPath = decodeURIComponent(parsed.pathname).replace(/\\/g, '/');
    if (normalizedPath.split('/').includes('..')) {
      console.warn('Blocked referenceImage URL with path traversal');
      return null;
    }

    const trustedOrigin = parsed.origin;
    const requestUrl = new URL(parsed.pathname + parsed.search, trustedOrigin).toString();
    const safe = await isSafeExternalHttpUrl(requestUrl);
    if (!safe) {
      console.warn('Blocked unsafe referenceImage URL');
      return null;
    }

    const response = await fetch(requestUrl, { redirect: 'error' });
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return {
      mimeType: contentType,
      data: buffer.toString('base64'),
    };
  } catch (e) {
    console.error('Failed to convert image URL to base64:', e);
    return null;
  }
}

// 1b. Visuell Gemini Analyse av Materialintegritet
app.post('/api/gemini/analyze-image', async (req, res) => {
  try {
    const { capturedImage, referenceImage, materialName, model, imageTags } = req.body;
    if (!capturedImage) {
      return res.status(400).json({ error: 'Fangede testbilde er påkrevd.' });
    }

    const selectedModel = model || 'gemini-3.6-flash';
    const ai = getAiClient();

    // Parse capturedImage base64
    let capturedMime = 'image/jpeg';
    let capturedBase64 = capturedImage;
    if (capturedImage.startsWith('data:')) {
      const matches = capturedImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        capturedMime = matches[1];
        capturedBase64 = matches[2];
      }
    }

    const parts: any[] = [];

    // Add captured test image part
    parts.push({
      inlineData: {
        mimeType: capturedMime,
        data: capturedBase64,
      },
    });

    // Add reference image if present
    if (referenceImage) {
      if (referenceImage.startsWith('http://') || referenceImage.startsWith('https://')) {
        const fetched = await urlToBase64(referenceImage);
        if (fetched) {
          parts.push({
            inlineData: {
              mimeType: fetched.mimeType,
              data: fetched.data,
            },
          });
        }
      } else if (referenceImage.startsWith('data:')) {
        const matches = referenceImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches) {
          parts.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2],
            },
          });
        }
      }
    }

    let tagsNotice = '';
    if (Array.isArray(imageTags) && imageTags.length > 0) {
      tagsNotice = `\nForskeren har manuelt merket følgende områder/avvik på testbildet:\n` +
        imageTags.map((t: any, i: number) => `- Merkelapp #${i + 1} (${t.category || 'Avvik'}): "${t.label}" plassert ved koordinater x=${Math.round(t.x)}%, y=${Math.round(t.y)}%`).join('\n') +
        `\nVennligst analyser disse spesifikke områdene nøye i samspill med resten av bildet.\n`;
    }

    const promptText = `Du er en ledende laboratorie-spesialist på mikroskopi, materialfasthet og strukturell feilanalyse for bio-baserte bygningsmaterialer ved BioBuild Norge.

Du har mottatt bilde(r) av testresultat for materialet "${materialName || 'Bio-materiale'}".
${referenceImage ? 'Du har både et referansebilde (Før-tilstand) og et nytt testbilde (Etter-påkjenning).' : 'Du har mottatt et nytt testbilde av prøvestykket.'}
${tagsNotice}
Vennligst gjennomfør en grundig visuell analyse av materialets integritet og oppdag eventuelle mikrosprekker, fuktmerker, delaminering, fargeendring eller biologisk nedbrytning.

Returner svaret på NORSK i strikt JSON-format med følgende felter:
- integrityScore: Et heltall fra 0 til 100, der 100 betyr perfekt uskadet integritet og 0 betyr total strukturell kollaps.
- overallCondition: En kort statusoverskrift (f.eks. "God integritet", "Middels fuktgjennomtrengning", "Kritisk mikrosprekkdannelse", "Begynnende overflatedelaminering").
- defectsDetected: En liste med 1-4 spesifikke observasjoner/defekter (f.eks. ["Mikrosprekker i kantsonen", "Lokal fukt-misfarging", "Ingen overflate-erosjon"]).
- detailedAnalysis: En faglig beskrivelse (2-3 setninger) av den visuelle tilstanden, strukturelle sammenhenger og materialets respons.
- recommendations: En liste med 2-3 konkrete tiltak for forskerteamet (f.eks. "Sjekk fuktinnhold med hydro-probe", "Gjennomfør ny trykktest ved 50 kN", "Effektiviser hydrofob overflatebehandling").`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['integrityScore', 'overallCondition', 'defectsDetected', 'detailedAnalysis', 'recommendations'],
          properties: {
            integrityScore: { type: Type.INTEGER },
            overallCondition: { type: Type.STRING },
            defectsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            detailedAnalysis: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returnerte et tomt svar.');
    }

    const analysisData = JSON.parse(resultText.trim());
    analysisData.usedModel = selectedModel;
    res.json(analysisData);
  } catch (error: any) {
    console.error('Error analyzing test image with Gemini:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke gjennomføre visuell AI-analyse av bildet.' });
  }
});

// 1b-batch. Batch AI-analyse av flere testbilder samtidig
app.post('/api/gemini/batch-analyze-images', async (req, res) => {
  try {
    const { images, commonMaterialName, category, model, analysisFocus } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Minst ett testbilde må sendes med i batch-forespørselen.' });
    }

    if (images.length > 30) {
      return res.status(400).json({ error: 'Maksimalt 30 bilder kan analyseres per batch.' });
    }

    const selectedModel = model || 'gemini-3.8-flash';
    const ai = getAiClient();

    const focusInstructionMap: Record<string, string> = {
      comprehensive: 'Gjennomfør en helhetlig laboratorievurdering av strukturell fasthet, overflateriss, fuktpåvirkning, biologisk nedbrytning og delaminering.',
      cracks: 'Fokuser primært på mekaniske mikrosprekker, bruddforløp, skjærspenninger og lastbærende fiberbrudd.',
      moisture: 'Fokuser primært på fuktinntrengning, hydrotermisk hevelse, mørke flekker, mugg/soppvekst og porøsitetsendringer.',
      delamination: 'Fokuser primært på overflatedelaminering, fiber-matrise avbinding, avskalling og adhesjonssvikt.',
    };

    const focusText = focusInstructionMap[analysisFocus || 'comprehensive'] || focusInstructionMap.comprehensive;

    // Concurrently process images in chunks of 3 to optimize speed without exceeding rate limits
    const results: any[] = [];
    const chunkSize = 3;

    for (let i = 0; i < images.length; i += chunkSize) {
      const chunk = images.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(async (item: any, chunkIndex: number) => {
        const itemIndex = i + chunkIndex;
        const startTime = Date.now();
        const imgData = item.capturedImage || item.data;
        const itemName = item.name || item.specimenLabel || `Prøve #${itemIndex + 1}`;
        const itemMatName = item.materialName || commonMaterialName || 'Bio-materiale';
        const itemStage = item.testStage || 'Standard laboratorietest';

        if (!imgData) {
          return {
            id: item.id || `img-${itemIndex}`,
            name: itemName,
            status: 'error',
            error: 'Bilde mangler data eller base64-streng.',
            durationMs: 0
          };
        }

        try {
          let capturedMime = 'image/jpeg';
          let capturedBase64 = imgData;
          if (imgData.startsWith('data:')) {
            const matches = imgData.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
            if (matches) {
              capturedMime = matches[1];
              capturedBase64 = matches[2];
            }
          }

          const parts: any[] = [
            {
              inlineData: {
                mimeType: capturedMime,
                data: capturedBase64,
              },
            },
            {
              text: `Du er en ledende laboratorie-spesialist på mikroskopi, materialfasthet og strukturell feildiagnostikk for bio-baserte bygningsmaterialer ved BioBuild Evidence Lab (Alive Houses AS).

Analyser testbildet for prøve: "${itemName}".
Materiale: "${itemMatName}" (${category || 'Konstruktiv bio-kompositt'}).
Teststadium/betingelse: "${itemStage}".
Spesifikt analysefokus: ${focusText}.

Gjennomfør en grundig visuell analyse og feildiagnose av prøven.
Klassifiser alvorlighetsgrad i: 'lav', 'moderat' eller 'kritisk'.
Angi primær feilmodus som én av: 'Mikrosprekker', 'Fuktinntrengning', 'Delaminering', 'Biologisk nedbrytning', 'Mekanisk brudd', 'Ingen defekt'.

Returner svaret på NORSK i strikt JSON-format.`
            }
          ];

          const response = await ai.models.generateContent({
            model: selectedModel,
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                required: ['integrityScore', 'overallCondition', 'severity', 'primaryFailureMode', 'defectsDetected', 'detailedAnalysis', 'recommendations'],
                properties: {
                  integrityScore: { type: Type.INTEGER, description: 'Heltall fra 0 (total kollaps) til 100 (perfekt uskadet).' },
                  overallCondition: { type: Type.STRING, description: 'Kortfattet statusoverskrift.' },
                  severity: { type: Type.STRING, description: 'lav, moderat, eller kritisk' },
                  primaryFailureMode: { type: Type.STRING, description: 'Mikrosprekker, Fuktinntrengning, Delaminering, Biologisk nedbrytning, Mekanisk brudd, eller Ingen defekt' },
                  defectsDetected: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '1-4 spesifikke visuelle observasjoner'
                  },
                  detailedAnalysis: { type: Type.STRING, description: 'Faglig laboratorievurdering på 2-3 setninger.' },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '2-3 konkrete laboratorietiltak.'
                  },
                  microscopicObservations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '1-3 mikroskopiske overflate-observasjoner'
                  },
                  confidenceScore: { type: Type.INTEGER, description: 'Modellens konfidens (50-100).' }
                }
              }
            }
          });

          const durationMs = Date.now() - startTime;
          const text = response.text;
          if (!text) throw new Error('Gemini returnerte tomt svar for prøve.');
          const parsed = JSON.parse(text.trim());

          return {
            id: item.id || `img-${itemIndex}`,
            name: itemName,
            specimenLabel: itemName,
            testStage: itemStage,
            materialName: itemMatName,
            status: 'completed',
            durationMs,
            usedModel: selectedModel,
            analysis: {
              integrityScore: parsed.integrityScore ?? 75,
              overallCondition: parsed.overallCondition || 'Analyse fullført',
              severity: (['lav', 'moderat', 'kritisk'].includes(parsed.severity?.toLowerCase()) ? parsed.severity.toLowerCase() : 'moderat'),
              primaryFailureMode: parsed.primaryFailureMode || 'Ingen defekt',
              defectsDetected: Array.isArray(parsed.defectsDetected) ? parsed.defectsDetected : [],
              detailedAnalysis: parsed.detailedAnalysis || '',
              recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
              microscopicObservations: Array.isArray(parsed.microscopicObservations) ? parsed.microscopicObservations : [],
              confidenceScore: parsed.confidenceScore ?? 88,
              processingTimeMs: durationMs,
              usedModel: selectedModel
            }
          };
        } catch (itemErr: any) {
          console.error(`Feil ved analyse av prøve ${itemName}:`, itemErr);
          return {
            id: item.id || `img-${itemIndex}`,
            name: itemName,
            specimenLabel: itemName,
            testStage: itemStage,
            materialName: itemMatName,
            status: 'error',
            durationMs: Date.now() - startTime,
            error: itemErr.message || 'Analyse feilet for dette bildet.'
          };
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    // Compute aggregate batch summary
    const completedItems = results.filter(r => r.status === 'completed' && r.analysis);
    const totalCount = results.length;
    const completedCount = completedItems.length;

    let avgIntegrityScore = 0;
    const defectDistribution = { critical: 0, moderate: 0, low: 0, sound: 0 };
    const failureModeCounts: Record<string, number> = {};
    const allDefects: string[] = [];

    if (completedCount > 0) {
      let sumScore = 0;
      for (const item of completedItems) {
        const sc = item.analysis.integrityScore;
        sumScore += sc;
        if (sc >= 85) defectDistribution.sound++;
        else if (item.analysis.severity === 'kritisk') defectDistribution.critical++;
        else if (item.analysis.severity === 'moderat') defectDistribution.moderate++;
        else defectDistribution.low++;

        const mode = item.analysis.primaryFailureMode || 'Ukjent';
        failureModeCounts[mode] = (failureModeCounts[mode] || 0) + 1;

        if (Array.isArray(item.analysis.defectsDetected)) {
          allDefects.push(...item.analysis.defectsDetected);
        }
      }
      avgIntegrityScore = Math.round(sumScore / completedCount);
    }

    // Count top common defects
    const defectCounts: Record<string, number> = {};
    for (const d of allDefects) {
      defectCounts[d] = (defectCounts[d] || 0) + 1;
    }
    const topDefects = Object.entries(defectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([defect, count]) => ({ defect, count }));

    // Generate batch verdict
    let batchVerdict = 'Batch-analyse fullført.';
    if (completedCount > 0) {
      if (avgIntegrityScore >= 80) {
        batchVerdict = `Prøveserien oppviser høy gjennomsnittlig strukturell integritet (${avgIntegrityScore}%). Mindre overflateriss kan observeres, men materialmatrisen fremstår overveiende stabil.`;
      } else if (avgIntegrityScore >= 60) {
        batchVerdict = `Prøveserien viser moderat slitasje/nedbrytning (${avgIntegrityScore}% snitt). Flere prøver har begynnende defekter som bør følges opp med mekaniske fasthetstester.`;
      } else {
        batchVerdict = `Kritisk tilstand oppdaget i prøveserien (${avgIntegrityScore}% snitt). Betydelig brudd- eller fuktrisiko krever umiddelbar revisjon av bio-komposittens herdeprosess eller fiberbinding.`;
      }
    }

    res.json({
      success: true,
      modelUsed: selectedModel,
      batchSummary: {
        totalSubmitted: totalCount,
        totalCompleted: completedCount,
        avgIntegrityScore,
        defectDistribution,
        failureModeCounts,
        topDefects,
        batchVerdict,
        analysisFocus: analysisFocus || 'comprehensive',
        timestamp: new Date().toISOString()
      },
      results
    });
  } catch (error: any) {
    console.error('Feil ved batch AI bildeanalyse:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke gjennomføre batch-analyse av testbilder.' });
  }
});

// 1c. Hent foreslåtte avvik med Gemini basert på bildeinnhold
app.post('/api/gemini/suggest-defects', async (req, res) => {
  try {
    const { capturedImage, materialName, category, model } = req.body;
    if (!capturedImage) {
      return res.status(400).json({ error: 'Testbilde er påkrevd for å hente foreslåtte avvik.' });
    }

    const selectedModel = model || 'gemini-3.8-flash';
    const ai = getAiClient();

    // Parse capturedImage base64
    let capturedMime = 'image/jpeg';
    let capturedBase64 = capturedImage;
    if (capturedImage.startsWith('data:')) {
      const matches = capturedImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        capturedMime = matches[1];
        capturedBase64 = matches[2];
      }
    }

    const parts: any[] = [
      {
        inlineData: {
          mimeType: capturedMime,
          data: capturedBase64,
        },
      },
      {
        text: `Du er en spesialist på materialtesting, mikroskopi og feildiagnostikk for bio-baserte bygningsmaterialer ved BioBuild Evidence Lab.
Analyser testbildet av materialet "${materialName || 'Bio-materiale'}" (${category || 'Bio-materiale'}).

Identifiser konkrete visuelle avvik og defekter i materialprøven basert på bildeinnholdet.
Klassifiser hvert avvik nøyaktig i én av følgende kategorier:
- 'Sprekk' (f.eks. mikrosprekker, strekkbrudd, riss, overflatebrudd)
- 'Fukt' (f.eks. fuktinntrengning, mørke fuktflekker, kondens eller saltutslag)
- 'Delaminering' (f.eks. lagdeling, avskalling, løsnede fiberlag)
- 'Misfarging' (f.eks. misfarging, oksidasjon, mugg eller biologisk pigmentering)
- 'Generelt' (f.eks. ujevnheter, porer, dimensjonsavvik eller mekanisk skade)

For hvert oppdagede avvik:
1. "category": MÅ være en av: 'Sprekk', 'Fukt', 'Delaminering', 'Misfarging', 'Generelt'.
2. "label": En konsis, beskrivende merkelapp på norsk (maks 80 tegn), f.eks. "Mikrosprekk langs fiberbunt" eller "Fukt-innsig ved underkant".
3. "x": Heltall fra 5 til 95 (horisontal posisjon i prosent fra venstre på bildet).
4. "y": Heltall fra 5 til 95 (vertikal posisjon i prosent fra toppen på bildet).
5. "description": En kort faglig forklaring (1-2 setninger).
6. "severity": 'Kritisk' | 'Moderat' | 'Lav'.

Finn mellom 1 og 5 av de mest signifikante avvikene eller kritiske overvåkingspunktene på prøven.
Returner svaret på NORSK i strikt JSON-format.`
      }
    ];

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['defects', 'summary'],
          properties: {
            defects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['category', 'label', 'x', 'y'],
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Avvikskategori: 'Sprekk', 'Fukt', 'Delaminering', 'Misfarging', eller 'Generelt'",
                  },
                  label: {
                    type: Type.STRING,
                    description: "Kort, presis merkelapp for avviket",
                  },
                  x: {
                    type: Type.INTEGER,
                    description: "Horisontal koordinat i prosent (5-95)",
                  },
                  y: {
                    type: Type.INTEGER,
                    description: "Vertikal koordinat i prosent (5-95)",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Kort faglig forklaring av observasjonen",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Alvorlighetsgrad: 'Kritisk', 'Moderat', eller 'Lav'",
                  },
                },
              },
            },
            summary: {
              type: Type.STRING,
              description: "Kort sammendrag av oppdagede avvik",
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returnerte et tomt svar.');
    }

    const defectData = JSON.parse(resultText.trim());
    defectData.usedModel = selectedModel;
    res.json(defectData);
  } catch (error: any) {
    console.error('Error suggesting defects with Gemini:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke hente foreslåtte avvik med Gemini.' });
  }
});

// 2. Generate Experiment Hypothesis based on Open Question
app.post('/api/gemini/generate-experiment', async (req, res) => {
  try {
    const { materialName, question } = req.body;
    if (!materialName || !question) {
      return res.status(400).json({ error: 'Material name and question are required.' });
    }

    const ai = getAiClient();
    const prompt = `Du er en vitenskapelig rådgiver for BioBuild Norge. Vi forsker på bio-materialer til konseptet "Alive Houses".
Vi har et ubesvart spørsmål angående materialet "${materialName}":
Spørsmål: "${question}"

Vennligst utform et vitenskapelig herdetest/laboratorie-eksperiment på NORSK i JSON-format med følgende struktur:
- title: En kort, fengende og profesjonell tittel på forsøket (f.eks. "Akselerert fuktprøving av...")
- hypothesis: En klar vitenskapelig hypotese som kan bekreftes eller avkreftes (f.eks. "Dersom vi tilsetter X, så vil parameter Y endres med Z...")
- independentVariable: Den uavhengige variabelen (hva vi endrer)
- dependentVariable: Den avhengige variabelen (hva vi måler og observerer)
- stepByStepPlan: En liste over 3-5 logiske steg for gjennomføring av forsøket.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['title', 'hypothesis', 'independentVariable', 'dependentVariable', 'stepByStepPlan'],
          properties: {
            title: { type: Type.STRING },
            hypothesis: { type: Type.STRING },
            independentVariable: { type: Type.STRING },
            dependentVariable: { type: Type.STRING },
            stepByStepPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returned an empty response.');
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error('Error generating experiment:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke generere forsøksoppsett.' });
  }
});

// 2b. Predict Research Owner via AI
app.post('/api/gemini/predict-owner', async (req, res) => {
  try {
    const { material, researchers } = req.body;
    if (!material || !researchers || !Array.isArray(researchers)) {
      return res.status(400).json({ error: 'Material profile and researchers list are required.' });
    }

    const ai = getAiClient();
    const prompt = `Du er en avansert prediktiv AI-allokeringsmotor for bio-arkitektur og regenerativt bygningsdesign ved BioBuild Norge.
Din oppgave er å analysere det nye bio-materialet og velge den optimale forskningslederen (Forsknings-eier) basert på deres kompetansefelt, suksessrate og arbeidsbelastning.

Her er materialet som skal allokeres:
- Navn: "${material.name}"
- Kategori: "${material.category}"
- Beskrivelse: "${material.description}"
- GWP (Karbonavtrykk): ${material.epd?.gwp} kg CO2 eq/kg
- Trykkfasthet: ${material.testResults?.strengthMpa || 'N/A'} MPa
- Biologisk sammensetning: "${material.biologicalComposition}"

Her er de tilgjengelige forskerne i databasen:
${researchers.map(r => `- ID: "${r.id}", Navn: "${r.name}", Tittel: "${r.title}", Avdeling: "${r.department}", Kompetanse: [${r.expertise.join(', ')}], Arbeidstimer: ${r.activeHours}t, Suksessrate: ${r.successRate}%`).join('\n')}

Gjør en vitenskapelig analyse på NORSK. Velg én optimal eier (må matche en eksisterende ID).
Returner resultatet i JSON-format med følgende nøyaktige felter:
- ownerId: ID-en til den valgte forskeren (f.eks. "res-1")
- confidence: Et heltall mellom 0 og 100 som representerer match-konfidens
- reasoning: En detaljert, faglig begrunnelse på norsk (2-3 setninger) for hvorfor akkurat denne forskeren ble valgt basert på materialets biologiske/fysiske egenskaper og forskerens ekspertise.
- workloadFactor: En kort vurdering på norsk av forskerens nåværende arbeidsmengde (${researchers.find(r => r.id === 'res-1')?.activeHours || 140}t, osv) og kapasitet til å påta seg dette prosjektet.
- successProbability: Et heltall mellom 0 og 100 som anslår sannsynligheten for at forskningen lykkes under denne eieren.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['ownerId', 'confidence', 'reasoning', 'workloadFactor', 'successProbability'],
          properties: {
            ownerId: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            reasoning: { type: Type.STRING },
            workloadFactor: { type: Type.STRING },
            successProbability: { type: Type.INTEGER }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Gemini returned an empty response.');
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error('Error predicting research owner:', error);
    // Return a smart fallback selection locally in case API fails
    res.status(500).json({ error: error.message || 'Kunne ikke gjennomføre prediktiv AI-analyse.' });
  }
});

// 3. General BioBuild Chat Partner

app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, contextMaterial } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getAiClient();
    
    // Build conversation instruction
    let systemInstruction = `Du er BioBuild AI-Lab-Partner, en kunnskaps- og forskningsmotor som bistår forskere med å utvikle «Alive Houses» (levende, biologiske, og sirkulære hus).
Svar profesjonelt, vitenskapelig og presist på NORSK.
Du har dyp kompetanse innen mykologi (sopp), plantefibre, alger, bio-sementering, karbonlagring i bygg, EPD (livsløpsanalyser), TRL-nivåer og byggtekniske krav (brann, fukt, styrke og bestandighet i nordisk klima).`;

    if (contextMaterial) {
      systemInstruction += `\n\nAkkurat nå ser brukeren på materialet: "${contextMaterial.name}".
Her er noen nøkkeldata om materialet for din kontekst:
- Beskrivelse: ${contextMaterial.description}
- Biologisk sammensetning: ${contextMaterial.biologicalComposition}
- Kjemisk sammensetning: ${contextMaterial.chemicalComposition}
- TRL-nivå: TRL ${contextMaterial.trl}
- EPD GWP: ${contextMaterial.epd?.gwp} kg CO2 eq/kg
- Brannklasse: ${contextMaterial.testResults?.fireRating || 'Ikke klassifisert'}
- Styrke: ${contextMaterial.testResults?.strengthMpa || 'N/A'} MPa`;
    }

    // Format history for Gemini chat structure or standard generateContent
    // Let's use simple prompt construction for robust history execution
    let formattedConversation = "";
    const lastMessages = messages.slice(-8); // Limit history length to preserve token budget
    for (const msg of lastMessages) {
      const roleName = msg.role === 'user' ? 'Forsker' : 'BioBuild AI-Lab-Partner';
      formattedConversation += `${roleName}: ${msg.content}\n\n`;
    }
    formattedConversation += `BioBuild AI-Lab-Partner:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedConversation,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || 'Beklager, jeg kunne ikke formulere et svar.' });
  } catch (error: any) {
    console.error('Error in lab chat:', error);
    res.status(500).json({ error: error.message || 'Feil ved tilkobling til Gemini API.' });
  }
});

// 4. Suggest Material Category from Description
app.post('/api/gemini/suggest-category', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!description && !name) {
      return res.status(400).json({ error: 'Navn eller beskrivelse er påkrevd.' });
    }

    const ai = getAiClient();
    const prompt = `Du er en ekspert på bio-baserte bygningsmaterialer og organisk kjemi.
Basert på navnet og beskrivelsen nedenfor, analyser materialet og foreslå den nøyaktig mest passendekategorien blant disse 4 standardkategoriene:
- "Mykologiske" (for sopp, mycelium, kitin, ganoderma, pleurotus, sporer osv.)
- "Plantebaserte" (for hamp, lin, strå, halm, jute, bambus, cellulose, frø, biomasse osv.)
- "Alger & Bakterier" (for alger, bakterier, alginat, mikroalger, bio-sement, cyanobakterier, kalkutfelling, diatomeer osv.)
- "Tre & Kork" (for treverk, massivtre, kork, bark, flis, lignin, trefiber osv.)

Materialnavn: "${name || ''}"
Beskrivelse: "${description || ''}"

Returner et JSON-objekt med:
- suggestedCategory: streng (MÅ være nøyaktig en av: "Mykologiske", "Plantebaserte", "Alger & Bakterier", "Tre & Kork")
- reasoning: kort faglig begrunnelse på norsk (1-2 setninger)
- confidence: et heltall fra 70 til 99`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Tomt svar fra Gemini');
    }

    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error('Error suggesting category:', error);
    res.status(500).json({ error: error.message || 'Kunne ikke foreslå kategori.' });
  }
});

// -------------------------------------------------------------
// Vite or Production Static Serve
// -------------------------------------------------------------
async function bootstrap() {
  const isCompiledBundle = typeof __filename !== 'undefined' && __filename.endsWith('server.cjs');
  const hasDist = fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || isCompiledBundle || (hasDist && process.env.NODE_ENV !== 'development');

  if (!isProduction) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Vite middleware mounted in development mode');
    } catch (viteErr) {
      console.warn('Vite dev middleware could not start, checking for dist fallback:', viteErr);
      const distPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(path.join(distPath, 'index.html'))) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
        console.log(`Fallback: Serving static production files from: ${distPath}`);
      } else {
        throw viteErr;
      }
    }
  } else {
    const candidatePaths = [
      path.join(process.cwd(), 'dist'),
      path.join(__dirname, 'dist'),
      __dirname,
    ];
    const distPath = candidatePaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Serving static production files from: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BioBuild Evidence Lab server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap Express server:', err);
});
