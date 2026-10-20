@echo off
chcp 65001 >nul
title BioBuild Evidence Lab - Windows Instance & Unreal Bridge (Win Inst)
color 0A

echo ====================================================================
echo   BioBuild Evidence Lab - Windows Instance Launcher (Win Inst)
echo   Unreal Engine 5.4.3 & MetaHuman Eva Live Stream Bridge
echo ====================================================================
echo.

set "PORT=3000"
set "SIGNAL_PORT=8888"
set "UE5_CMD_FLAGS=-AudioMixer -PixelStreamingURL=ws://127.0.0.1:%SIGNAL_PORT%/ -RenderOffscreen -ResX=1920 -ResY=1080 -ForceRes -graphicsadapter=0 -NvencLatency=ultra-low"

echo [1/4] Sjekker Windows-kjøremiljø og maskinvare...
systeminfo | findstr /B /C:"OS Name" /C:"Total Physical Memory"
echo.

echo [2/4] Verifiserer nettverk og Pixel Streaming-porter...
echo   Lokal BioBuild-port : %PORT%
echo   WebRTC Signal-port  : %SIGNAL_PORT%
echo.

echo [3/4] Sjekker om Unreal Engine 5.4 prosjekt finnes...
if exist "BioBuild_UE5.exe" (
    echo   [✓] BioBuild_UE5.exe funnet! Starter dedikert Windows-instans...
    start "" "BioBuild_UE5.exe" %UE5_CMD_FLAGS%
) else (
    echo   [i] Kjører i utviklingsmodus / simulert Windows-instans.
    echo   For produksjons-UE5: Plasser det kompilerte prosjektet i denne mappen eller
    echo   angi banen til UnrealEditor.exe i skriptet.
)

echo.
echo [4/4] Kobler Windows-instansen mot BioBuild Evidence Lab...
echo   Gå til "Unreal & MetaHuman Bridge" i nettleseren for å styre Eva-riggen.
echo.
echo ====================================================================
echo   Win Inst aktiv! Trykk en tast for å avslutte dette vinduet...
echo ====================================================================
pause >nul
