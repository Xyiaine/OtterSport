#!/bin/bash

##############################################################################
# OtterSport Linux Uninstaller
# Complete removal tool for OtterSport on Linux
##############################################################################

echo "========================================================="
echo "  OTTERSPORT - LINUX UNINSTALLER"
echo "========================================================="
echo

# Confirmation
read -p "This will completely remove OtterSport from your system. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo "Removing OtterSport..."

# Stop processes
pkill -f "OtterSport" 2>/dev/null
pkill -f "node.*ottersport" 2>/dev/null

# Remove application files
if [ -d "$HOME/OtterSport" ]; then
    rm -rf "$HOME/OtterSport"
    echo "✓ Application files removed"
fi

if [ -d "/opt/OtterSport" ]; then
    sudo rm -rf "/opt/OtterSport"
    echo "✓ System application files removed"
fi

# Remove user data
if [ -d "$HOME/.config/OtterSport" ]; then
    rm -rf "$HOME/.config/OtterSport"
    echo "✓ Configuration files removed"
fi

if [ -d "$HOME/.local/share/OtterSport" ]; then
    rm -rf "$HOME/.local/share/OtterSport"
    echo "✓ User data removed"
fi

# Remove desktop files
if [ -f "$HOME/.local/share/applications/ottersport.desktop" ]; then
    rm "$HOME/.local/share/applications/ottersport.desktop"
    echo "✓ Desktop entry removed"
fi

if [ -f "/usr/share/applications/ottersport.desktop" ]; then
    sudo rm "/usr/share/applications/ottersport.desktop"
    echo "✓ System desktop entry removed"
fi

# Remove icons
if [ -d "$HOME/.local/share/icons/hicolor/*/apps/ottersport.*" ]; then
    rm -f $HOME/.local/share/icons/hicolor/*/apps/ottersport.*
    echo "✓ User icons removed"
fi

if [ -d "/usr/share/icons/hicolor/*/apps/ottersport.*" ]; then
    sudo rm -f /usr/share/icons/hicolor/*/apps/ottersport.*
    echo "✓ System icons removed"
fi

# Update desktop database
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$HOME/.local/share/applications" 2>/dev/null
fi

echo
echo "✓ OtterSport has been successfully removed from your Linux system"
echo "Thank you for using OtterSport!"
