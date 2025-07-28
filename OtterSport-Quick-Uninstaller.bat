@echo off
::=============================================================================
:: OTTERSPORT QUICK UNINSTALLER
:: Fast removal tool for OtterSport (no confirmation prompts)
::=============================================================================

title OtterSport - Quick Uninstaller
color 0C

echo ========================================================
echo   OTTERSPORT - QUICK UNINSTALLER
echo ========================================================
echo Performing silent uninstallation...

:: Stop processes
taskkill /f /im node.exe /t >nul 2>&1
taskkill /f /im OtterSport.exe /t >nul 2>&1
taskkill /f /im TotalInstallerOtterSport.exe /t >nul 2>&1

:: Remove files
if exist "%USERPROFILE%\OtterSport" rmdir /s /q "%USERPROFILE%\OtterSport" >nul 2>&1

:: Remove shortcuts
del "%USERPROFILE%\Desktop\OtterSport.lnk" >nul 2>&1
del "%USERPROFILE%\Desktop\TotalInstallerOtterSport.lnk" >nul 2>&1
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\OtterSport.lnk" >nul 2>&1

:: Remove app data
if exist "%APPDATA%\OtterSport" rmdir /s /q "%APPDATA%\OtterSport" >nul 2>&1
if exist "%LOCALAPPDATA%\OtterSport" rmdir /s /q "%LOCALAPPDATA%\OtterSport" >nul 2>&1

:: Remove registry
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\OtterSport" /f >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\TotalInstallerOtterSport" /f >nul 2>&1
reg delete "HKCU\Software\OtterSport" /f >nul 2>&1

echo ✓ OtterSport removed successfully
echo.
pause