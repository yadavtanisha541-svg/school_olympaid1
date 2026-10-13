@echo off
title OlympiadHub MySQL-Cloud Real-Time Sync Daemon
echo Starting OlympiadHub Two-Way MySQL ⇄ Cloud ⇄ Vercel Sync Daemon...
"C:\xampp\php\php.exe" "%~dp0sync_mysql_with_cloud.php" watch
