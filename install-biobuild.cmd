@echo off
chcp 65001 >nul
title BioBuild Evidence Lab - 1-Klikk Windows Setup
color 0A
echo ====================================================================
echo   BioBuild Evidence Lab - Windows Installer Setup (.EXE)
echo   Alive Houses AS
echo ====================================================================
echo.
set "TARGET_DIR=%LOCALAPPDATA%\Programs\BioBuild Evidence Lab"
echo Installerer til: %TARGET_DIR%
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
if not exist "%TARGET_DIR%\dist" mkdir "%TARGET_DIR%\dist"
xcopy /E /I /Y "dist" "%TARGET_DIR%\dist" >nul
copy /Y "package.json" "%TARGET_DIR%\" >nul
copy /Y "start-app.cmd" "%TARGET_DIR%\" >nul
copy /Y "run-win-inst.bat" "%TARGET_DIR%\" >nul
echo Oppretter skrivebordsnarvei...
set "SCRIPT=%TEMP%\mk_sc.vbs"
echo Set W = WScript.CreateObject("WScript.Shell") > "%SCRIPT%"
echo Set S = W.CreateShortcut(W.SpecialFolders("Desktop") ^& "\BioBuild Evidence Lab.lnk") >> "%SCRIPT%"
echo S.TargetPath = "%TARGET_DIR%\start-app.cmd" >> "%SCRIPT%"
echo S.WorkingDirectory = "%TARGET_DIR%" >> "%SCRIPT%"
echo S.Save >> "%SCRIPT%"
cscript /nologo "%SCRIPT%" >nul
del "%SCRIPT%"
echo [✓] Fullfort! BioBuild er installert pa skrivebordet ditt.
pause
start "" "%TARGET_DIR%\start-app.cmd"
