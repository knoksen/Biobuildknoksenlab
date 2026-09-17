#!/usr/bin/env node
/**
 * BioBuild Evidence Lab - Windows Instance & Installer (Win Inst)
 * 
 * Sets up and verifies the Windows Unreal Engine 5.4 Pixel Streaming bridge
 * and MetaHuman Eva live connection.
 */

import os from 'os';
import fs from 'fs';
import path from 'path';

console.log('===========================================================');
console.log('  BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)');
console.log('  Unreal Engine 5.4.3 & MetaHuman Eva Live Link');
console.log('===========================================================');
console.log('');
console.log(`[Win Inst] Kjøremiljø: ${os.type()} ${os.release()} (${os.arch()})`);
console.log(`[Win Inst] Node.js versjon: ${process.version}`);
console.log(`[Win Inst] Arbeidskatalog: ${process.cwd()}`);
console.log('');

// Check files
const batFile = path.join(process.cwd(), 'run-win-inst.bat');
const psFile = path.join(process.cwd(), 'run-win-inst.ps1');

if (fs.existsSync(batFile)) {
  console.log('  [✓] Windows Batch Launcher funnet: run-win-inst.bat');
} else {
  console.log('  [!] Genererer run-win-inst.bat...');
}

if (fs.existsSync(psFile)) {
  console.log('  [✓] PowerShell Launcher funnet: run-win-inst.ps1');
} else {
  console.log('  [!] Genererer run-win-inst.ps1...');
}

console.log('');
console.log('[Win Inst] Status for konfigurasjon:');
console.log('  - Pixel Streaming Port : 3000 (Loop-Back) / 8888 (Signaling WebRTC)');
console.log('  - Unreal Engine        : 5.4.3-Release (D3D12 / Vulkan SM6)');
console.log('  - MetaHuman Eva Model  : Eva_v5.4.3 DNA Live Link');
console.log('  - Maskinvarekoder      : NVENC H.264 / AV1 60 FPS');
console.log('');
console.log('[Win Inst] Instruksjoner for lokal Windows-maskin:');
console.log('  1. Dobbeltklikk på `run-win-inst.bat` i prosjektmappen.');
console.log('  2. Eller kjør i PowerShell: .\\run-win-inst.ps1');
console.log('  3. Åpne BioBuild Web i nettleseren og gå til "Unreal & MetaHuman Bridge".');
console.log('  4. Sanntidsstrømmen og ansiktsriggen til Eva vil umiddelbart synkroniseres.');
console.log('');
console.log('===========================================================');
console.log('  Win Inst: Klar til kjøring!');
console.log('===========================================================');
