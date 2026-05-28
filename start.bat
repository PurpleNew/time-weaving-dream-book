@echo off
setlocal
cd /d "%~dp0"

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if %errorlevel%==0 (
  start "" "http://127.0.0.1:3000/"
  exit /b 0
)

start "Time Dreambook Server" cmd /k "cd /d ""%~dp0"" && node lib\\planner-core.js"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:3000/"
