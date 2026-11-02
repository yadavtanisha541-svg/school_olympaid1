@echo off
title OlympiadHub Vercel Deployer
color 0b
echo ========================================================
echo   OLYMPIADHUB - Deploying All Changes to Vercel
echo ========================================================
echo.
cd /d "C:\Users\HP\.gemini\antigravity\scratch\olympiadhub"
set PATH=C:\Users\HP\.gemini\antigravity\scratch\nodejs;C:\Users\HP\.gemini\antigravity\scratch\mingit\cmd;%PATH%

echo [1/2] Checking unpushed commits...
git log origin/main..HEAD --oneline

echo.
echo [2/2] Pushing latest changes to GitHub (triggers Vercel auto-deploy)...
echo.
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo --------------------------------------------------------
    echo [NOTE] Agar GitHub Login ya Token maang raha hai:
    echo 1. Browser me GitHub login window khulegi - 'Sign in with your browser' par click karein.
    echo 2. Ya GitHub Settings -> Developer Settings -> Personal access tokens (classic) se token daalein.
    echo --------------------------------------------------------
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   [SUCCESS] Sare changes GitHub par push ho chuke hain!
echo   Vercel automatically website ko update kar raha hai.
echo.
echo   LIVE URL: https://school-olympaid1.vercel.app
echo ========================================================
echo.
echo 1-2 minute me Vercel par live changes dikhne lagenge.
echo.
pause
