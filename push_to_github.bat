@echo off
title Push OlympiadHub to GitHub
echo ===================================================
echo Pushing OlympiadHub to GitHub: school_olympaid1
echo ===================================================
echo.
set PATH=C:\Users\HP\.gemini\antigravity\scratch\mingit\cmd;%PATH%

cd /d "%~dp0"

echo Current remote:
git remote -v
echo.
echo Attempting to push to branch main...
echo (If prompted, enter your GitHub Username and Personal Access Token)
echo.
git push -u origin main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo SUCCESS: Project successfully pushed to GitHub!
    echo URL: https://github.com/yadavtanisha541-svg/school_olympaid1
    echo ===================================================
) else (
    echo.
    echo If authentication failed, you can push using a GitHub Personal Access Token:
    echo git push https://<YOUR_GITHUB_TOKEN>@github.com/yadavtanisha541-svg/school_olympaid1.git main --force
)
pause
