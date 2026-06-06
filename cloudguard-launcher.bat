@echo off
title CloudGuard AI Launcher
color 0B

echo.
echo  ========================================
echo   CloudGuard AI - Starting Platform...
echo  ========================================
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/3] Stopping any existing containers...
docker-compose down --remove-orphans >nul 2>&1

echo [2/3] Building and starting CloudGuard AI...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers.
    pause
    exit /b 1
)

echo [3/3] Waiting for services to be ready...
timeout /t 8 /nobreak >nul

echo.
echo  ========================================
echo   CloudGuard AI is RUNNING!
echo  ========================================
echo.
echo   Frontend  : http://localhost:5173
echo   Backend   : http://localhost:5000
echo   ML Service: http://localhost:8000
echo.
echo  Opening browser...
start http://localhost:5173

echo.
echo  Press any key to STOP CloudGuard AI...
pause >nul

echo.
echo  Stopping CloudGuard AI...
docker-compose down
echo  Stopped. Goodbye.
pause