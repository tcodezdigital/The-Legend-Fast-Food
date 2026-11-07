@echo off
title The Legend Fast Food - Push to GitHub
cd /d "%~dp0"
echo ========================================================
echo   THE LEGEND FAST FOOD - PUSH TO GITHUB
echo ========================================================
echo.
echo Target Repository: https://github.com/tcodezdigital/The-Legend-Fast-Food.git
echo.
echo Pushing branch 'main' to GitHub...
echo (If prompted, sign in via browser or paste your GitHub Personal Access Token)
echo.
"C:\laragon\bin\git\cmd\git.exe" push -u origin main
if %errorlevel% neq 0 (
  echo.
  echo Retrying with standard git command if available...
  git push -u origin main
)
echo.
echo ========================================================
if %errorlevel% equ 0 (
  echo [SUCCESS] All files and frames pushed successfully to GitHub!
  echo Repository: https://github.com/tcodezdigital/The-Legend-Fast-Food
  echo Deploy to Vercel: https://vercel.com/new
) else (
  echo [NOTE] If authentication is needed, you can generate a token at:
  echo https://github.com/settings/tokens
)
echo ========================================================
pause
