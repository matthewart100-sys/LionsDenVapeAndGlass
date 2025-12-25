@echo off
REM Start the dev server with auto-reload on port 8000
REM If you want a different port, use: start_dev_8000.bat 9000

cd /d "%~dp0"
python watch_and_serve.py 8000
pause
