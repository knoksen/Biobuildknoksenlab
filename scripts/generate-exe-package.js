#!/usr/bin/env node
/**
 * BioBuild Evidence Lab - Windows Desktop Package & Installer Generator
 * Alive Houses AS
 */

import fs from 'fs';
import path from 'path';

console.log('====================================================================');
console.log('  BioBuild Evidence Lab - Klargjør Windows Desktop EXE Distribusjon');
console.log('====================================================================');
console.log('');

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const installerDir = path.join(rootDir, 'dist-installer');

if (!fs.existsSync(distDir)) {
  console.error('[FEIL] dist/-katalogen mangler. Vennligst kjør `npm run build` først.');
  process.exit(1);
}

if (!fs.existsSync(installerDir)) {
  fs.mkdirSync(installerDir, { recursive: true });
}

// Generate an electron-builder.json if not present
const electronBuilderConfig = {
  appId: 'no.alivehouses.biobuild',
  productName: 'BioBuild Evidence Lab',
  copyright: 'Copyright © 2026 Alive Houses AS',
  directories: {
    output: 'dist-installer',
    buildResources: 'assets'
  },
  files: [
    'dist/**/*',
    'desktop/**/*',
    'package.json'
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      },
      {
        target: 'portable',
        arch: ['x64']
      }
    ],
    requestedExecutionLevel: 'asInvoker'
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'BioBuild Evidence Lab',
    uninstallDisplayName: 'BioBuild Evidence Lab',
    runAfterFinish: true
  }
};

const builderConfigPath = path.join(rootDir, 'electron-builder.json');
fs.writeFileSync(builderConfigPath, JSON.stringify(electronBuilderConfig, null, 2), 'utf-8');
console.log('  [✓] Konfigurasjon skrevet: electron-builder.json');

// Write Windows Distribution manifest
const manifest = {
  appName: 'BioBuild Evidence Lab',
  version: '1.0.0',
  platform: 'win32',
  arch: 'x64',
  buildDate: new Date().toISOString(),
  installerFormats: [
    {
      type: 'Inno Setup 6 (.EXE)',
      script: 'installer/BioBuild-Installer.iss',
      output: 'dist-installer/BioBuild_Evidence_Lab_Setup_v1.0.0.exe'
    },
    {
      type: 'NSIS Setup (.EXE)',
      script: 'installer/BioBuild-Setup.nsi',
      output: 'dist-installer/BioBuild_Setup.exe'
    },
    {
      type: 'Native 1-Click Windows Setup',
      script: 'installer/install-biobuild.cmd',
      launcher: 'start-app.cmd'
    },
    {
      type: 'Unreal Engine 5.4 Pixel Streaming Bridge (Win Inst)',
      script: 'run-win-inst.bat'
    }
  ]
};

fs.writeFileSync(
  path.join(installerDir, 'windows-distribution-manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf-8'
);
console.log('  [✓] Distribusjons-manifest skrevet: dist-installer/windows-distribution-manifest.json');

console.log('');
console.log('====================================================================');
console.log('  Windows EXE Installer Klargjort!');
console.log('====================================================================');
console.log('  Tilgjengelige installeringsmetoder på Windows:');
console.log('   1. Inno Setup Compiler : ISCC.exe installer/BioBuild-Installer.iss');
console.log('   2. NSIS Compiler       : makensis installer/BioBuild-Setup.nsi');
console.log('   3. 1-Klikk Setup       : Kjør run-win-installer.bat');
console.log('   4. Direkte start       : Dobbeltklikk start-app.cmd');
console.log('====================================================================');
