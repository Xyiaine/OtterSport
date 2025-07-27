# 🪟 OtterSport Windows Local Installation Guide

**Complete Windows installation system with two installer options**

## 📦 Installation Options

### Option 1: Complete Installer (Recommended)
**File:** `OtterSport-Windows-Installer.bat`

**Features:**
- ✅ Automatically installs Node.js if missing
- ✅ Downloads and installs Git for development tools
- ✅ Creates desktop and Start Menu shortcuts
- ✅ Registers with Windows Add/Remove Programs
- ✅ Includes uninstaller for clean removal
- ✅ Runs health checks and optimization
- ✅ Professional installation experience

**Best for:** New users, complete setup, production-ready installation

### Option 2: Simple Installer (Quick Setup)
**File:** `OtterSport-Simple-Installer.bat`

**Features:**
- ✅ Fast installation (2-3 minutes)
- ✅ Requires Node.js pre-installed
- ✅ Creates desktop shortcut
- ✅ Minimal dependencies
- ✅ Developer-friendly

**Best for:** Developers, quick testing, minimal installation

## 🚀 Quick Start Instructions

### For New Users (Complete Installation)
1. **Download** the OtterSport project folder
2. **Right-click** on `OtterSport-Windows-Installer.bat`
3. **Select** "Run as administrator" (recommended)
4. **Follow** the installation prompts
5. **Launch** from desktop shortcut when complete

### For Developers (Simple Installation)
1. **Ensure** Node.js is installed (`node --version`)
2. **Double-click** `OtterSport-Simple-Installer.bat`
3. **Wait** for automatic installation (2-3 minutes)
4. **Launch** from desktop shortcut

## 📋 System Requirements

### Minimum Requirements
- **OS:** Windows 10 or Windows 11
- **RAM:** 4GB (8GB recommended)
- **Storage:** 2GB free space
- **Network:** Internet connection for initial setup

### Software Dependencies (Auto-installed)
- **Node.js** v18+ (automatically installed if missing)
- **npm** package manager (included with Node.js)
- **Git** (optional, for updates)

## 🎯 What Gets Installed

### Application Files
```
%USERPROFILE%\OtterSport\
├── client/              # Frontend React application
├── server/              # Backend Express server
├── shared/              # Shared TypeScript types
├── game-assets/         # Graphics and UI assets
├── start-ottersport.bat # Launch script
├── uninstall-ottersport.bat # Removal script
└── node_modules/        # Dependencies
```

### Shortcuts Created
- **Desktop:** `OtterSport.lnk`
- **Start Menu:** `Programs > OtterSport`
- **Add/Remove Programs:** Registered for easy uninstall

### Registry Entries
- Application registration for Windows
- Uninstall information
- File associations (optional)

## 🎮 Using OtterSport

### Starting the Application
1. **Double-click** desktop shortcut, OR
2. **Start Menu** → Programs → OtterSport, OR  
3. **Manually run:** `%USERPROFILE%\OtterSport\start-ottersport.bat`

### Accessing the Interface
- **URL:** http://localhost:5000
- **Auto-opens** in your default browser
- **Offline capable** - no internet required after installation

### Key Features Available
- ✅ **Card-based fitness workouts** with difficulty adaptation
- ✅ **AI opponent battle mode** with strategic gameplay
- ✅ **Achievement system** with progress tracking
- ✅ **Workout analytics** and performance insights
- ✅ **Customizable exercise decks** for different fitness goals
- ✅ **Responsive design** works on all screen sizes

## 🛠️ Troubleshooting

### Installation Issues

**"Node.js not found" Error:**
```bash
# The complete installer will fix this automatically
# For simple installer, manually install Node.js:
# 1. Visit https://nodejs.org
# 2. Download LTS version
# 3. Run installer
# 4. Restart command prompt
```

**"Permission denied" Error:**
```bash
# Right-click installer and select "Run as administrator"
# OR disable antivirus temporarily during installation
```

**"Build failed" Error:**
```bash
# Navigate to installation directory:
cd %USERPROFILE%\OtterSport

# Clean install:
rmdir /s node_modules
npm install
npm run build
```

### Runtime Issues

**"Port 5000 already in use":**
```bash
# Kill existing processes:
taskkill /f /im node.exe /t

# Or change port in server/index.ts:
# const PORT = process.env.PORT || 5001;
```

**Application won't start:**
```bash
# Check Node.js installation:
node --version
npm --version

# Reinstall dependencies:
cd %USERPROFILE%\OtterSport
npm install
```

**Browser doesn't open automatically:**
```bash
# Manually open browser to:
http://localhost:5000
# Or:
http://127.0.0.1:5000
```

## 🗑️ Uninstalling OtterSport

### Method 1: Windows Add/Remove Programs
1. **Open** Settings → Apps
2. **Search** for "OtterSport"
3. **Click** Uninstall

### Method 2: Manual Uninstall
1. **Run** `%USERPROFILE%\OtterSport\uninstall-ottersport.bat`
2. **Confirm** removal when prompted

### Method 3: Complete Manual Removal
```bash
# Stop all processes:
taskkill /f /im node.exe /t

# Remove files:
rmdir /s /q "%USERPROFILE%\OtterSport"

# Remove shortcuts:
del "%USERPROFILE%\Desktop\OtterSport.lnk"
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\OtterSport.lnk"

# Remove registry entries:
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\OtterSport" /f
```

## 🔧 Advanced Configuration

### Custom Installation Directory
Edit the installer script and change:
```batch
set "INSTALL_DIR=%USERPROFILE%\OtterSport"
# To your preferred location:
set "INSTALL_DIR=C:\MyApps\OtterSport"
```

### Development Mode
For development with hot-reloading:
```bash
cd %USERPROFILE%\OtterSport
npm run dev
```

### Production Mode
For optimized production build:
```bash
cd %USERPROFILE%\OtterSport
npm run build
npm start
```

### Database Location
Data is stored locally in:
- **SQLite database:** `%USERPROFILE%\OtterSport\data\`
- **User uploads:** `%USERPROFILE%\OtterSport\uploads\`
- **Logs:** `%USERPROFILE%\OtterSport\logs\`

## 📞 Support

### Getting Help
1. **Check** this README for common solutions
2. **Review** log files in `%USERPROFILE%\OtterSport\logs\`
3. **Run** the health check: `node ULTIMATE_TOTAL_HEALTH_SYSTEM.cjs`
4. **Contact** support with error details

### Updating OtterSport
```bash
# Navigate to installation directory:
cd %USERPROFILE%\OtterSport

# Pull latest changes (if Git is available):
git pull

# Reinstall dependencies:
npm install

# Rebuild application:
npm run build
```

## 📝 Installation Log

The installer creates detailed logs at:
- **Installation log:** `%USERPROFILE%\OtterSport\install.log`
- **Application logs:** `%USERPROFILE%\OtterSport\logs\`
- **Error logs:** `%USERPROFILE%\OtterSport\errors.log`

## 🎉 Success!

Once installed, you'll have a complete local fitness application featuring:
- Professional card-based workout system
- AI-powered adaptive difficulty
- Strategic card battle gameplay
- Comprehensive progress tracking
- Beautiful, responsive interface
- Offline-capable operation

**Enjoy your fitness journey with OtterSport!**

---

*Installation system created by merging all existing installer capabilities into unified Windows solution*