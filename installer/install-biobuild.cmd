@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title BioBuild Evidence Lab - Windows Installer Setup
color 0A

echo ====================================================================
echo   BioBuild Evidence Lab - Windows Installasjonsprogram (Setup)
echo   Alive Houses AS
echo ====================================================================
echo.

set "TARGET_DIR=%LOCALAPPDATA%\Programs\BioBuild Evidence Lab"

echo [1/5] Velger installasjonskatalog:
echo   %TARGET_DIR%
echo.

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
if not exist "%TARGET_DIR%\dist" mkdir "%TARGET_DIR%\dist"
if not exist "%TARGET_DIR%\desktop" mkdir "%TARGET_DIR%\desktop"

echo [2/5] Kopierer applikasjonsfiler...
xcopy /E /I /Y "dist" "%TARGET_DIR%\dist" >nul
xcopy /E /I /Y "desktop" "%TARGET_DIR%\desktop" >nul
copy /Y "package.json" "%TARGET_DIR%\" >nul
copy /Y "start-app.cmd" "%TARGET_DIR%\" >nul
copy /Y "run-win-inst.bat" "%TARGET_DIR%\" >nul
copy /Y "run-win-inst.ps1" "%TARGET_DIR%\" >nul
if exist "metadata.json" copy /Y "metadata.json" "%TARGET_DIR%\" >nul

echo [3/5] Oppretter Windows Snarvei pa Skrivebordet...
set "SCRIPT=%TEMP%\create_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SCRIPT%"
echo sLinkFile = oWS.SpecialFolders("Desktop") ^& "\BioBuild Evidence Lab.lnk" >> "%SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SCRIPT%"
echo oLink.TargetPath = "%TARGET_DIR%\start-app.cmd" >> "%SCRIPT%"
echo oLink.WorkingDirectory = "%TARGET_DIR%" >> "%SCRIPT%"
echo oLink.Description = "BioBuild Evidence Lab Desktop Application" >> "%SCRIPT%"
echo oLink.Save >> "%SCRIPT%"
cscript /nologo "%SCRIPT%"
del "%SCRIPT%"

echo [4/5] Oppretter Startmeny-snarvei...
set "SMPATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\BioBuild Evidence Lab"
if not exist "%SMPATH%" mkdir "%SMPATH%"
set "SCRIPT=%TEMP%\create_sm_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%SCRIPT%"
echo sLinkFile = "%SMPATH%\BioBuild Evidence Lab.lnk" >> "%SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%SCRIPT%"
echo oLink.TargetPath = "%TARGET_DIR%\start-app.cmd" >> "%SCRIPT%"
echo oLink.WorkingDirectory = "%TARGET_DIR%" >> "%SCRIPT%"
echo oLink.Description = "BioBuild Evidence Lab Desktop" >> "%SCRIPT%"
echo oLink.Save >> "%SCRIPT%"
cscript /nologo "%SCRIPT%"
del "%SCRIPT%"

echo [5/5] Sjekker Windows Defender Firewall for Pixel Streaming (Port 3000/8888)...
netsh advfirewall firewall show rule name="BioBuild Evidence Lab" >nul 2>&1
if errorlevel 1 (
    echo   Legger til brannmurunntak for lokal kommunikasjon...
    netsh advfirewall firewall add rule name="BioBuild Evidence Lab" dir=in action=allow protocol=TCP localport=3000,8888 >nul 2>&1
)

echo.
echo ====================================================================
echo   [✓] INSTALLASJON FULLFORT VELLYKKET!
echo   Snarvei er lagt til pa Skrivebordet og i Startmenyen.
echo ====================================================================
echo.
set /p LAUNCH="Vil du starte BioBuild Evidence Lab na? (J/N): "
if /i "%LAUNCH%"=="J" (
    start "" "%TARGET_DIR%\start-app.cmd"
)
exit /b 0
