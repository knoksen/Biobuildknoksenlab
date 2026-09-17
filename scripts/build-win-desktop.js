#!/usr/bin/env node
/**
 * BioBuild Evidence Lab - Windows Desktop Build Orchestrator
 * Alive Houses AS
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('====================================================================');
console.log('  BioBuild Evidence Lab - Bygger Windows Desktop Applikasjon');
console.log('====================================================================');
console.log('');

const rootDir = process.cwd();

try {
  console.log('[1/3] Kjører produksjonsbygging (Vite + esbuild)...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

  console.log('');
  console.log('[2/3] Verifiserer distribusjonsfiler...');
  const serverPath = path.join(rootDir, 'dist', 'server.cjs');
  const indexPath = path.join(rootDir, 'dist', 'index.html');

  if (!fs.existsSync(serverPath)) throw new Error('dist/server.cjs ble ikke generert!');
  if (!fs.existsSync(indexPath)) throw new Error('dist/index.html ble ikke generert!');
  console.log('  [✓] Backend bundle funnet: dist/server.cjs');
  console.log('  [✓] Frontend SPA funnet: dist/index.html');

  console.log('');
  console.log('[3/3] Genererer Windows installer-ressurser...');
  execSync('node scripts/generate-exe-package.js', { stdio: 'inherit', cwd: rootDir });

  console.log('');
  console.log('====================================================================');
  console.log('  [✓] Bygging fullført! Windows Desktop-pakken er klar.');
  console.log('====================================================================');
} catch (error) {
  console.error('[FEIL] Byggingen feilet:', error.message);
  process.exit(1);
}
