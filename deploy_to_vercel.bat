@echo off
setlocal enabledelayedexpansion
title OlympiadHub Vercel Deployer
color 0b
echo ========================================================
echo   OLYMPIADHUB - Deploying All Changes to Vercel
echo ========================================================
echo.
cd /d "C:\Users\HP\.gemini\antigravity\scratch\olympiadhub"
set PATH=C:\Users\HP\.gemini\antigravity\scratch\nodejs;C:\Users\HP\.gemini\antigravity\scratch\mingit\cmd;C:\Users\HP\.gemini\antigravity\scratch\mingit\mingw64\bin;%PATH%

echo [1/2] Commits to be deployed:
git log origin/main..HEAD --oneline
echo.

echo [2/2] Pushing latest changes to GitHub (triggers Vercel auto-deploy)...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo --------------------------------------------------------
    echo Agar GitHub browser login popup nahi aaya ya permission mang raha hai,
    echo toh aap apna GitHub Personal Access Token (PAT) niche paste kar sakte hain.
    echo --------------------------------------------------------
    echo.
    set /p GHTOKEN="GitHub Token paste karein (ya Enter dabayein cancel karne ke liye): "
    if defined GHTOKEN (
        echo Pushing using token...
        git push https://!GHTOKEN!@github.com/yadavtanisha541-svg/school_olympaid1.git main
    )
)

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] Sare changes successfully push ho chuke hain!
    echo   Vercel par 1-2 minute me nayi website live ho jayegi:
    echo.
    echo   LIVE URL: https://school-olympaid1.vercel.app
    echo ========================================================
) else (
    echo.
    echo [ERROR] Push nahi ho paya. Kripya token check karein.
)

echo.
pause
