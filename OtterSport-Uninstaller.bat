@echo off
setlocal enabledelayedexpansion

::=============================================================================
:: OTTERSPORT WINDOWS UNINSTALLER
:: Complete removal tool for OtterSport local installation
::=============================================================================

title OtterSport - Uninstaller
color 0C

echo.
echo ========================================================
echo   OTTERSPORT - FITNESS CARD GAME
echo   Windows Local Uninstaller
echo ========================================================
echo.
echo   This will completely remove OtterSport from your system
echo   including all data, shortcuts, and configurations.
echo.
echo ========================================================
echo.

:: Warning and confirmation
echo [WARNING] This will permanently delete:
echo           - Application files in %USERPROFILE%\OtterSport
echo           - Desktop shortcuts
echo           - Start Menu shortcuts
echo           - Registry entries
echo           - User data and workout history
echo.
set /p "CONFIRM=Are you sure you want to continue? (y/N): "

if /i not "%CONFIRM%"=="y" (
    echo.
    echo [CANCELLED] Uninstallation cancelled by user.
    echo              Your OtterSport installation remains unchanged.
    pause
    exit /b 0
)

echo.
echo [STARTING] Beginning OtterSport uninstallation...
echo.

:: Step 1: Stop any running OtterSport processes
echo [STEP 1/7] Stopping OtterSport processes...
tasklist /fi "imagename eq node.exe" 2>nul | find /i "node.exe" >nul
if %errorlevel% equ 0 (
    echo           Stopping Node.js processes...
    taskkill /f /im node.exe /t >nul 2>&1
    timeout /t 2 /nobreak >nul
)

tasklist /fi "imagename eq OtterSport.exe" 2>nul | find /i "OtterSport.exe" >nul
if %errorlevel% equ 0 (
    echo           Stopping OtterSport.exe...
    taskkill /f /im OtterSport.exe /t >nul 2>&1
    timeout /t 2 /nobreak >nul
)

tasklist /fi "imagename eq TotalInstallerOtterSport.exe" 2>nul | find /i "TotalInstallerOtterSport.exe" >nul
if %errorlevel% equ 0 (
    echo           Stopping TotalInstallerOtterSport.exe...
    taskkill /f /im TotalInstallerOtterSport.exe /t >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo           ✓ Processes stopped

:: Step 2: Remove application files
echo.
echo [STEP 2/7] Removing application files...
set "INSTALL_DIR=%USERPROFILE%\OtterSport"

if exist "%INSTALL_DIR%" (
    echo           Removing: %INSTALL_DIR%
    rmdir /s /q "%INSTALL_DIR%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo           ✓ Application files removed
    ) else (
        echo           ⚠ Some files may be in use, attempting force removal...
        :: Try to remove individual components
        if exist "%INSTALL_DIR%\node_modules" rmdir /s /q "%INSTALL_DIR%\node_modules" >nul 2>&1
        if exist "%INSTALL_DIR%\client" rmdir /s /q "%INSTALL_DIR%\client" >nul 2>&1
        if exist "%INSTALL_DIR%\server" rmdir /s /q "%INSTALL_DIR%\server" >nul 2>&1
        if exist "%INSTALL_DIR%\shared" rmdir /s /q "%INSTALL_DIR%\shared" >nul 2>&1
        if exist "%INSTALL_DIR%\game-assets" rmdir /s /q "%INSTALL_DIR%\game-assets" >nul 2>&1
        echo           ✓ Major components removed
    )
) else (
    echo           ℹ No installation directory found
)

:: Step 3: Remove desktop shortcuts
echo.
echo [STEP 3/7] Removing desktop shortcuts...
if exist "%USERPROFILE%\Desktop\OtterSport.lnk" (
    del "%USERPROFILE%\Desktop\OtterSport.lnk" >nul 2>&1
    echo           ✓ Desktop shortcut removed
)
if exist "%USERPROFILE%\Desktop\TotalInstallerOtterSport.lnk" (
    del "%USERPROFILE%\Desktop\TotalInstallerOtterSport.lnk" >nul 2>&1
    echo           ✓ Total Installer desktop shortcut removed
)
if exist "%PUBLIC%\Desktop\OtterSport.lnk" (
    del "%PUBLIC%\Desktop\OtterSport.lnk" >nul 2>&1
    echo           ✓ Public desktop shortcut removed
)

