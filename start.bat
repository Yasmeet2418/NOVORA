@echo off
title RecallMate AI Platform
echo ===================================================
echo   Starting RecallMate AI Platform...
echo   "Learn smarter. Revise better. Crack your goals."
echo ===================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Using Node.js runtime from PATH
    start "" http://localhost:3000
    node server.js
) else (
    echo [INFO] Using embedded system node runner...
    set ELECTRON_RUN_AS_NODE=1
    start "" http://localhost:3000
    "C:\Users\nks16\AppData\Local\Programs\Microsoft VS Code\Code.exe" server.js
)
pause
