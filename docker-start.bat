@echo off
echo ============================================
echo   Hospital Management System - Docker
echo ============================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed!
    echo Please install Docker Desktop from:
    echo https://desktop.docker.com/win/main/Docker Desktop Installer.exe
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop application
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

echo Starting MongoDB, Backend, and Frontend containers...
echo This may take a few minutes on first run...
echo.

docker-compose up

pause
