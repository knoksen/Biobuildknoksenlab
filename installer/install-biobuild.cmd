@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title BioBuild Evidence Lab - Windows Installer Setup
color 0A

:: Resolve script and root directories
set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

if exist "%SCRIPT_DIR%\..\dist" (
    cd /d "%SCRIPT_DIR%\.."
) else if exist "%SCRIPT_DIR%\dist" (
    cd /d "%SCRIPT_DIR%"
) else (
    cd /d "%~dp0\.."
)
set "PROJECT_ROOT=%CD%"

echo ====================================================================
echo   BioBuild Evidence Lab - Windows Installasjonsprogram (Setup)
echo   Alive Houses AS - Bio-Materialer ^& Regenerativ Arkitektur
echo ====================================================================
echo.
echo [Kildekatalog] : %PROJECT_ROOT%

set "TARGET_DIR=%LOCALAPPDATA%\Programs\BioBuild Evidence Lab"
echo [Målkatalog]   : %TARGET_DIR%
echo.

:: 1. Verify build files
echo [1/6] Verifiserer at BioBuild produksjonsfiler er bygget...
if not exist "%PROJECT_ROOT%\dist\server.cjs" (
    echo   dist\server.cjs mangler. Kjorer produksjonsbygg (npm run build)...
    call npm run build
    if errorlevel 1 (
        echo [ADVARSEL] Bygging feilet eller npm er ikke tilgjengelig.
        echo Forsoker a fortsette med eksisterende filer...
    )
) else (
    echo   [OK] Produksjonsfiler funnet i dist/
)

:: 2. Create Target Directories
echo.
echo [2/6] Oppretter installasjonsmapper...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
if not exist "%TARGET_DIR%\dist" mkdir "%TARGET_DIR%\dist"
if not exist "%TARGET_DIR%\desktop" mkdir "%TARGET_DIR%\desktop"

:: 3. Copy Application Files
echo.
echo [3/6] Kopierer applikasjonsfiler...
if exist "%PROJECT_ROOT%\dist" (
    xcopy /E /I /Y "%PROJECT_ROOT%\dist" "%TARGET_DIR%\dist" >nul
    echo   [OK] Kopierte dist/
) else (
    echo   [!] Advarsel: dist/ ble ikke funnet
)

if exist "%PROJECT_ROOT%\desktop" (
    xcopy /E /I /Y "%PROJECT_ROOT%\desktop" "%TARGET_DIR%\desktop" >nul
    echo   [OK] Kopierte desktop/
)

if exist "%PROJECT_ROOT%\package.json" copy /Y "%PROJECT_ROOT%\package.json" "%TARGET_DIR%\" >nul
if exist "%PROJECT_ROOT%\metadata.json" copy /Y "%PROJECT_ROOT%\metadata.json" "%TARGET_DIR%\" >nul
if exist "%PROJECT_ROOT%\start-app.cmd" copy /Y "%PROJECT_ROOT%\start-app.cmd" "%TARGET_DIR%\" >nul
if exist "%PROJECT_ROOT%\run-win-inst.bat" copy /Y "%PROJECT_ROOT%\run-win-inst.bat" "%TARGET_DIR%\" >nul
if exist "%PROJECT_ROOT%\run-win-inst.ps1" copy /Y "%PROJECT_ROOT%\run-win-inst.ps1" "%TARGET_DIR%\" >nul

:: Copy or setup node_modules for offline execution
if exist "%PROJECT_ROOT%\node_modules" (
    echo   Kopierer node_modules for rask offline-oppstart...
    if not exist "%TARGET_DIR%\node_modules" mkdir "%TARGET_DIR%\node_modules"
    xcopy /E /I /Y "%PROJECT_ROOT%\node_modules" "%TARGET_DIR%\node_modules" >nul
    echo   [OK] node_modules kopiert.
) else if not exist "%TARGET_DIR%\node_modules" (
    echo   Installerer produksjonsavhengigheter i malmappe...
    pushd "%TARGET_DIR%"
    call npm install --omit=dev --no-audit --no-fund >nul 2>&1
    popd
)

:: 4. Generate Uninstaller
echo.
echo [4/6] Genererer avinstallasjonsprogram (uninstall-biobuild.cmd)...
set "UNINSTALL_CMD=%TARGET_DIR%\uninstall-biobuild.cmd"
(
echo @echo off
echo chcp 65001 ^>nul
echo title Avinstaller BioBuild Evidence Lab
echo color 0C
echo echo ====================================================================
echo echo   Avinstaller BioBuild Evidence Lab
echo echo   Alive Houses AS
echo echo ====================================================================
echo echo.
echo set /p CONFIRM="Er du sikker pa at du vil avinstallere BioBuild? (J/N): "
echo if /i not "%%CONFIRM%%"=="J" exit /b 0
echo.
echo echo Fjerner snarveier...
echo del "%%USERPROFILE%%\Desktop\BioBuild Evidence Lab.lnk" ^>nul 2^>^&1
echo del "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\BioBuild Evidence Lab\*.lnk" ^>nul 2^>^&1
echo rmdir "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\BioBuild Evidence Lab" ^>nul 2^>^&1
echo.
echo echo Fjerner registeroppforinger...
echo reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /f ^>nul 2^>^&1
echo reg delete "HKCU\Software\AliveHouses\BioBuild" /f ^>nul 2^>^&1
echo.
echo echo Sletter applikasjonsfiler...
echo cd /d "%%TEMP%%"
echo rmdir /s /q "%TARGET_DIR%" ^>nul 2^>^&1
echo echo [OK] BioBuild Evidence Lab er na avinstallert.
echo pause
echo exit /b 0
) > "%UNINSTALL_CMD%"
echo   [OK] Avinstalleringsskript opprettet.

