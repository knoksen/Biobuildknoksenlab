; =====================================================================
; BioBuild Evidence Lab - Nullsoft Scriptable Install System (NSIS)
; Generates: BioBuild_Setup.exe
; Alive Houses AS
; =====================================================================

!include "MUI2.nsh"
!include "FileFunc.nsh"

; General
Name "BioBuild Evidence Lab"
OutFile "..\dist-installer\BioBuild_Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\BioBuild Evidence Lab"
InstallDirRegKey HKCU "Software\AliveHouses\BioBuild" "Install_Dir"
RequestExecutionLevel user

; Interface Settings
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\SECURITY.md"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

; Finish Page
!define MUI_FINISHPAGE_RUN "$INSTDIR\start-app.cmd"
!define MUI_FINISHPAGE_RUN_TEXT "Start BioBuild Evidence Lab nå"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "Norwegian"
!insertmacro MUI_LANGUAGE "English"

; Sections
Section "BioBuild Core Application (Obligatorisk)" SecCore
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  File /r "..\dist"
  File "..\package.json"
  File "..\start-app.cmd"
  File "..\run-win-inst.bat"
  File "..\run-win-inst.ps1"
  File /nonfatal "..\metadata.json"
  File /nonfatal /r "..\desktop"
  File /nonfatal /r "..\node_modules"

  ; Registry Keys
  WriteRegStr HKCU "Software\AliveHouses\BioBuild" "Install_Dir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "DisplayName" "BioBuild Evidence Lab"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "Publisher" "Alive Houses AS"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Skrivebordsikon" SecDesktop
  CreateShortcut "$DESKTOP\BioBuild Evidence Lab.lnk" "$INSTDIR\start-app.cmd" "" "" 0
SectionEnd

Section "Startmeny Snarveier" SecStartMenu
  CreateDirectory "$SMPROGRAMS\BioBuild Evidence Lab"
  CreateShortcut "$SMPROGRAMS\BioBuild Evidence Lab\BioBuild Evidence Lab.lnk" "$INSTDIR\start-app.cmd" "" "" 0
  CreateShortcut "$SMPROGRAMS\BioBuild Evidence Lab\Avinstaller BioBuild.lnk" "$INSTDIR\uninstall.exe" "" "" 0
  CreateShortcut "$SMPROGRAMS\BioBuild Evidence Lab\Unreal 5.4 Pixel Streaming (Win Inst).lnk" "$INSTDIR\run-win-inst.bat" "" "" 0
SectionEnd

; Descriptions
LangString DESC_SecCore ${LANG_NORWEGIAN} "Hovedfiler for BioBuild Evidence Lab og lokal database."
LangString DESC_SecDesktop ${LANG_NORWEGIAN} "Oppretter et ikon på skrivebordet ditt."
LangString DESC_SecStartMenu ${LANG_NORWEGIAN} "Oppretter mapper og snarveier i Start-menyen."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} $(DESC_SecCore)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} $(DESC_SecDesktop)
  !insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenu} $(DESC_SecStartMenu)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller
Section "Uninstall"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\BioBuildEvidenceLab"
  DeleteRegKey HKCU "Software\AliveHouses\BioBuild"

  Delete "$DESKTOP\BioBuild Evidence Lab.lnk"
  Delete "$SMPROGRAMS\BioBuild Evidence Lab\*.*"
  RMDir "$SMPROGRAMS\BioBuild Evidence Lab"

  RMDir /r "$INSTDIR\dist"
  RMDir /r "$INSTDIR\desktop"
  Delete "$INSTDIR\*.*"
  RMDir "$INSTDIR"
SectionEnd