:: Step 4: Remove Start Menu shortcuts
echo.
echo [STEP 4/7] Removing Start Menu shortcuts...
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
if exist "%START_MENU%\OtterSport.lnk" (
    del "%START_MENU%\OtterSport.lnk" >nul 2>&1
    echo           ✓ Start Menu shortcut removed
)
if exist "%START_MENU%\OtterSport" (
    rmdir /s /q "%START_MENU%\OtterSport" >nul 2>&1
    echo           ✓ Start Menu folder removed
)
if exist "%START_MENU%\TotalInstallerOtterSport.lnk" (
    del "%START_MENU%\TotalInstallerOtterSport.lnk" >nul 2>&1
    echo           ✓ Total Installer Start Menu shortcut removed
)

:: Step 5: Remove user data and app data
echo.
echo [STEP 5/7] Removing user data...
if exist "%APPDATA%\OtterSport" (
    rmdir /s /q "%APPDATA%\OtterSport" >nul 2>&1
    echo           ✓ User data removed from %APPDATA%
)
if exist "%LOCALAPPDATA%\OtterSport" (
    rmdir /s /q "%LOCALAPPDATA%\OtterSport" >nul 2>&1
    echo           ✓ Local data removed from %LOCALAPPDATA%
)

:: Step 6: Remove registry entries
echo.
echo [STEP 6/7] Removing registry entries...
:: Remove uninstall entry
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\OtterSport" /f >nul 2>&1
if %errorlevel% equ 0 (
    echo           ✓ Uninstall registry entry removed
)

reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\TotalInstallerOtterSport" /f >nul 2>&1
if %errorlevel% equ 0 (
    echo           ✓ Total Installer uninstall registry entry removed
)

:: Remove app-specific registry entries
reg delete "HKCU\Software\OtterSport" /f >nul 2>&1
if %errorlevel% equ 0 (
    echo           ✓ Application registry entries removed
)

:: Remove file associations
reg delete "HKCU\Software\Classes\.otter" /f >nul 2>&1 >nul
reg delete "HKCU\Software\Classes\OtterSport.Workout" /f >nul 2>&1 >nul

:: Step 7: Clean up temporary files
echo.
echo [STEP 7/7] Cleaning up temporary files...
if exist "%TEMP%\OtterSport*" (
    del /q "%TEMP%\OtterSport*" >nul 2>&1
    echo           ✓ Temporary files cleaned
)

:: Clean npm cache if it contains OtterSport data
if exist "%APPDATA%\npm-cache\_cacache" (
    echo           Cleaning npm cache...
    npm cache clean --force >nul 2>&1
)

echo.
echo ========================================================
echo   UNINSTALLATION COMPLETE
echo ========================================================
echo.
echo ✓ OtterSport has been successfully removed from your system
echo.
echo   The following items have been removed:
echo   • Application files (%USERPROFILE%\OtterSport)
echo   • Desktop and Start Menu shortcuts
echo   • User data and configurations
echo   • Registry entries
echo   • Temporary files
echo.
echo ========================================================
echo.

:: Optional cleanup verification
echo [VERIFICATION] Checking for remaining files...
set "CLEANUP_NEEDED=0"

if exist "%USERPROFILE%\OtterSport" (
    echo [WARNING] Some files remain in: %USERPROFILE%\OtterSport
    set "CLEANUP_NEEDED=1"
)

if exist "%APPDATA%\OtterSport" (
    echo [WARNING] Some files remain in: %APPDATA%\OtterSport
    set "CLEANUP_NEEDED=1"
)

if %CLEANUP_NEEDED% equ 1 (
    echo.
    echo [INFO] Some files could not be removed automatically.
    echo        This may be due to:
    echo        • Files currently in use
    echo        • Insufficient permissions
    echo        • Manual customizations
    echo.
    echo        You can manually delete these remaining files if needed.
)

echo.
echo Thank you for using OtterSport!
echo If you decide to reinstall, simply run the installer again.
echo.
pause