@echo off
setlocal

echo ========================================================
echo   OTTERSPORT INSTALLER CLEANUP UTILITY
echo ========================================================
echo.
echo   This will remove old installer files and keep only
echo   the new unified Windows installation system.
echo.

set /p CONFIRM="Remove old installer files? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Cleaning up old installer files...

:: Remove old individual installers
if exist "create-installer.bat" del "create-installer.bat"
if exist "create-installer.sh" del "create-installer.sh"
if exist "install-android.sh" del "install-android.sh"
if exist "install-linux.sh" del "install-linux.sh"
if exist "install-windows.bat" del "install-windows.bat"

:: Remove redundant health installer scripts
if exist "OtterSport Total Health Installer.bat" del "OtterSport Total Health Installer.bat"
if exist "OtterSport Total Health Installer.command" del "OtterSport Total Health Installer.command"
if exist "OtterSport Total Health Installer.sh" del "OtterSport Total Health Installer.sh"

:: Remove old unified launcher
if exist "unified-launcher.cjs" del "unified-launcher.cjs"

:: Remove installer configuration files that are no longer needed
if exist "installer-config.js" del "installer-config.js"
if exist "installer-config.json" del "installer-config.json"
if exist "installer-script.nsh" del "installer-script.nsh"
if exist "installer-script-oneclick.nsh" del "installer-script-oneclick.nsh"

:: Remove Android and other platform files
if exist "android-manifest-oneclick.xml" del "android-manifest-oneclick.xml"
if exist "android-smart-installer-report.json" del "android-smart-installer-report.json"

:: Remove build scripts
if exist "build-installer.js" del "build-installer.js"
if exist "desktop-package.json" del "desktop-package.json"
if exist "electron-main.js" del "electron-main.js"

echo.
echo ========================================================
echo   CLEANUP COMPLETE
echo ========================================================
echo.
echo   Old installer files have been removed.
echo.
echo   REMAINING INSTALLER FILES:
echo   ==========================
echo   ✓ OtterSport-Windows-Installer.bat (Complete installer)
echo   ✓ OtterSport-Simple-Installer.bat (Quick installer)
echo   ✓ WINDOWS-INSTALLER-README.md (Documentation)
echo.
echo   You now have a clean, unified Windows installation system.
echo.
pause