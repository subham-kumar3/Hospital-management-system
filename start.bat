@echo off
echo ============================================
echo   Hospital Management System
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
echo.

REM Start Backend Server
echo Starting Backend Server...
cd backend
call npm run seed
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo Starting Frontend Server...
cd ..\hospital-management
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ============================================
echo   Hospital Management System Started!
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Login Credentials:
echo   Email: admin@hospital.com
echo   Password: admin123
echo.
echo Close the terminal windows to stop servers
echo ============================================
pause
