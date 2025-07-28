#!/bin/bash

##############################################################################
# OtterSport macOS Uninstaller
# Complete removal tool for OtterSport on macOS
##############################################################################

echo "========================================================="
echo "  OTTERSPORT - macOS UNINSTALLER"
echo "========================================================="
echo

# Confirmation
read -p "This will completely remove OtterSport from your Mac. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo "Removing OtterSport..."

# Stop processes
pkill -f "OtterSport" 2>/dev/null
pkill -f "node.*ottersport" 2>/dev/null

# Remove application bundle
if [ -d "/Applications/OtterSport.app" ]; then
    rm -rf "/Applications/OtterSport.app"
    echo "✓ Application bundle removed"
fi

# Remove user data
if [ -d "$HOME/Library/Application Support/OtterSport" ]; then
    rm -rf "$HOME/Library/Application Support/OtterSport"
    echo "✓ User data removed"
fi

# Remove preferences
if [ -f "$HOME/Library/Preferences/com.ottersport.app.plist" ]; then
    rm "$HOME/Library/Preferences/com.ottersport.app.plist"
    echo "✓ Preferences removed"
fi

# Remove logs
if [ -d "$HOME/Library/Logs/OtterSport" ]; then
    rm -rf "$HOME/Library/Logs/OtterSport"
    echo "✓ Log files removed"
fi

# Remove caches
if [ -d "$HOME/Library/Caches/com.ottersport.app" ]; then
    rm -rf "$HOME/Library/Caches/com.ottersport.app"
    echo "✓ Cache files removed"
fi

echo
echo "✓ OtterSport has been successfully removed from your Mac"
echo "Thank you for using OtterSport!"
