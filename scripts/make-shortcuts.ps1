# BioBuild Evidence Lab - Windows Shortcut Creator
# Alive Houses AS

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "BioBuild Evidence Lab - Shortcut Creator"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$rootDir = (Get-Item $scriptDir).Parent.FullName
if (-not (Test-Path "$rootDir\package.json")) { $rootDir = $scriptDir }

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  BioBuild Evidence Lab - Windows Snarveisgenerator" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

$WshShell = New-Object -comObject WScript.Shell

# 1. Desktop Shortcut
$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$desktopShortcut = $WshShell.CreateShortcut("$desktopPath\BioBuild Evidence Lab.lnk")
$targetLauncher = if (Test-Path "$rootDir\quicklaunch-biobuild.cmd") { "$rootDir\quicklaunch-biobuild.cmd" } else { "$rootDir\start-app.cmd" }
$desktopShortcut.TargetPath = $targetLauncher
$desktopShortcut.WorkingDirectory = $rootDir
$desktopShortcut.Description = "BioBuild Evidence Lab - Kunnskaps- og forskningsmotor for Alive Houses"
$desktopShortcut.WindowStyle = 1
$desktopShortcut.Save()
Write-Host "  [✓] Skrivebordsnarvei opprettet: $desktopPath\BioBuild Evidence Lab.lnk" -ForegroundColor Green

# 2. Start Menu Shortcut
$programsPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)
$startMenuFolder = "$programsPath\Alive Houses"
if (-not (Test-Path $startMenuFolder)) {
    New-Item -ItemType Directory -Force -Path $startMenuFolder | Out-Null
}
$startMenuShortcut = $WshShell.CreateShortcut("$startMenuFolder\BioBuild Evidence Lab.lnk")
$startMenuShortcut.TargetPath = $targetLauncher
$startMenuShortcut.WorkingDirectory = $rootDir
$startMenuShortcut.Description = "BioBuild Evidence Lab Desktop"
$startMenuShortcut.Save()
Write-Host "  [✓] Start-meny snarvei opprettet: $startMenuFolder\BioBuild Evidence Lab.lnk" -ForegroundColor Green

Write-Host ""
Write-Host "Ferdig! Du kan nå starte BioBuild med 1 klikk fra Skrivebordet eller Start-menyen." -ForegroundColor Cyan
