@echo off
title PitchPulse - Football Hub Server
echo ========================================================
echo   Starting PitchPulse Premier Football Hub...
echo ========================================================
cd /d "%~dp0backend"

echo Starting backend server on http://localhost:8080...
start "" http://localhost:8080
server.exe
pause
