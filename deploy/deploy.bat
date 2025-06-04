@echo off
REM _traichu Windows Deployment Script
REM This script starts a local server to serve the _traichu static site
REM Usage: deploy.bat [port] [host]
REM Examples: 
REM   deploy.bat           (default: localhost:8080)
REM   deploy.bat 3000      (localhost:3000)
REM   deploy.bat 3000 0.0.0.0  (0.0.0.0:3000)

setlocal

REM Set default values
set DEFAULT_PORT=8080
set DEFAULT_HOST=localhost

REM Parse arguments
if "%1"=="" (
    set PORT=%DEFAULT_PORT%
) else (
    set PORT=%1
)

if "%2"=="" (
    set HOST=%DEFAULT_HOST%
) else (
    set HOST=%2
)

echo.
echo ========================================
echo   _traichu Windows Deployment Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python is not installed or not in PATH
    echo    Please install Python from https://python.org
    echo    Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Get the script directory and project root
set SCRIPT_DIR=%~dp0
for %%i in ("%SCRIPT_DIR%..") do set PROJECT_DIR=%%~fi

REM Change to project directory
cd /d "%PROJECT_DIR%"

REM Check if index.html exists
if not exist "index.html" (
    echo ❌ Error: index.html not found!
    echo    Current directory: %CD%
    echo    Make sure you're running this script from the _traichu root directory.
    echo    Or run: cd .. ^&^& deploy\deploy.bat
    pause
    exit /b 1
)

echo 🚀 Starting _traichu deployment server...
echo 📁 Directory: %CD%
echo 🔧 Press Ctrl+C to stop the server
echo.

REM Try to run the Python deployment script first
if exist "deploy\deploy.py" (
    python deploy\deploy.py %PORT% %HOST%
) else (
    REM Fallback to simple HTTP server
    echo 📍 Serving at: http://%HOST%:%PORT%
    echo 🌐 Open http://%HOST%:%PORT% in your browser
    echo.
    python -m http.server %PORT% --bind %HOST%
)

pause 