@echo off
title OtterSport Desktop Installer Builder

echo ========================================
echo  OtterSport Desktop Installer Builder
echo ========================================
echo.

echo Step 1: Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Creating desktop application...
call node build-installer.js --win-only
if %errorlevel% neq 0 (
    echo ERROR: Desktop build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! Installer created successfully
echo ========================================
echo.
echo The installer can be found in: dist-installer\
echo File: OtterSport Setup 1.0.0.exe
echo.
echo You can now distribute this .exe file to users
echo who want to install OtterSport on their computers.
echo.
pause