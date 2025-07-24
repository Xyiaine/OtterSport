# OtterSport Desktop Installer

This document explains how to create a .exe installer for the OtterSport fitness application.

## Overview

The desktop version of OtterSport packages the web application into a native desktop app using Electron, allowing users to install and run it locally on their computers without needing a browser.

## Prerequisites

Before building the installer, ensure you have:

1. **Node.js** (version 16 or higher)
2. **npm** package manager
3. **Windows** (for building .exe installers)

## Building the Desktop Application

### Step 1: Install Dependencies

The required Electron packages are already installed:
- `electron` - Framework for building desktop apps
- `electron-builder` - Tool for creating installers
- `concurrently` - Run multiple npm scripts simultaneously

### Step 2: Build the Application

Run one of these commands depending on your target platform:

```bash
# Build installer for Windows (.exe)
npm run build-desktop-win

# Build installer for all platforms
npm run build-desktop

# Build only the desktop app (without installer)
npm run dist-win
```

### Step 3: Find Your Installer

After building, you'll find the installer files in the `dist-installer/` directory:

- **Windows**: `OtterSport Setup 1.0.0.exe`
- **macOS**: `OtterSport-1.0.0.dmg`
- **Linux**: `OtterSport-1.0.0.AppImage` and `OtterSport_1.0.0_amd64.deb`

## Installation Process

### For End Users (Windows)

1. **Download** the `OtterSport Setup 1.0.0.exe` file
2. **Run** the installer as administrator
3. **Follow** the installation wizard:
   - Choose installation directory
   - Create desktop shortcut
   - Create start menu entries
4. **Launch** OtterSport from desktop or start menu

### First-Time Setup

When OtterSport launches for the first time:

1. The app automatically starts a local server on port 5000
2. Opens the web interface in an Electron window
3. Creates a local data directory in `%APPDATA%\OtterSport`
4. Seeds the database with default exercises and decks

## Features

### Desktop Integration

- **Native menus** with keyboard shortcuts
- **System tray** integration (optional)
- **File associations** for .otter workout files
- **Auto-updater** support (configurable)
- **Offline support** with local database

### Security Features

- **Code signing** (when configured)
- **Sandboxed** web content
- **Secure** localhost-only server
- **Data encryption** for user files

### Performance Benefits

- **Faster startup** than web version
- **Better resource management**
- **Native notifications**
- **System integration**

## Customization Options

### App Configuration

Edit `installer-config.js` to modify:

```javascript
{
  appId: "com.ottersport.app",           // App identifier
  productName: "OtterSport",             // Display name
  publisherName: "OtterSport Team",      // Publisher
  directories: {
    output: "dist-installer"             // Output directory
  }
}
```

### Installer Customization

Modify `installer-script.nsh` for Windows-specific behavior:

- **Custom welcome messages**
- **License agreements**
- **Component selection**
- **Registry modifications**
- **File associations**

### Icon and Branding

Replace these files with your custom assets:

- `game-assets/interface/logo.png` - App icon
- `game-assets/interface/background.jpg` - Splash screen
- Installer graphics in `installer-assets/` (create this folder)

## Advanced Features

### Auto-Updates

Enable automatic updates by configuring:

```javascript
// In electron-main.js
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

### Database Migration

The installer handles database migration automatically:

1. **Detects** existing installations
2. **Backs up** user data
3. **Migrates** to new schema
4. **Preserves** workout history

### Command Line Options

Support command line arguments:

```bash
OtterSport.exe --workout-mode=battle
OtterSport.exe --dev-tools=true
OtterSport.exe --data-dir="C:\Custom\Path"
```

## Troubleshooting

### Common Issues

**Build Fails**: Ensure all dependencies are installed
```bash
npm install
npm audit fix
```

**Permission Errors**: Run as administrator on Windows
```bash
# Use PowerShell as Administrator
npm run build-desktop-win
```

**Missing Icons**: Verify icon files exist in `game-assets/interface/`

**Server Won't Start**: Check if port 5000 is available
```bash
netstat -an | findstr :5000
```

### Debug Mode

Enable debugging during development:

```bash
# Run in development mode
npm run electron-dev

# Enable DevTools
export ELECTRON_ENABLE_DEVTOOLS=true
npm run electron
```

### Logs and Diagnostics

Application logs are stored in:
- **Windows**: `%APPDATA%\OtterSport\logs\`
- **macOS**: `~/Library/Application Support/OtterSport/logs/`
- **Linux**: `~/.config/OtterSport/logs/`

## Distribution

### Code Signing (Recommended)

For trusted installation, sign your executables:

```javascript
// In installer-config.js
win: {
  certificateFile: "path/to/certificate.p12",
  certificatePassword: process.env.CSC_KEY_PASSWORD,
  publisherName: "OtterSport Team"
}
```

### Publishing

Upload installers to:
- **GitHub Releases**
- **Microsoft Store** (with app package)
- **Company website**
- **Software distribution platforms**

## Support

For installation support:
- Check the troubleshooting section above
- Review system requirements
- Contact support with log files
- Visit the project repository for updates

---

**Note**: This installer creates a standalone desktop application that includes both the frontend and backend components of OtterSport, allowing users to run the complete fitness application offline.