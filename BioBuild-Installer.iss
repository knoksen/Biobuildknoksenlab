; BioBuild Evidence Lab - Inno Setup 6 Script
#define MyAppName "BioBuild Evidence Lab"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Alive Houses AS"
#define MyAppURL "https://alivehouses.no"

[Setup]
AppId={{D3A15812-7890-4A3C-9428-B4C728E298F1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=..\dist-installer
OutputBaseFilename=BioBuild_Evidence_Lab_Setup_v1.0.0
Compression=lzma2/ultra64
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "norwegian"; MessagesFile: "compiler:Languages\Norwegian.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "..\dist\*"; DestDir: "{app}\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\start-app.cmd"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\run-win-inst.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\start-app.cmd"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\start-app.cmd"; Tasks: desktopicon

[Run]
Filename: "{app}\start-app.cmd"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: shellexec nowait postinstall skipifsilent
