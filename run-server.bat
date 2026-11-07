@echo off
title The Legend Fast Food - Server
cd /d "%~dp0"
echo ========================================================
echo   THE LEGEND FAST FOOD - LOCAL WEB SERVER
echo ========================================================
echo.
echo Starting local web server on http://localhost:3000/ ...
echo.
echo Leave this window open while browsing the site.
echo Press Ctrl+C to stop the server anytime.
echo.
C:\laragon\bin\nodejs\node-v18\node.exe server.js
if %errorlevel% neq 0 (
  echo.
  echo Trying standard node command...
  node server.js
)
pause
