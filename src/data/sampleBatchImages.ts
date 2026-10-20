/**
 * BioBuild Evidence Lab - Benchmark Test Images for Batch AI Analysis
 * Alive Houses AS
 */

export interface SampleBatchSpecimen {
  id: string;
  name: string;
  specimenLabel: string;
  testStage: string;
  materialName: string;
  fileSizeKb: number;
  dataUri: string;
  description: string;
}

// Generate realistic laboratory specimen SVG textures as Data URIs
function createSpecimenSvg(
  bgColor: string,
  accentColor: string,
  specimenCode: string,
  materialName: string,
  defectPattern: 'cracks' | 'moisture' | 'fibers' | 'weathered' | 'sound'
): string {
  let defectSvg = '';

  if (defectPattern === 'cracks') {
    defectSvg = `
      <!-- Micro-cracks along shear plane -->
      <path d="M 60,180 Q 140,150 220,190 T 360,160 T 460,210" stroke="#1f2937" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-dasharray="12,2,4,2" opacity="0.85"/>
      <path d="M 220,190 Q 250,240 280,310 T 320,380" stroke="#1f2937" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M 140,150 L 110,90" stroke="#374151" stroke-width="1.8" fill="none" opacity="0.75"/>
      <circle cx="220" cy="190" r="14" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="240" y="195" font-family="monospace" font-size="11" fill="#ef4444" font-weight="bold">#S-01: Primærskjær</text>
    `;
  } else if (defectPattern === 'moisture') {
    defectSvg = `
      <!-- Moisture saturation gradient -->
      <radialGradient id="moistGrad" cx="65%" cy="45%" r="45%">
        <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.45"/>
        <stop offset="50%" stop-color="#2563eb" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
      </radialGradient>
      <ellipse cx="320" cy="230" rx="140" ry="110" fill="url(#moistGrad)"/>
      <circle cx="340" cy="210" r="18" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="365" y="215" font-family="monospace" font-size="11" fill="#1d4ed8" font-weight="bold">#F-02: Fuktfront (92% RH)</text>
    `;
  } else if (defectPattern === 'fibers') {
    defectSvg = `
      <!-- Delamination and fiber pull-out -->
      <path d="M 40,320 C 120,290 280,340 480,300" stroke="#78350f" stroke-width="4" fill="none" opacity="0.7"/>
      <path d="M 120,290 C 140,250 180,240 210,260" stroke="#92400e" stroke-width="2" fill="none"/>
      <path d="M 280,340 C 310,380 340,390 390,370" stroke="#92400e" stroke-width="2.5" fill="none"/>
      <rect x="180" y="270" width="140" height="70" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="4,2"/>
      <text x="185" y="260" font-family="monospace" font-size="11" fill="#b45309" font-weight="bold">#D-01: Fiberavbinding</text>
    `;
  } else if (defectPattern === 'weathered') {
    defectSvg = `
      <!-- Weathering and surface degradation -->
      <g opacity="0.4">
        <circle cx="120" cy="140" r="45" fill="#365314" filter="blur(4px)"/>
        <circle cx="380" cy="280" r="55" fill="#3f6212" filter="blur(6px)"/>
        <circle cx="250" cy="350" r="35" fill="#14532d" filter="blur(5px)"/>
      </g>
      <text x="130" y="145" font-family="monospace" font-size="11" fill="#15803d" font-weight="bold">#B-01: Biofilm / Algevekst</text>
    `;
  } else {
    defectSvg = `
      <!-- Sound matrix indicator -->
      <circle cx="260" cy="240" r="40" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="210" y="300" font-family="monospace" font-size="11" fill="#047857" font-weight="bold">✓ Homogen intakt matriks</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="420" viewBox="0 0 520 420">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
      </pattern>
      <linearGradient id="specimenBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}"/>
        <stop offset="100%" stop-color="${accentColor}"/>
      </linearGradient>
    </defs>
    
    <!-- Base Specimen Block -->
    <rect width="520" height="420" fill="#0f172a"/>
    <rect x="20" y="20" width="480" height="380" rx="12" fill="url(#specimenBg)" stroke="#334155" stroke-width="2"/>
    <rect x="20" y="20" width="480" height="380" rx="12" fill="url(#grid)"/>

    <!-- Microscopic Texture Lines -->
    <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
      <line x1="40" y1="80" x2="480" y2="80"/>
      <line x1="40" y1="140" x2="480" y2="140"/>
      <line x1="40" y1="200" x2="480" y2="200"/>
      <line x1="40" y1="260" x2="480" y2="260"/>
      <line x1="40" y1="320" x2="480" y2="320"/>
    </g>

    ${defectSvg}

    <!-- Lab Overlay Overlay Data -->
    <rect x="30" y="30" width="260" height="46" rx="6" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="42" y="48" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#38bdf8">${specimenCode}</text>
    <text x="42" y="66" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8">${materialName}</text>

    <!-- Scale Ruler -->
    <rect x="340" y="360" width="150" height="26" rx="4" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.2)"/>
    <line x1="350" y1="373" x2="480" y2="373" stroke="#f8fafc" stroke-width="2"/>
    <line x1="350" y1="367" x2="350" y2="379" stroke="#f8fafc" stroke-width="2"/>
    <line x1="480" y1="367" x2="480" y2="379" stroke="#f8fafc" stroke-width="2"/>
    <text x="390" y="371" font-family="monospace" font-size="9" fill="#f8fafc" text-anchor="middle">50 mm (1:1)</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_BATCH_SPECIMENS: SampleBatchSpecimen[] = [
  {
    id: 'sample-spec-1',
    name: 'Mycelium-Kompositt-Serie-A1.svg',
    specimenLabel: 'Prøve A-101 (Mycelium)',
    testStage: 'Etter 45 kN kompresjonstest',
    materialName: 'Mycelium-kompositt',
    fileSizeKb: 142,
    dataUri: createSpecimenSvg('#e2d9cc', '#c4b59f', 'BIO-LAB // SPECIMEN A-101', 'Mycelium-kompositt (Pleurotus ostreatus)', 'cracks'),
    description: 'Aksial trykkprøving viser mikroskopisk sprekkoppsprekking langs 45 graders skjærplan ved randsonen.'
  },
  {
    id: 'sample-spec-2',
    name: 'Hampbetong-Fuktkammer-B2.svg',
    specimenLabel: 'Prøve B-204 (Hampbetong)',
    testStage: '72t i klimakammer (95% RH)',
    materialName: 'Hampbetong',
    fileSizeKb: 156,
    dataUri: createSpecimenSvg('#d6d3d1', '#a8a29e', 'BIO-LAB // SPECIMEN B-204', 'Hampbetong (Cannabis sativa + hydratkalk)', 'moisture'),
    description: 'Høy luftfuktighet har medført kapillær vannmigrasjon i senter av prøven, med fargeforskyvning og kondensoppsamling.'
  },
  {
    id: 'sample-spec-3',
    name: 'Halmplater-Strekkbrudd-C3.svg',
    specimenLabel: 'Prøve C-302 (Halmisolasjon)',
    testStage: 'Strekk- og bøyetesting (EN 12089)',
    materialName: 'Halmisolasjon',
    fileSizeKb: 138,
    dataUri: createSpecimenSvg('#fef3c7', '#d97706', 'BIO-LAB // SPECIMEN C-302', 'Halmplater med ligninbindemiddel', 'fibers'),
    description: 'Delaminering og uttrekk av hvetestråfibre ved overflaten etter overskridelse av maksimal bøyespenning.'
  },
  {
    id: 'sample-spec-4',
    name: 'Alge-Bioplast-UV-D4.svg',
    specimenLabel: 'Prøve D-405 (Tare/Algekompositt)',
    testStage: '500t akselerert UV-eksponering',
    materialName: 'Tare- og alginatbioplast',
    fileSizeKb: 164,
    dataUri: createSpecimenSvg('#dcfce7', '#86efac', 'BIO-LAB // SPECIMEN D-405', 'Tare- og alginatbioplast (Laminaria)', 'weathered'),
    description: 'Overflatekrakelering og begynnende biofilmdannelse under simulert utendørs klimaeksponering.'
  },
  {
    id: 'sample-spec-5',
    name: 'Treull-Kork-Referanse-E5.svg',
    specimenLabel: 'Prøve E-501 (Treull-kork)',
    testStage: 'Før belastning (Null-referanse)',
    materialName: 'Akustisk treull-kork',
    fileSizeKb: 129,
    dataUri: createSpecimenSvg('#f5f5f4', '#e7e5e4', 'BIO-LAB // SPECIMEN E-501', 'Treull med magnesitt og korkgranulat', 'sound'),
    description: 'Ubelastet referanseprøve med jevn fiberfordeling, intakte bindemiddelbroer og null synlige defekter.'
  }
];
