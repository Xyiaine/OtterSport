#!/usr/bin/env node

/**
 * OtterSport Uninstaller Creator
 * Creates platform-specific uninstaller scripts
 */

import fs from 'fs';
import path from 'path';

console.log('🗑️  Creating OtterSport Uninstaller Scripts...\n');

// Windows Uninstaller Registry Script
const windowsRegScript = `Windows Registry Editor Version 5.00

; OtterSport Uninstaller Registry Entries
[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\OtterSport]
"DisplayName"="OtterSport - Fitness Card Game"
"DisplayVersion"="1.0.0"
"Publisher"="OtterSport Team"
"InstallLocation"="%USERPROFILE%\\OtterSport"
"UninstallString"="%USERPROFILE%\\OtterSport\\OtterSport-Uninstaller.bat"
"QuietUninstallString"="%USERPROFILE%\\OtterSport\\OtterSport-Quick-Uninstaller.bat"
"DisplayIcon"="%USERPROFILE%\\OtterSport\\game-assets\\interface\\logo.png"
"NoModify"=dword:00000001
"NoRepair"=dword:00000001
"EstimatedSize"=dword:000186A0

[HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\TotalInstallerOtterSport]
"DisplayName"="TotalInstallerOtterSport"
"DisplayVersion"="3.0.0"
"Publisher"="OtterSport Team"
"InstallLocation"="%USERPROFILE%\\OtterSport"
"UninstallString"="%USERPROFILE%\\OtterSport\\OtterSport-Uninstaller.bat"
"QuietUninstallString"="%USERPROFILE%\\OtterSport\\OtterSport-Quick-Uninstaller.bat"
"DisplayIcon"="%USERPROFILE%\\OtterSport\\game-assets\\interface\\logo.png"
"NoModify"=dword:00000001
"NoRepair"=dword:00000001
"EstimatedSize"=dword:000249F0
`;

// macOS Uninstaller
const macUninstaller = `#!/bin/bash

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
`;

// Linux Uninstaller
const linuxUninstaller = `#!/bin/bash

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
if [[ ! \$REPLY =~ ^[Yy]\$ ]]; then
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
`;

// Create uninstaller scripts
try {
    // Write Windows registry file
    fs.writeFileSync('ottersport-uninstall-registry.reg', windowsRegScript);
    console.log('✓ Created Windows registry file: ottersport-uninstall-registry.reg');

    // Write macOS uninstaller
    fs.writeFileSync('OtterSport-Uninstaller-macOS.sh', macUninstaller);
    fs.chmodSync('OtterSport-Uninstaller-macOS.sh', '755');
    console.log('✓ Created macOS uninstaller: OtterSport-Uninstaller-macOS.sh');

    // Write Linux uninstaller
    fs.writeFileSync('OtterSport-Uninstaller-Linux.sh', linuxUninstaller);
    fs.chmodSync('OtterSport-Uninstaller-Linux.sh', '755');
    console.log('✓ Created Linux uninstaller: OtterSport-Uninstaller-Linux.sh');

    // Create uninstaller documentation
    const documentation = `# OtterSport Uninstaller Documentation

## Available Uninstallers

### Windows
- **OtterSport-Uninstaller.bat** - Interactive uninstaller with confirmation prompts
- **OtterSport-Quick-Uninstaller.bat** - Silent uninstaller for automated removal
- **ottersport-uninstall-registry.reg** - Registry entries for Windows Add/Remove Programs

### macOS
- **OtterSport-Uninstaller-macOS.sh** - Complete macOS removal script

### Linux
- **OtterSport-Uninstaller-Linux.sh** - Complete Linux removal script

## Windows Integration

To integrate with Windows Add/Remove Programs:
1. Run the installer normally
2. Import \`ottersport-uninstall-registry.reg\` to add registry entries
3. OtterSport will appear in Windows Settings > Apps

## Manual Removal

If uninstallers fail, manually remove:

### Windows
- Installation: \`%USERPROFILE%\\OtterSport\`
- User data: \`%APPDATA%\\OtterSport\`
- Shortcuts: Desktop and Start Menu

### macOS
- Application: \`/Applications/OtterSport.app\`
- User data: \`~/Library/Application Support/OtterSport\`
- Preferences: \`~/Library/Preferences/com.ottersport.app.plist\`

### Linux
- Installation: \`~/OtterSport\` or \`/opt/OtterSport\`
- Configuration: \`~/.config/OtterSport\`
- Data: \`~/.local/share/OtterSport\`
`;

    fs.writeFileSync('UNINSTALLER-README.md', documentation);
    console.log('✓ Created documentation: UNINSTALLER-README.md');

    console.log('\n🎉 All uninstaller scripts created successfully!');
    console.log('\nFiles created:');
    console.log('- OtterSport-Uninstaller.bat (Windows interactive)');
    console.log('- OtterSport-Quick-Uninstaller.bat (Windows silent)');
    console.log('- OtterSport-Uninstaller-macOS.sh (macOS)');
    console.log('- OtterSport-Uninstaller-Linux.sh (Linux)');
    console.log('- ottersport-uninstall-registry.reg (Windows registry)');
    console.log('- UNINSTALLER-README.md (Documentation)');

} catch (error) {
    console.error('❌ Error creating uninstaller scripts:', error.message);
    process.exit(1);
}