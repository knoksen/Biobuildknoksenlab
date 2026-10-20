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
echo [3/5] Soker etter Inno Setup 6 kompilator...
set "ISCC_PATH="
where ISCC.exe >nul 2>&1
if not errorlevel 1 set "ISCC_PATH=ISCC.exe"
if not defined ISCC_PATH if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if not defined ISCC_PATH if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if not defined ISCC_PATH if exist "%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe" set "ISCC_PATH=%LOCALAPPDATA%\Programs\Inno Setup 6\ISCC.exe"

set "EXE_GENERATED=0"
if defined ISCC_PATH (
    echo   [✓] Inno Setup kompilator funnet: %ISCC_PATH%
    echo   Kompilerer installer\BioBuild-Installer.iss...
    "%ISCC_PATH%" "installer\BioBuild-Installer.iss"
    if not errorlevel 1 (
        echo   [✓] INNO SETUP FULLFØRT: dist-installer\BioBuild_Evidence_Lab_Setup_v1.0.0.exe
        set "EXE_GENERATED=1"
    )
) else (
    echo   [i] Inno Setup 6 ikke funnet i PATH eller standardmapper.
)

echo.
echo [4/5] Soker etter NSIS kompilator...
set "MAKENSIS_PATH="
where makensis.exe >nul 2>&1
if not errorlevel 1 set "MAKENSIS_PATH=makensis.exe"
if not defined MAKENSIS_PATH if exist "%ProgramFiles(x86)%\NSIS\makensis.exe" set "MAKENSIS_PATH=%ProgramFiles(x86)%\NSIS\makensis.exe"
if not defined MAKENSIS_PATH if exist "%ProgramFiles%\NSIS\makensis.exe" set "MAKENSIS_PATH=%ProgramFiles%\NSIS\makensis.exe"

if defined MAKENSIS_PATH (
    echo   [✓] NSIS kompilator funnet: %MAKENSIS_PATH%
    echo   Kompilerer installer\BioBuild-Setup.nsi...
    "%MAKENSIS_PATH%" "installer\BioBuild-Setup.nsi"
    if not errorlevel 1 (
        echo   [✓] NSIS SETUP FULLFØRT: dist-installer\BioBuild_Setup.exe
        set "EXE_GENERATED=1"
    )
) else (
    echo   [i] NSIS ikke funnet.
)

echo.
echo [5/5] Klargjorer Portabel Windows Distribusjonspakke...
set "PORTABLE_DIR=dist-installer\BioBuild-Windows-Portable"
if not exist "%PORTABLE_DIR%" mkdir "%PORTABLE_DIR%"
if not exist "%PORTABLE_DIR%\dist" mkdir "%PORTABLE_DIR%\dist"
xcopy /E /I /Y "dist" "%PORTABLE_DIR%\dist" >nul
if exist "desktop" xcopy /E /I /Y "desktop" "%PORTABLE_DIR%\desktop" >nul
copy /Y "package.json" "%PORTABLE_DIR%\" >nul
copy /Y "metadata.json" "%PORTABLE_DIR%\" >nul
copy /Y "start-app.cmd" "%PORTABLE_DIR%\" >nul
copy /Y "run-win-inst.bat" "%PORTABLE_DIR%\" >nul
copy /Y "run-win-inst.ps1" "%PORTABLE_DIR%\" >nul
echo   [✓] Portabel mappe klar: %PORTABLE_DIR%

echo.
echo ====================================================================
if "%EXE_GENERATED%"=="1" (
    echo   [✓] Bygging vellykket! Installasjonsprogram er opprettet i dist-installer\
) else (
    echo   [i] Tips: For a kompilere frittstaende .EXE-fil automatisk:
    echo     - Last ned gratis Inno Setup 6 fra https://jrsoftware.org/isinfo.php
    echo     - ELLER kjor 1-Klikk installasjonsprogrammet: run-win-installer.bat
    echo     - ELLER distribuer den portable mappen: %PORTABLE_DIR%
)
echo ====================================================================

:done
echo.
pause