:: 5. Create Desktop and Start Menu Shortcuts
echo.
echo [5/6] Oppretter snarveier pa Skrivebord og Startmeny...
set "VBS_SCRIPT=%TEMP%\biobuild_mkshortcut.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell")
echo sDesktop = oWS.SpecialFolders("Desktop")
echo Set oLink = oWS.CreateShortcut(sDesktop ^& "\BioBuild Evidence Lab.lnk")
echo oLink.TargetPath = "%TARGET_DIR%\start-app.cmd"
echo oLink.WorkingDirectory = "%TARGET_DIR%"
echo oLink.Description = "BioBuild Evidence Lab - Alive Houses AS"
echo oLink.Save
) > "%VBS_SCRIPT%"
cscript /nologo "%VBS_SCRIPT%" >nul 2>&1
del "%VBS_SCRIPT%" >nul 2>&1
echo   [OK] Skrivebordsikon: Skrivebord\BioBuild Evidence Lab.lnk

set "SMPATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\BioBuild Evidence Lab"
if not exist "%SMPATH%" mkdir "%SMPATH%"

set "VBS_SCRIPT_SM=%TEMP%\biobuild_mksm.vbs"
(
echo Set oWS = WScript.CreateObject("WScript.Shell")
echo Set oLink1 = oWS.CreateShortcut("%SMPATH%\BioBuild Evidence Lab.lnk")
echo oLink1.TargetPath = "%TARGET_DIR%\start-app.cmd"
echo oLink1.WorkingDirectory = "%TARGET_DIR%"
echo oLink1.Description = "BioBuild Evidence Lab"
echo oLink1.Save
echo Set oLink2 = oWS.CreateShortcut("%SMPATH%\Unreal 5.4 Pixel Streaming.lnk")
echo oLink2.TargetPath = "%TARGET_DIR%\run-win-inst.bat"
echo oLink2.WorkingDirectory = "%TARGET_DIR%"
echo oLink2.Description = "Unreal Engine 5.4 MetaHuman Eva Bridge"
echo oLink2.Save
echo Set oLink3 = oWS.CreateShortcut("%SMPATH%\Avinstaller BioBuild.lnk")
echo oLink3.TargetPath = "%TARGET_DIR%\uninstall-biobuild.cmd"
echo oLink3.WorkingDirectory = "%TARGET_DIR%"
echo oLink3.Description = "Avinstaller BioBuild Evidence Lab"
echo oLink3.Save
) > "%VBS_SCRIPT_SM%"
cscript /nologo "%VBS_SCRIPT_SM%" >nul 2>&1
del "%VBS_SCRIPT_SM%" >nul 2>&1
echo   [OK] Startmeny-gruppe: %SMPATH%

:: Register in Windows Add/Remove Programs (HKCU)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "DisplayName" /d "BioBuild Evidence Lab" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "DisplayVersion" /d "1.0.0" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "Publisher" /d "Alive Houses AS" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "InstallLocation" /d "%TARGET_DIR%" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "UninstallString" /d "\"%TARGET_DIR%\uninstall-biobuild.cmd\"" /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "NoModify" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" /v "NoRepair" /t REG_DWORD /d 1 /f >nul 2>&1

:: 6. Firewall rule (optional, non-blocking if not admin)
echo.
echo [6/6] Sjekker brannmurregler for lokal kommunikasjon (Port 3000 / 8888)...
netsh advfirewall firewall show rule name="BioBuild Evidence Lab" >nul 2>&1
if errorlevel 1 (
    netsh advfirewall firewall add rule name="BioBuild Evidence Lab" dir=in action=allow protocol=TCP localport=3000,8888 >nul 2>&1
    if not errorlevel 1 (
        echo   [OK] Brannmurregel lagt til.
    ) else (
        echo   [i] Brannmurregel ble forbigatt (krever administratorrettigheter, ikke obligatorisk).
    )
) else (
    echo   [OK] Brannmurregel finnes allerede.
)

echo.
echo ====================================================================
echo   [✓] INSTALLASJON FULLFØRT VELLYKKET!
echo.
echo   Applikasjonen er installert i:
echo   %TARGET_DIR%
echo.
echo   Snarveier opprettet:
echo   - Skrivebord : BioBuild Evidence Lab.lnk
echo   - Startmeny  : BioBuild Evidence Lab
echo ====================================================================
echo.
set /p LAUNCH="Vil du starte BioBuild Evidence Lab na? (J/N): "
if /i "%LAUNCH%"=="J" (
    start "" "%TARGET_DIR%\start-app.cmd"
)
exit /b 0
