@echo off
setlocal

cd /d "%~dp0"
title Little Math Explorer

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Please install Node.js 20 or newer from https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found.
  echo Please reinstall Node.js so npm is included.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo Installing project dependencies...
  call npm ci
  if errorlevel 1 (
    echo.
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting Little Math Explorer...
echo The browser will open at http://127.0.0.1:5173/
echo Press Ctrl+C to stop the development server.
call npm run dev -- --host 127.0.0.1 --open

if errorlevel 1 (
  echo.
  echo [ERROR] The development server stopped unexpectedly.
  pause
)

endlocal
