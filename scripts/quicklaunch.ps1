# BioBuild Evidence Lab - Windows PowerShell Quick Launcher
# Alive Houses AS

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "BioBuild Evidence Lab Quick Launcher"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$rootDir = (Get-Item $scriptDir).Parent.FullName
if (-not (Test-Path "$rootDir\package.json")) { $rootDir = $scriptDir }
Set-Location $rootDir

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  BioBuild Evidence Lab - Windows Quick Launcher (PowerShell)" -ForegroundColor White
Write-Host "  Alive Houses AS - Bio-baserte Materialer, EPD & Vision AI" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# Check port 3000
$portActive = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portActive) {
    Write-Host "[✓] BioBuild server kjører allerede på port 3000." -ForegroundColor Green
    Write-Host "Åpner standard nettleser på http://localhost:3000..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
    exit 0
}

# Verify build
if (-not (Test-Path "$rootDir\dist\server.cjs")) {
    Write-Host "[*] Bygger produksjonspakke for første gangs oppstart..." -ForegroundColor Yellow
    npm run build
}

Write-Host "[✓] Starter BioBuild Evidence Lab på http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"
node dist/server.cjs
