# OtterSport Uninstaller Documentation

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
2. Import `ottersport-uninstall-registry.reg` to add registry entries
3. OtterSport will appear in Windows Settings > Apps

## Manual Removal

If uninstallers fail, manually remove:

### Windows
- Installation: `%USERPROFILE%\OtterSport`
- User data: `%APPDATA%\OtterSport`
- Shortcuts: Desktop and Start Menu

### macOS
- Application: `/Applications/OtterSport.app`
- User data: `~/Library/Application Support/OtterSport`
- Preferences: `~/Library/Preferences/com.ottersport.app.plist`

### Linux
- Installation: `~/OtterSport` or `/opt/OtterSport`
- Configuration: `~/.config/OtterSport`
- Data: `~/.local/share/OtterSport`
