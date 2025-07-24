#!/bin/bash
echo "TotalInstallerOtterSport Android One-Click Installation"
echo "===================================================="
echo "Installing APK with health monitoring..."
adb install -r TotalInstallerOtterSport.apk
adb shell am start -n com.ottersport.totalinstaller/.MainActivity
echo "Installation completed successfully!"