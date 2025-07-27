@echo off
setlocal enabledelayedexpansion

title Fix npm PATH Issue - OtterSport
color 0E

echo.
echo =============================================
echo   NPM PATH FIX UTILITY
echo =============================================
echo.
echo   This utility fixes the "npm isn't recognized"
echo   error by updating your system PATH.
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] This utility should be run as administrator
    echo           for best results.
    echo.
    echo Right-click this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking current Node.js installation...

:: Find Node.js installation path
set "NODE_PATH="
set "NPM_PATH="

:: Check common installation paths
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "NODE_PATH=%ProgramFiles%\nodejs"
    echo       Found Node.js at: %ProgramFiles%\nodejs
)
if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    set "NODE_PATH=%ProgramFiles(x86)%\nodejs"
    echo       Found Node.js at: %ProgramFiles(x86)%\nodejs
)
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_PATH=%LOCALAPPDATA%\Programs\nodejs"
    echo       Found Node.js at: %LOCALAPPDATA%\Programs\nodejs
)

if "!NODE_PATH!"=="" (
    echo       [ERROR] Node.js installation not found!
    echo.
    echo       Please install Node.js first:
    echo       1. Visit https://nodejs.org
    echo       2. Download LTS version
    echo       3. Install with "Add to PATH" checked
    echo       4. Run this fix utility again
    echo.
    pause
    exit /b 1
)

:: Set npm path
set "NPM_PATH=%APPDATA%\npm"

echo.
echo [2/5] Updating system PATH variables...

:: Get current system PATH
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "SYSTEM_PATH=%%b"

:: Check if Node.js is already in PATH
echo !SYSTEM_PATH! | findstr /i "nodejs" >nul
if %errorlevel% neq 0 (
    echo       Adding Node.js to system PATH...
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "!SYSTEM_PATH!;!NODE_PATH!" /f >nul 2>&1
    echo       Node.js path added
) else (
    echo       Node.js already in system PATH
)

:: Check if npm is already in PATH
echo !SYSTEM_PATH! | findstr /i "%APPDATA%\npm" >nul
if %errorlevel% neq 0 (
    echo       Adding npm to system PATH...
    for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "UPDATED_PATH=%%b"
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "!UPDATED_PATH!;!NPM_PATH!" /f >nul 2>&1
    echo       npm path added
) else (
    echo       npm already in system PATH
)

echo.
echo [3/5] Updating current session PATH...
set "PATH=%PATH%;!NODE_PATH!;!NPM_PATH!"

echo.
echo [4/5] Creating npm global directory if needed...
if not exist "!NPM_PATH!" (
    mkdir "!NPM_PATH!" >nul 2>&1
    echo       Created npm global directory
) else (
    echo       npm global directory exists
)

echo.
echo [5/5] Testing installation...

:: Test Node.js
"!NODE_PATH!\node.exe" --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('"!NODE_PATH!\node.exe" --version') do set NODE_VER=%%i
    echo       ✓ Node.js working: !NODE_VER!
) else (
    echo       ✗ Node.js test failed
)

:: Test npm
"!NODE_PATH!\npm.cmd" --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('"!NODE_PATH!\npm.cmd" --version') do set NPM_VER=%%i
    echo       ✓ npm working: !NPM_VER!
) else (
    echo       ✗ npm test failed
)

echo.
echo =============================================
echo   PATH FIX COMPLETE
echo =============================================
echo.
echo   IMPORTANT: You must restart your computer
echo   for the PATH changes to take full effect.
echo.
echo   After restart:
echo   1. Open a NEW command prompt
echo   2. Test with: node --version
echo   3. Test with: npm --version
echo   4. Run the OtterSport installer again
echo.

set /p RESTART="Restart computer now? (Y/N): "
if /i "%RESTART%"=="Y" (
    echo.
    echo Restarting computer in 10 seconds...
    echo Press Ctrl+C to cancel
    timeout /t 10
    shutdown /r /t 0
) else (
    echo.
    echo Please restart manually and then run the installer.
)

pause
endlocal