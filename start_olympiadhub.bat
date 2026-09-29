@echo off
title OlympiadHub - Online Examination Platform
echo ===================================================
echo Starting OlympiadHub Full-Stack Examination System
echo ===================================================

set PATH=C:\Users\HP\.gemini\antigravity\scratch\nodejs;C:\xampp\php;%PATH%

echo 1. Starting PHP REST API Server on http://127.0.0.1:8000...
start /B "OlympiadHub API" "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t "%~dp0backend\public"

echo 2. Starting React Vite Frontend on http://127.0.0.1:3000...
cd /d "%~dp0frontend"
npm run dev

pause
