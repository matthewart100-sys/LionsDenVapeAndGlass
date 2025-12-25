@echo off
REM Unified production startup script for Lions Den Glass (Windows)
REM Serves both API and static files from http://localhost:5000

setlocal enabledelayedexpansion

cd /d "%~dp0"

REM Set environment variables
set FLASK_ENV=production
set DEBUG=False
if not defined SECRET_KEY (
    REM Generate a random key
    for /f "delims=" %%a in ('python -c "import secrets; print(secrets.token_hex(32))"') do (
        set SECRET_KEY=%%a
    )
)

echo.
echo ========================================
echo Lions Den Glass - PRODUCTION SERVER
echo ========================================
echo.
echo Frontend:  http://localhost:5000
echo API:       http://localhost:5000/api
echo Products:  http://localhost:5000/api/products/list
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start Gunicorn with production settings
python -m gunicorn -c gunicorn_config.py wsgi:app

pause
