#!/usr/bin/env node

/**
 * TotalInstallerOtterSport Unified Launcher
 * Automatically detects platform and launches appropriate one-click installer
 */

const os = require('os');
const { exec } = require('child_process');
const path = require('path');

class UnifiedLauncher {
  constructor() {
    this.platform = this.detectPlatform();
    this.architecture = this.detectArchitecture();
  }
  
  detectPlatform() {
    const platform = os.platform();
    switch (platform) {
      case 'win32': return 'windows';
      case 'darwin': return 'macos';
      case 'linux': return 'linux';
      case 'android': return 'android';
      default: return 'unknown';
    }
  }
  
  detectArchitecture() {
    return os.arch();
  }
  
  async launch() {
    console.log('🚀 TotalInstallerOtterSport Unified Launcher');
    console.log('==========================================');
    console.log(`📱 Platform: ${this.platform}`);
    console.log(`⚙️ Architecture: ${this.architecture}`);
    console.log('🎯 Starting one-click installation...');
    
    switch (this.platform) {
      case 'windows':
        await this.launchWindows();
        break;
      case 'android':
        await this.launchAndroid();
        break;
      case 'macos':
        await this.launchMacOS();
        break;
      case 'linux':
        await this.launchLinux();
        break;
      default:
        console.log('❌ Unsupported platform');
        break;
    }
  }
  
  async launchWindows() {
    console.log('🖥️ Launching Windows one-click installer...');
    exec('TotalInstallerOtterSport-Setup.exe /S');
  }
  
  async launchAndroid() {
    console.log('📱 Launching Android one-click installer...');
    exec('adb install -r TotalInstallerOtterSport.apk');
  }
  
  async launchMacOS() {
    console.log('🍎 Launching macOS one-click installer...');
    exec('open TotalInstallerOtterSport.dmg');
  }
  
  async launchLinux() {
    console.log('🐧 Launching Linux one-click installer...');
    exec('chmod +x TotalInstallerOtterSport.AppImage && ./TotalInstallerOtterSport.AppImage');
  }
}

// Auto-launch if called directly
if (require.main === module) {
  const launcher = new UnifiedLauncher();
  launcher.launch().catch(console.error);
}

module.exports = UnifiedLauncher;