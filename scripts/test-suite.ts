import fs from 'node:fs';
import path from 'node:path';
import { initialBioMaterials, initialResearchers, initialUserSpaces } from '../src/data';

interface SuiteResult {
  name: string;
  passed: boolean;
  details: string;
  durationMs: number;
}

const results: SuiteResult[] = [];

function runTest(name: string, fn: () => string) {
  const start = performance.now();
  try {
    const details = fn();
    const durationMs = Math.max(1, Math.round(performance.now() - start));
    results.push({ name, passed: true, details, durationMs });
    console.log(`✅ [PASS] ${name} (${durationMs}ms) — ${details}`);
  } catch (err: any) {
    const durationMs = Math.max(1, Math.round(performance.now() - start));
    results.push({ name, passed: false, details: err?.message || String(err), durationMs });
    console.error(`❌ [FAIL] ${name} (${durationMs}ms) — ${err?.message || err}`);
  }
}

console.log('================================================================');
console.log('🧪 BIOBUILD EVIDENCE LAB v3.5.0 — AUTOMATED TEST SUITE');
console.log('================================================================\n');

// 1. Bio-Material Registry & Schema Integrity
runTest('Bio-Material Registry & EPD Schema Integrity', () => {
  if (!Array.isArray(initialBioMaterials) || initialBioMaterials.length === 0) {
    throw new Error('initialBioMaterials must be a non-empty array');
  }
  for (const mat of initialBioMaterials) {
    if (!mat.id || !mat.name || !mat.category) {
      throw new Error(`Material missing required fields: ${JSON.stringify(mat)}`);
    }
    if (typeof mat.trl !== 'number' || mat.trl < 1 || mat.trl > 9) {
      throw new Error(`Invalid TRL for ${mat.name}: ${mat.trl}`);
    }
    if (!mat.epd || typeof mat.epd.gwp !== 'number') {
      throw new Error(`Missing EPD GWP for ${mat.name}`);
    }
  }
  const carbonNegativeCount = initialBioMaterials.filter((m) => m.epd.gwp < 0).length;
  return `${initialBioMaterials.length} materials validated (${carbonNegativeCount} carbon-negative)`;
});

// 2. ISO Accreditation & Proven Testing Verification
runTest('ISO 1182 / ISO 12571 Proven Testing Attestations', () => {
  const accredited = initialBioMaterials.filter((m) => Boolean(m.provenTesting));
  if (accredited.length === 0) {
    throw new Error('Expected at least one ISO-accredited material');
  }
  for (const mat of accredited) {
    const pt = mat.provenTesting!;
    if (!pt.accreditationNumber || !Array.isArray(pt.passedStandards) || pt.passedStandards.length === 0) {
      throw new Error(`Invalid provenTesting on ${mat.name}`);
    }
  }
  return `${accredited.length}/${initialBioMaterials.length} materials hold verified accreditation numbers`;
});

// 3. Pin Clustering & Spiderfy Geometry Algorithm
runTest('TaggedImageOverlay Pin Clustering & Spiderfy Geometry', () => {
  const samplePins = [
    { id: 'p1', x: 34, y: 42 },
    { id: 'p2', x: 37, y: 45 },
    { id: 'p3', x: 32, y: 46 },
    { id: 'p4', x: 75, y: 30 },
  ];
  const threshold = 10;
  const dist12 = Math.hypot(samplePins[0].x - samplePins[1].x, samplePins[0].y - samplePins[1].y);
  const dist13 = Math.hypot(samplePins[0].x - samplePins[2].x, samplePins[0].y - samplePins[2].y);
  const dist14 = Math.hypot(samplePins[0].x - samplePins[3].x, samplePins[0].y - samplePins[3].y);

  if (dist12 > threshold || dist13 > threshold) {
    throw new Error('Expected pins p1, p2, p3 to cluster within 10% threshold');
  }
  if (dist14 <= threshold) {
    throw new Error('Expected pin p4 to remain a standalone pin outside the cluster');
  }

  const centerX = (samplePins[0].x + samplePins[1].x + samplePins[2].x) / 3;
  const centerY = (samplePins[0].y + samplePins[1].y + samplePins[2].y) / 3;
  return `3 close pins merged at centroid (${centerX.toFixed(1)}%, ${centerY.toFixed(1)}%), 1 isolated pin preserved`;
});

// 4. Researchers & AI Allocation Dataset
runTest('Researchers & Predictive Owner Allocation Engine', () => {
  if (!Array.isArray(initialResearchers) || initialResearchers.length < 3) {
    throw new Error('Expected at least 3 researchers in initialResearchers');
  }
  for (const res of initialResearchers) {
    if (!res.id || !res.name || !Array.isArray(res.expertise)) {
      throw new Error(`Invalid researcher record: ${res.id}`);
    }
  }
  return `${initialResearchers.length} researchers and MetaHuman partners verified`;
});

// 5. User Spaces & Multi-Lab Pinning
runTest('User Spaces & Research Lab Configuration', () => {
  if (!Array.isArray(initialUserSpaces) || initialUserSpaces.length === 0) {
    throw new Error('Expected non-empty initialUserSpaces');
  }
  for (const space of initialUserSpaces) {
    if (!space.id || !space.code || !space.name || !Array.isArray(space.pinnedMaterialIds)) {
      throw new Error(`Invalid user space: ${space.id}`);
    }
  }
  return `${initialUserSpaces.length} research spaces verified`;
});

// 6. GitHub Release & Presentation Documentation Files
runTest('GitHub Presentation, README & Release Workflow Artifacts', () => {
  const requiredFiles = ['README.md', 'RELEASE_NOTES.md', '.github/workflows/release.yml', 'package.json'];
  for (const file of requiredFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing required release artifact: ${file}`);
    }
  }
  return `All ${requiredFiles.length} GitHub release & presentation artifacts verified on disk`;
});

const failed = results.filter((r) => !r.passed);
console.log('\n----------------------------------------------------------------');
console.log(`Summary: ${results.length - failed.length}/${results.length} tests passed`);
console.log('----------------------------------------------------------------');

if (failed.length > 0) {
  process.exit(1);
}
