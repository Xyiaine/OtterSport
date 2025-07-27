@echo off
setlocal

::=============================================================================
:: OTTERSPORT SIMPLE LOCAL INSTALLER FOR WINDOWS
:: Quick and easy installation for users who already have Node.js
::=============================================================================

title OtterSport Simple Installer
color 0B

echo.
echo =============================================
echo   OTTERSPORT SIMPLE INSTALLER
echo =============================================
echo.
echo   Quick local installation for Windows
echo   Requires: Node.js (already installed)
echo.

:: Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js first:
    echo 1. Visit: https://nodejs.org
    echo 2. Download and install Node.js LTS version
    echo 3. RESTART your computer after installation
    echo 4. Open a NEW command prompt
    echo 5. Run this installer again
    echo.
    echo [TIP] Make sure to check "Add to PATH" during Node.js installation
    echo.
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    echo.
    echo Node.js is installed but npm is not in PATH.
    echo Please:
    echo 1. Restart your computer
    echo 2. Open a NEW command prompt as administrator
    echo 3. Run this installer again
    echo.
    echo If problem persists, reinstall Node.js with "Add to PATH" checked
    echo.
    pause
    exit /b 1
)

:: Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [✓] Node.js found: %NODE_VERSION%

:: Set installation directory
set "INSTALL_DIR=%USERPROFILE%\OtterSport"
echo [✓] Install location: %INSTALL_DIR%

:: Create directory
echo.
echo [1/5] Creating installation directory...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Copy files
echo [2/5] Copying application files...
xcopy "%~dp0\*" "%INSTALL_DIR%\" /E /I /Y /Q >nul 2>&1

:: Install dependencies
echo [3/5] Installing dependencies (this may take 1-2 minutes)...
cd /d "%INSTALL_DIR%"
npm install --silent >nul 2>&1

:: Build application
echo [4/5] Building application...
npm run build >nul 2>&1

:: Create startup script
echo [5/5] Creating shortcuts...
(
echo @echo off
echo title OtterSport - Running
echo cd /d "%INSTALL_DIR%"
echo echo OtterSport is starting...
echo echo Open your browser to: http://localhost:5000
echo echo Press Ctrl+C to stop the server
echo echo.
echo start "" "http://localhost:5000"
echo npm run dev
) > "%INSTALL_DIR%\run-ottersport.bat"

:: Create desktop shortcut
set "SHORTCUT=%USERPROFILE%\Desktop\OtterSport.lnk"
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); $Shortcut.TargetPath = '%INSTALL_DIR%\run-ottersport.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'OtterSport Fitness Game'; $Shortcut.Save()}" >nul 2>&1

echo.
echo =============================================
echo   INSTALLATION COMPLETE!
echo =============================================
echo.
echo   Desktop shortcut created: OtterSport.lnk
echo   Manual start: %INSTALL_DIR%\run-ottersport.bat
echo.
echo   To launch: Double-click the desktop shortcut
echo   URL: http://localhost:5000
echo.

set /p LAUNCH="Launch OtterSport now? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    start "" "%INSTALL_DIR%\run-ottersport.bat"
    echo OtterSport is starting in your browser...
)

echo.
echo Thank you for installing OtterSport!
pause

endlocal