@echo off
chcp 65001 >nul
title BioBuild Evidence Lab - Windows EXE Installer Compiler
color 0B

echo ====================================================================
echo   BioBuild Evidence Lab - Bygg Windows EXE Installer (.EXE)
echo   Alive Houses AS
echo ====================================================================
echo.

cd /d "%~dp0\.."

echo [1/4] Bygger produksjonsfiler (Vite + Express Backend)...
call npm run build
if errorlevel 1 (
    echo [FEIL] Bygging av produksjonsfiler feilet!
    pause
    exit /b 1
)

echo.
echo [2/4] Klargjor dist-installer katalog...
if not exist "dist-installer" mkdir "dist-installer"

echo.
echo [3/4] Forsoker a kompilere Inno Setup script (BioBuild_Evidence_Lab_Setup_v1.0.0.exe)...
set "ISCC_PATH="
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if exist "%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"

if defined ISCC_PATH (
    echo   [✓] Inno Setup kompilator funnet: %ISCC_PATH%
    "%ISCC_PATH%" "installer\BioBuild-Installer.iss"
    if not errorlevel 1 (
        echo   [✓] INSTALLER GENERERT: dist-installer\BioBuild_Evidence_Lab_Setup_v1.0.0.exe
        goto done
    )
) else (
    echo   [i] Inno Setup 6 ikke installert i standardmappe. Sjekker NSIS...
)

echo.
echo [4/4] Forsoker a kompilere NSIS script (BioBuild_Setup.exe)...
set "MAKENSIS_PATH="
if exist "%ProgramFiles(x86)%\NSIS\makensis.exe" set "MAKENSIS_PATH=%ProgramFiles(x86)%\NSIS\makensis.exe"
if exist "%ProgramFiles%\NSIS\makensis.exe" set "MAKENSIS_PATH=%ProgramFiles%\NSIS\makensis.exe"

if defined MAKENSIS_PATH (
    echo   [✓] NSIS kompilator funnet: %MAKENSIS_PATH%
    "%MAKENSIS_PATH%" "installer\BioBuild-Setup.nsi"
    if not errorlevel 1 (
        echo   [✓] NSIS INSTALLER GENERERT: dist-installer\BioBuild_Setup.exe
        goto done
    )
) else (
    echo   [i] NSIS ikke funnet.
)

echo.
echo ====================================================================
echo   STATUS:
echo   Produksjonspakken er klargjort i \dist og \desktop.
echo   For a kompilere til en ferdig .EXE:
echo     1. Last ned Inno Setup 6 (https://jrsoftware.org/isinfo.php)
echo     2. Hoyreklikk pa installer\BioBuild-Installer.iss og velg "Compile"
echo   - ELLER -
echo     Bruk 1-Klikk installasjonsprogrammet run-win-installer.bat!
echo ====================================================================

:done
echo.
pause
