@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title BioBuild Evidence Lab - Starter Desktop Applikasjon
color 0B

cd /d "%~dp0"

echo ====================================================================
echo   BioBuild Evidence Lab - Windows Desktop Launcher
echo   Kunnskaps- og forskningsmotor bak Alive Houses AS
echo ====================================================================
echo.

:: 1. Verify Node.js
where node >nul 2>&1
if errorlevel 1 (
  echo [FEIL] Node.js ble ikke funnet i systemets PATH.
  echo Installer Node.js versjon 20 eller nyere fra https://nodejs.org/
  echo.
  pause
  exit /b 1
)

:: 2. Install dependencies if missing
if not exist "node_modules" (
  echo [1/4] Installerer node-avhengigheter (forste gang)...
  call npm install --ignore-scripts=false
  if errorlevel 1 (
    echo [FEIL] npm install feilet.
    pause
    exit /b 1
  )
)

:: 3. Verify esbuild native binary and approve scripts if needed
echo [2/4] Verifiserer native byggeverktoy (esbuild / tsx)...
node -e "try { require('esbuild'); } catch(e) { process.exit(1); }" >nul 2>&1
if errorlevel 1 (
  echo   [!] Setter opp esbuild native binaerfil for Windows...
  if exist "node_modules\esbuild\install.js" (
    node "node_modules\esbuild\install.js" >nul 2>&1
  )
  call npm rebuild esbuild >nul 2>&1
)

:: 4. Build production files if dist/server.cjs is missing
if not exist "dist\server.cjs" (
  echo [3/4] Kompilerer BioBuild produksjonsfiler (Vite + Express Bundle)...
  call npm run build
  if errorlevel 1 (
    echo   [!] Advarsel: Full bygging feilet. Forsoker a starte i dev-modus likevel...
  )
)

:: 5. Check if server is already running on port 3000
echo [4/4] Sjekker om BioBuild Lab allerede kjorer pa port 3000...
node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" >nul 2>&1
if not errorlevel 1 (
  echo   [✓] Serveren kjorer allerede!
  goto open_app
)

:: 6. Launch server process and redirect output to server.log
if exist "server.log" del "server.log" >nul 2>&1

echo   Starter serverprosess pa port 3000...
if exist "dist\server.cjs" (
  start "BioBuild Evidence Lab Server" /min cmd /c "node dist\server.cjs > server.log 2>&1"
) else (
  start "BioBuild Evidence Lab Server" /min cmd /c "npm run dev > server.log 2>&1"
)

:: 7. Wait and probe health endpoint
echo   Venter pa at serveren skal svare pa http://localhost:3000...
for /l %%N in (1,1,30) do (
  node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" >nul 2>&1
  if not errorlevel 1 goto open_app
  timeout /t 1 /nobreak >nul
)

:: 8. If timeout occurred, check server.log and display errors
echo.
echo ====================================================================
echo   [!] BioBuild Evidence Lab svarte ikke pa port 3000 innen 30 sekunder.
echo   Serverlogg (server.log):
echo ====================================================================
if exist "server.log" (
  type "server.log"
) else (
  echo   Ingen server.log ble funnet.
)
echo ====================================================================
echo.
echo Feilsokingstips:
echo   1. Kjor esbuild-installatoren manuelt:
echo      node node_modules\esbuild\install.js
echo.
echo   2. Kjor bygging og start manuelt i dette vinduet:
echo      npm run build
echo      node dist\server.cjs
echo.
echo   3. Sjekk om port 3000 er opptatt av en annen prosess:
echo      netstat -ano ^| findstr :3000
echo ====================================================================
pause
exit /b 1

:open_app
echo.
echo ====================================================================
echo   [✓] BioBuild Evidence Lab er aktiv og tilkoblet!
echo   Apner http://localhost:3000 i din standard nettleser...
echo ====================================================================
start "" "http://localhost:3000"
exit /b 0
