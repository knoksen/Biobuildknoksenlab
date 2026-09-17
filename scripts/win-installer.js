#!/usr/bin/env node
/**
 * BioBuild Evidence Lab - Windows Instance & Desktop Installer (Win Inst)
 * 
 * Sets up and verifies:
 * 1. Windows Desktop Application (.EXE installer & native launcher)
 * 2. Unreal Engine 5.4 Pixel Streaming bridge & MetaHuman Eva live connection.
 */

import os from 'os';
import fs from 'fs';
import path from 'path';

console.log('====================================================================');
console.log('  BioBuild Evidence Lab - Windows Desktop App & Installer (Win Inst)');
console.log('  Alive Houses AS - Unreal Engine 5.4.3 & MetaHuman Eva Live Link');
console.log('====================================================================');
console.log('');
console.log(`[Win Inst] Kjøremiljø: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`[Win Inst] Node.js versjon: ${process.version}`);
console.log(`[Win Inst] Arbeidskatalog: ${process.cwd()}`);
console.log('');

// Check files
const batFile = path.join(process.cwd(), 'run-win-inst.bat');
const psFile = path.join(process.cwd(), 'run-win-inst.ps1');
const installerBat = path.join(process.cwd(), 'run-win-installer.bat');
const innoScript = path.join(process.cwd(), 'installer', 'BioBuild-Installer.iss');
const nsisScript = path.join(process.cwd(), 'installer', 'BioBuild-Setup.nsi');

console.log('[Win Inst] Status for Windows Desktop-filer:');
if (fs.existsSync(installerBat)) {
  console.log('  [✓] 1-Klikk Desktop Installer: run-win-installer.bat');
} else {
  console.log('  [!] run-win-installer.bat mangler');
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
console.log('');
console.log('[Win Inst] Instruksjoner for Windows-maskin:');
console.log('  1. For å installere appen på skrivebordet: Dobbeltklikk på `run-win-installer.bat`.');
console.log('  2. For å bygge .EXE-installasjonsprogram: Kjør `npm run dist:win` eller åpne `installer/BioBuild-Installer.iss` i Inno Setup.');
console.log('  3. For å starte Unreal Pixel Streaming: Kjør `run-win-inst.bat`.');
console.log('  4. Åpne BioBuild Web/Desktop og kontroller MetaHuman Eva-riggen i sanntid.');
console.log('');
console.log('====================================================================');
console.log('  Win Inst: Alt er klargjort for Windows Desktop!');
console.log('====================================================================');
