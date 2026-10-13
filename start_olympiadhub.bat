@echo off
title SkillRise Olympiad Platform
echo ===================================================
echo Starting SkillRise Olympiad Platform
echo ===================================================
echo.
echo Launching Real-Time MySQL ⇄ Vercel Cloud Sync Daemon...
start "OlympiadHub MySQL Sync" /min "C:\xampp\php\php.exe" "%~dp0backend\scripts\sync_mysql_with_cloud.php" watch
echo.
echo Opening OlympiadHub in your default web browser (http://localhost:3000)...
start "" "http://localhost:3000"
echo.
echo Local dev server: http://localhost:3000
echo Live Vercel site: https://school-olympaid1.vercel.app
echo Real-Time Two-Way Sync Active: Localhost ⇄ Vercel ⇄ MySQL!
echo.
pause
