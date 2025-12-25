@echo off
REM Development server on port 5500 for testing mock changes
REM Does NOT push to GitHub - local only

cd "%~dp0"

echo.
echo ========================================
echo   Lions Den Vape & Glass - DEV PORT 5500
echo   (Mock changes only - NOT committed)
echo ========================================
echo.

REM Set PORT environment variable
set PORT=5500

REM Run Flask in development mode
python app.py

echo.
echo Server stopped.
pause
