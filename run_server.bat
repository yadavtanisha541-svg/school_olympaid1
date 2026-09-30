@echo off
title OlympiadHub Web Server (Port 8080)
echo Starting OlympiadHub HTTP Web Server on http://localhost:8080...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
