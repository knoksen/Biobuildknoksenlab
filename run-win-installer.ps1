# BioBuild Evidence Lab - Windows Desktop Installer PowerShell Script
# Alive Houses AS

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "BioBuild Evidence Lab - Windows Desktop Installer"

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  BioBuild Evidence Lab - Windows Desktop & EXE Installer" -ForegroundColor White
Write-Host "  Alive Houses AS - Forskningsmotor for Bio-Materialer" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$installDir = "$env:LOCALAPPDATA\Programs\BioBuild Evidence Lab"

Write-Host "[1/4] Verifiserer produksjonsfiler..." -ForegroundColor Yellow
if (-not (Test-Path "dist")) {
    Write-Host "  Kjører produksjonsbygg (Vite + Express backend)..." -ForegroundColor Gray
    npm run build
} else {
    Write-Host "  [✓] Produksjonsfiler funnet i dist/" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/4] Klargjør Windows Desktop installasjonsmappe..." -ForegroundColor Yellow
Write-Host "  Mappe: $installDir" -ForegroundColor Gray
if (-not (Test-Path $installDir)) {
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

Copy-Item -Path "dist" -Destination "$installDir\" -Recurse -Force
Copy-Item -Path "package.json" -Destination "$installDir\" -Force
Copy-Item -Path "start-app.cmd" -Destination "$installDir\" -Force
Copy-Item -Path "run-win-inst.bat" -Destination "$installDir\" -Force
Copy-Item -Path "run-win-inst.ps1" -Destination "$installDir\" -Force

if (Test-Path "desktop") {
    Copy-Item -Path "desktop" -Destination "$installDir\" -Recurse -Force
}

Write-Host "  [✓] Filer kopiert." -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Oppretter snarveier på Skrivebord og i Start-menyen..." -ForegroundColor Yellow
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
Write-Host "  [✓] Startmeny-snarvei opprettet." -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] Status for EXE-kompilatorer på denne maskinen..." -ForegroundColor Yellow
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
