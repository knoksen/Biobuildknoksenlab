@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\.bin\tsx.cmd" (
  echo Installing app dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

curl.exe --fail --silent --max-time 1 http://localhost:3000/api/health >nul 2>&1
if not errorlevel 1 goto open_app

start "Alive Houses server" /min cmd /c "npm run dev"

for /l %%N in (1,1,30) do (
  curl.exe --fail --silent --max-time 1 http://localhost:3000/api/health >nul 2>&1
  if not errorlevel 1 goto open_app
  timeout /t 1 /nobreak >nul
)

echo The app server did not start on port 3000.
pause
exit /b 1

:open_app
start "" "http://localhost:3000"
exit /b 0