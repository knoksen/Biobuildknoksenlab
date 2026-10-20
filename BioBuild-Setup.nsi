; NSIS Script for BioBuild Evidence Lab
Name "BioBuild Evidence Lab"
OutFile "dist-installer\BioBuild_Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\BioBuild Evidence Lab"
Section "Core"
File /r "dist"
SectionEnd
