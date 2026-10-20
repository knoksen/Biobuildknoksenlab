# BioBuild Evidence Lab - Windows Desktop Installer PowerShell Script
# Alive Houses AS

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "BioBuild Evidence Lab - Windows Desktop Installer"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
Set-Location $scriptDir

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  BioBuild Evidence Lab - Windows Desktop & EXE Installer" -ForegroundColor White
Write-Host "  Alive Houses AS - Forskningsmotor for Bio-Materialer" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$installDir = "$env:LOCALAPPDATA\Programs\BioBuild Evidence Lab"

Write-Host "[1/5] Verifiserer produksjonsfiler..." -ForegroundColor Yellow
if (-not (Test-Path "$scriptDir\dist\server.cjs") -or -not (Test-Path "$scriptDir\dist\index.html")) {
    Write-Host "  Kjører produksjonsbygg (Vite + Express backend)..." -ForegroundColor Gray
    npm run build
} else {
    Write-Host "  [✓] Produksjonsfiler funnet i dist/" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/5] Klargjør Windows Desktop installasjonsmappe..." -ForegroundColor Yellow
Write-Host "  Mappe: $installDir" -ForegroundColor Gray
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

Copy-Item -Path "$scriptDir\dist" -Destination "$installDir\" -Recurse -Force
Copy-Item -Path "$scriptDir\package.json" -Destination "$installDir\" -Force
Copy-Item -Path "$scriptDir\start-app.cmd" -Destination "$installDir\" -Force
Copy-Item -Path "$scriptDir\run-win-inst.bat" -Destination "$installDir\" -Force
Copy-Item -Path "$scriptDir\run-win-inst.ps1" -Destination "$installDir\" -Force

if (Test-Path "$scriptDir\desktop") {
    Copy-Item -Path "$scriptDir\desktop" -Destination "$installDir\" -Recurse -Force
}

if (Test-Path "$scriptDir\node_modules") {
    Write-Host "  Kopierer node_modules for offline-støtte..." -ForegroundColor Gray
    Copy-Item -Path "$scriptDir\node_modules" -Destination "$installDir\" -Recurse -Force
}

Write-Host "  [✓] Filer kopiert." -ForegroundColor Green

Write-Host ""
Write-Host "[3/5] Oppretter snarveier på Skrivebord og i Start-menyen..." -ForegroundColor Yellow
$WshShell = New-Object -comObject WScript.Shell

# Desktop shortcut
$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$shortcut = $WshShell.CreateShortcut("$desktopPath\BioBuild Evidence Lab.lnk")
$shortcut.TargetPath = "$installDir\start-app.cmd"
$shortcut.WorkingDirectory = $installDir
$shortcut.Description = "BioBuild Evidence Lab Desktop Application"
$shortcut.Save()
Write-Host "  [✓] Skrivebordsikon opprettet." -ForegroundColor Green

# Start Menu shortcut
$startMenuPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs) + "\BioBuild Evidence Lab"
if (-not (Test-Path $startMenuPath)) {
    New-Item -ItemType Directory -Force -Path $startMenuPath | Out-Null
}
$smShortcut = $WshShell.CreateShortcut("$startMenuPath\BioBuild Evidence Lab.lnk")
$smShortcut.TargetPath = "$installDir\start-app.cmd"
$smShortcut.WorkingDirectory = $installDir
$smShortcut.Save()

$ueShortcut = $WshShell.CreateShortcut("$startMenuPath\Unreal 5.4 Pixel Streaming.lnk")
$ueShortcut.TargetPath = "$installDir\run-win-inst.bat"
$ueShortcut.WorkingDirectory = $installDir
$ueShortcut.Save()
Write-Host "  [✓] Startmeny-snarveier opprettet." -ForegroundColor Green

# Generate uninstaller script
$uninstallScript = @"
@echo off
chcp 65001 >nul
title Avinstaller BioBuild Evidence Lab
color 0C
set /p C="Vil du avinstallere BioBuild? (J/N): "
if /i not "%C%"=="J" exit /b 0
del "$desktopPath\BioBuild Evidence Lab.lnk" >nul 2>&1
rmdir /s /q "$startMenuPath" >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /f >nul 2>&1
cd /d "%TEMP%"
rmdir /s /q "$installDir" >nul 2>&1
echo BioBuild er na avinstallert.
pause
"@
Set-Content -Path "$installDir\uninstall-biobuild.cmd" -Value $uninstallScript -Encoding UTF8

$unShortcut = $WshShell.CreateShortcut("$startMenuPath\Avinstaller BioBuild.lnk")
$unShortcut.TargetPath = "$installDir\uninstall-biobuild.cmd"
$unShortcut.WorkingDirectory = $installDir
$unShortcut.Save()

# Register in Windows Add/Remove programs (HKCU)
$regKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab"
if (-not (Test-Path $regKey)) { New-Item -Path $regKey -Force | Out-Null }
Set-ItemProperty -Path $regKey -Name "DisplayName" -Value "BioBuild Evidence Lab"
Set-ItemProperty -Path $regKey -Name "DisplayVersion" -Value "1.0.0"
Set-ItemProperty -Path $regKey -Name "Publisher" -Value "Alive Houses AS"
Set-ItemProperty -Path $regKey -Name "InstallLocation" -Value "$installDir"
Set-ItemProperty -Path $regKey -Name "UninstallString" -Value "`"$installDir\uninstall-biobuild.cmd`""

Write-Host ""
Write-Host "[4/5] Sjekker brannmurregler..." -ForegroundColor Yellow
try {
    $existingRule = Get-NetFirewallRule -DisplayName "BioBuild Evidence Lab" -ErrorAction SilentlyContinue
    if (-not $existingRule) {
        New-NetFirewallRule -DisplayName "BioBuild Evidence Lab" -Direction Inbound -Protocol TCP -LocalPort 3000, 8888 -Action Allow -ErrorAction SilentlyContinue | Out-Null
        Write-Host "  [✓] Brannmurregel lagt til for port 3000 og 8888" -ForegroundColor Green
    } else {
        Write-Host "  [✓] Brannmurregel finnes allerede" -ForegroundColor Green
    }
} catch {
    Write-Host "  [i] Brannmurregel krever administratorrettigheter (valgfritt)." -ForegroundColor Gray
}

Write-Host ""
Write-Host "[5/5] Status for EXE-kompilatorer på denne maskinen..." -ForegroundColor Yellow
$iscc = Get-Command "ISCC.exe" -ErrorAction SilentlyContinue
if ($iscc) {
    Write-Host "  [✓] Inno Setup 6 kompilator funnet. Du kan kjøre: ISCC.exe installer\BioBuild-Installer.iss" -ForegroundColor Green
} else {
    Write-Host "  [i] Inno Setup kan lastes ned gratis fra: https://jrsoftware.org/isinfo.php" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  [✓] Windows Installasjon Fullført!" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
$resp = Read-Host "Vil du starte BioBuild Evidence Lab nå? (y/n)"
if ($resp -eq 'y' -or $resp -eq 'Y') {
    Start-Process "$installDir\start-app.cmd"
}
