@echo off
REM Production startup script for Lions Den Glass API (Windows)

setlocal enabledelayedexpansion

cd /d "%~dp0"

REM Set environment variables
set FLASK_ENV=production
set DEBUG=False
if not defined SECRET_KEY (
    REM Generate a random key (requires Python)
    for /f "delims=" %%a in ('python -c "import secrets; print(secrets.token_hex(32))"') do (
        set SECRET_KEY=%%a
    )
)

echo Starting Lions Den Glass API in production mode...
echo Environment: %FLASK_ENV%
echo SECRET_KEY: %SECRET_KEY:~0,16%...

REM Start Gunicorn with production settings
python -m gunicorn -c gunicorn_config.py wsgi:app

pause
