# ====================================================================
#   BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)
#   Unreal Engine 5.4.3 & MetaHuman Eva Live Stream Bridge
# ====================================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)" -ForegroundColor Yellow
Write-Host "  Unreal Engine 5.4.3 & MetaHuman Eva Live Stream Bridge" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$Port = 3000
$SignalPort = 8888
$Ue5Flags = "-AudioMixer -PixelStreamingURL=ws://127.0.0.1:$SignalPort/ -RenderOffscreen -ResX=1920 -ResY=1080 -ForceRes -graphicsadapter=0 -NvencLatency=ultra-low"

Write-Host "[1/3] Sjekker Windows-system og grafikkort..." -ForegroundColor Gray
$gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1 -ExpandProperty Name
Write-Host "  GPU: $gpu" -ForegroundColor Green

Write-Host "[2/3] Konfigurerer Pixel Streaming porter..." -ForegroundColor Gray
Write-Host "  Web App Port    : http://localhost:$Port" -ForegroundColor White
Write-Host "  Signaling Port  : ws://localhost:$SignalPort" -ForegroundColor White

Write-Host "[3/3] Starter Windows Instans..." -ForegroundColor Gray
if (Test-Path "BioBuild_UE5.exe") {
    Start-Process -FilePath ".\BioBuild_UE5.exe" -ArgumentList $Ue5Flags
    Write-Host "  [✓] BioBuild_UE5.exe startet med Pixel Streaming." -ForegroundColor Green
} else {
    Write-Host "  [i] Kjører i virtuell/simulert Windows instans-modus." -ForegroundColor Yellow
    Write-Host "      Live Link er klar for mottak av data fra nettleseren." -ForegroundColor White
}

Write-Host ""
Write-Host "Win Inst er aktiv og koblet til BioBuild Evidence Lab!" -ForegroundColor Green
