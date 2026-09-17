@echo off
chcp 65001 >nul
title BioBuild Evidence Lab - Windows Desktop App & EXE Installer
color 0B

:menu
cls
echo ====================================================================
echo   BioBuild Evidence Lab - Windows Desktop App & EXE Installer
echo   Kunnskaps- og forskningsmotor bak Alive Houses
echo ====================================================================
echo.
echo   [1] Installer BioBuild pa denne maskinen (Lag snarveier og klargjor)
echo   [2] Bygg Desktop Produksjonspakke (Vite + Node Express Bundle)
echo   [3] Kompiler til frittstaende .EXE Installer (Inno Setup / NSIS)
echo   [4] Start BioBuild Desktop umiddelbart (Port 3000)
echo   [5] Start Unreal Engine 5.4 Pixel Streaming Bridge (Win Inst)
echo   [6] Avslutt
echo.
echo ====================================================================
set /p CHOICE="Velg handling [1-6]: "

if "%CHOICE%"=="1" goto install_app
if "%CHOICE%"=="2" goto build_package
if "%CHOICE%"=="3" goto compile_exe
if "%CHOICE%"=="4" goto launch_app
if "%CHOICE%"=="5" goto launch_ue5
if "%CHOICE%"=="6" exit /b 0
goto menu

:install_app
echo.
echo Starter installasjon...
if not exist "dist" (
    echo Kjorer forst bygg av applikasjonen...
    call npm run build
)
call "installer\install-biobuild.cmd"
pause
goto menu

:build_package
echo.
echo Bygger produksjonspakke og forbereder Windows Desktop distribusjon...
call npm run build
call node scripts/generate-exe-package.js
echo.
pause
goto menu

:compile_exe
echo.
echo Kompilerer Windows .EXE Installer...
call "installer\make-win-exe.bat"
pause
goto menu

:launch_app
echo.
echo Starter BioBuild Evidence Lab...
call "start-app.cmd"
goto menu

:launch_ue5
echo.
echo Starter Unreal Engine 5.4 Windows Instance (Win Inst)...
call "run-win-inst.bat"
goto menu
