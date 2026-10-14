@echo off
title OlympiadHub Vercel Deployer
echo ========================================================
echo  Deploying Latest Changes to Live Vercel...
echo ========================================================
echo.
cd /d "C:\Users\HP\.gemini\antigravity\scratch\olympiadhub"
set PATH=C:\Users\HP\.gemini\antigravity\scratch\mingit\cmd;%PATH%

echo [1/2] Checking & Pushing changes to GitHub repository...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo --------------------------------------------------------
    echo [WARNING] Internet se connect nahi ho pa raha hai!
    echo Kripya apna Wi-Fi / Mobile Hotspot check karke connect karein.
    echo Internet aate hi yeh command automatically push kar degi.
    echo --------------------------------------------------------
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo [SUCCESS] Changes GitHub par successfully push ho gaye!
echo Vercel automatically live website update kar raha hai:
echo.
echo   LIVE URL: https://school-olympaid1.vercel.app
echo ========================================================
echo.
pause
