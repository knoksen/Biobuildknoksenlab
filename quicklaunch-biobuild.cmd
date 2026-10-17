@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title BioBuild Evidence Lab - Windows Quick Launcher
color 0A

cd /d "%~dp0"

echo ====================================================================
echo   BioBuild Evidence Lab - Windows Quick Launcher
echo   Alive Houses AS - Bio-baserte Materialer, EPD & Vision AI
echo ====================================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [FEIL] Node.js ble ikke funnet i PATH.
    echo Vennligst installer Node.js fra https://nodejs.org/ for a kjore BioBuild.
    pause
    exit /b 1
)

:: Check if server is already running on port 3000
netstat -ano | findstr :3000 >nul 2>nul
if %errorlevel% equ 0 (
    echo [✓] BioBuild server kjorer allerede pa port 3000!
    echo Apner nettleser...
    start http://localhost:3000
    exit /b 0
)

:: Check if build exists
if not exist "dist\server.cjs" (
    echo [!] Forste gangs oppstart: Bygger produksjonspakke (Vite + Express)...
    call npm run build
)

echo [*] Starter BioBuild Evidence Lab pa http://localhost:3000...
start http://localhost:3000

node dist\server.cjs
