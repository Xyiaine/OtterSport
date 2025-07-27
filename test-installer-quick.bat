@echo off
echo ========================================
echo   INSTALLER DIAGNOSTIC TEST
echo ========================================
echo.

echo Testing Node.js detection...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
) else (
    echo [OK] Node.js working
)

echo.
echo Testing npm detection...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
) else (
    echo [OK] npm working
)

echo.
echo Testing PATH environment...
echo PATH=%PATH%

echo.
echo Testing common Node.js locations...
if exist "%ProgramFiles%\nodejs\node.exe" echo [FOUND] %ProgramFiles%\nodejs\node.exe
if exist "%ProgramFiles(x86)%\nodejs\node.exe" echo [FOUND] %ProgramFiles(x86)%\nodejs\node.exe
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" echo [FOUND] %LOCALAPPDATA%\Programs\nodejs\node.exe

echo.
echo Testing where command...
where node
where npm

echo.
echo Current directory contents:
dir /b

echo.
echo ========================================
echo   DIAGNOSTIC COMPLETE
echo ========================================
pause