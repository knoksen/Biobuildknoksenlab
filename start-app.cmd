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
  if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
  ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
  ) else (
    echo [FEIL] Node.js ble ikke funnet pa systemet.
    echo Vennligst installer Node.js (v20 eller nyere) fra https://nodejs.org/
    echo.
    pause
    exit /b 1
  )
)

:: 2. Check if pre-bundled production files exist
if exist "dist\server.cjs" if exist "dist\index.html" (
  echo [1/3] Produksjonsbundle funnet (dist\server.cjs).
  goto check_node_modules
)

:: Build is missing: need to build from source
echo [1/3] Produksjonsbundle mangler, klargjorer byggeprosessen...
if not exist "node_modules" (
  echo   Installerer avhengigheter (forste gang)...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo [FEIL] npm install feilet.
    pause
    exit /b 1
  )
)

echo   Kompilerer BioBuild produksjonsfiler (Vite + Express Backend)...
call npm run build
if errorlevel 1 (
  echo   [!] Advarsel: Full bygging feilet. Forsoker a starte likevel...
)

:check_node_modules
:: 3. Verify that runtime node_modules exists (needed for external express bundle)
if not exist "node_modules\express" (
  echo [2/3] Setter opp nodvendige runtime-moduler for Express...
  if exist "package.json" (
    call npm install --omit=dev --no-audit --no-fund >nul 2>&1
  )
) else (
  echo [2/3] Runtime-avhengigheter er verifisert.
)

:: 4. Check if server is already running on port 3000
echo [3/3] Sjekker om BioBuild Lab allerede kjorer pa port 3000...
node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" >nul 2>&1
if not errorlevel 1 (
  echo   [OK] Serveren kjorer allerede!
  goto open_app
)

:: 5. Launch server process and redirect output to server.log
if exist "server.log" del "server.log" >nul 2>&1

echo   Starter BioBuild Evidence Lab pa port 3000...
if exist "dist\server.cjs" (
  start "BioBuild Evidence Lab Server" /d "%~dp0" /min cmd /c "node dist\server.cjs > server.log 2>&1"
) else (
  start "BioBuild Evidence Lab Server" /d "%~dp0" /min cmd /c "npx tsx server.ts > server.log 2>&1"
)

:: 6. Wait and probe health endpoint
echo   Venter pa at serveren skal svare pa http://localhost:3000...
for /l %%N in (1,1,25) do (
  node -e "require('http').get('http://127.0.0.1:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" >nul 2>&1
  if not errorlevel 1 goto open_app
  timeout /t 1 /nobreak >nul
)

:: 7. If timeout occurred, check server.log and display errors
echo.
echo ====================================================================
echo   [!] BioBuild svarte ikke pa port 3000 innen rimelig tid.
echo   Serverlogg (server.log):
echo ====================================================================
if exist "server.log" (
  type "server.log"
) else (
  echo   Ingen server.log ble funnet.
)
echo ====================================================================
echo.
echo Tips:
echo   1. Start serveren manuelt i dette vinduet for a se feilmeldinger:
echo      node dist\server.cjs
echo.
echo   2. Sjekk om port 3000 er i bruk av et annet program:
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
