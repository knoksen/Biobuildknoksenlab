; =====================================================================
; BioBuild Evidence Lab - Windows Setup Installer (.EXE)
; Inno Setup 6 Script
; Generates: BioBuild_Evidence_Lab_Setup_v1.0.0.exe
; Alive Houses AS - The Scientific Engine for Alive Houses
; =====================================================================

#define MyAppName "BioBuild Evidence Lab"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Alive Houses AS"
#define MyAppURL "https://alivehouses.no"
#define MyAppExeName "BioBuild.exe"
#define MyAppLauncher "start-app.cmd"

[Setup]
; App Identity
AppId={{D3A15812-7890-4A3C-9428-B4C728E298F1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Destination Directories
DefaultDirName={localappdata}\Programs\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
AllowNoIcons=yes

; Output Configuration
OutputDir=..\dist-installer
OutputBaseFilename=BioBuild_Evidence_Lab_Setup_v1.0.0
Compression=lzma2/ultra64
SolidCompression=yes

; Modern Windows UI
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

; Visuals & Branding
AppName={#MyAppName}
VersionInfoVersion=1.0.0.0
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription="BioBuild Evidence Lab Desktop Application"
VersionInfoCopyright="Copyright (C) 2026 Alive Houses AS"

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\Norwegian.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "firewall"; Description: "Konfigurer Windows Firewall for Pixel Streaming (Port 3000 & 8888)"; GroupDescription: "Nettverk & Unreal Bridge:"

[Files]
; Dist application files
Source: "..\dist\*"; DestDir: "{app}\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
; Backend and configuration
Source: "..\package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\metadata.json"; DestDir: "{app}"; Flags: ignoreversion
; Desktop launcher scripts
Source: "..\start-app.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\run-win-inst.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\run-win-inst.ps1"; DestDir: "{app}"; Flags: ignoreversion
; Node modules for offline execution if packaged
Source: "..\node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist
; Desktop Electron bridge if packaged
Source: "..\desktop\*"; DestDir: "{app}\desktop"; Flags: ignoreversion recursesubdirs createallsubdirs skipifsourcedoesntexist

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppLauncher}"; WorkingDir: "{app}"
Name: "{group}\Unreal Engine 5.4 Pixel Streaming (Win Inst)"; Filename: "{app}\run-win-inst.bat"; WorkingDir: "{app}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppLauncher}"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
; Optional Firewall configuration
Filename: "netsh"; Parameters: "advfirewall firewall add rule name=""BioBuild Evidence Lab"" dir=in action=allow protocol=TCP localport=3000,8888"; Flags: runhidden; Tasks: firewall
; Launch Application on Finish
Filename: "{app}\{#MyAppLauncher}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: shellexec nowait postinstall skipifsilent

[UninstallRun]
Filename: "netsh"; Parameters: "advfirewall firewall delete rule name=""BioBuild Evidence Lab"""; Flags: runhidden
