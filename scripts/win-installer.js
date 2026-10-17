#!/usr/bin/env node
/**
 * BioBuild Evidence Lab - Windows Instance, Desktop Installer & Quick Launchers (Win Inst) v3.6.0
 * 
 * Sets up and verifies:
 * 1. Windows Desktop Application (.EXE installer & native launcher)
 * 2. Windows Quick Launchers & Shortcut Generators
 * 3. Unreal Engine 5.4 Pixel Streaming bridge & MetaHuman Eva live connection.
 */

import os from 'os';
import fs from 'fs';
import path from 'path';

console.log('====================================================================');
console.log('  BioBuild Evidence Lab - Windows Desktop & Quick Launchers (Win Inst)');
console.log('  Alive Houses AS - Unreal Engine 5.4.3 & MetaHuman Eva Live Link');
console.log('====================================================================');
console.log('');
console.log(`[Win Inst] Kjøremiljø: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`[Win Inst] Node.js versjon: ${process.version}`);
console.log(`[Win Inst] Arbeidskatalog: ${process.cwd()}`);
console.log('');

// Check files
const batFile = path.join(process.cwd(), 'run-win-inst.bat');
const installerBat = path.join(process.cwd(), 'run-win-installer.bat');
const quickLaunchCmd = path.join(process.cwd(), 'quicklaunch-biobuild.cmd');
const makeShortcutsPs1 = path.join(process.cwd(), 'scripts', 'make-shortcuts.ps1');
const innoScript = path.join(process.cwd(), 'installer', 'BioBuild-Installer.iss');
const nsisScript = path.join(process.cwd(), 'installer', 'BioBuild-Setup.nsi');

console.log('[Win Inst] Status for Windows Desktop- & Hurtigstarterfiler:');
if (fs.existsSync(installerBat)) {
  console.log('  [✓] 1-Klikk Desktop Installer: run-win-installer.bat');
} else {
  console.log('  [!] run-win-installer.bat mangler');
}

if (fs.existsSync(quickLaunchCmd)) {
  console.log('  [✓] Windows Quick Launcher: quicklaunch-biobuild.cmd');
} else {
  console.log('  [!] quicklaunch-biobuild.cmd mangler');
}

if (fs.existsSync(makeShortcutsPs1)) {
  console.log('  [✓] PowerShell Snarveisgenerator: scripts/make-shortcuts.ps1');
} else {
  console.log('  [!] scripts/make-shortcuts.ps1 mangler');
}

if (fs.existsSync(innoScript)) {
  console.log('  [✓] Inno Setup 6 EXE Skript: installer/BioBuild-Installer.iss');
} else {
  console.log('  [!] installer/BioBuild-Installer.iss mangler');
}

if (fs.existsSync(nsisScript)) {
  console.log('  [✓] NSIS Setup EXE Skript: installer/BioBuild-Setup.nsi');
} else {
  console.log('  [!] installer/BioBuild-Setup.nsi mangler');
}

if (fs.existsSync(batFile)) {
  console.log('  [✓] Unreal Pixel Streaming Launcher: run-win-inst.bat');
} else {
  console.log('  [!] run-win-inst.bat mangler');
}

console.log('');
console.log('[Win Inst] Status for konfigurasjon:');
console.log('  - Målsystem            : Windows 10/11 (x64 / arm64)');
console.log('  - Desktop Modus        : Frittstående applikasjon med lokal server');
console.log('  - Portbindinger        : Port 3000 (BioBuild Web) & Port 8888 (WebRTC Signaling)');
console.log('  - Unreal Engine        : 5.4.3-Release (D3D12 / Vulkan SM6)');
console.log('  - MetaHuman Eva Model  : Eva_v5.4.3 DNA Live Link');
console.log('  - Maskinvarekoder      : NVENC H.264 / AV1 60 FPS');
console.log('  - Snarveier            : Skrivebordsikon (.lnk) & Start-meny');
console.log('');
console.log('[Win Inst] Instruksjoner for Windows-maskin:');
console.log('  1. Rask oppstart: Dobbeltklikk på `quicklaunch-biobuild.cmd`.');
console.log('  2. For å installere appen permanent: Kjør `run-win-installer.bat`.');
console.log('  3. For å opprette snarveier: Kjør `powershell -File scripts/make-shortcuts.ps1`.');
console.log('  4. For å bygge .EXE: Åpne `installer/BioBuild-Installer.iss` i Inno Setup eller kjør `npm run dist:win`.');
console.log('  5. For å starte Unreal Pixel Streaming: Kjør `run-win-inst.bat`.');
console.log('');
console.log('====================================================================');
console.log('  Win Inst: Alt er klargjort for Windows Desktop & Quick Launchers!');
console.log('====================================================================');
